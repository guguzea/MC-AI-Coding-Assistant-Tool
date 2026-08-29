#!/usr/bin/env node
/**
 * fetch-forge-javadoc.js
 * 抓取 ForgeJavaDocs Javadoc 存档（1.7.10–1.12.2），解析为结构化 Markdown。
 *
 * 数据源：https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/{mcVersion}-{forgeVersion}/
 *
 * 使用：
 *   node scripts/fetch-forge-javadoc.js                    # 抓取所有版本
 *   node scripts/fetch-forge-javadoc.js --version 1.12.2  # 抓取指定版本
 *   node scripts/fetch-forge-javadoc.js --dry-run       # 仅列出 URL
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "..", "..", "data", "forge_javadoc");
const MANIFEST_PATH = join(__dirname, "..", "..", "data", "forge-versions-manifest.json");

// ── 版本配置（从 probe-forge-versions.js 生成）───────────────────────

const JAVADOC_VERSIONS = [
  { mcVersion: "1.7.10",  forgeVersion: "10.13.4.1614",  url: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/" },
  { mcVersion: "1.8.9",   forgeVersion: "11.15.1.2318", url: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/" },
  { mcVersion: "1.9.4",   forgeVersion: "12.17.0.2051", url: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/" },
  { mcVersion: "1.10.2",  forgeVersion: "12.18.3.2185", url: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/" },
  { mcVersion: "1.11.2",  forgeVersion: "13.20.0.2228", url: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/" },
  { mcVersion: "1.12.2",  forgeVersion: "14.23.5.2859", url: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/" },
];

// ── HTTP 工具 ─────────────────────────────────────────────────────────

const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "MC-Forge-Javadoc-Fetcher/1.0 (+https://github.com/)",
];
let uaIndex = 0;
function nextUA() { return USER_AGENTS[uaIndex++ % USER_AGENTS.length]; }

/** 网络超时（ms）。无超时的 https.get 会永久挂起，卡死整个抓取流程。 */
const FETCH_TIMEOUT_MS = 30_000;

async function fetchUrl(url, retries = 3) {
  const https = await import("node:https");
  let currentUrl = url;

  for (let attempt = 0; attempt < retries; attempt++) {
    if (attempt > 0) await new Promise(r => setTimeout(r, 1000 * attempt));
    const headers = { "User-Agent": nextUA() };

    let r;
    try {
      r = await new Promise((resolve, reject) => {
        let settled = false;
        let req;
        const timer = setTimeout(() => {
          if (!settled) req?.destroy(new Error(`请求超时（${FETCH_TIMEOUT_MS}ms）: ${currentUrl}`));
        }, FETCH_TIMEOUT_MS);
        const done = (fn, value) => {
          if (settled) return;
          settled = true;
          clearTimeout(timer);
          fn(value);
        };
        req = https.get(currentUrl, { headers }, (httpRes) => {
          const chunks = [];
          httpRes.on("data", c => chunks.push(c));
          httpRes.on("end", () => done(resolve, {
            status: httpRes.statusCode,
            location: httpRes.headers.location || "",
            body: Buffer.concat(chunks).toString("utf8")
          }));
        });
        req.on("error", (e) => done(reject, e));
      });
    } catch (e) { continue; }

    if (r.status >= 300 && r.status < 400 && r.location) {
      currentUrl = new URL(r.location, currentUrl).href;
      continue;
    }
    return { ok: r.status === 200, status: r.status, content: r.body, finalUrl: currentUrl };
  }
  return { ok: false, status: -1, content: "", error: "All retries failed" };
}

// ── HTML 解析（Cheerio + fallback）────────────────────────────────────

/**
 * Javadoc class 页面解析。
 * 返回结构化的方法/字段/构造函数列表。
 *
 * HTML 结构（Oracle 标准 Javadoc）：
 * - <div class="description"> 主类描述
 * - <pre class="methodSignature"> 方法签名
 * - <dt> 字段名 + 描述
 * - <dd> 字段描述
 */
function parseClassPage(html) {
  // 方法签名：<pre class="memberSignatures">... 或 <pre class="methodSignature">
  const methodSigs = [];
  const sigMatches = html.match(/<pre[^>]*class="[^"]*(?:memberSignatures|methodSignature)[^"]*"[^>]*>([\s\S]*?)<\/pre>/gi) || [];
  for (const block of sigMatches) {
    // 提取方法名和签名文本
    const sigText = block.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    const nameMatch = sigText.match(/(?:void|int|boolean|String|Object|Class|List|Map|<[^>]+>|[\w.]+)\s+(\w+)\s*\(/);
    const name = nameMatch ? nameMatch[1] : sigText.slice(0, 80);
    methodSigs.push({ raw: block, text: sigText, name });
  }

  // 字段：<dt>...<code>fieldName</code>...
  const fields = [];
  const dtMatches = html.match(/<dt[^>]*>([\s\S]*?)<\/dt>/gi) || [];
  for (const dt of dtMatches) {
    const codeMatch = dt.match(/<code[^>]*>([^<]+)<\/code>/);
    const descMatch = dt.match(/<\/code>([\s\S]*?)(?=<dt|<div class="notes"|<\/dl>|$)/i);
    if (codeMatch) {
      fields.push({
        name: codeMatch[1].trim(),
        desc: descMatch ? descMatch[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 200) : ""
      });
    }
  }

  // 类描述：<div class="description">
  let description = "";
  const descMatch = html.match(/<div[^>]*class="[^"]*description[^"]*"[^>]*>([\s\S]*?)<div[^>]*class="[^"]*(?:deprecation|notes)[^"]*"/i);
  if (descMatch) {
    description = descMatch[1]
      .replace(/<[^>]+>/g, " ")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&")
      .replace(/&nbsp;/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  // 继承树
  let inheritance = "";
  const inhMatch = html.match(/<li[^>]*class="inheritance"[^>]*>([\s\S]*?)<\/li>/i);
  if (inhMatch) {
    inheritance = inhMatch[1].replace(/<[^>]+>/g, " > ").replace(/\s*>\s*/g, " > ").replace(/\s+/g, " ").trim();
  }

  return { description, methodSigs, fields, inheritance };
}

/**
 * Javadoc overview-summary 页面解析。
 * 返回所有包名（如 net/minecraft/block 或 cpw/mods/fml/common）。
 *
 * 重要：Forge 1.7.10 的核心 API 包名前缀是 `cpw.mods.fml.*`（cpw = ChickenBones/Forge 早期命名空间），
 * 1.8.9+ 才迁移到 `net.minecraftforge.*`。两者都需要保留。
 */
function parsePackageList(html) {
  const packages = [];
  // 匹配包概述页链接：href="net/.../package-summary.html" 或 href="cpw/.../package-summary.html"
  const regex = /<a[^>]+href="((?:net|cpw)\/[^"?#]+)\/package-summary\.html"/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    packages.push(match[1]);
  }
  return [...new Set(packages)]; // 去重
}

/**
 * Javadoc package-summary 页面解析。
 * 返回包内所有类的链接和类名。
 *
 * HTML 结构：
 * <td class="colFirst"><a href="../../../net/minecraft/block/Block.html" title="class in net.minecraft.block">Block</a></td>
 *
 * href 格式：../../../net/minecraft/block/ClassName.html
 * 标准化后：net/minecraft/block/ClassName.html
 * 拼接：javadocRoot + relPath
 */
function parsePackageSummary(html, pkgSummaryUrl) {
  const classes = [];

  // 提取所有 href 属性值
  const hrefValues = html.match(/href="([^"]+)"/g) || [];
  for (const raw of hrefValues) {
    let href = raw.slice(6, -1);

    // 跳过导航链接
    if (href.includes('package-summary')) continue;
    if (href.includes('overview-summary')) continue;
    if (href.includes('index-all')) continue;
    if (href.includes('deprecated-list')) continue;
    if (href.startsWith('#')) continue;
    // 同时支持 net/ 和 cpw/（1.7.10 核心包在 cpw.mods.fml.* 下）
    if (!href.includes('net/') && !href.includes('cpw/')) continue;

    // 用 URL 正确解析相对路径（避免手动 replace 的双重路径问题）
    const absUrl = new URL(href, pkgSummaryUrl).href;

    // 提取类名
    const className = absUrl.split('/').pop().replace(/\.html$/, '');
    if (!/^[A-Z]/.test(className)) continue;

    classes.push({ name: className, absUrl });
  }

  return classes;
}

/**
 * 将 class 页面 HTML 转换为 Markdown。
 */
function htmlToMarkdown(className, packageName, parsed, version, classUrl) {
  const lines = [];
  lines.push("---");
  lines.push(`title: "${className}"`);
  lines.push(`description: "${parsed.description.slice(0, 200).replace(/"/g, '\\"')}"`);
  lines.push(`package: "${packageName}"`);
  lines.push(`version: "${version}"`);
  lines.push(`source: "${classUrl}"`);
  lines.push(`sourceType: javadoc`);
  lines.push("---");
  lines.push("");
  lines.push(`# ${className}`);
  lines.push("");
  if (parsed.inheritance) {
    lines.push(`**Inheritance:** ${parsed.inheritance}`);
    lines.push("");
  }
  if (parsed.description) {
    lines.push(parsed.description);
    lines.push("");
  }
  if (parsed.fields.length > 0) {
    lines.push("## Fields");
    lines.push("");
    for (const f of parsed.fields.slice(0, 30)) {
      lines.push(`- \`${f.name}\` — ${f.desc}`);
    }
    lines.push("");
  }
  if (parsed.methodSigs.length > 0) {
    lines.push("## Methods");
    lines.push("");
    for (const m of parsed.methodSigs.slice(0, 50)) {
      lines.push(`\`\`\`java`);
      lines.push(m.text);
      lines.push(`\`\`\``);
      lines.push("");
    }
  }
  return lines.join("\n");
}

// ── 主流程 ─────────────────────────────────────────────────────────────

async function fetchVersion(version, force) {
  const baseUrl = version.url;
  const mcVer = version.mcVersion;
  const forgeVer = version.forgeVersion;
  const outVersionDir = join(OUT_DIR, mcVer);
  const rawDir = join(outVersionDir, "raw");
  const processedDir = join(outVersionDir, "processed");
  if (!existsSync(rawDir)) mkdirSync(rawDir, { recursive: true });

  console.log(`\n📦 抓取 ${mcVer} (Forge ${forgeVer})`);

  // 1. 获取 overview-summary.html → 解析包列表
  process.stdout.write("  📄 overview-summary... ");
  const { ok, content: overviewHtml } = await fetchUrl(`${baseUrl}overview-summary.html`);
  if (!ok) { console.log("❌ 失败"); return; }
  console.log(`✅ ${overviewHtml.length}B`);

  const packages = parsePackageList(overviewHtml);
  console.log(`  📦 ${packages.length} 个包`);

  // 2. 遍历每个包，抓取 package-summary.html → 解析类列表
  let totalClasses = 0, fetched = 0, failed = 0;
  for (const pkg of packages) {
    const pkgSummaryUrl = `${baseUrl}${pkg}/package-summary.html`;
    process.stdout.write(`  📄 ${pkg}... `);

    const { ok: pkgOk, content: pkgHtml } = await fetchUrl(pkgSummaryUrl);
    if (!pkgOk) { console.log("❌"); failed++; await new Promise(r => setTimeout(r, 200)); continue; }

    const classes = parsePackageSummary(pkgHtml, pkgSummaryUrl);
    totalClasses += classes.length;
    console.log(`${classes.length} 类`);

    // 3. 抓取每个类的页面
    const pkgDir = join(rawDir, pkg);
    if (!existsSync(pkgDir)) mkdirSync(pkgDir, { recursive: true });

    for (const cls of classes) {
      const classUrl = cls.absUrl;
      const fileName = cls.name + ".md";
      const filePath = join(pkgDir, fileName);

      if (existsSync(filePath) && !force) {
        fetched++;
        continue;
      }

      process.stdout.write(`    📄 ${cls.name}... `);
      const { ok: clsOk, content: classHtml } = await fetchUrl(classUrl);
      if (!clsOk) { console.log("❌"); await new Promise(r => setTimeout(r, 200)); continue; }

      const parsed = parseClassPage(classHtml);
      const markdown = htmlToMarkdown(cls.name, pkg, parsed, mcVer, classUrl);
      writeFileSync(filePath, markdown, "utf-8");
      fetched++;
      console.log(`✅ (${parsed.methodSigs.length}m ${parsed.fields.length}f)`);
      await new Promise(r => setTimeout(r, 100));
    }

    await new Promise(r => setTimeout(r, 200));
  }

  console.log(`  ✅ 完成：${totalClasses} 类 / ${fetched} 成功，${failed} 包失败`);
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const force = args.includes("--force");

  const targetVer = args.find(a => a.startsWith("--version="))?.split("=")[1];

  const versions = targetVer
    ? JAVADOC_VERSIONS.filter(v => v.mcVersion === targetVer)
    : JAVADOC_VERSIONS;

  if (versions.length === 0) {
    console.error(`❌ 未找到版本 ${targetVer}，可用版本：${JAVADOC_VERSIONS.map(v => v.mcVersion).join(", ")}`);
    return;
  }

  if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

  if (dryRun) {
    console.log("🔍 dry-run：列出将要抓取的内容");
    for (const v of versions) {
      console.log(`\n${v.mcVersion} (${v.forgeVersion}): ${v.url}`);
    }
    return;
  }

  for (const v of versions) {
    await fetchVersion(v, force);
  }

  console.log("\n✅ 全部完成！");
}

main().catch(console.error);
