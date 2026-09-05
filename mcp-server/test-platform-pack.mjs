/**
 * platform-pack：session / detect / write dryRun / 标记块 / 回滚 / deactivate。
 */
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repo = join(dirname(fileURLToPath(import.meta.url)), "..");

const { sessionPlatformPack } = await import("./dist/platform-pack/session.js");
const { detectModProject } = await import("./dist/platform-pack/detect.js");
const { activatePlatformPack } = await import("./dist/platform-pack/index.js");
const { packWriteTestHooks } = await import("./dist/platform-pack/write.js");
const { fabricRulesOverlay, inspectPack, coversMcVersion, FABRIC_SKILL_DONORS, wrapBanneredBody, parseFrontmatterMap, frontmatterDescription, listLibSkillIndex } = await import("./dist/platform-pack/catalog.js");
const { upsertHostMarker, beginMarker, entryBody, hostLayout } = await import("./dist/platform-pack/hosts.js");
const { stripUtf8Bom } = await import("./dist/utils/text.js");

const savedRoot = process.env.MC_SKILL_PROJECT_ROOT;
const savedAllow = process.env.MC_SKILL_ALLOW_WRITE;
delete process.env.MC_SKILL_PROJECT_ROOT;
delete process.env.MC_SKILL_ALLOW_WRITE;

{
  const s = sessionPlatformPack({ platform: "neoforge", minecraftVersion: "1.21.1" });
  assert.equal(s.ok, true, JSON.stringify(s).slice(0, 300));
  assert.ok(String(s.agents).includes("NeoForge") || String(s.agents).length > 20);
  const ids = (s.rules ?? []).map((r) => r.id);
  assert.ok(ids.includes("01"), `session 默认应含 01，got ${ids}`);
  console.log(`session neoforge 1.21.1 rules=${ids.join(",")}`);
}

{
  const s20 = sessionPlatformPack({ platform: "neoforge", minecraftVersion: "1.21.1", topics: ["20"] });
  assert.equal(s20.ok, true, JSON.stringify(s20).slice(0, 300));
  const w20 = (s20.warnings ?? []).join(" | ");
  assert.ok(/伪规则/.test(w20) && /20/.test(w20), w20);
  const ids20 = (s20.rules ?? []).map((r) => r.id);
  assert.ok(!ids20.includes("20"), ids20.join(","));
  console.log("topics 20 rejected: ok");
}

{
  const q = sessionPlatformPack({ platform: "quilt", minecraftVersion: "1.21.1" });
  assert.equal(q.ok, true);
  assert.ok(q.overlay, "quilt overlay field");
  assert.equal(q.overlay.status, "ok", "quilt 1.21.1 有对应 fabric/1.21.1 规则树");
  assert.ok(String(q.agents).toLowerCase().includes("quilt"));
  const names = (q.skills ?? []).map((s) => s.name);
  assert.ok(names.includes("mc-registry") || names.includes("mc-block"), `quilt skills=${names.join(",")}`);
  const fromFab = (q.skills ?? []).filter((s) => s.source && String(s.source).startsWith("fabric/"));
  assert.ok(fromFab.length > 0, "quilt session 应并集 Fabric Skill");
  assert.ok(fromFab.every((s) => s.mappingNote && /class_/.test(s.mappingNote)), JSON.stringify(fromFab[0]));
  const fake = fabricRulesOverlay("9.9.9", repo);
  assert.equal(fake.status, "missing");
  const tmpOverlay = mkdtempSync(join(tmpdir(), "mc-quilt-ov-"));
  mkdirSync(join(tmpOverlay, "fabric", "9.8.8", ".cursor", "rules"), { recursive: true });
  writeFileSync(join(tmpOverlay, "fabric", "9.8.8", "AGENTS.md"), "# fabric 9.8.8\n", "utf8");
  const mismatch = fabricRulesOverlay("9.8.8", tmpOverlay);
  assert.equal(mismatch.status, "version_mismatch");
  rmSync(tmpOverlay, { recursive: true, force: true });
  console.log(`quilt overlay status=${q.overlay.status} missing-test=${fake.status} mismatch=${mismatch.status}`);
}

{
  const d = detectModProject({});
  assert.equal(d.ok, false);
  assert.equal(d.action?.code, "PROJECT_ROOT_REQUIRED");
  console.log("detect without root: PROJECT_ROOT_REQUIRED");
}

{
  const noHosts = activatePlatformPack({
    action: "write",
    platform: "neoforge",
    minecraftVersion: "1.21.1",
    projectPath: join(repo, "mcp-server"),
  });
  assert.equal(noHosts.ok, false);
  assert.match(String(noHosts.action?.message ?? ""), /hosts/);
  console.log("write without hosts: error");
}

{
  const refuse = activatePlatformPack({
    action: "write",
    platform: "neoforge",
    minecraftVersion: "1.21.1",
    hosts: ["cursor"],
    projectPath: repo,
    dryRun: true,
  });
  assert.equal(refuse.ok, false);
  assert.equal(refuse.action?.code, "REFUSE_KNOWLEDGE_REPO");
  console.log("write knowledge repo: REFUSE_KNOWLEDGE_REPO");
}

{
  const tmp = mkdtempSync(join(tmpdir(), "mc-pack-"));
  const preview = activatePlatformPack({
    action: "write",
    platform: "neoforge",
    minecraftVersion: "1.21.1",
    hosts: ["cursor", "pi"],
    projectPath: tmp,
    dryRun: true,
  });
  assert.equal(preview.ok, true);
  assert.equal(preview.dryRun, true);
  assert.ok(preview.howToWrite?.cli?.includes("--project"));
  assert.ok(!String(preview.howToWrite?.cli).includes("--projectRoot="));
  const rels = (preview.planned ?? []).map((p) => p.rel);
  assert.ok(rels.some((r) => r.includes(".cursor/rules/mc-skill-")), rels.slice(0, 5).join(","));
  assert.ok(rels.some((r) => r.includes(".pi/rules/")), "pi rules");
  rmSync(tmp, { recursive: true, force: true });
  console.log(`write dryRun cursor+pi files=${rels.length}`);
}

{
  const tmp = mkdtempSync(join(tmpdir(), "mc-pack-oc-"));
  const preview = activatePlatformPack({
    action: "write",
    platform: "neoforge",
    minecraftVersion: "1.21.1",
    hosts: ["opencode", "codex"],
    projectPath: tmp,
    dryRun: true,
  });
  const agents = (preview.planned ?? []).filter((p) => p.rel === "AGENTS.md");
  assert.equal(agents.length, 2, "two AGENTS.md marker ops");
  assert.ok(agents.some((p) => p.host === "opencode"));
  assert.ok(agents.some((p) => p.host === "codex"));
  const sample = upsertHostMarker("", "opencode", "neoforge", "1.21.1", "A");
  const both = upsertHostMarker(sample, "codex", "neoforge", "1.21.1", "B");
  assert.ok(both.includes("host=opencode"));
  assert.ok(both.includes("host=codex"));
  assert.ok(both.includes(beginMarker("opencode", "neoforge", "1.21.1")));
  rmSync(tmp, { recursive: true, force: true });
  console.log("opencode+codex distinct host= markers");
}

{
  const once = upsertHostMarker("", "claude", "neoforge", "1.21.1", "BODY");
  const twice = upsertHostMarker(once, "claude", "neoforge", "1.21.1", "BODY");
  assert.equal(twice, once, "second upsert with same body must not append");
  const changed = upsertHostMarker(once, "claude", "neoforge", "1.21.1", "BODY2");
  assert.equal((changed.match(/BEGIN MC_SKILL_PACK host=claude\b/g) || []).length, 1);
  assert.ok(changed.includes("BODY2"));
  const stacked = `${once}${once}`;
  const cleaned = upsertHostMarker(stacked, "claude", "neoforge", "1.21.1", "BODY");
  assert.equal((cleaned.match(/BEGIN MC_SKILL_PACK host=claude\b/g) || []).length, 1, cleaned);
  assert.ok(cleaned.includes("BODY"));
  console.log("upsertHostMarker idempotent + stacked collapse: ok");
}

{
  assert.equal(hostLayout("opencode").rulesDir, undefined);
  assert.equal(hostLayout("codex").rulesDir, undefined);
  assert.equal(hostLayout("zcode").rulesDir, undefined);
  const ocBody = entryBody("opencode", "neoforge", "1.21.1");
  assert.doesNotMatch(ocBody, /规则见.*\.cursor\/rules/);
  assert.match(ocBody, /本宿主不落盘规则/);
  assert.match(ocBody, /不要假设 \.cursor\/rules/);
  assert.match(ocBody, /\.opencode\/skills/);
  const claudeBody = entryBody("claude", "neoforge", "1.21.1");
  assert.match(claudeBody, /\.claude\/rules\/mc-skill-/);
  const tmp = mkdtempSync(join(tmpdir(), "mc-pack-oc-norules-"));
  const preview = activatePlatformPack({
    action: "write",
    platform: "neoforge",
    minecraftVersion: "1.21.1",
    hosts: ["opencode"],
    projectPath: tmp,
    writeSkillStubs: false,
    dryRun: true,
  });
  assert.equal(preview.ok, true, JSON.stringify(preview).slice(0, 400));
  const rels = (preview.planned ?? []).map((p) => p.rel);
  assert.ok(!rels.some((r) => /\/rules\//.test(r) || r.includes(".cursor/rules")), rels.join(","));
  assert.ok(rels.includes("AGENTS.md"), rels.join(","));
  const claudePrev = activatePlatformPack({
    action: "write",
    platform: "neoforge",
    minecraftVersion: "1.21.1",
    hosts: ["claude"],
    projectPath: tmp,
    writeSkillStubs: false,
    dryRun: true,
  });
  const claudeRels = (claudePrev.planned ?? []).map((p) => p.rel);
  assert.ok(claudeRels.some((r) => r.includes(".claude/rules/mc-skill-")), claudeRels.slice(0, 8).join(","));
  rmSync(tmp, { recursive: true, force: true });
  console.log("opencode no rulesDir / claude rules path: ok");
}

{
  const tmp = mkdtempSync(join(tmpdir(), "mc-pack-w-"));
  mkdirSync(join(tmp, ".cursor", "rules"), { recursive: true });
  writeFileSync(join(tmp, ".cursor", "rules", "user.mdc"), "# user rule\n", "utf8");
  process.env.MC_SKILL_ALLOW_WRITE = "1";
  const written = activatePlatformPack({
    action: "write",
    platform: "neoforge",
    minecraftVersion: "1.21.1",
    hosts: ["cursor", "opencode", "codex"],
    projectPath: tmp,
    dryRun: false,
    confirmed: true,
  });
  assert.equal(written.ok, true, JSON.stringify(written).slice(0, 500));
  assert.equal(readFileSync(join(tmp, ".cursor", "rules", "user.mdc"), "utf8"), "# user rule\n");
  assert.ok(existsSync(join(tmp, ".mc-skill", "pack-manifest.json")));
  const agents = readFileSync(join(tmp, "AGENTS.md"), "utf8");
  assert.ok(agents.includes("host=opencode"));
  assert.ok(agents.includes("host=codex"));
  assert.doesNotMatch(agents, /规则见.*\.cursor\/rules/);

  packWriteTestHooks.failBeforeRel = undefined;
  const deact = activatePlatformPack({
    action: "deactivate",
    hosts: ["cursor", "opencode", "codex"],
    projectPath: tmp,
    dryRun: false,
    confirmed: true,
  });
  assert.equal(deact.ok, true, JSON.stringify(deact).slice(0, 400));
  assert.equal(existsSync(join(tmp, ".cursor", "rules", "user.mdc")), true);
  assert.equal(readFileSync(join(tmp, ".cursor", "rules", "user.mdc"), "utf8"), "# user rule\n");
  const leftover = existsSync(join(tmp, "AGENTS.md")) ? readFileSync(join(tmp, "AGENTS.md"), "utf8") : "";
  assert.ok(!leftover.includes("BEGIN MC_SKILL_PACK"));
  rmSync(tmp, { recursive: true, force: true });
  delete process.env.MC_SKILL_ALLOW_WRITE;
  console.log("write+deactivate preserves user.mdc");
}

{
  const tmp = mkdtempSync(join(tmpdir(), "mc-pack-addhost-"));
  process.env.MC_SKILL_ALLOW_WRITE = "1";
  writeFileSync(join(tmp, "AGENTS.md"), "USER PREAMBLE\n", "utf8");
  const first = activatePlatformPack({
    action: "write",
    platform: "neoforge",
    minecraftVersion: "1.21.1",
    hosts: ["opencode"],
    projectPath: tmp,
    dryRun: false,
    confirmed: true,
  });
  assert.equal(first.ok, true, JSON.stringify(first).slice(0, 400));
  const second = activatePlatformPack({
    action: "write",
    platform: "neoforge",
    minecraftVersion: "1.21.1",
    hosts: ["codex"],
    projectPath: tmp,
    dryRun: false,
    confirmed: true,
  });
  assert.equal(second.ok, true, JSON.stringify(second).slice(0, 400));
  const both = readFileSync(join(tmp, "AGENTS.md"), "utf8");
  assert.ok(both.includes("host=opencode") && both.includes("host=codex"), both.slice(0, 400));
  const deact = activatePlatformPack({
    action: "deactivate",
    hosts: ["opencode", "codex"],
    projectPath: tmp,
    dryRun: false,
    confirmed: true,
  });
  assert.equal(deact.ok, true, JSON.stringify(deact).slice(0, 400));
  const leftover = existsSync(join(tmp, "AGENTS.md")) ? readFileSync(join(tmp, "AGENTS.md"), "utf8") : "";
  assert.ok(!leftover.includes("BEGIN MC_SKILL_PACK"), leftover.slice(0, 300));
  assert.ok(leftover.includes("USER PREAMBLE"), leftover.slice(0, 300));
  rmSync(tmp, { recursive: true, force: true });
  delete process.env.MC_SKILL_ALLOW_WRITE;
  console.log("write then add host then deactivate: ok");
}

{
  const tmp = mkdtempSync(join(tmpdir(), "mc-pack-rb-"));
  process.env.MC_SKILL_ALLOW_WRITE = "1";
  packWriteTestHooks.failBeforeRel = ".cursor/rules/mc-skill-01-registry.mdc";
  const fail = activatePlatformPack({
    action: "write",
    platform: "neoforge",
    minecraftVersion: "1.21.1",
    hosts: ["cursor"],
    projectPath: tmp,
    dryRun: false,
    confirmed: true,
  });
  packWriteTestHooks.failBeforeRel = undefined;
  assert.equal(fail.ok, false);
  assert.equal(fail.rolledBack, true);
  assert.ok(fail.action, JSON.stringify(fail).slice(0, 400));
  assert.ok(fail.partial, "中途失败应带 partial");
  const rulesDir = join(tmp, ".cursor", "rules");
  const leftover = existsSync(rulesDir)
    ? (await import("node:fs")).readdirSync(rulesDir).filter((n) => n.startsWith("mc-skill-"))
    : [];
  assert.equal(leftover.length, 0, `rollback leftover ${leftover}`);
  rmSync(tmp, { recursive: true, force: true });
  delete process.env.MC_SKILL_ALLOW_WRITE;
  console.log("write rollback: ok");
}

{
  const tmp = mkdtempSync(join(tmpdir(), "mc-pack-proj-"));
  delete process.env.MC_SKILL_PROJECT_ROOT;
  const preview = activatePlatformPack({
    action: "write",
    platform: "neoforge",
    minecraftVersion: "1.21.1",
    hosts: ["cursor"],
    projectPath: tmp,
    dryRun: true,
  });
  assert.equal(preview.ok, true);
  assert.equal(preview.resolvedProjectRoot, tmp);
  assert.ok(preview.howToWrite.cli.includes(tmp) || preview.howToWrite.cli.includes("--project"));
  rmSync(tmp, { recursive: true, force: true });
  console.log("write --project only (no env): ok");
}

{
  // MC_SKILL_PROJECT_ROOT 为硬边界（AND 口径）：env root 外的 projectPath 真写必须拒绝并带 breakingChange 标识（F-B01）
  const envRoot = mkdtempSync(join(tmpdir(), "mc-pack-env-"));
  const outside = mkdtempSync(join(tmpdir(), "mc-pack-out-"));
  const inside = join(envRoot, "proj");
  mkdirSync(inside, { recursive: true });
  process.env.MC_SKILL_ALLOW_WRITE = "1";
  process.env.MC_SKILL_PROJECT_ROOT = envRoot;
  try {
    const blocked = activatePlatformPack({
      action: "write",
      platform: "neoforge",
      minecraftVersion: "1.21.1",
      hosts: ["cursor"],
      projectPath: outside,
      dryRun: false,
      confirmed: true,
    });
    assert.equal(blocked.ok, false, JSON.stringify(blocked).slice(0, 400));
    assert.equal(blocked.breakingChange, true);
    assert.equal(blocked.action.code, "PATH_OUTSIDE_ALLOWLIST");
    assert.ok(!existsSync(join(outside, ".mc-skill", "pack-manifest.json")), "outside root must stay untouched");

    const written = activatePlatformPack({
      action: "write",
      platform: "neoforge",
      minecraftVersion: "1.21.1",
      hosts: ["cursor"],
      projectPath: inside,
      dryRun: false,
      confirmed: true,
    });
    assert.equal(written.ok, true, JSON.stringify(written).slice(0, 400));
    assert.equal(
      String(written.allowRoot ?? "").toLowerCase(),
      envRoot.toLowerCase(),
      "allowRoot must be the env root",
    );
    assert.ok(existsSync(join(inside, ".mc-skill", "pack-manifest.json")));
  } finally {
    rmSync(envRoot, { recursive: true, force: true });
    rmSync(outside, { recursive: true, force: true });
    rmSync(inside, { recursive: true, force: true });
    delete process.env.MC_SKILL_PROJECT_ROOT;
    delete process.env.MC_SKILL_ALLOW_WRITE;
  }
  console.log("write env-root AND boundary (breakingChange on outside): ok");
}

{
  // 知识库整树禁写（F-B05）：版本子目录无根特征也必须拒绝，防止规则源自我污染
  const knowledgeSubdir = join(repo, "forge", "1.20.1");
  const refused = activatePlatformPack({
    action: "write",
    platform: "forge",
    minecraftVersion: "1.20.1",
    hosts: ["cursor"],
    projectPath: knowledgeSubdir,
    dryRun: false,
    confirmed: true,
  });
  assert.equal(refused.ok, false, JSON.stringify(refused).slice(0, 400));
  assert.equal(refused.action.code, "REFUSE_KNOWLEDGE_REPO");
  console.log("write into knowledge repo subtree refused: ok");
}

{
  const tmp = mkdtempSync(join(tmpdir(), "mc-pack-sk-"));
  process.env.MC_SKILL_ALLOW_WRITE = "1";
  const written = activatePlatformPack({
    action: "write",
    platform: "neoforge",
    minecraftVersion: "1.21.1",
    hosts: ["cursor"],
    projectPath: tmp,
    includeSkills: true,
    dryRun: false,
    confirmed: true,
  });
  assert.equal(written.ok, true, JSON.stringify(written).slice(0, 400));
  const stubDir = join(tmp, ".cursor", "skills");
  assert.equal(existsSync(stubDir), true, "includeSkills writes .cursor/skills");
  const { readdirSync } = await import("node:fs");
  const skillDirs = readdirSync(stubDir);
  assert.ok(skillDirs.length > 0, "at least one skill stub");
  const stub = readFileSync(join(stubDir, skillDirs[0], "SKILL.md"), "utf8");
  assert.ok(!/[A-Za-z]:\\/.test(stub) && !/H:\//.test(stub), "stub must not embed drive-letter paths");
  assert.ok(stub.includes("activate_platform_pack action=session"));
  assert.match(stub, /neoforge\/1\.21\.1\//);
  rmSync(tmp, { recursive: true, force: true });
  delete process.env.MC_SKILL_ALLOW_WRITE;
  console.log(`includeSkills stub host=cursor skills=${skillDirs.length}`);
}

{
  const { findPack, listPacks, inspectPack, listSameSeriesCandidates } = await import("./dist/platform-pack/catalog.js");
  const tmpRepo = mkdtempSync(join(tmpdir(), "mc-pack-draft-"));
  const packDir = join(tmpRepo, "neoforge", "9.9.9");
  mkdirSync(join(packDir, ".cursor", "rules"), { recursive: true });
  writeFileSync(join(packDir, "AGENTS.md"), "# draft\npack-status: draft\n", "utf8");
  writeFileSync(
    join(packDir, "pack.meta.json"),
    JSON.stringify({ status: "draft", "pack-status": "draft" }),
    "utf8",
  );
  writeFileSync(join(packDir, ".cursor", "rules", "00-project-setup.mdc"), "FIXME\n", "utf8");
  assert.equal(findPack("neoforge", "9.9.9", tmpRepo), null);
  const inspected = inspectPack("neoforge", "9.9.9", tmpRepo);
  assert.equal(inspected?.status, "draft");
  const listed = listPacks(tmpRepo);
  assert.ok(listed.drafts.some((d) => d.minecraftVersion === "9.9.9"));
  assert.ok(!listed.packs.some((p) => p.minecraftVersion === "9.9.9"));

  // F-BV01：完整版本落空时按家族前缀给同系列候选（'1.21.5' → 1.21.x 家族），不再恒空
  const c1211 = listSameSeriesCandidates("fabric", "1.21", repo);
  assert.ok(c1211.length > 0, `fabric 1.21 partial should list series, got ${c1211}`);
  const c1215 = listSameSeriesCandidates("fabric", "1.21.5", repo);
  assert.ok(c1215.length > 0, `fabric 1.21.5 full-version miss should list family, got ${c1215}`);
  assert.ok(c1215.includes("1.21.4") && c1215.includes("1.21.8"), `expected 1.21.4/1.21.8 in ${c1215}`);
  // 两段版本不启用家族回退（不得误收 1.12.x）
  assert.ok(!c1211.some((v) => v.startsWith("1.12.")), `1.21 must not match 1.12.x: ${c1211}`);
  rmSync(tmpRepo, { recursive: true, force: true });
  console.log("draft pack: findPack PACK_NOT_FOUND, listPacks drafts[]");
}

function sessionRuleIds(s) {
  return (s.rules ?? []).map((r) => r.id);
}

function assertHasRuleIds(s, want, label) {
  const ids = sessionRuleIds(s);
  for (const w of want) {
    assert.ok(ids.includes(w), `${label}: missing ${w} in ${ids.join(",")}`);
  }
}

{
  const s = sessionPlatformPack({ platform: "neoforge", minecraftVersion: "1.21.1", topics: ["10"] });
  assert.equal(s.ok, true);
  assertHasRuleIds(s, ["00", "01", "09", "10"], "topics 10");
  assert.equal(s.rulesMode, "extended");
  console.log("session topics 10 additive: ok");
}

{
  const s = sessionPlatformPack({
    platform: "neoforge",
    minecraftVersion: "1.21.1",
    skillNames: ["mc-gui"],
  });
  assert.equal((s.skillBodies ?? []).length, 1);
  assert.equal(s.skillBodies[0].name, "mc-gui");
  assert.ok(s.skillBodies[0].absPath, "skillBodies absPath");
  assert.ok(s.skills?.some((x) => x.absPath), "skills[].absPath");
  console.log("session skillNames mc-gui: ok");
}

{
  const s = sessionPlatformPack({
    platform: "neoforge",
    minecraftVersion: "1.21.1",
    skillNames: ["mc-not-a-real-skill"],
  });
  assert.equal((s.skillBodies ?? []).length, 0);
  assert.ok((s.warnings ?? []).some((w) => /mc-not-a-real-skill/.test(w)));
  console.log("session unknown skillName: ok");
}

{
  const s = sessionPlatformPack({ platform: "neoforge", minecraftVersion: "1.21.1", task: "mc-new-gui" });
  assertHasRuleIds(s, ["00", "01", "09", "10", "08", "06"], "task mc-new-gui");
  assert.equal(s.rulesMode, "extended");
  const names = (s.skillBodies ?? []).map((b) => b.name);
  assert.ok(names.includes("mc-gui"), `bodies=${names.join(",")}`);
  console.log("session task mc-new-gui: ok");
}

{
  const s = sessionPlatformPack({
    platform: "neoforge",
    minecraftVersion: "1.21.1",
    task: "mc-new-gui",
    topics: ["02"],
  });
  assertHasRuleIds(s, ["00", "01", "09", "10", "08", "06", "02"], "task+topics union");
  console.log("session task+topics union: ok");
}

{
  const s = sessionPlatformPack({
    platform: "neoforge",
    minecraftVersion: "1.21.1",
    task: "mc-new-gui",
    skillNames: ["mc-gui"],
  });
  assert.equal((s.skillBodies ?? []).length, 1);
  assert.equal(s.skillBodies[0].name, "mc-gui");
  console.log("session task+skillNames dedupe mc-gui: ok");
}

{
  const s = sessionPlatformPack({ platform: "neoforge", minecraftVersion: "1.21.1", topics: ["mixin"] });
  assert.deepEqual(sessionRuleIds(s).sort(), ["00", "01", "09"]);
  assert.equal((s.skillBodies ?? []).length, 0);
  assert.ok((s.nextReads ?? []).some((n) => n.name === "mc-mixin"), JSON.stringify(s.nextReads));
  console.log("session topics mixin nextReads: ok");
}

{
  const s = sessionPlatformPack({ platform: "neoforge", minecraftVersion: "1.21.1", task: "mc-new-entity" });
  assertHasRuleIds(s, ["04"], "task entity");
  assert.ok((s.skillBodies ?? []).some((b) => b.name === "mc-entity"));
  console.log("session full pack mc-new-entity: ok");
}

{
  const s = sessionPlatformPack({ platform: "neoforge", minecraftVersion: "1.20.6", task: "mc-new-entity" });
  assertHasRuleIds(s, ["00", "01", "09", "04"], "thin 1.20.6 entity");
  const entity = (s.skillBodies ?? []).find((b) => b.name === "mc-entity");
  assert.ok(entity, "thin 1.20.6 should inject local mc-entity");
  assert.doesNotMatch(String(entity.text), /\[DONOR_SKILL 禁止直接抄写\]/);
  assert.match(String(entity.text), /search_neoforge_docs/);
  assert.match(String(entity.text), /version=1\.20\.6/);
  const entIdx = (s.skills ?? []).find((x) => x.name === "mc-entity");
  assert.match(String(entIdx?.relPosix ?? ""), /neoforge\/1\.20\.6/);
  console.log("session neo 1.20.6 thin entity: ok");
}

{
  const s = sessionPlatformPack({
    platform: "neoforge",
    minecraftVersion: "1.21.1",
    skillNames: ["mc-gui", "mc-item", "mc-block", "mc-entity", "mc-events", "mc-networking", "mc-mixin", "mc-datagen", "mc-recipe"],
  });
  assert.equal((s.skillBodies ?? []).length, 8);
  assert.ok((s.warnings ?? []).some((w) => /上限 8/.test(w)));
  console.log("session skillBodies cap 8: ok");
}

{
  const s = sessionPlatformPack({ platform: "neoforge", minecraftVersion: "1.21.1", task: "mc-mixin" });
  assertHasRuleIds(s, ["09"], "task mc-mixin");
  assert.ok((s.skillBodies ?? []).some((b) => b.name === "mc-mixin") || (s.nextReads ?? []).some((n) => n.name === "mc-mixin"));
  console.log("session task mc-mixin injects 09: ok");
}

{
  const s = sessionPlatformPack({ platform: "neoforge", minecraftVersion: "1.21.1" });
  assert.equal(s.ok, true);
  assert.equal(s.rulesMode, "base");
  assertHasRuleIds(s, ["00", "01", "09"], "default base");
  assert.ok((s.warnings ?? []).some((w) => /已加载底座规则 00\/01\/09/.test(w)));
  assert.ok((s.warnings ?? []).some((w) => /传 task 或 topics/.test(w)));
  console.log("session default base warning: ok");
}

{
  const s = sessionPlatformPack({
    platform: "neoforge",
    minecraftVersion: "1.21.1",
    task: "not-a-real-task",
  });
  assert.equal(s.rulesMode, "base");
  assertHasRuleIds(s, ["00", "01", "09"], "unknown task");
  console.log("session unknown task base: ok");
}

{
  const s = sessionPlatformPack({
    platform: "neoforge",
    minecraftVersion: "1.21.1",
    task: "not-a-real-task",
    topics: ["02"],
  });
  assert.equal(s.rulesMode, "extended");
  assertHasRuleIds(s, ["00", "01", "09", "02"], "unknown task + topics union");
  assert.ok((s.warnings ?? []).some((w) => /未知 task/.test(w)));
  console.log("session unknown task topics union: ok");
}

{
  for (const proto of ["constructor", "__proto__", "prototype"]) {
    const s = sessionPlatformPack({
      platform: "neoforge",
      minecraftVersion: "1.21.1",
      task: proto,
    });
    assert.equal(s.rulesMode, "base", proto);
    assertHasRuleIds(s, ["00", "01", "09"], `proto ${proto}`);
    assert.equal(sessionRuleIds(s).some((id) => !["00", "01", "09"].includes(id)), false, proto);
    assert.ok((s.warnings ?? []).some((w) => /未知 task/.test(w)), proto);
  }
  console.log("session proto task constructor/__proto__/prototype: ok");
}

{
  const s = sessionPlatformPack({
    platform: "neoforge",
    minecraftVersion: "1.21.1",
    task: "mc-config",
  });
  assert.ok(!(s.warnings ?? []).some((w) => /未知 task/.test(w)), (s.warnings ?? []).join(" | "));
  assertHasRuleIds(s, ["00", "01", "09"], "mc-config base rules");
  console.log("session task mc-config known: ok");
}

{
  const s = sessionPlatformPack({
    platform: "neoforge",
    minecraftVersion: "1.21.1",
    task: "mc-gametest",
  });
  assert.ok(!(s.warnings ?? []).some((w) => /未知 task/.test(w)), (s.warnings ?? []).join(" | "));
  console.log("session task mc-gametest known: ok");
}

{
  const s = sessionPlatformPack({
    platform: "neoforge",
    minecraftVersion: "1.21.1",
    task: "mc-bedrock-addon",
  });
  assert.equal(s.rulesMode, "base");
  assert.deepEqual(sessionRuleIds(s).sort(), ["00", "01", "09"]);
  assert.ok((s.warnings ?? []).some((w) => /bedrock|search_bedrock_docs/i.test(w)), (s.warnings ?? []).join(" | "));
  console.log("session task mc-bedrock-addon base: ok");
}

{
  const s = sessionPlatformPack({
    platform: "neoforge",
    minecraftVersion: "1.21.1",
    task: "mc-recipe-data",
  });
  assertHasRuleIds(s, ["00", "01", "07", "09"], "mc-recipe-data");
  assert.equal(s.rulesMode, "extended");
  console.log("session task mc-recipe-data: ok");
}

{
  const { listWorkflowTemplateNames } = await import("./dist/prompts/templates.js");
  for (const name of listWorkflowTemplateNames()) {
    const s = sessionPlatformPack({
      platform: "neoforge",
      minecraftVersion: "1.21.1",
      task: name,
    });
    assert.ok(!(s.warnings ?? []).some((w) => /未知 task/.test(w)), `${name}: ${(s.warnings ?? []).join(" | ")}`);
  }
  console.log("session all workflow template names known: ok");
}

{
  const s = sessionPlatformPack({
    platform: "neoforge",
    minecraftVersion: "1.21.1",
    topics: ["not-a-topic"],
  });
  assert.equal(s.rulesMode, "base");
  assertHasRuleIds(s, ["00", "01", "09"], "illegal topics");
  assert.ok((s.warnings ?? []).some((w) => /not-a-topic/.test(w)));
  console.log("session illegal topics base: ok");
}

{
  const tmp = mkdtempSync(join(tmpdir(), "mc-quilt-sess-"));
  const packDir = join(tmp, "quilt", "9.8.8");
  mkdirSync(join(packDir, ".cursor", "rules"), { recursive: true });
  writeFileSync(join(packDir, "AGENTS.md"), "# quilt 9.8.8\n", "utf8");
  writeFileSync(join(packDir, ".cursor", "rules", "00-project-setup.mdc"), "# 00\n", "utf8");
  writeFileSync(join(packDir, ".cursor", "rules", "01-registry.mdc"), "# 01\n", "utf8");
  writeFileSync(join(packDir, ".cursor", "rules", "09-anti-patterns.mdc"), "# 09\n", "utf8");
  const q = sessionPlatformPack({
    platform: "quilt",
    minecraftVersion: "9.8.8",
    repoRoot: tmp,
  });
  assert.equal(q.ok, true, JSON.stringify(q).slice(0, 400));
  assert.ok((q.warnings ?? []).some((w) => /overlay|search_fabric_docs/.test(w)), (q.warnings ?? []).join(" | "));
  rmSync(tmp, { recursive: true, force: true });
  console.log("session quilt overlay missing warning: ok");
}

{
  const ll = sessionPlatformPack({ platform: "liteloader", minecraftVersion: "1.12.2" });
  assert.equal(ll.ok, true);
  assert.ok((ll.skills ?? []).some((x) => x.name === "mc-events"), JSON.stringify(ll.skills?.map((x) => x.name)));
  const f17 = sessionPlatformPack({ platform: "forge", minecraftVersion: "1.7.10" });
  assert.equal(f17.ok, true, JSON.stringify(f17.action));
  assert.ok((f17.skills ?? []).some((x) => x.name === "mc-registry"));
  console.log("session empty platform skills warning: ok");
}

{
  const s = sessionPlatformPack({
    platform: "forge",
    minecraftVersion: "1.20.1",
    skillNames: ["mc-geckolib"],
  });
  assert.ok((s.libSkills ?? []).some((x) => x.name === "mc-geckolib"));
  assert.equal((s.skillBodies ?? []).length, 1);
  assert.match(String(s.skillBodies[0].absPath), /knowledge\/libs/);
  assert.ok(!(s.nextReads ?? []).some((n) => n.name === "mc-geckolib"));
  console.log("session forge 1.20.1 geckolib: ok");
}

{
  const s = sessionPlatformPack({
    platform: "forge",
    minecraftVersion: "1.12.2",
    skillNames: ["mc-geckolib"],
  });
  assert.ok((s.libSkills ?? []).some((x) => x.name === "mc-geckolib"));
  assert.equal((s.skillBodies ?? []).length, 1);
  console.log("session forge 1.12.2 geckolib in window: ok");
}

{
  const s = sessionPlatformPack({
    platform: "forge",
    minecraftVersion: "1.7.10",
    skillNames: ["mc-geckolib"],
  });
  assert.ok(!(s.libSkills ?? []).some((x) => x.name === "mc-geckolib"));
  assert.equal((s.skillBodies ?? []).length, 0);
  assert.ok((s.warnings ?? []).some((w) => /mc-geckolib/.test(w)));
  console.log("session forge 1.7.10 geckolib filtered: ok");
}

{
  const s = sessionPlatformPack({ platform: "neoforge", minecraftVersion: "1.21.1", task: "mc-new-gui" });
  const libNames = new Set((s.libSkills ?? []).map((x) => x.name));
  for (const n of s.nextReads ?? []) {
    assert.ok(!libNames.has(n.name), `nextReads must not include lib skill ${n.name}`);
  }
  const viaActivate = activatePlatformPack({
    action: "session",
    platform: "neoforge",
    minecraftVersion: "1.21.1",
    task: "mc-new-gui",
  });
  assertHasRuleIds(viaActivate, ["00", "01", "09", "10", "08", "06"], "activate forward task");
  console.log("session nextReads excludes libSkills: ok");
}

{
  const { listPacks } = await import("./dist/platform-pack/catalog.js");
  const listed = listPacks();
  assert.ok(
    listed.packs.some((p) => p.platform === "forge" && p.minecraftVersion === "1.7.10"),
    JSON.stringify(listed.packs.map((p) => `${p.platform}/${p.minecraftVersion}`).slice(0, 30)),
  );
  assert.ok(!listed.drafts.some((p) => p.platform === "forge" && p.minecraftVersion === "1.7.10"));
  const sess = sessionPlatformPack({ platform: "forge", minecraftVersion: "1.7.10" });
  assert.equal(sess.ok, true, JSON.stringify(sess.action));
  assert.ok((sess.skills ?? []).some((x) => x.name === "mc-registry"));
  const tmp = mkdtempSync(join(tmpdir(), "mc-pack-1710-"));
  const w = activatePlatformPack({
    action: "write",
    platform: "forge",
    minecraftVersion: "1.7.10",
    hosts: ["cursor"],
    projectPath: tmp,
    dryRun: true,
  });
  assert.equal(w.ok, true, JSON.stringify(w.action));
  rmSync(tmp, { recursive: true, force: true });
  console.log("1.7.10 ready session: ok");
}

{
  const still = sessionPlatformPack({ platform: "neoforge", minecraftVersion: "1.21.1" });
  assert.equal(still.ok, true);
  const noVer = sessionPlatformPack({ platform: "forge" });
  assert.notEqual(noVer.action?.code, "VERSION_REQUIRED");
  console.log("session 不传 version 仍非 VERSION_REQUIRED: ok");
}

{
  const tmp = mkdtempSync(join(tmpdir(), "mc-pack-stubdef-"));
  const preview = activatePlatformPack({
    action: "write",
    platform: "neoforge",
    minecraftVersion: "1.21.1",
    hosts: ["cursor"],
    projectPath: tmp,
    dryRun: true,
  });
  assert.equal(preview.ok, true);
  const rels = (preview.planned ?? []).map((p) => p.rel);
  assert.ok(rels.some((r) => /SKILL\.md$/.test(r)), rels.slice(0, 8).join(","));
  rmSync(tmp, { recursive: true, force: true });
  console.log("write default skill stub: ok");
}

{
  const tmp = mkdtempSync(join(tmpdir(), "mc-pack-nostub-"));
  const preview = activatePlatformPack({
    action: "write",
    platform: "neoforge",
    minecraftVersion: "1.21.1",
    hosts: ["cursor"],
    projectPath: tmp,
    includeSkills: false,
    dryRun: true,
  });
  assert.equal(preview.ok, true);
  const rels = (preview.planned ?? []).map((p) => p.rel);
  assert.ok(!rels.some((r) => /SKILL\.md$/.test(r)), rels.filter((r) => /SKILL/.test(r)).join(","));
  rmSync(tmp, { recursive: true, force: true });
  console.log("write includeSkills false no stub: ok");
}

{
  const s = sessionPlatformPack({ platform: "fabric", minecraftVersion: "26.1" });
  assert.equal(s.ok, true, JSON.stringify(s).slice(0, 400));
  assert.equal(s.minecraftVersion, "26.1");
  assert.equal(s.knowledgeVersion, "26.1.2");
  assert.match(String(s.packDir), /fabric\/26\.1\.2/);
  assert.ok((s.warnings ?? []).some((w) => /不要用 minecraftVersion=26\.1/.test(w)), (s.warnings ?? []).join(" | "));
  const miss = sessionPlatformPack({ platform: "fabric", minecraftVersion: "26.2" });
  assert.equal(miss.ok, false);
  assert.equal(miss.action?.code, "PACK_NOT_FOUND");
  const cross = sessionPlatformPack({ platform: "fabric", minecraftVersion: "1.21" });
  assert.equal(cross.ok, false);
  assert.equal(cross.action?.code, "PACK_NOT_FOUND");
  console.log("session fabric 26.1 knowledgeVersion fold: ok");
}

{
  const root = mkdtempSync(join(tmpdir(), "mc-fab-261-"));
  try {
    mkdirSync(join(root, "src", "main", "resources"), { recursive: true });
    writeFileSync(join(root, "gradle.properties"), "minecraft_version=26.1\n", "utf8");
    writeFileSync(
      join(root, "build.gradle"),
      `plugins { id "fabric-loom" version "1.11.8" }\n`,
      "utf8",
    );
    writeFileSync(
      join(root, "src", "main", "resources", "fabric.mod.json"),
      JSON.stringify({ schemaVersion: 1, id: "demo" }),
      "utf8",
    );
    const d = detectModProject({ projectPath: root });
    assert.equal(d.ok, true, JSON.stringify(d).slice(0, 400));
    assert.equal(d.minecraftVersion, "26.1");
    assert.equal(d.knowledgeVersion, "26.1.2");
    assert.equal(d.packFound, true);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
  console.log("detect fabric 26.1 knowledgeVersion: ok");
}

{
  const s = sessionPlatformPack({ platform: "neoforge", minecraftVersion: "1.20.6", topics: ["mixin"] });
  assert.ok((s.nextReads ?? []).some((n) => n.name === "mc-mixin"), JSON.stringify(s.nextReads));
  const gui = sessionPlatformPack({ platform: "neoforge", minecraftVersion: "1.20.6", task: "mc-new-gui" });
  const libNames = new Set((gui.libSkills ?? []).map((x) => x.name));
  for (const n of gui.nextReads ?? []) {
    assert.ok(!libNames.has(n.name), `nextReads must not include lib skill ${n.name}`);
  }
  for (const ver of ["1.21.5", "1.21.10"]) {
    const t = sessionPlatformPack({ platform: "neoforge", minecraftVersion: ver });
    assert.ok((t.skills ?? []).some((x) => x.name === "mc-entity"), `${ver} skills missing mc-entity`);
    const donor = (t.warnings ?? []).find((w) => /并入/.test(w) || /同系列主档/.test(w));
    if (donor) {
      assert.equal((t.warnings ?? [])[0], donor, `${ver} donor warning should be first`);
    }
  }
  console.log("session neo thin donor nextReads: ok");
}

{
  const q = sessionPlatformPack({
    platform: "quilt",
    minecraftVersion: "1.21.1",
    skillNames: ["mc-registry"],
  });
  const body = (q.skillBodies ?? []).find((b) => b.name === "mc-registry");
  assert.ok(body, "quilt overlay skillBodies mc-registry");
  assert.doesNotMatch(String(body.text), /\[DONOR_SKILL 禁止直接抄写\]/);
  assert.match(String(body.text), /search_docs/);
  assert.match(String(body.relPosix ?? body.absPath ?? ""), /quilt\/1\.21\.1/);
  const tmp = mkdtempSync(join(tmpdir(), "mc-quilt-ovmiss-"));
  const packDir = join(tmp, "quilt", "9.8.8");
  mkdirSync(join(packDir, ".cursor", "rules"), { recursive: true });
  writeFileSync(join(packDir, "AGENTS.md"), "# quilt 9.8.8\n", "utf8");
  writeFileSync(join(packDir, ".cursor", "rules", "00-project-setup.mdc"), "# 00\n", "utf8");
  writeFileSync(join(packDir, ".cursor", "rules", "01-registry.mdc"), "# 01\n", "utf8");
  writeFileSync(join(packDir, ".cursor", "rules", "09-anti-patterns.mdc"), "# 09\n", "utf8");
  const missing = sessionPlatformPack({ platform: "quilt", minecraftVersion: "9.8.8", repoRoot: tmp });
  assert.equal(missing.ok, true);
  assert.ok((missing.warnings ?? []).some((w) => /skills\[\] 可能为空/.test(w)));
  assert.ok((missing.warnings ?? []).some((w) => /禁止邻版/.test(w)));
  rmSync(tmp, { recursive: true, force: true });
  console.log("quilt overlay skillBodies prefix + missing warning: ok");
}

{
  const s = sessionPlatformPack({ platform: "forge", minecraftVersion: "1.20.1" });
  assert.ok(!(s.skills ?? []).some((x) => x.name === "mc-geckolib"));
  assert.ok((s.libSkills ?? []).some((x) => x.name === "mc-geckolib"));
  console.log("forge libSkills stay out of skills[]: ok");
}

{
  const { readdirSync } = await import("node:fs");
  const qDisk = readdirSync(join(repo, "quilt", "1.21.1", ".cursor", "skills")).filter((n) => n.startsWith("mc-"));
  assert.equal(qDisk.length, 3, qDisk.join(","));
  const neo = sessionPlatformPack({ platform: "neoforge", minecraftVersion: "1.20.1" });
  assert.equal(neo.ok, true, JSON.stringify(neo.action));
  assertHasRuleIds(neo, ["00", "01", "09"], "neoforge 1.20.1 base");
  const f1211 = sessionPlatformPack({ platform: "forge", minecraftVersion: "1.21.1" });
  assert.equal(f1211.ok, false);
  assert.equal(f1211.action?.code, "PACK_NOT_FOUND");
  console.log("plan4 quilt disk 3 + neo 1.20.1 / forge 1.21.1 draft: ok");
}

{
  const gi = readFileSync(join(repo, ".gitignore"), "utf8");
  const patterns = gi
    .split(/\r?\n/)
    .map((l) => l.replace(/#.*$/, "").trim())
    .filter(Boolean);
  assert.ok(patterns.includes("/.cursor/"), "gitignore must ignore only repo-root /.cursor/");
  assert.ok(!patterns.includes(".cursor/"), "gitignore must not ignore nested pack .cursor/");
  assert.ok(!patterns.includes(".cursor"));
  const advertised = [
    ["fabric", "1.21.4"],
    ["fabric", "1.21.8"],
    ["fabric", "1.21.10"],
    ["neoforge", "1.20.1"],
  ];
  for (const [platform, ver] of advertised) {
    const s = sessionPlatformPack({ platform, minecraftVersion: ver });
    assert.equal(s.ok, true, `${platform} ${ver}: ${JSON.stringify(s.action)}`);
    assertHasRuleIds(s, ["00", "01", "09"], `${platform} ${ver} base`);
    assert.equal(s.rulesMode, "base");
    assert.equal(s.next?.tool, "activate_platform_pack");
    assert.equal(s.next?.arguments?.task, "mc-new-block");
    assert.ok(
      !(s.warnings ?? []).some((w) => /缺少底座/.test(w)),
      `${platform} ${ver} warnings=${(s.warnings ?? []).join(" | ")}`,
    );
  }
  console.log("gitignore + advertised packs inject 00/01/09: ok");
}

{
  const tmp = mkdtempSync(join(tmpdir(), "mc-pack-norules-"));
  const packDir = join(tmp, "fabric", "9.9.7");
  mkdirSync(packDir, { recursive: true });
  writeFileSync(join(packDir, "AGENTS.md"), "# fabric 9.9.7\n", "utf8");
  const s = sessionPlatformPack({ platform: "fabric", minecraftVersion: "9.9.7", repoRoot: tmp });
  assert.equal(s.ok, false, JSON.stringify(s.action));
  assert.equal(s.action?.code, "PACK_INCOMPLETE");
  assert.equal((s.rules ?? []).length, 0);
  assert.ok((s.warnings ?? []).some((w) => /底座规则文件缺失/.test(w)), (s.warnings ?? []).join(" | "));
  assert.ok(!(s.warnings ?? []).some((w) => /已加载底座规则 00\/01\/09/.test(w)));
  rmSync(tmp, { recursive: true, force: true });
  console.log("session missing .cursor/rules does not claim base loaded: ok");
}

{
  const neo = sessionPlatformPack({
    platform: "neoforge",
    minecraftVersion: "1.20.1",
    includeAllRules: true,
    skillNames: ["mc-networking"],
  });
  assert.equal(neo.ok, true, JSON.stringify(neo.action));
  const r02 = (neo.rules ?? []).find((r) => r.id === "02");
  const r06 = (neo.rules ?? []).find((r) => r.id === "06");
  assert.ok(r02 && /forge\/1\.20\.1/.test(String(r02.source)), JSON.stringify(r02?.source));
  assert.ok(r06 && /forge\/1\.20\.1/.test(String(r06.source)), JSON.stringify(r06?.source));
  assert.match(String(r06.text), /FORGE_COMPAT_1\.20\.1/);
  assert.match(String(r06.text), /SimpleChannel/);
  assert.doesNotMatch(String(r06.text), /禁止 net\.neoforged/);
  const net = (neo.skillBodies ?? []).find((b) => b.name === "mc-networking");
  assert.ok(net, "neo 1.20.1 mc-networking skillBodies");
  assert.match(String(net.text), /SimpleChannel/);
  assert.ok(!/Payload-only|全档均是 Payload/.test(String(net.text)));
  const tmp = mkdtempSync(join(tmpdir(), "mc-neo1201-write-"));
  const preview = activatePlatformPack({
    action: "write",
    platform: "neoforge",
    minecraftVersion: "1.20.1",
    hosts: ["cursor"],
    projectPath: tmp,
    dryRun: true,
  });
  assert.equal(preview.ok, true, JSON.stringify(preview.action));
  const rels = (preview.planned ?? []).map((p) => p.rel);
  for (const id of ["02", "03", "04", "05", "06", "07", "08", "10"]) {
    assert.ok(
      rels.some((r) => r.includes(`${id}-`) || r.includes(`0${id}-`)),
      `neo 1.20.1 write missing overlay rule ${id}: ${rels.slice(0, 12).join(",")}`,
    );
  }
  rmSync(tmp, { recursive: true, force: true });
  console.log("neo 1.20.1 forge overlay session/write: ok");
}

{
  const q = sessionPlatformPack({ platform: "quilt", minecraftVersion: "1.21.1", includeAllRules: true });
  assert.equal(q.ok, true);
  const r06 = (q.rules ?? []).find((r) => r.id === "06");
  assert.ok(r06, "quilt 06 present");
  assert.match(String(r06.source), /quilt\/1\.21\.1/);
  assert.doesNotMatch(String(r06.text), /ServerPlayNetworking/);
  assert.match(String(r06.text), /QFAPI|QSL/);
  const tmp = mkdtempSync(join(tmpdir(), "mc-quilt-write-"));
  const preview = activatePlatformPack({
    action: "write",
    platform: "quilt",
    minecraftVersion: "1.21.1",
    hosts: ["cursor"],
    projectPath: tmp,
    dryRun: true,
  });
  assert.equal(preview.ok, true);
  const texts = (preview.planned ?? []).filter((p) => /06-networking/.test(p.rel));
  assert.ok(texts.length >= 1, "quilt write should include 06-networking");
  rmSync(tmp, { recursive: true, force: true });
  console.log("quilt 06 is local short rule: ok");
}

{
  assert.equal(coversMcVersion("1.2", "1.20.1"), false);
  assert.equal(coversMcVersion("1.20", "1.20.1"), true);
  assert.equal(inspectPack("forge", "../1.20.1"), null);
  assert.equal(inspectPack("forge", "1.20.1/../1.20.1"), null);
  const full = sessionPlatformPack({ platform: "forge", minecraftVersion: "1.20.1", task: "mc-full-mod" });
  assert.equal(full.ok, true);
  assert.ok((full.rules ?? []).length > 3, `mc-full-mod rules=${(full.rules ?? []).map((r) => r.id).join(",")}`);
  console.log("inspectPack / coversMcVersion / mc-full-mod: ok");
}

{
  const tmp = mkdtempSync(join(tmpdir(), "mc-pack-stubprio-"));
  const def = activatePlatformPack({
    action: "write",
    platform: "neoforge",
    minecraftVersion: "1.21.1",
    hosts: ["cursor"],
    projectPath: tmp,
    dryRun: true,
  });
  assert.ok((def.planned ?? []).some((p) => /SKILL\.md$/.test(p.rel)), "writeSkillStubs default true");
  const mapped = activatePlatformPack({
    action: "write",
    platform: "neoforge",
    minecraftVersion: "1.21.1",
    hosts: ["cursor"],
    projectPath: tmp,
    includeSkills: false,
    dryRun: true,
  });
  assert.ok(!(mapped.planned ?? []).some((p) => /SKILL\.md$/.test(p.rel)), "includeSkills false maps to no stubs");
  const prio = activatePlatformPack({
    action: "write",
    platform: "neoforge",
    minecraftVersion: "1.21.1",
    hosts: ["cursor"],
    projectPath: tmp,
    writeSkillStubs: false,
    includeSkills: true,
    dryRun: true,
  });
  assert.ok(!(prio.planned ?? []).some((p) => /SKILL\.md$/.test(p.rel)), "writeSkillStubs false wins over includeSkills true");
  rmSync(tmp, { recursive: true, force: true });
  console.log("writeSkillStubs default/deprecated/priority: ok");
}

{
  const s = sessionPlatformPack({ platform: "fabric", minecraftVersion: "1.21.4", skillNames: ["mc-entity"] });
  assert.equal(s.ok, true, JSON.stringify(s.action));
  const entIdx = (s.skills ?? []).find((x) => x.name === "mc-entity");
  assert.ok(entIdx, JSON.stringify(entIdx));
  assert.match(String(entIdx.relPosix), /fabric\/1\.21\.4\//);
  const entity = (s.skillBodies ?? []).find((b) => b.name === "mc-entity");
  assert.ok(entity, "fabric 1.21.4 local donor-noted mc-entity");
  // B24 后薄档技能实体落盘：DONOR 注记在正文里（来源 fabric/1.21.3 + 本档版本核验指引）
  assert.match(String(entity.text).trimStart(), /^\[DONOR_SKILL 禁止直接抄写\]/);
  assert.match(String(entity.text), /search_fabric_docs\(version=1\.21\.4\)/);
  assert.match(String(entity.text), /不要用 version=1\.21\.3/);
  const local = sessionPlatformPack({ platform: "fabric", minecraftVersion: "1.21.4", skillNames: ["mc-block"] });
  const block = (local.skillBodies ?? []).find((b) => b.name === "mc-block");
  assert.ok(block);
  assert.doesNotMatch(String(block.text).trimStart(), /^\[DONOR_SKILL 禁止直接抄写\]/);
}

{
  const kForge = sessionPlatformPack({ platform: "neoforge", minecraftVersion: "1.21.1", task: "mc-kotlin" });
  assert.ok((kForge.skillBodies ?? []).some((b) => b.name === "mc-kotlin-for-forge") ||
    (kForge.libSkills ?? []).some((b) => b.name === "mc-kotlin-for-forge"), JSON.stringify((kForge.warnings ?? []).slice(0, 5)));
  const kFab = sessionPlatformPack({ platform: "fabric", minecraftVersion: "1.21.11", task: "mc-kotlin" });
  assert.ok(
    (kFab.skillBodies ?? []).some((b) => b.name === "mc-fabric-language-kotlin") ||
      (kFab.warnings ?? []).some((w) => /mc-fabric-language-kotlin/.test(w)),
    (kFab.warnings ?? []).join(" | "),
  );
}

{
  const q = sessionPlatformPack({ platform: "quilt", minecraftVersion: "1.21.4" });
  assert.equal(q.ok, true, JSON.stringify(q.action));
  assertHasRuleIds(q, ["00", "01", "09"], "quilt 1.21.4 base");
}

{
  assert.equal(FABRIC_SKILL_DONORS["1.21.8"], "1.21.4");
  assert.equal(FABRIC_SKILL_DONORS["1.21.10"], "1.21.4");
  const localNames = [
    "mc-block", "mc-blockentity", "mc-command", "mc-datagen", "mc-events", "mc-gui",
    "mc-item", "mc-loottable", "mc-mixin", "mc-model", "mc-networking", "mc-recipe",
    "mc-registry", "mc-renderer",
  ];
  for (const ver of ["1.21.8", "1.21.10"]) {
    const s = sessionPlatformPack({ platform: "fabric", minecraftVersion: ver });
    assert.equal(s.ok, true, `${ver}: ${JSON.stringify(s.action)}`);
    const joined = (s.warnings ?? []).join(" | ");
    assert.ok(
      (s.warnings ?? []).some((w) => /同系列主档 fabric\/1\.21\.4/.test(w)),
      `${ver} donorWarning: ${joined}`,
    );
    assert.ok(
      !(s.warnings ?? []).some((w) => /同系列主档 fabric\/1\.21\.11/.test(w)),
      `${ver} must not cite 1.21.11 donor: ${joined}`,
    );
    for (const name of localNames) {
      const sk = (s.skills ?? []).find((x) => x.name === name);
      assert.ok(sk, `${ver} missing local skill ${name}`);
      assert.match(
        String(sk.relPosix),
        new RegExp(`fabric/${ver.replaceAll(".", "\\.")}/`),
        `${ver} ${name} relPosix=${sk.relPosix}`,
      );
    }
    for (const sk of s.skills ?? []) {
      if (!sk.mappingNote) continue;
      assert.match(
        sk.mappingNote,
        new RegExp(`search_fabric_docs\\(version=${ver.replaceAll(".", "\\.")}\\)`),
        `${ver} donated ${sk.name} mappingNote=${sk.mappingNote}`,
      );
      assert.doesNotMatch(String(sk.relPosix), /fabric\/1\.21\.11\//);
    }
  }
  console.log("fabric 1.21.8/1.21.10 donor is 1.21.4: ok");
}

{
  const { ensureFrontmatter, quiltCopiedSkill, yamlQuotedScalar } = await import("./dist/platform-pack/write.js");
  const { FORGE_COMPAT_BANNER } = await import("./dist/platform-pack/catalog.js");
  const bannered = `---\n${FORGE_COMPAT_BANNER}\noverlay note\n---\n\n# body\n`;
  const withDesc = ensureFrontmatter(bannered, "MC Skill neoforge 1.20.1 02: block", { alwaysApply: "true" });
  const firstFm = withDesc.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  assert.ok(firstFm, "bannered overlay must get a real YAML fence");
  assert.match(firstFm[1], /^description: "/m);
  assert.doesNotMatch(firstFm[1], /\[FORGE_COMPAT/);
  assert.match(firstFm[1], /alwaysApply: true/);
  assert.match(withDesc, /\[FORGE_COMPAT/);

  const realFm = ensureFrontmatter("---\nglobs: \"*.mdc\"\n---\n\n# r\n", "plain desc", {});
  assert.match(realFm, /^---\ndescription: "plain desc"\nglobs:/);

  const quoted = yamlQuotedScalar("a: b");
  assert.equal(quoted, '"a: b"');

  const skillDir = mkdtempSync(join(tmpdir(), "mc-quilt-skill-"));
  try {
    const abs = join(skillDir, "SKILL.md");
    writeFileSync(abs, "# donated\n", "utf8");
    const copied = quiltCopiedSkill(abs, "mc-foo", "Register: items", "1.21.1");
    const fm = copied.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    assert.ok(fm, copied.slice(0, 200));
    assert.match(fm[1], /^description: "Register: items"$/m);
    assert.doesNotMatch(fm[1], /^description: Register: items$/m);
  } finally {
    rmSync(skillDir, { recursive: true, force: true });
  }
  const emptyThenYaml = "---\n---\n---\nglobs: \"*.mdc\"\n---\n# r\n";
  const skippedEmpty = ensureFrontmatter(emptyThenYaml, "plain desc", {});
  assert.match(skippedEmpty, /^---\ndescription: "plain desc"\nglobs:/);

  console.log("ensureFrontmatter banner + quiltCopiedSkill quotes: ok");
}

{
  const bom = "\uFEFF---\ndescription: hello\n---";
  assert.equal(stripUtf8Bom(bom).startsWith("---"), true);
  assert.equal(parseFrontmatterMap(bom).description, "hello");
  assert.equal(frontmatterDescription(bom).description, "hello");
  const wrapped = wrapBanneredBody("[BANNER] x", "note", "---\n---\n# body\n");
  assert.match(wrapped, /^---\n\[BANNER\] x\nnote\n---/);
  assert.doesNotMatch(wrapped, /^---\r?\n---/);
  console.log("BOM + wrapBanneredBody skip empty fence: ok");
}

{
  const tmp = mkdtempSync(join(tmpdir(), "mc-pack-upsert-skip-"));
  process.env.MC_SKILL_ALLOW_WRITE = "1";
  try {
    const args = {
      action: "write",
      platform: "neoforge",
      minecraftVersion: "1.21.1",
      hosts: ["opencode"],
      projectPath: tmp,
      writeSkillStubs: false,
      dryRun: false,
      confirmed: true,
    };
    const first = activatePlatformPack(args);
    assert.equal(first.ok, true, JSON.stringify(first).slice(0, 400));
    const path = join(tmp, "AGENTS.md");
    const prev = readFileSync(path, "utf8");
    const second = activatePlatformPack(args);
    assert.equal(second.ok, true, JSON.stringify(second).slice(0, 400));
    assert.equal(readFileSync(path, "utf8"), prev);
    assert.ok(!(second.patchedFiles ?? []).includes("AGENTS.md"), JSON.stringify(second.patchedFiles));
  } finally {
    rmSync(tmp, { recursive: true, force: true });
    delete process.env.MC_SKILL_ALLOW_WRITE;
  }
  console.log("write skip unchanged marker: ok");
}

{
  const payload = readFileSync(join(repo, "community_knowledge", "authored", "neoforge-payload-networking.md"), "utf8");
  assert.match(payload, /这是 \*\*mod 总线\*\*事件/);
  assert.match(payload, /bus = Mod\.EventBusSubscriber\.Bus\.MOD/);
  assert.doesNotMatch(payload, /默认总线即可/);
  console.log("LH1 payload mod-bus wording: ok");
}

{
  const s = sessionPlatformPack({ platform: "bedrock", minecraftVersion: "1.21.0", task: "mc-new-block" });
  assert.equal(s.ok, true, JSON.stringify(s).slice(0, 400));
  assert.equal(s.ruleSchema, "bedrock");
  const names = (s.rules ?? []).map((r) => r.fileName);
  assert.ok(!names.some((n) => /02-resource-pack/.test(n) && (s.ruleIds ?? []).includes("02")), names.join(","));
  assert.ok(!(s.ruleIds ?? []).includes("02"), `mc-new-block 不得灌 02，got ${JSON.stringify(s.ruleIds)}`);
  const w = (s.warnings ?? []).join(" | ");
  assert.ok(/mc-bedrock-addon|mc-bedrock-block-item|与 Java 无关/.test(w), w);
  console.log("bedrock task=mc-new-block does not inject 02: ok");
}

{
  const s = sessionPlatformPack({ platform: "bedrock", minecraftVersion: "1.21.0", topics: ["08"] });
  assert.equal(s.ok, true, JSON.stringify(s).slice(0, 400));
  const hit = (s.rules ?? []).find((r) => r.id === "08");
  assert.ok(hit, JSON.stringify((s.rules ?? []).map((r) => r.fileName)));
  assert.equal(hit.fileName, "08-worldgen.mdc");
  const w = (s.warnings ?? []).join(" | ");
  assert.ok(/与 Java 无关|Java 00–10 无关/.test(w), w);
  console.log("bedrock topics=08 is worldgen + Java-unrelated warning: ok");
}

{
  // 原型键不得命中 Object.prototype：否则 groups 取到 Function，for...of 抛 TypeError
  assert.deepEqual(listLibSkillIndex("constructor", "1.20.1", repo), [], "constructor 是原型键，不是平台名");
  assert.deepEqual(listLibSkillIndex("toString", "1.20.1", repo), [], "toString 是原型键，不是平台名");
  assert.deepEqual(listLibSkillIndex("__proto__", "1.20.1", repo), [], "__proto__ 是原型键，不是平台名");
  // 正路不受影响
  const forge = listLibSkillIndex("forge", "1.20.1", repo);
  assert.ok(Array.isArray(forge), "forge 库 Skill 索引应为数组");
  console.log(`listLibSkillIndex 原型键防护: ok（forge 命中 ${forge.length} 条）`);
}

if (savedRoot) process.env.MC_SKILL_PROJECT_ROOT = savedRoot;
else delete process.env.MC_SKILL_PROJECT_ROOT;
if (savedAllow) process.env.MC_SKILL_ALLOW_WRITE = savedAllow;
else delete process.env.MC_SKILL_ALLOW_WRITE;

console.log("test-platform-pack: all passed");

