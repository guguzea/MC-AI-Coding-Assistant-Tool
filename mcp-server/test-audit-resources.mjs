/**
 * audit_resources：纹理引用/孤儿路径归一化（禁止空壳 smoke）。
 */
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { auditResources } from "./dist/audit-resources/index.js";

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

testAssetsRootReferencedNotOrphan();
testHashLayerNotPath();
testPngMcmetaNotTextureSet();
testShortRefDoesNotSwallowOrphan();
testCrossNamespaceNotConfused();
testWrongNamespaceReported();
console.log("test-audit-resources: ok");
