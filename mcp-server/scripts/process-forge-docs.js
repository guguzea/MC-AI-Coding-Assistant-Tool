#!/usr/bin/env node
/**
 * process-forge-docs.js
 * 预处理已爬取的 Forge 文档，构建四层金字塔索引。
 *
 * 输入：data/forge-docs/{version}/*.md（fetch-forge-docs.js 产出）
 * 输出：
 *   data/forge-docs/{version}/
 *   ├── index-l0.json   — L0 索引（标题 + URL + 版本 + 标签）
 *   ├── index-l1.json   — L1 摘要（每个 h2/h3 标题 + 首段 150-200 字）
 *   ├── index-l2.json   — L2 全文索引（完整页面信息）
 *   └── processed/      — L2+ 关键章节标记后的文件
 *
 * 关键标记标准：
 *   🔴 新手必读：Note/Warning/Important/Tip 开头的段落
 *   🟠 常见错误：包含 "do not", "common mistake", "never", "avoid" 的段落
 *   🟢 示例代码：完整代码块
 *   ⭐ 高权重：注册表、事件、能力、网络等核心章节
 *
 * 使用：
 *   node scripts/process-forge-docs.js              # 处理所有版本
 *   node scripts/process-forge-docs.js --version 1.20.1
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from "fs";
import { join, dirname, basename } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, "..", "data", "forge-docs");

// ── 关键标签定义 ─────────────────────────────────────────────────────────

const PRIORITY_TAGS = [
  { priority: "⭐",  keywords: ["registries", "registry", "deferred", "ForgeRegistries", "DeferredRegister"] },
  { priority: "⭐",  keywords: ["events", "event", "SubscribeEvent", "EventBus"] },
  { priority: "⭐",  keywords: ["capabilities", "capability", "ICapabilityProvider"] },
  { priority: "⭐",  keywords: ["networking", "network", "SimpleChannel", "Packet", "simpleimpl"] },
  { priority: "⭐",  keywords: ["datagen", "data generation", "DataGenerator", "Provider"] },
  { priority: "⭐",  keywords: ["sides", "client", "server", "dist"] },
  { priority: "🟡", keywords: ["items", "item", "SwordItem", "ArmorItem", "BlockItem"] },
  { priority: "🟡", keywords: ["blocks", "block", "BlockBehaviour"] },
  { priority: "🟡", keywords: ["blockentities", "block entity", "BlockEntity"] },
  { priority: "🟡", keywords: ["entities", "entity", "EntityType"] },
  { priority: "🟡", keywords: ["recipes", "recipe", "RecipeSerializer"] },
  { priority: "🟡", keywords: ["loottables", "loot table"] },
  { priority: "🟡", keywords: ["tags", "TagKey", "Tag"] },
  { priority: "🟢", keywords: ["sounds", "sound"] },
  { priority: "🟢", keywords: ["particles", "particle"] },
  { priority: "🟢", keywords: ["rendering", "render", "BakedModel"] },
  { priority: "🟢", keywords: ["config", "configuration"] },
  { priority: "🟢", keywords: ["gui", "screen", "menu", "Screen"] },
  { priority: "🟢", keywords: ["tests", "gametest"] },
  { priority: "🟢", keywords: ["access transformers", "accesstransformer"] },
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
  if (name.includes("capabilit")) tags.add("capability");
  if (name.includes("network")) tags.add("networking");
  if (name.includes("datagen")) tags.add("datagen");
  if (name.includes("side")) tags.add("sides");
  if (name.includes("lifecycle")) tags.add("lifecycle");
  if (name.includes("item")) tags.add("item");
  if (name.includes("block")) tags.add("block");
  if (name.includes("blockentity")) tags.add("blockentity");
  if (name.includes("entity")) tags.add("entity");
  if (name.includes("recipe")) tags.add("recipe");
  if (name.includes("loot")) tags.add("loot");
  if (name.includes("tag")) tags.add("tag");
  if (name.includes("render")) tags.add("rendering");
  if (name.includes("screen") || name.includes("menu")) tags.add("gui");
  if (name.includes("config")) tags.add("config");
  if (name.includes("sound")) tags.add("sounds");
  if (name.includes("particle")) tags.add("particles");
  if (name.includes("test")) tags.add("tests");
  if (name.includes("access")) tags.add("advanced");
  if (name.includes("versioning") || name.includes("structuring") || name.includes("modfile")) tags.add("meta");

  // 同时返回优先级（用于排序）和标签
  return { tags: [...tags], priorities: [...priorities] };
}

// ── Markdown 解析工具 ─────────────────────────────────────────────────────

function parseMarkdown(content) {
  const lines = content.split("\n");
  const sections = [];
  let currentSection = null;
  let currentParagraph = [];

  for (const line of lines) {
    const h2Match = line.match(/^## (.+)/);
    const h3Match = line.match(/^### (.+)/);
    const codeBlockMatch = line.match(/^```(\w*)/);

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
      // 去除 Markdown 语法噪声
      const clean = line
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // 链接
        .replace(/`([^`]+)`/g, "$1")             // 行内代码
        .replace(/[*_]{1,2}([^*_]+)[*_]{1,2}/g, "$1") // 强调
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
  // 回溯找最后一个句号（或感叹号、问号）
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

  // 跳过页面标题（第一个 ## 之前的段落通常不够概括）
  // 找到第一个实质性段落
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

    // 代码块开始/结束
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

      // MkDocs admonition blockquote 形式（来自 convertAdmonitions 转换）
      // 匹配 > **Warning**:, > **Important**:, > **Note**:, > **Tip**:, > **Danger**: 等
      const admonitionMatch = line.match(/^>\s*\*\*([^*]+)\*\*:/i);
      if (admonitionMatch) {
        const type = admonitionMatch[1].toLowerCase();
        const next = lines.slice(i, i + 4).join(" ").slice(0, 400);
        if (["warning", "important", "note", "tip", "danger", "caution", "attention"].includes(type)) {
          keys.push({ type: "🔴", line: i, text: next, role: `新手必读 (${admonitionMatch[1]})` });
        }
      }

      // 直接匹配 blockquote 中的 NOTE/WARNING/IMPORTANT 关键词
      if (
        line.match(/^>\s*(NOTE|WARNING|IMPORTANT|TIP|PREREQUISITES?)\b/i)
      ) {
        const next = lines.slice(i, i + 3).join(" ").slice(0, 300);
        keys.push({ type: "🔴", line: i, text: next, role: "新手必读" });
      }

      // 🟠 常见错误：do not / common mistake / never / avoid
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
  // 在 Markdown 中插入关键标记
  // 策略：将 keys 按行号排序，在对应位置插入标记注释
  let result = content;

  // 按行号降序插入（避免行号偏移）
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

// ── 主处理函数 ──────────────────────────────────────────────────────────

function processVersion(version) {
  const versionDir = join(DATA_DIR, version);
  const rawDir = join(versionDir, "raw");
  if (!existsSync(rawDir)) {
    console.error(`❌ 版本目录不存在: ${rawDir}`);
    console.error(`   请先运行 fetch-forge-docs.js 爬取文档。`);
    return;
  }

  const files = readdirSync(rawDir).filter(f => f.endsWith(".md") && !f.startsWith("_"));

  if (files.length === 0) {
    console.error(`❌ 版本 ${version} 的 raw/ 目录下没有找到 .md 文件，请先运行 fetch-forge-docs.js`);
    return;
  }

  console.log(`\n📦 处理版本 ${version}：${files.length} 个文件`);

  const l0 = []; // 索引
  const l1 = []; // 摘要
  const l2 = []; // 全文

  const processedDir = join(versionDir, "processed");
  mkdirSync(processedDir, { recursive: true });

  for (const file of files) {
    const rawPath = join(rawDir, file);
    const raw = readFileSync(rawPath, "utf-8");

    // 提取元数据行（由 fetch 脚本添加）
    // 使用 \r?\n 支持 Windows (\r\n) 和 Unix (\n) 行尾
    // 使用 m 标志让 ^ 匹配行首（因为文件第一行是标题，不是元数据）
    const metaMatch = raw.match(/^> 来源：(.+)\r?\n> 版本：(.+)\r?\n\r?\n/m);
    const url = metaMatch?.[1] || "";

    // 去掉元数据行，获取正文
    const content = metaMatch ? raw.slice(raw.indexOf(metaMatch[0]) + metaMatch[0].length) : raw;

    // 提取标题
    const titleMatch = content.match(/^# (.+)/);
    const title = titleMatch?.[1] || file.replace(".md", "");

    // 解析章节
    const sectionSummaries = extractSectionSummaries(content);
    const firstPara = extractFirstParagraph(content);

    // 检测关键段落
    const keys = detectKeySections(content);

    // 生成 L2+ 版本
    const l2Plus = generateL2Plus(content, keys);
    const l2PlusFile = join(processedDir, file);
    writeFileSync(l2PlusFile, l2Plus, "utf-8");

    const tags = inferTags(file, title, content);

    // 构建 L0 索引条目
    const l0Entry = {
      id: `${version}/${file.replace(".md", "")}`,
      version,
      label: title,
      url,
      tags: tags.tags,
      priority: tags.priorities.includes("⭐") ? "⭐" : tags.priorities.includes("🟡") ? "🟡" : "🟢",
      sectionCount: sectionSummaries.length,
    };
    l0.push(l0Entry);

    // 构建 L1 摘要条目
    l1.push({
      id: l0Entry.id,
      version,
      label: title,
      url,
      tags: tags.tags,
      firstParagraph: firstPara,
      sections: sectionSummaries.slice(0, 10), // 最多 10 个 h2
    });

    // 构建 L2 全文索引条目（不存全文，只存引用）
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
    });

    const keyCount = keys.length;
    const tagStr = tags.tags.length ? `[${tags.tags.join(",")}]` : "";
    console.log(`  ✅ ${title} ${tagStr} (${sectionSummaries.length} sections, ${keyCount} keys)`);
  }

  // 按优先级和标签排序（L0）
  l0.sort((a, b) => {
    const priorityOrder = { "⭐": 0, "🟡": 1, "🟢": 2 };
    const pa = priorityOrder[a.priority] ?? 3;
    const pb = priorityOrder[b.priority] ?? 3;
    if (pa !== pb) return pa - pb;
    return a.label.localeCompare(b.label);
  });

  // 写入索引文件
  writeFileSync(join(versionDir, "index-l0.json"), JSON.stringify(l0, null, 2), "utf-8");
  writeFileSync(join(versionDir, "index-l1.json"), JSON.stringify(l1, null, 2), "utf-8");
  writeFileSync(join(versionDir, "index-l2.json"), JSON.stringify(l2, null, 2), "utf-8");

  console.log(`\n✅ 索引已写入 ${versionDir}:`);
  console.log(`   index-l0.json — ${l0.length} 条（L0 索引）`);
  console.log(`   index-l1.json — ${l1.length} 条（L1 摘要）`);
  console.log(`   index-l2.json — ${l2.length} 条（L2 全文索引）`);
  console.log(`   processed/   — L2+ 关键标记文件`);
}

async function main() {
  const args = process.argv.slice(2);
  const versionArg = args.find(a => a.startsWith("--version="))?.split("=")[1];

  const versions = versionArg
    ? [versionArg]
    : readdirSync(DATA_DIR).filter(d =>
        existsSync(join(DATA_DIR, d)) &&
        !d.startsWith("_") &&
        !d.startsWith(".")
      );

  for (const version of versions) {
    processVersion(version);
  }
}

main().catch(console.error);
