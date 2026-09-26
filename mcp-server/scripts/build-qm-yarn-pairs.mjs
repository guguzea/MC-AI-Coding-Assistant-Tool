#!/usr/bin/env node
/**
 * build-qm-yarn-pairs — 建 **QuiltMappings(QM) ↔ Yarn** 类名对照产物
 * （补 quilt 档的"另一命名体系"；A4h 的姊妹件。缘起/许可/实测见
 *  `mcp-server/docs/mcmap-linkie-absorption.md` §A4g/A4h/A4i）。
 *
 * 数据源（两侧上游直连）：
 *   QM 侧：`maven.quiltmc.org/repository/release` 的 `org/quiltmc/quilt-mappings`，取各档最高 build 的
 *          `quilt-mappings-<v>+build.N-mergedv2.jar` → 内存解 `mappings/mappings.tiny`
 *          （tiny v2，列序 **official/hashed/named** —— 含 obf；`-v2.jar` 无 obf，不可用）
 *   Yarn 侧：`data/fabric_<v>/mappings/yarn-mappings.sqlite` 的 `classes(named, official)`
 *   join 键：obf 短名（2026-09-26 实测 1.21.11 = 9934/9935；名字差异 FQCN 55.4% / 简名 50.1%，
 *            差异集中在匿名/内部类：QM 给语义名（`GpuBuffer$Usage`）而 yarn 用哈希名（`$C_ahwvnalp`））
 *
 * 许可：QuiltMappings = **CC0-1.0**（QuiltMC/quilt-mappings 仓库 README 明示）。
 *
 * 版本集 = 本仓 quilt 档 ∩ fabric 档（QM 覆盖 1.18.2+）。
 *
 * 产物（**从不写仓库**）：`<out>/qm-yarn-<v>.json` + `<out>/index.json`。
 * 默认 `<out>` = `$MC_SKILL_CACHE/qm-yarn-pairs`；无该 env 则退 `os.tmpdir()/mc-skill-qm-yarn-pairs`。
 * 落盘走 `scripts/_lib/write-guard.mjs` 的 scratch 出口（仓库外专用，落仓库即 throw）⇒ 过 S20 无需登记豁免。
 *
 * 用法：
 *   node mcp-server/scripts/build-qm-yarn-pairs.mjs
 *   node mcp-server/scripts/build-qm-yarn-pairs.mjs --versions=1.21.11 --out=<dir> [--root=<repo>]
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { scratchMkdirAll, scratchWriteText } from "../../scripts/_lib/write-guard.mjs";
import { readZipEntry } from "./build-mcp-legacyyarn-pairs.mjs";
import { yarnClassPairs, mergedTinyClassPairs } from "./build-yarn-mojmap-pairs.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ARGV = process.argv.slice(2);
const argVal = (name) => {
  const hit = ARGV.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : null;
};
const ROOT = path.resolve(argVal("root") ?? path.join(HERE, "..", ".."));
const OUT = path.resolve(
  argVal("out") ??
    (process.env.MC_SKILL_CACHE
      ? path.join(process.env.MC_SKILL_CACHE, "qm-yarn-pairs")
      : path.join(os.tmpdir(), "mc-skill-qm-yarn-pairs")),
);
/** 本仓 quilt 档（QM 覆盖 1.18.2+；各档 fabric sqlite 均在盘）。 */
const DEFAULT_VERSIONS = ["1.18.2", "1.19.4", "1.20.1", "1.20.4", "1.21.1", "1.21.11"];
const VERSIONS = argVal("versions") ? argVal("versions").split(",").map((s) => s.trim()).filter(Boolean) : DEFAULT_VERSIONS;
const QM_META = "https://maven.quiltmc.org/repository/release/org/quiltmc/quilt-mappings/maven-metadata.xml";
const QM_REPO = "https://maven.quiltmc.org/repository/release/org/quiltmc/quilt-mappings";
const CURL = process.platform === "win32" ? "curl.exe" : "curl";

async function getBuffer(url) {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(30_000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return Buffer.from(await res.arrayBuffer());
  } catch (firstErr) {
    try {
      return execFileSync(CURL, ["-sL", "--ssl-no-revoke", url], { maxBuffer: 256 * 1024 * 1024 });
    } catch (secondErr) {
      throw new Error(`fetch 与 curl 双双失败：${firstErr?.message ?? firstErr} / ${secondErr?.message ?? secondErr}`);
    }
  }
}
const getText = async (url) => (await getBuffer(url)).toString("utf8");

function joinPairs(yarn, qm) {
  const pairs = [];
  for (const [obf, y] of yarn) {
    const q = qm.get(obf);
    if (q) pairs.push({ obf, yarn: y.yarn, quiltMappings: q.yarn, yarnFqcn: y.fqcn, qmFqcn: q.fqcn });
  }
  pairs.sort((a, b) => a.yarn.localeCompare(b.yarn));
  return pairs;
}

async function main() {
  scratchMkdirAll(OUT);
  console.log(`build-qm-yarn-pairs: root=${ROOT}`);
  console.log(`  产物目录 = ${OUT}`);
  const metaText = await getText(QM_META);
  const allBuilds = [...metaText.matchAll(/<version>([^<]+)<\/version>/g)].map((m) => m[1]);
  const rows = [];
  const index = { asOf: new Date().toISOString(), dir: OUT, family: "qm-yarn", versions: {} };
  for (const v of VERSIONS) {
    const yarnDb = path.join(ROOT, "data", `fabric_${v}`, "mappings", "yarn-mappings.sqlite");
    const yarn = yarnClassPairs(yarnDb);
    if (!yarn) {
      rows.push({ version: v, yarn: "无 sqlite", qm: "-", pairs: 0, note: path.relative(ROOT, yarnDb) });
      index.versions[v] = { file: null, count: 0, skipped: "fabric yarn sqlite 不在盘上" };
      continue;
    }
    const build = allBuilds
      .filter((x) => x.startsWith(`${v}+build.`))
      .sort((a, b) => Number(a.split("build.")[1]) - Number(b.split("build.")[1]))
      .pop();
    if (!build) {
      rows.push({ version: v, yarn: "有", qm: "无该档", pairs: 0, note: "qm metadata 里没有" });
      index.versions[v] = { file: null, count: 0, skipped: "QuiltMappings 无该 MC 版本" };
      continue;
    }
    const url = `${QM_REPO}/${build}/quilt-mappings-${build}-mergedv2.jar`;
    let qm = null;
    try {
      const jar = await getBuffer(url);
      const tiny = readZipEntry(jar, "mappings/mappings.tiny");
      if (tiny) qm = mergedTinyClassPairs(tiny.toString("utf8").replace(/^\uFEFF/, ""));
    } catch (e) {
      rows.push({ version: v, yarn: "有", qm: "拉取失败", pairs: 0, note: e?.message ?? String(e) });
      index.versions[v] = { file: null, count: 0, skipped: `QM 拉取/解析失败：${e?.message ?? e}` };
      continue;
    }
    if (!qm || qm.size === 0) {
      rows.push({ version: v, yarn: "有", qm: "空", pairs: 0, note: build });
      index.versions[v] = { file: null, count: 0, skipped: `tiny 解析为 0 类：${build}` };
      continue;
    }
    const pairs = joinPairs(yarn, qm);
    const file = path.join(OUT, `qm-yarn-${v}.json`);
    scratchWriteText(file, JSON.stringify({ version: v, count: pairs.length, qmBuild: build, yarnSource: `data/fabric_${v}/mappings/yarn-mappings.sqlite`, pairs }, null, 1));
    rows.push({ version: v, yarn: "有", qm: "有", pairs: pairs.length, note: build });
    index.versions[v] = { file: path.basename(file), count: pairs.length, qmBuild: build, qmUrl: url, yarnSource: `data/fabric_${v}/mappings/yarn-mappings.sqlite` };
  }
  scratchWriteText(path.join(OUT, "index.json"), JSON.stringify(index, null, 1));
  console.table(rows);
  const total = rows.reduce((n, r) => n + (r.pairs ?? 0), 0);
  const done = rows.filter((r) => (r.pairs ?? 0) > 0).length;
  console.log(`build-qm-yarn-pairs: ${done}/${VERSIONS.length} 档出表，合计 ${total} 对；index.json 已写 ${path.join(OUT, "index.json")}`);
  if (done === 0) {
    console.error("一档都没出表 ⇒ 检查 fabric yarn sqlite 与 quilt maven 可达性");
    process.exit(1);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((e) => {
    console.error(`build-qm-yarn-pairs 无法完成：${e?.message ?? e}`);
    process.exit(2);
  });
}
