/**
 * loader-api：JavaParser 抽取、query/search、ingest dryRun、CACHE_STALE、PLATFORM_SKIPPED、
 * merged 缓存 stamp 内容失效（A-20）。
 */
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, existsSync, readFileSync, statSync, utimesSync, unlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));

const { extractCompilationUnit } = await import("./dist/loader-api/extract.js");
const { queryLoaderApi, searchLoaderApi } = await import("./dist/loader-api/query.js");
const { ingestLoaderApi } = await import("./dist/loader-api/ingest.js");
const { assertCacheFresh, sha256Buffer } = await import("./dist/loader-api/sidecar.js");
const { createStoreZip } = await import("./dist/mdk/index.js");

const iface = `
package net.neoforged.neoforge.network.handling;
public interface IPayloadContext {
    void enqueueWork(Runnable task);
    default Player player() { return null; }
}
public class Outer {
    public static class Inner {
        public List<ItemStack> foo(String a, int b) { return null; }
    }
}
public class Inner {
    public void other() {}
}
`;

{
  const recs = extractCompilationUnit(iface, "IPayloadContext.java");
  const ctx = recs.find((c) => c.simpleName === "IPayloadContext");
  assert.ok(ctx, "IPayloadContext extracted");
  assert.ok(Array.isArray(ctx.methods) && ctx.methods.length >= 1, "interface methods non-empty");
  const ew = ctx.methods.find((m) => m.name === "enqueueWork");
  assert.ok(ew && ew.signature.includes("enqueueWork"), `signature: ${ew?.signature}`);
  assert.equal(ew.returnType, "void");
  assert.ok(ew.parameters.some((p) => p.type.includes("Runnable")));

  const nested = recs.find((c) => c.fqcn.includes("$") && c.simpleName === "Inner");
  assert.ok(nested, "nested Inner fqcn uses $");
  assert.match(nested.fqcn, /Outer\$Inner/);
  const foo = nested.methods.find((m) => m.name === "foo");
  assert.ok(foo, "Inner.foo");
  assert.ok(foo.signature.includes("foo"), foo.signature);

  const bads = extractCompilationUnit("not java {{{", "Bad.java");
  assert.ok(bads[0]?.parseError, "parseError on bad unit");
  const badA = extractCompilationUnit("not java {{{", "pkg/A.java");
  const badB = extractCompilationUnit("not java {{{", "pkg/B.java");
  assert.notEqual(badA[0]?.fqcn, badB[0]?.fqcn, "parse failures must not share fqcn unknown");
  assert.match(badA[0]?.fqcn ?? "", /A\.java/);
  console.log("extract CompilationUnit: ok");
}

{
  const src = `
package demo;
import net.fabricmc.api.Environment;
import org.jetbrains.annotations.ApiStatus;
@Environment(EnvType.CLIENT)
public class ClientOnly {
  public ClientOnly(int a) {}
  public void tick() {}
}
@ApiStatus.Internal
public class Hidden {
  public void secret() {}
}
public enum Kind {
  A, B;
  public int code() { return 1; }
}
public record Point(int x, int y) {
  public Point {
  }
}
public @interface Marker {
  String value();
}
public class Other {
  public void shared() {}
}
`;
  const recs = extractCompilationUnit(src, "D:/mc-skill-temp/loader-api-src/demo/demo/All.java");
  const client = recs.find((c) => c.simpleName === "ClientOnly");
  assert.ok(client, "ClientOnly");
  assert.equal(client.environment, true);
  assert.equal(client.apiStatusInternal, false);
  assert.ok(client.methods.some((m) => m.name === "ClientOnly" && m.parameters.some((p) => p.type.includes("int"))));
  assert.ok(!String(client.file || "").includes("mc-skill-temp"), `file must be relative: ${client.file}`);
  const hidden = recs.find((c) => c.simpleName === "Hidden");
  assert.equal(hidden.apiStatusInternal, true);
  assert.equal(hidden.environment, false);
  const kind = recs.find((c) => c.simpleName === "Kind");
  assert.ok(kind, "enum Kind");
  assert.ok(kind.methods.some((m) => m.name === "code"));
  const point = recs.find((c) => c.simpleName === "Point");
  assert.ok(point, "record Point");
  assert.ok(point.methods.some((m) => m.name === "Point" && m.parameters.length === 2));
  const marker = recs.find((c) => c.simpleName === "Marker");
  assert.ok(marker, "annotation Marker");
  assert.ok(marker.methods.some((m) => m.name === "value"));
  const other = recs.find((c) => c.simpleName === "Other");
  assert.equal(other.environment, false, "file-level @Environment must not leak to Other");
  console.log("extract ctor/enum/record/annotation/class-level flags: ok");
}

{
  const q = queryLoaderApi({
    platform: "neoforge",
    minecraftVersion: "1.21.1",
    className: "IPayloadContext",
  });
  assert.equal(q.found, true, `IPayloadContext found: ${JSON.stringify(q).slice(0, 400)}`);
  assert.ok(Array.isArray(q.methods), "methods array");
  const infos = q.methods;
  assert.ok(infos.length > 0, "IPayloadContext methods must be non-empty MethodInfo (re-extract if still [])");
  assert.ok(infos[0].signature || infos[0].name, "MethodInfo has signature/name");
  console.log(`query IPayloadContext methods=${infos.length} signature0=${infos[0].signature ?? infos[0].name}`);
}

{
  const tmpCache = mkdtempSync(join(tmpdir(), "mc-loader-ov-"));
  process.env.MC_SKILL_CACHE = tmpCache;
  mkdirSync(join(tmpCache, "loader-api-summaries"), { recursive: true });
  writeFileSync(
    join(tmpCache, "loader-api-summaries", "1.21.1-neoforge.json"),
    JSON.stringify({
      mappingsVersion: "test",
      source: "user_jar",
      classes: [
        { fqcn: "pkg.Outer", simpleName: "Outer", methods: [], apiStatusInternal: false, environment: false },
        { fqcn: "pkg.Outer$Inner", simpleName: "Inner", methods: [], apiStatusInternal: false, environment: false },
        { fqcn: "pkg.Other$Inner", simpleName: "Inner", methods: [], apiStatusInternal: false, environment: false },
      ],
    }),
    "utf8",
  );
  const amb = queryLoaderApi({ platform: "neoforge", minecraftVersion: "1.21.1", className: "Inner" });
  assert.equal(amb.code, "AMBIGUOUS");
  assert.ok(Array.isArray(amb.candidates) && amb.candidates.length === 2);
  const dollarAmb = queryLoaderApi({
    platform: "neoforge",
    minecraftVersion: "1.21.1",
    className: "Outer$Inner",
  });
  assert.equal(dollarAmb.found, true, "Outer$Inner unique via suffix .Outer$Inner");
  writeFileSync(
    join(tmpCache, "loader-api-summaries", "1.21.1-neoforge.json"),
    JSON.stringify({
      mappingsVersion: "test",
      source: "user_jar",
      classes: [
        { fqcn: "pkg.Same", simpleName: "Same", methods: [{ name: "a", returnType: "void", parameters: [], modifiers: [], signature: "void a()" }], apiStatusInternal: false, environment: false, file: "x.java" },
        { fqcn: "pkg.Same", simpleName: "Same", methods: [{ name: "a", returnType: "void", parameters: [], modifiers: [], signature: "void a()" }], apiStatusInternal: false, environment: false, file: "pkg/Same.java" },
      ],
    }),
    "utf8",
  );
  const dup = queryLoaderApi({ platform: "neoforge", minecraftVersion: "1.21.1", className: "Same" });
  assert.equal(dup.found, true, "duplicate FQCN must collapse, not AMBIGUOUS");
  assert.equal(dup.fqcn, "pkg.Same");
  writeFileSync(
    join(tmpCache, "loader-api-summaries", "1.21.1-neoforge.json"),
    JSON.stringify({
      mappingsVersion: "test",
      source: "user_jar",
      fqcnIndex: ["pkg.Outer$Inner", "other.Outer$Inner"],
      classes: [
        { fqcn: "pkg.Outer$Inner", simpleName: "Inner", methods: [], apiStatusInternal: false, environment: false },
        { fqcn: "other.Outer$Inner", simpleName: "Inner", methods: [], apiStatusInternal: false, environment: false },
      ],
    }),
    "utf8",
  );
  const dollarMulti = queryLoaderApi({
    platform: "neoforge",
    minecraftVersion: "1.21.1",
    className: "Outer$Inner",
  });
  assert.equal(dollarMulti.code, "AMBIGUOUS", "Outer$Inner must not pick first $Inner");
  const exact = queryLoaderApi({
    platform: "neoforge",
    minecraftVersion: "1.21.1",
    className: "pkg.Outer$Inner",
  });
  assert.equal(exact.found, true);
  assert.equal(exact.fqcn, "pkg.Outer$Inner");
  writeFileSync(
    join(tmpCache, "loader-api-summaries", "1.21.1-neoforge.json"),
    JSON.stringify({
      mappingsVersion: "test",
      source: "user_jar",
      fqcnIndex: ["pkg.MissingBody"],
      classes: [{ fqcn: "pkg.Outer", simpleName: "Outer", methods: [], apiStatusInternal: false, environment: false }],
    }),
    "utf8",
  );
  const noBody = queryLoaderApi({
    platform: "neoforge",
    minecraftVersion: "1.21.1",
    className: "pkg.MissingBody",
  });
  assert.equal(noBody.code, "INDEXED_WITHOUT_BODY");
  delete process.env.MC_SKILL_CACHE;
  rmSync(tmpCache, { recursive: true, force: true });
  console.log("AMBIGUOUS nested Inner: ok");
}

{
  const miss = queryLoaderApi({ platform: "neoforge", minecraftVersion: "9.9.9", className: "Foo" });
  assert.equal(miss.code, "LOADER_API_NOT_INDEXED");
  const skip = queryLoaderApi({ platform: "liteloader", minecraftVersion: "1.10.2", className: "LiteMod" });
  assert.equal(skip.code, "PLATFORM_SKIPPED");
  assert.ok(skip.howToIngest || skip.action, "howToIngest");
  const hand = queryLoaderApi({ platform: "liteloader", minecraftVersion: "1.12.2", className: "LiteMod" });
  assert.equal(hand.found, true, "hand extract still queryable");
  console.log("NOT_INDEXED / PLATFORM_SKIPPED / hand extract: ok");
}

{
  const listedBare = searchLoaderApi({ mode: "list" });
  assert.equal(listedBare.ok, false);
  assert.equal(listedBare.code, "INVALID_INPUT");
  const listed = searchLoaderApi({ mode: "list", platform: "neoforge", minecraftVersion: "1.21.1" });
  assert.ok(Array.isArray(listed.indexed));
  assert.ok(Array.isArray(listed.mavenNotIndexed));
  const s = searchLoaderApi({
    platform: "neoforge",
    minecraftVersion: "1.21.1",
    query: "IPayloadContext",
    limit: 5,
    offset: 0,
  });
  assert.ok(s.hits?.some((h) => String(h).includes("IPayloadContext")) || s.total >= 0);
  const paged = searchLoaderApi({
    platform: "neoforge",
    minecraftVersion: "1.21.1",
    query: "neoforge",
    limit: 2,
    offset: 2,
  });
  assert.equal(paged.limit, 2);
  assert.equal(paged.offset, 2);
  console.log(`search list indexed=${listed.indexed.length} hits=${s.total} mavenNotIndexed=${listed.mavenNotIndexed?.length ?? 0}`);
}

{
  const stale = assertCacheFresh({
    jarSha256: "aaa",
    summarySha: "bbb",
    targetMappings: "mcp-1",
  });
  assert.equal(stale.ok, false);
  assert.equal(stale.code, "CACHE_STALE");
  const mapMismatch = assertCacheFresh({
    jarSha256: "aaa",
    summarySha: "aaa",
    sidecarMappings: "yarn-old",
    targetMappings: "mojmap-new",
  });
  assert.equal(mapMismatch.ok, false);
  console.log("CACHE_STALE: ok");
}

{
  const tmp = mkdtempSync(join(tmpdir(), "mc-ingest-"));
  process.env.MC_SKILL_CACHE = tmp;
  const java = "package x; public class Foo { public void bar(int a) {} }\n";
  const jarBuf = createStoreZip([{ name: "x/Foo.java", data: java }]);
  const jarPath = join(tmp, "user.jar");
  writeFileSync(jarPath, jarBuf);
  const dry = ingestLoaderApi({
    platform: "liteloader",
    minecraftVersion: "1.10.2",
    jarPath,
    mappingsVersion: "mcp-1.10.2",
    dryRun: true,
  });
  assert.equal(dry.ok, true);
  assert.equal(dry.dryRun, true);
  assert.ok(dry.javaFileCount >= 1);
  const official = join(root, "data", "loader-api-summaries", "1.10.2-liteloader.json");
  assert.equal(existsSync(official), false, "must not write official data on dryRun");
  const noMap = ingestLoaderApi({
    platform: "liteloader",
    minecraftVersion: "1.10.2",
    jarPath,
    mappingsVersion: "",
    dryRun: true,
  });
  assert.equal(noMap.ok, false);
  delete process.env.MC_SKILL_CACHE;
  rmSync(tmp, { recursive: true, force: true });
  console.log("ingest dryRun: ok");
}

{
  const tmp = mkdtempSync(join(tmpdir(), "mc-ingest-stale-"));
  process.env.MC_SKILL_CACHE = tmp;
  mkdirSync(join(tmp, "loader-api-summaries"), { recursive: true });
  const java = "package x; public class Foo { public void bar() {} }\n";
  const jarBuf = createStoreZip([{ name: "x/Foo.java", data: java }]);
  const jarPath = join(tmp, "user.jar");
  writeFileSync(jarPath, jarBuf);
  const keyJson = join(tmp, "loader-api-summaries", "1.10.2-liteloader.json");
  writeFileSync(
    keyJson,
    JSON.stringify({ sourceJarSha256: "deadbeef", mappingsVersion: "mcp-1.10.2", classes: [] }),
    "utf8",
  );
  const r = ingestLoaderApi({
    platform: "liteloader",
    minecraftVersion: "1.10.2",
    jarPath,
    mappingsVersion: "mcp-1.10.2",
    dryRun: false,
    confirmed: true,
  });
  assert.equal(r.ok, false);
  assert.equal(r.code, "CACHE_STALE");
  delete process.env.MC_SKILL_CACHE;
  rmSync(tmp, { recursive: true, force: true });
  console.log("ingest CACHE_STALE: ok");
}

{
  // A-20 回归门：merged 摘要缓存的 stamp 必须含内容指纹，overlay 同名文件被原地替换 / 重建后立刻失效。
  const store = await import("./dist/loader-api/store.js");
  const tmp = mkdtempSync(join(tmpdir(), "mc-loader-stamp-"));
  process.env.MC_SKILL_CACHE = tmp;
  const ovDir = store.overlaySummariesDir();
  mkdirSync(ovDir, { recursive: true });

  const small = join(ovDir, "9.9.9-probe.json");
  const smallBody = (tag) =>
    JSON.stringify({
      platform: "probe",
      minecraftVersion: "9.9.9",
      classes: [{ fqcn: "a.b.C", methods: [tag] }],
      pad: "xxxxxxxx",
    });
  const readSmall = () => store.findSummary("probe", "9.9.9")?.summary?.classes?.[0]?.methods?.[0];
  writeFileSync(small, smallBody("AAA"), "utf8");
  const s0 = statSync(small);
  utimesSync(small, s0.atime, s0.mtime); // mtimeMs 归一到整毫秒，之后可精确复原
  const pinned = statSync(small);
  const restoreMtime = (p) => utimesSync(p, pinned.atime, pinned.mtime);

  assert.equal(readSmall(), "AAA");
  assert.equal(
    store.loadMergedSummaries(),
    store.loadMergedSummaries(),
    "前置条件：连续两次读取必须命中同一 Map 实例（否则下面的「重建」断言无意义）",
  );

  // 1) 同 mtime + 同 size 原地覆盖（unzip / cp --preserve=all 的产物）：只有内容指纹能抓
  const beforeMap = store.loadMergedSummaries();
  const bbb = smallBody("BBB");
  assert.equal(Buffer.byteLength(bbb), pinned.size, "夹具必须与 AAA 等长");
  writeFileSync(small, bbb, "utf8");
  restoreMtime(small);
  const s1 = statSync(small);
  assert.equal(s1.size, pinned.size, "夹具：size 未变");
  assert.equal(s1.mtimeMs, pinned.mtimeMs, "夹具：mtime 已复原");
  assert.equal(s1.ino, pinned.ino, "夹具：原地覆盖不换 inode");
  assert.notEqual(store.loadMergedSummaries(), beforeMap, "A-20：原地覆盖后 merged 缓存必须重建");
  assert.equal(readSmall(), "BBB", "A-20：同 mtime/size 原地覆盖后不得再返回旧内容");

  // 2) 删除后重建同名等长文件，mtime 原样恢复
  unlinkSync(small);
  writeFileSync(small, smallBody("CCC"), "utf8");
  restoreMtime(small);
  assert.equal(readSmall(), "CCC", "A-20：同名重建后 merged 缓存必须反映新内容");

  // 3) >1 MiB 只取首尾探针：中段变更 + mtime/size 复原 → 只剩 ino / birthtime 能抓
  const big = join(ovDir, "9.9.8-probe.json");
  const bigBody = (tag) =>
    JSON.stringify({
      platform: "probe",
      minecraftVersion: "9.9.8",
      pad: "a".repeat(1_000_000) + tag + "a".repeat(990_000),
    });
  const readBig = () => store.findSummary("probe", "9.9.8")?.summary?.pad?.slice(1_000_000, 1_000_002);
  writeFileSync(big, bigBody("V1"), "utf8");
  const g0 = statSync(big);
  utimesSync(big, g0.atime, g0.mtime);
  const gPinned = statSync(big);
  assert.ok(gPinned.size > 1 << 20, `夹具必须走首尾探针分支，实际 ${gPinned.size} 字节`);
  assert.equal(readBig(), "V1");
  const restoreBig = () => utimesSync(big, gPinned.atime, gPinned.mtime);
  unlinkSync(big);
  writeFileSync(big, bigBody("V2"), "utf8");
  restoreBig();
  const g1 = statSync(big);
  assert.equal(g1.size, gPinned.size, "夹具：size 未变");
  assert.equal(g1.mtimeMs, gPinned.mtimeMs, "夹具：mtime 已复原");
  assert.ok(
    g1.ino !== gPinned.ino || g1.birthtimeMs !== gPinned.birthtimeMs,
    "夹具：ino / birthtime 必须变化，否则本用例覆盖不到探针分支",
  );
  assert.equal(readBig(), "V2", "A-20：大文件中段变更（首尾一致）也必须让缓存失效");

  store.invalidateMergedSummariesCache();
  delete process.env.MC_SKILL_CACHE;
  rmSync(tmp, { recursive: true, force: true });
  console.log("merged 缓存 stamp 内容失效 (A-20): ok");
}

void sha256Buffer;
void readFileSync;
{
  const { isThinLoaderSummary } = await import("./dist/loader-api/extract.js");
  const neoPath = join(root, "data", "loader-api-summaries", "1.21.1-neoforge.json");
  const neo = JSON.parse(readFileSync(neoPath, "utf8"));
  assert.equal(isThinLoaderSummary(neo), false, "1.21.1-neoforge must not stay 400-class / string-method thin");
  const xp = queryLoaderApi({
    platform: "neoforge",
    minecraftVersion: "1.21.1",
    className: "XpOrbTargetingEvent",
  });
  assert.equal(xp.found, true, `XpOrbTargetingEvent found: ${xp.code || xp.notes?.[0]}`);
  assert.notEqual(xp.code, "INDEXED_WITHOUT_BODY");
  assert.ok(
    Array.isArray(xp.methods) && xp.methods.every((m) => m && typeof m.signature === "string" && !String(m.signature).endsWith("(...)")),
    "methods must be real MethodInfo, not string upgrades",
  );
  const neoText = readFileSync(neoPath, "utf8");
  assert.ok(!/mc-skill-temp|[A-Za-z]:\\\\/.test(neoText), "no local cache paths in neo summary");
  const idx = JSON.parse(readFileSync(join(root, "data", "loader-api-summaries", "index.json"), "utf8"));
  assert.equal(idx.cache, "$MC_SKILL_CACHE");
  const skipMeta = new Set([
    "index.json",
    "status.json",
    "extracted-classes.json",
    "skipped-ingest.json",
  ]);
  const { readdirSync } = await import("node:fs");
  for (const name of readdirSync(join(root, "data", "loader-api-summaries")).filter(
    (n) => n.endsWith(".json") && !skipMeta.has(n) && !n.endsWith("-last.json"),
  )) {
    const j = JSON.parse(readFileSync(join(root, "data", "loader-api-summaries", name), "utf8"));
    if (!Array.isArray(j.classes)) continue;
    const row = (idx.jars || []).find((x) => String(x.file).replace(/\.jar$/i, "") === name.replace(/\.json$/i, ""));
    assert.equal(j.classCount, j.classes.length, `${name} classCount`);
    if (row) assert.equal(row.classCount, j.classes.length, `index.json ${name}`);
    assert.ok(!/mc-skill-temp|[A-Za-z]:\\\\/.test(JSON.stringify(j)), `${name} must not embed drive paths`);
    if (!j.skippedExpansion) {
      assert.equal(isThinLoaderSummary(j), false, `${name} must not be thin`);
    }
  }
  const listed = searchLoaderApi({ mode: "list", platform: "fabric", minecraftVersion: "1.18.2" });
  assert.ok(Array.isArray(listed.mavenNotIndexed));
  assert.ok(
    !listed.mavenNotIndexed.some((x) => x.key === "1.18.2-fabric-api"),
    "1.18.2-fabric-api should be indexed after pin fix",
  );
  const fab182 = queryLoaderApi({
    platform: "fabric",
    minecraftVersion: "1.18.2",
    className: "EventFactory",
  });
  assert.equal(fab182.found, true, `1.18.2 EventFactory: ${fab182.code || fab182.notes?.[0]}`);
  const missFab = queryLoaderApi({ platform: "fabric", minecraftVersion: "1.15.2", className: "FabricItem" });
  assert.equal(missFab.code, "LOADER_API_NOT_INDEXED");
  const qsl = JSON.parse(readFileSync(join(root, "data", "loader-api-summaries", "1.21.1-qsl.json"), "utf8"));
  assert.ok(qsl.classCount >= 80, `QSL thickened, got ${qsl.classCount}`);
  const qslHit = queryLoaderApi({
    platform: "quilt",
    minecraftVersion: "1.21.1",
    className: "RegistryEvents",
  });
  assert.equal(qslHit.found, true, `QSL RegistryEvents: ${qslHit.code || qslHit.notes?.[0]}`);
  console.log(`data quality neo classes=${neo.classes?.length} index=${neo.fqcnIndex?.length} qsl=${qsl.classCount}`);
}

{
  const { candidateKeysSafe, sidecarSchemaCompatible } = await import("./dist/loader-api/index.js");
  const bad = candidateKeysSafe("../x", "1.20.1");
  assert.equal(bad.ok, false);
  assert.equal(bad.action?.code, "INVALID_INPUT");
  const q = queryLoaderApi({ platform: "forge/../etc", minecraftVersion: "1.20.1", className: "Item" });
  assert.equal(q.found, false);
  assert.equal(q.code, "INVALID_INPUT");
  const good = candidateKeysSafe("forge", "1.20.1");
  assert.equal(good.ok, true);
  assert.ok(sidecarSchemaCompatible().ok);
  assert.ok(sidecarSchemaCompatible("1").ok);
  assert.equal(sidecarSchemaCompatible("99").ok, false);
  console.log("loader-api INVALID_INPUT + sidecar schema: ok");
}

console.log("test-loader-api: all passed");
