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
 *   ③ 「processed 含 raw 没有的断言」的机械等价形 = ①（与源稿一致 ⇒ 不可能比源稿多出断言）。
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
  ];
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
    tree[v] = t;
  }
  const problems = syncProblems(tree);
  if (problems.length) {
    console.error(`assert-qsl-verified-sync: RED ——\n${problems.map((p) => `  - ${p}`).join("\n")}`);
    process.exit(1);
  }
  const synced = VERSIONS.filter((v) => tree[v].source !== undefined);
  console.log(
    `assert-qsl-verified-sync: ok（${synced.length}/${VERSIONS.length} 档源稿存在，processed 派生件全部与源稿归一化一致，无孤儿）`,
  );
}
