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
  for (const thin of ["1.20.6", "1.21.5", "1.21.10"]) {
    assert.equal(skillPath(thin, "mc-entity"), null, `薄档 ${thin} 不应扩 mc-entity`);
  }
  console.log("Neo main skills search_neoforge_docs: ok");
}

console.log("test-assistant-gaps: all passed");
