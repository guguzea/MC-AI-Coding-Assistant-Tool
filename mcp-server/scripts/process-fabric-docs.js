#!/usr/bin/env node
/**
 * process-fabric-docs.js
 * 预处理已爬取的 Fabric 文档，构建四层金字塔索引。
 *
 * 输入：data/fabric_<version>/fabric-docs/<version>/raw/*.md（fetch-fabric-docs.js 产出）
 * 输出：
 *   data/fabric_<version>/fabric-docs/<version>/
 *   ├── index-l0.json   — L0 索引（标题 + URL + 版本 + 标签）
 *   ├── index-l1.json   — L1 摘要（每个 h2/h3 标题 + 首段 150-200 字）
 *   ├── index-l2.json   — L2 全文索引（完整页面信息）
 *   └── processed/      — L2+ 关键章节标记后的文件
 *
 * 关键标记标准（与 process-forge-docs.js 完全一致）：
 *   🔴 新手必读：Note/Warning/Important/Tip 开头的段落
 *   🟠 常见错误：包含 "do not", "common mistake", "never", "avoid" 的段落
 *   🟢 示例代码：完整代码块
 *   ⭐ 高权重：注册表、事件、能力、网络等核心章节
 *
 * 使用：
 *   node scripts/process-fabric-docs.js                    # 默认 1.21.1
 *   node scripts/process-fabric-docs.js --version 1.20.1  # 指定版本
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from "fs";
import { join, resolve, dirname, basename } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const MC_SKILL_ROOT = resolve(__dirname, "..", "..");

// ── CLI 参数解析（统一方式，支持空格 / 等号两种风格） ─────────────────────────
function parseCli(argv) {
  const out = { flags: new Set(), kv: new Map() };
  for (let i = 0; i < argv.length; i++) {
    const tok = argv[i];
    if (!tok.startsWith("--")) continue;
    const eq = tok.indexOf("=");
    if (eq >= 0) {
      const key = tok.slice(2, eq);
      const val = tok.slice(eq + 1);
      if (key) out.kv.set(key, val);
    } else {
      const key = tok.slice(2);
      const next = argv[i + 1];
      if (next !== undefined && !next.startsWith("--")) {
        out.kv.set(key, next);
        i++;
      } else {
        out.flags.add(key);
      }
    }
  }
  return out;
}

const CLI = parseCli(process.argv.slice(2));
const VERSION = CLI.kv.get("version");
if (!VERSION) {
  console.error("[process-fabric-docs] 缺少 --version 参数。");
  console.error("用法：node scripts/process-fabric-docs.js --version 1.21.1");
  process.exit(2);
}
const DATA_DIR = join(MC_SKILL_ROOT, "data", `fabric_${VERSION}`, "fabric-docs");

// ── Fabric 专用 PRIORITY_TAGS ──────────────────────────────────────────────
// 与 Forge 的 DeferredRegister/ForgeRegistry 不同，Fabric 使用：
//   Registry.register(Registry, Identifier, Object)
//   Identifier = new Identifier(namespace, path)
//   ModInitializer / ClientModInitializer 作为入口点

const PRIORITY_TAGS = [
  // ⭐ 最高优先级：Fabric 核心概念
  { priority: "⭐", keywords: ["registry", "registries", "Registry.register", "Identifier"] },
  { priority: "⭐", keywords: ["entrypoint", "ModInitializer", "ClientModInitializer", "DedicatedServerModInitializer"] },
  { priority: "⭐", keywords: ["networking", "CustomPacketPayload", "ServerPlayNetworking", "ClientPlayNetworking"] },
  { priority: "⭐", keywords: ["events", "event", "Callback", "callback"] },
  { priority: "⭐", keywords: ["datagen", "data generation", "DataGenerator", "Provider", "FabricData"] },
  { priority: "⭐", keywords: ["sides", "client", "server", "environment", "Dist"] },
  // 🟡 高优先级：具体实现
  { priority: "🟡", keywords: ["items", "item", "Item", "ItemStack", "ArmorItem", "SwordItem"] },
  { priority: "🟡", keywords: ["blocks", "block", "Block", "BlockBehaviour"] },
  { priority: "🟡", keywords: ["blockentities", "block entity", "BlockEntity", "BlockEntityType"] },
  { priority: "🟡", keywords: ["entities", "entity", "EntityType"] },
  { priority: "🟡", keywords: ["recipes", "recipe", "RecipeSerializer", "RecipeProvider"] },
  { priority: "🟡", keywords: ["loottables", "loot table", "LootTable"] },
  { priority: "🟡", keywords: ["tags", "TagKey", "Tag", "TagGroup"] },
  { priority: "🟡", keywords: ["commands", "brigadier", "CommandDispatcher"] },
  // 🟢 低优先级：辅助功能
  { priority: "🟢", keywords: ["mixin", "Mixin", "mixinjson", "Inject", "Redirect"] },
  { priority: "🟢", keywords: ["resources", "assets", "data pack", "resourcepack"] },
  { priority: "🟢", keywords: ["renderer", "rendering", "RenderLayer"] },
  { priority: "🟢", keywords: ["config", "configuration"] },
  { priority: "🟢", keywords: ["particles", "particle", "Particle"] },
  { priority: "🟢", keywords: ["client", "client-side", "clientonly"] },
];

function inferTags(filename, title, content) {
  const text = `${filename} ${title} ${content}`.toLowerCase();
  const tags = new Set();
  const priorities = new Set();

  for (const { priority, keywords } of PRIORITY_TAGS) {
    if (keywords.some(k => text.includes(k))) {
      priorities.add(priority);
    }
  }

  // 额外标签：从文件名推断（始终添加小写语义标签）
  const name = basename(filename, ".md").toLowerCase();
  if (name.includes("registr")) tags.add("registry");
  if (name.includes("event")) tags.add("event");
  if (name.includes("network")) tags.add("networking");
  if (name.includes("datagen")) tags.add("datagen");
  if (name.includes("side") || name.includes("client") || name.includes("server")) tags.add("sides");
  if (name.includes("lifecycle")) tags.add("lifecycle");
  if (name.includes("item")) tags.add("item");
  if (name.includes("block")) tags.add("block");
  if (name.includes("blockentity")) tags.add("blockentity");
  if (name.includes("entity")) tags.add("entity");
  if (name.includes("recipe")) tags.add("recipe");
  if (name.includes("loot")) tags.add("loot");
  if (name.includes("tag")) tags.add("tag");
  if (name.includes("render")) tags.add("rendering");
  if (name.includes("command")) tags.add("command");
  if (name.includes("config")) tags.add("config");
  if (name.includes("mixin")) tags.add("mixin");
  if (name.includes("resource")) tags.add("resource");
  if (name.includes("entrypoint") || name.includes("initializer")) tags.add("entrypoint");
  if (name.includes("particle")) tags.add("particle");

  return { tags: [...tags], priorities: [...priorities] };
}

// ── Markdown 解析工具（与 process-forge-docs.js 完全一致）──────────────────────

function parseMarkdown(content) {
  const lines = content.split("\n");
  const sections = [];
  let currentSection = null;
  let currentParagraph = [];

  for (const line of lines) {
    const h2Match = line.match(/^## (.+)/);
    const h3Match = line.match(/^### (.+)/);

    if (h2Match) {
      if (currentSection) sections.push(currentSection);
      currentSection = { level: 2, title: h2Match[1], content: "", paragraphs: [] };
      currentParagraph = [];
    } else if (h3Match) {
      if (currentSection) {
        if (currentParagraph.length) {
          currentSection.paragraphs.push(currentParagraph.join(" "));
          currentParagraph = [];
        }
        currentSection.content += `\n### ${h3Match[1]}\n`;
        currentSection.paragraphs.push(`[H3] ${h3Match[1]}`);
      }
    } else if (line.startsWith("```")) {
      currentParagraph.push(`[CODE_BLOCK]`);
    } else if (line.trim() === "") {
      if (currentParagraph.length && currentSection) {
        const para = currentParagraph.join(" ");
        if (para.trim()) {
          currentSection.paragraphs.push(para.trim());
        }
        currentParagraph = [];
      }
    } else {
      const clean = line
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
        .replace(/`([^`]+)`/g, "$1")
        .replace(/[*_]{1,2}([^*_]+)[*_]{1,2}/g, "$1")
        .trim();
      if (clean) {
        currentParagraph.push(clean);
      }
    }
  }

  if (currentSection && currentParagraph.length) {
    currentSection.paragraphs.push(currentParagraph.join(" ").trim());
  }
  if (currentSection) sections.push(currentSection);

  return sections;
}

function truncateAtSentence(text, maxChars) {
  if (text.length <= maxChars) return text;
  const truncated = text.slice(0, maxChars);
  const lastSentence = truncated.lastIndexOf(".");
  const lastExclaim = truncated.lastIndexOf("!");
  const lastQuestion = truncated.lastIndexOf("?");
  const cutoff = Math.max(lastSentence, lastExclaim, lastQuestion);
  if (cutoff > maxChars * 0.5) {
    return truncated.slice(0, cutoff + 1);
  }
  return truncated.slice(0, maxChars - 3) + "...";
}

function extractFirstParagraph(content, maxChars = 200) {
  const sections = parseMarkdown(content);
  if (sections.length === 0) return "";
  for (const section of sections) {
    const relevant = section.paragraphs
      .filter(p => !p.startsWith("[H3]") && !p.startsWith("[CODE_BLOCK]"))
      .filter(p => p.length > 30);
    if (relevant.length > 0) {
      return truncateAtSentence(relevant[0], maxChars);
    }
  }
  return "";
}

function extractSectionSummaries(content, maxChars = 200) {
  const sections = parseMarkdown(content);
  return sections.map(s => ({
    title: s.title,
    level: s.level,
    summary: truncateAtSentence(
      s.paragraphs
        .filter(p => !p.startsWith("[H3]") && !p.startsWith("[CODE_BLOCK]"))
        .filter(p => p.length > 20)
        .slice(0, 2)
        .join(" "),
      maxChars
    ),
  }));
}

function detectKeySections(content) {
  const lines = content.split("\n");
  const keys = [];
  let inCodeBlock = false;
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.match(/^```\w*/)) {
      inCodeBlock = !inCodeBlock;
      if (inCodeBlock) {
        const nextLine = lines[i + 1] || "";
        const prevLine = lines[i - 1] || "";
        if (
          nextLine.match(/^(public|private|protected)?\s*(class|enum|interface|@|\/\/)/) ||
          prevLine.match(/^## .*(example|示例|code|代码)/i)
        ) {
          keys.push({ type: "🟢", line: i, text: nextLine.trim() || "代码块", role: "示例代码" });
        }
      }
      i++;
      continue;
    }

    if (!inCodeBlock) {
      const lower = line.toLowerCase();

      // MkDocs admonition / blockquote 形式
      const admonitionMatch = line.match(/^>\s*\*\*([^*]+)\*\*:/i);
      if (admonitionMatch) {
        const type = admonitionMatch[1].toLowerCase();
        const next = lines.slice(i, i + 4).join(" ").slice(0, 400);
        if (["warning", "important", "note", "tip", "danger", "caution", "attention"].includes(type)) {
          keys.push({ type: "🔴", line: i, text: next, role: `新手必读 (${admonitionMatch[1]})` });
        }
      }

      if (line.match(/^>\s*(NOTE|WARNING|IMPORTANT|TIP|PREREQUISITES?)\b/i)) {
        const next = lines.slice(i, i + 3).join(" ").slice(0, 300);
        keys.push({ type: "🔴", line: i, text: next, role: "新手必读" });
      }

      if (
        lower.includes("do not") || lower.includes("don't") ||
        lower.includes("common mistake") || lower.includes("avoid") ||
        lower.includes("never ") || lower.includes("not recommended") ||
        lower.includes("deprecated") || lower.includes("incorrect")
      ) {
        const next = lines.slice(i, i + 2).join(" ").slice(0, 300);
        keys.push({ type: "🟠", line: i, text: next, role: "常见错误" });
      }
    }

    i++;
  }

  return keys;
}

function generateL2Plus(content, keys) {
  let result = content;
  const sorted = [...keys].sort((a, b) => b.line - a.line);
  for (const key of sorted) {
    const marker = `\n<!-- key:${key.type} role:${key.role} -->\n`;
    const lines = result.split("\n");
    if (lines[key.line] !== undefined) {
      lines.splice(key.line, 0, marker);
      result = lines.join("\n");
    }
  }
  return result;
}

// ── 主处理函数 ────────────────────────────────────────────────────────────────

function processVersion(version) {
  const versionDir = join(DATA_DIR, version);
  const rawDir = join(versionDir, "raw");
  if (!existsSync(rawDir)) {
    console.error(`❌ 版本目录不存在: ${rawDir}`);
    console.error(`   请先运行 fetch-fabric-docs.js 爬取文档。`);
    return;
  }

  const files = readdirSync(rawDir).filter(f => f.endsWith(".md") && !f.startsWith("_"));
  if (files.length === 0) {
    console.error(`❌ 版本 ${version} 的 raw/ 目录下没有找到 .md 文件`);
    return;
  }

  console.log(`\n📦 处理版本 ${version}：${files.length} 个文件`);

  const l0 = [];
  const l1 = [];
  const l2 = [];

  const processedDir = join(versionDir, "processed");
  mkdirSync(processedDir, { recursive: true });

  for (const file of files) {
    const rawPath = join(rawDir, file);
    const raw = readFileSync(rawPath, "utf-8");

    // 提取元数据行（由 fetch-fabric-docs.js 添加）
    // ⚠️ 文件第一行是 `# 标题`，元数据从第二行开始。用 `\n` 而非 `^` 锚定。
    // ⚠️ 使用 non-greedy .+? 避免 URL 内容中包含 "来源" 等词时跨行误匹配
    const metaMatch = raw.match(/\n> 来源：(.+?)\r?\n> 版本：(.+?)\r?\n(?:> GitHub 路径：(.+?)\r?\n)?(?:> 抓取源：(.+?)\r?\n)?(?:> 抓取时间：(.+?)\r?\n)?(?:> SHA256：(.+?)\r?\n)?(?:> 分支：(.+?)\r?\n)?/m);
    const url = metaMatch?.[1] || "";
    const sourceTag = metaMatch?.[4] || "";
    const fetchedAt = metaMatch?.[5] || "";
    const shaTag = metaMatch?.[6] || "";

    const content = metaMatch ? raw.slice(raw.indexOf(metaMatch[0]) + metaMatch[0].length) : raw;

    const titleMatch = content.match(/^# (.+)/);
    const title = titleMatch?.[1] || file.replace(".md", "");

    const sectionSummaries = extractSectionSummaries(content);
    const firstPara = extractFirstParagraph(content);
    const keys = detectKeySections(content);

    const l2Plus = generateL2Plus(content, keys);
    const l2PlusFile = join(processedDir, file);
    writeFileSync(l2PlusFile, l2Plus, "utf-8");

    const tags = inferTags(file, title, content);

    const l0Entry = {
      id: `${version}/${file.replace(".md", "")}`,
      version,
      label: title,
      url,
      tags: tags.tags,
      priority: tags.priorities.includes("⭐") ? "⭐" : tags.priorities.includes("🟡") ? "🟡" : "🟢",
      sectionCount: sectionSummaries.length,
      ...(sourceTag ? { source: sourceTag } : {}),
      ...(fetchedAt ? { fetchedAt } : {}),
      ...(shaTag ? { sha256: shaTag } : {}),
    };
    l0.push(l0Entry);

    l1.push({
      id: l0Entry.id,
      version,
      label: title,
      url,
      tags: tags.tags,
      firstParagraph: firstPara,
      sections: sectionSummaries.slice(0, 10),
      ...(sourceTag ? { source: sourceTag } : {}),
      ...(shaTag ? { sha256: shaTag } : {}),
    });

    l2.push({
      id: l0Entry.id,
      version,
      label: title,
      url,
      tags: tags.tags,
      sections: sectionSummaries,
      hasCodeBlocks: content.includes("```"),
      codeBlockCount: (content.match(/```/g) || []).length / 2,
      keySections: keys.length,
      file: file,
      processedFile: `processed/${file}`,
      ...(sourceTag ? { source: sourceTag } : {}),
      ...(fetchedAt ? { fetchedAt } : {}),
      ...(shaTag ? { sha256: shaTag } : {}),
    });

    const keyCount = keys.length;
    const tagStr = tags.tags.length ? `[${tags.tags.join(",")}]` : "";
    console.log(`  ✅ ${title} ${tagStr} (${sectionSummaries.length} sections, ${keyCount} keys)`);
  }

  // 写入索引文件
  const writeIndex = (filename, data) => {
    writeFileSync(join(versionDir, filename), JSON.stringify(data, null, 2), "utf-8");
  };

  // L0 按 priority 排序（与 forge 脚本对齐）
  l0.sort((a, b) => {
    const order = { "⭐": 0, "🟡": 1, "🟢": 2 };
    return (order[a.priority] ?? 3) - (order[b.priority] ?? 3);
  });

  writeIndex("index-l0.json", l0);
  writeIndex("index-l1.json", l1);
  writeIndex("index-l2.json", l2);

  console.log(`  📊 写入索引: index-l0(${l0.length}) index-l1(${l1.length}) index-l2(${l2.length})`);
}

// ── 入口 ──────────────────────────────────────────────────────────────────────

processVersion(VERSION);
console.log(`\n✅ process-fabric-docs.js 完成（版本 ${VERSION}）`);
