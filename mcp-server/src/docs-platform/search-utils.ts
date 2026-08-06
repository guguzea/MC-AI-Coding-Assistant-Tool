/**
 * 跨平台文档检索共享工具
 * - 符号抽取 / L1 倒排索引
 * - CamelCase 拆分 / 词干归一
 * - relevance 打分（含 concepts/registry boost）
 */

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
  "at", "be", "nbt", "gui", "gui", "ui", "ai", "id", "mc", "mod",
]);

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
  out.add(stemToken(lower));
  for (const p of splitCamelCase(raw)) {
    out.add(p);
    out.add(stemToken(p));
  }
  return [...out];
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

function pathBoost(id: string, registryQuery: boolean): number {
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
    if (hay.includes(t) || hay.includes(stemmed)) score += weight;
  };
  match(label, 5);
  match(id, 3);
  match(tags, 2);
  match(url, 1);

  // Fabric L0 常缺 registry tag：用路径/同义词增强
  if (stemmed === "registry" || stemmed === "datagen") {
    if (id.includes(stemmed) || id.includes("register") || label.includes("register")) {
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
        if (QUERY_STOP_WORDS.has(lower)) return false;
        if (SHORT_QUERY_WHITELIST.has(lower)) return true;
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
    if (classMatch && !haystack.includes(classMatch[1].toLowerCase()) && !(scores.get(e.id) ?? 0)) {
      // allow if symbol index already scored
    }
    if (classMatch) {
      const cls = classMatch[1].toLowerCase();
      const fromSymbol = (scores.get(e.id) ?? 0) > 0;
      if (!haystack.includes(cls) && !fromSymbol) {
        // still allow L0 term expansion below to score; prefix acts as soft filter only when no other score
      }
    }

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
    const needles = [...new Set([...expanded, ...querySymbols])].filter(
      (t) => t.length >= 2 && !QUERY_STOP_WORDS.has(t),
    );
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
    results.push({ ...entry, score: score + pathBoost(entry.id, registryQuery) });
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
