/**
 * 语义索引可用性探测（inspectDb.mode !== "missing" / 只读 sqlite meta，不加载嵌入模型）。
 */
import { existsSync, readFileSync, readdirSync, statSync } from "fs";
import { join } from "path";
import { DatabaseSync } from "node:sqlite";
import type { StatementSync } from "node:sqlite";
import { EMBEDDING_MODEL } from "./embeddings.js";
import { semanticDbPath } from "./search.js";
import { isSemanticIndexStale } from "./fingerprint.js";
import { REGISTRY_DB_CAP } from "../../registry/store.js";

export type SemanticModeHint = "hybrid" | "fts5-only" | "l0-only";

// ── A-38：只读句柄 LRU + meta 结果 memo（诊断用计数，不改 inspectDb 返回形状）──────
//
// 旧实现每次 inspectDb 都 new DatabaseSync + prepare，diagnose_data_paths 一趟要对
// 每棵文档树旁的 db.sqlite 各开一次（本仓库语义库实测 57 个 → 57 open / ~230 prepare）。
// 这里改成与 registry/store.ts:5-25 同形态的有界 LRU（上限 = REGISTRY_DB_CAP 同值 8），
// 并叠加「按 (mtimeMs,size) 失效的 meta memo」：句柄数与 N 彻底解耦。
// 参照 mappings/yarn-sqlite.ts 的 withReadOnlyDb：所有读都在 try/finally 里，
// 出错即丢弃该句柄（不缓存坏 handle），但坏结果本身会被 memo 住，避免每趟重试。

/** 同时持有的只读语义库句柄上限（唯一来源：registry/store.ts 的 REGISTRY_DB_CAP） */
export { REGISTRY_DB_CAP as SEMANTIC_DB_LRU_CAP };
/** meta 结果缓存条目上限（只缓存极小的标量，不缓存行数据） */
const META_MEMO_CAP = 512;
/** meta 结果最长有效期；(mtimeMs,size) 一致时也只信这么久 */
const META_MEMO_TTL_MS = 5 * 60 * 1000;

const _dbLru = new Map<string, DatabaseSync>();
const _stmtCache = new WeakMap<DatabaseSync, Map<string, StatementSync>>();

type InspectedInfo = ReturnType<typeof inspectDb>;

const _metaMemo = new Map<
  string,
  { mtimeMs: number; size: number; at: number; info: InspectedInfo }
>();

export interface SemanticReadStats {
  /** 当前持有的只读 sqlite 句柄数（LRU size）——恒 <= cap，与文档树数量无关 */
  dbOpens: number;
  /** 当前句柄上缓存的 prepared 语句总数——同样与文档树数量无关 */
  dbPrepares: number;
  cap: number;
  /** 进程累计：真正执行过多少次 new DatabaseSync（冷启动第一趟才会到 N） */
  opensTotal: number;
  /** 进程累计：真正执行过多少次 prepare() */
  preparesTotal: number;
  memoHits: number;
  memoMisses: number;
  evictions: number;
}

const _counters = { opensTotal: 0, preparesTotal: 0, memoHits: 0, memoMisses: 0, evictions: 0 };

export function getSemanticReadStats(): SemanticReadStats {
  let prepares = 0;
  for (const db of _dbLru.values()) prepares += _stmtCache.get(db)?.size ?? 0;
  return {
    dbOpens: _dbLru.size,
    dbPrepares: prepares,
    cap: REGISTRY_DB_CAP,
    ..._counters,
  };
}

/** 测试/退出用：释放本模块持有的全部只读句柄与缓存 */
export function closeSemanticStatusDbs(): void {
  for (const db of _dbLru.values()) {
    try {
      db.close();
    } catch {
      /* already closed */
    }
  }
  _dbLru.clear();
  _metaMemo.clear();
  _counters.opensTotal = 0;
  _counters.preparesTotal = 0;
  _counters.memoHits = 0;
  _counters.memoMisses = 0;
  _counters.evictions = 0;
}

function getCachedReadDb(dbPath: string): DatabaseSync | null {
  const cached = _dbLru.get(dbPath);
  if (cached) {
    _dbLru.delete(dbPath);
    _dbLru.set(dbPath, cached);
    return cached;
  }
  let db: DatabaseSync;
  try {
    db = new DatabaseSync(dbPath, { readOnly: true });
  } catch {
    return null;
  }
  _counters.opensTotal++;
  _dbLru.set(dbPath, db);
  while (_dbLru.size > REGISTRY_DB_CAP) {
    const oldest = _dbLru.keys().next().value;
    if (oldest === undefined) break;
    const old = _dbLru.get(oldest);
    _dbLru.delete(oldest);
    _counters.evictions++;
    try {
      old?.close();
    } catch {
      /* ignore */
    }
  }
  return db;
}

/** 同一 handle 上同一条 SQL 只 prepare 一次（registry/store.ts 每条都重拍，这里更省） */
function prep(db: DatabaseSync, sql: string): StatementSync {
  let stmts = _stmtCache.get(db);
  if (!stmts) {
    stmts = new Map<string, StatementSync>();
    _stmtCache.set(db, stmts);
  }
  const hit = stmts.get(sql);
  if (hit) return hit;
  const stmt = db.prepare(sql);
  _counters.preparesTotal++;
  stmts.set(sql, stmt);
  return stmt;
}

function dropHandle(dbPath: string): void {
  const db = _dbLru.get(dbPath);
  if (!db) return;
  _dbLru.delete(dbPath);
  try {
    db.close();
  } catch {
    /* ignore */
  }
}

export interface SemanticSample {
  platform: string;
  version: string;
  source: string;
  dbPath: string;
  exists: boolean;
  docs?: number;
  chunks?: number;
  embedded?: number;
  mode: "hybrid" | "fts5-only" | "missing";
  stale?: boolean;
  staleReason?: string;
}

export interface SemanticIndexStatus {
  modelsReady: boolean;
  modelsPath: string;
  embeddingModel: string;
  modeHint: SemanticModeHint;
  samples: SemanticSample[];
  presentCount: number;
  hybridCount: number;
  fts5OnlyCount: number;
  /** 缺库 / 缺模型时非空；缺库不抛错但必须 warning */
  /** 缺库 / 缺模型 / 索引过期时非空 */
  warnings: string[];
  staleCount: number;
  /**
   * A-38：只读侧诊断计数（非契约字段，仅用于证明「开库数与文档树数量解耦」）。
   * dbOpens 恒 <= SEMANTIC_DB_LRU_CAP，与 dataRoot 下有多少个 db.sqlite 无关。
   */
  readStats: SemanticReadStats;
}

const SAMPLE_TARGETS: Array<{ platform: string; version: string; source: string }> = [
  { platform: "forge", version: "1.20.1", source: "forge-docs" },
  { platform: "fabric", version: "1.20.1", source: "fabric-docs" },
  { platform: "fabric", version: "1.20.1", source: "fabric-wiki" },
  { platform: "neoforge", version: "1.20.4", source: "neoforge-docs" },
  { platform: "neoforge", version: "1.21.1", source: "neoforge-docs" },
  { platform: "quilt", version: "1.20.1", source: "quilt-docs" },
  { platform: "bedrock", version: "stable", source: "bedrock-docs" },
];

/** 页少（1–3）故意不建向量库；缺 db 不算漏建。LiteLoader/Rift 已有官方 wiki + hybrid 库。 */
const L0_ONLY_TREES = new Set([
  "modloader_1.6.4/modloader-docs",
  "modloader_1.5.2/modloader-docs",
  "modloader_1.2.5/modloader-docs",
]);

export function isIntentionalL0Only(platform: string, version: string, source: string): boolean {
  return L0_ONLY_TREES.has(`${platform}_${version}/${source}`);
}

/**
 * B-5：动态判定「刻意置空」树——index-l0.json 存在且为 []，或树内有 failures.json 凭据。
 * 这类树 search 已回落 wiki 并带响亮警示，不是缺库；与静态 L0_ONLY 白名单分开报告。
 */
export function isIntentionallyClearedTree(
  dataRoot: string,
  platform: string,
  version: string,
  source: string,
): boolean {
  if (isIntentionalL0Only(platform, version, source)) return true;
  const base = join(dataRoot, `${platform}_${version}`, source);
  if (!existsSync(base)) return false;
  if (existsSync(join(base, "failures.json"))) return true;
  if (version && version !== "stable") {
    const l0Path = join(base, version, "index-l0.json");
    if (existsSync(l0Path)) {
      try {
        const parsed: unknown = JSON.parse(readFileSync(l0Path, "utf8"));
        if (Array.isArray(parsed) && parsed.length === 0) return true;
      } catch {
        /* 解析失败按非置空处理（真坏文件会走缺库路径） */
      }
    }
  }
  return false;
}

/** onnx 权重文件名按优先级排列。`fetch-embedding-model.mjs` 实际分发的是量化版。 */
const ONNX_WEIGHT_CANDIDATES = [
  ["onnx", "model_quantized.onnx"],
  ["onnx", "model.onnx"],
  ["model_quantized.onnx"],
  ["model.onnx"],
] as const;

function modelsDirReady(dataRoot: string): boolean {
  const root = join(dataRoot, "_models", "Xenova", "all-MiniLM-L6-v2");
  if (!existsSync(root)) return false;
  if (!existsSync(join(root, "config.json")) || !existsSync(join(root, "tokenizer.json"))) {
    return false;
  }
  // 只要任一候选权重存在即可。旧实现只认 model.onnx，而实际分发的是
  // onnx/model_quantized.onnx → 模型明明可用却误报 fts5-only。
  return ONNX_WEIGHT_CANDIDATES.some((parts) => existsSync(join(root, ...parts)));
}

export function inspectSemanticDb(dbPath: string): Pick<SemanticSample, "docs" | "chunks" | "embedded" | "mode"> & {
  builtAt?: string;
  fingerprint?: string;
} {
  return inspectDb(dbPath);
}

function inspectDb(dbPath: string): Pick<SemanticSample, "docs" | "chunks" | "embedded" | "mode"> & {
  builtAt?: string;
  fingerprint?: string;
} {
  if (!existsSync(dbPath)) return { mode: "missing" };
  // A-38：句柄 + meta 结果两级缓存。存在性判定语义不变——仍然必须是
  // 「能开库且 meta/docs+chunks 非空」，空文件 / 垃圾文件 / 无 meta 表都算 missing
  // （test-core.mjs:2717-2729 三条断言依赖这一点，不得退化成 statSync.size>0）。
  let st: ReturnType<typeof statSync> | undefined;
  try {
    st = statSync(dbPath);
  } catch {
    return { mode: "missing" };
  }
  const now = Date.now();
  const memo = _metaMemo.get(dbPath);
  if (memo && memo.mtimeMs === st.mtimeMs && memo.size === st.size && now - memo.at < META_MEMO_TTL_MS) {
    _counters.memoHits++;
    return memo.info;
  }
  _counters.memoMisses++;
  const info = readSemanticMeta(dbPath);
  _metaMemo.set(dbPath, { mtimeMs: st.mtimeMs, size: st.size, at: now, info });
  if (_metaMemo.size > META_MEMO_CAP) {
    const oldest = _metaMemo.keys().next().value;
    if (oldest !== undefined) _metaMemo.delete(oldest);
  }
  return info;
}

/** 真正读一次 meta；只在 memo 未命中时被调用。句柄由 LRU 持有，不在这里 close。 */
function readSemanticMeta(dbPath: string): ReturnType<typeof inspectDb> {
  const db = getCachedReadDb(dbPath);
  if (!db) return { mode: "missing" };
  try {
    const meta = (key: string) => {
      const row = prep(db, "SELECT value FROM meta WHERE key = ?").get(key) as
        | { value: string }
        | undefined;
      return row?.value;
    };
    const docs = Number(meta("docs") ?? 0);
    const chunks = Number(meta("chunks") ?? 0);
    let embedded = Number(meta("embedded") ?? 0);
    if (!embedded) {
      try {
        const row = prep(db, "SELECT COUNT(*) AS n FROM chunk_embeddings").get() as { n: number };
        embedded = Number(row?.n ?? 0);
      } catch {
        embedded = 0;
      }
    }
    const builtAt = meta("built_at");
    const fingerprint = meta("source_fingerprint");
    return {
      docs,
      chunks,
      embedded,
      builtAt,
      fingerprint,
      mode: embedded > 0 ? "hybrid" : chunks > 0 || docs > 0 ? "fts5-only" : "missing",
    };
  } catch {
    // 开成功但读失败（垃圾/半写）→ 丢弃该句柄，下次重新尝试；结果仍然 memo 成 missing
    dropHandle(dbPath);
    return { mode: "missing" };
  }
}

/** 扫描 dataRoot 下各文档树旁的 semantic/db.sqlite（轻量，供 diagnose） */
export function listSemanticDbPresence(dataRoot: string): Array<{
  platform: string;
  version: string;
  source: string;
  path: string;
  exists: boolean;
}> {
  const out: Array<{ platform: string; version: string; source: string; path: string; exists: boolean }> = [];
  if (!existsSync(dataRoot)) return out;
  const sourcesByPrefix: Record<string, string[]> = {
    forge_: ["forge-docs"],
    fabric_: ["fabric-docs", "fabric-wiki"],
    neoforge_: ["neoforge-docs"],
    quilt_: ["quilt-docs"],
    liteloader_: ["liteloader-docs"],
    rift_: ["rift-docs"],
    modloader_: ["modloader-docs"],
    bedrock_: ["bedrock-docs"],
  };
  let entries: string[] = [];
  try {
    entries = readdirSync(dataRoot).filter((n) => {
      try {
        return statSync(join(dataRoot, n)).isDirectory();
      } catch {
        return false;
      }
    });
  } catch {
    return out;
  }
  for (const name of entries) {
    for (const [prefix, sources] of Object.entries(sourcesByPrefix)) {
      if (!name.startsWith(prefix)) continue;
      const platform = prefix.slice(0, -1);
      const version = name.slice(prefix.length);
      if (!version) continue;
      if (!/^\d/.test(version) && version !== "stable") continue;
      for (const source of sources) {
        const sourceDir = join(dataRoot, name, source);
        if (!existsSync(sourceDir)) continue;
        const dbPath = semanticDbPath(dataRoot, platform, version, source);
        out.push({
          platform,
          version,
          source,
          path: dbPath,
          exists: inspectDb(dbPath).mode !== "missing",
        });
      }
    }
  }
  return out;
}

/** 规范：语义库缺失必须 warning（不抛错、不假装 hybrid） */
export function buildSemanticWarnings(opts: {
  present: number;
  total: number;
  modelsReady: boolean;
  missingSamples?: Array<{ platform: string; version: string; source: string }>;
}): string[] {
  const warnings: string[] = [];
  if (opts.total <= 0) {
    warnings.push(
      "未扫描到任何文档树旁的 semantic/db.sqlite 探测点（可能尚未下载平台数据包）。search_*_docs 仅 L0。",
    );
    return warnings;
  }
  if (opts.present < opts.total) {
    const miss = opts.total - opts.present;
    const extra = opts.missingSamples
      ?.slice(0, 8)
      .map((s) => `${s.platform}_${s.version}/${s.source}`)
      .join(", ");
    warnings.push(
      `语义索引缺库：${opts.present}/${opts.total} 个 db.sqlite 存在（缺 ${miss}）${extra ? `，例如 ${extra}` : ""}。缺库版本的 search_*_docs 回退 L0。补齐：在 mcp-server 执行 npm run build:semantic-index`,
    );
  }
  if (!opts.modelsReady) {
    warnings.push(
      "嵌入模型未就绪（data/_models/Xenova/all-MiniLM-L6-v2），即使有语义库也只能 FTS5 而非 hybrid。可执行 npm run fetch:embedding-model",
    );
  }
  return warnings;
}

export function missingSemanticDbWarning(missing: boolean): string | undefined {
  if (!missing) return undefined;
  return "语义索引缺库，本次已回退 L0 关键词检索。详见 diagnose_data_paths.semantic.warnings；补齐可运行 npm run build:semantic-index";
}

/** search_docs 命中带 stale warning（不静默重建） */
export function semanticStaleSearchWarning(
  dataRoot: string,
  platform: string,
  version: string,
  source: string,
): string | undefined {
  const dbPath = semanticDbPath(dataRoot, platform, version, source);
  if (!existsSync(dbPath)) return undefined;
  const info = inspectDb(dbPath);
  if (info.mode === "missing") return undefined;
  const versionDir = join(dataRoot, `${platform}_${version}`, source, version);
  const stale = isSemanticIndexStale({
    builtAtIso: info.builtAt,
    storedFingerprint: info.fingerprint,
    versionDir,
  });
  if (!stale.stale) return undefined;
  return `语义索引过期（stale）${stale.reason ? `：${stale.reason}` : ""}。命中可能不是最新 processed/。请运行 npm run build:semantic-index -- --platform=${platform} --version=${version} --force`;
}

export function getSemanticIndexStatus(dataRoot: string): SemanticIndexStatus {
  const modelsPath = join(dataRoot, "_models");
  const modelsReady = modelsDirReady(dataRoot);
  const samples: SemanticSample[] = SAMPLE_TARGETS.filter((t) =>
    existsSync(join(dataRoot, `${t.platform}_${t.version}`, t.source)),
  ).map((t) => {
    const dbPath = semanticDbPath(dataRoot, t.platform, t.version, t.source);
    const info = inspectDb(dbPath);
    const versionDir = join(dataRoot, `${t.platform}_${t.version}`, t.source, t.version);
    const staleInfo =
      info.mode === "missing"
        ? { stale: false as const }
        : isSemanticIndexStale({
            builtAtIso: info.builtAt,
            storedFingerprint: info.fingerprint,
            versionDir,
          });
    return {
      ...t,
      dbPath,
      exists: info.mode !== "missing",
      docs: info.docs,
      chunks: info.chunks,
      embedded: info.embedded,
      mode: info.mode,
      stale: staleInfo.stale,
      staleReason: staleInfo.reason,
    };
  });
  const presentCount = samples.filter((s) => s.exists).length;
  const hybridCount = samples.filter((s) => s.mode === "hybrid").length;
  const fts5OnlyCount = samples.filter((s) => s.mode === "fts5-only").length;
  const staleCount = samples.filter((s) => s.stale).length;
  let modeHint: SemanticModeHint = "l0-only";
  if (hybridCount > 0 && modelsReady) modeHint = "hybrid";
  else if (presentCount > 0) modeHint = "fts5-only";
  else modeHint = "l0-only";
  const presence = listSemanticDbPresence(dataRoot);
  const presentAll = presence.filter((s) => s.exists).length;
  // B-5：「刻意置空」（index-l0=[] / failures.json / L0 白名单）不算缺库，单独提示；
  // 只有真缺库才进缺库警告
  const cleared = presence.filter(
    (s) => !s.exists && isIntentionallyClearedTree(dataRoot, s.platform, s.version, s.source),
  );
  const missingSamples = presence.filter(
    (s) => !s.exists && !isIntentionallyClearedTree(dataRoot, s.platform, s.version, s.source),
  );
  const l0Only = cleared.filter((s) => isIntentionalL0Only(s.platform, s.version, s.source));
  const totalCounted = presence.length > 0 ? presence.length - cleared.length : samples.length;
  const warnings = buildSemanticWarnings({
    present: presence.length > 0 ? presentAll : presentCount,
    total: presence.length > 0 ? Math.max(totalCounted, presentAll) : samples.length,
    modelsReady,
    missingSamples: presence.length > 0 ? missingSamples : samples.filter((s) => !s.exists),
  });
  if (cleared.length) {
    warnings.push(
      `下列 ${cleared.length} 棵文档树为刻意置空（index-l0 为 [] 或有 failures.json 凭据；search 已回落 wiki/带警示，不是缺库）：${cleared
        .slice(0, 8)
        .map((s) => `${s.platform}_${s.version}/${s.source}`)
        .join(", ")}。`,
    );
  }
  for (const s of samples.filter((x) => x.stale)) {
    warnings.push(
      `语义索引过期（stale）：${s.platform}_${s.version}/${s.source}${s.staleReason ? `（${s.staleReason}）` : ""}。processed/ 新于 sqlite 或指纹不一致。请运行 npm run build:semantic-index -- --platform=${s.platform} --version=${s.version} --force`,
    );
  }
  return {
    modelsReady,
    modelsPath,
    embeddingModel: EMBEDDING_MODEL,
    modeHint,
    samples,
    presentCount,
    hybridCount,
    fts5OnlyCount,
    staleCount,
    warnings,
    // 放在最后：本次扫描结束后取快照，才能代表「这一趟留下多少活句柄」
    readStats: getSemanticReadStats(),
  };
}
