/**
 * 只读扫描模组工程目录（不走写沙箱，不要求 MC_SKILL_ALLOW_WRITE）。
 * 供 validate_project / diagnose_gradle / check_dependencies / mixin_analyze 填缺失正文。
 */
import { existsSync, readdirSync, readFileSync, statSync } from "fs";
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
): string[] {
  const out: string[] = [];
  const walk = (dir: string, depth: number) => {
    if (depth > maxDepth) return;
    let entries;
    try {
      entries = readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entries) {
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
    if (files.length >= fileLimit || bytes >= JAVA_SCAN_MAX_BYTES) {
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
    if (files.length > 0 && bytes + size > JAVA_SCAN_MAX_BYTES) {
      truncated = true;
      break;
    }
    bytes += size;
    files.push({ path: relative(root, abs).replace(/\\/g, "/"), content });
  }
  const warning = truncated
    ? `检查可能不完整：已扫描 ${files.length} 个 Java 文件（当前上限 ${fileLimit}，可用环境变量 MC_SKILL_JAVA_SCAN_MAX_FILES 提高；另有字节上限 ${JAVA_SCAN_MAX_BYTES}）`
    : undefined;
  return { files, truncated, warning };
}

export function collectCrashReports(root: string): Array<{ path: string; content: string }> {
  const dir = join(root, "crash-reports");
  if (!existsSync(dir)) return [];
  try {
    if (!statSync(dir).isDirectory()) return [];
  } catch {
    return [];
  }
  const out: Array<{ path: string; content: string }> = [];
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return [];
  }
  for (const e of entries) {
    if (!e.isFile()) continue;
    const name = String(e.name);
    if (!/\.(txt|log)$/i.test(name)) continue;
    const abs = join(dir, name);
    try {
      out.push({
        path: `crash-reports/${name}`,
        content: readFileSync(abs, "utf8"),
      });
    } catch {
      /* skip */
    }
  }
  return out.sort((a, b) => a.path.localeCompare(b.path));
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
  javaFiles: Array<{ path: string; content: string }>;
  javaTruncated: boolean;
  javaWarning?: string;
  crashReports: Array<{ path: string; content: string }>;
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
  return {
    root,
    modsToml: readFirstRel(root, [
      "src/main/resources/META-INF/mods.toml",
      "META-INF/mods.toml",
    ]),
    neoModsToml: readFirstRel(root, [
      "src/main/resources/META-INF/neoforge.mods.toml",
      "META-INF/neoforge.mods.toml",
    ]),
    buildGradle: readFirstRel(root, ["build.gradle", "build.gradle.kts"]),
    gradleProperties: readOptionalRel(root, "gradle.properties"),
    mixinsJson,
    fabricModJson: readFirstRel(root, [
      "src/main/resources/fabric.mod.json",
      "fabric.mod.json",
    ]),
    quiltModJson: readFirstRel(root, [
      "src/main/resources/quilt.mod.json",
      "quilt.mod.json",
    ]),
    litemodJson: readFirstRel(root, ["litemod.json", "src/main/resources/litemod.json"]),
    riftmodJson: readFirstRel(root, [
      "riftmod.json",
      "rift.mod.json",
      "src/main/resources/riftmod.json",
    ]),
    addonManifest: readFirstRel(root, ["manifest.json", "BP/manifest.json"]),
    javaFiles: java.files,
    javaTruncated: java.truncated,
    javaWarning: java.warning,
    crashReports: collectCrashReports(root),
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
