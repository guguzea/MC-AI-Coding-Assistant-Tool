/**
 * W3 LOW 回归：B3–B5 / E4–E10 / E20 / C10 / D8 / D12 / pack helpers。
 * 不跑全仓 sync-skills。前置：npm run build。
 */
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { crc32 } from "node:zlib";

const repo = join(dirname(fileURLToPath(import.meta.url)), "..");
process.env.MC_SKILL_DATA = process.env.MC_SKILL_DATA ?? join(repo, "data");

const { inspectPack, listSkillIndex } = await import("./dist/platform-pack/catalog.js");
const { expandHosts } = await import("./dist/platform-pack/hosts.js");
const { ensureFrontmatter } = await import("./dist/platform-pack/write.js");
const { pickJavaProbe } = await import("./dist/decompile/java/java-process.js");
const { isDangerousRegex } = await import("./dist/decompile/services/search-mod-source.js");
const { parseTomlValue, parseModsToml } = await import("./dist/decompile/services/toml-parse.js");
const { readJarEntryText } = await import("./dist/localize/jar.js");
const { searchFabricPortingPages } = await import("./dist/docs-platform/fabric/extra-porting.js");
const { queryApi, disposeApiData } = await import("./dist/api/index.js");

{
  assert.equal(inspectPack("../escape-dir", "1.20.1"), null);
  const forge = inspectPack("forge", "1.20.1");
  assert.ok(forge, "forge+1.20.1 应命中知识包");
  assert.equal(forge.pack.platform, "forge");
  console.log("B3 inspectPack whitelist: ok");
}

{
  const root = mkdtempSync(join(tmpdir(), "mc-pack-meta-"));
  try {
    const packDir = join(root, "forge", "1.20.1");
    mkdirSync(packDir, { recursive: true });
    writeFileSync(join(packDir, "AGENTS.md"), "# pack\n");
    writeFileSync(join(packDir, "pack.meta.json"), "{not-json");
    const hit = inspectPack("forge", "1.20.1", root);
    assert.ok(hit);
    assert.equal(hit.status, "draft");
    assert.equal(hit.metaUnreadable, true);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
  console.log("B4 pack.meta unreadable → draft: ok");
}

{
  const root = mkdtempSync(join(tmpdir(), "mc-pack-div-"));
  try {
    const packDir = join(root, "forge", "1.20.1");
    const cursor = join(packDir, ".cursor", "skills", "mc-foo");
    const claude = join(packDir, ".claude", "skills", "mc-foo");
    mkdirSync(cursor, { recursive: true });
    mkdirSync(claude, { recursive: true });
    writeFileSync(join(cursor, "SKILL.md"), "---\nname: mc-foo\n---\ncanonical\n");
    writeFileSync(join(claude, "SKILL.md"), "---\nname: mc-foo\n---\nother\n");
    const { skills, diverged } = listSkillIndex(packDir, root);
    assert.ok(skills.some((s) => s.name === "mc-foo"));
    assert.ok(diverged.some((d) => d.name === "mc-foo"));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
  console.log("B5 diverged skill hash: ok");
}

{
  const bad = expandHosts(["all", "bogus"]);
  assert.ok("error" in bad, JSON.stringify(bad));
  const unclosed = "---\ndescription: x\nbody without closing fence";
  const out = ensureFrontmatter(unclosed, "desc", {});
  assert.equal(out, unclosed);
  assert.ok(!out.slice(3).includes("\n---\n---"));
  console.log("INFO expandHosts / ensureFrontmatter: ok");
}

{
  const home = {
    ready: false,
    major: 8,
    versionText: "1.8.0",
    javaPath: "C:\\\\jdk8\\\\bin\\\\java.exe",
    reason: "TOO_OLD",
  };
  const pathProbe = {
    ready: true,
    major: 17,
    versionText: "17.0.2",
    javaPath: "java",
    reason: "OK",
  };
  const picked = pickJavaProbe(home, pathProbe);
  assert.equal(picked.ready, true);
  assert.equal(picked.major, 17);
  console.log("E20 HOME=8 PATH=17: ok");
}

{
  assert.equal(isDangerousRegex("(a+){10}"), true);
  assert.equal(isDangerousRegex("(a+)+"), true);
  assert.equal(isDangerousRegex("foo.*bar"), false);
  console.log("E10 isDangerousRegex: ok");
}

{
  assert.throws(() => parseTomlValue("{a=1}"), /TOML_INLINE_UNSUPPORTED/);
  assert.throws(() => parseTomlValue("[1, 2]"), /TOML_INLINE_UNSUPPORTED/);
  assert.equal(parseTomlValue("'a\\nb'"), "a\\nb");
  assert.equal(parseTomlValue('"a\\\\b\\"c"'), 'a\\b"c');
  const multi = parseModsToml(`
[[mods]]
modId="one"
[[mods]]
modId="two"
`);
  assert.deepEqual(multi.mods.map((m) => m.modId), ["one", "two"]);
  console.log("E7/E9 toml: ok");
}

function makeStoreZip(name, data, { lieCsize } = {}) {
  const nameBuf = Buffer.from(name, "utf8");
  const payload = Buffer.isBuffer(data) ? data : Buffer.from(String(data), "utf8");
  const crc = crc32(payload) >>> 0;
  const local = Buffer.alloc(30);
  local.writeUInt32LE(0x04034b50, 0);
  local.writeUInt16LE(20, 4);
  local.writeUInt16LE(0x0800, 6);
  local.writeUInt16LE(0, 8);
  local.writeUInt32LE(crc, 14);
  local.writeUInt32LE(payload.length, 18);
  local.writeUInt32LE(payload.length, 22);
  local.writeUInt16LE(nameBuf.length, 26);
  const cd = Buffer.alloc(46);
  cd.writeUInt32LE(0x02014b50, 0);
  cd.writeUInt16LE(20, 6);
  cd.writeUInt16LE(0x0800, 8);
  cd.writeUInt32LE(crc, 16);
  const csize = lieCsize ?? payload.length;
  cd.writeUInt32LE(csize, 20);
  cd.writeUInt32LE(payload.length, 24);
  cd.writeUInt16LE(nameBuf.length, 28);
  cd.writeUInt32LE(0, 42);
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(1, 8);
  eocd.writeUInt16LE(1, 10);
  const cdOffset = 30 + nameBuf.length + payload.length;
  eocd.writeUInt32LE(46 + nameBuf.length, 12);
  eocd.writeUInt32LE(cdOffset, 16);
  return Buffer.concat([local, nameBuf, payload, cd, nameBuf, eocd]);
}

{
  const honest = makeStoreZip("assets/demo/lang/en_us.json", '{"a":"b"}');
  assert.equal(readJarEntryText(honest, "assets/demo/lang/en_us.json"), '{"a":"b"}');
  const lying = makeStoreZip("assets/demo/lang/en_us.json", '{"a":"b"}', { lieCsize: 400 });
  let threw = false;
  try {
    const text = readJarEntryText(lying, "assets/demo/lang/en_us.json");
    assert.ok(!text.includes("PK\u0001\u0002"), "不得返回中央目录字节");
  } catch {
    threw = true;
  }
  assert.equal(threw, true, "谎报 csize 应拒绝");
  console.log("E4 lying csize: ok");
}

{
  const noise = searchFabricPortingPages("the", "9.9.9");
  assert.equal(noise.length, 0, `常见首词不应误召回: ${JSON.stringify(noise)}`);
  console.log("C10 extra-porting first-word: ok");
}

{
  const item = await queryApi({ className: "net.minecraft.world.item.Item", version: "1.20.1" });
  if (item.found && Array.isArray(item.methods)) {
    assert.ok(item.methods.length <= 80, `methods cap 80, got ${item.methods.length}`);
    if (item.classJavadoc) assert.ok(item.classJavadoc.length <= 8 * 1024);
  }
  await disposeApiData();
  console.log("D12 query_api methods cap: ok");
}

// ── W4 组4（A6）：D-37 / D-40 / D-41 / D-50 / D-51 ──
// dist 本波禁止重建，故这几条按「源文本 + 独立复算」双机制核，重建后再补运行时门。
{
  const { readFileSync } = await import("node:fs");
  const src = (p) => readFileSync(join(repo, "mcp-server/src", p), "utf8");

  // D-37：从源码里把通用绝对路径脱敏的正则字面量抠出来，再用它真跑一遍
  const ex = src("loader-api/extract.ts");
  assert.ok(
    !ex.includes("\\/Users|") && !ex.includes("\\/opt|"),
    "D-37 仍在枚举 Unix 根目录",
  );
  const scrubLine = ex.split(/\r?\n/).find((l) => l.includes(".replace(") && l.includes('"$1[redacted-path]"'));
  assert.ok(scrubLine, "D-37 通用绝对路径脱敏缺失");
  const lit = scrubLine.slice(scrubLine.indexOf(".replace(") + ".replace(".length, scrubLine.lastIndexOf(", "));
  assert.ok(lit.startsWith("/") && lit.endsWith("/g"), `D-37 抠出的不是正则字面量: ${lit}`);
  const scrubRe = new RegExp(lit.slice(1, lit.lastIndexOf("/")), lit.slice(lit.lastIndexOf("/") + 1));
  const scrub = (s) => s.replace(scrubRe, "$1[redacted-path]");
  for (const probe of [
    "parse error in /etc/zzz/Secret.java",
    "/mnt/data/X.java:3",
    "src=path=/opt/secret/Y.java",
    "/home/foo/Bar.java",
  ]) {
    assert.ok(!scrub(probe).match(/\/(?:etc|mnt|opt|home)\//), `D-37 未脱敏: ${probe} -> ${scrub(probe)}`);
  }
  assert.ok(scrub("relative/a/b.java").includes("relative/a/b.java"), "D-37 误伤相对片段");
  console.log("D-37 extract.ts Unix 绝对路径通用脱敏: ok");

  // D-40：奇数个 ``` 必须落在整数上
  const pr = src("docs-platform/neoforge/primers.ts");
  assert.match(pr, /codeBlockCount:\s*Math\.floor\(/, "D-40 未取整");
  for (const fences of [1, 3, 5, 7]) {
    const body = "```".repeat(fences);
    const n = Math.floor((body.match(/```/g) ?? []).length / 2);
    assert.ok(Number.isInteger(n), `D-40 ${fences} 个围栏得到非整数 ${n}`);
  }
  assert.equal(Math.floor(("```".repeat(5).match(/```/g) ?? []).length / 2), 2, "D-40 奇数围栏应向下取整");
  console.log("D-40 primers codeBlockCount 取整: ok");

  // D-41：4 个实现签名必须必填 version，schema 侧仍声明必填
  const nf = src("docs-platform/neoforge/index.ts");
  assert.ok(!/^\s*version\?:\s*string;$/m.test(nf), "D-41 仍有 version?: string 实现签名");
  const required = nf.match(/^\s*version: string;$/gm) ?? [];
  assert.equal(required.length, 4, `D-41 必填 version 实现签名应为 4 个，实为 ${required.length}`);
  const schemaReq = nf.match(/version: z\.string\(\)/g) ?? [];
  assert.ok(schemaReq.length >= 4, `D-41 zod schema 必填 version 应 >= 4，实为 ${schemaReq.length}`);
  console.log("D-41 neoforge 4 个实现签名 version 必填: ok");

  // D-50 / D-51
  const ty = src("workers/types.ts");
  assert.ok(!/interface\s+WorkerMessage\b/.test(ty), "D-51 死类型 WorkerMessage 仍在");
  assert.match(ty, /type WorkerOutMessage\b[^;]*PreloadQueuedMessage/, "D-50 queued ack 未进共享出向类型");
  const pl = src("workers/preloader.ts");
  assert.match(pl, /async function buildTrieIndex\(classNames: string\[\], deadline: number\)/, "D-50 构建未分片限时");
  assert.match(pl, /await buildTrieIndex\(classNames, deadline\)/, "D-50 调用点未 await");
  assert.ok(!/if \(preloadRunning\) return;/.test(pl), "D-50 静默丢弃分支仍在");
  assert.match(pl, /type: "queued"/, "D-50 无 ack");
  assert.match(pl, /pendingStart = data/, "D-50 重复 start 未入队");
  assert.ok(!/interface PreloadConfig\b/.test(pl), "D-51 入站契约仍分裂两份");
  console.log("D-50/D-51 preloader+types 消息契约: ok");
}

console.log("test-w3-low: ok");
