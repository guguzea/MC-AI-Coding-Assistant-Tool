/**
 * 知识库桥接层：在进程内复用 MC_skill 仓库的编译产物（mcp-server/dist/platform-pack/*）——
 * 平台检测 / 档位折叠 / donor 合并 / 规则与技能清单**零重写**。
 *
 * 纪律（与仓库铁律一致）：
 *   · **只读**仓库：本模块不写任何仓库文件，也不调用任何写盘 API。
 *   · dist 是构建产物 ⇒ 缺失/陈旧时降级为「空候选 + complete:false」，不把异常抛给模型。
 *
 * ⚠️ 为什么全部是 **sync** 实现：
 *   `ctx.systemPrompt.section({text})` 的 text **必须同步返回字符串** ——
 *   dsh-system-prompt 的组装是 `text: typeof section.text === "function" ? section.text(context) : section.text`，
 *   随后 `renderPrompt` 做 `filter((text) => text.length > 0)`。返回 Promise 时没有 length ⇒ 被静默丢弃，
 *   规则永远进不了 prompt 且**不报错**。⇒ 模块在 apply() 阶段预加载（一次 await），之后全同步取数。
 *
 * 依赖的 dist 导出（已核实签名，见 mcp-server/dist/platform-pack/catalog.d.ts）：
 *   detect.js     : detectModProject({projectPath})
 *   catalog.js    : inspectPack / resolvePackRules / listMergedPackSkills / readText
 *                   wrapSkillBody / isMcSkillKnowledgeRepo
 */
import { existsSync, readdirSync, statSync } from "node:fs";
import { pathToFileURL } from "node:url";

/** 默认挂载的规则号（与 MCP session 的 BASE_RULE_IDS 同口径）。 */
export const BASE_RULE_IDS = ["00", "01", "09"];

/** 规则号 → 便于手敲的短名。只用于 /mc-skill rule <名字> 的输入归一化，不是判据来源。 */
const RULE_ID_NAMES = {
  "00": "project-setup",
  "01": "registry",
  "02": "block",
  "03": "item",
  "04": "entity",
  "05": "events",
  "06": "networking",
  "07": "datagen",
  "08": "client-server",
  "09": "anti-patterns",
  "10": "gui",
};

/** 预加载后的 dist 模块集合；null = 尚未 prepare 或 prepare 失败。 */
let loaded = null;
/** 规则正文缓存：key = packDir + "|" + ids，value = {stamp, text, ids, warnings}。 */
const rulesCache = new Map();

function distDir(repoRoot) {
  return repoRoot.replace(/\\/g, "/") + "/mcp-server/dist";
}

function errText(error) {
  return error && error.message ? error.message : String(error);
}

/**
 * 预加载并校验 dist 导出面（apply 时调用一次）。
 * @returns {{ok: true, repoRoot: string} | {ok: false, reason: string}}
 */
export async function prepare(repoRoot) {
  loaded = null;
  rulesCache.clear();
  const base = distDir(repoRoot) + "/platform-pack";
  if (!existsSync(base + "/detect.js")) {
    return { ok: false, reason: "mcp-server/dist 未构建：cd mcp-server && npm run build" };
  }
  let detect, catalog, session;
  try {
    [detect, catalog, session] = await Promise.all([
      import(pathToFileURL(base + "/detect.js").href),
      import(pathToFileURL(base + "/catalog.js").href),
      // session.js 是可选能力：缺了只是没有 topics 解析，不影响其它功能。
      import(pathToFileURL(base + "/session.js").href).catch(() => undefined),
    ]);
  } catch (error) {
    return { ok: false, reason: "dist 加载失败：" + errText(error) };
  }
  const required = [
    ["detect.js", detect, ["detectModProject"]],
    ["catalog.js", catalog, ["inspectPack", "resolvePackRules", "listMergedPackSkills", "readText", "wrapSkillBody"]],
  ];
  for (const [label, mod, keys] of required) {
    for (const key of keys) {
      if (typeof mod[key] !== "function") {
        return { ok: false, reason: "mc-skill: " + label + " 缺少导出 " + key + "（dist 陈旧？先 npm run build）" };
      }
    }
  }
  loaded = { repoRoot, detect, catalog, session };
  return { ok: true, repoRoot };
}

/** 是否已完成预加载。 */
export function isReady() {
  return loaded !== null;
}

/**
 * 按 cwd 解析「当前该用哪一档」（同步）。
 * 解析链与 MCP 的 detect_mod_project 完全一致（同一份 dist 实现）：
 *   detectModProject({projectPath: cwd}) → knowledgeVersion 折叠 → inspectPack 判 ready/draft
 * @returns {{status: string, platform?: string, minecraftVersion?: string, packDir?: string, note?: string}}
 */
export function resolveTierSync(cwd) {
  if (loaded === null) return { status: "norepo", note: "dist 未预加载" };
  let det;
  try {
    det = loaded.detect.detectModProject({ projectPath: cwd });
  } catch (error) {
    return { status: "unknown", note: "检测失败：" + errText(error) };
  }
  if (!det || det.ok !== true) {
    const code = det && det.action && det.action.code ? det.action.code : "DETECT_FAILED";
    return { status: "unknown", note: "未判定为模组工程（" + code + "）" };
  }
  const platform = String(det.platform || "");
  const version = String(det.knowledgeVersion || det.minecraftVersion || "");
  if (!det.packFound) {
    const cands = Array.isArray(det.candidates) && det.candidates.length > 0
      ? "（同系列已建档：" + det.candidates.join(", ") + "）"
      : "";
    return { status: "nopack", platform, minecraftVersion: version, note: platform + " " + version + " 本仓库无规则树" + cands };
  }
  let inspected;
  try {
    inspected = loaded.catalog.inspectPack(platform, version);
  } catch {
    inspected = null;
  }
  if (!inspected) {
    return { status: "nopack", platform, minecraftVersion: version, note: platform + " " + version + " inspectPack 未命中" };
  }
  const packDir = inspected.pack.packDir;
  if (inspected.status !== "ready") {
    return { status: "draft", platform, minecraftVersion: version, packDir, note: platform + " " + version + " 规则包 pack-status=draft，禁止注入" };
  }
  return { status: "ok", platform, minecraftVersion: version, packDir };
}

/**
 * 取某档的 skill 索引（含 donor / overlay 合并，与 MCP session 同源）。同步。
 */
export function listTierSkillsSync(tier) {
  if (loaded === null || tier.status !== "ok" || !tier.platform || !tier.minecraftVersion || !tier.packDir) return [];
  const catalog = loaded.catalog;
  const overlay = catalog.resolvePackRules({
    platform: tier.platform,
    packDir: tier.packDir,
    packVersion: tier.minecraftVersion,
    ruleIds: [],
    repoRoot: loaded.repoRoot,
  }).overlay;
  const merged = catalog.listMergedPackSkills(tier.platform, tier.minecraftVersion, tier.packDir, overlay, loaded.repoRoot);
  return merged.skills.map((s) => ({
    name: s.name,
    description: s.description,
    absPath: s.absPath,
    relPosix: s.relPosix,
    skillBanner: s.skillBanner,
    mappingNote: s.mappingNote,
    source: s.source,
  }));
}

function rulesStamp(packDir) {
  // 用规则目录自身 + 11 个 .mdc 的 mtime 组成指纹：任一规则被改就重算，不改就一直命中缓存。
  try {
    const dir = packDir + "/.cursor/rules";
    const parts = [String(statSync(dir).mtimeMs)];
    for (const entry of readdirSync(dir)) {
      if (!entry.endsWith(".mdc")) continue;
      parts.push(entry + ":" + String(statSync(dir + "/" + entry).mtimeMs));
    }
    return parts.join("|");
  } catch {
    return "0";
  }
}

/**
 * 取某档的规则正文（默认 00/01/09）。同步 + 带缓存（按 packDir 的 mtime 失效）。
 */
export function readTierRulesSync(tier, ruleIds) {
  const ids = Array.isArray(ruleIds) && ruleIds.length > 0 ? ruleIds : BASE_RULE_IDS;
  if (loaded === null || tier.status !== "ok" || !tier.platform || !tier.minecraftVersion || !tier.packDir) {
    return { text: "", ids: [], warnings: [tier.note || "无可用档位"] };
  }
  const key = tier.packDir + "|" + ids.join(",");
  const stamp = rulesStamp(tier.packDir);
  const hit = rulesCache.get(key);
  if (hit !== void 0 && hit.stamp === stamp) return hit.value;
  const resolved = loaded.catalog.resolvePackRules({
    platform: tier.platform,
    packDir: tier.packDir,
    packVersion: tier.minecraftVersion,
    ruleIds: ids,
    repoRoot: loaded.repoRoot,
  });
  const gotIds = resolved.ruleBodies.map((r) => r.id);
  const parts = resolved.ruleBodies.map((r) => "### " + r.fileName.replace(/\.mdc$/, "") + "\n\n" + r.text);
  const value = {
    text: parts.join("\n\n---\n\n"),
    ids: gotIds,
    warnings: Array.isArray(resolved.warnings) ? resolved.warnings : [],
  };
  rulesCache.set(key, { stamp, value });
  return value;
}

/**
 * 取某档可用的**库模组 skill**（knowledge/libs 源稿，按平台分组过滤）。
 * 这些是「源稿即用」的一类：不落平台树，用 `listLibSkillIndex` 按平台/版本解析。
 * 同步。
 */
export function listTierLibSkillsSync(tier) {
  if (loaded === null || tier.status !== "ok" || !tier.platform || !tier.minecraftVersion) return [];
  if (typeof loaded.catalog.listLibSkillIndex !== "function") return [];
  try {
    return loaded.catalog.listLibSkillIndex(tier.platform, tier.minecraftVersion, loaded.repoRoot).map((s) => ({
      name: s.name,
      description: s.description,
      absPath: s.absPath,
      relPosix: s.relPosix,
      skillBanner: s.skillBanner,
      mappingNote: s.mappingNote,
      source: s.source,
      lib: true,
    }));
  } catch {
    return [];
  }
}

/**
 * 把 topics 词（如 `["02","gui","mixin"]`）解析成规则号集合。
 *
 * 复用仓库自己的 `resolveTopicIds`（与 MCP `activate_platform_pack session` 同一份判据），
 * **不在插件里重写 topic 表** —— 否则两份表迟早漂移。
 * @returns {{ids: string[], warnings: string[], skillHints: string[]}}
 */
export function resolveRuleIdsForTopicsSync(topics) {
  const fallback = { ids: [...BASE_RULE_IDS], warnings: [], skillHints: [] };
  if (loaded === null || loaded.session === undefined) return fallback;
  const fn = loaded.session.resolveTopicIds;
  if (typeof fn !== "function") return fallback;
  try {
    const r = fn(topics, false);
    return {
      ids: Array.isArray(r.ids) && r.ids.length > 0 ? r.ids : [...BASE_RULE_IDS],
      warnings: Array.isArray(r.warnings) ? r.warnings : [],
      skillHints: Array.isArray(r.skillHints) ? r.skillHints : [],
    };
  } catch {
    return fallback;
  }
}

/** 全部规则号（供 `/mc-skill rule all` 之类用）。 */
export function allRuleIdsSync() {
  if (loaded !== null && loaded.session !== undefined && Array.isArray(loaded.session.ALL_RULE_IDS)) {
    return [...loaded.session.ALL_RULE_IDS];
  }
  return ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10"];
}

/** 归一化单个规则号：接受 `2` / `02` / `02-block` / `block`。 */
export function normalizeRuleIdSync(raw) {
  const all = allRuleIdsSync();
  const token = String(raw || "").trim().toLowerCase();
  if (token.length === 0) return "";
  if (token === "all") return "all";
  const twoDigit = /^(\d{1,2})$/.exec(token);
  if (twoDigit) {
    const id = twoDigit[1].padStart(2, "0");
    return all.includes(id) ? id : "";
  }
  // 形如 02-block / 02_block / block：取能对上前缀的那个 id
  const lead = /^(\d{1,2})[-_]/.exec(token);
  if (lead) {
    const id = lead[1].padStart(2, "0");
    if (all.includes(id)) return id;
  }
  const byName = all.find((id) => {
    const name = RULE_ID_NAMES[id];
    return name !== undefined && name === token;
  });
  return byName ?? "";
}

/** 读指定规则号的正文（同步，走同一份缓存）。 */
export function readTierRulesByIdsSync(tier, ruleIds) {
  return readTierRulesSync(tier, ruleIds);
}

/** 读一个 skill 正文并按 donor/overlay 口径包裹（与 MCP session 的 skillBodies 同形）。同步。 */
export function readSkillBodySync(skill) {
  if (loaded === null) return "";
  const raw = loaded.catalog.readText(skill.absPath);
  return loaded.catalog.wrapSkillBody(skill, raw);
}

/** 知识库根判定（防止把用户模组工程当知识库根）。 */
export function isKnowledgeRootSync(repoRoot) {
  if (loaded === null) return false;
  try {
    return typeof loaded.catalog.isMcSkillKnowledgeRepo === "function" ? loaded.catalog.isMcSkillKnowledgeRepo(repoRoot) : false;
  } catch {
    return false;
  }
}
