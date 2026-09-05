#!/usr/bin/env node
/**
 * resolve-lib-skills.mjs — knowledge/libs §3.6 路径解析校验脚本
 *
 * 解析规则（不落盘，源稿即用）：
 *   1. 输入 (platform, mcVersion)；platform ∈ forge | fabric | quilt | neoforge | bedrock
 *   2. 组映射：
 *        forge     → forge-only + all-platforms
 *        fabric/quilt → fabric-only + all-platforms
 *        neoforge  → neo-only + all-platforms
 *        bedrock   → bedrock-only
 *   3. 候选 = 组内每个 mc-X/SKILL.md（X 为 skill 名）；先按组限定，再读 frontmatter `platforms` 二次确认
 *   4. 版本过滤：frontmatter `mcVersions`（兼容别名 `minecraftVersions`）留空/未写 → 不限；
 *      非空 → 数组任一窗口覆盖目标 mcVersion（支持 "1.20.1"、"1.20.1+"、"≤26.2"、"1.14-26.2"）
 *   5. 输出 { skillId, path, modIds, platforms }（按 skillId 排序）
 *
 * CLI：
 *   node scripts/resolve-lib-skills.mjs --platform forge --version 1.20.1   # 单组合解析
 *   node scripts/resolve-lib-skills.mjs --validate                          # 校验模式（默认）
 *   校验模式：对 (forge,1.20.1)、(fabric,1.20.1)、(neoforge,1.20.4) 三组合跑 resolve，
 *   结果非空 + skillId 无重复（含全局五组查重）→ 通过；否则 fail-fast 退出码 1。
 */
import { readFileSync, existsSync, readdirSync, statSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const LIBS_ROOT = join(ROOT, "knowledge", "libs");
const AUTHORED_DIR = join(ROOT, "community_knowledge", "authored");

const GROUP_DEFAULT_PLATFORMS = {
  "forge-only": ["forge"],
  "fabric-only": ["fabric", "quilt"],
  "neo-only": ["neoforge"],
  "all-platforms": ["forge", "fabric", "quilt", "neoforge"],
  "bedrock-only": ["bedrock"],
};
const GROUPS = {
  forge: ["forge-only", "all-platforms"],
  fabric: ["fabric-only", "all-platforms"],
  quilt: ["fabric-only", "all-platforms"],
  neoforge: ["neo-only", "all-platforms"],
  bedrock: ["bedrock-only"],
};

/* ------------------------------ frontmatter ------------------------------ */

function parseArray(value) {
  const v = String(value).trim();
  if (v.startsWith("[") && v.endsWith("]")) {
    return v
      .slice(1, -1)
      .split(",")
      .map((s) => s.trim().replace(/^["']|["']$/g, ""))
      .filter((s) => s !== "");
  }
  const bare = v.replace(/^["']|["']$/g, "");
  return bare === "" ? [] : [bare];
}

function parseFrontmatter(text) {
  const meta = {};
  if (!text.startsWith("---")) return meta;
  const end = text.indexOf("\n---", 3);
  if (end < 0) return meta;
  for (const line of text.slice(3, end).split(/\r?\n/)) {
    const m = line.match(/^([\w-]+):\s*(.*)$/);
    if (!m) continue;
    const value = m[2].trim();
    if (value === "") {
      meta[m[1]] = "";
    } else if (value.startsWith("[") && value.endsWith("]")) {
      meta[m[1]] = parseArray(value);
    } else {
      meta[m[1]] = value.replace(/^["']|["']$/g, "");
    }
  }
  return meta;
}

/* ----------------------------- 版本窗口匹配 ----------------------------- */

/** 数字分段比较 MC 版本（"1.20.1" < "1.21" < "26.1.2" < "26.2"） */
function cmpVersions(a, b) {
  const pa = String(a).split(".").map((s) => parseInt(s, 10) || 0);
  const pb = String(b).split(".").map((s) => parseInt(s, 10) || 0);
  const n = Math.max(pa.length, pb.length);
  for (let i = 0; i < n; i++) {
    const x = pa[i] || 0;
    const y = pb[i] || 0;
    if (x !== y) return x < y ? -1 : 1;
  }
  return 0;
}

/** 单个窗口 token 是否覆盖目标版本（精确 / X+ / ≤X / A-B） */
function coversVersion(token, mcVersion) {
  const t = String(token).trim();
  if (!t || t === "*") return true;
  let m = t.match(/^(\d[\d.]*)\+$/); // "1.20.1+"
  if (m) return cmpVersions(mcVersion, m[1]) >= 0;
  m = t.match(/^≤(\d[\d.]*)$/); // "≤26.2"
  if (m) return cmpVersions(mcVersion, m[1]) <= 0;
  m = t.match(/^(\d[\d.]*)-(\d[\d.]*)$/); // "1.14.4-26.1"
  if (m) return cmpVersions(mcVersion, m[1]) >= 0 && cmpVersions(mcVersion, m[2]) <= 0;
  return t === mcVersion || mcVersion.startsWith(t + ".");
}

/* ------------------------------ 源稿扫描 ------------------------------ */

function walkSkillDirs(groupDir) {
  const out = [];
  if (!existsSync(groupDir)) return out;
  for (const name of readdirSync(groupDir)) {
    const dir = join(groupDir, name);
    let st;
    try {
      st = statSync(dir);
    } catch {
      continue;
    }
    if (!st.isDirectory() || !/^mc-/.test(name)) continue;
    const skillFile = join(dir, "SKILL.md");
    if (existsSync(skillFile)) out.push(skillFile);
  }
  return out;
}

/** 收集五组全部 skill（含 frontmatter），附带组名 */
function loadAllSkills() {
  const skills = [];
  for (const group of ["all-platforms", "fabric-only", "neo-only", "forge-only", "bedrock-only"]) {
    for (const file of walkSkillDirs(join(LIBS_ROOT, group))) {
      const meta = parseFrontmatter(readFileSync(file, "utf8"));
      const dirName = file.split(/[\\/]/).slice(-2, -1)[0];
      skills.push({
        skillId: meta.name || dirName,
        path: file.replace(/\\/g, "/").replace(ROOT.replace(/\\/g, "/") + "/", ""),
        group,
        platforms: Array.isArray(meta.platforms)
          ? meta.platforms
          : meta.platforms
            ? parseArray(String(meta.platforms))
            : [],
        mcVersions: Array.isArray(meta.mcVersions || meta.minecraftVersions)
          ? meta.mcVersions || meta.minecraftVersions
          : [],
        communityDocId: String(meta.communityDocId || ""),
        file,
      });
      const last = skills[skills.length - 1];
      if (!last.platforms.length) {
        last.platforms = GROUP_DEFAULT_PLATFORMS[group] ?? [];
        console.warn(`[resolve] 缺 platforms，按组默认 ${group} → ${last.platforms.join(",")}: ${last.path}`);
      }
    }
  }
  return skills;
}

/** modIds：skill frontmatter 优先，其次 communityDocId 对应 authored 短文 frontmatter */
function resolveModIds(skill, authoredCache) {
  const meta = parseFrontmatter(readFileSync(skill.file, "utf8"));
  if (Array.isArray(meta.modIds) && meta.modIds.length > 0) return meta.modIds;
  if (skill.communityDocId) {
    const docId = skill.communityDocId.replace(/^authored\//, "");
    if (!authoredCache.has(docId)) {
      const p = join(AUTHORED_DIR, `${docId}.md`);
      authoredCache.set(docId, existsSync(p) ? parseFrontmatter(readFileSync(p, "utf8")) : null);
    }
    const docMeta = authoredCache.get(docId);
    if (docMeta && Array.isArray(docMeta.modIds)) return docMeta.modIds;
  }
  return [];
}

/* -------------------------------- resolve -------------------------------- */

/**
 * §3.6 解析：组映射 + platforms 二次确认 + mcVersions 过滤
 * @returns {Array<{skillId, path, modIds, platforms}>} 按 skillId 排序
 */
function resolve(platform, mcVersion, allSkills) {
  const groups = GROUPS[platform];
  if (!groups) throw new Error(`未知平台: ${platform}（应为 forge | fabric | quilt | neoforge | bedrock）`);
  const authoredCache = new Map();
  const matched = [];
  for (const skill of allSkills) {
    if (!groups.includes(skill.group)) continue; // 组映射（主依据）
    if (!skill.platforms.includes(platform)) continue; // platforms 二次确认
    const versions = skill.mcVersions;
    if (versions.length > 0 && !versions.some((t) => coversVersion(t, mcVersion))) continue; // 版本过滤
    matched.push({
      skillId: skill.skillId,
      path: skill.path,
      modIds: resolveModIds(skill, authoredCache),
      platforms: skill.platforms,
    });
  }
  return matched.sort((a, b) => a.skillId.localeCompare(b.skillId));
}

/* --------------------------------- 校验 --------------------------------- */

const VALIDATE_COMBOS = [
  ["forge", "1.20.1"],
  ["fabric", "1.20.1"],
  ["neoforge", "1.20.4"],
  ["bedrock", "stable"],
];

function runValidate(allSkills) {
  const errors = [];

  // 查重：同 id 默认全局唯一。唯一例外：forge-only ↔ neo-only 镜像稿
  // （解析组互斥，neoforge 只扫 neo-only、forge 只扫 forge-only，故不改组映射也能各自命中）
  const seen = new Map();
  const mirrorPair = (a, b) =>
    (a === "forge-only" && b === "neo-only") || (a === "neo-only" && b === "forge-only");
  for (const s of allSkills) {
    if (seen.has(s.skillId)) {
      const prev = seen.get(s.skillId);
      if (!mirrorPair(prev.group, s.group)) {
        errors.push(`重复 skillId「${s.skillId}」：${prev.path} 与 ${s.path}`);
      }
    } else {
      seen.set(s.skillId, { path: s.path, group: s.group });
    }
  }

  const results = {};
  for (const [platform, version] of VALIDATE_COMBOS) {
    const list = resolve(platform, version, allSkills);
    const ids = list.map((s) => s.skillId);
    results[`${platform}/${version}`] = { count: list.length, skillIds: ids };
    if (list.length === 0) {
      errors.push(`(${platform}, ${version}) 解析结果为空`);
    }
    const dup = ids.filter((id, i) => ids.indexOf(id) !== i);
    if (dup.length > 0) {
      errors.push(`(${platform}, ${version}) 结果内重复 skillId: ${[...new Set(dup)].join(", ")}`);
    }
  }

  // 数据卫生提示（不 fail）：forge-only 声明了非 forge 系平台 / fabric-only 声明 fabric 系外平台
  const smelly = allSkills.filter(
    (s) =>
      (s.group === "forge-only" && s.platforms.some((p) => p !== "forge" && p !== "neoforge")) ||
      (s.group === "fabric-only" && s.platforms.some((p) => p !== "fabric" && p !== "quilt"))
  );
  for (const s of smelly) {
    console.warn(`[resolve] ⚠️ 组与 platforms 不一致: ${s.path}（platforms=${s.platforms.join(",")}）`);
  }

  return { errors, results };
}

/* ---------------------------------- CLI ---------------------------------- */

function parseArgs(argv) {
  const args = { platform: null, version: null, validate: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const eq = a.indexOf("=");
    const key = eq >= 0 ? a.slice(0, eq) : a;
    const inlineVal = eq >= 0 ? a.slice(eq + 1) : null;
    if (key === "--platform") args.platform = inlineVal ?? argv[++i] ?? null;
    else if (key === "--version") args.version = inlineVal ?? argv[++i] ?? null;
    else if (key === "--validate") args.validate = true;
    else if (key === "--help" || key === "-h") { args.help = true; }
  }
  return args;
}

const args = parseArgs(process.argv.slice(2));

if (args.help) {
  console.log(`用法:
  node scripts/resolve-lib-skills.mjs --platform <forge|fabric|quilt|neoforge> --version <mcVersion>
      §3.6 解析：输出 {skillId, path, modIds, platforms} 列表（按 skillId 排序）
  node scripts/resolve-lib-skills.mjs --validate
      校验模式（默认）：(forge,1.20.1) (fabric,1.20.1) (neoforge,1.20.4) 三组合非空 + 无重复 skillId`);
  process.exit(0);
}

try {
  const allSkills = loadAllSkills();
  const validate = args.validate || !args.platform || !args.version;

  if (validate) {
    const { errors, results } = runValidate(allSkills);
    if (errors.length > 0) {
      console.error(JSON.stringify({ ok: false, errors, results }, null, 2));
      process.exit(1); // fail-fast
    }
    console.log(JSON.stringify({ ok: true, results }, null, 2));
  } else {
    const result = resolve(args.platform, args.version, allSkills);
    console.log(JSON.stringify(result, null, 2));
  }
} catch (err) {
  console.error(JSON.stringify({ ok: false, error: err.message }));
  process.exit(1);
}
