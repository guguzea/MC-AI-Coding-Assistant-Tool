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
console.log(`\n✅ Done! forge_${DEST_VERSION} now has forge-docs from ${SRC_VERSION}`);
console.log(`   Note: Processed index files are copied; the ${DEST_VERSION} docs are ready for mapping.`);
