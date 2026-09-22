#!/usr/bin/env node
/**
 * assert-upstream-chapters.mjs — 文档语料的「期望页面清单」必须来自上游，不得来自本仓产物。
 *
 * 治的是 2026-09-21 缺页普查暴露的一类缺陷：`fetch-forge-docs.js` 的 chapters 取自
 * `probe-forge-versions.js` 解析**导航侧栏**的结果，而侧栏是可折叠的真子集（漏 `animation/*`
 * 等 5–6 页/档），还会过报 404 幽灵（`temurin/releases`）。于是 1.13.2 常年缺 14 页、
 * 1.14.4 缺 9 页，而 47 道门全绿 —— 因为「期望」和「实有」都出自同一份仓内台账，自证。
 *
 * 三平台的期望源（都是「上游清单快照」，由抓取器写，门只读盘、不联网）：
 *   forge      `data/forge-versions-manifest.json` 的 `mkdocs.chapters`，须 `chaptersSource==="search_index"`
 *              （上游 MkDocs 全站页面索引，实测与 sitemap.xml 在 10/10 条 route 上页集完全相等）
 *   neoforge   `data/neoforge_<v>/neoforge-docs/<v>/upstream-sitemap.json`，须 `source==="sitemap"`
 *   fabric     `data/fabric_<v>/fabric-docs/<v>/upstream-tree.json`，须 `source==="github_trees"` 且 `truncated===false`
 *
 * 页面名的本地形态一律按抓取器自己的折叠规则算（三个函数都在 `_lib/upstream-inventory.mjs`，
 * 与抓取器共用同一份），**不做反向解折叠** —— 反向解会把 `items_loot_tables.md` 读成
 * `items/loot/tables`，同时造出「缺 1 页 + 多 1 页」的成对幻影（本轮实测踩过）。
 *
 *   node scripts/assert-upstream-chapters.mjs            # 真跑
 *   node scripts/assert-upstream-chapters.mjs --selftest # 夹具：每类漂移必红 / 干净必绿
 */
import { existsSync, readFileSync, readdirSync, mkdirSync, writeFileSync, rmSync, mkdtempSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { forgeRawName, neoforgeRawName, fabricRawName } from "./_lib/upstream-inventory.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const DATA = process.env.MC_SKILL_DATA || join(ROOT, "data");
const SELFTEST = process.argv.includes("--selftest");

/** 仓内自写页（移植 primer 等）：它们没有上游对应物，属合法「本地独有」。 */
const LOCAL_ONLY_PATTERNS = [/^primer_/i, /^_/];
/** 清单非空时每档至少这么多页，才不认为是探测空转（实测最少的真档：fabric 1.20.4 = 31）。 */
const MIN_CHAPTERS = 20;

/**
 * 共用的「上游清单 vs 在盘」比对。
 * @param {object} p
 * @param {string} p.label         报错前缀（`forge 1.20.1` / `fabric 1.21.1` …）
 * @param {string} p.source        清单来源标记
 * @param {string[]} p.pages       上游页标识（未折叠）
 * @param {(page:string)=>string} p.fold  抓取器的落盘折叠函数
 * @param {string[]} p.rawFiles    本地 raw 目录里的 .md 文件名
 * @param {boolean} [p.allowEmpty] 允许「上游确实没有该版文档树」（fabric 的 7 个无 docs 档）
 */
export function compareInventory({ label, source, pages, rawFiles, fold, allowEmpty = false }) {
  const errors = [];
  const list = Array.isArray(pages) ? pages : [];

  if (source !== "search_index" && source !== "sitemap" && source !== "github_trees") {
    errors.push(`${label}: 清单来源 source=${JSON.stringify(source)} ⇒ 不是上游枚举（导航侧栏 / chapters-only 降级 / 仓内台账都算这一类），本门判据不成立`);
    return { errors, pages: list.length };
  }
  if (!list.length) {
    if (allowEmpty) {
      const stray = rawFiles.filter((f) => !isLocalOnly(f));
      if (stray.length) {
        errors.push(`${label}: 上游清单为空（该版确实没有文档树），本地却有 ${stray.length} 页 ⇒ ${stray.join(", ")}：要么清单是残表，要么正文是伪造`);
      }
      return { errors, pages: 0, emptyUpstream: true };
    }
    errors.push(`${label}: 上游清单 0 页 ⇒ 探测空转 / 快照写歪，拒绝放行`);
    return { errors, pages: 0 };
  }
  if (list.length < MIN_CHAPTERS) {
    errors.push(`${label}: 上游清单只有 ${list.length} 页（< ${MIN_CHAPTERS}）⇒ 探测疑似残表，拒绝按它放行`);
    return { errors, pages: list.length };
  }

  const have = new Set(rawFiles);
  const expected = new Set();
  for (const page of list) expected.add(fold(page));
  const missing = [...expected].filter((f) => !have.has(f));
  if (missing.length) {
    errors.push(`${label}: 上游 ${expected.size} 页，本地缺 ${missing.length} 页 ⇒ ${missing.join(", ")}`);
  }
  const orphans = rawFiles.filter((f) => !expected.has(f) && !isLocalOnly(f));
  if (orphans.length) {
    errors.push(`${label}: 本地有 ${orphans.length} 个非上游页且不在自写白名单 ⇒ ${orphans.join(", ")}（伪造正文嫌疑）`);
  }
  return { errors, pages: expected.size, missing: missing.length, raw: rawFiles.length };
}

/** forge 老判据（manifest chapters）；保留导出名以兼容既有夹具。 */
export function checkTree({ version, entry, rawFiles }) {
  const mk = entry?.mkdocs;
  if (!mk?.available) return { errors: [], skipped: true, version };
  const r = compareInventory({
    label: `forge ${version}`,
    source: mk.chaptersSource || "nav",
    pages: Array.isArray(mk.chapters) ? mk.chapters : [],
    rawFiles,
    fold: forgeRawName,
  });
  return { ...r, version, errors: r.errors.map((e) => e) };
}

const isLocalOnly = (name) => LOCAL_ONLY_PATTERNS.some((re) => re.test(name));
const readJson = (file) => JSON.parse(readFileSync(file, "utf8"));
const listRaw = (dir) =>
  existsSync(dir)
    ? readdirSync(dir)
        .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
        .sort()
    : [];

/** 快照文件本身不合规（缺 / 解析失败 / truncated / 来源不对）在这里判，返回 null 表示「该档不在此门覆盖面」。 */
function checkSnapshotTree({ platform, version, treeDir, snapshotName, expectSource, allowEmpty }) {
  const snapPath = join(treeDir, snapshotName);
  const rawDir = join(treeDir, "raw");
  if (!existsSync(snapPath)) {
    return { errors: [`${platform} ${version}: 缺 ${snapshotName} ⇒ 该档没接上游清单（跑 fetch-${platform}-docs.js --inventory-only --version=${version} 生成）`], raw: listRaw(rawDir).length };
  }
  let snap;
  try {
    snap = readJson(snapPath);
  } catch (e) {
    return { errors: [`${platform} ${version}: ${snapshotName} 解析失败（${e.message}）`] };
  }
  if (snap.truncated === true) {
    return { errors: [`${platform} ${version}: 上游清单快照 truncated=true ⇒ 清单不完整，禁止据此断言「无缺页」，重新枚举上游` ] };
  }
  const r = compareInventory({
    label: `${platform} ${version}`,
    source: snap.source ?? expectSource + "?",
    pages: Array.isArray(snap.pages) ? snap.pages : [],
    rawFiles: listRaw(rawDir),
    fold: platform === "fabric" ? fabricRawName : neoforgeRawName,
    allowEmpty,
  });
  if (Number.isInteger(snap.pageCount) && snap.pageCount !== (snap.pages?.length ?? -1)) {
    r.errors.push(`${platform} ${version}: 快照自述 pageCount=${snap.pageCount} ≠ pages 实数 ${snap.pages?.length ?? "?"} ⇒ 快照被手改或写入中断`);
  }
  if (snap.source !== expectSource) {
    r.errors.push(`${platform} ${version}: source=${JSON.stringify(snap.source)}（应为 ${expectSource}）⇒ 上游枚举腿没真跑通`);
  }
  return { ...r, version: snap.version ?? version };
}

function realRun() {
  const problems = [];
  let checked = 0;
  let emptyOk = 0;

  // 1) forge —— manifest 的 search_index 清单
  const manifestPath = join(DATA, "forge-versions-manifest.json");
  if (existsSync(manifestPath)) {
    const manifest = readJson(manifestPath);
    for (const [version, entry] of Object.entries(manifest.versions || {})) {
      if (!entry?.mkdocs?.available) continue;
      const rawDir = join(DATA, `forge_${version}`, "forge-docs", version, "raw");
      if (!existsSync(rawDir)) {
        problems.push(`forge ${version}: 无 raw 目录 ${rawDir.replace(DATA + "/", "")}`);
        continue;
      }
      const r = checkTree({ version, entry, rawFiles: listRaw(rawDir) });
      if (r.skipped) continue;
      checked++;
      problems.push(...r.errors);
      if (!r.errors.length) console.log(`  ok forge ${version}: 上游 ${r.pages} 页 / 本地 raw ${r.raw} 页`);
    }
  } else {
    problems.push("forge: 缺 forge-versions-manifest.json");
  }

  // 2) neoforge / fabric —— 各自的上游清单快照
  const legs = [
    { platform: "neoforge", prefix: "neoforge_", docs: "neoforge-docs", snapshot: "upstream-sitemap.json", expectSource: "sitemap", allowEmpty: false },
    { platform: "fabric", prefix: "fabric_", docs: "fabric-docs", snapshot: "upstream-tree.json", expectSource: "github_trees", allowEmpty: true },
  ];
  for (const leg of legs) {
    const dirs = readdirSync(DATA)
      .filter((d) => d.startsWith(leg.prefix) && d.slice(leg.prefix.length) !== "versions-manifest.json")
      .map((d) => d.slice(leg.prefix.length))
      .filter((v) => /^[0-9]/.test(v))
      .sort();
    for (const version of dirs) {
      const treeDir = join(DATA, `${leg.prefix}${version}`, leg.docs, version);
      if (!existsSync(treeDir)) continue; // 整棵 docs 树都没建 ⇒ 不在本门覆盖面（另有 PACK/语料门管）
      const r = checkSnapshotTree({
        platform: leg.platform,
        version,
        treeDir,
        snapshotName: leg.snapshot,
        expectSource: leg.expectSource,
        allowEmpty: leg.allowEmpty,
      });
      checked++;
      problems.push(...r.errors);
      if (r.emptyUpstream) emptyOk++;
      if (!r.errors.length) {
        console.log(
          `  ok ${leg.platform} ${version}: ${r.emptyUpstream ? "上游确实无该版文档树" : `上游 ${r.pages} 页 / 本地 raw ${r.raw} 页`}`,
        );
      }
    }
  }

  if (!checked) {
    console.error("FAIL: 一档都没核（清单里 0 个可核档）⇒ 空转不算通过");
    return 1;
  }
  if (problems.length) {
    console.error(`FAIL: ${problems.length} 条`);
    problems.forEach((p) => console.error("  - " + p));
    return 1;
  }
  console.log(`PASS: ${checked} 档语料与上游页面清单一致（其中 ${emptyOk} 档上游确实无文档树）`);
  return 0;
}

function selfTest() {
  // 夹具须 ≥ MIN_CHAPTERS，否则「干净」样本会先撞残表判据（2026-09-21 第一版就栽在这）；
  // 本地文件名一律由 pages 按抓取器的折叠规则推，避免夹具自身与实际判据分叉。
  const base = ["index", "concepts/registries", "items/loot_tables", "models/advanced/imodel"];
  const chapters = [...base, ...Array.from({ length: 20 }, (_, i) => `filler/page${i}`)];
  const ok = { mkdocs: { available: true, chaptersSource: "search_index", chapters } };
  const files = [...chapters.map(forgeRawName), "primer_1_20.md"];
  const cases = [
    ["干净集合应放行", { label: "forge 1.20.1", source: "search_index", pages: chapters, rawFiles: files, fold: forgeRawName }, 0],
    ["缺页必红", { label: "forge 1.20.1", source: "search_index", pages: chapters, rawFiles: files.filter((f) => f !== "models_advanced_imodel.md"), fold: forgeRawName }, 1],
    ["站点首页缺必红", { label: "forge 1.20.1", source: "search_index", pages: chapters, rawFiles: files.filter((f) => f !== "index.md"), fold: forgeRawName }, 1],
    ["空清单不得空转放行", { label: "x", source: "search_index", pages: [], rawFiles: [], fold: forgeRawName }, 1],
    ["残表（<20 页）不得放行", { label: "x", source: "search_index", pages: ["a", "b"], rawFiles: ["a.md", "b.md"], fold: forgeRawName }, 1],
    ["导航来源必须点名", { label: "x", source: "nav", pages: chapters, rawFiles: files, fold: forgeRawName }, 1],
    ["非白名单孤儿页必红（伪造嫌疑）", { label: "x", source: "search_index", pages: chapters, rawFiles: [...files, "made_up_page.md"], fold: forgeRawName }, 1],
    ["自写 primer 不得算孤儿", { label: "x", source: "search_index", pages: chapters, rawFiles: [...chapters.map(forgeRawName), "primer_1_20.md"], fold: forgeRawName }, 0],
    ["下划线页名不得被解折叠成缺页", { label: "x", source: "search_index", pages: chapters, rawFiles: files.map((f) => f.replace("items_loot_tables", "items/loot/tables")), fold: forgeRawName }, 1],
    // —— 新两腿的判据 ——
    ["fabric：连字符必须原样保留（neoforge 折叠会误判缺页）", { label: "fabric 1.21.1", source: "github_trees", pages: ["develop/tutorials/create-a-tool.md"], rawFiles: ["develop_tutorials_create-a-tool.md"], fold: fabricRawName }, 1],
    ["fabric：上游确实无文档树 + 本地也无页 ⇒ 放行", { label: "fabric 1.18.2", source: "github_trees", pages: [], rawFiles: [], fold: fabricRawName, allowEmpty: true }, 0],
    ["fabric：空清单却盘上有正文 ⇒ 必红", { label: "fabric 1.18.2", source: "github_trees", pages: [], rawFiles: ["develop_invented.md"], fold: fabricRawName, allowEmpty: true }, 1],
    ["neoforge：chapters-only 降级来源必红", { label: "neoforge 1.21.1", source: "chapters-only(fallback)", pages: chapters, rawFiles: files, fold: neoforgeRawName }, 1],
    ["neoforge：折叠须把连字符也换下划线", { label: "neoforge 1.21.1", source: "sitemap", pages: ["getting-started/first-mods"], rawFiles: ["getting_started_first_mods.md"], fold: neoforgeRawName }, 1],
  ];
  let failed = 0;
  for (const [name, arg, wantErrors] of cases) {
    const got = compareInventory(arg).errors.length > 0 ? 1 : 0;
    const pass = got === wantErrors;
    if (!pass) failed++;
    console.log(`${pass ? "ok  " : "FAIL"} ${name}（期望 ${wantErrors ? "红" : "绿"}，实得 ${got ? "红" : "绿"}）`);
  }
  // 快照层的四类漂移：缺文件 / truncated / pageCount 自相矛盾 / source 不对，
  // 都不在 compareInventory 的入参里（是快照文件本身的问题），必须在 helper 里成立。
  const snapCases = [
    snapshotCase("缺快照必红", undefined, true),
    snapshotCase("truncated 必红", { source: "github_trees", pages: ["a"], truncated: true }, true),
    snapshotCase("pageCount 与 pages 不符必红", { source: "github_trees", pages: ["a", "b"], pageCount: 9 }, true),
    snapshotCase("source 不对必红", { source: "chapters", pages: ["a"], pageCount: 1 }, true),
  ];
  const failedSnap = snapCases.filter((x) => !x).length;
  if (failed) {
    console.error(`SELFTEST FAIL: ${failed}/${cases.length} 组清单夹具判错`);
    return 1;
  }
  if (failedSnap) {
    console.error(`SELFTEST FAIL: ${failedSnap}/${snapCases.length} 组快照夹具不红 ⇒ 门是装饰`);
    return 1;
  }
  console.log(`SELFTEST PASS: ${cases.length} 组清单夹具 + ${snapCases.length} 组快照夹具`);
  return 0;
}

/** 在临时目录里搭一个假的 fabric docs 树，验 checkSnapshotTree 真会红（不写仓库）。 */
function snapshotCase(name, snapshotObj, wantRed) {
  const dir = join(mkdtempSync(join(tmpdir(), "mc-skill-upstream-")), "t");
  mkdirSync(join(dir, "raw"), { recursive: true });
  if (snapshotObj) writeFileSync(join(dir, "upstream-tree.json"), JSON.stringify(snapshotObj), "utf8");
  const r = checkSnapshotTree({
    platform: "fabric",
    version: "9.9.9",
    treeDir: dir,
    snapshotName: "upstream-tree.json",
    expectSource: "github_trees",
    allowEmpty: false,
  });
  rmSync(dir, { recursive: true, force: true });
  const red = r.errors.length > 0;
  const pass = red === wantRed;
  console.log(`${pass ? "ok  " : "FAIL"} 快照夹具 ${name}（期望 ${wantRed ? "红" : "绿"}，实得 ${red ? "红" : "绿"}）`);
  return pass;
}

if (SELFTEST) process.exitCode = selfTest();
else process.exitCode = realRun();
