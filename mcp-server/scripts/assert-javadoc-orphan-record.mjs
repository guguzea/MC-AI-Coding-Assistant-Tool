#!/usr/bin/env node
/**
 * assert-javadoc-orphan-record — `data/forge_javadoc/*` 的孤儿对账/删除留痕必须是真的、且不过期。
 *
 * 为什么单独一道门（与两道既有门怎么分工）：
 *   · `assert-javadoc-index-parity` 管「盘上 raw ⇄ processed ⇄ index-l0 双向差」⇒ 它已经保证
 *     **现在**没有孤儿页；
 *   · `assert-javadoc-build-provenance` 管「落盘形状 / 出处 / 整版无正文率」；
 *   · 本门管**第三件事**：那次清理有没有留下可核对的记录，以及记录是否还在说真话。
 *     2026-09-22 实测到的原缺陷：孤儿报告是「当前快照」，下一次抓取会**原地覆盖**它 ——
 *     删完 319 页再跑一遍抓取，报告就变成 `count: 0`，于是「删了什么」在库里零留痕，
 *     只能靠 `git status` 的 638 条 ` D` 反推。⇒ 生产者现已在真删时另写 `_orphan-pruned.json`
 *     （写一次即冻结），本门把两份记录一起核。
 *
 * 判据：
 *  ① 每个有 `raw/` 的档位目录必须有 `_orphan-report.json`。缺 = 这档从没做过孤儿对账 ⇒ 红；
 *     唯一合法豁免是 `_page-failures.json` 存在且 `count>0`（抓取有失败页时生产者**刻意跳过**对账，
 *     因为分不清"没抓到"与"不该存在"），此时点名「孤儿未核」而不是静默放行。
 *  ② 记录自洽：`count === files.length`、`version === 目录名`、`producerRev === 生产者的 PRODUCER_REV`
 *     （决定"什么算孤儿"的代码变了而记录没重跑 ⇒ 记录不再代表现状 ⇒ 红）。
 *  ③ 点名路径必须合法：相对、以 `.md` 结尾、不以 `/` 开头、无盘符前缀、无 `..` 段 ——
 *     与 `pruneOrphans()` 内部的把关**同口径**，从外面再核一次：手改 JSON 不能把它变成删除指令。
 *  ④ 点名的页在盘上必须**不存在**（raw 与 processed 镜像双边都算）⇒ 抓「说删了没删」与「后来复活」。
 *  ⑤ `_orphan-pruned.json` 若存在，②③④ 同样适用，另加 `prunedAt` 必须是可解析的 ISO 时间。
 *     不存在只打 info 不判红 —— 留痕机制上线前的历史删除不该让全树变红；此点由 selftest 的
 *     「有留痕被投毒 ⇒ 红」证明它不是装饰。
 *
 * 用法：
 *   node scripts/assert-javadoc-orphan-record.mjs            # 真跑
 *   node scripts/assert-javadoc-orphan-record.mjs --selftest  # 纯内存夹具（各失守必红 + 干净必绿）
 *   MC_SKILL_DATA=<dir>                                       # 换数据根（投毒用）
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { PRODUCER_REV } from "./fetch-forge-javadoc.js";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(HERE, "..", "..");
const DATA_ROOT = process.env.MC_SKILL_DATA ?? join(REPO_ROOT, "data");
const SELFTEST = process.argv.includes("--selftest");
const FAMILY = join(DATA_ROOT, "forge_javadoc");

export const REPORT_FILE = "_orphan-report.json";
export const PRUNED_FILE = "_orphan-pruned.json";
export const FAILURES_FILE = "_page-failures.json";

/** ③ 路径合法性（与生产者 pruneOrphans 的把关同口径）。 */
export function pathSane(rel) {
  const s = String(rel ?? "");
  if (!s.endsWith(".md")) return "不是 .md";
  if (s.startsWith("/") || /^[A-Za-z]:/.test(s) || s.includes("\\")) return "绝对路径或反斜杠";
  if (s.split("/").includes("..")) return "含 .. 段";
  if (s.split("/").includes("processed")) return "指向 processed 镜像（报告只许点 raw 侧）";
  return null;
}

/** ① 缺记录的豁免判断：只有"抓取本身没跑完"才允许没有对账报告。 */
export function missingReportVerdict({ failureRecord }) {
  if (!failureRecord) return { ok: false, why: `既无 ${REPORT_FILE} 也无 ${FAILURES_FILE} ⇒ 孤儿从未对账，也没有"这轮没跑完"的记账` };
  if (!(Number(failureRecord.count) > 0)) {
    return { ok: false, why: `无 ${REPORT_FILE}，而 ${FAILURES_FILE} 的 count=${JSON.stringify(failureRecord.count)}（非正数）⇒ 不是"刻意跳过对账"，是记录丢了` };
  }
  return { ok: true, why: `孤儿未核（本轮 ${failureRecord.count} 页未完成 ⇒ 生产者刻意跳过对账）` };
}

/**
 * ②③④⑤ 的单条记录判定（纯函数）。
 * @param {string} label 报告名（留痕/对账）
 * @param {object|null} rec 解析后的 JSON
 * @param {{dirName:string, producerRev:string, exists:(rel:string)=>boolean, procExists:(rel:string)=>boolean}} ctx
 */
export function judgeRecord(label, rec, ctx) {
  const problems = [];
  if (!rec || typeof rec !== "object") return [`${label}: 记录不是对象（解析失败或为空）`];
  const files = Array.isArray(rec.files) ? rec.files : null;
  if (!files) { problems.push(`${label}: 没有 files 数组 ⇒ 无法核对点名内容`); return problems; }
  if (rec.count !== files.length) problems.push(`${label}: count=${JSON.stringify(rec.count)} 与 files.length=${files.length} 不等（自相矛盾）`);
  if (rec.version !== ctx.dirName) problems.push(`${label}: version=${JSON.stringify(rec.version)} ≠ 目录名 ${ctx.dirName}`);
  if (rec.producerRev !== ctx.producerRev) {
    problems.push(`${label}: producerRev=${JSON.stringify(rec.producerRev)} ≠ 当前生产者 ${ctx.producerRev} ⇒ 记录过期（改了"什么算孤儿"的代码必须重跑对账）`);
  }
  if (label.includes(PRUNED_FILE) && !(typeof rec.prunedAt === "string" && !Number.isNaN(Date.parse(rec.prunedAt)))) {
    problems.push(`${label}: prunedAt 不是可解析时间（${JSON.stringify(rec.prunedAt)}）`);
  }
  let bad = 0, present = 0, presentProc = 0;
  for (const rel of files) {
    const why = pathSane(rel);
    if (why) { if (bad++ < 3) problems.push(`${label}: 点名条目不合法（${why}）：${rel}`); continue; }
    if (ctx.exists(rel)) { if (present++ < 3) problems.push(`${label}: 点名的页仍在盘上（没删净或已复活）：${rel}`); }
    if (ctx.procExists(rel)) { if (presentProc++ < 3) problems.push(`${label}: processed 镜像还在（单边删除 = G3 必红）：${rel}`); }
  }
  if (bad > 3) problems.push(`${label}: 不合法条目共 ${bad} 条（上面只列前 3）`);
  return problems;
}

function readJson(p) {
  if (!existsSync(p)) return null;
  try {
    return JSON.parse(readFileSync(p, "utf8"));
  } catch (e) {
    return { __parseError: `${e.message}`, __path: p };
  }
}

/** 报告里 raw 侧相对路径 → processed 镜像路径（`a/b/C.md` → `a_b_C.md`），与索引器同口径。 */
export function mirrorOf(rel) {
  return rel.replace(/\.md$/, "").split("/").join("_") + ".md";
}

function realRun() {
  const problems = [];
  const notes = [];
  if (!existsSync(FAMILY)) return { problems: [`数据根下没有 forge_javadoc：${FAMILY}（换错根 ≠ 零缺陷）`], notes };
  const dirs = readdirSync(FAMILY, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name);
  if (!dirs.length) return { problems: [`${FAMILY} 下没有档位目录（空扫描 = 门没在看任何东西）`], notes };
  let prunedSeen = 0, exempt = 0;
  for (const ver of dirs) {
    const vdir = join(FAMILY, ver);
    if (!existsSync(join(vdir, "raw"))) continue; // 没有 raw/ 的目录不是语料档（比如只有索引草稿）
    const report = readJson(join(vdir, REPORT_FILE));
    if (report?.__parseError) { problems.push(`${ver}: ${REPORT_FILE} 解析失败 ${report.__parseError}`); continue; }
    if (!report) {
      const failures = readJson(join(vdir, FAILURES_FILE));
      if (failures?.__parseError) { problems.push(`${ver}: ${FAILURES_FILE} 解析失败 ⇒ 无法证明"刻意跳过"成立`); continue; }
      const v = missingReportVerdict({ failureRecord: failures });
      if (!v.ok) problems.push(`${ver}: ${v.why}`);
      else { exempt++; notes.push(`${ver}: ${v.why}`); }
      continue;
    }
    const ctx = {
      dirName: ver,
      producerRev: PRODUCER_REV,
      exists: (rel) => existsSync(join(vdir, "raw", ...rel.split("/"))),
      procExists: (rel) => existsSync(join(vdir, "processed", mirrorOf(rel))),
    };
    problems.push(...judgeRecord(`${ver}/${REPORT_FILE}`, report, ctx));
    const pruned = readJson(join(vdir, PRUNED_FILE));
    if (pruned?.__parseError) problems.push(`${ver}: ${PRUNED_FILE} 解析失败 ${pruned.__parseError}`);
    else if (pruned) { prunedSeen++; problems.push(...judgeRecord(`${ver}/${PRUNED_FILE}`, pruned, ctx)); }
    notes.push(
      `${ver}: 对账记录 count=${report.count}（rev ${report.producerRev}）` +
        (pruned ? ` · 删除留痕 count=${pruned.count} @ ${pruned.prunedAt}` : " · 无删除留痕（该机制上线前的清理）"),
    );
  }
  notes.push(`档位 ${dirs.length} · 有留痕 ${prunedSeen} · 豁免（本轮没跑完）${exempt} · 生产者 ${PRODUCER_REV}`);
  return { problems, notes };
}

function selfTest() {
  const problems = [];
  const expect = (label, got, want) => { if (got !== want) problems.push(`${label}：期望 ${want}，实得 ${got}`); };
  const ctx = (alive = new Set(), aliveProc = new Set()) => ({
    dirName: "1.12.2", producerRev: PRODUCER_REV,
    exists: (rel) => alive.has(rel), procExists: (rel) => aliveProc.has(mirrorOf(rel)),
  });
  const ok = { version: "1.12.2", producerRev: PRODUCER_REV, count: 2, files: ["a/B.md", "a/C.md"], prunedAt: "2026-09-22T06:43:45.376Z" };

  expect("② 干净记录 ⇒ 绿", judgeRecord("_orphan-report.json", ok, ctx()).length, 0);
  expect("② count 与 files 不等 ⇒ 红", judgeRecord("_orphan-report.json", { ...ok, count: 5 }, ctx()).length > 0, true);
  expect("② version 与目录不符 ⇒ 红", judgeRecord("_orphan-report.json", { ...ok, version: "1.8.9" }, ctx()).length > 0, true);
  expect("② 记录出自旧生产者 ⇒ 红（过期记录不代表现状）",
    judgeRecord("_orphan-report.json", { ...ok, producerRev: "c3-2026-09-22" }, ctx()).length > 0, true);
  expect("③ 点名绝对路径 ⇒ 红", judgeRecord("_orphan-report.json", { ...ok, files: ["C:/Windows/x.md"], count: 1 }, ctx()).length > 0, true);
  expect("③ 点名 .. 越界 ⇒ 红", judgeRecord("_orphan-report.json", { ...ok, files: ["../../agents.md"], count: 1 }, ctx()).length > 0, true);
  expect("③ 非 .md ⇒ 红（报告不能变成删任意文件的指令）",
    judgeRecord("_orphan-report.json", { ...ok, files: ["a/B.txt"], count: 1 }, ctx()).length > 0, true);
  expect("④ 点名的页还在盘上 ⇒ 红", judgeRecord("_orphan-report.json", ok, ctx(new Set(["a/B.md"]))).length > 0, true);
  expect("④ processed 镜像还在（单边删）⇒ 红",
    judgeRecord("_orphan-report.json", ok, ctx(new Set(), new Set(["a_B.md"]))).length > 0, true);
  expect("⑤ 留痕缺 prunedAt ⇒ 红",
    judgeRecord("_orphan-pruned.json", { ...ok, prunedAt: undefined }, ctx()).length > 0, true);
  expect("⑤ 留痕合法 ⇒ 绿", judgeRecord("_orphan-pruned.json", ok, ctx()).length, 0);
  expect("① 无报告 + 无失败记账 ⇒ 红", missingReportVerdict({ failureRecord: null }).ok, false);
  expect("① 无报告 + 失败记账 count=0 ⇒ 红（不算「刻意跳过」）", missingReportVerdict({ failureRecord: { count: 0 } }).ok, false);
  expect("① 无报告 + 失败记账 count>0 ⇒ 豁免成立", missingReportVerdict({ failureRecord: { count: 3 } }).ok, true);
  expect("mirrorOf 与索引器同口径", mirrorOf("net/minecraft/Block.md"), "net_minecraft_Block.md");
  expect("正对照：路径合法集合不报错", pathSane("net/minecraft/block/Block.md"), null);
  if (problems.length) {
    for (const p of problems) console.log(`✗ ${p}`);
    console.log(`assert-javadoc-orphan-record(selftest): ${problems.length} 例不符`);
    process.exitCode = 1;
  } else {
    console.log("assert-javadoc-orphan-record(selftest): OK（16 例：自洽 3 / 路径 3 / 在盘 2 / 留痕 2 / 豁免 3 / 口径 2 + 干净正对照）");
  }
}

if (SELFTEST) {
  selfTest();
} else {
  const { problems, notes } = realRun();
  for (const n of notes) console.log(`  · ${n}`);
  if (problems.length) {
    for (const p of problems) console.log(`✗ ${p}`);
    console.log(`assert-javadoc-orphan-record: ${problems.length} 项不达标`);
    process.exitCode = 1;
  } else {
    console.log(`assert-javadoc-orphan-record(ORPH): 达标 —— 每档有对账记录 / 记录自洽且未过期 / 点名页双边已不在盘 / 删除留痕可核`);
  }
}
