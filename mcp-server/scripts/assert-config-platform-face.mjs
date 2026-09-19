#!/usr/bin/env node
/**
 * assert-config-platform-face.mjs — 「配置」口径的平台面一致性门（2026-09-19 用户裁定 N5 落地）。
 *
 * 立门缘由（sweep85 引入的单侧改动）：sweep85 在 7 份子档 AGENTS.md 里写死了
 *   「**不要**对本档调用 `generate_config`——该工具当前平台面不含 LiteLoader / Rift / ModLoader」
 * 却把**根 AGENTS.md 原样留着**（那次提交对根纲只做了去 BOM），根纲仍写
 *   「配置不要新写树级 mc-config Skill：**一律**读 … + `generate_config`」。
 * 根纲是每个 session 首先载入的那一份 ⇒ 一个 LiteLoader/Rift/ModLoader/基岩 工程会先被根纲
 * 指去调用一个必然拒绝它的工具，再靠子档把它拉回来。同一批文件互相打脸 = 每轮都要重新踩。
 *
 * 三条判据（都可证伪；任一不满足即红）
 *   ① 工具面 = `generateConfig` 的 loader 联合，必须**恰好**是 forge / neoforge / fabric / quilt
 *      （源码解析，不看文档自述 —— 文档跟着工具走，不是反过来）；
 *   ② 根 `AGENTS.md` 的「配置不要新写树级 mc-config」条目里若出现 `generate_config`，必须同时写出
 *      **全部四个支持平台** + **至少一个不支持平台的显式禁令**（禁止「一律 generate_config」这种
 *      不区分平台面的写法）；
 *   ③ 逐档 `AGENTS.md`（7 平台根 + 各版本档 + bedrock）：提及 `generate_config` 时，
 *      支持平台的档**不得**标成不可调用；不支持平台的档**必须**在同一窗口里标成不要调用
 *      （不提及则不约束 —— bedrock 现状即「不提」，是合法的第三态）。
 *
 * 用法
 *   node scripts/assert-config-platform-face.mjs
 *   node scripts/assert-config-platform-face.mjs --selftest   # 纯内存投毒（6 类畸形 + 真实输入正对照）
 *
 * 盲区（写明，不假装覆盖）：本门只看 `AGENTS.md` 的**文本表态**与工具枚举是否自洽，
 * 不判断某档「该不该有配置能力」（那是各档自述 + 平台包设计的事）；也不覆盖 `.cursor/rules/**`
 * 里的同型措辞（那批由各档自述 + `assert-rules-match-tool.mjs` 的 quilt 面分别管）。
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..", "..");

/** 工具支持面（判据①的期望值；改这里必须同时改根纲与子档 —— 门会立刻要你两边都动）。 */
export const EXPECTED = ["forge", "neoforge", "fabric", "quilt"];
/** 工具不支持的平台（Java 旧三档 + 基岩）。 */
export const FORBIDDEN = ["liteloader", "rift", "modloader", "bedrock"];
const FORBIDDEN_LABEL = /LiteLoader|Rift|ModLoader|基岩/;
/** 「不要（对本档）调用 generate_config」的显式禁令形态。 */
const BAN_RE = /不要[^。\n]{0,20}调用\s*`?generate_config/;

/** 判据①：源码解析 `generateConfig(modId, loader?: "a" | "b" …, library?)` 的 loader 联合。 */
export function parseToolFace(src) {
  const start = src.indexOf("export function generateConfig(");
  if (start < 0) return { names: null, error: "找不到 generateConfig 声明（工具改名/挪文件了？）" };
  const open = src.indexOf("(", start);
  let depth = 0;
  let close = -1;
  for (let i = open; i < src.length; i++) {
    if (src[i] === "(") depth++;
    else if (src[i] === ")") {
      depth--;
      if (depth === 0) {
        close = i;
        break;
      }
    }
  }
  if (close < 0) return { names: null, error: "generateConfig 参数表括号不配对" };
  const params = src.slice(open, close);
  const li = params.indexOf("loader");
  if (li < 0) return { names: null, error: "generateConfig 参数表里找不到 loader 形参" };
  let seg = params.slice(li);
  const libIdx = seg.indexOf("library"); // library 枚举（cloth|yacl）不算平台面
  if (libIdx >= 0) seg = seg.slice(0, libIdx);
  const names = [...new Set([...seg.matchAll(/"([a-z0-9]+)"/g)].map((m) => m[1]))];
  return { names, error: null };
}

export function checkToolFace(names) {
  const problems = [];
  if (!names) return problems;
  const missing = EXPECTED.filter((p) => !names.includes(p));
  const extra = names.filter((p) => !EXPECTED.includes(p));
  if (missing.length) problems.push(`工具 loader 枚举缺支持平台：${missing.join(", ")}（文档若仍写它们可用即误导；改枚举须同步根纲与子档）`);
  if (extra.length) problems.push(`工具 loader 枚举多出平台：${extra.join(", ")} —— 支持面扩大了，必须同步根纲 + 各档自述 + 本门 EXPECTED`);
  return problems;
}

/** 判据②：抽出根纲「配置不要新写树级 mc-config」整条（含缩进子项），到下一个顶层编号项/标题为止。 */
export function extractConfigBlock(text) {
  const lines = text.split(/\r?\n/);
  const start = lines.findIndex((l) => /配置不要新写树级/.test(l));
  if (start < 0) return null;
  const indent = lines[start].match(/^\s*/)[0].length;
  const out = [lines[start]];
  for (let i = start + 1; i < lines.length; i++) {
    const l = lines[i];
    if (/^#{1,6}\s/.test(l)) break;
    const m = l.match(/^(\s*)\d+\.\s/);
    if (m && m[1].length <= indent) break;
    out.push(l);
  }
  return out.join("\n");
}

export function checkRootBlock(block) {
  if (block === null) return ["根 AGENTS.md 找不到「配置不要新写树级」条目 —— 口径锚点消失"];
  const problems = [];
  if (!block.includes("generate_config")) {
    return ["根纲配置条目未提及 generate_config —— 根纲必须表态工具支持面（否则只有子档在讲，未来 session 读根纲仍会误判）"];
  }
  const missing = EXPECTED.filter((p) => !new RegExp(`\\b${p}\\b`).test(block));
  if (missing.length) {
    problems.push(`根纲配置条目未点名工具支持的平台：${missing.join(", ")} —— 「一律 generate_config」式的无平台面写法会把不支持的平台也指过去`);
  }
  if (!FORBIDDEN_LABEL.test(block)) {
    problems.push("根纲配置条目未点名不支持平台（LiteLoader / Rift / ModLoader / 基岩）");
  }
  if (!BAN_RE.test(block)) {
    problems.push("根纲配置条目未写出「不支持平台不要调用 generate_config」的显式禁令");
  }
  return problems;
}

/** 判据③：单档 AGENTS.md 的表态。@param plat 平台名（小写） */
export function checkPackFace(plat, rel, text) {
  const problems = [];
  const forbidden = FORBIDDEN.includes(plat);
  const lines = text.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    if (!lines[i].includes("generate_config")) continue;
    const win = lines.slice(Math.max(0, i - 2), i + 3).join("\n");
    const banned = BAN_RE.test(win);
    if (forbidden && !banned) {
      problems.push(`${rel}:${i + 1}: ${plat} 档提及 generate_config 却未声明「不要调用」—— 工具 loader 枚举不含它，会被拒`);
    }
    if (!forbidden && banned) {
      problems.push(`${rel}:${i + 1}: ${plat} 档把 generate_config 标成不可调用，与工具 loader 枚举（${EXPECTED.join(" | ")}）相反`);
    }
  }
  return problems;
}

/** 收集待检档：7 个平台（含版本档）+ bedrock 根档。 */
function collectPacks() {
  const out = [];
  for (const plat of [...EXPECTED, ...FORBIDDEN]) {
    const base = path.join(ROOT, plat);
    if (!fs.existsSync(base)) continue;
    const rootAgents = path.join(base, "AGENTS.md");
    if (fs.existsSync(rootAgents)) out.push({ plat, rel: `${plat}/AGENTS.md`, abs: rootAgents });
    for (const e of fs.readdirSync(base, { withFileTypes: true })) {
      if (!e.isDirectory() || !/^\d+\.\d+/.test(e.name)) continue;
      const p = path.join(base, e.name, "AGENTS.md");
      if (fs.existsSync(p)) out.push({ plat, rel: `${plat}/${e.name}/AGENTS.md`, abs: p });
    }
  }
  return out;
}

function readAll() {
  const srcPath = path.join(ROOT, "mcp-server", "src", "generators", "index.ts");
  const src = fs.existsSync(srcPath) ? fs.readFileSync(srcPath, "utf8") : "";
  const rootAgentsPath = path.join(ROOT, "AGENTS.md");
  const rootAgents = fs.existsSync(rootAgentsPath) ? fs.readFileSync(rootAgentsPath, "utf8") : "";
  return { src, rootAgents, packs: collectPacks() };
}

function runAll(io) {
  const problems = [];
  const face = parseToolFace(io.src);
  if (face.error) problems.push(`判据①：${face.error}`);
  else problems.push(...checkToolFace(face.names));
  problems.push(...checkRootBlock(extractConfigBlock(io.rootAgents)));
  for (const p of io.packs) {
    problems.push(...checkPackFace(p.plat, p.rel, fs.readFileSync(p.abs, "utf8")));
  }
  return { problems, face, count: io.packs.length };
}

// ── --selftest：纯内存投毒（不碰仓库文件）───────────────────────────────────────────────
if (process.argv.includes("--selftest")) {
  const healthyPack = "配置走仓库根 `knowledge/libs/all-platforms/mc-config/SKILL.md` + `generate_config`（工作流 `mc-config`）。";
  const bannedPack = "配置原则走 mc-config/SKILL.md（工作流 `mc-config`）；**不要**对本档调用 `generate_config`——该工具当前平台面不含本档。";
  const cases = [
    ["工具面缺 quilt", () => checkToolFace(["forge", "neoforge", "fabric"])],
    ["工具面多 liteloader", () => checkToolFace(["forge", "neoforge", "fabric", "quilt", "liteloader"])],
    [
      "工具面解析失败（源码被改名的端到端投毒）",
      () => {
        const io = readAll();
        return runAll({ ...io, src: io.src.replace("export function generateConfig(", "/* gone */ function nope(") }).problems;
      },
    ],
    ["根纲「一律 generate_config」无平台面", () => checkRootBlock("6. **配置不要新写树级 `mc-config` Skill**：一律读 mc-config/SKILL.md + `generate_config`（工作流 `mc-config`）。LiteLoader / Rift / ModLoader / 基岩不要套 Cloth / ForgeConfigSpec。")],
    ["根纲缺显式禁令", () => checkRootBlock("6. **配置不要新写树级 `mc-config` Skill**：`generate_config` 只限 `forge` / `neoforge` / `fabric` / `quilt`；LiteLoader / Rift / ModLoader / 基岩 另有自述。")],
    ["支持面档被标禁令", () => checkPackFace("forge", "forge/1.20.1/AGENTS.md", bannedPack)],
    ["不支持面档未标禁令", () => checkPackFace("rift", "rift/1.13.2/AGENTS.md", healthyPack)],
  ];
  let missed = 0;
  for (const [name, fn] of cases) {
    const got = fn();
    if (got.length === 0) {
      missed++;
      console.error(`  ✗ selftest「${name}」应红实绿`);
    }
  }
  // 正对照：真实输入必须 0 问题（防「一律红」式假判别力）
  const real = runAll(readAll());
  if (real.problems.length > 0) {
    missed++;
    console.error(`  ✗ selftest 正对照：真实仓库本应绿，实得 ${real.problems.length} 项：`);
    for (const p of real.problems.slice(0, 5)) console.error(`      ${p}`);
  }
  console.log(
    `\nassert-config-platform-face(selftest): ${
      missed === 0 ? `OK（${cases.length} 类畸形全检出 + 真实输入正对照绿：工具面 ${EXPECTED.join("|")} / ${real.count} 档 AGENTS.md）` : `${missed} 例不符`
    }`,
  );
  process.exit(missed === 0 ? 0 : 1);
}

const { problems, face, count } = runAll(readAll());
if (problems.length) {
  console.error(`assert-config-platform-face: RED（${problems.length} 条）`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}
console.log(
  `assert-config-platform-face: ok（工具面 = ${face.names.join(" | ")}（源码解析）· 根 AGENTS.md 配置条目含四平台 + 显式禁令 · ` +
    `${count} 档 AGENTS.md 逐档表态一致）`,
);
