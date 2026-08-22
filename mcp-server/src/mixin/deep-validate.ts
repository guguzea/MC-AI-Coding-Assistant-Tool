/**
 * T4 字节码级 Mixin 深度校验 + validate_at / validate_aw 工具 handler。
 *
 * deep 语义（与任务4 约束一致）：
 * - 仅当用户显式 deep:true / 显式调用工具时才读取 jar；
 * - jar 未缓存 → actionable(CACHE_MISS) 引导先调 get_minecraft_source（绝不自动下载）；
 * - jar 可用 → 真实字节码校验（目标类存在性/可访问性、方法选择器、
 *   @At(target=...) 调用点匹配）。
 *
 * jar 定位：jarPath 参数 > $MC_SKILL_CACHE 缓存扫描（remapped/jars）。
 */

import { existsSync, readdirSync, readFileSync, statSync } from "fs";
import { basename, join, relative } from "path";
import { actionable, missingMcVersion, versionRequiredAction, type ActionEnvelope } from "../utils/actionable.js";
import { PROJECT_SCAN_SKIP_DIRS, walkProjectFiles } from "../utils/project-files.js";
import { resolveCacheRoot } from "../decompile/cache.js";
import { buildJarIndex } from "./bytecode.js";
import { parseMixinJavaSource } from "./parser.js";

export { PROJECT_SCAN_SKIP_DIRS, walkProjectFiles };
import {
  lookupMemberInHierarchy,
  normalizeOwnerCandidates,
  isObfuscatedName,
  mappingMismatchSuggestion,
  validateAccessTransformer,
  validateAccessTransformerFiles,
  splitAccessFiles,
} from "./access-transformer.js";
import {
  validateAccessWidener,
  validateAccessWidenerFiles,
  splitWidenerFiles,
} from "./access-widener.js";

export interface DeepValidationError {
  target: string;
  issue: string;
  suggestion: string;
}

export interface DeepValidationResult {
  verified: boolean;
  errors: DeepValidationError[];
  warnings: string[];
  checkedTargets: number;
  jarPath: string;
  mapping?: string;
}

export interface DeepValidateInput {
  javaFiles: Array<{ path: string; content: string }>;
  version?: string;
  jarPath: string;
}

export interface ResolvedValidationJar {
  jarPath: string;
  mapping?: "yarn" | "mojmap" | "official" | "unknown";
  /** 仅当显式传入的 jarPath 不存在时设置 */
  error?: string;
}

/** 从文件名推断映射层（T2 约定：minecraft-<version>-<mapping>.jar）。 */
export function inferMappingFromName(jarPath: string): ResolvedValidationJar["mapping"] {
  const name = basename(jarPath).toLowerCase();
  if (name.includes("-yarn")) return "yarn";
  if (name.includes("-mojmap")) return "mojmap";
  if (name.includes("-client")) return "official";
  return "unknown";
}

/** 版本按路径段精确匹配："1.21.1" 命中 minecraft-1.21.1-yarn.jar 但不命中 1.21.11（F-E107）。 */
function versionSegmentMatch(fileName: string, version: string): boolean {
  const escaped = version.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[\\/.\\-_])${escaped}([\\/.\\-_]|$)`).test(fileName);
}

/** 多命中时优先"版本即整段"的 jar（minecraft-1.21.1-yarn 优先于 minecraft-1.21.11-yarn）。 */
function versionIsExactSegment(jarPath: string, version: string): boolean {
  const name = basename(jarPath);
  const escaped = version.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`^${escaped}([\\/.\\-_]|$)|([\\/.\\-_])${escaped}$`).test(name);
}

/** 扫描 $MC_SKILL_CACHE 找版本对应的重映射客户端 jar（不自动下载）。 */
export function findCachedClientJar(version: string): ResolvedValidationJar | null {
  const root = resolveCacheRoot();
  const jars: Array<{ jarPath: string; mapping: ResolvedValidationJar["mapping"] }> = [];

  const remappedFlat = join(root, "remapped");
  if (existsSync(remappedFlat)) {
    for (const f of readdirSync(remappedFlat)) {
      if (f.endsWith(".jar") && versionSegmentMatch(f, version)) {
        jars.push({ jarPath: join(remappedFlat, f), mapping: inferMappingFromName(f) });
      }
    }
  }
  const remappedVer = join(root, "remapped", version);
  if (existsSync(remappedVer)) {
    for (const f of readdirSync(remappedVer)) {
      if (f.endsWith(".jar")) jars.push({ jarPath: join(remappedVer, f), mapping: inferMappingFromName(f) });
    }
  }
  const jarsDir = join(root, "jars");
  if (existsSync(jarsDir)) {
    for (const f of readdirSync(jarsDir)) {
      if (f.endsWith(".jar") && versionSegmentMatch(f, version)) {
        jars.push({ jarPath: join(jarsDir, f), mapping: inferMappingFromName(f) });
      }
    }
  }
  if (jars.length === 0) return null;
  // 优先命名层（yarn > mojmap > official > 其他）；同层优先版本整段精确的 jar
  const rank: Record<string, number> = { yarn: 0, mojmap: 1, official: 2, unknown: 3 };
  jars.sort((a, b) => {
    const rankDiff = rank[a.mapping ?? "unknown"] - rank[b.mapping ?? "unknown"];
    if (rankDiff !== 0) return rankDiff;
    return Number(versionIsExactSegment(b.jarPath, version)) - Number(versionIsExactSegment(a.jarPath, version));
  });
  return { jarPath: jars[0].jarPath, mapping: jars[0].mapping };
}

/** jar 解析优先级：jarPath 参数 > 缓存扫描 > CACHE_MISS。 */
export function resolveValidationJar(version: string, jarPath?: string): ResolvedValidationJar | null {
  if (jarPath && jarPath.trim()) {
    const p = jarPath.trim();
    if (!existsSync(p)) {
      return { jarPath: p, mapping: "unknown", error: `jarPath 不存在: ${p}` };
    }
    return { jarPath: p, mapping: inferMappingFromName(p) };
  }
  return findCachedClientJar(version);
}

export function cacheMissActionable(version: string): ActionEnvelope {
  return actionable("CACHE_MISS", `未找到版本 ${version} 的已反编译/重映射客户端 jar`, [
    "先调用 get_minecraft_source 获取源码与 jar 缓存",
    "或直接传入 jarPath 参数",
  ], ["get_minecraft_source"]);
}

// ── @At(...) 深度解析（parser.ts 的 at 字段对现代 @At 语法覆盖不足，此处补全）───

export interface AtInfo {
  value: string;
  target?: string;
  targetOwner?: string;
  targetName?: string;
  targetDesc?: string;
  targetIsField: boolean;
}

function extractAnnotationBlocks(source: string, name: string): string[] {
  const blocks: string[] = [];
  const needle = `@${name}`;
  let i = 0;
  while ((i = source.indexOf(needle, i)) >= 0) {
    const open = source.indexOf("(", i + needle.length);
    if (open < 0) break;
    let depth = 0;
    let j = open;
    for (; j < source.length; j++) {
      const c = source[j];
      if (c === "(") depth++;
      else if (c === ")") {
        depth--;
        if (depth === 0) {
          blocks.push(source.slice(open + 1, j));
          break;
        }
      }
    }
    i = j + 1;
  }
  return blocks;
}

const INJECTION_KINDS = [
  "Inject",
  "Redirect",
  "ModifyVariable",
  "ModifyArg",
  "ModifyArgs",
  "ModifyConstant",
  "Overwrite",
  "Accessor",
  "Invoker",
] as const;

function parseAtTarget(target: string): { owner?: string; name: string; desc?: string; isField: boolean } {
  if (target.startsWith("L")) {
    const semi = target.indexOf(";");
    if (semi >= 0) {
      const owner = target.slice(1, semi);
      const rest = target.slice(semi + 1);
      if (rest.includes("(")) {
        const i = rest.indexOf("(");
        return { owner, name: rest.slice(0, i), desc: rest.slice(i), isField: false };
      }
      const colon = rest.lastIndexOf(":");
      if (colon >= 0) return { owner, name: rest.slice(0, colon), desc: rest.slice(colon + 1), isField: true };
      return { owner, name: rest, isField: false };
    }
  }
  if (target.includes("(")) {
    const i = target.indexOf("(");
    return { name: target.slice(0, i), desc: target.slice(i), isField: false };
  }
  return { name: target, isField: false };
}

function parseAtDeep(annotationBlock: string): AtInfo | undefined {
  const atIdx = annotationBlock.indexOf("@At");
  if (atIdx < 0) return undefined;
  const open = annotationBlock.indexOf("(", atIdx);
  if (open < 0) return undefined;
  let depth = 0;
  let j = open;
  for (; j < annotationBlock.length; j++) {
    const c = annotationBlock[j];
    if (c === "(") depth++;
    else if (c === ")") {
      depth--;
      if (depth === 0) break;
    }
  }
  const inner = annotationBlock.slice(open + 1, j);
  const valueRe = inner.match(/value\s*=\s*"([^"]*)"/);
  const quoted = inner.match(/"([^"]*)"/);
  const value = valueRe?.[1] ?? quoted?.[1] ?? "";
  const target = inner.match(/target\s*=\s*"([^"]*)"/)?.[1];
  if (!target) return { value, targetIsField: false };
  const parsed = parseAtTarget(target);
  return {
    value,
    target,
    targetOwner: parsed.owner,
    targetName: parsed.name,
    targetDesc: parsed.desc,
    targetIsField: parsed.isField,
  };
}

// ── 深度校验 ───────────────────────────────────────────────────────────────────

function isClassPrivate(info: { accessFlags: number }): boolean {
  return (info.accessFlags & 0x0002) !== 0;
}
function isClassFinal(info: { accessFlags: number }): boolean {
  return (info.accessFlags & 0x0010) !== 0;
}
function isMethodFinal(accessFlags: number): boolean {
  return (accessFlags & 0x0010) !== 0;
}

export function deepValidateMixins(input: DeepValidateInput): DeepValidationResult {
  const errors: DeepValidationError[] = [];
  const warnings: string[] = [];
  const index = buildJarIndex(input.jarPath);
  let checkedTargets = 0;

  for (const f of input.javaFiles) {
    if (!f.content.includes("@Mixin")) continue;
    const parsed = parseMixinJavaSource(f.content, f.path);
    if (!parsed) {
      warnings.push(`${f.path}: 未解析出 mixin 类（缺少 class 声明）`);
      continue;
    }
    const target = parsed.targetClass;
    if (!target) {
      warnings.push(`${f.path}（${parsed.mixinClass}）: 无法确定 @Mixin 目标类`);
      continue;
    }
    checkedTargets += 1;

    // (a) 目标类存在性
    const owners = normalizeOwnerCandidates(target);
    const ownerHit = owners.find((o) => index.hasClass(o));
    if (!ownerHit) {
      errors.push({
        target,
        issue: "目标类不存在于 jar",
        suggestion: "确认 @Mixin 目标类名/包路径与 jar 版本一致；若使用映射名请先 convert_mapping",
      });
      continue;
    }
    const classInfo = index.getClass(ownerHit)!;

    // (b) 可访问性
    if (isClassPrivate(classInfo)) {
      errors.push({
        target,
        issue: "目标类是 private（内部类），mixin 无法注入",
        suggestion: "改为注入其外部类，或通过 Accessor 访问该内部类",
      });
    } else if (isClassFinal(classInfo)) {
      // mixin 实际上可以注入 final 类（StringMixin 等）；此处仅提示不判错
      warnings.push(`目标 ${ownerHit} 是 final 类：mixin 可注入 final 类，但其中 final 方法无法被 @Overwrite 覆盖`);
    }

    // 注入块（按 kind 配对：parser 的 injections 含 9 种 kind + MixinExtras 追加项，
    // 全局下标配对会在 @ModifyArg*/MixinExtras 出现时错位，F-E106）
    const blocks: Array<{ kind: string; block: string }> = [];
    for (const kind of INJECTION_KINDS) {
      for (const block of extractAnnotationBlocks(f.content, kind)) blocks.push({ kind, block });
    }
    const injections = parsed.injections;
    const usedPerKind = new Map<string, number>();

    injections.forEach((inj) => {
      checkedTargets += 1;
      const nth = usedPerKind.get(inj.kind) ?? 0;
      usedPerKind.set(inj.kind, nth + 1);
      const blockText = blocks.find((b) => b.kind === inj.kind) ? (blocks.filter((b) => b.kind === inj.kind)[nth]?.block ?? "") : "";
      const atInfo = parseAtDeep(blockText);
      const selectorMatches: Array<{ name: string; descriptor: string; owner: string; kind: "method" | "field" | "record" }> = [];

      // (c) 方法选择器 → 字节码方法表
      for (const ref of inj.methodRefs) {
        const selector = ref.methodName;
        if (!selector) {
          errors.push({
            target: `${ownerHit} (${inj.kind})`,
            issue: "缺少 method 选择器",
            suggestion: "为 @Inject/@Redirect 补充 method 或 method+desc",
          });
          continue;
        }
        const lookup = lookupMemberInHierarchy(index, ownerHit, selector, ref.descriptor);
        if (!lookup.found) {
          if (isObfuscatedName(selector)) {
            errors.push({
              target: `${ownerHit}#${selector}${ref.descriptor ?? ""}`,
              issue: `方法不存在于 jar：${selector}（可能是映射层不匹配）`,
              suggestion: mappingMismatchSuggestion(selector, inferMappingFromName(input.jarPath)),
            });
          } else {
            errors.push({
              target: `${ownerHit}#${selector}${ref.descriptor ?? ""}`,
              issue: `方法不存在于 ${ownerHit} 或其父类链`,
              suggestion: "检查方法名拼写 / MC 版本；若用混淆名请 convert_mapping 转换",
            });
          }
          continue;
        }
        selectorMatches.push(...lookup.matches);
        if (!ref.descriptor && lookup.matches.length > 1) {
          warnings.push(
            `${ownerHit}#${selector} 存在多个重载（${lookup.matches
              .map((m) => m.descriptor)
              .join("、")}），建议补充 descriptor 消歧`,
          );
        }
        const methodMatch = lookup.matches.find((m) => m.kind === "method");
        if (methodMatch && inj.kind === "Overwrite" && isMethodFinal(classInfo.methods.find(
          (m) => m.name === methodMatch.name && m.descriptor === methodMatch.descriptor,
        )?.accessFlags ?? 0)) {
          warnings.push(`@Overwrite 目标 ${methodMatch.name}${methodMatch.descriptor} 是 final 方法，无法覆盖`);
        }
      }

      // (d) @At 位置 / 调用点校验
      // HEAD|RETURN|TAIL 且无 target：仅存在性级位置语义，不按「调用点缺失」报错。
      const atValueUpper = (atInfo?.value ?? "").toUpperCase();
      const isPositionalAt =
        atValueUpper === "HEAD" || atValueUpper === "RETURN" || atValueUpper === "TAIL";
      if (atInfo && isPositionalAt && !atInfo.target) {
        // 跳过调用点校验
      } else if (atInfo?.target && atInfo.targetName) {
        const atOwner = atInfo.targetOwner ?? ownerHit;
        const atOwners = normalizeOwnerCandidates(atOwner);
        const atOwnerHit = atOwners.find((o) => index.hasClass(o));
        if (!atOwnerHit) {
          errors.push({
            target: atInfo.target,
            issue: `@At target 的 owner 类不存在：${atOwner}`,
            suggestion: "确认 @At target 的 owner 类名（可省略 owner 直接写 方法名(desc)）",
          });
        } else if (atInfo.value === "NEW") {
          // target 是类名
          // owner 已确认存在，无需进一步校验
        } else {
          const wantField = atInfo.targetIsField || /FIELD|GETFIELD|PUTFIELD|GETSTATIC|PUTSTATIC/.test(atInfo.value);
          const memberLookup = lookupMemberInHierarchy(index, atOwnerHit, atInfo.targetName, atInfo.targetDesc);
          if (!memberLookup.found) {
            errors.push({
              target: atInfo.target,
              issue: `@At target 的${wantField ? "字段" : "方法"}不存在：${atOwnerHit}#${atInfo.targetName}`,
              suggestion: wantField
                ? "FIELD 类 @At 的 target 必须指向存在的字段（含继承/record 组件）"
                : "INVOKE 类 @At 的 target 必须指向存在的方法；若用混淆名请 convert_mapping 转换",
            });
          } else if (!wantField && selectorMatches.length > 0) {
            // 调用点匹配：选择器方法体内是否真的调用了 target
            let callFound = false;
            let noCode = false;
            for (const m of selectorMatches) {
              if (m.kind !== "method") continue;
              const ownerInfo = index.getClass(m.owner);
              if (!ownerInfo) continue;
              const codes = ownerInfo.calls.get(`${m.name}${m.descriptor}`);
              if (!codes) {
                noCode = true;
                continue;
              }
              for (const c of codes) {
                if (c.target.name === atInfo.targetName &&
                    (!atInfo.targetDesc || c.target.desc === atInfo.targetDesc)) {
                  callFound = true;
                  if (atInfo.targetOwner && c.target.owner !== atOwnerHit) {
                    warnings.push(`@At target 调用点 owner 不同（字节码实际为 ${c.target.owner}，期望 ${atOwnerHit}）——若为继承调用可忽略`);
                  }
                  break;
                }
              }
            }
            if (!callFound && !noCode) {
              errors.push({
                target: atInfo.target,
                issue: `选择器方法的字节码中没有对 ${atInfo.targetName}${atInfo.targetDesc ?? ""} 的调用`,
                suggestion: "确认 @At target 与注入所在方法匹配（target 应是该方法体内真实出现的调用）",
              });
            }
          }
        }
      }
    });
  }

  return {
    verified: errors.length === 0,
    errors,
    warnings,
    checkedTargets,
    jarPath: input.jarPath,
    mapping: inferMappingFromName(input.jarPath),
  };
}

// ── validate_at / validate_aw 工具 handler ────────────────────────────────────

export interface ValidateAtArgs {
  atContent?: string;
  /** 模组项目根：扫描 META-INF/*_at.cfg（排除构建/IDE 目录） */
  projectPath?: string;
  version?: string;
  jarPath?: string;
}

export interface ValidateAwArgs {
  awContent?: string;
  /** 模组项目根：扫描 *.accesswidener（排除构建/IDE 目录） */
  projectPath?: string;
  version?: string;
  jarPath?: string;
}

/** 合并多文件内容，用 `# ===== file: rel =====` 分隔以启用跨文件冲突检测 */
export function joinProjectAccessFiles(
  root: string,
  paths: string[],
): string {
  return paths
    .map((p) => {
      const rel = relative(root, p).replace(/\\/g, "/");
      const body = readFileSync(p, "utf8");
      return `# ===== file: ${rel} =====\n${body}`;
    })
    .join("\n");
}

export function collectAtContentFromProject(projectPath: string): { content: string; files: string[] } {
  const files = walkProjectFiles(
    projectPath,
    (rel, name) => rel.includes("META-INF/") && name.endsWith("_at.cfg"),
  );
  return { content: joinProjectAccessFiles(projectPath, files), files };
}

export function collectAwContentFromProject(projectPath: string): { content: string; files: string[] } {
  const files = walkProjectFiles(projectPath, (_rel, name) => name.endsWith(".accesswidener"));
  return { content: joinProjectAccessFiles(projectPath, files), files };
}

function resolveAtContent(args: ValidateAtArgs): { content: string; scannedFiles?: string[] } | { error: Record<string, unknown> } {
  const parts: string[] = [];
  const scanned: string[] = [];
  if (args.atContent?.trim()) parts.push(args.atContent.trim());
  if (args.projectPath?.trim()) {
    if (!existsSync(args.projectPath) || !statSync(args.projectPath).isDirectory()) {
      return {
        error: {
          ok: false,
          action: actionable("INVALID_INPUT", `projectPath 不是有效目录：${args.projectPath}`, [
            "传入模组项目根目录绝对路径",
          ]),
        },
      };
    }
    const collected = collectAtContentFromProject(args.projectPath);
    scanned.push(...collected.files);
    if (collected.content.trim()) parts.push(collected.content.trim());
  }
  if (parts.length === 0) {
    return {
      error: {
        ok: false,
        action: actionable("INVALID_INPUT", "缺少 AT 内容", [
          "传入 atContent，或设置 projectPath 扫描 META-INF/*_at.cfg",
        ]),
      },
    };
  }
  return {
    content: parts.join("\n# ===== file: __merged__ =====\n"),
    scannedFiles: scanned.length ? scanned : undefined,
  };
}

function resolveAwContent(args: ValidateAwArgs): { content: string; scannedFiles?: string[] } | { error: Record<string, unknown> } {
  const parts: string[] = [];
  const scanned: string[] = [];
  if (args.awContent?.trim()) parts.push(args.awContent.trim());
  if (args.projectPath?.trim()) {
    if (!existsSync(args.projectPath) || !statSync(args.projectPath).isDirectory()) {
      return {
        error: {
          ok: false,
          action: actionable("INVALID_INPUT", `projectPath 不是有效目录：${args.projectPath}`, [
            "传入模组项目根目录绝对路径",
          ]),
        },
      };
    }
    const collected = collectAwContentFromProject(args.projectPath);
    scanned.push(...collected.files);
    if (collected.content.trim()) parts.push(collected.content.trim());
  }
  if (parts.length === 0) {
    return {
      error: {
        ok: false,
        action: actionable("INVALID_INPUT", "缺少 AW 内容", [
          "传入 awContent，或设置 projectPath 扫描 *.accesswidener",
        ]),
      },
    };
  }
  return {
    content: parts.join("\n# ===== file: __merged__ =====\n"),
    scannedFiles: scanned.length ? scanned : undefined,
  };
}

function validateAccessCore(
  content: string | undefined,
  validate: (c: string) => ReturnType<typeof validateAccessTransformer>,
): Record<string, unknown> {
  if (!content || !content.trim()) {
    return { ok: false, action: actionable("INVALID_INPUT", "缺少 AT/AW 内容", ["传入 atContent / awContent 内容文本"]) };
  }
  try {
    const result = validate(content);
    return { ok: true, ...result };
  } catch (err) {
    return {
      ok: false,
      action: actionable(
        "DEEP_VALIDATION_FAILED",
        `校验失败: ${(err as Error).message ?? String(err)}`,
        ["确认 jarPath 指向完整客户端 jar（非 mod jar / 非源码目录）"],
      ),
    };
  }
}

export function validateAtHandler(args: ValidateAtArgs): Record<string, unknown> {
  if (missingMcVersion(args.version)) {
    return { ok: false, action: versionRequiredAction() };
  }
  const version = args.version!.trim();
  const resolved = resolveAtContent(args);
  if ("error" in resolved) return resolved.error;
  const jar = resolveValidationJar(version, args.jarPath);
  if (!jar) {
    return { ok: false, version, action: cacheMissActionable(version) };
  }
  if (jar.error) {
    return { ok: false, version, action: actionable("NOT_FOUND", jar.error, ["核对 jarPath 后重试"]) };
  }
  const files = splitAccessFiles(resolved.content);
  const base = validateAccessCore(
    resolved.content,
    (c) => (files.length > 1
      ? validateAccessTransformerFiles(files, buildJarIndex(jar.jarPath), { mapping: jar.mapping })
      : validateAccessTransformer(c, buildJarIndex(jar.jarPath), { mapping: jar.mapping })),
  );
  return {
    ...base,
    version,
    jarPath: jar.jarPath,
    mapping: jar.mapping,
    ...(resolved.scannedFiles ? { scannedFiles: resolved.scannedFiles } : {}),
  };
}

export function validateAwHandler(args: ValidateAwArgs): Record<string, unknown> {
  if (missingMcVersion(args.version)) {
    return { ok: false, action: versionRequiredAction() };
  }
  const version = args.version!.trim();
  const resolved = resolveAwContent(args);
  if ("error" in resolved) return resolved.error;
  const jar = resolveValidationJar(version, args.jarPath);
  if (!jar) {
    return { ok: false, version, action: cacheMissActionable(version) };
  }
  if (jar.error) {
    return { ok: false, version, action: actionable("NOT_FOUND", jar.error, ["核对 jarPath 后重试"]) };
  }
  const files = splitWidenerFiles(resolved.content);
  const base = validateAccessCore(
    resolved.content,
    (c) => (files.length > 1
      ? validateAccessWidenerFiles(files, buildJarIndex(jar.jarPath), { mapping: jar.mapping })
      : validateAccessWidener(c, buildJarIndex(jar.jarPath), { mapping: jar.mapping })),
  );
  return {
    ...base,
    version,
    jarPath: jar.jarPath,
    mapping: jar.mapping,
    ...(resolved.scannedFiles ? { scannedFiles: resolved.scannedFiles } : {}),
  };
}
