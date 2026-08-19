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
 * - LRU 缓存搜索结果（TTL 5 分钟）
 * - 15s 硬超时保护：Worker 超时则降级到惰性加载，保证调用永不卡死
 * - Per-version 缓存：每个 Minecraft 版本独立 apiIndex / classNames / trie
 */

import { Worker } from "worker_threads";
import { existsSync, readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import type { WorkerOutMessage } from "../workers/types.js";
import { resolveDataDir } from "../utils/path.js";
import { ownGet } from "../utils/own-record.js";
import { readableSignature, returnType as descriptorReturnType } from "../utils/descriptor.js";
import { ActionCodes, actionable, withAction, versionRequiredAction, missingMcVersion, type ActionEnvelope } from "../utils/actionable.js";
import { isUnobfuscatedMcVersion, UNOBFUSCATED_MAPPING_HINT } from "../mappings/unobfuscated.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DEFAULT_VERSION = "1.20.1";

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
}

// ── LRU 缓存（搜索结果）──────────────────────────────────────────────────

interface CacheEntry<T> {
  data: T;
  expiry: number;
}

class LRUCache {
  private cache = new Map<string, unknown>();
  private expiry = new Map<string, number>();
  private readonly maxSize: number;
  private readonly ttl: number;

  constructor(maxSize = 100, ttl = 5 * 60 * 1000) {
    this.maxSize = maxSize;
    this.ttl = ttl;
  }

  get(key: string): unknown | undefined {
    const exp = this.expiry.get(key);
    if (exp !== undefined && exp < Date.now()) {
      this.cache.delete(key);
      this.expiry.delete(key);
      return undefined;
    }
    return this.cache.get(key);
  }

  set(key: string, value: unknown): void {
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== undefined) {
        this.cache.delete(firstKey);
        this.expiry.delete(firstKey);
      }
    }
    this.cache.set(key, value);
    this.expiry.set(key, Date.now() + this.ttl);
  }
}

// ── Trie 索引（Worker 中构建，通过消息传递）────────────────────────────────

/**
 * Trie 节点结构（Worker 中构建，通过 postMessage 结构化克隆传回）。
 * 主线程用 flat 数组重建索引。
 */

class TrieIndex {
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

  /**
   * 插入一个类名（仅用于在主线程重建后的追加插入）
   */
  insert(name: string, score = 0): void {
    const parts = name.toLowerCase().split("/");
    let nodeIdx = 0;
    for (const part of parts) {
      const childEntry = this.flat[nodeIdx].children.find(([k]) => k === part);
      if (childEntry) {
        nodeIdx = childEntry[1];
      } else {
        const newIdx = this.flat.length;
        this.flat[nodeIdx].children.push([part, newIdx]);
        this.flat.push({ children: [], isEnd: false, score: 0 });
        nodeIdx = newIdx;
      }
    }
    this.flat[nodeIdx].isEnd = true;
    this.flat[nodeIdx].score = score;
  }

  /**
   * 前缀搜索：返回所有以 prefix 开头的类名（用于模糊匹配加速）
   */
  searchPrefix(prefix: string): string[] {
    const parts = prefix.toLowerCase().replace(/\./g, "/").split("/");
    let nodeIdx = 0;
    for (const part of parts) {
      const childEntry = this.flat[nodeIdx].children.find(([k]) => k === part);
      if (!childEntry) return [];
      nodeIdx = childEntry[1];
    }
    const results: string[] = [];
    this._collect(nodeIdx, parts.join("/"), results);
    return results;
  }

  private _collect(nodeIdx: number, prefix: string, results: string[]): void {
    const node = this.flat[nodeIdx];
    if (node.isEnd) results.push(prefix);
    for (const [childName, childIdx] of node.children) {
      this._collect(childIdx, prefix + "/" + childName, results);
    }
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
  /** 该版本正在进行的 Worker（若已结束则为 null） */
  worker: Worker | null;
  /** 该版本的 Worker preload 完成 Promise */
  preloadPromise: Promise<void> | null;
}

const _versionData = new Map<string, VersionData>();
/** 兜底：未匹配任何 version 时使用的默认版本 */
const _defaultData: VersionData = {
  apiIndex: {},
  classNames: [],
  trieIndex: null,
  loaded: false,
  preloading: false,
  lazyMode: false,
  missingData: false,
  worker: null,
  preloadPromise: null,
};

/** 获取指定版本的数据；缺失时返回空壳，禁止回退 1.20.1 */
function getVersionData(version: string): VersionData {
  return _versionData.get(version) ?? _defaultData;
}

/** 解析某版本对应的 extracted 数据目录。
 *  - 1.7.10–1.12.2 走 forge_javadoc（与 docs 路由一致）
 *  - 其它走 forge_<version>/extracted
 *  - 找不到对应目录时返回 null（调用方应降级）
 */
function resolveVersionDataDir(version: string): string | null {
  const dataRoot = resolveDataDir();
  // javadoc 版本的映射数据与文档数据共用 extracted/（实际不存在时也无所谓）
  // 直接尝试 forge_<version>/extracted；不存在返回 null
  const candidates: string[] = [];
  if (/^1\.(7|8|9|1\d|12)/.test(version)) {
    // 较老版本的映射 extract 也放在 forge_<version>/extracted
    candidates.push(join(dataRoot, `forge_${version}`, "extracted"));
  }
  candidates.push(join(dataRoot, `forge_${version}`, "extracted"));
  for (const p of candidates) {
    if (existsSync(p)) return p;
  }
  return null;
}

// LRU 缓存：搜索结果缓存（key = "query|version|tags"）
const _searchCache = new LRUCache(100, 5 * 60 * 1000);

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
      loaded: true,
      preloading: false,
      lazyMode: false,
      missingData: true,
      worker: null,
      preloadPromise: Promise.resolve(),
    };
    _versionData.set(version, empty);
    return empty.preloadPromise!;
  }

  const existing = _versionData.get(version);
  if (existing?.preloadPromise) return existing.preloadPromise;

  const vData: VersionData = {
    apiIndex: {},
    classNames: [],
    trieIndex: null,
    loaded: false,
    preloading: true,
    lazyMode: false,
    missingData: false,
    worker: null,
    preloadPromise: null,
  };
  _versionData.set(version, vData);

  vData.preloadPromise = new Promise<void>((resolve) => {
    let settled = false;
    const timeoutMs = 15000;
    const logPrefix = `[MCP/Api:${version}]`;

    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      console.error(`${logPrefix} Worker preload timeout after ${timeoutMs}ms — falling back to lazy-load mode`);
      if (vData.worker) {
        vData.worker.terminate();
        vData.worker = null;
      }
      vData.preloading = false;
      vData.lazyMode = true;
      try {
        lazyLoadVersionData(version, vData, dataDir);
      } catch (e) {
        vData.lastError = (e as Error).message;
        vData.loaded = false;
      }
      resolve();
    }, timeoutMs);

    try {
      vData.worker = new Worker(new URL("../workers/preloader.js", import.meta.url), {
        workerData: { dataDir },
      });

      vData.worker.on("message", (msg: WorkerOutMessage) => {
        if (msg.type === "ready") {
          if (settled) return;
          settled = true;
          clearTimeout(timer);

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

          vData.loaded = true;
          vData.preloading = false;
          vData.lazyMode = false;
          resolve();
        } else if (msg.type === "error") {
          if (settled) return;
          settled = true;
          clearTimeout(timer);
          console.error(`${logPrefix} Worker preload failed:`, msg.errors);
          vData.worker = null;
          vData.preloading = false;
          vData.lazyMode = true;
          vData.lastError = msg.errors?.join("; ");
          try {
            lazyLoadVersionData(version, vData, dataDir);
          } catch (e) {
            vData.lastError = (e as Error).message;
          }
          resolve();
        }
      });

      vData.worker.on("error", (e) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        console.error(`${logPrefix} Worker error:`, e);
        vData.preloading = false;
        vData.lazyMode = true;
        vData.lastError = (e as Error).message;
        try {
          lazyLoadVersionData(version, vData, dataDir);
        } catch (err) {
          vData.lastError = (err as Error).message;
        }
        resolve();
      });

      vData.worker.postMessage({ type: "start", timeout: timeoutMs, dataDir });
    } catch (e) {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      console.error(`${logPrefix} Failed to start preloader:`, e);
      vData.preloading = false;
      vData.lazyMode = true;
      vData.lastError = (e as Error).message;
      try {
        lazyLoadVersionData(version, vData, dataDir);
      } catch (err) {
        vData.lastError = (err as Error).message;
      }
      resolve();
    }
  });

  return vData.preloadPromise;
}

/** Synchronous main-thread load used after Worker timeout/failure. */
function lazyLoadVersionData(version: string, vData: VersionData, dataDir: string): void {
  const apiIndexPath = join(dataDir, "api-index.json");
  const classNamesPath = join(dataDir, "class-names.json");
  if (!existsSync(apiIndexPath) || !existsSync(classNamesPath)) {
    vData.missingData = true;
    vData.loaded = true;
    vData.apiIndex = {};
    vData.classNames = [];
    return;
  }
  vData.apiIndex = JSON.parse(readFileSync(apiIndexPath, "utf-8"));
  vData.classNames = JSON.parse(readFileSync(classNamesPath, "utf-8"));
  vData.trieIndex = null;
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
    const prefixResults = vData.trieIndex.searchPrefix(normalized);
    if (prefixResults.length > 0) {
      return prefixResults.slice(0, 5).map((name) => ({ name, score: 95, kind: "prefix" as const }));
    }
    if (simple.length >= 3) {
      const simplePrefix = vData.trieIndex.searchPrefix(simple);
      if (simplePrefix.length > 0) {
        return simplePrefix.slice(0, 5).map((name) => ({ name, score: 90, kind: "prefix" as const }));
      }
    }
  }

  if (!vData.classNames || vData.classNames.length === 0) return [];
  const results: FuzzyHit[] = [];

  for (const name of vData.classNames) {
    const lower = name.toLowerCase();
    const simpleName = lower.includes("/") ? lower.slice(lower.lastIndexOf("/") + 1) : lower;
    if (lower === normalized) { results.push({ score: 100, name, kind: "exact" }); continue; }
    if (lower.endsWith("/" + normalized) || lower.endsWith("." + normalized.replace("/", "."))) {
      results.push({ score: 90, name, kind: "suffix" }); continue;
    }
    if (simple.length >= 3 && (lower.includes(normalized) || simpleName.includes(simple))) {
      results.push({ score: 80 - (lower.length - normalized.length), name, kind: "contains" });
      continue;
    }
    if (simple.length >= 3 && simpleName.length >= 3) {
      const dist = editDistanceLimited(simple, simpleName, 3);
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

function acceptFuzzyHit(hit: FuzzyHit): boolean {
  return hit.kind !== "edit";
}

function editDistanceLimited(a: string, b: string, max: number): number | null {
  if (Math.abs(a.length - b.length) > max) return null;
  const m = a.length;
  const n = b.length;
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const cur = new Array<number>(n + 1);
    cur[0] = i;
    let rowMin = cur[0];
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
      if (cur[j] < rowMin) rowMin = cur[j];
    }
    if (rowMin > max) return null;
    prev = cur;
  }
  return prev[n] <= max ? prev[n] : null;
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
  return {
    found: true,
    className,
    classJavadoc: cls.javadoc ?? undefined,
    packagePath: className.substring(0, className.lastIndexOf(".")),
    methods: cls.methods,
    mappings: { mojang: className.replace(/\./g, "/"), parchment: className.replace(/\./g, "/") },
    suggestions,
    notes: notes.length > 0 ? notes : undefined,
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
  "当前版本无 Vanilla API 索引，无法执行 query_api；请用 search_*_docs 或反编译 jar。query_api 覆盖约 1.16.5–1.20.4。found:false 不代表游戏里没有该类。";

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

  // 确保该版本的预加载已完成（或降级）
  await startPreloader(version);

  const vData = getVersionData(version);
  const coverageWarning = queryApiCoverageWarning(version, vData.classNames?.length ?? 0);
  const withCoverage = (r: ApiResult): ApiResult =>
    coverageWarning ? { ...r, warning: r.warning ?? coverageWarning } : r;

  // 数据不可用：无索引目录或 Worker 未就绪（同一 DATA_UNAVAILABLE 信封）
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

  // 1. 精确类名查询
  const slashName = toSlash(className);
  let cls = vData.apiIndex[slashName];

  // 2. 尝试模糊搜索
  if (!cls) {
    const fuzzy = fuzzyClassSearch(className, vData);
    if (fuzzy.length > 0) {
      const suggestions = fuzzy.map((h) => `你指的是 ${toDot(h.name)} 吗？`);
      const best = fuzzy[0];
      if (acceptFuzzyHit(best)) {
        cls = vData.apiIndex[best.name];
        if (cls) {
          return withCoverage(buildClassResult(toDot(best.name), cls, suggestions.slice(1), version));
        }
      }
      return withCoverage({
        found: false,
        className,
        mappings: { mojang: slashName, parchment: slashName },
        suggestions: [`未找到 ${className}。类似类：`, ...suggestions],
        notes: ["提示：类名区分大小写，使用完整包名效果更佳；纯拼写近似不会当作命中"],
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
        `未在 ${toDot(slashName)} 中找到方法 ${methodName}`,
        ...yarnSuggestions,
        ...similarSuggestions,
      ];
      if (yarnSuggestions.length > 0 || similarSuggestions.length > 0) {
        return withCoverage({
          found: false,
          className: toDot(slashName),
          methodName,
          mappings: { mojang: slashName, parchment: slashName },
          suggestions,
          notes: [
            `${version} 共收录 ${cls.methods.length} 个方法（含 Mojang supplement），方法名区分大小写`,
            "Forge 1.17+ 使用 Mojang 映射名（如 Entity.level()），不是 Yarn（getWorld）",
            `提示：如果你看到的是混淆名（如 aqm），请访问 https://mappings.xhyrom.dev/${version} 反查`,
          ],
        });
      }
      return withCoverage({
        found: false,
        className: toDot(slashName),
        methodName,
        mappings: { mojang: slashName, parchment: slashName },
        suggestions: [
          `未在 ${toDot(slashName)} 中找到方法 ${methodName}`,
          `可用方法（部分）：${cls.methods.slice(0, 8).map(m => m.name).join(", ")}${cls.methods.length > 8 ? "..." : ""}`,
        ],
        notes: [
          `${version} 共收录 ${cls.methods.length} 个方法，方法名区分大小写`,
          "请确认已用 parchment-extractor（Mojang client.txt supplement）重建 extracted",
        ],
      });
    }
    return withCoverage(buildMethodResult(toDot(slashName), cls, matched));
  }

  return withCoverage(buildClassResult(toDot(slashName), cls, [], version));
}

// ── 导出 Trie 索引供外部使用（如 store.ts 的搜索）─────────────────────────

export function getTrieIndex(): TrieIndex | null {
  return getVersionData(DEFAULT_VERSION).trieIndex;
}

export function setTrieIndex(trie: TrieIndex): void {
  getVersionData(DEFAULT_VERSION).trieIndex = trie;
}

/** Terminate preload Workers and drop caches so Node can exit (tests / CLI). */
export function disposeApiData(): void {
  for (const vData of _versionData.values()) {
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

/** Warm up one or more versions (default 1.20.1). */
export async function warmupApi(versions: string[] = [DEFAULT_VERSION]): Promise<VersionPreloadStatus[]> {
  await Promise.all(versions.map((v) => startPreloader(v)));
  return versions.map((v) => getApiPreloadStatus(v));
}

export function getApiPreloadStatus(version: string = DEFAULT_VERSION): VersionPreloadStatus {
  const vData = _versionData.get(version);
  if (!vData) {
    return {
      version,
      status: "idle",
      classCount: 0,
      loaded: false,
      preloading: false,
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
  };
}

export function listApiPreloadStatuses(): VersionPreloadStatus[] {
  const versions = new Set<string>([DEFAULT_VERSION, ..._versionData.keys()]);
  return [...versions].map((v) => getApiPreloadStatus(v));
}
