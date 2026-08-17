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
const { fabricRulesOverlay } = await import("./dist/platform-pack/catalog.js");
const { upsertHostMarker, beginMarker } = await import("./dist/platform-pack/hosts.js");

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
  const { findPack, listPacks, inspectPack } = await import("./dist/platform-pack/catalog.js");
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
  rmSync(tmpRepo, { recursive: true, force: true });
  console.log("draft pack: findPack PACK_NOT_FOUND, listPacks drafts[]");
}

if (savedRoot) process.env.MC_SKILL_PROJECT_ROOT = savedRoot;
else delete process.env.MC_SKILL_PROJECT_ROOT;
if (savedAllow) process.env.MC_SKILL_ALLOW_WRITE = savedAllow;
else delete process.env.MC_SKILL_ALLOW_WRITE;

console.log("test-platform-pack: all passed");
