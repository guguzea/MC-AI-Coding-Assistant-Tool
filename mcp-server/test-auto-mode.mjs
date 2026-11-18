/**
 * 工程沙箱内全自动模式（MC_SKILL_AUTO_MODE=1）回归单测：
 *   1. 未设 / 非 "1"（如 "true"）时严格保持现行人在环（WRITE_DISABLED / CONFIRMATION_REQUIRED / PLAYTEST_DISABLED / 【人在环】）；
 *   2. 设 MC_SKILL_AUTO_MODE=1 但缺 MC_SKILL_PROJECT_ROOT 时仍 fail-closed（PROJECT_ROOT_REQUIRED），activate_platform_pack 也不回退到只认 projectPath；
 *   3. MC_SKILL_PROJECT_ROOT 指向 MC_skill 知识库目录树时拒绝（REFUSE_KNOWLEDGE_REPO）；
 *   4. 设 MC_SKILL_AUTO_MODE=1 + 合法外部 MC_SKILL_PROJECT_ROOT 时：
 *      - generate_* write=true（免 confirmed / MC_SKILL_ALLOW_WRITE）落盘，沙箱外仍 PATH_OUTSIDE_ALLOWLIST；
 *      - port_project init_architectury dryRun=false（免 confirmed / MC_SKILL_ALLOW_WRITE）落盘；
 *      - activate_platform_pack write/deactivate dryRun=false（免 confirmed / MC_SKILL_ALLOW_WRITE）落盘与撤除；
 *      - ingest_loader_api dryRun=false（免 confirmed）进入校验/写缓存路径；
 *      - mc_skill_update apply dryRun=false 仍强制 CONFIRMATION_REQUIRED（严格例外）；
 *      - download_official_mdk 仍强制 sha256 pin（MDK_NOT_PINNED，严格例外）；
 *   5. 游玩自测：未单独设 MC_SKILL_PLAYTEST_ROOT 时即使开了 MC_SKILL_AUTO_MODE=1 + MC_SKILL_PROJECT_ROOT 也保持未授权（绝不自动回落到 PROJECT_ROOT）；
 *   6. 显式设 MC_SKILL_PLAYTEST_ROOT + MC_SKILL_AUTO_MODE=1 时：
 *      - inspect_playtest_evidence / inspect_playtest_multi / playtest_bridge / playtest_intent 免 MC_SKILL_PLAYTEST_ALLOW 与 confirmed；
 *      - playtest_intent 放开菜单内 kill/tnt/fill 禁列拦截，越界路径仍 PATH_OUTSIDE_ALLOWLIST；
 *   7. 运行时注入面：getWorkflowTemplate / registerPrompt / session / get_server_status 在 MC_SKILL_AUTO_MODE=1 时切到沙箱全自动指引。
 */
import assert from "node:assert/strict";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const SERVER = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(SERVER, "..");
const dist = (rel) => pathToFileURL(join(SERVER, "dist", rel)).href;

const { maybeWriteGeneratorResult } = await import(dist("generators/write-helper.js"));
const { generateConfig } = await import(dist("generators/index.js"));
const { portProject } = await import(dist("porting/index.js"));
const { activatePlatformPack } = await import(dist("platform-pack/index.js"));
const { ingestLoaderApi } = await import(dist("loader-api/ingest.js"));
const { downloadOfficialMdk } = await import(dist("mdk/index.js"));
const { mcSkillUpdate } = await import(dist("update/index.js"));
const { inspectPlaytestEvidence } = await import(dist("playtest-evidence/index.js"));
const { inspectPlaytestMulti } = await import(dist("playtest-multi/index.js"));
const { callPlaytestBridge } = await import(dist("playtest-bridge/index.js"));
const { playtestIntent } = await import(dist("playtest-intent/index.js"));
const { getWorkflowTemplate } = await import(dist("prompts/templates.js"));
const { getAutoModeStatus } = await import(dist("utils/auto-mode.js"));
const { toolHandlers } = await import(dist("tool-handlers.js"));
await import(dist("tool-registry.js"));

const ENV_KEYS = [
  "MC_SKILL_AUTO_MODE",
  "MC_SKILL_ALLOW_WRITE",
  "MC_SKILL_PROJECT_ROOT",
  "MC_SKILL_PLAYTEST_ALLOW",
  "MC_SKILL_PLAYTEST_ROOT",
  "MC_SKILL_CACHE",
  "MC_SKILL_MDK_CHECKSUMS",
];

function snapshotEnv() {
  const snap = {};
  for (const k of ENV_KEYS) snap[k] = process.env[k];
  return snap;
}

function restoreEnv(snap) {
  for (const k of ENV_KEYS) {
    if (snap[k] === undefined) delete process.env[k];
    else process.env[k] = snap[k];
  }
}

function clearAuthEnv() {
  for (const k of ENV_KEYS) delete process.env[k];
}

const tmpBase = mkdtempSync(join(tmpdir(), "mc-skill-auto-mode-"));
const savedEnv = snapshotEnv();
let cases = 0;

async function runCase(label, fn) {
  clearAuthEnv();
  try {
    await fn();
    cases += 1;
  } catch (err) {
    throw new Error(`[${label}] ${(err instanceof Error ? err.stack || err.message : String(err))}`);
  } finally {
    restoreEnv(savedEnv);
  }
}

try {
  // 1) 未设或设非 "1"（如 "true"）→ 严格保留人在环
  await runCase("default-off-and-strict-1", async () => {
    for (const val of [undefined, "0", "true"]) {
      clearAuthEnv();
      if (val !== undefined) process.env.MC_SKILL_AUTO_MODE = val;
      const proj = mkdtempSync(join(tmpBase, "off-proj-"));
      process.env.MC_SKILL_PROJECT_ROOT = proj;

      const gen = maybeWriteGeneratorResult(
        generateConfig("demo", "forge", "1.20.1"),
        { write: true, projectPath: proj },
        { singleFileName: "ModConfig.java" },
      );
      assert.equal(gen.ok, false);
      assert.equal(gen.writeError?.code, "CONFIRMATION_REQUIRED");

      const genWithConfirm = maybeWriteGeneratorResult(
        generateConfig("demo", "forge", "1.20.1"),
        { write: true, confirmed: true, projectPath: proj },
        { singleFileName: "ModConfig.java" },
      );
      assert.equal(genWithConfirm.ok, false);
      assert.equal(genWithConfirm.writeError?.code, "WRITE_DISABLED");

      const pt = inspectPlaytestEvidence({ evidenceDir: proj });
      assert.equal(pt.ok, false);
      assert.equal(pt.code, "PLAYTEST_DISABLED");

      const wf = getWorkflowTemplate("mc-new-block");
      assert.equal(wf.autoMode, undefined);
      assert.match(wf.body ?? "", /【人在环】/);
    }
  });

  // 2) 开启 MC_SKILL_AUTO_MODE=1 但缺 MC_SKILL_PROJECT_ROOT → 仍拒绝写盘（PROJECT_ROOT_REQUIRED）
  await runCase("auto-mode-requires-project-root", async () => {
    process.env.MC_SKILL_AUTO_MODE = "1";
    const proj = mkdtempSync(join(tmpBase, "no-env-root-"));

    const gen = maybeWriteGeneratorResult(
      generateConfig("demo", "forge", "1.20.1"),
      { write: true, projectPath: proj },
      { singleFileName: "ModConfig.java" },
    );
    assert.equal(gen.ok, false);
    assert.equal(gen.writeError?.code, "PROJECT_ROOT_REQUIRED");

    const portRes = JSON.parse(
      await portProject({
        projectPath: proj,
        action: "init_architectury",
        dryRun: false,
        modId: "automod",
        neoforgeVersion: "20.4.237",
      }),
    );
    assert.equal(portRes.ok, false);
    assert.equal(portRes.error?.code, "PROJECT_ROOT_REQUIRED");

    const packRes = activatePlatformPack({
      action: "write",
      platform: "forge",
      minecraftVersion: "1.20.1",
      hosts: ["cursor"],
      dryRun: false,
      projectPath: proj,
    });
    assert.equal(packRes.ok, false);
    assert.equal(packRes.action?.code, "PROJECT_ROOT_REQUIRED");
  });

  // 3) MC_SKILL_PROJECT_ROOT 指向知识库自身 → 拒绝（REFUSE_KNOWLEDGE_REPO）
  await runCase("auto-mode-refuses-knowledge-repo", async () => {
    process.env.MC_SKILL_AUTO_MODE = "1";
    process.env.MC_SKILL_PROJECT_ROOT = REPO_ROOT;

    const gen = maybeWriteGeneratorResult(
      generateConfig("demo", "forge", "1.20.1"),
      { write: true, projectPath: REPO_ROOT },
      { singleFileName: "ModConfig.java" },
    );
    assert.equal(gen.ok, false);
    assert.equal(gen.writeError?.code, "REFUSE_KNOWLEDGE_REPO");

    const portRes = JSON.parse(
      await portProject({
        projectPath: REPO_ROOT,
        action: "init_architectury",
        dryRun: false,
        modId: "automod",
        neoforgeVersion: "20.4.237",
      }),
    );
    assert.equal(portRes.ok, false);
    assert.equal(portRes.error?.code, "REFUSE_KNOWLEDGE_REPO");

    const packRes = activatePlatformPack({
      action: "write",
      platform: "forge",
      minecraftVersion: "1.20.1",
      hosts: ["cursor"],
      dryRun: false,
      projectPath: REPO_ROOT,
    });
    assert.equal(packRes.ok, false);
    assert.equal(packRes.action?.code, "REFUSE_KNOWLEDGE_REPO");

    const status = getAutoModeStatus();
    assert.equal(status.enabled, true);
    assert.equal(status.projectWriteArmed, false);
  });

  // 4) 工程沙箱内全自动写盘（免 confirmed & MC_SKILL_ALLOW_WRITE）+ 越界仍拒
  await runCase("auto-mode-project-sandbox-writes", async () => {
    const sandbox = mkdtempSync(join(tmpBase, "sandbox-proj-"));
    const outside = mkdtempSync(join(tmpBase, "outside-proj-"));
    const cacheDir = mkdtempSync(join(tmpBase, "cache-"));
    process.env.MC_SKILL_AUTO_MODE = "1";
    process.env.MC_SKILL_PROJECT_ROOT = sandbox;
    process.env.MC_SKILL_CACHE = cacheDir;

    // 4a) generate_* write=true（无 confirmed / 无 ALLOW_WRITE）
    const genOk = maybeWriteGeneratorResult(
      generateConfig("demo", "forge", "1.20.1"),
      { write: true },
      { singleFileName: "ModConfig.java" },
    );
    assert.equal(genOk.ok, true, JSON.stringify(genOk));
    assert.equal(genOk.resultKind, "ok");
    assert.ok(Array.isArray(genOk.written) && genOk.written.length === 1);
    assert.equal(existsSync(genOk.written[0]), true);

    // 越出沙箱依然被拒
    const genOut = maybeWriteGeneratorResult(
      generateConfig("demo", "forge", "1.20.1"),
      { write: true, projectPath: outside },
      { singleFileName: "ModConfig.java" },
    );
    assert.equal(genOut.ok, false);
    assert.equal(genOut.writeError?.code, "PATH_OUTSIDE_ALLOWLIST");

    // 4b) port_project dryRun=false（无 confirmed / 无 ALLOW_WRITE）
    const portDir = join(sandbox, "arch-mod");
    mkdirSync(portDir, { recursive: true });
    const portRes = JSON.parse(
      await portProject({
        projectPath: portDir,
        action: "init_architectury",
        dryRun: false,
        modId: "automod",
        neoforgeVersion: "20.4.237",
      }),
    );
    assert.equal(portRes.ok, true, JSON.stringify(portRes));
    assert.equal(portRes.dryRun, false);
    assert.equal(existsSync(join(portDir, "gradle.properties")), true);

    // 4c) activate_platform_pack write / deactivate dryRun=false（无 confirmed / 无 ALLOW_WRITE）
    const packDir = join(sandbox, "pack-mod");
    mkdirSync(packDir, { recursive: true });
    const writeRes = activatePlatformPack({
      action: "write",
      platform: "forge",
      minecraftVersion: "1.20.1",
      hosts: ["cursor"],
      dryRun: false,
      projectPath: packDir,
    });
    assert.equal(writeRes.ok, true, JSON.stringify(writeRes));
    assert.equal(writeRes.dryRun, false);
    assert.equal(existsSync(join(packDir, ".cursor", "rules", "mc-skill-00-project-setup.mdc")), true);

    const deactRes = activatePlatformPack({
      action: "deactivate",
      hosts: ["cursor"],
      dryRun: false,
      projectPath: packDir,
    });
    assert.equal(deactRes.ok, true, JSON.stringify(deactRes));
    assert.equal(deactRes.dryRun, false);
    assert.equal(existsSync(join(packDir, ".cursor", "rules", "mc-skill-00-project-setup.mdc")), false);

    // 4d) ingest_loader_api dryRun=false（无 confirmed）：跳过确认门，进入真实 jar 解析阶段
    const fakeJar = join(sandbox, "empty.zip");
    // 最小合法空 zip 中央目录结束记录 (EOCD)
    writeFileSync(fakeJar, Buffer.from([0x50, 0x4b, 0x05, 0x06, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]));
    const ingestRes = ingestLoaderApi({
      platform: "liteloader",
      minecraftVersion: "1.12.2",
      jarPath: fakeJar,
      mappingsVersion: "snapshot_20171003",
      dryRun: false,
    });
    assert.equal(ingestRes.ok, false);
    assert.equal(ingestRes.action?.code, "NEED_SOURCES", "有 confirmed 放行后应走到 NEED_SOURCES 而非停在 dryRun");

    // 4e) 严格例外①：mc_skill_update 仍必须传 confirmed=true + MC_SKILL_ALLOW_WRITE=1
    const updRes = await mcSkillUpdate({
      action: "apply",
      scope: "tooling",
      dryRun: false,
      repoRoot: REPO_ROOT,
      dataDir: join(tmpBase, "upd-data"),
      skipBuild: true,
      fetchImpl: async () =>
        new Response(
          JSON.stringify([
            {
              tag_name: "v9.9.9",
              name: "v9.9.9",
              html_url: "https://example.invalid/rel",
              prerelease: false,
              assets: [],
            },
          ]),
          { status: 200, headers: { "content-type": "application/json" } },
        ),
    });
    assert.equal(updRes.ok, false);
    assert.equal(updRes.action?.code, "CONFIRMATION_REQUIRED");

    // 4f) 严格例外②：download_official_mdk 仍强制 sha256 pin 校验（不跳过 MDK_NOT_PINNED）
    const pinFile = join(tmpBase, "empty-mdk-pins.json");
    writeFileSync(
      pinFile,
      JSON.stringify({
        entries: [
          {
            id: "forge-1.20.1",
            platform: "forge",
            minecraftVersion: "1.20.1",
            buildPlugin: "forgegradle",
            repo: "https://github.com/MinecraftForge/MinecraftForge",
            ref: "0".repeat(40),
            archiveUrl: "https://files.minecraftforge.net/maven/net/minecraftforge/forge/1.20.1-47.4.10/forge-1.20.1-47.4.10-mdk.zip",
            sha256: null,
            license: "LGPL-2.1",
            gitPolicy: "cache_only",
            mappings: "official",
          },
        ],
      }),
      "utf8",
    );
    process.env.MC_SKILL_MDK_CHECKSUMS = pinFile;
    const mdkRes = await downloadOfficialMdk({
      platform: "forge",
      minecraftVersion: "1.20.1",
      dryRun: false,
    });
    assert.equal(mdkRes.ok, false);
    assert.equal(mdkRes.error?.code, "MDK_NOT_PINNED");
  });

  // 5) 游玩自测不自动回落到 MC_SKILL_PROJECT_ROOT
  await runCase("playtest-does-not-fallback-to-project-root", async () => {
    const sandbox = mkdtempSync(join(tmpBase, "no-playtest-root-"));
    process.env.MC_SKILL_AUTO_MODE = "1";
    process.env.MC_SKILL_PROJECT_ROOT = sandbox;

    const ev = inspectPlaytestEvidence({ evidenceDir: sandbox });
    assert.equal(ev.ok, false);
    assert.equal(ev.code, "AUTHORIZATION_REQUIRED");

    const multi = inspectPlaytestMulti({ clients: [{ id: "c1", evidenceDir: sandbox }] });
    assert.equal(multi.ok, false);
    assert.equal(multi.code, "AUTHORIZATION_REQUIRED");

    const bridge = await callPlaytestBridge({ action: "status" });
    assert.equal(bridge.ok, false);
    assert.equal(bridge.code, "AUTHORIZATION_REQUIRED");

    const intent = playtestIntent({ action: "read", evidenceDir: sandbox });
    assert.equal(intent.ok, false);
    assert.equal(intent.code, "AUTHORIZATION_REQUIRED");

    const status = getAutoModeStatus();
    assert.equal(status.projectWriteArmed, true);
    assert.equal(status.playtestArmed, false);
  });

  // 6) 显式设置 MC_SKILL_PLAYTEST_ROOT + MC_SKILL_AUTO_MODE=1 → 免 ALLOW/confirmed + 放开 kill/tnt/fill + 仍校验边界
  await runCase("playtest-auto-mode-with-explicit-root", async () => {
    const playRoot = mkdtempSync(join(tmpBase, "play-root-"));
    const outside = mkdtempSync(join(tmpBase, "play-out-"));
    process.env.MC_SKILL_AUTO_MODE = "1";
    process.env.MC_SKILL_PLAYTEST_ROOT = playRoot;

    const evDir = join(playRoot, "ev");
    mkdirSync(evDir, { recursive: true });
    writeFileSync(join(evDir, "exit-code.txt"), "0\n", "utf8");
    writeFileSync(join(evDir, "state.json"), '{"ok":true}\n', "utf8");
    writeFileSync(join(evDir, "qa.log"), "[QA] DONE\n", "utf8");

    const evOk = inspectPlaytestEvidence({ evidenceDir: evDir });
    assert.equal(evOk.ok, true, JSON.stringify(evOk));

    const evOut = inspectPlaytestEvidence({ evidenceDir: outside });
    assert.equal(evOut.ok, false);
    assert.equal(evOut.code, "PATH_OUTSIDE_ALLOWLIST");

    const multiRoot = join(playRoot, "multi");
    const c1 = join(multiRoot, "c1");
    mkdirSync(c1, { recursive: true });
    writeFileSync(join(c1, "exit-code.txt"), "0\n", "utf8");
    writeFileSync(join(c1, "state.json"), '{"at":"2026-11-18T00:00:00Z"}\n', "utf8");
    writeFileSync(join(c1, "qa.log"), "[QA] DONE\n", "utf8");
    writeFileSync(join(c1, "rounds.jsonl"), '{"round":1,"ok":true}\n', "utf8");
    const multiOk = inspectPlaytestMulti({ evidenceRoot: multiRoot });
    assert.equal(multiOk.ok, true, JSON.stringify(multiOk));

    // playtest_bridge execute 免 confirmed 与 authorization（放行到连端口 → BRIDGE_UNREACHABLE，而非 AUTHORIZATION/CONFIRMATION）
    const br = await callPlaytestBridge({
      action: "execute",
      command: { action: "query_player_state", params: {} },
      port: 39999,
    });
    assert.equal(br.ok, false);
    assert.equal(br.code, "BRIDGE_UNREACHABLE");

    // playtest_intent write 免 confirmed 且放开 kill/tnt/fill
    const intentDir = join(playRoot, "intent-ev");
    mkdirSync(intentDir, { recursive: true });
    writeFileSync(
      join(intentDir, "intent-menu.json"),
      JSON.stringify({
        schema: "mc-skill/playtest-intent-menu@1",
        capabilityProfile: "operator",
        forbidden: ["kill", "tnt", "fill"],
        intents: [{ name: "kill", params: [] }],
      }),
      "utf8",
    );
    const iw = playtestIntent({
      action: "write",
      evidenceDir: intentDir,
      intent: "kill",
    });
    assert.equal(iw.ok, true, JSON.stringify(iw));
    assert.deepEqual(JSON.parse(readFileSync(join(intentDir, "intent.json"), "utf8")), { intent: "kill" });

    // 未在菜单声明的意图仍拒绝
    const badIntent = playtestIntent({
      action: "write",
      evidenceDir: intentDir,
      intent: "not_in_menu",
    });
    assert.equal(badIntent.ok, false);
    assert.equal(badIntent.code, "INTENT_NOT_IN_MENU");
  });

  // 7) 工作流、session 与 get_server_status 在 MC_SKILL_AUTO_MODE=1 下联动切换
  await runCase("workflow-session-status-surfaces", async () => {
    const sandbox = mkdtempSync(join(tmpBase, "surface-proj-"));
    const playRoot = mkdtempSync(join(tmpBase, "surface-play-"));
    process.env.MC_SKILL_AUTO_MODE = "1";
    process.env.MC_SKILL_PROJECT_ROOT = sandbox;
    process.env.MC_SKILL_PLAYTEST_ROOT = playRoot;

    const wfBlock = getWorkflowTemplate("mc-new-block");
    assert.equal(wfBlock.found, true);
    assert.equal(wfBlock.autoMode, true);
    assert.match(wfBlock.body ?? "", /【沙箱全自动模式】/);
    assert.doesNotMatch(wfBlock.body ?? "", /【人在环】/);

    // 不引 WORKFLOW_HITL 的兜底模板也要拿到沙箱全自动头部与步尾提示
    const wfSetup = getWorkflowTemplate("mc-setup-env");
    assert.equal(wfSetup.found, true);
    assert.equal(wfSetup.autoMode, true);
    assert.match(wfSetup.body ?? "", /【沙箱全自动模式】/);

    const sess = activatePlatformPack({
      action: "session",
      platform: "forge",
      minecraftVersion: "1.20.1",
    });
    assert.equal(sess.ok, true);
    assert.equal(sess.autoMode?.enabled, true);
    assert.equal(sess.autoMode?.projectWriteArmed, true);
    assert.equal(sess.autoMode?.playtestArmed, true);
    assert.match(String(sess.autoModeNote ?? ""), /MC_SKILL_AUTO_MODE=1/);

    const statusHandler = toolHandlers.get("get_server_status");
    assert.ok(statusHandler, "get_server_status must be registered");
    const rawStatus = await statusHandler.handler({});
    const statusJson = JSON.parse(rawStatus.content[0].text);
    assert.equal(statusJson.autoMode?.enabled, true);
    assert.equal(statusJson.autoMode?.projectWriteArmed, true);
    assert.equal(statusJson.autoMode?.playtestArmed, true);
  });

  console.log(`test-auto-mode: ok (${cases} cases passed)`);
} finally {
  restoreEnv(savedEnv);
  rmSync(tmpBase, { recursive: true, force: true });
}
