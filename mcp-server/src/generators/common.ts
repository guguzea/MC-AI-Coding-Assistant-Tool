export { normalizeModIdentifier, toJavaClassName } from "../datagen/common.js";

import { isExactMcVersionToken, matchesExactMcVersion } from "../utils/minecraft-version.js";
import { ActionCodes, actionable, type ActionEnvelope } from "../utils/actionable.js";

/** 精确 MC 版本 token（禁止 1.20.4beta / 1.2100 无锚混入）。 */
export function exactMcVersion(s: string): boolean {
  return isExactMcVersionToken(s);
}

export { matchesExactMcVersion };

/**
 * W2-1（2026-09-21）：MC 时代**上界**哨兵（与 generate_worldgen 的 N6 同形）。
 * `exactMcVersion` 只判「是不是 x.y.z 形」，`1.99.9` / `26.99.9` 这类编造 version 会一路生成成功
 * （旧病：generate_model / generate_lang / generate_config 的 fabric 分支接受 1.99.9 并回 ok:true + files）。
 * 本仓 as-of 2026-09-21 只核到 1.x 的 1.21.x 与 26.1.x；超出即拒 —— 上游出新代时抬常量并附依据。
 */
export const MC_MAX_MINOR_1X = 21;
export const MC_MAX_MINOR_26X = 1;

/** 通过则返回 null；否则返回可直接拼进 errors 的说明。 */
export function eraUpperBoundError(version: string): string | null {
  const v = version.trim();
  if (/^1\./.test(v)) {
    const mm = v.match(/^1\.(\d+)(?:\.(\d+))?$/);
    const minor = mm ? Number(mm[1]) : 0;
    if (minor > MC_MAX_MINOR_1X) {
      return `未跟进 1.${minor}.x（本仓 as-of 2026-09-21 只核到 1.${MC_MAX_MINOR_1X}.x）—— 禁止默默生成；先按 search_*_docs 核该代格式，再抬 MC_MAX_MINOR_1X。`;
    }
    return null;
  }
  if (/^26\./.test(v)) {
    const mm = v.match(/^26\.(\d+)/);
    const minor = mm ? Number(mm[1]) : 0;
    if (minor > MC_MAX_MINOR_26X) {
      return `未跟进 26.${minor}.x（本仓 as-of 2026-09-21 只核到 26.${MC_MAX_MINOR_26X}.x）—— 禁止默默生成；先按 search_*_docs 核该代格式，再抬 MC_MAX_MINOR_26X。`;
    }
    return null;
  }
  return `只认 1.x 与 26.x 的精确 MC 版本，收到 ${version}。`;
}

export function toPascalCase(modId: string): string {
  return modId.split(/[_-]/).map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join("");
}

export function withJavaTypeSuffix(className: string, suffix: string): string {
  if (!className) return suffix;
  if (className.toLowerCase().endsWith(suffix.toLowerCase())) return className;
  return className + suffix;
}

/** 去掉用户已写的类型后缀，便于模板再拼接 `Packet` / `Capability` / `Renderer` */
export function stripJavaTypeSuffix(className: string, suffix: string): string {
  const re = new RegExp(`${suffix}$`, "i");
  const stripped = className.replace(re, "");
  return stripped || className;
}

export interface GeneratorResult {
  code: string | null;
  files?: Record<string, string>;
  warnings?: string[];
  errors?: string[];
  experimental?: boolean;
  /** 建议写入的相对工程路径（generate_* 包装后填充；默认仍只吐文本） */
  suggestedPath?: string | null;
  suggestedPaths?: string[];
  /**
   * A1（2026-09-24）：拒绝出口的显式机读码（可选**覆盖**；缺省时由 write-helper 的
   * `generatorRejectionAction(errors)` 单点分类）。生成器自己知道更精确的原因时再填。
   */
  action?: ActionEnvelope;
  /**
   * S6-3（2026-09-25，仅 `generate_lang` 填）：本次 entries 是否**一条都没落进**产出的 lang 文件。
   * `true` = 文件仍是空对象 `{}`（合法产物，不是失败：三态不变，仍 ok:true / resultKind:"ok"），
   * 同一次调用必有配套 warning；`false` = 至少落进 1 条。缺省（其他生成器）= 该生成器无此语义。
   * 存在的理由：让门与脚本按字段分支，而不必解析中文 warning。
   */
  emptyEntries?: boolean;
}

export type PlatformTarget = "forge_1.20.1" | "neoforge_1.21";

/** 生成器白名单未覆盖时的统一改口（不发明 Java 模板）。 */
export function noNativeGeneratorError(docsTool: string, skillOrRule: string): string {
  return `该版本无原生生成器，不要理解为游戏里做不了。请改用 ${docsTool} 手动编写，参考 ${skillOrRule}。`;
}

export function docsToolForGeneratorPlatform(platform: string): string {
  const p = platform.trim().toLowerCase();
  if (p.startsWith("neoforge") || p === "neo") return "search_neoforge_docs";
  if (p.startsWith("fabric") || p === "quilt") return "search_fabric_docs";
  if (p.startsWith("forge")) return "search_forge_docs";
  return "search_*_docs";
}

/**
 * A1（2026-09-24）：`generate_*` 拒绝出口的机读码 —— **单点分类器**（结果在 `result.action.code`）。
 *
 * 为什么在出口分类、而不是散点改码：8 个工具面共 63 个拒绝位点（`generators/index.ts` 46 +
 * `datagen/index.ts` 17）只产出自由文本 `errors[]`；`GeneratorResult.code` 是**骨架代码位**
 * （拒绝时恒 null，W2-1 复盘已定），不许拿它当错误码。故在唯一出口（`write-helper.ts`）
 * 按 errors 文本分类后附 `ActionEnvelope`，与既有带内失败通道（`utils/actionable.ts` 合同）同形。
 *
 * 锚点表（先命中先赢；只认**共享 helper 产出或逐字稳定**的短语）：
 *   VERSION_REQUIRED    ← `version is required` / `version 必填`
 *   PICK_PLATFORM       ← `platform 必填` / `platform is required` / `loader 必填`
 *   NO_NATIVE_GENERATOR ← `无内置` / `禁止生成` / `无 payload` / `networking` / `无已核实签名` / `禁止默写`
 *   VERSION_UNSUPPORTED ← `未跟进` / `仅覆盖` / `只覆盖` / `仅支持` / `当前支持` / `尚无` / `属更早时代` /
 *                         `禁止默默生成` / `只认 1.x` / `仅 NeoForge` / `无 version=`
 *   INVALID_INPUT       ← `必须是精确 MC 版本` / `构建号` / `无效` / `无法归一化` / `未知 platform` / `未知 loader`
 *   兜底 GENERATION_FAILED —— 落到它说明有拒绝文案没归类。**改文案 = 改判据**：
 *   新增/改写拒绝出口时必须同步本表，并跑 `mcp-server/test-cli.mjs` 的 C1 探针（含同 tool 互异判据）。
 */
const REJECT_RULES: ReadonlyArray<{ code: string; re: RegExp }> = [
  { code: ActionCodes.VERSION_REQUIRED, re: /version is required|version 必填/ },
  { code: ActionCodes.PICK_PLATFORM, re: /platform (?:is )?required|platform 必填|loader 必填/ },
  {
    code: ActionCodes.NO_NATIVE_GENERATOR,
    re: /无内置|禁止生成|无 payload|networking|无已核实签名|禁止默写/,
  },
  {
    code: ActionCodes.VERSION_UNSUPPORTED,
    re: /未跟进|仅覆盖|只覆盖|仅支持|当前支持|尚无|属更早时代|禁止默默生成|只认 1\.x|仅 NeoForge|无 version=|本波仅核实|仅核实/,
  },
  {
    code: ActionCodes.INVALID_INPUT,
    re: /必须是精确 MC 版本|构建号|无效|无法归一化|未知 platform|未知 loader|Unknown provider/,
  },
];

const REJECT_GUIDANCE: Record<string, { message: string; nextSteps: string[] }> = {
  [ActionCodes.VERSION_REQUIRED]: {
    message: "缺必填 version（VERSION_REQUIRED）—— 生成器未产出骨架。",
    nextSteps: [
      "传入精确 Minecraft 版本（如 1.20.1 / 1.21.1 / 26.1）",
      "先 list_forge_versions / list_fabric_versions / list_neoforge_versions / list_doc_versions 确认已建档档位",
      "不要假设默认 1.20.1 或 26.1",
    ],
  },
  [ActionCodes.PICK_PLATFORM]: {
    message: "缺必填 platform / loader（PICK_PLATFORM）—— 生成器未产出骨架。",
    nextSteps: [
      "显式传 platform / loader（forge | neoforge | fabric | quilt，按工具支持面）",
      "禁止默认 forge / forge_1.20.1",
      "各工具支持面见 errors[] 原文",
    ],
  },
  [ActionCodes.NO_NATIVE_GENERATOR]: {
    message: "该平台/档没有原生生成器（NO_NATIVE_GENERATOR）—— 不是游戏里做不了。",
    nextSteps: [
      "按 errors[] 的指路改用 search_*_docs / 对应 Skill 手写",
      "不要生成别的平台/加载器的骨架冒充本平台",
      "改口后仍禁止默认版本或映射",
    ],
  },
  [ActionCodes.VERSION_UNSUPPORTED]: {
    message: "该版本没有本生成器的已核实骨架（VERSION_UNSUPPORTED）—— 禁止默默生成。",
    nextSteps: [
      "按 errors[] 给的改口走 search_*_docs 手写",
      "先 list_*_versions 确认已建档档位；禁止把邻档骨架当本版",
      "要抬覆盖面上界，先按 search_*_docs 核该代格式再改生成器常量",
    ],
  },
  [ActionCodes.INVALID_INPUT]: {
    message: "参数值不合法（INVALID_INPUT）—— 生成器拒绝。",
    nextSteps: [
      "按 errors[] 原文修参数后重发",
      "版本用精确 MC 版本形（1.x / 26.x），不要传构建号或形如 1.2100 的 token",
      "标识符用字母开头，可含数字与下划线",
    ],
  },
  [ActionCodes.GENERATION_FAILED]: {
    message: "生成器拒绝，且未命中分类表（GENERATION_FAILED）。",
    nextSteps: [
      "读 errors[] 原文定位原因",
      "若这是新加的拒绝文案：把锚点补进 generators/common.ts 的 REJECT_RULES（改文案 = 改判据）",
    ],
  },
};

/** 拒绝 → ActionEnvelope（A1 单点分类；`errors` 缺省时落 GENERATION_FAILED）。 */
export function generatorRejectionAction(errors?: string[]): ActionEnvelope {
  const text = (errors ?? []).join("\n");
  const hit = REJECT_RULES.find((r) => r.re.test(text));
  const code = hit?.code ?? ActionCodes.GENERATION_FAILED;
  const g = REJECT_GUIDANCE[code] ?? REJECT_GUIDANCE[ActionCodes.GENERATION_FAILED]!;
  return actionable(code, g.message, g.nextSteps, [
    "search_forge_docs",
    "search_fabric_docs",
    "search_neoforge_docs",
  ]);
}
