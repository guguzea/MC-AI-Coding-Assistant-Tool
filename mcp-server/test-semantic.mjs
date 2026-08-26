/**
 * 语义检索单元测试（TDD）
 *
 * 运行：npm run test:semantic（先 npm run build）
 *
 * 覆盖：
 *  - chunker：frontmatter / 标题分段 / 代码块独立 / 长文切分与 overlap
 *  - RRF 融合、FTS5 查询构造、语义库路径
 *  - semanticSearch：库缺失 → null；FTS5-only 库 → 返回 FTS5 命中（不加载模型）
 *  - mergeSemanticResults：RRF 再融合 / 去重 / tag 过滤 / 截断 / matches 透传
 *  - semanticSearch：有 chunk 时 matches 非空
 */
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { DatabaseSync } from "node:sqlite";

import {
  chunkMarkdown,
  splitLongText,
  stripFrontmatter,
} from "./scripts/_lib/build-semantic-index.mjs";
import {
  semanticSearch,
  fts5TopDocsSync,
  semanticDbPath,
  buildFtsQuery,
  rrfFuse,
  cjkBigrams,
  SEMANTIC_DDL,
  closeSemanticDbs,
} from "./dist/docs-platform/semantic/search.js";
import {
  expandZhQuery,
  buildExpandedFtsExpr,
  mergeSemanticResults as mergeForTieBreak,
} from "./dist/docs-platform/search-utils.js";

import { mergeSemanticResults } from "./dist/docs-platform/search-utils.js";

let failures = 0;
let passed = 0;

function test(name, fn) {
  try {
    fn();
    passed++;
    console.log(`  ✔ ${name}`);
  } catch (e) {
    failures++;
    console.error(`  ✘ ${name}`);
    console.error(`      ${e.message.split("\n").join("\n      ")}`);
  }
}

async function testAsync(name, fn) {
  const task = (async () => {
    try {
      await fn();
      passed++;
      console.log(`  ✔ ${name}`);
    } catch (e) {
      failures++;
      console.error(`  ✘ ${name}`);
      console.error(`      ${e.message.split("\n").join("\n      ")}`);
    }
  })();
  asyncTasks.push(task);
}

/** 异步用例集合：汇总前必须全部完成（否则退出码/统计失真） */
const asyncTasks = [];

// ── 1. chunker ────────────────────────────────────────────────────────────────

test("stripFrontmatter: 移除 --- 头部", () => {
  const md = '---\nversion: "1.20.1"\ntitle: Foo\n---\n# Title\nbody';
  const out = stripFrontmatter(md);
  assert.equal(out, "# Title\nbody");
});

test("stripFrontmatter: 无 frontmatter 原样返回", () => {
  const md = "# Title\nbody";
  assert.equal(stripFrontmatter(md), md);
});

test("chunkMarkdown: 标题分段为 title + section", () => {
  const md = [
    "# My Mod Guide",
    "intro paragraph here.",
    "## Registering Items",
    "use DeferredRegister for items.",
    "## Custom Blocks",
    "blocks need a blockstate.",
  ].join("\n");
  const chunks = chunkMarkdown(md);
  assert.equal(chunks.length, 3);
  assert.deepEqual(chunks.map((c) => c.type), ["title", "section", "section"]);
  assert.ok(chunks[0].text.includes("# My Mod Guide"));
  assert.ok(chunks[0].text.includes("intro paragraph here."));
  assert.ok(chunks[1].text.includes("## Registering Items"));
  assert.ok(chunks[2].text.includes("## Custom Blocks"));
});

test("chunkMarkdown: 代码块独立成 chunk 且内容完整", () => {
  const md = [
    "# Blocks",
    "A block is created like this:",
    "```java",
    "public static final Block MY_BLOCK = new Block(...);",
    "```",
    "Then register it.",
  ].join("\n");
  const chunks = chunkMarkdown(md);
  const code = chunks.find((c) => c.type === "code");
  assert.ok(code, "应存在 code 类型 chunk");
  assert.ok(code.text.includes("```java"));
  assert.ok(code.text.includes("public static final Block MY_BLOCK"));
  // 非代码 chunk 不应包含代码内容
  for (const c of chunks) {
    if (c.type !== "code") assert.ok(!c.text.includes("MY_BLOCK"), `${c.type} chunk 不应含代码`);
  }
});

test("chunkMarkdown: 无标题 → 单一 full 类型", () => {
  const md = "plain paragraph without any heading, just prose.";
  const chunks = chunkMarkdown(md);
  assert.equal(chunks.length, 1);
  assert.equal(chunks[0].type, "full");
});

test("chunkMarkdown: 长文按句切分且带 overlap", () => {
  const sentence = "The quick brown fox jumps over the lazy dog near the river bank. ";
  const md = sentence.repeat(60); // ~4800 字符
  const chunks = chunkMarkdown(md, { maxChunkSize: 1000, overlap: 100 });
  assert.ok(chunks.length >= 4, `应切出多段，实际 ${chunks.length}`);
  for (const c of chunks) assert.ok(c.text.length <= 1100, `chunk 超长: ${c.text.length}`);
  // overlap：各段长度之和 > 原文长度
  const total = chunks.reduce((s, c) => s + c.text.length, 0);
  assert.ok(total > md.length, "overlap 生效（总长应超过原文）");
});

test("splitLongText: 短文本原样返回", () => {
  assert.deepEqual(splitLongText("short text", 1000, 100), ["short text"]);
});

// ── 2. FTS5 查询构造 ──────────────────────────────────────────────────────────

test("buildFtsQuery: 停用词剔除 + 前缀 + AND", () => {
  assert.equal(
    buildFtsQuery("how to register custom items"),
    '"register"* AND "custom"* AND "items"*',
  );
});

test("buildFtsQuery: 引号转义", () => {
  assert.equal(buildFtsQuery('say "hello"'), '"say"* AND "hello"*');
});

test("buildFtsQuery: 无有效 token → null", () => {
  assert.equal(buildFtsQuery(""), null);
  assert.equal(buildFtsQuery("the and of"), null);
});

test("buildFtsQuery: 短词 be 保留", () => {
  assert.equal(buildFtsQuery("be"), '"be"*');
  assert.equal(buildFtsQuery("the be"), '"be"*');
});

// ── 3. RRF 融合 ───────────────────────────────────────────────────────────────

test("rrfFuse: k=60 融合两个排行", () => {
  const fused = rrfFuse([["a", "b", "c"], ["c", "b", "d"]], 60);
  assert.deepEqual(fused, ["c", "b", "a", "d"]);
});

test("rrfFuse: 空输入 → []", () => {
  assert.deepEqual(rrfFuse([[], []], 60), []);
});

// ── 4. 路径与缺失降级 ─────────────────────────────────────────────────────────

test("semanticDbPath: 路径形状", () => {
  assert.equal(
    semanticDbPath("D:/data", "forge", "1.20.1", "forge-docs").replace(/\\/g, "/"),
    "D:/data/forge_1.20.1/forge-docs/1.20.1/semantic/db.sqlite",
  );
});

test("fts5TopDocsSync: 库缺失 → []", () => {
  const dbPath = join(tmpdir(), "definitely-missing-semantic-db.sqlite");
  assert.deepEqual(fts5TopDocsSync("register", dbPath), []);
});

testAsync("semanticSearch: 库缺失 → null（不加载模型）", async () => {
  const root = mkdtempSync(join(tmpdir(), "sem-missing-"));
  try {
    const hits = await semanticSearch("register", "forge", "1.20.1", "forge-docs", root);
    assert.equal(hits, null);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

// ── 5. FTS5-only 库上的完整语义检索（不触发模型加载）──────────────────────────

function createFixtureDb(root) {
  const versionDir = join(root, "forge_1.20.1", "forge-docs", "1.20.1");
  mkdirSync(join(versionDir, "semantic"), { recursive: true });
  const db = new DatabaseSync(join(versionDir, "semantic", "db.sqlite"));
  db.exec(SEMANTIC_DDL);
  const insDoc = db.prepare(
    "INSERT INTO docs (doc_id, label, url, tags_json, priority, section_count) VALUES (?, ?, ?, ?, ?, ?)",
  );
  insDoc.run("1.20.1/concepts_registries", "Concepts: Registries", "https://x/registries",
    JSON.stringify(["concepts", "registry"]), "⭐", 4);
  insDoc.run("1.20.1/items", "Items", "https://x/items",
    JSON.stringify(["items"]), "🟢", 2);
  insDoc.run("1.20.1/misc_config", "Configuration", "https://x/config",
    JSON.stringify(["configuration"]), "🟢", 1);

  const insChunk = db.prepare(
    "INSERT INTO chunks (chunk_id, doc_id, chunk_type, chunk_order, text) VALUES (?, ?, ?, ?, ?)",
  );
  const insFts = db.prepare("INSERT INTO chunks_fts (chunk_id, text) VALUES (?, ?)");
  const rows = [
    ["reg1", "1.20.1/concepts_registries", "section", 0,
      "Registries are used to register custom items, blocks and other content in Minecraft."],
    ["itm1", "1.20.1/items", "section", 0,
      "Items are the stackable objects players hold in their inventory."],
    ["cfg1", "1.20.1/misc_config", "section", 0,
      "Configuration files allow mods to expose settings to users."],
  ];
  for (const [chunkId, docId, type, order, text] of rows) {
    insChunk.run(chunkId, docId, type, order, text);
    insFts.run(chunkId, text);
  }
  db.close();
  return root;
}

testAsync("semanticSearch: FTS5-only 库返回全文命中（无嵌入，不加载模型）", async () => {
  const root = createFixtureDb(mkdtempSync(join(tmpdir(), "sem-db-")));
  try {
    const hits = await semanticSearch("how to register custom items", "forge", "1.20.1", "forge-docs", root);
    assert.ok(hits !== null, "库存在时不应返回 null");
    assert.ok(hits.length >= 1);
    assert.equal(hits[0].docId, "1.20.1/concepts_registries");
    assert.equal(hits[0].priority, "⭐");
    assert.deepEqual(hits[0].tags, ["concepts", "registry"]);
    assert.equal(hits[0].sectionCount, 4);
    assert.equal(typeof hits[0].score, "number");
    assert.ok(Array.isArray(hits[0].matches) && hits[0].matches.length >= 1, "有 chunk 时 matches 应非空");
    assert.ok(hits[0].matches[0].snippet.includes("Registries"), hits[0].matches[0].snippet);
  } finally {
    closeSemanticDbs();
    rmSync(root, { recursive: true, force: true });
  }
});

testAsync("semanticSearch: 无命中查询 → []（非 null、不抛错）", async () => {
  const root = createFixtureDb(mkdtempSync(join(tmpdir(), "sem-db2-")));
  try {
    const hits = await semanticSearch("quantum banana spaceship", "forge", "1.20.1", "forge-docs", root);
    assert.ok(hits !== null);
    assert.deepEqual(hits, []);
  } finally {
    closeSemanticDbs();
    rmSync(root, { recursive: true, force: true });
  }
});

// ── 5b. CJK bigram（B9 中文查询兜底） ────────────────────────────────────────

test("cjkBigrams: 滑动窗口双字组合", () => {
  assert.deepEqual(cjkBigrams("注册方块"), ["注册", "册方", "方块"]);
});

test("cjkBigrams: 单字与混合输入", () => {
  assert.deepEqual(cjkBigrams("方块 register 注册"), ["方块", "块注", "注册"]);
  assert.deepEqual(cjkBigrams("块"), ["块"]);
  assert.deepEqual(cjkBigrams(""), []);
  assert.deepEqual(cjkBigrams("abc123"), []);
});

// ── 6. mergeSemanticResults ───────────────────────────────────────────────────

const l0Results = [
  { id: "a", version: "1.20.1", label: "A", url: "", tags: ["x"], priority: "🟢", sectionCount: 0 },
];

test("mergeSemanticResults: RRF 再融合 + 去重 + 截断", () => {
  const hits = [
    { docId: "b", score: 0.9, label: "B", url: "u", tags: ["y"], priority: "⭐", sectionCount: 3,
      matches: [{ snippet: "from chunk", score: 0.5 }] },
    { docId: "a", score: 0.8, label: "A dup", url: "", tags: [], priority: "🟢", sectionCount: 0 },
  ];
  const merged = mergeSemanticResults(l0Results, hits, { limit: 10, version: "1.20.1" });
  assert.equal(merged.length, 2); // a∪b 经 RRF，a 在两边排名更高
  assert.ok(merged.some((r) => r.id === "a"));
  assert.ok(merged.some((r) => r.id === "b"));
  const b = merged.find((r) => r.id === "b");
  assert.equal(b.label, "B");
  assert.equal(b.semanticScore, 0.9);
  assert.equal(b.score, b.rrfScore);
  assert.ok(typeof b.rrfScore === "number" && b.rrfScore < 1, "对外 score 应为 RRF 而非语义余弦");
  assert.notEqual(b.score, 0.9);
  assert.ok(b.matches?.length >= 1);
});

test("mergeSemanticResults: 无语义命中 → 纯 L0", () => {
  const merged = mergeSemanticResults(l0Results, [], { limit: 10, version: "1.20.1" });
  assert.deepEqual(merged.map((r) => r.id), ["a"]);
});

test("mergeSemanticResults: tag 过滤", () => {
  const hits = [
    { docId: "b", score: 0.9, label: "B", url: "", tags: ["registry"], priority: "🟢", sectionCount: 0 },
    { docId: "c", score: 0.8, label: "C", url: "", tags: ["datagen"], priority: "🟢", sectionCount: 0 },
  ];
  const merged = mergeSemanticResults(l0Results, hits, { tags: ["datagen"], limit: 10, version: "1.20.1" });
  assert.equal(merged.length, 2);
  assert.ok(merged.some((r) => r.id === "c"));
  assert.ok(!merged.some((r) => r.id === "b"));
});

test("mergeSemanticResults: limit 截断", () => {
  const hits = [
    { docId: "b", score: 0.9, label: "B", url: "", tags: [], priority: "🟢", sectionCount: 0 },
    { docId: "c", score: 0.8, label: "C", url: "", tags: [], priority: "🟢", sectionCount: 0 },
  ];
  const merged = mergeSemanticResults(l0Results, hits, { limit: 2, version: "1.20.1" });
  assert.equal(merged.length, 2);
});

{
  const { getSemanticIndexStatus } = await import("./dist/docs-platform/semantic/status.js");
  test("getSemanticIndexStatus: 缺库 → l0-only，不抛错", () => {
    const root = mkdtempSync(join(tmpdir(), "sem-status-"));
    try {
      const st = getSemanticIndexStatus(root);
      assert.equal(st.modeHint, "l0-only");
      assert.equal(st.presentCount, 0);
      assert.ok(Array.isArray(st.warnings) && st.warnings.length > 0, "缺库必须 warning");
      assert.ok(st.warnings.some((w) => /缺库|semantic/.test(w)));
      assert.ok(st.samples.every((s) => s.mode === "missing" || s.exists === false));
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
}

// ── 4b. 中英词典查询扩展（检索提升 v3）──────────────────────────────────────

test("expandZhQuery: 词典缺失 → 静默无扩展", () => {
  const r = expandZhQuery("注册自定义方块", join(tmpdir(), "no-such-glossary-root"));
  assert.equal(r.expanded, false);
  assert.equal(r.text, "注册自定义方块");
  assert.deepEqual(r.terms, []);
});

test("expandZhQuery: 最长匹配优先（数据组件 整体命中；物品栏 不被 物品 误扩展）", () => {
  const root = mkdtempSync(join(tmpdir(), "glossary-"));
  mkdirSync(join(root, "_glossary"), { recursive: true });
  writeFileSync(
    join(root, "_glossary", "mc-zh-en.json"),
    JSON.stringify({ version: 1, entries: { 数据组件: ["data component"], 数据: ["data"], 组件: ["component"], 物品: ["item"], 物品栏: ["inventory"] } }),
    "utf8",
  );
  const r1 = expandZhQuery("注册数据组件", root);
  assert.ok(r1.expanded);
  assert.ok(r1.terms.includes("data component"), JSON.stringify(r1));
  assert.ok(!r1.terms.includes("data") && !r1.terms.includes("component"));
  const r2 = expandZhQuery("打开物品栏", root);
  assert.ok(r2.terms.includes("inventory"), JSON.stringify(r2));
  assert.ok(!r2.terms.includes("item"), JSON.stringify(r2));
});

test("expandZhQuery: 损坏 JSON → 静默回退", () => {
  const root = mkdtempSync(join(tmpdir(), "glossary-bad-"));
  mkdirSync(join(root, "_glossary"), { recursive: true });
  writeFileSync(join(root, "_glossary", "mc-zh-en.json"), "{not json", "utf8");
  const r = expandZhQuery("注册方块", root);
  assert.equal(r.expanded, false);
});

test("buildExpandedFtsExpr: OR 组形状 + 白名单净化", () => {
  assert.equal(buildExpandedFtsExpr(["register", "block"]), '("register"* OR "block"*)');
  // 非白名单词条（含冒号/引号）在构造器内被丢弃——双保险中的第二道
  assert.equal(buildExpandedFtsExpr(["register", 'bad:term"']), '("register"*)');
  assert.equal(buildExpandedFtsExpr([]), null);
});

test("mergeSemanticResults: priority 仅作排序副键，不改 score 数值", () => {
  const l0 = [
    { id: "star", version: "1.20.1", label: "S", url: "", tags: [], priority: "⭐", sectionCount: 0 },
    { id: "green", version: "1.20.1", label: "G", url: "", tags: [], priority: "🟢", sectionCount: 0 },
  ];
  const hits = [
    { docId: "green", score: 0.9, label: "G", url: "", tags: [], priority: "🟢", sectionCount: 0 },
    { docId: "star", score: 0.9, label: "S", url: "", tags: [], priority: "⭐", sectionCount: 0 },
  ];
  const merged = mergeForTieBreak(l0, hits, { limit: 10, version: "1.20.1" });
  assert.equal(merged[0].id, "star"); // RRF 同分时 ⭐ 排前
  for (const row of merged) {
    assert.equal(row.score, row.rrfScore); // score 契约不变
  }
});

// ── 汇总 ──────────────────────────────────────────────────────────────────────

await Promise.all(asyncTasks);

if (failures > 0) {
  console.error(`\n✘ test-semantic: ${failures} 失败 / ${passed} 通过`);
  process.exit(1);
}
console.log(`\n✔ test-semantic: 全部 ${passed} 项通过`);