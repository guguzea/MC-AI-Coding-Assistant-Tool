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

/* ── R-3：audit 脚本里 async 导出必须 await ────────────────────────────────
 * audit-all-tools.mjs 曾把 async 的 getVersionInfo 当同步函数调 4 次：r 恒为
 * Promise，于是「weak」恒报、「constructor」恒误报 ERROR、另两条永远看不到值。
 * R-1/R-2 只看手搓 `function test(name, fn)` harness，这类线性 main() + note()
 * 的脚本落在门外——所以它绿了很久。
 * 判定面：解构导入 + 能在 dist 里解析到 async 声明的绑定。
 * 不覆盖：namespace 导入（const docs = await import(...)）的成员调用；
 *        解析不到声明时跳过（宁漏不误报）。
 */
const scriptsDir = path.dirname(fileURLToPath(import.meta.url));
const auditScripts = fs
  .existsSync(scriptsDir)
  ? fs
      .readdirSync(scriptsDir)
      .filter((n) => /^audit-.*\.mjs$/.test(n))
      .map((n) => path.join(scriptsDir, n))
  : [];

/** 在 dist 产物里解析 `<name>` 是否 async；null = 判不了 */
function isAsyncExport(modAbs, name, depth = 0) {
  if (depth > 4 || !fs.existsSync(modAbs)) return null;
  const t = fs.readFileSync(modAbs, "utf8");
  if (new RegExp(`async\\s+function\\s+${name}\\b`).test(t)) return true;
  if (new RegExp(`\\b${name}\\s*=\\s*async\\b`).test(t)) return true;
  if (new RegExp(`(?:export\\s+)?function\\s+${name}\\s*\\(`).test(t)) return false;
  for (const m of t.matchAll(/export\s*\{([^}]*)\}\s*from\s*["'](\.[^"']+)["']/g)) {
    for (const entry of m[1].split(",").map((s) => s.trim()).filter(Boolean)) {
      const [src, local] = entry.split(/\s+as\s+/).map((x) => x.trim());
      if ((local || src) === name) {
        const next = isAsyncExport(path.resolve(path.dirname(modAbs), m[2]), src, depth + 1);
        if (next !== null) return next;
      }
    }
  }
  return null;
}

let auditFiles = 0;
let asyncBindings = 0;
for (const file of auditScripts) {
  const text = fs.readFileSync(file, "utf8");
  const lines = text.split("\n");
  const IMPORT_RE = /const\s*\{([^}]+)\}\s*=\s*(?:await\s+)?import\(\s*["'](\.[^"']+)["']\s*\)/g;
  const bindings = new Map(); // name -> module file it was imported from
  for (const m of text.matchAll(IMPORT_RE)) {
    if (!m[2].includes("dist")) continue;
    const modAbs = path.resolve(path.dirname(file), m[2]);
    if (!fs.existsSync(modAbs)) continue; // 未 npm run build：不判，别让新克隆变红
    for (const raw of m[1].split(",")) {
      const name = raw.trim().split(/\s+as\s+/).pop().trim();
      if (name && !bindings.has(name)) bindings.set(name, modAbs);
    }
  }
  for (const [name, modAbs] of bindings) {
    if (isAsyncExport(modAbs, name) !== true) continue;
    asyncBindings += 1;
    for (const c of text.matchAll(new RegExp(`(?<![\\w$.])${name}\\s*\\(`, "g"))) {
      const lineNo = text.slice(0, c.index).split("\n").length;
      const lineStart = text.lastIndexOf("\n", c.index - 1) + 1;
      const lineEnd = text.indexOf("\n", c.index);
      const line = text.slice(lineStart, lineEnd < 0 ? text.length : lineEnd);
      const before = text.slice(lineStart, c.index);
      if (/(?:^|[^\w$.])await\s+$/.test(before)) continue;
      if (/^\s*$/.test(before) && /\bawait\s*$/.test(lines[lineNo - 2] ?? "")) continue;
      if (/\.then\s*\(|Promise\.(?:all|allSettled)\s*\(|\breturn\s+$/.test(`${line}|${before}`)) continue;
      problems.push({
        file,
        why: `第 ${lineNo} 行：${name}() 是 async 导出但未 await → 断言拿到的是 Promise（假绿/假红）`,
        line: lineNo,
      });
    }
  }
  auditFiles += 1;
}

if (problems.length) {
  console.error("assert-test-harness: 发现「async 被同步吞掉」风险（R-1/R-2 harness 假绿 / R-3 audit 脚本未 await）：");
  for (const p of problems) console.error(`  ${path.relative(process.cwd(), p.file)} :: ${p.why}`);
  console.error("\n这类代码会「绿着但从未执行」或「恒报一个拿不到值的结论」。harness 侧见 test-decompile.mjs 的 test()/atest() 写法。");
  process.exit(1);
}
console.log(`assert-test-harness: ok (${harnesses} 个手搓 harness 已锁死 thenable 处理)`);
console.log(`assert-test-harness: ok R-3 (${auditFiles} 个 audit 脚本 / ${asyncBindings} 个 async 导出绑定已核 await)`);
