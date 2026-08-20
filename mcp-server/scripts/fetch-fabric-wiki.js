#!/usr/bin/env node
/**
 * fetch-fabric-wiki.js
 *
 * 从 Fabric Wiki（DokuWiki）抓取原始 Wiki 标记文本（_export/raw），
 * 输出到 data/fabric_<version>/fabric-wiki/<version>/raw/<id>.txt
 *
 * URL 模式：
 *   HTML（完整页面）: https://fabricmc.net/wiki/doku.php?id={page}
 *   Raw（纯净文本）: https://fabricmc.net/wiki/_export/raw/{page}
 *
 * 已验证可抓取的页面（25 May 2026 验证）：
 *   ✅ tutorial:start, tutorial:items, tutorial:blocks, tutorial:kotlin,
 *      start, documentation:start, tutorial:commands
 *   ❌ tutorial:dev_environment, tutorial:mixin, documentation:specifications,
 *      documentation:entities, documentation:worldgen, tutorial:datagen,
 *      tutorial:configuration
 * 2026-08-15 重试：上述 ❌ 页 HTML 仍含 “This topic does not exist”，**不要加入 PAGES**。
 * 26.1.2 **不建 wiki 树**。
 * Wiki 始终是现行站，不是该 --version 的历史快照；raw 元数据含警告行，search 结果带 wikiIsCurrentSite。
 *
 * 用法：
 *   node scripts/fetch-fabric-wiki.js --version 1.20.1
 *   node scripts/fetch-fabric-wiki.js --version 1.20.1 --dry-run
 *   node scripts/fetch-fabric-wiki.js --version 1.20.1 --force
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const MC_SKILL_ROOT = join(__dirname, "..", "..");

// ── 参数解析 ──────────────────────────────────────────────────────────────────

const VERSION_ARG = process.argv.find(a => a.startsWith("--version="));
const VERSION = VERSION_ARG ? VERSION_ARG.split("=")[1] : "1.20.1";
const DRY_RUN = process.argv.includes("--dry-run");
const FORCE = process.argv.includes("--force");

const WIKI_DIR = join(MC_SKILL_ROOT, "data", `fabric_${VERSION}`, "fabric-wiki", VERSION, "raw");
mkdirSync(WIKI_DIR, { recursive: true });

// ── Wiki 页面清单 ────────────────────────────────────────────────────────────

const PAGES = [
  { id: "tutorial:start",       priority: "⭐", note: "教程首页" },
  { id: "tutorial:items",        priority: "⭐", note: "添加物品" },
  { id: "tutorial:blocks",       priority: "⭐", note: "添加方块" },
  { id: "tutorial:kotlin",       priority: "🟡", note: "Kotlin 语言支持" },
  { id: "tutorial:commands",     priority: "🟡", note: "命令教程" },
  { id: "start",                 priority: "🟡", note: "Wiki 首页" },
  { id: "documentation:start",   priority: "🟡", note: "文档首页" },
];

// ── 工具函数 ──────────────────────────────────────────────────────────────────

function wikiRawUrl(id) {
  // _export/raw/{page} 返回 DokuWiki 原始标记文本
  return `https://fabricmc.net/wiki/_export/raw/${id}`;
}

function wikiHtmlUrl(id) {
  return `https://fabricmc.net/wiki/doku.php?id=${id}`;
}

function localPath(id) {
  const safe = id.replace(/:/g, "_").replace(/\//g, "_");
  return join(WIKI_DIR, `${safe}.txt`);
}

async function fetchPage(id) {
  // 优先用 raw export
  try {
    const res = await fetch(wikiRawUrl(id), {
      headers: { "User-Agent": "MC_skill-fabric-wiki/1.0", "Accept": "text/plain" },
      signal: AbortSignal.timeout(15000),
    });
    if (res.ok) {
      const text = await res.text();
      // raw export 不会 404，但可能返回 redirect 或 empty
      if (text.trim().length > 0) {
        return { ok: true, content: text, source: "wiki_raw" };
      }
    }
  } catch (_) { /* fall through */ }

  // Fallback: HTML 页面
  try {
    const res = await fetch(wikiHtmlUrl(id), {
      headers: { "User-Agent": "MC_skill-fabric-wiki/1.0", "Accept": "text/html" },
      signal: AbortSignal.timeout(15000),
    });
    if (res.ok) {
      const html = await res.text();
      if (html.includes("This topic does not exist")) {
        return { ok: false, notFound: true };
      }
      return { ok: true, content: html, source: "wiki_html" };
    }
    return { ok: false, status: res.status };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

function saveRaw(id, content, source, priority) {
  const safe = id.replace(/:/g, "_").replace(/\//g, "_");
  const filepath = join(WIKI_DIR, `${safe}.txt`);
  mkdirSync(dirname(filepath), { recursive: true });

  const lines = [
    `# ${id.replace(/:/g, " ")}`,
    "",
    `> 来源：${wikiHtmlUrl(id)}`,
    `> 版本：${VERSION}`,
    `> 页面 ID：${id}`,
    `> 优先级：${priority}`,
    `> 抓取源：${source}`,
    `> 警告：现行 Wiki，不是该 Minecraft 版本的历史快照。禁止把 wiki 正文里的 Registries / BuiltInRegistries 当成 1.16.5 等旧档 API。`,
    "",
    content,
  ];

  writeFileSync(filepath, lines.join("\n"), "utf8");
  return filepath;
}

// ── 主逻辑 ────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`[fetch-fabric-wiki] VERSION=${VERSION}`);
  console.log(`[fetch-fabric-wiki] 目录: ${WIKI_DIR}`);
  console.log(`[fetch-fabric-wiki] dry-run=${DRY_RUN} force=${FORCE}`);
  console.log("");

  if (DRY_RUN) {
    console.log("=== DRY RUN ===");
    for (const { id, priority, note } of PAGES) {
      const cached = existsSync(localPath(id)) && !FORCE;
      console.log(`  [${priority}] ${id} — ${note}`);
      console.log(`          URL: ${wikiRawUrl(id)}`);
      console.log(`          → ${localPath(id)} ${cached ? "[已缓存]" : "[需抓取]"}`);
    }
    return;
  }

  let success = 0, skipped = 0, failed = 0;

  for (const { id, priority, note } of PAGES) {
    process.stdout.write(`[${priority}] ${id} (${note}) ... `);

    if (!FORCE && existsSync(localPath(id))) {
      console.log(`⏭️  已缓存（--force 强制重下）`);
      skipped++;
      continue;
    }

    try {
      const result = await fetchPage(id);

      if (!result.ok) {
        if (result.notFound) {
          console.log(`⚠️  页面不存在`);
        } else {
          console.log(`✗ HTTP ${result.status || result.error}`);
        }
        failed++;
        continue;
      }

      saveRaw(id, result.content, result.source, priority);
      success++;
      console.log(`✓ [${result.source}] (${result.content.length} chars)`);
    } catch (err) {
      console.log(`✗ ${err.message}`);
      failed++;
    }
  }

  console.log(`\n完成：${success} 成功，${skipped} 跳过，${failed} 失败`);
  if (success > 0) {
    console.log(`运行 process-fabric-wiki.js 处理抓取结果。`);
  }
}

main().catch(err => {
  console.error("❌ 致命错误:", err);
  process.exit(1);
});
