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
 *
 * 单跑：`node mcp-server/scripts/assert-legacy-isolation.mjs`
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
  const r = resultOf(h);
  if (h.json && h.json.isError === true) fail(`2) ${uri} 置了 isError:true（带内契约违例）`);
  if (h.rc !== 0) fail(`2) ${uri} CLI rc=${h.rc} ≠ 0（归档命中必须是带内否定，不是失败退出）`);
  if (r.ok === false) fail(`2) ${uri} 新增了 ok:false 字面量路径（应走 found:false + archived:true）`);
  if (r.error && typeof r.error === "object" && "code" in r.error) fail(`2) ${uri} 带了 error.code ⇒ 会被 isToolFailure 判失败`);
  if (r.found !== false) fail(`2) ${uri} found=${JSON.stringify(r.found)}，期望 false`);
  if (r.archived !== true) fail(`2) ${uri} 缺 archived:true 标记`);
  const text = String(r.text ?? "");
  if (!text.includes("LEGACY-NOTICE.md")) fail(`2) ${uri} 的 text 没指向 neoforge/LEGACY-NOTICE.md`);
  if (!text.includes("activate_platform_pack")) fail(`2) ${uri} 的 text 没给「用 activate_platform_pack 选具体版本档」的 hint`);
  // 正文泄漏探针：这些串只出现在归档正文里，隔离后不得回显。
  for (const leak of ["DeferredRegister.create(NeoForgeRegistries", "createBlockStateDefinition"]) {
    if (text.includes(leak)) fail(`2) ${uri} 泄漏归档正文片段「${leak}」`);
  }
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
  const inArchived = (uri) => {
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
  };
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
  else if (!/58 档全覆盖/.test(String(cov.stdout))) fail(`6) 覆盖统计不再是 58 档：${String(cov.stdout).trim()}`);
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
