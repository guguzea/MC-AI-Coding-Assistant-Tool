/**
 * Unit tests for mc_skill_update (mocked GitHub, local zip fixtures).
 */
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdirSync, mkdtempSync, writeFileSync, readFileSync, existsSync, rmSync, symlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { Readable } from "node:stream";

const root = join(import.meta.dirname, "dist");
const update = await import(pathToFileURL(join(root, "update/index.js")).href);
const dataMod = await import(pathToFileURL(join(root, "update/data.js")).href);
const semver = await import(pathToFileURL(join(root, "update/semver.js")).href);
const github = await import(pathToFileURL(join(root, "update/github.js")).href);
const zip = await import(pathToFileURL(join(root, "update/zip.js")).href);
const state = await import(pathToFileURL(join(root, "update/state.js")).href);
const download = await import(pathToFileURL(join(root, "update/download.js")).href);

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
  mkdirSync(join(nestedData, "forge_1.7.10"), { recursive: true });
  writeFileSync(join(nestedData, "forge_1.7.10", "old.json"), "{}");

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
  assert.ok(!existsSync(join(nestedData, "user-extra.txt")), "全量快照换入后非 zip 文件应删除（撤档）");
  assert.ok(!existsSync(join(nestedData, "forge_1.7.10", "old.json")), "撤档版本树应删除");
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

async function testMdkUnpackPinGate() {
  const mdk = await import(pathToFileURL(join(root, "mdk/index.js")).href);
  const verifyMod = await import(pathToFileURL(join(root, "utils/extract-verify.js")).href);

  // verifyExtractedTree 单元：集合一致/多余/缺失
  const vRoot = mkdtempSync(join(tmpdir(), "mc-verify-"));
  mkdirSync(join(vRoot, "sub"), { recursive: true });
  writeFileSync(join(vRoot, "a.txt"), "a");
  writeFileSync(join(vRoot, "sub", "b.txt"), "b");
  assert.equal(verifyMod.verifyExtractedTree(vRoot, ["a.txt", "sub/b.txt"]).ok, true);
  const extra = verifyMod.verifyExtractedTree(vRoot, ["a.txt"]);
  assert.equal(extra.ok, false);
  assert.ok(/LFH|中央目录之外/.test(extra.problem), extra.problem);
  const missing = verifyMod.verifyExtractedTree(vRoot, ["a.txt", "sub/b.txt", "ghost.txt"]);
  assert.equal(missing.ok, false);
  assert.ok(/未落盘/.test(missing.problem), missing.problem);
  rmSync(vRoot, { recursive: true, force: true });

  const linkRoot = mkdtempSync(join(tmpdir(), "mc-verify-link-"));
  writeFileSync(join(linkRoot, "a.txt"), "a");
  try {
    symlinkSync(join(linkRoot, "a.txt"), join(linkRoot, "link.txt"));
    const linked = verifyMod.verifyExtractedTree(linkRoot, ["a.txt"]);
    assert.equal(linked.ok, false, JSON.stringify(linked));
    assert.ok(/符号链接/.test(linked.problem), linked.problem);
  } catch (err) {
    if (!/EPERM|EACCES|privilege|not supported/i.test(String(err))) throw err;
  } finally {
    rmSync(linkRoot, { recursive: true, force: true });
  }

  const zipBuf = mdk.createStoreZip([
    {
      name: "ExampleMod.java",
      data: "package com.example;\n@Mod(\"examplemod\")\npublic class ExampleMod {}\n",
    },
  ]);
  const destCache = mkdtempSync(join(tmpdir(), "mc-mdk-unpack-"));
  try {
    // 路径 1：有 pin 且匹配 → ok
    const pinned = mdk.unpackMdkArchive({ zip: zipBuf, destCache: join(destCache, "p1"), expectedSha256: sha256(zipBuf) });
    assert.equal(pinned.ok, true, JSON.stringify(pinned.error ?? pinned));

    // 路径 2：无 pin 且未显式 allowUnpinned → fail-closed MDK_NOT_PINNED
    const unpinned = mdk.unpackMdkArchive({ zip: zipBuf, destCache: join(destCache, "p2"), expectedSha256: null });
    assert.equal(unpinned.ok, false);
    assert.equal(unpinned.error?.code, "MDK_NOT_PINNED", JSON.stringify(unpinned.error ?? {}));

    // 路径 3：无 pin + allowUnpinned:true → 旧流程可用
    const allowed = mdk.unpackMdkArchive({
      zip: zipBuf,
      destCache: join(destCache, "p3"),
      expectedSha256: null,
      allowUnpinned: true,
    });
    assert.equal(allowed.ok, true, JSON.stringify(allowed.error ?? allowed));

    // pin 不匹配仍拒绝（原有行为保持）
    const mismatch = mdk.unpackMdkArchive({ zip: zipBuf, destCache: join(destCache, "p4"), expectedSha256: "0".repeat(64) });
    assert.equal(mismatch.ok, false);
    assert.equal(mismatch.error?.code, "SHA256_MISMATCH");
  } finally {
    rmSync(destCache, { recursive: true, force: true });
  }
}

async function testWriteUpdateStateFailure() {
  const blocker = mkdtempSync(join(tmpdir(), "mc-upd-ro-"));
  const asFile = join(blocker, "not-a-dir");
  writeFileSync(asFile, "x");
  const res = state.writeUpdateState(
    {
      lastCheck: {
        at: new Date().toISOString(),
        updateAvailable: false,
        remoteTag: "v0",
        scopes: [],
      },
    },
    asFile,
  );
  assert.equal(res.writeFailed, true, JSON.stringify(res));
  assert.ok(res.warning && /无法写入更新状态/.test(res.warning), res.warning);
  rmSync(blocker, { recursive: true, force: true });
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

async function testStablePaginatesPastFirstPage() {
  const fetchImpl = makeFetch((url) => {
    const u = new URL(url);
    const page = Number(u.searchParams.get("page") || "1");
    if (page === 1) {
      return jsonRes(
        Array.from({ length: 30 }, (_, i) =>
          mockRelease({ tag: `v0.9.${i}-beta`, prerelease: true, withData: false, withSums: false }),
        ),
      );
    }
    if (page === 2) {
      return jsonRes([mockRelease({ tag: "v0.2.0", prerelease: false, withData: false, withSums: false })]);
    }
    return jsonRes([]);
  });
  const r = await github.resolveRelease({ channel: "stable", fetchImpl });
  assert.equal(r.ok, true, JSON.stringify(r));
  assert.equal(r.release.tag_name, "v0.2.0");
}

async function testDownload404NoRetry() {
  let calls = 0;
  const fetchImpl = async () => {
    calls += 1;
    return jsonRes({}, 404);
  };
  const dest = join(mkdtempSync(join(tmpdir(), "mc-dl-")), "x.bin");
  const r = await download.downloadToFile(
    "https://github.com/guguzea/MC-AI-Coding-Assistant-Tool/releases/download/v0.2.0/a.zip",
    dest,
    { fetchImpl, maxAttempts: 3 },
  );
  assert.equal(r.ok, false);
  assert.equal(calls, 1, "404 不得重试");
  assert.match(String(r.action?.message ?? ""), /不重试/);
}

async function testDownload429RetriesThenOk() {
  let calls = 0;
  const fetchImpl = async () => {
    calls += 1;
    if (calls === 1) return jsonRes({}, 429, { "retry-after": "0" });
    const body = Readable.toWeb(Readable.from([Buffer.from("abc")]));
    return {
      ok: true,
      status: 200,
      headers: { get: () => null },
      body,
    };
  };
  const dest = join(mkdtempSync(join(tmpdir(), "mc-dl-ok-")), "x.bin");
  const r = await download.downloadToFile(
    "https://github.com/guguzea/MC-AI-Coding-Assistant-Tool/releases/download/v0.2.0/a.zip",
    dest,
    { fetchImpl, maxAttempts: 3 },
  );
  assert.equal(r.ok, true, JSON.stringify(r));
  assert.equal(calls, 2);
  assert.equal(readFileSync(dest, "utf8"), "abc");
}

async function main() {
  testSemver();
  testZipLayout();
  testStagingContentRoot();
  await testRateLimit429();
  await testStableSkipsPrerelease();
  await testStablePaginatesPastFirstPage();
  await testDownload404NoRetry();
  await testDownload429RetriesThenOk();
  await testCheckUpdateAvailable();
  await testGitDescribeAheadNoUpdate();
  await testApplyRequiresConfirm();
  await testDataDryRunOverwriteList();
  await testDataApplyWritesAndChecksumFail();
  await testChecksumMissingAsset();
  await testDataZipAndGithubDigest();
  await testTlsCertErrorDetect();
  await testMdkUnpackPinGate();
  await testPendingRestartHint();
  await testWriteUpdateStateFailure();
  await testInvalidActionSkipsNetwork();
  console.log("test-update: ok");
}

async function testInvalidActionSkipsNetwork() {
  let fetched = false;
  const r = await update.mcSkillUpdate({
    action: "nope",
    fetchImpl: async () => {
      fetched = true;
      throw new Error("should not fetch");
    },
  });
  assert.equal(r.ok, false, JSON.stringify(r));
  assert.equal(fetched, false, "invalid action must not hit GitHub");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
