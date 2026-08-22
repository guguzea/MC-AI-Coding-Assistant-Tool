/**
 * Unit tests for mc_skill_update (mocked GitHub, local zip fixtures).
 */
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdirSync, mkdtempSync, writeFileSync, readFileSync, existsSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const root = join(import.meta.dirname, "dist");
const update = await import(pathToFileURL(join(root, "update/index.js")).href);
const dataMod = await import(pathToFileURL(join(root, "update/data.js")).href);
const semver = await import(pathToFileURL(join(root, "update/semver.js")).href);
const github = await import(pathToFileURL(join(root, "update/github.js")).href);
const zip = await import(pathToFileURL(join(root, "update/zip.js")).href);
const state = await import(pathToFileURL(join(root, "update/state.js")).href);

function sha256(buf) {
  return createHash("sha256").update(buf).digest("hex");
}

function mockRelease({ tag = "v0.2.0", prerelease = false, withData = true, withSums = true } = {}) {
  const assets = [];
  if (withData) {
    assets.push({
      name: "mc-skill-data-full-0.2.0.zip",
      size: 128,
      browser_download_url: "https://github.com/guguzea/MC-AI-Coding-Assistant-Tool/releases/download/v0.2.0/mc-skill-data-full-0.2.0.zip",
    });
  }
  if (withSums) {
    assets.push({
      name: "SHA256SUMS.txt",
      size: 64,
      browser_download_url: "https://github.com/guguzea/MC-AI-Coding-Assistant-Tool/releases/download/v0.2.0/SHA256SUMS.txt",
    });
  }
  return {
    tag_name: tag,
    name: tag,
    body: "notes",
    prerelease,
    draft: false,
    html_url: `https://github.com/guguzea/MC-AI-Coding-Assistant-Tool/releases/tag/${tag}`,
    assets,
  };
}

function makeFetch(handler) {
  return async (url) => handler(String(url));
}

function jsonRes(obj, status = 200, headers = {}) {
  return {
    ok: status >= 200 && status < 300,
    status,
    headers: { get: (k) => headers[k.toLowerCase()] ?? headers[k] ?? null },
    json: async () => obj,
    text: async () => JSON.stringify(obj),
  };
}

function testSemver() {
  assert.equal(semver.compareSemver("1.2.3", "1.2.3"), 0);
  assert.ok(semver.compareSemver("1.2.4", "1.2.3") > 0);
  assert.ok(semver.compareSemver("1.2.3-alpha", "1.2.3-beta") < 0);
  assert.ok(semver.compareSemver("1.2.3", "1.2.3-beta") > 0);
  assert.equal(semver.isNewer("v0.2.0", "0.1.0"), true);
  assert.equal(semver.looksLikePrereleaseTag("v1.0.0-rc.1"), true);
  assert.equal(semver.looksLikePrereleaseTag("v1.0.4-data-refresh"), false);
  assert.equal(semver.isNewer("not-a-version", "also-not"), false);
  assert.equal(semver.gitDescribeVsRemote("V1.0.4", "V1.0.4"), "equal");
  assert.equal(semver.gitDescribeVsRemote("V1.0.4-12-gabcdef1", "V1.0.4"), "ahead");
  assert.equal(semver.gitDescribeVsRemote("V1.0.4", "V1.0.5"), "behind");
  assert.equal(semver.gitDescribeVsRemote("V1.0.3-2-gabcdef1", "V1.0.4"), "behind");
  assert.equal(github.toolingNeedsUpdate("0.1.0", "V1.0.4", "V1.0.4-3-gabcdef1"), false);
  assert.equal(github.toolingNeedsUpdate("1.0.4", "V1.0.4", "V1.0.4"), false);
  assert.equal(github.toolingNeedsUpdate("1.0.4", "v9.9.9", "V1.0.4-3-gabcdef1"), true);
  assert.equal(github.dataNeedsUpdate(undefined, "V1.0.4", undefined, "data.zip", "V1.0.4-1-gabcdef1"), false);
  assert.equal(github.dataNeedsUpdate(undefined, "V1.0.4", undefined, "data.zip", undefined), true);
}

function testZipLayout() {
  const ok = zip.normalizeZipLayout(["forge_1.20.1/a.json", "vanilla_1.20.1/b.json"]);
  assert.equal(ok.ok, true);
  const strip = zip.normalizeZipLayout(["data/forge_1.20.1/a.json"]);
  assert.equal(strip.ok, true);
  assert.equal(strip.strippedDataPrefix, true);
  assert.deepEqual(strip.mapped, ["forge_1.20.1/a.json"]);
  const bad = zip.normalizeZipLayout(["data/x", "other/y"]);
  assert.equal(bad.ok, false);
  assert.equal(bad.action.code, "DATA_ZIP_LAYOUT_INVALID");
  const trav = zip.normalizeZipLayout(["../etc/passwd"]);
  assert.equal(trav.ok, false);
}

function testStagingContentRoot() {
  // 唯一顶层 data/ 布局的 staging 必须解析到 staging/data（F-A01：ESM 下 require("fs") 曾抛错被空 catch 吞掉）
  const staging = mkdtempSync(join(tmpdir(), "mc-upd-stage-"));
  try {
    mkdirSync(join(staging, "data", "forge_1.20.1"), { recursive: true });
    writeFileSync(join(staging, "data", "forge_1.20.1", "a.json"), "{}", "utf8");
    assert.equal(zip.resolveStagingContentRoot(staging), join(staging, "data"));

    const flat = mkdtempSync(join(tmpdir(), "mc-upd-flat-"));
    try {
      mkdirSync(join(flat, "forge_1.20.1"), { recursive: true });
      writeFileSync(join(flat, "forge_1.20.1", "a.json"), "{}", "utf8");
      assert.equal(zip.resolveStagingContentRoot(flat), flat);
    } finally {
      rmSync(flat, { recursive: true, force: true });
    }

    const ambiguous = mkdtempSync(join(tmpdir(), "mc-upd-amb-"));
    try {
      mkdirSync(join(ambiguous, "data"), { recursive: true });
      mkdirSync(join(ambiguous, "other"), { recursive: true });
      assert.equal(zip.resolveStagingContentRoot(ambiguous), ambiguous);
    } finally {
      rmSync(ambiguous, { recursive: true, force: true });
    }
  } finally {
    rmSync(staging, { recursive: true, force: true });
  }
}

async function testRateLimit429() {
  const fetchImpl = makeFetch(() => jsonRes({}, 429, { "retry-after": "42" }));
  const r = await github.resolveRelease({ channel: "stable", fetchImpl });
  assert.equal(r.ok, false);
  assert.equal(r.action.code, "UPDATE_RATE_LIMITED");
}

async function testStableSkipsPrerelease() {
  const fetchImpl = makeFetch((url) => {
    if (url.includes("/releases?")) {
      return jsonRes([
        mockRelease({ tag: "v0.3.0-beta", prerelease: true, withData: false, withSums: false }),
        mockRelease({ tag: "v0.2.0", prerelease: false, withData: false, withSums: false }),
      ]);
    }
    return jsonRes({}, 404);
  });
  const r = await github.resolveRelease({ channel: "stable", fetchImpl });
  assert.equal(r.ok, true);
  assert.equal(r.release.tag_name, "v0.2.0");

  const latest = await github.resolveRelease({ channel: "latest", fetchImpl });
  assert.equal(latest.release.tag_name, "v0.3.0-beta");
}

async function testCheckUpdateAvailable() {
  const dataDir = mkdtempSync(join(tmpdir(), "mc-upd-data-"));
  const fetchImpl = makeFetch((url) => {
    if (url.includes("/releases?")) return jsonRes([mockRelease({ tag: "v9.9.9", withData: false, withSums: false })]);
    return jsonRes({}, 404);
  });
  const res = await update.mcSkillUpdate({
    action: "check",
    scope: "tooling",
    channel: "stable",
    fetchImpl,
    dataDir,
  });
  assert.equal(res.updateAvailable, true);
  assert.ok(res.scopes.includes("tooling"));
  assert.equal(res.action?.code, "UPDATE_AVAILABLE");
  const hint = state.getUpdateHint(dataDir);
  assert.equal(hint.available, true);
  assert.equal(hint.stale, false);
  rmSync(dataDir, { recursive: true, force: true });
}

async function testGitDescribeAheadNoUpdate() {
  const dataDir = mkdtempSync(join(tmpdir(), "mc-upd-data-"));
  const fetchImpl = makeFetch((url) => {
    if (url.includes("/releases?")) {
      return jsonRes([mockRelease({ tag: "V1.0.4", withData: false, withSums: false })]);
    }
    return jsonRes({}, 404);
  });
  const res = await update.mcSkillUpdate({
    action: "check",
    scope: "all",
    channel: "stable",
    fetchImpl,
    dataDir,
  });
  assert.equal(res.updateAvailable, false, `ahead/equal 不应提示更新: ${JSON.stringify(res.local)}`);
  rmSync(dataDir, { recursive: true, force: true });
}

async function testApplyRequiresConfirm() {
  const dataDir = mkdtempSync(join(tmpdir(), "mc-upd-data-"));
  const fetchImpl = makeFetch((url) => {
    if (url.includes("/releases?")) return jsonRes([mockRelease({ tag: "v9.9.9", withData: false, withSums: false })]);
    return jsonRes({}, 404);
  });
  const res = await update.mcSkillUpdate({
    action: "apply",
    scope: "tooling",
    dryRun: false,
    confirmed: false,
    fetchImpl,
    dataDir,
    skipBuild: true,
  });
  assert.equal(res.action?.code, "CONFIRMATION_REQUIRED");
  rmSync(dataDir, { recursive: true, force: true });
}

async function testDataDryRunOverwriteList() {
  const dataDir = mkdtempSync(join(tmpdir(), "mc-upd-data-"));
  mkdirSync(join(dataDir, "forge_1.20.1"), { recursive: true });
  writeFileSync(join(dataDir, "forge_1.20.1", "keep.json"), "{\"old\":1}");
  writeFileSync(join(dataDir, "user-extra.txt"), "mine");

  const zipPath = join(dataDir, "_pkg.zip");
  dataMod.writeStoreZip(zipPath, {
    "forge_1.20.1/keep.json": "{\"new\":2}",
    "forge_1.20.1/new.json": "{\"n\":1}",
  });
  const zipBuf = readFileSync(zipPath);
  const digest = sha256(zipBuf);
  const sumsPath = join(dataDir, "SHA256SUMS.txt");
  writeFileSync(sumsPath, `${digest}  mc-skill-data-full-0.2.0.zip\n`);

  const release = mockRelease({ tag: "v9.9.9" });
  const fetchImpl = makeFetch((url) => {
    if (url.includes("/releases?")) return jsonRes([release]);
    return jsonRes({}, 404);
  });

  const res = await update.mcSkillUpdate({
    action: "apply",
    scope: "data",
    dryRun: true,
    channel: "stable",
    fetchImpl,
    dataDir,
    localZipPath: zipPath,
    localSumsPath: sumsPath,
  });
  assert.equal(res.ok, true);
  assert.ok(res.filesToOverwrite?.includes("forge_1.20.1/keep.json"));
  assert.ok(!res.filesToOverwrite?.includes("forge_1.20.1/new.json"));
  assert.ok(res.diskSpace);
  // dry-run must not overwrite
  assert.equal(JSON.parse(readFileSync(join(dataDir, "forge_1.20.1", "keep.json"), "utf8")).old, 1);
  assert.ok(existsSync(join(dataDir, "user-extra.txt")));
  rmSync(dataDir, { recursive: true, force: true });
}

async function testDataApplyWritesAndChecksumFail() {
  const dataDir = mkdtempSync(join(tmpdir(), "mc-upd-data-"));
  process.env.MC_SKILL_ALLOW_WRITE = "1";
  process.env.MC_SKILL_PROJECT_ROOT = dataDir;

  // Put data inside project root
  const nestedData = join(dataDir, "data");
  mkdirSync(nestedData, { recursive: true });
  writeFileSync(join(nestedData, "user-extra.txt"), "keep-me");

  const zipPath = join(dataDir, "pkg.zip");
  dataMod.writeStoreZip(zipPath, {
    "forge_1.20.1/a.json": "{\"ok\":true}",
  });
  const digest = sha256(readFileSync(zipPath));
  const sumsPath = join(dataDir, "SHA256SUMS.txt");
  writeFileSync(sumsPath, `${digest}  mc-skill-data-full-0.2.0.zip\n`);

  const release = mockRelease({ tag: "v9.9.9" });
  const fetchImpl = makeFetch((url) => {
    if (url.includes("/releases?")) return jsonRes([release]);
    return jsonRes({}, 404);
  });

  const badSums = join(dataDir, "bad-sums.txt");
  writeFileSync(badSums, `${"0".repeat(64)}  mc-skill-data-full-0.2.0.zip\n`);
  const bad2 = await update.mcSkillUpdate({
    action: "apply",
    scope: "data",
    dryRun: false,
    confirmed: true,
    fetchImpl,
    dataDir: nestedData,
    localZipPath: zipPath,
    localSumsPath: badSums,
  });
  assert.equal(bad2.action?.code, "DATA_CHECKSUM_MISMATCH");

  const ok = await update.mcSkillUpdate({
    action: "apply",
    scope: "data",
    dryRun: false,
    confirmed: true,
    fetchImpl,
    dataDir: nestedData,
    localZipPath: zipPath,
    localSumsPath: sumsPath,
    skipBuild: true,
  });
  assert.equal(ok.applied, true, JSON.stringify(ok));
  assert.ok(existsSync(join(nestedData, "forge_1.20.1", "a.json")));
  assert.ok(existsSync(join(nestedData, "user-extra.txt")), "换入后应保留 zip 外的旧文件");
  assert.ok(!existsSync(`${nestedData}.next`));
  assert.ok(!existsSync(`${nestedData}.prev`));
  const st = state.readUpdateState(nestedData);
  assert.equal(st.dataReleaseTag, "v9.9.9");

  delete process.env.MC_SKILL_ALLOW_WRITE;
  delete process.env.MC_SKILL_PROJECT_ROOT;
  rmSync(dataDir, { recursive: true, force: true });
}

async function testChecksumMissingAsset() {
  const dataDir = mkdtempSync(join(tmpdir(), "mc-upd-data-"));
  const fetchImpl = makeFetch((url) => {
    if (url.includes("/releases?")) {
      return jsonRes([mockRelease({ tag: "v9.9.9", withData: true, withSums: false })]);
    }
    return jsonRes({}, 404);
  });
  const res = await update.mcSkillUpdate({
    action: "apply",
    scope: "data",
    dryRun: true,
    fetchImpl,
    dataDir,
  });
  assert.equal(res.action?.code, "DATA_CHECKSUM_MISSING");
  rmSync(dataDir, { recursive: true, force: true });
}

async function testDataZipAndGithubDigest() {
  const digest = "ab".repeat(32);
  const release = mockRelease({ tag: "v0.2.0", withData: false, withSums: false });
  release.assets.push({
    name: "data.zip",
    size: 99,
    browser_download_url: "https://github.com/guguzea/MC-AI-Coding-Assistant-Tool/releases/download/v0.2.0/data.zip",
    digest: `sha256:${digest}`,
  });
  const picked = github.pickDataAssets(release);
  assert.equal(picked.zip.name, "data.zip");
  assert.equal(picked.checksumHex, digest);
  assert.equal(picked.action, undefined);
}

function testTlsCertErrorDetect() {
  return import(pathToFileURL(join(root, "update/http.js")).href).then((http) => {
    const cause = new Error("unable to verify the first certificate");
    cause.code = "UNABLE_TO_VERIFY_LEAF_SIGNATURE";
    const err = new Error("fetch failed");
    err.cause = cause;
    assert.equal(http.isTlsCertError(err), true);
    assert.equal(http.isTlsCertError(new Error("ENOTFOUND")), false);
  });
}

async function testPendingRestartHint() {
  const dataDir = mkdtempSync(join(tmpdir(), "mc-upd-data-"));
  state.writeUpdateState(
    {
      pendingRestart: true,
      pendingRestartSince: new Date().toISOString(),
      lastCheck: {
        at: new Date().toISOString(),
        updateAvailable: false,
        remoteTag: "v0.1.0",
        scopes: [],
      },
    },
    dataDir,
  );
  const hint = state.getUpdateHint(dataDir);
  assert.equal(hint.pendingRestart, true);
  assert.ok(hint.suggest?.includes("重启"));
  rmSync(dataDir, { recursive: true, force: true });
}

async function main() {
  testSemver();
  testZipLayout();
  testStagingContentRoot();
  await testRateLimit429();
  await testStableSkipsPrerelease();
  await testCheckUpdateAvailable();
  await testGitDescribeAheadNoUpdate();
  await testApplyRequiresConfirm();
  await testDataDryRunOverwriteList();
  await testDataApplyWritesAndChecksumFail();
  await testChecksumMissingAsset();
  await testDataZipAndGithubDigest();
  await testTlsCertErrorDetect();
  await testPendingRestartHint();
  console.log("test-update: ok");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
