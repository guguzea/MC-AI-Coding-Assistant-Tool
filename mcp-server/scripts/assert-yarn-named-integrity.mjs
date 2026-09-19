/**
 * assert-yarn-named-integrity：yarn tiny 的 **named 列完整性 ratchet**（2026-09-19，N-11.1 第③步）。
 *
 * 背景（temp/audit/sweep81/UNFIXED-REPORT-VERDICT.md §7）：上游 v1 导出件（`*-tiny.gz`）会丢
 * named —— 实测 1.21.1 34.15% 字段 / 1.21.11 35.69% 字段降级为 `named==intermediary`。管线把
 * selfEq 当「yarn 未命名」长期静默，导致 convert_mapping 查不到 `MAX_HEALTH` 这类真实命名。
 * 2026-09-19 已按上游 `-v2.jar` 逐行重写 named 列（13 档，备份+provenance 落在各 `mappings/`）。
 *
 * 本门（纯只读）：
 *   1) 每档 `mappings/yarn-tiny-provenance.json` 必须存在（修复可追溯）；
 *   2) 当前 member selfEq 比率 ≤ 修复基线 × 1.15（防再次喂有损 artifact —— 有损态会高出 ~50% 相对量）；
 *   3) class selfEq 绝对数 ≤ 200。
 * 基线 = 2026-09-19 修复完成实测（见下方表）；阈值只许**收紧**，放宽需附新证据。
 */
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const DATA = path.join(REPO, "data");
const FACTOR = 1.15;
const CLASS_SELF_EQ_CAP = 200;
/** pack → 修复后 member selfEq 比率（2026-09-19，v2 重写后实测）。 */
const BASELINE = {
  "fabric_1.14.4": 0.2662,
  "fabric_1.16.5": 0.2275,
  "fabric_1.17.1": 0.1834,
  "fabric_1.18.2": 0.1812,
  "fabric_1.19.4": 0.239,
  "fabric_1.20.1": 0.2399,
  "fabric_1.20.4": 0.2425,
  "fabric_1.21.1": 0.1836,
  "fabric_1.21.10": 0.1829,
  "fabric_1.21.11": 0.1829,
  "fabric_1.21.3": 0.1888,
  "fabric_1.21.4": 0.1883,
  "fabric_1.21.8": 0.1853,
};
/**
 * 第 4 判据（N-11.2，2026-09-19）：**零成员类 ratchet**（相对形态）。
 * 动机：v1 有损的另一种表现是「CLASS 行在、METHOD/FIELD 行整批缺失」；绝对阈值不可用
 * （1.20+ 各档天然就有 ~9–14% 零成员类），故按**逐档基线** ratchet。
 * 归因口径：按 FIELD/METHOD 行的 **ownerOfficial 列** 归因（扁平布局档 1.14.4–1.19.4 的近邻归因会全错）。
 * `--measure-zero-member` 可重算基线（实测日期 2026-09-19）。
 */
const ZERO_MEMBER_BASELINE = {
  "fabric_1.14.4": 652,
  "fabric_1.16.5": 597,
  "fabric_1.17.1": 869,
  "fabric_1.18.2": 915,
  "fabric_1.19.4": 721,
  "fabric_1.20.1": 715,
  "fabric_1.20.4": 701,
  "fabric_1.21.1": 1044,
  "fabric_1.21.10": 1261,
  "fabric_1.21.11": 1389,
  "fabric_1.21.3": 1095,
  "fabric_1.21.4": 1089,
  "fabric_1.21.8": 1199,
};
const ZERO_MEMBER_SLACK = 30; // 绝对余量（对抗版本内小改动的抖动）

function scanTiny(txt) {
  let classSelfEq = 0,
    classTotal = 0,
    memberSelfEq = 0,
    memberTotal = 0;
  for (const l of txt.split(/\r?\n/)) {
    if (l.startsWith("CLASS\t")) {
      const p = l.split("\t");
      classTotal++;
      if (p[3] === p[2]) classSelfEq++;
    } else if (l.startsWith("FIELD\t") || l.startsWith("METHOD\t")) {
      const p = l.split("\t");
      memberTotal++;
      if (p[5] === p[4]) memberSelfEq++;
    }
  }
  return { classSelfEq, classTotal, memberSelfEq, memberTotal };
}

/**
 * 零成员类扫描（第 4 判据）：CLASS 行在，但按 **ownerOfficial 列** 归因后 METHOD/FIELD 全 0 的类。
 * 扁平布局档（1.14.4–1.19.4）必须用 owner 列（近邻归因会把成员全算给最后一个类）；
 * owner 不在 CLASS 表时回退近邻（容错，并在计数上不额外惩罚）。
 */
function scanZeroMember(txt) {
  const classes = new Map();
  let cur = null;
  for (const l of txt.split(/\r?\n/)) {
    if (l.startsWith("CLASS\t")) {
      const p = l.split("\t");
      cur = p[1];
      classes.set(cur, { m: 0, f: 0 });
    } else if (l.startsWith("METHOD\t") || l.startsWith("FIELD\t")) {
      const p = l.split("\t");
      const owner = classes.has(p[1]) ? p[1] : cur;
      if (!owner || !classes.has(owner)) continue;
      const v = classes.get(owner);
      if (l.startsWith("METHOD\t")) v.m++;
      else v.f++;
    }
  }
  let zero = 0;
  for (const [, v] of classes) if (v.m === 0 && v.f === 0) zero++;
  return { zero };
}

const packs = fs
  .readdirSync(DATA)
  .filter((d) => d.startsWith("fabric_"))
  .sort();
const errors = [];
const rows = [];
for (const pack of packs) {
  const dir = path.join(DATA, pack, "mappings");
  if (!fs.existsSync(dir)) continue;
  const tinyName = fs.readdirSync(dir).find((f) => /-tiny\.gz$/.test(f));
  if (!tinyName) continue;
  const prov = fs.existsSync(path.join(dir, "yarn-tiny-provenance.json"));
  const tinyText = zlib.gunzipSync(fs.readFileSync(path.join(dir, tinyName))).toString("utf8");
  const tiny = scanTiny(tinyText);
  const ratio = tiny.memberTotal ? tiny.memberSelfEq / tiny.memberTotal : 0;
  const base = BASELINE[pack];
  rows.push(`${pack} ${(ratio * 100).toFixed(2)}%`);
  if (!prov) errors.push(`${pack}: 缺 mappings/yarn-tiny-provenance.json（named 修复不可追溯）`);
  if (base === undefined) errors.push(`${pack}: 不在基线表中（新档须先完成 named 源核验并登记）`);
  else if (ratio > base * FACTOR) {
    errors.push(
      `${pack}: member selfEq ${(ratio * 100).toFixed(2)}% > 基线 ${(base * 100).toFixed(2)}% × ${FACTOR}` +
        ` —— 疑似再次摄入有损 tiny（修法见 UNFIXED-REPORT-VERDICT.md §7）`,
    );
  }
  if (tiny.classSelfEq > CLASS_SELF_EQ_CAP) {
    errors.push(`${pack}: class selfEq=${tiny.classSelfEq} > ${CLASS_SELF_EQ_CAP}`);
  }
  // 第 4 判据（N-11.2）：零成员类 ratchet —— 捕获「CLASS 行在、成员行整批缺失」的相对形态
  const zero = scanZeroMember(tinyText).zero;
  const zeroBase = ZERO_MEMBER_BASELINE[pack];
  if (zeroBase === undefined) {
    errors.push(`${pack}: 不在零成员基线表中（新档先 --measure-zero-member 并登记）`);
  } else {
    const cap4 = Math.ceil(zeroBase * FACTOR) + ZERO_MEMBER_SLACK;
    if (zero > cap4) {
      errors.push(
        `${pack}: 零成员类 ${zero} > 基线 ${zeroBase}×${FACTOR}+${ZERO_MEMBER_SLACK}（=${cap4}） —— 疑似 v1 有损（成员整批缺失）`,
      );
    } else {
      rows[rows.length - 1] = `${rows[rows.length - 1]} zero=${zero}`;
    }
  }
}
if (!rows.length) {
  console.error("assert-yarn-named-integrity: RED —— data/fabric_*/mappings 下找不到任何 -tiny.gz（发现逻辑失效）");
  process.exit(1);
}
if (errors.length) {
  console.error(`assert-yarn-named-integrity: RED（${errors.length} 条）`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log(
  `assert-yarn-named-integrity: ok（${rows.length} 档 · 全部有 provenance 且 selfEq ≤ 基线×${FACTOR}` +
    ` · 零成员类 ≤ 基线×${FACTOR}+${ZERO_MEMBER_SLACK}）`,
);
console.log(`  比率/零成员: ${rows.join(" · ")}`);
