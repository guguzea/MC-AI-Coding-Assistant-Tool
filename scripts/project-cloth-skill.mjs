/**
 * mc-cloth-config 版本注入点（2026-09-16 裁定：保留中心稿 + 加投影版本注入点）。
 *
 * 源：`knowledge/libs/fabric-only/mc-cloth-config/versions.json`（档位坐标真值；改坐标先改这里再重投影）。
 * 目标：`fabric/<v>/.cursor/skills/` 下该档手稿 frontmatter 后的**注入标记行**：
 *   `<!-- cloth-version-inject v=<档> coord=<串> state=<active|commented|todo> textApi=<literal|constructor> -->`
 *
 * 两种 layout（S23 2026-09-24 起同时支持）：
 *   - 扁平 `fabric/<v>/.cursor/skills/mc-cloth-config.md`（1.14.4 … 1.21.11 已投影的 10 档）
 *   - 目录 `fabric/<v>/.cursor/skills/mc-cloth-config/SKILL.md`（1.21.4 / 1.21.8 / 1.21.10 / 26.1.2 四档骨架实况）
 *   **禁止**为了凑本门把目录 layout 改成扁平文件（那是各档骨架实况，属 S20 面）；两者都在 ⇒ CONFLICT 判红。
 *
 * 与旧版的一处实质差别（S23）：`VERS` 与 `versions.json.slots` 现在做**双向**齐全检查 ——
 * 只加槽位不扩 `VERS` 曾是静默失效路径（台账 R28：四个新档永不投影、也不被检查），现在必红。
 *
 * 边界（刻意收窄）：中心稿 SKILL.md 是通用形权威；档内正文是已逐档修正的实况（S41-b 2026-09-14 落地），
 * 本脚本**只管理注入标记行**，不重写正文、不碰其他字节；EOL 逐文件保持。
 * 默认 --check（校验）；--write 才插入/更新（走 write-guard emit）。退出码：全一致 0，否则 1（可串门禁）。
 * --selftest：纯内存投毒，钉住「加槽不扩 VERS」「目录 layout 漏检」「槽位字段缺失」三条静默退化。
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { emit, wantWrite, logDryRunBanner } from "./_lib/write-guard.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "..");
const SRC = path.join(REPO, "knowledge", "libs", "fabric-only", "mc-cloth-config", "versions.json");
/** 投影档位清单：必须与 versions.json 的 slots 键集**双向**相等（见 slotVersParity）。 */
export const VERS = [
  "1.14.4", "1.16.5", "1.17.1", "1.18.2", "1.19.4", "1.20.1", "1.20.4",
  "1.21.1", "1.21.3", "1.21.4", "1.21.8", "1.21.10", "1.21.11", "26.1.2",
];
const RE_INJECT = /^<!-- cloth-version-inject [^\n]*\r?\n/m;

/** 该档手稿在哪种 layout 下；返回 {file,layout} | {conflict,paths} | {missing:true}。 */
export function skillFileFor(repo, v) {
  const dir = path.join(repo, "fabric", v, ".cursor", "skills");
  const flat = path.join(dir, "mc-cloth-config.md");
  const nested = path.join(dir, "mc-cloth-config", "SKILL.md");
  const hasFlat = fs.existsSync(flat);
  const hasNested = fs.existsSync(nested);
  if (hasFlat && hasNested) return { conflict: true, paths: [flat, nested] };
  if (hasFlat) return { file: flat, layout: "flat" };
  if (hasNested) return { file: nested, layout: "dir" };
  return { missing: true };
}

/** 槽位 → 标记行（唯一形状真值；§S14 与 mcp-server/test-core.mjs 读的就是这一行）。 */
export function markerFor(v, slot) {
  return `<!-- cloth-version-inject v=${v} coord=${slot.coord} state=${slot.state} textApi=${slot.textApi} -->`;
}

/** 槽位字段齐全性：coord/state/textApi 缺一即不合法（旧实现只在主循环里 warn 后 continue）。 */
export function slotIncomplete(slot) {
  return !slot || !slot.coord || !slot.state || !slot.textApi;
}

/** 双向齐全：VERS 有档无槽 + versions.json 有槽未进 VERS（后者 = S23 之前的静默漏检面）。 */
export function slotVersParity(slots, vers) {
  const errors = [];
  for (const v of vers) if (!slots[v]) errors.push(`${v}: versions.json 缺档位`);
  for (const k of Object.keys(slots || {})) {
    if (!vers.includes(k)) {
      errors.push(`${k}: versions.json 有 slot 但未列入 VERS ⇒ 该档永不投影、本门也永远不看它（S23 静默失效路径）`);
    }
  }
  return errors;
}

/* ------------------------------- selftest ------------------------------- */

/** 纯内存投毒（R47 惯例：不落盘、不碰 data/）。每条都指定应红 / 应绿。 */
export function selfTest() {
  const cases = [];
  const slots = JSON.parse(fs.readFileSync(SRC, "utf8")).slots || {};
  // 正对照：现网 VERS 与 slots 双向齐全
  cases.push({ name: "CONTROL VERS↔slots 双向齐全", red: false, err: slotVersParity(slots, VERS).join(";") });
  // ① 只加槽不扩 VERS（S23 的原始失效形状：把 VERS 缩回投影前的 10 档）
  const oldVers = VERS.filter((v) => !["1.21.4", "1.21.8", "1.21.10", "26.1.2"].includes(v));
  cases.push({ name: "投毒：versions.json 加 4 槽而 VERS 仍是 10 档", red: true, err: slotVersParity(slots, oldVers).join(";") });
  // ② VERS 扩了但槽没加（反方向：投影必缺坐标）
  cases.push({ name: "投毒：VERS 有档位但 slots 缺该档", red: true, err: slotVersParity({}, ["1.21.4"]).join(";") });
  // ③ 槽位字段不全（textApi 漏写 ⇒ 标记行会退化 coord=undefined 之类）
  cases.push({ name: "投毒：槽位缺 textApi", red: true, err: slotIncomplete({ coord: "1.2.3", state: "active" }) ? "slotIncomplete=true" : "" });
  cases.push({ name: "CONTROL 槽位字段齐全", red: false, err: slotIncomplete({ coord: "1.2.3", state: "active", textApi: "literal" }) ? "slotIncomplete=true" : "" });
  // ④ 标记行形状（四字段顺序与 §S14 读法一致）
  const wantLine = "<!-- cloth-version-inject v=1.21.4 coord=17.0.144+fabric state=active textApi=literal -->";
  cases.push({
    name: "CONTROL 标记行形状",
    red: false,
    err: markerFor("1.21.4", slots["1.21.4"] || {}) === wantLine ? "" : `形状漂移：${markerFor("1.21.4", slots["1.21.4"] || {})}`,
  });
  // ⑤ layout 发现：目录 layout 必须被认出（旧实现只找扁平 .md ⇒ 四档会被判「手稿不存在」）
  const nested = skillFileFor(REPO, "1.21.4");
  cases.push({ name: "投毒后仍绿？目录 layout 手稿可被发现", red: false, err: nested.file && /SKILL\.md$/.test(nested.file) ? "" : "目录 layout 未发现" });
  const ghost = skillFileFor(REPO, "0.0.0");
  cases.push({ name: "投毒：不存在的档位必须报 missing", red: true, err: ghost.missing ? "missing" : `意外发现 ${ghost.file || "conflict"}` });

  const failed = cases.filter((c) => Boolean(c.err) !== c.red);
  for (const c of cases) {
    console.log(`  selftest ${c.red ? "应红" : "应绿"}=${c.err ? "RED" : "green"}  ${c.name}${c.err ? " :: " + String(c.err).slice(0, 200) : ""}`);
  }
  if (failed.length > 0) {
    console.error(`SELFTEST_FAILED ${failed.length}/${cases.length} 例判据失灵：\n${failed.map((f) => " - " + f.name).join("\n")}`);
    return 1;
  }
  console.log(`  project-cloth-skill selftest: ${cases.length} 例（${cases.filter((c) => c.red).length} 投毒必红 + ${cases.filter((c) => !c.red).length} 正对照）全按预期`);
  return 0;
}

/* ---------------------------------- main ---------------------------------- */

const data = JSON.parse(fs.readFileSync(SRC, "utf8"));

if (process.argv.includes("--selftest")) process.exit(selfTest());

if (!wantWrite()) logDryRunBanner("project-cloth-skill");

let bad = 0;
let flatN = 0;
let dirN = 0;
for (const msg of slotVersParity(data.slots, VERS)) {
  console.log(msg);
  bad++;
}
for (const v of VERS) {
  const slot = data.slots[v];
  if (!slot) continue; // 已由 slotVersParity 记红，不重复计
  if (slotIncomplete(slot)) { console.log(`${v}: versions.json 槽位字段不全（coord/state/textApi 必填）`); bad++; continue; }
  const found = skillFileFor(REPO, v);
  if (found.conflict) {
    console.log(`${v}: CONFLICT 两种 layout 同时存在 ${found.paths.map((x) => path.relative(REPO, x).replace(/\\/g, "/")).join(" + ")}`);
    bad++;
    continue;
  }
  if (found.missing) { console.log(`${v}: 手稿不存在 fabric/${v}/.cursor/skills/{mc-cloth-config.md | mc-cloth-config/SKILL.md}`); bad++; continue; }
  if (found.layout === "flat") flatN++; else dirN++;
  const p = found.file;
  const t = fs.readFileSync(p, "utf8");
  const fm = /^---\r?\n[\s\S]*?\r?\n---\r?\n/.exec(t);
  if (!fm) { console.log(`${v}: frontmatter 解析失败`); bad++; continue; }
  const want = markerFor(v, slot);
  const head = fm[0];
  const rest = t.slice(head.length);
  const cur = RE_INJECT.exec(rest);
  if (cur) {
    const curLine = cur[0].replace(/\r?\n$/, "");
    if (curLine === want) { console.log(`${v}: OK (${found.layout})`); continue; }
    bad++;
    if (wantWrite()) {
      const eol = t.includes("\r\n") ? "\r\n" : "\n";
      emit(p, head + want + eol + rest.slice(cur[0].length));
      console.log(`${v}: UPDATED (${found.layout})`);
    } else {
      console.log(`${v}: MISMATCH 现有=${curLine}`);
      console.log(`${v}:          期望=${want}`);
    }
  } else {
    bad++;
    if (wantWrite()) {
      const eol = t.includes("\r\n") ? "\r\n" : "\n";
      emit(p, head + want + eol + rest);
      console.log(`${v}: INSERTED (${found.layout})`);
    } else {
      console.log(`${v}: MISSING（--write 可插入）`);
    }
  }
}
console.log(bad === 0 ? `check: ${VERS.length} 档全部一致（扁平 ${flatN} + 目录 ${dirN}）` : `check: ${bad} 档待处理`);
process.exit(bad === 0 ? 0 : 1);
