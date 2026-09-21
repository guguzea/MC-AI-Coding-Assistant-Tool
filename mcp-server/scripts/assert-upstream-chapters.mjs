#!/usr/bin/env node
/**
 * assert-upstream-chapters.mjs — 文档语料的「期望页面清单」必须来自上游，不得来自本仓产物。
 *
 * 治的是 2026-09-21 缺页普查暴露的一类缺陷：`fetch-forge-docs.js` 的 chapters 取自
 * `probe-forge-versions.js` 解析**导航侧栏**的结果，而侧栏是可折叠的真子集（漏 `animation/*`
 * 等 5–6 页/档），还会过报 404 幽灵（`temurin/releases`）。于是 1.13.2 常年缺 14 页、
 * 1.14.4 缺 9 页，而 47 道门全绿 —— 因为「期望」和「实有」都出自同一份仓内台账，自证。
 *
 * 本门的期望值 = `data/forge-versions-manifest.json` 里 `chaptersSource === "search_index"`
 * 那份表（上游 MkDocs 全站页面索引，实测与 sitemap.xml 在 10/10 条 route 上页集完全相等）。
 * 页面名的本地形态按抓取器自己的折叠规则算（`chapter.replace(/\//g,"_") + ".md"`，
 * fetch-forge-docs.js:390），**不做反向解折叠** —— 反向解会把 `items_loot_tables.md`
 * 读成 `items/loot/tables`，同时造出「缺 1 页 + 多 1 页」的成对幻影（本轮实测踩过）。
 *
 *   node scripts/assert-upstream-chapters.mjs            # 真跑
 *   node scripts/assert-upstream-chapters.mjs --selftest # 夹具：缺页必红 / 空清单必红 / 干净必绿
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const DATA = process.env.MC_SKILL_DATA || join(ROOT, "data");
const SELFTEST = process.argv.includes("--selftest");

/** 仓内自写页（移植 primer 等）：它们没有上游对应物，属合法「本地独有」。 */
const LOCAL_ONLY_PATTERNS = [/^primer_/i, /^_/];
/** 每档至少这么多页才认为清单非空转（实测最少的档 53 页）。 */
const MIN_CHAPTERS = 20;

const localFileFor = (chapter) => chapter.replace(/\//g, "_") + ".md";
const isLocalOnly = (name) => LOCAL_ONLY_PATTERNS.some((re) => re.test(name));

export function checkTree({ version, entry, rawFiles }) {
  const errors = [];
  const mk = entry?.mkdocs;
  if (!mk?.available) return { errors, skipped: true, version };
  const chapters = Array.isArray(mk.chapters) ? mk.chapters : [];
  const source = mk.chaptersSource || "nav";

  if (source !== "search_index") {
    errors.push(`${version}: chaptersSource=${source}（不是 search_index）⇒ 期望清单来自可折叠的导航侧栏，本门判据不成立，请重跑 probe-forge-versions.js`);
    return { errors, version, chapters: chapters.length };
  }
  if (chapters.length < MIN_CHAPTERS) {
    errors.push(`${version}: 上游清单只有 ${chapters.length} 页（< ${MIN_CHAPTERS}）⇒ 探测疑似空转，拒绝按残表放行`);
    return { errors, version, chapters: chapters.length };
  }

  const have = new Set(rawFiles);
  const missing = chapters.filter((c) => !have.has(localFileFor(c)));
  if (missing.length) {
    errors.push(`${version}: 上游有 ${chapters.length} 页，本地缺 ${missing.length} 页 ⇒ ${missing.join(", ")}`);
  }
  const expected = new Set(chapters.map(localFileFor));
  const orphans = rawFiles.filter((f) => !expected.has(f) && !isLocalOnly(f));
  if (orphans.length) {
    errors.push(`${version}: 本地有 ${orphans.length} 个非上游页且不在自写白名单 ⇒ ${orphans.join(", ")}（伪造正文嫌疑）`);
  }
  return { errors, version, chapters: chapters.length, missing: missing.length, raw: rawFiles.length };
}

function realRun() {
  const manifestPath = join(DATA, "forge-versions-manifest.json");
  if (!existsSync(manifestPath)) {
    console.error(`FAIL: 缺 ${manifestPath}`);
    return 1;
  }
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  const problems = [];
  let checked = 0;
  for (const [version, entry] of Object.entries(manifest.versions || {})) {
    if (!entry?.mkdocs?.available) continue;
    const rawDir = join(DATA, `forge_${version}`, "forge-docs", version, "raw");
    if (!existsSync(rawDir)) {
      problems.push(`${version}: 无 raw 目录 ${rawDir.replace(DATA + "/", "")}`);
      continue;
    }
    const rawFiles = readdirSync(rawDir).filter((f) => f.endsWith(".md") && !f.startsWith("_"));
    const r = checkTree({ version, entry, rawFiles });
    if (r.skipped) continue;
    checked++;
    problems.push(...r.errors);
    if (!r.errors.length) console.log(`  ok ${version}: 上游 ${r.chapters} 页 / 本地 raw ${r.raw} 页`);
  }
  if (!checked) {
    console.error("FAIL: 一档都没核（清单里 0 个 mkdocs.available）⇒ 空转不算通过");
    return 1;
  }
  if (problems.length) {
    console.error(`FAIL: ${problems.length} 条`);
    problems.forEach((p) => console.error("  - " + p));
    return 1;
  }
  console.log(`PASS: ${checked} 档 forge 语料与上游页面清单一致`);
  return 0;
}

function selfTest() {
  // 夹具须 ≥ MIN_CHAPTERS，否则「干净」样本会先撞残表判据（2026-09-21 第一版就栽在这）；
  // 本地文件名一律由 chapters 按抓取器的折叠规则推，避免夹具自身与实际判据分叉。
  const base = ["index", "concepts/registries", "items/loot_tables", "models/advanced/imodel"];
  const chapters = [...base, ...Array.from({ length: 20 }, (_, i) => `filler/page${i}`)];
  const ok = { mkdocs: { available: true, chaptersSource: "search_index", chapters } };
  const files = [...chapters.map(localFileFor), "primer_1_20.md"];
  const without = (name) => files.filter((f) => f !== name);
  const cases = [
    ["干净集合应放行", { version: "1.20.1", entry: ok, rawFiles: files }, 0],
    ["缺页必红", { version: "1.20.1", entry: ok, rawFiles: files.filter((f) => f !== "models_advanced_imodel.md") }, 1],
    ["站点首页缺必红", { version: "1.20.1", entry: ok, rawFiles: files.filter((f) => f !== "index.md") }, 1],
    ["空清单不得空转放行", { version: "1.20.1", entry: { mkdocs: { available: true, chaptersSource: "search_index", chapters: [] } }, rawFiles: [] }, 1],
    ["残表（<20 页）不得放行", { version: "1.20.1", entry: { mkdocs: { available: true, chaptersSource: "search_index", chapters: ["a", "b"] } }, rawFiles: ["a.md", "b.md"] }, 1],
    ["导航来源必须点名", { version: "1.20.1", entry: { mkdocs: { available: true, chapters } }, rawFiles: files }, 1],
    ["非白名单孤儿页必红（伪造嫌疑）", { version: "1.20.1", entry: ok, rawFiles: [...files, "made_up_page.md"] }, 1],
    ["自写 primer 不得算孤儿", { version: "1.20.1", entry: ok, rawFiles: [...chapters.map(localFileFor), "primer_1_20.md"] }, 0],
    ["下划线页名不得被解折叠成缺页", { version: "1.20.1", entry: ok, rawFiles: files.map((f) => f.replace("items_loot_tables", "items/loot/tables")) }, 1],
  ];
  let failed = 0;
  for (const [name, arg, wantErrors] of cases) {
    const got = checkTree(arg).errors.length > 0 ? 1 : 0;
    const pass = got === wantErrors;
    if (!pass) failed++;
    console.log(`${pass ? "ok  " : "FAIL"} ${name}（期望 ${wantErrors ? "红" : "绿"}，实得 ${got ? "红" : "绿"}）`);
  }
  if (failed) {
    console.error(`SELFTEST FAIL: ${failed}/${cases.length}`);
    return 1;
  }
  console.log(`SELFTEST PASS: ${cases.length} 组夹具`);
  return 0;
}

if (SELFTEST) process.exitCode = selfTest();
else process.exitCode = realRun();
