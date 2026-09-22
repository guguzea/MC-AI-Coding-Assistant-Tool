#!/usr/bin/env node
/**
 * fetch-bedrock-script-api.mjs — @minecraft/server 的 index.d.ts → 结构化语料
 *
 * 输出树（2026-09-21 拆分后）：`data/bedrock_stable/bedrock-scriptapi/stable/` —— 逐声明页体裁与
 * Learn 文档页（`bedrock-docs` 树）分树，各自一条 `assert-corpus-semantics` 地板。
 * 页 id 仍为 `stable/scriptapi/<Name>`、正文仍在 `processed/scriptapi/**`（与拆分前逐字兼容，
 * 既有 id 链接与语义库 doc_id 可回溯）。机读产物 `scriptapi-typed.json` 随树走。
 *
 * 为什么走 .d.ts 而不是 HTML：Script API 那批页（toc 实测 scriptapi 族 1251 叶 + priorscriptapi 406 叶）
 * 走 Learn HTML 抓取成本高、结构差（导航/授权提示混进正文）。真正的源是 npm 包里的 TypeScript 声明，
 * 类/接口/方法/属性/文档注释全在里面，且版本可精确钉住。
 *
 * 与 assert-bedrock-script-api-pin.mjs 的口径关系（**不得打架**）：
 *   · 本脚本的默认目标版本 = `data/bedrock-docs-status.json.scriptApiStable`（Learn 文档快照值），
 *     那是「快照所载」语义；**本脚本不改这个字段**，只读它。
 *   · `mcp-server/data/bedrock-script-api-pin.json.scaffoldDependency.version`（模板钉值，按 npm
 *     dist-tags 复核）由那道门看守，本脚本只在输出里**披露**两者实况，绝不写、绝不推进。
 *
 *   node mcp-server/scripts/fetch-bedrock-script-api.mjs [--dry-run] [--version=2.9.0] [--source=unpkg|jsdelivr|tarball]
 *
 * 退出码：源取不到 / 解析出 0 条声明 / 任一页写盘失败 ⇒ 非 0。
 * 许可证：仓库不存 `.d.ts` 原文（源文件头是 Microsoft 版权 + 再分发限制），产物只留**用到的**声明片段
 *   并逐页标出处；下载件落在 gitignore 的 `mcp-server/scripts/_temp/`。
 */
import { existsSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";
import { downloadWithFallback, fetchJsonWithUa } from "../../scripts/_lib/fetch-with-ua.mjs";
import {
  SCRIPTAPI_OUT_DIR,
  SCRIPTAPI_PROCESSED_DIR,
  SCRIPTAPI_INDEX_L0,
  SCRIPTAPI_SOURCE,
  STATUS_PATH,
  REPO_ROOT,
  bedrockMdHeader,
  mergeIndexL0,
  pruneIndexToDisk,
  readJsonSafe,
  shortHash,
  writeJsonWithRetry,
  writeWithRetry,
} from "./_lib/bedrock-corpus.mjs";

const PKG = "@minecraft/server";
const REGISTRY = "https://registry.npmjs.org/@minecraft%2Fserver";
const TEMP = join(REPO_ROOT, "mcp-server", "scripts", "_temp");
// 导出给判据⑦的专族门（assert-bedrock-scriptapi-members）复用：路径与"源文件完整性"阈值
// 只留这一处真值，门里再写一份就会与生产者各自漂移。
export const TYPED_JSON = join(SCRIPTAPI_OUT_DIR, "scriptapi-typed.json");
export const MIN_SOURCE_BYTES = 50_000; // 2.9.0 实测 index.d.ts = 760885 B
export const PKG_NAME = PKG;

/** 顶级声明头：实测 2.9.0 = 444 class + 101 interface + 65 enum + 7 type + 7 const（全在 0 列）。 */
const TOP_DECL_RE = /^export (?:declare )?(?:abstract )?(class|interface|enum|type|const|function|namespace) ([\w$]+)/gm;

/**
 * 声明 → 写盘计划（大小写不敏感卷上的防覆盖腿）。
 *
 * `@minecraft/server` 的 d.ts 里「类 vs 全局常量」是成对的只差大小写的名字：2.9.0 实测
 * `System`(class) / `system`(const)、`World`(class) / `world`(const)。按 `name + ".md"` 直写，
 * 在 NTFS 上后写的会静默覆盖先写的 —— 实测丢的正是两页 class（最常被问的入口），而 index-l0
 * 仍按 624 条登记 ⇒ 「索引说有、正文没有」。与 fetch-forge-javadoc.js 的 planClassWrites 同法：
 * 碰撞的后来者拿确定性后缀，两条都保住；后缀由 name+kind 哈希得来，与文件系统、跑批顺序无关，
 * 哈希也不吃大小写以外的信息 —— 万一两条声明的 name+kind 完全等价（重复声明）而哈希相同，
 * 再叠一层碰撞序号，直到大小写不敏感地唯一为止。⇒ 「谁的页被覆盖」这件事在结构上不再可能。
 *
 * @param {{name:string,kind:string}[]} decls
 * @returns {{writes:{decl:{name:string,kind:string},fileName:string,collision:boolean}[],conflicts:object[]}}
 */
export function planScriptApiWrites(decls) {
  /** 大小写不敏感文件名 → 占用它的写盘名（用来在 conflicts 里点名"顶掉了谁"） */
  const occupied = new Map();
  /** 小写声明名 → 首条写盘名（conflicts.kept 优先指它） */
  const firstByName = new Map();
  const writes = [];
  const conflicts = [];
  for (const decl of decls) {
    const name = String(decl.name);
    const kind = String(decl.kind);
    const lowerKey = name.toLowerCase();
    const occupiedKey = (base) => `${base.toLowerCase()}.md`;
    let base = name;
    let collision = false;
    if (occupied.has(occupiedKey(base))) {
      collision = true;
      const stem = `${name}~${shortHash([name, kind]).slice(0, 6)}`;
      base = stem;
      for (let n = 2; occupied.has(occupiedKey(base)); n++) base = `${stem}+${n}`;
      conflicts.push({
        name,
        kind,
        kept: firstByName.get(lowerKey) ?? null,
        renamedTo: `${base}.md`,
        reason: "case-insensitive-name-collision",
      });
    }
    const fileName = `${base}.md`;
    occupied.set(occupiedKey(base), fileName);
    if (!firstByName.has(lowerKey)) firstByName.set(lowerKey, fileName);
    writes.push({ decl, fileName, collision });
  }
  // 不变量自证：上面的循环若被改坏（比如去掉序号那步），这里必须炸，而不是静默覆盖。
  const seen = new Map();
  for (const w of writes) {
    const k = w.fileName.toLowerCase();
    if (seen.has(k)) throw new Error(`scriptapi 写盘名仍然碰撞：${w.fileName} vs ${seen.get(k)} ⇒ 拒绝静默覆盖`);
    seen.set(k, w.fileName);
  }
  return { writes, conflicts };
}

/**
 * d.ts → 声明列表。
 * 用「相邻顶级声明头之间即上一条正文」切段：所有声明头都在 0 列（上方 TOP_DECL_RE 已按 `^` 锚定），
 * 成员一律缩进 4，所以不会出现误切。比手搓括号计数器少一整类失配风险。
 */
export function parseDts(src) {
  const text = String(src).replace(/\r\n/g, "\n");
  const heads = [];
  let m;
  TOP_DECL_RE.lastIndex = 0;
  while ((m = TOP_DECL_RE.exec(text))) {
    heads.push({ kind: m[1], name: m[2], start: m.index, headerStart: m.index });
  }
  const decls = [];
  for (let i = 0; i < heads.length; i++) {
    const h = heads[i];
    const end = i + 1 < heads.length ? heads[i + 1].start : text.length;
    const body = text.slice(h.start, end);
    const headerLine = body.split("\n")[0];
    const before = text.slice(0, h.start);
    const docBlock = leadingDoc(before);
    decls.push({
      kind: h.kind,
      name: h.name,
      header: headerLine.trim(),
      doc: cleanDoc(docBlock),
      body: body.slice(headerLine.length).trimEnd(),
      members: h.kind === "enum" ? enumMembers(body) : memberDecls(body),
    });
  }
  return decls;
}

/*
 * 取紧邻声明上方的 JSDoc。这里曾经是 128 MB 语料的根因：旧的 match 用 lazy 中段，会从
 * 文件里**第一个** doc 开注释一路扩到结尾那个 doc 闭注释（尾部能对上行尾锚点即可），
 * 于是每条声明的 doc 都装下了前面整篇文件。正确做法：先确认尾部以 doc 闭注释结束，
 * 再**反向**找最近的 doc 开注释。
 */
export function leadingDoc(before) {
  const tail = String(before || "").replace(/\s+$/, "");
  if (!tail.endsWith("*/")) return "";
  const start = tail.lastIndexOf("/**");
  if (start < 0) return "";
  const block = tail.slice(start);
  return block.length > 20_000 ? "" : block; // 防跑偏的第二道闸
}

function cleanDoc(block) {
  return String(block || "")
    .replace(/^\/\*\*|\*\/$/g, "")
    .split("\n")
    .map((l) => l.replace(/^\s*\*+\s?/, "").trimEnd())
    .filter((l, idx, arr) => !(l === "" && (idx === 0 || idx === arr.length - 1)))
    .join("\n")
    .trim();
}

/** 类/接口成员：4 空格缩进、不以 `*`（JSDoc 续行）或 `}` 开头的行即成员头。 */
function memberDecls(body) {
  const lines = body.split("\n");
  const out = [];
  let cur = null;
  for (const line of lines) {
    if (/^    (?:\/\*\*|\s\*)/.test(line)) {
      if (cur && cur.sig.length) { out.push(cur); cur = null; }
      if (!cur) cur = { doc: [], sig: [] };
      cur.doc.push(line.replace(/^ {4}(?:\/\*\*)?\s*\*?\s?/, "").replace(/\*\/\s*$/, ""));
      continue;
    }
    if (/^    \S/.test(line)) {
      if (!cur) cur = { doc: [], sig: [] };
      cur.sig.push(line.replace(/^ {4}/, ""));
      continue;
    }
    if (/^\}/.test(line)) { if (cur) { out.push(cur); cur = null; } continue; }
    if (cur && cur.sig.length) cur.sig.push(line.replace(/^ {4,}/, "").length ? `  ${line.trim()}` : "");
  }
  if (cur && (cur.sig.length || cur.doc.length)) out.push(cur);
  return out
    .map((c) => {
      let sig = c.sig.join("\n").trim();
      // 去掉访问器/内联对象体，只留签名（.d.ts 里方法一般无体，个别 get/set 带 { }）
      const braceAt = sig.indexOf("{");
      if (braceAt > 0) sig = sig.slice(0, braceAt).trim();
      const doc = c.doc.join("\n").replace(/^\u200b+/, "").trim();
      const name =
        (sig.match(/^\s*(?:static\s+|readonly\s+|abstract\s+|get\s+|set\s+|async\s+)*([A-Za-z_$][\w$]*)\s*[(:<?]/)?.[1] ??
          sig.split(/[\s(:]/)[0] ??
          "").replace(/^_+/, "");
      return { name: name || "(anonymous)", signature: sig, doc };
    })
    .filter((x) => x.signature)
    .slice(0, 400);
}

function enumMembers(body) {
  return [...body.matchAll(/^\s{4}([A-Za-z_$][\w$]*)\s*(?:=\s*([^,\n]+))?,?$/gm)].map((m) => ({
    name: m[1],
    signature: `${m[1]}${m[2] ? ` = ${m[2].trim()}` : ""}`,
    doc: "",
  }));
}

function pageFor(decl, meta) {
  const head = bedrockMdHeader(meta.sourceUrl, [
    `出处：npm ${PKG}@${meta.version} 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）`,
    `版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处`,
    `模块版本：${meta.version}｜${meta.sourceKind}`,
  ]);
  const parts = [head, `# ${decl.name} (${decl.kind})`, ""];
  parts.push("```ts", decl.header, "```", "");
  if (decl.doc) parts.push(decl.doc, "");
  if (decl.members.length) {
    parts.push(`## Members（${decl.members.length}）`, "");
    for (const mem of decl.members) {
      parts.push(`### \`${mem.name}\``, "```ts", mem.signature, "```");
      if (mem.doc) parts.push("", mem.doc);
      parts.push("");
    }
  }
  return parts.join("\n");
}

async function resolveVersion(requested) {
  const status = readJsonSafe(STATUS_PATH) ?? {};
  const version = requested || status.scriptApiStable || null;
  const reg = await fetchJsonWithUa(REGISTRY, { timeoutMs: 90_000 });
  const info = {
    requested: requested ?? null,
    from: requested ? "--version" : "bedrock-docs-status.scriptApiStable",
    version,
    registry: reg.ok ? { ok: true, latest: reg.json["dist-tags"]?.latest ?? null, hasVersion: Boolean(reg.json.versions?.[version ?? ""]) } : { ok: false, failureClass: reg.failureClass, status: reg.status, reason: String(reg.reason ?? "").slice(0, 200) },
    tarball: reg.json?.versions?.[version ?? ""]?.dist ?? null,
  };
  return info;
}

async function getSource(version, prefer) {
  mkdirSync(TEMP, { recursive: true });
  const dest = join(TEMP, `server-${version}-index.d.ts`);
  const urls = [];
  if (prefer !== "tarball") {
    urls.push({ kind: "unpkg", url: `https://unpkg.com/${PKG}@${version}/index.d.ts` });
    if (prefer !== "unpkg") urls.push({ kind: "jsdelivr", url: `https://cdn.jsdelivr.net/npm/${PKG}@${version}/index.d.ts` });
  }
  const tried = [];
  for (const u of urls) {
    const r = await downloadWithFallback({ url: u.url, dest, minBytes: MIN_SOURCE_BYTES, preferCurl: process.platform === "win32" });
    if (r.ok) return { ...u, bytes: r.bytes, via: r.via, tried };
    tried.push({ url: u.url, failureClass: r.failureClass ?? "UNKNOWN", status: r.status ?? 0, reason: String(r.reason ?? "").slice(0, 200) });
  }
  return { ok: false, tried };
}

/** tarball 兜底：registry 的 dist.tarball → _temp → tar -xzf 取 package/index.d.ts。 */
async function getFromTarball(version, tarballUrl) {
  if (!tarballUrl) return { ok: false, tried: [{ reason: "registry 未给 dist.tarball" }] };
  mkdirSync(TEMP, { recursive: true });
  const tgz = join(TEMP, `server-${version}.tgz`);
  const d = await downloadWithFallback({ url: tarballUrl, dest: tgz, minBytes: 20_000, preferCurl: process.platform === "win32" });
  if (!d.ok) return { ok: false, tried: [{ url: tarballUrl, failureClass: d.failureClass, reason: String(d.reason ?? "").slice(0, 200) }] };
  const x = spawnSync("tar.exe", ["-xzf", tgz, "-C", TEMP, "package/index.d.ts"], { windowsHide: true, encoding: "utf8" });
  const out = join(TEMP, "package", "index.d.ts");
  if (x.status !== 0 || !existsSync(out)) {
    return { ok: false, tried: [{ url: tarballUrl, failureClass: "UNPACK_FAILED", reason: `tar exit ${x.status} ${String(x.stderr ?? "").slice(0, 200)}` }] };
  }
  return { kind: "tarball", url: tarballUrl, path: out, bytes: statSync(out).size };
}

async function main() {
  const dry = process.argv.includes("--dry-run");
  const wantVersion = (process.argv.find((a) => a.startsWith("--version=")) ?? "").slice(10) || null;
  const prefer = (process.argv.find((a) => a.startsWith("--source=")) ?? "").slice(9) || "unpkg";

  const rv = await resolveVersion(wantVersion);
  console.log(`target ${PKG}@${rv.version}（来源 ${rv.from}）；registry: ${JSON.stringify(rv.registry)}`);
  if (!rv.version) {
    console.error("FAIL：既没有 --version，也没有 bedrock-docs-status.scriptApiStable ⇒ 无目标版本");
    process.exitCode = 1;
    return;
  }
  if (rv.registry.ok && !rv.registry.hasVersion) {
    console.error(`FAIL：npm registry 里没有 ${PKG}@${rv.version}（latest=${rv.registry.latest}）—— 不猜版本、不默默换成 latest`);
    process.exitCode = 1;
    return;
  }

  let src = await getSource(rv.version, prefer);
  if (!src.ok && !src.bytes) {
    const tb = await getFromTarball(rv.version, rv.tarball?.tarball);
    if (tb.ok) src = { ...tb, path: tb.path };
    else {
      console.error(`FAIL：三条腿都没取到 index.d.ts：${JSON.stringify([...(src.tried ?? []), ...(tb.tried ?? [])])}`);
      process.exitCode = 1;
      return;
    }
  }
  const raw = src.path ? readFileSync(src.path, "utf8") : readFileSync(join(TEMP, `server-${rv.version}-index.d.ts`), "utf8");
  if (raw.length < MIN_SOURCE_BYTES) {
    console.error(`FAIL：源文件只有 ${raw.length} 字节（< ${MIN_SOURCE_BYTES}），不像完整 index.d.ts`);
    process.exitCode = 1;
    return;
  }
  const sha256 = createHash("sha256").update(raw).digest("hex");
  const meta = {
    pkg: PKG,
    version: rv.version,
    sourceUrl: src.url,
    sourceKind: src.kind,
    bytes: raw.length,
    sha256,
    npmLatest: rv.registry.latest ?? null,
    integrity: rv.tarball?.integrity ?? null,
    unpackedSize: rv.tarball?.unpackedSize ?? null,
    retrievedAt: new Date().toISOString(),
  };

  const decls = parseDts(raw);
  const byKind = {};
  for (const d of decls) byKind[d.kind] = (byKind[d.kind] ?? 0) + 1;
  const memberTotal = decls.reduce((a, d) => a + d.members.length, 0);
  console.log(`parsed: ${decls.length} 顶级声明 ${JSON.stringify(byKind)} / 成员 ${memberTotal} 条`);
  if (!decls.length) {
    console.error("FAIL：解析出 0 条顶级声明 ⇒ 解析器与源文件体例不符，不能当「这个包没有 API」");
    process.exitCode = 1;
    return;
  }

  if (dry) {
    console.log(JSON.stringify({
      dryRun: true,
      meta,
      outDir: SCRIPTAPI_PROCESSED_DIR,
      wouldWrite: decls.length,
      sampleIds: decls.slice(0, 5).map((d) => `stable/scriptapi/${d.name}`),
      samplePage: pageFor(decls.find((d) => d.kind === "class" && d.members.length > 3) ?? decls[0], meta).slice(0, 900),
    }, null, 2));
    return;
  }

  const ver = "stable";
  const pageDir = join(SCRIPTAPI_PROCESSED_DIR, "scriptapi");
  mkdirSync(pageDir, { recursive: true });
  const index = [];
  const failures = [];
  const { writes, conflicts } = planScriptApiWrites(decls);
  if (conflicts.length) {
    console.log(`  [CONFLICT] scriptapi 大小写碰撞 ${conflicts.length} 条，已用确定性后缀并存：${conflicts.map((c) => `${c.name}(${c.kind})→${c.renamedTo}`).join(" ")}`);
  }
  let written = 0;
  let skipped = 0;
  for (const { decl: d, fileName, collision } of writes) {
    const base = fileName.replace(/\.md$/, "");
    const id = `scriptapi/${base}`;
    const md = pageFor(d, meta);
    try {
      await writeWithRetry(join(pageDir, `${base}.md`), md);
      written++;
    } catch (e) {
      failures.push({ id, failureClass: e.code ?? "WRITE_FAIL", reason: String(e.message ?? e).slice(0, 200) });
      continue;
    }
    index.push({
      id: `${ver}/${id}`,
      version: ver,
      label: `${d.name} (${d.kind}) — ${PKG}@${rv.version}${collision ? " [碰撞改名并存]" : ""}`,
      url: `https://www.npmjs.com/package/${PKG}/v/${rv.version}`,
      tags: ["script", "scriptapi", d.kind, "typed"],
      priority: "⭐",
      sectionCount: 1,
      source: SCRIPTAPI_SOURCE,
      origin: "npm-dts",
      fetchedAt: meta.retrievedAt,
      sha256: createHash("sha256").update(md).digest("hex"),
    });
  }
  const mergedAll = mergeIndexL0(index, SCRIPTAPI_INDEX_L0);
  // 只剪自己命名空间里的旧 id：碰撞改名后 `stable/scriptapi/system` 这类条目会在索引里
  // 指着别人的文件，不剪就是「索引条目数 > 正文文件数」。
  const { kept: merged, pruned } = pruneIndexToDisk(mergedAll, `${ver}/scriptapi/`, pageDir);
  if (pruned.length) {
    console.log(`  [PRUNE] 索引里正文已不存在的 scriptapi 旧条目 ${pruned.length} 条：${pruned.map((p) => p.id).join(" ")}`);
  }
  await writeJsonWithRetry(SCRIPTAPI_INDEX_L0, merged);
  await writeJsonWithRetry(TYPED_JSON, {
    ...meta,
    decls: decls.map((d) => ({ name: d.name, kind: d.kind, header: d.header, doc: d.doc, members: d.members })),
  });

  const status = readJsonSafe(STATUS_PATH) ?? {};
  await writeJsonWithRetry(STATUS_PATH, {
    ...status,
    scriptApiTyped: {
      pkg: PKG,
      version: rv.version,
      versionBasis: `bedrock-docs-status.scriptApiStable（本字段由 fetch-bedrock-docs.js 维护，本脚本只读不写）`,
      decls: decls.length,
      pages: written,
      collisions: conflicts,
      indexEntries: merged.length,
      prunedStaleIndexEntries: pruned,
      members: memberTotal,
      source: src.kind,
      sourceBytes: raw.length,
      sha256,
      npmLatest: meta.npmLatest,
      retrievedAt: meta.retrievedAt,
      rawNotStored: "index.d.ts 原文只落 mcp-server/scripts/_temp/（gitignore），仓库内不存原文，产物为逐声明摘录 + 出处",
      pinGateNote: "模板钉值由 mcp-server/scripts/assert-bedrock-script-api-pin.mjs 看守，本脚本不参与、不推进",
    },
  });
  console.log(`wrote ${written} 页（跳过 ${skipped}）→ ${pageDir}；index-l0 共 ${merged.length} 条；typed JSON → ${TYPED_JSON}`);
  if (failures.length) {
    console.error(`FAILURES ${failures.length}：`);
    for (const f of failures.slice(0, 10)) console.error(`  - ${f.id}: ${f.failureClass} ${f.reason}`);
    process.exitCode = 1;
  }
}

if (pathToFileURL(process.argv[1] ?? "").href === import.meta.url) {
  main().catch((e) => {
    console.error(e);
    process.exitCode = 1;
  });
}
