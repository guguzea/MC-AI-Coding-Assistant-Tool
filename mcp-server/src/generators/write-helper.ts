/**
 * generate_* 可选写盘：默认只吐文本；write=true 须 confirmed + MC_SKILL_ALLOW_WRITE=1
 * + MC_SKILL_PROJECT_ROOT（projectPath 只能在该根内选目录，不能替代它）。
 * Java/Kotlin 的 suggestedPath 按代码里真实写下的 package 落目录；Java 还跟着顶层类型改名，
 * 因为 public 类名 != 文件名时落盘即编译不过（Kotlin 允许不同名，保留传入的文件名）。
 */
import { mkdirSync, writeFileSync } from "fs";
import { dirname, isAbsolute, join, resolve } from "path";
import {
  assertCreatableDir,
  assertWritablePath,
  ProjectPathError,
  resolveWriteAllowRoot,
} from "../utils/project-sandbox.js";
import type { GeneratorResult } from "./common.js";

export interface GeneratorWriteOpts {
  write?: boolean;
  confirmed?: boolean;
  projectPath?: string;
  /** 相对工程根的资源/源码前缀，默认 src/main/resources（JSON）或由调用方指定 */
  resourcesPrefix?: string;
  javaPrefix?: string;
}

export interface GeneratorWriteResult extends GeneratorResult {
  suggestedPath: string | null;
  suggestedPaths: string[];
  written?: string[];
  writeError?: { code: string; message: string };
}

/** 去掉注释行后逐行扫源码：行注释与块注释里的示例文字不能被当成真声明。 */
function codeLines(content: string): string[] {
  const out: string[] = [];
  let inBlock = false;
  for (const raw of content.split(/\r?\n/)) {
    const line = raw.trim();
    if (inBlock) {
      if (line.includes("*/")) inBlock = false;
      continue;
    }
    if (line.startsWith("/*")) {
      if (!line.includes("*/")) inBlock = true;
      continue;
    }
    if (line.startsWith("//") || line.startsWith("*")) continue;
    out.push(line);
  }
  return out;
}

/** 读代码里真实写下的 `package a.b.c`（Java 带分号，Kotlin 可不带）。找不到返回 null。 */
function extractPackage(content: string): string | null {
  for (const line of codeLines(content)) {
    const m = line.match(/^package\s+([A-Za-z_$][\w$]*(?:\s*\.\s*[A-Za-z_$][\w$]*)*)\s*;?\s*$/);
    if (m?.[1]) return m[1].replace(/\s+/g, "");
  }
  return null;
}

/** 顶层类型名（Java 要求 public 类名 == 文件名，故文件名要跟着它走）。 */
function extractTopLevelTypes(content: string): string[] {
  const names: string[] = [];
  for (const line of codeLines(content)) {
    const m = line.match(
      /^(?:@\s*interface|(?:public|protected|private|static|final|abstract|sealed|non-sealed|open|data|inner)\s+)*(?:class|interface|enum|record)\s+([A-Za-z_$][\w$]*)/,
    );
    if (m?.[1]) names.push(m[1]);
  }
  return names;
}

/**
 * 由代码内容推导 Java/Kotlin 源文件路径。
 * 找不到 package（骨架无包声明、或不是 Java 源码）返回 null，交给调用方的旧兜底。
 */
export function javaSourcePathForContent(
  content: string,
  preferredFileName: string,
  javaPrefix: string,
): { path: string; typeName: string | null } | null {
  const pkg = extractPackage(content);
  if (!pkg) return null;
  const isKt = /\.kt$/i.test(preferredFileName);
  const bareName = preferredFileName.replace(/^.*[\\/]/, "").replace(/\.(java|kt)$/i, "");
  const types = extractTopLevelTypes(content);
  let typeName: string | null = null;
  if (types.length > 0) {
    // 首选与传入文件名一致的那个类型，否则取第一个顶层类型（package-info 等无类型时保留原名）。
    typeName = types.find((t) => t.toLowerCase() === bareName.toLowerCase()) ?? types[0]!;
    if (isKt) typeName = bareName; // Kotlin 不要求文件名 == 类型名
  }
  const dir = pkg.split(".").join("/");
  return {
    path: `${javaPrefix}/${dir}/${(typeName ?? bareName)}.${isKt ? "kt" : "java"}`,
    typeName,
  };
}

/** 把 files 键或单文件 code 落成相对工程路径建议。 */
export function suggestPathsForGenerator(
  result: GeneratorResult,
  opts?: { resourcesPrefix?: string; javaPrefix?: string; singleFileName?: string },
): { suggestedPath: string | null; suggestedPaths: string[]; pathWarnings: string[] } {
  const resPrefix = (opts?.resourcesPrefix ?? "src/main/resources").replace(/\\/g, "/").replace(/\/+$/, "");
  const javaPrefix = (opts?.javaPrefix ?? "src/main/java").replace(/\\/g, "/").replace(/\/+$/, "");
  const paths: string[] = [];
  const pathWarnings: string[] = [];

  const javaPath = (content: string | null | undefined, bareName: string): string => {
    const derived = content ? javaSourcePathForContent(content, bareName, javaPrefix) : null;
    if (!derived) return `${javaPrefix}/${bareName}`;
    const wanted = bareName.replace(/\.(java|kt)$/i, "");
    if (derived.typeName && derived.typeName !== wanted) {
      pathWarnings.push(
        `suggestedPath 按代码里的 package 与顶层类型落成 ${derived.path}` +
          `（文件名 ${bareName} 与顶层类型 ${derived.typeName} 不一致；Java 要求文件名等于 public 类型名，已按类型名改名）。`,
      );
    }
    return derived.path;
  };

  if (result.files && Object.keys(result.files).length > 0) {
    const entries = Object.entries(result.files);
    for (const [rel, content] of entries) {
      const n = rel.replace(/\\/g, "/").replace(/^\/+/, "");
      if (n.endsWith(".java") || n.endsWith(".kt")) {
        paths.push(n.includes("/") ? n : javaPath(content, n));
      } else if (n.startsWith("assets/") || n.startsWith("data/") || n.startsWith("META-INF/")) {
        paths.push(`${resPrefix}/${n}`);
      } else {
        paths.push(n.includes("/") ? n : `${resPrefix}/${n}`);
      }
    }
  } else if (result.code && opts?.singleFileName) {
    const name = opts.singleFileName.replace(/\\/g, "/");
    paths.push(name.includes("/") ? name : javaPath(result.code, name));
  }

  return {
    suggestedPath: paths[0] ?? null,
    suggestedPaths: paths,
    pathWarnings,
  };
}

export function attachSuggestedPaths(
  result: GeneratorResult,
  opts?: { resourcesPrefix?: string; javaPrefix?: string; singleFileName?: string },
): GeneratorWriteResult {
  const { pathWarnings, ...s } = suggestPathsForGenerator(result, opts);
  const merged = { ...result, ...s };
  if (pathWarnings.length) {
    merged.warnings = [...(result.warnings ?? []), ...pathWarnings];
  }
  return merged;
}

/**
 * 可选写盘。write 缺省/false → 只返回 suggestedPath。
 * write=true 且无 confirmed → 拒绝。写盘走 project-sandbox。
 */
export function maybeWriteGeneratorResult(
  result: GeneratorResult,
  opts: GeneratorWriteOpts = {},
  pathOpts?: { resourcesPrefix?: string; javaPrefix?: string; singleFileName?: string },
): GeneratorWriteResult {
  const base = attachSuggestedPaths(result, pathOpts);
  if (result.errors?.length || result.code === null && (!result.files || Object.keys(result.files).length === 0)) {
    return base;
  }
  if (!opts.write) return base;

  if (!opts.confirmed) {
    return {
      ...base,
      writeError: {
        code: "CONFIRMATION_REQUIRED",
        message: "write=true 须同时传 confirmed=true；默认仍只吐文本（人在环）",
      },
    };
  }

  try {
    const allowRoot = resolveWriteAllowRoot(opts.projectPath, { requireEnvRoot: true });
    // allowRoot 只是边界；写入基准是 projectPath（resolveWriteAllowRoot 已校验它存在且落在边界内）。
    const projectBase = opts.projectPath?.trim() ? resolve(opts.projectPath) : allowRoot;
    const written: string[] = [];

    const writeOne = (rel: string, content: string) => {
      // 绝对 rel 会直接顶掉 projectBase，`..` 段能溜到同沙箱的别的工程 —— 两者都不许写。
      if (isAbsolute(rel) || rel.split(/[\\/]/).includes("..")) {
        throw new ProjectPathError(
          `建议路径必须相对于工程根且不含 ..：收到 ${rel}`,
          "PATH_OUTSIDE_ALLOWLIST",
        );
      }
      const abs = resolve(join(projectBase, rel));
      assertCreatableDir(dirname(abs), allowRoot);
      mkdirSync(dirname(abs), { recursive: true });
      assertWritablePath(abs, allowRoot);
      writeFileSync(abs, content, "utf8");
      written.push(abs);
    };

    if (result.files && Object.keys(result.files).length > 0) {
      const mapped = suggestPathsForGenerator(result, pathOpts).suggestedPaths;
      const keys = Object.keys(result.files);
      for (let i = 0; i < keys.length; i++) {
        writeOne(mapped[i]!, result.files[keys[i]!]!);
      }
    } else if (result.code && base.suggestedPath) {
      writeOne(base.suggestedPath, result.code);
    } else {
      return {
        ...base,
        writeError: {
          code: "NOTHING_TO_WRITE",
          message: "没有可写入的 files/code",
        },
      };
    }

    return { ...base, written };
  } catch (err) {
    if (err instanceof ProjectPathError) {
      return { ...base, writeError: { code: err.code, message: err.message } };
    }
    return {
      ...base,
      writeError: { code: "WRITE_FAILED", message: (err as Error).message },
    };
  }
}

