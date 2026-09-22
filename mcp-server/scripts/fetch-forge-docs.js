#!/usr/bin/env node
/**
 * fetch-forge-docs.js
 * 爬取 Forge MkDocs 官方文档（多版本支持）
 *
 * 使用：
 *   node scripts/fetch-forge-docs.js                  # 抓取所有版本
 *   node scripts/fetch-forge-docs.js --version 1.20.1 # 抓取指定版本
 *   node scripts/fetch-forge-docs.js --section registries
 *   node scripts/fetch-forge-docs.js --dry-run
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { parseCliArgs } from "./_lib/args.js";
import { forgeRawName } from "./_lib/upstream-inventory.mjs";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "..", "..", "data");
const MANIFEST_PATH = join(__dirname, "..", "..", "data", "forge-versions-manifest.json");

// ── CLI / manifest ───────────────────────────────────────────────────────
// 只有直接执行才读 argv、载入 manifest、必要时 process.exit；
// 测试侧 import 本模块是为了拿纯转换函数，import 不得产生退出或 stdout 噪声。
const invokedDirectly =
  Boolean(process.argv[1]) && import.meta.url === pathToFileURL(process.argv[1]).href;

let dryRun = false;
let force = false;
let targetSection;
let manifest;
let versions = [];

function initRunConfig() {
  const args = process.argv.slice(2);
  const parsedArgs = parseCliArgs(args, {
    allowBoolFlags: new Set(["--dry-run", "--force"]),
  });
  dryRun = parsedArgs.flags["dry-run"] === true;
  force = parsedArgs.flags.force === true;
  const targetVer = parsedArgs.flags.version;
  targetSection = parsedArgs.flags.section;
  const sectionIndex = args.indexOf("--section");
  if (targetSection === true && sectionIndex >= 0) {
    const value = args[sectionIndex + 1];
    targetSection = value && !value.startsWith("--") ? value : undefined;
  }
  if (parsedArgs.flags.versionError) {
    console.error("ERROR: --version requires a non-empty value");
    process.exit(2);
  }
  if (args.includes("--section") && !targetSection) {
    console.error("ERROR: --section requires a non-empty value");
    process.exit(2);
  }

  try {
    manifest = JSON.parse(readFileSync(MANIFEST_PATH, "utf-8"));
  } catch (e) {
    console.error("ERROR: Cannot load manifest. Run: node scripts/probe-forge-versions.js");
    process.exit(1);
  }

  const KNOWN_VERSIONS = Object.keys(manifest.versions).filter(
    v => manifest.versions[v]?.mkdocs?.available
  );

  versions = targetVer
    ? (KNOWN_VERSIONS.includes(targetVer) ? [targetVer] : [])
    : KNOWN_VERSIONS;

  if (versions.length === 0) {
    console.error(`ERROR: Version "${targetVer}" not found. Available: ${KNOWN_VERSIONS.join(", ") || "none"}`);
    process.exit(1);
  }

  console.log(`Fetching versions: ${versions.join(", ")}\n`);
}

// ── HTTP ───────────────────────────────────────────────────────────────

const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
  "MC-Forge-Docs-Fetcher/1.0 (+https://github.com/)",
];
let uaIndex = 0;
function nextUA() { return USER_AGENTS[uaIndex++ % USER_AGENTS.length]; }

/** 网络超时（ms）：curl 的 --max-time 与 node https 回退路径共用。 */
const FETCH_TIMEOUT_MS = 30_000;

async function fetchUrlViaCurl(url) {
  try {
    const { stdout } = await execFileAsync(
      "curl.exe",
      [
        "-sS",
        "-L",
        "--ssl-no-revoke",
        "--connect-timeout",
        String(Math.ceil(FETCH_TIMEOUT_MS / 1000) / 2),
        "--max-time",
        String(Math.ceil(FETCH_TIMEOUT_MS / 1000)),
        "-A",
        nextUA(),
        "-w",
        "\n__MC_SKILL_HTTP_STATUS__:%{http_code}",
        url,
      ],
      { encoding: "utf8", maxBuffer: 20 * 1024 * 1024, windowsHide: true },
    );
    const m = stdout.match(/\n__MC_SKILL_HTTP_STATUS__:(\d+)\s*$/);
    const status = m ? Number(m[1]) : 0;
    const body = m ? stdout.slice(0, m.index) : stdout;
    return { ok: status === 200, status, content: body, finalUrl: url };
  } catch (e) {
    return { ok: false, status: -1, content: "", error: e.message };
  }
}

async function fetchUrl(url, retries = 3) {
  if (process.platform === "win32") {
    const viaCurl = await fetchUrlViaCurl(url);
    if (viaCurl.ok) return viaCurl;
  }
  const https = await import("node:https");
  const http = await import("node:http");
  let currentUrl = url;

  for (let attempt = 0; attempt < retries; attempt++) {
    if (attempt > 0) await new Promise(r => setTimeout(r, 1000 * attempt));
    const mod = currentUrl.startsWith("https") ? https : http;
    const headers = { "User-Agent": nextUA() };

    let r;
    try {
      r = await new Promise((resolve, reject) => {
        let settled = false;
        let req;
        // 无超时的 https.get 会永久挂起（curl 路径已有 --max-time，这里必须补）
        const timer = setTimeout(() => {
          if (!settled) req?.destroy(new Error(`请求超时（${FETCH_TIMEOUT_MS}ms）: ${currentUrl}`));
        }, FETCH_TIMEOUT_MS);
        const done = (fn, value) => {
          if (settled) return;
          settled = true;
          clearTimeout(timer);
          fn(value);
        };
        req = mod.get(currentUrl, { headers }, (httpRes) => {
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

// ── HTML → Markdown ──────────────────────────────────────────────────

function extractMarkdown(html, baseUrl) {
  let text = html;

  // Remove nav/header/footer/aside
  text = text.replace(/<nav[\s\S]*?<\/nav>/gi, "");
  text = text.replace(/<header[\s\S]*?<\/header>/gi, "");
  text = text.replace(/<footer[\s\S]*?<\/footer>/gi, "");
  text = text.replace(/<aside[\s\S]*?<\/aside>/gi, "");
  text = text.replace(/<div class="md-sidebar[\s\S]*?<\/div>/gi, "");
  text = text.replace(/<div class="md-header[\s\S]*?<\/div>/gi, "");
  text = text.replace(/<div class="md-nav[\s\S]*?<\/div>/gi, "");
  text = text.replace(/<nav class="md-breadcrumb[\s\S]*?<\/nav>/gi, "");
  text = text.replace(/<a class="md-content__[\s\S]*?<\/a>/gi, "");
  text = text.replace(/<a[^>]*class="headerlink"[^>]*>.*?<\/a>/gi, "");

  // Admonitions: <div class="admonition note"> → > **Note**: content
  text = convertAdmonitions(text);

  // Extract article or main content
  const articleMatch = text.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
  if (articleMatch) text = articleMatch[1];
  else {
    const mainMatch = text.match(/<main[^>]*>([\s\S]*)<\/main>/i);
    if (mainMatch) text = mainMatch[1];
  }

  text = text.replace(/<style[\s\S]*?<\/style>/gi, "");
  text = text.replace(/<script[\s\S]*?<\/script>/gi, "");

  text = htmlToMd(text);
  // 不再在这里折叠 \n{3,}：代码块已在 htmlToMd 内回填，这里再折会削掉块内空行
  text = text.trim();

  return text;
}

function convertAdmonitions(html) {
  const types = ["note", "warning", "important", "tip", "caution", "danger", "attention"];
  for (const type of types) {
    const re = new RegExp(`<div[^>]*class="[^"]*admonition[^"]*${type}[^"]*"[^>]*>([\\s\\S]*?)</div>`, "gi");
    html = html.replace(re, (_, inner) => {
      const titleMatch = inner.match(/<(?:p|strong)[^>]*class="title"[^>]*>([\s\S]*?)<\/(?:p|strong)>/i) ||
                         inner.match(/<p[^>]*><strong>([\s\S]*?)<\/strong><\/p>/i);
      const title = titleMatch
        ? titleMatch[1].replace(/<[^>]+>/g, "").trim()
        : type.charAt(0).toUpperCase() + type.slice(1);
      let body = inner
        .replace(/<(?:p|strong)[^>]*class="title"[^>]*>[\s\S]*?<\/(?:p|strong)>/gi, "")
        .replace(/<p[^>]*><strong>[\s\S]*?<\/strong><\/p>/gi, "");
      body = body
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<p[^>]*>/gi, "")
        .replace(/<\/p>/gi, "\n")
        .replace(/<[^>]+>/g, "")
        .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, " ")
        .split("\n").map(l => l.trim()).filter(l => l).join(" ");
      return "\n> **" + title + "**: " + body + "\n";
    });
  }
  return html;
}

function detectLang(code) {
  const t = code.trim();
  if (!t) return "";
  if (/^(package|import)\s+/.test(t) || /@(Mod|SubscribeEvent|OnlyIn)\b/.test(t) ||
      /^public\s+(class|interface|enum|abstract)\s+/.test(t)) return "java";
  if (/^(plugins|repositories|dependencies|sourceSets)\s*\{/.test(t) ||
      /^(apply|include)\s+plugin/.test(t) || /^(minecraft|forge|mixins)\s*\{/.test(t) ||
      /^version\s*=/.test(t) || /forgegradle/i.test(t)) return "gradle";
  if (/^\s*\{[\s\S]*\}\s*$/.test(t) && /"(pack|forge|minecraft|version|id|author)"/.test(t)) return "json";
  if (/^\[.+\]/.test(t) || /^[a-zA-Z_]+\s*=/.test(t)) return "toml";
  if (/<(!|)\??xml/.test(t) || /<(mods|mod|dependencies)/.test(t)) return "xml";
  return "";
}

/** 上游渲染常留 HTML 实体（&rsquo; / &mdash; / &#8217; …），旧表只解 6 个 ⇒ 实测 508 篇正文带残实体。 */
const ENTITIES = [
  [/&lt;/g, "<"], [/&gt;/g, ">"], [/&quot;/g, '"'], [/&#39;/g, "'"], [/&apos;/g, "'"],
  [/&nbsp;/g, " "], [/&ndash;/g, "–"], [/&mdash;/g, "—"], [/&hellip;/g, "…"],
  [/&rsquo;/g, "’"], [/&lsquo;/g, "‘"], [/&ldquo;/g, "“"], [/&rdquo;/g, "”"],
  [/&trade;/g, "™"], [/&reg;/g, "®"], [/&copy;/g, "©"], [/&times;/g, "×"], [/&middot;/g, "·"],
  [/&#(\d+);/g, (m, d) => String.fromCharCode(Number(d))],
  [/&amp;/g, "&"],
];

function decodeEntities(s) {
  let out = s;
  for (const [re, to] of ENTITIES) out = out.replace(re, to);
  return out;
}

/** 只删标签、不解实体。实体解码全篇只做一次（见 htmlToMd 末尾），否则「解码后再删」会把泛型吃掉。 */
function stripOnly(html) {
  return html.replace(/<[^>]+>/g, "").trim();
}

function stripTags(html) {
  // 旧实现「开标签原样返回、只删闭标签」⇒ 正文留下 <li> <code> <div> 残片（实测 376 篇），
  // 上游写坏的行内 <code> 还会把反引号配对搅乱（189 篇行内围栏可疑）。
  const inline = html
    .replace(/<(code|var|kbd|samp)[^>]*>([\s\S]*?)<\/\1>/gi, "`$2`")
    .replace(/<\/?(?:code|var|kbd|samp)\b[^>]*>/gi, "");
  return stripOnly(inline);
}

/** 代码块先请进保险库：列表/段落的 `\s+ → " "` 折叠会把块内换行压成一行，
 *  围栏随之被吞（实测同一页 26 个 <pre> 只吐 49 个围栏行，应为 52）。 */
const PRE_TOKEN_HEAD = "\u0000MCDEV_PRE_";
const PRE_TOKEN_RE = /\u0000MCDEV_PRE_(\d+)\u0000/g;
const preToken = (i) => `${PRE_TOKEN_HEAD}${i}\u0000`;

/** 列表项 / 段落的空白折叠：含代码块占位符时只并行内空白，保留换行结构。 */
function flatten(fragment) {
  const s = stripTags(fragment);
  if (s.includes(PRE_TOKEN_HEAD)) {
    return s.replace(/[ \t]+/g, " ").replace(/ ?\n ?/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
  }
  return s.replace(/\s+/g, " ").trim();
}

function htmlToMd(html) {
  const vault = [];
  let text = html;

  // pre/code blocks —— 最先处理，之后只以占位符形式参与其余转换
  text = text.replace(/<pre[^>]*>([\s\S]*?)<\/pre>/gi, (_, inner) => {
    const code = inner.replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, "$1");
    const stripped = decodeEntities(stripOnly(code));
    const lang = detectLang(stripped);
    const body = stripped.trim();
    // 上游会在代码块里演示 markdown 围栏本身；固定三反引号会让「块中块」提前闭合，
    // 之后整页内容被吞进代码块（实测 21 篇未配对围栏全由此来）。围栏长度取内部最长串 +1。
    let longest = 0;
    for (const line of body.split("\n")) {
      const m = /^\s*(`{3,})/.exec(line);
      if (m && m[1].length > longest) longest = m[1].length;
    }
    const fence = "`".repeat(Math.max(3, longest + 1));
    vault.push("\n" + fence + lang + "\n" + body + "\n" + fence + "\n");
    return preToken(vault.length - 1);
  });

  // h1-h6
  for (let i = 1; i <= 6; i++) {
    const re = new RegExp(`<h${i}(?:[^>]*)>([\\s\\S]*?)</h${i}>`, "gi");
    text = text.replace(re, (_, inner) => {
      const cleaned = flatten(inner);
      return "\n" + "#".repeat(i) + " " + cleaned + "\n";
    });
  }

  // inline code
  text = text.replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, "`$1`");

  // links
  text = text.replace(/<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, "[$2]($1)");

  // bold/italic
  text = text.replace(/<strong>([\s\S]*?)<\/strong>/gi, "**$1**");
  text = text.replace(/<b>([\s\S]*?)<\/b>/gi, "**$1**");
  text = text.replace(/<em>([\s\S]*?)<\/em>/gi, "*$1*");
  text = text.replace(/<i>([\s\S]*?)<\/i>/gi, "*$1*");

  // unordered lists
  text = text.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (_, inner) =>
    inner.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, item => "- " + flatten(item)).trim()
  );

  // ordered lists
  text = text.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (_, inner) => {
    let idx = 0;
    return inner.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, item =>
      (++idx) + ". " + flatten(item)
    ).trim();
  });

  // tables
  text = text.replace(/<table[^>]*>([\s\S]*?)<\/table>/gi, (_, inner) => {
    const rows = [];
    inner.replace(/<tr[^>]*>([\s\S]*?)<\/tr>/gi, (_, rowInner) => {
      const cells = [];
      rowInner.replace(/<(?:th|td)[^>]*>([\s\S]*?)<\/(?:th|td)>/gi, (_, cell) =>
        cells.push(stripTags(cell).replace(/\n/g, " ").trim())
      );
      if (cells.length) rows.push(cells);
    });
    if (rows.length < 2) return rows.map(r => r.join(" | ")).join("\n");
    const [header, ...body] = rows;
    return [header.join(" | "), header.map(() => "---").join(" | "), ...body.map(r => r.join(" | "))].join("\n");
  });

  // blockquote
  text = text.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (_, inner) =>
    stripTags(inner).split("\n").map(l => "> " + l).join("\n")
  );

  text = text.replace(/<br\s*\/?>/gi, "\n");
  text = text.replace(/<hr\s*\/?>/gi, "\n---\n");
  text = text.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, (_, inner) =>
    "\n" + flatten(inner) + "\n"
  );

  // 收尾顺序：删标签 → 解实体（全篇仅此一次）→ 折叠空行 → 回填代码块保险库。
  // 折叠必须排在回填之前：否则页内正文的空行折叠会顺手削掉代码块里的连续空行。
  const out = decodeEntities(stripTags(text)).replace(/\n{3,}/g, "\n\n");
  return out.replace(PRE_TOKEN_RE, (_, i) => vault[Number(i)] ?? "").trim();
}

// ── Fetch ────────────────────────────────────────────────────────────

/**
 * 带退避的落盘。本仓在 OneDrive 同步卷上，`writeFileSync` 偶发
 * `UNKNOWN: unknown error, open`（errno -4094）——2026-09-21 一整轮重抓就是
 * 被这一页掀掉的（后面两档没跑完）。一次抖动不该等于整轮失败，但真失败仍要冒泡计负。
 */
async function writePage(filePath, text) {
  const delays = [200, 600, 1500];
  for (let i = 0; ; i++) {
    try {
      writeFileSync(filePath, text, "utf-8");
      return;
    } catch (e) {
      if (i >= delays.length) throw e;
      await new Promise(r => setTimeout(r, delays[i]));
    }
  }
}

/**
 * 把 chapter 拼到 route 根 URL 上。
 * 特殊值 `index`（站点首页，probe 侧归一出来的合成 chapter）不拼路径：
 * MkDocs 只把首页发布在 `<route>/`，`<route>/index/` 实测 404。
 */
function chapterUrl(routeRootUrl, chapter) {
  if (!chapter || chapter === "index") return routeRootUrl;
  return `${routeRootUrl}${chapter}/`;
}

async function fetchChapter(mcVersion, chapter) {
  const route = manifest.versions[mcVersion].mkdocs.route;
  const primaryUrl = chapterUrl(`https://docs.minecraftforge.net/en/${route}/`, chapter);

  let { ok, status, content, error, finalUrl } = await fetchUrl(primaryUrl);
  if (!ok) {
    const altUrl = chapterUrl(`https://mcforge.readthedocs.io/en/${route}/`, chapter);
    const alt = await fetchUrl(altUrl);
    if (alt.ok) { ok = true; content = alt.content; finalUrl = alt.finalUrl; }
    else return { ok: false, status, error: error || alt.error };
  }

  const markdown = extractMarkdown(content, finalUrl || primaryUrl);
  return { ok: true, markdown, finalUrl };
}

// ── Main ────────────────────────────────────────────────────────────

async function main() {
  let totalFailed = 0;
  for (const mcVer of versions) {
    const verInfo = manifest.versions[mcVer];
    if (!verInfo?.mkdocs?.available) {
      console.log(`SKIP ${mcVer}: MkDocs not available`);
      continue;
    }

    const chapters = verInfo.mkdocs.chapters;
    const filtered = targetSection
      ? (chapters.filter(c => c.includes(targetSection)).length > 0
          ? chapters.filter(c => c.includes(targetSection))
          : [targetSection])
      : chapters;

    if (filtered.length === 0) {
      console.log(`EMPTY ${mcVer}: No chapters matching "${targetSection}"`);
      continue;
    }

    const versionDir = join(OUT_DIR, `forge_${mcVer}`, "forge-docs", mcVer, "raw");
    if (!existsSync(versionDir)) mkdirSync(versionDir, { recursive: true });

    console.log(`[${mcVer}] Fetching ${filtered.length} chapters...`);

    let success = 0, failed = 0;
    for (const chapter of filtered) {
      const sourceUrl = chapterUrl(`${manifest.mkdocsBaseUrl}${verInfo.mkdocs.route}/`, chapter);

      if (dryRun) {
        console.log(`  DRY ${chapter}`);
        continue;
      }

      const fileName = forgeRawName(chapter);
      const filePath = join(versionDir, fileName);

      if (existsSync(filePath) && !force) {
        const bytes = statSync(filePath).size;
        if (bytes < 100) {
          // 空壳页旧实现计成 SKIP 成功 ⇒「抓到」与「抓到 0 字节」在台账里同形，缺页看不出来。
          console.log(`  SHELL ${chapter} — 本地仅 ${bytes}B，视为未完成（加 --force 重抓）`);
          failed++;
        } else {
          process.stdout.write(`  SKIP ${chapter}\n`);
          success++;
        }
        continue;
      }

      process.stdout.write(`  FETCH ${chapter}... `);
      const { ok, markdown, status, error } = await fetchChapter(mcVer, chapter);

      const body = typeof markdown === "string" ? markdown.trim() : "";
      if (ok && body) {
        const fm = ["---", `version: "${mcVer}"`, `forgeVersion: "${verInfo.forgeVersion}"`,
          `chapter: "${chapter}"`, `source: "${sourceUrl}"`, `sourceType: mkdocs`, "---", ""].join("\n");
        try {
          await writePage(filePath, fm + markdown);
        } catch (writeError) {
          console.log(`WRITEFAIL ${chapter}: ${writeError.code || writeError.message}`);
          failed++;
          continue;
        }
        // 上游确有极短的合法页（各档站点首页 ~300 字符，个别 stub 更短）：
        // 旧门槛 `> 200` 让这类页永远进不来，还被报成 FAIL，与真失败同形。
        console.log(body.length < 200 ? `OK SHORT ${body.length}B` : `OK ${(markdown.length / 1024).toFixed(1)}KB`);
        success++;
      } else {
        console.log(`FAIL HTTP ${status} ${error || (ok ? "空正文" : "")}`);
        failed++;
      }

      await new Promise(r => setTimeout(r, 300));
    }

    console.log(`  RESULT: ${success} OK, ${failed} failed\n`);
    totalFailed += failed;
  }

  if (dryRun) console.log("(dry-run, no files written)");
  else console.log("DONE!");

  // 抓取失败必须影响退出码：旧实现把 FAIL 只打进 stdout，批量跑与 CI 永远看到 0，
  // 缺页就是这么被咽下去的（2026-09-21 缺页普查的 Forge 29 页即此形态）。
  if (totalFailed > 0) {
    console.error(`FAILED: ${totalFailed} 页未落盘或为空壳`);
    process.exitCode = 1;
  }
}

// 只有直接 CLI 调用才真跑；测试侧 import 本模块是为了拿纯转换函数。
// 用 pathToFileURL 而不是裸拼 file:/// —— 本仓路径含非 ASCII 时后者恒不相等（2026-09-21 五脚本静默不跑事故）。
if (invokedDirectly) {
  initRunConfig();
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}

export { stripTags, htmlToMd, detectLang, extractMarkdown, convertAdmonitions };