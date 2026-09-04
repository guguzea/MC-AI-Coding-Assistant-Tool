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
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { crc32, deflateRawSync } from "node:zlib";
import {
  decompileDegradation,
  requestedRemapKey,
  judgeDecompiledCacheHit,
  readDecompiledMeta,
  writeDecompiledMeta,
} from "./dist/decompile/services/mod-decompile.js";

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
    // 默认 UTF-8 名（bit 11）；D-31 的位标记门用 `flags: 0` 造「未声明 UTF-8」条目。
    // 同一个值同时写进 local header(+6) 与 central header(+8)，与实际打包工具的行为一致。
    const flags = f.flags ?? 0x0800;

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

/**
 * 同步断言用例。fn() 返回 thenable 一律判失败：`test(name, async () => ...)` 若只
 * `fn(); passed+=1;` 就会假绿——断言在别人的用例之后才执行（tmpRoot 已删、锁顺序打乱），
 * 失败时还会以 unhandledRejection 崩掉整个套件。async 用例写 `await atest(...)`。
 */
function test(name, fn) {
  let result;
  try {
    result = fn();
  } catch (err) {
    failed += 1;
    console.error(`  FAIL ${name}\n      ${err?.message ?? err}`);
    return;
  }
  if (result && typeof result.then === "function") {
    failed += 1;
    console.error(
      `  FAIL ${name}\n      async 用例被交给同步 test()：断言永不按序执行。改成 await atest(...)`,
    );
    result.catch(() => {
      /* 吞掉浮动 rejection，让套件跑完并如实汇总，而不是崩在半路 */
    });
    return;
  }
  passed += 1;
  console.log(`  ok  ${name}`);
}

/** 异步断言用例：调用方必须 `await`，否则后续清理（rmSync tmpRoot）会抢在断言之前。 */
async function atest(name, fn) {
  try {
    await fn();
    passed += 1;
    console.log(`  ok  ${name}`);
  } catch (err) {
    failed += 1;
    console.error(`  FAIL ${name}\n      ${err?.message ?? err}`);
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
  const { resolveCacheRoot, ensureCachePaths, openCacheDb, setMeta, getMeta, acquireCacheLock, normalizeArtifactPath, sanitizeCacheSegment, isPathInside, listLocks, lockDirOf, sanitizeLockName } = await import(
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

  await atest("acquireCacheLock: second acquire on same key is busy, release frees", async () => {
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

  await atest("acquireCacheLock: 陈旧锁经 rename CAS 抢占（夹具必须落在真实哈希锁目录）", async () => {
    const name = "stale-key";
    const staleDir = lockDirOf(tmpRoot, name);
    // 假绿防线：旧夹具写 locks/<name>，被测代码看的是 locks/<name>_<hash> → 从未触达
    assert.notEqual(basename(staleDir), name, "锁目录名必须带 sha1 后缀");
    assert.ok(!existsSync(join(tmpRoot, "locks", name)), "裸名目录不得存在（存在即夹具写错路径）");

    mkdirSync(staleDir, { recursive: true });
    writeFileSync(join(staleDir, "owner.json"), JSON.stringify({ pid: 999999, at: Date.now() - 60_000 }));
    // 抢占走 rename→复核→rmSync→mkdir：哨兵文件必须随旧目录一起消失
    writeFileSync(join(staleDir, "SENTINEL"), "prev-holder", "utf8");

    const release = await acquireCacheLock(tmpRoot, name, 1000);
    try {
      assert.ok(!existsSync(join(staleDir, "SENTINEL")), "旧锁目录未被丢弃 → 抢占路径没有真正执行");
      const owner = JSON.parse(readFileSync(join(staleDir, "owner.json"), "utf8"));
      assert.equal(owner.pid, process.pid, "新持有者未写 owner.json");
    } finally {
      release();
    }
    assert.ok(!existsSync(staleDir), "release 必须删除锁目录");
  });

  await atest("acquireCacheLock: owner.at 新鲜即活锁，目录 mtime 很旧也不得被抢", async () => {
    const name = "live-key";
    const liveDir = lockDirOf(tmpRoot, name);
    mkdirSync(liveDir, { recursive: true });
    writeFileSync(join(liveDir, "owner.json"), JSON.stringify({ pid: 999999, at: Date.now() }));
    // mtime 倒退 1h：只看 mtime 的判陈旧实现会误抢，并把别人的锁 rename 走
    const { utimesSync } = await import("node:fs");
    const back = new Date(Date.now() - 3_600_000);
    utimesSync(liveDir, back, back);

    await assert.rejects(
      () => acquireCacheLock(tmpRoot, name, 30_000),
      (err) => err && err.code === "CACHE_LOCK_BUSY",
      "owner.at 新鲜的活锁不得被抢占",
    );
    assert.ok(existsSync(liveDir), "被拒的获取方不得破坏持有者的锁目录");
    assert.equal(
      JSON.parse(readFileSync(join(liveDir, "owner.json"), "utf8")).pid,
      999999,
      "被拒的获取方不得改写 owner.json",
    );
    rmSync(liveDir, { recursive: true, force: true });
  });

  await atest("touchCacheLock 续租真实锁目录；release 后不得残留心跳", async () => {
    const { touchCacheLock } = await import("./dist/decompile/cache.js");
    const name = "hb-key";
    const dir = lockDirOf(tmpRoot, name);
    const release = await acquireCacheLock(tmpRoot, name, 5_000);
    try {
      writeFileSync(join(dir, "owner.json"), JSON.stringify({ pid: process.pid, at: Date.now() - 400_000 }));
      touchCacheLock(name, tmpRoot);
      const at = JSON.parse(readFileSync(join(dir, "owner.json"), "utf8")).at;
      assert.ok(Date.now() - at < 5_000, `续租没写回真实锁目录：age=${Date.now() - at}ms`);
    } finally {
      release();
    }
    assert.ok(!existsSync(dir), "release 后锁目录残留");
  });

  test("E15 normalizeArtifactPath collapses Win case/slash", () => {
    if (process.platform === "win32") {
      assert.equal(normalizeArtifactPath("H:\\x.jar"), normalizeArtifactPath("h:\\X.jar"));
    } else {
      assert.ok(typeof normalizeArtifactPath("/tmp/X.jar") === "string");
    }
  });

  test("E3 sanitizeCacheSegment keeps 1.20.1, rejects .. traversal", () => {
    assert.equal(sanitizeCacheSegment("1.20.1"), "1.20.1");
    assert.equal(sanitizeCacheSegment("my-mod"), "my-mod");
    assert.equal(sanitizeCacheSegment(".."), null);
    assert.equal(sanitizeCacheSegment("."), null);
    assert.equal(sanitizeCacheSegment("foo..bar"), null);
    assert.equal(sanitizeCacheSegment("a/b"), "a_b");
  });

  test("E3 decompiled-mods prefix guard (Win case-insensitive)", () => {
    const p = ensureCachePaths(tmpRoot);
    assert.equal(isPathInside(p.decompiledMods, join(p.decompiledMods, "mymod", "1.20.1")), true);
    assert.equal(isPathInside(p.decompiledMods, join(p.decompiledMods, "..", "jars")), false);
    assert.equal(p.decompiledMods.endsWith("decompiled-mods") || p.decompiledMods.endsWith("decompiled-mods\\") || /decompiled-mods$/.test(p.decompiledMods.replace(/\\/g, "/")), true);
  });

  await atest("E3 lock name .. does not escape locks/", async () => {
    // 命名层直接锁死：`..` / `.` / `a/../../b` 必须折成 invalid_<hash>，不得成为目录名
    for (const bad of ["..", ".", "../..", "a/../../b", "..\\..\\x"]) {
      const nm = sanitizeLockName(bad);
      assert.ok(nm.startsWith("invalid_"), `${bad} → ${nm} 未落到 invalid_ 前缀`);
      assert.ok(!nm.includes("..") && !nm.includes("/") && !nm.includes("\\"), `${bad} → ${nm} 含穿越字符`);
    }
    assert.ok(sanitizeLockName("1.20.1").startsWith("1.20.1_"), "合法版本段应保留可读前缀");
    const release = await acquireCacheLock(tmpRoot, "..", 2000);
    try {
      const locks = listLocks(tmpRoot);
      assert.ok(locks.every((n) => n !== ".." && n !== "." && !n.startsWith("..")), JSON.stringify(locks));
      assert.ok(locks.some((n) => n.startsWith("invalid_")), JSON.stringify(locks));
      assert.ok(isPathInside(join(tmpRoot, "locks"), lockDirOf(tmpRoot, "..")), "锁目录必须落在 locks/ 内");
    } finally {
      release();
    }
  });

  rmSync(tmpRoot, { recursive: true, force: true });
}

// ── 3. mod-analyzer（fixture jar-like zip）────────────────────────────────────
section("mod-analyzer");
{
  const { analyzeModJar, analyzeModJarHandler } = await import("./dist/decompile/index.js");

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

  test("D-21 version 参与判定：不传无字段、match/mismatch 回显、mismatch 追加 warning", () => {
    const bare = analyzeModJar(fabricJar);
    assert.equal(bare.requestedVersion, undefined);
    assert.equal(bare.versionMatch, undefined);
    assert.equal(bare.versionMatchNote, undefined);
    assert.deepEqual(bare.mcVersionConstraints, [
      { source: "fabric.mod.json:depends.minecraft", raw: "1.20.1" },
    ]);

    const hit = analyzeModJar(fabricJar, "1.20.1");
    assert.equal(hit.requestedVersion, "1.20.1");
    assert.equal(hit.versionMatch, "match");
    assert.ok(hit.versionMatchNote.includes("落在声明范围内"), `note=${hit.versionMatchNote}`);

    const miss = analyzeModJar(fabricJar, "1.21.1");
    assert.equal(miss.versionMatch, "mismatch");
    assert.ok(
      miss.warnings.some((w) => w.startsWith("version 与 jar 声明不符")),
      `warnings=${JSON.stringify(miss.warnings)}`,
    );
    // version 必须真的改变结果：只多出一条 mismatch warning
    assert.equal(miss.warnings.length, bare.warnings.length + 1, "mismatch 必须新增一条 warning");

    // 公开入口：handler 不得丢弃 version（D-21 要修的就是这条路径）
    const viaHandler = analyzeModJarHandler({ jarPath: fabricJar, version: "1.21.1" });
    assert.equal(viaHandler.requestedVersion, "1.21.1");
    assert.equal(viaHandler.versionMatch, "mismatch");
    assert.equal(analyzeModJarHandler({ jarPath: fabricJar }).versionMatch, undefined);
  });

  test("D-21 判定表边界：Maven 区间 / 未声明 / 未核实形态 / 快照 → 宁缺勿猜", () => {
    const rangeJar = join(tmpRoot, "fixturerange-1.0.0.jar");
    writeFileSync(
      rangeJar,
      makeZip([
        {
          name: "META-INF/mods.toml",
          data:
            'modLoader="javafml"\nloaderVersion="[47,)"\n\n[[mods]]\nmodId="fixturerange"\nversion="1.0.0"\n\n[[dependencies.fixturerange]]\nmodId="minecraft"\nversionRange="[1.20.1,)"\nmandatory=true\n',
        },
      ]),
    );
    assert.equal(analyzeModJar(rangeJar, "1.20.4").versionMatch, "match");
    assert.equal(analyzeModJar(rangeJar, "1.19.4").versionMatch, "mismatch");

    const noMcJar = join(tmpRoot, "nomc-1.0.0.jar");
    writeFileSync(noMcJar, makeZip([{ name: "com/example/A.class", data: Buffer.from([0xca, 0xfe, 0xba, 0xbe]) }]));
    const noMc = analyzeModJar(noMcJar, "1.20.1");
    assert.equal(noMc.versionMatch, "unknown");
    assert.ok(noMc.versionMatchNote.includes("未声明 MC 版本"), `note=${noMc.versionMatchNote}`);

    // quilt 多值 versions 的 AND/OR 语义未核实 → 必须 unknown，禁止猜成 match
    const quiltJar = join(tmpRoot, "fixturequilt-1.0.0.jar");
    writeFileSync(
      quiltJar,
      makeZip([
        {
          name: "quilt.mod.json",
          data: JSON.stringify({
            schema_version: 1,
            quilt_loader: {
              id: "fixturequilt",
              version: "1",
              depends: [{ id: "minecraft", versions: [">=1.20", "<1.21"] }],
            },
          }),
        },
      ]),
    );
    const q = analyzeModJar(quiltJar, "1.21.1");
    assert.equal(q.versionMatch, "unknown", `quilt 多值必须拒判，实际 ${q.versionMatch}`);
    assert.ok(q.versionMatchNote.includes("不猜结论"), `note=${q.versionMatchNote}`);

    const snap = analyzeModJar(fabricJar, "23w31a");
    assert.equal(snap.versionMatch, "unknown");
    assert.ok(snap.versionMatchNote.includes("快照版本不支持"), `note=${snap.versionMatchNote}`);
    assert.equal(
      snap.warnings.length,
      analyzeModJar(fabricJar).warnings.length,
      "非法版本不得新增 warning",
    );
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
  const { probeJava, toolchainActionable, skipDownloadsEnabled, parseJavaMajor, parseJavaVersionOutput } = await import(
    "./dist/decompile/java/java-process.js"
  );

  test("parseJavaVersionOutput table (H6)", () => {
    assert.equal(parseJavaMajor("23"), 23);
    assert.equal(parseJavaVersionOutput("23")?.major, 23);
    const withWarn = parseJavaVersionOutput(
      'Picked up JAVA_TOOL_OPTIONS: -Xmx\nopenjdk version "17.0.9" 2023-10-17\nOpenJDK Runtime Environment',
    );
    assert.equal(withWarn?.major, 17);
    assert.match(withWarn?.versionText ?? "", /openjdk version "17/);
    assert.equal(parseJavaMajor('java version "1.8.0_431"'), 8);
    assert.equal(parseJavaVersionOutput("no version here"), null);
  });

  await atest("probeJava on this machine is honest about major", async () => {
    const probe = await probeJava(true);
    if (probe.ready) {
      assert.ok(probe.major !== null && probe.major >= 17, JSON.stringify(probe));
      assert.equal(probe.reason, "OK");
    } else {
      assert.ok(probe.reason === "TOO_OLD" || probe.reason === "NOT_FOUND", `reason=${probe.reason}`);
      if (probe.major !== null) {
        assert.ok(probe.major < 17, `major=${probe.major}`);
      }
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

  test("declared usize over hard cap → ZIP_TOTAL_TOO_LARGE / ZIP_ENTRY_TOO_LARGE（不进 zlib）", () => {
    const forged = forgeUsize(legit, 0x40000000); // 1GB 声明，实际仅 64KB
    assert.throws(
      () => readZip(forged),
      (err) => err.code === "ZIP_TOTAL_TOO_LARGE" || err.code === "ZIP_ENTRY_TOO_LARGE",
    );
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

// ── #9 remap 失败必须诚实标记降级（不得只写进 note 却仍 found:true）────────
// 抽成纯函数以便 CI 安全测试（本套件约定：无需 Java 17 / 无网络）。
test("remap 失败 → remapFailed/degraded 均为 true 且带 warning", () => {
  const r = decompileDegradation(false, "模组 remap 失败(code=1): boom");
  assert.equal(r.remapFailed, true, "remap 失败必须标记 remapFailed");
  assert.equal(r.degraded, true, "remap 失败必须标记 degraded");
  assert.ok(
    r.warnings.some((w) => /混淆|中间名/.test(w)),
    `必须给出明确警告，实际: ${JSON.stringify(r.warnings)}`,
  );
  assert.ok(
    r.warnings.some((w) => w.includes("boom")),
    "警告应带错误摘要（但不 dump 全量 stderr）",
  );
});
test("免 remap（无错误）→ 不算降级", () => {
  // 26.1+ 免 remap / 未提供匹配版本：remapped=false 但 remapError 为 null
  const r = decompileDegradation(false, null);
  assert.equal(r.remapFailed, false, "免 remap 不得标记 remapFailed");
  assert.equal(r.degraded, false, "免 remap 不得标记 degraded");
  assert.deepEqual(r.warnings, [], "免 remap 不应产生警告");
});
test("正常重映射 → 无降级标记", () => {
  const r = decompileDegradation(true, null);
  assert.equal(r.remapFailed, false);
  assert.equal(r.degraded, false);
  assert.deepEqual(r.warnings, []);
});

// ── S8 缓存命中判据：命中键必须含 version+mapping，且不得硬编码 remapped:false ────
// 旧实现只比 jarPath，命中后写死 `remapped: false` 并回显本次 `args.version`：
// 「1.20.1+yarn 生成的树」会被「1.21.1+mojmap 请求」当新鲜结果复用，还谎称没 remap。
section("decompiled cache hit criteria (S8)");
{
  const dir = join(tmpdir(), `mc-skill-s8-${process.pid}`);
  mkdirSync(dir, { recursive: true });
  const jarA = join(dir, "a-mod.jar");
  const jarB = join(dir, "b-mod.jar");
  try {
    test("requestedRemapKey：只有真正触发 remap 的版本/映射才非空", () => {
      assert.deepEqual(requestedRemapKey("1.20.1", undefined), { version: "1.20.1", mapping: "yarn" });
      assert.deepEqual(requestedRemapKey("1.20.1", "mojmap"), { version: "1.20.1", mapping: "mojmap" });
      // 版本按 trim 后归一，避免 " 1.20.1" 与 "1.20.1" 互相判成不一致
      assert.deepEqual(requestedRemapKey(" 1.21.1 ", undefined), { version: "1.21.1", mapping: "yarn" });
      // 26.1+ 免 remap / 不支持的版本 / 未提供版本 → 一律「不 remap」，与 remap 步骤同一条门
      assert.deepEqual(requestedRemapKey("26.1", "mojmap"), { version: null, mapping: null });
      assert.deepEqual(requestedRemapKey("1.12.2", "yarn"), { version: null, mapping: null });
      assert.deepEqual(requestedRemapKey(undefined, "yarn"), { version: null, mapping: null });
      assert.deepEqual(requestedRemapKey("不存在的版本", undefined), { version: null, mapping: null });
    });

    test("命中键含 version + mapping：任一不同即 cacheStale", () => {
      const stored = {
        found: true,
        jarPath: jarA,
        version: "1.20.1",
        mapping: "yarn",
        remapped: true,
        remapError: null,
      };
      assert.deepEqual(
        judgeDecompiledCacheHit(stored, jarA, requestedRemapKey("1.20.1", "yarn")),
        { usable: true, cacheStale: false },
        "判据一致必须判成新鲜",
      );
      assert.equal(
        judgeDecompiledCacheHit(stored, jarA, requestedRemapKey("1.21.1", "yarn")).cacheStale,
        true,
        "换 MC 版本必须标 stale（旧实现正是在这里冒领）",
      );
      assert.equal(
        judgeDecompiledCacheHit(stored, jarA, requestedRemapKey("1.20.1", "mojmap")).cacheStale,
        true,
        "换映射层必须标 stale",
      );
      assert.equal(
        judgeDecompiledCacheHit(stored, jarA, requestedRemapKey(undefined, undefined)).cacheStale,
        true,
        "本次不 remap 也不能把已 remap 的树当新鲜",
      );
    });

    test("树属于别的 jar → 不可复用（不得返回旧 jar 的产物）", () => {
      const v = judgeDecompiledCacheHit(
        { found: true, jarPath: jarA, version: "1.20.1", mapping: "yarn", remapped: true, remapError: null },
        jarB,
        requestedRemapKey("1.20.1", "yarn"),
      );
      assert.deepEqual(v, { usable: false, cacheStale: false }, JSON.stringify(v));
    });

    test("meta round-trip 保真，且能区分「未记录」与「未 remap」", () => {
      const treeDir = join(dir, "tree-new");
      mkdirSync(treeDir, { recursive: true });
      writeDecompiledMeta(treeDir, jarA, {
        version: "1.20.1",
        mapping: "yarn",
        remapped: true,
        remapError: null,
      });
      const back = readDecompiledMeta(treeDir);
      assert.equal(back.found, true);
      assert.equal(back.jarPath, jarA);
      assert.deepEqual(requestedRemapKey("1.20.1", "yarn"), { version: back.version, mapping: back.mapping });
      assert.equal(back.remapped, true, "remapped 真值必须落盘并可回读（缓存命中不得写死 false）");
      assert.equal(back.remapError, null);
      assert.equal(
        judgeDecompiledCacheHit(back, jarA, requestedRemapKey("1.20.1", "yarn")).cacheStale,
        false,
        "新写的免 remap 之外判据必须判成新鲜",
      );

      // 未经 remap 的正常产物：version/mapping 记 null（不是「未记录」），不得永久判过期
      const plainDir = join(dir, "tree-plain");
      mkdirSync(plainDir, { recursive: true });
      writeDecompiledMeta(plainDir, jarA, {
        version: null,
        mapping: null,
        remapped: false,
        remapError: null,
      });
      const plain = readDecompiledMeta(plainDir);
      assert.equal(plain.version, null, "null = 记录了「未经 remap」，与 undefined（未记录）不同");
      assert.deepEqual(
        judgeDecompiledCacheHit(plain, jarA, requestedRemapKey("26.1", undefined)),
        { usable: true, cacheStale: false },
        "26.1 请求与免 remap 产物必须一致（同为不 remap）",
      );
      assert.deepEqual(
        judgeDecompiledCacheHit(plain, jarA, requestedRemapKey(undefined, undefined)),
        { usable: true, cacheStale: false },
        "不传版本与免 remap 产物必须一致",
      );

      // 老缓存（S8 之前只写 jarPath/note）：判据无从证明 → 可用但必须标 stale
      const legacyDir = join(dir, "tree-legacy");
      mkdirSync(legacyDir, { recursive: true });
      writeFileSync(
        join(legacyDir, ".mc-skill-decompiled.json"),
        JSON.stringify({ jarPath: jarA, note: "旧版标记", completedAt: "2026-01-01T00:00:00.000Z" }),
        "utf8",
      );
      const legacy = readDecompiledMeta(legacyDir);
      assert.equal(legacy.found, true, "老缓存仍是有效的完成标记");
      assert.equal(legacy.version, undefined, "未记录必须留 undefined，不能压成 null");
      assert.equal(legacy.remapped, false);
      assert.deepEqual(
        judgeDecompiledCacheHit(legacy, jarA, requestedRemapKey(undefined, undefined)),
        { usable: true, cacheStale: true },
        "老缓存判据未知：允许复用但必须提示 force 重建",
      );
    });
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

// ── #10 java 工具链 argv / 依赖 classpath / 空映射防护（R1·R2·R10 回归锁）──────
// 实测依据（本机 VineFlower 1.10.1 + tiny-remapper 0.14.0）：
//  - `--only=` 放在 destination 之后 → VineFlower 输出 0 个文件（定向反编译形同不存在，每次都全量兜底）
//  - thin tiny-remapper `java -jar` 真实 remap → ClassNotFoundException；`-cp 主 jar + 6 依赖` → 类与方法均正确改名
//  - 只含 header 的 Tiny v2 → tiny-remapper **退出码 0**，产出的 jar 名称仍然混淆
section("java-pipeline argv / remapper classpath / mojmap tiny guard");
{
  const { delimiter } = await import("node:path");
  const { mkdtempSync, utimesSync } = await import("node:fs");
  const {
    remapperCli,
    classpathOf,
    vineflowerCli,
    ensureMojmapTiny,
    TINY_REMAPPER_MAIN,
  } = await import("./dist/decompile/services/java-pipeline.js");
  const {
    TINY_REMAPPER_DEF,
    TINY_REMAPPER_CLASSPATH_DEFS,
    VINEFLOWER_DEF,
    MAPPING_IO_DEF,
  } = await import("./dist/decompile/downloaders/resources.js");

  const tempCase = (label) => mkdtempSync(join(tmpdir(), `mc-dc-${label}-`));
  const VF = "/cache/resources/vineflower-1.10.1.jar";
  const JAR = "/cache/remapped/minecraft-1.20.1-mojmap.jar";
  const OUT = "/cache/decompiled/1.20.1/mojmap";
  const MAIN = "/cache/resources/tiny-remapper-0.14.0.jar";
  const DEPS = TINY_REMAPPER_CLASSPATH_DEFS.map((d) => `/cache/resources/${d.id}-${d.version}.jar`);

  await atest("remapper 走 -cp（thin jar 绝不能 java -jar）", () => {
    const args = remapperCli([MAIN, ...DEPS], "/in.jar", "/out.jar", "/m.tiny", "official", "named");
    assert.equal(args[0], "-cp", `必须 -cp 启动，实际: ${JSON.stringify(args)}`);
    assert.ok(!args.includes("-jar"), "java -jar 加载不到 ASM/mapping-io，真实 remap 会 ClassNotFound");
    assert.equal(args[2], TINY_REMAPPER_MAIN);
    assert.ok(!args.some((a) => a.includes("forceLocal")), "0.14.0 已删除 --forceLocal");
  });

  await atest("-cp 含主 jar 与全部依赖，主 jar 在前", () => {
    const args = remapperCli([MAIN, ...DEPS], "/in.jar", "/out.jar", "/m.tiny", "official", "named");
    const cp = args[1].split(delimiter);
    assert.equal(cp[0], MAIN, "主 jar 必须在最前");
    for (const dep of DEPS) assert.ok(cp.includes(dep), `classpath 缺依赖 ${dep}`);
    assert.equal(cp.length, 1 + TINY_REMAPPER_CLASSPATH_DEFS.length);
  });

  await atest("位置参数按 usage 行顺序，flag 收尾", () => {
    const args = remapperCli([MAIN, ...DEPS], "/in.jar", "/out.jar", "/m.tiny", "official", "named");
    assert.deepEqual(args.slice(3), ["/in.jar", "/out.jar", "/m.tiny", "official", "named", "--ignoreConflicts"]);
  });

  await atest("空 jar 列表必须拒绝（防止退回 thin jar 单跑）", () => {
    assert.throws(() => remapperCli([], "/in.jar", "/out.jar", "/m.tiny", "official", "named"));
  });

  await atest("classpath 分隔符按平台（写死 ':' 在 Windows 静默失效）", () => {
    assert.equal(classpathOf(["a.jar", "b.jar"]), `a.jar${delimiter}b.jar`);
  });

  await atest("tiny-remapper 钉回 0.14.0 thin：缓存文件名与既有工件一致", () => {
    assert.equal(TINY_REMAPPER_DEF.version, "0.14.0");
    assert.equal(`${TINY_REMAPPER_DEF.id}-${TINY_REMAPPER_DEF.version}.jar`, "tiny-remapper-0.14.0.jar");
    assert.ok(TINY_REMAPPER_DEF.url.endsWith("/tiny-remapper-0.14.0.jar"), TINY_REMAPPER_DEF.url);
    assert.ok(!TINY_REMAPPER_DEF.url.includes("-fat"), "fat jar 已弃用");
  });

  await atest("依赖清单齐全（asm×5 + mapping-io），钉值均为 https + 64hex", () => {
    const ids = TINY_REMAPPER_CLASSPATH_DEFS.map((d) => d.id);
    for (const want of ["asm", "asm-commons", "asm-tree", "asm-analysis", "asm-util", "mapping-io"]) {
      assert.ok(ids.includes(want), `缺依赖 ${want}（实测缺一即 NoClassDefFoundError）`);
    }
    assert.equal(MAPPING_IO_DEF.id, "mapping-io");
    for (const d of [VINEFLOWER_DEF, TINY_REMAPPER_DEF, ...TINY_REMAPPER_CLASSPATH_DEFS]) {
      assert.match(d.sha256, /^[0-9a-f]{64}$/, `${d.id} sha256 非法`);
      assert.ok(d.url.startsWith("https://"), `${d.id} 必须 https`);
      assert.ok(d.url.endsWith(`/${d.id}-${d.version}.jar`), `${d.id} url 与 id/version 不符`);
    }
  });

  await atest("vineflowerCli：--only 必须在 source/destination 之前", () => {
    const args = vineflowerCli(VF, JAR, OUT, "net/minecraft/world/item/ItemStack");
    const only = args.findIndex((a) => a.startsWith("--only="));
    assert.ok(only >= 0, "定向反编译必须带 --only");
    assert.equal(args[only], "--only=net/minecraft/world/item/ItemStack");
    assert.ok(only < args.indexOf(JAR), "--only 必须在 jar 之前（放后面输出 0 文件）");
    assert.ok(only < args.indexOf(OUT), "--only 必须在 outDir 之前");
    assert.ok(args.indexOf(JAR) < args.indexOf(OUT), "usage: <source>... <destination>");
    assert.equal(args[0], "-jar");
  });

  await atest("vineflowerCli：全量兜底不含 --only", () => {
    const args = vineflowerCli(VF, JAR, OUT);
    assert.ok(!args.some((a) => a.startsWith("--only")), `全量反编译不应带 --only: ${JSON.stringify(args)}`);
    assert.deepEqual(args.slice(-2), [JAR, OUT]);
  });

  await atest("ensureMojmapTiny：空 ProGuard 映射 → MAPPINGS_EMPTY 且不留残缺 .tiny", async () => {
    const txt = join(tempCase("empty-map"), "mojmap-9.9.9.txt");
    writeFileSync(txt, "# 只有注释，没有任何类行\n\n", "utf8");
    await assert.rejects(
      async () => ensureMojmapTiny(txt),
      (err) => err.code === "MAPPINGS_EMPTY" && /MAPPINGS_EMPTY/.test(err.message),
    );
    assert.ok(!existsSync(txt.replace(/\.txt$/i, ".tiny")), "拒绝后不得留下会被下次当命中的空 Tiny");
  });

  await atest("ensureMojmapTiny：正常映射产出含类行的 Tiny", async () => {
    const txt = join(tempCase("good-map"), "mojmap-1.20.1.txt");
    writeFileSync(
      txt,
      "net.minecraft.world.item.Item -> awu:\n    1:1:net.minecraft.world.item.ItemStack getDefaultInstance() -> a\n",
      "utf8",
    );
    const tiny = await ensureMojmapTiny(txt);
    assert.ok(tiny.endsWith(".tiny"));
    assert.match(readFileSync(tiny, "utf8"), /^c\tawu\tnet\/minecraft\/world\/item\/Item$/m, "类映射丢失");
  });

  await atest("ensureMojmapTiny：header-only 缓存必须重算，不能当命中", async () => {
    const txt = join(tempCase("stale-tiny"), "mojmap-1.20.1.txt");
    writeFileSync(txt, "net.minecraft.world.item.Item -> awu:\n", "utf8");
    const tiny = txt.replace(/\.txt$/i, ".tiny");
    writeFileSync(tiny, "tiny\t2\t0\tofficial\tnamed\n", "utf8");
    const future = new Date(Date.now() + 60_000);
    utimesSync(tiny, future, future); // mtime 比 .txt 更新：旧实现只看 size>0 就会当命中
    const got = await ensureMojmapTiny(txt);
    assert.equal(got, tiny);
    assert.match(readFileSync(tiny, "utf8"), /^c\t/m, "残缺 Tiny 被复用了");
  });
}

{
  const { pickYarnBuild, resolveYarnMappings } = await import("./dist/decompile/downloaders/yarn.js");
  // yarn maven 只有一个顶层 maven-metadata.xml，build 平铺成 `<MCver>+build.<n>`。
  const META = `<metadata><groupId>net.fabricmc</groupId><artifactId>yarn</artifactId><versioning>
<latest>1.21.9+build.2</latest><release>1.21.9+build.2</release><versions>
<version>1.20.1+build.1</version>
<version>1.20.1+build.10</version>
<version>1.20.1+build.9</version>
<version>1.20.11+build.3</version>
<version>1.21.1+build.3</version>
<version>1.21.9+build.2</version>
</versions><lastUpdated>20260101</lastUpdated></versioning></metadata>`;

  await atest("pickYarnBuild：按 build 数值取最大，不按字符串序/列表尾", () => {
    assert.equal(pickYarnBuild(META, "1.20.1"), "1.20.1+build.10");
    assert.notEqual(pickYarnBuild(META, "1.20.1"), "1.20.1+build.9", "字符串序会把 build.9 当最新");
  });

  await atest("pickYarnBuild：<latest> 是全局最新，不得顶替本 MC 版本的 build", () => {
    assert.notEqual(pickYarnBuild(META, "1.20.1"), "1.21.9+build.2");
    assert.equal(pickYarnBuild(META, "1.21.1"), "1.21.1+build.3");
  });

  await atest("pickYarnBuild：前缀相同的邻版（1.20.11）不串味；无 yarn 返回 null", () => {
    assert.equal(pickYarnBuild(META, "1.20.11"), "1.20.11+build.3");
    assert.equal(pickYarnBuild(META, "1.19.4"), null);
  });

  await atest("pickYarnBuild：允许调用方直接点名完整 build", () => {
    assert.equal(pickYarnBuild(META, "1.20.1+build.1"), "1.20.1+build.1");
  });

  await atest("resolveYarnMappings：元数据走顶层，jar 落在全版本号目录（旧路径恒 404）", async () => {
    const seen = [];
    const realFetch = globalThis.fetch;
    globalThis.fetch = async (url) => {
      seen.push(String(url));
      const u = String(url);
      if (u === "https://maven.fabricmc.net/net/fabricmc/yarn/maven-metadata.xml") {
        return { ok: true, status: 200, text: async () => META };
      }
      if (u.endsWith(".sha256")) {
        return { ok: true, status: 200, text: async () => `${"a".repeat(64)}  yarn-v2.jar` };
      }
      return { ok: false, status: 404, text: async () => "" };
    };
    try {
      const info = await resolveYarnMappings("1.20.1");
      assert.equal(info.build, "1.20.1+build.10");
      assert.equal(
        info.jarUrl,
        "https://maven.fabricmc.net/net/fabricmc/yarn/1.20.1+build.10/yarn-1.20.1+build.10-mergedv2.jar",
        info.jarUrl,
      );
      assert.equal(info.sha256, "a".repeat(64));
      assert.ok(
        !seen.some((u) => /yarn\/1\.20\.1\/maven-metadata\.xml/.test(u)),
        `又去要 per-version 元数据了：${JSON.stringify(seen)}`,
      );
    } finally {
      globalThis.fetch = realFetch;
    }
  });

  await atest("resolveYarnMappings：元数据被投毒成越界 build 必须拒（D-13 形态门）", async () => {
    // 百分号编码在这台宿主上不是防护：实测 GET .../yarn/zzz%2F..%2Fmaven-metadata.xml
    // 返回的就是顶层元数据正文（%2F 被解码并归一化），而 encodeURIComponent("..") === ".."。
    const realFetch = globalThis.fetch;
    const bad = ["..", "../../evil", "1.20.1+build.10/../../x", "evil?x=1", "evil#x", "evil%2F.."];
    try {
      for (const b of bad) {
        const seen = [];
        globalThis.fetch = async (url) => {
          seen.push(String(url));
          return {
            ok: true,
            status: 200,
            text: async () => `<metadata><versioning><version>${b}</version></versioning></metadata>`,
          };
        };
        await assert.rejects(() => resolveYarnMappings(b), /形态非法/, `越界 build 未被拒：${b}`);
        assert.equal(seen.length, 1, `拒绝前不得再请求 jar/checksum：${JSON.stringify(seen)}`);
      }
    } finally {
      globalThis.fetch = realFetch;
    }
  });

  await atest("resolveYarnMappings：本版无 build 时报 MAPPINGS_NOT_FOUND 而不是打下一个版本", async () => {
    const realFetch = globalThis.fetch;
    globalThis.fetch = async () => ({ ok: true, status: 200, text: async () => META });
    try {
      await assert.rejects(() => resolveYarnMappings("1.19.4"), /MAPPINGS_NOT_FOUND|1\.19\.4/);
    } finally {
      globalThis.fetch = realFetch;
    }
  });

  await atest("resolveYarnMappings：无 .sha256/.sha1 sidecar 拒绝下载（yarn 哈希随 build 变，不能裸下）", async () => {
    const realFetch = globalThis.fetch;
    globalThis.fetch = async (url) => {
      if (String(url).endsWith("maven-metadata.xml")) {
        return { ok: true, status: 200, text: async () => META };
      }
      return { ok: false, status: 404, text: async () => "" };
    };
    try {
      await assert.rejects(
        () => resolveYarnMappings("1.20.1"),
        /MAPPINGS_CHECKSUM_MISSING|sidecar/,
        "无校验 sidecar 仍返回了可下载 URL",
      );
    } finally {
      globalThis.fetch = realFetch;
    }
  });
}

{
  const { ensureYarnTiny, remapperCli } = await import("./dist/decompile/services/java-pipeline.js");
  const { mkdtempSync, statSync, utimesSync } = await import("node:fs");
  const MERGED =
    "tiny\t2\t0\tofficial\tintermediary\tnamed\n" +
    "c\ta\tnet/minecraft/class_7833\tnet/minecraft/util/math/RotationAxis\n";
  const caseDir = (label) => mkdtempSync(join(tmpdir(), `mc-yarn-${label}-`));
  const jarWith = (label, tinyText) => {
    const dir = caseDir(label);
    const p = join(dir, "yarn-1.20.1.jar");
    writeFileSync(p, makeZip([{ name: "META-INF/MANIFEST.MF", data: "Manifest-Version: 1.0\n" },
      { name: "mappings/mappings.tiny", data: tinyText, deflate: true }]));
    return p;
  };

  await atest("ensureYarnTiny：交棒给 remapper 的必须是解出的 .tiny（jar 会被 mapping-io 判非法格式）", () => {
    const jar = jarWith("ok", MERGED);
    const tiny = ensureYarnTiny(jar);
    assert.ok(tiny.endsWith(".tiny") && !tiny.endsWith(".jar"), `返回了 ${tiny}`);
    assert.equal(readFileSync(tiny, "utf8"), MERGED);
    const hitMtime = statSync(tiny).mtimeMs;
    assert.equal(ensureYarnTiny(jar), tiny, "二次调用没命中缓存");
    assert.equal(statSync(tiny).mtimeMs, hitMtime, "命中缓存却重写了 .tiny");
  });

  await atest("ensureYarnTiny：jar 比 .tiny 新必须重解，不能复用陈旧副本", () => {
    const jar = jarWith("stale", MERGED);
    const tiny = ensureYarnTiny(jar);
    const before = statSync(tiny).mtimeMs;
    writeFileSync(join(dirname(jar), "other.txt"), "touch", "utf8");
    const back = new Date(Date.now() - 600_000);
    utimesSync(tiny, back, back); // 模拟 .tiny 早于 jar（重新下载过映射）
    assert.equal(ensureYarnTiny(jar), tiny);
    assert.ok(statSync(tiny).mtimeMs > before, "陈旧 .tiny 被当成命中复用了");
  });

  await atest("ensureYarnTiny：intermediary/named 两列的 -v2.jar 形状必须拒绝（official 列缺失）", () => {
    const jar = jarWith(
      "nov2col",
      "tiny\t2\t0\tintermediary\tnamed\nc\tc_1\tnet/minecraft/Foo\n",
    );
    assert.throws(() => ensureYarnTiny(jar), /MAPPINGS_EMPTY.*official/);
  });

  await atest("ensureYarnTiny：三列 Tiny v1 也只认 Tiny v2（缺 v2 头单独可失败）", () => {
    const jar = jarWith("v1", "v1\tofficial\tintermediary\tnamed\nCLASS\tnet/minecraft/A\tnet/minecraft/Foo\n");
    assert.throws(() => ensureYarnTiny(jar), /不是 Tiny v2/);
  });

  await atest("ensureYarnTiny：header-only / 缺 mappings 条目都 fail-closed", () => {
    assert.throws(
      () => ensureYarnTiny(jarWith("hdr", "tiny\t2\t0\tofficial\tintermediary\tnamed\n")),
      /不含任何 c\\t/,
    );
    const dir = caseDir("noentry");
    const p = join(dir, "yarn-1.20.1.jar");
    writeFileSync(p, makeZip([{ name: "extra/notes.txt", data: "nothing" }]));
    assert.throws(() => ensureYarnTiny(p), /没有唯一 mappings/);
  });

  await atest("remapperCli 只吃 .tiny：调用点漏解包时在进程内就炸，不给 mapping-io 栈", () => {
    const jars = ["/c/tiny-remapper-0.14.0.jar", "/c/asm-9.9.1.jar"];
    assert.throws(
      () => remapperCli(jars, "/in.jar", "/out.jar", "/c/mappings/yarn-1.20.1.jar", "official", "intermediary"),
      /必须是 \.tiny/,
      "yarn jar 又被当映射参数了",
    );
    assert.throws(
      () => remapperCli(jars, "/in.jar", "/out.jar", "/c/mappings/mojmap-1.20.1.txt", "official", "named"),
      /必须是 \.tiny/,
    );
    assert.ok(
      remapperCli(jars, "/in.jar", "/out.jar", "/c/mappings/yarn-1.20.1.tiny", "official", "intermediary").includes(
        "/c/mappings/yarn-1.20.1.tiny",
      ),
    );
  });
}

// ── Wave 4 · A4 门（D-2b / D-17 / D-19 / D-22 / D-23 / D-31 / D-53）────────────
// 全部依赖 Wave-4 的 TS 重编。`dist` 未重建时**必须显式 SKIP 而不是假绿**：
// 哨兵 = java-process 新增导出 `resolveJavaTimeoutMs`（同一批构建里落进 dist）。
section("Wave4-A4 decompile-family gates");
{
  const javaProc = await import("./dist/decompile/java/java-process.js");
  if (typeof javaProc.resolveJavaTimeoutMs !== "function") {
    console.log(
      "  SKIP Wave4-A4 全部 7 条门：dist 尚未包含本批改动（缺 resolveJavaTimeoutMs 导出）。\n" +
        "       待 Wave-close `npm run build` 后自动转绿；本批改动的即时证明见 temp/w4-A4-report.md 的 node -e 复现。",
    );
  } else {
    const { resolveJavaTimeoutMs, DEFAULT_JAVA_TIMEOUT_MS } = javaProc;

    // D-2b：优先级 env > 调用点兜底 > 内置默认；非法 env 必须下沉而不是变成 0ms
    const savedTimeoutEnv = process.env.MC_SKILL_JAVA_TIMEOUT_MS;
    try {
      delete process.env.MC_SKILL_JAVA_TIMEOUT_MS;
      test("D-2b 无 env 无入参 → 内置默认 15min", () => {
        assert.equal(resolveJavaTimeoutMs(), DEFAULT_JAVA_TIMEOUT_MS);
        assert.equal(DEFAULT_JAVA_TIMEOUT_MS, 900_000);
      });
      test("D-2b 无 env + 调用点兜底 → 用调用点值", () => {
        assert.equal(resolveJavaTimeoutMs(1234), 1234);
      });
      test("D-2b MC_SKILL_JAVA_TIMEOUT_MS 优先级最高（盖住调用点写死值）", () => {
        process.env.MC_SKILL_JAVA_TIMEOUT_MS = "4242";
        assert.equal(resolveJavaTimeoutMs(1234), 4242);
      });
      test("D-2b 非法 env（abc / 0 / -5 / 空）一律忽略并继续下沉", () => {
        for (const bad of ["abc", "0", "-5", "", "   ", "NaN", "Infinity"]) {
          if (bad === "") delete process.env.MC_SKILL_JAVA_TIMEOUT_MS;
          else process.env.MC_SKILL_JAVA_TIMEOUT_MS = bad;
          assert.equal(resolveJavaTimeoutMs(1234), 1234, `非法 env「${bad}」不得改变超时`);
          assert.equal(resolveJavaTimeoutMs(), DEFAULT_JAVA_TIMEOUT_MS, `非法 env「${bad}」不得变成 0ms`);
        }
      });
    } finally {
      if (savedTimeoutEnv === undefined) delete process.env.MC_SKILL_JAVA_TIMEOUT_MS;
      else process.env.MC_SKILL_JAVA_TIMEOUT_MS = savedTimeoutEnv;
    }

    // D-17：listJarEntries 不再裸抛，缺失/坏 zip 都给 actionable
    {
      const { listJarEntries, analyzeModJar } = await import("./dist/decompile/services/mod-analyzer.js");
      const dir = join(tmpdir(), `mc-skill-w4a17-${process.pid}`);
      mkdirSync(dir, { recursive: true });
      try {
        test("D-17 listJarEntries：路径不存在 → ok:false + NOT_FOUND（不再静默 []）", () => {
          const r = listJarEntries(join(dir, "nope.jar"));
          assert.equal(r.ok, false);
          assert.deepEqual(r.entries, []);
          assert.equal(r.action?.code, "NOT_FOUND");
        });
        test("D-17 listJarEntries：相对路径 → INVALID_INPUT，不碰文件系统", () => {
          const r = listJarEntries("relative/nope.jar");
          assert.equal(r.ok, false);
          assert.equal(r.action?.code, "INVALID_INPUT");
        });
        test("D-17 listJarEntries：中央目录被截断 → actionable 而非 ZipParseError 裸堆栈", () => {
          const p = join(dir, "trunc.jar");
          const full = makeZip([{ name: "fabric.mod.json", data: "{}" }]);
          writeFileSync(p, full.subarray(0, full.length - 8));
          const r = listJarEntries(p);
          assert.equal(r.ok, false, "截断 jar 必须失败，不能假装列出 0 条");
          assert.equal(r.action?.code, "INVALID_INPUT");
          assert.match(r.action.message, /zip\/jar/);
        });
        test("D-17 listJarEntries：正常 jar → ok:true 且列出条目", () => {
          const p = join(dir, "ok.jar");
          writeFileSync(p, makeZip([{ name: "fabric.mod.json", data: "{}" }]));
          const r = listJarEntries(p);
          assert.equal(r.ok, true);
          assert.deepEqual(r.entries, ["fabric.mod.json"]);
        });
        test("D-17 analyze_mod_jar：fileSize 取已读 buffer，不再二次 statSync", () => {
          const p = join(dir, "size.jar");
          const bytes = makeZip([{ name: "fabric.mod.json", data: JSON.stringify(FABRIC_MOD_JSON) }]);
          writeFileSync(p, bytes);
          const r = analyzeModJar(p);
          assert.equal(r.fileSize, bytes.length, "fileSize 必须等于真实字节数");
        });
      } finally {
        rmSync(dir, { recursive: true, force: true });
      }
    }

    // D-19：meta 写失败 → 返回原因字符串，不抛穿 handler
    {
      test("D-19 writeDecompiledMeta 正常写入 → 返回 null 且落盘可读", () => {
        const dir = join(tmpdir(), `mc-skill-w4a19-${process.pid}`);
        mkdirSync(dir, { recursive: true });
        try {
          const err = writeDecompiledMeta(dir, "/x/mod.jar", {
            version: "1.20.1",
            mapping: "yarn",
            remapped: true,
            remapError: null,
          });
          assert.equal(err, null);
          assert.equal(readDecompiledMeta(dir).version, "1.20.1");
        } finally {
          rmSync(dir, { recursive: true, force: true });
        }
      });
      test("D-19 目录不存在 → 返回失败原因字符串而不是 throw", () => {
        const missing = join(tmpdir(), `mc-skill-w4a19-missing-${process.pid}`, "nope");
        let threw = null;
        let ret;
        try {
          ret = writeDecompiledMeta(missing, "/x/mod.jar", {
            version: null,
            mapping: null,
            remapped: false,
            remapError: null,
          });
        } catch (err) {
          threw = err;
        }
        assert.equal(threw, null, `写失败必须被内部捕获，实际抛出：${threw?.message}`);
        assert.equal(typeof ret, "string");
        assert.ok(String(ret).length > 0, "必须带回可展示给调用方的原因");
      });
    }

    // D-22：patch 上界（实测值，见 temp/w4-A4-report.md 的 LIVE/CORPUS 双测）
    {
      const { parseMinecraftVersion } = await import("./dist/decompile/version-manager.js");
      test("D-22 1.21.999 → supported:false（语法合法但不存在的 patch 必须拒）", () => {
        const v = parseMinecraftVersion("1.21.999");
        assert.equal(v.valid, true);
        assert.equal(v.supported, false, "1.21.999 不能判 supported");
        assert.equal(v.hasYarn, false);
        assert.ok(v.error && /1\.21\.11/.test(v.error), `错误信息要带实测上界，实际: ${v.error}`);
      });
      test("D-22 已发布的 1.21.11 / 裸 1.21 / 1.20.6 仍 supported:true", () => {
        for (const okV of ["1.21.11", "1.21", "1.20.6", "1.14.4", "1.19.4"]) {
          assert.equal(parseMinecraftVersion(okV).supported, true, `${okV} 应受支持`);
        }
      });
      test("D-22 上界按 minor 逐项生效，不是「统一 +10」的整数猜测", () => {
        assert.equal(parseMinecraftVersion("1.14.50").supported, false);
        assert.equal(parseMinecraftVersion("1.14.4").supported, true);
        assert.equal(parseMinecraftVersion("1.16.6").supported, false);
        assert.equal(parseMinecraftVersion("1.16.5").supported, true);
        assert.equal(parseMinecraftVersion("1.20.7").supported, false);
        assert.equal(parseMinecraftVersion("1.21.12").supported, false);
      });
    }

    // D-23：\n / \t / \u 解码 + 不再二次解码
    {
      const { parseTomlValue, parseModsToml } = await import("./dist/decompile/services/toml-parse.js");
      test("D-23 \\n \\t \\r \\b \\f 都解码", () => {
        assert.equal(parseTomlValue(String.raw`"a\nb"`), "a\nb");
        assert.equal(parseTomlValue(String.raw`"a\tb"`), "a\tb");
        assert.equal(parseTomlValue(String.raw`"a\rb"`), "a\rb");
      });
      test("D-23 \\uXXXX / \\UXXXXXXXX 解码", () => {
        assert.equal(parseTomlValue(String.raw`"s\u00e9"`), "sé");
        assert.equal(parseTomlValue(String.raw`"x\U0001F600"`), "x\u{1F600}");
      });
      test('D-23 旧两遍正则的二次解码 bug：源 "\\\\\\"" 必须还原成两字符 \\"', () => {
        // TOML 源文本： "\\"\""  → 期望：反斜杠 + 双引号
        assert.equal(parseTomlValue('"\\\\""'.slice(0, 6)), parseTomlValue('"\\\\\\""'));
        assert.equal(parseTomlValue(String.raw`"\\\""`), String.raw`\"`);
      });
      test("D-23 未知转义原样保留；位数不足的 \\u 不猜", () => {
        assert.equal(parseTomlValue(String.raw`"a\qb"`), String.raw`a\qb`);
        assert.equal(parseTomlValue(String.raw`"a\uZZZZ"`), String.raw`a\uZZZZ`);
      });
      test("D-23 经 parseModsToml 的 description 落地真实换行", () => {
        const t = parseModsToml('[[mods]]\nmodId="m"\ndescription="line1\\nline2"\n');
        assert.equal(t.mods[0]?.description, "line1\nline2");
      });
      test("D-23 字面字符串（单引号）不解释转义（TOML 规范）", () => {
        assert.equal(parseTomlValue(String.raw`'a\nb'`), String.raw`a\nb`);
      });
    }

    // D-31：中央目录 bit 11 决定名称编码，且两处读取器共用同一实现
    {
      const { listZipEntries: listViaDecompile, decodeZipEntryName, ZIP_FLAG_NAME_UTF8 } =
        await import("./dist/decompile/zip-util.js");
      const { listZipEntries: listViaUpdate } = await import("./dist/update/zip.js");
      test("D-31 共用 helper 存在且 bit11 语义正确", () => {
        assert.equal(ZIP_FLAG_NAME_UTF8, 0x800);
        const buf = Buffer.from("caf\u00e9.txt", "utf8"); // C3 A9
        assert.equal(decodeZipEntryName(buf, 0x800), "café.txt");
        assert.equal(decodeZipEntryName(buf, 0x000), "cafÃ©.txt", "bit11=0 必须按字节 latin1，不产 U+FFFD");
        assert.ok(!decodeZipEntryName(buf, 0).includes("\uFFFD"), "不得出现替换符");
      });
      test("D-31 bit11=0 时 update/zip 与 decompile/zip-util 给出同一个名字", () => {
        const dir = join(tmpdir(), `mc-skill-w4a31-${process.pid}`);
        mkdirSync(dir, { recursive: true });
        try {
          const p = join(dir, "latin.zip");
          writeFileSync(p, makeZip([{ name: "café/notes.txt", data: "hi", flags: 0 }]));
          const viaDecompile = listViaDecompile(readFileSync(p));
          const viaUpdate = listViaUpdate(p);
          assert.equal(viaUpdate.ok, true);
          assert.deepEqual(
            viaUpdate.entries,
            viaDecompile,
            "两处中央目录读取器必须共享 bit 11 判定（D-31 的原始分歧点）",
          );
          assert.equal(viaDecompile[0], "cafÃ©/notes.txt");
        } finally {
          rmSync(dir, { recursive: true, force: true });
        }
      });
      test("D-31 bit11=1 仍按 UTF-8 还原（未回归）", () => {
        const dir = join(tmpdir(), `mc-skill-w4a31b-${process.pid}`);
        mkdirSync(dir, { recursive: true });
        try {
          const p = join(dir, "utf8.zip");
          writeFileSync(p, makeZip([{ name: "café/notes.txt", data: "hi", flags: 0x800 }]));
          assert.deepEqual(listViaUpdate(p).entries, ["café/notes.txt"]);
          assert.deepEqual(listViaDecompile(readFileSync(p)), ["café/notes.txt"]);
        } finally {
          rmSync(dir, { recursive: true, force: true });
        }
      });
    }

    // D-53：子进程真跑一遍 guard（模块是 import 期副作用，只能在子进程里观测 stderr）
    {
      const cp = await import("node:child_process");
      const guardPath = new URL("./dist/utils/node-sqlite-guard.js", import.meta.url).href;
      const script = [
        `import ${JSON.stringify(guardPath)};`,
        `process.emitWarning('SQLite is an experimental feature and might change at any time', 'ExperimentalWarning');`,
        `const e = new Error('some unrelated failure');`,
        `e.code = 'ExperimentalWarning'; e.detail = 'totally unrelated detail';`,
        `process.emitWarning(e);`,
        `process.emitWarning(new Error('ExperimentalWarning: sqlite driver is down'));`,
        `process.emitWarning('plain warning about mysql');`,
      ].join("\n");
      const child = join(tmpdir(), `mc-skill-w4a53-${process.pid}.mjs`);
      writeFileSync(child, script, "utf8");
      try {
        const res = cp.spawnSync(process.execPath, [child], { encoding: "utf8" });
        const err = `${res.stderr ?? ""}${res.stdout ?? ""}`;
        test("D-53 真正的 node:sqlite ExperimentalWarning 仍被抑制", () => {
          assert.ok(!/SQLite is an experimental feature/.test(err), `应被抑制，实际 stderr:\n${err}`);
        });
        test("D-53 门：code=ExperimentalWarning 且 detail 不提 sqlite → 必须仍然打印", () => {
          assert.ok(/some unrelated failure/.test(err), `不该被吞掉，实际 stderr:\n${err}`);
        });
        test("D-53 门：message 里带 ExperimentalWarning+sqlite 字样但类型不是 Experimental → 必须打印", () => {
          assert.ok(/sqlite driver is down/.test(err), `旧条件会因文本匹配吞掉它，实际 stderr:\n${err}`);
        });
        test("D-53 无关警告不受影响", () => {
          assert.ok(/plain warning about mysql/.test(err), `实际 stderr:\n${err}`);
        });
      } finally {
        rmSync(child, { force: true });
      }
    }
  }
}

// ── Wave 4 · A9 P3 收口门（D-9 / D-12 / D-24）───────────────────────────────
// 这三条是「行为等价、纯冗余/可读性」类：守卫**必须保留**（TS 收窄需要），而 D-24 的空操作**必须删除**。
// 因此本组门只读源文本，不依赖 dist（永不 SKIP），把两个方向的回归都钉住。
section("Wave4-A9 P3 cleanup guards (D-9 / D-12 / D-24)");
{
  const srcOf = (rel) => readFileSync(join(__dirname, "src", rel), "utf8");
  const countOf = (hay, needle) => hay.split(needle).length - 1;

  // D-9：循环出口守卫运行时不可达，但删了 `res` 不收窄 → res.body 报 TS18047（scratch 复现见 temp/w4-A9-report.md）
  const http = srcOf("decompile/downloaders/http.ts");
  test("D-9 http.ts 循环出口 res 守卫仍在且只有一处（TS 收窄需要，不得当死代码删）", () => {
    assert.equal(
      countOf(http, 'if (!res) throw new DownloadError("DOWNLOAD_FAILED", lastErr);'),
      1,
      "守卫被删除或复制：见 http.ts downloadFile 循环出口",
    );
    assert.match(http, /let res: Response \| null = null;/, "res 声明形态变了，收窄结论需重判");
  });
  test("D-9 守卫必须带着「为何不能删」的注释（防止下次清理批再判一遍）", () => {
    assert.match(http, /\/\/ D-9[^\n]*\n(?:[^\n]*\n)*?[^\n]*TS18047/, "D-9 注释缺失或未说明 TS18047");
  });

  // D-12：`?? version` 运行时不可达，但删了 id 变 string|undefined → manifestId: string 报 TS2322
  const mojang = srcOf("decompile/downloaders/mojang.ts");
  test("D-12 mojang.ts `?? version` 兜底仍在（manifestId: string 需要它收窄）", () => {
    assert.equal(countOf(mojang, "const id = exact?.id ?? version;"), 1, "兜底被删或被复制");
    assert.match(mojang, /manifestId: string/, "MojangVersionEntry.manifestId 不再是必填 string，结论需重判");
    assert.match(mojang, /\/\/ D-12[^\n]*\n(?:[^\n]*\n)*?[^\n]*TS2322/, "D-12 注释缺失或未说明 TS2322");
  });

  // D-24：非 global/非 sticky 正则的 test() 完全不读不写 lastIndex ⇒ 原重置是纯空操作，已删。
  // 同时钉住「为什么是空操作」的前置不变量，避免日后加 g flag 把这次删除变成真 bug。
  const sms = srcOf("decompile/services/search-mod-source.ts");
  test("D-24 search-mod-source.ts 空操作 re.lastIndex = 0 已删除", () => {
    assert.equal(countOf(sms, "re.lastIndex = 0;"), 0, "死代码回归");
    assert.match(sms, /const matched = re \? re\.test\(lineText\)/, "逐行匹配调用点形态变了");
  });
  test("D-24 前置不变量：re 只用无 g/y 的 \"i\" 构造（加 g 就必须补回 lastIndex 重置）", () => {
    assert.match(sms, /re = new RegExp\(query, "i"\);/, "构造点 flags 变了，D-24 结论不再成立");
    assert.ok(
      !/new RegExp\(\s*query\s*,\s*"[^"]*[gy]/.test(sms),
      "query 正则被加上 g/y flag：D-24 删掉的重置会变成真 bug，必须补回并改判",
    );
    assert.match(sms, /\/\/ D-24[^\n]*\n[^\n]*g[^\n]*lastIndex/, "D-24 注释缺失：未记录 flags 约束");
  });
}

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
