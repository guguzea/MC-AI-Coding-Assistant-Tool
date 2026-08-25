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

testAssetsRootReferencedNotOrphan();
testHashLayerNotPath();
testPngMcmetaNotTextureSet();
console.log("test-audit-resources: ok");
