#!/usr/bin/env node
/**
 * generate-porting-breakdown.js
 * 生成 Forge 版本间的文档结构差异报告（辅助 porting 知识库）。
 *
 * 使用：
 *   node scripts/generate-porting-breakdown.js --all
 *   node scripts/generate-porting-breakdown.js 1.16.5 1.17.1
 *   node scripts/generate-porting-breakdown.js 1.17.1 1.18.2
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, "..", "..", "data");

// ── 预定义的版本对（结构性差异自动检测，API 变更需手动录入）─────

const VERSION_PAIRS = [
  { from: "1.12.2", to: "1.14.4", note: "Legacy → Modern Forge 最大断裂" },
  { from: "1.14.4", to: "1.15.2", note: "ForgeGradle 3 小幅升级" },
  { from: "1.15.2", to: "1.16.5", note: "MCP 可选切 MojMaps" },
  { from: "1.16.5", to: "1.17.1", note: "Java 8→16 + ForgeGradle 7 断裂" },
  { from: "1.17.1", to: "1.18.2", note: "DeferredRegister 主流化" },
  { from: "1.18.2", to: "1.19.4", note: "小升级" },
  { from: "1.19.4", to: "1.20.1", note: "小升级" },
  { from: "1.20.1", to: "1.20.4", note: "Forge 最后版，转 NeoForge" },
];

// ── 手动录入的 breaking changes（来自 versions.json）─────────────────

const VERSIONS_JSON_PATH = join(DATA_DIR, "porting", "knowledge-base", "versions.json");
let knownBreakingChanges = {};
try {
  const versionsJson = JSON.parse(readFileSync(VERSIONS_JSON_PATH, "utf-8"));
  for (const [ver, info] of Object.entries(versionsJson.versions || {})) {
    knownBreakingChanges[ver] = info.breakingChanges || [];
  }
} catch (e) {
  console.warn("Warning: Could not load versions.json for known breaking changes");
}

function loadIndexL0(version) {
  const path = join(DATA_DIR, `forge_${version}`, "forge-docs", version, "index-l0.json");
  if (!existsSync(path)) return null;
  try {
    return JSON.parse(readFileSync(path, "utf-8"));
  } catch (e) {
    return null;
  }
}

function compareIndexes(fromIndex, toIndex) {
  const fromPaths = new Set((fromIndex || []).map(e => e.id));
  const toPaths = new Set((toIndex || []).map(e => e.id));

  const added = [...toPaths].filter(id => !fromPaths.has(id));
  const removed = [...fromPaths].filter(id => !toPaths.has(id));

  return { added, removed };
}

function main() {
  const args = process.argv.slice(2);
  const allFlag = args.includes("--all");

  let pairs;
  if (allFlag) {
    pairs = VERSION_PAIRS;
  } else if (args.length >= 2) {
    pairs = [{ from: args[0], to: args[1], note: "" }];
  } else {
    console.error("用法:");
    console.error("  node generate-porting-breakdown.js --all");
    console.error("  node generate-porting-breakdown.js 1.16.5 1.17.1");
    process.exit(1);
  }

  const outDir = join(DATA_DIR, "forge-porting", "breaking-changes");
  mkdirSync(outDir, { recursive: true });

  for (const { from, to, note } of pairs) {
    const key = `${from}-${to}`;
    const fromIndex = loadIndexL0(from);
    const toIndex = loadIndexL0(to);

    const { added, removed } = compareIndexes(fromIndex, toIndex);

    // 已知 API breaking changes（从 to 版本的 versions.json 读取）
    const known = knownBreakingChanges[to] || [];

    const report = {
      versionRange: key,
      note: note || "",
      generatedAt: new Date().toISOString(),
      structuralChanges: {
        description: "⚠️ 基于文档章节结构变化（自动检测），不代表完整 API breaking changes",
        addedCount: added.length,
        removedCount: removed.length,
        added: added.slice(0, 20),
        removed: removed.slice(0, 20),
      },
      breakingChanges: {
        description: "✅ 基于 versions.json 手动录入的 API 级别变更",
        changes: known,
      },
    };

    const outPath = join(outDir, `${key}.json`);
    writeFileSync(outPath, JSON.stringify(report, null, 2), "utf-8");

    const status = (fromIndex && toIndex) ? "✅" : "⚠️";
    console.log(`${status} ${key}: +${added.length} -${removed.length} chapters | ${known.length} known API changes`);
  }

  console.log(`\nOutput: ${outDir}`);
}

main();
