#!/usr/bin/env node
/**
 * fetch-fabric-docs.js
 *
 * 从 FabricMC/fabric-docs GitHub 仓库抓取 .md 源文件。
 *
 * 数据源（按优先级；必须能归属到 --version，禁止现行站冒充旧档）：
 *   1. GitHub Raw 版本化树 versions/<ver>/<gitPath>（source=github_raw_versioned）
 *      官方 versions/ 有树：1.21.4 / 1.21.8 / 1.21.10 / 1.21.11 / 26.1.2（无 1.21.5）
 *   2. 明确命中的归档分支（--branch≠main 或 ARCHIVE_BRANCHES；source=github_archive）
 * 禁止成功页：github_raw（main 根路径）、未加版本前缀的 VitePress 现行站。
 * 无 versions/ 的旧档应失败并删除已有污染 raw；search 走 wiki（现行站警告）或 DOC_NOT_FOUND。
 *
 * 输出：data/fabric_<version>/fabric-docs/<version>/raw/<slug>.md
 * 每个文件顶部元数据含 来源 / 版本 / GitHub 路径 / 抓取源 / 抓取时间 / SHA256。
 * 抓取源仅 github_raw_versioned|github_archive。
 *
 * 用法：
 *   node scripts/fetch-fabric-docs.js --version 1.21.4 [--force] [--dry-run]
 *   node scripts/fetch-fabric-docs.js --version=26.1.2
 *   node scripts/fetch-fabric-docs.js --version=1.20.1 --branch=archive/1.20
 *
 * CLI 参数解析（统一方式，同时支持两种风格）：
 *   --version 1.21.1     等价于   --version=1.21.1
 *   --branch archive/1.20 等价于  --branch=archive/1.20
 *   --force              强制重新抓取
 *   --dry-run            仅预览，不写入
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, unlinkSync } from "fs";
import { join, dirname, resolve } from "path";
import { createHash } from "crypto";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
// 从 mcp-server/scripts/ 向上 2 层到 MC_skill 根目录
const MC_SKILL_ROOT = resolve(__dirname, "..", "..");
const DATA_ROOT = join(MC_SKILL_ROOT, "data");
const TEMPLATES_PATH = join(DATA_ROOT, "porting", "official-templates.json");

// ── CLI 参数解析（支持空格 / 等号两种风格） ────────────────────────────────────

function parseCli(argv) {
  const out = {
    flags: new Set(),
    kv: new Map(),
    list: [],
  };
  for (let i = 0; i < argv.length; i++) {
    const tok = argv[i];
    if (!tok.startsWith("--")) continue;
    const eq = tok.indexOf("=");
    if (eq >= 0) {
      const key = tok.slice(2, eq);
      const val = tok.slice(eq + 1);
      if (key) out.kv.set(key, val);
      out.list.push({ key, val, form: "equals" });
    } else {
      const key = tok.slice(2);
      const next = argv[i + 1];
      if (next !== undefined && !next.startsWith("--")) {
        out.kv.set(key, next);
        out.list.push({ key, val: next, form: "space" });
        i++;
      } else {
        out.flags.add(key);
        out.list.push({ key, val: true, form: "flag" });
      }
    }
  }
  return out;
}

const CLI = parseCli(process.argv.slice(2));

// 必填参数
const VERSION = CLI.kv.get("version");
if (!VERSION) {
  console.error("[fetch-fabric-docs] 缺少 --version 参数。");
  console.error("用法：node scripts/fetch-fabric-docs.js --version 1.21.4 [--force] [--dry-run]");
  process.exit(2);
}

// 可选参数
const BRANCH = CLI.kv.get("branch") ?? "main";
const FORCE = CLI.flags.has("force");
const DRY_RUN = CLI.flags.has("dry-run");

const FABRIC_DIR = join(DATA_ROOT, `fabric_${VERSION}`, "fabric-docs", VERSION, "raw");
const META_PATH = join(DATA_ROOT, `fabric_${VERSION}`, "meta.json");

// Fabric Docs GitHub 仓库元信息
const FABRIC_GH = {
  owner: "FabricMC",
  repo: "fabric-docs",
  branch: BRANCH,
  baseRawUrl: `https://raw.githubusercontent.com/${"FabricMC"}/fabric-docs`,
  baseVitepressUrl: "https://docs.fabricmc.net",
};

// 已知归档分支（用于旧版本兼容：1.14–1.20 时代 fabric-docs 使用 versions/<version>/<gitPath> 路径）
const ARCHIVE_BRANCHES = [
  `${VERSION}.x-archive`,         // 旧版约定：archive/1.20.x 等
  `versions/${VERSION}`,          // 较新版约定
  `archive/${VERSION}`,
  `archive/${VERSION}.x`,
];

// ── 工具函数 ──────────────────────────────────────────────────────────────────

function sha256(content) {
  return createHash("sha256").update(content, "utf8").digest("hex");
}

function ensureDir(dir) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

function readMeta() {
  if (existsSync(META_PATH)) {
    return JSON.parse(readFileSync(META_PATH, "utf8"));
  }
  return { meta: {} };
}

function writeMeta(meta) {
  writeFileSync(META_PATH, JSON.stringify(meta, null, 2), "utf8");
}

function loadUrlList() {
  const templates = JSON.parse(readFileSync(TEMPLATES_PATH, "utf8"));
  return templates.toFetch ?? [];
}

/**
 * 只接受能归属到 --version 的源。禁止 main 根路径 / 现行 VitePress 冒充该档。
 * 返回 { content, url, source, fetchedAt, sha256, branch }。
 */
async function fetchPage(entry, branch = FABRIC_GH.branch) {
  const { gitPath, url: vitepressUrl } = entry;
  const tried = [];

  // 0. Versioned tree: versions/<ver>/<gitPath>（main 或指定 branch 上都先试）
  if (VERSION) {
    const versionedPath = `versions/${VERSION}/${gitPath}`;
    const versionedUrl = `${FABRIC_GH.baseRawUrl}/${branch}/${versionedPath}`;
    tried.push(versionedUrl);
    const vr = await tryRaw(versionedUrl);
    if (vr) {
      return {
        ...vr,
        source: "github_raw_versioned",
        url: versionedUrl,
        branch,
        gitPathUsed: versionedPath,
      };
    }
  }

  // 1. 显式 --branch≠main：该分支上的未前缀路径视为归档命中
  if (branch !== "main") {
    const githubRawUrl = `${FABRIC_GH.baseRawUrl}/${branch}/${gitPath}`;
    tried.push(githubRawUrl);
    const r = await tryRaw(githubRawUrl);
    if (r) {
      return {
        ...r,
        source: "github_archive",
        url: githubRawUrl,
        branch,
      };
    }
  }

  // 2. 已知归档分支（不把 main 根路径当本档）
  if (branch === "main") {
    for (const archiveBranch of ARCHIVE_BRANCHES) {
      const archiveUrl = `${FABRIC_GH.baseRawUrl}/${archiveBranch}/${gitPath}`;
      tried.push(archiveUrl);
      const ar = await tryRaw(archiveUrl);
      if (ar) {
        return {
          ...ar,
          source: "github_archive",
          url: archiveUrl,
          branch: archiveBranch,
        };
      }
    }
  }

  if (vitepressUrl) {
    tried.push(`vitepress-skipped-unversioned:${vitepressUrl}`);
  }

  return { content: null, url: vitepressUrl, source: "failed", tried, branch };
}

async function tryRaw(url) {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "MC_skill-fabric-docs-fetcher/1.0",
        "Accept": "text/plain,text/markdown,*/*",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(20000),
    });
    if (res.status === 200) {
      const text = await res.text();
      // GitHub Raw 返回 Markdown（含 frontmatter 时以 --- 开头）
      if (text.includes("# ") || text.startsWith("---")) {
        const fetchedAt = new Date().toISOString();
        return { content: text, sha256: sha256(text), fetchedAt };
      }
    }
  } catch (err) {
    // 网络/超时错误：继续 fallback
  }
  return null;
}

async function tryVitepress(url) {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "MC_skill-fabric-docs-fetcher/1.0",
        "Accept": "text/html",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(20000),
    });
    if (res.status === 200) {
      const html = await res.text();
      if (!html.includes("Page Not Found")) {
        const md = htmlToMarkdown(html);
        const fetchedAt = new Date().toISOString();
        return { content: md, sha256: sha256(md), fetchedAt };
      }
    }
  } catch (err) {
    // 网络/超时错误
  }
  return null;
}

/**
 * VitePress HTML → 简化 Markdown（Fabric Docs 使用 VitePress）
 * 仅在 GitHub Raw 不可用时作为 fallback 使用
 */
function htmlToMarkdown(html) {
  let md = html;

  // 移除 VitePress 导航/侧边栏/页脚
  md = md.replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, "");
  md = md.replace(/<aside[^>]*>[\s\S]*?<\/aside>/gi, "");
  md = md.replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, "");
  md = md.replace(/<header[^>]*>[\s\S]*?<\/header>/gi, "");
  md = md.replace(/<!--[\s\S]*?-->/g, "");

  // 提取 <article> 或 <main> 内容
  md = md.replace(/^[\s\S]*?<main[^>]*>/i, "");
  md = md.replace(/^[\s\S]*?<article[^>]*>/i, "");
  md = md.replace(/<footer[\s\S]*$/i, "");

  // 代码块
  md = md.replace(/<pre><code class="language-(\w+)">([\s\S]*?)<\/code><\/pre>/g,
    (_, lang, code) => `\`\`\`${lang}\n${decodeEntities(code.trim())}\n\`\`\``);
  md = md.replace(/<pre><code>([\s\S]*?)<\/code><\/pre>/g,
    (_, code) => `\`\`\`\n${decodeEntities(code.trim())}\n\`\`\``);

  // 标题
  md = md.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, (_, t) => `\n# ${stripTags(t)}\n`);
  md = md.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, (_, t) => `\n## ${stripTags(t)}\n`);
  md = md.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, (_, t) => `\n### ${stripTags(t)}\n`);
  md = md.replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, (_, t) => `\n#### ${stripTags(t)}\n`);

  // 段落
  md = md.replace(/<p>([\s\S]*?)<\/p>/gi, (_, t) => `${stripTags(t)}\n\n`);

  // 列表
  md = md.replace(/<ul>([\s\S]*?)<\/ul>/gi, (_, items) =>
    items.replace(/<li>([\s\S]*?)<\/li>/gi, (_, item) => `- ${stripTags(item)}\n`));
  md = md.replace(/<ol>([\s\S]*?)<\/ol>/gi, (_, items) => {
    let i = 0;
    return items.replace(/<li>([\s\S]*?)<\/li>/gi, (_, item) => `${++i}. ${stripTags(item)}\n`);
  });

  // 粗体/斜体
  md = md.replace(/<\/?(?:strong|b)>/gi, "**");
  md = md.replace(/<\/?(?:em|i)>/gi, "*");

  // 链接
  md = md.replace(/<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi,
    (_, href, text) => `[${stripTags(text)}](${href})`);

  // 内联代码
  md = md.replace(/<code>([^<]+)<\/code>/g, "`$1`");

  // 剩余标签全部剥掉
  md = stripTags(md);
  md = md.replace(/\n{3,}/g, "\n\n");

  return md.trim();
}

function stripTags(html) {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">").replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'").replace(/&nbsp;/g, " ").trim();
}

function decodeEntities(str) {
  return str
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">").replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'").replace(/&nbsp;/g, " ");
}

/**
 * 从 Markdown 正文（含 YAML frontmatter）提取可读标题。
 * 优先 frontmatter title:，其次正文首个 H1，最后 fallback 到 slug id。
 */
function extractDocTitle(content, fallbackId) {
  const fm = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (fm) {
    const titleLine = fm[1].match(/^title:\s*(.+)$/m);
    if (titleLine) {
      let t = titleLine[1].trim();
      // 去掉包裹引号
      if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) {
        t = t.slice(1, -1);
      }
      if (t) return t;
    }
  }
  const h1 = content.match(/^#\s+(.+)$/m);
  if (h1) return h1[1].replace(/\{#.*\}$/, "").trim();
  return fallbackId.replace(/-/g, " ");
}

/**
 * 写入 raw 文件，顶部加上元数据行。
 * 元数据行格式与 audit 脚本的正则兼容：RAW_VERSION_RX = />\s*版本：\s*(\S+)/
 */
function writeRawFile(entry, content, source, fetchedAt, sha, finalUrl, branch) {
  const { id, gitPath } = entry;
  const filename = gitPath.replace(/\//g, "_").replace(/\.md$/, "") + ".md";
  const filepath = join(FABRIC_DIR, filename);

  ensureDir(dirname(filepath));

  const title = extractDocTitle(content, id);

  const lines = [
    `# ${title}`,
    "",
    `> 来源：${finalUrl}`,
    `> 版本：${VERSION}`,
    `> GitHub 路径：${gitPath}`,
    `> 抓取源：${source}`,
    `> 抓取时间：${fetchedAt}`,
    `> SHA256：${sha}`,
    `> 分支：${branch}`,
    "",
    content,
  ];

  writeFileSync(filepath, lines.join("\n"), "utf8");
  return { filename, filepath };
}

function isPollutedCachedRaw(filepath) {
  if (!existsSync(filepath)) return false;
  const text = readFileSync(filepath, "utf8");
  const src = text.match(/> 抓取源：(\S+)/);
  const source = src?.[1] ?? "";
  if (source === "github_raw" || source === "vitepress") return true;
  return false;
}

function deleteLocalDoc(filename) {
  const rawPath = join(FABRIC_DIR, filename);
  const processedPath = join(DATA_ROOT, `fabric_${VERSION}`, "fabric-docs", VERSION, "processed", filename);
  for (const p of [rawPath, processedPath]) {
    if (existsSync(p)) unlinkSync(p);
  }
}

// ── 主逻辑 ──────────────────────────────────────────────────────────────────────

async function main() {
  ensureDir(FABRIC_DIR);
  const urls = loadUrlList();
  const meta = readMeta();
  const now = new Date().toISOString().split("T")[0];

  console.log(`[fetch-fabric-docs] 版本: ${VERSION}`);
  console.log(`[fetch-fabric-docs] 分支: ${BRANCH}`);
  console.log(`[fetch-fabric-docs] 目标目录: ${FABRIC_DIR}`);
  console.log(`[fetch-fabric-docs] GitHub 仓库: ${FABRIC_GH.owner}/${FABRIC_GH.repo} @ ${FABRIC_GH.branch}`);
  console.log(`[fetch-fabric-docs] 待抓取: ${urls.length} 个页面 (--force=${FORCE}, --dry-run=${DRY_RUN})`);
  console.log("");

  let success = 0;
  let skipped = 0;
  let failed = 0;
  const failures = [];
  const provenanceLog = [];

  for (const entry of urls) {
    const { id, gitPath } = entry;
    const filename = gitPath.replace(/\//g, "_").replace(/\.md$/, "") + ".md";
    const localPath = join(FABRIC_DIR, filename);
    const githubRawUrl = `${FABRIC_GH.baseRawUrl}/${BRANCH}/${gitPath}`;

    if (DRY_RUN) {
      const exists = existsSync(localPath) ? " [已缓存]" : " [需抓取]";
      console.log(`[DRY] ${entry.priority ?? "🟢"} ${id}${exists}`);
      console.log(`       → ${githubRawUrl}`);
      console.log(`       → archive: ${ARCHIVE_BRANCHES.map(b => `${FABRIC_GH.baseRawUrl}/${b}/${gitPath}`).join(", ")}`);
      continue;
    }

    process.stdout.write(`[${entry.priority ?? "🟢"}] ${id} ... `);

    // 污染缓存（未版本化 main / 现行 vitepress）即使无 --force 也作废
    if (!FORCE && existsSync(localPath) && !isPollutedCachedRaw(localPath)) {
      console.log(`⏭️  已缓存（使用 --force 强制重新抓取）`);
      skipped++;
      continue;
    }

    try {
      const result = await fetchPage(entry, BRANCH);

      if (!result.content) {
        console.log(`⚠️  无版本化/归档源（已拒绝未版本化 main 与现行 VitePress）`);
        deleteLocalDoc(filename);
        failures.push({ id, gitPath, tried: result.tried ?? [] });
        failed++;
        continue;
      }

      const { filename: fname, filepath } = writeRawFile(
        entry,
        result.content,
        result.source,
        result.fetchedAt,
        result.sha256,
        result.url,
        result.branch,
      );

      provenanceLog.push({
        id,
        gitPath,
        filename: fname,
        source: result.source,
        url: result.url,
        branch: result.branch,
        fetchedAt: result.fetchedAt,
        sha256: result.sha256,
        bytes: result.content.length,
      });

      success++;
      console.log(`✓ [${result.source}@${result.branch}] (${result.content.length} chars, sha256=${result.sha256.slice(0, 12)}…)`);
    } catch (err) {
      console.log(`✗ ${err.message}`);
      deleteLocalDoc(filename);
      failures.push({ id, gitPath, error: err.message });
      failed++;
    }
  }

  // 记录元数据（含全失败：旧档空树也要留下 failures[]）
  if (!DRY_RUN) {
    meta.meta = meta.meta ?? {};
    meta.meta.lastUpdatedAt = now;
    meta.meta.platform = "fabric";
    meta.meta.mcVersion = VERSION;
    meta.meta.fetchedAt = new Date().toISOString();
    meta.meta.docs = {
      sourceRepo: `${FABRIC_GH.owner}/${FABRIC_GH.repo}`,
      branch: BRANCH,
      archiveBranches: ARCHIVE_BRANCHES,
      acceptedSources: ["github_raw_versioned", "github_archive"],
      pages: provenanceLog,
      failures,
    };
    writeMeta(meta);
    const versionDir = join(DATA_ROOT, `fabric_${VERSION}`, "fabric-docs", VERSION);
    ensureDir(versionDir);
    writeFileSync(join(versionDir, "failures.json"), JSON.stringify({ version: VERSION, failures }, null, 2), "utf8");
  }

  console.log(`\n完成：${success} 成功，${skipped} 跳过，${failed} 失败`);
  if (!DRY_RUN) {
    console.log(`运行 process-fabric-docs.js 处理抓取结果（无成功页时写空索引）。`);
  }
  if (failed > 0) {
    console.log(`\n失败列表：`);
    for (const f of failures) {
      console.log(`  - ${f.id}${f.gitPath ? ` (${f.gitPath})` : ""}: ${f.error ?? "全部来源失败"}`);
    }
  }
}

main().catch((err) => {
  console.error("[fetch-fabric-docs] 致命错误:", err);
  process.exit(1);
});