#!/usr/bin/env node
/**
 * 生成 paper 的版本档（形态参考 `paper/26.3`，但**不复制**那 10 条规则正文）。
 *
 * 为什么只出「适用性核查」一篇：
 *   26.3 那 10 条规则的每条出处都指向**当前文档**（tutorial）与 stable 签名面；Paper 的教程正文
 *   上游不按 MC 版本分（只有一份）。把 10 条原样复制到 1.21.4，等于声称「这些结论在该版成立」而没核过
 *   —— 那就是编造。本档只写**能核的**：26.3 的每条指针在本版签名面里还在不在（类/成员级机核），
 *   并把**真实行号**写进指针（不是抄 26.3 的行号）。
 *
 * 产物（每档三件）：
 *   `paper/<ver>/applicability.json`       机读数据（单一来源）
 *   `paper/<ver>/rules/00-applicability.md` 由该 json 渲染
 *   `paper/<ver>/rules.meta.json`           applicability 计数块（**合并写**：保留 runtimeProbe 等既有键）
 *
 * 判据实现在 `scripts/_lib/paper-applicability.mjs`（与出处门共用同一份，禁止各写一份）。
 *
 * 用法：`node scripts/gen-paper-version-packs.mjs [--write]`（默认 dry-run）。
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { emit, wantWrite } from "./_lib/write-guard.mjs";
import {
  PAPER_CORPUS_FACES,
  buildApplicabilityJson,
  collectPointers,
  computeForVersion,
  dedupePointers,
  listMd,
  renderApplicabilityMd,
} from "./_lib/paper-applicability.mjs";

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DATA = process.env.MC_SKILL_DATA ? resolve(process.env.MC_SKILL_DATA) : join(REPO, "data");
const RULES = join(REPO, "paper", "26.3", "rules");
const WRITE = wantWrite();
const CHECKED_FROM = "paper/26.3/rules/*.md";

/** 版本档 = 盘上有 `data/paper-api_<ver>` 签名面的那些（排序稳定）。 */
function versionsWithFace() {
  const out = [];
  for (const e of readdirSync(DATA, { withFileTypes: true })) {
    if (!e.isDirectory()) continue;
    const m = e.name.match(/^paper-api_(\d+\.\d+(?:\.\d+)*)$/);
    if (!m) continue;
    const v = m[1];
    if (existsSync(join(DATA, `paper-api_${v}`, "paper-javadoc", v, "processed"))) out.push(v);
  }
  const key = (v) => v.split(".").map((x) => parseInt(x, 10) || 0);
  return out.sort((a, b) => {
    const A = key(a);
    const B = key(b);
    for (let i = 0; i < Math.max(A.length, B.length); i++) {
      const d = (B[i] ?? 0) - (A[i] ?? 0);
      if (d) return d;
    }
    return 0;
  });
}

const dirs = Object.fromEntries(PAPER_CORPUS_FACES.map(([k, rel]) => [k, join(DATA, rel)]));
const indexes = Object.fromEntries(PAPER_CORPUS_FACES.map(([k, rel]) => [k, listMd(join(DATA, rel))]));
const pointers = dedupePointers(collectPointers(RULES, indexes, dirs));
console.log(
  `26.3 指针可解析 ${pointers.length} 处（去重后；签名面 ${pointers.filter((p) => p.srcKey !== "tut").length} / 教程面 ${pointers.filter((p) => p.srcKey === "tut").length}）`,
);

const versions = versionsWithFace();
if (!versions.length) console.log("data/ 下没有 paper-api_<ver> 签名面，无事可做。");

for (const ver of versions) {
  const computed = computeForVersion(ver, { dataRoot: DATA, pointers });
  if (!computed) {
    console.log(`${ver}: 无签名面，跳过`);
    continue;
  }
  const metaPath = join(REPO, "paper", ver, "rules.meta.json");
  const metaFile = existsSync(join(DATA, `paper-api_${ver}`, "paper-javadoc", ver, "meta.json"))
    ? join(DATA, `paper-api_${ver}`, "paper-javadoc", ver, "meta.json")
    : null;
  const asOf = metaFile ? JSON.parse(readFileSync(metaFile, "utf8")).asOfVersion : undefined;

  const data = buildApplicabilityJson(ver, {
    asOf,
    pages: computed.pages,
    shell: computed.shell,
    rows: computed.rows,
    counts: computed.counts,
    checkedFrom: CHECKED_FROM,
  });
  const md = renderApplicabilityMd(ver, data);

  // 合并写 meta：保留既有键（runtimeProbe / 说明性文字等），只刷新本生成器负责的字段。
  const existing = existsSync(metaPath) ? JSON.parse(readFileSync(metaPath, "utf8")) : {};
  const meta = {
    ...existing,
    face: "server",
    platform: "paper",
    minecraftVersion: ver,
    asOfVersion: asOf,
    upstream: existing.upstream ?? {
      javadoc: `https://jd.papermc.io/paper/${ver}/`,
      docs: "https://docs.papermc.io/",
      server: "https://fill.papermc.io/v3/projects/paper",
    },
    rulesBody: "本档无独立规则正文；正文见 paper/26.3/rules/，本档只给适用性核查",
    applicability: {
      checkedFrom: CHECKED_FROM,
      generatedBy: "scripts/gen-paper-version-packs.mjs（机核；默认 dry-run）",
      dataFile: `paper/${ver}/applicability.json`,
      ...computed.counts,
    },
    typesInSignatureFace: computed.pages,
    typeShellPages: computed.shell,
  };

  emit(join(REPO, "paper", ver, "applicability.json"), JSON.stringify(data, null, 2) + "\n");
  emit(join(REPO, "paper", ver, "rules", "00-applicability.md"), md);
  emit(metaPath, JSON.stringify(meta, null, 2) + "\n");
  console.log(
    `${ver}: 类 ${computed.pages} · 空壳 ${computed.shell} · 指针 ${computed.counts.signaturePointers} → 成员在 ${computed.counts.memberStillPresent} / 成员名缺 ${computed.counts.memberMissing} / 抽不出名 ${computed.counts.memberUnresolved} / 类缺 ${computed.counts.classMissing}`,
  );
}
if (!WRITE) console.log("\n（dry-run：加 --write 落盘）");
