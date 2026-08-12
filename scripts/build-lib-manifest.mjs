#!/usr/bin/env node
/**
 * build-lib-manifest.mjs — 生成库模组版本 manifest（计划 §5.3 / §5.4，数据驱动不去猜）
 *
 * 数据源（不预设版本、不手填版本号）：
 *   1. mcp-server/src/diagnostics/library-catalog.ts 的 LIBRARY_CATALOG（modrinthSlug 主源；
 *      优先 import 编译后的 dist/diagnostics/library-catalog.js，失败则正则解析 .ts）
 *   2. community_knowledge/authored/lib-*.md + library-integration*.md 的 frontmatter modrinthSlug（补充）
 * 流程：
 *   - 对每个非空 slug 请求 https://api.modrinth.com/v2/project/<slug>/version（15s 超时）
 *   - 展开全部 (game_version × loader) 组合，含 release/beta/alpha（记录 version_type）
 *   - 去重：同 (game_version, loader, modId) 保留 release 优先；无 release 用最新 beta/alpha（标注）
 *   - 写 file url + sha512 + version_type 到 mcp-server/data/lib-manifests/all.json
 * 失败策略：slug 为空 / 请求失败 → 跳过并打印警告，不编造版本。
 *
 * 用法：node scripts/build-lib-manifest.mjs
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, statSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const CATALOG_SRC = join(ROOT, "mcp-server", "src", "diagnostics", "library-catalog.ts");
const CATALOG_DIST = join(ROOT, "mcp-server", "dist", "diagnostics", "library-catalog.js");
const AUTHORED_DIR = join(ROOT, "community_knowledge", "authored");
const OUT_DIR = join(ROOT, "mcp-server", "data", "lib-manifests");
const OUT_FILE = join(OUT_DIR, "all.json");

const TIMEOUT_MS = 15000; // 每个请求 15s 超时
const CONCURRENCY = 4;
const USER_AGENT = "MC-AI-Coding-Assistant-Tool/build-lib-manifest (repo: MC_skill)";
const TYPE_RANK = { release: 0, beta: 1, alpha: 2 };

/* ------------------------------ frontmatter ------------------------------ */

function parseArray(value) {
  // "[a, \"b\", 'c']" → ["a","b","c"]；非数组 → 单元素
  const v = String(value).trim();
  if (v.startsWith("[") && v.endsWith("]")) {
    return v
      .slice(1, -1)
      .split(",")
      .map((s) => s.trim().replace(/^["']|["']$/g, ""))
      .filter((s) => s !== "");
  }
  const bare = v.replace(/^["']|["']$/g, "");
  return bare === "" ? [] : [bare];
}

function parseFrontmatter(text) {
  const meta = {};
  if (!text.startsWith("---")) return meta;
  const end = text.indexOf("\n---", 3);
  if (end < 0) return meta;
  for (const line of text.slice(3, end).split(/\r?\n/)) {
    const m = line.match(/^([\w-]+):\s*(.*)$/);
    if (!m) continue;
    const key = m[1];
    const value = m[2].trim();
    if (value === "") {
      meta[key] = "";
    } else if (value.startsWith("[") && value.endsWith("]")) {
      meta[key] = parseArray(value);
    } else {
      meta[key] = value.replace(/^["']|["']$/g, "");
    }
  }
  return meta;
}

function walkFiles(dir, ext, out = []) {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walkFiles(p, ext, out);
    else if (name.endsWith(ext)) out.push(p);
  }
  return out;
}

/* --------------------------- slug 来源：catalog --------------------------- */

/**
 * 读 library-catalog.ts 的 LIBRARY_CATALOG：
 * 优先 import 编译产物 dist/diagnostics/library-catalog.js；
 * 失败则按 TS 源文件的条目结构（`  {` … `  },`）正则提取字段。
 */
async function loadCatalogEntries() {
  if (existsSync(CATALOG_DIST)) {
    try {
      const mod = await import(pathToFileURL(CATALOG_DIST).href);
      if (Array.isArray(mod.LIBRARY_CATALOG) && mod.LIBRARY_CATALOG.length > 0) {
        console.log(`[manifest] 已从 dist 加载 LIBRARY_CATALOG（${mod.LIBRARY_CATALOG.length} 条）`);
        return mod.LIBRARY_CATALOG;
      }
    } catch (err) {
      console.warn(`[manifest] import dist 失败（${err.message}），改用正则解析 TS 源文件`);
    }
  }
  const text = readFileSync(CATALOG_SRC, "utf8");
  const entries = [];
  let current = null;
  for (const line of text.split(/\r?\n/)) {
    if (!current && /^\s*\{\s*$/.test(line)) {
      current = { raw: [] };
      continue;
    }
    if (current) {
      if (/^\s*\},?\s*$/.test(line)) {
        entries.push(parseCatalogEntry(current.raw.join("\n")));
        current = null;
      } else {
        current.raw.push(line);
      }
    }
  }
  if (entries.length === 0) {
    throw new Error(`无法从 ${CATALOG_SRC} 解析出任何 LIBRARY_CATALOG 条目`);
  }
  console.log(`[manifest] 已从 TS 源正则解析 LIBRARY_CATALOG（${entries.length} 条）`);
  return entries;
}

function grab(raw, key) {
  const m = raw.match(new RegExp(`\\b${key}:\\s*(?:"([^"]*)"|\\[([^\\]]*)\\])`));
  if (!m) return undefined;
  if (m[1] !== undefined) return m[1];
  return parseArray(`[${m[2]}]`);
}

function parseCatalogEntry(raw) {
  const entry = { id: grab(raw, "id"), modIds: grab(raw, "modIds"), loaders: grab(raw, "loaders"), modrinthSlug: grab(raw, "modrinthSlug") };
  entry.skillId = grab(raw, "skillId") || "";
  entry.role = grab(raw, "role") || "";
  return entry;
}

/* ------------------------- slug 来源：authored 短文 ------------------------ */

function loadAuthoredSlugs() {
  const bySlug = new Map();
  for (const file of walkFiles(AUTHORED_DIR, ".md")) {
    const name = file.split(/[\\/]/).pop();
    if (!/^lib-.*\.md$/.test(name) && !/^library-integration.*\.md$/.test(name)) continue;
    const meta = parseFrontmatter(readFileSync(file, "utf8"));
    const slug = String(meta.modrinthSlug || "").trim();
    if (!slug) continue;
    // 支持逗号分隔多 slug（如一篇短文覆盖 JEI/EMI/REI）
    for (const one of slug.split(",").map((s) => s.trim()).filter(Boolean)) {
      if (!bySlug.has(one)) {
        bySlug.set(one, {
          slug: one,
          id: meta.id || name.replace(/\.md$/, ""),
          modIds: Array.isArray(meta.modIds) ? meta.modIds : [],
          loaders: Array.isArray(meta.loaders) ? meta.loaders : [],
        });
      }
    }
  }
  return [...bySlug.values()];
}

/* ------------------------------ Modrinth API ------------------------------ */

async function fetchJson(url) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { headers: { "User-Agent": USER_AGENT }, signal: ctrl.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

/**
 * 展开 (game_version × loader) 组合全集并去重：
 * 同 (gameVersion, loader, modId) 保留一个，release 优先，其次按发布时间取最新 beta/alpha。
 */
function buildEntries(versions, modId) {
  const picked = new Map();
  for (const v of versions) {
    const type = String(v.version_type || "alpha");
    const rank = TYPE_RANK[type] ?? 3;
    const published = new Date(v.date_published || 0).getTime();
    const file = (v.files || []).find((f) => f.primary) || (v.files || [])[0];
    if (!file) continue;
    for (const gameVersion of v.game_versions || []) {
      for (const loader of v.loaders || []) {
        const key = `${gameVersion}|${loader}|${modId}`;
        const cur = picked.get(key);
        if (!cur || rank < cur.rank || (rank === cur.rank && published > cur.published)) {
          const hashes = file.hashes || {};
          picked.set(key, {
            gameVersion,
            loader,
            modId,
            fileName: file.filename || "",
            url: file.url || "",
            sha512: hashes.sha512 || hashes.sha256 || "",
            versionType: type,
            versionNumber: v.version_number || "",
            rank,
            published,
          });
        }
      }
    }
  }
  return [...picked.values()]
    .sort((a, b) => a.gameVersion.localeCompare(b.gameVersion) || a.loader.localeCompare(b.loader))
    .map(({ rank, published, ...entry }) => entry);
}

async function mapLimit(items, limit, fn) {
  const results = new Array(items.length);
  let next = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) {
      const idx = next++;
      results[idx] = await fn(items[idx], idx);
    }
  });
  await Promise.all(workers);
  return results;
}

/* --------------------------------- 主流程 --------------------------------- */

async function main() {
  // 1. slug 全集：catalog 优先，authored 补充（按 slug 去重）
  const catalog = await loadCatalogEntries();
  const authored = loadAuthoredSlugs();
  const bySlug = new Map();
  for (const e of catalog) {
    const slug = String(e.modrinthSlug || "").trim();
    if (!slug) continue;
    for (const one of slug.split(",").map((s) => s.trim()).filter(Boolean)) {
      if (bySlug.has(one)) continue;
      bySlug.set(one, {
        slug: one,
        id: e.id,
        modId: (e.modIds || [])[0] || one,
        loaders: e.loaders || [],
        skillId: e.skillId || "",
        source: "catalog",
      });
    }
  }
  for (const e of authored) {
    if (bySlug.has(e.slug)) continue; // catalog 优先
    bySlug.set(e.slug, { slug: e.slug, id: e.id, modId: (e.modIds || [])[0] || e.slug, loaders: e.loaders || [], skillId: "", source: "authored" });
  }
  const libraries = [...bySlug.values()];

  // 2. 请求全部版本列表
  const results = await mapLimit(libraries, CONCURRENCY, async (lib) => {
    try {
      const versions = await fetchJson(`https://api.modrinth.com/v2/project/${lib.slug}/version`);
      console.log(`[manifest] ${lib.slug}（${lib.modId}）→ ${versions.length} 个版本`);
      return { ...lib, versions };
    } catch (err) {
      console.warn(`[manifest] ⚠️ 跳过 ${lib.slug}（${lib.id}）：请求失败（${err.message}）`);
      return { ...lib, error: err.message };
    }
  });

  // 3. 组装输出
  const manifest = [];
  const failed = [];
  let totalEntries = 0;
  let totalVersions = 0;
  for (const lib of results) {
    if (lib.error) {
      failed.push(`${lib.slug}（${lib.id}）: ${lib.error}`);
      continue;
    }
    const entries = buildEntries(lib.versions, lib.modId);
    totalEntries += entries.length;
    totalVersions += lib.versions.length;
    if (entries.length === 0) {
      console.warn(`[manifest] ⚠️ ${lib.slug} 无任何 (game_version × loader) 条目，跳过（不编造版本）`);
      failed.push(`${lib.slug}（${lib.id}）: 无版本条目`);
      continue;
    }
    manifest.push({ slug: lib.slug, entries });
  }

  // 4. 写盘
  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(OUT_FILE, JSON.stringify(manifest, null, 2), "utf8");

  // 5. 统计
  console.log("\n========== 统计 ==========");
  console.log(`库数（含非空 slug）: ${libraries.length}`);
  console.log(`成功生成 manifest 的库: ${manifest.length}`);
  console.log(`总条目数 ((game_version × loader × modId) 去重后): ${totalEntries}`);
  console.log(`版本数（Modrinth version 对象累计）: ${totalVersions}`);
  for (const lib of manifest) {
    console.log(`  - ${lib.slug.padEnd(24)} ${lib.entries.length} 条目`);
  }
  if (failed.length > 0) {
    console.log(`失败/跳过列表（${failed.length}）:`);
    for (const f of failed) console.log(`  ⚠️ ${f}`);
  } else {
    console.log("失败/跳过列表: 无");
  }
  console.log(`\n输出 → ${OUT_FILE}`);
}

main().catch((err) => {
  console.error(`[manifest] 致命错误: ${err.stack || err.message}`);
  process.exit(1);
});
