#!/usr/bin/env node
/**
 * process-fabric-wiki.js
 *
 * 将 DokuWiki 原始标记文本（.txt）转换为 Markdown，
 * 生成 L0/L1/L2 索引。
 *
 * 关键标记规则（与 forge/fabric-docs 脚本一致）：
 *   🔴 新手必读：`**Note**` / `**Warning**` / `**Important**` / `~~deleted~~`
 *   🟠 常见错误：`don't` / `never` / `avoid` / `do not`
 *   🟢 示例代码：代码块（``` 等）
 *
 * 输入：data/fabric_<version>/fabric-wiki/<version>/raw/*.txt
 * 输出：
 *   data/fabric_<version>/fabric-wiki/<version>/
 *   ├── index-l0.json
 *   ├── index-l1.json
 *   ├── index-l2.json
 *   └── processed/  （Markdown + 关键标记）
 *
 * 用法：
 *   node scripts/process-fabric-wiki.js --version 1.20.1
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from "fs";
import { join, dirname, basename } from "path";
import { fileURLToPath } from "url";
import { countCodeFences } from "./_lib/pipeline-helpers.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const MC_SKILL_ROOT = join(__dirname, "..", "..");

const VERSION_ARG = process.argv.find(a => a.startsWith("--version="));
const VERSION = VERSION_ARG ? VERSION_ARG.split("=")[1] : "1.20.1";
const DATA_DIR = join(MC_SKILL_ROOT, "data", `fabric_${VERSION}`, "fabric-wiki");

// ── Wiki 标记 → Markdown ─────────────────────────────────────────────────────

function wikiToMarkdown(text) {
  let md = text;

  // ── DokuWiki 特殊标记处理（在其他规则之前）───────────────────────────

  // 1. Yarn 类引用标记（Tokenizer 方式，避免正则贪婪）
  //    DokuWiki 用 '' 转义，yarn 标签格式为 ''<yarn xxx>>'' 或 ''<yarn xxx>>
  //    从左到右扫描：遇到 '' 时检查是否开始 yarn 模式
  const yarnChunks = [];
  let i = 0;
  let remaining = md;
  while (i < text.length) {
    if (text.slice(i, i + 2) === "''") {
      // 检查是否开始 yarn 模式（下一个字符是 <yarn）
      if (text.slice(i + 2, i + 8) === "<yarn ") {
        // 进入 yarn 模式，收集直到下一个 ''
        const yarnStart = i;
        i += 2; // 跳过 ''
        const yarnContentStart = i;
        // 找下一个 ''
        const endIdx = text.indexOf("''", i);
        if (endIdx !== -1) {
          // 有关闭 ''，提取 yarn 内容
          const yarnContent = text.slice(i, endIdx);
          i = endIdx + 2; // 跳过 ''
          // 把 yarn 内容中的 <yarn xxx> 转为 `` xxx ``
          const processed = yarnContent.replace(/<yarn ([^>]+)>/g, "`$1`");
          yarnChunks.push(processed);
        } else {
          // 没有关闭 ''，只处理开引号后的 yarn 标签
          i = yarnContentStart;
          const yarnContent = text.slice(i).replace(/<yarn ([^>]+)>/g, "`$1`");
          i = text.length;
          yarnChunks.push(yarnContent);
        }
      } else {
        // 普通 '' → 跳过
        i += 2;
      }
    } else {
      yarnChunks.push(text[i]);
      i++;
    }
  }
  md = yarnChunks.join("");

  // ── 5. <yarncode> 标签 → 标准 markdown 代码块 ────────────────────────
  // 处理 enable_${1}_numbers 属性（Fabric Wiki 特殊语法）
  md = md.replace(/\[enable_\$\{1\}_numbers="true"\]/gi, "");
  md = md.replace(/\[enable_\$\{1\}_numbers[^\]]*\]/gi, "");

  md = md.replace(/<yarncode java(\s[^\n]*)?>/gi, "```java");
  md = md.replace(/<yarncode kotlin(\s[^\n]*)?>/gi, "```kotlin");
  md = md.replace(/<yarncode bash(\s[^\n]*)?>/gi, "```bash");
  md = md.replace(/<yarncode json(\s[^\n]*)?>/gi, "```json");
  md = md.replace(/<yarncode gradle(\s[^\n]*)?>/gi, "```gradle");
  md = md.replace(/<yarncode\s*>/gi, "```");
  md = md.replace(/<\/yarncode>/gi, "```");

  // ── 3. %%inline code%% → `inline code` ─────────────────────────────────
  md = md.replace(/%%([^%\n]+)%%/g, "`$1`");

  // ── 2. DokuWiki '' 引号清理（处理成对单引号包裹的内容）─────
  // 注意：本脚本的 yarn 标签引用（''<yarn xxx>>''）已在上方 yarnChunks
  // 处理器中处理完毕，此处仅清理 DokuWiki 页面中其他 '' 场景
  md = md.replace(/\'\'\'\'\'/g, "%%__5Q__%%");  // five quotes → placeholder
  md = md.replace(/\'\'\'\'/g, "%%__4Q__%%");   // four quotes
  md = md.replace(/\'\'\'/g, "%%__3Q__%%");     // three quotes
  md = md.replace(/\'\'/g, "");                  // two quotes → remove
  md = md.replace(/%%__5Q__%%/g, "");
  md = md.replace(/%%__4Q__%%/g, "");
  md = md.replace(/%%__3Q__%%/g, "");

  // ── DokuWiki 页面元数据 ─────────────────────────────────────────────

  md = md.replace(/^~~[^~]*~~\s*\n?/gm, "");
  md = md.replace(/^~~[^~]*~~\n?/gm, "");

  // 标题层级
  md = md.replace(/^======\s+(.+?)\s+======\s*$/gm, "# $1");
  md = md.replace(/^=====\s+(.+?)\s+=====\s*$/gm, "## $1");
  md = md.replace(/^====\s+(.+?)\s+====\s*$/gm, "### $1");
  md = md.replace(/^===\s+(.+?)\s+===\s*$/gm, "#### $1");

  // 代码块（标准 triple backtick）
  md = md.replace(/^\'\'\'\'\'(.+?)\'\'\'\'\'/gm, "```\n$1\n```");
  md = md.replace(/^\'\'\'\'(.+?)\'\'\'\'/gm, "```\n$1\n```");
  md = md.replace(/^\'\'\'(.+?)\'\'\'/gm, "```\n$1\n```");
  md = md.replace(/^\'\'([^\'\n]+)\'\'/gm, "`$1`");

  // 列表
  md = md.replace(/^  - (.+)$/gm, "  - $1");

  // 粗体 / 斜体
  md = md.replace(/\*\*\*(.+?)\*\*\*/g, "***$1***");
  md = md.replace(/\*\*(.+?)\*\*/g, "**$1**");
  md = md.replace(/\*(.+?)\*/g, "*$1*");
  md = md.replace(/__(.+?)__/g, "__$1__");
  md = md.replace(/_(.+?)_/g, "_${1}_");

  // 删除线
  md = md.replace(/<del>([\s\S]*?)<\/del>/gi, "~~$1~~");

  // 链接
  md = md.replace(/\[\[https?:\/\/([^\]]+)\]\]/g, "https://$1");
  md = md.replace(/\[\[([^|\]]+)\|([^\]]+)\]\]/g, "[$2]($1)");
  md = md.replace(/\[\[([^\]]+)\]\]/g, "[$1]($1)");
  md = md.replace(
    /\[\[fabricmc\.net\/wiki\/doku\.php\?id=([^]|]+)\|?([^\]]*)\]\]/gi,
    (_, id, label) => {
      const text = label || id.replace(/:/g, " ");
      return `[${text}](https://fabricmc.net/wiki/doku.php?id=${id})`;
    }
  );

  // 表格
  //
  // DokuWiki 语法：`| a | b |` 行；其中第一行通常是表头，后面是数据行。
  // 关键修复：在表头与数据行之间插入 Markdown 必需的分隔行 `| --- | --- |`，
  // 否则 Markdown 渲染器（如 markdown-it、GFM）会忽略整张表格。
  //
  // 注意：保留"行为空行"作为表格断点的语义（DokuWiki 表格之间必须有空白行）。
  const tableRowRegex = /^\|(.+)\|\s*$/;
  const tableSepRegex = /^[\s\|]*$/;
  md = (() => {
    const lines = md.split("\n");
    const out = [];
    let tableBuf = [];
    let firstRow = null;
    const flushTable = () => {
      if (tableBuf.length === 0) return;
      // 第一个非空行视为表头
      const header = tableBuf[0];
      const body = tableBuf.slice(1);
      out.push(header);
      const headerCells = header.replace(/^\|/, "").replace(/\|$/, "").split("|");
      out.push("| " + headerCells.map(() => "---").join(" | ") + " |");
      for (const row of body) out.push(row);
      tableBuf = [];
      firstRow = null;
    };
    for (const line of lines) {
      if (tableRowRegex.test(line)) {
        tableBuf.push(line.replace(/^\|(.+)\|\s*$/, (_, inner) => "| " + inner.split("|").map(c => c.trim()).join(" | ") + " |"));
      } else if (tableBuf.length > 0 && tableSepRegex.test(line)) {
        // 空行 / 仅 | 与空白的分隔行 → 结束当前表格
        flushTable();
        out.push(line);
      } else {
        flushTable();
        out.push(line);
      }
    }
    flushTable();
    return out.join("\n");
  })();

  // 引用
  md = md.replace(/^> (.+)$/gm, "> $1");

  // 水平线
  md = md.replace(/^----+$/gm, "\n---\n");

  // 清理
  md = md.replace(/\n{3,}/g, "\n\n");

  return md.trim();
}

// ── Markdown 解析 ────────────────────────────────────────────────────────────

function parseMarkdown(content) {
  const lines = content.split("\n");
  const sections = [];
  let currentSection = null;

  for (const line of lines) {
    const h2 = line.match(/^## (.+)/);
    const h3 = line.match(/^### (.+)/);

    if (h2) {
      if (currentSection) sections.push(currentSection);
      currentSection = { level: 2, title: h2[1], paragraphs: [] };
    } else if (h3) {
      if (currentSection) currentSection.paragraphs.push(`[H3] ${h3[1]}`);
    } else if (line.trim()) {
      if (currentSection) currentSection.paragraphs.push(line.trim());
    }
  }

  if (currentSection) sections.push(currentSection);
  return sections;
}

function truncateAtSentence(text, max) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const last = Math.max(cut.lastIndexOf("."), cut.lastIndexOf("!"), cut.lastIndexOf("?"));
  return last > max * 0.5 ? cut.slice(0, last + 1) : cut.slice(0, max - 3) + "...";
}

function extractFirstParagraph(content, max = 200) {
  const sections = parseMarkdown(content);
  for (const s of sections) {
    const relevant = s.paragraphs.filter(p => !p.startsWith("[H3]") && p.length > 30 && !p.startsWith("```"));
    if (relevant.length) return truncateAtSentence(relevant[0], max);
  }
  return "";
}

function extractSectionSummaries(content, max = 200) {
  const sections = parseMarkdown(content);
  return sections.map(s => ({
    title: s.title,
    level: s.level,
    summary: truncateAtSentence(
      s.paragraphs.filter(p => !p.startsWith("[H3]") && !p.startsWith("```")).join(" ").slice(0, 400),
      max
    ),
  }));
}

// ── 关键段落检测 ──────────────────────────────────────────────────────────

function detectKeySections(mdContent) {
  const lines = mdContent.split("\n");
  const keys = [];
  let inCode = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith("```")) { inCode = !inCode; continue; }

    if (!inCode) {
      const lower = line.toLowerCase();
      const trimmed = line.trim();

      // blockquote / Note / Warning
      const admo = trimmed.match(/^>\s*\*\*(NOTE|WARNING|IMPORTANT|TIP|DANGER|CAUTION)\s*\*\*:?\s*(.*)/i);
      if (admo) {
        keys.push({ type: "🔴", line: i, text: trimmed.slice(0, 400), role: `新手必读 (${admo[1]})` });
      }

      // 删除线
      if (trimmed.includes("~~") && (trimmed.includes("delete") || trimmed.includes("remove"))) {
        keys.push({ type: "🔴", line: i, text: trimmed.slice(0, 300), role: "新手必读 (deleted)" });
      }

      // 常见错误
      if (lower.includes("don't") || lower.includes("do not") ||
          lower.includes("never ") || lower.includes("avoid") ||
          lower.includes("common mistake") || lower.includes("not recommended") ||
          lower.includes("deprecated") || lower.includes("incorrect")) {
        keys.push({ type: "🟠", line: i, text: trimmed.slice(0, 300), role: "常见错误" });
      }
    }
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

// ── PRIORITY_TAGS ──────────────────────────────────────────────────────────

const PRIORITY_TAGS = [
  { priority: "⭐", keywords: ["registry", "Registry.register", "Identifier", "ModInitializer", "entrypoint"] },
  { priority: "⭐", keywords: ["networking", "packet", "CustomPacketPayload"] },
  { priority: "⭐", keywords: ["events", "event bus", "callback"] },
  { priority: "⭐", keywords: ["datagen", "data generation", "FabricData"] },
  { priority: "🟡", keywords: ["items", "Item", "ItemStack"] },
  { priority: "🟡", keywords: ["blocks", "Block", "BlockBehaviour"] },
  { priority: "🟡", keywords: ["block entity", "BlockEntity", "BlockEntityType"] },
  { priority: "🟡", keywords: ["entities", "Entity", "EntityType"] },
  { priority: "🟡", keywords: ["commands", "brigadier", "CommandDispatcher"] },
  { priority: "🟢", keywords: ["kotlin", "Mixin", "mixin"] },
  { priority: "🟢", keywords: ["configuration", "config"] },
  { priority: "🟢", keywords: ["rendering", "particle", "texture", "model"] },
];

function inferTags(filename, content) {
  const text = `${filename} ${content}`.toLowerCase();
  const tags = new Set();
  const priorities = new Set();

  for (const { priority, keywords } of PRIORITY_TAGS) {
    if (keywords.some(k => text.includes(k))) priorities.add(priority);
  }

  const name = basename(filename, ".txt").toLowerCase();
  if (name.includes("item")) tags.add("item");
  if (name.includes("block")) tags.add("block");
  if (name.includes("entity")) tags.add("entity");
  if (name.includes("command")) tags.add("command");
  if (name.includes("kotlin")) tags.add("kotlin");
  if (name.includes("config")) tags.add("config");
  if (name.includes("tutorial")) tags.add("tutorial");
  if (name.includes("documentation")) tags.add("documentation");

  return {
    tags: [...tags],
    priority: priorities.has("⭐") ? "⭐" : priorities.has("🟡") ? "🟡" : "🟢",
  };
}

// ── 主处理 ────────────────────────────────────────────────────────────────

function processVersion() {
  const rawDir = join(DATA_DIR, VERSION, "raw");
  if (!existsSync(rawDir)) {
    console.error(`❌ raw 目录不存在: ${rawDir}`);
    return;
  }

  const files = readdirSync(rawDir).filter(f => f.endsWith(".txt"));
  if (files.length === 0) {
    console.error(`❌ raw/ 没有 .txt 文件`);
    return;
  }

  console.log(`\n📦 处理版本 ${VERSION}：${files.length} 个文件`);
  const l0 = [], l1 = [], l2 = [];
  const processedDir = join(DATA_DIR, VERSION, "processed");
  mkdirSync(processedDir, { recursive: true });

  for (const file of files) {
    const rawPath = join(rawDir, file);
    const rawText = readFileSync(rawPath, "utf8");

    // 提取元数据（顶部四行注释）
    const urlMatch = rawText.match(/^> 来源：(.+)$/m);
    const pageIdMatch = rawText.match(/^> 页面 ID：(.+)$/m);
    const priorityMatch = rawText.match(/^> 优先级：(.+)$/m);
    const titleMatch = rawText.match(/^# (.+)$/);
    // DokuWiki 一级标题 ====== Title ======（优先于 slug 注入的 # tutorial_xxx）
    const dokuH1 = rawText.match(/^={6}\s*(.+?)\s*={6}\s*$/m);

    // 去掉元数据行后转 Markdown
    const contentWithoutMeta = rawText
      .replace(/^# [^\n]+\n/, "")
      .replace(/^> 来源：[^\n]+\n/, "")
      .replace(/^> 版本：[^\n]+\n/, "")
      .replace(/^> 页面 ID：[^\n]+\n/, "")
      .replace(/^> 优先级：[^\n]+\n/, "")
      .replace(/^> 抓取源：[^\n]+\n/, "")
      .replace(/^>\n/, "")
      .replace(/^\n+/, "");

    const markdown = wikiToMarkdown(contentWithoutMeta);
    const title = (() => {
      if (dokuH1?.[1]) return dokuH1[1].trim();
      // wikiToMarkdown 后可能变成 # Title
      const mdH1 = markdown.match(/^#\s+(.+)$/m);
      if (mdH1?.[1] && !/^tutorial[\s_-]/i.test(mdH1[1])) return mdH1[1].replace(/\s*\{#.*\}$/, "").trim();
      if (titleMatch?.[1] && !/^tutorial[\s_-]/i.test(titleMatch[1])) return titleMatch[1].trim();
      // slug → 可读：tutorial_items → Items
      const stem = file.replace(/\.txt$/, "").replace(/^tutorial[_-]?/i, "").replace(/[_-]+/g, " ").trim();
      return stem ? stem.replace(/\b\w/g, (c) => c.toUpperCase()) : file.replace(".txt", "");
    })();
    const url = urlMatch ? urlMatch[1].trim() : "";
    const pageId = pageIdMatch ? pageIdMatch[1].trim() : file;
    const priority = priorityMatch ? priorityMatch[1].trim() : "🟢";

    const sections = extractSectionSummaries(markdown);
    const firstPara = extractFirstParagraph(markdown);
    const keys = detectKeySections(markdown);
    const tags = inferTags(file, markdown);

    const id = `${VERSION}/${file.replace(".txt", "")}`;

    const l2Plus = generateL2Plus(markdown, keys);
    const processedFile = file.replace(".txt", ".md");
    writeFileSync(join(processedDir, processedFile), l2Plus, "utf8");

    l0.push({
      id, version: VERSION, label: title,
      url, tags: tags.tags, priority: tags.priority,
      sectionCount: sections.length,
    });

    l1.push({
      id, version: VERSION, label: title, url,
      tags: tags.tags, firstParagraph: firstPara,
      sections: sections.slice(0, 10),
    });

    l2.push({
      id, version: VERSION, label: title, url, tags: tags.tags,
      sections,
      hasCodeBlocks: markdown.includes("```"),
      codeBlockCount: countCodeFences(markdown),
      keySections: keys.length,
      file: processedFile,
      processedFile: `processed/${processedFile}`,
    });

    const tagStr = tags.tags.length ? `[${tags.tags.join(",")}]` : "";
    console.log(`  ✅ ${title} ${tagStr} (${sections.length}s, ${keys.length}k)`);
  }

  const versionDir = join(DATA_DIR, VERSION);
  const writeIndex = (name, data) =>
    writeFileSync(join(versionDir, name), JSON.stringify(data, null, 2), "utf8");

  l0.sort((a, b) => {
    const order = { "⭐": 0, "🟡": 1, "🟢": 2 };
    return (order[a.priority] ?? 3) - (order[b.priority] ?? 3);
  });

  writeIndex("index-l0.json", l0);
  writeIndex("index-l1.json", l1);
  writeIndex("index-l2.json", l2);
  console.log(`  📊 索引: l0(${l0.length}) l1(${l1.length}) l2(${l2.length})`);
}

// ── 入口 ─────────────────────────────────────────────────────────────────

processVersion();
console.log(`\n✅ process-fabric-wiki.js 完成（版本 ${VERSION}）`);
