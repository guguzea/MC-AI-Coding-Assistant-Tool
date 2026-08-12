import assert from "node:assert/strict";
import { checkDependencies } from "./dist/diagnostics/index.js";

// ── §4.6 单测矩阵 ──────────────────────────────────────────────────────────

// #1 Forge gradle + mods.toml javafml + owo 依赖 → forge + owo 冲突
function testForgeOwoConflict() {
  const gradle = `
plugins { id 'net.minecraftforge.gradle' }
minecraft { mappings channel: 'official', version: '1.20.1' }
dependencies {
  minecraft 'net.minecraftforge:forge:1.20.1-47.2.0'
  implementation 'io.wispforest:owo-lib:0.11.2+1.20.1'
}`;
  const toml = `
modLoader="javafml"
loaderVersion="[44,)"
[[mods]]
modId="example"
version="1.0.0"`;
  const r = checkDependencies(gradle, toml);
  assert.equal(r.detectedLoader, "forge", "mods.toml javafml 应判 forge");
  assert.ok(
    r.loaderConflicts.some((c) => c.libraryId === "owo"),
    `loaderConflicts 应含 owo，实际: ${JSON.stringify(r.loaderConflicts)}`,
  );
  const owo = r.detectedLibraries.find((l) => l.id === "authored/lib-owo");
  assert.ok(owo, "detectedLibraries 应含 authored/lib-owo");
  assert.equal(owo.communityDocId, "authored/lib-owo");
  assert.equal(owo.skillId, "mc-owo");
  assert.ok(owo.matchReason.includes("owo"), "matchReason 应含匹配关键字");
}

// #2 仅 fabric gradle + fabricModJson + trinkets → fabric；无「缺 mods.toml」误报
function testFabricNoModsTomlFalsePositive() {
  const gradle = `
plugins { id 'fabric-loom' version '1.6-SNAPSHOT' }
dependencies { minecraft "com.mojang:minecraft:1.20.1" }`;
  const fabricJson = JSON.stringify({
    schemaVersion: 1,
    id: "example",
    version: "1.0.0",
    depends: { minecraft: ">=1.20.1", trinkets: "*" },
  });
  const r = checkDependencies(gradle, undefined, fabricJson);
  assert.equal(r.detectedLoader, "fabric", "fabricModJson 应优先判 fabric");
  assert.ok(
    !r.issues.some((i) => /mods\.toml/i.test(i)),
    `不应有「缺 mods.toml」类误报，实际 issues: ${JSON.stringify(r.issues)}`,
  );
  assert.deepEqual(r.loaderConflicts, [], "fabric 不应报 fabric-only 冲突");
  assert.equal(r.traps.length, 0, "1.20.1 不应触发 trinkets_stale");
}

// #3 Fabric + trinkets + 1.21.4 字符串 → traps 含停更窗口
function testTrinketsStale() {
  const fabricJson = JSON.stringify({
    schemaVersion: 1,
    id: "example",
    depends: { minecraft: ">=1.21.4", trinkets: "*" },
  });
  const r = checkDependencies("", undefined, fabricJson);
  assert.equal(r.detectedLoader, "fabric");
  assert.ok(
    r.traps.some((t) => t.code === "trinkets_stale"),
    `traps 应含 trinkets_stale，实际: ${JSON.stringify(r.traps)}`,
  );
}

// #4 JEI compileOnly 软依赖文本 → detectedLibraries 含 jei
function testJeiSoftDependency() {
  const gradle = `
dependencies {
  compileOnly "mezz.jei:jei-1.20.1-forge:15.2.0.27"
}`;
  const r = checkDependencies(gradle);
  const jei = r.detectedLibraries.find((l) => l.id === "authored/library-integration-jei-emi");
  assert.ok(jei, "detectedLibraries 应含 library-integration-jei-emi（jei）");
  assert.equal(jei.communityDocId, "authored/library-integration-jei-emi");
  assert.ok(jei.matchReason.includes("jei"));
}

// #5 bookshelf 歧义坐标 → traps 重名
function testBookshelfAmbiguity() {
  const r = checkDependencies("dependencies { implementation 'com.example:bookshelf:1.0.0' }");
  assert.ok(
    r.traps.some((t) => t.code === "bookshelf_spigot"),
    `traps 应含 bookshelf_spigot，实际: ${JSON.stringify(r.traps)}`,
  );
  // Darkhax 正版坐标（bookshelf-lib / darkhax group）不应误报
  const ok = checkDependencies("dependencies { implementation 'net.darkhax.bookshelf:Bookshelf-Forge:20.1.5' }");
  assert.ok(!ok.traps.some((t) => t.code === "bookshelf_spigot"), "darkhax bookshelf 不应误报重名陷阱");
}

// #6 unknown loader（空 gradle）→ detectedLoader=unknown，冲突降级
function testUnknownLoader() {
  const r = checkDependencies("", "");
  assert.equal(r.detectedLoader, "unknown");
  assert.deepEqual(r.loaderConflicts, [], "unknown loader 应降级：无冲突判定");
  assert.ok(
    r.issues.some((i) => /minecraft|loader/i.test(i)),
    "空 gradle 应保留「缺 minecraft/loader 依赖」启发式",
  );
}

function main() {
  testForgeOwoConflict();
  testFabricNoModsTomlFalsePositive();
  testTrinketsStale();
  testJeiSoftDependency();
  testBookshelfAmbiguity();
  testUnknownLoader();
  console.log("test-checkdeps: ok");
}

main();
