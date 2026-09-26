#!/usr/bin/env node
/**
 * assert-generator-rejection-codes.mjs —— `generate_*` 的拒绝必须落**具名**机读码（S6-①，2026-09-25）。
 *
 * 缘由（本轮实测）：A1（09-24）把拒绝文案单点分类到 `result.action.code`，分类器
 * `generatorRejectionAction(errors)`（`src/generators/common.ts`）按 `REJECT_RULES` 的正则表匹配，
 * **不命中就静默落兜底 `GENERATION_FAILED`**。全仓 grep：`GENERATION_FAILED` 只在
 * `utils/actionable.ts` 的定义处出现一次，测试 0 处 ⇒ 以后谁新写一条拒绝文案、锚点词没进表，
 * 机器读到的就是兜底码，而且没有任何门会红。本门补的就是这条棘轮。
 *
 * 判据（跑的是**生产分类器**，门里不抄任何正则）：
 *   ① 位点枚举：扫 `src/generators/*.ts` + `src/datagen/index.ts` 的每个 `code: null` 拒绝位点，
 *      取其 `errors: [...]` 里的全部静态字面量（模板串剥 `${}`）拼成文本，喂 `generatorRejectionAction`，
 *      断言 `code !== GENERATION_FAILED`；红时点名 `文件:行` + 原文。
 *   ② 未判定棘轮：整条 errors 由变量/函数调用组成（门读不到静态文本）的位点 ⇒ 计入「未判定」，
 *      数量**只许降不许增**（地板 = 本轮实测，见 UNJUDGED_CEILING）。没有这条，①会退化成
 *      "抓到的那些绿 = 全绿"。
 *   ③ 兜底通道必须活着：一条故意不含任何锚点词的文案 ⇒ 必须落 GENERATION_FAILED（①的反证，
 *      也是「表被掏空后本门 still meaningful」的证据）。
 *   ④ 信封可消费性：每个判定到的 code 必须有非空 `nextSteps` 且 ≥2 步（只给一句"看看错误吧"= 装饰）。
 *
 * 天花板/地板一律**跑时现测**，不写死在断言里除 UNJUDGED_CEILING 一处（它就是要当棘轮用）。
 *
 * 用法：
 *   node scripts/assert-generator-rejection-codes.mjs            # 真跑
 *   node scripts/assert-generator-rejection-codes.mjs --selftest  # 内存夹具：证明本门真会红
 */
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
const DIST_COMMON = join(ROOT, "dist", "generators", "common.js");

/**
 * 未判定位点的地板（2026-09-25 实测 4，**只许降不许增**）。
 * 这四处都是 `errors: [某变量 + noNativeGeneratorError("…", "规则 NN")]` —— 拒绝正文由函数调用拼出来，
 * 门在源码层读不到（读函数入参当正文会造假红，实测第一版就红了 3 条假的）。它们在**运行期**是有码的
 * （实测 `generate_model --version=1.99.9` → `action.code=VERSION_UNSUPPORTED`），所以不是漏网缺陷，
 * 只是本门的静态面够不着。降它们的两条路：把文案改成可读的字面量拼接，或给门加一层常量折叠。
 *   src/generators/index.ts:30 / :112 / :1284、src/datagen/index.ts:488
 */
const UNJUDGED_CEILING = 4;

const SELFTEST = process.argv.includes("--selftest");

function loadClassifier() {
  if (!existsSync(DIST_COMMON)) {
    throw new Error(`先 cd mcp-server && npm run build（门跑的是生产分类器，缺 dist 不许跳）：${DIST_COMMON}`);
  }
  return import(pathToFileURL(DIST_COMMON).href);
}

/** 按顶层逗号切数组元素（括号深度 0 才切；字符串内部不切）。 */
function topLevelElements(body) {
  const out = [];
  let depth = 0, cur = "", inStr = null, esc = false;
  for (const ch of body) {
    if (inStr) {
      cur += ch;
      if (esc) esc = false;
      else if (ch === "\\") esc = true;
      else if (ch === inStr) inStr = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") { inStr = ch; cur += ch; continue; }
    if (ch === "(" || ch === "[" || ch === "{") depth++;
    if (ch === ")" || ch === "]" || ch === "}") depth--;
    if (ch === "," && depth === 0) { out.push(cur); cur = ""; continue; }
    cur += ch;
  }
  if (cur.trim()) out.push(cur);
  return out;
}

/**
 * 只取**括号深度 0** 的字符串字面量。存在的理由：`errors: [eraErrModel + noNativeGeneratorError("search_*_docs", "规则 02")]`
 * 这种元素里，字面量是**辅助函数的入参**，不是拒绝正文；把它们当正文喂分类器会造出假红（实测第一版就红了 3 条假的）。
 * 这类元素取不到深度 0 字面量 ⇒ 整位点记「未判定」，由 ② 的棘轮兜住，不静默放过。
 */
function depthZeroLiterals(el) {
  const lits = [];
  let depth = 0, cur = "", inStr = null, esc = false;
  for (const ch of el) {
    if (inStr) {
      if (esc) { cur += ch; esc = false; }
      else if (ch === "\\") { cur += ch; esc = true; }
      else if (ch === inStr) {
        if (depth === 0) {
          const cleaned = cur.replace(/\$\{[^}]*\}/g, "");
          if (cleaned.trim()) lits.push(cleaned);
        }
        cur = "";
        inStr = null;
      } else cur += ch;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") { inStr = ch; continue; }
    if (ch === "(" || ch === "[" || ch === "{") depth++;
    if (ch === ")" || ch === "]" || ch === "}") depth--;
  }
  return lits;
}

/** 从源码文本抓 `code: null` **拒绝**位点及其 errors 静态正文。 */
function collectRejectionSites(src) {
  const lines = src.split(/\r?\n/);
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!/code:\s*null/.test(line)) continue;
    // 注释里出现的 "code:null" 不是位点（实测 index.ts:1030 的说明文字会被裸正则抓住）。
    // 只查「匹配点之前有 //」与「行首是块注释续行」两种；早先写的 (^|\*)\s 会把
    // 任何带缩进的正常代码行当注释吃掉 ⇒ 扫描面直接归零。
    const idx = line.search(/code:\s*null/);
    const before = line.slice(0, idx);
    const trimmed = line.trimStart();
    if (before.includes("//") || trimmed.startsWith("*") || trimmed.startsWith("/*")) continue;
    const chunk = lines.slice(i, Math.min(lines.length, i + 40)).join("\n");
    const m = /errors:\s*\[([\s\S]*?)\]/.exec(chunk);
    if (!m) {
      // `code: null` 不等于拒绝 —— 只吐 files 的成功位点也是 null（A1 记的「46 处 code:null」
      // 就混了这些）。判据：往后 12 行里出现 files: 且没有 errors ⇒ 记成功位点，不计入棘轮。
      const near = lines.slice(i, Math.min(lines.length, i + 12)).join("\n");
      if (/\bfiles:\s*[{[]/.test(near)) continue;
      out.push({ line: i + 1, text: "", kind: "unjudged", why: "找不到同位 errors 数组" });
      continue;
    }
    const lits = topLevelElements(m[1]).flatMap(depthZeroLiterals);
    const text = lits.join("\n");
    out.push(
      text.trim()
        ? { line: i + 1, text, kind: "judged" }
        : { line: i + 1, text: "", kind: "unjudged", why: "errors 正文由变量/函数调用组成（门读不到）" },
    );
  }
  return out;
}

const TARGETS = [
  ["src/generators/index.ts", "generators/index.ts"],
  ["src/generators/common.ts", "generators/common.ts"],
  ["src/generators/write-helper.ts", "generators/write-helper.ts"],
  ["src/datagen/index.ts", "datagen/index.ts"],
];

async function runReal() {
  const { generatorRejectionAction } = await loadClassifier();
  const FALLBACK = generatorRejectionAction(["完全不相干的文字 zz"]).code;

  const problems = [];
  const unjudgedList = [];
  const stats = { sites: 0, judged: 0, unjudged: 0, codes: new Map() };

  for (const [relPath] of TARGETS) {
    const abs = join(ROOT, relPath);
    if (!existsSync(abs)) continue;
    for (const site of collectRejectionSites(readFileSync(abs, "utf8"))) {
      stats.sites++;
      if (site.kind === "unjudged") {
        stats.unjudged++;
        unjudgedList.push(`${relPath}:${site.line}（${site.why}）`);
        continue;
      }
      stats.judged++;
      const act = generatorRejectionAction([site.text]);
      stats.codes.set(act.code, (stats.codes.get(act.code) ?? 0) + 1);
      if (act.code === FALLBACK) {
        problems.push(
          `① ${relPath}:${site.line} 落兜底码 ${FALLBACK} ⇒ 拒绝文案没进 REJECT_RULES：${JSON.stringify(site.text.slice(0, 70))}`,
        );
      }
      if (!Array.isArray(act.nextSteps) || act.nextSteps.length < 2) {
        problems.push(`④ ${relPath}:${site.line} 的 ${act.code} nextSteps 不足 2 步（实得 ${JSON.stringify(act.nextSteps)}）`);
      }
    }
  }

  if (stats.sites === 0) problems.push("① 一个 `code: null` 位点都没扫到 ⇒ 扫描面失效（不许因空集而绿）");
  if (stats.unjudged > UNJUDGED_CEILING) {
    problems.push(
      `② 未判定位点 ${stats.unjudged} > 地板 ${UNJUDGED_CEILING} ⇒ 拒绝文案变成门读不到的形式，棘轮失效：\n     ${unjudgedList.join("\n     ")}`,
    );
  }
  const live = generatorRejectionAction(["zz 完全不相干的文字"]);
  if (live.code !== FALLBACK) problems.push(`③ 兜底通道失效：无锚点文案实得 ${live.code}（应为 ${FALLBACK}）`);

  const codeList = [...stats.codes.entries()].sort((a, b) => b[1] - a[1]).map(([c, n]) => `${c}=${n}`).join(" ");
  return { problems, ok: `位点 ${stats.sites} · 判定 ${stats.judged} · 未判定 ${stats.unjudged}（地板 ${UNJUDGED_CEILING}）· 兜底 ${FALLBACK} · ${codeList}` };
}

/** 内存夹具：每例都断言"红在该当的原因"，不是只要红就行。 */
async function selftest() {
  const { generatorRejectionAction } = await loadClassifier();
  const bad = [];
  let cases = 0;
  const expectRed = (name, cond, why) => { cases++; if (!cond) bad.push(`${name}: ${why}`); };

  const anchors = [
    ["version is required", "VERSION_REQUIRED"],
    ["platform is required", "PICK_PLATFORM"],
    ["该平台无内置生成器", "NO_NATIVE_GENERATOR"],
    ["未跟进 1.99.x", "VERSION_UNSUPPORTED"],
    ["version 必须是精确 MC 版本", "INVALID_INPUT"],
  ];
  for (const [text, want] of anchors) {
    const got = generatorRejectionAction([text]).code;
    expectRed(`夹具①[${want}]`, got === want, `实得 ${got}`);
  }
  expectRed(
    "夹具②兜底通道",
    generatorRejectionAction(["zz 毫不相干"]).code === "GENERATION_FAILED",
    "无锚点文案没落兜底 ⇒ 表被掏空时本门会一起假绿",
  );
  expectRed(
    "夹具③空 errors",
    generatorRejectionAction(undefined).code === "GENERATION_FAILED",
    "errors 缺省必须落兜底",
  );
  const act = generatorRejectionAction(["未跟进 2.0.x"]);
  expectRed("夹具④nextSteps", act.nextSteps.length >= 2 && act.relatedTools.length > 0, JSON.stringify(act));

  // 扫描腿自证（纯内存，不落盘）：动态正文形 / 落兜底形 / 具名码形 各一个，外加一个
  // 「code:null + files」的**成功**位点 —— 它必须被跳过（A1 记的「46 处 code:null」就混了这类）。
  const fake = [
    'X { code: null, errors: [msgOf(thething) + hint("search_*_docs", "规则 02")] },',
    'Y { code: null, errors: ["zz 毫不相干的拒绝"] },',
    'Z { code: null, errors: ["version is required。缺必填参数"] },',
    "S { code: null, files: { 'a.java': 'x' }, warnings, },",
    "// 注释里提到 code:null 不算位点",
  ].join("\n");
  const sites = collectRejectionSites(fake);
  expectRed("夹具⑤扫描位数", sites.length === 3, `实得 ${sites.length}（成功位点或注释行被当位点 = 扫描面虚高；真位点被漏 = ①会空集假绿）`);
  expectRed("夹具⑥未判定识别", sites[0]?.kind === "unjudged", "嵌套调用形应判未判定（不得把函数入参当拒绝正文）");
  expectRed("夹具⑦兜底检出", sites[1] && generatorRejectionAction([sites[1].text]).code === "GENERATION_FAILED", "夹具②那条必须被抓成红");
  expectRed("夹具⑧具名码", sites[2] && generatorRejectionAction([sites[2].text]).code === "VERSION_REQUIRED", `实得 ${sites[2] && generatorRejectionAction([sites[2].text]).code}`);

  if (bad.length) {
    console.log(`✗ selftest 失败 ${bad.length} 例：\n  - ${bad.join("\n  - ")}`);
    process.exitCode = 1;
  } else {
    console.log(`assert-generator-rejection-codes --selftest: ok（${cases} 例夹具，计数现算：5 档锚点各归其码 + 兜底通道活着 + 空 errors 落兜底 + nextSteps/relatedTools 可消费 + 扫描器位数/未判定/成功位点跳过）`);
  }
}

if (SELFTEST) {
  await selftest();
} else {
  try {
    const { problems, ok } = await runReal();
    if (problems.length) {
      console.log(`✗ assert-generator-rejection-codes：${problems.length} 处不达标：\n  - ${problems.join("\n  - ")}`);
      process.exitCode = 1;
    } else {
      console.log(`assert-generator-rejection-codes: ok（${ok}）`);
    }
  } catch (e) {
    console.log(`✗ assert-generator-rejection-codes 自身失败（fail closed）：${e.message}`);
    process.exitCode = 1;
  }
}
