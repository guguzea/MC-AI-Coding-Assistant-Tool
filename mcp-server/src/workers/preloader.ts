/**
 * Data Preloader — Worker Thread Entry Point
 *
 * 在独立 Worker Thread 中并行解析 JSON 文件并构建 Trie 索引，
 * 避免阻塞主线程。完成后通过 postMessage 将数据发回主线程。
 */

import { existsSync } from "fs";
import { readFile } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { workerData, parentPort } from "worker_threads";

interface PreloadMessage {
  type: "start";
}

interface PreloadResult {
  type: "ready";
  _apiIndexStr: string;
  classNames: string[];
  l0Index: unknown;
  trieFlat: unknown;
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
  // 策略 1：从 import.meta.url 推导（最可靠，不受 cwd 影响）
  const selfDir = dirname(fileURLToPath(import.meta.url));
  // dist/workers/ → mcp-server/ → mc_skill/  (data 在 mc_skill/data/forge_1.20.1/)
  const fromFile = join(selfDir, "..", "..", "..", "data", "forge_1.20.1");
  if (existsSync(fromFile)) return fromFile;

  // 策略 2：Worker data（主线程显式传入）
  const wd = (workerData as { dataDir?: string } | null)?.dataDir;
  if (wd && existsSync(wd)) return wd;

  // 策略 3：process.cwd() 回退（仅作最后手段）
  const cwd = join(process.cwd(), "data", "forge_1.20.1");
  return cwd;
}

const dataDir: string = resolveDataDir();

// ── Trie 实现（Worker 中构建，结果通过结构化克隆传递）───────────────────────

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

// ── 并行加载所有数据文件 ────────────────────────────────────────────────

async function preload(): Promise<void> {
  const start = Date.now();

  const files = [
    { key: "apiIndex", path: "extracted/api-index.json" },
    { key: "classNames", path: "extracted/class-names.json" },
    { key: "l0Index", path: "forge-docs/1.20.1/index-l0.json" },
  ];

  const results: Record<string, unknown> = {};

  // 并行读取 + JSON.parse（CPU 密集操作在 Worker 中完成，不阻塞主线程）
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
    parentPort?.postMessage({
      type: "error",
      errors: [
        `Failed to load critical data: apiIndex=${results.apiIndex !== null}, classNames=${results.classNames !== null}`,
        `dataDir=${dataDir}`,
      ],
    } satisfies WorkerOutMessage);
    return;
  }

  const classNames = results.classNames as string[];
  const trieFlat = buildTrieIndex(classNames);

  parentPort?.postMessage({
    type: "ready",
    _apiIndexStr: JSON.stringify(results.apiIndex),
    classNames,
    l0Index: results.l0Index,
    trieFlat,
    elapsed: Date.now() - start,
    classCount: classNames.length,
  } satisfies WorkerOutMessage);
}

parentPort?.on("message", (e: MessageEvent<PreloadMessage> | PreloadMessage) => {
  const data = "data" in e ? e.data : e;
  if (data.type === "start") {
    preload().catch((err) => {
      parentPort?.postMessage({
        type: "error",
        errors: [(err as Error).message],
      } satisfies WorkerOutMessage);
    });
  }
});
