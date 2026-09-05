#!/usr/bin/env node
/**
 * 为有官方 docs 索引的版本生成 draft 规则树骨架。
 * 无 index-l0.json 则退出、不写规则树。禁止从邻版复制方法名。
 *
 * 用法：node scripts/scaffold-version.mjs --platform=neoforge --minecraftVersion=1.20.6
 * 已有 pack.meta.json / AGENTS.md / 00–10 规则默认跳过；加 --force 才覆盖。
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const RULES = [
  ["00", "project-setup", "工程 / 构建"],
  ["01", "registry", "注册"],
  ["02", "block", "方块"],
  ["03", "item", "物品"],
  ["04", "entity", "实体"],
  ["05", "events", "事件"],
  ["06", "networking", "网络"],
  ["07", "datagen", "数据生成"],
  ["08", "client-server", "物理端"],
  ["09", "anti-patterns", "反模式"],
  ["10", "gui", "GUI"],
];

function arg(name) {
  const p = process.argv.find((a) => a.startsWith(`--${name}=`));
  return p ? p.slice(name.length + 3) : "";
}

const FORCE = process.argv.includes("--force");
const PLATFORMS = new Set(["forge", "fabric", "neoforge", "quilt", "liteloader", "rift", "modloader", "bedrock"]);

function isSafeVersionSegment(version) {
  if (!/^\d+(\.\d+)*$/.test(version)) return false;
  if (version.includes("..") || /[\\/]/.test(version)) return false;
  return true;
}

function writeUnlessExists(filePath, body) {
  if (!FORCE && fs.existsSync(filePath)) {
    console.log(`skip existing ${path.relative(ROOT, filePath)}（加 --force 才覆盖）`);
    return;
  }
  fs.mkdirSync(path.dirname(filePath), { recursive: true }); // 只在真要写时建目录
  fs.writeFileSync(filePath, body, "utf8");
}

function findIndexL0(platform, ver) {
  const candidates = [
    path.join(ROOT, "data", `${platform}_${ver}`, `${platform}-docs`, ver, "index-l0.json"),
    path.join(ROOT, "data", `${platform}_${ver}`, "neoforge-docs", ver, "index-l0.json"),
    path.join(ROOT, "data", `${platform}_${ver}`, "forge-docs", ver, "index-l0.json"),
    path.join(ROOT, "data", `${platform}_${ver}`, "fabric-docs", ver, "index-l0.json"),
    path.join(ROOT, "data", `${platform}_${ver}`, "quilt-docs", ver, "index-l0.json"),
  ];
  return candidates.find((p) => fs.existsSync(p));
}

function ruleBody(platform, ver, num, slug, title, docsTool) {
  return `---
description: ${num} — ${title}（${platform} ${ver}）draft。只许填本版文档 id。
globs:
alwaysApply: true
status: draft
---

# ${num} — ${title}

> pack-status: draft。禁止把本 FIXME 当可执行规则。
> 引用自该版 l0，禁止邻档 API。只许填本版 \`${docsTool}\` / index-l0 能核到的 id。

## Decision Flow

\`\`\`
FIXME: 只许填本版文档 id。核不到则保持本段留白，优于填错。
\`\`\`
`;
}

function agentsBody(platform, ver, docsTool, indexRel) {
  return `# ${platform} ${ver} — Agent 总纲（draft）

> pack-status: draft。**未核过核心 00/01/09 之前禁止 activate_platform_pack session/write。**
> 只适用于 **${platform} ${ver}**。禁止读取邻档 00–10 或把邻版方法名改版本号冒充。
> 文档：\`${docsTool}\`（version=${ver}）。索引：\`${indexRel}\`。

## 基本信息

| 项 | 值 |
|---|---|
| 平台 | ${platform} ${ver} |
| 文档 | ${docsTool} |
| 状态 | draft |

类名必须能在本版文档或 \`knowledge/common/verified-api-${ver}.md\` 核到。核不到的编号保持 FIXME。
`;
}

function main() {
  const platform = arg("platform").trim().toLowerCase();
  const ver = arg("minecraftVersion").trim();
  if (!platform || !ver) {
    console.error("需要 --platform= 与 --minecraftVersion=");
    process.exit(1);
  }
  if (!PLATFORMS.has(platform) || !isSafeVersionSegment(ver)) {
    console.error("platform 必须是已知加载器；minecraftVersion 只能是数字与点（禁止 .. 与路径分隔符）。");
    process.exit(2);
  }
  const indexPath = findIndexL0(platform, ver);
  if (!indexPath) {
    console.error(`没有 ${platform} ${ver} 的 index-l0.json，不写规则树。`);
    process.exit(2);
  }
  const packDir = path.resolve(path.join(ROOT, platform, ver));
  const rootResolved = path.resolve(ROOT);
  const packNorm = packDir.replace(/\\/g, "/").toLowerCase();
  const rootNorm = rootResolved.replace(/\\/g, "/").toLowerCase();
  if (packNorm !== rootNorm && !packNorm.startsWith(rootNorm + "/")) {
    console.error("拒绝写出仓库根之外的路径。");
    process.exit(2);
  }
  const rulesDir = path.join(packDir, ".cursor", "rules");
  const docsTool =
    platform === "neoforge"
      ? "search_neoforge_docs"
      : platform === "fabric"
        ? "search_fabric_docs"
        : platform === "forge"
          ? "search_forge_docs"
          : "search_docs";
  const indexRel = path.relative(ROOT, indexPath).replace(/\\/g, "/");
  writeUnlessExists(
    path.join(packDir, "pack.meta.json"),
    `${JSON.stringify({ "pack-status": "draft", status: "draft", platform, minecraftVersion: ver, index: indexRel }, null, 2)}\n`,
  );
  writeUnlessExists(path.join(packDir, "AGENTS.md"), agentsBody(platform, ver, docsTool, indexRel));
  for (const [num, slug, title] of RULES) {
    writeUnlessExists(
      path.join(rulesDir, `${num}-${slug}.mdc`),
      ruleBody(platform, ver, num, slug, title, docsTool),
    );
  }
  const commonDir = path.join(packDir, "knowledge", "common");
  const verified = path.join(commonDir, `verified-api-${ver}.md`);
  if (!fs.existsSync(verified)) {
    fs.mkdirSync(commonDir, { recursive: true }); // 只在真要写时建目录
    fs.writeFileSync(
      verified,
      `# ${platform} ${ver} 已核实 API\n\n> draft。只记录已用 ${docsTool} / processed md 核对过的类名。\n`,
      "utf8",
    );
  }
  console.log(`draft pack: ${path.relative(ROOT, packDir)} (index ${indexRel})`);
}

main();
