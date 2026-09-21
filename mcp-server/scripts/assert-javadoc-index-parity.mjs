#!/usr/bin/env node
/**
 * assert-javadoc-index-parity — forge_javadoc 族「盘上 ↔ 索引」双向差门（W1-4，2026-09-20）。
 *
 * 存在理由：`audit-data-consistency.mjs` 的 `docSubDirs()`（:200-208）只认 `<platform>_<ver>` 形，
 * 而 javadoc 族目录名是 `forge_javadoc/<ver>/`（无版本前缀，`parseIndexName` 不解析）⇒
 * §J（processed ↔ index-l0 逐条差）与 §S（语义层）对这 6 档**从不执行**。
 * 实测（2026-09-20）：1.7.10 processed=2464 / index-l0=1888，差 **576** = 盘上 576 个 ` (N)` 重件；
 * 其余 5 档 raw=proc=l0 三者相等（1.12.2 的 914 对历史重件已在 2026-09-18 成对删除）。
 *
 * 判据（逐档）：
 *   ① raw 篇数 == processed 篇数（加工不得吞页/造页）；
 *   ② index-l0 条目 ↔ processed 文件名**双向差为空**（id 去版本前缀后 `/`→`_` 即文件名）；
 *   ③ 盘上不在索引的孤儿数 == 登记债务（`ORPHAN_DEBT`，棘轮：只许减、超出即红）。
 * 除债务档外任何孤儿/缺失即红；债务档的孤儿数一旦变化（增或减）也红 —— 逼回填或改基线。
 *
 * 用法：
 *   node scripts/assert-javadoc-index-parity.mjs              # 判红/绿（默认）
 *   node scripts/assert-javadoc-index-parity.mjs --list       # 额外打印孤儿清单（待裁定的删除/入索引候选）
 *   node scripts/assert-javadoc-index-parity.mjs --selftest   # 纯内存畸形快照投毒（不碰仓库文件）
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SERVER_ROOT = path.resolve(HERE, "..");
const REPO_ROOT = path.resolve(SERVER_ROOT, "..");
const DATA_ROOT = process.env.MC_SKILL_DATA ?? path.join(REPO_ROOT, "data");

/**
 * 已登记孤儿债务（盘上有、索引无）：只许减。
 * 2026-09-20：1.7.10 原有 576 个 ` (N)` 重件（raw+processed 各 576），经用户裁定**成对删除**
 * 1152/1152（清单 temp/w14-javadoc-orphan-list.txt）⇒ 债务归零，1.7.10 现 raw=proc=l0=1888。
 * 该常量此后必须保持为空：任何档再出现孤儿即红（棘轮只降）。
 */
export const ORPHAN_DEBT = {};

function walkMd(dir, acc = []) {
  let ents = [];
  try {
    ents = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return acc;
  }
  for (const e of ents) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walkMd(p, acc);
    else if (e.isFile() && /\.md$/i.test(e.name)) acc.push(path.basename(p).replace(/\.md$/i, ""));
  }
  return acc;
}

/** id（`<ver>/a/b/C`）→ processed 文件名 stem（`a_b_C`），与 processed 侧命名同源。 */
export function idToStem(id) {
  return String(id ?? "").split("/").slice(1).join("_");
}

/** 纯函数：校验一份 per-档快照（selftest 与真跑共用）。 */
export function validateSnapshots(rows, debt = ORPHAN_DEBT) {
  const problems = [];
  for (const r of rows) {
    const { version, raw, procNames, l0Ids } = r;
    if (raw !== procNames.length) {
      problems.push(`${version}: raw=${raw} != processed=${procNames.length}（加工吞页/造页）`);
    }
    const stemOf = new Set(l0Ids.map(idToStem).filter(Boolean));
    const procSet = new Set(procNames);
    const orphan = procNames.filter((n) => !stemOf.has(n));
    const missing = [...stemOf].filter((n) => !procSet.has(n));
    if (missing.length > 0) {
      problems.push(`${version}: 索引有、盘上无 ${missing.length} 条（例：${missing.slice(0, 3).join(", ")}）`);
    }
    const allowed = debt[version] ?? 0;
    if (orphan.length !== allowed) {
      problems.push(
        `${version}: 盘上不在索引的孤儿 ${orphan.length} 条 != 登记债务 ${allowed}` +
          (allowed === 0 ? "（本档不许有孤儿）" : "（棘轮：数量一变就要回填或改基线）"),
      );
    }
  }
  return problems;
}

function collectRows(versions) {
  const fam = path.join(DATA_ROOT, "forge_javadoc");
  const rows = [];
  for (const version of versions) {
    const vdir = path.join(fam, version);
    const raw = walkMd(path.join(vdir, "raw"));
    const procNames = walkMd(path.join(vdir, "processed"));
    let l0 = [];
    try {
      const parsed = JSON.parse(fs.readFileSync(path.join(vdir, "index-l0.json"), "utf8"));
      l0 = Array.isArray(parsed) ? parsed : parsed.docs ?? [];
    } catch {
      /* 无索引 ⇒ l0Ids 空，会以「索引有盘上无」形态报出 */
    }
    rows.push({ version, raw: raw.length, procNames, l0Ids: l0.map((e) => e?.id), orphan: procNames.filter((n) => !new Set(l0.map((e) => idToStem(e?.id))).has(n)) });
  }
  return rows;
}

function listVersions() {
  const fam = path.join(DATA_ROOT, "forge_javadoc");
  try {
    return fs
      .readdirSync(fam, { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((e) => e.name)
      .sort();
  } catch {
    return [];
  }
}

if (process.argv.includes("--selftest")) {
  const cases = [
    ["正对照：三数相等", [{ version: "1.7.10", raw: 2, procNames: ["a_b", "c_d"], l0Ids: ["1.7.10/a/b", "1.7.10/c/d"] }], {}, 0],
    ["raw≠processed", [{ version: "x", raw: 3, procNames: ["a"], l0Ids: ["x/a"] }], {}, 1],
    ["索引有盘上无", [{ version: "x", raw: 1, procNames: ["a"], l0Ids: ["x/a", "x/b"] }], {}, 1],
    ["无债务档出现孤儿", [{ version: "x", raw: 2, procNames: ["a", "b"], l0Ids: ["x/a"] }], {}, 1],
    ["债务档数量相符", [{ version: "1.7.10", raw: 2, procNames: ["a", "b"], l0Ids: ["1.7.10/a"] }], { "1.7.10": 1 }, 0],
    ["债务档数量变了", [{ version: "1.7.10", raw: 3, procNames: ["a", "b", "c"], l0Ids: ["1.7.10/a"] }], { "1.7.10": 1 }, 1],
  ];
  let missed = 0;
  for (const [name, rows, debt, want] of cases) {
    const got = validateSnapshots(rows, debt).length;
    const ok = want === 0 ? got === 0 : got > 0;
    if (!ok) {
      missed++;
      console.error(`  ✗ selftest「${name}」应${want === 0 ? "绿" : "红"}实${got === 0 ? "绿" : "红"}`);
    }
  }
  const versions = listVersions();
  if (versions.length > 0) {
    const real = validateSnapshots(collectRows(versions));
    if (real.length > 0) {
      missed++;
      console.error(`  ✗ selftest 正对照：真实 javadoc 族本应绿，实得 ${real.length} 项`);
      for (const p of real.slice(0, 3)) console.error(`      ${p}`);
    }
  }
  console.log(
    `\nassert-javadoc-index-parity(selftest): ${missed === 0 ? `OK（${cases.length} 类畸形快照全检出 + 真实数据正对照绿）` : missed + " 例不符"}`,
  );
  process.exitCode = missed === 0 ? 0 : 1;
} else {
  const versions = listVersions();
  if (versions.length === 0) {
    console.error(`assert-javadoc-index-parity: 未找到 ${path.join(DATA_ROOT, "forge_javadoc")}`);
    process.exit(1);
  }
  const rows = collectRows(versions);
  const problems = validateSnapshots(rows);
  if (process.argv.includes("--list")) {
    for (const r of rows) {
      if (r.orphan.length) {
        console.log(`# ${r.version} 孤儿 ${r.orphan.length} 条（待裁定：入索引 or 删除）`);
        for (const n of r.orphan) console.log(`  ${n}`);
      }
    }
  }
  if (problems.length > 0) {
    console.error(`assert-javadoc-index-parity: ${problems.length} 项不通过`);
    for (const p of problems.slice(0, 25)) console.error(`  ✗ ${p}`);
    process.exit(1);
  }
  const summary = rows.map((r) => `${r.version}(raw=${r.raw} proc=${r.procNames.length} l0=${r.l0Ids.length} 孤儿=${r.orphan.length})`).join(" · ");
  console.log(`assert-javadoc-index-parity: ok（${rows.length} 档双向零差除登记债务；${summary}）`);
}
