#!/usr/bin/env node
/**
 * assert-generator-java-symbols —— 生成物里的 Java 符号必须在产物内可解析。
 *
 * ## 为什么需要这道门（2026-10-21，P0 回归的教训）
 * `assert-generator-template-safety.mjs` 只对**生成器源文件**跑 `tsc --noEmit`。
 * 而生成器吐出的 Java 是**字符串模板** ⇒ TS 层永远合法，模板里少一行 `import` 它**结构上抓不到**。
 *
 * 实证事故（本轮自己引入的 P0）：修 §四 #16 的 provider 包名分叉时，`datagen/fabric.ts` 的
 * model 分支重写 import 块，把 `import net.fabricmc.fabric.api.datagen.v1.FabricDataOutput;`
 * 整行挤掉了 —— **行数不变**，`tsc` 不报，门的自证也不报，但生成物里 `FabricDataOutput` 未定义
 * ⇒ 用户 javac 必红。该缺陷存活整轮修复波，最后由人工审阅发现。
 *
 * ## 判据（产物级，不需要 MC jar）
 * 对每个 (平台, 版本, providerType) 实跑生成器，取产物 Java 文本，然后：
 *   1. 收集已定义的简单名：`import …X;` 的 X、`class/interface/enum/record X`、java.lang 白名单。
 *   2. 找被使用但未定义的简单名：`new X(`、`extends X`、`implements X`、`@X`、`(X name` 形参类型。
 *   3. 有未定义即判红并逐条点名（符号 + 行号）。
 *
 * ## 不是编译器，别当编译器用
 * 它是**模板回归护栏**，不替代 javac。真实签名/包名正确性仍需真构件编译腿。
 * 本门只回答：「模板有没有漏掉它自己用到的符号」—— 正是本轮事故的形状。
 *
 * 退出码：0 = 全绿；1 = 有未解析符号；2 = --require 且生成器加载失败。
 */
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const MCP = resolve(HERE, "..");
const REQUIRE = process.argv.includes("--require");
const SELFTEST = process.argv.includes("--selftest");

/** 生成矩阵：覆盖包名分叉边界两侧（本轮事故就发生在分叉点）。加生成器/档位往这里加。 */
export const MATRIX = [
  { platform: "fabric", version: "1.21.1", providerType: "itemmodel" },
  { platform: "fabric", version: "1.21.3", providerType: "itemmodel" },
  { platform: "fabric", version: "1.21.4", providerType: "itemmodel" },
  { platform: "fabric", version: "1.21.8", providerType: "itemmodel" },
  { platform: "fabric", version: "1.21.10", providerType: "itemmodel" },
  { platform: "fabric", version: "1.21.11", providerType: "blockstate" },
  { platform: "fabric", version: "1.21.11", providerType: "recipe" },
  { platform: "fabric", version: "26.1.2", providerType: "itemmodel" },
  { platform: "neoforge", version: "26.1", providerType: "particle" },
  { platform: "neoforge", version: "1.20.6", providerType: "recipe" },
];

const JAVA_LANG = new Set([
  "Object","String","Integer","Long","Boolean","Double","Float","Byte","Short","Character",
  "Void","Math","System","Exception","RuntimeException","Error","Throwable","Iterable",
  "Comparable","Runnable","Override","Deprecated","SuppressWarnings","FunctionalInterface",
  "StringBuilder","Number","Class","Enum","Record","CharSequence","AutoCloseable",
]);

/** 分析一份 Java 源文本，返回未解析的简单名 [{name,line,text}]。纯函数（可供 --selftest 投毒）。 */
export function findUnresolvedSymbols(src) {
  const lines = String(src).split(/\r?\n/);
  const defined = new Set(JAVA_LANG);
  for (const l of lines) {
    const imp = /^\s*import\s+(?:static\s+)?[\w.]+?\.(\w+)\s*;/.exec(l);
    if (imp) defined.add(imp[1]);
    if (/^\s*import\s+[\w.]+?\.\*\s*;/.test(l)) defined.add("*");
    const decl = /^\s*(?:public\s+|final\s+|abstract\s+|sealed\s+|non-sealed\s+|static\s+)*(?:class|interface|enum|record)\s+(\w+)/.exec(l);
    if (decl) defined.add(decl[1]);
  }
  // 有通配 import 时无法静态判定 ⇒ 弃权（不制造假红）
  if (defined.has("*")) return [];
  const CHECK = [
    /\bnew\s+([A-Z][\w$]*)\s*\(/g,
    /\bextends\s+([A-Z][\w$]*)\b/g,
    /\bimplements\s+([A-Z][\w$]*)\b/g,
    /@([A-Z][\w$]*)\b/g,
    /\(\s*([A-Z][\w$]*)\s+[a-z]\w*\s*[,)]/g,
  ];
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    const code = lines[i].replace(/\/\/.*$/, "").replace(/"(?:\\.|[^"\\])*"/g, '""');
    for (const re of CHECK) {
      re.lastIndex = 0;
      let m;
      while ((m = re.exec(code)) !== null) {
        if (!defined.has(m[1])) out.push({ name: m[1], line: i + 1, text: lines[i].trim().slice(0, 120) });
      }
    }
  }
  const seen = new Set();
  return out.filter((s) => (seen.has(s.name) ? false : (seen.add(s.name), true)));
}

// ── 投毒自证 ────────────────────────────────────────────────────────────────
if (SELFTEST) {
  const good = [
    "package a.b;",
    "import net.fabricmc.fabric.api.datagen.v1.FabricDataOutput;",
    "public class Foo extends Bar {",
    "  public Foo(FabricDataOutput out) { super(out); }",
    "}",
    "class Bar { public Bar(Object o) {} }",
  ].join("\n");
  const cases = [
    ["干净（import 齐）", good, 0],
    ["投毒① 少一行 import（本轮真实事故形状）", good.replace("import net.fabricmc.fabric.api.datagen.v1.FabricDataOutput;\n", ""), 1],
    ["投毒② extends 未 import", "package a;\npublic class X extends Missing {}\n", 1],
    ["投毒③ 形参类型未 import", "package a;\nclass Y { void f(NotImported n) {} }\n", 1],
    ["对照④ 通配 import ⇒ 弃权不误报", "package a;\nimport b.c.*;\npublic class Z extends Whatever {}\n", 0],
    ["对照⑤ java.lang 不误报", "package a;\npublic class W extends Object { String s = new String(); }\n", 0],
  ];
  let bad = 0;
  for (const [name, src, want] of cases) {
    const got = findUnresolvedSymbols(src).length;
    const ok = want === 0 ? got === 0 : got > 0;
    if (!ok) bad++;
    console.log("  " + (ok ? "✅" : "❌") + " " + name + "（期望" + (want === 0 ? "无" : "有") + "未解析，实得 " + got + "）");
  }
  console.log("assert-generator-java-symbols(selftest): " + (cases.length - bad) + "/" + cases.length + " 通过（3 投毒必红 + 2 对照必绿）");
  process.exit(bad === 0 ? 0 : 1);
}

// ── 主流程 ──────────────────────────────────────────────────────────────────
const modPath = join(MCP, "dist", "datagen", "index.js");
if (!existsSync(modPath)) {
  console.log("⚠ dist 未构建 ⇒ 本次**未验证**，不是通过；先 npm run build");
  process.exit(REQUIRE ? 2 : 0);
}
let generateDatagen;
try {
  const m = await import(pathToFileURL(modPath).href);
  generateDatagen = m.generateDatagen;
} catch (e) {
  console.log("⚠ 加载 dist/datagen/index.js 失败：" + e.message);
  process.exit(REQUIRE ? 2 : 0);
}
if (typeof generateDatagen !== "function") {
  console.log("⚠ dist/datagen/index.js 没有导出 generateDatagen");
  process.exit(REQUIRE ? 2 : 0);
}
let failures = 0;
let checked = 0;
for (const row of MATRIX) {
  const tag = row.platform + "/" + row.version + "/" + row.providerType;
  const r = generateDatagen({ ...row, modId: "examplemod", targetName: "ruby" });
  const code = r && typeof r === "object" ? r.code : null;
  checked++;
  if (!code) {
    const why = (r && r.errors && r.errors[0]) || "无 code";
    console.log("  ○ " + tag + "：生成器未出 code（" + String(why).slice(0, 60) + "），跳过");
    continue;
  }
  const badSyms = findUnresolvedSymbols(code);
  if (badSyms.length === 0) {
    console.log("  ✓ " + tag);
  } else {
    failures++;
    console.log("  ✗ " + tag + "：" + badSyms.length + " 个未解析符号");
    for (const b of badSyms) console.log("      · " + b.name + "（行 " + b.line + "）" + b.text);
  }
}
if (failures > 0) {
  console.log("");
  console.log("assert-generator-java-symbols: " + failures + "/" + checked + " 个产物有未解析符号");
  console.log("处方：模板里用到的类型必须自带 import —— 重写 import 块时最易整行挤掉（见文件头事故记录）。");
  process.exit(1);
}
console.log("assert-generator-java-symbols: ok（" + checked + " 个产物，符号全部可解析）");
