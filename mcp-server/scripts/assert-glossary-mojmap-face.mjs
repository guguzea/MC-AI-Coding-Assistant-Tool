#!/usr/bin/env node
/**
 * assert-glossary-mojmap-face.mjs — glossary「mojang = Mojang 官方可读名（mojmap）」口径门（2026-09-19 W3-3 落地）。
 *
 * 立门缘由（W3-3 实测缺陷）：8 档 forge knowledge/common/glossary.md 把 **mojang** 行写成
 * 「Minecraft 的原始混淆名（srg）」——与事实相反（mojang/mojmap 是 Mojang 官方**可读**映射名，
 * 恰恰**不是** SRG/混淆名；混淆层是 SRG/intermediary）。正例口径 = neoforge/knowledge/common/glossary.md:94
 * 「Mojang 官方可读映射名（**不是** SRG/混淆名）」。同批还修掉：3 档 forge + neoforge 注行里的
 * 「official（即 mojang）」旧括注（→「即 mojmap/官方可读名」）、neoforge **official** 行的
 * 「Mojang 混淆名 + MCP 映射」、fabric/1.21.1:7 的「Mojang 名称（混淆名）」散文句。
 *
 * 三条判据（都可证伪；扫描对象 = 全仓 glossary.md，逐行）：
 *   ② **mojang** 表格行内不得**肯定地**把 mojang 说成「混淆」/「srg」（大小写不敏感）；
 *   ③ 「（即 mojang」注形态若出现，其行内 mojang 指称不得带「混淆」/「srg」；
 *   + 溢出覆盖（spec ②③ 的散文类，fabric/1.21.1:7 即此类）：任何同时含 mojang 与 混淆/srg 的行，
 *     须是**否定式**表述（「不是 SRG/混淆名」）——判别器 hasAffirmativeObf：每个 混淆|srg 命中点
 *     前 30 字符窗内出现「不是|并非|而非|不含|没有」即视为否定，否则记为肯定关联 = 红。
 *     （正例行自身含「SRG/混淆名」字样，故裸子串禁令不可用；否定式豁免是判据可用的前提。）
 *
 * 用法
 *   node scripts/assert-glossary-mojmap-face.mjs
 *   node scripts/assert-glossary-mojmap-face.mjs --selftest   # 纯内存投毒（6 类畸形 + 2 内存正例 + 真实输入正对照）
 *
 * 盲区（写明，不假装覆盖）：只看 glossary.md 术语行内**同句**的 mojang↔混淆/srg 关联；
 * 跨行/跨段的定义矛盾、glossary 之外的 knowledge 文件、data/**（语义索引副本）都不在本门内。
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..", "..");

/** 扫描根：8 平台档树 + 仓库根 knowledge/（排除 temp、node_modules、data、mcp-server、.git）。 */
export const SCAN_ROOTS = [
  "forge", "fabric", "neoforge", "quilt", "liteloader", "rift", "modloader", "bedrock", "knowledge",
];
const MOJANG_RE = /mojang/i;
const OBF_RE = /混淆|srg/gi;
const NOTE_RE = /（即\s*mojang/i;
const NEGATORS = /(?:不是|并非|而非|不含|没有|无 SRG|无混淆)/i;
const NEG_WINDOW = 30;

/** 否定感知判别器：行内 混淆|srg 是否被**肯定地**关联到 mojang（任一命中点无否定前缀 ⇒ true）。 */
export function hasAffirmativeObf(line) {
  OBF_RE.lastIndex = 0;
  let m;
  while ((m = OBF_RE.exec(line))) {
    const start = Math.max(0, m.index - NEG_WINDOW);
    if (!NEGATORS.test(line.slice(start, m.index))) return true;
  }
  return false;
}

/** 单行检查：返回问题列表（空数组 = 绿）。kind 标明命中了哪条判据。 */
export function checkGlossaryLine(line) {
  if (!MOJANG_RE.test(line) || !hasAffirmativeObf(line)) return [];
  if (/\*\*mojang\*\*/.test(line)) {
    return [[`**mojang** 表格行把 mojang 肯定地写成 混淆/srg（应为「Mojang 官方可读映射名（**不是** SRG/混淆名）」口径，正例 neoforge/knowledge/common/glossary.md:94）：${line.trim()}`]];
  }
  if (NOTE_RE.test(line)) {
    return [[`「official（即 mojang）」注行内 mojang 指称带 混淆/srg（应写「即 mojmap/官方可读名」）：${line.trim()}`]];
  }
  return [[`散文行把 Mojang 名称与 混淆/srg 肯定关联（fabric/1.21.1:7 类缺陷；须改为官方可读名口径或否定式）：${line.trim()}`]];
}

export function checkGlossaryText(rel, text) {
  const problems = [];
  text.split(/\r?\n/).forEach((line, i) => {
    for (const [msg] of checkGlossaryLine(line)) problems.push(`${rel}:${i + 1}: ${msg}`);
  });
  return problems;
}

export function collectGlossaries(io) {
  if (io && io.files) return io.files; // selftest 注入
  const out = [];
  const skip = /(^|[\\/])(temp|node_modules|data|mcp-server|\.git)([\\/]|$)/;
  for (const base of SCAN_ROOTS) {
    const absBase = path.join(ROOT, base);
    if (!fs.existsSync(absBase)) continue;
    const walk = (dir) => {
      for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const p = path.join(dir, e.name);
        if (skip.test(p)) continue;
        if (e.isDirectory()) walk(p);
        else if (e.name === "glossary.md") out.push({ rel: path.relative(ROOT, p).replaceAll("\\", "/"), abs: p });
      }
    };
    walk(absBase);
  }
  return out.sort((a, b) => (a.rel < b.rel ? -1 : 1));
}

export function runAll(files) {
  const problems = [];
  for (const f of files) problems.push(...checkGlossaryText(f.rel, fs.readFileSync(f.abs, "utf8")));
  return { problems, count: files.length };
}

// ── --selftest：纯内存投毒（不碰仓库文件）───────────────────────────────────────────────
if (process.argv.includes("--selftest")) {
  const GOOD_ROW = "| **mojang** | Mojang 官方可读映射名（**不是** SRG/混淆名） |";
  const cases = [
    ["① mojang 行坏形态（W3-3 原文，1.14.4-1.20.4 除 1.16.5）", () => checkGlossaryText("t/glossary.md", "| **mojang** | Minecraft 的原始混淆名（srg），如 `aqm`、`b_` |\n")],
    ["①b mojang 行坏形态（1.16.5 例串变体）", () => checkGlossaryText("t/glossary.md", "| **mojang** | Minecraft 的原始混淆名（srg），如 `b_`、`c` |\n")],
    ["② 注形态显式混淆（official（即 mojang 混淆名））", () => checkGlossaryText("t/glossary.md", "> 注：主要使用 **official**（即 mojang 混淆名）和 **parchment**。\n")],
    ["③ 散文形态（fabric/1.21.1:7 原文）", () => checkGlossaryText("t/glossary.md", "Minecraft 官方服务端使用 Mojang 名称（混淆名），但模组需要可读的命名。\n")],
    ["⑤ 大小写不敏感（小写 srg / 大写混淆）", () => checkGlossaryText("t/glossary.md", "| **mojang** | minecraft 的原始混淆名（SRG） |\n")],
    ["⑥ 端到端投毒：真实仓库文本追加坏行后必须红", () => {
      const files = collectGlossaries();
      const first = files[0];
      const poisoned = [{ rel: first.rel, abs: first.abs }];
      const saved = fs.readFileSync(first.abs, "utf8");
      const withBad = saved + "\n| **mojang** | Minecraft 的原始混淆名（srg） |\n";
      const tmp = [];
      // 不落盘：构造内存文本走 checkGlossaryText（runAll 走 fs，故这里只测 check 层 + 真仓库正对照另跑）
      tmp.push(...checkGlossaryText(`POISONED:${first.rel}`, withBad));
      if (tmp.length === 0) tmp.push("端到端投毒未被检出");
      void poisoned;
      return tmp;
    }],
    ["正例A：neoforge:94 口径行必须绿（否定式豁免）", () => checkGlossaryText("t/glossary.md", GOOD_ROW + "\n")],
    ["正例B：修正后的 official 行（否定式）必须绿", () => checkGlossaryText("t/glossary.md", "| **official** | Mojang 官方发布的可读映射（即 mojmap，**不是** SRG/混淆名） |\n")],
  ];
  let missed = 0;
  for (const [name, fn] of cases) {
    if (name.startsWith("正例")) {
      const got = fn();
      if (got.length !== 0) { missed++; console.error(`  ✗ selftest「${name}」应绿实红：${got[0]}`); }
      continue;
    }
    const got = fn();
    if (got.length === 0) { missed++; console.error(`  ✗ selftest「${name}」应红实绿`); }
  }
  // 正对照：真实输入必须 0 问题（防「一律红」式假判别力）
  const real = runAll(collectGlossaries());
  if (real.problems.length > 0) {
    missed++;
    console.error(`  ✗ selftest 正对照：真实仓库本应绿，实得 ${real.problems.length} 项：`);
    for (const p of real.problems.slice(0, 5)) console.error(`      ${p}`);
  }
  console.log(
    `\nassert-glossary-mojmap-face(selftest): ${
      missed === 0 ? `OK（6 类畸形全检出 + 2 内存正例绿 + 真实输入正对照绿：${real.count} 份 glossary.md）` : `${missed} 例不符`
    }`,
  );
  process.exit(missed === 0 ? 0 : 1);
}

const { problems, count } = runAll(collectGlossaries());
if (problems.length) {
  console.error(`assert-glossary-mojmap-face: RED（${problems.length} 条）`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}
console.log(`assert-glossary-mojmap-face: ok（${count} 份 glossary.md 逐行扫描：mojang = Mojang 官方可读名口径，无肯定式 混淆/srg 关联）`);
