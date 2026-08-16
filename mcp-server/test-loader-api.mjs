/**
 * loader-api：JavaParser 抽取、query/search、ingest dryRun、CACHE_STALE、PLATFORM_SKIPPED。
 */
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, existsSync, readFileSync } from "node:fs";
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
  console.log("extract CompilationUnit: ok");
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
  const exact = queryLoaderApi({
    platform: "neoforge",
    minecraftVersion: "1.21.1",
    className: "pkg.Outer$Inner",
  });
  assert.equal(exact.found, true);
  assert.equal(exact.fqcn, "pkg.Outer$Inner");
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
  const listed = searchLoaderApi({ mode: "list" });
  assert.ok(Array.isArray(listed.indexed) && listed.indexed.length > 0);
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
  console.log(`search list indexed=${listed.indexed.length} hits=${s.total}`);
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

void sha256Buffer;
void readFileSync;
console.log("test-loader-api: all passed");
