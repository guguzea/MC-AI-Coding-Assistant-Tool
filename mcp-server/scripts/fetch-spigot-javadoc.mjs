#!/usr/bin/env node
/**
 * fetch-spigot-javadoc.mjs —— 服务端面**签名层**取数器（Spigot/Bukkit 与 Paper Javadoc）。**默认 dry-run**。
 *
 * ## 为什么这是"签名面"而不是第二个文档面
 * 文档面（`data/paper_stable/paper-docs/`，已接）给的是**教程正文**；本脚本抓的是 **API 名字与签名**。
 * 两者不同源、不同口径，**不要混成一个 index**：正文面回答"怎么写插件"，签名面回答"这个方法到底叫
 * 什么、参数是什么、哪个版本有"。本仓红线「禁止凭训练记忆补 API 名」靠的就是这一面。
 *
 * ## 落点（必须服从 `versionDataDir` 的 `<platform>_<ver>/<source>/<ver>` 拼法 —— **不是** `data/<face>_javadoc/<ver>/`）
 *   data/<face>_stable/<face>-javadoc/stable/
 *     ← 现役两棵：`data/paper-api_stable/paper-javadoc/stable/` · `data/spigot_stable/spigot-javadoc/stable/`
 *     raw/<包路径 `.`→`_` 连接>_<Class>.html   ← 原样留底（**只许 .md/.html**，不许 tmp 残件）
 *     processed/<同 index id 去 `stable/` 前缀>.md ← frontmatter(source/sourceType/fetchedWith/fetchedAt/asOfVersion) + 签名正文
 *     index-l0.json                 ← 字段集与 forge_javadoc 同：id/version/label/url/tags/priority/sectionCount
 *     meta.json                     ← 本脚本加：出处、as-of 版本串、计数（**现役两棵树未入库本文件**，重跑即补回）
 *     _orphan-report.json           ← 孤儿留痕（有 raw/ 必有它，见 assert-javadoc-orphan-record 的判据）
 *   ⚠ **扁平唯一名，不拍嵌套目录**：包路径 `.`→`_`、嵌套类保留 `.`（同包名同类会让嵌套布局撞 A2 判据，
 *   见 `assert-corpus-faithfulness.mjs:116-117`）；store 的 `processedFileFor` 只剥版本前缀
 *   （`src/docs-platform/fabric/store.ts:307`）⇒ id 与磁盘相对路径必须同名同形。
 *
 * ## 为什么用 `type-search-index.js` 而不是解 HTML 目录
 * Javadoc 9+ 自动生成 `type-search-index.js`（**紧凑 JSON**）：
 *   `typeSearchIndex = [{"p":"org.bukkit.entity","l":"AbstractArrow","k":"10"}, …]`
 * 实测 **Spigot 与 Paper 两站同款**（各 200）⇒ 一套解析器吃两个站，且类名清单**来自站点自身**、不是我拼的。
 *
 * ## 版本轴（两站不同，这是本脚本最要紧的一条）
 * - **Paper**：URL 自带版本轴（`jd.papermc.io/paper/26.3/`，实测 200；`1.21.4` / `1.20.6` / `1.20.1` 亦 200）。
 * - **Spigot**：URL **没有**版本轴（`/spigot/1.21.4/` → 实测 **404**）。版本串只能从页面自身读 ——
 *   `overview-summary.html` 实测含 **`26.3-R0.1-SNAPSHOT`**（`deprecated-list.html` 同）。
 *   ⇒ 本脚本**从页面读版本并写进 meta.json 的 `asOfVersion`**，作为该档的钉值；**上游真实版本串**由 `--version` 显式给，
 *   且**必须与读到的 asOfVersion 一致**（不一致即拒，防"目录名写着 A、正文其实出自 B"—— 这正是
 *   `assert-javadoc-build-provenance.mjs` 第 5-7 行记的那类不可核缺陷）。
 *
 * ## 用法
 *   node scripts/fetch-spigot-javadoc.mjs --list                    # 只出清单与计数
 *   node scripts/fetch-spigot-javadoc.mjs --packages org.bukkit     # 限定包（探针用）
 *   node scripts/fetch-spigot-javadoc.mjs --face paper --base https://jd.papermc.io/paper/26.3 \
 *   # 现役两棵树的重跑形态（伪版本 `stable` + 真实版本串留每页 `asOfVersion`）：
 *   node scripts/fetch-spigot-javadoc.mjs --face paper --base https://jd.papermc.io/paper/26.3 \
 *        --version 26.3.build.178-stable --pseudo-version stable \
 *        --out ../../data/paper-api_stable/paper-javadoc/stable --fetch
 *   node scripts/fetch-spigot-javadoc.mjs --face spigot \
 *        --version 26.3-R0.1-SNAPSHOT --pseudo-version stable \
 *        --out ../../data/spigot_stable/spigot-javadoc/stable --fetch
 *   # 两个版本位分工（2026-10-15 拆分）：`--version` = **上游真实版本串**，只与页面 `asOfVersion` 双向钉；
 *   #   `--pseudo-version` = **档目录名 + index 的 `id`/`version` 前缀**（缺省 = `--version`）。**注意**：缺省值也要过白名单，
 *   #   而 Spigot/Paper 的真实串（`26.3-R0.1-SNAPSHOT` / `26.3.build.178-stable`）**不在**白名单内 ⇒ 抓本仓两个面时**必须**显式给
 *   #   `--pseudo-version stable`（不给就 fail-closed 拒，而不是像 2026-10-14 之前那样写出 store 读不到的 id）。
 *   #   后者必须落在 store 的前缀白名单（数值版本 / `stable`）内，且仓库内落点目录名必须与它同名 —— 两条都 fail-closed。
 *   # --fetch 才落盘；不加 = dry-run（只打印，不写任何文件、不建目录）
 */

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const MCP = path.resolve(HERE, "..");
const REPO = path.resolve(MCP, "..");
const CACHE = process.env.MC_SKILL_CACHE || path.join(os.tmpdir(), "mc-skill-cache");

const argv = process.argv.slice(2);
const has = (f) => argv.includes(f);
const opt = (f) => {
  const i = argv.indexOf(f);
  return i >= 0 ? argv[i + 1] : undefined;
};

const FACE = opt("--face") || "spigot";
const BASE = (opt("--base") || (FACE === "paper" ? "https://jd.papermc.io/paper/26.3" : "https://hub.spigotmc.org/javadocs/spigot")).replace(/\/+$/, "");
const VERSION = opt("--version"); // 必填：**上游真实版本串**，只与页面 asOfVersion 双向钉
const PSEUDO = opt("--pseudo-version") || VERSION; // 档目录名 + index 的 id/version 前缀（缺省 = VERSION；带后缀的真实串过不了白名单 ⇒ 那时必须显式给）
const OUT = opt("--out");
const FETCH = has("--fetch");
const LIST = has("--list");
const PKGS = (opt("--packages") || "").split(",").map((s) => s.trim()).filter(Boolean);
const LIMIT = Number(opt("--limit") || 0);
const OFFSET = Number(opt("--offset") || 0);

/**
 * 取页面字节。
 *
 * **用 Node 内置 fetch，不 spawn curl**：首版每个类 spawn 一次 `curl.exe`，实测 **≈1.3 秒/类**
 * ⇒ 全量 1397 类要约 **30 分钟**（不可接受，且本工具链会回收长跑子进程）。改内置 fetch 后连接复用，
 * 量级降到百毫秒级。
 * 两个站都是公开只读 ⇒ **不带任何 auth 头**（凭据既不进 argv 也不进 header）。
 */
async function get(url) {
  const r = await fetch(url, {
    redirect: "follow",
    signal: AbortSignal.timeout(30000),
    headers: { "user-agent": "mc-skill-javadoc-fetcher/1" },
  });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return await r.text();
}

console.log(`面 = ${FACE} · base = ${BASE}`);
if (!VERSION && !LIST) throw new Error("必须显式给 --version（上游真实版本串；会与页面读到的 asOfVersion 双向对钉）");

// ── ① 类清单：来自站点自身的 type-search-index.js ───────────────────────────────
/**
 * 从 `typeSearchIndex = [...]` 里取出数组字面量。
 * **不用正则**：首版用 `/typeSearchIndex\s*=\s*(\[[\s\S]*?\])\s*;?\s*$/`（带 `$` 锚），实测**直接抛**
 * —— 文件尾只要有任何残留（换行/尾随代码）就对不上。改成**平衡括号扫描**：从 `= [` 起按深度走，
 * 遇到字符串就整体跳过（字符串里可能出现 `]`，例如泛型或数组签名）。
 */
function extractTypeIndex(src) {
  const key = src.indexOf("typeSearchIndex");
  if (key < 0) throw new Error("没找到 typeSearchIndex 标识符");
  const start = src.indexOf("[", key);
  if (start < 0) throw new Error("typeSearchIndex 后没有 [");
  let depth = 0;
  let inStr = false;
  let quote = "";
  for (let i = start; i < src.length; i++) {
    const c = src[i];
    if (inStr) {
      if (c === "\\") i++;
      else if (c === quote) inStr = false;
      continue;
    }
    if (c === '"' || c === "'") {
      inStr = true;
      quote = c;
    } else if (c === "[") depth++;
    else if (c === "]") {
      depth--;
      if (depth === 0) return src.slice(start, i + 1);
    }
  }
  throw new Error("括号不平衡：typeSearchIndex 的数组没有闭合");
}

const typesRaw = await get(`${BASE}/type-search-index.js`);
let types;
try {
  const parsed = JSON.parse(extractTypeIndex(typesRaw));
  // ⚠ `typeSearchIndex` 里混着 **1 条导航项**、它不是类型：`{"l":"All Classes and Interfaces","u":"allclasses-index.html","k":"18"}`。
  // 实测两站各 1 条（字段分布 spigot `[k,l,p]`876 + `[l,p]`520 + `[k,l,u]`1；paper 1312 + 804 + 1）。
  // 缺 `p` 的一律跳过 —— 首版没跳，`t.p.replace()` 直接 TypeError 把整跑打断（实测 2026-10-14）。
  types = parsed.filter((t) => t.p && t.l);
  const skippedNav = parsed.length - types.length;
  if (skippedNav) console.log(`（跳过 ${skippedNav} 条非类型的导航项：缺 p 字段）`);
} catch (e) {
  throw new Error(
    `type-search-index.js 解析失败：${e.message}\n` +
      `  len=${typesRaw.length} head=${JSON.stringify(typesRaw.slice(0, 120))} tail=${JSON.stringify(typesRaw.slice(-80))}`,
  );
}
console.log(`typeSearchIndex：${types.length} 个类型 · 包 ${new Set(types.map((t) => t.p)).size} 个`);

// ── ② as-of 版本串：从页面自身读（Spigot 唯一可证版本的路径）────────────────────
/**
 * 读到页面自带的 as-of 版本串。**两个站点的读法不同（都是实测出来的）**：
 *  - **Spigot**：`overview-summary.html` 里有 `26.3-R0.1-SNAPSHOT`（`deprecated-list.html` 同）⇒ 按 `-R\d`/`SNAPSHOT` 特征排名取众数。
 *  - **Paper**：**没有 `overview-summary.html`**（新版 javadoc 换了索引页，实测该 URL 拿不到）⇒ 版本在 `index.html` 的 `<title>`：
 *    `Overview (paper-api 26.3.build.178-stable API)` ⇒ 取 `API` 前那个 token = `26.3.build.178-stable`。
 * 首版只有 Spigot 那一路，Paper 因此被 fail-closed 拒掉（**拒得对**：宁可拒，不许自造版本）。
 */
async function readAsOfVersion() {
  // 路 1：<title> 里的 `<token> API`（Paper）
  for (const p of ["index.html", "overview-summary.html", "help-doc.html"]) {
    let c = "";
    try {
      c = await get(`${BASE}/${p}`);
    } catch {
      continue;
    }
    const t = c.match(/<title>([^<]*)<\/title>/);
    if (t) {
      const v = t[1].match(/([A-Za-z0-9_.\-]*\d[A-Za-z0-9_.\-]*)\s+API/i);
      if (v && /\d/.test(v[1])) return { v: v[1], from: `${p}:<title>` };
    }
  }
  // 路 2：Spigot 式 —— 页面里的 `-R\d`/`SNAPSHOT` 版本串众数
  for (const p of ["overview-summary.html", "deprecated-list.html", "help-doc.html"]) {
    let c = "";
    try {
      c = await get(`${BASE}/${p}`);
    } catch {
      continue;
    }
    const cands = [...c.matchAll(/\b\d+\.\d+(?:\.\d+)?(?:-R\d+(?:\.\d+)*)?(?:-SNAPSHOT)?\b/g)].map((x) => x[0]);
    const ranked = cands
      .filter((v) => /-R\d|SNAPSHOT/.test(v))
      .sort((a, b) => cands.filter((x) => x === b).length - cands.filter((x) => x === a).length);
    if (ranked[0]) return { v: ranked[0], from: p };
  }
  return { v: "", from: "" };
}

const asOf = LIST ? { v: "", from: "" } : await readAsOfVersion();
let asOfVersion = asOf.v;
if (asOfVersion) console.log(`as-of 版本串 = ${asOfVersion}（出自 ${asOf.from}）`);
if (!LIST) {
  if (!asOfVersion) {
    throw new Error(
      `读不到页面自带版本串（${BASE}/overview-summary.html）⇒ 按本仓纪律**不能自造版本**（会造成"目录名写着 A、正文出自 B"的不可核档）。`,
    );
  }
  if (asOfVersion !== VERSION) {
    throw new Error(`版本双向对钉失败：--version=${VERSION} 但页面读到 ${asOfVersion}。以页面为准（语料自身可证）。`);
  }
  console.log(`as-of 版本串 = ${asOfVersion}  ✅ 与 --version 一致`);
}

// ── ③ 清单输出 / 落盘 ────────────────────────────────────────────────────────
let picked = types;
if (PKGS.length) picked = picked.filter((t) => PKGS.includes(t.p));
// 分块口径：`--offset` 先切、`--limit` 后切 —— 全量语料在本工具链下**必须分块同步抓**
// （detached 长跑会被回收子进程，实测 2026-10-14：1397 类只落了 22 个就没了）。
// 分块是**幂等**的：index 与已有文件合并、孤儿报告从磁盘扫 ⇒ 任意顺序/重复跑都收敛到同一结果。
if (OFFSET) picked = picked.slice(OFFSET);
if (LIMIT) picked = picked.slice(0, LIMIT);
console.log(
  `\n选中 ${picked.length} 个类型` +
    (PKGS.length ? `（包过滤：${PKGS.join(", ")}）` : "") +
    (OFFSET || LIMIT ? `（offset=${OFFSET || 0} limit=${LIMIT || "-"}）` : ""),
);
for (const t of picked.slice(0, 8)) console.log(`  ${t.p}.${t.l}`);
if (picked.length > 8) console.log(`  … 其余 ${picked.length - 8} 个`);

if (LIST || !FETCH) {
  console.log("\n[dry-run] 未写任何文件。落盘请显式加 --fetch --out <dir>。");
  console.log("（签名面只给名字/签名/出处；正文教程面在 data/paper_stable/paper-docs/，两者不要混。）");
  process.exit(0);
}
if (!OUT) throw new Error("--fetch 必须同时给 --out（显式落点）");

/**
 * PSEUDO（档目录名 + index 的 id/version 前缀）必须落在 store 的前缀白名单里。
 * 白名单**逐字照抄** `src/docs-platform/fabric/store.ts:307` 的正则：只认「数值版本」与 `stable`。
 * 违反的后果不是报错而是**静默读空**（id 前缀剥不掉 ⇒ `processedFileFor` 拼出 `<pseudo>/…md`）。
 */
const STORE_PREFIX_WHITELIST = /^(?:\d+\.\d+(?:\.\d+)?|stable)$/;
if (!STORE_PREFIX_WHITELIST.test(PSEUDO)) {
  throw new Error(
    `--pseudo-version=${PSEUDO} 不在 store 白名单（数值版本 / stable）⇒ 会写出读不到的 id（src/docs-platform/fabric/store.ts:307）。`,
  );
}

const dest = path.resolve(OUT);
if (!dest.startsWith(REPO)) {
  console.log(`⚠ 落点在仓库外（${dest}）—— 正式语料应落 data/<face>_stable/<face>-javadoc/stable/`);
} else if (path.basename(dest) !== PSEUDO) {
  // 仓库内落点必须与 id 前缀同名：`versionDataDir` 拼死 `<platform>_<ver>/<source>/<ver>`
  // （`src/docs-platform/fabric/store.ts:420`）⇒ 目录名与 id 前缀不一致 = "目录写着 A、正文出自 B"的不可核档。
  throw new Error(`落点目录名 ${path.basename(dest)} 与 --pseudo-version=${PSEUDO} 不一致（仓库内两处必须同名）。`);
}
const rawDir = path.join(dest, "raw");
const procDir = path.join(dest, "processed");
fs.mkdirSync(rawDir, { recursive: true });
fs.mkdirSync(procDir, { recursive: true });

const fetchedAt = new Date().toISOString();
const PRODUCER_REV = "fetch-spigot-javadoc.mjs@1";
const entries = [];
const gotRaw = new Set();
const gotProc = new Set();
let failed = 0;

/**
 * 续抓底座：把已有的 `index-l0.json` 读进来当**合并底**（不是覆盖底）。
 * 这样"分块抓"与"某块重跑"都收敛到同一个最终 index —— 不必一次抓完 1397 类。
 */
const indexPath = path.join(dest, "index-l0.json");
const entriesById = new Map();
if (fs.existsSync(indexPath)) {
  try {
    const prev = JSON.parse(fs.readFileSync(indexPath, "utf8"));
    if (Array.isArray(prev)) for (const e of prev) entriesById.set(e.id, e);
    console.log(`（续抓：已有 index ${entriesById.size} 条，本轮在其上合并）`);
  } catch (e) {
    console.log(`⚠ 已有 index-l0.json 解析失败（${e.message}）⇒ 本轮以空集为底、末尾整体重写`);
  }
}

/**
 * 单个类型：抓 + 落盘（**幂等** —— 同 id 重跑覆盖同路径的同名文件）。
 * 不抛：失败以 `{ err }` 返回，交给批次汇总，**不让一个 404 打断整块**（首版串行时正是这类打断）。
 */
async function fetchOne(t) {
  const pkgPath = t.p.replace(/\./g, "/"); // **仅**用于拼上游 URL
  // 落盘名必须是**扁平唯一名**（`包路径 /`→`_` + `_` + 类名）：store 的 `processedFileFor` 只剥版本前缀、
  // 不做包路径变换；嵌套布局会同时撞 `assert-corpus-faithfulness` 的 dup 与 `assert-signature-face-integrity`
  // 的 index↔盘双向。2026-10-14 已把既有两档改成扁平，但**本函数当时没跟着改**（代码与盘上不符）——
  // 2026-10-23 抓 1.21.4 时按嵌套落了 1871 页才暴露：dup=65、store 读不到。现按盘上口径修正。
  const cls = t.l.replace(/<[^>]+>/g, "");
  const flat = `${t.p.replace(/\./g, "_")}_${cls}`;
  const rel = `${pkgPath}/${cls}.html`;
  const url = `${BASE}/${rel}`;
  let html;
  try {
    html = await get(url);
  } catch (e) {
    return { name: `${t.p}.${cls}`, err: e.message };
  }
  if (!html || html.length < 200 || /^404|Not Found/i.test(html.slice(0, 40))) {
    return { name: `${t.p}.${cls}`, err: "空/404" };
  }
  fs.mkdirSync(rawDir, { recursive: true });
  fs.mkdirSync(procDir, { recursive: true });
  fs.writeFileSync(path.join(rawDir, `${flat}.html`), html, "utf8");

  // 签名抽取：javadoc 的 `member-signature` 块是**唯一真源**（实测 Spigot 165 处 / Paper 226 处）
  const sigs = [...html.matchAll(/<div class="member-signature">([\s\S]*?)<\/div>/g)].map((x) =>
    x[1]
      .replace(/<[^>]+>/g, "")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&")
      .replace(/&nbsp;/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
  );
  // 空页不是缺陷页：老版本 javadoc 对「嵌套类 / 注解 / 纯继承接口」只输出 type-signature，没有
  // member-signature 块（2026-10-23 实测 1.21.4 档 165/1871 = 8.8%，而 26.3 档 0 个）。原来的占位
  // 只有 12 字，会被 `assert-corpus-semantics` 判成 stub（bodyChars<40 且无 `##` 节），撞全局
  // `totalStubBudget`。换成**可核的事实描述**（不是灌水）：说明该页为何没有签名。
  const EMPTY = (t) =>
    `_（上游 javadoc 的 \`${t.p}.${cls}\` 页只输出类型声明、没有 \`member-signature\` 块：该类未声明自己的成员，` +
    `成员全部继承自父类型。本档据此不产出成员签名，非抓取失败。）_`;
  const body = sigs.length ? sigs.map((s) => `- \`${s}\``).join("\n") : EMPTY(t);
  const header =
    `---\n` +
    `title: ${JSON.stringify(`${t.p}.${cls}`)}\n` +
    `package: ${JSON.stringify(t.p)}\n` +
    `source: ${url}\n` +
    `sourceType: javadoc\n` +
    `fetchedWith: ${PRODUCER_REV}\n` +
    `fetchedAt: ${fetchedAt}\n` +
    `asOfVersion: ${JSON.stringify(asOfVersion)}\n` +
    `---\n\n`;
  fs.writeFileSync(path.join(procDir, `${flat}.md`), header + body + "\n", "utf8");
  return {
    name: `${t.p}.${cls}`,
    rawRel: `${flat}.html`,
    procRel: `${flat}.md`,
    entry: {
      // id 与落盘同名同形（store 的 `processedFileFor` 只剥版本前缀）—— 扁平唯一名，不拍回嵌套目录
      id: `${PSEUDO}/${flat}`,
      version: PSEUDO,
      label: `${t.p}.${cls}`,
      url,
      tags: [FACE, "javadoc", t.p],
      priority: "⭐",
      sectionCount: sigs.length,
    },
  };
}

/**
 * 并发抓取。
 * **为什么必须并发**：实测单请求延迟 ≈**1 秒/类**（cache 试跑 0.49 秒/类，真落点 1.03 秒/类）
 * ⇒ 串行全量（Spigot 1397 + Paper 2117）要约 **1 小时**，而本工具链会回收长跑子进程。
 * 这是**延迟受限**（不是 CPU 受限）⇒ 批并发把等待重叠掉就是对症手段。
 * 默认 8；`--concurrency 1` 可退回串行（对照用）。
 */
const CONCURRENCY = Math.max(1, Number(opt("--concurrency") || 8));
const t0 = Date.now();
let done = 0;
for (let i = 0; i < picked.length; i += CONCURRENCY) {
  const batch = picked.slice(i, i + CONCURRENCY);
  const results = await Promise.all(batch.map((t) => fetchOne(t)));
  for (const r of results) {
    if (r.err) {
      failed++;
      console.log(`\n  FAIL ${r.name} :: ${r.err}`);
      continue;
    }
    gotRaw.add(r.rawRel);
    gotProc.add(r.procRel);
    entries.push(r.entry);
  }
  done += batch.length;
  if (picked.length > CONCURRENCY) {
    const el = Math.max(0.001, (Date.now() - t0) / 1000);
    process.stdout.write(`\r  进度 ${done}/${picked.length} · ${el.toFixed(0)}s · ${(done / el).toFixed(1)} 类/秒   `);
  }
}
if (picked.length > CONCURRENCY) {
  const el = Math.max(0.001, (Date.now() - t0) / 1000);
  process.stdout.write(`\r  完成 ${picked.length} 类 · ${el.toFixed(0)}s · ${(picked.length / el).toFixed(1)} 类/秒（并发 ${CONCURRENCY}）\n`);
}

// ── 合并 + 从**磁盘**重算（不是从本轮内存）──────────────────────────────────
// 为什么必须从磁盘算：分块抓时"本轮"只见过自己那一块，而 index 与孤儿报告描述的是**整档**状态。
// 从内存算 ⇒ 跑第二块会把第一块的条目抹掉、孤儿报告只剩第二块的。从磁盘算 ⇒ 半截状态自愈。
for (const e of entries) entriesById.set(e.id, e);
const merged = [...entriesById.values()].sort((a, b) => a.id.localeCompare(b.id));
fs.writeFileSync(indexPath, JSON.stringify(merged, null, 2) + "\n", "utf8");

function walkFiles(root, ext) {
  const out = [];
  const walk = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const full = path.join(d, e.name);
      if (e.isDirectory()) walk(full);
      else if (e.name.endsWith(ext)) out.push(path.relative(root, full).replace(/\\/g, "/"));
    }
  };
  if (fs.existsSync(root)) walk(root);
  return out;
}
const diskRaw = walkFiles(rawDir, ".html");
const diskProc = new Set(walkFiles(procDir, ".md"));
const orphan = diskRaw.map((p) => p.replace(/\.html$/, "")).filter((p) => !diskProc.has(`${p}.md`));

fs.writeFileSync(
  path.join(dest, "_orphan-report.json"),
  JSON.stringify(
    {
      version: PSEUDO,
      producerRev: PRODUCER_REV,
      count: orphan.length,
      orphans: orphan,
      rawTotal: diskRaw.length,
      processedTotal: diskProc.size,
      note:
        "有 raw/ 必有本文件（assert-javadoc-orphan-record 判据）。孤儿**只报告不代删**。" +
        "rawTotal/processedTotal 是**整档**盘上计数（从磁盘扫），不是本轮增量。",
    },
    null,
    2,
  ) + "\n",
  "utf8",
);

fs.writeFileSync(
  path.join(dest, "meta.json"),
  JSON.stringify(
    {
      face: FACE,
      base: BASE,
      version: PSEUDO,
      asOfVersion,
      fetchedWith: PRODUCER_REV,
      fetchedAt,
      counts: {
        typesInTypeIndex: types.length,
        indexEntries: merged.length,
        rawOnDisk: diskRaw.length,
        processedOnDisk: diskProc.size,
        orphans: orphan.length,
        thisRun: { picked: picked.length, offset: OFFSET, limit: LIMIT || null, failed },
      },
      note:
        "签名面（API 名/签名/出处）。教程正文面另在 data/paper_stable/paper-docs/，两者不同源、不要混成一个 index。" +
        "本档可**分块续抓**（--offset/--limit），index 与孤儿报告皆按整档重算 ⇒ 任意顺序重跑都收敛。" +
        "复跑现役形态：--version <上游真实串> --pseudo-version stable --out data/<face>_stable/<face>-javadoc/stable。",
    },
    null,
    2,
  ) + "\n",
  "utf8",
);

console.log(`\n已写出 ${dest}`);
console.log(`  本轮 raw ${gotRaw.size} / processed ${gotProc.size} · 失败 ${failed}`);
console.log(`  整档 raw ${diskRaw.length} / processed ${diskProc.size} · index ${merged.length} 条 · 孤儿 ${orphan.length}`);
console.log(`  as-of 版本 = ${asOfVersion}`);
if (diskProc.size < types.length && !LIMIT && !PKGS.length) {
  console.log(`  ⚠ 整档尚未抓完（${diskProc.size}/${types.length}）—— 续抓：再跑一次同命令（可配 --offset/--limit 分块）。`);
}
