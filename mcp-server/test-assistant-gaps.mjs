/**
 * 契约：VERSION_REQUIRED、get_version_info 仅 Forge、Architectury PICK_PLATFORM、
 * worldgen platform、topic 别名、Neo 主档 Skill 必须含 search_neoforge_docs、
 * generate_* 的 suggestedPath 由代码里的 package/类名推导 + 写盘双守卫。
 */
import assert from "node:assert/strict";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repo = join(dirname(fileURLToPath(import.meta.url)), "..");

const { detectMinecraftVersion } = await import("./dist/utils/minecraft-version.js");
const { queryApi } = await import("./dist/api/index.js");
const { analyzeCrash } = await import("./dist/crash/index.js");
const { getVersionInfo } = await import("./dist/version/index.js");
const { resolveTopicIds, sessionPlatformPack } = await import("./dist/platform-pack/session.js");
const { detectModProject } = await import("./dist/platform-pack/detect.js");
const { listSameSeriesCandidates } = await import("./dist/platform-pack/catalog.js");
const { generateWorldgen, generateNetworkPacket, generateConfig, generateEntityRenderer } = await import(
  "./dist/generators/index.js"
);
const { suggestPathsForGenerator, maybeWriteGeneratorResult } = await import(
  "./dist/generators/write-helper.js"
);
const { resolveWriteAllowRoot, nativeReal } = await import("./dist/utils/project-sandbox.js");
const { generateDatagen } = await import("./dist/datagen/index.js");
const { getWorkflowTemplate, readKnowledgeResource, WORKFLOW_TEMPLATES } = await import(
  "./dist/prompts/index.js"
);
const { getWorkflowTemplateSchema } = await import("./dist/wave/register.js");

const NEO_MAIN = ["1.20.4", "1.21.1", "1.21.3", "1.21.8", "1.21.11", "26.1"];
const NEO_NEW_SKILLS = [
  "mc-entity",
  "mc-datagen",
  "mc-capability",
  "mc-particle",
  "mc-ai",
  "mc-energy",
  "mc-multiblock",
  "mc-villager",
  "mc-weather",
  "mc-compat-jei",
];
const NEW_WORKFLOWS = [
  "mc-networking",
  "mc-capability",
  "mc-recipe-data",
  "mc-audio-vfx",
  "mc-commands",
  "mc-dimension-structure",
  "mc-access",
  "mc-bedrock-addon",
  "mc-fluid",
  "mc-enchant-potion",
  "mc-energy",
  "mc-creative-tags",
  "mc-kotlin",
  "mc-jei",
  "mc-ci-publish-extra",
  "mc-villager",
  "mc-multiblock",
  "mc-ai",
];

function skillPath(ver, name) {
  const cursor = join(repo, "neoforge", ver, ".cursor", "skills", name, "SKILL.md");
  const agents = join(repo, "neoforge", ver, ".agents", "skills", name, "SKILL.md");
  if (existsSync(cursor)) return cursor;
  if (existsSync(agents)) return agents;
  return null;
}

{
  assert.equal(detectMinecraftVersion({ gradleProperties: "mod_minecraft_version=1.21.8\n" }), "1.21.8");
  assert.equal(detectMinecraftVersion({ gradleProperties: "mcVersion=1.20.4\n" }), "1.20.4");
  assert.equal(detectMinecraftVersion({ gradleProperties: "modMinecraftVersion=1.21.3\n" }), "1.21.3");
  assert.equal(detectMinecraftVersion({ gradleProperties: "neo_version=21.1.192\n" }), "unknown");
  assert.equal(detectMinecraftVersion({ gradleProperties: "neo_version=1.21.1\n" }), "1.21.1");
  console.log("minecraft-version keys: ok");
}

{
  const api = await queryApi({ className: "net.minecraft.world.entity.LivingEntity" });
  assert.equal(api.found, false);
  assert.equal(api.action?.code, "VERSION_REQUIRED");
  assert.match(String(api.action?.message ?? ""), /禁止默认 1\.20\.1/);

  const crash = analyzeCrash({
    crashReport: "---- Minecraft Crash Report ----\njava.lang.IllegalStateException\n",
  });
  assert.equal(crash.action?.code, "VERSION_REQUIRED");
  assert.notEqual(crash.crashKind, "fml");
  console.log("VERSION_REQUIRED: ok");
}

{
  // A-4：多项式 ReDoS 回归——旧正则对这类输入要分钟级，新正则必须毫秒~秒级完成。
  // 工具输入硬上限 512KB，fixture 各自贴近上限以覆盖最坏回溯面。
  const cases = [
    ["mixin-pattern", "error failed apply ".repeat(26_000)], // ≈494KB
    ["version-pattern", "requires [".repeat(50_000)], // ≈500KB
    ["missing-mod-pattern", "ModLoadingException " + "x".repeat(12_000) + " missing"],
  ];
  for (const [name, chunk] of cases) {
    const report =
      "---- Minecraft Crash Report ----\n" + chunk + "\njava.lang.IllegalStateException\n";
    assert.ok(report.length <= 512_000, `${name} fixture too large: ${report.length}`);
    const t0 = Date.now();
    const r = analyzeCrash({ crashReport: report, version: "1.20.1" });
    const elapsed = Date.now() - t0;
    assert.ok(r && typeof r === "object", "analyzeCrash must return");
    assert.ok(elapsed < 5_000, `ReDoS guard (${name}): took ${elapsed}ms (must be < 5000ms)`);
    console.log(`crash ReDoS guard ${name}: ok (${elapsed}ms for ${report.length}B)`);
  }
}

{
  const communityTxt = join(repo, "temp", "社区错误报告", "crash-2026-07-22_22.35.48-client.txt");
  let seed =
    "---- Minecraft Crash Report ----\nDescription: Initializing game\njava.lang.NoClassDefFoundError: com/mojang/text2speech/Narrator\n";
  if (existsSync(communityTxt)) {
    seed = readFileSync(communityTxt, "utf8");
  }
  const chunk = (seed.match(/FML:[\s\S]{0,2000}/) ?? [seed.slice(0, 2000)])[0];
  let report = seed;
  while (Buffer.byteLength(report, "utf8") < 500_000) {
    report += "\n" + chunk;
  }
  assert.ok(Buffer.byteLength(report, "utf8") < 512_000);
  const t0 = Date.now();
  const r = analyzeCrash({ crashReport: report, version: "1.12.2" });
  const elapsed = Date.now() - t0;
  assert.equal(r.ok, true);
  assert.ok(elapsed < 5_000, `合法大日志耗时 ${elapsed}ms`);
  assert.notEqual(r.probableCause, "缺少强制依赖（前置模组未安装或不在 mods 目录）");
  console.log(`crash legitimate 500KB: ok (${elapsed}ms, ${Buffer.byteLength(report)}B)`);
}

{
  const fab = await getVersionInfo({ version: "1.20.1", action: "register", platform: "fabric" });
  assert.equal(fab.ok, false);
  assert.equal(fab.action?.code, "WRONG_TOOL");
  assert.match(fab.recommendation, /仅 Forge/);
  assert.doesNotMatch(fab.recommendation, /DeferredRegister/);

  const missing = await getVersionInfo({ version: "1.20.1", action: "register" });
  assert.equal(missing.ok, false);
  assert.equal(missing.action?.code, "WRONG_TOOL");

  const forge = await getVersionInfo({ version: "1.20.1", action: "register", platform: "forge" });
  assert.notEqual(forge.ok, false);
  assert.ok(/DeferredRegister/i.test(forge.recommendation));
  console.log("get_version_info platform: ok");
}

{
  const block = resolveTopicIds(["block"]);
  assert.deepEqual(block.ids, ["00", "01", "02", "09"]);
  assert.equal(block.warnings.length, 0);
  const skip = resolveTopicIds(["not-a-topic"]);
  assert.deepEqual(skip.ids, ["00", "01", "09"]);
  assert.ok(skip.warnings.length > 0);
  console.log("topicIds alias: ok");
}

{
  const fab = generateWorldgen("demo", "ore_blob", "fabric", "1.21.1");
  const keys = Object.keys(fab.files ?? {});
  assert.ok(keys.some((k) => k.includes("configured_feature")));
  assert.ok(!keys.some((k) => /forge\/biome_modifier/.test(k)), keys.join(","));
  const neo = generateWorldgen("demo", "ore_blob", "neoforge", "1.21.1");
  assert.ok(Object.keys(neo.files ?? {}).some((k) => k.includes("neoforge/biome_modifier")));
  const old = generateWorldgen("demo", "ore_blob", "forge", "1.12.2");
  assert.equal(old.code, null);
  assert.ok((old.errors ?? []).some((e) => /1\.18\.2/.test(e)), JSON.stringify(old.errors));
  const junk = generateWorldgen("demo", "ore_blob", "forge", "1.20.4beta");
  assert.equal(junk.code, null);
  console.log("generate_worldgen fabric: ok");
}

{
  const dg = generateDatagen({
    providerType: "recipe",
    modId: "demo",
    targetName: "x",
    platform: "forge",
    version: "1.12.2",
  });
  const err = (dg.errors ?? []).join("\n");
  assert.equal(dg.code, null);
  assert.match(err, /该版本无原生生成器，不要理解为游戏里做不了/);
  assert.match(err, /search_forge_docs/);
  assert.match(err, /07-datagen|mc-datagen/);

  const pkt = generateNetworkPacket("demo", "sync", undefined);
  const pktErr = (pkt.errors ?? []).join("\n");
  assert.match(pktErr, /search_/);
  assert.match(pktErr, /06|mc-networking/);
  console.log("generator fallback error: ok");
}

{
  const vc = readKnowledgeResource("mcskill://version-changes/1.21");
  assert.ok(!/禁止回退 1\.20\.x\.md/.test(vc.text) || vc.found === false || /1\.21/.test(vc.text));
  if (vc.found) {
    assert.match(vc.text, /1\.21/);
    assert.doesNotMatch(vc.text, /^# .*1\.20\.x 版本变更/m);
  }
  console.log(`version-changes/1.21 found=${vc.found}`);
}

{
  for (const name of NEW_WORKFLOWS) {
    assert.ok(name in WORKFLOW_TEMPLATES, name);
    assert.equal(getWorkflowTemplate(name).found, true, name);
  }
  const enumVals = getWorkflowTemplateSchema.shape.name.options;
  for (const name of NEW_WORKFLOWS) {
    assert.ok(enumVals.includes(name), `schema enum missing ${name}`);
  }
  console.log("workflows enum: ok");
}

{
  const s = sessionPlatformPack({ platform: "neoforge", minecraftVersion: "1.21.1" });
  assert.equal(s.ok, true, JSON.stringify(s).slice(0, 400));
  const names = (s.skills ?? []).map((x) => x.name);
  assert.ok(names.includes("mc-entity"), `skills=${names.join(",")}`);
  console.log("session neo 1.21.1 mc-entity: ok");
}

{
  const cands = listSameSeriesCandidates("neoforge", "1.21");
  assert.ok(cands.includes("1.21.1"), JSON.stringify(cands));
  assert.ok(!cands.includes("1.21"), "1.21 本身不是已建档精确包");
  const root = mkdtempSync(join(tmpdir(), "mc-neo-121-"));
  try {
    mkdirSync(join(root, "src", "main", "resources", "META-INF"), { recursive: true });
    writeFileSync(join(root, "gradle.properties"), "minecraft_version=1.21\n", "utf8");
    writeFileSync(
      join(root, "build.gradle"),
      "plugins { id 'net.neoforged.gradle.userdev' version '7.0.0' }\n",
      "utf8",
    );
    writeFileSync(
      join(root, "src", "main", "resources", "META-INF", "neoforge.mods.toml"),
      'modLoader="javafml"\nloaderVersion="[4,)"\n[[mods]]\nmodId="demo"\n',
      "utf8",
    );
    const d = detectModProject({ projectPath: root });
    assert.equal(d.minecraftVersion, "1.21");
    assert.equal(d.packFound, false);
    assert.equal(d.action?.code, "PACK_NOT_FOUND");
    assert.ok((d.candidates ?? []).includes("1.21.1"), JSON.stringify(d.candidates));
    assert.notEqual(d.knowledgeVersion, "1.21.1");
    assert.ok((d.warnings ?? []).some((w) => /不要把 1\.21 当成 1\.21\.1/.test(w)), JSON.stringify(d.warnings));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
  console.log("1.21 no-patch PACK_NOT_FOUND: ok");
}

{
  const root = mkdtempSync(join(tmpdir(), "mc-arch-"));
  try {
    writeFileSync(join(root, "build.gradle"), `plugins { id "architectury-plugin" version "3.4-SNAPSHOT" }\n`, "utf8");
    writeFileSync(join(root, "gradle.properties"), "minecraft_version=1.20.1\n", "utf8");
    mkdirSync(join(root, "fabric", "src", "main", "resources"), { recursive: true });
    writeFileSync(
      join(root, "fabric", "src", "main", "resources", "fabric.mod.json"),
      JSON.stringify({ schemaVersion: 1, id: "demo" }),
      "utf8",
    );
    mkdirSync(join(root, "forge", "src", "main", "resources", "META-INF"), { recursive: true });
    writeFileSync(
      join(root, "forge", "src", "main", "resources", "META-INF", "mods.toml"),
      'modLoader="javafml"\nloaderVersion="[47,)"\n[[mods]]\nmodId="demo"\n',
      "utf8",
    );
    const d = detectModProject({ projectPath: root });
    assert.equal(d.multiLoader, true, JSON.stringify(d));
    assert.equal(d.packFound, false);
    assert.equal(d.action?.code, "PICK_PLATFORM");
    const msg = String(d.action?.message ?? "");
    assert.match(msg, /询问/);
    assert.match(msg, /禁止静默/);
    assert.ok((d.loaders ?? []).includes("fabric"), JSON.stringify(d.loaders));
    assert.ok((d.loaders ?? []).includes("forge"), JSON.stringify(d.loaders));
    assert.match(msg, /fabric/i);
    assert.match(msg, /forge/i);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
  console.log("Architectury PICK_PLATFORM: ok");
}

{
  for (const ver of NEO_MAIN) {
    for (const name of NEO_NEW_SKILLS) {
      const p = skillPath(ver, name);
      assert.ok(p, `缺少 Neo 主档 Skill ${ver}/${name}`);
      const body = readFileSync(p, "utf8");
      assert.ok(
        body.includes("search_neoforge_docs"),
        `${ver}/${name} 正文必须含字面量 search_neoforge_docs（硬写不合格）`,
      );
      assert.ok(
        body.includes(`version=${ver}`) || body.includes(`version: "${ver}"`),
        `${ver}/${name} 须写明本档 version`,
      );
      assert.doesNotMatch(body, /使用了["“]/, `${ver}/${name} 禁止过程水印`);
    }
  }
  console.log("Neo main skills search_neoforge_docs: ok");
}

{
  const { getApiPreloadStatus } = await import("./dist/api/index.js");
  const st = getApiPreloadStatus("1.20.1");
  assert.notEqual(st.loaded, true, JSON.stringify(st));
  console.log("get_server_status no warmup idle 1.20.1: ok");
}

{
  const { lookupObfuscated } = await import("./dist/mappings/lookup-obfuscated.js");
  const lu = lookupObfuscated({ name: "func_110143_aJ" });
  assert.equal(lu.action?.code, "VERSION_REQUIRED");
  const { validateAtHandler } = await import("./dist/mixin/deep-validate.js");
  const at = validateAtHandler({});
  assert.equal(at.action?.code, "VERSION_REQUIRED");
  console.log("lookup/AT VERSION_REQUIRED: ok");
}

{
  const { searchDocs } = await import("./dist/docs-platform/forge/index.js");
  const r = await searchDocs({ query: "DeferredRegister" });
  const j = JSON.parse(r.content[0].text);
  assert.equal(j.ok, false);
  assert.match(String(j.action?.message ?? ""), /platform/);
  console.log("search_docs no platform: ok");
}

{
  const { searchNeoForgeDocs } = await import("./dist/docs-platform/neoforge/index.js");
  const r = await searchNeoForgeDocs({ query: "DeferredRegister" });
  const j = JSON.parse(r.content[0].text);
  assert.equal(j.action?.code, "VERSION_REQUIRED");
  console.log("search_neoforge_docs no version: ok");
}

{
  const full = getWorkflowTemplate("mc-full-mod");
  assert.equal(full.found, true);
  assert.match(String(full.body ?? ""), /仅从零/);
  const enumVals = getWorkflowTemplateSchema.shape.name.options;
  assert.ok(enumVals.includes("mc-full-mod"));
  console.log("mc-full-mod workflow: ok");
}

{
  const { waveToolSchemas } = await import("./dist/wave/register.js");
  const er = waveToolSchemas.find((t) => t.name === "generate_entity_renderer");
  assert.match(String(er?.description ?? ""), /neoforge 26\.1/);
  const { generateEntityRenderer } = await import("./dist/generators/index.js");
  const fab = generateEntityRenderer("demo", "slime", "fabric", "1.21.1");
  assert.equal(fab.code, null);
  assert.ok((fab.errors ?? []).length > 0);
  const err = (fab.errors ?? []).join("\n");
  assert.match(err, /Fabric|Quilt/);
  assert.equal("fallback" in fab, false);
  console.log("generate_entity_renderer fabric: ok");
}

{
  const { resolveFromAvailable, VersionNotFoundError, ForgeDocStore } = await import(
    "./dist/docs-platform/forge/store.js"
  );
  assert.equal(resolveFromAvailable("1.16.8", ["1.16.1", "1.16.5"]), "1.16.5");
  assert.equal(resolveFromAvailable("1.16.5", ["1.16.x"]), "1.16.x");
  assert.equal(resolveFromAvailable("1.16.8", ["1.16.5", "1.16.x"]), "1.16.5");
  assert.equal(resolveFromAvailable("1.16", ["1.16.5"]), "1.16.5");
  assert.equal(resolveFromAvailable("1.19", ["1.19.2", "1.19.4"]), "1.19.4");
  assert.equal(resolveFromAvailable("1.19.2", ["1.19.2", "1.19.4"]), "1.19.2");
  assert.equal(resolveFromAvailable("26.1.2", ["26.1"]), "26.1");
  assert.equal(resolveFromAvailable("1.12.2", ["1.20.1"]), null);
  const { searchForgeDocs } = await import("./dist/docs-platform/forge/index.js");
  const miss = await searchForgeDocs({ query: "blocks", version: "9.9.9" });
  const missJ = JSON.parse(miss.content[0].text);
  assert.match(String(missJ.hint ?? missJ.action?.message ?? JSON.stringify(missJ)), /list_forge_versions/);
  assert.ok(VersionNotFoundError);
  assert.ok(ForgeDocStore);
  console.log("resolveFromAvailable matrix: ok");
}

{
  const { inspectRuntime } = await import("./dist/runtime-inspect/index.js");
  const dir = mkdtempSync(join(tmpdir(), "mc-insp-"));
  try {
    writeFileSync(
      join(dir, "crash-2024-01-01_12.00.00-client.txt"),
      "---- Minecraft Crash Report ----\nFabric Loader 0.16.0\n",
      "utf8",
    );
    const r = inspectRuntime({ crashReportsDir: dir });
    assert.equal(r.ok, true, JSON.stringify(r).slice(0, 400));
    assert.equal(r.analysisComplete, false);
    assert.equal(r.action?.code, "VERSION_REQUIRED");
    assert.equal(r.crashAnalysis?.crashKind, "fabric");
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
  console.log("inspect_runtime analysisComplete: ok");
}

{
  const { analyzeLog } = await import("./dist/diagnostics/index.js");
  const quilt = analyzeLog({
    logText: "org.quiltmc.loader.impl.QuiltLoaderImpl failed\nquilt.mod.json missing",
    version: "1.21.1",
  });
  assert.equal(quilt.ok, true, JSON.stringify(quilt).slice(0, 300));
  assert.ok(quilt.relatedTools.includes("search_docs"), JSON.stringify(quilt.relatedTools));
  assert.ok(!quilt.relatedTools.includes("search_fabric_docs"), JSON.stringify(quilt.relatedTools));
  const fab = analyzeLog({
    logText: "net.fabricmc.loader.impl.FabricLoaderImpl\nfabric-loader 0.16",
    version: "1.21.1",
  });
  assert.ok(fab.relatedTools.includes("search_fabric_docs"));
  assert.ok(!fab.relatedTools.includes("search_docs"), JSON.stringify(fab.relatedTools));
  console.log("analyze_log quilt vs fabric relatedTools: ok");
}

{
  const { knowledgeVersion, frontmatterDescription } = await import("./dist/platform-pack/catalog.js");
  assert.equal(knowledgeVersion("fabric", "26.1"), "26.1.2");
  assert.equal(knowledgeVersion("fabric", "26.1.1"), "26.1.2");
  assert.equal(knowledgeVersion("fabric", "26.1.2"), "26.1.2");
  assert.equal(knowledgeVersion("fabric", "26.2"), "26.2");
  assert.equal(knowledgeVersion("fabric", "1.21.11"), "1.21.11");
  const fm = frontmatterDescription(`---
name: demo
description: |
  first line of the skill
  second line continues
---
# Demo
`);
  assert.match(fm.description, /first line/);
  assert.match(fm.description, /second line/);
  assert.doesNotMatch(fm.description, /^first line of the skill$/);
  console.log("knowledgeVersion fabric fold + frontmatter block: ok");
}

{
  const { listKnowledgeResources, readKnowledgeResource } = await import("./dist/prompts/index.js");
  const listed = listKnowledgeResources();
  assert.ok(listed.some((r) => r.uri === "mcskill://community/authored/publishing"));
  const pub = readKnowledgeResource("mcskill://community/authored/publishing");
  assert.equal(pub.found, true);
  assert.ok(String(pub.text).length > 40);
  const linkish = listed.find((r) => r.uri.startsWith("mcskill://community/") && r.uri.includes("links/"));
  if (linkish) {
    const body = readKnowledgeResource(linkish.uri);
    assert.equal(body.found, false);
  }
  console.log("list_knowledge_resources community: ok");
}

{
  const { waveToolSchemas, ANALYZE_LOG_DESCRIPTION, READ_KNOWLEDGE_RESOURCE_DESCRIPTION } = await import(
    "./dist/wave/register.js"
  );
  const al = waveToolSchemas.find((t) => t.name === "analyze_log");
  const rk = waveToolSchemas.find((t) => t.name === "read_knowledge_resource");
  assert.ok(al?.description);
  assert.equal(al.description, ANALYZE_LOG_DESCRIPTION);
  assert.ok(rk?.description);
  assert.equal(rk.description, READ_KNOWLEDGE_RESOURCE_DESCRIPTION);
  console.log("wave description single source: ok");
}

{
  const {
    waveToolSchemas,
    GENERATE_CONFIG_DESCRIPTION,
    GENERATE_NETWORK_PACKET_DESCRIPTION,
    GENERATE_CAPABILITY_DESCRIPTION,
    GENERATE_MODEL_DESCRIPTION,
  } = await import("./dist/wave/register.js");
  const cfg = waveToolSchemas.find((t) => t.name === "generate_config");
  const pkt = waveToolSchemas.find((t) => t.name === "generate_network_packet");
  const cap = waveToolSchemas.find((t) => t.name === "generate_capability");
  const mdl = waveToolSchemas.find((t) => t.name === "generate_model");
  assert.equal(cfg?.description, GENERATE_CONFIG_DESCRIPTION);
  assert.match(String(cfg?.description), /Cloth Config/);
  assert.doesNotMatch(String(cfg?.description), /改口 mc-config/);
  assert.equal(pkt?.description, GENERATE_NETWORK_PACKET_DESCRIPTION);
  const { NETWORK_PACKET_PLATFORMS } = await import("./dist/generators/index.js");
  for (const tok of NETWORK_PACKET_PLATFORMS) {
    assert.ok(String(pkt?.description).includes(tok), `A1 missing token ${tok}`);
  }
  assert.equal(cap?.description, GENERATE_CAPABILITY_DESCRIPTION);
  assert.equal(mdl?.description, GENERATE_MODEL_DESCRIPTION);
  console.log("generate_* description single source: ok");
}

{
  const { sessionPlatformPack } = await import("./dist/platform-pack/session.js");
  const s = sessionPlatformPack({ platform: "neoforge", minecraftVersion: "1.21.1" });
  assert.equal(s.ok, true);
  assert.equal(s.rulesMode, "base");
  assert.deepEqual((s.rules ?? []).map((r) => r.id), ["00", "01", "09"]);
  assert.ok((s.warnings ?? []).some((w) => w.includes("已加载底座规则 00/01/09")));
  assert.ok((s.warnings ?? []).some((w) => w.includes("传 task 或 topics")));
  console.log("session base warning wording: ok");
}

{
  const { detectModProject } = await import("./dist/platform-pack/detect.js");
  const { resolveRepoRoot } = await import("./dist/utils/path.js");
  const d = detectModProject({ projectPath: resolveRepoRoot() });
  assert.equal(d.ok, false);
  assert.equal(d.action?.code, "KNOWLEDGE_REPO_NOT_MOD");
  console.log("detect knowledge repo root: ok");
}

{
  const root = mkdtempSync(join(tmpdir(), "mc-arch-nometa-"));
  try {
    mkdirSync(join(root, "forge"), { recursive: true });
    mkdirSync(join(root, "fabric"), { recursive: true });
    writeFileSync(join(root, "AGENTS.md"), "# user architectury workspace\n", "utf8");
    writeFileSync(join(root, "forge", "build.gradle"), "plugins { id 'net.minecraftforge.gradle' }\n", "utf8");
    writeFileSync(join(root, "fabric", "build.gradle"), "plugins { id 'fabric-loom' }\n", "utf8");
    writeFileSync(join(root, "build.gradle"), "plugins { id 'architectury-plugin' }\n", "utf8");
    writeFileSync(join(root, "gradle.properties"), "minecraft_version=1.20.1\n", "utf8");
    const d = detectModProject({ projectPath: root });
    assert.notEqual(d.action?.code, "KNOWLEDGE_REPO_NOT_MOD", JSON.stringify(d.action));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
  console.log("detect Architectury forge+fabric no pack.meta: ok");
}

{
  const { validateDatapackJson } = await import("./dist/datapack/index.js");
  const r = validateDatapackJson({
    kind: "recipe",
    version: "1.21.1",
    jsonContent: JSON.stringify({
      type: "minecraft:crafting_shaped",
      pattern: ["#"],
      key: { "#": "minecraft:stone" },
      result: { id: "minecraft:diamond", count: 1 },
    }),
  });
  assert.equal(r.valid, true, JSON.stringify(r.errors));
  console.log("datapack 1.21 object result: ok");
}

{
  const { generateModel, generateLang } = await import("./dist/generators/index.js");
  const item = generateModel("my_mod", "widget", "1.21.1", "item");
  assert.ok(item.files);
  assert.ok(!Object.keys(item.files ?? {}).some((k) => k.includes("blockstates")));
  assert.ok(Object.keys(item.files ?? {}).some((k) => k.includes("models/item/")));
  const block = generateModel("my_mod", "widget", "1.21.1");
  assert.ok(Object.keys(block.files ?? {}).some((k) => k.includes("blockstates")));
  const lang = generateLang("my_mod", { sound_step: "Step", effect_glow: "Glow" }, "1.21.1");
  const en = JSON.parse(lang.files?.["assets/my_mod/lang/en_us.json"] ?? "{}");
  assert.equal(en["sounds.my_mod.step"], "Step");
  assert.equal(en["effect.my_mod.glow"], "Glow");
  console.log("generate_model kind=item + lang prefixes: ok");
}

{
  const { getVersionInfo } = await import("./dist/version/index.js");
  const neo = await getVersionInfo({ version: "1.21.1", action: "register", platform: "neoforge" });
  assert.equal(neo.ok, false);
  assert.equal(neo.action?.code, "WRONG_TOOL");
  const f1211 = await getVersionInfo({ version: "1.21.1", action: "docs", platform: "forge" });
  assert.notEqual(f1211.forgeVersion, "unknown");
  const unknown = await getVersionInfo({ version: "1.99.9", action: "docs", platform: "forge" });
  assert.match(unknown.gotchas.join("\n"), /search_forge_docs/);
  console.log("get_version_info forge-only + 1.21.1: ok");
}

{
  const { portProject } = await import("./dist/porting/index.js");
  const r = JSON.parse(
    await portProject({
      projectPath: join(tmpdir(), "mc-skill-port-rift-dummy"),
      targetPlatform: "rift",
      action: "extract_common",
      dryRun: true,
    }),
  );
  assert.equal(r.ok, false);
  assert.equal(r.error.code, "UNSUPPORTED_PORT");
  assert.ok(Array.isArray(r.error.next) && r.error.next.length > 0, JSON.stringify(r.error));
  console.log("port_project rift UNSUPPORTED_PORT next: ok");
}

{
  const { diagnoseGradle } = await import("./dist/gradle/index.js");
  const g = diagnoseGradle({
    buildGradle: "plugins { id 'org.quiltmc.loom' version '1.7.4' }\n",
    quiltModJson: JSON.stringify({ schema_version: 1, quilt_loader: { id: "q", version: "1" } }),
    modsToml: 'modLoader="javafml"\n',
  });
  assert.ok((g.warnings ?? []).some((w) => /Quilt Loom/.test(w)), JSON.stringify(g));
  assert.ok(!(g.errors ?? []).some((e) => /javafml|modEventBus|DeferredRegister/.test(e)), JSON.stringify(g.errors));
  console.log("diagnose_gradle quilt extras: ok");
}

{
  const { validateProject } = await import("./dist/validate/index.js");
  const v = validateProject({
    buildGradle: "plugins { id 'fabric-loom' }\n",
    fabricModJson: JSON.stringify({ schemaVersion: 1, id: "demo" }),
    javaFiles: [{ path: "Demo.java", content: "public class Demo { DeferredRegister x; }\n" }],
  });
  assert.ok(v.errors?.every((e) => !/未调用.*register\(modEventBus\)/.test(e)), JSON.stringify(v.errors));
  console.log("validate fabric skips Forge DeferredRegister ERROR: ok");
}

{
  const { detectMinecraftVersionFromIncludedSubprojects } = await import("./dist/utils/minecraft-version.js");
  const v = detectMinecraftVersionFromIncludedSubprojects({
    settingsGradle: "include 'build'\ninclude 'submod'\n",
    readSubprojectProperties: (inc) => {
      if (inc === "build") return "minecraft_version=9.9.9\n";
      if (inc === "submod") return "minecraft_version=1.20.1\n";
      return undefined;
    },
  });
  assert.equal(v, "1.20.1");
  const root = mkdtempSync(join(tmpdir(), "mc-inc-ver-"));
  try {
    writeFileSync(join(root, "settings.gradle"), "include 'submod'\n", "utf8");
    mkdirSync(join(root, "submod"), { recursive: true });
    writeFileSync(join(root, "submod", "gradle.properties"), "minecraft_version=1.20.1\n", "utf8");
    writeFileSync(join(root, "build.gradle"), "plugins { id 'net.minecraftforge.gradle' }\n", "utf8");
    mkdirSync(join(root, "src", "main", "resources", "META-INF"), { recursive: true });
    writeFileSync(
      join(root, "src", "main", "resources", "META-INF", "mods.toml"),
      'modLoader="javafml"\nloaderVersion="[47,)"\n[[mods]]\nmodId="demo"\n',
      "utf8",
    );
    const d = detectModProject({ projectPath: root });
    assert.equal(d.minecraftVersion, "1.20.1", JSON.stringify(d));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
  console.log("included subproject gradle.properties version: ok");
}

{
  const { spawnSync } = await import("node:child_process");
  const { readdirSync } = await import("node:fs");
  const thin = ["1.20.6", "1.21.5", "1.21.10"];
  const sample = [
    "mc-entity",
    "mc-datagen",
    "mc-capability",
    "mc-particle",
    "mc-ai",
    "mc-energy",
    "mc-multiblock",
    "mc-villager",
    "mc-weather",
    "mc-compat-jei",
  ];
  for (const ver of thin) {
    const s = sessionPlatformPack({ platform: "neoforge", minecraftVersion: ver, skillNames: ["mc-entity"] });
    const entity = (s.skillBodies ?? []).find((b) => b.name === "mc-entity");
    assert.ok(entity, `${ver} mc-entity body`);
    assert.doesNotMatch(String(entity.text), /DONOR_SKILL/);
    assert.match(String(entity.text), /search_neoforge_docs/);
    assert.match(String(entity.text), new RegExp(`version=${ver.replaceAll(".", "\\.")}`));
    const entIdx = (s.skills ?? []).find((x) => x.name === "mc-entity");
    assert.match(String(entIdx?.relPosix ?? ""), new RegExp(`neoforge/${ver.replaceAll(".", "\\.")}`));
    for (const name of sample) {
      const p = skillPath(ver, name);
      assert.ok(p, `${ver} missing ${name}`);
      const text = readFileSync(p, "utf8");
      assert.match(text, /search_neoforge_docs/, `${ver} ${name} missing search_neoforge_docs`);
      assert.match(text, new RegExp(`version=${ver.replaceAll(".", "\\.")}`), `${ver} ${name} version`);
    }
  }
  console.log("plan4 neo thin mc-entity + sample skills: ok");

  const quiltVers = ["1.18.2", "1.19.4", "1.20.1", "1.20.4", "1.21.1", "1.21.3", "1.21.4", "1.21.8", "1.21.10", "1.21.11"];
  for (const ver of quiltVers) {
    const disk = join(repo, "quilt", ver, ".cursor", "skills");
    const names = existsSync(disk) ? readdirSync(disk).filter((n) => n.startsWith("mc-")) : [];
    assert.equal(names.length, 3, `${ver} disk skills=${names.join(",")}`);
    assert.ok(names.includes("mc-registry") && names.includes("mc-events") && names.includes("mc-networking"));
    const q = sessionPlatformPack({
      platform: "quilt",
      minecraftVersion: ver,
      skillNames: ["mc-registry", "mc-events", "mc-networking"],
    });
    assert.ok((q.skills ?? []).some((x) => x.name === "mc-registry" && /quilt\//.test(String(x.relPosix))));
    for (const name of ["mc-registry", "mc-events", "mc-networking"]) {
      const p = join(repo, "quilt", ver, ".cursor", "skills", name, "SKILL.md");
      const text = readFileSync(p, "utf8");
      assert.match(text, /search_docs/, `${ver} ${name}`);
      assert.doesNotMatch(text, /DONOR_SKILL/);
    }
  }
  console.log("plan4 quilt QSL 3 skills: ok");

  const ll = sessionPlatformPack({ platform: "liteloader", minecraftVersion: "1.12.2", skillNames: ["mc-events"] });
  assert.ok((ll.skills ?? []).some((x) => x.name === "mc-events"));
  const llBody = (ll.skillBodies ?? []).find((b) => b.name === "mc-events");
  assert.ok(llBody);
  assert.doesNotMatch(String(llBody.text), /ModInitializer/);
  const rift = sessionPlatformPack({ platform: "rift", minecraftVersion: "1.13.2", skillNames: ["mc-events"] });
  assert.ok((rift.skills ?? []).some((x) => x.name === "mc-events"));
  const riftBody = (rift.skillBodies ?? []).find((b) => b.name === "mc-events");
  assert.doesNotMatch(String(riftBody?.text), /ModInitializer/);
  console.log("plan4 old-loader skills: ok");

  const tmpSkillRoot = mkdtempSync(join(tmpdir(), "mc-lint-old-"));
  try {
    const skillAbs = join(tmpSkillRoot, "liteloader", "1.12.2", ".cursor", "skills", "mc-bad", "SKILL.md");
    mkdirSync(dirname(skillAbs), { recursive: true });
    writeFileSync(
      skillAbs,
      "---\nname: mc-bad\n---\n\n```java\npublic class ModInitializer {\n  void boom(FooBar x) {}\n}\n```\n",
      "utf8",
    );
    const listAbs = join(tmpSkillRoot, "list.txt");
    writeFileSync(listAbs, `${skillAbs}\n`, "utf8");
    const r = spawnSync(
      process.execPath,
      [join(repo, "mcp-server", "scripts", "lint-skill-verified-api.mjs"), `--list=${listAbs}`],
      { encoding: "utf8" },
    );
    assert.notEqual(r.status, 0, r.stdout + r.stderr);
    assert.match(`${r.stderr}\n${r.stdout}`, /blacklist ModInitializer|表外类名/);
  } finally {
    rmSync(tmpSkillRoot, { recursive: true, force: true });
  }
  console.log("plan4 lint old-loader blacklist: ok");

  // 可达性门禁：上面的自测用 tmpdir 绝对路径（含 \liteloader\），生产清单却是仓库相对路径。
  // 从脚本源码里取出 OLD 正则本体，直接在真实清单上验证它对相对路径仍然命中，否则黑名单分支是死代码。
  const lintSrc = readFileSync(join(repo, "mcp-server", "scripts", "lint-skill-verified-api.mjs"), "utf8");
  const oldLit = lintSrc.match(/const OLD = \/(.*)\/i;/);
  assert.ok(oldLit, "lint-skill-verified-api.mjs 里找不到 OLD 正则字面量");
  const oldRe = new RegExp(oldLit[1], "i");
  const lintList = readFileSync(join(repo, "mcp-server", "scripts", "lint-skill-verified-api.files.txt"), "utf8")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#"));
  const shouldCover = lintList.filter((f) => /^(liteloader|rift|modloader)[/\\]/i.test(f));
  assert.ok(shouldCover.length > 0, "清单里没有老加载器条目");
  const reached = shouldCover.filter((f) => oldRe.test(f));
  assert.equal(
    reached.length,
    shouldCover.length,
    `OLD=${oldLit[1]} 对仓库相对路径不可达：${shouldCover.length - reached.length}/${shouldCover.length} 条老加载器 SKILL.md 不受黑名单约束`,
  );
  console.log(`plan4 lint OLD 可达性: ok (${reached.length}/${shouldCover.length} 条老加载器档受约束)`);

  function countTableRows(rel) {
    const t = readFileSync(join(repo, rel), "utf8");
    return t
      .split(/\r?\n/)
      .filter((l) => /^\|/.test(l) && !/^\|\s*-+/.test(l) && !/^\|\s*(名称|API|做法)\b/.test(l)).length;
  }
  assert.ok(countTableRows("neoforge/1.20.1/knowledge/common/verified-api-1.20.1.md") >= 10);
  assert.ok(countTableRows("forge/1.7.10/knowledge/common/verified-api.md") >= 10);
  const neo1201 = sessionPlatformPack({ platform: "neoforge", minecraftVersion: "1.20.1" });
  assert.equal(neo1201.ok, true, JSON.stringify(neo1201.action));
  for (const id of ["00", "01", "09"]) {
    assert.ok(
      (neo1201.rules ?? []).some((r) => r.id === id),
      `neoforge 1.20.1 missing rule ${id}`,
    );
  }
  const f1211 = sessionPlatformPack({ platform: "forge", minecraftVersion: "1.21.1" });
  assert.equal(f1211.ok, false);
  assert.equal(f1211.action?.code, "PACK_NOT_FOUND");
  console.log("plan4 ready/draft verified-api: ok");

  const { listFabricVersions } = await import("./dist/docs-platform/fabric/index.js");
  const listed = JSON.parse((await listFabricVersions()).content[0].text);
  const hollow = ["1.21.4", "1.21.5", "1.21.8", "1.21.10"];
  for (const ver of hollow) {
    const hasDocs = (listed.versions ?? []).includes(ver);
    const sess = sessionPlatformPack({ platform: "fabric", minecraftVersion: ver });
    if (hasDocs) {
      assert.equal(sess.ok, true, `${ver} docs listed but session failed ${JSON.stringify(sess.action)}`);
    } else {
      assert.equal(sess.ok, false, `${ver} must stay PACK_NOT_FOUND`);
      assert.equal(sess.action?.code, "PACK_NOT_FOUND");
    }
  }
  console.log("plan4 fabric hollow: ok");
  for (const ver of ["1.21.4", "1.21.8", "1.21.10"]) {
    assert.ok(countTableRows(`fabric/${ver}/knowledge/common/verified-api-${ver}.md`) >= 10);
    const p = join(repo, "fabric", ver, ".cursor", "skills", "mc-registry", "SKILL.md");
    const text = readFileSync(p, "utf8");
    assert.match(text, /search_fabric_docs/, `${ver} mc-registry`);
    assert.match(text, new RegExp(`version=${ver.replaceAll(".", "\\.")}`));
    const sess = sessionPlatformPack({ platform: "fabric", minecraftVersion: ver });
    const ids = (sess.rules ?? []).map((r) => r.id);
    for (const id of ["00", "01", "09"]) {
      assert.ok(ids.includes(id), `${ver} session missing ${id} in ${ids.join(",")}`);
    }
  }
  assert.ok(!(listed.versions ?? []).includes("1.21.5"));
  console.log("plan4 fabric 1.21.4/8/10 skills + 1.21.5 PACK_NOT_FOUND: ok");

  const pkt1215 = generateNetworkPacket("demo", "sync", "neoforge_1.21.5");
  assert.match(String(pkt1215.code), /RegisterPayloadHandlersEvent/);
  assert.match(String(pkt1215.code), /DirectionalPayloadHandler/);
  const pkt12110 = generateNetworkPacket("demo", "sync", "neoforge_1.21.10");
  assert.match(String(pkt12110.code), /RegisterClientPayloadHandlersEvent/);
  assert.doesNotMatch(String(pkt12110.code), /DirectionalPayloadHandler/);
  console.log("plan4 generate_network_packet 1.21.5/1.21.10: ok");

  // D-2/D-3：Quilt 走 FAPI donor（有 donor 的档给骨架 + QSL 停更横幅；无 donor 的 actionable 拒绝）
  const pktQuilt = generateNetworkPacket("demo", "sync", "quilt_1.21.4");
  assert.match(String(pktQuilt.code), /PayloadTypeRegistry/);
  assert.match(String(pktQuilt.warnings?.join("|") ?? ""), /QSL 无网络模块|2025-12 停更/);
  const pktQuiltOld = generateNetworkPacket("demo", "sync", "quilt_1.20.4");
  assert.equal(pktQuiltOld.code, null);
  assert.match(String(pktQuiltOld.errors?.[0]), /无任何已发布构件|历史构件/);
  // D-3：MCP 时代 SimpleChannel（1.14–1.16 用 PacketBuffer；1.17.1 官方映射用 FriendlyByteBuf——两代不共用骨架）
  const pktMcp = generateNetworkPacket("demo", "sync", "forge_1.16.5");
  assert.match(String(pktMcp.code), /SimpleChannel/);
  assert.match(String(pktMcp.code), /PacketBuffer/);
  assert.doesNotMatch(String(pktMcp.code), /FriendlyByteBuf|SimpleNetworkWrapper/);
  const pkt171 = generateNetworkPacket("demo", "sync", "forge_1.17.1");
  assert.match(String(pkt171.code), /FriendlyByteBuf/);
  assert.match(String(pkt171.code), /net\.minecraft\.resources\.ResourceLocation/);
  assert.doesNotMatch(String(pkt171.code), /PacketBuffer|net\.minecraft\.util\.ResourceLocation/);
  console.log("D2/D3 generate_network_packet quilt_1.21.4/quilt_1.20.4/forge_1.16.5/forge_1.17.1: ok");

  // D-3：entity_renderer 扩档（1.18.2/1.19.4 过门；neoforge 1.21.x 未核保持拒绝）
  const er118 = generateEntityRenderer("demo", "beast", "forge", "1.18.2");
  assert.ok(String(er118.code).includes("EntityRendererProvider"), JSON.stringify(er118).slice(0, 200));
  const erNeo211 = generateEntityRenderer("demo", "beast", "neoforge", "1.21.11");
  assert.equal(erNeo211.code, null);
  console.log("D3 generate_entity_renderer forge_1.18.2 过门 / neoforge_1.21.11 拒绝: ok");
}

// ── generate_* 写盘：suggestedPath 跟代码里的 package/public 类名走；沙箱双守卫 ──
{
  const prevAllow = process.env.MC_SKILL_ALLOW_WRITE;
  const prevRoot = process.env.MC_SKILL_PROJECT_ROOT;
  const restoreEnv = () => {
    if (prevAllow === undefined) delete process.env.MC_SKILL_ALLOW_WRITE;
    else process.env.MC_SKILL_ALLOW_WRITE = prevAllow;
    if (prevRoot === undefined) delete process.env.MC_SKILL_PROJECT_ROOT;
    else process.env.MC_SKILL_PROJECT_ROOT = prevRoot;
  };
  const sandbox = mkdtempSync(join(tmpdir(), "mc-skill-gen-write-"));
  try {
    const cfg = generateConfig("examplemod", "fabric", "1.21.1");
    // 骨架里声明的是 ExamplemodConfig，而工具合成的文件名是 ModConfig.java：
    // public 类名 != 文件名，落盘后 javac 直接报错，所以路径必须跟着代码走。
    const cfgPaths = suggestPathsForGenerator(cfg, { singleFileName: "ModConfig.java" });
    assert.equal(
      cfgPaths.suggestedPath,
      "src/main/java/com/example/examplemod/config/ExamplemodConfig.java",
    );
    assert.equal(cfgPaths.pathWarnings.length, 1, JSON.stringify(cfgPaths.pathWarnings));
    // 警告必须同时点名「原名」和「新类型名」：松正则会被 suggestedPath 里的文件名满足，抓不到漏写。
    assert.match(
      cfgPaths.pathWarnings[0],
      /文件名 ModConfig\.java 与顶层类型 ExamplemodConfig 不一致/,
      cfgPaths.pathWarnings[0],
    );
    assert.match(cfgPaths.pathWarnings[0], /已按类型名改名/, cfgPaths.pathWarnings[0]);
    // singleFileName 是工具按参数拼的（register.ts 里 packetName / entityName / classBase），
    // 不是调用方传的文件名，警告不得这么写。
    assert.equal(
      cfgPaths.pathWarnings[0].includes("调用方"),
      false,
      cfgPaths.pathWarnings[0],
    );
    const pkt = generateNetworkPacket("demo", "sync", "neoforge_1.21.1");
    assert.equal(
      suggestPathsForGenerator(pkt, { singleFileName: "SyncPacket.java" }).suggestedPath,
      "src/main/java/com/example/demo/network/SyncPayload.java",
    );
    // 类名与给定文件名一致时不改名，也不该冒出警告
    const pkt1122 = generateNetworkPacket("demo", "sync", "forge_1.12.2");
    const sameName = suggestPathsForGenerator(pkt1122, { singleFileName: "SyncPacket.java" });
    assert.equal(sameName.suggestedPath, "src/main/java/com/example/demo/network/SyncPacket.java");
    assert.equal(sameName.pathWarnings.length, 0, JSON.stringify(sameName.pathWarnings));
    // 无 package（骨架不带包声明）→ 保持旧的 javaPrefix 兜底；自定义 javaPrefix 仍生效
    const bare = { code: "public class Bare {\n}\n", warnings: undefined };
    assert.equal(
      suggestPathsForGenerator(bare, { singleFileName: "Bare.java" }).suggestedPath,
      "src/main/java/Bare.java",
    );
    assert.equal(
      suggestPathsForGenerator(cfg, { singleFileName: "ModConfig.java", javaPrefix: "src/java" })
        .suggestedPath,
      "src/java/com/example/examplemod/config/ExamplemodConfig.java",
    );
    // 注释里的 `package` 不能当真声明
    const decoy = {
      code: "// package com.decoy.should.not.win;\n/* package com.decoy2.no; */\npackage com.example.demo.net;\npublic class PingPacket {}\n",
    };
    assert.equal(
      suggestPathsForGenerator(decoy, { singleFileName: "PingPacket.java" }).suggestedPath,
      "src/main/java/com/example/demo/net/PingPacket.java",
    );
    // Kotlin 不要求文件名 == 类型名：包目录跟代码走，文件名保留传入的
    const kt = {
      code: "package com.example.demo.util\n\nfun main() {}\n\nclass Greeter\n",
    };
    assert.equal(
      suggestPathsForGenerator(kt, { singleFileName: "Hello.kt" }).suggestedPath,
      "src/main/java/com/example/demo/util/Hello.kt",
    );
    console.log("generate_* suggestedPath 由 package + public 类名推导: ok");

    const proj = join(sandbox, "myMod");
    mkdirSync(proj, { recursive: true });
    process.env.MC_SKILL_ALLOW_WRITE = "1";

    // 只给 ALLOW_WRITE + projectPath：生成器写盘要拒绝（projectPath 由模型给，单参数即写盘 = 一道守卫）
    delete process.env.MC_SKILL_PROJECT_ROOT;
    const refused = maybeWriteGeneratorResult(cfg, { write: true, confirmed: true, projectPath: proj }, {
      singleFileName: "ModConfig.java",
    });
    assert.equal(refused.writeError?.code, "PROJECT_ROOT_REQUIRED");
    assert.equal(refused.written, undefined);
    assert.equal(existsSync(join(proj, "src")), false, "拒绝写盘却仍建出了 src/");
    // 同一 env 下 port_project/activate_platform_pack write 仍按旧口径把 projectPath 当根
    const legacy = resolveWriteAllowRoot(proj);
    assert.equal(nativeReal(legacy).toLowerCase(), nativeReal(proj).toLowerCase(), "非生成器调用方的 explicitRoot 兜底被改坏了");

    // env root 是父目录：文件要落进 projectPath，而不是落在边界（=父目录）上
    process.env.MC_SKILL_PROJECT_ROOT = sandbox;
    const ok = maybeWriteGeneratorResult(cfg, { write: true, confirmed: true, projectPath: proj }, {
      singleFileName: "ModConfig.java",
    });
    assert.equal(ok.writeError, undefined, JSON.stringify(ok.writeError));
    const landed = join(proj, "src", "main", "java", "com", "example", "examplemod", "config", "ExamplemodConfig.java");
    assert.equal(existsSync(landed), true, `未落盘：${ok.written?.join(",")}`);
    assert.match(readFileSync(landed, "utf8"), /public final class ExamplemodConfig/);
    assert.equal(existsSync(join(sandbox, "src")), false, "按 allowlist 边界当写入基准（写到了父目录）");
    assert.ok(
      (ok.written ?? []).every((p) => p.replace(/\\/g, "/").toLowerCase().startsWith(proj.replace(/\\/g, "/").toLowerCase())),
      JSON.stringify(ok.written),
    );
    // 多文件 files 图同样落进 projectPath
    const lang = { code: null, files: { "assets/demo/lang/en_us.json": "{\"k\":\"v\"}" } };
    const langOut = maybeWriteGeneratorResult(lang, { write: true, confirmed: true, projectPath: proj }, {
      resourcesPrefix: "src/main/resources",
    });
    assert.equal(
      existsSync(join(proj, "src", "main", "resources", "assets", "demo", "lang", "en_us.json")),
      true,
      JSON.stringify(langOut.written ?? langOut.writeError),
    );
    console.log("generate_* write：env root 缺失拒绝 + 落点在 projectPath: ok");

    // 绝对 rel 会顶掉 projectBase，`..` 段能溜到同沙箱的别的工程
    const escapeCases = ["../escaped.java"];
    if (process.platform === "win32") escapeCases.push("C:/Windows/Temp/escaped.java");
    for (const evil of escapeCases) {
      const out = maybeWriteGeneratorResult(
        { code: null, files: { [evil]: "x" } },
        { write: true, confirmed: true, projectPath: proj },
      );
      assert.equal(out.writeError?.code, "PATH_OUTSIDE_ALLOWLIST", `${evil} 竟然被接受`);
      assert.equal(out.written, undefined, `${evil} 拒绝前已落盘`);
    }
    assert.equal(existsSync(join(sandbox, "escaped.java")), false);
    // 前导斜杠会被 path 层 normalize 成工程内相对路径：写进了工程，但没逃逸到 /etc
    const leadSlash = maybeWriteGeneratorResult(
      { code: null, files: { "/etc/escaped.java": "x" } },
      { write: true, confirmed: true, projectPath: proj },
    );
    assert.equal(leadSlash.writeError, undefined, JSON.stringify(leadSlash.writeError));
    assert.equal(existsSync(join(proj, "etc", "escaped.java")), true, JSON.stringify(leadSlash.written));
    assert.equal(existsSync(join(sandbox, "tmp", "escaped.java")), false);
    console.log("generate_* write：绝对路径 / .. 相对路径一律拒绝: ok");
  } finally {
    restoreEnv();
    rmSync(sandbox, { recursive: true, force: true });
  }
}

// ── A-5：版本缓存 FIFO 驱逐必须释放被驱逐条目的资源 ─────────────────────────
{
  const {
    testOnlyVersionCache,
    listApiPreloadStatuses,
    getApiPreloadStatus,
    warmupApi,
    disposeApiData,
  } = await import("./dist/api/index.js");

  const CAP = 64; // 钉死 src/api/index.ts 的 _MAX_VERSION_CACHE：改常量必须连带改这里
  const keys = () => listApiPreloadStatuses().map((s) => s.version);

  disposeApiData();
  let timerFired = false;
  let settled = 0;
  let terminated = 0;
  const oldest = {
    preloadTimer: setTimeout(() => {
      timerFired = true;
    }, 40),
    settlePreload: () => {
      settled += 1;
    },
    worker: {
      terminate: () => {
        terminated += 1;
      },
    },
    preloadPromise: Promise.resolve(),
  };
  testOnlyVersionCache.put("9.0.0", oldest);
  for (let i = 1; i <= CAP; i += 1) testOnlyVersionCache.put(`9.0.${i}`);

  const after = keys();
  assert.equal(after.length, CAP, `第 ${CAP + 1} 条没触发 FIFO 驱逐：${after.length} 条`);
  assert.equal(after[0], "9.0.1", "FIFO 驱逐必须丢最旧插入项");
  assert.equal(after.includes("9.0.0"), false);
  assert.equal(after[CAP - 1], "9.0.64");
  assert.equal(settled, 1, "被驱逐条目没跑 settlePreload → awaiter 永久挂起");
  assert.equal(terminated, 1, "被驱逐条目没 terminate Worker → 线程泄漏");
  await new Promise((r) => setTimeout(r, 90));
  assert.equal(timerFired, false, "漏了 clearTimeout：被驱逐条目仍会回调改状态");
  console.log("A-5 版本缓存 FIFO 驱逐释放 timer / settle / worker: ok");

  disposeApiData();
  const reload = await warmupApi(["9.0.0"]);
  assert.equal(reload[0].status, "missing_data", "驱逐后再查没重新走加载路径");
  assert.deepEqual(keys(), ["9.0.0"], "驱逐后残留了别的默认条目");
  disposeApiData();
  console.log("A-5 驱逐后再查重新走加载路径（不落共享默认对象）: ok");

  for (let i = 0; i < CAP; i += 1) testOnlyVersionCache.put(`9.1.${i}`);
  testOnlyVersionCache.put("9.1.0"); // 覆盖已存在的 key
  assert.equal(keys().length, CAP);
  assert.equal(keys()[0], "9.1.0", "覆盖已有版本时误顶掉最旧条目");
  disposeApiData();
  console.log("A-5 覆盖已有 key 不误驱逐: ok");

  testOnlyVersionCache.put("9.2.0", {
    settlePreload: () => {
      throw new Error("already settled");
    },
  });
  for (let i = 1; i <= CAP; i += 1) testOnlyVersionCache.put(`9.2.${i}`);
  assert.equal(keys().length, CAP, "settlePreload 抛错中断了驱逐");
  assert.equal(keys().includes("9.2.0"), false);
  disposeApiData();
  console.log("A-5 settlePreload 抛错不阻断驱逐: ok");
}

// ── A-1：NeoForge 索引列了 processedFile 但文件缺失 → 必须报错，禁止空串 ─────
{
  const { NeoForgeDocStore, DocNotFoundError } = await import(
    "./dist/docs-platform/neoforge/store.js"
  );
  const root = mkdtempSync(join(tmpdir(), "mc-neo-doc-"));
  try {
    const ver = "1.21.9";
    const dir = join(root, `neoforge_${ver}`, "neoforge-docs", ver);
    mkdirSync(join(dir, "processed"), { recursive: true });
    writeFileSync(join(dir, "index-l0.json"), "[]", "utf8");
    writeFileSync(join(dir, "index-l1.json"), "[]", "utf8");
    writeFileSync(
      join(dir, "index-l2.json"),
      JSON.stringify([
        { id: `${ver}/present_page`, processedFile: "processed/present_page.md" },
        { id: `${ver}/ghost_page`, processedFile: "processed/ghost_page.md" },
      ]),
      "utf8",
    );
    writeFileSync(join(dir, "processed", "present_page.md"), "# present\n\n正文在。\n", "utf8");

    const store = new NeoForgeDocStore(root);
    const hit = await store.loadFullDoc(`${ver}/present_page`, ver);
    assert.match(hit.content, /正文在/);

    let err = null;
    try {
      err = await store.loadFullDoc(`${ver}/ghost_page`, ver);
    } catch (e) {
      err = e;
    }
    assert.ok(
      err instanceof DocNotFoundError,
      `缺正文必须抛 DocNotFoundError，实得 ${JSON.stringify(err ?? null).slice(0, 200)}`,
    );
    assert.match(String(err.id), /ghost_page/);

    // 工具层同一入口：必须 DOC_NOT_FOUND，而不是 ok:true + content:""
    const prevData = process.env.MC_SKILL_DATA;
    process.env.MC_SKILL_DATA = root;
    try {
      const { getNeoForgeDocFull } = await import("./dist/docs-platform/neoforge/index.js");
      const ghost = JSON.parse(
        (await getNeoForgeDocFull({ id: `${ver}/ghost_page`, version: ver })).content[0].text,
      );
      assert.equal(ghost.ok, false, JSON.stringify(ghost).slice(0, 240));
      assert.equal(ghost.error?.code, "DOC_NOT_FOUND");
      const good = JSON.parse(
        (await getNeoForgeDocFull({ id: `${ver}/present_page`, version: ver })).content[0].text,
      );
      assert.equal(good.ok, true, JSON.stringify(good.error ?? {}).slice(0, 200));
      assert.match(good.content, /正文在/);
    } finally {
      if (prevData === undefined) delete process.env.MC_SKILL_DATA;
      else process.env.MC_SKILL_DATA = prevData;
    }
    console.log("A-1 NeoForge 缺 processedFile → DocNotFoundError / DOC_NOT_FOUND: ok");
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

// ── A-32：三个文档 store 的缓存必须有硬条数上界（TTL 只挡过期，不挡增长）────
{
  const { FabricDocStore } = await import("./dist/docs-platform/fabric/store.js");
  const { ForgeDocStore } = await import("./dist/docs-platform/forge/store.js");
  const { NeoForgeDocStore } = await import("./dist/docs-platform/neoforge/store.js");

  // 两位数序号：避免 "9.7.6" 成为 "9.7.69" 的子串而误命中
  const CHURN = Array.from({ length: 70 }, (_, i) => `9.7.${i + 10}`);
  const pageId = (i) => `page${String(i).padStart(3, "0")}`;
  const PAGES = 261; // > FILE_CACHE_MAX(256)
  const hasVer = (map, token) => [...map.keys()].some((k) => k.includes(token));
  const hasPage = (map, ver, page) =>
    [...map.keys()].some((k) => k.includes(ver) && k.includes(page));

  // trees 一一对应 store 里的 fileCache 写入分支：
  //   l2   → loadFullDoc 读 index-l2 的分支
  //   thin → 只有 index-l0（FabricDocStore 独有的第二个写入点 readProcessedFile）
  const specs = [
    {
      name: "fabric",
      Store: FabricDocStore,
      dir: (v) => [`fabric_${v}`, "fabric-docs", v],
      make: (r) => new FabricDocStore(r, CHURN[0]),
      trees: [
        { ver: "9.8.1", kind: "l2" },
        { ver: "9.8.2", kind: "thin" },
      ],
    },
    {
      name: "forge",
      Store: ForgeDocStore,
      dir: (v) => [`forge_${v}`, "forge-docs", v],
      make: (r) => new ForgeDocStore(r),
      trees: [{ ver: "9.8.1", kind: "l2" }],
    },
    {
      name: "neoforge",
      Store: NeoForgeDocStore,
      dir: (v) => [`neoforge_${v}`, "neoforge-docs", v],
      make: (r) => new NeoForgeDocStore(r),
      trees: [{ ver: "9.8.1", kind: "l2" }],
    },
  ];

  for (const spec of specs) {
    const root = mkdtempSync(join(tmpdir(), `mc-doc-cache-${spec.name}-`));
    try {
      const put = (v, file, text) => {
        const dir = join(root, ...spec.dir(v));
        mkdirSync(join(dir, "processed"), { recursive: true });
        writeFileSync(join(dir, file), text, "utf8");
      };
      for (const v of CHURN) {
        // l0 必须非空：NeoForge 空 l0 提前 return，走不到符号索引
        put(v, "index-l0.json", JSON.stringify([{ id: `${v}/stub`, label: "registry", tags: [] }]));
        put(v, "index-l1.json", "[]");
      }
      for (const t of spec.trees) {
        const l0 = [];
        const l2 = [];
        for (let i = 0; i < PAGES; i += 1) {
          const id = pageId(i);
          l0.push({ id: `${t.ver}/${id}`, label: id, tags: [] });
          l2.push({ id: `${t.ver}/${id}`, label: id, tags: [], processedFile: `processed/${id}.md` });
          const dir = join(root, ...spec.dir(t.ver), "processed");
          mkdirSync(dir, { recursive: true });
          writeFileSync(join(dir, `${id}.md`), `# ${id}\n\n正文\n`, "utf8");
        }
        put(t.ver, "index-l0.json", JSON.stringify(l0));
        if (t.kind === "l2") {
          put(t.ver, "index-l1.json", "[]");
          put(t.ver, "index-l2.json", JSON.stringify(l2));
        }
      }

      const store = spec.make(root);
      for (const v of CHURN) store.searchIndexDetailed("registry", v);
      const IDX = spec.Store.INDEX_CACHE_MAX;
      const SYM = spec.Store.SYMBOL_CACHE_MAX;
      const FILE = spec.Store.FILE_CACHE_MAX;
      assert.ok(IDX === 64 && SYM === 64 && FILE === 256, `${spec.name} 上界被改动 ${IDX}/${SYM}/${FILE}`);
      assert.equal(store.indexCache.size, IDX, `${spec.name} indexCache 没收敛到上界`);
      assert.equal(store.symbolIndexCache.size, SYM, `${spec.name} symbolIndexCache 没收敛到上界`);
      assert.equal(hasVer(store.indexCache, CHURN[0]), false, `${spec.name} 最旧 index 条目没被淘汰`);
      assert.equal(hasVer(store.indexCache, CHURN[CHURN.length - 1]), true, `${spec.name} 最新 index 条目丢了`);
      assert.equal(hasVer(store.symbolIndexCache, CHURN[0]), false, `${spec.name} 最旧符号索引没被淘汰`);
      assert.equal(hasVer(store.symbolIndexCache, CHURN[CHURN.length - 1]), true, `${spec.name} 最新符号索引丢了`);

      for (const t of spec.trees) {
        for (let i = 0; i < PAGES; i += 1) {
          await store.loadFullDoc(`${t.ver}/${pageId(i)}`, t.ver);
        }
        assert.equal(store.fileCache.size, FILE, `${spec.name} ${t.kind} 树 fileCache 没收敛到上界`);
        assert.equal(
          hasPage(store.fileCache, t.ver, `${pageId(0)}.md`),
          false,
          `${spec.name} ${t.kind} 树最旧正文没被淘汰`,
        );
        assert.equal(
          hasPage(store.fileCache, t.ver, `${pageId(PAGES - 1)}.md`),
          true,
          `${spec.name} ${t.kind} 树最新正文丢了`,
        );
      }
      console.log(`A-32 ${spec.name} index/symbol/file 缓存上界（${spec.trees.map((t) => t.kind).join("+")}）: ok`);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  }
}

// ── A-32b：ttlCacheSet 自带淘汰 = 上界 + 丢最旧（searchCache / relatedCache 全靠它兜底）──
{
  const { ttlCacheGet, ttlCacheSet } = await import("./dist/docs-platform/search-utils.js");
  const MAX = 8;
  const map = new Map();
  for (let i = 0; i < MAX + 6; i += 1) ttlCacheSet(map, `k${i}`, i, MAX, 60_000);
  assert.equal(map.size, MAX, `ttlCacheSet 没兜住条数上界：${map.size}`);
  assert.equal(ttlCacheGet(map, "k0"), undefined, "ttlCacheSet 丢的不是最旧插入项");
  assert.equal(ttlCacheGet(map, `k${MAX + 5}`), MAX + 5, "最新条目丢了");

  const order = [...map.keys()];
  ttlCacheSet(map, order[1], 999, MAX, 60_000); // 覆盖已有 key
  assert.equal(map.size, MAX, "覆盖已有 key 让条目数增长");
  assert.deepEqual([...map.keys()], order, "覆盖已有 key 改变了淘汰顺序");
  assert.equal(ttlCacheGet(map, order[1]), 999);

  const expiring = new Map();
  ttlCacheSet(expiring, "gone", 1, MAX, -1);
  assert.equal(ttlCacheGet(expiring, "gone"), undefined, "过期条目仍可读");
  assert.equal(expiring.size, 0, "读侧没回收过期条目（幽灵条目永久占位）");
  console.log("ttlCacheSet 上界 + 丢最旧 + 覆盖不重排 + 读侧回收过期: ok");
}

console.log("test-assistant-gaps: all passed");

