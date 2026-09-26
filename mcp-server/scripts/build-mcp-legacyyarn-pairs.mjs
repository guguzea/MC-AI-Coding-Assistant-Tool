#!/usr/bin/env node
/**
 * build-mcp-legacyyarn-pairs — 建 **MCP(srg/tsrg) ↔ Legacy Yarn** 类名对照产物
 * （A4h：补 1.7.10–1.13.2 老档的「第二体系」缺口；缘起与实测见
 *  `mcp-server/docs/mcmap-linkie-absorption.md` §A4g/A4h）。
 *
 * 数据源（两侧上游直连，**不引任何第三方的表**）：
 *   MCP 侧：`data/forge_<v>/mappings/joined.srg`（老式 `CL: <obf> <fqcn>`）
 *           或 `joined.tsrg`（1.13.2，顶层 `<obf> <fqcn>` + 缩进成员行）
 *   Legacy Yarn 侧：`maven.legacyfabric.net` 的 `net/legacyfabric/yarn`，取该 MC 版本**最高 build**
 *           的 `-mergedv2.jar`（~250KB）→ 内存解出 `mappings/mappings.tiny`
 *           （tiny v2 列序 official/intermediary/named —— 含 obf；`-v2.jar` 无 obf，不可用）
 *   join 键：obf 短名（srg/tsrg 左列 == tiny 的 official 列；2026-09-25 实测 1.12.2 = 3344/3344 = 100%）
 *
 * 许可：Legacy-Fabric/yarn = **CC0-1.0**（README「开放、无附加限制」；与 FabricMC/yarn 同许可），
 *       MCP 侧 csv/srg 本仓已入库 —— 两侧均可入库。
 *
 * 产物（**从不写仓库**）：`<out>/mcp-legacyyarn-<v>.json` + `<out>/index.json`。
 * 默认 `<out>` = `$MC_SKILL_CACHE/mcp-legacyyarn-pairs`；无该 env 则退 `os.tmpdir()/mc-skill-mcp-legacyyarn-pairs`。
 * 落盘走 `scripts/_lib/write-guard.mjs` 的 scratch 出口（仓库外专用，落仓库即 throw）⇒ 过 S20 无需登记豁免。
 *
 * 联网：fetch 先、失败退 curl（本机 Node TLS 对部分域不可用；规矩与样板见 absorption §2 / releases.ts）。
 *
 * 用法：
 *   node mcp-server/scripts/build-mcp-legacyyarn-pairs.mjs
 *   node mcp-server/scripts/build-mcp-legacyyarn-pairs.mjs --versions=1.12.2 --out=<dir> [--root=<repo>]
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import zlib from "node:zlib";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { scratchMkdirAll, scratchWriteText } from "../../scripts/_lib/write-guard.mjs";
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
      ? path.join(process.env.MC_SKILL_CACHE, "mcp-legacyyarn-pairs")
      : path.join(os.tmpdir(), "mc-skill-mcp-legacyyarn-pairs")),
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
const LEGACY_YARN_META = "https://maven.legacyfabric.net/net/legacyfabric/yarn/maven-metadata.xml";
const CURL = process.platform === "win32" ? "curl.exe" : "curl";

/** 老式 srg → `obf -> {mcp, fqcn}`（只认 `CL: <obf> <fqcn>` 行）。 */
export function srgClassPairs(text) {
  const out = new Map();
  for (const line of String(text).split(/\r?\n/)) {
    const m = /^CL: (\S+) (\S+)$/.exec(line);
    if (!m) continue;
    if (!out.has(m[1])) out.set(m[1], { mcp: m[2].split("/").pop(), fqcn: m[2] });
  }
  return out;
}

/** 1.13.2 joined.tsrg → `obf -> {mcp, fqcn}`（顶层非缩进行；成员行以 tab 开头，跳过）。 */
export function tsrgClassPairs(text) {
  const out = new Map();
  for (const line of String(text).split(/\r?\n/)) {
    if (!line || line.startsWith("#") || /^\s/.test(line)) continue;
    const m = /^(\S+)\s+(\S+)\s*$/.exec(line);
    if (!m) continue;
    if (!out.has(m[1])) out.set(m[1], { mcp: m[2].split("/").pop(), fqcn: m[2] });
  }
  return out;
}

/**
 * 最小 zip 单条目读取：EOCD → 中央目录 → 局部头 → store/deflate。
 * scripts 面自包含（`src/decompile/zip-util.ts` 的同法 TS 版需 dist，生成器不依赖 dist）。
 * zip64 显式拒绝（与 `src/update/zip.ts` 同口径：不静默截断）。
 */
export function readZipEntry(buf, name) {
  let eocd = -1;
  for (let i = buf.length - 22; i >= Math.max(0, buf.length - 22 - 65535); i--) {
    if (buf.readUInt32LE(i) === 0x06054b50) {
      eocd = i;
      break;
    }
  }
  if (eocd < 0) throw new Error("zip：EOCD 未找到（不是有效 zip/jar）");
  const cdCount = buf.readUInt16LE(eocd + 10);
  const cdOffset = buf.readUInt32LE(eocd + 16);
  if (cdCount === 0xffff || cdOffset === 0xffffffff) throw new Error("zip：zip64 不支持（显式拒绝，不静默）");
  let p = cdOffset;
  for (let i = 0; i < cdCount; i++) {
    if (buf.readUInt32LE(p) !== 0x02014b50) throw new Error("zip：中央目录签名不符");
    const method = buf.readUInt16LE(p + 10);
    const compSize = buf.readUInt32LE(p + 20);
    const nameLen = buf.readUInt16LE(p + 28);
    const extraLen = buf.readUInt16LE(p + 30);
    const commentLen = buf.readUInt16LE(p + 32);
    const localOff = buf.readUInt32LE(p + 42);
    const entryName = buf.subarray(p + 46, p + 46 + nameLen).toString("utf8");
    if (entryName === name) {
      if (buf.readUInt32LE(localOff) !== 0x04034b50) throw new Error("zip：局部头签名不符");
      const dataStart = localOff + 30 + buf.readUInt16LE(localOff + 26) + buf.readUInt16LE(localOff + 28);
      const data = buf.subarray(dataStart, dataStart + compSize);
      if (method === 0) return Buffer.from(data);
      if (method === 8) return zlib.inflateRawSync(data);
      throw new Error(`zip：不支持的压缩方法 ${method}`);
    }
    p += 46 + nameLen + extraLen + commentLen;
  }
  return null;
}

/** fetch 先、失败退 curl（§2 规矩：本机 Node TLS 对部分域失败，不许改证书库/代理）。 */
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

function joinPairs(mcp, legacy) {
  const pairs = [];
  for (const [obf, m] of mcp) {
    const l = legacy.get(obf);
    if (l) pairs.push({ obf, mcp: m.mcp, legacyYarn: l.yarn, mcpFqcn: m.fqcn, legacyYarnFqcn: l.fqcn });
  }
  pairs.sort((a, b) => a.mcp.localeCompare(b.mcp));
  return pairs;
}

async function main() {
  scratchMkdirAll(OUT);
  console.log(`build-mcp-legacyyarn-pairs: root=${ROOT}`);
  console.log(`  产物目录 = ${OUT}`);
  const meta = await getText(LEGACY_YARN_META);
  const allBuilds = [...meta.matchAll(/<version>([^<]+)<\/version>/g)].map((m) => m[1]);
  const rows = [];
  const index = { asOf: new Date().toISOString(), dir: OUT, family: "mcp-legacyyarn", versions: {} };
  for (const v of VERSIONS) {
    const src = SOURCES[v];
    if (!src) {
      index.versions[v] = { file: null, count: 0, skipped: "不在 SOURCES（无 MCP 类级桥）" };
      continue;
    }
    const mcpFile = path.join(ROOT, "data", `forge_${v}`, "mappings", src.file);
    if (!fs.existsSync(mcpFile)) {
      rows.push({ version: v, mcp: "无", legacy: "-", pairs: 0, note: src.file });
      index.versions[v] = { file: null, count: 0, skipped: `MCP 侧缺 ${src.file}` };
      continue;
    }
    const mcp = src.kind === "srg" ? srgClassPairs(fs.readFileSync(mcpFile, "utf8")) : tsrgClassPairs(fs.readFileSync(mcpFile, "utf8"));
    const build = allBuilds
      .filter((x) => x.startsWith(`${v}+build.`))
      .sort((a, b) => Number(a.split("build.")[1]) - Number(b.split("build.")[1]))
      .pop();
    if (!build) {
      rows.push({ version: v, mcp: "有", legacy: "无该档", pairs: 0, note: "legacy yarn 版本表里没有" });
      index.versions[v] = { file: null, count: 0, skipped: "legacy yarn 无该 MC 版本" };
      continue;
    }
    const url = `https://maven.legacyfabric.net/net/legacyfabric/yarn/${build}/yarn-${build}-mergedv2.jar`;
    let legacy = null;
    try {
      const jar = await getBuffer(url);
      const tiny = readZipEntry(jar, "mappings/mappings.tiny");
      if (tiny) legacy = mergedTinyClassPairs(tiny.toString("utf8").replace(/^\uFEFF/, ""));
    } catch (e) {
      rows.push({ version: v, mcp: "有", legacy: "拉取失败", pairs: 0, note: e?.message ?? String(e) });
      index.versions[v] = { file: null, count: 0, skipped: `legacy 拉取/解析失败：${e?.message ?? e}` };
      continue;
    }
    if (!legacy || legacy.size === 0) {
      rows.push({ version: v, mcp: "有", legacy: "空", pairs: 0, note: build });
      index.versions[v] = { file: null, count: 0, skipped: `tiny 解析为 0 类：${build}` };
      continue;
    }
    const pairs = joinPairs(mcp, legacy);
    const file = path.join(OUT, `mcp-legacyyarn-${v}.json`);
    scratchWriteText(file, JSON.stringify({ version: v, count: pairs.length, legacyBuild: build, mcpFile: `data/forge_${v}/mappings/${src.file}`, pairs }, null, 1));
    rows.push({ version: v, mcp: "有", legacy: "有", pairs: pairs.length, note: build });
    index.versions[v] = { file: path.basename(file), count: pairs.length, legacyBuild: build, legacyUrl: url, mcpSource: `data/forge_${v}/mappings/${src.file}` };
  }
  scratchWriteText(path.join(OUT, "index.json"), JSON.stringify(index, null, 1));
  console.table(rows);
  const total = rows.reduce((n, r) => n + (r.pairs ?? 0), 0);
  const done = rows.filter((r) => (r.pairs ?? 0) > 0).length;
  console.log(`build-mcp-legacyyarn-pairs: ${done}/${VERSIONS.length} 档出表，合计 ${total} 对；index.json 已写 ${path.join(OUT, "index.json")}`);
  if (done === 0) {
    console.error("一档都没出表 ⇒ 检查 forge<v> 的 srg/tsrg 与 legacy maven 可达性");
    process.exit(1);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((e) => {
    console.error(`build-mcp-legacyyarn-pairs 无法完成：${e?.message ?? e}`);
    process.exit(2);
  });
}
