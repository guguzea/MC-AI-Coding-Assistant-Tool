#!/usr/bin/env node
/**
 * S32 · NeoForge LEGACY 共享归档树的**检索隔离门**。
 *
 * 钉住的不变式（任何一条破了即红）：
 *  1. 三棵归档树**仍在盘上**（W6 裁定是标 Archived，不是删）。
 *  2. `read_knowledge_resource` 命中归档路径 → 带内 `found:false` + `archived:true`，
 *     正文一个字节都不许出现在 text 里；且 **不抛异常、不置 isError、CLI rc=0、无 error.code**。
 *  3. `list_knowledge_resources` 里凡落在归档树内的条目必须 `archived:true`；
 *     不得有任何未标记的条目指向归档树。
 *  4. `search_docs platform=neoforge` 的正常查询与「拿归档目录名当 version」都不得
 *     返回归档树正文（结果里不得出现 `neoforge/{code-patterns,knowledge,scaffold}` 路径）。
 *  5. `listPacks`（activate_platform_pack action=list）必须把三棵树登记成 `archived:true` 的
 *     trap 且 path 指向 LEGACY-NOTICE.md；同时它们**不得**出现在 packs 里。
 *  6. 归档树**不进 58 档覆盖统计**：复刻 assert-pack-meta-coverage.mjs 的 pack 判据
 *     （有 AGENTS.md 或 .cursor/rules 才算 pack 档），三棵树必须都不满足。
 *  7. `neoforge/LEGACY-NOTICE.md` 必须含与代码逐字一致的隔离范围段。
 *  0.（S13 CARRIED-1，2026-09-24 补）判据本身要有**门内自检**：§2/§3 的纯函数形态
 *     `judgeReadPayload` / `uriInArchivedTree` 由 `runSelftest()` 用「必红投毒 + 必绿对照」夹具跑，
 *     自检红即整门红。此前只有真 CLI 一条腿，CLI 行为退化（例如归档命中改回 found:true 之前的
 *     某种形状）时判据漏了也没人知道。
 *
 * 单跑：`node mcp-server/scripts/assert-legacy-isolation.mjs`
 * 自检：`node mcp-server/scripts/assert-legacy-isolation.mjs --selftest`（纯内存夹具，不 spawn CLI、不写盘）
 * 串链：`mcp-server/test-scripts.mjs` §S18/S19/S20 新门真跑块 spawnSync。
 */
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const SERVER = join(HERE, "..");
const REPO = join(SERVER, "..");
const CLI = join(SERVER, "dist", "cli.js");

const ARCHIVED = ["neoforge/code-patterns", "neoforge/knowledge", "neoforge/scaffold"];
const NOTICE_REL = join("neoforge", "LEGACY-NOTICE.md");
const NOTICE_TEXT_ANCHOR = "MCP 检索面已隔离";

const errors = [];
const fail = (msg) => errors.push(msg);

/**
 * URI 是否落在三棵归档树内（canonical `mcskill://code-patterns/<平台>[/<版本>]/<文件>` 与
 * 直写仓库相对路径两种形态）。S13 起提为模块级纯函数，供 §3 与门内自检（--selftest）共用，
 * 避免「自检另抄一份判据」的分叉。
 */
export function uriInArchivedTree(uri) {
  const s = String(uri).slice("mcskill://".length).replace(/\\/g, "/");
  const forms = [s];
  if (s.startsWith("code-patterns/")) {
    // canonical：mcskill://code-patterns/<平台>[/<版本>]/<文件>.md
    // → 仓库相对 <平台>/code-patterns/<文件>.md（或 <平台>/<版本>/code-patterns/<文件>.md）
    const parts = s.slice("code-patterns/".length).split("/");
    if (parts.length === 2) forms.push(`${parts[0]}/code-patterns/${parts[1]}`);
    else if (parts.length === 3) forms.push(`${parts[0]}/${parts[1]}/code-patterns/${parts[2]}`);
  }
  return forms.some((f) => /^neoforge\/(code-patterns|knowledge|scaffold)(\/|$)/.test(f));
}

/** 带内拒答判据（§2 的纯函数形态）：返回问题清单，空 = 合规。夹具与真 CLI 输出同走此路。 */
export function judgeReadPayload(uri, h, r) {
  const bad = [];
  const text = String(r.text ?? "");
  if (h.json && h.json.isError === true) bad.push(`${uri} 置了 isError:true（带内契约违例）`);
  if (h.rc !== 0) bad.push(`${uri} CLI rc=${h.rc} ≠ 0（归档命中必须是带内否定，不是失败退出）`);
  if (r.ok === false) bad.push(`${uri} 新增了 ok:false 字面量路径（应走 found:false + archived:true）`);
  if (r.error && typeof r.error === "object" && "code" in r.error) bad.push(`${uri} 带了 error.code ⇒ 会被 isToolFailure 判失败`);
  if (r.found !== false) bad.push(`${uri} found=${JSON.stringify(r.found)}，期望 false`);
  if (r.archived !== true) bad.push(`${uri} 缺 archived:true 标记`);
  if (!text.includes("LEGACY-NOTICE.md")) bad.push(`${uri} 的 text 没指向 neoforge/LEGACY-NOTICE.md`);
  if (!text.includes("activate_platform_pack")) bad.push(`${uri} 的 text 没给「用 activate_platform_pack 选具体版本档」的 hint`);
  // 正文泄漏探针：这些串只出现在归档正文里，隔离后不得回显。
  for (const leak of LEAK_PROBES) {
    if (text.includes(leak)) bad.push(`${uri} 泄漏归档正文片段「${leak}」`);
  }
  return bad;
}

const LEAK_PROBES = ["DeferredRegister.create(NeoForgeRegistries", "createBlockStateDefinition"];

/**
 * 门内自检（S13 CARRIED-1，2026-09-24）：纯内存夹具跑上面两条判据，**不 spawn CLI、不写盘**。
 * 「判据自己说自己在」是本门此前的缺口 —— §2/§3 只在真 CLI 上跑，CLI 行为退化成放行时门恒绿；
 * 这里用「必红投毒 + 必绿对照」钉住判据本身。`--selftest` 单跑；正常模式当前置腿，自检红即 rc≠0。
 */
export function runSelftest() {
  const OK_READ = {
    rc: 0,
    json: { isError: false },
    result: { found: false, archived: true, text: "见 neoforge/LEGACY-NOTICE.md；请用 activate_platform_pack 选具体版本档" },
  };
  const poison = (over) => ({ rc: over.rc ?? 0, json: over.json ?? { isError: false }, result: { ...OK_READ.result, ...(over.result || {}) } });
  const cases = [
    // 必红：归档命中却回 found:true（正文照给）——旧实现若把判据写漏，这条就是缺口
    ["红·found 未置 false", () => judgeReadPayload("u", poison({ result: { found: true, archived: undefined, text: "正文" } }), { found: true, text: "正文" }).length > 0],
    ["红·缺 archived:true", () => judgeReadPayload("u", poison({ result: { archived: false } }), { found: false, archived: false, text: OK_READ.result.text }).length > 0],
    ["红·rc≠0（把带内否定做成失败退出）", () => { const h = poison({ rc: 1 }); return judgeReadPayload("u", h, h.result).length > 0; }],
    ["红·泄漏归档正文片段", () => { const t = OK_READ.result.text + LEAK_PROBES[0]; const h = poison({ result: { text: t } }); return judgeReadPayload("u", h, h.result).length > 0; }],
    ["红·isError:true", () => judgeReadPayload("u", poison({ json: { isError: true } }), resultOf(poison({}))).length > 0],
    ["红·error.code（会被 isToolFailure 判失败）", () => judgeReadPayload("u", { rc: 0, json: { error: { code: "ARCHIVED" } }, result: { ...OK_READ.result, error: { code: "ARCHIVED" } } }, { ...OK_READ.result, error: { code: "ARCHIVED" } }).length > 0],
    ["红·归档 URI 判据漏网（canonical 两段形态）", () => uriInArchivedTree("mcskill://code-patterns/neoforge/01-block-patterns.md") === true],
    ["红·归档 URI 判据漏网（直写仓库相对 + 子目录）", () => uriInArchivedTree("mcskill://neoforge/scaffold/README.md") === true],
    // 必绿：合规带内拒答
    ["绿·合规拒答 payload", () => judgeReadPayload("mcskill://neoforge/knowledge/x.md", OK_READ, OK_READ.result).length === 0],
    ["绿·forge 的 code-patterns 不误伤", () => uriInArchivedTree("mcskill://code-patterns/forge/01-block-patterns.md") === false],
    ["绿·canonical 带版本段不误伤（指向版本档，非三棵共享树）", () => uriInArchivedTree("mcskill://code-patterns/neoforge/1.20.4/x.md") === false],
    ["绿·neoforge 版本档不误伤", () => uriInArchivedTree("mcskill://neoforge/1.20.4/knowledge/x.md") === false],
    ["绿·非归档平台 knowledge 不误伤", () => uriInArchivedTree("mcskill://fabric/knowledge/x.md") === false],
  ];
  let missed = 0;
  let red = 0;
  for (const [name, fn] of cases) {
    let pass = false;
    try {
      pass = Boolean(fn());
    } catch (e) {
      pass = false;
      console.error(`  ✗ selftest「${name}」抛异常：${e && e.message}`);
    }
    if (!pass) {
      missed++;
      console.error(`  ✗ selftest「${name}」判据未按预期生效（该红的没红 / 该绿的没绿）`);
    } else if (name.startsWith("红·")) red++;
  }
  const total = cases.length;
  console.log(`selftest: ${total - missed}/${total} 通过（含红投毒 ${red} 例）`);
  return missed;
}


/** CLI 输出前面有警告与进度行，取第一段配平的 JSON。 */
function parseFirstJson(out) {
  const start = out.indexOf("{");
  if (start < 0) return null;
  let depth = 0;
  let inStr = false;
  let esc = false;
  for (let i = start; i < out.length; i++) {
    const c = out[i];
    if (inStr) {
      if (esc) esc = false;
      else if (c === "\\") esc = true;
      else if (c === '"') inStr = false;
      continue;
    }
    if (c === '"') inStr = true;
    else if (c === "{") depth++;
    else if (c === "}") {
      depth -= 1;
      if (depth === 0) {
        try {
          return JSON.parse(out.slice(start, i + 1));
        } catch {
          return null;
        }
      }
    }
  }
  return null;
}

function runTool(args) {
  if (!existsSync(CLI)) {
    throw new Error(`缺 ${CLI} —— 先在 mcp-server 跑 npm run build`);
  }
  const r = spawnSync(process.execPath, [CLI, ...args], {
    encoding: "utf8",
    cwd: SERVER,
    windowsHide: true,
    maxBuffer: 64 * 1024 * 1024,
  });
  return { rc: r.status, json: parseFirstJson(String(r.stdout || "")), stdout: String(r.stdout || ""), stderr: String(r.stderr || "") };
}

const resultOf = (h) => (h.json && (h.json.result ?? h.json)) ?? {};

// ── 0. 门内自检（纯内存夹具，不 spawn CLI、不写盘）────────────────────────────
// `--selftest` 单跑；正常模式当**前置腿**——判据本身失效时 §1–§7 的结论都不可信，直接红。
if (process.argv.includes("--selftest")) {
  const missedSelf = runSelftest();
  console.log(missedSelf ? `assert-legacy-isolation(selftest): ${missedSelf} 例不符` : "assert-legacy-isolation(selftest): ok（必红投毒与必绿对照全部按预期生效）");
  process.exit(missedSelf ? 1 : 0);
}
{
  const missedSelf = runSelftest();
  if (missedSelf) fail(`0) 门内自检 ${missedSelf} 例不符 ⇒ §2/§3 的判据本身失效，后续结论不可信`);
}

// ── 1. 归档树仍在盘上（不删是本次裁定的硬约束）───────────────────────────────
for (const rel of ARCHIVED) {
  const p = join(REPO, rel);
  if (!existsSync(p) || !statSync(p).isDirectory()) fail(`1) 归档树被删或不在盘上：${rel}（W6 裁定是标 Archived，不是删）`);
}

// ── 2. read_knowledge_resource 带内拒答 ──────────────────────────────────────
// 两种 URI 形态都要挡：canonical code-patterns 形态 + 直接把仓库相对路径写进 URI。
const READ_CASES = [
  "mcskill://code-patterns/neoforge/01-block-patterns.md",
  "mcskill://code-patterns/neoforge/README.md",
  "mcskill://neoforge/knowledge/version-changes/1.20.x.md",
  "mcskill://neoforge/scaffold/README.md",
];
for (const uri of READ_CASES) {
  const h = runTool(["read_knowledge_resource", `--uri=${uri}`]);
  for (const m of judgeReadPayload(uri, h, resultOf(h))) fail(`2) ${m}`);
}
// 对照组：forge 的 code-patterns 必须仍然可读（防止把隔离做成了全平台打死）。
{
  const ctrl = runTool(["list_knowledge_resources"]);
  const list = (resultOf(ctrl).resources || []);
  const forgeLive = list.filter(
    (x) => !x.archived && /^mcskill:\/\/code-patterns\/(forge|fabric)\//.test(x.uri),
  );
  if (forgeLive.length === 0) fail(`2 对照) forge/fabric 的 code-patterns 全被挡了 ⇒ 归档判据过宽`);
  else {
    const h = runTool(["read_knowledge_resource", `--uri=${forgeLive[0].uri}`]);
    const r = resultOf(h);
    if (r.found !== true) fail(`2 对照) 非归档 URI ${forgeLive[0].uri} 被误挡（found=${JSON.stringify(r.found)}）`);
    if (r.archived === true) fail(`2 对照) 非归档 URI ${forgeLive[0].uri} 被误标 archived`);
  }
}

// ── 3. list_knowledge_resources 的归档条目标记 ───────────────────────────────
{
  const h = runTool(["list_knowledge_resources"]);
  const list = resultOf(h).resources || [];
  if (h.rc !== 0) fail(`3) list_knowledge_resources rc=${h.rc} ≠ 0`);
  const inArchived = uriInArchivedTree;
  const hits = list.filter((x) => inArchived(x.uri));
  if (hits.length === 0) fail(`3) list 里一个归档条目都没有 ⇒ 归档树从索引面消失（应保留名字 + 解释，不是隐身）`);
  for (const x of hits) {
    if (x.archived !== true) fail(`3) ${x.uri} 落在归档树内但没标 archived:true`);
    if (!String(x.description || "").includes("Archived")) fail(`3) ${x.uri} 的 description 没写归档解释`);
  }
  const markedNotActuallyArchived = list.filter((x) => x.archived === true && !inArchived(x.uri));
  for (const x of markedNotActuallyArchived) fail(`3) ${x.uri} 标了 archived 却不在归档清单内 ⇒ 判据与登记表脱节`);
}

// ── 4. search_docs platform=neoforge 不得吐归档树正文 ────────────────────────
{
  const probes = [
    ["1.20.4", "block registry"],
    ["1.21.1", "item"],
    ["code-patterns", "block"],
    ["knowledge", "registry"],
    ["scaffold", "build"],
  ];
  for (const [version, query] of probes) {
    const h = runTool(["search_docs", "--platform=neoforge", `--version=${version}`, `--query=${query}`]);
    const r = resultOf(h);
    const blob = JSON.stringify(r);
    if (/neoforge[\\/](code-patterns|knowledge|scaffold)[\\/]/.test(blob)) {
      fail(`4) search_docs(version=${version}) 的命中里出现了归档树路径 ⇒ 归档正文进了正常检索`);
    }
    if (/DeferredRegister\.create\(NeoForgeRegistries/.test(blob)) {
      fail(`4) search_docs(version=${version}) 回显了归档树正文片段`);
    }
  }
}

// ── 5. listPacks：三棵树登记为 archived trap，且不在 packs 里 ─────────────────
{
  const h = runTool(["activate_platform_pack", "--action=list"]);
  const r = resultOf(h);
  if (h.rc !== 0) fail(`5) activate_platform_pack --action=list rc=${h.rc} ≠ 0`);
  const traps = r.traps || [];
  const packs = r.packs || [];
  for (const rel of ARCHIVED) {
    const name = rel.split("/")[1];
    const t = traps.find((x) => x && x.archived === true && String(x.note || "").startsWith(`${rel} 已标 Archived`));
    if (!t) fail(`5) listPacks 缺 ${rel} 的 archived trap`);
    else if (!String(t.path).endsWith(NOTICE_REL.replace(/\//g, "\\")) && !String(t.path).endsWith("LEGACY-NOTICE.md")) {
      fail(`5) ${rel} 的 trap path=${t.path} 没指向 LEGACY-NOTICE.md`);
    }
    if (packs.some((p) => String(p.minecraftVersion || "") === name)) fail(`5) packs 里出现了 minecraftVersion=${name}`);
  }
  if (!traps.some((x) => x.archived !== true && /AGENTS\.md/.test(String(x.path)))) {
    fail(`5) 原有的 neoforge/AGENTS.md 分发 trap 不见了（S31 的面被 S32 顶掉）`);
  }
}

// ── 6. 归档树不进 pack 覆盖统计（复刻 assert-pack-meta-coverage 判据）─────────
{
  for (const rel of ARCHIVED) {
    const dir = join(REPO, rel);
    if (!existsSync(dir)) continue;
    const isPack = existsSync(join(dir, "AGENTS.md")) || existsSync(join(dir, ".cursor", "rules"));
    if (isPack) fail(`6) ${rel} 出现了 AGENTS.md / .cursor/rules ⇒ 会被 58 档覆盖统计计入）`);
  }
  const cov = spawnSync(process.execPath, [join(SERVER, "scripts", "assert-pack-meta-coverage.mjs")], {
    encoding: "utf8",
    cwd: SERVER,
    windowsHide: true,
  });
  if (cov.status !== 0) fail(`6) assert-pack-meta-coverage 复跑红：${String(cov.stdout || "").slice(0, 300)}${String(cov.stderr || "").slice(0, 300)}`);
  else {
    // S16-tail（第 11 轮）：旧判据是对 ok 行散文 `/58 档全覆盖/` 的字符串耦合 —— coverage 基线
    // 合法重签（改句子或改档数）都会假红。改为字段耦合：从 stdout 取「报出的档数」，
    // 与 coverage 门源码自己的 EXPECTED_PACKS 常量比对；两个取数任一失败即红（不静默）。
    const out = String(cov.stdout || "");
    const rm = /assert-pack-meta-coverage: ok \((\d+) /.exec(out);
    const gateSrc = readFileSync(join(SERVER, "scripts", "assert-pack-meta-coverage.mjs"), "utf8");
    const bm = /const EXPECTED_PACKS = (\d+)/.exec(gateSrc);
    if (!rm) fail(`6) 无法从 coverage 门 stdout 解析报出档数（输出形状变了？字段耦合腿失效）：${out.slice(0, 200)}`);
    else if (!bm) fail("6) 无法从 assert-pack-meta-coverage.mjs 源码解析 const EXPECTED_PACKS = <n>");
    else if (Number(rm[1]) !== Number(bm[1])) fail(`6) coverage 报出 ${rm[1]} 档 ≠ 其基线 EXPECTED_PACKS=${bm[1]}（归档树混入覆盖统计，或基线漂移未同步）`);
  }
}

// ── 7. LEGACY-NOTICE.md 必须带与代码同口径的隔离段 ───────────────────────────
{
  const p = join(REPO, NOTICE_REL);
  if (!existsSync(p)) fail(`7) 缺 ${NOTICE_REL}`);
  else {
    const s = readFileSync(p, "utf8");
    if (!s.includes(NOTICE_TEXT_ANCHOR)) fail(`7) LEGACY-NOTICE.md 缺「${NOTICE_TEXT_ANCHOR}」隔离声明段`);
    for (const rel of ARCHIVED) if (!s.includes(rel)) fail(`7) LEGACY-NOTICE.md 没逐一点名 ${rel}`);
    for (const surface of ["read_knowledge_resource", "search_docs", "list_knowledge_resources"]) {
      if (!s.includes(surface)) fail(`7) LEGACY-NOTICE.md 没说明 ${surface} 这一面的行为`);
    }
    if (!s.includes("found:false")) fail(`7) LEGACY-NOTICE.md 没写返回标记口径（found:false + archived:true）`);
  }
}

if (errors.length) {
  console.error(`assert-legacy-isolation: FAILED (${errors.length} 项)`);
  for (const e of errors) console.error("  - " + e);
  process.exit(1);
}
console.log(
  `assert-legacy-isolation: ok · ${ARCHIVED.length} 棵 LEGACY 树保留在盘上且三面隔离` +
    `（read 带内 found:false+archived:true rc=0 · list 全标 archived · search_docs 零泄漏 · listPacks trap 齐）` +
    ` · 未计入 58 档覆盖`,
);
