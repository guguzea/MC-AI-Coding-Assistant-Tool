/**
 * assert-skill-skeleton-census.mjs —— 空壳 Skill 口径 2 普查棘轮（W5-2 裁定 5-B，2026-09-19）。
 *
 * 裁定：骨架技能按簇**补正**（不删不放过）。本门把普查数钉成基线棘轮：
 *   · 口径 1（banner）：正文含「技能骨架」横幅；
 *   · 口径 2（noPascal）：banner 且全文无 PascalCase 类名 token（`/[A-Z][a-z]+[A-Z]/`，如
 *     `ForgeRegistry`/`BlockEntityType`）—— 5-B 的补正对象就是这批「连一个可执行类名都没有」的文件。
 * 规则：当前计数 ≤ 基线（补正使计数下降、新增骨架必须先登记）；某技能名从基线消失 = 该簇补正完成（允许），
 *       但基线里已有的簇计数上涨即红。基线只由 MC_SKILL_SKELETON_RELEDGER=1 重算，禁止手改数字。
 *
 * 扫描面：各档 `.cursor/skills/<name>/SKILL.md`（源稿侧；镜像由源稿派生不计）。
 * 用法：
 *   node scripts/assert-skill-skeleton-census.mjs             # 判红/绿
 *   MC_SKILL_SKELETON_RELEDGER=1 node scripts/…              # 打印可提交的新基线 JSON（退出码 0）
 *   node scripts/assert-skill-skeleton-census.mjs --selftest  # 纯内存投毒
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(HERE, "..", "..");
const BASELINE_PATH = path.join(HERE, "skill-skeleton-census-baseline.json");
const BANNER_RE = /技能骨架/;
const PASCAL_RE = /[A-Z][a-z]+[A-Z]/;

export function censusOf(skills) {
  const out = { total: skills.length, banner: 0, noPascal: 0, bySkill: {} };
  for (const { name, body } of skills) {
    if (!BANNER_RE.test(body)) continue;
    out.banner += 1;
    const pascal = PASCAL_RE.test(body);
    if (!pascal) out.noPascal += 1;
    const e = (out.bySkill[name] ??= { banner: 0, noPascal: 0 });
    e.banner += 1;
    if (!pascal) e.noPascal += 1;
  }
  return out;
}

/** 棘轮判定：banner 总数上涨、noPascal 总数上涨、或已登记簇计数上涨 ⇒ 红。簇消失（补正完成）合法。 */
export function ratchetProblems(cur, base) {
  const problems = [];
  if (cur.banner > base.banner) problems.push(`banner 总数 ${cur.banner} > 基线 ${base.banner}（新增骨架必须先登记基线）`);
  if (cur.noPascal > base.noPascal) problems.push(`noPascal 总数 ${cur.noPascal} > 基线 ${base.noPascal}（5-B 衬对象在增长）`);
  for (const [name, b] of Object.entries(base.bySkill ?? {})) {
    const c = cur.bySkill[name];
    const cb = c?.banner ?? 0;
    if (cb > b.banner) problems.push(`簇 ${name}: banner ${cb} > 基线 ${b.banner}`);
  }
  return problems;
}

function selftest() {
  const mk = (name, body) => ({ name, body });
  const cur = {
    total: 4,
    banner: 2,
    noPascal: 1,
    bySkill: { "mc-ai": { banner: 1, noPascal: 1 }, "mc-datapack": { banner: 1, noPascal: 0 } },
  };
  const base = { banner: 2, noPascal: 1, bySkill: { "mc-ai": { banner: 1, noPascal: 1 }, "mc-datapack": { banner: 1, noPascal: 0 } } };
  const cases = [
    ["正对照·持平", ratchetProblems(cur, base).length === 0, true],
    ["banner 上涨即红", ratchetProblems({ ...cur, banner: 3 }, base).length === 1, true],
    ["noPascal 上涨即红", ratchetProblems({ ...cur, noPascal: 2 }, base).length === 1, true],
    ["簇计数上涨即红", ratchetProblems({ ...cur, bySkill: { ...cur.bySkill, "mc-ai": { banner: 2, noPascal: 1 } } }, { ...base, bySkill: { ...base.bySkill, "mc-ai": { banner: 1, noPascal: 1 } } }).length === 1, true],
    ["簇消失（补正完成）合法", ratchetProblems({ ...cur, bySkill: { "mc-datapack": cur.bySkill["mc-datapack"] } }, base).length === 0, true],
    ["census·banner 识别", censusOf([mk("mc-x", "> Wave D 技能骨架（forge 1.12.2）"), mk("mc-y", "用 ForgeRegistry 注册")]).banner === 1, true],
    ["census·noPascal 识别", censusOf([mk("mc-x", "> Wave D 技能骨架"), mk("mc-y", "> 技能骨架 but ForgeRegistry 存在")]).noPascal === 1, true],
  ];
  let missed = 0;
  for (const [name, got, want] of cases) {
    if (got !== want) {
      missed++;
      console.error(`  ✗ selftest「${name}」期望 ${want ? "红/真" : "绿/假"}，实得 ${got ? "红/真" : "绿/假"}`);
    } else {
      console.log(`  ✓ ${name}`);
    }
  }
  console.log(`\nassert-skill-skeleton-census(selftest): ${missed === 0 ? "OK（棘轮 5 形态 + census 2 例全符）" : missed + " 例不符"}`);
  process.exitCode = missed === 0 ? 0 : 1;
}

function collectSkills() {
  const skills = [];
  const packsDir = path.join(REPO_ROOT);
  for (const platform of fs.readdirSync(packsDir, { withFileTypes: true })) {
    if (!platform.isDirectory()) continue;
    const packRoot = path.join(packsDir, platform.name);
    let versions;
    try {
      versions = fs.readdirSync(packRoot, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const ver of versions) {
      if (!ver.isDirectory()) continue;
      const skillsDir = path.join(packRoot, ver.name, ".cursor", "skills");
      if (!fs.existsSync(skillsDir)) continue;
      for (const sk of fs.readdirSync(skillsDir, { withFileTypes: true })) {
        if (!sk.isDirectory() || !sk.name.startsWith("mc-")) continue;
        const f = path.join(skillsDir, sk.name, "SKILL.md");
        if (!fs.existsSync(f)) continue;
        skills.push({ name: sk.name, body: fs.readFileSync(f, "utf8"), rel: `${platform.name}/${ver.name}/.cursor/skills/${sk.name}` });
      }
    }
  }
  return skills;
}

if (process.argv.includes("--selftest")) {
  selftest();
} else {
  const skills = collectSkills();
  const census = censusOf(skills);
  if (process.env.MC_SKILL_SKELETON_RELEDGER) {
    console.log(
      JSON.stringify(
        { total: census.total, banner: census.banner, noPascal: census.noPascal, bySkill: census.bySkill },
        null,
        1,
      ),
    );
    process.exit(0);
  }
  if (!fs.existsSync(BASELINE_PATH)) {
    console.error("assert-skill-skeleton-census: RED —— 基线未登记。先跑 MC_SKILL_SKELETON_RELEDGER=1 并把输出存为 skill-skeleton-census-baseline.json");
    process.exit(1);
  }
  const base = JSON.parse(fs.readFileSync(BASELINE_PATH, "utf8"));
  const problems = ratchetProblems(census, base);
  if (problems.length) {
    console.error(`assert-skill-skeleton-census: RED ——\n${problems.map((p) => `  - ${p}`).join("\n")}`);
    process.exit(1);
  }
  const top = Object.entries(census.bySkill)
    .sort((a, b) => b[1].noPascal - a[1].noPascal)
    .slice(0, 6)
    .map(([k, v]) => `${k}:${v.noPascal}`)
    .join(" · ");
  console.log(
    `assert-skill-skeleton-census: ok（源稿 ${census.total} 件；骨架横幅 ${census.banner} / 口径2 noPascal ${census.noPascal} ≤ 基线；top 补正簇：${top}）`,
  );
}
