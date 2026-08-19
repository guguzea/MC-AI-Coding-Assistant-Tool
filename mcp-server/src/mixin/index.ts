import { parseMixinsJson, parseMixinJavaSource, findMixinClassInFiles } from "./parser.js";
import { resolveMixinMethodTarget } from "./resolve.js";
import { actionable, type ActionEnvelope, versionRequiredAction, missingMcVersion } from "../utils/actionable.js";
import { deepValidateMixins, resolveValidationJar, cacheMissActionable } from "./deep-validate.js";
import { loadModProject, mergeJavaFiles, preferExplicit, resolveProjectDir } from "../utils/project-files.js";

export interface MixinAnalyzeInput {
  javaFiles?: Array<{ path: string; content: string }>;
  mixinsJson?: string;
  version?: string;
  /** deep: true 时基于已缓存 remapped 客户端 jar 做字节码级校验（默认 false，静态路径零影响） */
  deep?: boolean;
  /** 显式指定客户端 jar 绝对路径（优先于缓存扫描） */
  jarPath?: string;
  projectPath?: string;
}

export interface DeepAnalysisResult {
  available: boolean;
  verified?: boolean;
  errors?: Array<{ target: string; issue: string; suggestion: string }>;
  warnings?: string[];
  checkedTargets?: number;
  jarPath?: string;
  mapping?: string;
  action?: ReturnType<typeof actionable>;
}

export interface MixinAnalyzeResult {
  ok: boolean;
  version: string;
  mixinsJson?: ReturnType<typeof parseMixinsJson>;
  mixins: Array<{
    file?: string;
    mixinClass: string;
    targetClass?: string;
    injections: Array<{
      kind: string;
      at?: string;
      methods: Array<{
        ref: string;
        style: string;
        found: boolean;
        resolvedName?: string;
        action?: ReturnType<typeof actionable>;
      }>;
    }>;
  }>;
  warnings: string[];
  errors: string[];
  supportMatrix: string[];
  action?: ActionEnvelope;
  /** 仅 deep:true 时附加（纯增量字段，静态结果不变） */
  deepResult?: DeepAnalysisResult;
}

const SUPPORT_MATRIX = [
  "SRG func_* / Yarn method_* / Mojang m_*_",
  "可读方法名 + ownerClass（query_api）",
  "method+descriptor 一体字符串",
  "@Inject method + desc 分离",
  "method = { \"a\", \"b\" } 数组",
];

export async function mixinAnalyze(input: MixinAnalyzeInput): Promise<MixinAnalyzeResult> {
  if (missingMcVersion(input.version)) {
    const action = versionRequiredAction();
    return {
      ok: false,
      version: "",
      mixins: [],
      warnings: [],
      errors: [action.message],
      supportMatrix: SUPPORT_MATRIX,
      action,
    };
  }
  let javaWarning: string | undefined;
  if (input.projectPath) {
    const resolved = resolveProjectDir(input.projectPath);
    if (!resolved.ok) {
      return {
        ok: false,
        version: input.version!,
        mixins: [],
        warnings: [],
        errors: [resolved.action.message],
        supportMatrix: SUPPORT_MATRIX,
        action: resolved.action,
      };
    }
    const loaded = loadModProject(resolved.root);
    if (loaded.javaWarning) {
      process.stderr.write(`${loaded.javaWarning}\n`);
      javaWarning = loaded.javaWarning;
    }
    const mixinJava = loaded.javaFiles.filter((f) => f.content.includes("@Mixin"));
    input = {
      ...input,
      mixinsJson: preferExplicit(input.mixinsJson, loaded.mixinsJson),
      javaFiles: mergeJavaFiles(input.javaFiles, mixinJava.length ? mixinJava : loaded.javaFiles),
    };
  }
  const version = input.version!.trim();
  const javaFiles = input.javaFiles ?? [];
  const warnings: string[] = [];
  const errors: string[] = [];
  if (javaWarning) warnings.push(javaWarning);
  const mixins: MixinAnalyzeResult["mixins"] = [];

  let jsonSummary: ReturnType<typeof parseMixinsJson> | undefined;
  if (input.mixinsJson) {
    jsonSummary = parseMixinsJson(input.mixinsJson);
    warnings.push(...jsonSummary.warnings);
    for (const name of jsonSummary.mixinClasses) {
      const file = findMixinClassInFiles(name, javaFiles);
      if (!file) {
        warnings.push(`mixins.json 引用 ${name}，但未在 javaFiles 中找到类定义`);
      }
    }
  }

  for (const f of javaFiles) {
    if (!f.content.includes("@Mixin")) continue;
    const parsed = parseMixinJavaSource(f.content, f.path);
    if (!parsed) continue;
    if (parsed.warnings?.length) warnings.push(...parsed.warnings);

    const owner = parsed.targetClass;
    const injections = [];
    for (const inj of parsed.injections) {
      const methods = [];
      for (const ref of inj.methodRefs) {
        const res = await resolveMixinMethodTarget(owner, ref, version);
        methods.push({
          ref: ref.raw || ref.methodName,
          style: ref.style,
          found: res.found,
          resolvedName: res.resolvedName,
          action: res.action,
        });
      }
      injections.push({ kind: inj.kind, at: inj.at, methods });
    }

    mixins.push({
      file: f.path,
      mixinClass: parsed.mixinClass,
      targetClass: parsed.targetClass,
      injections,
    });
  }

  const missing = mixins.flatMap((m) =>
    m.injections.flatMap((i) => i.methods.filter((x) => !x.found)),
  );
  if (missing.length && mixins.length) {
    errors.push(`${missing.length} 个注入点未能解析目标方法`);
  }

  // ── deep:true 字节码级校验（纯附加：jar 未缓存 → CACHE_MISS 引导，绝不自动下载）──
  let deepResult: DeepAnalysisResult | undefined;
  if (input.deep === true) {
    const jar = resolveValidationJar(version, input.jarPath);
    if (!jar) {
      deepResult = { available: false, action: cacheMissActionable(version) };
    } else if (jar.error) {
      deepResult = {
        available: false,
        action: actionable("NOT_FOUND", jar.error, ["核对 jarPath 后重试"]),
      };
    } else {
      try {
        const deep = deepValidateMixins({ javaFiles, version, jarPath: jar.jarPath });
        deepResult = {
          available: true,
          verified: deep.verified,
          errors: deep.errors,
          warnings: deep.warnings,
          checkedTargets: deep.checkedTargets,
          jarPath: deep.jarPath,
          mapping: deep.mapping,
        };
      } catch (err) {
        deepResult = {
          available: false,
          action: actionable(
            "DEEP_VALIDATION_FAILED",
            `字节码校验失败: ${(err as Error).message ?? String(err)}`,
            ["确认 jarPath 指向完整客户端 jar（非 mod jar / 非源码目录）"],
          ),
        };
      }
    }
  }

  return {
    ok: errors.length === 0,
    version,
    mixinsJson: jsonSummary,
    mixins,
    warnings,
    errors,
    supportMatrix: SUPPORT_MATRIX,
    ...(missing.length
      ? {
          // top-level hint when any missing
        }
      : {}),
    ...(deepResult ? { deepResult } : {}),
  };
}

export { parseMethodReference, detectNamingStyle, mergeInjectMethodAndDesc } from "./method-string.js";
export { parseMixinsJson, parseMixinJavaSource } from "./parser.js";
export { validateAtHandler, validateAwHandler } from "./deep-validate.js";
