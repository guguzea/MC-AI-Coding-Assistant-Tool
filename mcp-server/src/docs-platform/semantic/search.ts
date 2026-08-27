/**
 * 语义检索（离线）：FTS5 BM25（全文关键词）+ 余弦相似度（语义向量），RRF k=60 融合。
 *
 * 设计约束：
 * - semanticSearch 永不该抛异常：db 缺失/损坏/模型加载失败 → null（调用方保持纯 L0 行为）
 * - FTS5 是同步可独立使用的兜底（fts5TopDocsSync）：嵌入层失败时仍有全文召回
 * - 无嵌入的库（embeddings 表为空）直接跳过模型加载，走纯 FTS5
 */
import { existsSync, statSync } from "fs";
import { join } from "path";
import { DatabaseSync } from "node:sqlite";
import { cosine, EMBEDDING_DIM, getEmbedder } from "./embeddings.js";

export interface SemanticMatchSnippet {
  /** 来自 chunk 正文首行 `#` 标题，或 chunk_type 回退 */
  sectionHeading?: string;
  snippet: string;
  score: number;
}

export interface SemanticHit {
  docId: string;
  score: number;
  label: string;
  url?: string;
  tags: string[];
  priority: string;
  sectionCount?: number;
  /** 来自 chunks 表的 top-K 命中片段（非 docs 表捏造） */
  matches?: SemanticMatchSnippet[];
}

/** 语义库 schema（构建脚本与运行时共享的唯一 DDL 源） */
export const SEMANTIC_DDL = `
CREATE TABLE IF NOT EXISTS meta (key TEXT PRIMARY KEY, value TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS docs (
  doc_id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  url TEXT,
  tags_json TEXT NOT NULL DEFAULT '[]',
  priority TEXT NOT NULL DEFAULT '🟢',
  section_count INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS chunks (
  chunk_id TEXT PRIMARY KEY,
  doc_id TEXT NOT NULL,
  chunk_type TEXT NOT NULL,
  chunk_order INTEGER NOT NULL,
  text TEXT NOT NULL
);
CREATE VIRTUAL TABLE IF NOT EXISTS chunks_fts USING fts5(
  chunk_id UNINDEXED,
  text,
  tokenize = 'porter unicode61'
);
CREATE TABLE IF NOT EXISTS chunk_embeddings (
  chunk_id TEXT PRIMARY KEY,
  doc_id TEXT NOT NULL,
  embedding BLOB NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_chunks_doc ON chunks(doc_id);
CREATE INDEX IF NOT EXISTS idx_emb_doc ON chunk_embeddings(doc_id);
`;

/** FTS5 查询停用词（与 L0 搜索同风格；how/what 等疑问词不具区分度） */
const FTS_STOP_WORDS = new Set([
  "the", "and", "of", "to", "a", "in", "is", "it", "for", "on",
  "with", "as", "by", "at", "from", "or", "an", "be", "this",
  "that", "are", "was", "were", "has", "have", "had", "not",
  "how", "what", "when", "where", "which", "who", "can", "will",
]);

export function semanticDbPath(
  dataRoot: string,
  platform: string,
  version: string,
  source: string,
): string {
  return join(dataRoot, `${platform}_${version}`, source, version, "semantic", "db.sqlite");
}

/** 构造 FTS5 MATCH 表达式：`"tok"* AND "tok"*`；无有效 token → null */
const FTS_KEEP_SHORT = new Set(["ui", "ai", "id", "at", "be"]);

export function buildFtsQuery(query: string): string | null {
  const tokens = query
    .toLowerCase()
    .split(/[^a-z0-9_]+/)
    .filter((t) => {
      if (FTS_KEEP_SHORT.has(t)) return true;
      return t.length >= 2 && !FTS_STOP_WORDS.has(t);
    });
  if (tokens.length === 0) return null;
  return tokens.map((t) => `"${t.replace(/"/g, '""')}"*`).join(" AND ");
}

const _dbCache = new Map<string, { db: DatabaseSync | null; mtime: number; size: number }>();

type EmbMatrixCache = {
  mtime: number;
  size: number;
  chunkIds: string[];
  docIds: string[];
  matrix: Float32Array;
};
const _embMatrixCache = new Map<string, EmbMatrixCache>();
export let embeddingMatrixCacheHits = 0;

/** 关闭并清空所有缓存的语义库句柄（测试清理 / 数据重建时使用） */
export function closeSemanticDbs(): void {
  for (const e of _dbCache.values()) {
    try {
      e.db?.close();
    } catch {
      // 已关闭或损坏句柄，忽略
    }
  }
  _dbCache.clear();
  _embMatrixCache.clear();
  embeddingMatrixCacheHits = 0;
}

function loadEmbeddingMatrix(db: DatabaseSync, dbPath: string): EmbMatrixCache | null {
  let st: { mtimeMs: number; size: number };
  try {
    st = statSync(dbPath);
  } catch {
    return null;
  }
  const hit = _embMatrixCache.get(dbPath);
  if (hit && hit.mtime === st.mtimeMs && hit.size === st.size) {
    embeddingMatrixCacheHits += 1;
    return hit;
  }
  const rows = db
    .prepare("SELECT chunk_id, doc_id, embedding FROM chunk_embeddings")
    .all() as Array<{ chunk_id: string; doc_id: string; embedding: Uint8Array }>;
  const chunkIds: string[] = [];
  const docIds: string[] = [];
  const kept: Float32Array[] = [];
  for (const r of rows) {
    if (r.embedding.byteLength < EMBEDDING_DIM * 4) continue;
    kept.push(new Float32Array(r.embedding.buffer, r.embedding.byteOffset, EMBEDDING_DIM));
    chunkIds.push(r.chunk_id);
    docIds.push(r.doc_id);
  }
  const matrix = new Float32Array(kept.length * EMBEDDING_DIM);
  kept.forEach((v, i) => matrix.set(v, i * EMBEDDING_DIM));
  const packed: EmbMatrixCache = { mtime: st.mtimeMs, size: st.size, chunkIds, docIds, matrix };
  _embMatrixCache.set(dbPath, packed);
  return packed;
}

/** 只读打开语义库（缓存）；缺失不负缓存；损坏按 mtime/size 复检 */
export function openSemanticDb(dbPath: string): DatabaseSync | null {
  let st: { mtimeMs: number; size: number } | null = null;
  try {
    if (existsSync(dbPath)) st = statSync(dbPath);
  } catch {
    st = null;
  }
  const hit = _dbCache.get(dbPath);
  if (hit) {
    if (st && hit.mtime === st.mtimeMs && hit.size === st.size) return hit.db;
    try {
      hit.db?.close();
    } catch {
      /* ignore */
    }
    _dbCache.delete(dbPath);
  }
  let db: DatabaseSync | null = null;
  if (st) {
    try {
      const candidate = new DatabaseSync(dbPath, { readOnly: true });
      const row = candidate
        .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='chunks_fts'")
        .get() as { name: string } | undefined;
      if (row) {
        db = candidate;
      } else {
        candidate.close();
      }
    } catch {
      db = null;
    }
    _dbCache.set(dbPath, { db, mtime: st.mtimeMs, size: st.size });
  }
  return db;
}

/** FTS5 全文关键词命中（doc_id 有序去重，BM25 升序），任何失败 → [] */
export function fts5TopDocsSync(query: string, dbPath: string, limit = 20): string[] {
  const db = openSemanticDb(dbPath);
  if (!db) return [];
  const fts = buildFtsQuery(query);
  if (!fts) return cjkLikeDocIdsSync(query, db, limit);
  return ftsMatchExec(db, fts, limit);
}

/** 对给定 MATCH 表达式执行检索（供查询扩展的 OR 组复用） */
function ftsMatchExec(db: DatabaseSync, fts: string, limit: number): string[] {
  try {
    const rows = db
      .prepare(
        `SELECT c.doc_id AS doc_id
         FROM chunks_fts f JOIN chunks c ON c.chunk_id = f.chunk_id
         WHERE chunks_fts MATCH ? ORDER BY bm25(chunks_fts) LIMIT ?`,
      )
      .all(fts, Math.max(1, Math.min(100, limit))) as Array<{ doc_id: string }>;
    const seen = new Set<string>();
    const out: string[] = [];
    for (const r of rows) {
      if (!seen.has(r.doc_id)) {
        seen.add(r.doc_id);
        out.push(r.doc_id);
      }
    }
    return out;
  } catch {
    return [];
  }
}

/** CJK bigram 分词（连续中日韩字符逐对组合；无配对时用单字符） */
export function cjkBigrams(query: string): string[] {
  const chars = (String(query ?? "").match(/[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uac00-\ud7af]+/g) ?? [])
    .join("")
    .split("");
  const out: string[] = [];
  for (let i = 0; i + 1 < chars.length; i++) out.push(chars[i] + chars[i + 1]);
  if (chars.length === 1) out.push(chars[0]);
  return out.slice(0, 6);
}

/** unicode61 索引把连续 CJK 当一个 token，FTS MATCH 无法拆词——CJK-only 查询走 LIKE bigram（OR 召回优先，命中数排序） */
function cjkLikeDocIdsSync(query: string, db: DatabaseSync, limit: number): string[] {
  const bigrams = cjkBigrams(query);
  if (bigrams.length === 0) return [];
  try {
    const conds = bigrams.map(() => "c.text LIKE ?");
    const rows = db
      .prepare(
        `SELECT c.doc_id AS doc_id, COUNT(*) AS hits
         FROM chunks c
         WHERE ${conds.join(" OR ")}
         GROUP BY c.doc_id ORDER BY hits DESC, MIN(c.chunk_order) LIMIT ?`,
      )
      .all(...bigrams.map((b) => `%${b}%`), Math.max(1, Math.min(100, limit))) as Array<{ doc_id: string }>;
    return rows.map((r) => r.doc_id);
  } catch {
    return [];
  }
}

/** Reciprocal Rank Fusion：多个 doc_id 排行融合，k=60（默认 RRF 参数） */
export function rrfFuse(rankings: string[][], k = 60): string[] {
  const scores = new Map<string, number>();
  for (const rank of rankings) {
    for (let i = 0; i < rank.length; i++) {
      const id = rank[i];
      if (id === undefined) continue;
      scores.set(id, (scores.get(id) ?? 0) + 1 / (k + i + 1));
    }
  }
  return [...scores.entries()].sort((a, b) => b[1] - a[1]).map(([id]) => id);
}

const MATCH_SNIPPET_MAX = 240;
const MATCHES_PER_DOC = 3;

function headingFromChunkText(text: string, chunkType: string): string | undefined {
  const line = text.split(/\r?\n/).find((l) => l.trim().length > 0)?.trim() ?? "";
  const m = line.match(/^#{1,6}\s+(.+)$/);
  if (m?.[1]) return m[1].trim();
  if (chunkType && chunkType !== "full") return chunkType;
  return undefined;
}

function truncateSnippet(text: string, max = MATCH_SNIPPET_MAX): string {
  const t = text.replace(/\s+/g, " ").trim();
  return t.length <= max ? t : `${t.slice(0, max - 1)}…`;
}

/** 从 chunks 表为入选 doc 取 top-K 片段（优先 FTS/嵌入分数，否则按 chunk_order） */
function topChunkMatches(
  db: DatabaseSync,
  docId: string,
  ftsQuery: string | null,
  chunkEmbScores: Map<string, number>,
  limit = MATCHES_PER_DOC,
): SemanticMatchSnippet[] {
  type Row = { chunk_id: string; chunk_type: string; text: string; score: number };
  const scored: Row[] = [];

  if (ftsQuery) {
    try {
      const rows = db
        .prepare(
          `SELECT c.chunk_id AS chunk_id, c.chunk_type AS chunk_type, c.text AS text,
                  bm25(chunks_fts) AS score
           FROM chunks_fts f
           JOIN chunks c ON c.chunk_id = f.chunk_id
           WHERE chunks_fts MATCH ? AND c.doc_id = ?
           ORDER BY bm25(chunks_fts)
           LIMIT ?`,
        )
        .all(ftsQuery, docId, limit) as Array<{
        chunk_id: string;
        chunk_type: string;
        text: string;
        score: number;
      }>;
      for (const r of rows) {
        const emb = chunkEmbScores.get(r.chunk_id);
        scored.push({
          chunk_id: r.chunk_id,
          chunk_type: r.chunk_type,
          text: r.text,
          score: emb !== undefined ? emb : Number((-r.score).toFixed(4)),
        });
      }
    } catch {
      // fall through
    }
  }

  if (scored.length === 0 && chunkEmbScores.size > 0) {
    try {
      const rows = db
        .prepare(
          `SELECT chunk_id, chunk_type, text FROM chunks WHERE doc_id = ? ORDER BY chunk_order LIMIT 50`,
        )
        .all(docId) as Array<{ chunk_id: string; chunk_type: string; text: string }>;
      const withScore = rows
        .map((r) => ({
          ...r,
          score: chunkEmbScores.get(r.chunk_id) ?? -1,
        }))
        .filter((r) => r.score >= 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);
      scored.push(...withScore);
    } catch {
      // fall through
    }
  }

  if (scored.length === 0) {
    try {
      const rows = db
        .prepare(
          `SELECT chunk_id, chunk_type, text FROM chunks WHERE doc_id = ? ORDER BY chunk_order LIMIT ?`,
        )
        .all(docId, limit) as Array<{ chunk_id: string; chunk_type: string; text: string }>;
      for (const r of rows) {
        scored.push({ ...r, score: chunkEmbScores.get(r.chunk_id) ?? 0 });
      }
    } catch {
      return [];
    }
  }

  return scored.slice(0, limit).map((r) => ({
    sectionHeading: headingFromChunkText(r.text, r.chunk_type),
    snippet: truncateSnippet(r.text),
    score: Number(r.score.toFixed(4)),
  }));
}

/**
 * 语义检索主入口：FTS5 + 余弦扫描，RRF 融合取 top。
 * - 语义库缺失/损坏 → null（调用方走纯 L0）
 * - 嵌入失败或无嵌入数据 → 仅 FTS5 结果
 * - 永不该抛异常
 */
export async function semanticSearch(
  query: string,
  platform: string,
  version: string,
  source: string,
  dataRoot: string,
  limit = 10,
  opts?: { ftsExpr?: string },
): Promise<SemanticHit[] | null> {
  if (!String(query ?? "").trim()) return null; // C19：空查询在 hybrid 下不得直达 embedder
  const dbPath = semanticDbPath(dataRoot, platform, version, source);
  const db = openSemanticDb(dbPath);
  if (!db) return null;
  try {
    const docsN = (db.prepare("SELECT COUNT(*) AS n FROM docs").get() as { n: number } | undefined)?.n ?? 0;
    const chunksN = (db.prepare("SELECT COUNT(*) AS n FROM chunks").get() as { n: number } | undefined)?.n ?? 0;
    if (docsN === 0 && chunksN === 0) return null;
  } catch {
    return null;
  }

  const ftsExpr = opts?.ftsExpr ?? buildFtsQuery(query);
  const ftsDocs = ftsExpr
    ? ftsMatchExec(db, ftsExpr, 30)
    : cjkLikeDocIdsSync(query, db, 30);

  const docBest = new Map<string, number>();
  const chunkEmbScores = new Map<string, number>();
  let semanticAvailable = false;
  try {
    const countRow = db.prepare("SELECT COUNT(*) AS n FROM chunk_embeddings").get() as { n: number };
    if (countRow.n > 0) {
      const embedder = await getEmbedder(dataRoot);
      const [qVec] = await embedder.embed([query]);
      if (qVec) {
        const packed = loadEmbeddingMatrix(db, dbPath);
        if (packed) {
          for (let i = 0; i < packed.chunkIds.length; i++) {
            const vec = packed.matrix.subarray(i * EMBEDDING_DIM, (i + 1) * EMBEDDING_DIM);
            const s = cosine(qVec, vec);
            chunkEmbScores.set(packed.chunkIds[i], s);
            const prev = docBest.get(packed.docIds[i]) ?? -1;
            if (s > prev) docBest.set(packed.docIds[i], s);
          }
          semanticAvailable = packed.chunkIds.length > 0;
        }
      }
    }
  } catch {
    // 嵌入层失败 → 仅 FTS5 结果
  }

  const semanticDocs = semanticAvailable
    ? [...docBest.entries()].sort((a, b) => b[1] - a[1]).slice(0, 30).map(([id]) => id)
    : [];

  // 融合与取回段：部分损坏库（有 chunks_fts 但缺 docs/chunk_embeddings 表）在此抛错，
  // 按模块契约「永不该抛异常」吞掉并返回 null → 调用方保持纯 L0 行为（F-D102）
  try {
    const fused = rrfFuse([ftsDocs, semanticDocs], 60).slice(0, limit);
    if (fused.length === 0) return [];

    const stmt = db.prepare(
      "SELECT label, url, tags_json, priority, section_count FROM docs WHERE doc_id = ?",
    );
    const hits: SemanticHit[] = [];
    for (const docId of fused) {
      const row = stmt.get(docId) as
        | { label: string; url: string | null; tags_json: string; priority: string; section_count: number }
        | undefined;
      if (!row) continue;
      let tags: string[] = [];
      try {
        tags = JSON.parse(row.tags_json ?? "[]");
      } catch {
        tags = [];
      }
      const matches = topChunkMatches(db, docId, ftsExpr, chunkEmbScores, MATCHES_PER_DOC);
      hits.push({
        docId,
        score: Number((docBest.get(docId) ?? 0).toFixed(4)),
        label: row.label,
        url: row.url ?? undefined,
        tags,
        priority: row.priority,
        sectionCount: row.section_count,
        ...(matches.length > 0 ? { matches } : {}),
      });
    }
    return hits;
  } catch {
    // 语义库结构异常 → 视同不可用，纯 L0
    return null;
  }
}
