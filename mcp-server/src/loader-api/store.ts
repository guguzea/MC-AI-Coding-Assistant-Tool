import { existsSync, openSync, readSync, closeSync, readdirSync, readFileSync, statSync } from "fs";
import { createHash } from "crypto";
import { join } from "path";
import { resolveCacheRoot } from "../decompile/cache.js";
import {
  candidateKeys,
  officialSummariesDir,
  parseKey,
} from "./keys.js";
import type { LoaderApiKeyMeta, LoaderApiSummary, LoaderClassRecord, MethodInfo } from "./types.js";

type MergedCache = {
  stamp: string;
  map: Map<string, { summary: LoaderApiSummary; overlay: boolean }>;
};
let _mergedCache: MergedCache | null = null;

const PROBE_BYTES = 8192;
const FULL_HASH_LIMIT = 1 << 20;

/**
 * ≤1 MiB 全文哈希；更大只取首尾各 8 KiB。
 * 官方摘要树实测 65 MB / 35 个文件：全文哈希一趟 196–614 ms（热/冷文件缓存），
 * 首尾探针 40 ms，纯 stat 1.4 ms。stamp 每次查询都要算，所以大文件退化为有界探针
 * —— 再叠上 size/mtime/ino/birthtime 补住探针看不见的中段。
 */
function contentDigest(path: string, size: number): string {
  const h = createHash("sha256");
  if (size <= FULL_HASH_LIMIT) {
    return h.update(readFileSync(path)).digest("hex").slice(0, 16);
  }
  const fd = openSync(path, "r");
  try {
    const head = Buffer.alloc(PROBE_BYTES);
    const headLen = readSync(fd, head, 0, PROBE_BYTES, 0);
    const tail = Buffer.alloc(PROBE_BYTES);
    const tailLen = readSync(fd, tail, 0, PROBE_BYTES, size - PROBE_BYTES);
    h.update(head.subarray(0, headLen)).update(tail.subarray(0, tailLen));
  } finally {
    closeSync(fd);
  }
  return h.digest("hex").slice(0, 16);
}

function dirStamp(dir: string): string {
  try {
    if (!existsSync(dir)) return "missing";
    let names: string[] = [];
    try {
      names = readdirSync(dir);
    } catch {
      return "err";
    }
    const parts = names
      .filter((n) => isSummaryFile(n))
      .sort()
      .map((n) => {
        const p = join(dir, n);
        try {
          const st = statSync(p);
          // ino + birthtimeMs 只对 >1 MiB 的探针段有意义：中段变更而 mtime/size 被复制工具原样
          // 保留时，首尾摘要看不出差别，只有「删除后重建」换掉的 inode / 创建时间能抓住。
          return `${n}:${st.mtimeMs}:${st.size}:${st.ino}:${st.birthtimeMs}:${contentDigest(p, st.size)}`;
        } catch {
          return `${n}:err`;
        }
      });
    const body = parts.join(",");
    return body ? `${parts.length}|${body}` : `empty:${statSync(dir).mtimeMs}`;
  } catch {
    return "err";
  }
}

export function invalidateMergedSummariesCache(): void {
  _mergedCache = null;
}

const SKIP_SUMMARY_FILES = new Set([
  "index.json",
  "status.json",
  "extracted-classes.json",
  "validate-rules-last.json",
  "clone-audit-last.json",
  "fetch-jars-last.json",
  "pin-mdk-last.json",
  "fetch-loader-api-sources-last.json",
  "skipped-ingest.json",
]);
const SKIP_SUMMARY_DIRS = new Set(["sidecar-templates"]);

function isSummaryFile(name: string): boolean {
  if (!name.endsWith(".json")) return false;
  if (SKIP_SUMMARY_FILES.has(name)) return false;
  if (name.endsWith("-last.json")) return false;
  return true;
}

export function overlaySummariesDir(): string {
  return join(resolveCacheRoot(), "loader-api-summaries");
}

function loadJsonFile(path: string): LoaderApiSummary | null {
  try {
    return JSON.parse(readFileSync(path, "utf8")) as LoaderApiSummary;
  } catch {
    return null;
  }
}

function scanDir(dir: string, source: "official" | "user_jar"): Map<string, { summary: LoaderApiSummary; overlay: boolean }> {
  const out = new Map<string, { summary: LoaderApiSummary; overlay: boolean }>();
  if (!existsSync(dir)) return out;
  let names: string[] = [];
  try {
    names = readdirSync(dir);
  } catch {
    return out;
  }
  for (const name of names) {
    if (SKIP_SUMMARY_DIRS.has(name)) continue;
    if (!isSummaryFile(name)) continue;
    const key = name.replace(/\.json$/i, "");
    const summary = loadJsonFile(join(dir, name));
    if (!summary || summary.invalid === true) continue;
    summary.key = key;
    if (!summary.source) summary.source = source;
    out.set(key, { summary, overlay: source === "user_jar" });
  }
  return out;
}

/**
 * A-42（2026-09-19，原审查 A1）：**thin summary 判据**。
 * 从 extract.ts 搬来（合并判据必须与 loadMergedSummaries 同源）；extract.ts 带 java-parser，
 * 而本模块被 query_loader_api 静态导入 —— 禁止反向依赖，故实现归 store。
 * thin = 无类 / 遗留 string-methods / 自计数明显不自治（400 截断、classCount 远超实有、index 远大于类数）。
 */
export function isThinLoaderSummary(prev: Pick<LoaderApiSummary, "classes" | "fqcnIndex" | "classCount">): boolean {
  const classes = prev.classes ?? [];
  if (!classes.length) return true;
  if (classes.some((c) => Array.isArray(c.methods) && c.methods.some((m) => typeof m === "string"))) {
    return true;
  }
  const indexLen = (prev.fqcnIndex ?? []).length;
  if (classes.length === 400 && indexLen > 400) return true;
  if (typeof prev.classCount === "number" && prev.classCount > classes.length + 10) return true;
  if (indexLen > 0 && classes.length < indexLen * 0.5) return true;
  return false;
}

/**
 * A-42（2026-09-19，原审查 A1）：「按类合并」的**可引用语义**。
 *
 * 旧行为 = overlay **整档覆盖**同 key 官方摘要 ⇒ 用户只 ingest 自己的**局部/薄 jar**（常见）时，
 * 官方类在查询侧整批消失（query_loader_api 对官方类 found:false）。
 *
 * 合并语义：
 *   1. `classes` = overlay 类 ∪ 官方类，**同 fqcn 以 overlay 记录为准**（用户 jar 是本地真相），
 *      再经 dedupeLoaderClasses 兜底（同 fqcn 保留信息更全的一条）；
 *   2. `fqcnIndex` = 双边并集（去重排序）；
 *   3. `classCount` = max(官方 classCount, 合并后 classes.length) —— 官方树有合法
 *      「展开被跳过」计数（skippedExpansion），不得因薄 overlay 收缩；
 *   4. `skippedExpansion` = official || overlay；
 *   5. **thin overlay 判据** = `isThinLoaderSummary(overlay)`：为真则**不采信** overlay 的计数类元数据
 *      （classCount 仍取 max 保护官方），只把它的类并进来；`mergeNote` 留痕（thin 真假 + 双边/合并后类数）。
 */
function mergeOverlayIntoOfficial(official: LoaderApiSummary, overlay: LoaderApiSummary): LoaderApiSummary {
  const thin = isThinLoaderSummary(overlay);
  const officialClasses = official.classes ?? [];
  const overlayClasses = overlay.classes ?? [];
  const byFqcn = new Map<string, LoaderClassRecord>();
  for (const c of overlayClasses) if (c?.fqcn) byFqcn.set(String(c.fqcn), c); // overlay 逐类优先
  for (const c of officialClasses) {
    const fq = String(c?.fqcn ?? "");
    if (fq && !byFqcn.has(fq)) byFqcn.set(fq, c);
  }
  const classes = dedupeLoaderClasses([...byFqcn.values()]);
  const fqcnIndex = [...new Set([...(official.fqcnIndex ?? []), ...(overlay.fqcnIndex ?? [])])].sort();
  const officialCount = typeof official.classCount === "number" ? official.classCount : officialClasses.length;
  return {
    ...official,
    ...overlay,
    classes,
    fqcnIndex,
    classCount: Math.max(officialCount, classes.length),
    skippedExpansion: Boolean(official.skippedExpansion || overlay.skippedExpansion),
    source: "user_jar",
    mergeNote:
      `A-42 按类合并：overlay ${overlayClasses.length} 类（thin=${thin}）+ 官方 ${officialClasses.length} 类` +
      ` → ${classes.length} 类；classCount=max(${officialCount}, ${classes.length})`,
  };
}

/** 官方先，cache overlay 后与同 key **按类合并**（旧行为「整档覆盖」已废，见 mergeOverlayIntoOfficial）。 */
export function loadMergedSummaries(): Map<string, { summary: LoaderApiSummary; overlay: boolean }> {
  const officialDir = officialSummariesDir();
  const overlayDir = overlaySummariesDir();
  const stamp = `${dirStamp(officialDir)}|${dirStamp(overlayDir)}`;
  if (_mergedCache && _mergedCache.stamp === stamp) return _mergedCache.map;
  const merged = scanDir(officialDir, "official");
  const overlay = scanDir(overlayDir, "user_jar");
  for (const [key, val] of overlay) {
    val.summary.source = "user_jar";
    const base = merged.get(key);
    if (base) merged.set(key, { summary: mergeOverlayIntoOfficial(base.summary, val.summary), overlay: true });
    else merged.set(key, { summary: val.summary, overlay: true });
  }
  _mergedCache = { stamp, map: merged };
  return merged;
}

export function findSummary(
  platform: string,
  minecraftVersion: string,
): { key: string; summary: LoaderApiSummary; overlay: boolean } | null {
  const all = loadMergedSummaries();
  for (const key of candidateKeys(platform, minecraftVersion)) {
    const hit = all.get(key);
    if (hit) return { key, ...hit };
  }
  return null;
}

export function listIndexed(): LoaderApiKeyMeta[] {
  const all = loadMergedSummaries();
  const out: LoaderApiKeyMeta[] = [];
  for (const [key, { summary, overlay }] of all) {
    const parsed = parseKey(key);
    out.push({
      key,
      platform: parsed?.platform ?? summary.platform ?? "unknown",
      minecraftVersion: parsed?.minecraftVersion ?? summary.minecraftVersion ?? "",
      source: overlay ? "user_jar" : summary.source === "user_jar" ? "user_jar" : "official",
      overlay,
      mappingsVersion: summary.mappingsVersion,
      classCount: summary.classCount ?? summary.classes?.length ?? 0,
      skippedExpansion: summary.skippedExpansion,
    });
  }
  return out.sort((a, b) => a.key.localeCompare(b.key));
}

export function normalizeMethod(raw: unknown): MethodInfo {
  if (typeof raw === "string") {
    return {
      name: raw,
      returnType: "?",
      parameters: [],
      modifiers: [],
      signature: `${raw}(...)`,
    };
  }
  if (raw && typeof raw === "object") {
    const o = raw as Partial<MethodInfo> & { name?: string };
    const name = String(o.name ?? "");
    const returnType = String(o.returnType ?? "?");
    const parameters = Array.isArray(o.parameters)
      ? o.parameters.map((p) => ({ type: String(p.type ?? "?"), name: String(p.name ?? "arg") }))
      : [];
    const modifiers = Array.isArray(o.modifiers) ? o.modifiers.map(String) : [];
    const signature = String(o.signature ?? `${returnType} ${name}(${parameters.map((p) => p.type).join(", ")})`);
    return { name, returnType, parameters, modifiers, signature };
  }
  return { name: "?", returnType: "?", parameters: [], modifiers: [], signature: "?" };
}

export function normalizeClass(raw: LoaderClassRecord): LoaderClassRecord {
  const fqcn = String(raw.fqcn ?? "");
  const simple =
    raw.simpleName ||
    (fqcn.split(".").pop() ?? fqcn).split("$").pop() ||
    fqcn;
  return {
    ...raw,
    fqcn,
    simpleName: simple,
    methods: Array.isArray(raw.methods) ? raw.methods.map(normalizeMethod) : [],
  };
}

export function classSimpleName(fqcn: string): string {
  const last = fqcn.split(".").pop() ?? fqcn;
  return last.split("$").pop() ?? last;
}

function methodQuality(m: unknown): number {
  if (typeof m === "string") return 0;
  if (!m || typeof m !== "object") return 0;
  const sig = String((m as MethodInfo).signature ?? "");
  if (!sig || sig.endsWith("(...)")) return 1;
  return 3;
}

/** 同一 FQCN 只留一条（优先完整 MethodInfo + 更完整的相对路径）。 */
export function dedupeLoaderClasses(classes: LoaderClassRecord[]): LoaderClassRecord[] {
  const map = new Map<string, LoaderClassRecord>();
  const score = (c: LoaderClassRecord) => {
    const methods = c.methods ?? [];
    const q = methods.reduce((s, m) => s + methodQuality(m), 0);
    const pathLen = String(c.file || "").length;
    return q * 1000 + pathLen;
  };
  for (const c of classes) {
    const fq = String(c.fqcn ?? "");
    if (!fq) continue;
    const prev = map.get(fq);
    if (!prev || score(c) > score(prev)) map.set(fq, c);
  }
  return [...map.values()];
}
