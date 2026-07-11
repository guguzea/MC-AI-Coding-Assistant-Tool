#!/usr/bin/env node
/**
 * forge-javadoc-indexer.js
 * 为 forge_javadoc 的 raw/ 目录生成 index-l0/1/2.json，
 * 使 ForgeDocStore 能统一查询 1.7.10-1.12.2 的 javadoc。
 *
 * raw/ 中的 .md 文件格式：
 *   ---
 *   title: "ClassName"
 *   package: "net/minecraftforge/..."
 *   version: "1.7.10"
 *   source: "https://..."
 *   sourceType: javadoc
 *   ---
 *   # ClassName
 *   ...content...
 *
 * id 设计：
 *   与 forge-docs 对齐：`${version}/${path/to/class_underscored}`
 *   例如：1.7.10/net/minecraft/block/Block
 *
 * tags 设计：
 *   - 包名前缀（net_minecraft_block）—— 用于精确过滤
 *   - 类名（Block）—— 用于类名精确匹配
 *   - 语义分类（registry/block/item/event/...）—— 基于包名/类名启发式规则
 *
 * 运行：
 *   node scripts/forge-javadoc-indexer.js                    # 所有版本
 *   node scripts/forge-javadoc-indexer.js --version 1.7.10 # 指定版本
 *   node scripts/forge-javadoc-indexer.js --dry-run         # 只统计不写文件
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── CLI ─────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const versionArg = args.find(a => a.startsWith("--version="))?.split("=")[1];
const dryRun = args.includes("--dry-run");

// ── 路径 ────────────────────────────────────────────────────────────────

const JAVADOC_ROOT = join(__dirname, "..", "..", "data", "forge_javadoc");

const ALL_VERSIONS = ["1.7.10", "1.8.9", "1.9.4", "1.10.2", "1.11.2", "1.12.2"];
const VERSIONS = versionArg ? [versionArg] : ALL_VERSIONS;

// ── 解析 front matter ─────────────────────────────────────────────────

function parseFrontMatter(content) {
  if (!content.startsWith("---")) return {};
  const end = content.indexOf("---", 3);
  if (end < 0) return {};
  const yaml = content.slice(3, end).trim();
  const result = {};
  for (const line of yaml.split("\n")) {
    const colonIdx = line.indexOf(":");
    if (colonIdx < 0) continue;
    const key = line.slice(0, colonIdx).trim();
    let value = line.slice(colonIdx + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    result[key] = value;
  }
  return result;
}

// ── 提取 sections ─────────────────────────────────────────────────────

function extractSections(content) {
  const sections = [];
  const lines = content.split("\n");
  let currentHeading = "";
  let currentLevel = 2;
  let buffer = [];

  for (const line of lines) {
    const h2 = line.match(/^## (.+)/);
    const h3 = line.match(/^### (.+)/);
    if (h2) {
      if (currentHeading) {
        sections.push({ title: currentHeading, level: currentLevel, summary: buffer.slice(0, 2).join(" ").substring(0, 200) });
      }
      currentHeading = h2[1].trim();
      currentLevel = 2;
      buffer = [];
    } else if (h3) {
      if (currentHeading) {
        sections.push({ title: currentHeading, level: currentLevel, summary: buffer.slice(0, 2).join(" ").substring(0, 200) });
      }
      currentHeading = h3[1].trim();
      currentLevel = 3;
      buffer = [];
    } else {
      buffer.push(line.trim());
    }
  }
  if (currentHeading) {
    sections.push({ title: currentHeading, level: currentLevel, summary: buffer.slice(0, 2).join(" ").substring(0, 200) });
  }
  return sections;
}

// ── 语义标签生成 ───────────────────────────────────────────────────────
//
// 基于包名/类名产生语义标签，让 searchIndex 的 tags 过滤更准确。
// 优先级: vanilla < minecraftforge(api) < registry/event/side 等等。

const SEMANTIC_RULES = [
  // 顶层范畴
  { test: pkg => pkg.startsWith("net/minecraftforge") || pkg.startsWith("cpw/mods/fml") || pkg.startsWith("cpw/mods/forge"), tag: "forge" },
  { test: pkg => pkg.startsWith("net/minecraft"), tag: "vanilla" },
  { test: pkg => pkg.startsWith("cpw/"), tag: "fml" },  // cpw.* 早期 Forge Loader 包（1.7.10 特有）

  // Registry & 注册
  { test: (pkg, name) => /registry/i.test(pkg) || /DeferredRegister|RegistryObject|ForgeRegistries|IForgeRegistry/.test(name),
    tag: "registry" },
  { test: (pkg, name) => /packagename.*resources/i.test(pkg) || /ResourceLocation|NamespacedKey/.test(name),
    tag: "resource" },

  // 方块
  { test: (pkg, name) => /\/block($|\/)/.test(pkg) || /Block\b|TileEntity|BlockEntity|BlockState|WorldGen/.test(name),
    tag: "block" },
  { test: (pkg, name) => /tileentity|TileEntity|BlockEntity/.test(pkg + name),
    tag: "tileentity" },

  // 物品
  { test: (pkg, name) => /\/item($|\/)/.test(pkg) || /Item[A-Z]|ItemStack/.test(name),
    tag: "item" },

  // 实体
  { test: (pkg, name) => /\/entity($|\/)/.test(pkg) || /Entity\b|LivingEntity|EntityAgeable|Mob\b/.test(name),
    tag: "entity" },

  // 事件
  { test: (pkg, name) => /eventhandler|event($|\/)|eventbus/.test(pkg) || /Event\b|IMCEvent|ListenEvent/.test(name),
    tag: "event" },
  { test: (pkg, name) => /SubscribeEvent|EventHandler/.test(name),
    tag: "event" },

  // 能力系统
  { test: (pkg, name) => /capability|capabilities/.test(pkg) || /Capability|ICapabilityProvider|ICapabilitySerializable|CapabilityDispatcher/.test(name),
    tag: "capability" },

  // 网络
  { test: (pkg, name) => /network/.test(pkg) || /Packet|NetworkManager|SimpleNetworkHandler|FMLNetworkEvent/.test(name),
    tag: "network" },

  // 维度/世界
  { test: (pkg, name) => /\/world($|\/)|\/dimension/.test(pkg) || /World\b|WorldProvider|Chunk\b/.test(name),
    tag: "world" },

  // GUI/Screen
  { test: (pkg, name) => /\/gui($|\/)|client.gui/.test(pkg) || /GuiScreen|Gui\b/.test(name),
    tag: "gui" },

  // 客户端/服务端
  { test: (pkg, name) => /render|client.renderer/.test(pkg) || /Renderer|Tessellator|BufferBuilder/.test(name),
    tag: "client" },
  { test: (pkg, name) => /Side|LogicalSide/.test(name),
    tag: "sides" },

  // 数据生成
  { test: (pkg, name) => /\.data($|\/)|\/data($|\/)|datagen/.test(pkg) || /RecipeProvider|LootTableProvider|TagProvider|LanguageProvider/.test(name),
    tag: "datagen" },

  // 配方/战利品
  { test: (pkg, name) => /crafting|recipe/.test(pkg) || /IRecipe|RecipeSerializer|ShapedRecipe/.test(name),
    tag: "recipe" },
  { test: (pkg, name) => /\/loot($|\/)|loot/.test(pkg) || /LootTable|LootPool/.test(name),
    tag: "loot" },
  { test: (pkg, name) => /Tag\b|TagCollection|TagRegistry/.test(name),
    tag: "tag" },

  // 生命周期
  { test: (pkg, name) => /Lifecycle|FMLConstructionEvent|FMLPreInitializationEvent|FMLPostInitializationEvent|IFMLLoadingPlugin/.test(name),
    tag: "lifecycle" },
  { test: (pkg, name) => /CommonProxy|ClientProxy|EffectInstance|Potion\b/.test(name),
    tag: "misc" },
];

/** 生成语义标签（去重） */
function generateSemanticTags(pkg, className) {
  const tags = new Set();
  for (const rule of SEMANTIC_RULES) {
    try {
      if (rule.test(pkg, className)) {
        tags.add(rule.tag);
      }
    } catch { /* ignore */ }
  }
  return [...tags];
}

/**
 * 优先级生成规则：
 * - net/minecraftforge 或 cpw/mods/fml（Forge API）→ ⭐
 * - net/minecraftforge/gradle（构建工具）→ 🟡
 * - 其他（vanilla / cpw/其他） → 🟢
 */
function inferPriority(pkg) {
  if (pkg.includes("minecraftforge") && !pkg.includes("gradle")) return "⭐";
  if (pkg.startsWith("cpw/mods/fml") || pkg.startsWith("cpw/mods/forge")) return "⭐";
  return "🟢";
}

// ── 为单个版本生成索引 ────────────────────────────────────────────────

function processVersion(version) {
  const rawDir = join(JAVADOC_ROOT, version, "raw");
  if (!readdirSync(rawDir, { withFileTypes: true }).some(e => e.isDirectory())) {
    console.log(`  [SKIP] ${version}: no raw directory`);
    return;
  }

  const l0Entries = [];
  const l1Entries = [];
  const l2Entries = [];

  let totalFiles = 0;
  let forgeCount = 0;

  // 遍历所有 .md 文件
  function walkDir(dir, pathPrefix) {
    try {
      for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const fullPath = join(dir, entry.name);
        const relPath = pathPrefix ? `${pathPrefix}/${entry.name}` : entry.name;

        if (entry.isDirectory()) {
          walkDir(fullPath, relPath);
        } else if (entry.name.endsWith(".md")) {
          // 类名（去掉 .md 后缀，处理 .inner-class）
          const fileName = entry.name.replace(/\.md$/, "");
          // 路径中的斜杠保留，用于语义 id
          // 例：raw/net/minecraft/block/Block.md
          //   → semanticPath: net/minecraft/block/Block
          //   → pageId:       1.7.10/net/minecraft/block/Block
          //   → processedFile: processed/net_minecraft_block_Block.md
          const semanticPath = relPath.replace(/\.md$/, "");
          const processedFile = "processed/" + semanticPath.replace(/\//g, "_") + ".md";

          // 读取文件
          const rawContent = readFileSync(fullPath, "utf-8");
          const frontMatter = parseFrontMatter(rawContent);
          const title = frontMatter.title || fileName;
          const pkg = frontMatter.package || "";
          const source = frontMatter.source || "";
          const docContent = rawContent.slice(rawContent.indexOf("---", 3) + 3).trim();

          // 提取 sections
          const sections = extractSections(docContent);

          // 优先级
          const priority = inferPriority(pkg);

          // pageId 与 forge-docs 风格对齐: `${version}/${semanticPath}`
          const pageId = `${version}/${semanticPath}`;

          // tags = [语义分类..., pkg, className]
          // 注意：把语义分类放在前面，让精确 tag 过滤更高效
          const semanticTags = generateSemanticTags(pkg, fileName);
          const tags = semanticTags.length > 0 ? semanticTags : ["vanilla"];
          tags.push(pkg.replace(/\//g, "_"));
          tags.push(fileName);

          totalFiles++;
          if (pkg.includes("minecraftforge")) forgeCount++;

          // L0
          l0Entries.push({
            id: pageId,
            version,
            label: title,
            url: source,
            tags,
            priority,
            sectionCount: sections.length,
          });

          // L1
          const firstParagraph = docContent.split("\n").find(l => l.trim() && !l.startsWith("#")) || "";
          l1Entries.push({
            id: pageId,
            version,
            label: title,
            url: source,
            tags,
            firstParagraph: firstParagraph.substring(0, 300),
            sections,
          });

          // L2
          l2Entries.push({
            id: pageId,
            version,
            label: title,
            url: source,
            tags,
            processedFile,
            sections,
          });
        }
      }
    } catch (e) {
      // ignore
    }
  }

  walkDir(rawDir, "");

  // 写入索引文件
  const outDir = join(JAVADOC_ROOT, version);
  mkdirSync(outDir, { recursive: true });

  if (dryRun) {
    console.log(`  [DRY] ${version}: ${totalFiles} pages (${forgeCount} Forge)`);
    return;
  }

  writeFileSync(join(outDir, "index-l0.json"), JSON.stringify(l0Entries, null, 2));
  writeFileSync(join(outDir, "index-l1.json"), JSON.stringify(l1Entries, null, 2));
  writeFileSync(join(outDir, "index-l2.json"), JSON.stringify(l2Entries, null, 2));

  // 同时复制 raw/ 到 processed/（store.ts 读取 processed/ 下的 .md）
  //
  // 命名规则：把 raw 中的多级路径"压平"为单层，保留完整路径作为前缀以避免碰撞。
  // 例：raw/net/minecraft/block/Block.md  →  processed/net_minecraft_block_Block.md
  //
  // 防御性检查：理论上 `a/b/c.md` 与 `a_b/c.md` 会产生相同目标名 `a_b_c.md`。
  // 出现这种命名冲突时，跳过该文件并在终端输出告警，避免覆盖既有索引数据。
  const procDir = join(outDir, "processed");
  mkdirSync(procDir, { recursive: true });

  const seenDest = new Set();
  function copyRawToProcessed(srcDir, destDir, prefix) {
    let entries;
    try {
      entries = readdirSync(srcDir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const srcPath = join(srcDir, entry.name);
      // 与原实现保持一致：prefix 为空时直接用 entry.name，避免引入额外下划线
      const destName = prefix ? `${prefix}_${entry.name}` : entry.name;
      const destPath = join(destDir, destName);

      if (entry.isDirectory()) {
        copyRawToProcessed(srcPath, destDir, destName);
      } else if (entry.name.endsWith(".md")) {
        if (seenDest.has(destPath)) {
          console.warn(`  [WARN] ${version}: name collision, skip ${srcPath} (would overwrite ${destPath})`);
          continue;
        }
        seenDest.add(destPath);
        try {
          const raw = readFileSync(srcPath, "utf-8");
          const content = raw.slice(raw.indexOf("---", 3) + 3).trim();
          writeFileSync(destPath, content);
        } catch (e) {
          console.warn(`  [WARN] ${version}: failed to process ${srcPath}: ${e.message}`);
        }
      }
    }
  }

  copyRawToProcessed(rawDir, procDir, "");

  console.log(`  [OK] ${version}: ${totalFiles} pages (${forgeCount} Forge)`);
}

// ── 主 ────────────────────────────────────────────────────────────────

console.log(`Generating indices for forge_javadoc (${dryRun ? "DRY RUN" : "live"})...\n`);

for (const v of VERSIONS) {
  processVersion(v);
}

console.log("\nDone!");
