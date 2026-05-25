#!/usr/bin/env node
/**
 * fetch-forge-docs.js
 * 爬取 Forge 官方文档指定章节，保存原始 Markdown。
 *
 * 使用：
 *   node scripts/fetch-forge-docs.js              # 爬取所有配置章节
 *   node scripts/fetch-forge-docs.js --version 1.20.1 --section registries
 *   node scripts/fetch-forge-docs.js --dry-run  # 仅列出 URL，不下载
 *
 * 文档结构（MkDocs 静态站）：
 *   https://docs.minecraftforge.net/en/{version}/{path}/
 *   内容文件通常为 .md，在同一路径下
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "..", "data", "forge-docs");
const MANIFEST = join(OUT_DIR, "_manifest.json");

// ── 配置：需要爬取的章节（版本 → 页面列表）───────────────────────────────
// 优先级：⭐ = 核心，🟡 = 常用，🟢 = 辅助
const CHAPTERS = {
  "1.20.1": [
    // Getting Started
    { path: "gettingstarted",             label: "Getting Started",      priority: "🟡" },
    { path: "gettingstarted/modfiles",    label: "The Mod Files",       priority: "🟡" },
    { path: "gettingstarted/structuring", label: "Structuring",          priority: "🟡" },
    { path: "gettingstarted/versioning",  label: "Versioning",          priority: "🟢" },
    // Core Concepts ⭐
    { path: "concepts/registries", label: "Registries",        priority: "⭐" },
    { path: "concepts/events",     label: "Events",            priority: "⭐" },
    { path: "concepts/sides",     label: "Sides",             priority: "⭐" },
    { path: "concepts/lifecycle", label: "Mod Lifecycle",      priority: "⭐" },
    { path: "concepts/resources", label: "Resources",          priority: "⭐" },
    { path: "concepts/internationalization", label: "Internationalization", priority: "🟢" },
    // Data Storage ⭐
    { path: "datastorage/capabilities", label: "Capabilities",  priority: "⭐" },
    { path: "datastorage/saveddata", label: "Saved Data",       priority: "🟡" },
    { path: "datastorage/codecs",   label: "Codecs",           priority: "🟢" },
    // Items & Blocks
    { path: "items/",              label: "Items",             priority: "🟡" },
    { path: "items/bewlr",        label: "BlockEntityWithoutLevelRenderer", priority: "🟢" },
    { path: "blocks/",            label: "Blocks",             priority: "🟡" },
    { path: "blocks/states",     label: "Block States",       priority: "🟢" },
    // Block Entities
    { path: "blockentities/",      label: "Block Entities",     priority: "🟡" },
    { path: "blockentities/ber", label: "BlockEntityRenderer", priority: "🟢" },
    // Entities
    // 注：Forge 1.20.1 文档中没有独立的 Entities 页面，相关内容在 Block Entities 中
    // Networking ⭐
    { path: "networking/",         label: "Networking",         priority: "⭐" },
    { path: "networking/simpleimpl", label: "SimpleImpl",     priority: "⭐" },
    { path: "networking/entities", label: "Synchronizing Entities", priority: "🟡" },
    // Game Effects
    { path: "gameeffects/particles", label: "Particles",       priority: "🟢" },
    { path: "gameeffects/sounds",   label: "Sounds",           priority: "🟢" },
    // Data Generation ⭐
    { path: "datagen/",             label: "Data Generation",   priority: "⭐" },
    { path: "datagen/client/modelproviders",  label: "Model Providers",    priority: "🟡" },
    { path: "datagen/client/localization",    label: "Language Providers",  priority: "🟡" },
    { path: "datagen/client/sounds",          label: "Sound Providers",     priority: "🟢" },
    { path: "datagen/server/recipes",         label: "Recipe Providers",    priority: "⭐" },
    { path: "datagen/server/loottables",     label: "Loot Table Providers", priority: "⭐" },
    { path: "datagen/server/tags",            label: "Tag Providers",      priority: "⭐" },
    { path: "datagen/server/advancements",    label: "Advancement Providers", priority: "🟡" },
    { path: "datagen/server/glm",             label: "GLM Providers",       priority: "🟢" },
    { path: "datagen/server/datapackregistries", label: "Datapack Registry", priority: "🟢" },
    // Resources
    { path: "resources/client/",   label: "Client Assets",      priority: "🟡" },
    { path: "resources/client/models/",    label: "Models",      priority: "🟡" },
    { path: "resources/client/models/tinting", label: "Texture Tinting", priority: "🟢" },
    { path: "resources/client/models/itemproperties", label: "Item Properties", priority: "🟢" },
    { path: "resources/server/",   label: "Server Data",        priority: "🟡" },
    { path: "resources/server/recipes/",     label: "Recipes",   priority: "🟡" },
    { path: "resources/server/recipes/ingredients",   label: "Ingredients",       priority: "🟢" },
    { path: "resources/server/recipes/incode",      label: "Non-Datapack Recipes", priority: "🟢" },
    { path: "resources/server/loottables/", label: "Loot Tables", priority: "🟡" },
    { path: "resources/server/glm/",         label: "Global Loot Modifiers", priority: "🟢" },
    { path: "resources/server/tags/",         label: "Tags",     priority: "🟡" },
    { path: "resources/server/advancements/", label: "Advancements", priority: "🟢" },
    { path: "resources/server/conditional/",  label: "Conditionally-Loaded Data", priority: "🟢" },
    // GUI
    { path: "gui/menus/",         label: "Menus",              priority: "🟢" },
    { path: "gui/screens/",       label: "Screens",            priority: "🟢" },
    // Rendering
    { path: "rendering/modelextensions/transforms",   label: "Root Transforms",   priority: "🟢" },
    { path: "rendering/modelextensions/rendertypes", label: "Render Types",      priority: "🟢" },
    { path: "rendering/modelextensions/visibility",  label: "Part Visibility",    priority: "🟢" },
    { path: "rendering/modelextensions/facedata",   label: "Face Data",         priority: "🟢" },
    { path: "rendering/modelloaders",            label: "Model Loaders",      priority: "🟢" },
    { path: "rendering/modelloaders/bakedmodel",  label: "Baked Model",       priority: "🟢" },
    { path: "rendering/modelloaders/transform",    label: "Model Transform",    priority: "🟢" },
    { path: "rendering/modelloaders/itemoverrides", label: "Item Overrides",    priority: "🟢" },
    // Misc
    { path: "misc/config/",       label: "Configuration",      priority: "🟢" },
    { path: "misc/keymappings/",  label: "Key Mappings",       priority: "🟢" },
    { path: "misc/gametest/",    label: "Game Tests",         priority: "🟢" },
    { path: "misc/updatechecker",   label: "Forge Update Checker",  priority: "🟢" },
    { path: "misc/debugprofiler",   label: "Debug Profiler",         priority: "🟢" },
    // Advanced
    { path: "advanced/accesstransformers", label: "Access Transformers", priority: "🟢" },
    // Forge Dev
    { path: "forgedev",              label: "Contributing to Forge",  priority: "🟢" },
    { path: "forgedev/prguidelines",  label: "Pull Request Guidelines", priority: "🟢" },
    // Contributing to Docs
    { path: "contributing",           label: "Contributing to Docs",  priority: "🟢" },
    // Legacy
    { path: "legacy/",            label: "Legacy",             priority: "🟢" },
    { path: "legacy/porting/",    label: "Porting",            priority: "🟢" },
  ],
  // 未来可扩展其他版本
};

// ── CLI 参数解析 ────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const versionArg = args.find(a => a.startsWith("--version="))?.split("=")[1];
const sectionArg = args.find(a => a.startsWith("--section="))?.split("=")[1];

// ── 标签预测（dry-run 用）───────────────────────────────────────────────

const TAG_MAP = {
  registries: "registry", registry: "registry",
  events: "event", event: "event",
  sides: "sides", side: "sides",
  lifecycle: "lifecycle",
  resources: "resources",
  internationalization: "i18n",
  capabilities: "capability", capability: "capability",
  saveddata: "saveddata", saved_data: "saveddata",
  codecs: "codecs",
  items: "item", item: "item",
  blocks: "block", block: "block",
  blockentities: "blockentity", blockentity: "blockentity",
  entities: "entity", entity: "entity",
  networking: "networking", network: "networking",
  simpleimpl: "networking",
  particles: "particles",
  sounds: "sounds",
  datagen: "datagen",
  modelproviders: "datagen",
  localization: "datagen",
  recipes: "recipe", recipe: "recipe",
  loottables: "loot", loot: "loot",
  tags: "tag", tag: "tag",
  advancements: "advancement",
  glm: "glm",
  rendering: "rendering",
  config: "config",
  screens: "gui", gui: "gui", menus: "gui",
  gametest: "tests",
  keymappings: "input",
  accesstransformers: "advanced",
  versioning: "meta",
  structuring: "meta",
  modfiles: "meta",
  gettingstarted: "meta", getting: "meta",
  updatechecker: "updatechecker",
  legacy: "legacy",
  porting: "porting",
};

function predictTags(path) {
  const parts = path.toLowerCase().replace(/[^a-z0-9\/]/g, "/").split("/").filter(Boolean);
  const tags = new Set();
  for (const part of parts) {
    const mapped = TAG_MAP[part];
    if (mapped) tags.add(mapped);
  }
  // 从路径片段直接提取有意义的标签
  for (const part of parts) {
    if (["client", "server"].includes(part)) tags.add(part);
  }
  return [...tags];
}

/**
 * 爬取 URL，返回 { ok, status, content }
 * 使用 Node.js 内置 https（避免外部依赖）
 */
async function fetchUrl(url, retries = 2) {
  const https = await import("node:https");
  const http = await import("node:http");

  return new Promise((resolve) => {
    const mod = url.startsWith("https") ? https : http;
    const doReq = () => {
      mod.get(url, { headers: { "User-Agent": "MC-Forge-Docs-Fetcher/1.0" } }, (res) => {
        if (res.statusCode === 301 || res.statusCode === 302) {
          const location = new URL(res.headers.location, url).href;
          mod.get(location, { headers: { "User-Agent": "MC-Forge-Docs-Fetcher/1.0" } }, resolveRedirect);
          return;
        }
        resolveRedirect(res);
      }).on("error", (err) => {
        if (retries > 0) {
          setTimeout(() => fetchUrl(url, retries - 1).then(resolve), 1000);
        } else {
          resolve({ ok: false, status: 0, content: "", error: err.message });
        }
      });
    };

    function resolveRedirect(res) {
      const chunks = [];
      res.on("data", c => chunks.push(c));
      res.on("end", () => {
        const content = Buffer.concat(chunks).toString("utf8");
        resolve({ ok: res.statusCode === 200, status: res.statusCode, content });
      });
    }

    doReq();
  });
}

// ── 核心爬取逻辑 ────────────────────────────────────────────────────────

function buildUrl(version, path) {
  // 去掉首尾斜杠，统一处理
  const clean = path.replace(/^\/|\/$/g, "");
  return `https://docs.minecraftforge.net/en/${version}/${clean}`;
}

async function fetchPage(version, chapter) {
  const baseUrl = buildUrl(version, chapter.path);
  const { ok, status, content, error } = await fetchUrl(baseUrl);

  if (!ok) {
    return { chapter, ok: false, status, error };
  }

  // 尝试从 HTML 中提取 Markdown 内容
  // Forge 文档站使用 MkDocs，内容嵌入在特定容器中
  const markdown = extractMarkdown(content, baseUrl);

  return { chapter, ok: true, markdown, url: baseUrl };
}

function extractMarkdown(html, url) {
  let text = html;

  // 去除 <nav>, <header>, <footer>, <aside> 等导航元素
  text = text.replace(/<nav[\s\S]*?<\/nav>/gi, "");
  text = text.replace(/<header[\s\S]*?<\/header>/gi, "");
  text = text.replace(/<footer[\s\S]*?<\/footer>/gi, "");
  text = text.replace(/<aside[\s\S]*?<\/aside>/gi, "");

  // 去除侧边栏
  text = text.replace(/<div class="md-sidebar[\s\S]*?<\/div>/gi, "");

  // 去除顶部导航栏
  text = text.replace(/<div class="md-header[\s\S]*?<\/div>/gi, "");
  text = text.replace(/<div class="md-nav[\s\S]*?<\/div>/gi, "");

  // 去除面包屑
  text = text.replace(/<nav class="md-breadcrumb[\s\S]*?<\/nav>/gi, "");

  // 去除"编辑此页"链接
  text = text.replace(/<a class="md-content__[\s\S]*?<\/a>/gi, "");

  // ── 去除 MkDocs "Permanent link" 标签 ────────────────────────────────
  // MkDocs 在每个标题后插入 <a class="headerlink" href="#..." title="...">
  // 这会混入标题文本，必须在 HTML → Markdown 转换前清除
  text = text.replace(/<a[^>]*class="headerlink"[^>]*>.*?<\/a>/gi, "");

  // ── MkDocs admonition 转换 ───────────────────────────────────────────
  // Forge 大量使用 !!! note / !!! warning 等 MkDocs 语法，HTML 结构为：
  //   <div class="admonition note">
  //     <p class="title">Note</p>
  //     <p>内容...</p>
  //   </div>
  // 转换为 Markdown blockquote: > **Note**: 内容
  text = convertAdmonitions(text);

  // 如果 HTML 中包含 <article>，提取其中内容
  const articleMatch = text.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
  if (articleMatch) {
    text = articleMatch[1];
  }

  // 尝试直接使用 <main>
  if (!text.includes("<article") && !text.includes("<main")) {
    const mainMatch = text.match(/<main[^>]*>([\s\S]*)<\/main>/i);
    if (mainMatch) text = mainMatch[1];
  }

  // 去除内部样式和脚本
  text = text.replace(/<style[\s\S]*?<\/style>/gi, "");
  text = text.replace(/<script[\s\S]*?<\/script>/gi, "");

  // 将剩余 HTML 标签转为 Markdown
  text = htmlToMd(text);

  // 去除多余空行
  text = text.replace(/\n{3,}/g, "\n\n");

  // 去除首尾空白
  text = text.trim();

  return text;
}

/**
 * 将 MkDocs admonition HTML 结构转换为 Markdown blockquote。
 * 支持：note, warning, important, tip, caution, danger, attention
 */
function convertAdmonitions(html) {
  const types = ["note", "warning", "important", "tip", "caution", "danger", "attention"];

  for (const type of types) {
    // 匹配 <div class="admonition note"> 或 <div class="admonition note open">
    const regex = new RegExp(
      `<div[^>]*class="[^"]*admonition\\s+${type}[^"]*"[^>]*>([\\s\\S]*?)</div>`,
      "gi"
    );
    html = html.replace(regex, (_, inner) => {
      // 提取标题（<p class="title"> 或 <p><strong>）
      const titleMatch = inner.match(/<(?:p|strong)[^>]*class="title"[^>]*>([\s\S]*?)<\/(?:p|strong)>/i) ||
                         inner.match(/<p[^>]*><strong>([\s\S]*?)<\/strong>/i);
      const title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, "").trim() : type.charAt(0).toUpperCase() + type.slice(1);

      // 提取正文（去掉标题段落）
      let body = inner
        .replace(/<(?:p|strong)[^>]*class="title"[^>]*>[\s\S]*?<\/(?:p|strong)>/gi, "")
        .replace(/<p[^>]*><strong>[\s\S]*?<\/strong><\/p>/gi, "");

      // 清理残留标签并处理换行
      body = body
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<p[^>]*>/gi, "")
        .replace(/<\/p>/gi, "\n")
        .replace(/<[^>]+>/g, "")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&nbsp;/g, " ")
        .split("\n")
        .map(l => l.trim())
        .filter(l => l)
        .join(" ");

      return `\n> **${title}**: ${body}\n`;
    });
  }

  return html;
}

/**
 * 自动检测代码块语言并补全 ``` 后缀。
 * 检测策略：
 *   - Java: package, import, @Mod, public class, extends, implements
 *   - Gradle/Groovy: plugins, repositories, dependencies, apply plugin
 *   - JSON: "pack.mcmeta", "forge", "version"
 *   - TOML: mods.toml section
 *   - XML: <mods>, <mod>, <?xml
 *   - JavaScript/JSON for resources: "model", "parent", "textures"
 */
function detectCodeLanguage(code) {
  const trimmed = code.trim();
  if (!trimmed) return "";

  // Java
  if (
    /^(package|import)\s+/.test(trimmed) ||
    /@(Mod|Mod\.B|SubscribeEvent|OnlyIn)\b/.test(trimmed) ||
    /^public\s+(class|interface|enum|abstract)\s+/.test(trimmed) ||
    /^private\s+(static\s+)?(?:final\s+)?(?:final\s+)?(?:RegistryObject|DeferredRegister)/.test(trimmed)
  ) {
    return "java";
  }

  // Gradle / Groovy
  if (
    /^(plugins|repositories|dependencies|sourceSets|jar|artifacts)\s*\{/.test(trimmed) ||
    /^(apply|include)\s+plugin/.test(trimmed) ||
    /^(minecraft|forge|mixins|loom)\s*\{/.test(trimmed) ||
    /^version\s*=/.test(trimmed) ||
    /^group\s*=/.test(trimmed) ||
    /forgegradle/i.test(trimmed)
  ) {
    return "gradle";
  }

  // JSON
  if (
    /^\s*\{[\s\S]*\}\s*$/.test(trimmed) &&
    (/"(pack|forge|minecraft|version|id|author)"/.test(trimmed) ||
     /^\s*\{/.test(trimmed))
  ) {
    return "json";
  }

  // TOML
  if (/^\[.+\]/.test(trimmed) || /^[a-zA-Z_]+\s*=/.test(trimmed)) {
    return "toml";
  }

  // XML
  if (/<(!|)\??xml/.test(trimmed) || /<(mods|mod|dependencies)/.test(trimmed)) {
    return "xml";
  }

  // MCMETA files (blockstates, item models, etc.)
  if (
    /"model"|"parent"|"textures"|"multipart"|"variants"/.test(trimmed) &&
    /:/.test(trimmed)
  ) {
    return "json";
  }

  return "";
}

function htmlToMd(html) {
  // 简单 HTML → Markdown 转换（覆盖 Forge 文档常用标签）
  let text = html;

  // 预处理：合并相邻文本节点
  // h1-h6
  for (let i = 1; i <= 6; i++) {
    text = text.replace(new RegExp(`<h${i}(?:[^>]*)>([\\s\\S]*?)</h${i}>`, "gi"), (_, inner) => {
      const cleaned = cleanInner(inner);
      return `\n${"#".repeat(i)} ${cleaned}\n`;
    });
  }

  // 代码块 (pre/code)
  text = text.replace(/<pre[^>]*>([\s\S]*?)<\/pre>/gi, (_, inner) => {
    const code = inner.replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, "$1");
    const stripped = stripTags(code);
    const lang = detectCodeLanguage(stripped);
    const langTag = lang ? lang : "";
    return `\n\`\`\`${langTag}\n${stripped.trim()}\n\`\`\`\n`;
  });

  // 行内代码
  text = text.replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, "`$1`");

  // 链接
  text = text.replace(/<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, "[$2]($1)");

  // 强调和加粗
  text = text.replace(/<strong>([\s\S]*?)<\/strong>/gi, "**$1**");
  text = text.replace(/<b>([\s\S]*?)<\/b>/gi, "**$1**");
  text = text.replace(/<em>([\s\S]*?)<\/em>/gi, "_*${1}_");
  text = text.replace(/<i>([\s\S]*?)<\/i>/gi, "_*$1*_");

  // 列表
  text = text.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (_, inner) => {
    return inner.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (__, item) => `- ${cleanInner(item)}`).trim();
  });
  text = text.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (_, inner) => {
    let idx = 0;
    return inner.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (__, item) => `${++idx}. ${cleanInner(item)}`).trim();
  });

  // 表格
  text = text.replace(/<table[^>]*>([\s\S]*?)<\/table>/gi, (_, inner) => {
    const rows = [];
    inner.replace(/<tr[^>]*>([\s\S]*?)<\/tr>/gi, (_, rowInner) => {
      const cells = [];
      rowInner.replace(/<(?:th|td)[^>]*>([\s\S]*?)<\/(?:th|td)>/gi, (__, cell) => {
        cells.push(cleanInner(cell).replace(/\n/g, " ").trim());
      });
      if (cells.length) rows.push(cells);
    });
    if (rows.length < 2) return rows.map(r => r.join(" | ")).join("\n");
    const header = rows[0];
    const sep = header.map(() => "---");
    const body = rows.slice(1);
    return [header.join(" | "), sep.join(" | "), ...body.map(r => r.join(" | "))].join("\n");
  });

  // 块引用
  text = text.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (_, inner) => {
    return cleanInner(inner).split("\n").map(l => `> ${l}`).join("\n");
  });

  // 换行
  text = text.replace(/<br\s*\/?>/gi, "\n");

  // 水平线
  text = text.replace(/<hr\s*\/?>/gi, "\n---\n");

  // 段落
  text = text.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, (_, inner) => `\n${cleanInner(inner).trim()}\n`);

  // 去除剩余 HTML 标签
  text = stripTags(text);

  // 转义代码块外的反引号（避免破坏 Markdown）
  // 但保留已处理的行内代码

  return text;
}

function cleanInner(inner) {
  return stripTags(inner).replace(/\n{2,}/g, " ").replace(/\s+/g, " ").trim();
}

function stripTags(html) {
  return html
    .replace(/<[^>]+>/g, (m) => m.startsWith("</") ? "" : m)
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .trim();
}

// ── 主流程 ──────────────────────────────────────────────────────────────

async function main() {
  const versions = versionArg ? [versionArg] : Object.keys(CHAPTERS);
  const manifest = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, "utf-8")) : {};
  const results = [];

  for (const version of versions) {
    if (!CHAPTERS[version]) {
      console.error(`❌ 未知版本: ${version}`);
      continue;
    }

    const chapters = sectionArg
      ? CHAPTERS[version].filter(c => c.path.includes(sectionArg))
      : CHAPTERS[version];

    if (chapters.length === 0) {
      console.error(`❌ 未找到匹配章节: ${sectionArg}`);
      continue;
    }

    console.log(`\n📦 版本 ${version}：准备爬取 ${chapters.length} 个页面`);

    const versionDir = join(OUT_DIR, version, "raw");
    if (!existsSync(versionDir)) mkdirSync(versionDir, { recursive: true });

    for (const chapter of chapters) {
      const url = buildUrl(version, chapter.path);

      if (dryRun) {
        const tags = predictTags(chapter.path);
        console.log(`  [DRY] ${chapter.priority} ${url}  |  预测标签: ${tags.join(", ") || "无"}`);
        results.push({ version, chapter, ok: null, url, predictedTags: tags });
        continue;
      }

      process.stdout.write(`  ⏳ ${chapter.priority} ${chapter.label}... `);

      const { ok, markdown, status, error } = await fetchPage(version, chapter);

      if (ok && markdown && markdown.length > 200) {
        // 保存文件：路径 → 文件名（将路径中的 / 转为 _）
        const filename = chapter.path.replace(/\//g, "_").replace(/^_/, "").replace(/_$/, "") + ".md";
        const filepath = join(versionDir, filename);
        writeFileSync(filepath, `# ${chapter.label}\n\n> 来源：${url}\n> 版本：${version}\n\n${markdown}`, "utf-8");

        // 更新 manifest
        manifest[`${version}/${chapter.path}`] = {
          label: chapter.label,
          priority: chapter.priority,
          url,
          file: filename,
          fetchedAt: new Date().toISOString(),
          size: markdown.length,
        };

        console.log(`✅ ${(markdown.length / 1024).toFixed(1)}KB`);
        results.push({ version, chapter, ok: true, url, size: markdown.length });
      } else {
        console.log(`❌ ${error || `HTTP ${status} 或内容过短 (${markdown?.length || 0} chars)`}`);
        results.push({ version, chapter, ok: false, url, error: error || `HTTP ${status}` });
      }

      // 礼貌延迟，避免被限流
      await new Promise(r => setTimeout(r, 300));
    }
  }

  // 保存 manifest
  if (!dryRun) {
    writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2), "utf-8");
  }

  // 总结
  const fetched = results.filter(r => r.ok === true).length;
  const failed = results.filter(r => r.ok === false).length;
  console.log(`\n${dryRun ? "🌐" : "📊"} 完成：${fetched} 成功，${failed} 失败`);
  if (dryRun) console.log("  （使用 --dry-run，跳过实际下载）");
}

main().catch(console.error);
