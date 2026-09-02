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

/** 官方先，cache overlay 后覆盖同 key。 */
export function loadMergedSummaries(): Map<string, { summary: LoaderApiSummary; overlay: boolean }> {
  const officialDir = officialSummariesDir();
  const overlayDir = overlaySummariesDir();
  const stamp = `${dirStamp(officialDir)}|${dirStamp(overlayDir)}`;
  if (_mergedCache && _mergedCache.stamp === stamp) return _mergedCache.map;
  const merged = scanDir(officialDir, "official");
  const overlay = scanDir(overlayDir, "user_jar");
  for (const [key, val] of overlay) {
    val.summary.source = "user_jar";
    merged.set(key, { summary: val.summary, overlay: true });
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
