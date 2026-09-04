/**
 * API 精确查询模块 — 基于真实数据
 *
 * 数据来源（按 Minecraft 版本）：
 * - 1.7.10–1.13.2: 类名空壳（methods 几乎全空）+  MCP stable 映射（1.13.2）+ ForgeJavaDocs 文档树；不要把 query_api found:true 当完整签名
 * - 1.14.4–1.15.2: MCP stable CSV 映射+ api-index 为空 {}（Parchment 约从 1.16.5 才有）
 * - 1.16.5–1.20.4: Parchment 映射（带 javadoc）
 * - 1.21+ / 26.1+: 无 extracted 索引
 *
 * 性能优化：
 * - Worker Thread 预加载 JSON（避免主线程阻塞）
 * - v8 内部序列化传输大对象（比 JSON.stringify → JSON.parse 快 10x）
 * - Trie 索引加速模糊搜索（O(k) vs O(n)，k=前缀长度）；超时时自动跳过，改用线性扫描
 * - FIFO 版本缓存：插入序驱逐最旧项（不是 LRU）
 * - 15s 硬超时保护：Worker 超时则降级到惰性加载，保证调用永不卡死
 * - Per-version 缓存：每个 Minecraft 版本独立 apiIndex / classNames / trie
 */

import { Worker } from "worker_threads";
import { existsSync } from "fs";
import { readFile } from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import type { WorkerOutMessage } from "../workers/types.js";
import { resolveDataDir } from "../utils/path.js";
import { ownGet } from "../utils/own-record.js";
import { readableSignature, returnType as descriptorReturnType } from "../utils/descriptor.js";
import { ActionCodes, actionable, withAction, versionRequiredAction, missingMcVersion, type ActionEnvelope } from "../utils/actionable.js";
import { isUnobfuscatedMcVersion, UNOBFUSCATED_MAPPING_HINT } from "../mappings/unobfuscated.js";
import { parseJsonUtf8 } from "../utils/json-utf8.js";
import { isSafeVersionSegment } from "../utils/minecraft-version.js";
import { editDistanceLimited } from "../utils/edit-distance.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
export const DEFAULT_VERSION = "1.20.1";

// ── 类型定义 ───────────────────────────────────────────────────────────────

export interface ApiQuery {
  className: string;
  methodName?: string;
  version?: string;
}

export interface MethodInfo {
  name: string;
  parameters: string[];
  descriptor: string;
  returnType: string;
  /** Human-readable signature derived from JNI descriptor */
  readableSignature?: string;
  javadoc?: string;
  /** Present on mojang-supplement entries when Yarn name differs */
  yarnName?: string;
  source?: string;
}

export interface ApiResult {
  found: boolean;
  className: string;
  classJavadoc?: string;
  packagePath?: string;
  methodName?: string;
  methods?: MethodInfo[];
  mappings: Record<string, string>;
  suggestions?: string[];
  notes?: string[];
  warning?: string;
  action?: ActionEnvelope;
  /** 简名唯一命中时改写了 className */
  autoCorrected?: boolean;
  /** 调用方传入的原始类名（仅 autoCorrected 时） */
  requestedClassName?: string;
  truncated?: boolean;
}

export type ApiPreloadStatus =
  | "idle"
  | "loading"
  | "ready"
  | "lazy"
  | "missing_data"
  | "error";

export interface VersionPreloadStatus {
  version: string;
  status: ApiPreloadStatus;
  classCount: number;
  loaded: boolean;
  preloading: boolean;
  /** true when Worker skipped Trie build (timeout); queries use linear scan */
  trieSkipped: boolean;
}

// ── Trie 索引（Worker 中构建，通过消息传递）────────────────────────────────

/**
 * Trie 节点结构（Worker 中构建，通过 postMessage 结构化克隆传回）。
 * 主线程用 flat 数组重建索引。
 */

/**
 * A-26 递归上限（常量风格对齐 utils/node-sqlite-guard.ts：模块级 const + 就地注释）。
 * `_collect` 原先对 flat 数组的长度/深度零防御：flatArr 来自 Worker 消息或落盘缓存，
 * 一旦被截断/伪造（child 指标回指祖先形成环、或链路过深），递归会
 * `Maximum call stack size exceeded` 直接崩掉整个 tool 调用。
 * 深度上限按类名段数取（net/minecraft/world/item/ItemStack 这类远小于该值），
 * 节点上限约 5 万次访问 ≈ 单次前缀查询的实用上界。
 */
const TRIE_COLLECT_MAX_DEPTH = 64;
const TRIE_COLLECT_MAX_NODES = 50_000;
/** 超限时追加到结果里的显式标记（不静默返回半截结果）。 */
const TRIE_TRUNCATION_MARKER = "<truncated:trie-result-capped>";

export class TrieIndex {
  private flat: Array<{ children: [string, number][]; isEnd: boolean; score: number }> = [
    { children: [], isEnd: false, score: 0 },
  ];

  /**
   * 用 Worker 返回的扁平化数组重建索引。
   * Worker 发送的 flatArr 格式：[children Map[], isEnd[], score[]]
   */
  static fromFlat(
    flatArr: Array<{ children: [string, number][]; isEnd: boolean; score: number }>
  ): TrieIndex {
    const t = new TrieIndex();
    t.flat = flatArr;
    return t;
  }

  /** 节点号是否可用（越界/非整数视为索引损坏）。 */
  private validNode(idx: number): boolean {
    return Number.isInteger(idx) && idx >= 0 && idx < this.flat.length;
  }

  /**
   * 前缀搜索：返回所有以 prefix 开头的类名（用于模糊匹配加速）
   * 命中上限时末尾返回 TRIE_TRUNCATION_MARKER（调用方据此知道结果不完整）。
   */
  searchPrefix(prefix: string): string[] {
    const parts = prefix.toLowerCase().replace(/\./g, "/").split("/");
    let nodeIdx = 0;
    for (const part of parts) {
      if (!this.validNode(nodeIdx)) return [TRIE_TRUNCATION_MARKER];
      const childEntry = this.flat[nodeIdx].children.find(([k]) => k === part);
      if (!childEntry) return [];
      nodeIdx = childEntry[1];
    }
    if (!this.validNode(nodeIdx)) return [TRIE_TRUNCATION_MARKER];
    const results: string[] = [];
    this._collect(nodeIdx, parts.join("/"), results, { nodes: 0, depth: 0, truncated: false });
    return results;
  }

  private _collect(
    nodeIdx: number,
    prefix: string,
    results: string[],
    budget: { nodes: number; depth: number; truncated: boolean },
  ): void {
    if (budget.truncated) return;
    if (budget.depth > TRIE_COLLECT_MAX_DEPTH || budget.nodes >= TRIE_COLLECT_MAX_NODES) {
      budget.truncated = true;
      results.push(TRIE_TRUNCATION_MARKER);
      return;
    }
    if (!this.validNode(nodeIdx)) {
      budget.truncated = true;
      results.push(TRIE_TRUNCATION_MARKER);
      return;
    }
    budget.nodes += 1;
    const node = this.flat[nodeIdx];
    if (node.isEnd) results.push(prefix);
    budget.depth += 1;
    for (const [childName, childIdx] of node.children) {
      this._collect(childIdx, prefix + "/" + childName, results, budget);
      if (budget.truncated) break;
    }
    budget.depth -= 1;
  }
}

// ── 数据存储（按版本独立缓存）──────────────────────────────────────────────

/** 单个版本的数据快照（Worker 预加载后填充，或惰性加载填充） */
interface VersionData {
  apiIndex: Record<string, { javadoc: string | null; methods: MethodInfo[]; fields: string[] }>;
  classNames: string[];
  trieIndex: TrieIndex | null;
  /** 数据是否已加载（Worker 完成或惰性加载完成） */
  loaded: boolean;
  /** 该版本是否正在由 Worker 预加载中 */
  preloading: boolean;
  /** Worker 超时后改走主线程惰性读盘 */
  lazyMode: boolean;
  /** 数据目录缺失 */
  missingData: boolean;
  lastError?: string;
  /** Worker 因超时跳过 Trie 时为 true；此时 trieIndex 为 null，查询走线性扫描 */
  trieSkipped: boolean;
  /** 该版本正在进行的 Worker（若已结束则为 null） */
  worker: Worker | null;
  /** 该版本的 Worker preload 完成 Promise */
  preloadPromise: Promise<void> | null;
  /** Worker 超时定时器（settle 后清除） */
  preloadTimer?: ReturnType<typeof setTimeout> | null;
  /** terminate / dispose 时结算 awaiters */
  settlePreload?: (() => void) | null;
  /** trie 只存小写键；此表把小写类名还原成 class-names.json 里的原始大小写（惰性构建，绑定数组身份） */
  caseMap?: { names: string[]; map: Map<string, string> } | null;
}

const _versionData = new Map<string, VersionData>();
/** 版本数据缓存上限：FIFO 驱逐最旧插入项（Map 插入序，不是 LRU 访问序） */
const _MAX_VERSION_CACHE = 64;

function setVersionDataEntry(version: string, data: VersionData): void {
  if (!_versionData.has(version) && _versionData.size >= _MAX_VERSION_CACHE) {
    const oldest = _versionData.keys().next().value;
    const old = oldest !== undefined ? _versionData.get(oldest) : undefined;
    if (old) {
      if (old.preloadTimer) {
        clearTimeout(old.preloadTimer);
        old.preloadTimer = null;
      }
      try {
        old.settlePreload?.();
      } catch {
        /* settle 可能已完成 */
      }
      old.settlePreload = null;
      if (old.worker) {
        try {
          old.worker.terminate();
        } catch {
          /* 驱逐时 worker 可能已退出 */
        }
        old.worker = null;
      }
      old.preloadPromise = null;
    }
    if (oldest !== undefined) _versionData.delete(oldest);
  }
  _versionData.set(version, data);
}

/**
 * 测试接缝：经真实驱逐路径注入版本缓存条目。生产代码不得导入。
 * A-5 要求被驱逐条目必须清 timer / settle / terminate worker 并从 map 删除，
 * 而单测无法稳定造出 64 个在飞 Worker 预加载，只能直接注入条目形状。
 */
export const testOnlyVersionCache = {
  put: (
    version: string,
    data?: {
      preloadTimer?: ReturnType<typeof setTimeout> | null;
      settlePreload?: (() => void) | null;
      worker?: { terminate(): void } | null;
      preloadPromise?: Promise<void> | null;
    },
  ): void => {
    setVersionDataEntry(
      version,
      { ...emptyVersionData(), ...(data as object) } as VersionData,
    );
  },
};

function emptyVersionData(): VersionData {
  return {
    apiIndex: {},
    classNames: [],
    trieIndex: null,
    trieSkipped: false,
    loaded: false,
    preloading: false,
    lazyMode: false,
    missingData: false,
    worker: null,
    preloadPromise: null,
  };
}

/** 获取指定版本的数据；缺失时返回独立空壳（禁止共享 _defaultData，FIFO 驱逐后再查必须走磁盘加载） */
function getVersionData(version: string): VersionData {
  return _versionData.get(version) ?? emptyVersionData();
}

/** 解析某版本对应的 extracted 数据目录。找不到则返回 null。 */
function resolveVersionDataDir(version: string): string | null {
  if (!isSafeVersionSegment(version)) return null;
  const p = join(resolveDataDir(), `forge_${version}`, "extracted");
  return existsSync(p) ? p : null;
}

// ── Worker 预加载触发 ────────────────────────────────────────────────────

/**
 * 启动指定版本的 Worker 预加载（异步，不阻塞主线程）。
 * 第一次 queryApi 调用该版本时自动触发。
 *
 * 改进点：
 * 1. 硬超时保护：15s 内 Worker 未完成则终止并降级到惰性加载
 * 2. Worker→主线程传解析后对象而非 JSON 字符串：v8 序列化比 JSON 快一个数量级
 * 3. 双阶段 Trie 跳过检查：读取后粗筛 + postMessage 前精确兜底
 * 4. settled 标志防止超时回调和消息回调竞争
 */
function startPreloader(version: string): Promise<void> {
  const dataDir = resolveVersionDataDir(version);
  if (!dataDir) {
    const empty: VersionData = {
      apiIndex: {},
      classNames: [],
      trieIndex: null,
      trieSkipped: false,
      loaded: true,
      preloading: false,
      lazyMode: false,
      missingData: true,
      worker: null,
      preloadPromise: Promise.resolve(),
    };
    setVersionDataEntry(version, empty);
    return empty.preloadPromise!;
  }

  const existing = _versionData.get(version);
  if (existing?.preloadPromise) return existing.preloadPromise;

  const vData: VersionData = {
    apiIndex: {},
    classNames: [],
    trieIndex: null,
    trieSkipped: false,
    loaded: false,
    preloading: true,
    lazyMode: false,
    missingData: false,
    worker: null,
    preloadPromise: null,
  };
  setVersionDataEntry(version, vData);

  vData.preloadPromise = new Promise<void>((resolve) => {
    let settled = false;
    const timeoutMs = 15000;
    const logPrefix = `[MCP/Api:${version}]`;

    const settle = (after?: () => void | Promise<void>): void => {
      if (settled) return;
      settled = true;
      if (vData.preloadTimer) {
        clearTimeout(vData.preloadTimer);
        vData.preloadTimer = null;
      }
      vData.settlePreload = null;
      void Promise.resolve(after?.()).finally(() => resolve());
    };

    vData.settlePreload = () => {
      settle(() => {
        vData.preloading = false;
        if (vData.worker) {
          try {
            vData.worker.terminate();
          } catch {
            /* ignore */
          }
          vData.worker = null;
        }
      });
    };

    vData.preloadTimer = setTimeout(() => {
      console.error(`${logPrefix} Worker preload timeout after ${timeoutMs}ms — falling back to lazy-load mode`);
      vData.preloading = false;
      vData.lazyMode = true;
      const w = vData.worker;
      settle(async () => {
        try {
          await lazyLoadVersionData(version, vData, dataDir);
        } catch (e) {
          vData.lastError = (e as Error).message;
          vData.loaded = false;
        }
      });
      vData.worker = null;
      if (w) {
        try {
          w.terminate();
        } catch {
          /* ignore */
        }
      }
    }, timeoutMs);

    try {
      vData.worker = new Worker(new URL("../workers/preloader.js", import.meta.url), {
        workerData: { dataDir },
      });

      vData.worker.on("message", (msg: WorkerOutMessage) => {
        if (msg.type === "ready") {
          settle(() => {
            vData.apiIndex = msg.apiIndex as Record<
              string,
              { javadoc: string | null; methods: MethodInfo[]; fields: string[] }
            >;
            vData.classNames = msg.classNames;
            if (msg.trieFlat) {
              vData.trieIndex = TrieIndex.fromFlat(
                msg.trieFlat as Array<{
                  children: [string, number][];
                  isEnd: boolean;
                  score: number;
                }>,
              );
            } else {
              vData.trieIndex = null;
            }
            vData.trieSkipped = msg.trieSkipped === true;
            if (vData.trieSkipped) {
              console.error(
                `${logPrefix} Trie skipped after ${msg.elapsed}ms (${msg.classCount} classes); prefix search uses linear scan`,
              );
            }
            vData.loaded = true;
            vData.preloading = false;
            vData.lazyMode = false;
            if (vData.worker) {
              vData.worker.terminate();
              vData.worker = null;
            }
          });
        } else if (msg.type === "error") {
          console.error(`${logPrefix} Worker preload failed:`, msg.errors);
          vData.worker = null;
          vData.preloading = false;
          vData.lazyMode = true;
          vData.lastError = msg.errors?.join("; ");
          settle(async () => {
            try {
              await lazyLoadVersionData(version, vData, dataDir);
            } catch (e) {
              vData.lastError = (e as Error).message;
            }
          });
        }
      });

      vData.worker.on("error", (e) => {
        console.error(`${logPrefix} Worker error:`, e);
        vData.preloading = false;
        vData.lazyMode = true;
        vData.lastError = (e as Error).message;
        settle(async () => {
          try {
            await lazyLoadVersionData(version, vData, dataDir);
          } catch (err) {
            vData.lastError = (err as Error).message;
          }
        });
      });

      vData.worker.on("exit", () => {
        if (settled) return;
        vData.preloading = false;
        vData.lazyMode = true;
        vData.worker = null;
        settle(async () => {
          try {
            await lazyLoadVersionData(version, vData, dataDir);
          } catch (err) {
            vData.lastError = (err as Error).message;
          }
        });
      });

      vData.worker.postMessage({ type: "start", timeout: timeoutMs, dataDir });
    } catch (e) {
      console.error(`${logPrefix} Failed to start preloader:`, e);
      vData.preloading = false;
      vData.lazyMode = true;
      vData.lastError = (e as Error).message;
      settle(async () => {
        try {
          await lazyLoadVersionData(version, vData, dataDir);
        } catch (err) {
          vData.lastError = (err as Error).message;
        }
      });
    }
  });

  return vData.preloadPromise;
}

/** 主线程惰性读盘（Worker 超时/失败后）。parse 失败 → INDEX_CORRUPT，禁止伪装 NOT_FOUND。 */
async function lazyLoadVersionData(version: string, vData: VersionData, dataDir: string): Promise<void> {
  const apiIndexPath = join(dataDir, "api-index.json");
  const classNamesPath = join(dataDir, "class-names.json");
  if (!existsSync(apiIndexPath) || !existsSync(classNamesPath)) {
    vData.missingData = true;
    vData.loaded = true;
    vData.apiIndex = {};
    vData.classNames = [];
    return;
  }
  try {
    vData.apiIndex = parseJsonUtf8(await readFile(apiIndexPath, "utf-8")) as VersionData["apiIndex"];
    vData.classNames = parseJsonUtf8(await readFile(classNamesPath, "utf-8")) as string[];
  } catch (e) {
    vData.lastError = "INDEX_CORRUPT";
    vData.loaded = false;
    vData.missingData = false;
    vData.apiIndex = {};
    vData.classNames = [];
    throw e;
  }
  vData.trieIndex = null;
  vData.trieSkipped = true;
  vData.loaded = true;
  vData.lazyMode = true;
  vData.missingData = false;
}

// ── 工具函数 ──────────────────────────────────────────────────────────────

function toSlash(className: string): string {
  return className.replace(/\./g, "/");
}

function toDot(path: string): string {
  return path.replace(/\//g, ".");
}

// ── 辅助：模糊类名搜索（优先 Trie，次选线性扫描）────────────────────────────

/**
 * 计算两个方法名的相似度得分（0-100）。
 * 策略：前缀匹配 > 子串匹配 > 编辑距离
 */
function methodSimilarity(a: string, b: string): number {
  const al = a.toLowerCase();
  const bl = b.toLowerCase();
  if (al === bl) return 100;
  if (al.startsWith(bl) || bl.startsWith(al)) return 80;
  if (al.includes(bl) || bl.includes(al)) return 60;
  // 编辑距离（简化版：公共前缀 + 长度差惩罚）
  let common = 0;
  for (let i = 0; i < Math.min(al.length, bl.length); i++) {
    if (al[i] === bl[i]) common++;
    else break;
  }
  if (common >= 3) {
    const lenPenalty = Math.abs(al.length - bl.length) * 5;
    return Math.max(0, 70 - lenPenalty);
  }
  return 0;
}

/**
 * 在方法列表中查找与目标名称相似的方法。
 * 返回得分 >= 50 的方法，按得分降序，最多 5 条。
 */
function fuzzyMethodSearch(query: string, methods: MethodInfo[]): MethodInfo[] {
  return methods
    .map(m => ({ m, score: methodSimilarity(m.name, query) }))
    .filter(({ score }) => score >= 50)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(({ m }) => m);
}

type FuzzyKind = "exact" | "prefix" | "suffix" | "contains" | "edit";
type FuzzyHit = { name: string; score: number; kind: FuzzyKind };

function fuzzyClassSearch(query: string, vData: VersionData): FuzzyHit[] {
  const normalized = query.toLowerCase().replace(/\./g, "/");
  const simple = normalized.includes("/")
    ? normalized.slice(normalized.lastIndexOf("/") + 1)
    : normalized;

  if (vData.trieIndex) {
    // trie 只存小写段键，_collect 据此重建 ⇒ 原始大小写丢失。
    // 用 class-names.json 的原始名还原；缓存绑定数组身份，数组被替换即自动重建。
    // 不变量：classNames 只可整体替换，不可原地 push/splice，否则此缓存静默过期。
    // 详见 docs/query-api-classname-case.md。
    const names = vData.classNames ?? [];
    let caseMap =
      vData.caseMap && vData.caseMap.names === names ? vData.caseMap.map : undefined;
    if (!caseMap) {
      caseMap = new Map<string, string>();
      for (const cn of names) caseMap.set(cn.toLowerCase(), cn);
      vData.caseMap = { names, map: caseMap };
    }
    const restoreCase = (lowerName: string): string => caseMap!.get(lowerName) ?? lowerName;
    // A-26：TRIE_TRUNCATION_MARKER 不是类名。任一 trie 结果含该标记 ⇒ 该分支不完整，
    // 整体作废并落到下面的全量线性扫描（慢但完整），绝不把标记经 restoreCase 当成
    // 「你指的是 …」建议名回给模型。
    const notTruncated = (arr: string[]): boolean => !arr.includes(TRIE_TRUNCATION_MARKER);

    const prefixResults = vData.trieIndex.searchPrefix(normalized);
    if (notTruncated(prefixResults) && prefixResults.length > 0) {
      return prefixResults
        .slice(0, 5)
        .map((name) => ({ name: restoreCase(name), score: 95, kind: "prefix" as const }));
    }
    if (simple.length >= 3) {
      const simplePrefix = vData.trieIndex.searchPrefix(simple);
      if (notTruncated(simplePrefix) && simplePrefix.length > 0) {
        return simplePrefix
          .slice(0, 5)
          .map((name) => ({ name: restoreCase(name), score: 90, kind: "prefix" as const }));
      }
    }
  }

  if (!vData.classNames || vData.classNames.length === 0) return [];
  const results: FuzzyHit[] = [];

  for (const name of vData.classNames) {
    const lower = name.toLowerCase();
    const simpleName = lower.includes("/") ? lower.slice(lower.lastIndexOf("/") + 1) : lower;
    if (lower === normalized) { results.push({ score: 100, name, kind: "exact" }); continue; }
    if (lower.endsWith("/" + normalized)) {
      results.push({ score: 90, name, kind: "suffix" }); continue;
    }
    if (simple.length >= 3 && (lower.includes(normalized) || simpleName.includes(simple))) {
      results.push({ score: 80 - (lower.length - normalized.length), name, kind: "contains" });
      continue;
    }
    if (simple.length >= 3 && simpleName.length >= 3) {
      const dist = editDistanceLimited(simple, simpleName, 2);
      if (dist !== null && dist <= 2) {
        const firstOk = simple[0] === simpleName[0] || dist <= 1;
        if (firstOk) {
          results.push({ score: 70 - dist * 10, name, kind: "edit" });
        }
      }
    }
  }

  return results.sort((a, b) => b.score - a.score).slice(0, 5);
}

function simpleNameOfSlash(slashPath: string): string {
  const i = slashPath.lastIndexOf("/");
  return i >= 0 ? slashPath.slice(i + 1) : slashPath;
}

/** 简单类名大小写不敏感唯一精确匹配（Item → net/minecraft/world/item/Item）。歧义 suffix/contains 不算命中。 */
function uniqueExactSimpleNameHit(query: string, vData: VersionData): string | undefined {
  if (!vData.classNames?.length) return undefined;
  const simple = query.replace(/\./g, "/").split("/").pop()?.toLowerCase();
  if (!simple) return undefined;
  const hits = vData.classNames.filter((n) => simpleNameOfSlash(n).toLowerCase() === simple);
  return hits.length === 1 ? hits[0] : undefined;
}

function withAutoCorrect(result: ApiResult, requestedClassName: string, resolvedDot: string): ApiResult {
  if (requestedClassName === resolvedDot) return result;
  return { ...result, autoCorrected: true, requestedClassName };
}

// ── 辅助：查找相关类 ─────────────────────────────────────────────────────

const RELATED_CLASSES_NEW: Record<string, string[]> = {
  "net/minecraft/world/entity/LivingEntity": [
    "net/minecraft/world/entity/Entity",
    "net/minecraft/world/entity/Mob",
    "net/minecraft/world/entity/animal/Animal",
  ],
  "net/minecraft/world/block/Block": [
    "net/minecraft/world/block/state/BlockBehaviour",
    "net/minecraft/world/level/block/entity/BlockEntity",
  ],
  "net/minecraft/world/item/Item": [
    "net/minecraft/world/item/BlockItem",
    "net/minecraft/world/item/SwordItem",
    "net/minecraft/world/item/PickaxeItem",
  ],
  "net/minecraft/world/level/block/entity/BlockEntity": [
    "net/minecraft/world/level/block/entity/BlockEntityType",
    "net/minecraft/world/block/state/BlockBehaviour",
  ],
};

const RELATED_CLASSES_OLD: Record<string, string[]> = {
  "net/minecraft/entity/EntityLiving": [
    "net/minecraft/entity/Entity",
    "net/minecraft/entity/monster/EntityMob",
    "net/minecraft/entity/passive/EntityAnimal",
  ],
  "net/minecraft/block/Block": [
    "net/minecraft/tileentity/TileEntity",
    "net/minecraft/block/ITileEntityProvider",
  ],
  "net/minecraft/item/Item": [
    "net/minecraft/item/ItemBlock",
    "net/minecraft/item/ItemSword",
    "net/minecraft/item/ItemPickaxe",
  ],
  "net/minecraft/tileentity/TileEntity": [
    "net/minecraft/tileentity/TileEntityType",
    "net/minecraft/world/IBlockAccess",
  ],
};

const OLD_VERSIONS = new Set(["1.7.10", "1.8.9", "1.9.4", "1.10.2", "1.11.2", "1.12.2", "1.13.2", "1.14.4", "1.15.2"]);

function pickRelated(version: string): Record<string, string[]> {
  return OLD_VERSIONS.has(version) ? RELATED_CLASSES_OLD : RELATED_CLASSES_NEW;
}

// ── 构建结果函数 ─────────────────────────────────────────────────────────

function buildClassResult(
  className: string,
  cls: { javadoc: string | null; methods: MethodInfo[]; fields: string[] },
  suggestions: string[],
  version: string
): ApiResult {
  const related = ownGet(pickRelated(version), className.replace(/\./g, "/")) ?? [];
  const notes: string[] = [];
  if (related.length > 0) {
    notes.push(`相关类：${related.map(n => n.replace(/\//g, ".")).join(", ")}`);
  }
  if (!cls.methods.length) {
    notes.push(
      "本索引该类无方法条目（常见于 1.7.10–1.12.2 javadoc 空壳）。found:true 不是完整签名；请用 search_forge_docs / query_loader_api / convert_mapping。",
    );
  }
  const METHODS_CAP = 80;
  const JAVADOC_CAP = 8 * 1024;
  const methods = cls.methods.slice(0, METHODS_CAP);
  const javadoc = cls.javadoc ? cls.javadoc.slice(0, JAVADOC_CAP) : undefined;
  const truncated = cls.methods.length > METHODS_CAP || Boolean(cls.javadoc && cls.javadoc.length > JAVADOC_CAP);
  const lastDot = className.lastIndexOf(".");
  return {
    found: true,
    className,
    classJavadoc: javadoc,
    packagePath: lastDot < 0 ? "" : className.substring(0, lastDot),
    methods,
    mappings: { mojang: className.replace(/\./g, "/"), parchment: className.replace(/\./g, "/") },
    suggestions,
    notes: notes.length > 0 ? notes : undefined,
    ...(truncated ? { truncated: true } : {}),
  };
}

function buildMethodResult(
  className: string,
  cls: { javadoc: string | null; methods: MethodInfo[]; fields: string[] },
  methods: MethodInfo[]
): ApiResult {
  const info = methods.map((m) => ({
    name: m.name,
    parameters: m.parameters,
    returnType: descriptorReturnType(m.descriptor),
    readableSignature: readableSignature(m.name, m.descriptor),
    descriptor: m.descriptor,
    javadoc: m.javadoc ?? undefined,
    yarnName: m.yarnName,
    source: m.source,
  }));

  return {
    found: true,
    className,
    methodName: methods[0].name,
    methods: info,
    mappings: { mojang: className.replace(/\./g, "/"), parchment: className.replace(/\./g, "/") },
    notes: methods.length > 1
      ? [`⚠️ 方法 ${methods[0].name} 有 ${methods.length} 个重载，请根据参数数量选择正确签名`]
      : undefined,
  };
}

const QUERY_API_EMPTY_INDEX =
  "当前版本无 Vanilla API 索引，无法执行 query_api（found:false / DATA_UNAVAILABLE 只表示本 Parchment 索引没有该类，不代表游戏里没有）。请改用 search_*_docs，或 get_minecraft_source。query_api 覆盖约 1.16.5–1.20.4；1.21+ / 26.1+ 无索引。";

const QUERY_API_SHELL_INDEX =
  "该版 extracted 多为类名空壳（methods 为空）。found:true 只表示类名在索引里，不是完整 javadoc/签名。请改 search_forge_docs / query_loader_api / convert_mapping。";

function queryApiCoverageWarning(version: string, classCount?: number): string | undefined {
  const v = version.trim();
  const outOfRange = isUnobfuscatedMcVersion(v) || /^1\.21(\.|$)/.test(v) || /^26\./.test(v);
  if (outOfRange || classCount === 0) return QUERY_API_EMPTY_INDEX;
  // 1.7.10–1.13.2：有类名列表，但几乎没有方法条目
  if (/^1\.(7|8|9|10|11|12|13)(\.|$)/.test(v)) return QUERY_API_SHELL_INDEX;
  return undefined;
}

// ── 主查询函数 ─────────────────────────────────────────────────────────────

export async function queryApi(query: ApiQuery): Promise<ApiResult> {
  const { className, methodName } = query;
  if (missingMcVersion(query.version)) {
    return withAction(
      {
        found: false,
        className,
        mappings: { mojang: toSlash(className), parchment: toSlash(className) },
        suggestions: ["请指定 version，禁止默认 1.20.1"],
      },
      versionRequiredAction(),
    );
  }
  const version = query.version!.trim();
  if (!isSafeVersionSegment(version)) {
    return withAction(
      {
        found: false,
        className,
        mappings: { mojang: toSlash(className), parchment: toSlash(className) },
        suggestions: ["传入精确 Minecraft 版本（数字与点）", "禁止 .. 与 / \\ 路径穿越"],
      },
      actionable(
        ActionCodes.INVALID_INPUT,
        `version 非法：${version}`,
        ["传入精确 Minecraft 版本，例如 1.20.1", "禁止使用 .. 或路径分隔符"],
        ["query_api", "list_forge_versions"],
      ),
    );
  }

  // 确保该版本的预加载已完成（或降级）。FIFO 驱逐后条目已删除，必须重新走磁盘加载，禁止落到共享 _defaultData。
  await startPreloader(version);
  if (!_versionData.has(version)) {
    await startPreloader(version);
  }

  const vData = getVersionData(version);
  const coverageWarning = queryApiCoverageWarning(version, vData.classNames?.length ?? 0);
  const withCoverage = (r: ApiResult): ApiResult =>
    coverageWarning ? { ...r, warning: r.warning ?? coverageWarning } : r;

  // 数据不可用：无索引目录或 Worker 未就绪（同一 DATA_UNAVAILABLE 信封）
  if (vData.lastError === "INDEX_CORRUPT") {
    return withCoverage(withAction(
      {
        found: false,
        className,
        mappings: { mojang: toSlash(className), parchment: toSlash(className) },
        suggestions: ["api-index.json 无法解析，不要把空结果当 NOT_FOUND"],
      },
      actionable(
        ActionCodes.INDEX_CORRUPT,
        `API 索引损坏（version=${version}）`,
        ["检查 data/forge_<ver>/extracted/api-index.json 是否截断", "重新解压 Release data 包"],
        ["get_server_status", "diagnose_data_paths"],
      ),
    ));
  }
  if (vData.missingData || !vData.loaded) {
    const nextSteps = vData.missingData
      ? [
          "该版本无 extracted API 索引目录",
          "改用 search_*_docs 或 get_minecraft_source",
          "确认 MC_SKILL_DATA 指向仓库 data/",
        ]
      : [
          "调用 get_server_status 查看 preload 状态（Worker 未就绪）",
          "确认 MC_SKILL_DATA 指向仓库 data/ 目录",
          "必要时重启 MCP Server",
        ];
    return withCoverage(withAction(
      {
        found: false,
        className,
        mappings: { mojang: toSlash(className), parchment: toSlash(className) },
        suggestions: nextSteps,
      },
      actionable(
        ActionCodes.DATA_UNAVAILABLE,
        `API 索引未就绪（version=${version}）`,
        nextSteps,
        ["get_server_status", "diagnose_data_paths"],
      ),
    ));
  }

  // 1. 精确 FQCN，或简单类名唯一精确匹配（歧义 suffix/contains/prefix 不得 found:true）
  const slashName = toSlash(className);
  // ownGet：className='constructor'/'__proto__' 等不得命中 Object.prototype 继承键
  let cls = ownGet(vData.apiIndex, slashName);
  let resolvedSlash = slashName;
  if (!cls) {
    const unique = uniqueExactSimpleNameHit(className, vData);
    if (unique) {
      cls = ownGet(vData.apiIndex, unique);
      resolvedSlash = unique;
    }
  }

  // 2. 未命中：只给 suggestions，不改写 className、不返回 methods
  if (!cls) {
    const fuzzy = fuzzyClassSearch(className, vData);
    if (fuzzy.length > 0) {
      const suggestions = fuzzy.map((h) => `你指的是 ${toDot(h.name)} 吗？`);
      return withCoverage({
        found: false,
        className,
        mappings: { mojang: slashName, parchment: slashName },
        suggestions: [`未找到 ${className}。类似类：`, ...suggestions],
        notes: ["歧义简名 / 子串 / 拼写近似不会当作命中；请改用完整包名或从 suggestions 选一类再查"],
      });
    }
    const emptyIndex = !vData.classNames || vData.classNames.length === 0;
    const unobf = isUnobfuscatedMcVersion(version);
    const notes: string[] = [];
    if (!emptyIndex && !unobf) {
      notes.push(
        /minecraftforge|neoforged/i.test(className)
          ? "Forge/NeoForge 特有类不在 Parchment 索引中，请改用 query_loader_api（必填 platform+minecraftVersion）或 search_forge_docs / search_neoforge_docs。"
          : "Forge 特有类（如 DeferredRegister、Capability）不在 Parchment 数据中。请改用 query_loader_api。",
      );
    }
    notes.push(`共收录 ${vData.classNames.length} 个类（版本 ${version}）。`);
    if (unobf) {
      notes.push(
        UNOBFUSCATED_MAPPING_HINT,
        `query_api 的 api-index 不覆盖 26.1+；请用 search_neoforge_docs（version=26.1）/ search_fabric_docs（先 list_fabric_versions，如 26.1.2）。`,
      );
    } else if (emptyIndex) {
      notes.push(
        `query_api 的 api-index 目前覆盖 Forge Parchment extracted（约 1.16.5–1.20.4）。` +
          `若你在查 NeoForge/MC ${version}，本工具无对应索引；请改用 search_neoforge_docs / convert_mapping，或换 version=1.20.1/1.20.4 查相近 Vanilla API。`,
      );
    }
    return withCoverage({
      found: false,
      className,
      mappings: { mojang: slashName, parchment: slashName },
      suggestions: [`未找到类 ${className}，请检查类名是否正确`],
      notes,
    });
  }

  const resolvedDot = toDot(resolvedSlash);
  const finish = (r: ApiResult): ApiResult =>
    withCoverage(withAutoCorrect(r, className, resolvedDot));

  // 3. 类找到了，查找方法
  if (methodName) {
    const matched = cls.methods.filter(
      m => m.name === methodName || m.name === `<${methodName}>`
    );
    if (matched.length === 0) {
      // Yarn 名 → Mojang 名：supplement 记录了 yarnName
      const yarnHits = cls.methods.filter(
        (m) => (m as MethodInfo & { yarnName?: string }).yarnName === methodName,
      );
      const yarnSuggestions = yarnHits.slice(0, 5).map(
        (m) => `Yarn 名 '${methodName}' 对应 Mojang/Parchment 方法 '${m.name}'`,
      );
      // 优先显示名称相似的方法（如 getHealth → getMaxHealth）
      const similar = fuzzyMethodSearch(methodName, cls.methods);
      const similarSuggestions = similar.map(m =>
        `你指的是 '${m.name}' 吗？`
      );
      const suggestions = [
        `未在 ${resolvedDot} 中找到方法 ${methodName}`,
        ...yarnSuggestions,
        ...similarSuggestions,
      ];
      if (yarnSuggestions.length > 0 || similarSuggestions.length > 0) {
        return finish({
          found: false,
          className: resolvedDot,
          methodName,
          mappings: { mojang: resolvedSlash, parchment: resolvedSlash },
          suggestions,
          notes: [
            `${version} 共收录 ${cls.methods.length} 个方法（含 Mojang supplement），方法名区分大小写`,
            "Forge 1.17+ 使用 Mojang 映射名（如 Entity.level()），不是 Yarn（getWorld）",
            `提示：如果你看到的是混淆名（如 aqm），请访问 https://mappings.xhyrom.dev/${version} 反查`,
          ],
        });
      }
      return finish({
        found: false,
        className: resolvedDot,
        methodName,
        mappings: { mojang: resolvedSlash, parchment: resolvedSlash },
        suggestions: [
          `未在 ${resolvedDot} 中找到方法 ${methodName}`,
          `可用方法（部分）：${cls.methods.slice(0, 8).map(m => m.name).join(", ")}${cls.methods.length > 8 ? "..." : ""}`,
        ],
        notes: [
          `${version} 共收录 ${cls.methods.length} 个方法，方法名区分大小写`,
          "请确认已用 parchment-extractor（Mojang client.txt supplement）重建 extracted",
        ],
      });
    }
    return finish(buildMethodResult(resolvedDot, cls, matched));
  }

  return finish(buildClassResult(resolvedDot, cls, [], version));
}

// ── Trie 索引导出已删除（getTrieIndex/setTrieIndex 全仓零调用且钉死 DEFAULT_VERSION）──

/** Terminate preload Workers and drop caches so Node can exit (tests / CLI). */
export function disposeApiData(): void {
  for (const vData of _versionData.values()) {
    if (vData.preloadTimer) {
      clearTimeout(vData.preloadTimer);
      vData.preloadTimer = null;
    }
    try {
      vData.settlePreload?.();
    } catch {
      /* ignore */
    }
    vData.settlePreload = null;
    if (vData.worker) {
      try {
        vData.worker.terminate();
      } catch {
        /* ignore */
      }
      vData.worker = null;
    }
    vData.preloading = false;
    vData.preloadPromise = null;
  }
  _versionData.clear();
}

/** Warm up one or more versions（版本必填，禁止默认 1.20.1——调用方显式传参）。 */
export async function warmupApi(versions: string[]): Promise<VersionPreloadStatus[]> {
  await Promise.all(versions.map((v) => startPreloader(v)));
  return versions.map((v) => getApiPreloadStatus(v));
}

export function getApiPreloadStatus(version: string): VersionPreloadStatus {
  const vData = _versionData.get(version);
  if (!vData) {
    return {
      version,
      status: "idle",
      classCount: 0,
      loaded: false,
      preloading: false,
      trieSkipped: false,
    };
  }
  let status: ApiPreloadStatus = "idle";
  if (vData.missingData) status = "missing_data";
  else if (vData.lastError && !vData.loaded) status = "error";
  else if (vData.preloading) status = "loading";
  else if (vData.loaded && vData.lazyMode) status = "lazy";
  else if (vData.loaded) status = "ready";
  return {
    version,
    status,
    classCount: vData.classNames.length,
    loaded: vData.loaded,
    preloading: vData.preloading,
    trieSkipped: vData.trieSkipped,
  };
}

export function listApiPreloadStatuses(): VersionPreloadStatus[] {
  return [..._versionData.keys()].map((v) => getApiPreloadStatus(v));
}
