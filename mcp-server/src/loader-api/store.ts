import { existsSync, readdirSync, readFileSync } from "fs";
import { join } from "path";
import { resolveCacheRoot } from "../decompile/cache.js";
import {
  candidateKeys,
  officialSummariesDir,
  parseKey,
} from "./keys.js";
import type { LoaderApiKeyMeta, LoaderApiSummary, LoaderClassRecord, MethodInfo } from "./types.js";

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
    if (!summary) continue;
    summary.key = key;
    if (!summary.source) summary.source = source;
    out.set(key, { summary, overlay: source === "user_jar" });
  }
  return out;
}

/** 官方先，cache overlay 后覆盖同 key。 */
export function loadMergedSummaries(): Map<string, { summary: LoaderApiSummary; overlay: boolean }> {
  const merged = scanDir(officialSummariesDir(), "official");
  const overlay = scanDir(overlaySummariesDir(), "user_jar");
  for (const [key, val] of overlay) {
    val.summary.source = "user_jar";
    merged.set(key, { summary: val.summary, overlay: true });
  }
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
