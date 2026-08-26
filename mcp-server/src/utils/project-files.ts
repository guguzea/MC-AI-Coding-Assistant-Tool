/**
 * 只读扫描模组工程目录（不走写沙箱，不要求 MC_SKILL_ALLOW_WRITE）。
 * 供 validate_project / diagnose_gradle / check_dependencies / mixin_analyze 填缺失正文。
 */
import { existsSync, readdirSync, readFileSync, realpathSync, statSync } from "fs";
import { join, relative, resolve } from "path";
import { actionable, type ActionEnvelope } from "./actionable.js";

/** 扫描时跳过的常见构建 / IDE / 依赖目录 */
export const PROJECT_SCAN_SKIP_DIRS = new Set([
  "node_modules",
  "build",
  ".gradle",
  ".git",
  "run",
  "runs",
  "out",
  "dist",
  "bin",
  ".idea",
  ".vscode",
  "target",
  ".cache",
]);

export const JAVA_SCAN_MAX_FILES = 300;
export const JAVA_SCAN_MAX_BYTES = 5 * 1024 * 1024;

/** 默认 300；可用 MC_SKILL_JAVA_SCAN_MAX_FILES 提高。 */
export function javaScanMaxFiles(): number {
  const raw = process.env.MC_SKILL_JAVA_SCAN_MAX_FILES;
  if (raw == null || raw.trim() === "") return JAVA_SCAN_MAX_FILES;
  const n = Number.parseInt(raw, 10);
  if (!Number.isFinite(n) || n < 1) return JAVA_SCAN_MAX_FILES;
  return Math.floor(n);
}

export function invalidProjectAction(projectPath: string): ActionEnvelope {
  return actionable("INVALID_INPUT", `projectPath 不是有效目录：${projectPath}`, [
    "传入模组项目根目录（绝对或相对路径）",
  ]);
}

/** Architectury / 单模块工程的 Java/Kotlin 源码根（存在才返回）。 */
export function javaSourceRoots(projectRoot: string): string[] {
  const candidates = [
    join(projectRoot, "src"),
    join(projectRoot, "common", "src"),
    join(projectRoot, "fabric", "src"),
    join(projectRoot, "forge", "src"),
    join(projectRoot, "neoforge", "src"),
    join(projectRoot, "quilt", "src"),
  ];
  const out: string[] = [];
  const seen = new Set<string>();
  for (const p of candidates) {
    try {
      if (!existsSync(p) || !statSync(p).isDirectory()) continue;
      const key = resolve(p);
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(p);
    } catch {
      continue;
    }
  }
  return out;
}

export function resolveProjectDir(
  projectPath: string,
): { ok: true; root: string } | { ok: false; action: ActionEnvelope } {
  const root = resolve(projectPath);
  try {
    if (!existsSync(root) || !statSync(root).isDirectory()) {
      return { ok: false, action: invalidProjectAction(projectPath) };
    }
  } catch {
    return { ok: false, action: invalidProjectAction(projectPath) };
  }
  return { ok: true, root };
}

export function walkProjectFiles(
  root: string,
  match: (relPosix: string, name: string) => boolean,
  maxDepth = 10,
  /** 命中数上限：防巨型工程枚举内存膨胀；超限即截断（调用方可按需放宽） */
  maxFiles = 5000,
): string[] {
  const out: string[] = [];
  const walk = (dir: string, depth: number) => {
    if (depth > maxDepth || out.length >= maxFiles) return;
    let entries;
    try {
      entries = readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entries) {
      if (out.length >= maxFiles) return;
      const name = String(e.name);
      if (name === "." || name === "..") continue;
      const abs = join(dir, name);
      if (e.isDirectory()) {
        if (PROJECT_SCAN_SKIP_DIRS.has(name)) continue;
        walk(abs, depth + 1);
        continue;
      }
      if (!e.isFile()) continue;
      const rel = relative(root, abs).replace(/\\/g, "/");
      if (match(rel, name)) out.push(abs);
    }
  };
  if (existsSync(root) && statSync(root).isDirectory()) walk(root, 0);
  return out.sort();
}

/**
 * 有界目录遍历：maxDepth + realpath 环检测。供 porting / audit / fingerprint，
 * 不要把业务过滤逻辑搬进 walkProjectFiles。
 */
export function walkDirBounded(
  dir: string,
  opts?: {
    maxDepth?: number;
    extensions?: string[];
    allFiles?: boolean;
  },
): string[] {
  const maxDepth = opts?.maxDepth ?? 16;
  const results: string[] = [];
  const seen = new Set<string>();
  const walk = (current: string, depth: number) => {
    if (depth > maxDepth) return;
    let real: string;
    try {
      real = realpathSync(current);
    } catch {
      return;
    }
    if (seen.has(real)) return;
    seen.add(real);
    let entries;
    try {
      entries = readdirSync(current, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entries) {
      const full = join(current, e.name);
      if (e.isDirectory()) {
        walk(full, depth + 1);
        continue;
      }
      if (!e.isFile()) continue;
      if (opts?.allFiles) {
        results.push(full);
        continue;
      }
      const exts = opts?.extensions;
      if (!exts?.length || exts.some((ext) => e.name.endsWith(ext))) {
        results.push(full);
      }
    }
  };
  walk(dir, 0);
  return results;
}

export function readOptionalRel(root: string, rel: string): string | undefined {
  const p = join(root, rel);
  try {
    if (existsSync(p) && statSync(p).isFile()) return readFileSync(p, "utf8");
  } catch {
    /* ignore unreadable */
  }
  return undefined;
}

export function readFirstRel(root: string, rels: string[]): string | undefined {
  for (const rel of rels) {
    const body = readOptionalRel(root, rel);
    if (body !== undefined) return body;
  }
  return undefined;
}

export interface JavaScanResult {
  files: Array<{ path: string; content: string }>;
  truncated: boolean;
  warning?: string;
}

/** 扫 src/main/java 下的 .java；达上限则停止并带截断警告（不因此失败）。可用 MC_SKILL_JAVA_SCAN_MAX_FILES 提高文件上限。 */
export function collectJavaSources(root: string): JavaScanResult {
  const fileLimit = javaScanMaxFiles();
  const absFiles = walkProjectFiles(
    root,
    (rel, name) => name.endsWith(".java") && (rel.includes("src/main/java/") || rel.startsWith("src/main/java/")),
  );
  const files: Array<{ path: string; content: string }> = [];
  let bytes = 0;
  let truncated = false;
  for (const abs of absFiles) {
    let st;
    try {
      st = statSync(abs);
    } catch {
      continue;
    }
    if (files.length >= fileLimit || bytes >= JAVA_SCAN_MAX_BYTES) {
      truncated = true;
      break;
    }
    if (bytes + st.size > JAVA_SCAN_MAX_BYTES) {
      truncated = true;
      break;
    }
    let content: string;
    try {
      content = readFileSync(abs, "utf8");
    } catch {
      continue;
    }
    const size = Buffer.byteLength(content, "utf8");
    bytes += size;
    files.push({ path: relative(root, abs).replace(/\\/g, "/"), content });
  }
  const warning = truncated
    ? `检查可能不完整：已扫描 ${files.length} 个 Java 文件（当前上限 ${fileLimit}，可用环境变量 MC_SKILL_JAVA_SCAN_MAX_FILES 提高；另有字节上限 ${JAVA_SCAN_MAX_BYTES}）`
    : undefined;
  return { files, truncated, warning };
}

export function collectCrashReports(root: string): {
  reports: Array<{ path: string; content: string }>;
  warning?: string;
} {
  const dir = join(root, "crash-reports");
  if (!existsSync(dir)) return { reports: [] };
  try {
    if (!statSync(dir).isDirectory()) return { reports: [] };
  } catch {
    return { reports: [] };
  }
  const out: Array<{ path: string; content: string }> = [];
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return { reports: [] };
  }
  const MAX_REPORTS = 20;
  const MAX_TOTAL_BYTES = JAVA_SCAN_MAX_BYTES;
  let totalBytes = 0;
  let truncated = false;
  for (const e of entries) {
    if (!e.isFile()) continue;
    const name = String(e.name);
    if (!/\.(txt|log)$/i.test(name)) continue;
    const abs = join(dir, name);
    try {
      const st = statSync(abs);
      if (!st.isFile()) continue;
      if (st.size > JAVA_SCAN_MAX_BYTES) continue;
      if (out.length >= MAX_REPORTS || totalBytes + st.size > MAX_TOTAL_BYTES) {
        truncated = true;
        break;
      }
      out.push({
        path: `crash-reports/${name}`,
        content: readFileSync(abs, "utf8"),
      });
      totalBytes += st.size;
    } catch {
      /* skip */
    }
  }
  const reports = out.sort((a, b) => a.path.localeCompare(b.path));
  return {
    reports,
    warning: truncated
      ? `crash-reports 已截断：最多 ${MAX_REPORTS} 份、合计 ${MAX_TOTAL_BYTES} 字节（已读 ${reports.length} 份）`
      : undefined,
  };
}

export interface LoadedModProject {
  root: string;
  modsToml?: string;
  neoModsToml?: string;
  buildGradle?: string;
  gradleProperties?: string;
  mixinsJson?: string;
  fabricModJson?: string;
  quiltModJson?: string;
  litemodJson?: string;
  riftmodJson?: string;
  addonManifest?: string;
  fabricModJsons: string[];
  quiltModJsons: string[];
  modsTomls: string[];
  neoModsTomls: string[];
  javaFiles: Array<{ path: string; content: string }>;
  javaTruncated: boolean;
  javaWarning?: string;
  crashReports: Array<{ path: string; content: string }>;
  crashReportsWarning?: string;
}

function readWalkBodies(root: string, match: (rel: string, name: string) => boolean): string[] {
  const out: string[] = [];
  for (const abs of walkProjectFiles(root, match)) {
    try {
      const body = readFileSync(abs, "utf8");
      if (body.trim()) out.push(body);
    } catch {
      /* skip unreadable */
    }
  }
  return out;
}

function uniqueBodies(preferred: string | undefined, rest: string[]): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const b of [preferred, ...rest]) {
    if (!b?.trim() || seen.has(b)) continue;
    seen.add(b);
    out.push(b);
  }
  return out;
}

export function loadModProject(root: string): LoadedModProject {
  const java = collectJavaSources(root);
  const mixinsHits = walkProjectFiles(root, (_rel, name) => /mixins\.json$/i.test(name));
  let mixinsJson: string | undefined;
  if (mixinsHits.length > 0) {
    try {
      mixinsJson = readFileSync(mixinsHits[0], "utf8");
    } catch {
      mixinsJson = undefined;
    }
  }
  const fabricPreferred = readFirstRel(root, [
    "src/main/resources/fabric.mod.json",
    "fabric.mod.json",
  ]);
  const quiltPreferred = readFirstRel(root, [
    "src/main/resources/quilt.mod.json",
    "quilt.mod.json",
  ]);
  const modsPreferred = readFirstRel(root, [
    "src/main/resources/META-INF/mods.toml",
    "META-INF/mods.toml",
  ]);
  const neoPreferred = readFirstRel(root, [
    "src/main/resources/META-INF/neoforge.mods.toml",
    "META-INF/neoforge.mods.toml",
  ]);
  const fabricModJsons = uniqueBodies(
    fabricPreferred,
    readWalkBodies(
      root,
      (rel, name) => name === "fabric.mod.json" && rel.replace(/\\/g, "/").includes("src/main/resources/"),
    ),
  );
  const quiltModJsons = uniqueBodies(
    quiltPreferred,
    readWalkBodies(
      root,
      (rel, name) => name === "quilt.mod.json" && rel.replace(/\\/g, "/").includes("src/main/resources/"),
    ),
  );
  const modsTomls = uniqueBodies(
    modsPreferred,
    readWalkBodies(
      root,
      (rel, name) => name === "mods.toml" && rel.replace(/\\/g, "/").includes("META-INF/"),
    ),
  );
  const neoModsTomls = uniqueBodies(
    neoPreferred,
    readWalkBodies(
      root,
      (rel, name) => name === "neoforge.mods.toml" && rel.replace(/\\/g, "/").includes("META-INF/"),
    ),
  );
  const crash = collectCrashReports(root);
  const gpRoot = readOptionalRel(root, "gradle.properties") ?? "";
  const gpNested = readWalkBodies(root, (rel, name) => name === "gradle.properties" && rel.replace(/\\/g, "/") !== "gradle.properties");
  const gradleProperties = [gpRoot, ...gpNested].filter((s) => s.trim()).join("\n") || undefined;

  return {
    root,
    modsToml: modsTomls[0],
    neoModsToml: neoModsTomls[0],
    buildGradle: readFirstRel(root, ["build.gradle", "build.gradle.kts"]),
    gradleProperties,
    mixinsJson,
    fabricModJson: fabricModJsons[0],
    quiltModJson: quiltModJsons[0],
    litemodJson: readFirstRel(root, ["litemod.json", "src/main/resources/litemod.json"]),
    riftmodJson: readFirstRel(root, [
      "riftmod.json",
      "rift.mod.json",
      "src/main/resources/riftmod.json",
    ]),
    addonManifest: readFirstRel(root, ["manifest.json", "BP/manifest.json"]),
    fabricModJsons,
    quiltModJsons,
    modsTomls,
    neoModsTomls,
    javaFiles: java.files,
    javaTruncated: java.truncated,
    javaWarning: java.warning,
    crashReports: crash.reports,
    crashReportsWarning: crash.warning,
  };
}

export function preferExplicit<T>(explicit: T | undefined, scanned: T | undefined): T | undefined {
  if (explicit !== undefined && explicit !== null && explicit !== "") return explicit;
  return scanned;
}

export function mergeJavaFiles(
  explicit: Array<{ path: string; content: string }> | undefined,
  scanned: Array<{ path: string; content: string }>,
): Array<{ path: string; content: string }> {
  const map = new Map<string, { path: string; content: string }>();
  for (const f of scanned) {
    map.set(f.path.replace(/\\/g, "/"), f);
  }
  for (const f of explicit ?? []) {
    map.set(f.path.replace(/\\/g, "/"), f);
  }
  return [...map.values()];
}
