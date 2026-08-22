/**
 * 契约：VERSION_REQUIRED、get_version_info 仅 Forge、Architectury PICK_PLATFORM、
 * worldgen platform、topic 别名、Neo 主档 Skill 必须含 search_neoforge_docs。
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
const { generateWorldgen, generateNetworkPacket } = await import("./dist/generators/index.js");
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
}

console.log("test-assistant-gaps: all passed");

