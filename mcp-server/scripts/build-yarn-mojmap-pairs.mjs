#!/usr/bin/env node
/**
 * build-yarn-mojmap-pairs — 建 **Yarn ↔ Mojmap 类名对照**产物（A7：把一次性生成器提级入库）。
 *
 * 为什么要有它（台账 `skill-mappings-value-matches-code`，两个 open 之一）：
 *   `assert-skill-mappings-key.mjs` 的第一腿只判「有围栏代码的 Skill 声明了 `mappings:` 键」，
 *   判不了**键值跟正文实名是否一致** —— 那需要 mojmap 侧 `client.txt`（`.gitignore` +
 *   许可不可再分发），只能在本地现拉。本脚本就是那条腿的数据生产者：
 *     mojmap 侧：`data/forge_<v>/mappings/client.txt`（已在盘则直接用）
 *     yarn   侧：`data/fabric_<v>/mappings/yarn-mappings.sqlite` 的 `classes(named, official)`；
 *               **无 fabric 档的版本**（1.20.6 / 1.21.5：neoforge 有档、fabric 未建档）回落
 *               `--yarn-tiny-dir` / `$MC_SKILL_CACHE[/../]mappings` 里的 `yarn-<v>-mergedv2.tiny`
 *               （tiny v2 类行 `c <official=obf> <intermediary> <named>`，本文件自解析；
 *                与 sqlite 版在 1.20.4 上逐条全等：7782/7782 same、0 diff、0 单边，2026-09-25 实测）
 *     join 键 ：obf 短名（`client.txt` 的 `com.foo.Bar -> enr:` 右侧 == 上两者的 official 列）
 *   缺失的 client.txt 走仓库自带的 `ensureMojangClientMappings` 现拉到**产物目录**下（gitignored 之外）。
 *
 * 产物（**生成器从不写仓库**）：`<out>/yarn-mojmap-<v>.json`（每档一份）+ `<out>/index.json`（版本 → 文件 / 条数 / as-of）。
 * 默认 `<out>` = `$MC_SKILL_CACHE/yarn-mojmap-pairs`；未设该环境变量时退到 `os.tmpdir()` 的一次性目录
 * （打印实际落点，别猜）。
 * 2026-09-25 裁定：`client.txt` 本体继续 gitignored，但**按它 join 出的派生对照表**由人工一次性发布到
 * `data/_yarn-mojmap-pairs/`（**15 档 / 112,971 类名对**；同日二次发布把 1.20.6 / 1.21.5 补进，见该目录
 * `yarn-mojmap-pairs-provenance.json` 的 `extendedNote` 与字节 sha），
 * 读侧两个 gate（`assert-skill-mappings-key.mjs` leg2 / `assert-cross-layer-names.mjs`）默认就取那份 ⇒
 * 干净 clone 也能判。本脚本的默认输出**不变**（仍只写缓存），要更新仓库副本按 provenance 的 refreshHint 人工复制。
 *
 * 用法：
 *   node scripts/build-yarn-mojmap-pairs.mjs                 # 全部 15 档（缺的 client.txt 现拉；要联网）
 *   node scripts/build-yarn-mojmap-pairs.mjs --offline       # 只做本地已有 client.txt 的档，缺的记 skip
 *   node scripts/build-yarn-mojmap-pairs.mjs --versions=1.20.1,1.21.11
 *   node scripts/build-yarn-mojmap-pairs.mjs --out=<dir> --root=<repo> [--yarn-tiny-dir=<dir>]
 *   注：1.20.6 / 1.21.5 的 yarn 侧只从 mergedv2.tiny 来（这两版无 fabric 档）。
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { fileURLToPath, pathToFileURL } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ARGV = process.argv.slice(2);
const argVal = (name) => {
  const hit = ARGV.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : null;
};
const OFFLINE = ARGV.includes("--offline");
const ROOT = path.resolve(argVal("root") ?? path.join(HERE, "..", ".."));
const OUT = path.resolve(
  argVal("out") ??
    (process.env.MC_SKILL_CACHE
      ? path.join(process.env.MC_SKILL_CACHE, "yarn-mojmap-pairs")
      : path.join(os.tmpdir(), "mc-skill-yarn-mojmap-pairs")),
);
// 15 档：1.20.6 / 1.21.5 是「neoforge 有档、fabric 未建档」的补档，yarn 侧走 mergedv2.tiny 回落。
const ALL_VERSIONS = [
  "1.14.4", "1.16.5", "1.17.1", "1.18.2", "1.19.4", "1.20.1", "1.20.4",
  "1.20.6", "1.21.1", "1.21.3", "1.21.4", "1.21.5", "1.21.8", "1.21.10", "1.21.11",
];
const VERSIONS = argVal("versions") ? argVal("versions").split(",").map((s) => s.trim()).filter(Boolean) : ALL_VERSIONS;
/** 无 fabric 档版本的 yarn tiny 回落目录（显式参数优先；env 两种粒度都试）。 */
const YARN_TINY_DIRS = [
  argVal("yarn-tiny-dir"),
  process.env.MC_SKILL_CACHE ? path.join(process.env.MC_SKILL_CACHE, "mappings") : null,
  process.env.MC_SKILL_CACHE ? path.join(process.env.MC_SKILL_CACHE, "..", "mappings") : null,
]
  .filter(Boolean)
  .map((d) => path.resolve(d));

/** `client.txt` → `obf -> {mojmap, fqcn}`（只看顶层类行：行首非空白、非注释、`X -> y:`）。 */
export function mojmapClassPairs(text) {
  const out = new Map();
  for (const line of String(text).split(/\r?\n/)) {
    if (!line || line.startsWith("#") || /^\s/.test(line)) continue;
    const m = /^([\w.$]+)\s*->\s*([\w$]+):?$/.exec(line.trimEnd());
    if (!m) continue;
    const fqcn = m[1];
    const obf = m[2];
    if (!out.has(obf)) out.set(obf, { mojmap: fqcn.split(".").pop(), fqcn });
  }
  return out;
}

/** yarn sqlite → `obf -> {yarn, fqcn}`；库不在/读不了返回 null（调用方记 skip）。 */
export function yarnClassPairs(dbPath) {
  if (!fs.existsSync(dbPath)) return null;
  const db = new DatabaseSync(dbPath, { readOnly: true });
  try {
    const out = new Map();
    for (const r of db.prepare("select named, official from classes").all()) {
      const obf = String(r.official ?? "");
      if (!obf) continue;
      const named = String(r.named);
      if (!out.has(obf)) out.set(obf, { yarn: named.split("/").pop(), fqcn: named });
    }
    return out;
  } finally {
    db.close();
  }
}

/**
 * yarn mergedv2 tiny（v2）→ `obf -> {yarn, fqcn}`。
 * 类行 = `c\t<ns0>\t<ns1>\t…`，按头行 `tiny\t2\t0\t<ns0>\t…` 定位 official / named 列；只取类级。
 * **不复用 `_lib/parse-tiny.mjs`**：它是 v1 语义（`CLASS`/`METHOD` 大写行），对 v2 会把头的 "2"/"0"
 * 当命名空间、类行全丢（2026-09-25 实测该解析器对 yarn-1.20.6-mergedv2.tiny 得 classes=0）。
 */
export function mergedTinyClassPairs(text) {
  const out = new Map();
  let iOfficial = -1;
  let iNamed = -1;
  for (const line of String(text).split(/\r?\n/)) {
    if (!line) continue;
    if (line.startsWith("tiny\t")) {
      const ns = line.split("\t").slice(3);
      iOfficial = ns.indexOf("official");
      iNamed = ns.indexOf("named");
      continue;
    }
    if (!line.startsWith("c\t") || iOfficial < 0 || iNamed < 0) continue;
    const cols = line.split("\t");
    const obf = cols[1 + iOfficial];
    const named = cols[1 + iNamed];
    if (!obf || !named) continue;
    if (!out.has(obf)) out.set(obf, { yarn: named.split("/").pop(), fqcn: named });
  }
  return out;
}

/** 在候选目录里找 `yarn-<v>-mergedv2.tiny`；找不到返回 null。 */
export function findMergedTiny(dirs, version) {
  for (const d of dirs) {
    try {
      if (fs.readdirSync(d).includes(`yarn-${version}-mergedv2.tiny`)) {
        return path.join(d, `yarn-${version}-mergedv2.tiny`);
      }
    } catch {
      /* 目录不存在：继续 */
    }
  }
  return null;
}

/** 两份映射按 obf join；`mojmap !== yarn` 的才算「跨映射冲突对」，但产物保留全部对（含同名）。 */
export function joinPairs(moj, yarn) {
  const pairs = [];
  for (const [obf, m] of moj) {
    const y = yarn.get(obf);
    if (y) pairs.push({ obf, mojmap: m.mojmap, yarn: y.yarn, mojFqcn: m.fqcn, yarnFqcn: y.fqcn });
  }
  pairs.sort((a, b) => a.mojmap.localeCompare(b.mojmap));
  return pairs;
}

async function main() {
  const { ensureMojangClientMappings } = await import(
    pathToFileURL(path.join(HERE, "_lib", "ensure-mojang-mappings.mjs")).href
  );
  fs.mkdirSync(OUT, { recursive: true });
  console.log(`build-yarn-mojmap-pairs: root=${ROOT}`);
  console.log(`  产物目录 = ${OUT}`);
  if (YARN_TINY_DIRS.length) console.log(`  mergedv2.tiny 回落目录 = ${YARN_TINY_DIRS.join(" ; ")}`);
  const rows = [];
  const index = { asOf: new Date().toISOString(), dir: OUT, versions: {} };
  for (const v of VERSIONS) {
    const repoDir = path.join(ROOT, "data", `forge_${v}`, "mappings");
    const localClient = path.join(repoDir, "client.txt");
    const yarnDb = path.join(ROOT, "data", `fabric_${v}`, "mappings", "yarn-mappings.sqlite");
    let yarn = yarnClassPairs(yarnDb);
    let yarnNote = `data/fabric_${v}/mappings/yarn-mappings.sqlite`;
    if (!yarn) {
      const tiny = findMergedTiny(YARN_TINY_DIRS, v);
      if (tiny) {
        yarn = mergedTinyClassPairs(fs.readFileSync(tiny, "utf8"));
        yarnNote = `mergedv2.tiny @ ${tiny}`;
      }
    }
    if (!yarn) {
      rows.push({ version: v, mojmap: "-", yarn: "无 yarn 源", pairs: 0, note: path.relative(ROOT, yarnDb) });
      index.versions[v] = { file: null, count: 0, skipped: "yarn 侧缺失（sqlite 不在盘上且未找到 mergedv2.tiny）" };
      continue;
    }
    let mojFile = fs.existsSync(localClient) ? localClient : null;
    let note = mojFile ? "data/forge_<v> 本地" : "";
    if (!mojFile && !OFFLINE) {
      const ensured = await ensureMojangClientMappings(path.join(OUT, "mojmap", v), v);
      mojFile = ensured.path;
      note = mojFile ? (ensured.downloaded ? "现拉（launcher meta）" : "产物目录已有") : `拉取失败：${ensured.error ?? "?"}`;
    } else if (!mojFile && OFFLINE) {
      note = "offline：本地无 client.txt，跳过";
    }
    if (!mojFile) {
      rows.push({ version: v, mojmap: "无", yarn: "有", pairs: 0, note });
      index.versions[v] = { file: null, count: 0, skipped: note };
      continue;
    }
    const moj = mojmapClassPairs(fs.readFileSync(mojFile, "utf8"));
    const pairs = joinPairs(moj, yarn);
    const cross = pairs.filter((p) => p.mojmap !== p.yarn).length;
    const file = path.join(OUT, `yarn-mojmap-${v}.json`);
    fs.writeFileSync(file, JSON.stringify({ version: v, count: pairs.length, crossMapping: cross, pairs }, null, 1), "utf8");
    rows.push({ version: v, mojmap: "有", yarn: "有", pairs: pairs.length, cross, note: path.basename(file) });
    index.versions[v] = { file: path.basename(file), count: pairs.length, crossMapping: cross, source: note, yarnSource: yarnNote };
  }
  fs.writeFileSync(path.join(OUT, "index.json"), JSON.stringify(index, null, 1), "utf8");
  console.table(rows);
  const total = rows.reduce((n, r) => n + (r.pairs ?? 0), 0);
  const done = rows.filter((r) => (r.pairs ?? 0) > 0).length;
  console.log(`build-yarn-mojmap-pairs: ${done}/${VERSIONS.length} 档出表，合计 ${total} 对；index.json 已写 ${path.join(OUT, "index.json")}`);
  if (done === 0) {
    console.error("一档都没出表 ⇒ 判据腿会退化成 skipped；检查 client.txt / yarn sqlite 落点");
    process.exit(1);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((e) => {
    console.error(`build-yarn-mojmap-pairs 无法完成：${e?.message ?? e}`);
    process.exit(2);
  });
}
