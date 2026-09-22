/**
 * 基岩版 Add-On 文档 / 校验 / 生成（不是 Forge/Java 工具）。
 * search_bedrock_docs 每次带 docsStatus；滞后 Warning 不是拒绝令。
 * 检索侧另带 `demotion`：`release-notes`（版本更新说明）体裁页**降权不删除**，
 * 体裁判据在生产者 mcp-server/scripts/fetch-bedrock-docs.js 里。
 */
import { existsSync, readFileSync } from "fs";
import { randomUUID } from "crypto";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { z } from "zod";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { FabricDocStore, DocNotFoundError } from "../docs-platform/fabric/store.js";
import {
  hasPlatformDocData,
  platformDataMissingPayload,
} from "../docs-platform/platform-data.js";
import { resolveDataDir } from "../utils/path.js";
import { semanticSearch } from "../docs-platform/semantic/search.js";
import {
  joinSearchWarnings,
  mergeSemanticResults,
  normalizeTag,
  RELATED_CACHE_TTL_MS,
  ttlCacheGet,
  ttlCacheSet,
  type SearchResultLike,
  type TtlCacheEntry,
} from "../docs-platform/search-utils.js";
import { missingSemanticDbWarning, semanticStaleSearchWarning } from "../docs-platform/semantic/status.js";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const STALE_MS = 14 * 24 * 60 * 60 * 1000;
const LEARN_PACK =
  "https://learn.microsoft.com/minecraft/creator/reference/content/packreferencetopics/packmanifest";
const LEARN_EXPERIMENTS =
  "https://learn.microsoft.com/en-us/minecraft/creator/documents/experimentalfeaturestoggle";

/**
 * 官方 pack-manifest capabilities 表（本仓缓存页 data/bedrock_stable/bedrock-docs/stable/processed/pack-manifest.md）。
 * test-core 会重新解析该页并比对本常量，官方增删时先改页再改这里。
 * 缓存页无 script_eval，故不收录；命中表外值只 warning，不判错。
 */
export const BEDROCK_CAPABILITIES = [
  "chemistry",
  "editorExtension",
  "experimental_custom_ui",
  "raytraced",
  "pbr",
];

export interface BedrockDocsStatus {
  localRevision: string | null;
  remoteRevision: string | null;
  scriptApiStable: string | null;
  scriptApiBeta: string | null;
  fetchedAt: string | null;
  /**
   * `true/false` 来自真探针（远端 canary 页 gitcommit sha ⇄ 本地 fingerprints.json）；
   * `"unknown"` = 探针没测成（远端取不到，或本地指纹不全）——**禁止**在取不到时回落成 `false`。
   */
  stale: boolean | "unknown";
  checkedAt?: string | null;
  warning?: string;
  code?: "NOT_FETCHED" | "CORRUPT" | "STALE" | "OK" | "PROBE_FAILED";
}

export function loadBedrockDocsStatus(dataRoot = resolveDataDir()): BedrockDocsStatus {
  const p = join(dataRoot, "bedrock-docs-status.json");
  const empty: BedrockDocsStatus = {
    localRevision: null,
    remoteRevision: null,
    scriptApiStable: null,
    scriptApiBeta: null,
    fetchedAt: null,
    stale: "unknown",
    warning: "未找到 data/bedrock-docs-status.json；基岩文档可能尚未抓取，滞后状态无从判断。",
    code: "PROBE_FAILED",
  };
  if (!existsSync(p)) return empty;
  try {
    const raw = JSON.parse(readFileSync(p, "utf8")) as Partial<BedrockDocsStatus>;
    const fetchedAt = typeof raw.fetchedAt === "string" ? raw.fetchedAt : null;
    const fetchedMs = fetchedAt ? Date.parse(fetchedAt) : NaN;
    const ageStale = !Number.isFinite(fetchedMs) || Date.now() - fetchedMs > STALE_MS;
    // 探针未测出结论（字段被写空 / 写成 "unknown"）⇒ 三态里的 unknown，不得默默 false
    const probeMissing = !raw.remoteRevision || !raw.localRevision || raw.stale === "unknown";
    const revStale = Boolean(
      raw.remoteRevision && raw.localRevision && raw.remoteRevision !== raw.localRevision,
    );
    const stale: boolean | "unknown" = probeMissing ? "unknown" : revStale || ageStale;
    const warning =
      stale === "unknown"
        ? "基岩文档滞后状态**未知**：revision 探针未取得结论（远端不可达或本地 fingerprints 不全）。不要把 unknown 读成「已是最新」；跑 `node mcp-server/scripts/fetch-bedrock-docs.js --probe` 复测。"
        : stale
          ? "此文档可能滞后于当前正式版（Script API 约两周一个 Beta）。滞后 Warning 不是拒绝令；默认仍只生成 stable。"
          : undefined;
    return {
      localRevision: raw.localRevision ?? null,
      remoteRevision: raw.remoteRevision ?? null,
      scriptApiStable: raw.scriptApiStable ?? null,
      scriptApiBeta: raw.scriptApiBeta ?? null,
      fetchedAt,
      checkedAt: typeof raw.checkedAt === "string" ? raw.checkedAt : null,
      stale,
      warning,
      code: stale === "unknown" ? "PROBE_FAILED" : stale ? "STALE" : "OK",
    };
  } catch {
    return { ...empty, warning: "bedrock-docs-status.json 损坏或无法解析", code: "CORRUPT" };
  }
}

function jsonOk(payload: unknown): CallToolResult {
  return { content: [{ type: "text", text: JSON.stringify(payload, null, 2) }] };
}

function withStatus<T extends Record<string, unknown>>(body: T): T & { docsStatus: BedrockDocsStatus } {
  const docsStatus = loadBedrockDocsStatus();
  const warning = joinSearchWarnings(
    typeof body.warning === "string" ? body.warning : undefined,
    docsStatus.warning,
    "Microsoft Learn view=minecraft-bedrock-stable 是现行稳定版，不是某个历史快照。不要用 Java 资源包文档去修正 RP。",
  );
  return { ...body, docsStatus, warning };
}

/**
 * 基岩正文有**两棵语料树**（2026-09-21 拆分）：
 *  - `bedrock-docs` — Microsoft Learn 文档页（20 精选 + `documents/**`）
 *  - `bedrock-scriptapi` — npm `@minecraft/server` index.d.ts 的逐声明摘录页（`scriptapi/**`，
 *    id 仍为拆分前的 `stable/scriptapi/<Name>`，可回溯）
 * 两棵树各自有 index-l0.json / processed/** / semantic/db.sqlite，检索与取页必须同时覆盖，
 * **不得**出现「scriptapi 页拆走后查不到」。
 */
const BEDROCK_DOC_SOURCES = ["bedrock-docs", "bedrock-scriptapi"];

function getStore(version = "stable", source = "bedrock-docs"): FabricDocStore {
  return new FabricDocStore(resolveDataDir(), version, source, "bedrock");
}

/**
 * 盘上真有该树 index-l0 的源才参与检索（部分数据安装 / 新树未抓取时另一棵树照常工作）。
 * 两棵都没有时回 `["bedrock-docs"]`：让 store 抛它原本的 VersionNotFoundError，错误形态与拆分前一致。
 */
function bedrockSourcesWithData(version: string, dataRoot = resolveDataDir()): string[] {
  const present = BEDROCK_DOC_SOURCES.filter((source) =>
    existsSync(join(dataRoot, `bedrock_${version}`, source, version, "index-l0.json")),
  );
  return present.length > 0 ? present : ["bedrock-docs"];
}

/**
 * 跨树取页助手：只有 DocNotFoundError（＝这个 id 确实不在这一棵树里）才换下一棵树；
 * 其它异常（非法版本 / 坏索引）原样抛，不被第二棵树的结果掩盖。
 */
async function withBedrockStores<T>(
  version: string,
  fn: (store: FabricDocStore) => T | Promise<T>,
): Promise<T> {
  let lastErr: unknown;
  for (const source of bedrockSourcesWithData(version)) {
    try {
      return await fn(getStore(version, source));
    } catch (e) {
      if (e instanceof DocNotFoundError) {
        lastErr = e;
        continue;
      }
      throw e;
    }
  }
  throw lastErr;
}

/**
 * 下面三条限流常量声明在本文件**第一个 schema 之前**：`searchBedrockDocsSchema` 在模块加载时
 * 就求值（含 `.max(BEDROCK_RESULT_LIMIT_MAX)` 与 describe 里的插值），常量放后面会踩 TDZ。
 *
 * 对外 `total` 的口径：与降权改动前逐字相同（原本就是 mergeSemanticResults 的 limit=20）。
 */
const BEDROCK_RESULT_LIMIT = 20;
/**
 * 融合阶段的候选上限。**必须大于** {@link BEDROCK_RESULT_LIMIT}：
 * 降权是把 release-notes 往后挪，若候选池只有 20，被挪下去的页就再也翻不回来 ——
 * 那就成了事实上的拉黑。多取候选、降权后再截回窗口，被降权的页仍在结果里（在尾部）。
 */
const BEDROCK_MERGE_CANDIDATE_LIMIT = 60;

/**
 * 按调用放宽 `limit` 的硬上界 = 候选池上限。理由不是"怕 token"（那由调用方自己承担），而是
 * **超过池大小就永远拿不到更多页** ⇒ 一个声称能给 200 的参数是在撒谎。取派生值而非新常量：
 * 池加宽时窗口上界自动跟着加宽，不会出现「窗口调到 80 被 schema 拒，而池其实有 80」这种漂移。
 */
export const BEDROCK_RESULT_LIMIT_MAX = BEDROCK_MERGE_CANDIDATE_LIMIT;

/**
 * 默认窗口的对外可读别名：判据门要断言"未传 limit 时仍是 20"（放宽不得偷偷改默认口径），
 * 但它不该自己抄一个 20 —— 从本文件取。
 */
export const BEDROCK_DEFAULT_RESULT_LIMIT = BEDROCK_RESULT_LIMIT;

export const searchBedrockDocsSchema = z.object({
  query: z.string().describe("搜索关键词（Microsoft Learn Creator / Script API / pack manifest）"),
  version: z.string().optional().describe("文档树版本，默认 stable（不要用 Java 的 1.20.1 冒充）"),
  tags: z
    .array(z.string())
    .optional()
    .describe(
      "tag 过滤（子串、大小写/连字符不敏感）。体裁 tag `release-notes` = 该 31 页「版本更新说明」" +
        "（documents/update<版本> ⇄ 标题 `<版本> Update Summary`），由生产者 " +
        "mcp-server/scripts/fetch-bedrock-docs.js 的 isReleaseNotesPage 算进 index-l0.json。",
    ),
  /**
   * 按调用放宽对外窗口（2026-09-22 用户裁定：`resultLimit` 是三个参数里唯一真影响观感的那个数，
   * 但它是全局的 ⇒ 不动全局默认，给调用方一个逃生口）。只放宽**窗口**：排序、降权系数、候选池
   * 口径一概不变，因此放宽后的结果集严格等于默认结果的「前缀 + 追加尾部」——可由
   * `assert-bedrock-genre-demote.mjs` 的前缀稳定性判据反证。
   * 上限 {@link BEDROCK_RESULT_LIMIT_MAX}；传值超过候选池时不会凭空多出页，池大小见 `demotion.candidates`。
   */
  limit: z
    .number()
    .int()
    .min(1)
    .max(BEDROCK_RESULT_LIMIT_MAX)
    .optional()
    .describe(
      `对外结果条数，默认 ${BEDROCK_RESULT_LIMIT}（与未传该参数时逐字相同）；范围 1-${BEDROCK_RESULT_LIMIT_MAX}。` +
        "只放宽窗口：排序与 release-notes 降权不变，被降权的页仍在尾部。要专门看更新说明优先用 " +
        'tags=["release-notes"]（那是过滤，不是放宽窗口）。',
    ),
});

/**
 * 体裁 tag：**拼写必须与生产者一致**
 * （`mcp-server/scripts/fetch-bedrock-docs.js` 的 `RELEASE_NOTES_TAG`）。
 * 用户裁定（2026-09-22）：版本更新说明这类页**保留 + 打标 + 检索降权**，
 * **不删页、不拉黑** —— 所以本文件里只有「排序惩罚」，没有任何过滤分支。
 */
export const BEDROCK_RELEASE_NOTES_TAG = "release-notes";
/** 乘在排序键上的惩罚系数（1 = 不降权）。只改顺序，不改候选集。 */
export const BEDROCK_RELEASE_NOTES_DEMOTE_FACTOR = 0.25;

/** 降权后附加到结果行上的**可选**字段（不改动 id/label/url/tags/score/… 既有字段的类型与含义）。 */
export interface BedrockDemotionFields {
  /** 本行是否因 `release-notes` 体裁被降权（未降权的行**不带**该键） */
  demoted?: boolean;
  /** 降权依据的 tag（只可能等于 {@link BEDROCK_RELEASE_NOTES_TAG}） */
  demoteReason?: string;
  /** 实际用于排序的键 = base × 降权系数；`base` 见 {@link sortBaseOf}。给外部核对排序用 */
  effectiveScore?: number;
}

/**
 * 权威 tags 取自 **index-l0.json**，不取自结果行的 tags。
 * 原因：语义通道的 tags 来自 `semantic/db.sqlite` 的 `docs.tags_json`，那是上一次建库时的镜像，
 * 索引改了 tag 之后它必然滞后（实测该表 258 行与索引 1:1）。以行内 tags 判体会漏掉
 * 「只从语义通道浮出」的 release-notes 页。缓存 TTL 与 related 缓存同口径。
 */
const genreTagCache = new Map<string, TtlCacheEntry<Map<string, string[]>>>();

function bedrockGenreTagIndex(
  version: string,
  sources: string[],
  dataRoot: string,
): Map<string, string[]> {
  const cacheKey = `${version}|${sources.join(",")}`;
  const hit = ttlCacheGet(genreTagCache, cacheKey);
  if (hit) return hit;
  const map = new Map<string, string[]>();
  for (const source of sources) {
    const p = join(dataRoot, `bedrock_${version}`, source, version, "index-l0.json");
    if (!existsSync(p)) continue;
    try {
      const parsed: unknown = JSON.parse(readFileSync(p, "utf8"));
      if (!Array.isArray(parsed)) continue;
      for (const e of parsed) {
        const id = (e as { id?: unknown })?.id;
        const tags = (e as { tags?: unknown })?.tags;
        if (typeof id === "string" && Array.isArray(tags)) {
          map.set(id, tags.filter((t): t is string => typeof t === "string"));
        }
      }
    } catch {
      /* 读不到就退回行内 tags（见 isBedrockReleaseNotesRow），不假装判得很准 */
    }
  }
  ttlCacheSet(genreTagCache, cacheKey, map, 16, RELATED_CACHE_TTL_MS);
  return map;
}

/** 判据**只看 tag**（不做标题 / 路径字符串匹配）；归一口径与 tags 过滤共用 {@link normalizeTag}。 */
export function isBedrockReleaseNotesRow(
  row: SearchResultLike,
  tagIndex: ReadonlyMap<string, string[]>,
): boolean {
  const wanted = normalizeTag(BEDROCK_RELEASE_NOTES_TAG);
  const tags = tagIndex.get(row.id) ?? row.tags ?? [];
  return tags.some((t) => normalizeTag(t).includes(wanted));
}

/**
 * 排序基准分：有融合分就用 `score`（有语义时 = RRF）；
 * 无语义可用时（纯 L0 通道，store 出口 `stripScores` 会把 score 抹掉）退回**行序倒数**
 * `(n - i) / n`，即把 L0 排名当成分数量级用。两种都只用于比较，**不回写 `score` 字段**。
 */
function sortBaseOf(row: SearchResultLike, index: number, total: number): number {
  if (typeof row.score === "number") return row.score;
  const n = Math.max(1, total);
  return (n - index) / n;
}

/**
 * release-notes 降权：**只重排，不过滤**。
 * 排序键 = `sortBaseOf × (降权 ? 0.25 : 1)`，同分按原序（稳定），因此
 * 「同等分值的普通页之后」成立，且非降权页之间的相对次序**完全不变**。
 * 截断到 limit 发生在降权**之后**（候选池 60 > 输出 20），故降权不减少可达性。
 */
export function applyBedrockGenreDemotion(
  rows: SearchResultLike[],
  tagIndex: ReadonlyMap<string, string[]>,
  limit = BEDROCK_RESULT_LIMIT,
): Array<SearchResultLike & BedrockDemotionFields> {
  const keyed = rows.map((row, i) => {
    const demoted = isBedrockReleaseNotesRow(row, tagIndex);
    const base = sortBaseOf(row, i, rows.length);
    const eff = Number((demoted ? base * BEDROCK_RELEASE_NOTES_DEMOTE_FACTOR : base).toFixed(8));
    return { row, i, demoted, eff };
  });
  keyed.sort((a, b) => b.eff - a.eff || a.i - b.i);
  return keyed.slice(0, limit).map(({ row, demoted, eff }) =>
    demoted
      ? { ...row, demoted: true, demoteReason: BEDROCK_RELEASE_NOTES_TAG, effectiveScore: eff }
      : { ...row, effectiveScore: eff },
  );
}


export async function searchBedrockDocs(
  args: z.infer<typeof searchBedrockDocsSchema>,
): Promise<CallToolResult> {
  const version = args.version ?? "stable";
  const dataRoot = resolveDataDir();
  if (!hasPlatformDocData("bedrock", dataRoot)) {
    return jsonOk(
      withStatus({
        ...platformDataMissingPayload("bedrock"),
        query: args.query,
        version,
      }),
    );
  }
  // 两棵语料树各自跑 L0 + 语义再合并（见 BEDROCK_DOC_SOURCES 的拆分说明）。
  // 迁移窗口内（scriptapi 的 semantic/db.sqlite 还没重建）：scriptapi 页靠它自己的 L0 索引 +
  // 旧文档树语义库里仍存留的 scriptapi chunks（成员校验用两棵树 id 全集放行）继续搜得到；
  // 重建后两库各自命中。任何一种形态下返回字段与语义不变。
  const sources = bedrockSourcesWithData(version, dataRoot);
  let resolvedVersion = version;
  const byId = new Map<string, SearchResultLike>();
  for (const [i, source] of sources.entries()) {
    const detailed = getStore(version, source).searchIndexDetailed(args.query, version, args.tags);
    if (i === 0) resolvedVersion = detailed.resolvedVersion;
    for (const r of detailed.results) if (!byId.has(r.id)) byId.set(r.id, r);
  }
  let results: SearchResultLike[] = [...byId.values()];
  const semanticLists = await Promise.all(
    sources.map((source) =>
      semanticSearch(args.query, "bedrock", resolvedVersion, source, dataRoot),
    ),
  );
  const semanticAvailable = semanticLists.some((h) => h !== null);
  // 按调用的窗口（未传 = BEDROCK_RESULT_LIMIT ⇒ 与改动前逐字相同）。候选池跟着放宽：
  // 池必须 ≥ 窗口，否则"放宽 limit"拿不到更多页，只是把同一个池重新切一刀。
  const resultLimit = args.limit ?? BEDROCK_RESULT_LIMIT;
  const candidateLimit = Math.max(BEDROCK_MERGE_CANDIDATE_LIMIT, resultLimit);
  let candidates = results;
  if (semanticAvailable) {
    const semanticHits = semanticLists.filter(
      (h): h is NonNullable<typeof h> => h !== null,
    ).flat();
    // 成员白名单 = 两棵树 L0 全集的并集（拆分前单树 882 条时的等价口径）
    const allowedIds = new Set<string>();
    for (const source of sources) {
      try {
        for (const id of getStore(version, source).getAllDocIds(resolvedVersion)) allowedIds.add(id);
      } catch {
        /* 这一棵答不了全集 ⇒ 它的语义命中会被成员校验丢弃（宁缺毋滥，同 semanticAllowedIds 的保守口径） */
      }
    }
    // 候选池放宽到 candidateLimit（≥ 窗口），降权后再截回窗口 ——
    // 截断点必须在降权之后，否则「被降权」等于「被挤出结果」，与用户裁定的不删不拉黑冲突。
    candidates = mergeSemanticResults(results, semanticHits, {
      tags: args.tags,
      limit: candidateLimit,
      version: resolvedVersion,
      allowedIds,
    });
  }
  const tagIndex = bedrockGenreTagIndex(resolvedVersion, sources, dataRoot);
  const demotedInCandidates = candidates.filter((r) => isBedrockReleaseNotesRow(r, tagIndex)).length;
  const demotedRows = applyBedrockGenreDemotion(candidates, tagIndex, resultLimit);
  results = demotedRows;
  const demotedInResults = demotedRows.filter((r) => r.demoted === true).length;
  const demotionDropped = Math.max(0, demotedInCandidates - demotedInResults);
  return jsonOk(
    withStatus({
      ok: true,
      query: args.query,
      version,
      resolvedVersion,
      platform: "bedrock",
      semantic: semanticAvailable,
      total: results.length,
      results,
      /** 可选附加字段（降权未触发时也在，便于核对排序）；已有字段类型与含义未变 */
      demotion: {
        tag: BEDROCK_RELEASE_NOTES_TAG,
        factor: BEDROCK_RELEASE_NOTES_DEMOTE_FACTOR,
        candidateLimit,
        resultLimit,
        /** 调用方显式传的窗口（未传 = null ⇒ 用默认 {@link BEDROCK_RESULT_LIMIT}）。便于核对"这条结果被放宽过" */
        requestedLimit: args.limit ?? null,
        /** 窗口上界（= 候选池上界）。超过它 schema 直接拒 */
        limitMax: BEDROCK_RESULT_LIMIT_MAX,
        candidates: candidates.length,
        demotedInCandidates,
        demotedInResults,
        /**
         * 因「降权 + 对外窗口」而没进结果集的 release-notes 页数（窗口改动前就是 20，未新增过滤）。
         * 只用于披露：这些页**没有被过滤掉**，用 tags=["release-notes"] 或放宽 limit 即可取回。
         */
        demotedDropped: Math.max(0, demotedInCandidates - demotedInResults),
        basis:
          "排序键 = (score ?? L0 行序倒数) × (带 release-notes tag ? factor : 1)，同分保原序；" +
          "判据只读 index-l0.json 的 tags，不读标题；只重排不过滤。",
      },
      warning: joinSearchWarnings(
        missingSemanticDbWarning(semanticLists.length > 0 && !semanticAvailable),
        ...sources.map((source) =>
          semanticStaleSearchWarning(dataRoot, "bedrock", resolvedVersion, source),
        ),
        demotedInResults > 0
          ? `本次结果含 ${demotedInResults}/${results.length} 条「版本更新说明」体裁页（tag=${BEDROCK_RELEASE_NOTES_TAG}），` +
            `已按 ×${BEDROCK_RELEASE_NOTES_DEMOTE_FACTOR} 沉到同等分值普通页之后（未过滤，见各行 demoted/effectiveScore）；` +
            `要看这一族页就显式传 tags=["${BEDROCK_RELEASE_NOTES_TAG}"]。`
          : undefined,
        demotionDropped > 0
          ? `另有 ${demotionDropped} 条 ${BEDROCK_RELEASE_NOTES_TAG} 页命中在候选池（${candidates.length} 条）里、` +
            `因降权后排到对外 ${resultLimit} 条窗口之外（默认窗口就是 ${BEDROCK_RESULT_LIMIT}，未新增过滤）。` +
            `取回方式：tags=["${BEDROCK_RELEASE_NOTES_TAG}"]、把 limit 放宽到 ${Math.min(resultLimit + demotionDropped, BEDROCK_RESULT_LIMIT_MAX)} 以内，或把查询收紧到具体版本号。`
          : undefined,
        args.limit !== undefined && candidates.length < resultLimit
          ? `本次 limit=${resultLimit} 比候选池（${candidates.length} 条）还宽 ⇒ 返回 ${results.length} 条不是被窗口切的，` +
            `是检索层只交得出这些（每棵树 L0 10 + 语义 10，基岩两棵树）。要更多就去掉 tags 过滤或换措辞，调大 limit 拿不到额外页。`
          : undefined,
      ),
    }),
  );
}

export const getBedrockDocSummarySchema = z.object({
  id: z.string().describe("页面 ID，来自 search_bedrock_docs 的 results[].id"),
  version: z.string().optional().describe("默认 stable"),
});

export async function getBedrockDocSummary(
  args: z.infer<typeof getBedrockDocSummarySchema>,
): Promise<CallToolResult> {
  const version = args.version ?? "stable";
  if (!hasPlatformDocData("bedrock")) {
    return jsonOk(withStatus({ ...platformDataMissingPayload("bedrock") }));
  }
  try {
    const summary = await withBedrockStores(version, (store) => store.loadSummary(args.id, version));
    return jsonOk(withStatus({ ok: true, platform: "bedrock", ...summary, version }));
  } catch (e) {
    return jsonOk(withStatus({
      ok: false,
      error: {
        code: "INTERNAL_ERROR",
        message: e instanceof Error ? e.message : String(e),
        hint: "请用 search_bedrock_docs 确认 id（形如 stable/<path>）后重试",
      },
    }));
  }
}

export const getBedrockDocFullSchema = z.object({
  id: z.string(),
  version: z.string().optional(),
  highlight_key: z.boolean().optional(),
});

export async function getBedrockDocFull(
  args: z.infer<typeof getBedrockDocFullSchema>,
): Promise<CallToolResult> {
  const version = args.version ?? "stable";
  if (!hasPlatformDocData("bedrock")) {
    return jsonOk(withStatus({ ...platformDataMissingPayload("bedrock") }));
  }
  try {
    const full = await withBedrockStores(version, (store) =>
      store.loadFullDoc(args.id, version, args.highlight_key !== false),
    );
    return jsonOk(withStatus({ ok: true, platform: "bedrock", ...full, version }));
  } catch (e) {
    return jsonOk(withStatus({
      ok: false,
      error: {
        code: "INTERNAL_ERROR",
        message: e instanceof Error ? e.message : String(e),
        hint: "请用 search_bedrock_docs 确认 id（形如 stable/<path>）后重试",
      },
    }));
  }
}

export const getBedrockDocRelatedSchema = z.object({
  id: z.string(),
  version: z.string().optional(),
  limit: z.number().optional(),
});

export async function getBedrockDocRelated(
  args: z.infer<typeof getBedrockDocRelatedSchema>,
): Promise<CallToolResult> {
  const version = args.version ?? "stable";
  if (!hasPlatformDocData("bedrock")) {
    return jsonOk(withStatus({ ...platformDataMissingPayload("bedrock") }));
  }
  try {
    const related = await withBedrockStores(version, (store) =>
      store.getRelatedDocs(args.id, version, args.limit ?? 8),
    );
    return jsonOk(withStatus({ ok: true, platform: "bedrock", version, related }));
  } catch (e) {
    return jsonOk(withStatus({
      ok: false,
      error: {
        code: "INTERNAL_ERROR",
        message: e instanceof Error ? e.message : String(e),
        hint: "请用 search_bedrock_docs 确认 id（形如 stable/<path>）后重试",
      },
    }));
  }
}

/**
 * N9(c)（2026-09-19 用户裁定「统一真值，但先区分语义」）：模板钉值的唯一机器可读真值源。
 *
 * 语义分层（**不得把两个数当同一个比对**）：
 *   · `data/bedrock-docs-status.json.scriptApiStable` = Learn 文档快照所载 stable（随抓取更新、天然滞后）
 *     ⇒ `generate_addon_manifest` 的默认值来源（2026-09-18 既定语义）。
 *   · 本文件 = 本仓给新工程的**模板钉值**（`bedrock/scaffold/<pack>/manifest.json`），按 npm dist-tags 推进。
 * 两者不同是常态，但必须**有登记、有门**（`scripts/assert-bedrock-script-api-pin.mjs`），不许静默漂移。
 */
export function scriptApiPinPath(): string {
  if (process.env.MC_SKILL_BEDROCK_API_PIN) return process.env.MC_SKILL_BEDROCK_API_PIN;
  return join(dirname(fileURLToPath(import.meta.url)), "..", "..", "data", "bedrock-script-api-pin.json");
}

export interface BedrockScriptApiPin {
  version: string | null;
  basis: string | null;
  asOf: string | null;
  /** 读取/解析失败原因（不抛；调用方按 warning 披露，禁止静默当作「没有钉值」） */
  invalid?: string;
}

export function loadBedrockScriptApiPin(): BedrockScriptApiPin {
  const p = scriptApiPinPath();
  try {
    const raw = JSON.parse(readFileSync(p, "utf8")) as {
      scaffoldDependency?: { version?: unknown };
      basis?: unknown;
      asOf?: unknown;
    };
    const v = raw?.scaffoldDependency?.version;
    const version = typeof v === "string" && v.trim() ? v.trim() : null;
    return {
      version,
      basis: typeof raw?.basis === "string" ? raw.basis : null,
      asOf: typeof raw?.asOf === "string" ? raw.asOf : null,
      ...(version ? {} : { invalid: `${p} 的 scaffoldDependency.version 缺失或非字符串` }),
    };
  } catch (e) {
    return { version: null, basis: null, asOf: null, invalid: `读不到 ${p}（${(e as Error).message}）` };
  }
}

export const validateAddonManifestSchema = z.object({
  manifestJson: z.string().describe("manifest.json 全文"),
});

export function validateAddonManifest(manifestJson: string): Record<string, unknown> {
  const errors: string[] = [];
  const warnings: string[] = [];
  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(manifestJson) as Record<string, unknown>;
  } catch (e) {
    return { ok: false, errors: [`JSON 解析失败: ${(e as Error).message}`], warnings };
  }
  if (parsed.format_version == null) errors.push("缺少 format_version");
  else if (typeof parsed.format_version !== "number" || !Number.isInteger(parsed.format_version) || parsed.format_version < 1) {
    errors.push("format_version 必须是正整数");
  }
  const header = parsed.header as Record<string, unknown> | undefined;
  if (!header) errors.push("缺少 header");
  else {
    if (typeof header.uuid !== "string" || !UUID_RE.test(header.uuid)) {
      errors.push("header.uuid 必须是标准 UUID");
    }
    if (!Array.isArray(header.version) || header.version.length !== 3 || !header.version.every((n) => typeof n === "number" && Number.isFinite(n))) {
      errors.push("header.version 应为长度为 3 的数字数组");
    }
    if (typeof header.name !== "string") errors.push("缺少 header.name");
    if (header.min_engine_version) {
      const mev = header.min_engine_version;
      if (!Array.isArray(mev) || mev.length !== 3 || !mev.every((n) => typeof n === "number" && Number.isInteger(n))) {
        errors.push("min_engine_version 应为三维整数数组 [major, minor, patch]");
      }
    } else {
      // 【判级更正 2026-09-19（诚实留痕）】上轮本项据官方页**抓取不全的摘录**裁为「不判错、只给 warning」——
      // 当时只截到示例段，未读到 pack-manifest 表格行的逐字口径。本轮补读全文，官方原文逐字：
      //   「min_engine_version … **This is a required field for resource and behavior packs.**
      //     This helps the game identify whether any backwards compatibility is needed for your pack.
      //     You should always use the highest version currently available when creating packs.」
      // ⇒ 缺 mev 由 warning **升为 error**（上轮裁定作废；夹具已同步：test-core 正对照 + assert-cli-full）。
      errors.push(
        "header 缺 min_engine_version —— 官方 pack-manifest 明述其为 resource/behavior packs 的**必填**字段（可用 [major, minor, patch]）",
      );
    }
  }
  const modules = parsed.modules;
  if (!Array.isArray(modules) || modules.length === 0) {
    errors.push("缺少 modules 数组");
  } else {
    for (const [i, m] of modules.entries()) {
      const mod = m as Record<string, unknown>;
      const t = mod.type;
      // F-E206："skin"（皮肤包）与 legacy "client_data" 是合法/遗留 type，不按 invalid 报错
      if (t === "skin") {
        // 皮肤包合法类型
      } else if (t === "client_data") {
        warnings.push(`modules[${i}].type 为 legacy "client_data"，建议迁移到 "data"`);
      } else if (t !== "resources" && t !== "data" && t !== "script" && t !== "world_template") {
        errors.push(`modules[${i}].type 无效（允许 resources/data/script/world_template/skin）`);
      }
      // 原审查 S3（2026-09-19 裁定）：官方页 modules 表逐字「language … **Only present if type is script**.
      // This indicates the language in which scripts are written in the pack. **The only supported value is javascript**」
      // ⇒ 声明了 language 就必须是 "javascript"（唯一值，判 error）；非 script 模块出现 language 语义上不该有（warning）。
      // N9(b)（2026-09-19 用户裁定「判真洞/P1：最小校验」）：script 模块**必须** language + 非空 entry ——
      // 实测缺两者仍 ok:true（引擎无从加载脚本）。判级依据 = 用户裁定 + 本仓自证形态（scaffold 与
      // generate_addon_manifest/generate_bp_entity 产出的 script 模块都带 language+entry），
      // 不是 pack-manifest 页的必填口径（该页 entry 0 命中，见台账 bedrock-script-module-language-entry-not-enforced 留痕）。
      if (t === "script") {
        if (mod.language === undefined) {
          errors.push(`modules[${i}].language 缺失 —— script 模块必须声明 language="javascript"（N9(b) 最小校验）`);
        }
        if (typeof mod.entry !== "string" || !mod.entry.trim()) {
          errors.push(`modules[${i}].entry 缺失或不是非空字符串 —— script 模块必须有入口（如 "scripts/main.js"）`);
        }
      }
      if (mod.language !== undefined) {
        if (typeof mod.language !== "string" || mod.language !== "javascript") {
          errors.push(`modules[${i}].language 只能是 "javascript"（官方唯一支持值）`);
        }
        if (t !== "script") {
          warnings.push(`modules[${i}].language 仅在 type=script 时才有意义（官方页逐字 only present if type is script）`);
        }
      }
      if (typeof mod.uuid !== "string" || !UUID_RE.test(mod.uuid)) {
        errors.push(`modules[${i}].uuid 必须是标准 UUID`);
      }
      if (!Array.isArray(mod.version) || mod.version.length !== 3 || !mod.version.every((n) => typeof n === "number" && Number.isFinite(n))) {
        errors.push(`modules[${i}].version 应为长度为 3 的数字数组`);
      }
    }
  }
  if (Object.prototype.hasOwnProperty.call(parsed, "experimentalGameplay")) {
    errors.push(
      "禁止写入 experimentalGameplay。世界 Beta APIs 须在游戏 UI 打开；level.dat 实验键名按社区权威 wiki.bedrock.dev/nbt/enabling-experiments 为 experiments compound + byte=1（「Beta APIs」= gametest），非 Microsoft Learn 官方，不得当 API 规范写进 pack。pack JSON 打不开该开关。",
    );
  }
  // C13：规则承诺「header.uuid 与每个 module.uuid 必须两两不同」（bedrock/.cursor/rules/00-project-setup.mdc:18），
  // 而本函数此前只逐条 UUID_RE.test、全函数无任何集合/两两比较 —— 重复 uuid 会全绿通过。
  const uuidSites: Array<{ where: string; uuid: string }> = [];
  if (header && typeof header.uuid === "string") {
    uuidSites.push({ where: "header.uuid", uuid: header.uuid.toLowerCase() });
  }
  if (Array.isArray(modules)) {
    for (const [i, m] of modules.entries()) {
      const u = (m as Record<string, unknown>).uuid;
      if (typeof u === "string") uuidSites.push({ where: `modules[${i}].uuid`, uuid: u.toLowerCase() });
    }
  }
  for (let i = 0; i < uuidSites.length; i++) {
    for (let j = i + 1; j < uuidSites.length; j++) {
      if (uuidSites[i].uuid === uuidSites[j].uuid) {
        errors.push(
          `${uuidSites[i].where} 与 ${uuidSites[j].where} 的 UUID 重复（header.uuid 与每个 module.uuid 必须两两不同）`,
        );
      }
    }
  }
  const caps = parsed.capabilities;
  if (Array.isArray(caps)) {
    for (const c of caps) {
      if (typeof c === "string" && !BEDROCK_CAPABILITIES.includes(c)) {
        warnings.push(
          `未知 capability「${c}」；官方 pack-manifest capabilities 表只列 ${BEDROCK_CAPABILITIES.join(" / ")}`,
        );
      }
    }
  }
  // N9(b)（2026-09-19 用户裁定「dependencies 纳入校验」）：**结构**校验判 error —— 条目必须是对象、
  // module_name / version 必须是非空字符串（version 允许 "beta"）。这是「写没写对」；
  // N9(c)（下方）的「版本值是不是本仓已知真值」是另一回事，维持 warning（老包合法，不能判错）。
  // N9(c)（2026-09-19 裁定）：dependencies 里的 `@minecraft/server` 版本此前**零检查** —— 模板钉值 /
  // 生成器默认（文档快照）/ 用户手写三方分叉可以静默通过。这里只给 **warning**（老包合法，不能判错），
  // 并点名本仓两个已知真值；真值来源与语义分层见 loadBedrockScriptApiPin。
  const deps = parsed.dependencies;
  if (Array.isArray(deps)) {
    const pinVer = loadBedrockScriptApiPin().version;
    const snapshotVer = loadBedrockDocsStatus().scriptApiStable;
    const known = [pinVer, snapshotVer].filter((v): v is string => typeof v === "string" && v.length > 0);
    for (const [i, d] of deps.entries()) {
      const dep = d as Record<string, unknown> | null;
      if (!dep || typeof dep !== "object" || Array.isArray(dep)) {
        errors.push(`dependencies[${i}] 必须是对象（module_name + version）`);
        continue;
      }
      if (typeof dep.module_name !== "string" || !dep.module_name.trim()) {
        errors.push(`dependencies[${i}].module_name 必须是非空字符串`);
      }
      if (typeof dep.version !== "string" || !dep.version.trim()) {
        errors.push(`dependencies[${i}].version 必须是非空字符串（stable 版本号或 "beta"）`);
      }
      if (dep.module_name !== "@minecraft/server") continue;
      const v = dep.version;
      if (typeof v !== "string" || !v.trim()) {
        continue; // 结构问题已在上面积 error，值域 warning 无从谈起
      }
      if (v.trim() !== "beta" && known.length > 0 && !known.includes(v.trim())) {
        warnings.push(
          `dependencies[${i}] 声明 @minecraft/server=${v}，既不是本仓模板钉值（${pinVer ?? "未登记"}）也不是文档快照 stable（${snapshotVer ?? "?"}）` +
            ` —— 若确为更新版本，请对照 Learn 与 npm dist-tags；本仓真值见 mcp-server/data/bedrock-script-api-pin.json`,
        );
      }
    }
  }
  warnings.push(`对照 Learn pack manifest：${LEARN_PACK}`);
  return { ok: errors.length === 0, errors, warnings, docsStatus: loadBedrockDocsStatus() };
}

export const validateBpJsonSchema = z.object({
  kind: z.enum(["entity", "block", "item", "recipe"]).describe("BP JSON 类型"),
  json: z.string().describe("JSON 全文"),
});

export function validateBpJson(kind: "entity" | "block" | "item" | "recipe", json: string): Record<string, unknown> {
  const errors: string[] = [];
  const warnings: string[] = ["精简 schema，不是全量官方 JSON schema；正式字段以 Microsoft Learn 为准"];
  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(json) as Record<string, unknown>;
  } catch (e) {
    return { ok: false, errors: [`JSON 解析失败: ${(e as Error).message}`], warnings };
  }
  if (parsed.format_version == null) errors.push("缺少 format_version");
  const key =
    kind === "entity"
      ? "minecraft:entity"
      : kind === "block"
        ? "minecraft:block"
        : kind === "item"
          ? "minecraft:item"
          : "minecraft:recipe_shaped";
  if (kind === "recipe") {
    const hasRecipe = Object.keys(parsed).some((k) => k.startsWith("minecraft:recipe"));
    if (!hasRecipe) errors.push("合成 JSON 应含 minecraft:recipe_* 键");
  } else if (!parsed[key]) {
    errors.push(`缺少 ${key}`);
  } else {
    const desc = (parsed[key] as Record<string, unknown>)?.description as Record<string, unknown> | undefined;
    if (!desc || typeof desc.identifier !== "string" || !desc.identifier.includes(":")) {
      errors.push(`${key}.description.identifier 必须是 namespace:name`);
    }
  }
  if (Object.prototype.hasOwnProperty.call(parsed, "experimentalGameplay")) {
    errors.push("禁止在 BP JSON 写 experimentalGameplay");
  }
  return { ok: errors.length === 0, errors, warnings, docsStatus: loadBedrockDocsStatus() };
}

export const generateAddonManifestSchema = z.object({
  packName: z.string().describe("header.name"),
  description: z.string().optional(),
  packType: z.enum(["resources", "data", "both", "script"]).describe("resources=RP data=BP both=各一份 script=BP+script 模块"),
  minEngineVersion: z
    .tuple([z.number().int(), z.number().int(), z.number().int()])
    .optional()
    .describe("必须长度为 3 的整数数组；默认 [1, 26, 44]"),
  beta: z.boolean().optional().describe("仅当用户明确要 pack 侧 @minecraft/server 的 version: \"beta\"（须在世界打开 Beta APIs）时为 true。不是 @minecraft/server-beta 包名。"),
  scriptEval: z.boolean().optional().describe("仅当需要 eval 时写入 capabilities: [script_eval]"),
  headerUuid: z.string().optional().describe("packType=resources/both 时写进 RP header；packType=data/script 时（只有 BP）直接写进 BP header。非法 UUID 会被忽略并随机生成。"),
  moduleUuid: z.string().optional().describe("同 headerUuid，作用于 module 条目。"),
  bpHeaderUuid: z.string().optional().describe("仅 packType=both：写进 BP/manifest.json 的 header uuid（不与 RP 共用，两包 header 同 uuid 会互相顶掉）。packType=data/script/resources 时被忽略并回 Warning。"),
  bpModuleUuid: z.string().optional().describe("仅 packType=both：写进 BP/manifest.json 的 module uuid。packType=data/script/resources 时被忽略并回 Warning。"),
  write: z.boolean().optional().describe("默认 false。true 时写入 projectPath（须 confirmed + MC_SKILL_ALLOW_WRITE=1 + MC_SKILL_PROJECT_ROOT；projectPath 不能替代后者）"),
  confirmed: z.boolean().optional().describe("write=true 时必填 true"),
  projectPath: z.string().optional().describe("写入目标工程根（须在 MC_SKILL_PROJECT_ROOT 内）"),
});

/**
 * C-29：**未钉住**的 uuid 一律现生成（crypto.randomUUID），不可复现；调用方传了合法 UUID 就原样采用。
 * 旧名 `fakeUuid(seed)` 带一个从不使用的 seed 形参，读起来像「同 seed → 同 uuid」，
 * 实测相反：`node dist/cli.js generate_addon_manifest --packName=demo --packType=both`
 * 连跑两次，RP/BP 的 4 个 uuid **全部不同**。故改名 freshUuid 并去掉假 seed 参数。
 */
function freshUuid(): string {
  return randomUUID();
}

export function generateAddonManifest(args: z.infer<typeof generateAddonManifestSchema>): Record<string, unknown> {
  // 钉值依据（核对日期 2026-09-07）：npm `@minecraft/server` 最近一个 `-stable` 版本串
  // `2.10.0-beta.1.26.44-stable` 内嵌的引擎版本 1.26.44；改号须同步 8 份 00-project-setup 与 bedrock/scaffold。
  // 上游实况（npm dist-tags 一手复核，as-of 2026-09-18）：latest(stable)=2.10.0、
  // beta=2.11.0-beta.1.26.51-stable（引擎 1.26.51）、rc=2.11.0-rc.1.26.60-preview.25
  // ⇒ 本默认已是上一代 beta 引擎；是否随上游推进属行为变更，须用户逐次裁定（2026-09-18 裁定：默认不动，输出加注说明）。
  const min = args.minEngineVersion ?? [1, 26, 44];
  const status = loadBedrockDocsStatus();
  const warnings: string[] = [];
  if (args.beta) {
    warnings.push(
      "该功能依赖实验性玩法 / Beta APIs。必须在世界设置打开「Beta APIs」。禁止把 experimentalGameplay 写入 pack JSON。Minecraft Education / BDS 无该 GUI，只能手改 level.dat：experiments compound 里加对应 byte=1（「Beta APIs」= gametest；键名出处 wiki.bedrock.dev = 社区权威，非 Learn 官方）。Learn：" +
        LEARN_EXPERIMENTS,
    );
  }
  if (min[0] < 1 || (min[0] === 1 && min[1] < 19) || (min[0] === 1 && min[1] === 19 && min[2] < 80)) {
    warnings.push(
      "min_engine_version 低于约 1.19.80：不要把现行 capabilities 列表倒灌到旧引擎；生成前对照该引擎版本的 Learn/wiki 归档。",
    );
  }
  if (args.scriptEval && args.packType === "resources") {
    warnings.push("script_eval 只写入行为包（BP）；资源包（RP）不会写入 capabilities。");
  }
  const stableVer = status.scriptApiStable ?? "1.11.0";
  warnings.push(
    `默认 @minecraft/server 版本取自 bedrock-docs-status.scriptApiStable（当前 ${stableVer}）。入库可能滞后，发布前对照 Learn。`,
  );
  // N9(c)：把「模板钉值」与「文档快照」两个真值同时摊开（只加披露，不动默认值 —— 默认跟随快照是既定语义）。
  const apiPin = loadBedrockScriptApiPin();
  if (apiPin.invalid) {
    warnings.push(`钉值表不可用（${apiPin.invalid}）—— 无法核对本仓模板钉值；本工具默认值不受影响（那是文档快照语义）。`);
  } else if (apiPin.version && apiPin.version !== stableVer) {
    warnings.push(
      `语义分层（2026-09-19 裁定）：本工具默认值 = 文档快照 scriptApiStable（${stableVer}，随抓取滞后）；` +
        `本仓模板 bedrock/scaffold/BP/manifest.json 的钉值 = ${apiPin.version}` +
        `（as-of ${apiPin.asOf ?? "?"}；依据见 mcp-server/data/bedrock-script-api-pin.json）。两者不同是有意为之，取舍不要照抄任一侧。`,
    );
  }
  // bedrock 默认值说明（2026-09-18 用户裁定：不改代码默认 [1,26,44]，只在输出里加注当前 stable）：
  warnings.push(
    `min_engine_version 默认 [1,26,44] 是本生成器的钉值（2026-09-07 依 npm beta 串 2.10.0-beta.1.26.44-stable 所指引擎）。` +
      `上游实况（npm dist-tags，as-of 2026-09-18）：@minecraft/server latest(stable)=2.10.0、beta=2.11.0-beta.1.26.51-stable（引擎 1.26.51）` +
      `—— 若你的目标引擎更新，用 minEngineVersion 参数显式指定，不要依赖本默认值。`,
  );

  /** C-29：哪个槽位是调用方钉住的、哪个是现生成的、哪个传值被拒 */
  const generatedUuidSlots: string[] = [];
  const rejectedUuidArgs: string[] = [];
  function pickUuid(caller: string | undefined, slot: string): string {
    if (caller && UUID_RE.test(caller)) return caller;
    if (caller) rejectedUuidArgs.push(slot);
    generatedUuidSlots.push(slot);
    return freshUuid();
  }
  const headerUuid = pickUuid(args.headerUuid, "headerUuid");
  const moduleUuid = pickUuid(args.moduleUuid, "moduleUuid");

  function one(type: "resources" | "data" | "script", hdr: string, mod: string): Record<string, unknown> {
    const modules: Record<string, unknown>[] = [
      {
        type: type === "script" ? "script" : type,
        uuid: mod,
        version: [1, 0, 0],
        ...(type === "script" ? { language: "javascript", entry: "scripts/main.js" } : {}),
      },
    ];
    const manifest: Record<string, unknown> = {
      format_version: 2,
      header: {
        name: args.packName,
        description: args.description ?? args.packName,
        uuid: hdr,
        version: [1, 0, 0],
        min_engine_version: min,
      },
      modules,
    };
    if (type === "script" || args.packType === "script") {
      manifest.dependencies = [
        args.beta
          ? { module_name: "@minecraft/server", version: "beta" }
          : { module_name: "@minecraft/server", version: stableVer },
      ];
    }
    if (args.scriptEval && type !== "resources") {
      manifest.capabilities = ["script_eval"];
      warnings.push(
        `script_eval 不在官方 pack-manifest capabilities 表（表内只有 ${BEDROCK_CAPABILITIES.join(" / ")}）；` +
          `validate_addon_manifest 会把它报成未知 capability。引擎是否真接受未核实，请对照目标引擎版本。`,
      );
    }
    return manifest;
  }

  const uuids: Record<"RP" | "BP", [string, string]> = { RP: [headerUuid, moduleUuid], BP: [headerUuid, moduleUuid] };
  const ignoredUuidArgs: string[] = [];
  if (args.packType === "both") {
    uuids.BP = [pickUuid(args.bpHeaderUuid, "bpHeaderUuid"), pickUuid(args.bpModuleUuid, "bpModuleUuid")];
  } else {
    for (const [slot, val] of [
      ["bpHeaderUuid", args.bpHeaderUuid],
      ["bpModuleUuid", args.bpModuleUuid],
    ] as const) {
      if (val) ignoredUuidArgs.push(slot);
    }
  }

  const files: Record<string, unknown> = {};
  if (args.packType === "resources") files["RP/manifest.json"] = one("resources", ...uuids.RP);
  else if (args.packType === "data") files["BP/manifest.json"] = one("data", ...uuids.BP);
  else if (args.packType === "script") files["BP/manifest.json"] = one("script", ...uuids.BP);
  else {
    files["RP/manifest.json"] = one("resources", ...uuids.RP);
    files["BP/manifest.json"] = one("data", ...uuids.BP);
  }

  if (generatedUuidSlots.length) {
    const pinArgs =
      args.packType === "data" || args.packType === "script"
        ? "headerUuid / moduleUuid"
        : args.packType === "both"
          ? "headerUuid / moduleUuid（RP）与 bpHeaderUuid / bpModuleUuid（BP）"
          : "headerUuid / moduleUuid";
    warnings.push(
      `uuid 槽位 ${generatedUuidSlots.join(" / ")} 由 crypto.randomUUID() 现生成，**不可复现**：` +
        `同参数再调一次得到的是另一组 uuid（实测连跑两次 generate_addon_manifest，RP/BP 四个 uuid 全变）。` +
        `pack 身份靠 uuid 识别，uuid 变了引擎会当成新 pack；要把同一包反复覆盖升级，请把本次返回值里的 uuid` +
        `在下次调用时用 ${pinArgs} 显式钉回。`,
    );
  }
  if (rejectedUuidArgs.length) {
    warnings.push(
      `${rejectedUuidArgs.join(" / ")} 传入值不是标准 UUID（需 8-4-4-4-12 十六进制），已忽略并改为现生成（同样不可复现）。`,
    );
  }
  if (ignoredUuidArgs.length) {
    warnings.push(
      `${ignoredUuidArgs.join(" / ")} 只在 packType=both（同时出 RP+BP）时生效；本次 packType=${args.packType} 只有一个包，` +
        `BP 的槽位是 headerUuid / moduleUuid，上述参数已完全忽略——若你以为已经钉住 BP uuid，请改用 headerUuid / moduleUuid 重调。`,
    );
  }

  return {
    ok: true,
    files,
    warnings,
    docsStatus: status,
    note: "只返回 JSON 文本，不写盘。不要创建 worldgen/experimental.json 当作 Beta 开关。",
  };
}

export const generateBpEntitySchema = z.object({
  identifier: z.string().describe("如 demo:widget"),
  betaExplodeEvent: z.boolean().optional().describe("仅当用户点名方块爆炸等仍属 Beta 的事件"),
  write: z.boolean().optional().describe("默认 false。true 时写入 projectPath（须 confirmed + MC_SKILL_ALLOW_WRITE=1 + MC_SKILL_PROJECT_ROOT；projectPath 不能替代后者）"),
  confirmed: z.boolean().optional().describe("write=true 时必填 true"),
  projectPath: z.string().optional().describe("写入目标工程根（须在 MC_SKILL_PROJECT_ROOT 内）"),
});

export function generateBpEntity(args: z.infer<typeof generateBpEntitySchema>): Record<string, unknown> {
  const warnings: string[] = [];
  const ident = args.identifier.replace(/\\/g, "/").split("/").pop() ?? args.identifier;
  const cleaned = ident.replace(/\.\./g, "").replace(/[^a-z0-9_:-]/gi, "");
  if (cleaned !== ident || ident !== args.identifier) {
    warnings.push(
      `identifier「${args.identifier}」被改写成「${cleaned}」（先取路径尾段，再剥 ../ 与非法字符）——` +
        `这不是你写的名字，落盘前请核对；路径穿越不会被接受，但也不会替你保留原样。`,
    );
  }
  if (!cleaned.includes(":")) {
    return { ok: false, errors: ["identifier 必须是 namespace:name"], files: {} };
  }
  const entity = {
    format_version: "1.21.0",
    "minecraft:entity": {
      description: {
        identifier: cleaned,
        is_spawnable: true,
        is_summonable: true,
      },
      components: {
        "minecraft:health": { value: 20, max: 20 },
        "minecraft:physics": {},
      },
    },
  };
  const files: Record<string, unknown> = {
    [`BP/entities/${cleaned.replace(":", "_")}.json`]: entity,
  };
  if (args.betaExplodeEvent) {
    files["script-snippet.js"] =
      `import { world } from "@minecraft/server";\n// Beta：BlockExplodeAfterEvent 等需 pack 侧 dependencies 声明 @minecraft/server version=beta，并在世界打开 Beta APIs。\nworld.afterEvents.blockExplode?.subscribe((ev) => {\n  console.warn("block exploded", ev.block);\n});\n`;
    const man = generateAddonManifest({
      packName: `${cleaned} scripts`,
      packType: "script",
      beta: true,
      // 不重复写死引擎版本：取 generateAddonManifest 的钉值默认（同上）
    });
    const bpMan = (man.files as Record<string, unknown> | undefined)?.["BP/manifest.json"];
    if (bpMan) files["BP/manifest.json"] = bpMan;
    if (Array.isArray(man.warnings)) {
      for (const w of man.warnings) {
        if (typeof w === "string") warnings.push(w);
      }
    }
    warnings.push(
      "BlockExplodeAfterEvent 等属于 Beta。允许生成，但必须：1) BP manifest dependencies 已声明 @minecraft/server 的 beta 版本（见 BP/manifest.json）；2) 用户在世界设置打开 Beta APIs；3) 不要写 experimentalGameplay 或虚构 worldgen/experimental.json。",
    );
  }
  return { ok: true, files, warnings, docsStatus: loadBedrockDocsStatus() };
}

export * from "./content-log.js";
