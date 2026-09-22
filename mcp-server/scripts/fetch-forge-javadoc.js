#!/usr/bin/env node
/**
 * fetch-forge-javadoc.js
 * 抓取 ForgeJavaDocs Javadoc 存档（1.7.10–1.12.2），解析为结构化 Markdown。
 *
 * 数据源：https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/{mcVersion}-{forgeVersion}/
 *
 * 使用：
 *   node scripts/fetch-forge-javadoc.js                       # 抓所有版本（已存在的页跳过）
 *   node scripts/fetch-forge-javadoc.js --version=1.12.2      # 指定版本（注意是 `--version=`，空格形式不认）
 *   node scripts/fetch-forge-javadoc.js --force               # 整批重抓；崩了重跑按 fetchedWith 续跑
 *   MC_SKILL_JAVADOC_PARALLEL=6 node scripts/fetch-forge-javadoc.js --force   # 并发 1–8，默认 4
 *   node scripts/fetch-forge-javadoc.js --dry-run             # 只列版本清单
 *   node scripts/fetch-forge-javadoc.js --prune-orphans       # 只出删除清单（raw + processed 双边）
 *   node scripts/fetch-forge-javadoc.js --prune-orphans --confirm=prune-orphans   # 真删
 *
 * 退出码：任一页取不到 / 写不进 / 包 summary 失败 ⇒ rc=1（旧版这些路径只打 ❌ 然后 rc=0）。
 * 孤儿（盘上有、本轮计划没有）只写 data/forge_javadoc/<ver>/_orphan-report.json，不代删；
 * 删除走上面那条独立腿，且**报告缺失/过期/档位不符都不动**（宁可不删，不能错删）。
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, renameSync, unlinkSync } from "fs";
import { join, dirname, relative, sep } from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "..", "..", "data", "forge_javadoc");
const MANIFEST_PATH = join(__dirname, "..", "..", "data", "forge-versions-manifest.json");

/**
 * 正文生产者版本号：写进每页 frontmatter 的 `fetchedWith`。
 * 为什么要有：`--force` 的语义是"整批重抓"，一次 1.8 万页的重抓在 OneDrive 卷上必然会被
 * -4094 抖动或网络打断；没有这枚标记就只能从头再来。有了它，同一轮重抓可以续跑
 * （带 --force 时只跳过已带当前标记的页），且"哪些页是本轮新生产者写的"可核。
 */
export const PRODUCER_REV = "c4-2026-09-22";

/**
 * 整批「解析出 0 成员」率的红线（判据⑥的批量腿）。
 * 分母 = 本轮计划页数，分子 = 解析后成员总数为 0 的页。盘上 HEAD 语料里真·空类（marker interface、
 * 无成员的嵌套枚举）实测 1888 档 38 页 ~ 1.12.2 档 58 页，率 ≈1.5%；2026-09-22 那次事故是
 * 17772/18079 ≈ 98%。取 5% 为红线：离真值有余量，离事故差一个数量级。
 */
export const ZERO_MEMBER_RATIO_MAX = 0.05;

/**
 * 抓完一页后写盘。OneDrive 卷偶发 UNKNOWN/-4094 ⇒ 退避三次，仍失败记失败不炸整轮。
 * 先写 .tmp 再 rename：抖动机位上「开文件成功、写内容失败」会留下半截正文，
 * rename 失败最坏是原文件不动，而直接 writeFileSync 覆盖失败就是把好页写成 0 字节。
 */
function writeWithRetry(filePath, text, delays = [200, 600, 1500]) {
  const dir = dirname(filePath);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  const tmp = `${filePath}.tmp-${process.pid}`;
  let lastErr = null;
  for (let i = 0; i <= delays.length; i++) {
    try {
      writeFileSync(tmp, text, "utf-8");
      renameSync(tmp, filePath);
      return true;
    } catch (e) {
      lastErr = e;
      try {
        if (existsSync(tmp)) unlinkSync(tmp);
      } catch { /* 清不掉留给下一轮 */ }
      if (i < delays.length) {
        const until = Date.now() + delays[i];
        while (Date.now() < until) { /* 退避自旋（同步写盘链不靠事件循环） */ }
      }
    }
  }
  throw lastErr ?? new Error("write failed");
}

// ── 版本配置（从 probe-forge-versions.js 生成）───────────────────────

export const JAVADOC_VERSIONS = [
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

// ── HTML 解析（旧式 javadoc 表格）──────────────────────────────────────

/** 实体解码：只解 javadoc 表格里会出现的那几个。 */
function decodeEntities(s) {
  return String(s)
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#\d+;/g, (m) => String.fromCharCode(Number(m.slice(3, -1))))
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&");
}

/**
 * 剥标签成一行纯文本。
 * 标签边界一律压成空格再折叠 ⇒ `&lt;<a>Block</a>&gt;` 得 `< Block >`，
 * 由 collapseGenerics 再收一次（只有签名行会调它，散文不会被误伤）。
 */
function textOf(html) {
  return decodeEntities(String(html).replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();
}

/**
 * 签名专用：把 `< Block >` 收成 `<Block>`，但**不能**吃掉 `>` 后面那个参数名的分隔空格
 * （`List<AxisAlignedBB>collidingBoxes` 就是这么被压成不可读的一坨的）。
 * 规则：贴紧 `<` 与 `>` 两侧的空格一律去掉，然后凡 `>` 紧跟标识符的，补回一个空格。
 */
function collapseGenerics(sig) {
  return String(sig)
    .replace(/\s*</g, "<")
    .replace(/<\s+/g, "<")
    .replace(/\s+>/g, ">")
    .replace(/>\s+/g, ">")
    .replace(/>(?=[A-Za-z_$])/g, "> ")
    .replace(/\s*\(\s*/g, "(")
    .replace(/\s*\)\s*/g, ")")
    .replace(/\s*,\s*/g, ", ")
    .replace(/\s+/g, " ")
    .trim();
}

// 类声明的起始：可以从头，也可以跟在空白/分号后（`@Retention(…) @Target(…) public @interface API`
// 这种"注解行在前"的形状是 jdk8 注解页的常态 —— 只按 `^` 匹配会把整页类声明判没，2026-09-22 实测）。
// 关键字必须在词边界上且后跟空格，所以 `public void interfaceMethod()` 不会被误认成声明。
const CLASS_DECL_RE = /(?:^|(?<=[\s;]))(?:(?:public|protected|private|abstract|static|final|strictfp|default)\s+)*(?:class|interface|enum|record|@interface)\s/;
// 成员表：`<h3>Method Summary</h3>` 后面跟着的 `<table class="memberSummary">`。
// 类页还会内嵌「从 Object 继承的方法」这类**同一 h3 名**的表，所以按表逐张取、不按页取。
const MEMBER_TABLE_RE = /<h3>(Constructor|Field|Method|Nested|Annotation\s+Type|(?:Required|Optional)\s+Element)\s+Summary<\/h3>([\s\S]*?)<\/table>/gi;
const ROW_RE = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
const CELL_RE = /<td[^>]*class="col(?:First|Last|One)"[^>]*>([\s\S]*?)<\/td>/gi;
const CODE_RE = /<code[^>]*>([\s\S]*?)<\/code>/i;

/**
 * Javadoc 类页解析（**旧式** Oracle javadoc 8 的表格形状）。
 *
 * 为什么整段重写：原实现只匹配 `<pre class="memberSignatures">` / `<pre class="methodSignature">`，
 * 那是**新式**（jdk 9+）javadoc 的 class 属性；skmedix 那套 ForgeJavaDocs 是 jdk 8 生成的，
 * 成员列在 `<table class="memberSummary">` 的 `<td class="colFirst">`（修饰符与类型）+
 * `<td class="colLast"><code><span class="memberNameLink">名</span>(参数)</code>` 里，
 * `memberSignatures` 在整份 HTML 中出现 **0** 次。实测 1.12.2 `Block.html`（361 KB / 228 个
 * `memberNameLink`）被原实现解析成 0 方法 0 字段，而页面正文在 git 里是 9,917 字节 ——
 * 也就是说仓库里这份语料**不是现版脚本能产的**，任何一次 `--force` 都会把它刷成空壳
 * （2026-09-22 真的发生了一次，已回滚）。
 *
 * @param {string} html
 * @returns {{classSig:string, description:string, inheritance:string,
 *            constructors:string[], methods:{sig:string,desc:string}[],
 *            fields:{name:string,type:string,desc:string}[],
 *            nested:string[], elements:{name:string,type:string,desc:string}[],
 *            memberNameLinks:number}}
 */
export function parseClassPage(html) {
  const src = String(html);

  // 类声明：`<hr><br><pre>public class <span class="typeNameLabel">Block</span> extends ...`
  // 页面上还有几十上百个成员详情用的 `<pre>`，所以按"首词是不是声明关键字"筛，不按位置取第一个。
  let classSig = "";
  for (const m of src.matchAll(/<pre[^>]*>([\s\S]{1,4000}?)<\/pre>/gi)) {
    // 结构判定用**未压空格**的文本：collapseGenerics 会把 `PACKAGE) public` 的空格吃掉（`)` 前后的空格
    // 一律删），那样关键字前面的边界就没了 ⇒ 注解页的类声明会被判成"没有声明"（2026-09-22 实测）。
    const t = textOf(m[1]);
    const d = CLASS_DECL_RE.exec(t);
    if (d) { classSig = collapseGenerics(t.slice(d.index)).trim(); break; }
  }

  // 类注释：`div.description` 里第一个 `<div class="block">`
  let description = "";
  const descBox = /<div[^>]*class="description"[^>]*>([\s\S]{1,40000}?)<div[^>]*class="(?:deprecation|notes)"/i.exec(src);
  if (descBox) {
    const block = /<div[^>]*class="block"[^>]*>([\s\S]{1,8000}?)<\/div>/i.exec(descBox[1]);
    description = textOf(block ? block[1] : descBox[1]).slice(0, 600);
  }

  // 继承树：jdk8 把它写成 `ul.inheritance` 里**嵌套同名 ul** 的一条链。
  // 为什么不能"从外层切 6000 字再收不含嵌套 ul 的 li"：链的 `</ul>` 后面紧挨着
  // `<li class="blockList">`（类注释 + 类声明 + Summary 表），那些 li 也不含嵌套 ul，
  // 于是整段页面文字被并进 Inheritance —— 2026-09-22 全量比对实测 14704/16423 页中招，
  // 且部分页因此把类声明吞进继承链（`TileFluidHandler` 那页丢了 ```java 块）。
  // 现在按 ul / /ul 深度计数**只取那一棵子树**，再逐条要求它是类名形状。
  let inheritance = "";
  const inhAt = src.search(/<ul[^>]*class="inheritance"/i);
  if (inhAt >= 0) {
    const from = src.indexOf(">", inhAt) + 1;
    const tags = /<(\/?)ul\b[^>]*>/gi;
    tags.lastIndex = from;
    let depth = 1, end = -1, t;
    while ((t = tags.exec(src))) {
      depth += t[1] ? -1 : 1;
      if (depth === 0) { end = t.index; break; }
    }
    const sub = src.slice(from, end < 0 ? Math.min(src.length, from + 4000) : end);
    // 链是「每层 li 里再套一个 ul」，所以每个类名都在自己的 `<li>` 里。取每个 li 开头到
    // **下一个 li / 嵌套 ul / li 闭合**之前那段文字（外层 li 的这段通常是空的，交给形状过滤丢掉）。
    const chain = [...sub.matchAll(/<li(?:\s[^>]*)?>([\s\S]*?)(?=<ul\b|<li\b|<\/li>|$)/gi)]
      .map((m) => collapseGenerics(textOf(m[1])))
      .filter((x) => /^[\w$.]+(<[^<>]*>)?(\s*\.\.\.)?$/.test(x));   // 类名形状：带空格/冒号/表头的都不是链上的一环
    inheritance = [...new Set(chain)].join(" → ");
  }

  const constructors = [];
  const methods = [];
  const fields = [];
  const nested = [];
  // @interface 页的成员在 jdk8 里叫「Required / Optional Element Summary」，不是 Method/Field Summary。
  // 2026-09-22 全量重抓时漏了它 ⇒ 六档共 30 篇注解页被"解析空"守卫挡下（HEAD 那份有 `## Elements`），
  // 守卫按设计拒绝了好正文被空壳覆盖，但那时是我的解析器回归，不是上游没成员。
  const elements = [];
  // 「HTML 在这一行声明了一个成员」的独立计数，与上面四个数组**脱钩**。
  // 判据⑥要靠它区分两种"0 成员"：这一页真没成员（marker interface），
  // 还是解析器读不懂这套形状（2026-09-22 事故：memberNameLink 228 个、抽出 0 个）。
  let memberNameLinks = 0;
  for (const [, kind, body] of src.matchAll(MEMBER_TABLE_RE)) {
    const k = String(kind).toLowerCase();
    for (const [, row] of body.matchAll(ROW_RE)) {
      if (/<th\b/i.test(row)) continue;                       // 表头行
      if (/memberNameLink/i.test(row) || /<code[^>]*>\s*<a\b/i.test(row)) memberNameLinks++;
      const cells = [...row.matchAll(CELL_RE)].map((c) => c[1]);
      if (!cells.length) continue;
      const deprecated = /class="deprecatedLabel"/i.test(row) || /Deprecated\./i.test(cells.slice(-1)[0] ?? "");
      const nameCell = cells[cells.length - 1];
      const code = CODE_RE.exec(nameCell)?.[1] ?? "";
      const nameText = collapseGenerics(textOf(code));
      const typeText = cells.length > 1 ? collapseGenerics(textOf(cells[0])) : "";
      const descRaw = textOf((/<div[^>]*class="block"[^>]*>([\s\S]{1,4000}?)<\/div>/i.exec(nameCell) ?? [])[1] ?? "");
      // 「Deprecated.」已经是行首的 @Deprecated 前缀了，别在描述位上再复读一遍
      const descText = /^deprecated\.?$/i.test(descRaw) ? "" : descRaw;
      if (k === "constructor") {
        if (nameText) constructors.push(`${deprecated ? "@Deprecated " : ""}${nameText}`);
      } else if (k === "method") {
        if (nameText) methods.push({ sig: `${deprecated ? "@Deprecated " : ""}${typeText ? typeText + " " : ""}${nameText}`, desc: descText });
      } else if (k === "field") {
        const nm = textOf(code).split(" ")[0];
        if (nm) fields.push({ name: nm, type: typeText, desc: descText });
      } else if (k === "nested" || k.startsWith("annotation")) {
        if (nameText) nested.push(nameText);
      } else if (k.endsWith("element")) {
        if (nameText) elements.push({ name: nameText, type: typeText, desc: descText });
      }
    }
  }

  return { classSig, description, inheritance, constructors, methods, fields, nested, elements, memberNameLinks };
}

/** 这一页解析出来的成员总数（构造子 + 方法 + 字段 + 嵌套类 + 注解元素）。空 = 抓取器没读懂，不是页面没成员。 */
function memberCount(parsed) {
  return parsed.constructors.length + parsed.methods.length + parsed.fields.length + parsed.nested.length
    + (parsed.elements ?? []).length;
}

/**
 * 判据⑥**页面级**判据：这一页的解析结果算不算「生产者读不懂」——算则不许覆盖盘上已有正文。
 *
 * 为什么不写成 `成员 0 && 类声明 0`：新式（jdk 9+）javadoc 页面能被抽出 classSig，成员却是 0，
 * 那条判据在真正的错配形状上**恰好不成立**（写这条时踩过）。改成两腿：
 * - HTML 自己声称有成员（`memberNameLink`）而抽出 0 个 ⇒ 必读不懂；
 * - 连类声明都没有 ⇒ 整页没认出来。
 * 真·空类（marker interface，HEAD 语料实测 ≈1.5%）两腿都不成立 ⇒ 放行，不会误拒。
 * 新式页这种「有 classSig、0 成员、0 memberNameLink」的形状由**批量级**判据（`ZERO_MEMBER_RATIO_MAX`）兜。
 */
export function isUnreadableParse(parsed) {
  return memberCount(parsed) === 0 && (parsed.memberNameLinks > 0 || !parsed.classSig);
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
/**
 * 渲染成 markdown。分节名沿用 HEAD 语料的形状（`Class signature` / `Constructors` / `Methods` /
 * `Description`），并补一节 `Fields` —— 常量大写名（`Block.FULL_BLOCK_AABB` 这类）是 agent 会问的东西，
 * 旧渲染器整个丢掉了。**不设条数上限**：上限就是"少产"，而少产正是这族语料被刷空时的形状。
 */
export function htmlToMarkdown(className, packageName, parsed, version, classUrl, forgeBuild) {
  const lines = [];
  lines.push("---");
  lines.push(`title: "${className}"`);
  lines.push(`description: "${(parsed.classSig || parsed.description).slice(0, 200).replace(/"/g, '\\"')}"`);
  lines.push(`package: "${packageName}"`);
  lines.push(`version: "${version}"`);
  // build 号必须落在页面上：目录名只有 MC 版本，历史上一度无法核对这份正文出自哪一份 jar
  if (forgeBuild) lines.push(`forgeBuild: "${forgeBuild}"`);
  lines.push(`fetchedWith: "${PRODUCER_REV}"`);
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
  if (parsed.classSig) {
    lines.push("## Class signature");
    lines.push("");
    lines.push("```java");
    lines.push(parsed.classSig);
    lines.push("```");
    lines.push("");
  }
  if (parsed.nested.length) {
    lines.push("## Nested classes");
    lines.push("");
    for (const n of parsed.nested) lines.push(`- \`${n}\``);
    lines.push("");
  }
  if (parsed.constructors.length) {
    lines.push("## Constructors");
    lines.push("");
    for (const c of parsed.constructors) lines.push(`- \`${c}\``);
    lines.push("");
  }
  if (parsed.methods.length) {
    lines.push("## Methods");
    lines.push("");
    for (const m of parsed.methods) {
      lines.push(`- \`${m.sig}\`${m.desc ? ` — ${m.desc.slice(0, 300)}` : ""}`);
    }
    lines.push("");
  }
  if (parsed.fields.length) {
    lines.push("## Fields");
    lines.push("");
    for (const f of parsed.fields) {
      lines.push(`- \`${f.type ? f.type + " " : ""}${f.name}\`${f.desc ? ` — ${f.desc.slice(0, 300)}` : ""}`);
    }
    lines.push("");
  }
  if ((parsed.elements ?? []).length) {
    lines.push("## Elements");
    lines.push("");
    for (const e of parsed.elements) {
      lines.push(`- \`${e.type ? e.type + " " : ""}${e.name}\`${e.desc ? ` — ${e.desc.slice(0, 300)}` : ""}`);
    }
    lines.push("");
  }
  if (parsed.description) {
    lines.push("## Description");
    lines.push("");
    lines.push(parsed.description);
    lines.push("");
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

async function fetchVersion(version, force, parallel = 4) {
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
  if (!ok) {
    console.log("❌ 失败");
    // 整版取不到包清单 ⇒ 这一档一条都没落，绝不能算"跑完"：failedPackages 记账 ⇒ main 退出码非 0
    return { mcVer, planned: 0, wrote: 0, skipped: 0, failPages: [], writeFail: [], failedPackages: 1, orphans: [], orphanCheck: "skipped", parsedPages: 0, zeroMember: 0, zeroMemberRatio: 0 };
  }
  console.log(`✅ ${overviewHtml.length}B`);

  const packages = parsePackageList(overviewHtml);
  console.log(`  📦 ${packages.length} 个包`);

  // 2. 先取齐每包的 package-summary 攒成落盘计划，再用受并发限制的池抓页 ——
  //    旧写法「包内逐页 await」使一轮 1.8 万页只能串行（实测单页 ~950ms ⇒ 5 小时起）。
  let failed = 0;
  /** 跨包重复：同一个类页在多个 package-summary 里被列出，只在它自己的包里落一次盘 */
  const seenUrl = new Set();
  let dupCrossPkg = 0;
  /** F123：本次抓取发现的大小写碰撞台账（有冲突才落盘） */
  const allConflicts = [];
  /** @type {{pkg:string,homePkg:string,w:{name:string,fileName:string,absUrl:string},filePath:string}[]} */
  const plan = [];
  for (const pkg of packages) {
    const pkgSummaryUrl = `${baseUrl}${pkg}/package-summary.html`;
    process.stdout.write(`  📄 ${pkg}... `);

    const { ok: pkgOk, content: pkgHtml } = await fetchUrl(pkgSummaryUrl);
    if (!pkgOk) { console.log("❌"); failed++; await new Promise(r => setTimeout(r, 200)); continue; }

    const classes = parsePackageSummary(pkgHtml, pkgSummaryUrl);
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
      plan.push({ pkg, homePkg, w, filePath: join(rawDir, homePkg, w.fileName) });
    }

    await new Promise(r => setTimeout(r, 200));
  }

  // 3. 受并发限制的页抓取池
  const failPages = [];
  const writeFail = [];
  /** 解析出 0 成员且盘上原本也没有正文的页（合法空类，如标记接口）——只记账，不算失败。 */
  const emptyPages = [];
  // 批量腿（判据⑥第二腿）：分母只算**本轮真解析过**的页 —— 续跑时盘上页被跳过，
  // 按 plan.length 取分母会把一次彻底错配稀释成"看起来正常"。
  let zeroMember = 0;
  let parsedPages = 0;
  let wrote = 0;
  let skipped = 0;
  console.log(`  🎯 计划 ${plan.length} 页（跨包重复已折叠 ${dupCrossPkg}），并发 ${parallel}${force ? " + --force 重抓" : ""}`);
  const queue = [...plan];
  let lastBeat = Date.now();
  async function worker(id) {
    for (;;) {
      const item = queue.shift();
      if (!item) return;
      const { w, homePkg, filePath } = item;
      if (!force && existsSync(filePath)) { skipped++; continue; }
      if (force && producedByCurrent(filePath)) { skipped++; continue; }  // 本轮已抓过 ⇒ 续跑不重来
      const { ok: clsOk, status: clsStatus, content: classHtml } = await fetchUrl(w.absUrl);
      if (!clsOk) {
        failPages.push({
          file: relative(rawDir, filePath).split(sep).join("/"),
          url: w.absUrl,
          reason: clsStatus ? `HTTP ${clsStatus}` : "两条腿都取不到（含重定向终点）",
        });
        continue;
      }
      const parsed = parseClassPage(classHtml);
      // 「解析出 0 成员」= 生产者读不懂这一页的形状，不是「这一页没有成员」。
      // 实测代价：`parseClassPage` 只认新式 javadoc 的 `<pre class="memberSignatures">`，
      // 而 skmedix 这套是旧式表格（`memberNameLink` / `colFirst`）⇒ 整批匹配为 0；
      // 一次 `--force` 把 1.8 万页有正文的语料刷成 288 字节空壳，且**没有任何门会红**（已回滚）。
      // 另：GitHub Pages 的 404 页经这条腿回来时是 **HTTP 200**，只看状态码抓不住。
      const produced = memberCount(parsed);
      parsedPages++;
      if (produced === 0) zeroMember++;
      const emptyParse = isUnreadableParse(parsed);
      if (emptyParse || looksLikeGitHub404(classHtml)) {
        const rel = relative(rawDir, filePath).split(sep).join("/");
        if (existsSync(filePath) && pageHasBody(filePath)) {
          failPages.push({ file: rel, url: w.absUrl, reason: "解析空/404 页，但盘上有正文 ⇒ 拒绝覆盖" });
          continue;
        }
        if (looksLikeGitHub404(classHtml)) {
          failPages.push({ file: rel, url: w.absUrl, reason: "HTTP 200 实为 GitHub Pages 404 页 ⇒ 不写盘" });
          continue;
        }
        emptyPages.push({ file: rel, url: w.absUrl });   // 盘上本来也没有 ⇒ 记账，照写
      }
      const markdown = htmlToMarkdown(w.name, homePkg, parsed, mcVer, w.absUrl, forgeVer);
      try {
        writeWithRetry(filePath, markdown);
        wrote++;
      } catch (e) {
        writeFail.push({ file: relative(rawDir, filePath).split(sep).join("/"), reason: String(e?.message ?? e).slice(0, 160) });
        continue;
      }
      if (Date.now() - lastBeat > 15_000) {
        lastBeat = Date.now();
        console.log(`    … ${wrote + skipped + failPages.length + writeFail.length}/${plan.length}（写 ${wrote}、跳过 ${skipped}、失败 ${failPages.length + writeFail.length}、空解析 ${emptyPages.length}）`);
      }
    }
  }
  await Promise.all(Array.from({ length: parallel }, (_, i) => worker(i)));

  // 批量级腿：页面级判据抓不到的形状（新式 javadoc 有 classSig、0 成员、0 memberNameLink）不红，
  // 但**整批** 0 成员率异常只可能是解析器与 HTML 形状错配。盘上 HEAD 语料真·0 成员页实测
  // 38–58 / 版本（marker interface，≈1.5%），所以 >5% 一律按事故处理、退出码非 0。
  const zeroMemberRatio = parsedPages ? zeroMember / parsedPages : 0;
  if (parsedPages >= 200 && zeroMemberRatio > ZERO_MEMBER_RATIO_MAX) {
    console.error(`  🛑 ${mcVer}：本轮解析 ${parsedPages} 页中 ${zeroMember} 页（${(zeroMemberRatio * 100).toFixed(1)}%）0 成员 ⇒ 远超盘上语料的真·空类率（≈1.5%）。这不是"这些类没有成员"，是 parseClassPage 读不懂这一代 HTML（阈值见 ZERO_MEMBER_RATIO_MAX）。`);
  }

  // 批量「拒绝对外倒退」= 解析器整体读不懂这套页面的形状，不是零星坏页。
  // 触发过一次真实事故：`parseClassPage` 只认新式 `<pre class="memberSignatures">`，
  // 这套镜像是旧式表格 ⇒ 1.8 万页被刷成空壳。此处把同类事故从"静默"变成"当场停"。
  const refusals = failPages.filter((f) => String(f.reason).startsWith("解析空"));
  if (refusals.length >= 50) {
    console.error(`  🛑 ${mcVer}：${refusals.length} 页解析出 0 成员 0 签名 ⇒ **不是这些页没成员，是 parseClassPage 读不懂这套 HTML 的形状**（旧式 javadoc 表格 vs 新式 <pre> 成员块）。`);
    console.error("     本轮一概要覆盖的页都被挡住了。先修解析器再重抓；台账口径见 assert-javadoc-build-provenance 判据⑥。");
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

  // 3.5 抖动清尾：`writeWithRetry` 里 rename 失败且 tmp 也删不掉时，整页正文副本会留在 raw/。
  //     `data/` 不被 gitignore ⇒ 不清等于把垃圾交进库；判据另在 assert-javadoc-build-provenance ⑤。
  let swept = 0;
  for (const rel0 of walkRel(rawDir)) {
    if (rel0.endsWith(".md")) continue;
    try {
      unlinkSync(join(rawDir, rel0));
      swept++;
    } catch { /* 下一轮再清，别掀掉整版抓取 */ }
  }
  if (swept) console.log(`  🧹 清掉 raw/ 下 ${swept} 个非 .md 残留（写盘抖动副本）`);

  // 4. 孤儿对账：盘上有、本轮计划里没有 ⇒ 多半是上一代生产者落在错包目录 / 锚点形状的页。
  //    只出清单不代删（删除要显式确认）；本轮有页失败时**不产出孤儿报告**，
  //    因为"没抓到"与"不该存在"这两种情况分不开，按前者删会把合法页判成孤儿。
  const orphans = [];
  let orphanCheck = "ok";
  if (!failPages.length && !writeFail.length) {
    const plannedRel = new Set(plan.map((p) => relative(rawDir, p.filePath).split(sep).join("/")));
    for (const rel0 of walkRel(rawDir, rawDir, [], ".md")) {
      if (!plannedRel.has(rel0)) orphans.push(rel0);
    }
    const reportPath = join(outVersionDir, "_orphan-report.json");
    writeFileSync(reportPath, JSON.stringify({
      version: mcVer,
      forgeBuild: forgeVer,
      producerRev: PRODUCER_REV,
      generatedAt: new Date().toISOString(),
      note: "raw/ 下存在但本轮落盘计划里没有的文件；本轮页失败/写失败为 0 才会生成此报告。删除需显式确认。",
      count: orphans.length,
      files: orphans,
    }, null, 2), "utf-8");
    if (orphans.length) console.log(`  🗜 孤儿 ${orphans.length} 条 → ${reportPath}（未删）`);
  } else {
    orphanCheck = "skipped";
    console.log(`  ⏭ 本轮有 ${failPages.length + writeFail.length} 页未成功 ⇒ 跳过孤儿对账（分不清"没抓到"和"不该存在"）`);
  }

  console.log(`  ✅ 完成：写 ${wrote} / 跳过 ${skipped} / 计划 ${plan.length}，页失败 ${failPages.length}，写失败 ${writeFail.length}，${failed} 包失败，跨包重复已折叠 ${dupCrossPkg} 条`);
  const failReportPath = join(outVersionDir, "_page-failures.json");
  if (failPages.length || writeFail.length) {
    writeFileSync(failReportPath, JSON.stringify({
      version: mcVer, generatedAt: new Date().toISOString(), count: failPages.length, pages: failPages.slice(0, 2000),
      writeFail: writeFail.slice(0, 2000),
    }, null, 2), "utf-8");
  } else if (existsSync(failReportPath)) {
    // 上一轮的失败报告不清走 ⇒ 读的人以为这版还缺页（1.7.10 实测：试点跑缺 1 页，
    // 全量重抓 0 失败，但 `_page-failures.json` 仍留在档里）。
    try {
      unlinkSync(failReportPath);
      console.log("  🧹 已删除上一轮遗留的 _page-failures.json（本轮 0 失败）");
    } catch (e) {
      console.log(`  ⚠️ 遗留 _page-failures.json 删不掉（${e.code ?? e.message}）⇒ 手工确认它是否还成立`);
    }
  }
  return { mcVer, planned: plan.length, wrote, skipped, failPages, writeFail, emptyPages, failedPackages: failed, orphans, orphanCheck,
    parsedPages, zeroMember, zeroMemberRatio };
}

/**
 * GitHub Pages 的 404 页经 curl 腿回来是 **HTTP 200**，只有正文里有这两句才认得出是错误页。
 * 实测：`.../net/minecraftforge/client/event/ITextComponent.html`（错档 URL）= 200 + 9379B 的 "Page not found"。
 */
function looksLikeGitHub404(html) {
  const head = String(html).slice(0, 2000);
  return /Page not found/i.test(head) && /GitHub Pages/i.test(head);
}

/** 盘上这页有没有正文（有 ```java 签名块或成员/元素列表行）。用来判断"空解析"是否会造成倒退。 */
function pageHasBody(filePath) {
  try {
    const t = readFileSync(filePath, "utf-8");
    return /```java/.test(t) || /^\s*-\s+`/m.test(t) || /##\s+(Methods|Fields|Constructors|Elements)/.test(t);
  } catch {
    return false;
  }
}

/**
 * 页面上的生产者标记（只看 frontmatter 前 12 行，不整文件扫）。
 * `--force` 续跑判据：已带当前 PRODUCER_REV 的页说明本轮已经抓过，跳过；否则重抓。
 */
function producedByCurrent(filePath) {
  if (!existsSync(filePath)) return false;
  try {
    const head = readFileSync(filePath, "utf-8").slice(0, 600);
    return head.includes(`fetchedWith: "${PRODUCER_REV}"`);
  } catch {
    return false;
  }
}

/**
 * 递归收集目录下文件的相对路径（posix 分隔）。
 * `ext` 给定 = 只要该后缀（孤儿对账用 ".md"）；不给 = 全部文件（抖动残留清尾用，残留正是非 .md）。
 */
function walkRel(dir, base = dir, out = [], ext = null) {
  if (!existsSync(dir)) return out;
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walkRel(p, base, out, ext);
    else if (!ext || e.name.endsWith(ext)) out.push(relative(base, p).split(sep).join("/"));
  }
  return out;
}

/**
 * 存量清理：把 `_orphan-report.json` 点名的页从 `raw/` 与 `processed/` **同时**删掉。
 *
 * 为什么两边一起删：`processed/` 是 `raw/` 的压平镜像（`a/b/C.md` → `a_b_C.md`），
 * `forge-javadoc-indexer.js` 只往里补、不往外剪。只删 raw 会让 G3 的
 * 「raw 篇数 == processed 篇数」当场红，而错档正文仍会被读侧取到。
 *
 * 默认**只出清单**（删除属高风险操作，AGENTS「删除类只做清单不代删」），
 * 要真删须显式 `--confirm=prune-orphans`。
 *
 * @param {{mcVersion:string}[]} versions
 * @param {boolean} confirmed
 */
/**
 * 真删留痕记录（`_orphan-pruned.json`）的形状。单独成函数是为了能被 §S9 直接断言：
 * 这条记录是「删除动作在库里唯一的可核对凭据」，字段散在调用点里写会静默漂移。
 * 判据门 `assert-javadoc-orphan-record.mjs` 反向核它点名的路径在盘上确实不存在。
 */
export function orphanPrunedRecord(mcVer, rels) {
  return {
    version: mcVer,
    producerRev: PRODUCER_REV,
    prunedAt: new Date().toISOString(),
    note: "本档按 _orphan-report.json 点名真删过的页（raw + processed 双边同删）。写一次即冻结：孤儿报告会被下次抓取覆盖，这份不会。",
    count: rels.length,
    files: rels,
  };
}

function pruneOrphans(versions, confirmed) {
  const plan = [];
  const rejected = [];
  const skipped = [];
  for (const v of versions) {
    const verDir = join(OUT_DIR, v.mcVersion);
    const reportPath = join(verDir, "_orphan-report.json");
    if (!existsSync(reportPath)) {
      // 没有报告 = 这一档从没做过对账（多半是抓取时有页失败 ⇒ 生产者刻意跳过）。不能当成"没有孤儿"。
      skipped.push(`${v.mcVersion}：无 _orphan-report.json ⇒ 孤儿未核，一档不动`);
      continue;
    }
    let rep = null;
    try {
      rep = JSON.parse(readFileSync(reportPath, "utf-8"));
    } catch (e) {
      rejected.push(`${v.mcVersion}：报告解析失败 ${e.message}`);
      continue;
    }
    if (rep.version !== v.mcVersion) {
      rejected.push(`${v.mcVersion}：报告里写的是 ${rep.version} ⇒ 报告与档位不符，拒绝按它删`);
      continue;
    }
    if (rep.producerRev !== PRODUCER_REV) {
      rejected.push(`${v.mcVersion}：报告出自生产者 ${rep.producerRev}，与当前 ${PRODUCER_REV} 不符 ⇒ 可能已过期，先重抓再对账`);
      continue;
    }
    for (const rel0 of rep.files ?? []) {
      const rel = String(rel0);
      // 报告是磁盘上的 JSON，可被手改；删除路径必须自己把关：只要 raw/ 下的 .md，不许越界。
      if (!rel.endsWith(".md") || rel.startsWith("/") || /^[A-Za-z]:/.test(rel) || rel.split("/").includes("..")) {
        rejected.push(`${v.mcVersion}：报告里这条不是 raw 内的相对 .md ⇒ 跳过 ${rel}`);
        continue;
      }
      plan.push({
        mcVer: v.mcVersion,
        rawPath: join(verDir, "raw", ...rel.split("/")),
        procPath: join(verDir, "processed", rel.replace(/\.md$/, "").split("/").join("_") + ".md"),
        rel,
      });
    }
  }

  console.log(`\n=== 孤儿清理（${confirmed ? "已确认，真删" : "干跑，只出清单"}）===`);
  for (const s of skipped) console.log(`  ⏭ ${s}`);
  for (const r of rejected) console.log(`  ❌ ${r}`);
  const perVer = new Map();
  for (const p of plan) perVer.set(p.mcVer, (perVer.get(p.mcVer) ?? 0) + 1);
  console.log(`  清单：${plan.length} 条${plan.length ? `（${[...perVer].map(([k, n]) => `${k}=${n}`).join(" · ")}）` : ""}`);
  for (const p of plan.slice(0, 40)) {
    const rawOk = existsSync(p.rawPath);
    const procOk = existsSync(p.procPath);
    console.log(`    ${p.mcVer}/${p.rel}  raw:${rawOk ? "在" : "缺"}  processed:${procOk ? "在" : "缺"}`);
  }
  if (plan.length > 40) console.log(`    …另 ${plan.length - 40} 条`);
  if (!confirmed) {
    console.log("  未删除。确认无误后加 `--confirm=prune-orphans` 再跑一次。");
    if (rejected.length) process.exitCode = 1;
    return;
  }
  let removed = 0, missingRaw = 0, missingProc = 0, failed = 0;
  // 删除留痕：`_orphan-report.json` 会被下一次抓取的孤儿对账**原地覆盖**（那是"当前还有多少孤儿"
  // 的快照，不是删除记录）。所以真删时另写一份 `_orphan-pruned.json`，由
  // `assert-javadoc-orphan-record.mjs` 反向核「它点名的路径在盘上确实不存在」——
  // 否则一次删除在库里零留痕，事后只能靠 git 状态反推（本轮第一次清理就是这个情况）。
  const deletedByVer = new Map();
  for (const p of plan) {
    let ok = true;
    for (const [path, tag] of [[p.rawPath, "raw"], [p.procPath, "processed"]]) {
      if (!existsSync(path)) { if (tag === "raw") missingRaw++; else missingProc++; continue; }
      try {
        unlinkSync(path);
        removed++;
        if (tag === "raw") {
          const list = deletedByVer.get(p.mcVer) ?? [];
          list.push(p.rel);
          deletedByVer.set(p.mcVer, list);
        }
      } catch (e) { failed++; ok = false; console.log(`    ❌ 删不掉 ${path}（${e.code ?? e.message}）`); }
    }
    if (ok) void 0;
  }
  console.log(`  删除：${removed} 个文件；raw 侧本就缺 ${missingRaw}、processed 侧本就缺 ${missingProc}；失败 ${failed}`);
  for (const [mcVer, rels] of deletedByVer) {
    const recPath = join(OUT_DIR, mcVer, "_orphan-pruned.json");
    try {
      writeFileSync(recPath, JSON.stringify(orphanPrunedRecord(mcVer, rels), null, 2), "utf-8");
      console.log(`  📝 删除留痕 ${rels.length} 条 → data/forge_javadoc/${mcVer}/_orphan-pruned.json`);
    } catch (e) {
      console.log(`  ❌ 留痕写盘失败 ${recPath}（${e.code ?? e.message}）⇒ 判据门会因"缺留痕"红，别手补`);
      failed++;
    }
  }
  console.log("  下一步：`node scripts/forge-javadoc-indexer.js` 重建索引 → `build-semantic-index.mjs`（若该族有语义库）→ G3/G4/corpus-semantics 重签台账。");
  if (failed || rejected.length) process.exitCode = 1;
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const force = args.includes("--force");
  const parallel = Math.max(1, Math.min(8, Number(process.env.MC_SKILL_JAVADOC_PARALLEL ?? 4)));

  const targetVer = args.find(a => a.startsWith("--version="))?.split("=")[1];

  const versions = targetVer
    ? JAVADOC_VERSIONS.filter(v => v.mcVersion === targetVer)
    : JAVADOC_VERSIONS;

  if (versions.length === 0) {
    console.error(`❌ 未找到版本 ${targetVer}，可用版本：${JAVADOC_VERSIONS.map(v => v.mcVersion).join(", ")}`);
    process.exitCode = 1;   // 以前 return ⇒ rc=0，脚本"成功"地什么都没抓
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

  if (args.includes("--prune-orphans")) {
    // 存量清理不属于抓取：单独一条腿，默认只出清单，`--confirm=prune-orphans` 才动删。
    pruneOrphans(versions, args.includes("--confirm=prune-orphans"));
    return;
  }

  const rollup = [];
  for (const v of versions) {
    rollup.push(await fetchVersion(v, force, parallel));
  }

  const badPages = rollup.reduce((n, r) => n + r.failPages.length, 0);
  const badWrites = rollup.reduce((n, r) => n + r.writeFail.length, 0);
  const badPkgs = rollup.reduce((n, r) => n + r.failedPackages, 0);
  const unchecked = rollup.filter((r) => r.orphanCheck === "skipped").map((r) => r.mcVer);
  const orphans = rollup.reduce((n, r) => n + r.orphans.length, 0);
  console.log("\n=== 汇总 ===");
  for (const r of rollup) {
    // 「孤儿 0」与「没核孤儿」不是一回事：后者必须显式写出来，否则读日志的人会以为盘上已经干净
    const orphanText = r.orphanCheck === "skipped" ? "孤儿 未核（本轮未完成）" : `孤儿 ${r.orphans.length}`;
    console.log(`  ${r.mcVer}: 计划 ${r.planned} / 写成功 ${r.wrote} / 续跑跳过 ${r.skipped} / 页失败 ${r.failPages.length} / 写失败 ${r.writeFail.length} / 包失败 ${r.failedPackages} / 0成员 ${r.zeroMember ?? 0}（解析 ${r.parsedPages ?? 0} 页，${((r.zeroMemberRatio ?? 0) * 100).toFixed(1)}%）/ 空解析 ${r.emptyPages.length} / ${orphanText}`);
  }
  console.log(
    `  合计：页失败 ${badPages} · 写失败 ${badWrites} · 包失败 ${badPkgs} · 孤儿 ${orphans}` +
    (unchecked.length ? `（另有 ${unchecked.length} 档未核：${unchecked.join(" ")}）` : ""),
  );
  if (badPages || badWrites || badPkgs) {
    process.exitCode = 1;   // 「取不到」不是「上游没有」，更不是"跑完了"
    console.error("❌ 有页/包未成功 ⇒ 退出码非 0；重跑同一命令会按 fetchedWith 续跑，不从头再来");
  }
  // 判据⑥批量腿：0 成员率超线 = 解析器与这一代 HTML 整体错配。这种一轮**写盘全成功**、
  // 页失败 0、包失败 0，只按上面三条判会 rc=0 —— 2026-09-22 的事故就是这么"成功"的。
  const badRatio = rollup.filter((r) => (r.parsedPages ?? 0) >= 200 && (r.zeroMemberRatio ?? 0) > ZERO_MEMBER_RATIO_MAX);
  if (badRatio.length) {
    process.exitCode = 1;
    console.error(`❌ ${badRatio.map((r) => `${r.mcVer} ${(r.zeroMemberRatio * 100).toFixed(1)}%`).join(" · ")} 页解析出 0 成员（> ${(ZERO_MEMBER_RATIO_MAX * 100).toFixed(0)}%）⇒ 语料不可信，先修 parseClassPage，别签台账。`);
  }
  if (orphans) {
    console.log(`⚠️ 孤儿清单只出报告，不代删（删除需显式确认）：${rollup.filter(r => r.orphans.length).map(r => `${r.mcVer}→data/forge_javadoc/${r.mcVer}/_orphan-report.json`).join(" ")}`);
  }

  // 尾行不能说"全部完成"：这一轮崩在第 22 页也只 console.error ⇒ 四小时作业读日志的人以为收工了。
  console.log(process.exitCode ? "\n⛔ 本轮未收口（见上方 ❌）：台账别签，按 fetchedWith 续跑同一命令即可。" : "\n✅ 全部完成！");
}

// 只在直接执行时抓取；被 import（test-scripts.mjs 取 planClassWrites）时不得启动
// 联网爬取，否则跑测试就会真写 data/forge_javadoc。
const invokedDirectly =
  !!process.argv[1] &&
  import.meta.url.toLowerCase() ===
    pathToFileURL(process.argv[1]).href.toLowerCase();
if (invokedDirectly) {
  main().catch((e) => {
    console.error("❌ 抓取中断：", e?.stack ?? e);
    process.exitCode = 1;   // 旧写法只 console.error ⇒ rc=0，四小时的作业崩在第 22 页也算"成功"
  });
}
