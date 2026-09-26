/**
 * assert-qsl-verified-sync.mjs —— qsl-verified 语料派生件必须与其声明复制源一致（W3-4 路线 A，2026-09-19）。
 *
 * 背景：data/quilt_<ver>/quilt-docs/<ver>/processed/qsl-verified.md 由 scripts/index-qsl-verified.mjs
 * 从 quilt/<ver>/knowledge/common/qsl-verified.md 机械复制（emitCopy）。F115（2026-09-13）裁定语料
 * 「上游原样、不改写」；2026-09-19 用户裁定路线 A：派生件过期不再被容忍——用生成器刷新 + 本门钉住。
 *
 * 判据（可证伪）：
 *   ① 源稿存在的版本（generator 的 VERSIONS），其 processed 必须存在，且去 BOM + CRLF→LF 归一后逐字节相等；
 *   ② 源稿不存在的版本，processed 也不得存在（不得有孤儿派生件）；
 *   ③ 「processed 含 raw 没有的断言」的机械等价形 = ①（与源稿一致 ⇒ 不可能比源稿多出断言）；
 *   ④ 索引侧对账（G4 清尾，2026-09-25）：语料树存在时，index-l0/l1/l2.json 的 `${ver}/qsl-verified`
 *      条目必须带 `sha256 == processed 内容哈希`（口径同 `fetch-quilt-docs.js:157` 的 `sha(content)`）。
 *      6 档该条目曾**全缺** sha（同档其它 17 条目都有），由 repair-quilt-indexes.js 补齐后本条钉死；
 *      fetchedAt 不判 —— qsl-verified 无「> 抓取时间」行，其 fetchedAt 语义 = 派生件**建立时间**
 *      （1.21.11 = 2026-09-19 / 其余 5 档 = 2026-08-14），是历史真值，不追齐同档抓取日。
 *
 * 用法：
 *   node scripts/assert-qsl-verified-sync.mjs             # 判红/绿
 *   node scripts/assert-qsl-verified-sync.mjs --selftest  # 纯内存投毒（不碰仓库文件）
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(HERE, "..", "..");
// 与 scripts/index-qsl-verified.mjs 的 VERSIONS 同源（脚本头注释 :17-28）；改那边必须同步这里。
const VERSIONS = [
  "1.18.2", "1.19.4", "1.20.1", "1.20.4", "1.21.1",
  "1.21.3", "1.21.4", "1.21.8", "1.21.10", "1.21.11",
];

const norm = (s) => crypto.createHash("sha256").update(s.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n")).digest("hex");

/** S16-tail（第 11 轮）：把「改那边必须同步这里」从注释升格为机械判据。
 * 从生成器源码文本提取 `const VERSIONS = [...]` 的字符串字面量；提不出返回 null。 */
export function extractVersions(src) {
  const m = /const VERSIONS = \[([\s\S]*?)\]/.exec(src);
  if (!m) return null;
  return [...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]);
}
/** 两清单的对称差 + 解析失败，返回问题列表（空 = 绿）。纯函数，可喂夹具投毒。 */
export function versionsCrossProblems(gateList, genList, genLabel = "scripts/index-qsl-verified.mjs") {
  if (genList === null) return [`${genLabel}: 解析不出 const VERSIONS = [...] —— 声明清单失去机械交叉对象，禁止只靠注释同步`];
  const a = new Set(gateList), b = new Set(genList);
  const problems = [];
  for (const v of a) if (!b.has(v)) problems.push(`本门 VERSIONS 有 ${v}，${genLabel} 没有`);
  for (const v of b) if (!a.has(v)) problems.push(`${genLabel} 有 ${v}，本门 VERSIONS 没有（processed 派生件判据漏档）`);
  return problems;
}

/**
 * 判据④（G4 清尾，2026-09-25）：索引侧 sha256 对账。纯函数，可喂夹具投毒。
 * 入参 `{版本 → {processed?, l0?, l1?, l2?}}`（后三者 = 三个索引 json 的**文本**，可缺）。
 * 口径：`sha256(processed 内容)`（raw utf8；另容 LF 归一版，防行尾转换误报）。
 * @returns {string[]} 问题清单（空 = 绿）
 */
export function indexShaProblems(tree) {
  const problems = [];
  const hash = (s) => crypto.createHash("sha256").update(s).digest("hex");
  for (const v of VERSIONS) {
    const t = tree[v] ?? {};
    if (t.processed === undefined) continue; // 无派生件的档由 syncProblems 判
    const want = [hash(t.processed), hash(t.processed.replace(/\r\n/g, "\n"))];
    const id = `${v}/qsl-verified`;
    for (const [key, label] of [["l0", "index-l0"], ["l1", "index-l1"], ["l2", "index-l2"]]) {
      if (t[key] === undefined) {
        problems.push(`${v}: 缺 ${label}.json（语料树在但索引读不到）`);
        continue;
      }
      let arr;
      try {
        arr = JSON.parse(t[key]);
      } catch (e) {
        problems.push(`${v}: ${label}.json 解析失败 (${e.message})`);
        continue;
      }
      const e = Array.isArray(arr) ? arr.find((x) => x.id === id) : undefined;
      if (!e) {
        problems.push(`${v}: ${label} 无 ${id} 条目 ⇒ 检索面取不到该页`);
        continue;
      }
      if (!want.includes(e.sha256)) {
        problems.push(
          `${v}: ${label} 的 qsl-verified sha256 ${e.sha256 ? e.sha256.slice(0, 12) + "…" : "缺失"} ≠ processed 内容哈希 ${want[0].slice(0, 12)}…`,
        );
      }
    }
  }
  return problems;
}

/** 纯函数：给定 {版本 → {source?, processed?, hasCorpusTree?}} 内容表，返回问题清单（空 = 绿）。
 * 「派生件必须存在」只在**语料树存在**（index-l0.json 有）时成立——有源稿但没建语料树的档
 * （如 1.21.3/1.21.4/1.21.8/1.21.10）合法地只有源稿。 */
export function syncProblems(tree) {
  const problems = [];
  for (const v of VERSIONS) {
    const t = tree[v] ?? {};
    if (t.source !== undefined) {
      if (t.processed === undefined) {
        if (t.hasCorpusTree) {
          problems.push(`${v}: 语料树存在但 processed 派生件缺失 —— 跑 node scripts/index-qsl-verified.mjs --write`);
        }
      } else if (norm(t.source) !== norm(t.processed)) {
        problems.push(`${v}: processed 与源稿不一致（派生件过期/被手改）—— 跑 node scripts/index-qsl-verified.mjs --write，禁止直接手改 processed`);
      }
    } else if (t.processed !== undefined) {
      problems.push(`${v}: 无源稿却有 processed 孤儿派生件 —— 删除 processed 或补源稿`);
    }
  }
  return problems;
}

function selftest() {
  const good = {
    "1.21.1": { source: "# A\n", processed: "# A\n" },
    "1.21.3": {},
  };
  const cases = [
    ["正对照·源=派生且无孤儿", syncProblems(good).length === 0, true],
    ["判据①·派生件过期", syncProblems({ "1.21.1": { source: "# A\n", processed: "# B\n" } }).length === 1, true],
    ["判据①·派生件缺失", syncProblems({ "1.21.1": { source: "# A\n", hasCorpusTree: true } }).length === 1, true],
    ["判据①·有源稿无语料树=合法", syncProblems({ "1.21.3": { source: "# A\n" } }).length === 0, true],
    ["判据②·孤儿派生件", syncProblems({ "1.21.3": { processed: "# X\n" } }).length === 1, true],
    ["归一化·CRLF/BOM 不算漂移", syncProblems({ "1.21.1": { source: "﻿# A\r\n", processed: "# A\n" } }).length === 0, true],
    ["未登记版本·不判", syncProblems({ "26.9": { source: "# A\n", processed: "# B\n" } }).length === 0, true],
    ["交叉腿·清单一致", versionsCrossProblems(["1.18.2", "1.19.4"], extractVersions('const VERSIONS = ["1.18.2", "1.19.4"];')).length === 0, true],
    ["交叉腿·本门多一档（对称差>0）", versionsCrossProblems(VERSIONS, extractVersions('const VERSIONS = ["1.18.2"];')).length > 0, true],
    ["交叉腿·生成器多一档", versionsCrossProblems(["1.21.1"], extractVersions('const VERSIONS = ["1.21.1", "1.21.2"];')).length === 1, true],
    ["交叉腿·生成器清单解析不出", versionsCrossProblems(VERSIONS, null).length === 1, true],
  ];
  // 判据④（索引侧 sha 对账）夹具：三条索引都用同一份 l0 形状，sha 按 processed 内容算。
  const shaOf = (s) => crypto.createHash("sha256").update(s).digest("hex");
  const idxOf = (text, sha) =>
    JSON.stringify([{ id: "1.21.1/qsl-verified", version: "1.21.1", ...(sha ? { sha256: sha } : {}) }, { id: "1.21.1/other" }]);
  const good4 = { "1.21.1": { processed: "# A\n", l0: idxOf(1, shaOf("# A\n")), l1: idxOf(1, shaOf("# A\n")), l2: idxOf(1, shaOf("# A\n")) } };
  cases.push(
    ["判据④·正对照三条 sha 全对", indexShaProblems(good4).length === 0, true],
    ["判据④·LF 归一版也算对（防行尾转换误报）", indexShaProblems({ "1.21.1": { processed: "# A\r\n", l0: idxOf(1, shaOf("# A\n")), l1: idxOf(1, shaOf("# A\n")), l2: idxOf(1, shaOf("# A\n")) } }).length === 0, true],
    ["判据④·sha 缺失（= 本轮 6 档真缺口）", indexShaProblems({ "1.21.1": { processed: "# A\n", l0: idxOf(1, undefined), l1: idxOf(1, shaOf("# A\n")), l2: idxOf(1, shaOf("# A\n")) } }).length === 1, true],
    ["判据④·sha 过期（改过 processed 没刷 ⇒ 三件同报）", indexShaProblems({ "1.21.1": { processed: "# B\n", l0: idxOf(1, shaOf("# A\n")), l1: idxOf(1, shaOf("# A\n")), l2: idxOf(1, shaOf("# A\n")) } }).length === 3, true],
    ["判据④·l1 单独缺条目", indexShaProblems({ "1.21.1": { processed: "# A\n", l0: idxOf(1, shaOf("# A\n")), l1: JSON.stringify([]), l2: idxOf(1, shaOf("# A\n")) } }).length === 1, true],
    ["判据④·索引解析失败", indexShaProblems({ "1.21.1": { processed: "# A\n", l0: "{oops", l1: idxOf(1, shaOf("# A\n")), l2: idxOf(1, shaOf("# A\n")) } }).length === 1, true],
    ["判据④·无派生件的档不判", indexShaProblems({ "1.21.3": {} }).length === 0, true],
  );
  let missed = 0;
  for (const [name, got, want] of cases) {
    if (got !== want) {
      missed++;
      console.error(`  ✗ selftest「${name}」期望 ${want ? "红" : "绿"}，实得 ${got ? "红" : "绿"}`);
    } else {
      console.log(`  ✓ ${name}`);
    }
  }
  console.log(
    `\nassert-qsl-verified-sync(selftest): ${missed === 0 ? "OK（过期/缺失/孤儿/归一化 4 类形态全判定，正对照零误伤）" : missed + " 例不符"}`,
  );
  process.exitCode = missed === 0 ? 0 : 1;
}

if (process.argv.includes("--selftest")) {
  selftest();
} else {
  const tree = {};
  for (const v of VERSIONS) {
    const src = path.join(REPO_ROOT, "quilt", v, "knowledge", "common", "qsl-verified.md");
    const dest = path.join(REPO_ROOT, "data", `quilt_${v}`, "quilt-docs", v, "processed", "qsl-verified.md");
    const idx = path.join(REPO_ROOT, "data", `quilt_${v}`, "quilt-docs", v, "index-l0.json");
    const t = {};
    if (fs.existsSync(src)) t.source = fs.readFileSync(src, "utf8");
    if (fs.existsSync(dest)) t.processed = fs.readFileSync(dest, "utf8");
    t.hasCorpusTree = fs.existsSync(idx);
    // 判据④：语料树存在时连索引三件一起读（只读文本，解析在纯函数里）。
    if (t.hasCorpusTree) {
      const dir = path.dirname(idx);
      for (const [key, f] of [["l0", "index-l0.json"], ["l1", "index-l1.json"], ["l2", "index-l2.json"]]) {
        const p = path.join(dir, f);
        if (fs.existsSync(p)) t[key] = fs.readFileSync(p, "utf8");
      }
    }
    tree[v] = t;
  }
  const problems = syncProblems(tree);
  problems.push(...indexShaProblems(tree));
  // S16-tail：与生成器版本清单机械交叉（此前「改那边必须同步这里」只是注释，两边漂移恒绿）。
  const genPath = path.join(REPO_ROOT, "scripts", "index-qsl-verified.mjs");
  const genSrc = fs.existsSync(genPath) ? fs.readFileSync(genPath, "utf8") : null;
  problems.push(...versionsCrossProblems(VERSIONS, genSrc === null ? null : extractVersions(genSrc)));
  if (problems.length) {
    console.error(`assert-qsl-verified-sync: RED ——\n${problems.map((p) => `  - ${p}`).join("\n")}`);
    process.exit(1);
  }
  const synced = VERSIONS.filter((v) => tree[v].source !== undefined);
  console.log(
    `assert-qsl-verified-sync: ok（${synced.length}/${VERSIONS.length} 档源稿存在，processed 派生件全部与源稿归一化一致，无孤儿）`,
  );
}
