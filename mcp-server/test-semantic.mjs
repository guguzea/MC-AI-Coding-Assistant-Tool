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
import { mkdtempSync, mkdirSync, rmSync, writeFileSync, readFileSync, existsSync, copyFileSync } from "node:fs";
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
import { getSemanticIndexStatus, closeSemanticStatusDbs } from "./dist/docs-platform/semantic/status.js";
import { isSemanticIndexStale } from "./dist/docs-platform/semantic/fingerprint.js";

let failures = 0;
let passed = 0;

function test(name, fn) {
  let r;
  try {
    r = fn();
  } catch (e) {
    failures++;
    console.error(`  ✘ ${name}`);
    console.error(`      ${e.message.split("\n").join("\n      ")}`);
    return;
  }
  if (r && typeof r.then === "function") {
    failures++;
    console.error(`  ✘ ${name}`);
    console.error(`      async 用例被交给同步 test()：断言永不按序执行。改用 testAsync(...)`);
    r.catch(() => {});
    return;
  }
  passed++;
  console.log(`  ✔ ${name}`);
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

// ── #1 术语表：expandZhQuery / buildExpandedFtsExpr 必须真正参与检索链路 ───
// 此前这两个函数零生产调用（死代码），mc-zh-en.json 对检索零影响。
test("#1 术语表扩展形状与 FTS 表达式", () => {
  const dataRoot = process.env.MC_SKILL_DATA || join("..", "data");
  const e = expandZhQuery("数据组件", dataRoot);
  // 计划已核实签名：{ text, terms, expanded }
  assert.equal(typeof e.text, "string", "expansion.text 必须是字符串");
  assert.ok(Array.isArray(e.terms), "expansion.terms 必须是数组");
  assert.equal(typeof e.expanded, "boolean", "expansion.expanded 必须是布尔");
  assert.equal(e.expanded, e.terms.length > 0, "expanded 应与 terms 非空一致");

  // 英文查询不应触发中文扩展（CJK 守卫）
  const en = expandZhQuery("data component", dataRoot);
  assert.equal(en.expanded, false, "纯英文查询不应触发中文术语扩展");

  // 有术语时 buildExpandedFtsExpr 必须产出可用表达式
  if (e.terms.length > 0) {
    const expr = buildExpandedFtsExpr(e.terms);
    assert.ok(typeof expr === "string" && expr.length > 0, "应产出非空 FTS 表达式");
  }
  // 空术语必须安全返回假值（不得抛错、不得产出可执行的 MATCH 表达式）
  const emptyExpr = buildExpandedFtsExpr([]);
  assert.ok(!emptyExpr, `空术语应返回假值，实际: ${JSON.stringify(emptyExpr)}`);
});

// ── #2 mergeSemanticResults 成员校验：已在 L0 中删除的文档不得经语义通道浮出 ──
test("#2 allowedIds 过滤已删除文档", () => {
  const l0 = [
    { id: "alive", version: "1.20.1", label: "A", url: "", tags: [], priority: "中", sectionCount: 0 },
  ];
  const hits = [
    { docId: "alive", score: 0.9, label: "A", url: "", tags: [], priority: "中", sectionCount: 0 },
    // 语义库里的残留：L0 已不存在该文档
    { docId: "deleted", score: 0.99, label: "D", url: "", tags: [], priority: "高", sectionCount: 0 },
  ];

  // 不传 allowedIds：默认行为不变（保留向后兼容）
  const legacy = mergeSemanticResults(l0, hits, { limit: 10, version: "1.20.1" });
  assert.ok(
    legacy.some((r) => r.id === "deleted"),
    "不传 allowedIds 时保持旧行为（不做成员校验）",
  );

  // 传 allowedIds：deleted 必须被丢弃，即使分数更高
  const guarded = mergeSemanticResults(l0, hits, {
    limit: 10,
    version: "1.20.1",
    allowedIds: new Set(l0.map((r) => r.id)),
  });
  assert.ok(
    !guarded.some((r) => r.id === "deleted"),
    `已删除文档不得经语义通道浮出: ${JSON.stringify(guarded.map((r) => r.id))}`,
  );
  assert.ok(guarded.some((r) => r.id === "alive"), "存活文档应保留");
});

// ── #3 模型就绪探针：必须识别实际分发的 onnx/model_quantized.onnx ───────────
// 本仓 data/_models 下只有 quantized 权重；旧探针只认 model.onnx，
// 导致模型明明可用却报 fts5-only（modeHint 降级）。
test("#3 模型探针识别 quantized 权重", () => {
  const dataRoot = process.env.MC_SKILL_DATA || join("..", "data");
  const st = getSemanticIndexStatus(dataRoot);
  assert.equal(
    st.modelsReady,
    true,
    `真实数据目录下模型应就绪（不得因文件名是 quantized 而误判）: ${JSON.stringify(st.modelsReady)}`,
  );
  assert.equal(st.modeHint, "hybrid", `应有向量能力，modeHint 应为 hybrid，实际 ${st.modeHint}`);

  // 空目录必须判未就绪（防探针退化成“恒为 true”）
  const empty = mkdtempSync(join(tmpdir(), "mc-model-empty-"));
  try {
    assert.equal(getSemanticIndexStatus(empty).modelsReady, false, "空目录应判模型未就绪");
  } finally {
    rmSync(empty, { recursive: true, force: true });
  }
});

// ── #4 指纹：mismatch 但源未更新 → 不得判 stale（消除假性过期）─────────────
test("#4 指纹 mismatch 但源未更新不判 stale", () => {
  const dir = mkdtempSync(join(tmpdir(), "mc-fp-"));
  try {
    mkdirSync(join(dir, "processed"), { recursive: true });
    writeFileSync(join(dir, "processed", "a.md"), "# A\n");

    const futureIso = new Date(Date.now() + 60_000).toISOString();
    const r = isSemanticIndexStale({
      builtAtIso: futureIso, // 索引建于“未来” → 源不可能比它新
      storedFingerprint: "totally-different-fingerprint",
      versionDir: dir,
    });
    assert.equal(r.stale, false, `源未更新时不得判 stale: ${JSON.stringify(r)}`);
    assert.equal(r.fingerprintMismatchOnly, true, "应标记为「仅指纹不一致」");
    assert.match(r.reason ?? "", /source unchanged/, "reason 应说明源未变化");
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

// 反向守护：源确实更新时**必须**判 stale（防止为消除误报而矫枉过正）
test("#4b 源更新时仍须判 stale", () => {
  const dir = mkdtempSync(join(tmpdir(), "mc-fp2-"));
  try {
    mkdirSync(join(dir, "processed"), { recursive: true });
    writeFileSync(join(dir, "processed", "a.md"), "# A\n");
    const stale = isSemanticIndexStale({
      builtAtIso: new Date(Date.now() - 120_000).toISOString(), // 源比索引新
      storedFingerprint: "different",
      versionDir: dir,
    });
    assert.equal(stale.stale, true, `源更新时必须判 stale: ${JSON.stringify(stale)}`);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

// ── A-38：语义库开库数与文档树数量解耦（LRU + meta memo）────────────────────

function makeSemanticTree(root, version) {
  const versionDir = join(root, `fabric_${version}`, "fabric-docs", version);
  mkdirSync(join(versionDir, "semantic"), { recursive: true });
  const db = new DatabaseSync(join(versionDir, "semantic", "db.sqlite"));
  db.exec(SEMANTIC_DDL);
  db.exec(
    `INSERT INTO meta (key, value) VALUES ('docs','1'),('chunks','1'),('embedded','1'),('built_at','2020-01-01T00:00:00.000Z')`,
  );
  db.close();
}

function copySemanticTree(fromRoot, toRoot, fromVersion, toVersion) {
  const src = join(fromRoot, `fabric_${fromVersion}`, "fabric-docs", fromVersion, "semantic", "db.sqlite");
  const dstDir = join(toRoot, `fabric_${toVersion}`, "fabric-docs", toVersion, "semantic");
  mkdirSync(dstDir, { recursive: true });
  copyFileSync(src, join(dstDir, "db.sqlite"));
}

function timedStatus(root) {
  const t0 = Date.now();
  const st = getSemanticIndexStatus(root);
  return { ms: Date.now() - t0, st };
}

function median3(fn) {
  const a = [fn(), fn(), fn()].map((x) => x.ms);
  return a.sort((x, y) => x - y)[1];
}

test("A-38 dbOpens <= 8 且与语义库个数无关（60 → 120 棵树）", () => {
  const N = 60;
  const root = mkdtempSync(join(tmpdir(), "mc-a38-"));
  try {
    for (let i = 1; i <= N; i++) makeSemanticTree(root, `2.0.${i}`);
    const cap = getSemanticIndexStatus(root).readStats.cap;
    assert.equal(cap, 8, "LRU 上限必须等于 registry/store.ts 的 REGISTRY_DB_CAP(8)");

    timedStatus(root); // 冷趟（建 memo）
    const warmN = timedStatus(root);
    const statsN = warmN.st.readStats;
    assert.ok(statsN.dbOpens <= cap, `${N} 库 dbOpens=${statsN.dbOpens} 必须 <= ${cap}`);
    assert.equal(statsN.memoHits >= N, true, "热趟必须全部 memo 命中");
    const medA = median3(() => timedStatus(root));

    // 翻倍语料：只复制文件，不新增任何依赖
    for (let i = 1; i <= N; i++) copySemanticTree(root, root, `2.0.${i}`, `3.0.${i}`);
    const cold2N = timedStatus(root);
    const warm2N = timedStatus(root);
    const stats2N = warm2N.st.readStats;

    assert.equal(stats2N.dbOpens, statsN.dbOpens, `N 翻倍后 dbOpens 必须不变：${statsN.dbOpens} → ${stats2N.dbOpens}`);
    assert.ok(stats2N.dbOpens <= cap, `翻倍后 dbOpens 仍须 <= ${cap}`);
    assert.equal(
      stats2N.opensTotal,
      cold2N.st.readStats.opensTotal,
      `热趟不得再开新库（这才是「与 N 无关」的硬证据）：${JSON.stringify(cold2N.st.readStats)} → ${JSON.stringify(stats2N)}`,
    );
    assert.equal(stats2N.memoHits >= 2 * N, true, "翻倍后热趟仍须全命中");
    assert.equal(typeof warm2N.st.presentCount, "number", "readStats 不得挤掉既有状态字段");
    assert.equal(typeof warm2N.st.modeHint, "string", "readStats 不得挤掉既有状态字段");

    const medB = median3(() => timedStatus(root));
    console.log(`      A-38 实测：${N} 库热趟中位=${medA}ms，${2 * N} 库热趟中位=${medB}ms（改前每库一次 open）`);
    // +25ms 项是目录遍历本身的 O(N) 地板；开库次数与 N 解耦由上面的 opensTotal==0 增量断言
    assert.ok(
      medB <= medA * 1.2 + 25,
      `翻倍语料 wall-clock 必须远小于线性增长：${medA}ms → ${medB}ms（改前每多一个库多一次 open）`,
    );
  } finally {
    // A-38 后句柄被长期持有：Windows 下不先 close 就删不掉（实测 EBUSY）。
    // 这正是 update/data.ts swapInDataDir 的 rename 与进程退出必须先调
    // closeSemanticStatusDbs() 的原因（见 temp/w4-A3-cross.patch P3/P4）。
    closeSemanticStatusDbs();
    rmSync(root, { recursive: true, force: true });
  }
});

test("A-38 真实语料：探测点 >> 8 时 dbOpens 仍 <= 8", () => {
  const dataRoot = process.env.MC_SKILL_DATA || join(process.cwd(), "..", "data");
  if (!existsSync(dataRoot)) {
    console.log(`      A-38：${dataRoot} 不存在，跳过真实语料断言`);
    return;
  }
  try {
    timedStatus(dataRoot);
    const st = timedStatus(dataRoot).st;
    const probed = st.readStats.memoHits + st.readStats.memoMisses;
    assert.ok(probed > st.readStats.cap, `真实语料探测点应远大于 8，实际 ${probed}`);
    assert.ok(
      st.readStats.dbOpens <= st.readStats.cap,
      `真实语料 ${probed} 个探测点 → dbOpens=${st.readStats.dbOpens} 必须 <= ${st.readStats.cap}`,
    );
    console.log(
      `      A-38 真实语料：探测点=${probed} present=${st.presentCount} dbOpens=${st.readStats.dbOpens} dbPrepares=${st.readStats.dbPrepares}`,
    );
  } finally {
    closeSemanticStatusDbs();
  }
});

// ── A-33：不支持平台的 store 只剩一份 ───────────────────────────────────────

test("A-33 UnsupportedPlatformStore 单一实现（src / dist 文本面）", () => {
  const srcForge = readFileSync(join(process.cwd(), "src", "docs-platform", "forge", "index.ts"), "utf8");
  const srcStore = readFileSync(join(process.cwd(), "src", "docs-platform", "store.ts"), "utf8");
  assert.ok(!/class UnsupportedPlatformStore/.test(srcForge), "forge/index.ts 不得再自带一份拷贝");
  assert.ok(/export class UnsupportedPlatformStore/.test(srcStore), "store.ts 必须导出唯一实现");
  const storeImport = /import\s*\{([^}]*)\}\s*from\s*"\.\.\/store\.js"/.exec(srcForge);
  assert.ok(
    storeImport && /\bUnsupportedPlatformStore\b/.test(storeImport[1]),
    `forge/index.ts 必须从 ../store.js 导入共享类，实际语句：${JSON.stringify(storeImport && storeImport[0])}`,
  );
  const distForge = join(process.cwd(), "dist", "docs-platform", "forge", "index.js");
  if (existsSync(distForge)) {
    assert.ok(
      !/class UnsupportedPlatformStore/.test(readFileSync(distForge, "utf8")),
      "dist/forge/index.js 不应再编译出第二份拷贝（重建 dist 后生效）",
    );
  }
});

testAsync("A-33 两个使用面全部抛 UNSUPPORTED_PLATFORM（含 3 参 searchIndex）", async () => {
  const { createDocStore, UnsupportedPlatformStore } = await import("./dist/docs-platform/store.js");
  assert.equal(typeof UnsupportedPlatformStore, "function", "共享类必须被导出");
  const faces = [
    ["createDocStore(未知平台)", createDocStore("spongebob", "unused")],
    ["getGenericStore('bedrock') 的同一实例", new UnsupportedPlatformStore()],
  ];
  for (const [label, store] of faces) {
    const calls = [
      ["getAvailableVersions", () => store.getAvailableVersions()],
      ["searchIndex(3 参)", () => store.searchIndex("q", "1.20.1", ["tag"])],
      ["searchIndex(1 参)", () => store.searchIndex("q")],
      ["loadSummary", () => store.loadSummary("id", "1.20.1")],
      ["loadFullDoc", () => store.loadFullDoc("id", "1.20.1", true)],
      ["getRelatedDocs", () => store.getRelatedDocs("id", "1.20.1", 3)],
      ["describeVersionResolution", () => store.describeVersionResolution("1.20.1")],
      ["getLastSearchMeta", () => store.getLastSearchMeta()],
      ["searchIndexDetailed", () => store.searchIndexDetailed("q", "1.20.1")],
    ];
    for (const [member, fn] of calls) {
      let code;
      try {
        fn();
      } catch (e) {
        code = e?.code;
      }
      assert.equal(code, "UNSUPPORTED_PLATFORM", `${label}.${member} 实际 code=${String(code)}`);
    }
  }
});

testAsync("A-33 工具面未漂移：platform=bedrock 仍被 schema 挡在门外", async () => {
  const { searchDocsSchema } = await import("./dist/docs-platform/forge/index.js");
  assert.equal(
    searchDocsSchema.inputSchema.safeParse({ query: "x", platform: "bedrock", version: "stable" }).success,
    false,
    "合并不得让 bedrock 从 schema 侧漏进 Java 文档工具",
  );
});

// ── D-49：读不出来的源文件 → 不可判定，而不是崩 ────────────────────────────

test("D-49 源文件读失败 → undecidable（投毒：index-l0.json 换成目录，必然 EISDIR）", () => {
  const dir = mkdtempSync(join(tmpdir(), "mc-d49-"));
  try {
    mkdirSync(join(dir, "processed"), { recursive: true });
    writeFileSync(join(dir, "processed", "a.md"), "# A\n");
    const ok = isSemanticIndexStale({
      builtAtIso: new Date(Date.now() + 60_000).toISOString(),
      storedFingerprint: "x",
      versionDir: dir,
    });
    assert.equal(ok.stale, false, JSON.stringify(ok));

    rmSync(join(dir, "processed", "a.md"));
    mkdirSync(join(dir, "index-l0.json")); // existsSync 通过、readFileSync 必 EISDIR
    let r;
    assert.doesNotThrow(() => {
      r = isSemanticIndexStale({
        builtAtIso: new Date(Date.now() + 60_000).toISOString(),
        storedFingerprint: "x",
        versionDir: dir,
      });
    }, "读失败不得把异常抛到 search / diagnose 外面");
    assert.equal(r.stale, false, `不可判定不得冒充过期：${JSON.stringify(r)}`);
    assert.equal(r.undecidable, true, `必须显式标 undecidable：${JSON.stringify(r)}`);
    assert.match(r.reason ?? "", /undecidable/, `reason 要说明原因：${r.reason}`);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("D-49 源文件被删（竞态窗口）后指纹路径不崩", () => {
  const dir = mkdtempSync(join(tmpdir(), "mc-d49b-"));
  try {
    mkdirSync(join(dir, "processed"), { recursive: true });
    writeFileSync(join(dir, "index-l0.json"), JSON.stringify({ docs: [] }), "utf8");
    writeFileSync(join(dir, "processed", "a.md"), "# A\n");
    rmSync(join(dir, "processed", "a.md"));
    let r;
    assert.doesNotThrow(() => {
      r = isSemanticIndexStale({
        builtAtIso: new Date(Date.now() - 120_000).toISOString(),
        storedFingerprint: "different",
        versionDir: dir,
      });
    });
    assert.equal(typeof r.stale, "boolean");
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

await Promise.all(asyncTasks);

if (failures > 0) {
  console.error(`\n✘ test-semantic: ${failures} 失败 / ${passed} 通过`);
  process.exit(1);
}
console.log(`\n✔ test-semantic: 全部 ${passed} 项通过`);