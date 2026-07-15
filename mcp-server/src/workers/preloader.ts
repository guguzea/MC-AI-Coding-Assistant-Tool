/**
 * Data Preloader — Worker Thread Entry Point
 *
 * 在独立 Worker Thread 中并行解析 JSON 文件并构建 Trie 索引，
 * 避免阻塞主线程。完成后通过 postMessage 将数据发回主线程。
 *
 * 关键设计决策：
 * 1. apiIndex 直接传解析后的对象（v8 内部序列化，效率远高于 JSON.stringify + JSON.parse）
 *    注意：Worker 线程不能访问主线程的对象，只能通过 postMessage 克隆（结构化克隆 / v8.serialize）
 * 2. Trie 构建分两阶段检查：读取完成后检查一次（粗筛），postMessage 前再检查一次（精确兜底）
 * 3. 用绝对 deadline 而非相对 elapsed，覆盖 read + build 全部阶段
 */

import { existsSync } from "fs";
import { readFile } from "fs/promises";
import { join } from "path";
import { workerData, parentPort } from "worker_threads";

interface PreloadConfig {
  type: "start";
  timeout?: number;
}

interface PreloadMessage {
  type: "start";
  /** 可选：覆盖数据目录（用于按 Minecraft 版本加载不同 extracted） */
  dataDir?: string;
}

interface PreloadResult {
  type: "ready";
  /** apiIndex: 直接传解析后的对象（v8 序列化，效率高）。主线程直接使用，无需 JSON.parse */
  apiIndex: Record<string, unknown>;
  classNames: string[];
  l0Index: unknown;
  /** Trie 扁平数组，仅在剩余时间充足时构建；超时时为 null，改用线性扫描 */
  trieFlat: unknown;
  trieSkipped: boolean;
  elapsed: number;
  classCount: number;
}

interface PreloadError {
  type: "error";
  errors: string[];
}

type WorkerOutMessage = PreloadResult | PreloadError;

// ── 数据目录解析（4 策略，按可靠性从高到低）──────────────────────────────

function resolveDataDir(): string {
  // 策略 1：workerData.dataDir（主线程通过 new Worker(path, { workerData: { dataDir } }) 传入）
  const wdMsg = (workerData as { dataDir?: string } | null)?.dataDir;
  if (wdMsg && existsSync(wdMsg)) return wdMsg;

  // 策略 2：MC_SKILL_DATA（与主进程 path.ts 一致：指向 data/ 根）
  const env = process.env.MC_SKILL_DATA;
  if (env && existsSync(env)) {
    const extracted = join(env, "forge_1.20.1", "extracted");
    if (existsSync(extracted)) return extracted;
    return env;
  }

  // 策略 3：cwd/data/forge_1.20.1/extracted
  const cwdExtracted = join(process.cwd(), "data", "forge_1.20.1", "extracted");
  if (existsSync(cwdExtracted)) return cwdExtracted;
  return join(process.cwd(), "data", "forge_1.20.1");
}

let dataDir: string = resolveDataDir();

/** 接收主线程通过 postMessage 传来的 dataDir 后可调用此函数覆盖。 */
function setDataDir(d: string | undefined) {
  if (d && existsSync(d)) dataDir = d;
}

// ── Trie 实现（Worker 中构建，结果通过 postMessage 传递）──────────────────

interface TrieNodeFlat {
  children: [string, number][]; // [partName, childIndex]
  isEnd: boolean;
}

function buildTrieIndex(classNames: string[]): TrieNodeFlat[] {
  const flat: TrieNodeFlat[] = [{ children: [], isEnd: false }];

  for (const name of classNames) {
    const parts = name.toLowerCase().split("/");
    let nodeIdx = 0;
    for (const part of parts) {
      const node = flat[nodeIdx];
      const existing = node.children.find(([k]) => k === part);
      if (existing) {
        nodeIdx = existing[1];
      } else {
        const newIdx = flat.length;
        node.children.push([part, newIdx]);
        flat.push({ children: [], isEnd: false });
        nodeIdx = newIdx;
      }
    }
    flat[nodeIdx].isEnd = true;
  }

  return flat;
}

// ── 主预加载函数 ─────────────────────────────────────────────────────────

async function preload(timeoutMs = 15000): Promise<void> {
  // 用绝对截止时间（deadline）而非相对 elapsed，覆盖 read + build + send 全部阶段
  const deadline = Date.now() + timeoutMs;

  const files = [
    { key: "apiIndex", path: "api-index.json", critical: true },
    { key: "classNames", path: "class-names.json", critical: true },
  ];

  const results: Record<string, unknown> = {};

  // 读取阶段（可并行，CPU 密集解析在 Worker 中完成，不阻塞主线程）
  await Promise.all(
    files.map(async (f) => {
      try {
        const raw = await readFile(join(dataDir, f.path), "utf-8");
        const parsed = JSON.parse(raw);
        results[f.key] = f.key === "classNames" ? (parsed as string[]) : parsed;
      } catch {
        results[f.key] = null;
      }
    })
  );

  if (!results.apiIndex || !results.classNames) {
    // 即使文件缺失也不阻塞，在 postMessage 前检查 deadline
    const skipTrie = true;
    sendResult(
      null,
      results.classNames as string[] | null,
      skipTrie,
      Date.now()
    );
    return;
  }

  // 阶段一检查（粗筛）：读取阶段已耗时间
  const elapsedRead = Date.now() - (deadline - timeoutMs);
  const remainingAfterRead = deadline - Date.now();
  // 读取阶段已消耗超过一半超时时间 → 跳过 Trie（留给后续处理的时间不够）
  const skipTrieStage1 = remainingAfterRead < timeoutMs * 0.5;

  const classNames = results.classNames as string[];
  const trieFlat = skipTrieStage1 ? null : buildTrieIndex(classNames);

  // 阶段二检查（精确兜底）：buildTrieIndex 耗时可能很长，在 postMessage 前再次检查
  const skipTrie = skipTrieStage1 || Date.now() >= deadline;

  sendResult(
    results.apiIndex as Record<string, unknown>,
    classNames,
    skipTrie,
    Date.now()
  );
}

function sendResult(
  apiIndex: Record<string, unknown> | null,
  classNames: string[] | null,
  trieSkipped: boolean,
  _sentAt: number
): void {
  const now = Date.now();
  parentPort?.postMessage({
    type: "ready",
    // 直接传解析后的对象，由 v8 序列化（比 JSON.stringify → JSON.parse 快一个数量级）
    apiIndex: apiIndex ?? {},
    classNames: classNames ?? [],
    l0Index: undefined, // 兼容旧 WorkerOutMessage 消费者（外部搜索预加载仍可用）
    trieFlat: trieSkipped ? null : undefined,
    trieSkipped,
    elapsed: now,
    classCount: classNames?.length ?? 0,
  } satisfies WorkerOutMessage);
}

parentPort?.on("message", (e: MessageEvent<PreloadConfig | PreloadMessage> | PreloadConfig | PreloadMessage) => {
  const data = "data" in e ? e.data : e;
  if (data.type === "start") {
    const timeoutMs = typeof data === "object" && "timeout" in data ? (data as PreloadConfig).timeout ?? 15000 : 15000;
    if (typeof data === "object" && "dataDir" in data) {
      setDataDir((data as PreloadMessage).dataDir);
    }
    preload(timeoutMs).catch((err) => {
      parentPort?.postMessage({
        type: "error",
        errors: [(err as Error).message],
      } satisfies WorkerOutMessage);
    });
  }
});
