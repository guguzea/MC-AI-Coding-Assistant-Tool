/**
 * assert-lib-census-counts.mjs —— 库 SKILL「N 条实测」计数必须能由其所引文件机械复算（W0-1，2026-09-19）。
 *
 * 缘由：mc-caelus/SKILL.md 的「31 条目实测（Forge 20 / NeoForge 8=5 构件 / Fabric 3=2 构件）」是
 * 库坐标链判定的依据（mcVersionsByPlatform 白名单据此收窄）。写死在散文里的计数一旦与
 * `mcp-server/data/lib-manifests/all.json` 脱节（上游发新版 / 口径改），就会变成编造精度。
 * 本门把「散文计数 ↔ 清单复算」钉死：
 *   判据 ①（锚点存在）：任何 SKILL.md 宣称「条(目)实测」都必须引用 `lib-manifests/all.json`
 *           作为复算锚点 —— 无锚点的计数主张直接红；
 *   判据 ②（逐数复算）：slug=caelus 的全部散文计数（total / 各 loader 行数 / 独立构件数）
 *           必须与 all.json 实测一致（rows=gameVersion×loader 条目；artifacts=唯一 fileName）。
 *
 * 用法：
 *   node scripts/assert-lib-census-counts.mjs             # 判红/绿
 *   node scripts/assert-lib-census-counts.mjs --selftest  # 纯内存投毒（不碰仓库文件）
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SERVER_ROOT = path.resolve(HERE, "..");
const REPO_ROOT = path.resolve(SERVER_ROOT, "..");
const LIBS_ROOT = path.join(REPO_ROOT, "knowledge", "libs");
const AUTHORED = path.join(REPO_ROOT, "community_knowledge", "authored");
const ALL_JSON = path.join(SERVER_ROOT, "data", "lib-manifests", "all.json");

/** 从 all.json 单库条目复算：total / 每 loader 行数与独立构件数。 */
export function censusOf(manifest, slug) {
  const lib = manifest.find((x) => x.slug === slug);
  if (!lib) return null;
  const by = {};
  for (const e of lib.entries) {
    const row = (by[e.loader] ??= { rows: 0, artifacts: new Set() });
    row.rows += 1;
    row.artifacts.add(e.fileName);
  }
  const out = { total: lib.entries.length, loaders: {} };
  for (const [k, v] of Object.entries(by)) {
    out.loaders[k] = { rows: v.rows, artifacts: v.artifacts.size };
  }
  return out;
}

/** 判据 ①：宣称「条(目)实测」却没给 all.json 锚点 ⇒ 红。容忍加粗标记（**31 条目**实测）。 */
export function anchorMissing(body) {
  return /条\*{0,2}目?\*{0,2}实测/.test(body) && !body.includes("lib-manifests/all.json");
}

/**
 * 判据 ②：caelus SKILL 的散文计数 ↔ all.json 复算逐数比对。
 * 返回 null = 一致；否则返回人读的差异清单（供断言消息直接用）。
 */
export function caelusCensusMismatch(body, census) {
  if (!census) return "all.json 里没有 slug=caelus 的条目";
  const problems = [];
  const pick = (re, label, want) => {
    const m = body.match(re);
    if (!m) {
      problems.push(`${label}: 正文里找不到计数字段（正则失配 ⇒ 文本形状变了，门与正文必须同步改）`);
      return;
    }
    const got = Number(m[1]);
    if (got !== want) problems.push(`${label}: 正文写 ${got}，all.json 复算 ${want}`);
  };
  pick(/(\d+)\s*条目\*{0,2}实测/, "总条目", census.total);
  pick(
    /Forge 1\.13\.2→1\.21\.1（(\d+) 条）/,
    "Forge 行数",
    census.loaders.forge?.rows ?? 0,
  );
  pick(
    /NeoForge 1\.20→1\.21\.5（(\d+) 条 = (\d+) 个构件/,
    "NeoForge 行数",
    census.loaders.neoforge?.rows ?? 0,
  );
  {
    const m = body.match(/NeoForge 1\.20→1\.21\.5（\d+ 条 = (\d+) 个构件/);
    if (m) {
      const got = Number(m[1]);
      const want = census.loaders.neoforge?.artifacts ?? 0;
      if (got !== want) problems.push(`NeoForge 构件数: 正文写 ${got}，all.json 复算 ${want}`);
    } else {
      problems.push("NeoForge 构件数: 正文里找不到「N 个构件」字段");
    }
  }
  pick(
    /Fabric 仅 1\.16\.4 \/ 1\.16\.5 \/ 1\.17\.1（(\d+) 条 = (\d+) 个构件/,
    "Fabric 行数",
    census.loaders.fabric?.rows ?? 0,
  );
  {
    const m = body.match(/Fabric 仅 1\.16\.4 \/ 1\.16\.5 \/ 1\.17\.1（\d+ 条 = (\d+) 个构件/);
    if (m) {
      const got = Number(m[1]);
      const want = census.loaders.fabric?.artifacts ?? 0;
      if (got !== want) problems.push(`Fabric 构件数: 正文写 ${got}，all.json 复算 ${want}`);
    } else {
      problems.push("Fabric 构件数: 正文里找不到「N 个构件」字段");
    }
  }
  return problems.length ? problems.join("；") : null;
}

function walkSkillFiles(dir, out = [], nameRe = /^SKILL\.md$/) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walkSkillFiles(p, out, nameRe);
    else if (nameRe.test(e.name)) out.push(p);
  }
  return out;
}

function selftest() {
  const fakeCensus = {
    total: 31,
    loaders: {
      forge: { rows: 20, artifacts: 13 },
      neoforge: { rows: 8, artifacts: 5 },
      fabric: { rows: 3, artifacts: 2 },
    },
  };
  const goodBody =
    "（A-43 更正，按 `mcp-server/data/lib-manifests/all.json` 31 条目实测…" +
    "**Forge 1.13.2→1.21.1（20 条）** · **NeoForge 1.20→1.21.5（8 条 = 5 个构件）** · " +
    "**Fabric 仅 1.16.4 / 1.16.5 / 1.17.1（3 条 = 2 个构件）**";
  const cases = [
    ["正对照·全数一致", anchorMissing(goodBody), false, "锚点腿误伤正对照"],
    ["判据①·宣称实测却无锚点", anchorMissing("本库 31 条实测， forge 20 条。"), true, "无锚点计数主张未判红"],
    ["判据②·总条目漂移", caelusCensusMismatch(goodBody.replace("31 条目实测", "33 条目实测"), fakeCensus) !== null, true, "总条目漂移未检出"],
    ["判据②·构件数漂移", caelusCensusMismatch(goodBody.replace("8 条 = 5 个构件", "8 条 = 6 个构件"), fakeCensus) !== null, true, "构件数漂移未检出"],
    ["判据②·行数漂移", caelusCensusMismatch(goodBody.replace("（20 条）", "（21 条）"), fakeCensus) !== null, true, "行数漂移未检出"],
    ["判据②·正对照一致", caelusCensusMismatch(goodBody, fakeCensus) === null, true, "全数一致的正文被误判"],
  ];
  let missed = 0;
  for (const [name, got, want, why] of cases) {
    if (Boolean(got) !== want) {
      missed++;
      console.error(`  ✗ selftest「${name}」期望 ${want ? "红" : "绿"}，实得 ${got ? "红" : "绿"}（${why}）`);
    } else {
      console.log(`  ✓ ${name}`);
    }
  }
  console.log(
    `\nassert-lib-census-counts(selftest): ${missed === 0 ? "OK（锚点腿 + 逐数复算腿 4 类投毒全检出，正对照零误伤）" : missed + " 例不符"}`,
  );
  process.exitCode = missed === 0 ? 0 : 1;
}

if (process.argv.includes("--selftest")) {
  selftest();
} else {
  const errors = [];
  // 判据 ①：全库扫描（SKILL.md + authored 库短文）
  const files = [
    ...walkSkillFiles(LIBS_ROOT),
    ...walkSkillFiles(AUTHORED, [], /^(lib|mc)-[\w-]+\.md$/),
  ];
  for (const f of files) {
    const body = fs.readFileSync(f, "utf8");
    if (anchorMissing(body)) {
      errors.push(`${path.relative(REPO_ROOT, f)}: 宣称「条(目)实测」却未引用 lib-manifests/all.json 复算锚点`);
    }
  }
  // 判据 ②：caelus 散文计数 ↔ all.json 逐数复算
  const manifest = JSON.parse(fs.readFileSync(ALL_JSON, "utf8"));
  const skillFile = walkSkillFiles(path.join(LIBS_ROOT, "all-platforms", "mc-caelus"))[0];
  const census = censusOf(manifest, "caelus");
  const mismatch = caelusCensusMismatch(fs.readFileSync(skillFile, "utf8"), census);
  if (mismatch) errors.push(`knowledge/libs/all-platforms/mc-caelus/SKILL.md: 计数与 all.json 复算脱节 —— ${mismatch}`);
  if (errors.length) {
    console.error(`assert-lib-census-counts: RED ——\n${errors.map((e) => `  - ${e}`).join("\n")}`);
    process.exit(1);
  }
  const loaders = Object.entries(census.loaders)
    .map(([k, v]) => `${k}=${v.rows}条/${v.artifacts}构件`)
    .join(" · ");
  console.log(
    `assert-lib-census-counts: ok（${files.length} 个库文件锚点腿全过；caelus ${census.total} 条目 ↔ ${loaders}，散文计数逐数复算一致）`,
  );
}
