/**
 * 跨平台文档检索共享工具
 * - 符号抽取 / L1 倒排索引
 * - CamelCase 拆分 / 词干归一
 * - relevance 打分（含 concepts/registry boost）
 */

import { readFileSync, statSync } from "fs";
import { join } from "path";
import { ownGet } from "../utils/own-record.js";
import { escapeRegExp } from "../utils/regex.js";
import { ActionCodes, actionable } from "../utils/actionable.js";

export interface ScoredDocHit {
  id: string;
  score: number;
}

export interface L0Like {
  id: string;
  label: string;
  url?: string;
  tags: string[];
  priority: string;
  version?: string;
  sectionCount?: number;
}

export interface L1Like {
  id: string;
  firstParagraph?: string;
  sections?: Array<{ title?: string; summary?: string }>;
}

export interface SymbolIndex {
  /** symbolLower -> docIds */
  inverted: Map<string, Set<string>>;
  /** docId -> L1 entry (for paragraph fallback) */
  byId: Map<string, L1Like>;
  /** approximate source size in bytes (from JSON.stringify or file size) */
  byteSize: number;
  /** how many times buildSymbolIndex was called for this cache slot */
  buildGeneration: number;
}

export const L1_PARAGRAPH_FALLBACK_MAX_BYTES = 2 * 1024 * 1024;
export const SYMBOL_INDEX_MAX_SYMBOLS = 50_000;

const QUERY_STOP_WORDS = new Set([
  "the", "and", "of", "to", "a", "in", "is", "it", "for", "on",
  "with", "as", "by", "at", "from", "or", "an", "be", "this",
  "that", "are", "was", "were", "has", "have", "had", "not",
  "how", "what", "when", "where", "which", "who", "can", "will",
]);

const SYMBOL_STOP = new Set([
  "this", "when", "important", "tip", "note", "true", "false",
  "that", "with", "from", "into", "over", "under", "after", "before",
  "using", "used", "use", "also", "only", "such", "than", "then",
  "else", "null", "void", "class", "public", "private", "static",
  "final", "return", "import", "package", "override", "extends",
  "implements", "interface", "enum", "new", "super", "throws",
]);

/** 短缩写白名单（NeoForge 原先 length>2 会丢掉） */
export const SHORT_QUERY_WHITELIST = new Set([
  "at", "be", "nbt", "gui", "ui", "ai", "id", "mc", "mod",
]);

/** L0/L1/L2 共用：精确 id、去版本前缀、或 `.../bare` 后缀。 */
export function matchDocIndexId(entryId: string, requested: string, version: string): boolean {
  const trimmed = requested.trim();
  if (!trimmed || !entryId) return false;
  const hasVerPrefix = /^(?:\d+\.\d+(?:\.\d+)?|stable)\//.test(trimmed);
  const normalized = hasVerPrefix ? trimmed : `${version}/${trimmed.replace(/\//g, "_")}`;
  const bare = normalized.replace(/^(?:\d+\.\d+(?:\.\d+)?|stable)\//, "");
  if (!bare) return entryId === normalized || entryId === trimmed;
  return (
    entryId === normalized ||
    entryId === trimmed ||
    entryId === bare ||
    entryId.endsWith(`/${bare}`)
  );
}

/** 短缩写 → 文档路径/标题常用全称（边界匹配 alone 打不中 Access Transformers） */
const ABBREV_EXPAND: Record<string, string[]> = {
  at: ["accesstransformer", "accesstransformers", "access", "transformer", "transformers"],
  be: ["blockentity", "blockentities", "tileentity", "tileentities"],
  nbt: ["compoundtag", "tag"],
  gui: ["screen", "screens", "menu", "menus"],
};

const CAMEL =
  /\b([A-Z][a-zA-Z0-9]+|[a-z][a-zA-Z0-9]*[A-Z][a-zA-Z0-9]*)\b/g;
const CONSTANT = /\b([A-Z][A-Z0-9_]{3,})\b/g;
const RES_PATH = /\b([a-z][a-z0-9_]*:[a-z][a-z0-9_/]*)\b/g;

const STEM_GROUPS: string[][] = [
  ["registry", "registries", "register", "registering", "registered", "registrar"],
  ["capability", "capabilities"],
  ["network", "networking"],
  ["datagen", "data-generation", "datageneration"],
  ["blockentity", "blockentities", "tileentity", "tileentities"],
];

const STEM_MAP = (() => {
  const m = new Map<string, string>();
  for (const g of STEM_GROUPS) {
    const canon = g[0];
    for (const w of g) m.set(w, canon);
  }
  return m;
})();

export function splitCamelCase(term: string): string[] {
  if (!term) return [];
  const parts = term
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .split(/[\s_\-.]+/)
    .map((p) => p.toLowerCase())
    .filter((p) => p.length > 0);
  return parts.length ? parts : [term.toLowerCase()];
}

export function stemToken(t: string): string {
  const lower = t.toLowerCase();
  return STEM_MAP.get(lower) ?? lower;
}

export function expandQueryTerms(raw: string): string[] {
  const out = new Set<string>();
  const lower = raw.toLowerCase();
  out.add(lower);
  const stem = stemToken(lower);
  out.add(stem);
  // 双向展开词干组（registry ↔ registries），否则搜 registry 打不中 label「Registries」
  for (const g of STEM_GROUPS) {
    if (g.includes(lower) || g[0] === stem) {
      for (const w of g) out.add(w);
    }
  }
  for (const p of splitCamelCase(raw)) {
    out.add(p);
    out.add(stemToken(p));
  }
  const abbr = ownGet(ABBREV_EXPAND, lower);
  if (abbr) {
    for (const w of abbr) out.add(w);
  }
  return [...out];
}

// ── 中英领域词典查询扩展（检索提升 v3）────────────────────────────────────
// 词典为运行时数据：data/_glossary/mc-zh-en.json（不入 dist）。懒加载 + mtime 热更新：
// 长驻进程内改词条即时生效。缺失/损坏 → 静默空扩展 = 无扩展的现状行为。

interface GlossaryState {
  mtimeMs: number;
  entries: Map<string, string[]>;
}

let _glossaryCache: GlossaryState | null = null;

/** 英文术语白名单：只放行安全 token（引号/冒号/*等 FTS 特殊字符从源头拒绝） */
const GLOSSARY_TERM_RE = /^[a-z0-9][a-z0-9 _-]*$/;

function loadGlossary(dataRoot: string): Map<string, string[]> {
  const p = join(dataRoot, "_glossary", "mc-zh-en.json");
  try {
    const st = statSync(p);
    if (_glossaryCache && st.mtimeMs === _glossaryCache.mtimeMs) return _glossaryCache.entries;
    const raw = JSON.parse(readFileSync(p, "utf8")) as { entries?: Record<string, unknown> };
    const entries = new Map<string, string[]>();
    for (const [zh, vals] of Object.entries(raw.entries ?? {})) {
      if (typeof zh !== "string" || zh.length < 2 || !Array.isArray(vals)) continue;
      const cleaned: string[] = [];
      for (const v of vals) {
        if (typeof v !== "string") continue;
        const t = v.trim().toLowerCase();
        if (!GLOSSARY_TERM_RE.test(t)) {
          console.error(`[mc-mcp-server] WARN: glossary term dropped (unsafe): ${JSON.stringify(v)}`);
          continue;
        }
        if (t.length > 0) cleaned.push(t);
      }
      if (cleaned.length > 0) entries.set(zh, cleaned);
    }
    _glossaryCache = { mtimeMs: st.mtimeMs, entries };
    return entries;
  } catch {
    return new Map();
  }
}

export interface ZhQueryExpansion {
  /** 原查询 + 空格 + 英文术语串（L0 与向量通道直接使用该文本） */
  text: string;
  terms: string[];
  expanded: boolean;
}

/**
 * 中文查询的领域术语扩展：最长匹配优先分段扫描——
 * 命中即消费区间，保证「数据组件」整体命中而不被拆成「数据」+「组件」，
 * 「物品栏」先尝试更长键、不被「物品」误出无关扩展。
 * 扩展只追加不替换原查询；无命中 / 词典缺失 → 原样返回。
 */
export function expandZhQuery(query: string, dataRoot: string): ZhQueryExpansion {
  const q = String(query ?? "");
  const entries = loadGlossary(dataRoot);
  if (q.length === 0 || entries.size === 0 || !/[\u3000-\u9fff]/.test(q)) {
    return { text: q, terms: [], expanded: false };
  }
  const keys = [...entries.keys()].sort((a, b) => b.length - a.length);
  const terms: string[] = [];
  let i = 0;
  while (i < q.length) {
    let matched = false;
    for (const k of keys) {
      if (q.startsWith(k, i)) {
        terms.push(...(entries.get(k) ?? []));
        i += k.length;
        matched = true;
        break;
      }
    }
    if (!matched) i += 1;
  }
  const uniq = [...new Set(terms)];
  if (uniq.length === 0) return { text: q, terms: [], expanded: false };
  return { text: `${q} ${uniq.join(" ")}`, terms: uniq, expanded: true };
}

/**
 * 扩展术语的 FTS5 OR 组（召回优先，bm25 自然按命中数排序）。
 * 术语已经加载期白名单净化，此处再做引号转义双保险；无有效术语 → null。
 */
export function buildExpandedFtsExpr(terms: string[]): string | null {
  const safe = terms.filter((t) => GLOSSARY_TERM_RE.test(t));
  if (safe.length === 0) return null;
  return `(${safe.map((t) => `"${t.replace(/"/g, '""')}"*`).join(" OR ")})`;
}

export function extractSymbols(text: string): string[] {
  if (!text) return [];
  const found = new Set<string>();
  for (const re of [CAMEL, CONSTANT, RES_PATH]) {
    re.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
      const s = m[1];
      if (!s || s.length < 3) continue;
      const key = s.toLowerCase();
      if (SYMBOL_STOP.has(key)) continue;
      found.add(s);
    }
  }
  return [...found];
}

export function buildSymbolIndex(
  entries: L1Like[],
  opts?: { byteSize?: number; maxSymbols?: number; generation?: number },
): SymbolIndex {
  const inverted = new Map<string, Set<string>>();
  const byId = new Map<string, L1Like>();
  const maxSymbols = opts?.maxSymbols ?? SYMBOL_INDEX_MAX_SYMBOLS;
  let symbolCount = 0;

  for (const e of entries) {
    byId.set(e.id, e);
    const chunks: string[] = [];
    if (e.firstParagraph) chunks.push(e.firstParagraph);
    for (const s of e.sections ?? []) {
      if (s.title) chunks.push(s.title);
      if (s.summary) chunks.push(s.summary);
    }
    const text = chunks.join("\n");
    for (const sym of extractSymbols(text)) {
      if (symbolCount >= maxSymbols) break;
      const key = sym.toLowerCase();
      let set = inverted.get(key);
      if (!set) {
        set = new Set();
        inverted.set(key, set);
        symbolCount++;
      }
      set.add(e.id);
    }
    if (symbolCount >= maxSymbols) break;
  }

  return {
    inverted,
    byId,
    byteSize: opts?.byteSize ?? 0,
    buildGeneration: opts?.generation ?? 1,
  };
}

function normalizeTag(t: string): string {
  return t.toLowerCase().replace(/-/g, "");
}

function priorityRank(p: string): number {
  if (p === "⭐" || p === "high") return 0;
  if (p === "🟡" || p === "medium") return 1;
  if (p === "🟢" || p === "low") return 2;
  return 3;
}

function isRegistryishQuery(terms: string[]): boolean {
  return terms.some((t) => {
    const s = stemToken(t);
    return s === "registry" || t.toLowerCase().includes("deferredregister");
  });
}

export function pathBoost(id: string, registryQuery: boolean): number {
  const idLower = id.toLowerCase();
  let boost = 0;
  if (registryQuery) {
    if (idLower.includes("concepts") && idLower.includes("registr")) boost += 12;
    else if (idLower.includes("registr")) boost += 8;
    if (idLower.includes("datagen")) boost -= 4;
  }
  return boost;
}

function l0FieldHit(e: L0Like, term: string): number {
  const t = term.toLowerCase();
  const stemmed = stemToken(t);
  let score = 0;
  const label = e.label.toLowerCase();
  const id = e.id.toLowerCase();
  const tags = e.tags.map(normalizeTag).join(" ");
  const url = (e.url ?? "").toLowerCase();

  const match = (hay: string, weight: number) => {
    // 短缩写（AT/BE/UI…）必须词边界匹配，避免 datagen/attachments 误中
    const useBoundary = t.length <= 2 || SHORT_QUERY_WHITELIST.has(t);
    if (useBoundary) {
      const re = new RegExp(`(?:^|[^a-z0-9])${escapeRegExp(t)}(?:[^a-z0-9]|$)`, "i");
      if (re.test(hay)) {
        score += weight;
        return;
      }
      // 仍允许词级词干相等（nbt 等）
      for (const part of hay.split(/[^a-z0-9]+/).filter(Boolean)) {
        if (stemToken(part) === stemmed && (part === t || part === stemmed)) {
          score += weight;
          return;
        }
      }
      return;
    }
    if (hay.includes(t) || hay.includes(stemmed)) {
      score += weight;
      return;
    }
    // 词级词干相等：registries ↔ registry
    for (const part of hay.split(/[^a-z0-9]+/).filter(Boolean)) {
      if (stemToken(part) === stemmed) {
        score += weight;
        return;
      }
    }
  };
  match(label, 5);
  match(id, 3);
  match(tags, 2);
  match(url, 1);

  // Fabric/NeoForge L0 常缺 registry tag：用路径/同义词增强
  if (stemmed === "registry" || stemmed === "datagen") {
    if (
      id.includes(stemmed) ||
      id.includes("register") ||
      id.includes("registr") ||
      label.includes("register") ||
      label.includes("registr")
    ) {
      score += 2;
    }
  }
  return score;
}

export interface EnhancedSearchOptions {
  query: string;
  l0: L0Like[];
  symbolIndex?: SymbolIndex | null;
  tags?: string[];
  limit?: number;
  /** allow length-1 tokens that are in whitelist; min length otherwise */
  minTokenLength?: number;
}

/**
 * 分层检索：符号倒排 ∪ L0(+CamelCase/词干) ∪（可选）L1 段落降级。
 * 返回按 score 降序的条目（附带 score，调用方可剥离）。
 */
export function enhancedSearch(
  opts: EnhancedSearchOptions,
): Array<L0Like & { score: number }> {
  const limit = opts.limit ?? 10;
  const minLen = opts.minTokenLength ?? 1;
  const query = opts.query.trim();
  if (!query) return [];

  const classMatch = query.match(/^class:(\S+)/i);
  const eventMatch = query.match(/^event:(\S+)/i);
  const methodMatch = query.match(/^method:(\S+)/i);
  const hasPrefix = !!(classMatch || eventMatch || methodMatch);
  const residualQuery = query.replace(/^(?:class|event|method):\S+\s*/i, "").trim();
  const segments = residualQuery.length > 0 ? residualQuery.split(/\s*\|\s*/) : [];

  const processedTerms: string[][] = [];
  for (const seg of segments) {
    const words = seg
      .trim()
      .split(/\s+/)
      .filter((w) => {
        if (!w) return false;
        const lower = w.toLowerCase();
        // 白名单优先于停用词（AT/BE 等短缩写不可被 the/at/be 表误杀）
        if (SHORT_QUERY_WHITELIST.has(lower)) return true;
        if (QUERY_STOP_WORDS.has(lower)) return false;
        return w.length >= minLen;
      });
    if (words.length > 0) processedTerms.push(words);
  }

  const flatTerms = processedTerms.flat();
  const expanded = flatTerms.flatMap(expandQueryTerms);
  const registryQuery = isRegistryishQuery([...flatTerms, ...extractSymbols(query)]);

  const normalizedTags = (opts.tags ?? []).map(normalizeTag);
  const l0ById = new Map(opts.l0.map((e) => [e.id, e]));
  const scores = new Map<string, number>();

  const addScore = (id: string, delta: number) => {
    if (!l0ById.has(id) && !opts.symbolIndex?.byId.has(id)) return;
    scores.set(id, (scores.get(id) ?? 0) + delta);
  };

  // 1) 符号倒排
  const querySymbols = new Set([
    ...extractSymbols(query).map((s) => s.toLowerCase()),
    ...flatTerms.map((t) => t.toLowerCase()),
  ]);
  if (classMatch) querySymbols.add(classMatch[1].toLowerCase());
  if (eventMatch) querySymbols.add(eventMatch[1].toLowerCase());
  if (methodMatch) querySymbols.add(methodMatch[1].toLowerCase());

  if (opts.symbolIndex) {
    for (const sym of querySymbols) {
      const hits = opts.symbolIndex.inverted.get(sym);
      if (!hits) continue;
      for (const id of hits) addScore(id, 20);
    }
  }

  // 2) L0 + CamelCase/词干
  for (const e of opts.l0) {
    if (normalizedTags.length > 0) {
      const ok = normalizedTags.every((wanted) =>
        e.tags.some((t) => normalizeTag(t).includes(wanted)),
      );
      if (!ok) continue;
    }

    const haystack = `${e.label} ${e.id} ${e.url ?? ""} ${e.tags.join(" ")}`.toLowerCase();

    let groupHits = 0;
    let termScore = 0;
    if (processedTerms.length === 0 && hasPrefix) {
      const prefixTerm = (classMatch?.[1] ?? eventMatch?.[1] ?? methodMatch?.[1] ?? "").toLowerCase();
      termScore += l0FieldHit(e, prefixTerm);
      if (termScore > 0 || (scores.get(e.id) ?? 0) > 0) groupHits = 1;
    } else {
      for (const group of processedTerms) {
        const groupHit = group.some((term) => {
          const variants = expandQueryTerms(term);
          return variants.some((v) => l0FieldHit(e, v) > 0);
        });
        if (groupHit) {
          groupHits++;
          for (const term of group) {
            for (const v of expandQueryTerms(term)) termScore += l0FieldHit(e, v);
          }
        }
      }
    }

    const hasOr = residualQuery.includes("|");
    const minGroups =
      hasPrefix || hasOr || processedTerms.length <= 1
        ? 1
        : Math.min(2, processedTerms.length);

    const symbolScore = scores.get(e.id) ?? 0;
    if (processedTerms.length > 0 && groupHits < minGroups && symbolScore === 0) {
      continue;
    }
    if (processedTerms.length === 0 && hasPrefix && termScore === 0 && symbolScore === 0) {
      const prefixTerm = (classMatch?.[1] ?? eventMatch?.[1] ?? methodMatch?.[1] ?? "").toLowerCase();
      if (!haystack.includes(prefixTerm)) continue;
      termScore = 1;
    }

    if (termScore > 0 || symbolScore > 0) {
      addScore(e.id, termScore + pathBoost(e.id, registryQuery));
      // priority tie-break ONLY after a real hit
      const pr = priorityRank(e.priority);
      addScore(e.id, Math.max(0, 3 - pr) * 0.1);
    }
  }

  // 3) L1 段落降级：符号+L0 命中过少时
  const scoredSoFar = [...scores.entries()].filter(([, s]) => s > 0);
  if (
    scoredSoFar.length < 3 &&
    opts.symbolIndex &&
    opts.symbolIndex.byteSize > 0 &&
    opts.symbolIndex.byteSize <= L1_PARAGRAPH_FALLBACK_MAX_BYTES
  ) {
  const needles = [...new Set([...expanded, ...querySymbols])].filter((t) => {
    const lower = t.toLowerCase();
    if (SHORT_QUERY_WHITELIST.has(lower)) return true;
    return t.length >= 2 && !QUERY_STOP_WORDS.has(lower);
  });
    for (const [id, entry] of opts.symbolIndex.byId) {
      if ((scores.get(id) ?? 0) > 0) continue;
      const blob = [
        entry.firstParagraph ?? "",
        ...(entry.sections ?? []).flatMap((s) => [s.title ?? "", s.summary ?? ""]),
      ]
        .join("\n")
        .toLowerCase();
      let hit = 0;
      for (const n of needles) {
        if (blob.includes(n)) hit += 1;
      }
      if (hit > 0) {
        addScore(id, 4 + hit + pathBoost(id, registryQuery));
      }
    }
  }

  // 前缀硬过滤：若有 class:/event:/method:，最终结果须命中该符号或 L0 haystack
  const prefixNeedle = (
    classMatch?.[1] ?? eventMatch?.[1] ?? methodMatch?.[1] ?? ""
  ).toLowerCase();

  const results: Array<L0Like & { score: number }> = [];
  for (const [id, score] of scores) {
    if (score <= 0) continue;
    let entry = l0ById.get(id);
    if (!entry) {
      // L1-only id：尝试用 L0 中 id 后缀匹配
      entry = opts.l0.find(
        (e) => e.id === id || e.id.endsWith("/" + id.split("/").pop()!) || id.endsWith(e.id),
      );
      if (!entry) {
        const l1 = opts.symbolIndex?.byId.get(id);
        if (!l1) continue;
        entry = {
          id: l1.id,
          label: l1.id,
          url: "",
          tags: [],
          priority: "🟢",
        };
      }
    }
    if (prefixNeedle) {
      const hay = `${entry.label} ${entry.id} ${entry.url ?? ""} ${entry.tags.join(" ")}`.toLowerCase();
      const symHit = opts.symbolIndex?.inverted.get(prefixNeedle)?.has(id);
      const para = opts.symbolIndex?.byId.get(id);
      const paraHit =
        para &&
        `${para.firstParagraph ?? ""} ${(para.sections ?? []).map((s) => `${s.title} ${s.summary}`).join(" ")}`
          .toLowerCase()
          .includes(prefixNeedle);
      if (!hay.includes(prefixNeedle) && !symHit && !paraHit) continue;
    }
    results.push({ ...entry, score });
  }

  results.sort((a, b) => b.score - a.score || priorityRank(a.priority) - priorityRank(b.priority));
  return results.slice(0, limit);
}

/** 将 enhanced 结果转为无 score 的列表（保留原字段） */
export function stripScores<T extends { score: number }>(
  rows: T[],
): Array<Omit<T, "score">> {
  return rows.map(({ score: _s, ...rest }) => rest);
}

/** 语义检索命中（semanticSearch 结果）的最小结构 */
export interface SemanticHitLike {
  docId: string;
  score?: number;
  label: string;
  url?: string;
  tags?: string[];
  priority?: string;
  sectionCount?: number;
  matches?: Array<{ sectionHeading?: string; snippet: string; score: number }>;
}

/** L0 搜索结果的最小结构（与各 store 的 SearchResult 结构兼容） */
export interface SearchResultLike {
  id: string;
  version: string;
  label: string;
  url: string;
  tags: string[];
  priority: string;
  sectionCount?: number;
  /** 融合后的排序分（有语义时为 RRF，纯 L0 时为 L0 加权分） */
  score?: number;
  /** L0 关键词加权分（与余弦/RRF 量纲不同，勿直接混排） */
  l0Score?: number;
  /** 语义侧分数（余弦或 FTS 派生，0–1 量级） */
  semanticScore?: number;
  /** Reciprocal Rank Fusion 分（仅融合后存在） */
  rrfScore?: number;
  matches?: Array<{ sectionHeading?: string; snippet: string; score: number }>;
}

/** 与 semantic/search.ts 的 rrfFuse 同公式（避免循环依赖，保持本地一份） */
function rrfFuseScores(rankings: string[][], k = 60): Map<string, number> {
  const scores = new Map<string, number>();
  for (const rank of rankings) {
    for (let i = 0; i < rank.length; i++) {
      const id = rank[i];
      if (id === undefined) continue;
      scores.set(id, (scores.get(id) ?? 0) + 1 / (k + i + 1));
    }
  }
  return scores;
}

export function joinSearchWarnings(...parts: Array<string | undefined | false>): string | undefined {
  const xs = parts.filter((p): p is string => typeof p === "string" && p.trim().length > 0);
  return xs.length ? xs.join("；") : undefined;
}

/** LiteLoader / Rift 官方 wiki 挂在薄档 L0 上时的现行站警告（不触发 fabric-docs fallback 文案）。 */
export function thinLoaderWikiWarning(
  platform: string,
  hits: Array<{ id?: string; url?: string; source?: string }>,
): string | undefined {
  const list = Array.isArray(hits) ? hits : [];
  const hitWiki = (reId: RegExp, reUrl: RegExp, sources: string[]) =>
    list.some((h) => {
      const id = String(h.id ?? "");
      const url = String(h.url ?? "");
      const src = String(h.source ?? "");
      return reId.test(id) || reUrl.test(url) || sources.includes(src);
    });
  if (platform === "liteloader" && hitWiki(/\/wiki_/, /liteloader\.com\/explore\/docs/i, ["liteloader-wiki"])) {
    return "LiteLoader 官方 wiki 是未按 MC 版本切分的现行站（开发停在 1.12.2）。禁止当成该 version 专属官方树。API 以本档核实表为准。";
  }
  if (platform === "rift" && hitWiki(/\/wiki_/, /Rift\/wiki/i, ["rift-wiki"])) {
    return "Rift GitHub wiki 是归档只读官方页。方法名以 listeners 核实表与已核实源码为准。";
  }
  return undefined;
}

export const DOCS_FALLBACK_PACK_NOTE =
  "仅作 API 参考，不得据此推断规则树适用；本版无树则 PACK_NOT_FOUND。";

export const RELATED_CACHE_TTL_MS = 5 * 60_000;

export type TtlCacheEntry<T> = { value: T; expiresAt: number };

export function ttlCacheGet<T>(map: Map<string, TtlCacheEntry<T>>, key: string): T | undefined {
  const e = map.get(key);
  if (!e) return undefined;
  if (e.expiresAt <= Date.now()) {
    map.delete(key);
    return undefined;
  }
  return e.value;
}

export function ttlCacheSet<T>(
  map: Map<string, TtlCacheEntry<T>>,
  key: string,
  value: T,
  max = 64,
  ttlMs = RELATED_CACHE_TTL_MS,
): void {
  map.set(key, { value, expiresAt: Date.now() + ttlMs });
  while (map.size > max) {
    const first = map.keys().next().value;
    if (first === undefined) break;
    map.delete(first);
  }
}

function docsPlatformLabel(payload: Record<string, unknown>): string {
  const p = String(payload.platform ?? payload.sourcePlatform ?? "").toLowerCase();
  if (p === "forge") return "Forge";
  if (p === "neoforge") return "NeoForge";
  if (p === "quilt") return "Quilt";
  if (p === "liteloader") return "LiteLoader";
  if (p === "rift") return "Rift";
  if (p === "bedrock") return "Bedrock";
  if (p === "fabric") return "Fabric";
  return p || "docs";
}

export function withDocsFallbackFields<T extends Record<string, unknown>>(payload: T): T {
  const versionFallback = Boolean(payload.versionFallback);
  const wikiFallback = Boolean(payload.wikiFallback);
  const explicit = payload.fallback === true;
  if (!versionFallback && !wikiFallback && !explicit) return payload;
  const requested = String(payload.requestedVersion ?? payload.version ?? "");
  const resolved = wikiFallback
    ? String(payload.sourceUsed ?? payload.source_version ?? `${docsPlatformLabel(payload).toLowerCase()}-wiki`)
    : String(payload.resolvedVersion ?? payload.source_version ?? "");
  const neighbor =
    Boolean(requested && resolved && requested !== resolved) &&
    !/^26\.1/.test(requested) &&
    resolved !== "porting-extra";
  const plat = docsPlatformLabel(payload);
  const cn =
    (wikiFallback || neighbor) && requested
      ? `不是 ${requested} 官方 ${plat} 文档；正文来自 ${plat} ${resolved}。禁止当成本版官方页抄写。`
      : undefined;
  return {
    ...payload,
    fallback: true,
    confidence: "fallback",
    source_version: resolved,
    action: payload.action ?? actionable(
      ActionCodes.VERSION_FALLBACK,
      requested && resolved && requested !== resolved
        ? `文档查询已从 ${requested} 映射到 ${resolved}（不是规则树可用）`
        : "本次文档结果含版本/wiki fallback，不得当成本版规则树",
      ["不要把 ok:true 当成已加载本版 00–10", "规则树仍可能 PACK_NOT_FOUND"],
    ),
    warning: joinSearchWarnings(
      typeof payload.warning === "string" ? payload.warning : undefined,
      DOCS_FALLBACK_PACK_NOTE,
      cn,
      requested && resolved && !wikiFallback && requested !== resolved
        ? `请求版本 ${requested} 已映射到 ${resolved}`
        : undefined,
    ),
  };
}

/**
 * 将语义检索命中与 L0 结果再融合（handler 层使用）。
 * - 有语义命中：对 L0 id 排行 ∪ 语义 id 排行做 **RRF 再融合**（非简单 append）
 * - 无语义命中：保持纯 L0（score 仍为 L0 加权分）
 * - 融合后对外 `score` = RRF，并分别保留 `l0Score` / `semanticScore` / `rrfScore`
 * - 应用 tags 过滤（与 enhancedSearch 同语义：所有 tag 均需命中）
 * - 语义侧的 matches 写入合并结果（L0 独有条目无 matches）
 * - 截断到 limit
 */
export function mergeSemanticResults(
  results: SearchResultLike[],
  semanticHits: SemanticHitLike[],
  opts: { tags?: string[]; limit?: number; version?: string },
): SearchResultLike[] {
  const limit = opts.limit ?? 10;
  const normalizedTags = (opts.tags ?? []).map(normalizeTag);

  const filteredHits = semanticHits.filter((h) => {
    if (normalizedTags.length === 0) return true;
    return normalizedTags.every((wanted) =>
      (h.tags ?? []).some((t) => normalizeTag(t).includes(wanted)),
    );
  });

  if (filteredHits.length === 0) {
    return results.slice(0, limit).map((r) => ({
      ...r,
      ...(r.score !== undefined ? { l0Score: r.l0Score ?? r.score } : {}),
    }));
  }

  const l0ScoreById = new Map<string, number>();
  const semScoreById = new Map<string, number>();
  const byId = new Map<string, SearchResultLike>();
  for (const r of results) {
    byId.set(r.id, { ...r });
    if (typeof r.score === "number") l0ScoreById.set(r.id, r.score);
  }
  for (const h of filteredHits) {
    const prev = byId.get(h.docId);
    if (typeof h.score === "number") semScoreById.set(h.docId, h.score);
    byId.set(h.docId, {
      id: h.docId,
      version: opts.version ?? prev?.version ?? "unknown",
      label: h.label || prev?.label || h.docId,
      url: h.url ?? prev?.url ?? "",
      tags: h.tags ?? prev?.tags ?? [],
      priority: h.priority ?? prev?.priority ?? "🟢",
      sectionCount: h.sectionCount ?? prev?.sectionCount ?? 0,
      ...(h.matches && h.matches.length > 0 ? { matches: h.matches } : {}),
    });
  }

  const l0Ids = results.map((r) => r.id);
  const semIds = filteredHits.map((h) => h.docId);
  const rrfMap = rrfFuseScores([l0Ids, semIds], 60);
  // priority 副键（检索提升 v3 改动 2）：RRF 近分时 ⭐>🟡>🟢 排前；score 数值不变
  const prioRank = (id: string): number => {
    const pr = String(byId.get(id)?.priority ?? "🟢");
    return pr === "⭐" ? 0 : pr === "🟡" ? 1 : 2;
  };
  const fused = [...rrfMap.entries()]
    .sort((a, b) => b[1] - a[1] || prioRank(a[0]) - prioRank(b[0]))
    .map(([id]) => id)
    .slice(0, limit);
  const out: SearchResultLike[] = [];
  for (const id of fused) {
    const row = byId.get(id);
    if (!row) continue;
    const rrf = Number((rrfMap.get(id) ?? 0).toFixed(6));
    const l0Score = l0ScoreById.get(id);
    const semanticScore = semScoreById.get(id);
    out.push({
      ...row,
      score: rrf,
      rrfScore: rrf,
      ...(l0Score !== undefined ? { l0Score } : {}),
      ...(semanticScore !== undefined ? { semanticScore } : {}),
    });
  }
  return out;
}
