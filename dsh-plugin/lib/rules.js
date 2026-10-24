/**
 * 规则注入：把「当前档」的规则作为一段 system prompt 送进会话。
 *
 * 两层：
 *   · 常驻底座 00/01/09（≈32 KB），每个请求都在；
 *   · **按话题追加**：本会话登记的 topics 会并进同一段。
 *     话题用仓库自己的 `resolveTopicIds` 解析 —— 与 MCP `activate_platform_pack session`
 *     同一份判据，不在插件里维护第二张 topic 表。
 *
 * ⚠️ text 必须**同步**返回字符串：dsh-system-prompt 的 assembly 是
 *   `text: typeof section.text === "function" ? section.text(context) : section.text`，
 *   随后 `renderPrompt` 只 filter 长度 > 0 的字符串。返回 Promise 会被静默丢弃且不报错。
 */
import { readTierRulesByIdsSync, resolveRuleIdsForTopicsSync, resolveTierSync } from "./pack.js";

export const SECTION_NAME = "mc-skill:rules";

/**
 * 为什么是 9,000：
 *   · SECTION_ORDERS 里 TOOLS_SDK = 5,000、DELIVERABLE_FILE_REFERENCES = 9,000、STRUCTURED_OUTPUT = 9,900；
 *   · 放 9,000 让它排在工具说明之后、结构化输出之前 —— 规则是「怎么用工具」，不该压过工具本身。
 */
export const SECTION_ORDER = 9000;

export const BASE_RULE_IDS = ["00", "01", "09"];

const RULE_ORDER = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10"];

function tierLabel(tier) {
  if (tier.status === "ok") return tier.platform + " " + tier.minecraftVersion;
  if (tier.status === "draft") return tier.platform + " " + tier.minecraftVersion + "（draft，未注入）";
  if (tier.status === "nopack") return tier.platform + " " + tier.minecraftVersion + "（本仓库无规则树）";
  return "未判定";
}

/**
 * 合并「底座 ∪ 会话话题」得到最终规则号（按 00–10 排序、去重）。
 * @param {string[]} topics 本会话已登记的话题词
 * @returns {{ids: string[], extra: string[], warnings: string[], skillHints: string[]}}
 */
export function resolveActiveRuleIds(topics) {
  const base = new Set(BASE_RULE_IDS);
  if (!Array.isArray(topics) || topics.length === 0) {
    return { ids: [...BASE_RULE_IDS], extra: [], warnings: [], skillHints: [] };
  }
  const resolved = resolveRuleIdsForTopicsSync(topics);
  const merged = new Set([...BASE_RULE_IDS, ...resolved.ids]);
  const ids = RULE_ORDER.filter((id) => merged.has(id));
  const extra = ids.filter((id) => !base.has(id));
  return { ids, extra, warnings: resolved.warnings, skillHints: resolved.skillHints };
}

/**
 * 拼装注入正文。空串 = 本步不注入任何内容（与 section 的「空文本被过滤」语义一致）。
 * @param {string} cwd 会话工作目录
 * @param {string[]} [topics] 本会话已登记的话题词
 * @returns {string}
 */
export function buildRulesText(cwd, topics) {
  const tier = resolveTierSync(cwd);
  if (tier.status !== "ok") return "";
  const active = resolveActiveRuleIds(topics);
  const rules = readTierRulesByIdsSync(tier, active.ids);
  if (rules.text.length === 0) return "";
  const ruleLine = active.extra.length > 0
    ? "本次注入规则：" + rules.ids.join(" / ") + "（其中 " + active.extra.join(" / ") + " 来自本会话的 topic 请求）。"
    : "本次注入规则：" + rules.ids.join(" / ") + "。**其余规则没有注入**：需要时用 `skill` 工具按名加载对应技能，或用 `/mc-skill rule <NN>` 临时追加。";
  const head = [
    "## MC Skill — " + tierLabel(tier) + " 规则（按当前工程档位自动注入）",
    "",
    ruleLine,
    "禁止把本档规则套到别的平台/版本上；禁止读邻档。",
  ].join("\n");
  const tail = active.skillHints.length > 0
    ? "\n\n（本次话题另建议加载技能：" + active.skillHints.join(" / ") + "）"
    : "";
  return head + "\n\n" + rules.text + tail;
}
