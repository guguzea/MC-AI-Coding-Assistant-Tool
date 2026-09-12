/**
 * Fabric 语料 transclude 展开 —— 上游 `markdown-it-vuepress-code-snippet-enhanced` 的离线移植。
 *
 * 上游 fabric-docs 的 `.md` 里代码不是正文，而是占位符
 * `@[code lang=java transcludeWith=:::1](@/reference/1.20.4/src/.../Example.java)`，
 * 由 VitePress 在渲染时按 `temp/_w71_plugin.js`（dfb9fa25 版）读仓库内 `reference/` 展开。
 * 我们只镜像 `.md`，所以 `get_fabric_doc_full` 吐给模型的正文里是 1672 个裸占位符 = 空代码块。
 * 本模块在读取侧做同一件事：把占位符换成正真从 `data/fabric_<ver>/reference/` 读出的代码块。
 *
 * 语料正文保持上游逐字节原样（`processed/*.md` 不被改写），展开只发生在返回给调用方的副本上。
 *
 * 与上游的两处刻意差异（只影响呈现，不影响取到的字节）：
 * 1. fence info 只用 `lang || ext`，不拼 `highlight={6-7}`。那是渲染期高亮语法，对文本消费者是
 *    噪声；原 attrs 完整保留在每个块的来源注释里。
 * 2. 展开块后追加一行 `<!-- source: <目标> <attrs> · upstream <路径> -->`。上游渲染成 HTML 时不
 *    保留出处，而我们要让「这段代码来自哪个上游文件」在正文里可核。
 *
 * `transcludeWith` 是**逐行正则 + 区间翻转**（不是整段匹配），所以 `:::1` 也会命中 `:::10` 那行；
 * 这是上游行为，照搬不修（改了就和线上文档对不上）。
 */

import { existsSync, readFileSync } from "fs";
import { isAbsolute, join, relative, resolve } from "path";
import { trimOldest } from "../search-utils.js";

/** 上游 `@[code …](…)`：行首（允许前导空格）的 `@[code`。 */
const MARKER_RE = /@\[code([^\]]*)\]\(([^)]*)\)/g;
/**
 * VitePress 的 `<<< @/path#region{lines}[Label] attrs`（fabric-docs 1.21.4+ 用它替代 `@[code]`）。
 * 三种尾缀都是实测形态：`#repair_tags[Java]`（标签页标题）、`#loot_pool_builder{5-7}`（行选择）、
 * `unit.json[Output]`（无区段只有标签）。它们都不属于路径，也不属于区段名。
 */
const ANGLE_RE = /^ *<<< *(\S+)(.*)$/;

export interface AngleSpec {
  /** 去掉区段/行选/标签之后的纯路径（就是取件与镜像查找用的键）。 */
  path: string;
  region: string | null;
  /** `{5-7}` / `{2}` / `{1,3}`：区段内（无区段时全文）的 1-based 行选择。 */
  lines: string | null;
  /** `[Java]` 之类的标签页标题，只作出处留痕。 */
  label: string;
  /** 括号之后的其余 attrs 原文。 */
  rest: string;
}

/** 拆 `<<<` 的目标文法。reader 与 G3 门都必须走这一条，否则两边判据会各自漂移。 */
export function parseAngleSpec(raw: string, trailing = ""): AngleSpec {
  let cur = raw;
  let label = "";
  const lm = /\[([^\]]*)\]$/.exec(cur);
  if (lm) {
    label = lm[1];
    cur = cur.slice(0, lm.index);
  }
  let lines: string | null = null;
  const bm = /\{([^}]*)\}$/.exec(cur);
  if (bm) {
    lines = bm[1];
    cur = cur.slice(0, bm.index);
  }
  const lm2 = /\[([^\]]*)\]$/.exec(cur);
  if (lm2 && !label) {
    label = lm2[1];
    cur = cur.slice(0, lm2.index);
  }
  const h = cur.lastIndexOf("#");
  const region = h > 0 ? cur.slice(h + 1) : null;
  if (h > 0) cur = cur.slice(0, h);
  return { path: cur, region, lines, label, rest: trailing };
}

/**
 * 区段名的候选写法。实测 fabric_1.21.11 的 interface-injection 页 6 处用 kebab 引用 snake_case 标记
 * （语料 `#interface-injection-example-interface` ↔ blob `:7 // #region interface_injection_example_interface`），
 * 其余 500 处是逐字命中。两式都取，是为了给模型真代码而不是空围栏；逐字命中优先，顺序固定。
 */
export function regionCandidates(region: string): string[] {
  return [...new Set([region, region.replace(/-/g, "_"), region.replace(/_/g, "-")])];
}
/** 围栏内的内容是字面文本，上游 block ruler 不会进去，所以扫描时要跟踪围栏状态。 */
const FENCE_RE = /^ {0,3}(```|~~~)/;
/** 上游 contentTransclusion 无命中时返回的字面量。 */
export const NO_LINES_MATCHED = "No lines matched.";

const CACHE_TTL_MS = 5 * 60 * 1000;
const REF_CACHE_MAX = 256;

// ── provenance（reference.provenance.json）─────────────────────────────────

export interface ProvenanceFile {
  blobSha: string;
  sha256: string;
  bytes: number;
  via?: string;
}

export interface ProvenanceAlias {
  realPath: string;
  reason?: string;
  evidence?: string;
}

export interface ReferenceProvenance {
  packRoot: string;
  commitSha: string;
  files: Map<string, ProvenanceFile>;
  aliases: Map<string, ProvenanceAlias>;
}

interface ProvenanceCacheEntry {
  data: ReferenceProvenance | null;
  expiry: number;
}

const provenanceCache = new Map<string, ProvenanceCacheEntry>();
const refCache = new Map<string, { data: string | null; expiry: number }>();

function fileNameOf(target: string): string {
  const parts = target.split("/");
  return parts[parts.length - 1] ?? target;
}

/**
 * 读某档根的 `reference.provenance.json`。没有 = 该档未取件 → 调用方按「不展开」处理。
 * `files` 的键是**上游相对路径**（`reference/1.20.4/src/...`，别名已折叠）。
 */
export function loadReferenceProvenance(packRoot: string, now: number = Date.now()): ReferenceProvenance | null {
  const key = resolve(packRoot);
  const hit = provenanceCache.get(key);
  if (hit && hit.expiry > now) return hit.data;
  let data: ReferenceProvenance | null = null;
  const file = join(key, "reference.provenance.json");
  if (existsSync(file)) {
    try {
      const raw = JSON.parse(readFileSync(file, "utf-8")) as {
        commitSha?: string;
        files?: Record<string, ProvenanceFile>;
        aliases?: Record<string, ProvenanceAlias>;
      };
      const files = new Map<string, ProvenanceFile>();
      if (raw.files && typeof raw.files === "object") {
        for (const [k, v] of Object.entries(raw.files)) {
          if (v && typeof v === "object" && typeof v.sha256 === "string") files.set(k, v);
        }
      }
      const aliases = new Map<string, ProvenanceAlias>();
      if (raw.aliases && typeof raw.aliases === "object") {
        for (const [k, v] of Object.entries(raw.aliases)) {
          if (v && typeof v === "object" && typeof v.realPath === "string") aliases.set(k, v);
        }
      }
      data = { packRoot: key, commitSha: String(raw.commitSha ?? ""), files, aliases };
    } catch {
      data = null;
    }
  }
  provenanceCache.set(key, { data, expiry: now + CACHE_TTL_MS });
  trimOldest(provenanceCache, 32);
  return data;
}

function readReferenceFile(absPath: string, now: number): string | null {
  const hit = refCache.get(absPath);
  if (hit && hit.expiry > now) return hit.data;
  let data: string | null = null;
  try {
    if (existsSync(absPath)) data = readFileSync(absPath, "utf-8");
  } catch {
    data = null;
  }
  refCache.set(absPath, { data, expiry: now + CACHE_TTL_MS });
  trimOldest(refCache, REF_CACHE_MAX);
  return data;
}

// ── 上游 parseOptions / transclusionType 的等价实现 ─────────────────────────

type AttrMap = Map<string, string | undefined>;

/** 上游 `opts.trim().split(" ")` + 每段按 `=` 切；无 `=` 的裸键值为 undefined（照搬）。 */
function parseAttrs(attrs: string): AttrMap {
  const out: AttrMap = new Map();
  for (const pair of attrs.trim().split(" ")) {
    if (!pair) continue;
    const idx = pair.indexOf("=");
    if (idx === -1) out.set(pair, undefined);
    else out.set(pair.slice(0, idx), pair.slice(idx + 1));
  }
  return out;
}

type TransclusionType = "line" | "tag" | "with" | null;

/** 上游 precedence：transcludeWith → transcludeTag → transclude，且值必须为真（裸键不展开）。 */
function transclusionType(options: AttrMap): TransclusionType {
  if (options.get("transcludeWith")) return "with";
  if (options.get("transcludeTag")) return "tag";
  if (options.get("transclude")) return "line";
  return null;
}

/** 上游 `token.info = (options.lang || d.file.ext) + opts.meta`；meta（highlight）见文件头差异 1。 */
function fenceInfo(options: AttrMap, target: string): string {
  const name = fileNameOf(target);
  const fileParts = name.split(".");
  const ext = fileParts[fileParts.length - 1] ?? "";
  return String(options.get("lang") || ext);
}

// ── contentTransclusion 的等价实现 ─────────────────────────────────────────

/** 上游 dedent：按非空行最短前导空白整体左移。 */
function dedent(content: string): string {
  const lines = content.split("\n");
  let min = Infinity;
  for (const line of lines) {
    if (/^\s*$/.test(line)) continue;
    const lead = (line.match(/^(\s*)/) as RegExpMatchArray)[0].length;
    if (lead < min) min = lead;
  }
  if (!Number.isFinite(min) || min === 0) return content;
  return lines
    .map((line) => ((line.match(/^(\s*)/) as RegExpMatchArray)[0].length >= min ? line.slice(min) : line))
    .join("\n");
}

/** 上游 `transcludeWith=t`：`new RegExp(t)` 逐行翻转，分隔行本身丢弃（故 `:::1` 会命中 `:::10`）。 */
function sliceWithRegion(content: string, region: string): string {
  let re: RegExp;
  try {
    re = new RegExp(region);
  } catch {
    return "";
  }
  let out = "";
  let matched = false;
  for (const line of content.split("\n")) {
    if (re.test(line)) {
      matched = !matched;
      continue;
    }
    if (matched) out += line + "\n";
  }
  return out;
}

/** 上游 `transclude={a-b}`：洗掉非 `[0-9|-]` 字符后按 `-` 切，1-based 闭区间（字符串→数字隐式比较）。 */
function sliceLineRange(content: string, spec: string): string {
  const [tStart, tEnd] = spec.replace(/[^\d|-]/g, "").split("-");
  let out = "";
  content.split("\n").forEach((line, idx) => {
    const i = idx + 1;
    // eslint-disable-next-line eqeqeq -- 上游就是 number 与 string 的 `>=`/`<=` 比较，照搬
    if (i >= (tStart as unknown as number) && i <= (tEnd as unknown as number)) out += line + "\n";
  });
  return out;
}

/** 上游 `transcludeTag=x`：匹配 `x>$|^<x` 的行，首尾分隔行**包含**在内。 */
function sliceTag(content: string, tag: string): string {
  let re: RegExp;
  try {
    re = new RegExp(`${tag}>$|^<${tag}`);
  } catch {
    return "";
  }
  let out = "";
  let matched = false;
  for (const line of content.split("\n")) {
    if (matched && re.test(line)) return out + line + "\n";
    if (matched) out += line + "\n";
    else if (re.test(line)) {
      out += line + "\n";
      matched = true;
    }
  }
  return out;
}

/**
 * `<<< path#region` 的区段切片。标记形态由镜像实测得出（非推测）：
 * `data/fabric_1.21.11/reference/.../ExampleModItemTagProvider.java:46` 是 `\t// #region repair_tags`，
 * `:49` 是 `\t// #endregion repair_tags`。首尾标记行不计入正文，与本文件 `transcludeWith` 的处理一致。
 * 名字做字面匹配并转义（真实标签里有 `datagen-tags:provider` 这类含 `-`/`:` 的名字，不能当正则用）。
 * 起止任一缺失即返回空串 ⇒ 上层按 `No lines matched.` 处理（宁可不给，不给半截）。
 */
function sliceRegionMarker(content: string, name: string): string {
  const esc = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const startRe = new RegExp(`#region\\s+${esc}(\\b|$)`);
  const endRe = new RegExp(`#endregion\\s+${esc}(\\b|$)`);
  const lines = content.split("\n");
  let i = 0;
  while (i < lines.length && !startRe.test(lines[i])) i++;
  if (i === lines.length) return "";
  let j = i + 1;
  while (j < lines.length && !endRe.test(lines[j])) j++;
  if (j === lines.length) return "";
  return lines.slice(i + 1, j).join("\n") + "\n";
}

/** `{5-7}` / `{2}` / `{1,3}`：1-based 闭区间，允许逗号并列。非法段忽略（不给半截）。 */
export function pickLines(text: string, spec: string): string {
  const kept: string[] = [];
  for (const part of spec.split(",")) {
    const m = /^(\d+)(?:-(\d+))?$/.exec(part.trim());
    if (!m) continue;
    const from = Number(m[1]);
    const to = m[2] === undefined ? from : Number(m[2]);
    if (to < from) continue;
    for (let n = from; n <= to; n++) {
      const line = text.split("\n")[n - 1];
      if (line !== undefined) kept.push(line);
    }
  }
  return kept.length ? kept.join("\n") + "\n" : "";
}

/**
 * `<<<` 处的正文：区段（按候选名依次尝试）→ 可选行选择 → 整体左移。
 * 返回 [正文, 实际用到的区段名]；两者取不到时正文为 No lines matched.
 */
export function angleResolve(fileText: string, spec: AngleSpec): [string, string | null] {
  let body = fileText;
  let used: string | null = null;
  if (spec.region !== null) {
    let hit = "";
    for (const cand of regionCandidates(spec.region)) {
      hit = sliceRegionMarker(fileText, cand);
      if (hit !== "") {
        used = cand;
        break;
      }
    }
    if (hit === "") return [NO_LINES_MATCHED, null];
    body = hit;
  }
  // 只有纯数字形态才是行选择。实测花括号里还会装选项（26.1.2 三处 `{classtweaker:no-line-numbers}`），
  // 把它当行号会让整个区段消失 ⇒ 非数字一律当选项忽略，整段照给。
  if (spec.lines && /^[\d\s,-]+$/.test(spec.lines)) {
    const sel = pickLines(body, spec.lines);
    if (sel === "") return [NO_LINES_MATCHED, used];
    body = sel;
  }
  return [dedent(body), used];
}

function contentTransclusion(content: string, options: AttrMap, type: TransclusionType): string {
  let raw = "";
  if (type === "line") raw = sliceLineRange(content, String(options.get("transclude")));
  else if (type === "tag") raw = sliceTag(content, String(options.get("transcludeTag")));
  else if (type === "with") raw = sliceWithRegion(content, String(options.get("transcludeWith")));
  if (raw === "") return NO_LINES_MATCHED;
  if (options.get("dontTrim")) return raw;
  return dedent(raw);
}

// ── 展开入口 ───────────────────────────────────────────────────────────────

export interface ExpandTranscludesResult {
  content: string;
  /** 正文里出现的 `@[code …]` 标记行数（不含围栏内的字面文本）。 */
  sites: number;
  /** 展开成代码块的处数（含本地取不到时的 `Not Found:` 块）。 */
  expanded: number;
  /** 本地 reference 树取不到的目标原样清单（去重，保持出现顺序）。**只统计 `@[code`**——
   *  既有 gate 台账（1672 / 3344 / 669）是按这个口径钉的，`<<<` 走下面的独立字段。 */
  missing: string[];
  /** 展开结果为 `No lines matched.` 的处数（上游同形，不算缺陷）。 */
  noMatch: number;
  /** attrs/目标畸形到无法按上游语义解析、整行原样保留的处数。 */
  malformed: number;
  /** `<<<` 形式的标记行数（与 sites 分开计，两者相加 = 全部占位符）。 */
  angleSites: number;
  /** `<<<` 形式在本地镜像取不到的目标（去重）= 取件侧未做，S6 逐档清空。 */
  angleMissing: string[];
  /** `<<<` 带 `#region` 但镜像文件里查不到该成对标记的处数 = 目标取到了但区段不对。 */
  angleRegionMiss: number;
}

/**
 * 目标 → 本地绝对路径。上游公式是 `fullpath.replace(/^@/, process.cwd())`，
 * 所以**档根**（`data/fabric_<ver>`）扮演 cwd；无 `@` 前缀的目标同样落档根（上游是进程 cwd）。
 * 别名列（provenance `aliases`）优先，用于覆盖上游仓库里改名/挪位的少数目标。
 */
function localPathFor(target: string, packRoot: string, provenance: ReferenceProvenance | null): string {
  const root = resolve(packRoot);
  const alias = provenance?.aliases.get(target);
  if (alias) {
    const abs = resolve(root, alias.realPath);
    const rel = relative(root, abs);
    if (!rel.startsWith("..") && !isAbsolute(rel)) return abs;
  }
  return join(root, target.replace(/^@/, ""));
}

/** 目标 → 上游相对路径（= provenance `files` 的键；别名已折叠）。gate 与运行时共用这一条公式。 */
export function upstreamRelPathFor(target: string, provenance: ReferenceProvenance | null): string {
  const alias = provenance?.aliases.get(target);
  if (alias) return alias.realPath;
  return target.replace(/^@/, "").replace(/^\//, "");
}

/** 目标 → 本地镜像绝对路径（`<packRoot>/<上游相对路径>`）。 */
export function referenceLocalPath(target: string, packRoot: string, provenance: ReferenceProvenance | null): string {
  return localPathFor(target, packRoot, provenance);
}

export function expandTranscludes(
  markdown: string,
  packRoot: string,
  provenance: ReferenceProvenance | null = null,
  now: number = Date.now(),
): ExpandTranscludesResult {
  const lines = markdown.split("\n");
  const out: string[] = [];
  const missing: string[] = [];
  const angleMissingList: string[] = [];
  let sites = 0;
  let expanded = 0;
  let noMatch = 0;
  let malformed = 0;
  let angleSites = 0;
  let angleRegionMiss = 0;
  let inFence = false;

  for (const line of lines) {
    if (FENCE_RE.test(line)) inFence = !inFence;
    const isCode = /^ *@\[code/.test(line);
    const isAngle = !isCode && ANGLE_RE.test(line);
    if (inFence || (!isCode && !isAngle)) {
      out.push(line);
      continue;
    }
    const indent = (line.match(/^(\s*)/) as RegExpMatchArray)[0];
    let rawAttrs: string;
    let target: string;
    let options: AttrMap;
    let type: TransclusionType = null;
    let region: string | null = null;
    let angleSpec: AngleSpec | null = null;
    if (isCode) {
      MARKER_RE.lastIndex = 0;
      const m = MARKER_RE.exec(line);
      if (!m || !m[2].trim()) {
        out.push(line);
        malformed++;
        continue;
      }
      sites++;
      rawAttrs = m[1];
      target = m[2].trim();
      options = parseAttrs(rawAttrs);
      type = transclusionType(options);
    } else {
      const am = ANGLE_RE.exec(line) as RegExpExecArray;
      if (!am[1]) {
        out.push(line);
        malformed++;
        continue;
      }
      angleSites++;
      const ang = parseAngleSpec(am[1], am[2] ?? "");
      target = ang.path;
      angleSpec = ang;
      region = ang.region;
      rawAttrs = [ang.region ? `#${ang.region}` : "", ang.lines ? `{${ang.lines}}` : "", ang.label ? `[${ang.label}]` : "", ang.rest.trim()]
        .filter(Boolean)
        .join("");
      // `{1,2}` 高亮与 `[Server]` 标签都是渲染期信息，对文本消费者是噪声（原文完整留在下面的出处注释里）
      options = parseAttrs(rawAttrs.replace(/\[[^\]]*\]/g, "").replace(/\{[^}]*\}/g, ""));
    }
    const absTarget = localPathFor(target, packRoot, provenance);
    const fileText = readReferenceFile(absTarget, now);
    let body: string;
    if (fileText === null) {
      if (isAngle) angleMissingList.push(target);
      else missing.push(target);
      body = `Not Found: ${absTarget}`;
    } else if (angleSpec) {
      const [got] = angleResolve(fileText, angleSpec);
      body = got;
      if (got === NO_LINES_MATCHED) {
        noMatch++;
        angleRegionMiss++;
      }
    } else if (!type) {
      body = fileText;
    } else {
      body = contentTransclusion(fileText, options, type);
      if (body === NO_LINES_MATCHED) noMatch++;
    }
    const info = fenceInfo(options, target);
    const attrsSuffix = rawAttrs.trim() ? ` ${rawAttrs.trim()}` : "";
    out.push(
      `${indent}\`\`\`${info}`,
      body.replace(/\n$/, ""),
      `${indent}\`\`\``,
      `${indent}<!-- source: ${target}${region === null ? "" : `#${region}`}${attrsSuffix} -->`,
    );
    if (isCode) expanded++;
  }

  return {
    content: out.join("\n"),
    sites,
    expanded,
    missing: [...new Set(missing)],
    noMatch,
    malformed,
    angleSites,
    angleMissing: [...new Set(angleMissingList)],
    angleRegionMiss,
  };
}

/** 正文里是否还有未展开的标记（gate 与运行时共用这条判据；两种形态都算）。 */
export function hasUnexpandedMarker(content: string): boolean {
  let inFence = false;
  for (const line of content.split("\n")) {
    if (FENCE_RE.test(line)) inFence = !inFence;
    if (!inFence && (/^ *@\[code/.test(line) || ANGLE_RE.test(line))) return true;
  }
  return false;
}

/** 标记扫描（gate 用）：返回逐行命中的 {attrs, target}，围栏内与畸形行同样报出。 */
export function scanTranscludeSites(content: string): Array<{ line: number; attrs: string; target: string }> {
  const hits: Array<{ line: number; attrs: string; target: string }> = [];
  let inFence = false;
  content.split("\n").forEach((line, idx) => {
    if (FENCE_RE.test(line)) inFence = !inFence;
    if (inFence || !/^ *@\[code/.test(line)) return;
    MARKER_RE.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = MARKER_RE.exec(line))) {
      hits.push({ line: idx + 1, attrs: m[1], target: m[2].trim() });
    }
  });
  return hits;
}

export function referenceAvailable(packRoot: string): boolean {
  return existsSync(join(packRoot, "reference")) || existsSync(join(packRoot, "reference.provenance.json"));
}

export function clearTranscludeCache(): void {
  refCache.clear();
  provenanceCache.clear();
}

export function transcludeCacheSizes(): [number, number] {
  return [refCache.size, provenanceCache.size];
}
