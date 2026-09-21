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
import { fileURLToPath, pathToFileURL } from "url";

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
export function parsePackageSummary(html, pkgSummaryUrl) {
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
    const parsedUrl = new URL(href, pkgSummaryUrl);
    // 成员锚点不是类页：`GuiScreen.html#height` 曾被当成一个「类」抓下来，
    // 于是同一个类页按成员链接重复落盘几十遍（1.10.2–1.12.2 各 20+ 篇，文件名里带 .html#）。
    if (parsedUrl.hash || !parsedUrl.pathname.endsWith(".html")) continue;
    const absUrl = parsedUrl.href;

    // 提取类名
    const className = parsedUrl.pathname.split('/').pop().replace(/\.html$/, '');
    if (!/^[A-Z]/.test(className)) continue;

    classes.push({ name: className, absUrl });
  }

  return classes;
}

// ── 落盘计划（F123 根因侧修复）────────────────────────────────────────
//
// 抓取器把每个类页写成 `raw/<pkg>/<ClassName>.md`，两件事会悄悄产出重复条目：
//   1. Javadoc 的 package-summary 允许同一个类页出现多次（类表 + 「See also」等），
//      同一 URL 被写两遍 ⇒ 盘上出现 `Foo.md` 与 `Foo (2).md` 两份**逐字节相同**的文件；
//   2. 两个只差大小写的类名（`Foo` / `foo`）落在大小写不敏感的卷上（Windows / macOS 默认）
//      ⇒ 第二次 `writeFileSync` 直接覆盖第一个，索引里两条 entry 指向同一份正文。
// `planClassWrites` 把这两种情况在**写盘前**摊开：同 URL 去重、异 URL 同名冲突改成
// 确定性后缀并存，并把冲突记进台账。后缀是纯 ASCII 定长片段（不是 ` (2)`，
// 空格 + 括号正是历史上那批文件的来源形态），且总长受控在 Windows 255 之内。
const MAX_BASENAME = 120;

function shortHash(text) {
  let h = 5381;
  for (let i = 0; i < text.length; i++) h = ((h << 5) + h + text.charCodeAt(i)) | 0;
  return (h >>> 0).toString(36).slice(0, 6);
}

/** @param {{name:string, absUrl:string}[]} classes @returns {{writes:{name:string,fileName:string,absUrl:string}[], conflicts:object[]}} */
export function planClassWrites(classes) {
  const writes = [];
  const conflicts = [];
  const seenUrl = new Set();
  /** 小写名 → 已占用的写盘名（用于检测大小写碰撞） */
  const taken = new Map();

  for (const cls of classes) {
    if (seenUrl.has(cls.absUrl)) continue; // 同一页在同一份清单里出现两次
    seenUrl.add(cls.absUrl);

    const key = cls.name.toLowerCase();
    const owner = taken.get(key);
    let fileName;
    if (!owner) {
      fileName = cls.name + ".md";
    } else {
      // 不同 URL 抢同一个大小写不敏感的文件名：给后来者一个确定性后缀，
      // 两条都保住，不再静默覆盖（旧行为在大小写不敏感卷上会丢整页）。
      const suffix = "~" + shortHash(cls.absUrl);
      const base = cls.name.length + suffix.length > MAX_BASENAME
        ? cls.name.slice(0, Math.max(1, MAX_BASENAME - suffix.length))
        : cls.name;
      fileName = base + suffix + ".md";
      conflicts.push({
        package: cls.absUrl.slice(0, cls.absUrl.lastIndexOf("/")),
        kept: owner.fileName,
        keptUrl: owner.absUrl,
        renamedTo: fileName,
        renamedUrl: cls.absUrl,
        reason: "case-insensitive-name-collision",
      });
    }
    taken.set(key, { fileName, absUrl: cls.absUrl });
    writes.push({ name: cls.name, fileName, absUrl: cls.absUrl });
  }

  return { writes, conflicts };
}

/**
 * 将 class 页面 HTML 转换为 Markdown。
 */
function htmlToMarkdown(className, packageName, parsed, version, classUrl, forgeBuild) {
  const lines = [];
  lines.push("---");
  lines.push(`title: "${className}"`);
  lines.push(`description: "${parsed.description.slice(0, 200).replace(/"/g, '\\"')}"`);
  lines.push(`package: "${packageName}"`);
  lines.push(`version: "${version}"`);
  // build 号必须落在页面上：目录名只有 MC 版本，历史上一度无法核对这份正文出自哪一份 jar
  if (forgeBuild) lines.push(`forgeBuild: "${forgeBuild}"`);
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

/**
 * 类页 URL → 它**真正**所在的包（相对 javadoc 根的完整路径，如 `net/minecraft/entity`）。
 * package-summary 除了本包类表，还会列出跨包链接（继承自他包的类、Related 表）；
 * 按 summary 的包落盘就会产出 `net/minecraft/client/renderer/entity/Entity.md` 这类
 * 本不存在的 FQCN —— 2026-09-21 普查：6 档共 319 篇错档，且与正确那份逐字节重复。
 * @param {string} absUrl @param {string} [baseUrl] javadoc 根（含 build 段，带尾斜杠）
 * @returns {{pkg:string, file:string}|null}
 */
export function splitClassUrl(absUrl, baseUrl) {
  let rel;
  if (baseUrl && absUrl.startsWith(baseUrl)) {
    rel = absUrl.slice(baseUrl.length);
  } else {
    const root = /^.*?\/javadoc\/forge\/[^/]+\//.exec(absUrl);
    if (!root) return null;   // 认不出 javadoc 根就返回 null，让调用方退回 summary 的包
    rel = absUrl.slice(root[0].length);
  }
  const m = /^(.+)\/([^/]+)\.html(?:[#?].*)?$/.exec(rel);
  return m ? { pkg: m[1], file: m[2] } : null;
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
  /** 跨包重复：同一个类页在多个 package-summary 里被列出，只在它自己的包里落一次盘 */
  const seenUrl = new Set();
  let dupCrossPkg = 0;
  /** F123：本次抓取发现的大小写碰撞台账（有冲突才落盘） */
  const allConflicts = [];
  for (const pkg of packages) {
    const pkgSummaryUrl = `${baseUrl}${pkg}/package-summary.html`;
    process.stdout.write(`  📄 ${pkg}... `);

    const { ok: pkgOk, content: pkgHtml } = await fetchUrl(pkgSummaryUrl);
    if (!pkgOk) { console.log("❌"); failed++; await new Promise(r => setTimeout(r, 200)); continue; }

    const classes = parsePackageSummary(pkgHtml, pkgSummaryUrl);
    totalClasses += classes.length;
    console.log(`${classes.length} 类`);

    // F123 根因侧：先算落盘计划（同 URL 去重 + 大小写碰撞改判），再按文件名写盘。
    const planned = classes.length;
    const { writes, conflicts } = planClassWrites(classes);
    const dropped = planned - writes.length;
    if (dropped > 0) {
      console.log(`    [DEDUP] ${pkg}: 同一页重复列出 ${dropped} 条，已折叠`);
    }
    if (conflicts.length > 0) {
      allConflicts.push(...conflicts.map((c) => ({ ...c, package: pkg.replace(/\\/g, "/") })));
      console.log(`    [CONFLICT] ${pkg}: 大小写碰撞 ${conflicts.length} 条（已用确定性后缀并存）`);
    }

    for (const w of writes) {
      const classUrl = w.absUrl;
      if (seenUrl.has(classUrl)) { dupCrossPkg++; continue; }
      seenUrl.add(classUrl);
      // 落盘位置按 URL 的包，不按 summary 的包 —— 后者会把跨包链接错档进本包目录
      const at = splitClassUrl(classUrl, baseUrl);
      const homePkg = at ? at.pkg : pkg;   // URL 解析不出来时退回 summary 包，不能静默丢页
      const pkgDir = join(rawDir, homePkg);
      if (!existsSync(pkgDir)) mkdirSync(pkgDir, { recursive: true });
      const filePath = join(pkgDir, w.fileName);

      if (existsSync(filePath) && !force) {
        fetched++;
        continue;
      }

      process.stdout.write(`    📄 ${w.name}... `);
      const { ok: clsOk, content: classHtml } = await fetchUrl(classUrl);
      if (!clsOk) { console.log("❌"); await new Promise(r => setTimeout(r, 200)); continue; }

      const parsed = parseClassPage(classHtml);
      const markdown = htmlToMarkdown(w.name, homePkg, parsed, mcVer, classUrl, forgeVer);
      writeFileSync(filePath, markdown, "utf-8");
      fetched++;
      console.log(`✅ (${parsed.methodSigs.length}m ${parsed.fields.length}f)`);
      await new Promise(r => setTimeout(r, 100));
    }

    await new Promise(r => setTimeout(r, 200));
  }

  if (allConflicts.length > 0) {
    const reportPath = join(outVersionDir, "_name-conflicts.json");
    writeFileSync(reportPath, JSON.stringify({
      version: mcVer,
      generatedAt: new Date().toISOString(),
      note: "同一包内两个不同 URL 抢同一个大小写不敏感文件名；后来者已带确定性后缀落盘。",
      conflicts: allConflicts,
    }, null, 2), "utf-8");
    console.log(`  ⚠️ 大小写碰撞 ${allConflicts.length} 条 → ${reportPath}`);
  }

  console.log(`  ✅ 完成：${totalClasses} 类 / ${fetched} 成功，${failed} 包失败，跨包重复已折叠 ${dupCrossPkg} 条`);
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

// 只在直接执行时抓取；被 import（test-scripts.mjs 取 planClassWrites）时不得启动
// 联网爬取，否则跑测试就会真写 data/forge_javadoc。
const invokedDirectly =
  !!process.argv[1] &&
  import.meta.url.toLowerCase() ===
    pathToFileURL(process.argv[1]).href.toLowerCase();
if (invokedDirectly) {
  main().catch(console.error);
}
