#!/usr/bin/env node
/**
 * fetch-paper-docs.mjs —— Paper 插件开发文档提取器（服务端面语料，**默认 dry-run**）。
 *
 * ## 为什么不用 git clone（环境约束，别照抄别的 fetch-*-docs）
 * 本机网络上 `git clone https://github.com/papermc/docs` 会被 **RST**（实测 2026-10-14：
 * `error: RPC failed; curl 7 Recv failure: Connection was reset` / `fatal: expected 'packfile'`）。
 * ⇒ 唯一可走的取数是 **codeload tarball**（`https://codeload.github.com/<owner>/<repo>/tar.gz/refs/heads/main`）
 * 再 `tar -xzf`。本脚本把这条写死，避免后人重踩。
 *
 * ## 许可（**入库前必读**，记账落 `THIRD_PARTY_NOTICES.md`）
 * - 仓库代码：`LICENSE` = **BSD 2-Clause**
 * - **文档正文**：`LICENSE-docs` = **CC BY-SA 4.0**（署名 + **ShareAlike**）
 * ⇒ 正文一旦进 `data/`（随 Release 整包分发），衍生文本必须以 CC BY-SA 4.0 分发并署名；
 * **不得与 MIT 代码许可混写**。要绕开 ShareAlike 就只有"只做签名面"这一条路。
 *
 * ## 落点口径
 * Paper 文档**不按 MC 版本分目录**（就是"当前"文档）⇒ 落 `data/paper_main/`，
 * **不套** 现有 8 平台的 `data/<platform>_<ver>/` 形状（硬套 = 造一条假版本轴）。
 * 版本面另由 Javadoc（`jd.papermc.io/paper/`，实测 302 需跟跳转）承担。
 *
 * ## 用法
 *   node scripts/fetch-paper-docs.mjs                       # dry-run：只打印清单与统计
 *   node scripts/fetch-paper-docs.mjs --extract             # 解包到 $MC_SKILL_CACHE（不碰仓库）
 *   node scripts/fetch-paper-docs.mjs --extract --out <dir> # 显式落点（**写仓库正文必须显式传**）
 *   node scripts/fetch-paper-docs.mjs --tarball <path>      # 复用已下好的 tarball（省 86 MB 下载）
 */

import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const MCP = path.resolve(HERE, "..");
const CACHE = process.env.MC_SKILL_CACHE || path.join(os.tmpdir(), "mc-skill-cache");

const TARBALL_URL = "https://codeload.github.com/papermc/docs/tar.gz/refs/heads/main";
/** 只取开发者面：实测 `paper/dev/**` = 67 页（全站 195 页）。 */
const DEV_PREFIX = "src/content/docs/paper/dev/";

const argv = process.argv.slice(2);
const has = (f) => argv.includes(f);
const opt = (f) => {
  const i = argv.indexOf(f);
  return i >= 0 ? argv[i + 1] : undefined;
};

const EXTRACT = has("--extract");
const OUT = opt("--out");
const TARBALL = opt("--tarball") || path.join(CACHE, "papermc-docs.tar.gz");

function ensureTarball() {
  if (fs.existsSync(TARBALL) && fs.statSync(TARBALL).size > 1024 * 1024) {
    console.log(`tarball 复用：${TARBALL}（${(fs.statSync(TARBALL).size / 1048576).toFixed(1)} MB）`);
    return TARBALL;
  }
  fs.mkdirSync(path.dirname(TARBALL), { recursive: true });
  console.log(`下载 tarball（codeload，非 git）：${TARBALL_URL}`);
  const r = spawnSync("curl.exe", ["-sL", "-o", TARBALL, TARBALL_URL], { encoding: "utf8" });
  if (r.status !== 0 || !fs.existsSync(TARBALL)) throw new Error("curl 下载失败 rc=" + r.status);
  console.log(`下载完成：${(fs.statSync(TARBALL).size / 1048576).toFixed(1)} MB`);
  return TARBALL;
}

function unpack(tarball, dest) {
  fs.rmSync(dest, { recursive: true, force: true });
  fs.mkdirSync(dest, { recursive: true });
  const r = spawnSync("tar.exe", ["-xzf", tarball, "-C", dest, "--strip-components=1"], { encoding: "utf8" });
  if (r.status !== 0) throw new Error("tar 解包失败 rc=" + r.status + " " + (r.stderr || "").slice(0, 200));
  return dest;
}

function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else if (/\.mdx?$/.test(e.name)) acc.push(p);
  }
  return acc;
}

/** Paper 正文里的机读符号语法：`[](jd:paper:org.bukkit.scheduler.BukkitScheduler)`。 */
const JD_RE = /jd:paper:([A-Za-z0-9_$.]+)/g;

/**
 * 去掉 UTF-8 BOM。
 * **实测 2026-10-14**：`papermc/docs` 里有一部分 `.md` 页**以 BOM 开头**，直接拿 `^---` 匹配 frontmatter
 * 会全部落空 ⇒ `title` / `slug` 空着进产物（首版真踩，页样例 `api/scheduler.md`）。BOM 必须在**最前**剥。
 */
function stripBom(text) {
  return text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
}

function frontmatter(text) {
  const t = stripBom(text);
  const m = t.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) return { meta: {}, body: t };
  const meta = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (kv) meta[kv[1]] = kv[2].replace(/^["']|["']$/g, "").trim();
  }
  return { meta, body: t.slice(m[0].length) }; // 从**剥 BOM 后**的文本切，否则偏移差 1
}

const tarball = ensureTarball();
const work = path.join(CACHE, "papermc-docs-src");
if (!fs.existsSync(path.join(work, DEV_PREFIX)) || has("--refetch")) unpack(tarball, work);
console.log(`解包面：${work}`);

const devRoot = path.join(work, DEV_PREFIX);
const files = walk(devRoot).sort();
if (!files.length) throw new Error("没扫到 paper/dev 页 —— 目录形状变了？");

const pages = [];
const symbols = new Map();
let fenceLines = 0;
for (const f of files) {
  const raw = fs.readFileSync(f, "utf8");
  const { meta, body } = frontmatter(raw);
  const rel = path.relative(devRoot, f).replace(/\\/g, "/");
  fenceLines += (raw.match(/^```/gm) || []).length;
  const hits = [...body.matchAll(JD_RE)].map((m) => m[1]);
  for (const h of hits) {
    const list = symbols.get(h) ?? [];
    list.push(rel);
    symbols.set(h, list);
  }
  pages.push({ rel, slug: meta.slug || "", title: meta.title || "", description: meta.description || "", bytes: Buffer.byteLength(raw), jdRefs: hits.length });
}

console.log(`\n=== paper/dev 页数 = ${pages.length} · 代码围栏行 = ${fenceLines}（≈ ${Math.round(fenceLines / 2)} 个代码块）===`);
console.log(`=== 机读符号（jd:paper:）唯一 fqcn = ${symbols.size} · 引用点 = ${pages.reduce((a, p) => a + p.jdRefs, 0)} ===`);
for (const [k, v] of [...symbols.entries()].sort((a, b) => b[1].length - a[1].length).slice(0, 12)) {
  console.log(`  ${String(v.length).padStart(3)}x  ${k}`);
}
console.log("\n=== 前 8 页（rel / title / bytes / jdRefs）===");
pages.slice(0, 8).forEach((p) => console.log(`  ${p.rel}  |  ${p.title}  |  ${p.bytes}B  |  jd=${p.jdRefs}`));

if (!EXTRACT) {
  console.log("\n[dry-run] 未写任何文件。落正文请显式加 --extract（默认落 $MC_SKILL_CACHE；落仓库另加 --out <dir>）。");
  console.log("[许可提醒] 正文 = CC BY-SA 4.0（署名 + ShareAlike）⇒ 进 data/ 前必须先在 THIRD_PARTY_NOTICES.md 单列一节。");
  process.exit(0);
}

// ── 落盘：**照 bedrock_stable 的形状**（非版本伪版本 + FabricDocStore 可读）────────
//   data/paper_main/paper-docs/main/
//     index-l0.json      ← 7 字段，与 data/forge_1.20.1/forge-docs/1.20.1/index-l0.json 同集
//     processed/<id>.md  ← 正文；FabricDocStore 用「id 去 <version>/ 前缀」拼 processed/<bare>.md
//     （semantic/ 本脚本不产 —— 语义索引由 npm run build:semantic-index 补）
const dest = OUT ? path.resolve(OUT) : path.join(CACHE, "paper_main");
// 伪版本：Paper 文档不分 MC 版本（先例 = bedrock 的 "stable"）。
// ⚠ **必须是 `stable`，不能自造字面量**：`fabric/store.ts:307` 的正文前缀剥离正则是
// `/^(?:\d+\.\d+(?:\.\d+)?|stable)\//`，白名单只有「数值版本」与 `stable`。
// 用别的字面量（实测想过 `main`）⇒ 正文会被算成 `processed/main/<slug>.md` 而读空。
const VERSION = "stable";
const SUBDIR = "paper-docs";
const verDir = path.join(dest, SUBDIR, VERSION);
const processed = path.join(verDir, "processed");
fs.mkdirSync(processed, { recursive: true });
const fetchedAt = new Date().toISOString();

const entries = [];
for (const p of pages) {
  const src = path.join(devRoot, p.rel);
  const { body } = frontmatter(fs.readFileSync(src, "utf8"));
  // bare = id 去版本前缀后的那一截；正文文件名必须与它逐字一致（FabricDocStore.processedFileFor）
  const bare = p.rel.replace(/\//g, "__").replace(/\.mdx?$/, "");
  const upstreamUrl = p.slug ? `https://docs.papermc.io/${p.slug.replace(/^\/+/, "")}/` : "";
  const segs = p.rel.split("/");
  const tags = ["paper", ...segs.slice(0, -1)];
  const sectionCount = (body.match(/^##\s+\S/gm) || []).length;
  const header =
    `---\n` +
    `title: ${JSON.stringify(p.title)}\n` +
    `slug: ${JSON.stringify(p.slug)}\n` +
    `source: papermc/docs@main:${DEV_PREFIX}${p.rel}\n` +
    `sourceUrl: ${JSON.stringify(upstreamUrl)}\n` +
    `fetchedWith: fetch-paper-docs.mjs\n` +
    `fetchedAt: ${fetchedAt}\n` +
    `license: CC-BY-SA-4.0（LICENSE-docs）\n` +
    `---\n\n`;
  fs.writeFileSync(path.join(processed, `${bare}.md`), header + body, "utf8");
  entries.push({
    id: `${VERSION}/${bare}`,
    version: VERSION,
    label: p.title || bare,
    url: upstreamUrl,
    tags,
    priority: "⭐",
    sectionCount,
    source: SUBDIR,
    fetchedAt,
  });
}
fs.writeFileSync(path.join(verDir, "index-l0.json"), JSON.stringify(entries, null, 2) + "\n", "utf8");

// 旁挂（非检索必需）：页表 + 机读符号面
fs.writeFileSync(
  path.join(dest, "meta.json"),
  JSON.stringify(
    {
      platform: "paper",
      shape: "paper_main（不跟 MC 版本 —— Paper 文档是「当前」文档；版本轴由 Javadoc 承担）",
      storeLayout: `${SUBDIR}/${VERSION}/`,
      source: "https://github.com/papermc/docs",
      fetchedWith: "fetch-paper-docs.mjs",
      fetchedAt,
      license: { code: "BSD-2-Clause", docs: "CC-BY-SA-4.0" },
      counts: { pages: pages.length, fenceLines, uniqueSymbols: symbols.size, l0Entries: entries.length },
      pages: pages.map((p) => ({ rel: p.rel, title: p.title, slug: p.slug, bytes: p.bytes, jdRefs: p.jdRefs })),
    },
    null,
    2,
  ),
  "utf8",
);
fs.writeFileSync(
  path.join(dest, "symbols.json"),
  JSON.stringify(Object.fromEntries([...symbols.entries()].map(([k, v]) => [k, [...new Set(v)].sort()])), null, 2),
  "utf8",
);
console.log(`\n已写出：${verDir}`);
console.log(`  index-l0.json  = ${entries.length} 条`);
console.log(`  processed/     = ${fs.readdirSync(processed).length} 个 .md`);
console.log(`  meta.json + symbols.json（${symbols.size} 个 fqcn）在 ${dest}/`);
if (OUT && path.resolve(OUT).startsWith(path.resolve(MCP, "..", "data"))) {
  console.log("⚠ 落点在 data/ ⇒ 许可记账见 THIRD_PARTY_NOTICES.md 的 Paper 分节（CC BY-SA 4.0，署名 + ShareAlike）。");
  console.log("⚠ 语义索引未生成：检索只能按 L0（标题/标签）与符号面，正文词项 0 命中 ≠ 该 API 不存在。");
}
fs.writeFileSync(
  path.join(dest, "meta.json"),
  JSON.stringify(
    {
      platform: "paper",
      shape: "paper_main（不跟 MC 版本 —— Paper 文档是「当前」文档；版本轴由 Javadoc 承担）",
      source: "https://github.com/papermc/docs",
      fetchedWith: "fetch-paper-docs.mjs",
      fetchedAt,
      license: { code: "BSD-2-Clause", docs: "CC-BY-SA-4.0" },
      counts: { pages: pages.length, fenceLines, uniqueSymbols: symbols.size },
      pages: pages.map((p) => ({ rel: p.rel, title: p.title, slug: p.slug, bytes: p.bytes, jdRefs: p.jdRefs })),
    },
    null,
    2,
  ),
  "utf8",
);
fs.writeFileSync(
  path.join(dest, "symbols.json"),
  JSON.stringify(
    Object.fromEntries([...symbols.entries()].map(([k, v]) => [k, [...new Set(v)].sort()])),
    null,
    2,
  ),
  "utf8",
);
console.log(`\n已写出：${processed}（${pages.length} 页）+ meta.json + symbols.json（${symbols.size} 个 fqcn）`);
if (OUT && path.resolve(OUT).startsWith(path.resolve(MCP, "..", "data"))) {
  console.log("⚠ 落点在 data/ ⇒ 别忘了同步 THIRD_PARTY_NOTICES.md 的 CC BY-SA 4.0 分节（署名 + ShareAlike）。");
}
