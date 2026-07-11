#!/usr/bin/env node
/**
 * update-porting-updates.js
 * 半自动知识库更新脚本。
 *
 * 用法: node scripts/update-porting-updates.js --version=1.20.4
 *       node scripts/update-porting-updates.js --version=26.1
 *
 * 工作方式（半自动）：
 * 1. 接收目标版本参数
 * 2. 输出引导信息，说明用户需要查阅哪些文档
 * 3. 输出一个 breaking changes 的草稿 JSON 片段
 * 4. 用户确认草稿后，手动更新 data/porting/knowledge-base/versions.json
 *
 * 注意：
 * - 此脚本不会自动覆写 versions.json
 * - 人工 review 是必要环节
 * - 由于网页格式不固定，自动解析可能不准确
 */

import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, "..", "data", "porting", "knowledge-base");

// ── 命令行参数解析 ───────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const versionArg = args.find((a) => a.startsWith("--version="));
const targetVersion = versionArg ? versionArg.split("=")[1] : null;

if (!targetVersion) {
  console.error("用法: node scripts/update-porting-updates.js --version=<MC版本>");
  console.error("示例: node scripts/update-porting-updates.js --version=1.20.4");
  process.exit(1);
}

// ── 参考文档 URL ────────────────────────────────────────────────────────────
const DOCS = {
  "1.20.2": {
    name: "Forge → NeoForge 分叉版本",
    urls: [
      "https://neoforged.net/news/20.2release/",
      "https://neoforged.net/news/20.2registry-rework/",
    ],
    note: "这是 Forge 社区分叉为 NeoForge 的关键版本，需关注包名迁移和 RegistryObject 变更",
  },
  "1.20.4": {
    name: "NeoForge 1.20.4",
    urls: [
      "https://neoforged.net/news/",
    ],
    note: "NeoForge 内小幅升级，通常无重大 API 断裂",
  },
  "1.21.0": {
    name: "Minecraft 1.21.0",
    urls: [
      "https://neoforged.net/news/",
      "https://fabricmc.net/",
    ],
    note: "检查 Java 21 要求和主要 API 变更",
  },
  "26.1": {
    name: "Minecraft 26.1 (日历版本)",
    urls: [
      "https://docs.neoforged.net/primer/docs/26.1/",
      "https://docs.fabricmc.net/develop/porting/",
    ],
    note: "重大变更：Java 25、deobfuscated、Mappings 切换到 Mojang 官方",
  },
};

// ── 草稿模板生成 ───────────────────────────────────────────────────────────
function generateDraft(version) {
  const templates = {
    "1.20.2": {
      breakingChanges: [
        {
          domain: "packages",
          description: "net.minecraftforge → net.neoforged",
          affectedFiles: "all-java",
          fixType: "global-replace",
        },
        {
          domain: "registry",
          description: "RegistryObject<T> → DeferredHolder<T, T>",
          affectedFiles: "registry-java-files",
          fixType: "manual-review",
        },
      ],
    },
    "26.1": {
      breakingChanges: [
        { domain: "java", description: "Java 21 → Java 25", affectedFiles: ["build.gradle"], fixType: "manual-edit" },
        { domain: "mappings", description: "Yarn/Parchment → Mojang (deobfuscated)", affectedFiles: ["build.gradle"], fixType: "manual-edit" },
        { domain: "itemstack", description: "new ItemStack() → ItemStackTemplate", affectedFiles: ["data-file-loaders"], fixType: "manual-review" },
      ],
    },
  };

  return templates[version] ?? { breakingChanges: [] };
}

// ── 主逻辑 ─────────────────────────────────────────────────────────────────
function main() {
  console.log("=== Porting Knowledge Base Update Helper ===\n");
  console.log(`目标版本: ${targetVersion}\n`);

  const doc = DOCS[targetVersion];
  if (!doc) {
    console.log(`[${targetVersion}] 暂无预设模板。`);
    console.log("请查阅以下文档，手动确定 breaking changes：\n");
    console.log("  NeoForge: https://neoforged.net/news/");
    console.log("  Fabric:   https://fabricmc.net/");
    console.log("  Architectury: https://docs.architectury.dev/changelog");
  } else {
    console.log(`[${targetVersion}] ${doc.name}\n`);
    console.log("请查阅以下文档获取详细 breaking changes：");
    for (const url of doc.urls) {
      console.log(`  - ${url}`);
    }
    console.log(`\n备注：${doc.note}\n`);

    // 输出草稿 JSON
    const draft = generateDraft(targetVersion);
    console.log("--- breakingChanges 草稿 JSON（请 review 后手动更新 versions.json）---\n");
    console.log(JSON.stringify(draft, null, 2));
    console.log("\n--- 结束 ---\n");
  }

  console.log("下一步：");
  console.log("1. 查阅上述文档");
  console.log("2. review 草稿 JSON（如有）");
  console.log("3. 手动更新 data/porting/knowledge-base/versions.json");
  console.log("4. 将 meta.lastUpdated 更新为今天日期");
  console.log("\n注意：此脚本不会自动覆写 versions.json。人工 review 是必要环节。");
}

main();
