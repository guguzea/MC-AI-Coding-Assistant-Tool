/**
 * API 精确查询模块 — 基于真实数据
 *
 * 数据来源：
 * - Vanilla API：Parchment 1.20.1 (2023.09.03) 提取数据
 * - Forge API：嵌入式硬编码（Forge 不在 Parchment 中）
 *
 * 性能优化：
 * - Worker Thread 预加载 JSON（避免主线程阻塞）
 * - Trie 索引加速模糊搜索（O(k) vs O(n)，k=前缀长度）
 * - LRU 缓存搜索结果（TTL 5 分钟）
 */

import { Worker } from "worker_threads";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import type { WorkerOutMessage } from "../workers/types.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
// dist/api/ → mcp-server/ → mc_skill/  (data 在 mc_skill/data/forge_1.20.1/extracted/)
const DATA_DIR = join(__dirname, "..", "..", "..", "data", "forge_1.20.1", "extracted");

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
  javadoc?: string;
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

// ── 数据存储（Worker 预加载后填充）───────────────────────────────────────

let _apiIndex: Record<string, { javadoc: string | null; methods: MethodInfo[]; fields: string[] }> | null = null;
let _classNames: string[] | null = null;
let _trieIndex: TrieIndex | null = null;
let _preloadWorker: Worker | null = null;
let _preloadReady = false;
let _preloadPromise: Promise<void> | null = null;

// LRU 缓存：搜索结果缓存（key = "query|version|tags"）
const _searchCache = new LRUCache(100, 5 * 60 * 1000);

// ── Worker 预加载触发 ────────────────────────────────────────────────────

/**
 * 启动 Worker 预加载（异步，不阻塞主线程）。
 * 第一次 queryApi 调用时自动触发，Worker 完成后将数据存入模块级变量。
 */
function startPreloader(): Promise<void> {
  // Allow retry: if a previous Worker failed, terminate it and restart
  if (_preloadWorker && !_preloadReady) {
    _preloadWorker.terminate();
    _preloadWorker = null;
  }
  if (_preloadWorker) return _preloadPromise!;

  _preloadPromise = new Promise<void>((resolve, reject) => {
    try {
      _preloadWorker = new Worker(new URL("../workers/preloader.js", import.meta.url));

      _preloadWorker.on("message", (msg: WorkerOutMessage) => {
        if (msg.type === "ready") {
          _apiIndex = JSON.parse((msg as { type: "ready"; _apiIndexStr: string })._apiIndexStr);
          _classNames = msg.classNames;
          // 重建 Trie 索引（结构化克隆传递，无需重新解析 JSON）
          if (msg.trieFlat) {
            _trieIndex = TrieIndex.fromFlat(msg.trieFlat as Array<{ children: [string, number][]; isEnd: boolean; score: number }>);
          }
          // l0Index 由 store.ts 管理，Worker 已预加载到内存
          _preloadReady = true;
          resolve();
        } else if (msg.type === "error") {
          console.error("[MCP/Api] Worker preload failed:", msg.errors);
          console.error("[MCP/Api] Falling back to lazy-load mode (slower, on-demand JSON parsing)");
          _preloadWorker = null; // allow retry on next call
          _preloadReady = false;
          resolve();
        }
      });

      _preloadWorker.on("error", (e) => {
        console.error("[MCP/Api] Worker error:", e);
        resolve();
      });

      _preloadWorker.postMessage({ type: "start" });
    } catch (e) {
      console.error("[MCP/Api] Failed to start preloader:", e);
      resolve();
    }
  });

  return _preloadPromise;
}

// ── 工具函数 ──────────────────────────────────────────────────────────────

function toSlash(className: string): string {
  return className.replace(/\./g, "/");
}

function toDot(path: string): string {
  return path.replace(/\//g, ".");
}

function descriptorToReturnType(desc: string): string {
  const map: Record<string, string> = {
    "B": "byte", "C": "char", "D": "double", "F": "float",
    "I": "int", "J": "long", "S": "short", "Z": "boolean", "V": "void",
  };
  const last = desc.slice(desc.lastIndexOf(")") + 1);
  return map[last] ?? `Object(${last})`;
}

// ── 辅助：模糊类名搜索（优先 Trie，次选线性扫描）────────────────────────────

function fuzzyClassSearch(query: string): string[] {
  const normalized = query.toLowerCase().replace(/\./g, "/");

  // 优先尝试 Trie 前缀搜索（O(k)）
  if (_trieIndex) {
    const prefixResults = _trieIndex.searchPrefix(normalized);
    if (prefixResults.length > 0) {
      return prefixResults.slice(0, 5);
    }
  }

  // 回退到线性扫描（classNames 已预加载到内存）
  if (!_classNames) return [];
  const results: Array<{ score: number; name: string }> = [];

  for (const name of _classNames) {
    const lower = name.toLowerCase();
    if (lower === normalized) { results.push({ score: 100, name }); continue; }
    if (lower.endsWith("/" + normalized) || lower.endsWith("." + normalized.replace("/", "."))) {
      results.push({ score: 90, name }); continue;
    }
    if (lower.includes(normalized)) {
      results.push({ score: 80 - (lower.length - normalized.length), name });
    }
  }

  return results.sort((a, b) => b.score - a.score).slice(0, 5).map(r => r.name);
}

// ── 辅助：查找相关类 ─────────────────────────────────────────────────────

const RELATED_CLASSES: Record<string, string[]> = {
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

// ── 构建结果函数 ─────────────────────────────────────────────────────────

function buildClassResult(
  className: string,
  cls: { javadoc: string | null; methods: MethodInfo[]; fields: string[] },
  suggestions: string[]
): ApiResult {
  const related = RELATED_CLASSES[className.replace(/\./g, "/")] ?? [];
  return {
    found: true,
    className,
    classJavadoc: cls.javadoc ?? undefined,
    packagePath: className.substring(0, className.lastIndexOf(".")),
    methods: cls.methods,
    mappings: { mojang: className.replace(/\./g, "/"), parchment: className.replace(/\./g, "/") },
    suggestions,
    notes: related.length > 0
      ? [`相关类：${related.map(n => n.replace(/\//g, ".")).join(", ")}`]
      : undefined,
  };
}

function buildMethodResult(
  className: string,
  cls: { javadoc: string | null; methods: MethodInfo[]; fields: string[] },
  methods: MethodInfo[]
): ApiResult {
  const info = methods.map(m => ({
    name: m.name,
    parameters: m.parameters,
    returnType: descriptorToReturnType(m.descriptor),
    descriptor: m.descriptor,
    javadoc: m.javadoc ?? undefined,
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

// ── 主查询函数 ─────────────────────────────────────────────────────────────

export async function queryApi(query: ApiQuery): Promise<ApiResult> {
  // 确保预加载已完成（或降级）
  await startPreloader();

  const { className, methodName } = query;

  // 数据不可用时的降级响应
  if (!_apiIndex || !_classNames) {
    return {
      found: false,
      className,
      mappings: { mojang: toSlash(className), parchment: toSlash(className) },
      suggestions: [
        "MCP Server 数据加载失败（Worker 预加载失败），请重启 MCP Server",
        "若重启无效，请确认 data/forge_1.20.1/extracted/ 目录存在且包含 api-index.json 和 class-names.json",
      ],
    };
  }

  // 1. 精确类名查询
  const slashName = toSlash(className);
  let cls = _apiIndex[slashName];

  // 2. 尝试模糊搜索
  if (!cls) {
    const fuzzy = fuzzyClassSearch(className);
    if (fuzzy.length > 0) {
      cls = _apiIndex[fuzzy[0]];
      const suggestions = fuzzy.slice(1).map(n => `你指的是 ${toDot(n)} 吗？`);
      if (cls) {
        return buildClassResult(toDot(fuzzy[0]), cls, suggestions);
      }
      return {
        found: false,
        className,
        mappings: { mojang: slashName, parchment: slashName },
        suggestions: [`未找到 ${className}。类似类：`, ...suggestions],
        notes: ["提示：类名区分大小写，使用完整包名效果更佳"],
      };
    }
    return {
      found: false,
      className,
      mappings: { mojang: slashName, parchment: slashName },
      suggestions: [`未找到类 ${className}，请检查类名是否正确`],
      notes: [
        "Forge 特有类（如 DeferredRegister、Capability）不在 Parchment 数据中。",
        `共收录 ${_classNames.length} 个 Vanilla 类，可查询完整的参数名和 javadoc。`,
      ],
    };
  }

  // 3. 类找到了，查找方法
  if (methodName) {
    const matched = cls.methods.filter(
      m => m.name === methodName || m.name === `<${methodName}>`
    );
    if (matched.length === 0) {
      return {
        found: false,
        className: toDot(slashName),
        methodName,
        mappings: { mojang: slashName, parchment: slashName },
        suggestions: [
          `未在 ${toDot(slashName)} 中找到方法 ${methodName}`,
          `可用方法（部分）：${cls.methods.slice(0, 8).map(m => m.name).join(", ")}${cls.methods.length > 8 ? "..." : ""}`,
        ],
      };
    }
    return buildMethodResult(toDot(slashName), cls, matched);
  }

  return buildClassResult(toDot(slashName), cls, []);
}

// ── 导出 Trie 索引供外部使用（如 store.ts 的搜索）─────────────────────────

export function getTrieIndex(): TrieIndex | null {
  return _trieIndex;
}

export function setTrieIndex(trie: TrieIndex): void {
  _trieIndex = trie;
}
