import { existsSync, readdirSync } from "fs";
import { join } from "path";
import { actionable, ActionCodes } from "../utils/actionable.js";
import { packNotFoundNextSteps, packNotFoundRelatedTools } from "./pack-not-found.js";
import { ownGet } from "../utils/own-record.js";
import { resolveRepoRoot } from "../utils/path.js";
import {
  inspectPack,
  listLibSkillIndex,
  listMergedPackSkills,
  listSameSeriesCandidates,
  quiltOverlayWarnings,
  readText,
  resolvePackRules,
  wrapSkillBody,
  type SkillIndexEntry,
} from "./catalog.js";

export type SessionArgs = {
  platform: string;
  minecraftVersion: string;
  topics?: string[];
  includeAllRules?: boolean;
  task?: string;
  skillNames?: string[];
  /** 测试用；生产默认知识库根。 */
  repoRoot?: string;
};

export const BASE_RULE_IDS = ["00", "01", "09"] as const;
export const ALL_RULE_IDS = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10"] as const;
export const SKILL_BODY_LIMIT = 8;
export const NEXT_READS_LIMIT = 8;

const BASE_ONLY_WARNING =
  "已加载底座规则 00/01/09；写方块/物品请立刻再 session 传 task=mc-new-block / mc-new-item（或 topics）。如涉及 GUI/网络等主题，请传 task 或 topics，否则主题规则不在上下文中。";

const BEDROCK_BASE_ONLY_WARNING =
  "已加载底座规则 00/01/09；写方块/物品请立刻再 session 传 task=mc-bedrock-block-item / mc-addon-manifest（禁止 task=mc-new-block）。基岩规则编号与 Java 00–10 无关。";

const BEDROCK_SCHEMA_WARNING =
  "基岩规则编号与 Java 00–10 无关；禁止按 Java 主题号跨平台复用 topics/task";

function missingBaseRulesWarning(missingIds: string[]): string {
  return `平台包存在但底座规则文件缺失（${missingIds.join("/")}），rules[] 未注入这些正文。不要把 session 当已加载 00/01/09。`;
}

const NO_PLATFORM_SKILLS_WARNING =
  "该档无平台 Skill 索引，session 成功不等于技能齐全；库 Skill 若有也只在显式 skillNames 时注入。请用已注入规则 + 核实表 / search_docs。";

type TaskSpec = { rules: string[]; skills: string[]; nextReads: string[]; warning?: string };

const JAVA_ONLY_TOPIC_ALIASES = new Set([
  "registry",
  "datagen",
  "client",
  "gui",
  "capability",
  "mixin",
  "mc-mixin",
  "network",
  "networking",
  "recipe",
  "loot",
  "fluid",
  "events",
  "event",
]);

const BEDROCK_TOPIC_ALIASES: Record<string, string> = {
  manifest: "01",
  resource: "02",
  "resource-pack": "02",
  behavior: "03",
  "behavior-pack": "03",
  entity: "04",
  block: "05",
  item: "05",
  molang: "06",
  script: "07",
  "script-api": "07",
  worldgen: "08",
  publish: "10",
};

const BEDROCK_TASK_SPECS: Record<string, TaskSpec> = {
  "mc-bedrock-block-item": { rules: ["05"], skills: ["mc-bedrock-block-item"], nextReads: ["mc-behavior-pack"] },
  "mc-addon-manifest": { rules: ["01"], skills: ["mc-addon-manifest"], nextReads: ["mc-addon-setup"] },
  "mc-bedrock-addon": {
    rules: ["01", "02", "03", "05"],
    skills: ["mc-addon-setup", "mc-addon-manifest"],
    nextReads: ["mc-bedrock-block-item"],
  },
  "mc-bedrock-worldgen": { rules: ["08"], skills: ["mc-bedrock-worldgen"], nextReads: [] },
  "mc-publish-addon": { rules: ["10"], skills: ["mc-publish-addon"], nextReads: [] },
  "mc-resource-pack": { rules: ["02"], skills: ["mc-resource-pack"], nextReads: [] },
  "mc-behavior-pack": { rules: ["03"], skills: ["mc-behavior-pack"], nextReads: [] },
  "mc-script-api": { rules: ["07"], skills: ["mc-script-api"], nextReads: ["mc-molang"] },
  "mc-molang": { rules: ["06"], skills: ["mc-molang"], nextReads: [] },
};

const JAVA_TASKS_ON_BEDROCK = new Set([
  "mc-new-block",
  "block",
  "mc-new-item",
  "item",
  "mc-new-entity",
  "mc-new-blockentity",
  "blockentity",
  "mc-new-gui",
  "gui",
  "mc-worldgen",
  "worldgen",
  "mc-networking",
  "network",
  "networking",
  "mc-capability",
  "capability",
  "mc-mixin",
  "mixin",
  "mc-fluid",
  "mc-datagen",
  "datagen",
]);

const BEDROCK_RULE_SKILL_HINTS: Record<string, string[]> = {
  "01": ["mc-addon-manifest"],
  "02": ["mc-resource-pack"],
  "03": ["mc-behavior-pack"],
  "04": ["mc-bedrock-entity"],
  "05": ["mc-bedrock-block-item"],
  "06": ["mc-molang"],
  "07": ["mc-script-api"],
  "08": ["mc-bedrock-worldgen"],
  "10": ["mc-publish-addon"],
};

const TOPIC_ALIASES: Record<string, string> = {
  registry: "01",
  block: "02",
  item: "03",
  entity: "04",
  events: "05",
  event: "05",
  network: "06",
  networking: "06",
  datagen: "07",
  recipe: "07",
  loot: "07",
  worldgen: "07",
  client: "08",
  gui: "10",
  fluid: "02",
  capability: "05",
};

const TASK_SPECS: Record<string, TaskSpec> = {
  "mc-new-block": { rules: ["02"], skills: ["mc-block"], nextReads: ["mc-blockentity"] },
  block: { rules: ["02"], skills: ["mc-block"], nextReads: ["mc-blockentity"] },
  "mc-new-item": { rules: ["03"], skills: ["mc-item"], nextReads: [] },
  item: { rules: ["03"], skills: ["mc-item"], nextReads: [] },
  "mc-new-entity": { rules: ["04"], skills: ["mc-entity"], nextReads: [] },
  entity: { rules: ["04"], skills: ["mc-entity"], nextReads: [] },
  "mc-new-blockentity": { rules: ["02"], skills: ["mc-blockentity"], nextReads: [] },
  blockentity: { rules: ["02"], skills: ["mc-blockentity"], nextReads: [] },
  "mc-new-gui": { rules: ["10", "08", "06"], skills: ["mc-gui"], nextReads: ["mc-networking"] },
  gui: { rules: ["10", "08", "06"], skills: ["mc-gui"], nextReads: ["mc-networking"] },
  "mc-mixin": { rules: ["09"], skills: ["mc-mixin"], nextReads: [] },
  mixin: { rules: ["09"], skills: ["mc-mixin"], nextReads: [] },
  "mc-worldgen": { rules: ["07"], skills: ["mc-worldgen"], nextReads: [] },
  worldgen: { rules: ["07"], skills: ["mc-worldgen"], nextReads: [] },
  "mc-networking": { rules: ["06"], skills: ["mc-networking"], nextReads: [] },
  network: { rules: ["06"], skills: ["mc-networking"], nextReads: [] },
  networking: { rules: ["06"], skills: ["mc-networking"], nextReads: [] },
  "mc-capability": { rules: ["05"], skills: ["mc-capability"], nextReads: [] },
  capability: { rules: ["05"], skills: ["mc-capability"], nextReads: [] },
  "mc-crash-triage": { rules: ["09"], skills: [], nextReads: [] },
  "mc-port-mod": { rules: ["00"], skills: [], nextReads: [] },
  "mc-build-mod": { rules: ["00"], skills: [], nextReads: [] },
  "mc-ingame-iterate": { rules: ["00"], skills: [], nextReads: [] },
  "mc-localize-mod": { rules: ["00"], skills: [], nextReads: [] },
  "mc-decompile-mod": { rules: ["00"], skills: [], nextReads: [] },
  "mc-config": { rules: ["00"], skills: ["mc-config"], nextReads: [] },
  "mc-gametest": { rules: ["09"], skills: ["mc-gametest"], nextReads: [] },
  "mc-publish": { rules: ["00"], skills: [], nextReads: [] },
  "mc-recipe-data": { rules: ["07"], skills: ["mc-recipe", "mc-loottable", "mc-advancement"], nextReads: [] },
  "mc-audio-vfx": { rules: ["00"], skills: ["mc-sound", "mc-particle"], nextReads: [] },
  "mc-commands": { rules: [], skills: ["mc-command"], nextReads: ["mc-command"] },
  "mc-dimension-structure": { rules: ["07"], skills: ["mc-dimension", "mc-structure"], nextReads: ["mc-worldgen"] },
  "mc-access": {
    rules: [],
    skills: [],
    nextReads: [],
    warning: "无独立 00–10 规则。Access Transformer / Access Widener 请用 validate_at / validate_aw，不要默写邻档 AT。",
  },
  "mc-bedrock-addon": {
    rules: [],
    skills: [],
    nextReads: [],
    warning:
      "mc-bedrock-addon 不灌 Java 规则 02–10；请改用 search_bedrock_docs / validate_addon_manifest / validate_bp_json。",
  },
  "mc-fluid": { rules: ["02"], skills: ["mc-fluid"], nextReads: [] },
  "mc-enchant-potion": { rules: ["03"], skills: ["mc-enchantment", "mc-potion", "mc-effect"], nextReads: [] },
  "mc-energy": { rules: ["05"], skills: ["mc-energy", "mc-capability"], nextReads: [] },
  "mc-creative-tags": { rules: ["03"], skills: [], nextReads: [] },
  "mc-villager": { rules: ["04"], skills: ["mc-villager"], nextReads: [] },
  villager: { rules: ["04"], skills: ["mc-villager"], nextReads: [] },
  "mc-multiblock": { rules: ["02", "07"], skills: ["mc-multiblock"], nextReads: [] },
  multiblock: { rules: ["02", "07"], skills: ["mc-multiblock"], nextReads: [] },
  "mc-ai": { rules: ["04"], skills: ["mc-ai"], nextReads: [] },
  ai: { rules: ["04"], skills: ["mc-ai"], nextReads: [] },
  "mc-kotlin": { rules: ["00"], skills: [], nextReads: [] },
  "mc-jei": { rules: [], skills: ["mc-compat-jei"], nextReads: [] },
  "mc-ci-publish-extra": { rules: ["00"], skills: [], nextReads: [] },
  "mc-setup-env": { rules: ["00"], skills: [], nextReads: [] },
  "mc-full-mod": { rules: [...ALL_RULE_IDS], skills: [], nextReads: [] },
};

function isTaskSpec(v: unknown): v is TaskSpec {
  return Boolean(v) && typeof v === "object" && Array.isArray((v as TaskSpec).rules);
}

const RULE_SKILL_HINTS: Record<string, string[]> = {
  "02": ["mc-block", "mc-blockentity", "mc-fluid"],
  "03": ["mc-item"],
  "04": ["mc-entity", "mc-renderer"],
  "05": ["mc-events", "mc-capability"],
  "06": ["mc-networking"],
  "07": ["mc-datagen", "mc-recipe", "mc-loottable", "mc-worldgen"],
  "08": ["mc-renderer"],
  "10": ["mc-gui", "mc-networking"],
};

export function canonicalSkillName(raw: string): string {
  let s = String(raw ?? "").trim().toLowerCase();
  if (!s) return "";
  if (!s.startsWith("mc-")) s = `mc-${s}`;
  return s;
}

function uniqueIds(ids: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const id of ids) {
    if (seen.has(id)) continue;
    seen.add(id);
    out.push(id);
  }
  return out.sort((a, b) => Number(a) - Number(b));
}

function lookupTask(raw?: string, platform?: string): { spec: TaskSpec | null; key: string; warning?: string } {
  const key = String(raw ?? "").trim().toLowerCase();
  if (!key) return { spec: null, key: "" };
  const p = String(platform ?? "").toLowerCase();
  if (p === "bedrock") {
    if (JAVA_TASKS_ON_BEDROCK.has(key)) {
      return {
        spec: null,
        key,
        warning: `Java task "${raw}" 在基岩不灌规则（不会注入 02-resource-pack 当方块教程）。请用 task=mc-bedrock-addon / mc-bedrock-block-item。${BEDROCK_SCHEMA_WARNING}`,
      };
    }
    const bedrockSpec = ownGet(BEDROCK_TASK_SPECS, key);
    if (isTaskSpec(bedrockSpec)) return { spec: bedrockSpec, key };
    return {
      spec: null,
      key,
      warning: `未知基岩 task "${raw}"，已忽略。请用 mc-bedrock-addon / mc-bedrock-block-item / mc-addon-manifest。${BEDROCK_SCHEMA_WARNING}`,
    };
  }
  if (key === "mc-kotlin" || key === "kotlin") {
    const p = String(platform ?? "").toLowerCase();
    const skills =
      p === "forge" || p === "neoforge"
        ? ["mc-kotlin-for-forge"]
        : p === "fabric" || p === "quilt"
          ? ["mc-fabric-language-kotlin"]
          : [];
    return { spec: { rules: ["00"], skills, nextReads: [] }, key: "mc-kotlin" };
  }
  const spec = ownGet(TASK_SPECS, key);
  if (!isTaskSpec(spec)) {
    return { spec: null, key, warning: `未知 task "${raw}"，已忽略（规则仍用底座 00/01/09）。` };
  }
  return { spec, key };
}

/** 只解析 topics：规则号 + mixin 这类 skill hint。禁止 padStart 乱切。 */
export function parseTopicTokens(topics?: string[], platform?: string): {
  ruleIds: string[];
  skillHints: string[];
  warnings: string[];
} {
  const ruleIds: string[] = [];
  const skillHints: string[] = [];
  const warnings: string[] = [];
  const seenRule = new Set<string>();
  const seenHint = new Set<string>();
  const isBedrock = String(platform ?? "").toLowerCase() === "bedrock";
  for (const t of topics ?? []) {
    const raw = String(t).trim();
    if (!raw) continue;
    const lower = raw.toLowerCase();
    if (lower === "mixin" || lower === "mc-mixin") {
      if (isBedrock) {
        warnings.push(`Java 主题 mixin 在基岩拒绝。${BEDROCK_SCHEMA_WARNING}`);
        continue;
      }
      const hint = "mc-mixin";
      if (!seenHint.has(hint)) {
        seenHint.add(hint);
        skillHints.push(hint);
      }
      continue;
    }
    let id: string | undefined;
    if (/^\d{1,2}$/.test(raw)) {
      const n = Number(raw);
      if (n < 0 || n > 10) {
        warnings.push(`伪规则 "${raw}" 已拒绝（仅 00–10）`);
        continue;
      }
      id = String(n).padStart(2, "0");
    } else {
      const num = raw.match(/(^|\D)(0\d|10)(\D|$)/);
      if (isBedrock && JAVA_ONLY_TOPIC_ALIASES.has(lower) && !ownGet(BEDROCK_TOPIC_ALIASES, lower)) {
        warnings.push(`Java 主题别名 "${raw}" 在基岩拒绝（不要静默映射到错误号）。${BEDROCK_SCHEMA_WARNING}`);
        continue;
      }
      const alias = ownGet(isBedrock ? BEDROCK_TOPIC_ALIASES : TOPIC_ALIASES, lower);
      id = num ? num[2] : alias;
    }
    if (!id) {
      warnings.push(`无法解析 topics 项 "${raw}"，已跳过（不会截成两字符）`);
      continue;
    }
    if (seenRule.has(id)) continue;
    seenRule.add(id);
    ruleIds.push(id);
  }
  return { ruleIds, skillHints, warnings };
}

/** includeAll → 00–10；否则 BASE ∪ extra ∪ topics。未知 topic 仍保留底座。 */
export function resolveTopicIds(
  topics?: string[],
  includeAll?: boolean,
  extraRuleIds?: string[],
  platform?: string,
): { ids: string[]; warnings: string[]; skillHints: string[] } {
  const parsed = parseTopicTokens(topics, platform);
  if (includeAll) {
    return { ids: [...ALL_RULE_IDS], warnings: parsed.warnings, skillHints: parsed.skillHints };
  }
  return {
    ids: uniqueIds([...BASE_RULE_IDS, ...(extraRuleIds ?? []), ...parsed.ruleIds]),
    warnings: parsed.warnings,
    skillHints: parsed.skillHints,
  };
}

export { quiltOverlayWarnings };

function findSkill(index: SkillIndexEntry[], name: string): SkillIndexEntry | undefined {
  const want = canonicalSkillName(name);
  return index.find((s) => canonicalSkillName(s.name) === want);
}

function verifiedApiNotes(packDir: string): Array<{ path: string; excerpt: string }> {
  const common = join(packDir, "knowledge", "common");
  if (!existsSync(common)) return [];
  let names: string[] = [];
  try {
    names = readdirSync(common);
  } catch {
    return [];
  }
  return names
    .filter((n) => /verified-api/i.test(n) && n.endsWith(".md"))
    .map((n) => {
      const abs = join(common, n);
      const text = readText(abs, 1200);
      return { path: abs.replace(/\\/g, "/"), excerpt: text.split("\n").slice(0, 20).join("\n") };
    });
}

export function sessionPlatformPack(args: SessionArgs) {
  const platform = String(args.platform ?? "").trim().toLowerCase();
  const minecraftVersion = String(args.minecraftVersion ?? "").trim();
  if (!platform || !minecraftVersion) {
    return {
      ok: false,
      action: actionable("INVALID_INPUT", "session 需要 platform 与 minecraftVersion（不依赖项目根）。", [
        "传入 platform + minecraftVersion",
        "activate_platform_pack action=list 可查看已建档",
      ]),
    };
  }
  const repoRoot = args.repoRoot ?? resolveRepoRoot();
  const inspected = inspectPack(platform, minecraftVersion, repoRoot);
  if (!inspected || inspected.status === "draft") {
    const draft = inspected?.status === "draft";
    const metaUnreadable = inspected?.metaUnreadable === true;
    const candidates = listSameSeriesCandidates(platform, minecraftVersion);
    const ask =
      !draft && candidates.length
        ? `同系列已建档：${candidates.join(", ")}。请询问用户选哪一档，禁止静默折叠。`
        : undefined;
    return {
      ok: false,
      candidates: candidates.length ? candidates : undefined,
      action: actionable(
        "PACK_NOT_FOUND",
        metaUnreadable
          ? `pack.meta.json 无法解析`
          : draft
            ? `${platform} ${minecraftVersion} 规则包 pack-status=draft，禁止 session/write（PACK_NOT_FOUND）。ok≠已加载规则。`
            : `没有 ${platform} ${minecraftVersion} 的规则树，禁止读邻档 00–10。ok≠已加载规则。${ask ? ask : ""}`,
        packNotFoundNextSteps(platform, minecraftVersion, ask),
        packNotFoundRelatedTools(platform),
      ),
    };
  }
  const pack = inspected.pack;
  const warnings: string[] = [];
  if (platform === "fabric" && minecraftVersion !== pack.minecraftVersion) {
    warnings.push(
      `查 Fabric 文档请用 version=${pack.minecraftVersion}，不要用 minecraftVersion=${minecraftVersion}`,
    );
  }
  if (platform === "neoforge" && minecraftVersion !== pack.minecraftVersion && /^26\.1/.test(minecraftVersion)) {
    warnings.push(
      `NeoForge ${minecraftVersion} 折叠到知识档 ${pack.minecraftVersion}；不为 26.1.x 单造规则树。`,
    );
  }
  const includeAll = args.includeAllRules === true;
  const taskLookup = lookupTask(args.task, platform);
  if (taskLookup.warning) warnings.push(taskLookup.warning);
  const taskSpec = taskLookup.spec;
  if (taskSpec?.warning) warnings.push(taskSpec.warning);
  const extraRules = taskSpec?.rules ?? [];
  const { ids, warnings: topicWarnings, skillHints } = resolveTopicIds(args.topics, includeAll, extraRules, platform);
  warnings.push(...topicWarnings);

  const resolved = resolvePackRules({
    platform: pack.platform,
    packDir: pack.packDir,
    packVersion: pack.minecraftVersion,
    ruleIds: ids,
    repoRoot,
  });
  const overlay = resolved.overlay;
  warnings.push(...resolved.warnings);
  const ruleBodies = resolved.ruleBodies.map(({ id, fileName, source, text }) => ({
    id,
    fileName,
    source,
    text,
  }));
  for (const id of ids) {
    if (ruleBodies.some((r) => r.id === id)) continue;
    if ((BASE_RULE_IDS as readonly string[]).includes(id)) continue;
    warnings.push(`请求的规则 ${id} 在本档不存在，已跳过（不会静默丢）`);
  }

  const { skills, donorWarning, diverged } = listMergedPackSkills(
    pack.platform,
    pack.minecraftVersion,
    pack.packDir,
    overlay,
    repoRoot,
  );
  if (donorWarning) warnings.unshift(donorWarning);
  for (const d of diverged) {
    warnings.push(
      `Skill ${d.name} 多宿主内容不一致（canonical sha256 ${d.canonicalHash}；${d.others.map((o) => `${o.rel}:${o.hash}`).join(", ")}）`,
    );
  }
  const libSkills = listLibSkillIndex(platform, pack.minecraftVersion, repoRoot);

  if (skills.length === 0) warnings.push(NO_PLATFORM_SKILLS_WARNING);

  const extraRuleSet = new Set(extraRules);
  for (const id of parseTopicTokens(args.topics, platform).ruleIds) extraRuleSet.add(id);

  const candidateNames: string[] = [];
  const seenCand = new Set<string>();
  const pushCand = (raw: string) => {
    const n = canonicalSkillName(raw);
    if (!n || seenCand.has(n)) return;
    seenCand.add(n);
    candidateNames.push(n);
  };
  for (const n of args.skillNames ?? []) pushCand(n);
  for (const n of taskSpec?.skills ?? []) pushCand(n);

  const skillBodies: Array<{ name: string; absPath: string; relPosix: string; text: string }> = [];
  const inBodies = new Set<string>();
  let truncated = false;
  for (const name of candidateNames) {
    const hit = findSkill(skills, name) ?? findSkill(libSkills, name);
    if (!hit) {
      warnings.push(`没有名为 ${name} 的 Skill（平台包或已按版本过滤的库索引），未注入正文。`);
      continue;
    }
    if (skillBodies.length >= SKILL_BODY_LIMIT) {
      truncated = true;
      continue;
    }
    try {
      skillBodies.push({
        name: hit.name,
        absPath: hit.absPath,
        relPosix: hit.relPosix,
        text: wrapSkillBody(hit, readText(hit.absPath)),
      });
      inBodies.add(canonicalSkillName(hit.name));
    } catch (err) {
      warnings.push(
        `读取 Skill 正文失败: ${hit.name}（${hit.relPosix}）：${(err as Error).message}。已跳过，索引仍可用。`,
      );
    }
  }
  if (truncated) {
    warnings.push(`skillBodies 上限 ${SKILL_BODY_LIMIT}（去重后的正文条数），多余候选已截断。`);
  }

  const nextHintNames: string[] = [];
  const seenHint = new Set<string>();
  const pushHint = (raw: string) => {
    const n = canonicalSkillName(raw);
    if (!n || seenHint.has(n) || inBodies.has(n)) return;
    seenHint.add(n);
    nextHintNames.push(n);
  };
  for (const h of skillHints) pushHint(h);
  for (const h of taskSpec?.nextReads ?? []) pushHint(h);
  for (const id of extraRuleSet) {
    for (const h of ownGet(platform === "bedrock" ? BEDROCK_RULE_SKILL_HINTS : RULE_SKILL_HINTS, id) ?? []) pushHint(h);
  }
  const libNames = new Set(libSkills.map((s) => canonicalSkillName(s.name)));
  const nextReads: Array<{ name: string; absPath: string; relPosix: string; description: string }> = [];
  for (const n of nextHintNames) {
    if (nextReads.length >= NEXT_READS_LIMIT) break;
    if (libNames.has(n) && !findSkill(skills, n)) continue;
    const hit = findSkill(skills, n);
    if (!hit) continue;
    nextReads.push({
      name: hit.name,
      absPath: hit.absPath,
      relPosix: hit.relPosix,
      description: hit.description,
    });
  }

  let rulesMode: "base" | "extended" | "all" = "base";
  if (includeAll) rulesMode = "all";
  else {
    const expanded = ids.length > BASE_RULE_IDS.length;
    const validTask = Boolean(taskSpec);
    const validTopic = parseTopicTokens(args.topics, platform).ruleIds.length > 0 || skillHints.length > 0;
    if ((validTask || validTopic) && expanded) rulesMode = "extended";
    else rulesMode = "base";
  }
  const injectedIds = new Set(ruleBodies.map((r) => r.id));
  const missingBase = BASE_RULE_IDS.filter((id) => !injectedIds.has(id));
  if (missingBase.length) {
    return {
      ok: false,
      dest: "session",
      platform: pack.platform,
      minecraftVersion,
      knowledgeVersion: pack.minecraftVersion,
      packDir: pack.packDir.replace(/\\/g, "/"),
      rules: ruleBodies,
      rulesMode,
      warnings: [missingBaseRulesWarning(missingBase)],
      action: actionable(
        ActionCodes.PACK_INCOMPLETE,
        `平台包存在但底座规则文件缺失（${missingBase.join("/")}）。不要当 session 成功，也不是 PACK_NOT_FOUND。`,
        [
          "补齐该档 .cursor/rules 的 00/01/09，或换 list_*_versions 已建档版本",
          "禁止用邻档规则顶上",
        ],
        ["list_fabric_versions", "list_neoforge_versions", "list_forge_versions", "activate_platform_pack"],
      ),
    };
  }
  if (platform === "bedrock") warnings.push(BEDROCK_SCHEMA_WARNING);
  if (rulesMode === "base" && !includeAll) {
    warnings.push(platform === "bedrock" ? BEDROCK_BASE_ONLY_WARNING : BASE_ONLY_WARNING);
  }

  return {
    ok: true,
    dest: "session",
    platform: pack.platform,
    minecraftVersion,
    knowledgeVersion: pack.minecraftVersion,
    packDir: pack.packDir.replace(/\\/g, "/"),
    ruleSchema: platform === "bedrock" ? "bedrock" : "java",
    agents: readText(pack.agentsPath),
    rules: ruleBodies,
    ruleIndex: resolved.localIndex,
    overlay,
    verifiedApi: verifiedApiNotes(pack.packDir),
    skills,
    libSkills,
    skillBodies,
    nextReads,
    baseRuleIds: [...BASE_RULE_IDS],
    ruleIds: ids,
    rulesMode,
    warnings,
    libSkillsNote:
      "库 Skill 只在 libSkills[]，不进入 skills[] 与 nextReads。须读 libSkills[]；只有显式 skillNames 才注入库正文（计入 skillBodies 上限 8）。不确定先读 knowledge/libs/all-platforms/mc-lib-catalog/SKILL.md。",
    includeAllRules: includeAll,
    topicWarnings: topicWarnings.length ? topicWarnings : undefined,
    next:
      rulesMode === "base" && !includeAll
        ? {
            tool: "activate_platform_pack",
            arguments: {
              action: "session",
              platform: pack.platform,
              minecraftVersion,
              task: platform === "bedrock" ? "mc-bedrock-block-item" : "mc-new-block",
            },
          }
        : undefined,
    contextWarning: includeAll
      ? "includeAllRules=true 会灌入 00–10 全文，上下文体积大；默认只要 00+01+09。"
      : undefined,
    ideLoadNotes:
      "各 IDE 扫不到知识库里嵌套的 forge/<ver>/.cursor（打开的是用户模组工程）。会话包只服务当前对话；要工程内常驻请 activate_platform_pack action=write（hosts 必填）。不要把规则拷进 MC_skill 仓库根。",
  };
}
