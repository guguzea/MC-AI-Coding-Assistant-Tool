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

// ── S15b：F131（yarn-tiny MCP/Parchment 门要盖住 from 侧）+ F178（1.14.4 类查询被 CSV 方法表劫持）──
// 本波 dist 冻结（改 src 不代跑 npm run build），故两条按本文件 D-37 的约定双机制核：
// 把 src 里真正会编译进 dist 的判据文本抠出来当场复算，再用 dist 钉住「未改动的邻路 + 数据面」。
// 中心 build 后可升级为运行时门：convertMapping(from=mcp,to=yarn,1.21.1) → resultKind
// YARN_TINY_NO_MCP_LAYER；convertMapping(from=yarn,to=intermediary,net.minecraft.block.Block,1.14.4)
// → found:true + mappingType:"class" + converted net.minecraft.class_2248。
{
  const { existsSync, readFileSync } = await import("node:fs");
  const { DatabaseSync } = await import("node:sqlite");
  const cv = readFileSync(join(repo, "mcp-server/src/mappings/convert.ts"), "utf8");
  const ys = readFileSync(join(repo, "mcp-server/src/mappings/yarn-sqlite.ts"), "utf8");
  const { convertMapping } = await import("./dist/mappings/convert.js");
  const { convertYarnMember } = await import("./dist/mappings/yarn-sqlite.js");

  // 从 src 抠「const NAME = <expr>;」的表达式原文（可能是多行）
  const constRhs = (text, name) => {
    const at = text.indexOf(`const ${name} =`);
    assert.ok(at >= 0, `未找到 const ${name}`);
    const start = text.indexOf("=", at) + 1;
    const end = text.indexOf(";", start);
    assert.ok(end > start, `const ${name} 没有终止分号`);
    return text.slice(start, end).trim();
  };
  const ifCond = (text, needle) => {
    const line = text.split(/\r?\n/).find((l) => l.trimStart().startsWith("if (") && l.includes(needle));
    assert.ok(line, `未找到含 ${needle} 的 if 行`);
    return line.slice(line.indexOf("if (") + 4, line.lastIndexOf(") {"));
  };

  // ── F131-a：门判据（to 侧恒设门，from 侧只收类级）当场复算 ──
  const fnAt = cv.indexOf("export function mcpLayerSide(");
  assert.ok(fnAt >= 0, "F131 convert.ts 缺少 mcpLayerSide 门函数");
  const bodyStart = cv.indexOf("{", fnAt) + 1;
  const sideBody = cv.slice(bodyStart, cv.indexOf("\n}", bodyStart));
  assert.ok(sideBody.includes('return "to"') && sideBody.includes('return "from"'), `F131 判据抽取失败: ${sideBody}`);
  const side = (from, to, kind) => new Function("from", "to", "kind", sideBody)(from, to, kind);
  assert.equal(side("yarn", "mcp", "class"), "to", "F131 既有 to 侧门不得退化");
  assert.equal(side("mcp", "yarn", "class"), "from", "F131 from=mcp 类查询必须进同一道门");
  assert.equal(side("parchment", "intermediary", "class"), "from", "F131 from=parchment 同理");
  assert.equal(side("mcp", "mojang", "method"), null, "F131 成员级 mcp 查询不得误伤（test-core 钉住）");
  assert.equal(side("intermediary", "yarn", "class"), null, "F131 intermediary/yarn 输入不是 MCP 层");
  const gateCond = ifCond(cv, "yarnTinyMcpSide !== null").replace(/yarnTinyMcpSide/g, "s").replace(/resolveCsvMappingDbPath\(version\)/g, "hasCsv");
  const gated = (era, from, to, kind, hasCsv) =>
    Boolean(new Function("era", "s", "hasCsv", `return (${gateCond});`)(era, side(from, to, kind), hasCsv));
  assert.equal(gated("yarn-tiny", "mcp", "yarn", "class", false), true, "F131 1.21.1 from=mcp 类查询应被拒");
  assert.equal(gated("yarn-tiny", "yarn", "mcp", "class", false), true, "F131 to=mcp 侧行为保持");
  assert.equal(gated("yarn-tiny", "mcp", "yarn", "class", true), false, "F131 1.14.4 有 mcp-csv 层：不走 convert.ts 这道门");
  assert.equal(gated("yarn-tiny", "mcp", "mojang", "method", false), false, "F131 成员级路径不受本门影响");
  assert.equal(gated("mcp-csv", "mcp", "mojang", "class", true), false, "F131 纯 CSV 档不得被拒");

  // ── F131-b：第二道门（yarn-sqlite 类级）同样盖住 from 侧 ──
  const ysSideRhs = constRhs(ys, "mcpLayerSide");
  const ysSide = (from, to) => new Function("from", "to", `return (${ysSideRhs});`)(from, to);
  assert.ok(ifCond(ys, "mcpLayerSide").includes('era === "yarn-tiny"'), "F131 yarn-sqlite 门条件未含 era");
  assert.equal(ysSide("yarn", "mcp"), "to", "F131 类级 to 侧保持");
  assert.equal(ysSide("mcp", "yarn"), "from", "F131 类级 from 侧必须进门（1.14.4 CSV 例外档由这道门兜）");
  assert.equal(ysSide("intermediary", "yarn"), null, "F131 intermediary 输入保持可答");

  // ── F131-c：dist 运行时钉住既有载荷形状与不得误伤的邻路 ──
  const toSideGate = convertMapping({ from: "yarn", to: "mcp", memberName: "net.minecraft.block.Block", version: "1.21.1" });
  assert.equal(toSideGate.found, false);
  assert.equal(toSideGate.resultKind, "YARN_TINY_NO_MCP_LAYER", toSideGate.resultKind);
  assert.equal(toSideGate.action?.code, "DATA_UNAVAILABLE", toSideGate.action?.code);
  const memberMcp = convertMapping({
    from: "mcp",
    to: "mojang",
    memberName: "getHealth",
    ownerClass: "net.minecraft.world.entity.LivingEntity",
    version: "1.20.1",
  });
  assert.equal(memberMcp.found, true, `F131 过度设门会打死 yarn-tiny 成员级 mcp：${JSON.stringify(memberMcp.notes)}`);
  assert.equal(memberMcp.converted, "er");
  console.log("F131 yarn-tiny MCP/Parchment 门 from+to 双侧: ok");

  // ── F178-a：CSV 方法表捷径只接裸名（判据原文复算）──
  const bareRhs = constRhs(cv, "csvOnlyBareName");
  const isBare = (memberName) => Boolean(new Function("memberName", `return (${bareRhs});`)(memberName));
  assert.equal(isBare("getHealth"), true, "F178 裸名必须仍走 CSV 捷径");
  assert.equal(isBare("func_110143_aJ"), true, "F178 searge 名必须仍走 CSV 捷径");
  assert.equal(isBare("net.minecraft.block.Block"), false, "F178 FQCN 不是裸名");
  assert.equal(isBare("net/minecraft/block/Block"), false, "F178 slash FQCN 不是裸名");
  const allowRhs = constRhs(cv, "allowCsvMethodPath").replace(/resolveCsvMappingDbPath\(version\)/g, "hasCsv");
  const allowCsv = (memberName, kind, ownerClass, hasCsv) =>
    Boolean(new Function("kind", "ownerClass", "hasCsv", "csvOnlyBareName", `return (${allowRhs});`)(
      kind,
      ownerClass,
      hasCsv,
      isBare(memberName),
    ));
  assert.equal(allowCsv("net.minecraft.block.Block", "class", undefined, true), false, "F178 1.14.4 类查询不得走方法表");
  assert.equal(allowCsv("getHealth", "class", undefined, true), true, "F178 裸名 CSV 捷径保持（R2/R3）");
  assert.equal(allowCsv("func_110143_aJ", "method", undefined, true), true, "F178 searge 分派保持");
  assert.equal(allowCsv("getHealth", "method", "net.minecraft.entity.LivingEntity", true), false, "F178 带 owner 仍不走全局 CSV");
  assert.equal(allowCsv("net.minecraft.block.Block", "class", undefined, false), false, "F178 无 CSV 档本就不走此路");

  // ── F178-b：第二机制 = 表实况（只读打开，勿留 -journal/-wal）──
  const sqlitePath = join(process.env.MC_SKILL_DATA ?? join(repo, "data"), "fabric_1.14.4", "mappings", "yarn-mappings.sqlite");
  const db = new DatabaseSync(sqlitePath, { readOnly: true });
  try {
    const row = db.prepare("select named, intermediary, official from classes where named=?").get("net/minecraft/block/Block");
    assert.equal(row.intermediary, "net/minecraft/class_2248", JSON.stringify(row));
    assert.equal(row.official, "bmv", JSON.stringify(row));
  } finally {
    db.close();
  }
  assert.ok(!existsSync(`${sqlitePath}-wal`) && !existsSync(`${sqlitePath}-journal`), "只读打开不得留下 wal/journal");

  // ── F178-c：dist 运行时钉住分派目标与反方向邻路 ──
  const cls = convertYarnMember("1.14.4", "yarn", "intermediary", "net.minecraft.block.Block");
  assert.equal(cls.found, true, `F178 类表数据在，类路径必须命中: ${JSON.stringify(cls.notes)}`);
  assert.equal(cls.mappingType, "class");
  assert.equal(cls.converted, "net.minecraft.class_2248", JSON.stringify(cls.converted));
  const rev = convertMapping({ from: "intermediary", to: "yarn", memberName: "net.minecraft.class_2248", version: "1.14.4" });
  assert.equal(rev.converted, "net.minecraft.block.Block", JSON.stringify(rev.notes));
  const bareCsv = convertMapping({ from: "mcp", to: "mojang", memberName: "getHealth", version: "1.14.4" });
  assert.equal(bareCsv.ambiguous, true, `F178 不得改坏 1.14.4 裸名 CSV 路径: ${JSON.stringify(bareCsv.notes)}`);
  console.log("F178 1.14.4 yarn 类查询分派: ok");
}

console.log("test-w3-low: ok");
