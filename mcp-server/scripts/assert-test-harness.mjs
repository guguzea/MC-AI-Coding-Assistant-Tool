/**
 * Static gate：手搓测试 harness 不得把 async 用例当同步用例「假绿」。
 *
 * 背景（真实事故）：test-decompile.mjs 的 `function test(name, fn)` 只写
 *   `fn(); passed += 1;`，于是 `test("...", async () => {...})` 立刻计数为通过，
 *   断言却在之后的任意时机才执行（夹具目录早被 rmSync 删掉），
 *   失败时变成 unhandledRejection 直接崩掉整个套件。
 *   结果：4 个锁 / Java 探测用例长期「绿着但从未运行过」。
 *
 * 两条规则：
 *  R-1 本地同步 harness（没有 thenable 处理）里禁止出现 async 用例调用点；
 *  R-2 本地 harness 必须显式处理 thenable（禁止把「不 await」重新变成静默通过）。
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const roots = [
  path.resolve(path.dirname(fileURLToPath(import.meta.url)), ".."), // mcp-server
  path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "scripts"), // 根 scripts
];

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) {
      if (e.name === "node_modules" || e.name === "dist" || e.name === ".git") continue;
      walk(path.join(dir, e.name), out);
      continue;
    }
    if (/\.(mjs|js)$/.test(e.name)) out.push(path.join(dir, e.name));
  }
  return out;
}

/** 本地定义的 `function test(` / `const test = (`（不是 import 自 node:test） */
const LOCAL_HARNESS = /(?:^|\n)\s*(?:async\s+)?function\s+test\s*\(\s*\w+\s*,\s*\w+\s*\)|(?:^|\n)\s*(?:const|let|var)\s+test\s*=\s*(?:async\s*)?\(?/;
/** harness 是否处理了 thenable（返回 promise 也算） */
const THENABLE_AWARE = /\.then\b|typeof\s+\w+\s*===?\s*["']object["']|instanceof\s+Promise|Promise\.resolve\s*\(\s*\)\.then|thenable/i;
/** async 用例被交给本地同步 harness 的调用点 */
const ASYNC_CALLSITE = /(?<![\w.])test\s*\(\s*(?:"[^"]*"|'[^']*'|`[^`]*`)\s*,\s*async\b/g;

const problems = [];
let scanned = 0;
let harnesses = 0;

for (const root of roots) {
  for (const file of walk(root)) {
    const base = path.basename(file);
    if (/\.test\.mjs$/.test(base) && !fs.existsSync(file)) continue;
    const text = fs.readFileSync(file, "utf8");
    if (!LOCAL_HARNESS.test(text)) continue;
    if (!/^[\s\S]*(?:passed|failed|failures)[\s\S]*console\.(log|error)/m.test(text)) continue;
    scanned += 1;

    const usesNodeTest = /from\s+["']node:test["']/.test(text);
    if (usesNodeTest) continue; // 官方 runner 自己会 await，不在本闸门范围

    harnesses += 1;
    const harnessDecl = text.slice(0, text.indexOf("function test(") > -1 ? text.indexOf("function test(") + 400 : 600);
    if (!THENABLE_AWARE.test(harnessDecl)) {
      problems.push({
        file,
        why: "同步 harness 未处理 thenable：async 用例会被计成通过（假绿）。请让 test() 检出 promise 并判失败，async 用例改用 await atest(...)",
      });
    }
    for (const m of text.matchAll(ASYNC_CALLSITE)) {
      const line = text.slice(0, m.index).split("\n").length;
      problems.push({ file, why: `第 ${line} 行：async 用例交给同步 test() → 改为 await atest(...)`, line });
    }
  }
}

if (problems.length) {
  console.error("assert-test-harness: 发现「async 用例被同步 harness 吞掉」风险：");
  for (const p of problems) console.error(`  ${path.relative(process.cwd(), p.file)} :: ${p.why}`);
  console.error("\n这类用例会「绿着但从未执行」。见 test-decompile.mjs 的 test()/atest() 写法。");
  process.exit(1);
}
console.log(`assert-test-harness: ok (${harnesses} 个手搓 harness 已锁死 thenable 处理)`);
