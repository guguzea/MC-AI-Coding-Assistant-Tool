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
import { parseJsonUtf8 } from "../utils/json-utf8.js";

/**
 * 入站消息唯一契约（D-51）：生产者 src/api/index.ts 发的是 `{ type:"start", timeout, dataDir }`。
 * 旧代码把它拆成 PreloadConfig（有 timeout 无 dataDir）+ PreloadMessage（有 dataDir 无 timeout）两份，
 * 没有一份对得上真实消息，处理函数只能靠两次 `"x" in data` 试探。现合并为一份。
 * 共享文件 src/workers/types.ts 里同名的死类型 WorkerMessage 已一并删除（零 importer）。
 */
interface PreloadMessage {
  type: "start";
  /** 可选：覆盖数据目录（用于按 Minecraft 版本加载不同 extracted） */
  dataDir?: string;
  /** 预加载超时（ms），缺省 15000 */
  timeout?: number;
}

interface PreloadResult {
  type: "ready";
  /** apiIndex: 直接传解析后的对象（v8 序列化，效率高）。主线程直接使用，无需 JSON.parse */
  apiIndex: Record<string, unknown>;
  classNames: string[];
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

/**
 * D-50：预加载进行中新到的 start 不再被静默丢弃，回一条 ack 说明它已排队。
 * 与 src/workers/types.ts 的 PreloadQueuedMessage 保持一致（主线程目前忽略未识别类型，不会因此改变行为）。
 */
interface PreloadQueued {
  type: "queued";
  /** 当前排队的 start 请求数（只保留最新一份，故恒为 1） */
  pending: number;
  elapsedSinceStart: number;
}

type WorkerOutMessage = PreloadResult | PreloadError | PreloadQueued;

// ── 数据目录解析（3 策略，按可靠性从高到低）──────────────────────────────

function resolveDataDir(): string {
  // 策略 1：workerData.dataDir（主线程通过 new Worker(path, { workerData: { dataDir } }) 必传，
  // 与主线程 utils/path.ts 的 resolveDataDir 同源——禁止在本文件再猜具体版本目录）
  const wdMsg = (workerData as { dataDir?: string } | null)?.dataDir;
  if (wdMsg && existsSync(wdMsg)) return wdMsg;

  // 策略 2/3：env 或 cwd/data 仅在根下直接有 api-index.json 时才可信；
  // 不再写死 forge_1.20.1 之类的版本回退（版本目录改名会静默指向错误布局）
  const env = process.env.MC_SKILL_DATA;
  if (env && existsSync(join(env, "api-index.json"))) return env;
  const cwdData = join(process.cwd(), "data");
  if (existsSync(join(cwdData, "api-index.json"))) return cwdData;

  // 都未命中：返回最可能的候选，让读取阶段失败并走显式 error 通道（懒加载兜底）
  return wdMsg ?? env ?? cwdData;
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

/** 每片处理的类名数：到点核对 deadline 并让出事件循环（D-50） */
const TRIE_SHARD = 4096;

/**
 * D-50：分片 + 时限构建。旧实现是一次性同步跑完，而 deadline 只在「跑之前」和「跑完之后」
 * 各看一次 —— 中间无插桩，buildTrieIndex 自己就能把预算花光，阶段二只能把算完的结果丢掉（纯浪费），
 * 且整段构建期间 worker 无法处理任何 postMessage。
 * 现在每 TRIE_SHARD 个类名让出一次并核对 deadline：超时立即返回 null（绝不返回半成品 Trie，
 * 调用方据此降级线性扫描），完成时刻已过 deadline 同样返回 null（与旧阶段二判定一致）。
 */
async function buildTrieIndex(classNames: string[], deadline: number): Promise<TrieNodeFlat[] | null> {
  const flat: TrieNodeFlat[] = [{ children: [], isEnd: false }];

  for (let i = 0; i < classNames.length; i++) {
    if (i > 0 && i % TRIE_SHARD === 0) {
      if (Date.now() >= deadline) return null;
      await new Promise<void>((resolve) => setImmediate(resolve));
    }
    const name = classNames[i];
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

  return Date.now() >= deadline ? null : flat;
}

// ── 主预加载函数 ─────────────────────────────────────────────────────────

async function preload(timeoutMs = 15000): Promise<void> {
  const startedAt = Date.now();
  const deadline = startedAt + timeoutMs;

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
        const parsed = parseJsonUtf8(raw);
        results[f.key] = f.key === "classNames" ? (parsed as string[]) : parsed;
      } catch {
        results[f.key] = null;
      }
    })
  );

  if (!results.apiIndex || !results.classNames) {
    // 数据缺失走显式 error 通道（主线程会降级 lazyLoad 并记录 lastError），
    // 禁止把 null 归一成 {}/[] 冒充「空索引成功」
    parentPort?.postMessage({
      type: "error",
      errors: [
        `预加载失败：${dataDir} 下缺少 api-index.json / class-names.json（该版本数据不完整或目录布局不符）`,
      ],
    } satisfies WorkerOutMessage);
    return;
  }

  // 阶段一检查（粗筛）：读取已耗超过一半超时 → 跳过 Trie
  const elapsedRead = Date.now() - (deadline - timeoutMs);
  const skipTrieStage1 = elapsedRead > timeoutMs * 0.5;

  const classNames = results.classNames as string[];
  const pastDeadline = Date.now() >= deadline;
  const trieFlat = skipTrieStage1 || pastDeadline ? null : await buildTrieIndex(classNames, deadline);

  // 阶段二检查（精确兜底）：buildTrieIndex 耗时可能很长，在 postMessage 前再次检查
  const skipTrie = skipTrieStage1 || Date.now() >= deadline;

  sendResult(
    results.apiIndex as Record<string, unknown>,
    classNames,
    skipTrie,
    skipTrie ? null : trieFlat,
    Date.now() - startedAt,
  );
}

function sendResult(
  apiIndex: Record<string, unknown>,
  classNames: string[],
  trieSkipped: boolean,
  trieFlat: TrieNodeFlat[] | null,
  elapsedMs: number,
): void {
  parentPort?.postMessage({
    type: "ready",
    apiIndex,
    classNames,
    trieFlat: trieSkipped ? null : trieFlat,
    trieSkipped,
    elapsed: elapsedMs,
    classCount: classNames.length,
  } satisfies WorkerOutMessage);
}

let preloadRunning = false;
/** D-50：running 期间到的 start 不再静默丢弃，只保留最新一份，当前预加载结束后 drain */
let pendingStart: PreloadMessage | null = null;
let runningSince = 0;

function startPreload(msg: PreloadMessage): void {
  preloadRunning = true;
  runningSince = Date.now();
  const timeoutMs = msg.timeout ?? 15000;
  setDataDir(msg.dataDir);
  preload(timeoutMs)
    .catch((err) => {
      parentPort?.postMessage({
        type: "error",
        errors: [(err as Error).message],
      } satisfies WorkerOutMessage);
    })
    .finally(() => {
      preloadRunning = false;
      const next = pendingStart;
      pendingStart = null;
      if (next) startPreload(next);
    });
}

parentPort?.on("message", (e: MessageEvent<PreloadMessage> | PreloadMessage) => {
  const data = ("data" in e ? e.data : e) as PreloadMessage;
  if (data.type === "start") {
    if (preloadRunning) {
      pendingStart = data;
      parentPort?.postMessage({
        type: "queued",
        pending: 1,
        elapsedSinceStart: Date.now() - runningSince,
      } satisfies WorkerOutMessage);
      return;
    }
    startPreload(data);
  }
});
