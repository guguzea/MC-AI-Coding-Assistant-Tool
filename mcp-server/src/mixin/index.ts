import { parseMixinsJson, parseMixinJavaSource, findMixinClassInFiles } from "./parser.js";
import { resolveMixinMethodTarget } from "./resolve.js";
import { actionable } from "../utils/actionable.js";

export interface MixinAnalyzeInput {
  javaFiles?: Array<{ path: string; content: string }>;
  mixinsJson?: string;
  version?: string;
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
}

const SUPPORT_MATRIX = [
  "SRG func_* / Yarn method_* / Mojang m_*_",
  "可读方法名 + ownerClass（query_api）",
  "method+descriptor 一体字符串",
  "@Inject method + desc 分离",
  "method = { \"a\", \"b\" } 数组",
];

export async function mixinAnalyze(input: MixinAnalyzeInput): Promise<MixinAnalyzeResult> {
  const version = input.version ?? "1.20.1";
  const javaFiles = input.javaFiles ?? [];
  const warnings: string[] = [];
  const errors: string[] = [];
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
  };
}

export { parseMethodReference, detectNamingStyle, mergeInjectMethodAndDesc } from "./method-string.js";
export { parseMixinsJson, parseMixinJavaSource } from "./parser.js";
