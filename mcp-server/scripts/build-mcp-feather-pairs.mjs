#!/usr/bin/env node
/**
 * build-mcp-feather-pairs — 建 **MCP(srg/tsrg) ↔ Feather(Ornithe)** 类名对照产物
 * （老档 1.7.10–1.13.2 的**第三体系**；A4h 的姊妹件。缘起/许可/实测见
 *  `mcp-server/docs/mcmap-linkie-absorption.md` §A4g/A4h/A4i）。
 *
 * 数据源（两侧上游直连）：
 *   MCP 侧：`data/forge_<v>/mappings/joined.srg`（1.7.10–1.12.2）或 `joined.tsrg`（1.13.2）
 *   Feather 侧：`meta.ornithemc.net/v3/versions/feather` 取各档最高 build 的 maven 坐标
 *           （`net.ornithemc:feather-gen2:<v>+build.N`）→ `-mergedv2.jar` → 内存解 `mappings/mappings.tiny`
 *           （tiny v2，列序 official/intermediary/named —— 含 obf；`-v2.jar` 无 obf，不可用）
 *   join 键：obf 短名（2026-09-26 实测 1.12.2 = 3344/3344 = 100%；名字差异 FQCN 97.9% / 简名 91.9%）
 *
 * 许可：Feather = **CC0**（OrnitheMC/feather：「open, unencumbered … Creative Commons Zero」）。
 *
 * 产物（**从不写仓库**）：`<out>/mcp-feather-<v>.json` + `<out>/index.json`。
 * 默认 `<out>` = `$MC_SKILL_CACHE/mcp-feather-pairs`；无该 env 则退 `os.tmpdir()/mc-skill-mcp-feather-pairs`。
 * 落盘走 `scripts/_lib/write-guard.mjs` 的 scratch 出口（仓库外专用，落仓库即 throw）⇒ 过 S20 无需登记豁免。
 *
 * 用法：
 *   node mcp-server/scripts/build-mcp-feather-pairs.mjs
 *   node mcp-server/scripts/build-mcp-feather-pairs.mjs --versions=1.12.2 --out=<dir> [--root=<repo>]
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { scratchMkdirAll, scratchWriteText } from "../../scripts/_lib/write-guard.mjs";
import { srgClassPairs, tsrgClassPairs, readZipEntry } from "./build-mcp-legacyyarn-pairs.mjs";
import { mergedTinyClassPairs } from "./build-yarn-mojmap-pairs.mjs";

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
      ? path.join(process.env.MC_SKILL_CACHE, "mcp-feather-pairs")
      : path.join(os.tmpdir(), "mc-skill-mcp-feather-pairs")),
);
/** 有类级桥的老档（srg → 1.7.10–1.12.2；tsrg → 1.13.2）。 */
const SOURCES = {
  "1.7.10": { file: "joined.srg", kind: "srg" },
  "1.8.9": { file: "joined.srg", kind: "srg" },
  "1.9.4": { file: "joined.srg", kind: "srg" },
  "1.10.2": { file: "joined.srg", kind: "srg" },
  "1.11.2": { file: "joined.srg", kind: "srg" },
  "1.12.2": { file: "joined.srg", kind: "srg" },
  "1.13.2": { file: "joined.tsrg", kind: "tsrg" },
};
const VERSIONS = argVal("versions") ? argVal("versions").split(",").map((s) => s.trim()).filter(Boolean) : Object.keys(SOURCES);
const FEATHER_META = "https://meta.ornithemc.net/v3/versions/feather";
const FEATHER_MAVEN = "https://maven.ornithemc.net/releases";
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

function joinPairs(mcp, feather) {
  const pairs = [];
  for (const [obf, m] of mcp) {
    const f = feather.get(obf);
    if (f) pairs.push({ obf, mcp: m.mcp, feather: f.yarn, mcpFqcn: m.fqcn, featherFqcn: f.fqcn });
  }
  pairs.sort((a, b) => a.mcp.localeCompare(b.mcp));
  return pairs;
}

async function main() {
  scratchMkdirAll(OUT);
  console.log(`build-mcp-feather-pairs: root=${ROOT}`);
  console.log(`  产物目录 = ${OUT}`);
  const meta = JSON.parse(await getText(FEATHER_META));
  const rows = [];
  const index = { asOf: new Date().toISOString(), dir: OUT, family: "mcp-feather", versions: {} };
  for (const v of VERSIONS) {
    const src = SOURCES[v];
    if (!src) {
      index.versions[v] = { file: null, count: 0, skipped: "不在 SOURCES（无 MCP 类级桥）" };
      continue;
    }
    const mcpFile = path.join(ROOT, "data", `forge_${v}`, "mappings", src.file);
    if (!fs.existsSync(mcpFile)) {
      rows.push({ version: v, mcp: "无", feather: "-", pairs: 0, note: src.file });
      index.versions[v] = { file: null, count: 0, skipped: `MCP 侧缺 ${src.file}` };
      continue;
    }
    const mcp = src.kind === "srg" ? srgClassPairs(fs.readFileSync(mcpFile, "utf8")) : tsrgClassPairs(fs.readFileSync(mcpFile, "utf8"));
    const builds = meta
      .filter((m) => m.gameVersion === v && typeof m.build === "number")
      .sort((a, b) => a.build - b.build);
    const pick = builds[builds.length - 1];
    if (!pick) {
      rows.push({ version: v, mcp: "有", feather: "无该档", pairs: 0, note: "feather meta 里没有" });
      index.versions[v] = { file: null, count: 0, skipped: "feather 无该 MC 版本" };
      continue;
    }
    const coord = String(pick.maven); // net.ornithemc:feather-gen2:<v>+build.N
    const [group, artifact, ver] = coord.split(":");
    const url = `${FEATHER_MAVEN}/${group.replace(/\./g, "/")}/${artifact}/${ver}/${artifact}-${ver}-mergedv2.jar`;
    let feather = null;
    try {
      const jar = await getBuffer(url);
      const tiny = readZipEntry(jar, "mappings/mappings.tiny");
      if (tiny) feather = mergedTinyClassPairs(tiny.toString("utf8").replace(/^\uFEFF/, ""));
    } catch (e) {
      rows.push({ version: v, mcp: "有", feather: "拉取失败", pairs: 0, note: e?.message ?? String(e) });
      index.versions[v] = { file: null, count: 0, skipped: `feather 拉取/解析失败：${e?.message ?? e}` };
      continue;
    }
    if (!feather || feather.size === 0) {
      rows.push({ version: v, mcp: "有", feather: "空", pairs: 0, note: ver });
      index.versions[v] = { file: null, count: 0, skipped: `tiny 解析为 0 类：${ver}` };
      continue;
    }
    const pairs = joinPairs(mcp, feather);
    const file = path.join(OUT, `mcp-feather-${v}.json`);
    scratchWriteText(file, JSON.stringify({ version: v, count: pairs.length, featherBuild: ver, mcpFile: `data/forge_${v}/mappings/${src.file}`, pairs }, null, 1));
    rows.push({ version: v, mcp: "有", feather: "有", pairs: pairs.length, note: ver });
    index.versions[v] = { file: path.basename(file), count: pairs.length, featherBuild: ver, featherUrl: url, mcpSource: `data/forge_${v}/mappings/${src.file}` };
  }
  scratchWriteText(path.join(OUT, "index.json"), JSON.stringify(index, null, 1));
  console.table(rows);
  const total = rows.reduce((n, r) => n + (r.pairs ?? 0), 0);
  const done = rows.filter((r) => (r.pairs ?? 0) > 0).length;
  console.log(`build-mcp-feather-pairs: ${done}/${VERSIONS.length} 档出表，合计 ${total} 对；index.json 已写 ${path.join(OUT, "index.json")}`);
  if (done === 0) {
    console.error("一档都没出表 ⇒ 检查 forge<v> 的 srg/tsrg 与 ornithe maven 可达性");
    process.exit(1);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((e) => {
    console.error(`build-mcp-feather-pairs 无法完成：${e?.message ?? e}`);
    process.exit(2);
  });
}
