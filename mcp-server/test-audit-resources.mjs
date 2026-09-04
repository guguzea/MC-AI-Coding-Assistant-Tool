/**
 * audit_resources：纹理引用/孤儿路径归一化（禁止空壳 smoke）。
 * + D-48：community store 的读失败降级（DOC_NOT_FOUND）与正文读取有界缓存。
 */
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { auditResources } from "./dist/audit-resources/index.js";
import {
  CommunityDocStore,
  CommunityDocNotFoundError,
  getCommunityReadStats,
  resetCommunityReadStats,
} from "./dist/docs-platform/community/store.js";

function writePng(path) {
  writeFileSync(path, Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
}

function testAssetsRootReferencedNotOrphan() {
  const root = mkdtempSync(join(tmpdir(), "mc-audit-tex-"));
  try {
    const texDir = join(root, "assets", "demo", "textures", "block");
    const modelDir = join(root, "assets", "demo", "models", "block");
    mkdirSync(texDir, { recursive: true });
    mkdirSync(modelDir, { recursive: true });
    writePng(join(texDir, "foo.png"));
    writeFileSync(
      join(modelDir, "foo.json"),
      JSON.stringify({ textures: { all: "demo:block/foo" } }),
    );
    const r = auditResources({ resourceRoot: root, modId: "demo" });
    assert.equal(r.ok, true, JSON.stringify(r.issues));
    assert.equal(r.orphanTextures.length, 0, `已引用纹理不得标孤儿: ${JSON.stringify(r.orphanTextures)}`);
    assert.ok(r.referencedTextures.some((t) => t.includes("block/foo")), JSON.stringify(r.referencedTextures));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

function testHashLayerNotPath() {
  const root = mkdtempSync(join(tmpdir(), "mc-audit-hash-"));
  try {
    const texDir = join(root, "assets", "demo", "textures", "block");
    const modelDir = join(root, "assets", "demo", "models", "block");
    mkdirSync(texDir, { recursive: true });
    mkdirSync(modelDir, { recursive: true });
    writePng(join(texDir, "stone.png"));
    writeFileSync(
      join(modelDir, "stone.json"),
      JSON.stringify({ textures: { particle: "#layer0", all: "demo:block/stone" } }),
    );
    const r = auditResources({ resourceRoot: root, modId: "demo" });
    assert.ok(!r.issues.some((i) => i.path === "#layer0" || /#layer0/.test(i.message)), JSON.stringify(r.issues));
    assert.equal(r.orphanTextures.length, 0, JSON.stringify(r.orphanTextures));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

function testPngMcmetaNotTextureSet() {
  const root = mkdtempSync(join(tmpdir(), "mc-audit-mcmeta-"));
  try {
    const texDir = join(root, "assets", "demo", "textures", "block");
    const modelDir = join(root, "assets", "demo", "models", "block");
    mkdirSync(texDir, { recursive: true });
    mkdirSync(modelDir, { recursive: true });
    writePng(join(texDir, "bar.png"));
    writeFileSync(join(texDir, "bar.png.mcmeta"), JSON.stringify({ animation: { frametime: 2 } }));
    writeFileSync(
      join(modelDir, "bar.json"),
      JSON.stringify({ textures: { all: "demo:block/bar" } }),
    );
    const r = auditResources({ resourceRoot: root, modId: "demo" });
    assert.ok(
      !r.orphanTextures.some((p) => /\.png\.mcmeta$/i.test(p)),
      `.png.mcmeta 不得进纹理集: ${JSON.stringify(r.orphanTextures)}`,
    );
    assert.equal(r.orphanTextures.length, 0, JSON.stringify(r.orphanTextures));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

function testShortRefDoesNotSwallowOrphan() {
  const root = mkdtempSync(join(tmpdir(), "mc-audit-short-"));
  try {
    const texDir = join(root, "assets", "demo", "textures", "block");
    const modelDir = join(root, "assets", "demo", "models", "block");
    mkdirSync(texDir, { recursive: true });
    mkdirSync(modelDir, { recursive: true });
    writePng(join(texDir, "foo.png"));
    writePng(join(texDir, "food.png"));
    writeFileSync(
      join(modelDir, "foo.json"),
      JSON.stringify({ textures: { all: "demo:block/foo" } }),
    );
    const r = auditResources({ resourceRoot: root, modId: "demo" });
    assert.ok(
      r.orphanTextures.some((p) => /food\.png$/i.test(p)),
      `短引用 foo 不得把 food 吞成已引用: ${JSON.stringify(r.orphanTextures)}`,
    );
    assert.ok(
      !r.orphanTextures.some((p) => /foo\.png$/i.test(p)),
      `精确引用 foo 仍不得标孤儿: ${JSON.stringify(r.orphanTextures)}`,
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

// ── #8 跨命名空间：minecraft:block/foo 与 demo:block/foo 不得互相顶替 ──────
// 旧实现 normalizeTextureRef 直接剥掉 `ns:` 前缀，两个命名空间同名纹理
// 会塌成同一个 key，孤儿/缺失判定双双错乱。
function testCrossNamespaceNotConfused() {
  const root = mkdtempSync(join(tmpdir(), "mc-audit-ns-"));
  try {
    // 两个命名空间下各放一个同名纹理
    const mcTex = join(root, "assets", "minecraft", "textures", "block");
    const demoTex = join(root, "assets", "demo", "textures", "block");
    const demoModel = join(root, "assets", "demo", "models", "block");
    mkdirSync(mcTex, { recursive: true });
    mkdirSync(demoTex, { recursive: true });
    mkdirSync(demoModel, { recursive: true });
    writePng(join(mcTex, "shared.png"));
    writePng(join(demoTex, "shared.png"));

    // 只引用 demo 命名空间的那一个
    writeFileSync(
      join(demoModel, "shared.json"),
      JSON.stringify({ textures: { all: "demo:block/shared" } }),
    );
    const r = auditResources({ resourceRoot: root, modId: "demo" });

    // demo:block/shared 已引用 → 不得标孤儿
    assert.ok(
      !r.orphanTextures.some((p) => p.includes("assets/demo/")),
      `demo 的 shared 已引用，不得标孤儿: ${JSON.stringify(r.orphanTextures)}`,
    );
    // minecraft 命名空间下那个未被引用 → 应标孤儿（不再被 demo 的引用“顶替”）
    assert.ok(
      r.orphanTextures.some((p) => p.includes("assets/minecraft/")),
      `minecraft 的 shared 未引用，应标孤儿: ${JSON.stringify(r.orphanTextures)}`,
    );
    // 引用写了命名空间 → 不得报找不到
    assert.ok(
      !r.issues.some((i) => /未在命名空间|未找到对应/.test(i.message)),
      `跨命名空间引用不应误报缺失: ${JSON.stringify(r.issues)}`,
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

// 引用不存在的命名空间 → 应报缺失（且提示该命名空间）
function testWrongNamespaceReported() {
  const root = mkdtempSync(join(tmpdir(), "mc-audit-badns-"));
  try {
    const demoTex = join(root, "assets", "demo", "textures", "block");
    const demoModel = join(root, "assets", "demo", "models", "block");
    mkdirSync(demoTex, { recursive: true });
    mkdirSync(demoModel, { recursive: true });
    writePng(join(demoTex, "x.png"));
    writeFileSync(
      join(demoModel, "x.json"),
      // 纹理实际在 demo 下，却写成 other 命名空间
      JSON.stringify({ textures: { all: "other:block/x" } }),
    );
    const r = auditResources({ resourceRoot: root, modId: "demo" });
    assert.ok(
      r.issues.some((i) => /命名空间 other/.test(i.message)),
      `引用不存在的命名空间应报缺失并点名该命名空间: ${JSON.stringify(r.issues)}`,
    );
    // demo:block/x 无人引用 → 孤儿
    assert.ok(
      r.orphanTextures.some((p) => p.includes("assets/demo/")),
      `demo/block/x 应标孤儿: ${JSON.stringify(r.orphanTextures)}`,
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

// ── D-48：community store —— 读失败必须回落 DOC_NOT_FOUND，正文读取必须有界 ──

function writeCommunityRoot(root, entries) {
  mkdirSync(join(root, "indexes"), { recursive: true });
  writeFileSync(
    join(root, "indexes", "index-l0.json"),
    JSON.stringify({
      version: 1,
      entries: entries.map((e, i) => ({
        id: e.id ?? `c-${i}`,
        label: e.label ?? `条目 ${i}`,
        path: e.path,
        url: e.url ?? "",
        tags: e.tags ?? ["misc"],
        sourceKind: e.sourceKind ?? "authored",
        priority: e.priority ?? "🟢",
        summary: e.summary ?? `摘要 ${i} uniquesummaryword`,
      })),
    }),
    "utf8",
  );
}

function testCommunityUnreadableBodyIsDocNotFound() {
  const root = mkdtempSync(join(tmpdir(), "mc-community-d48-"));
  try {
    // path 指向一个**目录**：existsSync 通过、readFileSync 必 EISDIR ——
    // 这就是「index 与磁盘之间有竞态 / 文件被删 / 盘抖动」的确定性替身。
    writeCommunityRoot(root, [{ id: "dir-entry", path: "i-am-a-directory" }]);
    mkdirSync(join(root, "i-am-a-directory"), { recursive: true });
    const store = new CommunityDocStore(root);
    let err;
    try {
      store.getFull("dir-entry");
    } catch (e) {
      err = e;
    }
    assert.ok(err, "读不出正文时不得静默返回空内容（必须报错）");
    assert.ok(
      err instanceof CommunityDocNotFoundError || err?.code === "DOC_NOT_FOUND",
      `必须回落 DOC_NOT_FOUND，实际 ${err?.name}/${err?.code}: ${err?.message}`,
    );
    assert.equal(err.id, "dir-entry", "错误里要带条目 id");

    // 正常条目仍可读
    writeCommunityRoot(root, [{ id: "ok", path: "docs/ok.md" }]);
    mkdirSync(join(root, "docs"), { recursive: true });
    writeFileSync(join(root, "docs", "ok.md"), "---\ntitle: x\n---\n# 正文 uniqueword\n", "utf8");
    const okStore = new CommunityDocStore(root);
    assert.match(okStore.getFull("ok").content, /正文 uniqueword/);
    assert.ok(!okStore.getFull("ok").content.includes("title: x"), "frontmatter 必须被剥掉");
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

function testCommunityBodyHaystackIsCached() {
  const root = mkdtempSync(join(tmpdir(), "mc-community-cache-"));
  try {
    const n = 6;
    const entries = [];
    mkdirSync(join(root, "docs"), { recursive: true });
    for (let i = 0; i < n; i++) {
      entries.push({ id: `e${i}`, label: `条目 ${i}`, path: `docs/e${i}.md`, summary: `摘要 ${i}` });
      writeFileSync(join(root, "docs", `e${i}.md`), `# 标题${i}\n\n正文内容${i} 可搜索关键词\n`, "utf8");
    }
    writeCommunityRoot(root, entries);
    const store = new CommunityDocStore(root);
    resetCommunityReadStats();

    store.search("可搜索关键词");
    const first = getCommunityReadStats();
    assert.equal(first.bodyReads, n, `首趟必须读满 ${n} 个正文，实际 ${first.bodyReads}`);

    for (let i = 0; i < 3; i++) store.search("可搜索关键词");
    const warm = getCommunityReadStats();
    assert.equal(warm.bodyReads, first.bodyReads, `热趟不得再读正文：${first.bodyReads} → ${warm.bodyReads}`);
    assert.ok(warm.bodyCacheHits >= n * 3, `热趟必须命中缓存：${warm.bodyCacheHits}`);
    assert.ok(warm.bodyCacheSize <= warm.cap, `缓存必须有界：${warm.bodyCacheSize} <= ${warm.cap}`);

    // 命中结果不能因为缓存而丢失
    const hit = store.search("正文内容3");
    assert.ok(hit.some((r) => r.id === "e3"), `缓存后正文命中仍须有效：${JSON.stringify(hit.map((r) => r.id))}`);
    resetCommunityReadStats();
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

testAssetsRootReferencedNotOrphan();
testHashLayerNotPath();
testPngMcmetaNotTextureSet();
testShortRefDoesNotSwallowOrphan();
testCrossNamespaceNotConfused();
testWrongNamespaceReported();
testCommunityUnreadableBodyIsDocNotFound();
testCommunityBodyHaystackIsCached();
console.log("test-audit-resources: ok");
