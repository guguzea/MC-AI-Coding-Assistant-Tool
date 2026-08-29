import assert from "node:assert/strict";

import { parseCliArgs, compareVersions } from "./scripts/_lib/args.js";
import { parseCSV } from "./scripts/_lib/csv.js";
import { resolveLatestKey } from "./scripts/check-porting-updates.js";
import { extractChapterPaths } from "./scripts/probe-forge-versions.js";

assert.equal(parseCliArgs(["--version=1.20.1"]).flags.version, "1.20.1");
assert.equal(parseCliArgs(["--version", "1.20.1"]).flags.version, "1.20.1");
assert.equal(parseCliArgs(["--version="]).flags.versionError, "empty-value");
assert.equal(parseCliArgs(["--version"]).flags.versionError, "missing-value");
assert.ok(compareVersions("1.10.2", "1.9.4") > 0);
assert.ok(compareVersions("20.4.237", "20.2.88") > 0);
assert.equal(resolveLatestKey("neoforge", "1.20.4"), "1.20.4");
assert.equal(resolveLatestKey("neoforge", "1.20.1"), "1.20.1");

const forgeChapters = extractChapterPaths(
  '<a href="../resources/server/recipes/custom/">Custom</a><a href="/en/1.20.1/images/logo.png">Image</a>',
  "https://docs.readthedocs.net/en/1.20.1/gettingstarted/",
);
assert.ok(forgeChapters.includes("resources/server/recipes/custom"));
assert.ok(!forgeChapters.some((chapter) => chapter.includes("images")));

const parsed = parseCSV('searge,name,side,desc\nfunc_1,foo,2,"(I,Ljava/lang/String;)V"\n');
assert.deepEqual(parsed.errors, []);
assert.equal(parsed.rows[0].desc, "(I,Ljava/lang/String;)V");

const escaped = parseCSV('name,desc\nfoo,"contains ""quoted"", comma"\n');
assert.deepEqual(escaped.errors, []);
assert.equal(escaped.rows[0].desc, 'contains "quoted", comma');

const malformed = parseCSV('name,desc\nfoo,"unterminated');
assert.ok(malformed.errors.some((error) => error.includes("unterminated")));

const { hashRevision, extractScriptApiStable } = await import("./scripts/fetch-bedrock-docs.js");
assert.notEqual(hashRevision(["page-one-raw", "page-two-raw"]), hashRevision(["page-one-raw"]));
assert.equal(hashRevision(["a", "b"]), hashRevision(["a", "b"]));
assert.equal(
  extractScriptApiStable("See @minecraft/server module version 1.14.0 in the table"),
  "1.14.0",
);
assert.equal(extractScriptApiStable("<p>no versions here</p>"), null);

// ── #11 网络超时：挂起连接必须在超时后降级/报错，而不是永久挂起 ──────────
// 用本地 server 模拟 writeHead 后永不 end 的对端。**禁止访问真实外网。**
const { createServer } = await import("node:http");
const hanging = createServer((_req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  // 刻意不调用 res.end()，连接保持挂起
});
await new Promise((r) => hanging.listen(0, "127.0.0.1", r));
const hangingUrl = `http://127.0.0.1:${hanging.address().port}/hang`;

const { defaultFetch } = await import("./scripts/probe-forge-versions.js");
const { fetchPageHtml } = await import("./scripts/_lib/pipeline-helpers.mjs");

const startedAt = Date.now();
let timedOut = false;
try {
  await defaultFetch(hangingUrl, { timeoutMs: 200 });
} catch {
  timedOut = true;
}
const elapsed = Date.now() - startedAt;
assert.ok(timedOut, "defaultFetch 在挂起连接上未超时");
assert.ok(elapsed < 5_000, `defaultFetch 超时耗时异常: ${elapsed}ms`);

let htmlTimedOut = false;
try {
  const res = await fetchPageHtml(hangingUrl, { timeoutMs: 200 });
  // fetchPageHtml 也可能以非 2xx / error 形式降级返回，两者都算没挂死
  htmlTimedOut = res.status !== 200 || Boolean(res.error);
} catch {
  htmlTimedOut = true;
}
assert.ok(htmlTimedOut, "fetchPageHtml 在挂起连接上未超时/降级");

await new Promise((r) => hanging.close(r));

// ── #12 forge 1.20.4 数据版本归属断言（必须挂载，独立脚本不会被测试链执行）──
const { assertLinkForge1204, DEFAULT_DEST_DIR } = await import(
  "./scripts/assert-link-forge-1.20.4.mjs"
);
const { existsSync } = await import("node:fs");
if (existsSync(DEFAULT_DEST_DIR)) {
  assertLinkForge1204(DEFAULT_DEST_DIR);
} else {
  // 数据未生成不算失败（该目录是抓取产物），但需显式记录
  console.log("skip: forge_1.20.4 data not present");
}

console.log("script helper regression tests passed");
