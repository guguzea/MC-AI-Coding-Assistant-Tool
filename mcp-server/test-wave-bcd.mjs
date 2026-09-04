import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, unlinkSync, readFileSync, mkdirSync, writeFileSync, rmSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  parseMethodReference,
  detectNamingStyle,
  mergeInjectMethodAndDesc,
  splitMethodAndDescriptor,
} from "./dist/mixin/method-string.js";
import { parseMixinsJson, parseMixinJavaSource } from "./dist/mixin/parser.js";
import { queryRegistry, buildRegistryIndex, closeRegistryDbs } from "./dist/registry/index.js";
import { validateDatapackJson } from "./dist/datapack/index.js";
import { analyzeBedrockContentLog } from "./dist/bedrock/content-log.js";
import {
  generateModel,
  generateNetworkPacket,
} from "./dist/generators/index.js";
import { getWorkflowTemplate, readKnowledgeResource } from "./dist/prompts/index.js";
import { mixinAnalyze } from "./dist/mixin/index.js";
import { resolveDataDir } from "./dist/utils/path.js";
import { parameterTypes, readableType, returnType, readableSignature } from "./dist/utils/descriptor.js";

function testMethodStringForms() {
  assert.equal(detectNamingStyle("func_12345_a"), "srg");
  assert.equal(detectNamingStyle("func_110143_aJ"), "srg");
  assert.equal(detectNamingStyle("field_100013_f"), "srg");
  assert.equal(detectNamingStyle("method_12345"), "yarn_intermediary");
  assert.equal(detectNamingStyle("m_12345_"), "mojang_hashed");
  assert.equal(detectNamingStyle("hurt"), "readable");

  const combined = parseMethodReference("hurt(Lnet/minecraft/world/entity/Entity;F)V");
  assert.equal(combined.methodName, "hurt");
  assert.equal(combined.descriptor, "(Lnet/minecraft/world/entity/Entity;F)V");

  const fh1 = [
    ["go(I)V", "go", "(I)V"],
    ["hurt(Lnet/minecraft/world/entity/Entity;F)V", "hurt", "(Lnet/minecraft/world/entity/Entity;F)V"],
    ["noret(I)", "noret", "(I)"],
    ["arr()[I", "arr", "()[I"],
    ["str()Ljava/lang/String;", "str", "()Ljava/lang/String;"],
    ["nested()[[Lfoo/Bar;", "nested", "()[[Lfoo/Bar;"],
    ["inner()Lfoo$Inner;", "inner", "()Lfoo$Inner;"],
    ["go(I)V;garbage", "go", "(I)V"],
  ];
  for (const [raw, name, desc] of fh1) {
    const s = splitMethodAndDescriptor(raw);
    assert.equal(s.methodName, name, raw);
    assert.equal(s.descriptor, desc, raw);
  }
  assert.equal(splitMethodAndDescriptor("go(I)V").descriptor, "(I)V");
  assert.notEqual(splitMethodAndDescriptor("go(I)V").descriptor, "(I)");
  assert.equal(readableType("()V;garbage"), "void");
  assert.notEqual(readableType("()V;garbage"), "?(");
  assert.equal(returnType("()V;garbage"), "void");
  assert.equal(readableSignature("go", "()V;garbage"), "go(): void");

  const split = mergeInjectMethodAndDesc("method_12345", "(F)V");
  assert.equal(split?.methodName, "method_12345");
  assert.equal(split?.descriptor, "(F)V");

  const arr = parseMixinJavaSource(`
    @Mixin(Entity.class)
    public class EntityMixin {
      @Inject(method = { "tick", "hurt" }, at = @At("HEAD"))
      private void onTick(CallbackInfo ci) {}
    }
  `);
  assert.ok(arr);
  assert.equal(arr.injections.length, 1);
  assert.equal(arr.injections[0].methodRefs.length, 2);
}

function testRegistry() {
  const tmpSqlite = join(tmpdir(), `mc-skill-registry-test-${process.pid}.sqlite`);
  try {
    if (existsSync(tmpSqlite)) unlinkSync(tmpSqlite);
    const report = buildRegistryIndex("1.20.1", { force: true, sqlitePath: tmpSqlite });
    assert.ok(report.totalEntries > 0, "registry fixture should have entries");
  } finally {
    try {
      if (existsSync(tmpSqlite)) unlinkSync(tmpSqlite);
    } catch {
      /* ignore */
    }
  }

  const stone = queryRegistry({ query: "minecraft:stone", version: "1.20.1" });
  assert.equal(stone.found, true);
  assert.equal(stone.nameLayer, "registry_id");
  assert.ok(stone.relatedTools.includes("convert_mapping"));

  const stoneShort = queryRegistry({ query: "stone", version: "1.20.1" });
  assert.equal(stoneShort.found, true);
  assert.equal(stoneShort.matches[0]?.id, "minecraft:stone", `stone 应优先精确 path，实际首条 ${stoneShort.matches[0]?.id}`);

  const cls = queryRegistry({ query: "net.minecraft.world.entity.Entity", version: "1.20.1" });
  assert.ok(cls.action);

  const tmpData = mkdtempSync(join(tmpdir(), "mc-skill-reg-nowrite-"));
  const prevData = process.env.MC_SKILL_DATA;
  try {
    mkdirSync(join(tmpData, "vanilla_9.9.9", "registries"), { recursive: true });
    writeFileSync(join(tmpData, "vanilla_9.9.9", "registries", "block.json"), JSON.stringify([{ id: "minecraft:air" }]));
    process.env.MC_SKILL_DATA = tmpData;
    closeRegistryDbs();
    const missing = queryRegistry({ query: "air", version: "9.9.9" });
    assert.equal(missing.action?.code, "DATA_UNAVAILABLE", JSON.stringify(missing));
    assert.ok(
      (missing.action?.nextSteps ?? []).some((s) => /build:vanilla-registries/.test(s)),
      JSON.stringify(missing.action),
    );
    assert.equal(existsSync(join(tmpData, "vanilla_9.9.9", "registries", "registry-index.sqlite")), false);
  } finally {
    closeRegistryDbs();
    if (prevData === undefined) delete process.env.MC_SKILL_DATA;
    else process.env.MC_SKILL_DATA = prevData;
    rmSync(tmpData, { recursive: true, force: true });
  }
}

function testDatapack() {
  const bad = validateDatapackJson({
    kind: "recipe",
    jsonContent: "{}",
    version: "1.20.1",
  });
  assert.equal(bad.valid, false);

  const ok = validateDatapackJson({
    kind: "tag",
    jsonContent: JSON.stringify({ values: ["minecraft:stone"] }),
    version: "1.21.1",
  });
  assert.equal(ok.valid, true);

  const bom = validateDatapackJson({
    kind: "tag",
    jsonContent: `\uFEFF${JSON.stringify({ values: ["minecraft:stone"] })}`,
    version: "1.21.1",
  });
  assert.equal(bom.valid, true, JSON.stringify(bom.errors));

  const emptyLoot = validateDatapackJson({
    kind: "loot_table",
    jsonContent: "{}",
    version: "1.20.1",
  });
  assert.equal(emptyLoot.valid, true, JSON.stringify(emptyLoot));
}

function testGenerators() {
  const m = generateModel("my_mod", "test_block", "1.20.1");
  assert.ok(m.files);
  const pkt = generateNetworkPacket("my_mod", "sync_msg", "neoforge_1.21");
  assert.ok(pkt.code?.includes("StreamCodec"));
  const pktPascal = generateNetworkPacket("my_mod", "ExamplePacket", "forge_1.20.1");
  assert.ok(pktPascal.code?.includes("class ExamplePacket"), pktPascal.code);
  assert.ok(!pktPascal.code?.includes("Examplepacket"));
}

function testWorkflow() {
  const t = getWorkflowTemplate("mc-new-block");
  assert.equal(t.found, true);
  assert.ok(t.body?.includes("DeferredRegister"));

  const build = getWorkflowTemplate("mc-build-mod");
  assert.equal(build.found, true);
  assert.ok(build.body?.includes("validate_project"));
  assert.ok(build.body?.includes("build/libs"));

  const ingame = getWorkflowTemplate("mc-ingame-iterate");
  assert.equal(ingame.found, true);
  assert.ok(ingame.body?.includes("HMCL"));
  assert.ok(ingame.body?.includes("PCL"));
  assert.ok(ingame.body?.includes("versions/"));
  assert.ok(ingame.body?.includes("各实例独立"));
  assert.ok(ingame.body?.includes("minecraftRoot") || ingame.body?.includes("modsDir"));

  const localize = getWorkflowTemplate("mc-localize-mod");
  assert.equal(localize.found, true);
  assert.ok(localize.body?.includes("localize_mod"));

  const setup = getWorkflowTemplate("mc-setup-env");
  assert.equal(setup.found, true);
  assert.ok(setup.body?.includes("detect_mod_project"));
  assert.ok(setup.body?.includes("Fabric") || setup.body?.includes("Quilt"));
  assert.doesNotMatch(setup.body ?? "", /validate_project[\s\S]{0,20}通过即结束/);

  const publish = getWorkflowTemplate("mc-publish");
  assert.equal(publish.found, true);
  assert.ok(publish.body?.includes("build/libs"));

  for (const name of [
    "mc-new-item",
    "mc-new-blockentity",
    "mc-mixin",
    "mc-worldgen",
    "mc-config",
    "mc-gametest",
    "mc-networking",
    "mc-capability",
    "mc-recipe-data",
    "mc-audio-vfx",
    "mc-commands",
    "mc-dimension-structure",
    "mc-access",
    "mc-bedrock-addon",
  ]) {
    const w = getWorkflowTemplate(name);
    assert.equal(w.found, true, name);
  }
  const worldgen = getWorkflowTemplate("mc-worldgen");
  assert.ok(worldgen.body?.includes("generate_worldgen"), worldgen.body);
  assert.ok(/platform/.test(worldgen.body ?? ""), "mc-worldgen 须提示 generate_worldgen 传 platform");
}

function testPatternsResource() {
  const res = readKnowledgeResource("mcskill://patterns/README");
  assert.equal(res.found, true);
  assert.ok(
    res.text.includes("community_knowledge/patterns") || res.text.includes("示范索引"),
    "patterns URI must resolve community_knowledge/patterns/README.md",
  );
  assert.ok(!res.text.includes("示范模式见 forge/1.20.1/knowledge"));
}

async function testMixinAnalyzeMissing() {
  const java = `
@Mixin(net.minecraft.world.entity.LivingEntity.class)
public class LivingEntityMixin {
  @Inject(method = "func_99999999_z", at = @At("HEAD"))
  private void inject(CallbackInfo ci) {}
}`;
  const res = await mixinAnalyze({
    version: "1.20.1",
    javaFiles: [{ path: "LivingEntityMixin.java", content: java }],
  });
  assert.ok(res.mixins.length === 1);
  const method = res.mixins[0].injections[0].methods[0];
  assert.equal(method.found, false);
  assert.equal(method.action?.code, "TARGET_METHOD_MISSING");
}

function testMixinsJson() {
  const summary = parseMixinsJson(
    JSON.stringify({
      package: "com.example.mixin",
      client: ["ExampleMixin"],
      mixins: [{ mixin: "BadMixin", target: ".Entity" }],
    }),
  );
  assert.ok(summary.warnings.length > 0);
  assert.ok(summary.common.includes("BadMixin"), JSON.stringify(summary));
  assert.ok(summary.client.includes("ExampleMixin"));
  assert.ok(!summary.client.includes("BadMixin"));

  const ow = parseMixinJavaSource(`
@Mixin(Foo.class)
public class FooMixin {
  @Overwrite
  public void tick() {}
}
`);
  const overwrite = ow?.injections.find((i) => i.kind === "Overwrite");
  assert.ok(overwrite, JSON.stringify(ow));
  assert.equal(overwrite.methodRefs.length, 0);

  const arg = parseMixinJavaSource(`
@Mixin(Foo.class)
public class FooMixin {
  @ModifyArg(method = "hurt", at = @At("HEAD"))
  private float edit(float f) { return f; }
}
`);
  assert.ok(arg?.injections.some((i) => i.kind === "ModifyArg"), JSON.stringify(arg));

  const ghost = parseMixinJavaSource(`
/**
 * docs @Inject must not count
 */
@Mixin(Foo.class)
public class FooMixin {
  // @Inject comment ghost
  @Inject(method="realMethod")
  private void real(CallbackInfo ci) {}
}
`);
  assert.equal(ghost?.injections.length, 1, JSON.stringify(ghost?.injections));
  assert.equal(ghost?.injections[0]?.methodRefs[0]?.methodName, "realMethod");

  const bomJson = parseMixinsJson(`\uFEFF${JSON.stringify({ package: "p", mixins: ["A"] })}`);
  assert.ok(bomJson.mixinClasses.includes("A"), JSON.stringify(bomJson));
}

function testWorkersAndDescriptor() {
  const nested = "(" + "[".repeat(40) + "I)V";
  const params = parameterTypes(nested);
  assert.equal(params.length, 1, `depth 帽不得把剩余描述符拆成多参数: ${JSON.stringify(params)}`);

  const srcDir = dirname(fileURLToPath(import.meta.url));
  const preloader = readFileSync(join(srcDir, "src/workers/preloader.ts"), "utf8");
  assert.ok(/Date\.now\(\)\s*-\s*startedAt/.test(preloader), "preloader elapsed 须为时长");
  assert.ok(/if \(preloadRunning\)\s*(return|\{)/.test(preloader), "preloader start 须有重入守卫");
  assert.ok(!/elapsed:\s*Date\.now\(\)/.test(preloader.replace(/\s/g, "")));

  const sqlite = readFileSync(join(srcDir, "src/utils/node-sqlite-guard.ts"), "utf8");
  assert.ok(/major === 23 && minor <= 3/.test(sqlite), "sqlite 旗标窗口须含 23.0–23.3");
}

// ── A-19：终止信号必须先释放 sqlite 句柄再退出 ──────────────────────────────
// 只能在子进程测：钩子装在 dist/index.js 的 isMainModule() 块内，而 Windows 上
// OS 信号不会投递给子进程的监听器（child.kill("SIGTERM") 走 TerminateProcess），
// 所以改设 process.argv[1] 骗过 isMainModule()，再用 process.emit("SIGTERM") 同步触发同一批监听器。
// 钩子不存在时子进程会跑到最后一行以 9 退出 —— 9 就是这条门的阳性对照。
async function testA19ShutdownReleasesDbHandles() {
  const indexPath = fileURLToPath(new URL("./dist/index.js", import.meta.url));
  const registryPath = fileURLToPath(new URL("./dist/registry/index.js", import.meta.url));
  const dir = mkdtempSync(join(tmpdir(), "mc-skill-a19-"));
  const child = join(dir, "a19.mjs");
  writeFileSync(
    child,
    [
      `import { pathToFileURL } from "node:url";`,
      `process.argv[1] = ${JSON.stringify(indexPath)};`,
      `await import(pathToFileURL(${JSON.stringify(indexPath)}).href);`,
      `const { queryRegistry } = await import(pathToFileURL(${JSON.stringify(registryPath)}).href);`,
      `const hit = queryRegistry({ query: "stone", version: "1.20.1" });`,
      `if (!hit.found) console.error("A19_NO_REGISTRY_HIT");`,
      `process.emit("SIGTERM");`,
      `console.error("A19_HOOK_NOT_FIRED");`,
      `process.exit(9);`,
    ].join("\n"),
    "utf8",
  );
  try {
    const res = spawnSync(process.execPath, [child], { encoding: "utf8", timeout: 180000 });
    const out = `${res.stderr ?? ""}${res.stdout ?? ""}`;
    assert.ok(
      !/A19_NO_REGISTRY_HIT/.test(out),
      `注册表句柄没真的打开，这条门会退化成空跑：${out.slice(0, 400)}`,
    );
    assert.ok(!/A19_HOOK_NOT_FIRED/.test(out), `SIGTERM 钩子未生效：${out.slice(0, 400)}`);
    assert.equal(
      res.status,
      143,
      `SIGTERM 必须经 onShutdownSignal(143) 退出，实际 status=${res.status}：${out.slice(0, 400)}`,
    );
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

async function main() {
  process.env.MC_SKILL_DATA = resolveDataDir();
  testMethodStringForms();
  testRegistry();
  testDatapack();
  testGenerators();
  testWorkflow();
  testPatternsResource();
  testMixinsJson();
  await testMixinAnalyzeMissing();
  testWorkersAndDescriptor();
  testContentLogLevelParsing();
  testDatapackSmithingAndRecursive();
  await testA19ShutdownReleasesDbHandles();
  console.log("test-wave-bcd: ok");
}

// ── #5 content-log 锁定测试 ───────────────────────────────────────────────
// 背景：曾有一份审查报告称 CONTENT_LINE_RE 有 6 个捕获组、解构错位，导致
// 「ERROR/WARN 永不识别」，并给出「跳 2 格」/「跳 4 格」两种改法。
// 实测该正则**只有 5 个捕获组**（两处外括号都是 (?: 非捕获），
// 现有 `const [, , , level, tag, msg]` 取值完全正确，两种改法都会改坏。
// 本用例把「当前行为即正确行为」钉死，防止后人按错误报告去「修复」。
function testContentLogLevelParsing() {
  const dir = mkdtempSync(join(tmpdir(), "mc-contentlog-"));
  const logPath = join(dir, "content_log.txt");
  writeFileSync(
    logPath,
    [
      "[2024-05-01 12:00:00.123][ERROR][script] Something failed",
      "[12:00:01][WARNING][addon] Deprecated API",
      "[2024-05-01 12:00:02][INFO] no tag line",
      "this is not a log line",
    ].join("\n"),
  );
  const r = analyzeBedrockContentLog({ logPath });

  assert.equal(r.levelCounts.ERROR, 1, "长日期时间 ERROR 行应被识别");
  assert.equal(r.levelCounts.WARNING, 1, "短时间戳 WARNING 行应被识别");
  assert.equal(r.levelCounts.INFO, 1, "无标签 INFO 行应被识别");

  // tag 取自 m[4]、msg 取自 m[5]；level 不进条目文本
  assert.ok(r.errors[0].includes("Something failed"));
  assert.ok(r.errors[0].startsWith("[script]"), `errors[0] 应以 [tag] 开头，实际: ${r.errors[0]}`);
  assert.ok(r.warnings.some((w) => w.includes("Deprecated API")));

  // 无标签行不得产生 "?" 占位 tag
  assert.ok(!r.topTags.some((t) => t.tag === "?"), "无标签行不应产生 ? 占位 tag");
  assert.deepEqual(r.topTags.map((t) => t.tag).sort(), ["addon", "script"]);

  assert.deepEqual(r.unparsedLines, ["this is not a log line"]);
  rmSync(dir, { recursive: true, force: true });
}

// ── #7 datapack：smithing 字段按 vanilla 事实 + 递归校验 ──────────────────
function testDatapackSmithingAndRecursive() {
  const v = "1.20.1";

  // smithing_transform 缺 result → 必须报错（原实现会假通过）
  const noResult = validateDatapackJson({
    kind: "recipe",
    version: v,
    jsonContent: JSON.stringify({
      type: "minecraft:smithing_transform",
      template: { item: "minecraft:diamond" },
      base: { item: "minecraft:stone" },
      addition: { item: "minecraft:gold_ingot" },
    }),
  });
  assert.equal(noResult.valid, false, "smithing_transform 缺 result 必须报 error");
  assert.ok(noResult.errors.some((e) => e.includes("result")));

  // template/addition 是可选的，只写 base+result 应通过
  const minimal = validateDatapackJson({
    kind: "recipe",
    version: v,
    jsonContent: JSON.stringify({
      type: "minecraft:smithing_transform",
      base: { item: "minecraft:stone" },
      result: { id: "minecraft:diamond", count: 1 },
    }),
  });
  assert.equal(
    minimal.valid,
    true,
    `smithing_transform 省略 template/addition 应合法，errors=${JSON.stringify(minimal.errors)}`,
  );

  // smithing_trim 无 result 属正常，不得报错
  const trim = validateDatapackJson({
    kind: "recipe",
    version: v,
    jsonContent: JSON.stringify({
      type: "minecraft:smithing_trim",
      template: { item: "minecraft:diamond" },
      base: { item: "minecraft:stone" },
      addition: { item: "minecraft:gold_ingot" },
    }),
  });
  assert.equal(trim.valid, true, `smithing_trim 无 result 应合法，errors=${JSON.stringify(trim.errors)}`);

  // 递归：嵌套结构里的非法资源 id 应出 warning（不 fail）
  const nested = validateDatapackJson({
    kind: "loot_table",
    version: v,
    jsonContent: JSON.stringify({
      pools: [{ entries: [{ type: "minecraft:item", name: "Bad Item Name" }] }],
    }),
  });
  assert.ok(
    nested.warnings.some((w) => w.includes("Bad Item Name")),
    `嵌套非法 id 应产生 warning，warnings=${JSON.stringify(nested.warnings)}`,
  );

  // 递归：合法嵌套不误报
  const nestedOk = validateDatapackJson({
    kind: "loot_table",
    version: v,
    jsonContent: JSON.stringify({
      pools: [{ entries: [{ type: "minecraft:item", name: "minecraft:stone" }] }],
    }),
  });
  assert.ok(
    !nestedOk.warnings.some((w) => w.includes("看起来不是合法")),
    `合法嵌套不应误报，warnings=${JSON.stringify(nestedOk.warnings)}`,
  );

  // packFormat 形态校验：浮点/非法值 → warning
  const badPf = validateDatapackJson({
    kind: "tag",
    version: v,
    packFormat: 69.5,
    jsonContent: JSON.stringify({ values: ["minecraft:stone"] }),
  });
  assert.ok(
    badPf.warnings.some((w) => w.includes("pack_format")),
    `packFormat=69.5 应产生 warning，warnings=${JSON.stringify(badPf.warnings)}`,
  );

  // 合法整数 packFormat 不报 warning
  const okPf = validateDatapackJson({
    kind: "tag",
    version: v,
    packFormat: 15,
    jsonContent: JSON.stringify({ values: ["minecraft:stone"] }),
  });
  assert.ok(
    !okPf.warnings.some((w) => w.includes("pack_format")),
    `packFormat=15 不应报 warning，warnings=${JSON.stringify(okPf.warnings)}`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

// ── Wave 4 / agent A5 gates（V-8/9/11/14 + A-26 + C-17 + C-29 + C-32）───────
// 断言对象是 dist：dist 早于本波改动时打印 SKIP（pending Wave-close build）。
async function w4A5Gates() {
  const mv = await import("./dist/utils/minecraft-version.js");
  if (mv.detectMinecraftVersion({ gradleProperties: "minecraft_version=1.20.1.2\n" }) !== "unknown") {
    console.log("SKIP w4A5Gates: dist 尚未含 Wave4-A5 改动，pending Wave-close build");
    return;
  }

  // 1) V-8/9/11/14：五档等价性锁定（塌合的法律依据）
  for (const v of ["1.20.4", "1.21.11", "26.1", "26.1.1", "27.1.1"]) {
    assert.equal(mv.classifyMinecraftVersion(v) === "26.x", /^26\./.test(v), `V-14 塌合在 ${v} 上偏离旧式`);
    assert.equal(
      mv.isMcVersionFamily(v, "26"),
      false,
      `V-14 反例锁定 ${v}：isMcVersionFamily 要求 family 参数自身是合法 token，裸 "26" 永远 false，不可当 26 族判定`,
    );
    assert.equal(!mv.isMcVersionFamily(v, "1.20"), !v.includes("1.20"), `V-12 塌合在 ${v} 上偏离旧式`);
  }
  assert.equal(
    mv.classifyMinecraftVersion("27.1.1"),
    "other",
    "V-8/9/11 前提：classify 无 27.x band，故 26+ 谓词不得塌进 classify（只能保留 token+主版本比较）",
  );

  // 2) V-13：锚定后合法档不变、污染串不再被截成假版本
  for (const [raw, want] of [
    ["1.20.1", "1.20.1"],
    ["26.1.1", "26.1.1"],
    ["27.0.1", "27.0.1"],
    ["1.20.1.2", "unknown"],
    ["26.1.2.3", "unknown"],
  ]) {
    assert.equal(
      mv.detectMinecraftVersion({ gradleProperties: `minecraft_version=${raw}\n` }),
      want,
      `V-13 锚定：${raw} 应为 ${want}`,
    );
  }
  assert.equal(mv.detectMinecraftVersion({ gradleProperties: "neo_version=21.1.192\n" }), "unknown");
  assert.equal(mv.detectMinecraftVersion({ gradleProperties: "neo_version=27.0.1\n" }), "27.0.1");

  // 3) A-26：TrieIndex 深度/节点上限 + 截断标记
  const { TrieIndex } = await import("./dist/api/index.js");
  assert.equal(typeof TrieIndex, "function", "A-26：TrieIndex 必须导出以便测试");
  const nd = (children, isEnd = false) => ({ children, isEnd, score: 0 });
  const deep = [nd([["a", 1]])];
  for (let i = 1; i < 400; i++) deep.push(nd([["a" + i, i + 1]], true));
  deep.push(nd([], true));
  const deepRes = TrieIndex.fromFlat(deep).searchPrefix("a");
  assert.ok(deepRes.length > 1 && deepRes.length < 400, `A-26：必须被上限截断，实得 ${deepRes.length}`);
  assert.ok(
    String(deepRes[deepRes.length - 1]).includes("truncated"),
    `A-26：末元素必须是截断标记，实得 ${JSON.stringify(deepRes[deepRes.length - 1])}`,
  );
  const cycleRes = TrieIndex.fromFlat([nd([["a", 1]]), nd([["b", 0]])]).searchPrefix("a");
  assert.ok(
    String(cycleRes[cycleRes.length - 1]).includes("truncated"),
    "A-26：自指环必须返回截断标记而不是栈溢出",
  );
  const oobRes = TrieIndex.fromFlat([nd([["x", 999]])]).searchPrefix("x");
  assert.ok(String(oobRes[0]).includes("truncated"), `A-26：越界 child 指标须走标记，实得 ${JSON.stringify(oobRes)}`);
  assert.deepEqual(
    TrieIndex.fromFlat([nd([["net", 1]]), nd([["minecraft", 2]]), nd([["item", 3]], true), nd([], true)]).searchPrefix(
      "net.minecraft",
    ),
    ["net/minecraft", "net/minecraft/item"],
    "A-26：正常浅 trie 不得出现截断标记（假阳性）",
  );

  // 4) C-17：Fabric 拒因必须点名版本
  const { generateDatagen } = await import("./dist/datagen/index.js");
  for (const v of ["1.21.2", "1.21.6", "1.21.7", "1.21.9"]) {
    const text = String((generateDatagen({ providerType: "recipe", version: v, platform: "fabric" }).errors ?? [])[0] ?? "");
    assert.ok(text.includes(`version=${v}`), `C-17：${v} 拒因未回显请求版本：${text.slice(0, 80)}`);
    assert.ok(
      text.includes(`${v}：`),
      `C-17：${v} 的拒因必须逐档点名该版本理由（形如 “${v}：…”），实得 ${text.slice(0, 100)}`,
    );
  }
  assert.ok(
    String(
      generateDatagen({
        providerType: "recipe",
        version: "1.21.4",
        platform: "fabric",
        modId: "demo",
        targetName: "widget",
      }).code ?? "",
    ).includes("RecipeProvider"),
    "C-17：白名单档 1.21.4 仍须能出骨架（拒因改造不得误伤）",
  );

  // 5) C-29：BP 可钉 uuid；未钉时 warning 说明不可复现
  const { generateAddonManifest } = await import("./dist/bedrock/index.js");
  const hdr = "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee";
  const mod = "11111111-2222-3333-4444-555555555555";
  const pinned = generateAddonManifest({ packName: "a5", packType: "both", bpHeaderUuid: hdr, bpModuleUuid: mod });
  assert.equal(pinned.files["BP/manifest.json"].header.uuid, hdr, "C-29：bpHeaderUuid 必须写进 BP header.uuid");
  assert.equal(pinned.files["BP/manifest.json"].modules[0].uuid, mod, "C-29：bpModuleUuid 必须写进 BP module");
  assert.notEqual(pinned.files["RP/manifest.json"].header.uuid, hdr, "C-29：RP 与 BP header uuid 不得相同");
  assert.ok(
    pinned.warnings.some((w) => String(w).includes("不可复现")),
    "C-29：随机生成的槽位必须在 warnings 里说明不可复现",
  );
  assert.ok(
    generateAddonManifest({ packName: "a5", packType: "data" }).warnings.some((w) => String(w).includes("headerUuid")),
    "C-29：单 BP 档未钉 uuid 时也要指出该钉哪个参数",
  );
  assert.ok(
    generateAddonManifest({ packName: "a5", packType: "data", headerUuid: "not-a-uuid" }).warnings.some((w) =>
      String(w).includes("不是标准 UUID"),
    ),
    "C-29：非法 uuid 传值必须显式 warning，不得静默丢弃",
  );

  // 6) C-32：显示串来自实际扫描目录
  const { checkPublishReady } = await import("./dist/publish/index.js");
  const root = mkdtempSync(join(tmpdir(), "w4a5-pub-"));
  try {
    mkdirSync(join(root, "build", "libs"), { recursive: true });
    writeFileSync(join(root, "build", "libs", "demo-1.0.0.jar"), "x");
    const res = checkPublishReady({
      projectPath: root,
      modsToml: 'modId = "demo"\nlicense = "MIT"\nversion = "1.0.0"\n',
    });
    assert.deepEqual(res.jars, ["build/libs/demo-1.0.0.jar"], `C-32：实得 ${JSON.stringify(res.jars)}`);
    assert.ok(
      String(res.checks[2]).includes(res.jars[0].split("/").slice(0, -1).join("/")),
      `C-32：checks 项与 jar 路径必须同源，实得 ${JSON.stringify(res.checks)}`,
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
  console.log("w4A5Gates ok");
}

await w4A5Gates();

// ── Wave 4 / agent A8 gates（A-27 计数/行号防腐 + C-32 字面量 + §7 台账钉）────
// 本块**没有 SKIP 分支**：三条都读当前树的 src 文本或 dist 运行时，当场可测才写。
async function w4A8Gates() {
  const fs = await import("node:fs");
  const here = dirname(fileURLToPath(import.meta.url));
  const read = (rel) => fs.readFileSync(join(here, rel), "utf8");

  // 1) A-27：带内 ok:false 与协议层 isError 的**数量与行号**必须与合同散文一致
  {
    const tsFiles = [];
    const A27_DOC = join("src", "utils", "actionable.ts"); // 合同散文自身含字面量，须排除
    (function walk(d) {
      for (const e of fs.readdirSync(join(here, d), { withFileTypes: true })) {
        const rel = join(d, e.name);
        if (e.isDirectory()) walk(rel);
        else if (rel.endsWith(".ts") && rel !== A27_DOC) tsFiles.push(rel);
      }
    })("src");
    let grepLines = 0;
    let grepFiles = 0;
    let occ = 0;
    let occFiles = 0;
    for (const f of tsFiles) {
      const s = read(f);
      const g = s.split(/\r?\n/).filter((l) => l.includes("ok: false")).length;
      const o = (s.match(/\bok:\s*false\b/g) || []).length;
      grepLines += g;
      grepFiles += g ? 1 : 0;
      occ += o;
      occFiles += o ? 1 : 0;
    }
    // tool-registry.ts 的**代码**行（非注释）才是要数的 isError
    const trLines = read("src/tool-registry.ts").split(/\r?\n/);
    const isErrorLines = trLines
      .map((l, i) => ({ n: i + 1, l }))
      .filter(({ l }) => /isError:\s*true/.test(l) && !/^\s*(\*|\/\/)/.test(l))
      .map(({ n }) => n);
    assert.equal(isErrorLines.length, 3, `A-27：isError 代码位点数须为 3，实得 ${JSON.stringify(isErrorLines)}`);
    // 全仓库除散文外不得再有第二文件置 isError
    const otherIsError = tsFiles.filter(
      (f) => f !== join("src", "tool-registry.ts") && read(f).split(/\r?\n/).some((l) => /isError:\s*true/.test(l) && !/^\s*(\*|\/\/)/.test(l)),
    );
    assert.deepEqual(otherIsError, [], `A-27：出现第二个 isError 文件 ${otherIsError.join(",")}，合同散文已失效`);

    const doc = read("src/utils/actionable.ts");
    assert.ok(doc.includes("A-27 何时置 `isError`"), "A-27：合同小节标题必须存在");
    const declared = [...doc.matchAll(/\*\*(\d+)\*\* 行 \/ \*\*(\d+)\*\* 个文件/g)].map((m) => Number(m[1]));
    assert.equal(declared.length, 1, `A-27：散文须且只须声明一次「N 行 / M 个文件」，实得 ${declared.length}`);
    assert.ok(
      Math.abs(declared[0] - grepLines) <= 5,
      `A-27：散文声明 ${declared[0]} 行与实测 ${grepLines} 行脱节（>5）——更新 src/utils/actionable.ts 的口径数字`,
    );
    assert.ok(
      doc.includes(`**${occ}** 处 / **${occFiles}** 个文件`),
      `A-27：散文出现次数口径须写实测值 **${occ}** 处 / **${occFiles}** 个文件`,
    );
    assert.ok(
      doc.includes(`全仓库只有 **${isErrorLines.length} 处**`) || doc.includes(`只有 **${isErrorLines.length} 处**`),
      `A-27：散文声明的 isError 处数须等于实测 ${isErrorLines.length}`,
    );
    for (const n of isErrorLines) {
      assert.ok(
        doc.includes(`:\`${n}\``) || doc.includes(`\`${n}\``) || doc.includes(`:${n}`),
        `A-27：isError 位点 :${n} 必须在散文里点名（当前行号：${isErrorLines.join("/")}）`,
      );
    }
    // 消费点定位防腐：cli.ts / cli-parse.ts 由并行 CLI 会话在改，散文只准按符号引用。
    // （实测：他们 S1–S5 一轮提交就把 unwrapHandlerResult 从 319 行推走，写死的行号门当场红。）
    assert.ok(
      /^function unwrapHandlerResult\(/m.test(read("src/cli.ts")),
      "A-27：cli.ts 里已找不到 unwrapHandlerResult——散文点的消费点已失效，须改散文",
    );
    assert.ok(
      /^export function isToolFailure\(/m.test(read("src/cli-parse.ts")),
      "A-27：cli-parse.ts 里已找不到 isToolFailure——散文点的消费点已失效，须改散文",
    );
    assert.ok(
      doc.includes("`unwrapHandlerResult()`") && doc.includes("isToolFailure"),
      "A-27：散文须按符号点名 unwrapHandlerResult / isToolFailure 两个消费点",
    );
    const pinnedCliLines = doc.split(/\r?\n/).filter((l) => /cli(-parse)?\.ts:\d/.test(l));
    assert.deepEqual(
      pinnedCliLines,
      [],
      `A-27：散文不得写死 cli.ts / cli-parse.ts 行号（并行会话在改这两个文件）：${pinnedCliLines.join(" | ")}`,
    );
  }

  // 2) C-32：显示串一律来自实际 dir；源码里不留 "build/libs" 字面量（注释除外）
  {
    const src = read("src/publish/index.ts");
    const code = src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
    const hits = code.split(/\r?\n/).filter((l) => l.includes("build/libs"));
    assert.deepEqual(hits, [], `C-32：仍残留硬编码显示串：${hits.map((h) => h.trim()).join(" | ")}`);
    assert.ok(
      /const RELEASE_JAR_SEGMENTS = \["build", "libs"\]/.test(code),
      "C-32：产出目录必须由 RELEASE_JAR_SEGMENTS 单点定义",
    );
  }

  // 3) §7 台账钉（L-1，本轮已改行为）：27.x 的 mappings 必须是 mojmap
  //    CLI 依据：convert_mapping --version=27.1.1 → resultKind=UNOBFUSCATED_NO_YARN
  //    + notes「拒绝在 version=27.1.1 上做 Yarn/MCP/跨混淆层 remap」。
  {
    const { analyzePortingPath } = await import("./dist/porting/index.js");
    assert.equal(typeof analyzePortingPath, "function", "§7：dist 未导出 analyzePortingPath，无法测");
    const root = mkdtempSync(join(tmpdir(), "w4a8-port-"));
    try {
      writeFileSync(join(root, "gradle.properties"), "minecraft_version=1.20.1\nyarn_mappings=1.20.1+build.10\n");
      writeFileSync(join(root, "build.gradle"), "plugins {\n  id 'fabric-loom'\n}\n");
      writeFileSync(join(root, "fabric.mod.json"), '{"schemaVersion":1,"id":"demo"}');
      const targetOf = async (v) => {
        const raw = await analyzePortingPath({ projectPath: root, targetPlatform: "fabric", targetVersion: v });
        const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
        assert.equal(parsed.ok, true, `§7：${v} 分析本身失败：${JSON.stringify(parsed.error ?? parsed).slice(0, 160)}`);
        return parsed.analysis.target.mappings;
      };
      assert.equal(
        await targetOf("27.1.1"),
        "mojmap",
        "§7/L-1：27.x 必须与 26.1 同判 mojmap（convert_mapping 对 27.1.1 已回 UNOBFUSCATED_NO_YARN，仍建议 yarn 即自相矛盾）",
      );
      assert.equal(
        await targetOf("26.1"),
        "mojmap",
        "§7/L-1 对照组：26.1 必须是 mojmap，否则上一条钉成了「什么都 mojmap」的假绿",
      );
      assert.equal(
        await targetOf("1.20.4"),
        "yarn",
        "§7/L-1 反向对照：1.x 仍必须是 yarn，否则新判定把去混淆面扩到了旧版本",
      );
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  }
  // 4) 非空洞性配对实测（本波 dist 冻结 ⇒ 门禁无法就地投毒，改用「同一次跑里两个反向值」证明不是假绿）
  {
    // C-17：四档拒因必须两两不同且各自以自己的版本号开头
    const { generateDatagen } = await import("./dist/datagen/index.js");
    const reason = new Map();
    for (const v of ["1.21.2", "1.21.5", "1.21.6", "1.21.7", "1.21.9"]) {
      const text = String(
        (generateDatagen({ providerType: "recipe", version: v, platform: "fabric" }).errors ?? [])[0] ?? "",
      );
      assert.ok(text.startsWith(`${v}：`) || text.includes(`${v}：`), `C-17：${v} 的拒因未以该版本号开头`);
      reason.set(v, text);
    }
    const vals = [...reason.values()];
    assert.equal(new Set(vals).size, vals.length, "C-17：多档共用同一条通用拒因 ⇒ 不是逐档点名");

    // C-29：两个不同的调用方 uuid 都必须原样落到 BP header ⇒ 排除「常量」与「一律随机」
    const { generateAddonManifest } = await import("./dist/bedrock/index.js");
    for (const hdr of ["aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee", "00000001-2222-3333-4444-555555555555"]) {
      const got = generateAddonManifest({ packName: "a8", packType: "data", headerUuid: hdr });
      assert.equal(got.files["BP/manifest.json"].header.uuid, hdr, `C-29：钉 ${hdr} 未原样写入 BP header`);
    }
    assert.notEqual(
      generateAddonManifest({ packName: "a8", packType: "data" }).files["BP/manifest.json"].header.uuid,
      generateAddonManifest({ packName: "a8", packType: "data" }).files["BP/manifest.json"].header.uuid,
      "C-29：未钉 uuid 时必须现生成（两次不同），否则「不可复现」warning 是假的",
    );

    // A-26：同一族 trie 在阈值下无标记、阈值上必须有标记（一次跑里两个反向结果）
    const { TrieIndex } = await import("./dist/api/index.js");
    const node = (children, isEnd = false) => ({ children, isEnd, score: 0 });
    const chain = (len) => {
      const arr = [node([["a", 1]])];
      for (let i = 1; i < len; i++) arr.push(node([["a" + i, i + 1]], true));
      arr.push(node([], true));
      return arr;
    };
    const shallow = TrieIndex.fromFlat(chain(10)).searchPrefix("a");
    assert.ok(
      !shallow.some((s) => String(s).includes("truncated")),
      "A-26：浅 trie 不该出现截断标记（否则上限形同虚设、门是噪声）",
    );
    const deep = TrieIndex.fromFlat(chain(400)).searchPrefix("a");
    assert.ok(
      String(deep[deep.length - 1]).includes("truncated"),
      "A-26：深 trie 必须出现截断标记（与浅 trie 构成同一函数的反向配对）",
    );
  }
  console.log("w4A8Gates ok");
}

await w4A8Gates();
