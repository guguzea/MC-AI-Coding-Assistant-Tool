#!/usr/bin/env node
/**
 * assert-quilt-unversioned-wiki.mjs —— quilt 语料的「未版本化现行页」拷贝事实与页内标注必须同时成立
 * （A11 清尾①，2026-09-25；出处 = docs/knowledge-coverage-sweep-20260924.md §3.1 的建议门）。
 *
 * 已核背景（2026-09-24/25 两轮现跑）：`data/quilt_<ver>/quilt-docs/<ver>/processed/wiki-*.md` 的
 * 14 个 topic × 6 档是**同一份上游未版本化现行页**（QuiltMC/developer-wiki `main` 分支）的 6 份拷贝：
 * 除「> 抓取时间」行外逐字相同（复算：noWarn=0 / crossArchDiff=0 / badTs=0），页内第 3 行自带
 * 「未版本化现行页」警告。此前无任何门面钉这两件事 ⇒ 下次有人按「18 页/档」当版本语料读、
 * 或某档被单独改写后没人撤标注、或上游新增 wiki 页混进来，都不会有人报警。
 *
 * 判据（可证伪）：
 *   ① 6 档 × 14 topic 的 wiki-*.md 必须存在（缺失即红）；每页「> 抓取时间」行恰好 1 条；
 *   ② 每页必须带「未版本化现行页」警告行（页内标注在册）；
 *   ③ 同一 topic 跨 6 档「除时间戳行外」逐字相同（= 拷贝事实）—— 某档单独变了 ⇒ 红：
 *      要么撤「未版本化」标注，要么把该页按版本语料重新裁定（二选一，不许两头都占）；
 *   ④ 双向：任一档出现的 `wiki-*.md` 必须全在 TOPICS 登记表内（新 topic 未三分类即红）。
 *
 * 用法：
 *   node scripts/assert-quilt-unversioned-wiki.mjs             # 真跑盘面
 *   node scripts/assert-quilt-unversioned-wiki.mjs --selftest  # 内存夹具（不碰仓库文件）
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(HERE, "..", "..");

/** 有 quilt 语料树的 6 档（口径同 scripts/repair-quilt-indexes.js 的默认档位清单）。 */
export const ARCHS = ["1.18.2", "1.19.4", "1.20.1", "1.20.4", "1.21.1", "1.21.11"];
/** 14 个 wiki topic = 现行页登记表（2026-09-25 逐档枚举；判据④双向的名单）。 */
export const TOPICS = [
  "advanced-configuring",
  "armor",
  "config-screen",
  "configuration-getting-started",
  "first-block",
  "first-item",
  "food",
  "getting-started",
  "landing-page",
  "mappings",
  "metadata",
  "setting-up",
  "sideness",
  "world-types",
];
const TS_RE = /^> 抓取时间：/;
const WARN_RE = /未版本化现行页/;

/**
 * 纯函数：`{档 → {topic → md 文本}}`（topic 不带 `wiki-`/`.md`；文本缺失 = 文件缺失）⇒ 问题清单。
 * @returns {string[]} 问题清单（空 = 绿）
 */
export function wikiProblems(tree) {
  const problems = [];
  const norm = (text) => text.split(/\r?\n/).filter((l) => !TS_RE.test(l)).join("\n");
  for (const v of ARCHS) {
    const per = tree[v] ?? {};
    // ④ 双向：未登记的外来 wiki 页
    for (const topic of Object.keys(per)) {
      if (!TOPICS.includes(topic)) {
        problems.push(`${v}: wiki-${topic}.md 未在 TOPICS 登记（新页须先三分类：版本页 / 现行页 / 删）`);
      }
    }
    for (const topic of TOPICS) {
      const text = per[topic];
      if (text === undefined) {
        problems.push(`${v}: 缺 processed/wiki-${topic}.md`);
        continue;
      }
      const lines = text.split(/\r?\n/);
      const ts = lines.filter((l) => TS_RE.test(l)).length;
      if (ts !== 1) problems.push(`${v}/${topic}: 「> 抓取时间」行 ${ts} 条（恰需 1）`);
      if (!lines.some((l) => WARN_RE.test(l))) {
        problems.push(`${v}/${topic}: 缺「未版本化现行页」警告行（标注未在册）`);
      }
    }
  }
  // ③ 跨档拷贝事实（除时间戳行外逐字同）
  for (const topic of TOPICS) {
    const norms = ARCHS.map((v) => (tree[v]?.[topic] === undefined ? null : norm(tree[v][topic])));
    if (norms.some((n) => n === null)) continue; // 缺失已在①点名
    const first = norms[0];
    ARCHS.forEach((v, i) => {
      if (norms[i] !== first) {
        problems.push(`${v}/${topic}: 与同 topic 其它档不一致（除时间戳行外）⇒ 或已变成版本相关页，须撤「未版本化」标注或重裁`);
      }
    });
  }
  return problems;
}

function selftest() {
  const page = (topic, extra = "") =>
    `> 来源：https://raw.githubusercontent.com/QuiltMC/developer-wiki/main/wiki/${topic}/en.md\n` +
    `> 抓取时间：2026-09-21T03:12:16.077Z\n` +
    `> 警告：Quilt wiki / quilt.mod.json RFC 是未版本化现行页，不是该 MC 版本的历史快照。\n\n# ${topic}\n\nbody${extra}\n`;
  const base = () => {
    const t = {};
    for (const v of ARCHS) {
      t[v] = {};
      for (const topic of TOPICS) t[v][topic] = page(topic);
    }
    return t;
  };
  const cases = [];
  cases.push(["正对照·6 档×14 页全同（时间戳行被归一）⇒ 绿", wikiProblems(base()).length === 0, true]);
  const changed = base();
  changed["1.21.1"]["armor"] = page("armor", "X");
  cases.push(["判据③·某档正文单独变 ⇒ 红", wikiProblems(changed).length >= 1, true]);
  const noTs = base();
  noTs["1.20.1"]["food"] = page("food").replace(/^> 抓取时间：.*\n/m, "");
  cases.push(["判据①·时间戳行缺失 ⇒ 红", wikiProblems(noTs).length >= 1, true]);
  const dupTs = base();
  dupTs["1.19.4"]["metadata"] = page("metadata").replace(/^(> 抓取时间：.*)$/m, "$1\n$1");
  cases.push(["判据①·时间戳行重复 ⇒ 红", wikiProblems(dupTs).length >= 1, true]);
  const noWarn = base();
  noWarn["1.18.2"]["mappings"] = page("mappings").replace(/^> 警告：.*\n/m, "");
  cases.push(["判据②·警告行被删 ⇒ 红", wikiProblems(noWarn).length >= 1, true]);
  const extra = base();
  extra["1.20.4"]["brand-new"] = "> 警告：未版本化现行页\n";
  cases.push(["判据④·未登记 wiki 页 ⇒ 红", wikiProblems(extra).length >= 1, true]);
  const dropped = base();
  delete dropped["1.18.2"]["armor"];
  cases.push(["判据①·整页缺失 ⇒ 红", wikiProblems(dropped).length >= 1, true]);

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
    `\nassert-quilt-unversioned-wiki(selftest): ${missed === 0 ? "OK（5 类形态全判定：跨档改写 / 时间戳缺或重 / 警告删 / 未登记页 / 整页缺失，正对照零误伤）" : missed + " 例不符"}`,
  );
  process.exitCode = missed === 0 ? 0 : 1;
}

if (process.argv.includes("--selftest")) {
  selftest();
} else {
  const tree = {};
  const missingDirs = [];
  for (const v of ARCHS) {
    const dir = path.join(REPO_ROOT, "data", `quilt_${v}`, "quilt-docs", v, "processed");
    tree[v] = {};
    if (!fs.existsSync(dir)) {
      missingDirs.push(v);
      continue;
    }
    for (const f of fs.readdirSync(dir)) {
      if (!/^wiki-.*\.md$/.test(f)) continue;
      tree[v][f.replace(/^wiki-/, "").replace(/\.md$/, "")] = fs.readFileSync(path.join(dir, f), "utf8");
    }
  }
  const problems = wikiProblems(tree);
  if (missingDirs.length) problems.push(`缺 processed 目录：${missingDirs.join(", ")}`);
  if (problems.length) {
    console.error(`assert-quilt-unversioned-wiki: RED ——\n${problems.slice(0, 25).map((p) => `  - ${p}`).join("\n")}`);
    if (problems.length > 25) console.error(`  …（另有 ${problems.length - 25} 条，同上）`);
    process.exit(1);
  }
  console.log(
    `assert-quilt-unversioned-wiki: ok（${ARCHS.length} 档 × ${TOPICS.length} topic = ${ARCHS.length * TOPICS.length} 页：` +
      `跨档除时间戳行外逐字同、每页「未版本化现行页」警告在册、无双向外来页）`,
  );
}
