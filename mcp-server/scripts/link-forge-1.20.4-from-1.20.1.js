#!/usr/bin/env node
/**
 * link-forge-1.20.4-from-1.20.1.js
 * 将 forge_1.20.1 的 forge-docs 数据链接/复制到 forge_1.20.4。
 * Forge 1.20.4 与 1.20.1 文档内容相同（只是版本号不同），
 * 适用于映射关联。
 *
 * 使用：
 *   node scripts/link-forge-1.20.4-from-1.20.1.js
 */

import { existsSync, mkdirSync, readdirSync, copyFileSync, writeFileSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, "..", "..", "data");

const SRC_VERSION  = "1.20.1";
const DEST_VERSION = "1.20.4";

const srcForgeDocs  = join(DATA_DIR, `forge_${SRC_VERSION}`,  "forge-docs", SRC_VERSION);
const destForgeDocs = join(DATA_DIR, `forge_${DEST_VERSION}`, "forge-docs", DEST_VERSION);

// ── 版本重写 ───────────────────────────────────────────────────────────────
// 纯拷贝会把 SRC 的 id/version/url 原样带进 DEST 目录，导致
// `forge_1.20.4/forge-docs/1.20.4/index-l0.json` 里出现 `1.20.1/...` 的 id——
// 目录名与内容版本不一致。必须在落盘后重写。
//
// url 例外：Forge 文档站对 1.20.x 系列用 `/en/1.20.x/` 这一共用路径段，
// 不是具体版本号，故 SRC 的 `/en/1.20.1/` 要重写成 `/en/1.20.x/`（与既有数据一致）。
const URL_SRC_SEG = `/en/${SRC_VERSION}/`;
const URL_DEST_SEG = `/en/1.20.x/`;

function rewriteVersionDeep(node) {
  if (Array.isArray(node)) return node.map(rewriteVersionDeep);
  if (!node || typeof node !== "object") {
    if (typeof node === "string") return node.split(URL_SRC_SEG).join(URL_DEST_SEG);
    return node;
  }
  const out = {};
  for (const [k, v] of Object.entries(node)) {
    if (k === "id" && typeof v === "string" && v.startsWith(`${SRC_VERSION}/`)) {
      out[k] = `${DEST_VERSION}/${v.slice(SRC_VERSION.length + 1)}`;
    } else if (k === "version" && v === SRC_VERSION) {
      out[k] = DEST_VERSION;
    } else {
      out[k] = rewriteVersionDeep(v);
    }
  }
  return out;
}

/** 重写 index-l0/l1/l2.json。返回是否发生了改动。 */
function rewriteIndexFiles(dir) {
  let changed = false;
  for (const name of ["index-l0.json", "index-l1.json", "index-l2.json"]) {
    const p = join(dir, name);
    if (!existsSync(p)) continue;
    const before = readFileSync(p, "utf8");
    const after = JSON.stringify(rewriteVersionDeep(JSON.parse(before)), null, 2) + "\n";
    if (after !== before) {
      writeFileSync(p, after);
      changed = true;
    }
  }
  return changed;
}

/**
 * 重写 processed/*.md 里的 frontmatter 版本（若存在）。
 * 当前这批 processed 文件没有 frontmatter，此函数为空操作——
 * 保留是为了将来若改成带 frontmatter 的格式时不会漏重写。
 */
function rewriteProcessedFrontmatter(dir) {
  const pd = join(dir, "processed");
  if (!existsSync(pd)) return false;
  let changed = false;
  for (const name of readdirSync(pd)) {
    if (!name.endsWith(".md")) continue;
    const p = join(pd, name);
    const before = readFileSync(p, "utf8");
    const m = before.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
    if (!m) continue;
    const fm = m[1]
      .split("\n")
      .map((line) =>
        /^(\s*version\s*:\s*)(["']?)1\.20\.1\2\s*$/.test(line)
          ? line.replace("1.20.1", DEST_VERSION)
          : line,
      )
      .join("\n");
    const after = before.replace(m[0], `---\n${fm}\n---\n`);
    if (after !== before) {
      writeFileSync(p, after);
      changed = true;
    }
  }
  return changed;
}

function copyDirRecursive(src, dest, skips = []) {
  mkdirSync(dest, { recursive: true });
  const entries = readdirSync(src, { withFileTypes: true });
  let copied = 0, skipped = 0;

  for (const entry of entries) {
    if (skips.includes(entry.name)) continue;
    const srcPath = join(src, entry.name);
    const destPath = join(dest, entry.name);
    if (entry.isDirectory()) {
      const result = copyDirRecursive(srcPath, destPath, skips);
      copied += result.copied;
      skipped += result.skipped;
    } else {
      if (existsSync(destPath)) { skipped++; continue; }
      copyFileSync(srcPath, destPath);
      copied++;
    }
  }
  return { copied, skipped };
}

console.log(`[link-forge-1.20.4-from-1.20.1]`);
console.log(`  Source:      ${srcForgeDocs}`);
console.log(`  Destination: ${destForgeDocs}`);

// Check source
if (!existsSync(srcForgeDocs)) {
  console.error(`❌ Source docs not found: ${srcForgeDocs}`);
  process.exit(1);
}

// Ensure destination parent exists
mkdirSync(join(DATA_DIR, `forge_${DEST_VERSION}`), { recursive: true });

// Copy forge-docs content (skip mappings dir — mappings are separate)
const skips = ["mappings"];
const result = copyDirRecursive(srcForgeDocs, destForgeDocs, skips);

console.log(`  Copied:  ${result.copied} files`);
console.log(`  Skipped: ${result.skipped} files (already exist)`);

// 版本重写：把拷进来的 1.20.1 id/version/url 改写成 1.20.4
const rewroteIndex = rewriteIndexFiles(destForgeDocs);
const rewroteMd = rewriteProcessedFrontmatter(destForgeDocs);
console.log(`  Rewrote: ${rewroteIndex ? "index-l*.json" : "index (no change)"}` +
  `${rewroteMd ? ", processed frontmatter" : ""}`);

// 落盘自检：失败即非零退出，防止版本污染静默溜进数据层
const { assertLinkForge1204 } = await import("./assert-link-forge-1.20.4.mjs");
try {
  assertLinkForge1204(destForgeDocs);
  console.log(`\n✅ Done! forge_${DEST_VERSION} now has forge-docs from ${SRC_VERSION}`);
  console.log(`   自检通过：无 ${SRC_VERSION}/ id 前缀，version 均为 ${DEST_VERSION}`);
} catch (e) {
  console.error(`\n❌ 自检失败：${e.message}`);
  process.exit(1);
}
