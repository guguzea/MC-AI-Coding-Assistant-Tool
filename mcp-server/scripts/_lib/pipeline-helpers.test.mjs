#!/usr/bin/env node
/**
 * pipeline-helpers.test.mjs
 *
 * 离线单测。覆盖所有 *_lib/pipeline-helpers.mjs* 中的纯函数
 * 与可注入 fake fetch 的 fetchPageHtml / downloadFileAtomic。
 *
 * 运行：`node scripts/_lib/pipeline-helpers.test.mjs`
 * 退出码：0 = 全部通过；1 = 有失败。
 *
 * 设计：
 *  - 不联网：所有 IO 都注入 fake。
 *  - 不新增依赖：只用 node:test 与 node:assert（Node 18+ stdlib）。
 *  - 每条用例 try/catch 输出文件名 + 用例名，失败时给出 diff。
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync, readFileSync, existsSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createServer } from "node:http";

// ── 纯函数：countCodeFences ────────────────────────────────────────────

test("countCodeFences: 空字符串/非字符串", () => {
  assert.equal(countCodeFences(""), 0);
  assert.equal(countCodeFences(null), 0);
  assert.equal(countCodeFences(undefined), 0);
});

test("countCodeFences: 单个 fenced block", () => {
  const md = "前文\n```js\nconsole.log(1)\n```\n后文";
  assert.equal(countCodeFences(md), 1);
});

test("countCodeFences: 多个 fenced block", () => {
  const md = "```\na\n```\n中间\n```python\nb\n```";
  assert.equal(countCodeFences(md), 2);
});

test("countCodeFences: 单反引号 inline code 不计入", () => {
  const md = "用 `print()` 输出，不要忘了 `;`";
  assert.equal(countCodeFences(md), 0);
});

test("countCodeFences: 双重 inline 也不计入（不匹配三连反引号）", () => {
  const md = "``nested``code";
  // 两个反引号对，不形成三连
  assert.equal(countCodeFences(md), 0);
});

test("countCodeFences: 未闭合的奇数 fence 仍按整块计", () => {
  const md = "```js\nconst x = 1;\n// 漏掉结尾";
  // 1 个 fence → floor(1/2) = 0
  assert.equal(countCodeFences(md), 0);
});

// ── 纯函数：htmlTableToMarkdown ──────────────────────────────────────────

test("htmlTableToMarkdown: 含 <thead> 与 <th>", () => {
  const html = `
    <table>
      <thead>
        <tr><th>Name</th><th>Value</th></tr>
      </thead>
      <tbody>
        <tr><td>a</td><td>1</td></tr>
        <tr><td>b</td><td>2</td></tr>
      </tbody>
    </table>`;
  const md = htmlTableToMarkdown(html);
  assert.ok(md, "应该返回非空字符串");
  const lines = md.split("\n");
  assert.equal(lines[0], "| Name | Value |");
  assert.equal(lines[1], "| --- | --- |");
  assert.equal(lines[2], "| a | 1 |");
  assert.equal(lines[3], "| b | 2 |");
});

test("htmlTableToMarkdown: 无 <thead>，首行直接 <th>", () => {
  const html = `
    <table>
      <tr><th>Col1</th><th>Col2</th></tr>
      <tr><td>x</td><td>y</td></tr>
    </table>`;
  const md = htmlTableToMarkdown(html);
  assert.ok(md);
  const lines = md.split("\n");
  assert.equal(lines[0], "| Col1 | Col2 |");
  assert.equal(lines[1], "| --- | --- |");
  assert.equal(lines[2], "| x | y |");
});

test("htmlTableToMarkdown: 完全无 <th>，必须仍输出分隔行", () => {
  const html = `
    <table>
      <tr><td>a</td><td>b</td></tr>
      <tr><td>c</td><td>d</td></tr>
    </table>`;
  const md = htmlTableToMarkdown(html);
  assert.ok(md, "应返回非空字符串");
  const lines = md.split("\n");
  // 表头为空但仍要占位
  assert.equal(lines[0], "|  |  |");
  assert.equal(lines[1], "| --- | --- |");
  assert.equal(lines[2], "| a | b |");
  assert.equal(lines[3], "| c | d |");
});

test("htmlTableToMarkdown: 不可解析时返回 null", () => {
  assert.equal(htmlTableToMarkdown(""), null);
  assert.equal(htmlTableToMarkdown("<table></table>"), null);
  assert.equal(htmlTableToMarkdown("<table><tr></tr></table>"), null);
});

test("htmlTableToMarkdown: 列数不均会补空字符串", () => {
  const html = `
    <table>
      <thead><tr><th>A</th><th>B</th><th>C</th></tr></thead>
      <tbody>
        <tr><td>1</td><td>2</td></tr>
        <tr><td>x</td><td>y</td><td>z</td></tr>
      </tbody>
    </table>`;
  const md = htmlTableToMarkdown(html);
  const lines = md.split("\n");
  assert.equal(lines[0], "| A | B | C |");
  assert.equal(lines[1], "| --- | --- | --- |");
  assert.equal(lines[2], "| 1 | 2 |  |"); // 补空
  assert.equal(lines[3], "| x | y | z |");
});

// ── 纯函数：dokuWikiRowToMarkdown ───────────────────────────────────────

test("dokuWikiRowToMarkdown: 标准行", () => {
  assert.equal(
    dokuWikiRowToMarkdown("| a | b | c |"),
    "| a | b | c |",
  );
});

test("dokuWikiRowToMarkdown: 首尾含空白", () => {
  assert.equal(
    dokuWikiRowToMarkdown("  | a | b |  "),
    "| a | b |",
  );
});

test("dokuWikiRowToMarkdown: 保留管道内空格", () => {
  assert.equal(
    dokuWikiRowToMarkdown("| spaced out | tight |"),
    "| spaced out | tight |",
  );
});

// ── 纯函数：isDokuWikiSeparator ─────────────────────────────────────────

test("isDokuWikiSeparator: 识别 ^ 分隔行", () => {
  assert.equal(isDokuWikiSeparator("^ a ^ b ^"), true);
  assert.equal(isDokuWikiSeparator("| a |"), false);
  assert.equal(isDokuWikiSeparator("regular text"), false);
});

// ── 纯函数：isLikelyValidHtmlPage ────────────────────────────────────────

test("isLikelyValidHtmlPage: 4xx/5xx 一律非法", () => {
  const longHtml = "<html>" + "x".repeat(300) + "</html>";
  assert.equal(isLikelyValidHtmlPage(longHtml, 404), false);
  assert.equal(isLikelyValidHtmlPage(longHtml, 500), false);
  assert.equal(isLikelyValidHtmlPage(longHtml, 200), true);
});

test("isLikelyValidHtmlPage: 200 但无 HTML 标记 → 非法", () => {
  // 用 300 字节以上的纯文本来确保能跨过 minBytes 默认门槛
  const plainText = "plain text ".repeat(50);
  assert.equal(isLikelyValidHtmlPage(plainText, 200), false);
});

test("isLikelyValidHtmlPage: 200 但极小 → 非法", () => {
  assert.equal(isLikelyValidHtmlPage("<p>x</p>", 200), false);
});

test("isLikelyValidHtmlPage: 200 + <html> → 合法", () => {
  const html = "<html><body>" + "x".repeat(300) + "</body></html>";
  assert.equal(isLikelyValidHtmlPage(html, 200), true);
});

test("isLikelyValidHtmlPage: requireHtmlMarker=false 时只检查体积", () => {
  const text = "ok no html markers here at all ".repeat(20); // > 200 bytes
  assert.equal(
    isLikelyValidHtmlPage(text, 200, { requireHtmlMarker: false }),
    true,
  );
});

// ── 纯函数：safeFileSize ────────────────────────────────────────────────

test("safeFileSize: 不存在的文件返回 0", () => {
  assert.equal(safeFileSize("/no/such/path/abc.xyz"), 0);
});

test("safeFileSize: 存在文件返回字节数", () => {
  const root = mkdtempSync(join(tmpdir(), "ph-test-"));
  try {
    const p = join(root, "f.txt");
    writeFileSync(p, "hello");
    assert.equal(safeFileSize(p), 5);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

// ── 集成：fetchPageHtml 使用 fake globalThis.fetch ──────────────────────

test("fetchPageHtml: 注入 fake fetch 返回 200", async () => {
  const original = globalThis.fetch;
  globalThis.fetch = async (url, opts) => {
    return new Response("<html><body>hi</body></html>", {
      status: 200,
      headers: { "content-type": "text/html" },
    });
  };
  try {
    const res = await fetchPageHtml("http://example.test/x");
    assert.equal(res.status, 200);
    assert.equal(res.ok, true);
    assert.match(res.html, /<html>/);
  } finally {
    globalThis.fetch = original;
  }
});

test("fetchPageHtml: 超时触发 AbortController", async () => {
  const original = globalThis.fetch;
  globalThis.fetch = (url, opts) =>
    new Promise((_, reject) => {
      opts.signal.addEventListener("abort", () => reject(new Error("aborted")));
    });
  try {
    const res = await fetchPageHtml("http://example.test/x", { timeoutMs: 20 });
    assert.equal(res.ok, false);
    assert.equal(res.status, 0);
    assert.match(res.error, /aborted|Timeout/i);
  } finally {
    globalThis.fetch = original;
  }
});

test("fetchPageHtml: 4xx 立即返回（不重试）", async () => {
  const original = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = async () => {
    calls++;
    return new Response("not found", { status: 404 });
  };
  try {
    const res = await fetchPageHtml("http://example.test/x");
    assert.equal(res.status, 404);
    assert.equal(res.ok, false);
    assert.equal(calls, 1, "4xx 不应重试");
  } finally {
    globalThis.fetch = original;
  }
});

test("fetchPageHtml: 重定向严格受 maxRedirects 限制", async () => {
  const original = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = async () => {
    calls++;
    return new Response(null, {
      status: 302,
      headers: { location: "/next" },
    });
  };
  try {
    const res = await fetchPageHtml("http://example.test/start", { maxRedirects: 2 });
    assert.equal(res.ok, false);
    assert.equal(res.status, 302);
    assert.match(res.error, /Too many redirects/);
    assert.equal(calls, 3);
  } finally {
    globalThis.fetch = original;
  }
});

// ── 集成：downloadFileAtomic 用临时 http server ─────────────────────────

test("downloadFileAtomic: 完整下载并原子重命名", async () => {
  const payload = "x".repeat(4096);
  const server = createServer((req, res) => {
    res.writeHead(200, { "content-type": "application/octet-stream" });
    res.end(payload);
  });
  await new Promise((r) => server.listen(0, r));
  const port = server.address().port;
  const root = mkdtempSync(join(tmpdir(), "ph-test-"));
  try {
    const dest = join(root, "out.bin");
    const res = await downloadFileAtomic(`http://127.0.0.1:${port}/file`, dest);
    assert.equal(res.ok, true);
    assert.equal(res.bytes, payload.length);
    assert.ok(existsSync(dest));
    assert.equal(readFileSync(dest, "utf-8"), payload);
    assert.equal(existsSync(dest + ".tmp"), false, ".tmp 已被清理");
  } finally {
    server.close();
    rmSync(root, { recursive: true, force: true });
  }
});

test("downloadFileAtomic: 响应前超时会中止请求并清理临时文件", async () => {
  const server = createServer((_req, res) => {
    setTimeout(() => {
      res.writeHead(200);
      res.end("late");
    }, 200);
  });
  await new Promise((r) => server.listen(0, r));
  const port = server.address().port;
  const root = mkdtempSync(join(tmpdir(), "ph-test-"));
  try {
    const dest = join(root, "out.bin");
    const result = await downloadFileAtomic(`http://127.0.0.1:${port}/slow`, dest, { timeoutMs: 20 });
    assert.equal(result.ok, false);
    assert.match(result.error, /abort|timeout/i);
    assert.equal(existsSync(dest), false);
    assert.equal(existsSync(dest + ".tmp"), false);
  } finally {
    server.close();
    rmSync(root, { recursive: true, force: true });
  }
});

test("downloadFileAtomic: 5xx 时清理 .tmp，不留半截文件", async () => {
  const server = createServer((req, res) => {
    res.writeHead(500);
    res.end("server error");
  });
  await new Promise((r) => server.listen(0, r));
  const port = server.address().port;
  const root = mkdtempSync(join(tmpdir(), "ph-test-"));
  try {
    const dest = join(root, "out.bin");
    const res = await downloadFileAtomic(`http://127.0.0.1:${port}/file`, dest);
    assert.equal(res.ok, false);
    assert.equal(existsSync(dest), false, "失败时不应写最终文件");
    assert.equal(existsSync(dest + ".tmp"), false, "失败时应清理 .tmp");
  } finally {
    server.close();
    rmSync(root, { recursive: true, force: true });
  }
});

test("downloadFileAtomic: 重定向循环不应无限递归", async () => {
  // 服务端 /loop 永远 302 到自己
  const server = createServer((req, res) => {
    res.writeHead(302, { location: `http://127.0.0.1:${server.address().port}/loop` });
    res.end();
  });
  await new Promise((r) => server.listen(0, r));
  const port = server.address().port;
  const root = mkdtempSync(join(tmpdir(), "ph-test-"));
  try {
    const dest = join(root, "out.bin");
    const res = await downloadFileAtomic(`http://127.0.0.1:${port}/loop`, dest, { maxRedirects: 3 });
    // 重定向次数用完后，函数会返回 302 错误
    assert.equal(res.ok, false);
    assert.equal(existsSync(dest), false);
  } finally {
    server.close();
    rmSync(root, { recursive: true, force: true });
  }
});

test("downloadFileAtomic: 限定的重定向跳到目标", async () => {
  const payload = "ok-content";
  let port;
  const server = createServer((req, res) => {
    if (req.url === "/redir") {
      res.writeHead(302, { location: `http://127.0.0.1:${port}/real` });
      res.end();
    } else {
      res.writeHead(200);
      res.end(payload);
    }
  });
  await new Promise((r) => server.listen(0, r));
  port = server.address().port;
  const root = mkdtempSync(join(tmpdir(), "ph-test-"));
  try {
    const dest = join(root, "out.bin");
    const res = await downloadFileAtomic(`http://127.0.0.1:${port}/redir`, dest);
    assert.equal(res.ok, true);
    assert.equal(readFileSync(dest, "utf-8"), payload);
  } finally {
    server.close();
    rmSync(root, { recursive: true, force: true });
  }
});

// ── atomicWriteText ─────────────────────────────────────────────────────

test("atomicWriteText: 写入后无 .tmp 残留", async () => {
  const root = mkdtempSync(join(tmpdir(), "ph-test-"));
  try {
    const p = join(root, "x.md");
    await atomicWriteText(p, "hello world");
    assert.equal(readFileSync(p, "utf-8"), "hello world");
    assert.equal(existsSync(p + ".tmp"), false);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

// ── 在所有 test 之后输出总结 ─────────────────────────────────────────────
//
// node:test 默认会自动统计。失败时退出码非零，无需手动处理。
// 这里额外打印通过/失败计数，便于在 PowerShell 里肉眼确认。

import { countCodeFences, htmlTableToMarkdown, dokuWikiRowToMarkdown, isDokuWikiSeparator, isLikelyValidHtmlPage, fetchPageHtml, downloadFileAtomic, atomicWriteText, safeFileSize } from "./pipeline-helpers.mjs";

// node:test 在 Node 22 上以子进程方式运行；当前文件直接执行时，
// `test` 回调会同步触发，并最终由 runner 决定退出码。

// 如果想强制 CI 风格：等到 microtask 完成再退出
await new Promise((r) => setImmediate(r));
