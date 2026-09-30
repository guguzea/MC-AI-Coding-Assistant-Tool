#!/usr/bin/env node
/**
 * assert-iserror-anchor — `isError: true` 位点锚门（台账 `L3` 的落地形态；用户 2026-09-30 批准 B8）
 *
 * 背景（这是"锚的形式"问题，不是行为问题）：
 *   `src/utils/actionable.ts` 的合同注释曾把**全仓唯一**的 `isError: true` 位点写成**行号**。
 *   该行号一路漂移：424→429→444→454→516→518→520→526→527→565→585→588→605（13 跳），
 *   每一跳都要人手追着改注释；台账自述「脆性写在散文里、**无机制**每轮提醒」。
 *   ⇒ 本门把锚改成 **needle + 处数（判红）+ 行号（仅报告）**，行号漂移不再制造假红。
 *
 * 判据（三条，全部 fail-closed；判据面 = `mcp-server/src/**\/*.ts` 的**代码行**，注释行不计）：
 *   ① 处数：`isError: true` 的字面量位点必须**恰好 1 处**（协议层失败只允许"注册层前置拒绝"这一处）。
 *   ② 语义：该处必须在 `tool-registry.ts` 内，且±14 行窗口里同时出现 needle
 *      `versionRequiredAction` 与 `warmupApi`（= `get_server_status` 的 warmup-无-version 前置拒绝）。
 *   ③ 报告：把当前位置（`path:line`）作为**信息**打印 —— 这就是本门与旧"行号锚"的全部区别。
 *
 * 用法：
 *   node scripts/assert-iserror-anchor.mjs              # 判红/绿（只读 src，零联网，<200ms）
 *   node scripts/assert-iserror-anchor.mjs --verbose    # 附扫描面与命中窗口
 *   node scripts/assert-iserror-anchor.mjs --selftest   # 纯内存投毒（不读盘）
 *
 * 约定（改判据前先读）：
 *   - 本门**不**校验 `ok:false` 带内契约（那在 `assert-legacy-isolation.mjs` 与 CLI 侧）；
 *     它只管"协议层失败在全仓只有一处、且那处语义正确"。
 *   - needle 取样窗口 14 行是"够用即可"的经验值（实测命中距离 8 行）；改注册块结构时若把
 *     `versionRequiredAction` 挪远，门会红 —— 那时应改**窗口**或**needle**，而不是删判据。
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert";

// 必须走 fileURLToPath：本仓路径含中文，`URL.pathname` 会给百分号编码。
const ROOT = fileURLToPath(new URL("..", import.meta.url));
const SRC = join(ROOT, "src");
const HIT = /isError:\s*true/;
const WINDOW = 14;
const NEEDLES = ["versionRequiredAction", "warmupApi"];
const EXPECT_FILE = "tool-registry.ts";

/** 注释行不计：`*` / `//` / `/*` 起头的行（含 jsdoc 续行）。 */
const isCommentLine = (line) => {
  const t = line.trimStart();
  return t.startsWith("*") || t.startsWith("//") || t.startsWith("/*");
};

function listTs(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) listTs(p, out);
    else if (name.endsWith(".ts")) out.push(p);
  }
  return out;
}

/** 纯函数：吃「路径 + 文本」列表，吐判据结果（selftest 直接复用）。 */
export function judge(files) {
  const hits = [];
  for (const f of files) {
    const lines = f.text.split(/\r?\n/);
    lines.forEach((line, i) => {
      if (isCommentLine(line)) return;
      if (HIT.test(line)) hits.push({ file: f.path, line: i + 1, lines });
    });
  }
  const problems = [];
  if (hits.length !== 1) {
    problems.push(
      `处数=${hits.length}（期望恰好 1）：` +
        (hits.length ? hits.map((h) => `${h.file}:${h.line}`).join(" / ") : "一处都没有"),
    );
  }
  for (const h of hits) {
    if (!h.file.endsWith(EXPECT_FILE)) {
      problems.push(`位点落在 ${h.file}（期望 ${EXPECT_FILE}）`);
      continue;
    }
    const lo = Math.max(0, h.line - 1 - WINDOW);
    const hi = Math.min(h.lines.length, h.line - 1 + WINDOW);
    const win = h.lines.slice(lo, hi).join("\n");
    for (const n of NEEDLES) {
      if (!win.includes(n)) problems.push(`位点附近 ±${WINDOW} 行缺 needle \`${n}\``);
    }
  }
  return { hits, problems };
}

function main() {
  const argv = process.argv.slice(2);
  const verbose = argv.includes("--verbose");
  if (argv.includes("--selftest")) return selftest();

  const files = listTs(SRC).map((p) => ({
    path: relative(ROOT, p).split(sep).join("/"),
    text: readFileSync(p, "utf8"),
  }));
  const { hits, problems } = judge(files);
  if (verbose) console.log(`  [iserror-anchor] 扫描 ${files.length} 个 src/**/*.ts（注释行不计）`);
  if (problems.length) {
    console.error(`assert-iserror-anchor: ${problems.length} 项不通过`);
    for (const p of problems) console.error(`  ✗ ${p}`);
    process.exit(1);
  }
  const h = hits[0];
  console.log(
    `assert-iserror-anchor: ok（处数=1 · needle ${NEEDLES.map((n) => `\`${n}\``).join(" + ")} 命中）· ` +
      `当前位置 **${h.file}:${h.line}**（仅报告，行号不再判红）`,
  );
  if (verbose) {
    const lo = Math.max(0, h.line - 1 - WINDOW);
    console.log("  窗口：");
    for (let i = lo; i < Math.min(h.lines.length, h.line - 1 + WINDOW); i++) {
      console.log(`    ${String(i + 1).padStart(5)} | ${h.lines[i]}`);
    }
  }
}

function selftest() {
  const okFile = {
    path: "src/tool-registry.ts",
    text: [
      "const action = versionRequiredAction();",
      "return {",
      "  content: [{ type: \"text\", text: JSON.stringify({ ok: false, action }) }],",
      "  isError: true,",
      "};",
      "await warmupApi([version.trim()]);",
    ].join("\n"),
  };
  const cases = [
    ["绿·唯一处 + 双 needle", () => judge([okFile]), 0],
    [
      "红·处数为 0",
      () => judge([{ path: "src/tool-registry.ts", text: "const x = 1;\n" }]),
      1,
    ],
    [
      // 纯"处数"污染：两处都在正确文件、needle 也齐 ⇒ 只应触发 1 项（处数）。
      "红·处数 2（其余合规）",
      () =>
        judge([
          {
            path: "src/tool-registry.ts",
            text: [
              "const action = versionRequiredAction();",
              "await warmupApi([]);",
              "return { isError: true };",
              "const again = () => ({ isError: true });",
            ].join("\n"),
          },
        ]),
      1,
    ],
    [
      // 两条 needle 都缺 ⇒ 期望 2 项（逐条点名，不是合并成 1 项）。
      "红·两条 needle 都缺（=2 项）",
      () =>
        judge([
          {
            path: "src/tool-registry.ts",
            text: "return {\n  isError: true,\n};\n",
          },
        ]),
      2,
    ],
    [
      "红·落错文件",
      () =>
        judge([
          {
            path: "src/elsewhere.ts",
            text: "const action = versionRequiredAction();\nawait warmupApi([]);\nreturn { isError: true };\n",
          },
        ]),
      1,
    ],
    [
      "绿·注释里的写法不计（合同的散文面）",
      () =>
        judge([
          okFile,
          {
            path: "src/utils/actionable.ts",
            text: " * 2) **协议层失败：`isError: true`** —— 全仓库只有 1 处\n",
          },
        ]),
      0,
    ],
  ];
  let passed = 0;
  for (const [name, run, wantProblems] of cases) {
    const r = run();
    try {
      assert.equal(r.problems.length, wantProblems, `${name} ⇒ problems=${r.problems.length}`);
      console.log(`  ✓ ${name}（problems=${r.problems.length}）`);
      passed++;
    } catch (e) {
      console.error(`  ✗ ${name}: ${e.message}`);
    }
  }
  console.log(`assert-iserror-anchor(selftest): ${passed}/${cases.length}${passed === cases.length ? " OK" : ""}`);
  process.exit(passed === cases.length ? 0 : 1);
}

// 被 import 时不执行主流程（selftest 复用 judge）。
if (process.argv[1] && process.argv[1].endsWith("assert-iserror-anchor.mjs")) main();
