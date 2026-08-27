import assert from "node:assert/strict";
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
  assert.ok(/if \(preloadRunning\) return/.test(preloader), "preloader start 须有重入守卫");
  assert.ok(!/elapsed:\s*Date\.now\(\)/.test(preloader.replace(/\s/g, "")));

  const sqlite = readFileSync(join(srcDir, "src/utils/node-sqlite-guard.ts"), "utf8");
  assert.ok(/major === 23 && minor <= 3/.test(sqlite), "sqlite 旗标窗口须含 23.0–23.3");
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
  console.log("test-wave-bcd: ok");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
