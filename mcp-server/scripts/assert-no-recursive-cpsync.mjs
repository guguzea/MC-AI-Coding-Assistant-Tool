#!/usr/bin/env node
/**
 * assert-no-recursive-cpsync.mjs —— 目录级递归 cpSync 必须走 copyTree
 *
 * 存在理由（不是风格洁癖）：在本工作区的同步卷（OneDrive、路径含非 ASCII）上，
 * 以 recursive 形态调用 fs 的 cpSync 会让宿主进程以 0xC0000409
 * （STATUS_STACK_BUFFER_OVERRUN，native fast-path 里）静默消失 —— 无 JS 异常、
 * try/catch 拦不住、退出码 127。同一源目录实测：
 *   裸调用 0/5 全灭 · 带 filter 5/5 · 手工 walk + copyFileSync 5/5。
 * 「进程直接没了」比任何断言失败都糟：测试链只看到一个红退出码，数据脚本留下半截产物。
 *
 * 判据：
 *   A1 `scripts/**`、`mcp-server/scripts/**`、`mcp-server/test-*.mjs` 里，
 *      cpSync 调用的实参（按括号配平取，不吃邻句的 recursive: true）含 recursive 真值 ⇒ 红；
 *      带 filter 也红 —— 那是靠 node 内部走另一条分支绕开，版本一变就回来；
 *   A2 唯一出口 scripts/_lib/copy-tree.mjs 内部不得再出现该 fs 调用；
 *   A3 调用 copyTree 的文件必须真的 import 了它。
 *
 * 扫描前只剥注释（块注释 + 整行注释），**不动字符串**：清字符串的朴素做法会被
 * `["']` 这类正则字面量里的引号带偏，把真调用点糊掉 —— 漏报比误报危险，宁可误报。
 * 本文件自身排除在 A1/A3 之外（报错文案里就写着被禁形态，计入即自指；与 utils/actionable.ts
 * 的 A-27 同一口径），A2 仍逐字扫它。
 *
 * `MC_SKILL_CPSYNC_TEST_ROOT=<假根>` 只扫那棵树（供测试链投毒），此时跳过 A2 与仓库枚举。
 */
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const MCP_ROOT = join(HERE, "..");
const REPO_ROOT = join(MCP_ROOT, "..");
const SELF = "mcp-server/scripts/assert-no-recursive-cpsync.mjs";
const COPY_TREE_REL = "scripts/_lib/copy-tree.mjs";

const failures = [];
const printed = [];
function fail(msg) {
  failures.push(msg);
  if (printed.length < 25) printed.push("✗ " + msg);
}

function dropComments(text) {
  const noBlock = text.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ""));
  return noBlock
    .split("\n")
    .map((line) => {
      const t = line.trimStart();
      if (t.startsWith("//") || t.startsWith("*") || t.startsWith("/*")) return "";
      return line.replace(/(^|[^:":])\/\/[^\n]*$/g, "$1");
    })
    .join("\n");
}

/** 取某次调用的实参区间：从 `(` 起做括号配平，避免把邻句的 recursive: true 算进来。 */
function argsWindow(text, openIdx) {
  let depth = 0;
  for (let i = openIdx; i < text.length && i < openIdx + 4000; i++) {
    const ch = text[i];
    if (ch === "(") depth++;
    else if (ch === ")") {
      depth--;
      if (depth === 0) return text.slice(openIdx, i + 1);
    }
  }
  return text.slice(openIdx, openIdx + 400);
}

function walkFiles(dir, out = []) {
  let entries = [];
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === "node_modules" || e.name === "dist" || e.name === "temp") continue;
      walkFiles(p, out);
    } else if (/\.(mjs|js|ts)$/.test(e.name)) {
      out.push(p);
    }
  }
  return out;
}

const FAKE_ROOT = process.env.MC_SKILL_CPSYNC_TEST_ROOT || null;
const targets = FAKE_ROOT
  ? walkFiles(FAKE_ROOT)
  : [
      ...walkFiles(join(REPO_ROOT, "scripts")),
      ...walkFiles(join(MCP_ROOT, "scripts")),
      ...walkFiles(join(MCP_ROOT, "src")),
      ...readdirSync(MCP_ROOT)
        .filter((f) => /^test-.*\.mjs$/.test(f))
        .map((f) => join(MCP_ROOT, f)),
    ];

let callSites = 0;
for (const abs of targets) {
  const rel = relative(REPO_ROOT, abs).split("\\").join("/");
  if (rel === SELF) continue; // A1/A3 自指排除
  const text = dropComments(readFileSync(abs, "utf8"));
  const lineOf = (idx) => text.slice(0, idx).split("\n").length;
  for (const m of text.matchAll(/\bcpSync\s*\(/g)) {
    const args = argsWindow(text, m.index + m[0].length - 1);
    if (!/\brecursive\s*:\s*(true|1)\b/.test(args)) continue; // 单文件形态不在射程
    callSites++;
    const where = `${rel}:${lineOf(m.index)}`;
    if (/\bfilter\s*:/.test(args)) {
      fail(`${where}: 递归形态的 cpSync 靠 filter 绕开致命分支（依赖 node 内部实现，版本一变就回来）⇒ 改 copyTree`);
      continue;
    }
    fail(`${where}: 目录级递归 cpSync 在同步卷上以 0xC0000409 静默杀进程 ⇒ 逐文件复制（脚本层 copyTree，运行时本地 walk + copyFileSync）`);
  }
}

if (!FAKE_ROOT && /\bcpSync\s*\(/.test(dropComments(readFileSync(join(REPO_ROOT, COPY_TREE_REL), "utf8")))) {
  fail(`${COPY_TREE_REL}: 唯一出口内部不得再出现该 fs 调用`);
}

let copyTreeCalls = 0;
for (const abs of targets) {
  const rel = relative(REPO_ROOT, abs).split("\\").join("/");
  if (rel === COPY_TREE_REL || rel === SELF) continue;
  const text = dropComments(readFileSync(abs, "utf8"));
  // 自带同名局部函数的文件不算本原语的调用方（例：src/update/data.ts 里的
  // copyTree(srcRoot, destRoot, allowRoot) 是 zip 解包辅助，与 scripts/_lib/copy-tree.mjs 无关）
  const uses = /\bfunction\s+copyTree\s*\(/.test(text)
    ? 0
    : (text.match(/\bcopyTree\s*\(/g) || []).length;
  if (!uses) continue;
  copyTreeCalls += uses;
  if (!/from\s+["'][^"']*copy-tree\.mjs["']/.test(text)) {
    fail(`${rel}: 调用 copyTree 但没有 import ${COPY_TREE_REL} ⇒ 运行时才 ReferenceError`);
  }
}

// 明细走 stderr（与 G3/G4 同口径：投毒断言从 stderr 锚文本）
if (printed.length) console.error(printed.join("\n"));
if (failures.length) {
  console.error(
    `assert-no-recursive-cpsync: ${failures.length} 项不达标（扫描 ${targets.length} 文件 / 递归位点 ${callSites}）`,
  );
  process.exit(1);
}
console.log(
  `assert-no-recursive-cpsync: ok（扫描 ${targets.length} 文件 · 目录级递归 cpSync 0 处 · copyTree 调用 ${copyTreeCalls} 处且全部有 import）`,
);
