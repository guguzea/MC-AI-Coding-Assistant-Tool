/**
 * bedrock-corpus.mjs — 基岩语料管线共用件（fetch-bedrock-docs.js / fetch-bedrock-script-api.mjs 共用）。
 *
 * 为什么存在：两摄取器都要（a）在 OneDrive 卷上抗 -4094 抖动写盘、（b）往同一份
 * `index-l0.json` 里 upsert 自己的页（否则后跑的会把先跑的清空）、（c）用同一套 Learn 页
 * 版本指纹口径。放一份，避免两文件各写一遍、口径分叉。
 *
 * 网络腿一律走 scripts/_lib/fetch-with-ua.mjs（curl --ssl-no-revoke 优先，Node fetch 兜底），
 * 本文件不自己开 https。
 */
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync, renameSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

export const HERE = dirname(fileURLToPath(import.meta.url));
export const REPO_ROOT = resolve(HERE, "..", "..", "..");
export const DATA = join(REPO_ROOT, "data");
export const VIEW = "minecraft-bedrock-stable";
export const LEARN_BASE = "https://learn.microsoft.com/en-us/minecraft/creator/";
export const TOC_URL = `${LEARN_BASE}toc.json?view=${VIEW}`;
/** 语料树：与既有 20 篇同目录（FabricDocStore 薄树约定 = index-l0.json + processed/<bare>.md）。 */
export const OUT_DIR = join(DATA, "bedrock_stable", "bedrock-docs", "stable");
export const PROCESSED_DIR = join(OUT_DIR, "processed");
export const INDEX_L0 = join(OUT_DIR, "index-l0.json");
export const STATUS_PATH = join(DATA, "bedrock-docs-status.json");
export const FINGERPRINTS = join(OUT_DIR, "fingerprints.json");

/**
 * Script API 语料树（2026-09-21 拆分）：npm `@minecraft/server` 的 index.d.ts 逐声明页与
 * Microsoft Learn 文档页是**两种体裁**（前者中位 ~380 字符/页、后者 ~5680 字符/页），挤在同一棵
 * `bedrock-docs/stable/` 下会把 `assert-corpus-semantics` 的整树 median 拉到两种体裁都盖不住的
 * 低值（实测混树 median=626，地板被迫手签到 360 ⇒ 判据实质失效）。拆成独立语料树后各配一条地板。
 * 树形与文档树一致：`index-l0.json + processed/**`（semantic/ 由 build-semantic-index 生成）。
 * id 前缀保持 `stable/scriptapi/`（与拆分前逐字相同 ⇒ 既有 id 链接、语义库 doc_id、门夹具全部可回溯，
 * 且与文档页 id（`stable/documents/…` / `stable/<bare>`）天然不同一命名空间）。
 */
export const SCRIPTAPI_SOURCE = "bedrock-scriptapi";
export const SCRIPTAPI_OUT_DIR = join(DATA, "bedrock_stable", SCRIPTAPI_SOURCE, "stable");
export const SCRIPTAPI_PROCESSED_DIR = join(SCRIPTAPI_OUT_DIR, "processed");
export const SCRIPTAPI_INDEX_L0 = join(SCRIPTAPI_OUT_DIR, "index-l0.json");

/** 直接跑才执行、被 import 不执行。裸拼 file:///${argv[1]} 在本机非 ASCII 路径上恒不相等。 */
export function isDirectRun(metaUrl) {
  const entry = process.argv[1];
  if (!entry) return false;
  try {
    return import.meta.url === metaUrl || pathToFileURL(resolve(entry)).href === metaUrl;
  } catch {
    return false;
  }
}

export function sha(s) {
  return createHash("sha256").update(String(s)).digest("hex");
}
/** 短哈希：口径与既有 hashRevision 一致（sha256 后取前 12 位）。 */
export function shortHash(parts) {
  const list = Array.isArray(parts) ? parts : [String(parts ?? "")];
  return sha(list.join("\n")).slice(0, 12);
}

/**
 * OneDrive 卷上 writeFileSync 偶发 UNKNOWN/-4094。退避 200/600/1500ms 三次；
 * 仍失败则抛出，由调用方计失败并让退出码非 0（同 scripts/fetch-forge-docs.js 的 writePage 口径）。
 */
export async function writeWithRetry(filePath, text, delays = [200, 600, 1500]) {
  mkdirSync(dirname(filePath), { recursive: true });
  let last;
  for (let i = 0; i <= delays.length; i++) {
    try {
      // 先写临时名再 rename：抖动时半写字面比失败更糟（半截 md 会被索引成一篇「有内容」的页）。
      const tmp = `${filePath}.${process.pid}.tmp`;
      writeFileSync(tmp, text, "utf8");
      try {
        renameSync(tmp, filePath);
      } catch (e) {
        try {
          writeFileSync(filePath, readFileSync(tmp));
          try { existsSync(tmp) && writeFileSync(`${tmp}.done`, ""); } catch { /* 清不掉就算了 */ }
          // 兜底路径只把正文挪进终名，.tmp 得自己收掉：rename 被抖动挡下时它带着**整页正文**
          // 留在 processed/ 里（实测一轮 scriptapi 留下 3 个 .tmp + 3 个 .done）。各遍历器只认
          // .md 所以不致错，但语料目录里多出一份可被误当正文的同名副本，不该由下一轮再清。
          try { rmSync(tmp, { force: true }); } catch { /* 只留 0 字节 .done 记账，不阻断写入 */ }
        } catch {
          throw e;
        }
      }
      return;
    } catch (e) {
      last = e;
      if (i >= delays.length) break;
      await new Promise((r) => setTimeout(r, delays[i]));
    }
  }
  throw last;
}

export async function writeJsonWithRetry(filePath, obj) {
  await writeWithRetry(filePath, `${JSON.stringify(obj, null, 2)}\n`);
}

/**
 * index-l0.json upsert：只替换/追加本次给出的 id，保留其它来源的条目。
 * （2026-09-21 拆分后两棵树各用各的 INDEX_L0 / SCRIPTAPI_INDEX_L0，同树内一般只剩单一来源；
 * upsert 语义保留，防的是「同一棵树里改名/碰撞产生的旧 id 覆盖别人」。）
 */
export function mergeIndexL0(entries, existingPath = INDEX_L0) {
  let prev = [];
  if (existsSync(existingPath)) {
    try {
      const parsed = JSON.parse(readFileSync(existingPath, "utf8"));
      if (Array.isArray(parsed)) prev = parsed;
    } catch {
      /* 坏文件按空处理，但下面会整体重写，不会留下半截 */
    }
  }
  const byId = new Map(prev.map((e) => [e.id, e]));
  for (const e of entries) byId.set(e.id, e);
  return [...byId.values()].sort((a, b) => String(a.id).localeCompare(String(b.id)));
}

/**
 * 把索引里「正文文件已不存在」的条目剪掉，用**大小写敏感**的真实文件名核对。
 *
 * 为什么需要：`mergeIndexL0` 只按 id upsert、从不删。改名 / 碰撞后缀 / 上游删页都会让旧 id
 * 留在索引里 —— 实测 scriptapi 换碰撞后缀后 index-l0 884 条而盘上 882 个 md，多出来的
 * `stable/scriptapi/system`、`stable/scriptapi/world` 两条在 NTFS 上还会被大小写不敏感地
 * 解析到 `System.md`，于是「索引说有、正文却是另一页」。`existsSync` 在这种卷上区分不了，
 * 只能拿 `readdirSync` 的存量名做大小写敏感比对。
 *
 * 只处理 `namespace` 前缀下的 id（谁写谁负责剪），其余条目原样透传。
 *
 * @param {{id?:string}[]} entries 合并后的索引
 * @param {string} namespace 该命名空间的 id 前缀，如 "stable/scriptapi/"
 * @param {string} dir 该命名空间的正文目录
 * @returns {{kept:object[], pruned:{id:string,expectedFile:string}[]}}
 */
export function pruneIndexToDisk(entries, namespace, dir) {
  const real = new Set(
    existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith(".md")) : [],
  );
  if (!real.size) return { kept: entries, pruned: [] }; // 目录空/不存在 ⇒ 不动，宁留待查也不清空索引
  const kept = [];
  const pruned = [];
  for (const e of entries) {
    const id = String(e.id ?? "");
    if (!id.startsWith(namespace)) { kept.push(e); continue; }
    const fileName = id.slice(namespace.length) + ".md";
    if (real.has(fileName)) kept.push(e);
    else pruned.push({ id, expectedFile: fileName });
  }
  return { kept, pruned };
}

/**
 * 从 Learn 页 HTML 里抽版本指纹。
 * 实测（2026-09-21，documents/gettingstarted）该站注入的 meta 带：
 *   document_id=63ee92b3-… / updated_at=2026-01-28T23:26:00Z
 *   gitcommit=https://github.com/MicrosoftDocs/minecraft-creator-pr/blob/<40位sha>/creator/Documents/GettingStarted.md
 * gitcommit 里的 sha 是**上游真 git commit**，文档一改就换 ⇒ 能真变，适合当探针字段。
 */
export function learnPageFingerprint(html) {
  const h = String(html || "");
  const meta = (name) => {
    const m = h.match(new RegExp(`<meta[^>]+name="${name}"[^>]+content="([^"]*)"`, "i")) ||
      h.match(new RegExp(`<meta[^>]+content="([^"]*)"[^>]+name="${name}"`, "i"));
    return m ? m[1] : null;
  };
  const git = meta("gitcommit");
  const commit = git ? (git.match(/\/blob\/([0-9a-f]{40})\//i)?.[1] ?? null) : null;
  return {
    documentId: meta("document_id"),
    updatedAt: meta("updated_at"),
    commit,
    commitUrl: commit ? git : null,
  };
}

/** 抓到的正文里去掉 Learn 的授权提示 / 工具条噪音。 */
const NOISE_LINES = [
  /^Access to this page requires authorization/i,
  /^You can try signing in or changing directories/i,
  /^Read in English$/i,
  /^Table of contents$/i,
  /^Copy Markdown$/i,
  /^Add to Plans$/i,
  /^Summarize this article for me$/i,
  /^Ask Learn/i,
  /^Feedback$/i,
  /^Print$/i,
  /^Note$/i,
  /^Edit$/i,
  /^Add$/i,
];

function decode(s) {
  return String(s)
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");
}

/** HTML 表格 → markdown 管道表（Learn 的 API/组件表是正文主体，丢了就等于没抓）。 */
function tableToMd(tableHtml) {
  const rows = [...tableHtml.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)].map((r) =>
    [...r[1].matchAll(/<(?:td|th)[^>]*>([\s\S]*?)<\/(?:td|th)>/gi)].map((c) =>
      decode(c[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ")).trim().replace(/\|/g, "\\|"),
    ),
  );
  const usable = rows.filter((r) => r.length);
  if (!usable.length) return "";
  const width = Math.max(...usable.map((r) => r.length));
  const lines = usable.map((r) => `| ${[...r, ...Array(width - r.length).fill("")].join(" | ")} |`);
  lines.splice(1, 0, `|${Array(width).fill(" --- ").join("|")}|`);
  return `\n${lines.join("\n")}\n`;
}

/**
 * Learn 页 → markdown。
 * 与既有 20 篇的**格式约定保持一致**：三行 `> ` 引用头（来源 / 抓取时间 / 警告）+ 正文，无 YAML frontmatter。
 * 差别只在正文：旧实现把整棵 DOM（含导航菜单、页脚版权）压成扁平文本，这里只取 `<main>` 并从第一个
 * `<h1>` 起，保留标题层级 / 列表 / 代码块 / 表格 —— 语料变干净，不是变薄。
 */
export function learnToMarkdown(html, url) {
  const h = String(html || "");
  let s = h.indexOf("<main");
  let e = h.indexOf("</main>", s);
  if (s < 0 || e < 0) {
    s = h.indexOf('<div class="content"');
    e = h.length;
  }
  let body = s >= 0 ? h.slice(s, e) : h;
  body = body.replace(/<(script|style|nav|header|footer|svg|iframe|noscript|aside|form)[\s\S]*?<\/\1>/gi, " ");
  const h1 = body.search(/<h1[\s>]/i);
  if (h1 > 0) body = body.slice(h1);
  const extra = body.search(/<h[23][^>]*>\s*Additional resources\s*<\/h[23]>/i);
  if (extra > 0) body = body.slice(0, extra);

  body = body
    .replace(/<pre[^>]*>([\s\S]*?)<\/pre>/gi, (_m, inner) => {
      const lang = /class="[^"]*lang-([\w-]+)/i.exec(_m)?.[1] ?? "";
      const code = decode(inner.replace(/<[^>]+>/g, "")).replace(/^\n+|\n+$/g, "");
      return `\n\n\`\`\`${lang}\n${code}\n\`\`\`\n\n`;
    })
    .replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, (_m, t) => `\n\n# ${decode(t.replace(/<[^>]+>/g, "")).trim()}\n\n`)
    .replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, (_m, t) => `\n\n## ${decode(t.replace(/<[^>]+>/g, "")).trim()}\n\n`)
    .replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, (_m, t) => `\n\n### ${decode(t.replace(/<[^>]+>/g, "")).trim()}\n\n`)
    .replace(/<h([4-6])[^>]*>([\s\S]*?)<\/h\1>/gi, (_m, d, t) => `\n\n${"#".repeat(+d + 1)} ${decode(t.replace(/<[^>]+>/g, "")).trim()}\n\n`)
    .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_m, t) => `- ${decode(t.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ")).trim()}\n`)
    .replace(/<(p|div|section|tr|br)[^>]*>/gi, "\n")
    .replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, (_m, t) => `\`${decode(t.replace(/<[^>]+>/g, "")).trim()}\``)
    .replace(/<(\w+)[^>]*>/gi, " ");

  // 表格单独走一遍（上面的通用剥标签会把 <table> 打散）
  const withTables = body.replace(/<table[\s\S]*?<\/table>/gi, (t) => tableToMd(t));

  const text = decode(withTables.replace(/<[^>]+>/g, " "))
    .split(/\n/)
    .map((l) => l.replace(/[ \t\u00a0]+/g, " ").trimEnd())
    .filter((l) => !NOISE_LINES.some((re) => re.test(l.trim())))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return text;
}

/** 三行引用头（与既有 20 篇逐字同构）。 */
export function bedrockMdHeader(url, extraLines = []) {
  return [
    `> 来源：${url}`,
    `> 抓取时间：${new Date().toISOString()}`,
    "> 警告：此文档可能滞后于当前正式版",
    ...extraLines.map((l) => `> ${l}`),
    "",
    "",
  ].join("\n");
}

export function readJsonSafe(p) {
  try {
    return existsSync(p) ? JSON.parse(readFileSync(p, "utf8")) : null;
  } catch {
    return null;
  }
}

export function readStatus() {
  return readJsonSafe(STATUS_PATH) ?? {};
}
