/**
 * T2 decompile tool family tests（RED→GREEN，CI 安全：无需 Java 17 / 无网络）
 *
 * 覆盖：
 * - version-manager：版本解析与 yarn/mojmap 版本区间分类
 * - cache.ts：MC_SKILL_CACHE 目录解析 + cache.db 元数据 roundtrip + 锁
 * - mod-analyzer：临时目录构造 fixture jar-like zip → 结构化元数据
 * - search-mod-source：对临时反编译目录做 grep → file:line 命中
 * - java-process：对本机真实 `java` 探测（本机 Java 1.8 → NOT 17）
 *
 * 用法：node test-decompile.mjs （前置：npm run build）
 */
import assert from "node:assert/strict";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { crc32, deflateRawSync } from "node:zlib";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── fixture zip 构造（store + deflate 两种方法，零依赖）────────────────────────
function makeZip(files) {
  // files: [{name, data, deflate?}]
  const chunks = [];
  const central = [];
  let offset = 0;
  for (const f of files) {
    const nameBuf = Buffer.from(f.name, "utf8");
    const dataBuf = Buffer.isBuffer(f.data) ? f.data : Buffer.from(String(f.data), "utf8");
    const method = f.deflate ? 8 : 0;
    const payload = f.deflate ? deflateRawSync(dataBuf) : dataBuf;
    const flags = 0x0800; // UTF-8 names

    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(flags, 6);
    local.writeUInt16LE(method, 8);
    local.writeUInt16LE(0, 10);
    local.writeUInt16LE(0, 12);
    local.writeUInt32LE(crc32(dataBuf), 14);
    local.writeUInt32LE(payload.length, 18);
    local.writeUInt32LE(dataBuf.length, 22);
    local.writeUInt16LE(nameBuf.length, 26);
    local.writeUInt16LE(0, 28);
    chunks.push(local, nameBuf, payload);

    const cd = Buffer.alloc(46);
    cd.writeUInt32LE(0x02014b50, 0);
    cd.writeUInt16LE(20, 4);
    cd.writeUInt16LE(20, 6);
    cd.writeUInt16LE(flags, 8);
    cd.writeUInt16LE(method, 10);
    cd.writeUInt16LE(0, 12);
    cd.writeUInt16LE(0, 14);
    cd.writeUInt32LE(crc32(dataBuf), 16);
    cd.writeUInt32LE(payload.length, 20);
    cd.writeUInt32LE(dataBuf.length, 24);
    cd.writeUInt16LE(nameBuf.length, 28);
    cd.writeUInt16LE(0, 30);
    cd.writeUInt16LE(0, 32);
    cd.writeUInt16LE(0, 34);
    cd.writeUInt16LE(0, 36);
    cd.writeUInt32LE(0, 38);
    cd.writeUInt32LE(offset, 42);
    central.push(cd, nameBuf);
    offset += 30 + nameBuf.length + payload.length;
  }
  const centralBuf = Buffer.concat(central);
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(0, 4);
  eocd.writeUInt16LE(0, 6);
  eocd.writeUInt16LE(files.length, 8);
  eocd.writeUInt16LE(files.length, 10);
  eocd.writeUInt32LE(centralBuf.length, 12);
  eocd.writeUInt32LE(offset, 16);
  eocd.writeUInt16LE(0, 20);
  return Buffer.concat([...chunks, centralBuf, eocd]);
}

const FABRIC_MOD_JSON = {
  schemaVersion: 1,
  id: "fixturemod",
  version: "1.0.0",
  name: "Fixture Mod",
  description: "A test fixture mod",
  entrypoints: {
    main: ["com.example.fixture.FixtureMod"],
    client: ["com.example.fixture.FixtureClient"],
  },
  depends: { fabricloader: ">=0.15.0", minecraft: "1.20.1" },
  mixins: [{ config: "fixture.mixins.json" }],
};

const FIXTURE_MIXINS_JSON = {
  required: true,
  package: "com.example.fixture.mixin",
  compatibilityLevel: "JAVA_17",
  mixins: ["ExampleMixin"],
};

const FIXTURE_MODS_TOML = `modLoader="javafml"
loaderVersion="[44,)"
license="MIT"

[[mods]]
modId="fixtureforge"
version="2.0.0"
displayName="Fixture Forge"
description="A forge fixture"

[[dependencies.fixtureforge]]
modId="forge"
versionRange="[47,)"
mandatory=true
ordering="NONE"
side="BOTH"
`;

let passed = 0;
let failed = 0;
function test(name, fn) {
  try {
    fn();
    passed += 1;
    console.log(`  ok  ${name}`);
  } catch (err) {
    failed += 1;
    console.error(`  FAIL ${name}\n      ${err.message}`);
  }
}
function section(title) {
  console.log(`\n=== ${title} ===`);
}

// ── 1. version-manager ────────────────────────────────────────────────────────
section("version-manager");
{
  const { parseMinecraftVersion, resolveMappingChoice } = await import("./dist/decompile/version-manager.js");

  test("1.20.1 → valid, yarn-capable (1.14–1.21.11)", () => {
    const v = parseMinecraftVersion("1.20.1");
    assert.equal(v.valid, true);
    assert.equal(v.major, 1);
    assert.equal(v.minor, 20);
    assert.equal(v.patch, 1);
    assert.equal(v.hasYarn, true);
    assert.equal(v.unobfuscated, false);
    assert.equal(v.supported, true);
  });

  test("26.1 → valid, mojmap-only (unobfuscated, no yarn)", () => {
    const v = parseMinecraftVersion("26.1");
    assert.equal(v.valid, true);
    assert.equal(v.major, 26);
    assert.equal(v.hasYarn, false);
    assert.equal(v.unobfuscated, true);
    assert.equal(v.supported, true);
  });

  test("1.21.11 → valid, yarn-capable", () => {
    const v = parseMinecraftVersion("1.21.11");
    assert.equal(v.valid, true);
    assert.equal(v.hasYarn, true);
    assert.equal(v.supported, true);
  });

  test("1.12.2 → syntax valid but unsupported (below 1.14)", () => {
    const v = parseMinecraftVersion("1.12.2");
    assert.equal(v.valid, true);
    assert.equal(v.supported, false);
    assert.ok(v.error && v.error.includes("1.14"), `error should mention 1.14: ${v.error}`);
  });

  test("garbage → invalid", () => {
    const v = parseMinecraftVersion("banana");
    assert.equal(v.valid, false);
    assert.ok(v.error);
  });

  test("snapshot → invalid with snapshot hint", () => {
    const v = parseMinecraftVersion("24w14a");
    assert.equal(v.valid, false);
    assert.ok(v.error && /snapshot|快照/i.test(v.error), `error should mention snapshot: ${v.error}`);
  });

  test("resolveMappingChoice: auto+1.20.1 → yarn; auto+26.1 → mojmap; yarn+26.1 → error", () => {
    const yarn = resolveMappingChoice("auto", parseMinecraftVersion("1.20.1"));
    assert.equal(yarn.mapping, "yarn");
    assert.equal(yarn.error, undefined);
    const moj = resolveMappingChoice("auto", parseMinecraftVersion("26.1"));
    assert.equal(moj.mapping, "mojmap");
    assert.equal(moj.error, undefined);
    const bad = resolveMappingChoice("yarn", parseMinecraftVersion("26.1"));
    assert.ok(bad.error, "yarn on 26.1 must error");
  });
}

// ── 2. cache ─────────────────────────────────────────────────────────────────
section("cache");
{
  const { resolveCacheRoot, ensureCachePaths, openCacheDb, setMeta, getMeta, acquireCacheLock } = await import(
    "./dist/decompile/cache.js"
  );

  const tmpRoot = join(tmpdir(), `mc-skill-cache-test-${Date.now()}`);
  mkdirSync(tmpRoot, { recursive: true });

  test("resolveCacheRoot honors MC_SKILL_CACHE", () => {
    const prev = process.env.MC_SKILL_CACHE;
    process.env.MC_SKILL_CACHE = tmpRoot;
    try {
      assert.equal(resolveCacheRoot(), tmpRoot);
    } finally {
      if (prev === undefined) delete process.env.MC_SKILL_CACHE;
      else process.env.MC_SKILL_CACHE = prev;
    }
  });

  test("resolveCacheRoot default contains mc-skill-cache", () => {
    const prev = process.env.MC_SKILL_CACHE;
    delete process.env.MC_SKILL_CACHE;
    try {
      assert.ok(resolveCacheRoot().includes("mc-skill-cache"), resolveCacheRoot());
    } finally {
      if (prev !== undefined) process.env.MC_SKILL_CACHE = prev;
    }
  });

  test("ensureCachePaths creates full layout under temp root", () => {
    const p = ensureCachePaths(tmpRoot);
    for (const dir of [p.jars, p.mappings, p.remapped, p.decompiled, p.decompiledMods, p.registry, p.resources]) {
      assert.ok(existsSync(dir), `missing ${dir}`);
    }
    assert.ok(p.root === tmpRoot);
  });

  test("cache.db metadata roundtrip (set → get, overwrite)", () => {
    const db = openCacheDb(tmpRoot);
    setMeta(db, "schemaVersion", "1");
    assert.equal(getMeta(db, "schemaVersion"), "1");
    setMeta(db, "schemaVersion", "2");
    assert.equal(getMeta(db, "schemaVersion"), "2");
    assert.equal(getMeta(db, "missing-key"), null);
    db.close();
  });

  test("acquireCacheLock: second acquire on same key is busy, release frees", async () => {
    const release = await acquireCacheLock(tmpRoot, "test-key", 2000);
    await assert.rejects(
      () => acquireCacheLock(tmpRoot, "test-key", 50),
      (err) => err && err.code === "CACHE_LOCK_BUSY",
      "expected CACHE_LOCK_BUSY",
    );
    release();
    const release2 = await acquireCacheLock(tmpRoot, "test-key", 2000);
    release2();
  });

  test("acquireCacheLock: stale lock taken over via rename; live heartbeat lock is not", async () => {
    const { touchCacheLock } = await import("./dist/decompile/cache.js");
    // 人工构造陈旧锁（owner.at 远超 timeout，模拟持锁进程死亡）→ 应被 rename 抢占
    const staleDir = join(tmpRoot, "locks", "stale-key");
    mkdirSync(staleDir, { recursive: true });
    writeFileSync(
      join(staleDir, "owner.json"),
      JSON.stringify({ pid: 999999, at: Date.now() - 60_000 }),
    );
    const release = await acquireCacheLock(tmpRoot, "stale-key", 1000);
    release();

    // 活锁（owner.at 新鲜）即使 mtime 旧也不得被抢；touchCacheLock 续租
    const liveDir = join(tmpRoot, "locks", "live-key");
    mkdirSync(liveDir, { recursive: true });
    writeFileSync(join(liveDir, "owner.json"), JSON.stringify({ pid: process.pid, at: Date.now() }));
    touchCacheLock("live-key", tmpRoot);
    await assert.rejects(
      () => acquireCacheLock(tmpRoot, "live-key", 30_000),
      (err) => err && err.code === "CACHE_LOCK_BUSY",
      "live lock with fresh owner.at must not be taken over",
    );
    rmSync(liveDir, { recursive: true, force: true });
  });

  rmSync(tmpRoot, { recursive: true, force: true });
}

// ── 3. mod-analyzer（fixture jar-like zip）────────────────────────────────────
section("mod-analyzer");
{
  const { analyzeModJar } = await import("./dist/decompile/services/mod-analyzer.js");

  const tmpRoot = join(tmpdir(), `mc-skill-modtest-${Date.now()}`);
  mkdirSync(tmpRoot, { recursive: true });

  const fabricJar = join(tmpRoot, "fixturemod-1.0.0.jar");
  writeFileSync(
    fabricJar,
    makeZip([
      { name: "fabric.mod.json", data: JSON.stringify(FABRIC_MOD_JSON, null, 2) },
      { name: "fixture.mixins.json", data: JSON.stringify(FIXTURE_MIXINS_JSON, null, 2), deflate: true },
      { name: "com/example/fixture/FixtureMod.class", data: Buffer.from([0xca, 0xfe, 0xba, 0xbe, 0, 0, 0, 0]) },
      { name: "fixture.accesswidener", data: "accessWidener v2 named\naccessible class com/example/fixture/FixtureMod\n" },
      { name: "assets/fixturemod/lang/en_us.json", data: '{"item.fixturemod.thing": "Thing"}' },
    ]),
  );

  test("analyze fabric jar → loaders/modId/entrypoints/mixins/deps", () => {
    const r = analyzeModJar(fabricJar);
    assert.equal(r.found, true);
    assert.ok(r.loaders.includes("fabric"), `loaders=${JSON.stringify(r.loaders)}`);
    assert.equal(r.modId, "fixturemod");
    assert.equal(r.modVersion, "1.0.0");
    assert.deepEqual(r.entrypoints?.main, ["com.example.fixture.FixtureMod"]);
    assert.deepEqual(r.entrypoints?.client, ["com.example.fixture.FixtureClient"]);
    const mixinRef = (r.mixins ?? []).find((m) => m.file === "fixture.mixins.json");
    assert.ok(mixinRef, `mixins refs: ${JSON.stringify(r.mixins)}`);
    const dep = (r.dependencies ?? []).find((d) => d.id === "fabricloader");
    assert.ok(dep, `dependencies: ${JSON.stringify(r.dependencies)}`);
    assert.equal(r.entryCount, 5);
    assert.ok((r.accessWideners ?? []).includes("fixture.accesswidener"));
    // deflate 条目内容也必须解析正确（zip reader 走 inflateRaw）
    assert.equal(r.mixins.some((m) => m.file === "fixture.mixins.json"), true);
  });

  test("analyze forge jar (META-INF/mods.toml) → loaders=[forge], modId from [[mods]]", () => {
    const forgeJar = join(tmpRoot, "fixtureforge-2.0.0.jar");
    writeFileSync(
      forgeJar,
      makeZip([
        { name: "META-INF/mods.toml", data: FIXTURE_MODS_TOML },
        { name: "com/example/forge/FixtureForge.class", data: Buffer.from([0xca, 0xfe, 0xba, 0xbe]) },
      ]),
    );
    const r = analyzeModJar(forgeJar);
    assert.equal(r.found, true);
    assert.ok(r.loaders.includes("forge"), `loaders=${JSON.stringify(r.loaders)}`);
    assert.equal(r.modId, "fixtureforge");
    assert.equal(r.modVersion, "2.0.0");
    const dep = (r.dependencies ?? []).find((d) => d.id === "forge");
    assert.ok(dep && dep.versionRange === "[47,)", `deps=${JSON.stringify(r.dependencies)}`);
  });

  test("missing jar → found:false + actionable", () => {
    const r = analyzeModJar(join(tmpRoot, "does-not-exist.jar"));
    assert.equal(r.found, false);
    assert.ok(r.action && r.action.code, "must carry actionable envelope");
  });

  test("relative path rejected (local absolute only)", () => {
    const r = analyzeModJar("fixturemod-1.0.0.jar");
    assert.equal(r.found, false);
    assert.ok(r.action && r.action.code === "INVALID_INPUT");
  });

  test("quilt.mod.json + fabric.mod.json → loaders=[quilt], quilt id/entrypoints win, no multi-loader warning", () => {
    const quiltJar = join(tmpRoot, "fixturequilt-1.0.0.jar");
    writeFileSync(
      quiltJar,
      makeZip([
        {
          name: "quilt.mod.json",
          data: JSON.stringify({
            schema_version: 1,
            quilt_loader: {
              id: "quiltmod",
              version: "1.0.0",
              metadata: { name: "Quilt Mod" },
              entrypoints: {
                init: "com.example.quilt.Init",
                client_init: { value: "com.example.quilt.Client" },
              },
            },
          }),
        },
        {
          name: "fabric.mod.json",
          data: JSON.stringify({
            schemaVersion: 1,
            id: "fabricname",
            version: "9.9.9",
            name: "Fabric Name",
            entrypoints: { main: ["com.example.fabric.Main"] },
            depends: { minecraft: ">=1.20" },
          }),
        },
      ]),
    );
    const r = analyzeModJar(quiltJar);
    assert.equal(r.found, true);
    assert.deepEqual(r.loaders, ["quilt"], `loaders=${JSON.stringify(r.loaders)}`);
    assert.ok(!r.loaders.includes("fabric"));
    assert.equal(r.modId, "quiltmod");
    assert.equal(r.modVersion, "1.0.0");
    assert.deepEqual(r.entrypoints?.init, ["com.example.quilt.Init"]);
    assert.deepEqual(r.entrypoints?.client_init, ["com.example.quilt.Client"]);
    assert.ok(!r.entrypoints?.main, `fabric entrypoints must not replace quilt: ${JSON.stringify(r.entrypoints)}`);
    assert.ok(r.dependencies.some((d) => d.id === "minecraft"), `fabric depends still merge: ${JSON.stringify(r.dependencies)}`);
    assert.ok(!r.warnings.some((w) => /多个 loader/.test(w)), `warnings=${JSON.stringify(r.warnings)}`);
  });

  test("quilt entrypoint { value: com.example.X }", () => {
    const quiltJar = join(tmpRoot, "quilt-value-ep.jar");
    writeFileSync(
      quiltJar,
      makeZip([
        {
          name: "quilt.mod.json",
          data: JSON.stringify({
            schema_version: 1,
            quilt_loader: {
              id: "qval",
              version: "1.0.0",
              entrypoints: { init: { value: "com.example.X" } },
            },
          }),
        },
      ]),
    );
    const r = analyzeModJar(quiltJar);
    assert.equal(r.found, true);
    assert.deepEqual(r.entrypoints?.init, ["com.example.X"]);
  });

  rmSync(tmpRoot, { recursive: true, force: true });
}

// ── 4. search-mod-source ─────────────────────────────────────────────────────
section("search-mod-source");
{
  const { searchModSource } = await import("./dist/decompile/services/search-mod-source.js");

  const tmpRoot = join(tmpdir(), `mc-skill-searchtest-${Date.now()}`);
  mkdirSync(join(tmpRoot, "net/minecraft/world/item"), { recursive: true });
  writeFileSync(
    join(tmpRoot, "net/minecraft/world/item/Item.java"),
    "package net.minecraft.world.item;\npublic class Item {\n  public int getMaxStackSize() { return 64; }\n}\n",
  );
  writeFileSync(
    join(tmpRoot, "net/minecraft/world/item/ItemStack.java"),
    "package net.minecraft.world.item;\npublic class ItemStack {\n  public Item getItem() { return null; }\n}\n",
  );
  writeFileSync(join(tmpRoot, "README.txt"), "not java, but contains ItemStack mention");

  test("substring hit → correct file:line pairs", () => {
    const r = searchModSource({ root: tmpRoot, query: "getMaxStackSize" });
    assert.equal(r.found, true);
    const hit = r.hits.find((h) => h.relPath.endsWith("Item.java"));
    assert.ok(hit, `hits: ${JSON.stringify(r.hits.map((h) => h.relPath))}`);
    assert.equal(hit.line, 3);
    assert.ok(hit.text.includes("getMaxStackSize"));
  });

  test("pattern mode (regex) → hit", () => {
    const r = searchModSource({ root: tmpRoot, query: "getItem\\(\\).*null", pattern: true });
    assert.equal(r.found, true);
    assert.ok(r.hits.some((h) => h.relPath.endsWith("ItemStack.java")));
  });

  test("invalid regex → found:false + INVALID_INPUT actionable", () => {
    const r = searchModSource({ root: tmpRoot, query: "([", pattern: true });
    assert.equal(r.found, false);
    assert.ok(r.action && r.action.code === "INVALID_INPUT");
  });

  test("no hit → found:false, total 0 (no fake success)", () => {
    const r = searchModSource({ root: tmpRoot, query: "zzz-no-such-term-zzz" });
    assert.equal(r.found, false);
    assert.equal(r.total, 0);
  });

  test("missing root → found:false + actionable", () => {
    const r = searchModSource({ root: join(tmpRoot, "nope"), query: "x" });
    assert.equal(r.found, false);
    assert.ok(r.action);
  });

  rmSync(tmpRoot, { recursive: true, force: true });
}

// ── 5. java-process（对本机真实 java，无需 Java 17）───────────────────────────
section("java-process");
{
  const { probeJava, toolchainActionable, skipDownloadsEnabled } = await import(
    "./dist/decompile/java/java-process.js"
  );

  test("probeJava on this machine → NOT ready (Java is 1.8 / or absent)", async () => {
    const probe = await probeJava(true);
    assert.equal(probe.ready, false, `expected java <17 or missing, got ${JSON.stringify(probe)}`);
    assert.ok(probe.reason === "TOO_OLD" || probe.reason === "NOT_FOUND", `reason=${probe.reason}`);
    if (probe.major !== null) {
      assert.ok(probe.major < 17, `major=${probe.major}`);
    }
  });

  test("toolchainActionable → TOOLCHAIN_MISSING + Adoptium install guidance", () => {
    const a = toolchainActionable();
    assert.equal(a.code, "TOOLCHAIN_MISSING");
    assert.ok(a.nextSteps.some((s) => /adoptium|Adoptium/i.test(s)), a.nextSteps.join(" | "));
  });

  test("skipDownloadsEnabled: off by default, on when MC_SKILL_SKIP_DOWNLOAD=1", () => {
    const prev = process.env.MC_SKILL_SKIP_DOWNLOAD;
    delete process.env.MC_SKILL_SKIP_DOWNLOAD;
    assert.equal(skipDownloadsEnabled(), false);
    process.env.MC_SKILL_SKIP_DOWNLOAD = "1";
    assert.equal(skipDownloadsEnabled(), true);
    if (prev === undefined) delete process.env.MC_SKILL_SKIP_DOWNLOAD;
    else process.env.MC_SKILL_SKIP_DOWNLOAD = prev;
  });
}

// ── 6. SKIP_DOWNLOAD handler 断言（不只测开关函数）────────────────────────────
section("SKIP_DOWNLOAD handlers");
{
  const { getMinecraftSource } = await import("./dist/decompile/services/decompile-service.js");
  const { decompileModJar } = await import("./dist/decompile/services/mod-decompile.js");

  const prev = process.env.MC_SKILL_SKIP_DOWNLOAD;
  process.env.MC_SKILL_SKIP_DOWNLOAD = "1";
  try {
    const src = await getMinecraftSource({
      version: "1.20.1",
      className: "net.minecraft.world.entity.LivingEntity",
    });
    test("getMinecraftSource → DOWNLOAD_DISABLED", () => {
      assert.equal(src.found, false);
      const code = src.error ?? src.action?.code;
      assert.equal(code, "DOWNLOAD_DISABLED", JSON.stringify(src));
    });

    const jarPath = join(tmpdir(), `mc-skill-skip-dl-${process.pid}.jar`);
    writeFileSync(
      jarPath,
      makeZip([{ name: "META-INF/MANIFEST.MF", data: "Manifest-Version: 1.0\n" }]),
    );
    const mod = await decompileModJar({ jarPath });
    test("decompileModJar → DOWNLOAD_DISABLED", () => {
      assert.equal(mod.found, false);
      assert.equal(mod.error, "DOWNLOAD_DISABLED", JSON.stringify(mod));
    });
    rmSync(jarPath, { force: true });
  } finally {
    if (prev === undefined) delete process.env.MC_SKILL_SKIP_DOWNLOAD;
    else process.env.MC_SKILL_SKIP_DOWNLOAD = prev;
  }
}

// ── 7. zip-inflate A-1 解压炸弹防护 ───────────────────────────────────────────
section("zip-inflate (A-1)");
{
  const { readZip } = await import("./dist/decompile/zip-util.js");

  // 把 zip 里唯一条目的声明解压尺寸（LFH+CD）改成 forgedUsize，其余字节不动
  function forgeUsize(zipBuf, forgedUsize) {
    const b = Buffer.from(zipBuf);
    const eocd = b.length - 22;
    const cdOffset = b.readUInt32LE(eocd + 16);
    b.writeUInt32LE(forgedUsize, cdOffset + 24); // CD usize
    const localOffset = b.readUInt32LE(cdOffset + 42);
    b.writeUInt32LE(forgedUsize, localOffset + 22); // LFH usize
    return b;
  }

  const legit = makeZip([{ name: "bomb.bin", data: Buffer.alloc(65536, 0), deflate: true }]);

  test("legit deflate entry still inflates (no regression)", () => {
    const m = readZip(legit);
    assert.equal(m.get("bomb.bin").length, 65536);
  });

  test("declared usize over hard cap → ZIP_ENTRY_TOO_LARGE（不进 zlib）", () => {
    const forged = forgeUsize(legit, 0x40000000); // 1GB 声明，实际仅 64KB
    assert.throws(() => readZip(forged), (err) => err.code === "ZIP_ENTRY_TOO_LARGE");
  });

  test("declared usize under cap but real output exceeds it → ZIP_ENTRY_BOMB_SUSPECTED", () => {
    const forged = forgeUsize(legit, 100);
    assert.throws(() => readZip(forged), (err) => err.code === "ZIP_ENTRY_BOMB_SUSPECTED");
  });

  test("inflated size ≠ declared size → ZIP_ENTRY_SIZE_MISMATCH", () => {
    const forged = forgeUsize(legit, 70000); // 实际 65536 ≠ 声明 70000
    assert.throws(() => readZip(forged), (err) => err.code === "ZIP_ENTRY_SIZE_MISMATCH");
  });

  test("MC_SKILL_MAX_ENTRY_BYTES lowers cap", () => {
    const prev = process.env.MC_SKILL_MAX_ENTRY_BYTES;
    process.env.MC_SKILL_MAX_ENTRY_BYTES = "1000";
    try {
      assert.throws(() => readZip(legit), (err) => err.code === "ZIP_ENTRY_TOO_LARGE");
    } finally {
      if (prev === undefined) delete process.env.MC_SKILL_MAX_ENTRY_BYTES;
      else process.env.MC_SKILL_MAX_ENTRY_BYTES = prev;
    }
  });
}

{
  section("toml-parse quoted hash");
  const { parseModsToml, stripTomlCommentOutsideQuotes } = await import("./dist/decompile/services/toml-parse.js");
  test("hash inside quotes kept (version 1.0#x)", () => {
    const t = parseModsToml('modLoader="javafml"\n[[mods]]\nmodId="demo"\nversion="1.0#x"\n');
    assert.equal(t.mods[0]?.version, "1.0#x");
    assert.equal(stripTomlCommentOutsideQuotes(' "1.0#x" '), ' "1.0#x" ');
  });
  test("hash outside quotes still strips comment", () => {
    const t = parseModsToml('modLoader="javafml"\n[[mods]]\nmodId="demo"\nversion="1.0" # c\n');
    assert.equal(t.mods[0]?.version, "1.0");
    assert.equal(stripTomlCommentOutsideQuotes(' "1.0" # c').trim(), '"1.0"');
  });
}

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
