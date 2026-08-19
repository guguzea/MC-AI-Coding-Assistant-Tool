import { existsSync, readdirSync } from "fs";
import { join } from "path";
import { actionable } from "../utils/actionable.js";
import { docsToolForPlatform } from "../loader-api/keys.js";
import { resolveRepoRoot } from "../utils/path.js";
import {
  fabricRulesOverlay,
  inspectPack,
  listLibSkillIndex,
  listMergedPackSkills,
  listRuleFiles,
  listSameSeriesCandidates,
  wrapDonorSkillBody,
  readText,
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
export const SKILL_BODY_LIMIT = 6;
export const NEXT_READS_LIMIT = 8;

const BASE_ONLY_WARNING =
  "仅注入底座 00/01/09；做方块/GUI/实体等请传有效 task 或 topics。ok=true 表示平台包可用，但规则未按任务扩展。";

const NO_PLATFORM_SKILLS_WARNING =
  "该档无平台 Skill 索引，session 成功不等于技能齐全；库 Skill 若有也只在显式 skillNames 时注入。请用已注入规则 + 核实表 / search_docs。";

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

type TaskSpec = { rules: string[]; skills: string[]; nextReads: string[] };

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
  "mc-mixin": { rules: [], skills: ["mc-mixin"], nextReads: [] },
  mixin: { rules: [], skills: ["mc-mixin"], nextReads: [] },
  "mc-worldgen": { rules: ["07"], skills: ["mc-worldgen"], nextReads: [] },
  worldgen: { rules: ["07"], skills: ["mc-worldgen"], nextReads: [] },
  "mc-networking": { rules: ["06"], skills: ["mc-networking"], nextReads: [] },
  network: { rules: ["06"], skills: ["mc-networking"], nextReads: [] },
  networking: { rules: ["06"], skills: ["mc-networking"], nextReads: [] },
  "mc-capability": { rules: ["05"], skills: ["mc-capability"], nextReads: [] },
  capability: { rules: ["05"], skills: ["mc-capability"], nextReads: [] },
};

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

function lookupTask(raw?: string): { spec: TaskSpec | null; key: string; warning?: string } {
  const key = String(raw ?? "").trim().toLowerCase();
  if (!key) return { spec: null, key: "" };
  const spec = TASK_SPECS[key];
  if (!spec) {
    return { spec: null, key, warning: `未知 task "${raw}"，已忽略（规则仍用底座 00/01/09）。` };
  }
  return { spec, key };
}

/** 只解析 topics：规则号 + mixin 这类 skill hint。禁止 padStart 乱切。 */
export function parseTopicTokens(topics?: string[]): {
  ruleIds: string[];
  skillHints: string[];
  warnings: string[];
} {
  const ruleIds: string[] = [];
  const skillHints: string[] = [];
  const warnings: string[] = [];
  const seenRule = new Set<string>();
  const seenHint = new Set<string>();
  for (const t of topics ?? []) {
    const raw = String(t).trim();
    if (!raw) continue;
    const lower = raw.toLowerCase();
    if (lower === "mixin" || lower === "mc-mixin") {
      const hint = "mc-mixin";
      if (!seenHint.has(hint)) {
        seenHint.add(hint);
        skillHints.push(hint);
      }
      continue;
    }
    const num = raw.match(/(^|\D)(\d{2})(\D|$)/);
    const alias = TOPIC_ALIASES[lower];
    const id = num ? num[2] : alias;
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
): { ids: string[]; warnings: string[]; skillHints: string[] } {
  const parsed = parseTopicTokens(topics);
  if (includeAll) {
    return { ids: [...ALL_RULE_IDS], warnings: parsed.warnings, skillHints: parsed.skillHints };
  }
  return {
    ids: uniqueIds([...BASE_RULE_IDS, ...(extraRuleIds ?? []), ...parsed.ruleIds]),
    warnings: parsed.warnings,
    skillHints: parsed.skillHints,
  };
}

export function quiltOverlayWarnings(overlay: { status: string; note: string } | undefined): string[] {
  if (!overlay || overlay.status === "ok") return [];
  return [
    `无同版 Fabric overlay（${overlay.status}）：02–10 可能未注入、skills[] 可能为空。${overlay.note} 改口 search_docs(platform=quilt) / search_fabric_docs，禁止邻版 Fabric。不要把 ok 理解成 Quilt 开发包齐全。`,
  ];
}

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
        draft
          ? `${platform} ${minecraftVersion} 规则包 pack-status=draft，禁止 session/write（PACK_NOT_FOUND）。`
          : `没有 ${platform} ${minecraftVersion} 的规则树，禁止读邻档 00–10。${ask ? ask : ""}`,
        [`改用 ${docsToolForPlatform(platform)}`, ...(ask ? [ask] : [])],
        [docsToolForPlatform(platform)],
      ),
    };
  }
  const pack = inspected.pack;
  const warnings: string[] = [];
  if (platform === "fabric" && minecraftVersion !== pack.minecraftVersion) {
    warnings.push(
      `查 Fabric 文档请用 knowledgeVersion=${pack.minecraftVersion}，不要用 minecraftVersion=${minecraftVersion}`,
    );
  }
  const includeAll = args.includeAllRules === true;
  const taskLookup = lookupTask(args.task);
  if (taskLookup.warning) warnings.push(taskLookup.warning);
  const taskSpec = taskLookup.spec;
  const extraRules = taskSpec?.rules ?? [];
  const { ids, warnings: topicWarnings, skillHints } = resolveTopicIds(args.topics, includeAll, extraRules);
  warnings.push(...topicWarnings);

  const rules = listRuleFiles(pack.packDir);
  const overlay =
    pack.platform === "quilt" ? fabricRulesOverlay(pack.minecraftVersion, repoRoot) : undefined;
  warnings.push(...quiltOverlayWarnings(overlay));

  const ruleBodies: Array<{ id: string; fileName: string; source: string; text: string }> = [];
  for (const id of ids) {
    const local = rules.find((r) => r.id === id);
    if (local) {
      ruleBodies.push({
        id,
        fileName: local.fileName,
        source: pack.packDir.replace(/\\/g, "/"),
        text: readText(local.abs),
      });
      continue;
    }
    if (overlay?.status === "ok" && overlay.fabricDir && Number(id) >= 2) {
      const fabricRules = listRuleFiles(overlay.fabricDir);
      const fr = fabricRules.find((r) => r.id === id);
      if (fr) {
        ruleBodies.push({
          id,
          fileName: fr.fileName,
          source: overlay.wanted,
          text: readText(fr.abs),
        });
      }
    }
  }

  const { skills, donorWarning } = listMergedPackSkills(
    pack.platform,
    pack.minecraftVersion,
    pack.packDir,
    overlay,
    repoRoot,
  );
  if (donorWarning) warnings.push(donorWarning);
  const libSkills = listLibSkillIndex(platform, minecraftVersion, repoRoot);

  if (skills.length === 0) warnings.push(NO_PLATFORM_SKILLS_WARNING);

  const extraRuleSet = new Set(extraRules);
  for (const id of parseTopicTokens(args.topics).ruleIds) extraRuleSet.add(id);

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
    skillBodies.push({
      name: hit.name,
      absPath: hit.absPath,
      relPosix: hit.relPosix,
      text: hit.mappingNote ? wrapDonorSkillBody(hit.mappingNote, readText(hit.absPath)) : readText(hit.absPath),
    });
    inBodies.add(canonicalSkillName(hit.name));
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
    for (const h of RULE_SKILL_HINTS[id] ?? []) pushHint(h);
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
    const validTopic = parseTopicTokens(args.topics).ruleIds.length > 0 || skillHints.length > 0;
    if ((validTask || validTopic) && expanded) rulesMode = "extended";
    else rulesMode = "base";
  }
  if (rulesMode === "base" && !includeAll) warnings.push(BASE_ONLY_WARNING);

  return {
    ok: true,
    dest: "session",
    platform: pack.platform,
    minecraftVersion,
    knowledgeVersion: pack.minecraftVersion,
    packDir: pack.packDir.replace(/\\/g, "/"),
    agents: readText(pack.agentsPath),
    rules: ruleBodies,
    ruleIndex: rules.map((r) => ({ id: r.id, fileName: r.fileName })),
    overlay,
    verifiedApi: verifiedApiNotes(pack.packDir),
    skills,
    libSkills,
    skillBodies,
    nextReads,
    baseRuleIds: ids,
    rulesMode,
    warnings,
    libSkillsNote:
      "库 Skill 只在 libSkills[]，不进入 skills[] 与 nextReads。须读 libSkills[]；只有显式 skillNames 才注入库正文（计入 skillBodies 上限 6）。不确定先读 knowledge/libs/all-platforms/mc-lib-catalog/SKILL.md。",
    includeAllRules: includeAll,
    topicWarnings: topicWarnings.length ? topicWarnings : undefined,
    contextWarning: includeAll
      ? "includeAllRules=true 会灌入 00–10 全文，上下文体积大；默认只要 00+01+09。"
      : undefined,
    ideLoadNotes:
      "各 IDE 扫不到知识库里嵌套的 forge/<ver>/.cursor（打开的是用户模组工程）。会话包只服务当前对话；要工程内常驻请 activate_platform_pack action=write（hosts 必填）。不要把规则拷进 MC_skill 仓库根。",
  };
}
