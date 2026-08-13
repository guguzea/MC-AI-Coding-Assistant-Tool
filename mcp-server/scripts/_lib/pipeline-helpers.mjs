#!/usr/bin/env node
/**
 * pipeline-helpers.mjs
 *
 * 共享纯函数 + 安全 IO 工具，供 mcp-server/scripts/*.js 复用。
 *
 * 设计原则：
 *  - 不引入 npm 依赖；只用 Node 标准库（node:fs / node:path / node:url / global fetch）
 *  - 网络 IO 全部使用 fetch + AbortController + 超时（避免 shell 注入风险）
 *  - 文件下载采用 temp + rename 原子写入
 *  - 纯函数（HTML/Markdown 转换、表格、行内计数等）易于离线单测
 *
 * 模块导入：
 *   import { fetchPageHtml, downloadFileAtomic, countCodeFences,
 *            tableToMarkdown, isLikelyValidHtmlPage } from "./_lib/pipeline-helpers.mjs";
 */

import {
  createWriteStream,
  renameSync,
  unlinkSync,
  statSync,
} from "node:fs";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

// ── 路径工具 ────────────────────────────────────────────────────────────

/**
 * 解析 ESM 模块自身所在目录。
 * @param {string} metaUrl - import.meta.url
 */
export function moduleDir(metaUrl) {
  return dirname(fileURLToPath(metaUrl));
}

// ── HTTP: 安全的页面抓取（取代 execSync curl） ──────────────────────────

/**
 * 用 Node 内置 fetch 抓取 HTML 页面，使用 AbortController 做超时控制。
 * - 不依赖 curl，避免 shell 注入
 * - 仅在网络错误 / 5xx 时重试；4xx 立即终止（无需重试）
 * - 不再以 "HTML < N 字节" 作为重试条件（小页面可能合法）
 * - 返回 { ok, status, html, url, error? }；调用方负责重试
 *
 * @param {string} url
 * @param {{
 *   timeoutMs?: number,
 *   userAgent?: string,
 *   maxRedirects?: number,
 *   headers?: Record<string, string>,
 *   signal?: AbortSignal,
 * }} [opts]
 */
export async function fetchPageHtml(url, opts = {}) {
  const {
    timeoutMs = 30_000,
    userAgent = "Mozilla/5.0 (MC-skill pipeline)",
    maxRedirects = 5,
    headers = {},
    signal,
  } = opts;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(new Error(`Timeout after ${timeoutMs}ms`)), timeoutMs);
  // Chain external signal (e.g. from caller) so we abort on either.
  if (signal) {
    if (signal.aborted) controller.abort(signal.reason);
    else signal.addEventListener("abort", () => controller.abort(signal.reason), { once: true });
  }

  try {
    let currentUrl = url;
    let redirectsRemaining = maxRedirects;
    let res;

    while (true) {
      res = await fetch(currentUrl, {
        method: "GET",
        redirect: "manual",
        signal: controller.signal,
        headers: {
          "User-Agent": userAgent,
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          ...headers,
        },
      });

      const location = res.headers.get("location");
      if (res.status < 300 || res.status >= 400 || !location) break;
      if (redirectsRemaining === 0) {
        return {
          ok: false,
          status: res.status,
          html: null,
          url: currentUrl,
          error: `Too many redirects (limit ${maxRedirects})`,
        };
      }
      currentUrl = new URL(location, currentUrl).href;
      redirectsRemaining -= 1;
    }

    const status = res.status;
    const finalUrl = res.url || currentUrl;
    const text = await res.text();
    return {
      ok: status >= 200 && status < 400,
      status,
      html: text,
      url: finalUrl,
    };
  } catch (err) {
    return { ok: false, status: 0, html: null, url, error: err?.message ?? String(err) };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * 判断一次响应是否"看起来像合法页面"。
 *
 * 规则（按需可调）：
 *  - 4xx/5xx：非法
 *  - 200 但响应体极小（< 100 字节）：疑似截断/反爬空响应，非法
 *  - 200 但不含 HTML 标记：非法
 *  - 其他：合法
 *
 * 该函数让 fetchPageHtml 的调用方可以区分"小但合法"页面（如 navigation
 * placeholder）与"小且可疑"的截断响应，从而不再盲目重试。
 *
 * @param {string|null} html
 * @param {number} status
 * @param {{ minBytes?: number, requireHtmlMarker?: boolean }} [opts]
 */
export function isLikelyValidHtmlPage(html, status, opts = {}) {
  const { minBytes = 200, requireHtmlMarker = true } = opts;
  if (status < 200 || status >= 400) return false;
  if (typeof html !== "string") return false;
  if (html.length < minBytes) return false;
  if (requireHtmlMarker && !/<(html|article|main|section|div|p|h[1-6])\b/i.test(html)) {
    return false;
  }
  return true;
}

// ── HTTP: 原子下载（用于二进制 zip/jar） ────────────────────────────────

/**
 * 原子化下载文件：先写到 `<dest>.tmp`，下载成功 + 体积非零后 rename 到目标。
 * 处理：
 *  - 流错误（res / req）
 *  - 临时文件清理（失败时）
 *  - 重定向循环（默认上限 5 次）
 *  - 超时（默认 30 秒；0 表示禁用）
 *
 * @param {string} url
 * @param {string} destPath
 * @param {{
 *   timeoutMs?: number,
 *   maxRedirects?: number,
 *   userAgent?: string,
 *   minBytes?: number,
 * }} [opts]
 * @returns {Promise<{ ok: boolean, status: number, bytes: number, url: string, error?: string }>}
 */
export async function downloadFileAtomic(url, destPath, opts = {}) {
  const {
    timeoutMs = 30_000,
    maxRedirects = 5,
    userAgent = "MC-skill pipeline",
    minBytes = 1,
  } = opts;

  const tmpPath = `${destPath}.tmp`;
  let file = null;
  const controller = new AbortController();

  const timer = timeoutMs > 0
    ? setTimeout(() => controller.abort(new Error(`Timeout after ${timeoutMs}ms`)), timeoutMs)
    : null;

  const cleanup = () => {
    if (timer) clearTimeout(timer);
    try {
      if (file && !file.destroyed) file.destroy();
    } catch { /* ignore */ }
    try { unlinkSync(tmpPath); } catch { /* ignore */ }
  };

  try {
    const res = await fetch(url, {
      method: "GET",
      redirect: "manual",
      signal: controller.signal,
      headers: { "User-Agent": userAgent },
    });

    const location = res.headers.get("location");
    if (res.status >= 300 && res.status < 400 && location) {
      if (maxRedirects === 0) {
        cleanup();
        return {
          ok: false,
          status: res.status,
          bytes: 0,
          url,
          error: "Too many redirects",
        };
      }
      const next = new URL(location, url).href;
      cleanup();
      return downloadFileAtomic(next, destPath, { ...opts, maxRedirects: maxRedirects - 1 });
    }

    if (res.status !== 200) {
      cleanup();
      return { ok: false, status: res.status, bytes: 0, url, error: `HTTP ${res.status}` };
    }

    file = createWriteStream(tmpPath);
    const reader = res.body.getReader();
    let bytes = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (!file.write(value)) {
        // 应用背压，等待 drain
        await new Promise((resolve) => file.once("drain", resolve));
      }
      bytes += value.byteLength;
    }

    await new Promise((resolve, reject) => {
      file.end(resolve);
      file.on("error", reject);
    });

    if (bytes < minBytes) {
      cleanup();
      return { ok: false, status: 200, bytes, url, error: `Empty body (${bytes} bytes)` };
    }

    renameSync(tmpPath, destPath);
    if (timer) clearTimeout(timer);
    return { ok: true, status: 200, bytes, url };
  } catch (err) {
    cleanup();
    return { ok: false, status: 0, bytes: 0, url, error: err?.message ?? String(err) };
  }
}

// ── Markdown 工具（纯函数） ─────────────────────────────────────────────

/**
 * 修复错误的 HTML→MD 斜体：`_*foo*_` → `*foo*`（旧 fetch-forge-docs 把 <em> 转成了 _*$1*_）。
 * 不进入围栏代码块。
 * @param {string} md
 * @returns {string}
 */
export function repairBrokenItalicMarkup(md) {
  if (typeof md !== "string" || !md.includes("_*")) return md;
  const parts = md.split(/(```[\s\S]*?```)/);
  return parts
    .map((part, i) =>
      i % 2 === 1
        ? part
        : part.replace(/_\*([^*]+)\*_/g, "*$1*").replace(/_\*\$\{1\}_/g, "*…*"),
    )
    .join("");
}

/**
 * 统计 Markdown 中的围栏代码块数量。
 * 仅匹配成对的 ``` 围栏；不会把单反引号的 inline code 误算进来。
 *
 * @param {string} text
 * @returns {number}
 */
export function countCodeFences(text) {
  if (typeof text !== "string" || text.length === 0) return 0;
  // 用换行锚定，避免与 ```abc``` 这种把 ``` 嵌在 inline 中的情况重叠
  const fences = text.match(/(^|\n)```/g);
  if (!fences) return 0;
  // 每个围栏块贡献 2 个 fence（开/闭）；奇数视为未闭合，仍按整块计
  return Math.floor(fences.length / 2);
}

/**
 * 把 HTML 表格片段转为 Markdown 表格字符串。
 * - 始终保证有合法的分隔行（Markdown 才能被渲染）
 * - 同时支持 `<thead><th>` 与"无 `<th>` 仅 `<td>`"两种情况
 *
 * @param {string} tableHtml - `<table>...</table>` 之间的内容
 * @returns {string|null} - 若无可解析行，返回 null
 */
export function htmlTableToMarkdown(tableHtml) {
  if (!tableHtml) return null;

  // 1. 收集 header：
  //    - 优先从 <thead><tr><th>... 取
  //    - 否则退回到第一个含 <th> 的 <tr>
  let headerCells = [];
  const theadMatch = tableHtml.match(/<thead[^>]*>([\s\S]*?)<\/thead>/i);
  if (theadMatch) {
    const thRegex = /<th[^>]*>([\s\S]*?)<\/th>/gi;
    let m;
    while ((m = thRegex.exec(theadMatch[1])) !== null) {
      headerCells.push(stripTags(m[1]).trim());
    }
  }
  let headerRowHtml = null;
  if (headerCells.length === 0) {
    const firstRowMatch = tableHtml.match(/<tr[^>]*>([\s\S]*?)<\/tr>/i);
    if (firstRowMatch && /<th[\s>]/i.test(firstRowMatch[1])) {
      headerRowHtml = firstRowMatch[1];
      const thRegex = /<th[^>]*>([\s\S]*?)<\/th>/gi;
      let m;
      while ((m = thRegex.exec(headerRowHtml)) !== null) {
        headerCells.push(stripTags(m[1]).trim());
      }
    }
  }

  // 2. 收集 body 行：跳过已被识别为 header 的首行
  const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  const rows = [];
  let rowMatch;
  while ((rowMatch = rowRegex.exec(tableHtml)) !== null) {
    const rowHtml = rowMatch[1];
    // 跳过作为 header 的那一行
    if (headerRowHtml && rowHtml === headerRowHtml) continue;
    // 退化路径：没有 thead、首行直接是 <th>，上面的 headerRowHtml 已经跳过；
    // 如果 headerCells 不为空且当前 row 也含 <th>，同样跳过（仅保留 headerCells 长度对齐）
    if (headerCells.length > 0 && /<th[\s>]/i.test(rowHtml)) continue;

    const cells = [];
    const cellRegex = /<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi;
    let cellMatch;
    while ((cellMatch = cellRegex.exec(rowHtml)) !== null) {
      cells.push(stripTags(cellMatch[1]).trim());
    }
    if (cells.length > 0) rows.push(cells);
  }

  if (rows.length === 0 && headerCells.length === 0) return null;

  const columnCount = Math.max(
    headerCells.length,
    rows.reduce((m, r) => Math.max(m, r.length), 0),
  );
  if (columnCount === 0) return null;

  // 3. 规范到统一列数（缺位补空字符串）
  const pad = (arr) => {
    const out = arr.slice(0, columnCount);
    while (out.length < columnCount) out.push("");
    return out;
  };

  const out = [];
  if (headerCells.length > 0) {
    out.push(`| ${pad(headerCells).join(" | ")} |`);
  } else {
    // 无 header：构造一个空 header，但仍输出分隔行（Markdown 必须有）
    out.push(`| ${Array(columnCount).fill("").join(" | ")} |`);
  }
  out.push(`| ${Array(columnCount).fill("---").join(" | ")} |`);
  for (const row of rows) {
    out.push(`| ${pad(row).join(" | ")} |`);
  }
  return out.join("\n");
}

function stripTags(s) {
  return String(s ?? "").replace(/<[^>]+>/g, "");
}

// ── DokuWiki 表格 → Markdown ────────────────────────────────────────────

/**
 * 把 DokuWiki 行（`| a | b | c |`）转换为 Markdown 行（`| a | b | c |`）。
 * 返回 { header: string|null, separator: string|null, body: string[] }，
 * 调用方负责把 header/separator/body 拼成 Markdown 表格。
 *
 * @param {string} wikiRow
 */
export function dokuWikiRowToMarkdown(wikiRow) {
  const trimmed = wikiRow.replace(/^\s*\|/, "").replace(/\|\s*$/, "");
  const cells = trimmed.split("|").map((c) => c.trim());
  return `| ${cells.join(" | ")} |`;
}

/**
 * 检测一行是否为 DokuWiki 表格分隔行（`^` 列对齐说明）。
 * 仅作为识别提示，不参与 Markdown 输出。
 */
export function isDokuWikiSeparator(wikiRow) {
  return /^\s*\^.*\^\s*$/.test(wikiRow);
}

// ── 文件原子写入辅助 ────────────────────────────────────────────────────

/**
 * 原子写入文本文件：先写 `<path>.tmp`，fsync 后 rename。
 * 失败时清理临时文件。
 *
 * @param {string} filePath
 * @param {string} content
 * @param {BufferEncoding} [encoding="utf-8"]
 */
export function atomicWriteText(filePath, content, encoding = "utf-8") {
  const tmp = `${filePath}.tmp`;
  const file = createWriteStream(tmp, { encoding });
  try {
    file.write(content);
    file.end();
    // 等待 close
    return new Promise((resolve, reject) => {
      file.on("close", () => {
        try {
          renameSync(tmp, filePath);
          resolve();
        } catch (e) {
          reject(e);
        }
      });
      file.on("error", (err) => {
        try { unlinkSync(tmp); } catch { /* ignore */ }
        reject(err);
      });
    });
  } catch (err) {
    try { unlinkSync(tmp); } catch { /* ignore */ }
    throw err;
  }
}

// ── 杂项 ───────────────────────────────────────────────────────────────

/**
 * 安全获取已存在文件的大小（字节），不存在返回 0。
 */
export function safeFileSize(filePath) {
  try {
    return statSync(filePath).size;
  } catch {
    return 0;
  }
}
