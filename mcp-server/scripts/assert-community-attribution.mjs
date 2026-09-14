#!/usr/bin/env node
/**
 * S35 · 禁区矛盾豁免门（F51 / F52 的落地机制）。
 *
 * 背景：两处文档内部矛盾的一方落在禁区内（`ATTRIBUTION.md` 一字不动）或落在已裁定关闭的
 * 协议/许可面（2026-09-01），非禁区侧能收敛的都已收敛，剩下两条只能「登记 + 豁免」。
 * 豁免一旦可以被随手添加，就等于把断言放松了 ⇒ 本门把豁免做成**双向、活性、有解释**三件事：
 *   A1 每条豁免必须自带非空 `why`（为何不可改）与 `recheck`（复核指令，含可执行动词）；
 *   A2 与解释文件双向对齐：`temp/PLAN-2026-09-08-禁区矛盾豁免.md` 里的 `## <id>` 小节集合
 *      必须与门内 `EXEMPTIONS[]` 的 id 集合**完全相等**（门多一条 = 红，文件多一条 = 红）；
 *      该文件在 `temp/`（不入库），缺失时本项降级为提示，不当红——否则 fresh clone 必红。
 *   A3 活性检查：每条豁免登记的 needle 必须仍在盘上原文里（矛盾已被修好或行已漂 ⇒
 *      僵尸豁免 = 红，逼着修完的人回来删条目）；
 *   A4 覆盖面检查：豁免只准指向 `community_knowledge/**`，且禁止指向被禁的生成物；
 *      id 不得重复；needle 不得是空串或纯空白。
 *
 * 假根（投毒自证用）：MC_SKILL_COMMUNITY_ATTR_TEST_ROOT=<dir>
 *   <dir>/community_knowledge/ATTRIBUTION.md
 *   <dir>/community_knowledge/authored/forge-event-system-practices.md
 *   <dir>/temp/PLAN-2026-09-08-禁区矛盾豁免.md
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = process.env.MC_SKILL_COMMUNITY_ATTR_TEST_ROOT
  ? path.resolve(process.env.MC_SKILL_COMMUNITY_ATTR_TEST_ROOT)
  : path.resolve(HERE, "..", "..");

const LEDGER_REL = "temp/PLAN-2026-09-08-禁区矛盾豁免.md";

/** 已登记豁免。加一条必须同时：在解释文件建同名 `## <id>` 小节 + 保住 needle 在盘上。 */
const EXEMPTIONS = [
  {
    id: "F51-attribution-pointer",
    why: "矛盾一方在 ATTRIBUTION.md（禁区，一字不动）：:8 记的是作者口头许可原话，:11 记的是实际入库口径。",
    recheck:
      "ls -R community_knowledge/permitted/*/pages 逐页确认 title 仍带「仅指针」；许可事实变更由用户直接编辑 ATTRIBUTION.md 后删本条豁免。",
    pins: [
      { file: "community_knowledge/ATTRIBUTION.md", needle: "允许本仓库收录提炼内容" },
      { file: "community_knowledge/ATTRIBUTION.md", needle: "不入库正文" },
    ],
  },
  {
    id: "F52-event-system-license",
    why: "协议/许可面 2026-09-01 已裁定关闭（S22 曾越界改 permitted/）⇒ 不新增协议声明、不降级、不删除；:12 与 :87 谁为真属用户裁定面。",
    recheck:
      "打开 https://www.mcmod.cn/post/2571.html 与列表页，逐字记录协议声明有无 + 抓取日期，交用户选定一侧后删本条豁免。",
    pins: [
      { file: "community_knowledge/authored/forge-event-system-practices.md", needle: "均未声明协议" },
      { file: "community_knowledge/authored/forge-event-system-practices.md", needle: "显式 BY-NC-SA" },
    ],
  },
];

const failures = [];
const notes = [];
const fail = (m) => failures.push(m);

for (const e of EXEMPTIONS) {
  if (!e.id.trim()) fail("存在空 id 的豁免条目");
  if (!e.why || e.why.trim().length < 12) fail(`${e.id}: why 缺失或过短 ⇒ 不允许无解释豁免`);
  if (!e.recheck || !/(ls |grep |curl|node |打开|复核)/.test(e.recheck))
    fail(`${e.id}: recheck 不是一条可执行的复核指令`);
  if (!e.pins?.length) fail(`${e.id}: 没有登记任何原文 needle`);
}
const ids = EXEMPTIONS.map((e) => e.id);
if (new Set(ids).size !== ids.length) fail(`豁免 id 重复：${ids.join(", ")}`);

const cache = new Map();
function read(rel) {
  if (!cache.has(rel)) {
    const p = path.join(ROOT, rel.split("/").join(path.sep));
    cache.set(rel, fs.existsSync(p) ? fs.readFileSync(p, "utf8") : null);
  }
  return cache.get(rel);
}

const seenMissing = new Set();
for (const e of EXEMPTIONS) {
  for (const pin of e.pins ?? []) {
    if (!pin.file.startsWith("community_knowledge/")) {
      fail(`${e.id}: needle 指向豁免范围外（只准 community_knowledge/**）：${pin.file}`);
      continue;
    }
    if (/library-catalog\.ts|meta\.json$|semantic-index-manifest/.test(pin.file)) {
      fail(`${e.id}: needle 指向生成物，禁止用豁免覆盖生成物：${pin.file}`);
      continue;
    }
    if (!pin.needle || !pin.needle.trim()) {
      fail(`${e.id}: ${pin.file} 的 needle 为空`);
      continue;
    }
    const text = read(pin.file);
    if (text === null) {
      const key = `${e.id}::${pin.file}`;
      if (!seenMissing.has(key)) {
        seenMissing.add(key);
        fail(`${e.id}: 登记的原文文件不在盘上 ⇒ ${pin.file}`);
      }
      continue;
    }
    const hits = text.split(pin.needle).length - 1;
    if (hits === 0)
      fail(
        `僵尸豁免：${e.id} 的 needle「${pin.needle}」已不在 ${pin.file}（矛盾已修好或行已漂 ⇒ 删掉这条豁免，别留空壳）`,
      );
  }
}

const ledgerAbs = path.join(ROOT, LEDGER_REL.split("/").join(path.sep));
let ledgerIds = null;
if (fs.existsSync(ledgerAbs)) {
  const text = fs.readFileSync(ledgerAbs, "utf8");
  ledgerIds = [...text.matchAll(/^## (\S+)\s*$/gm)].map((m) => m[1]);
  for (const id of ids) if (!ledgerIds.includes(id)) fail(`门内豁免 ${id} 在解释文件里没有同名小节 ⇒ 无解释豁免`);
  for (const id of ledgerIds) if (!ids.includes(id)) fail(`解释文件登记了 ${id}，门内没有这条豁免 ⇒ 台账与门不同步`);
  if (new Set(ledgerIds).size !== ledgerIds.length)
    fail(`解释文件里有重复小节：${ledgerIds.filter((x, i) => ledgerIds.indexOf(x) !== i).join(", ")}`);
} else {
  notes.push(`解释文件缺失（${LEDGER_REL} 在 temp/，不入库）⇒ 双向对齐降级为提示，只用门内 inline 解释`);
}

const rel = path.relative(process.cwd(), ROOT) || ".";
if (failures.length) {
  console.log(`assert-community-attribution: ${failures.length} 项失败（根=${rel}，豁免 ${ids.length} 条${ledgerIds ? ` / 台账 ${ledgerIds.length} 条` : " / 台账缺席"}）`);
  for (const f of failures.slice(0, 30)) console.log("  ✗ " + f);
  process.exit(1);
}
console.log(
  `assert-community-attribution: ok · 豁免 ${ids.length} 条全部有解释且原文仍在盘上（根=${rel}${ledgerIds ? ` · 与解释文件 ${ledgerIds.length} 条双向对齐` : ""}）`,
);
for (const n of notes) console.log("  info: " + n);
