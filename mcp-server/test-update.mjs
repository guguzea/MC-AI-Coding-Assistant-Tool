/**
 * Unit tests for mc_skill_update (mocked GitHub, local zip fixtures).
 */
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdirSync, mkdtempSync, writeFileSync, readFileSync, existsSync, rmSync, symlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { Readable } from "node:stream";

const root = join(import.meta.dirname, "dist");
/** 显式别名：下面若干用例用 `root` 当沙盒根，dist 根必须另名以免被遮蔽。 */
const DIST = root;
const update = await import(pathToFileURL(join(root, "update/index.js")).href);
const dataMod = await import(pathToFileURL(join(root, "update/data.js")).href);
const semver = await import(pathToFileURL(join(root, "update/semver.js")).href);
const github = await import(pathToFileURL(join(root, "update/github.js")).href);
const zip = await import(pathToFileURL(join(root, "update/zip.js")).href);
const state = await import(pathToFileURL(join(root, "update/state.js")).href);
const download = await import(pathToFileURL(join(root, "update/download.js")).href);
// C-7 门②需要按真实锁路径放置 busy 夹具（与 dist 同源，避免自己拼锁目录名）
const dirLock = await import(pathToFileURL(join(root, "utils/dir-lock.js")).href);

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
  // F1：ok:true 时 CLI 的 isToolFailure 判不出失败 → 按退出码分支的脚本把「什么都没做」当成功。
  assert.equal(res.ok, false, JSON.stringify(res).slice(0, 300));
  const { isToolFailure } = await import(pathToFileURL(join(root, "cli-parse.js")).href);
  assert.equal(
    isToolFailure(res, false, false),
    true,
    "确认门拒绝必须让 CLI 走 exitCode=1（与 activate_platform_pack write 同类拒绝一致）",
  );
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

async function testUpdateStateSingleSource() {
  const base = mkdtempSync(join(tmpdir(), "mc-upd-src-"));
  const dataDir = join(base, "data");
  const cacheDir = join(base, "cache");
  mkdirSync(dataDir, { recursive: true });
  mkdirSync(cacheDir, { recursive: true });
  const prevData = process.env.MC_SKILL_DATA;
  const prevCache = process.env.MC_SKILL_CACHE;
  process.env.MC_SKILL_DATA = dataDir;
  process.env.MC_SKILL_CACHE = cacheDir;
  try {
    const legacyPath = state.updateStateLegacyPath(dataDir);
    const canonPath = state.updateStatePath(dataDir);
    assert.equal(canonPath, join(cacheDir, "mc-skill-update-state.json"), "唯一读写来源必须是 cache 根");
    assert.equal(legacyPath, join(dataDir, "mc-skill-update-state.json"), "legacy 只在 data/ 下");
    assert.notEqual(canonPath, legacyPath, "夹具：两条路径必须不同，否则复现不了 A-22");

    // 旧部署遗留快照：既有 durable 的已装数据标识，也有过期的缓存瞬态
    writeFileSync(
      legacyPath,
      JSON.stringify({
        dataReleaseTag: "vLEGACY",
        lastCheck: { at: "2026-01-01T00:00:00.000Z", updateAvailable: true, remoteTag: "vOLD", scopes: ["data"] },
        pendingRestart: true,
      }),
      "utf8",
    );

    const adopted = state.readUpdateState(dataDir);
    assert.equal(adopted.dataReleaseTag, "vLEGACY", "durable 字段一次性采纳，别让老部署丢失已装数据标识");
    assert.equal(adopted.lastCheck, undefined, "A-22：lastCheck 属缓存瞬态，禁止从 legacy 复活");
    assert.equal(adopted.pendingRestart, undefined, "A-22：pendingRestart 禁止从 legacy 复活");
    assert.equal(state.getUpdateHint(dataDir).stale, true, "没有 lastCheck 就必须提示重新 check");

    const at = new Date().toISOString();
    state.writeUpdateState(
      { dataReleaseTag: "vNEW", lastCheck: { at, updateAvailable: false, remoteTag: "v9.9.9", scopes: [] } },
      dataDir,
    );
    assert.equal(JSON.parse(readFileSync(canonPath, "utf8")).dataReleaseTag, "vNEW", "写入必须落在 updateStatePath()");
    assert.equal(state.readUpdateState(dataDir).dataReleaseTag, "vNEW", "读回必须来自刚写入的同一文件");
    assert.equal(state.getUpdateHint(dataDir).stale, false, "写完后 hint 必须反映新写入的 lastCheck");
    assert.equal(JSON.parse(readFileSync(legacyPath, "utf8")).dataReleaseTag, "vLEGACY", "写路径永不碰 legacy 文件");

    // cache 状态文件被清掉（文档承诺 cache 可随意清）：瞬态不得回流成「当前状态」
    rmSync(canonPath);
    const after = state.readUpdateState(dataDir);
    assert.equal(after.lastCheck, undefined, "A-22：清 cache 后旧 lastCheck 不得复活");
    assert.equal(state.getUpdateHint(dataDir).stale, true, "清 cache 后必须重新 check，而不是沿用冻结快照");
    // 已记录的取舍：cache 清空后 durable 字段会重新采纳 legacy（数据树仍在原地）
    assert.equal(after.dataReleaseTag, "vLEGACY");
    const merged = state.writeUpdateState({ updatedAt: "2026-09-01T00:00:00.000Z" }, dataDir);
    assert.equal(merged.state.lastCheck, undefined, "A-22：冻结快照不得被当成当前状态再写回唯一路径");
  } finally {
    if (prevData === undefined) delete process.env.MC_SKILL_DATA;
    else process.env.MC_SKILL_DATA = prevData;
    if (prevCache === undefined) delete process.env.MC_SKILL_CACHE;
    else process.env.MC_SKILL_CACHE = prevCache;
    rmSync(base, { recursive: true, force: true });
  }
  console.log("update state 读写同源 (A-22): ok");
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

async function testDownloadRedirectOffAllowlistFails() {
  let calls = 0;
  const fetchImpl = async () => {
    calls += 1;
    return {
      ok: true,
      status: 200,
      url: "https://evil.example.com/payload.zip",
      headers: { get: () => null },
      body: Readable.toWeb(Readable.from([Buffer.from("EVIL")])),
    };
  };
  const dest = join(mkdtempSync(join(tmpdir(), "mc-dl-redir-")), "x.bin");
  const r = await download.downloadToFile(
    "https://github.com/guguzea/MC-AI-Coding-Assistant-Tool/releases/download/v0.2.0/a.zip",
    dest,
    { fetchImpl, maxAttempts: 3 },
  );
  assert.equal(r.ok, false, JSON.stringify(r));
  assert.equal(calls, 1, "重定向跳出白名单不得重试");
  assert.match(String(r.action?.message ?? ""), /重定向后跳出白名单/);
  assert.equal(existsSync(dest), false, "终址不在白名单时不得落盘");
}

async function testDownloadRedirectWithinAllowlistOk() {
  const fetchImpl = async () => ({
    ok: true,
    status: 200,
    url: "https://release-assets.githubusercontent.com/github-production-release-asset/1/2/a.zip",
    headers: { get: () => null },
    body: Readable.toWeb(Readable.from([Buffer.from("abc")])),
  });
  const dest = join(mkdtempSync(join(tmpdir(), "mc-dl-redir-ok-")), "x.bin");
  const r = await download.downloadToFile(
    "https://github.com/guguzea/MC-AI-Coding-Assistant-Tool/releases/download/v0.2.0/a.zip",
    dest,
    { fetchImpl, maxAttempts: 3 },
  );
  assert.equal(r.ok, true, JSON.stringify(r));
  assert.equal(readFileSync(dest, "utf8"), "abc");
}

// ── C-7 回归门 ①：github 列表路径的元素校验（sweep80 C3）────────────────────────
/**
 * 回归对象：`fetchReleasesList` 的列表路径曾只判 `Array.isArray(batch)`，随后
 * `all.push(...batch.filter(r => !r.draft))` —— 消费者（`pickDataAssets` / `release.tag_name`）
 * 会解引用 `.assets` / `.tag_name` ⇒ 畸形元素一路走到 TypeError。
 * 修后：元素逐个校验；**整页全畸形** ⇒ `ok:false` + `UPDATE_CHECK_FAILED`
 * （ 200 的畸形体不得被静默当成「仓库没有 Release」）。
 *
 * 诚实边界（不写成已覆盖）：**混合页里畸形元素仍被静默丢弃**（合法元素照常返回）——
 * 本条只钉「畸形元素不得进入消费者」，混合页静默丢弃已登记进 NEXT-ROUND。
 */
async function testGithubListRejectsMalformedElements() {
  const allMalformed = [
    ["整页 null", [null]],
    ["空对象元素", [{}]],
    ["tag_name 非字符串", [{ tag_name: 1, assets: [] }]],
    ["assets 非数组", [{ tag_name: "v1.0.0", assets: "nope" }]],
    ["null + 空对象", [null, {}]],
  ];
  for (const [label, body] of allMalformed) {
    const r = await github.resolveRelease({ channel: "stable", fetchImpl: makeFetch(() => jsonRes(body)) });
    assert.equal(r.ok, false, `${label}: 畸形元素不得被当成「没有 Release」→ ${JSON.stringify(r)}`);
    assert.equal(r.action?.code, "UPDATE_CHECK_FAILED", `${label}: 错误码应为 UPDATE_CHECK_FAILED`);
    // 判别力关键：光看 code 会被「空列表 ⇒ 未找到稳定版 Release」那条路径满足（同样是
    // UPDATE_CHECK_FAILED）——必须钉住「点是列表元素解析失败」这句话，否则本门抓不到回归。
    assert.match(
      String(r.action?.message ?? ""),
      /列表元素无法解析/,
      `${label}: 报错必须点名「列表元素解析失败」而不是「没有 Release」→ ${String(r.action?.message ?? "")}`,
    );
    assert.ok(!r.release, `${label}: 不得回传 release`);
  }
  // 整体非数组（200 的对象体）同样不得与「空数组 = 没有更多页」混为一谈（A-8 BB-1）
  const objBody = await github.resolveRelease({
    channel: "stable",
    fetchImpl: makeFetch(() => jsonRes({ message: "Bad credentials" })),
  });
  assert.equal(objBody.ok, false, `200 的对象体不得被当成「仓库没有 Release」→ ${JSON.stringify(objBody)}`);
  assert.match(String(objBody.action?.message ?? ""), /不是数组/, `须点名「响应不是数组」→ ${String(objBody.action?.message ?? "")}`);
  // 混合页：畸形元素**不得进入消费者**（不给 `.assets` / `.tag_name` 解引用留活口），合法元素照常返回
  const mixed = await github.resolveRelease({
    channel: "stable",
    fetchImpl: makeFetch(() => jsonRes([null, mockRelease({ tag: "v0.2.0" })])),
  });
  assert.equal(mixed.ok, true, JSON.stringify(mixed));
  assert.equal(mixed.release.tag_name, "v0.2.0");
  assert.ok(Array.isArray(mixed.release.assets), "回传对象的 assets 必须是数组（消费者会直接解引用）");
  // 正对照：干净列表必须仍然可用（防「一红到底」式假判别力）
  const okRes = await github.resolveRelease({
    channel: "stable",
    fetchImpl: makeFetch(() => jsonRes([mockRelease({ tag: "v0.2.0" })])),
  });
  assert.equal(okRes.ok, true, JSON.stringify(okRes));
  assert.equal(okRes.release.tag_name, "v0.2.0");
}

/**
 * 夹具：让 zip「中央目录可读、抽取必失败」。
 * 手法（两层，任一层都足以让解压失败，不依赖具体解压工具的实现细节）：
 *   ① 首条 local file header 签名 `PK\x03\x04` → `PK\x07\x08`（顺序扫描型工具不再认）
 *   ② 中央目录首条记录的「LFH 相对偏移」(CD 记录 +42) 指到文件尾之外
 * `listZipEntries` 只读中央目录的**名称字段**，两项都不影响它 ⇒ 抽取前的校验照常通过。
 */
function corruptZipExtraction(zipPath) {
  const buf = readFileSync(zipPath);
  const lfh = buf.indexOf(Buffer.from([0x50, 0x4b, 0x03, 0x04]));
  if (lfh < 0) throw new Error("夹具 zip 里找不到 LFH");
  buf.writeUInt32LE(0x08074b50, lfh);
  let eocd = -1;
  for (let i = buf.length - 22; i >= Math.max(0, buf.length - 65557); i--) {
    if (buf[i] === 0x50 && buf[i + 1] === 0x4b && buf[i + 2] === 0x05 && buf[i + 3] === 0x06) {
      eocd = i;
      break;
    }
  }
  if (eocd < 0) throw new Error("夹具 zip 里找不到 EOCD");
  const cd = buf.readUInt32LE(eocd + 16);
  if (buf.readUInt32LE(cd) !== 0x02014b50) throw new Error("夹具 zip 中央目录签名不符");
  buf.writeUInt32LE(buf.length + 4096, cd + 42);
  writeFileSync(zipPath, buf);
}

// ── C-7 回归门 ②：data 半交换自愈（sweep80 C5）────────────────────────────────
/**
 * 回归对象：`recoverPartialSwap` 曾被放在「解压失败 / 含 symlink / 树与 CD 清单不符」三条
 * 早退**之后** ⇒ 上一次崩溃留下的半交换态（`data/` 缺、`data.prev/` 握旧内容）在这些路径上
 * 永不自愈，而 `data/` 的缺失会让后续每个工具静默降级。
 * 修后：调用点紧跟**取锁成功**（`src/update/data.ts` 里 `recoverPartialSwap(dataDir)` 位于
 * `extractZip` 之前）。
 *
 * 为什么直接调 `applyDataUpdate` 而不走 `mcSkillUpdate`（诚实说明，不是图省事）：
 * `mcSkillUpdate` 在**取锁之前**会 `writeUpdateState({lastCheck…}, dataDir)`，而
 * `updateStatePath()` 对「非仓库 dataDir」把状态文件写进 dataDir 本身（`mkdirSync(dirname(p))`）
 * ⇒ 夹具里空的 `data/` 会被提前建出来，半交换态当场变成「data/ 在 + data.prev/ 在」，
 * 于是 `recoverPartialSwap` 走的是**删 prev** 的分支（旧内容被销毁）——测的已不是本不变量。
 * 半交换自愈的实现在 `data.ts`，直接调它既可测、又绕开这条夹具污染。
 * （`mcSkillUpdate` 前置状态写入带来的两个副作用已登记为 G-1/G-2，见 NEXT-ROUND。）
 *
 * 覆盖策略（诚实口径）：三条 post-lock 早退共用**同一个调用点**，故构造其中一条（解压失败）
 * 即足以证明放置点；另加两条**反例**证明不该恢复的路径确实没动：
 *   · `dryRun`（更早 return、不写盘）⇒ 半交换态**保持原样**，不得代用户改盘；
 *   · 取锁 busy（持锁者存在）⇒ **不得**恢复（否则与持锁者抢写）。
 */
async function testDataHalfSwapSelfHealsOnlyPostLock() {
  const root = mkdtempSync(join(tmpdir(), "mc-upd-halfswap-"));
  const dataDir = join(root, "data");
  const prevDir = `${dataDir}.prev`;
  const seedPrev = () => {
    mkdirSync(join(prevDir, "forge_1.7.10"), { recursive: true });
    writeFileSync(join(prevDir, "forge_1.7.10", "old.json"), '{"old":true}');
  };
  const resetHalfSwap = () => {
    rmSync(dataDir, { recursive: true, force: true });
    rmSync(prevDir, { recursive: true, force: true });
    seedPrev();
  };
  const ZIP = join(root, "broken.zip");
  dataMod.writeStoreZip(ZIP, { "forge_1.20.1/a.json": '{"ok":true}' });
  corruptZipExtraction(ZIP);
  const SUMS = join(root, "SHA256SUMS.txt");
  writeFileSync(SUMS, `${sha256(readFileSync(ZIP))}  mc-skill-data-full-0.2.0.zip\n`);

  const prevAllow = process.env.MC_SKILL_ALLOW_WRITE;
  const prevProj = process.env.MC_SKILL_PROJECT_ROOT;
  const prevCache = process.env.MC_SKILL_CACHE;
  process.env.MC_SKILL_ALLOW_WRITE = "1";
  process.env.MC_SKILL_PROJECT_ROOT = root;
  const lockRoot = mkdtempSync(join(tmpdir(), "mc-upd-halfswap-lock-"));
  process.env.MC_SKILL_CACHE = lockRoot; // update-apply 锁根（由 apply-lock 的 resolveCacheRoot 读）
  const lockDir = dirLock.dirLockPathOf(lockRoot, "update-apply");
  const ZIP_ASSET = {
    name: "mc-skill-data-full-0.2.0.zip",
    size: 128,
    browser_download_url: "https://github.com/guguzea/MC-AI-Coding-Assistant-Tool/releases/download/v0.2.0/mc-skill-data-full-0.2.0.zip",
  };
  const applyArgs = (extra = {}) => ({
    zip: ZIP_ASSET,
    releaseTag: "v9.9.9",
    dryRun: false,
    dataDir,
    localZipPath: ZIP,
    localSumsPath: SUMS,
    fetchImpl: makeFetch(() => jsonRes({}, 404)),
    ...extra,
  });
  try {
    // ① 主判据：取锁成功后的失败必须自愈 —— data/ 被 data.prev/ 换回，旧内容不丢
    resetHalfSwap();
    const failed = await dataMod.applyDataUpdate(applyArgs());
    assert.ok(
      ["DATA_EXTRACT_FAILED", "UNZIP_TOOL_MISSING", "DATA_ZIP_LAYOUT_INVALID"].includes(failed.action?.code),
      `夹具 zip 必须走「解压/布局」失败分支，实得 action=${JSON.stringify(failed.action ?? null)}`,
    );
    assert.equal(failed.ok, false, "失败必须回报 ok:false（本层契约）");
    assert.ok(
      existsSync(dataDir),
      "取锁成功后的失败未自愈半交换态：data/ 仍缺失（C5 回归 —— recoverPartialSwap 又被挪到早退之后？）",
    );
    assert.equal(readFileSync(join(dataDir, "forge_1.7.10", "old.json"), "utf8"), '{"old":true}', "自愈必须带回旧内容");
    assert.ok(!existsSync(prevDir), "自愈后 data.prev/ 应已消失（换回后不留残件）");
    assert.ok(!existsSync(`${dataDir}.next`), "不得留下 .next 残件（本路径根本没走到组装）");

    // ② 反例：dryRun 不得写盘，也不得「顺手」恢复
    resetHalfSwap();
    const dry = await dataMod.applyDataUpdate(applyArgs({ dryRun: true }));
    assert.equal(dry.ok, true, JSON.stringify(dry));
    assert.equal(existsSync(dataDir), false, "dryRun 不得写盘（也不得顺手恢复半交换态）");
    assert.ok(existsSync(join(prevDir, "forge_1.7.10", "old.json")), "dryRun 不得动 data.prev/");

    // ③ 反例：取锁 busy 不得抢着恢复（否则与持锁者抢写）
    resetHalfSwap();
    mkdirSync(lockDir, { recursive: true });
    writeFileSync(join(lockDir, "owner.json"), JSON.stringify({ pid: 1, at: Date.now() }));
    const busy = await dataMod.applyDataUpdate(applyArgs());
    assert.equal(busy.action?.code, "UPDATE_BUSY", `持锁者存在时应 UPDATE_BUSY，实得 ${JSON.stringify(busy).slice(0, 200)}`);
    assert.equal(existsSync(dataDir), false, "busy 路径不得抢着恢复（会与持锁者竞争）");
    assert.ok(existsSync(join(prevDir, "forge_1.7.10", "old.json")), "busy 路径不得动 data.prev/");
  } finally {
    if (prevAllow === undefined) delete process.env.MC_SKILL_ALLOW_WRITE;
    else process.env.MC_SKILL_ALLOW_WRITE = prevAllow;
    if (prevProj === undefined) delete process.env.MC_SKILL_PROJECT_ROOT;
    else process.env.MC_SKILL_PROJECT_ROOT = prevProj;
    if (prevCache === undefined) delete process.env.MC_SKILL_CACHE;
    else process.env.MC_SKILL_CACHE = prevCache;
    rmSync(root, { recursive: true, force: true });
    rmSync(lockRoot, { recursive: true, force: true });
  }
}

// ── G-1 回归门：apply 的**带内失败**必须 ok:false（否则 CLI 出 success:true + rc=0）────────
/**
 * 回归对象：`mcSkillUpdate` 的失败分支此前沿用 `base.ok = true`，而 `cli-parse.ts:isToolFailure`
 * 只认 `ok===false` / `passed===false` / …（**不看 `action`**）⇒ 一次失败的 apply 在 CLI 里表现为
 * `success:true` + `exitCode:0`。同文件 `CONFIRMATION_REQUIRED` 分支逐字写着正确范式（带内 ok:false）。
 * 本门走**真实调用链**（mcSkillUpdate → applyDataUpdate），并用 `isToolFailure` 复核判定链结论。
 */
async function testUpdateApplyFailureIsNotOk() {
  const root = mkdtempSync(join(tmpdir(), "mc-upd-g1-"));
  const dataDir = join(root, "data");
  mkdirSync(join(dataDir, "forge_1.7.10"), { recursive: true });
  writeFileSync(join(dataDir, "forge_1.7.10", "old.json"), '{"old":true}');
  const ZIP = join(root, "broken.zip");
  dataMod.writeStoreZip(ZIP, { "forge_1.20.1/a.json": '{"ok":true}' });
  corruptZipExtraction(ZIP);
  const SUMS = join(root, "SHA256SUMS.txt");
  writeFileSync(SUMS, `${sha256(readFileSync(ZIP))}  mc-skill-data-full-0.2.0.zip\n`);

  const prevAllow = process.env.MC_SKILL_ALLOW_WRITE;
  const prevProj = process.env.MC_SKILL_PROJECT_ROOT;
  const prevCache = process.env.MC_SKILL_CACHE;
  const prevData = process.env.MC_SKILL_DATA;
  process.env.MC_SKILL_ALLOW_WRITE = "1";
  process.env.MC_SKILL_PROJECT_ROOT = root;
  process.env.MC_SKILL_DATA = dataDir; // data/ 存在 ⇒ isRepoDataDir 真 ⇒ 状态落 cache，不碰 data/
  const lockRoot = mkdtempSync(join(tmpdir(), "mc-upd-g1-lock-"));
  process.env.MC_SKILL_CACHE = lockRoot;
  try {
    const r = await update.mcSkillUpdate({
      action: "apply",
      scope: "data",
      dryRun: false,
      confirmed: true,
      fetchImpl: makeFetch(() => jsonRes([mockRelease({ tag: "v9.9.9" })])),
      dataDir,
      localZipPath: ZIP,
      localSumsPath: SUMS,
      skipBuild: true,
    });
    assert.equal(r.action?.code, "DATA_EXTRACT_FAILED", `夹具应走解压失败分支，实得 ${JSON.stringify(r.action ?? null)}`);
    assert.equal(r.ok, false, `带内失败必须 ok:false（否则 CLI 判 success:true + rc=0）→ ${JSON.stringify(r).slice(0, 200)}`);
    assert.equal(r.applied, false, "失败的 apply 不得自报 applied:true");
    // 判定链复核：CLI 的失败判据就是 isToolFailure（只认 ok/passed/found/errors，不看 action）
    const cliParse = await import(pathToFileURL(join(DIST, "cli-parse.js")).href);
    assert.equal(
      cliParse.isToolFailure(r, false, false),
      true,
      "判定链必须把它判成失败；若为 false 说明 ok 仍是 true（G-1 回归）",
    );
  } finally {
    if (prevAllow === undefined) delete process.env.MC_SKILL_ALLOW_WRITE;
    else process.env.MC_SKILL_ALLOW_WRITE = prevAllow;
    if (prevProj === undefined) delete process.env.MC_SKILL_PROJECT_ROOT;
    else process.env.MC_SKILL_PROJECT_ROOT = prevProj;
    if (prevCache === undefined) delete process.env.MC_SKILL_CACHE;
    else process.env.MC_SKILL_CACHE = prevCache;
    if (prevData === undefined) delete process.env.MC_SKILL_DATA;
    else process.env.MC_SKILL_DATA = prevData;
    rmSync(root, { recursive: true, force: true });
    rmSync(lockRoot, { recursive: true, force: true });
  }
}

// ── G-2 回归门：data 根解析**不得**因目录缺失而回退（半交换态）──────────────────────────
/**
 * 回归对象：`getDataDirFromEnv()` 曾在 `!existsSync(abs)` 时返回 null ⇒ `resolveDataDir()` 回退
 * `<cwd>/data`。而「`data/` 缺失」正是半交换态的定义 ⇒ update 的 `recoverPartialSwap` 会去找
 * **错位置**的 `data.prev`（C5 自愈不可达），apply 还可能把数据写到别处。
 * 本门在**子进程**里跑（避免改动进程级 MC_SKILL_DATA 影响本文件的其它用例）。
 */
async function testResolveDataDirKeepsDeclaredRootWhenMissing() {
  const pathHref = pathToFileURL(join(DIST, "utils/path.js")).href;
  const missing = join(tmpdir(), `mc-skill-missing-${process.pid}-${Date.now()}`, "data");
  const code = `
const m = await import(${JSON.stringify(pathHref)});
process.env.MC_SKILL_DATA = ${JSON.stringify(missing)};
const got = m.resolveDataDir();
console.log("GOT=" + got);
console.log("CWD_DATA=" + (got === ${JSON.stringify(join(process.cwd(), "data"))} ? "yes" : "no"));
console.log("EXISTS=" + (got === ${JSON.stringify(resolve(missing))} ? "declared" : "other"));
`;
  const out = await new Promise((r) => {
    const c = spawnSync(process.execPath, ["--input-type=module", "-e", code], { encoding: "utf8", windowsHide: true });
    r(`${c.stdout ?? ""}${c.stderr ?? ""}`);
  });
  assert.match(out, /EXISTS=declared/, `MC_SKILL_DATA 指向不存在目录时必须仍按它解析，实得：\n${out.slice(0, 400)}`);
  assert.match(out, /CWD_DATA=no/, `不得回退到 <cwd>/data（G-2 回归：半交换自愈会打错位置）\n${out.slice(0, 400)}`);
}

// ── BB-4 回归门：host 白名单单源 + **收掉后缀通配**（用户裁定方向）────────────────
/**
 * 回归对象：`http.ts` 走精确集合、`download.ts` 多一条 `endsWith(".githubusercontent.com")`
 * 无限后缀通配 ⇒ 两处漂移，且净效果是**放宽**（`raw`/`gist`/`media`/`evil.*` 在 download 侧被接受，
 * 而守 Authorization 与重定向终点复核的 `assertAllowedGithubUrl` 会拒）。
 * 修后：唯一权威在 `src/update/hosts.ts`，两侧共用同一份精确集合（无后缀通配）。
 */
async function testHostAllowlistIsExactAndSingleSource() {
  const hosts = await import(pathToFileURL(join(DIST, "update/hosts.js")).href);
  const httpMod = await import(pathToFileURL(join(DIST, "update/http.js")).href);
  const dl = await import(pathToFileURL(join(DIST, "update/download.js")).href);

  // ① 收掉通配：这些此前只在 download 侧被接受 ⇒ 现在两侧必须一致拒绝
  const mustReject = [
    "https://raw.githubusercontent.com/o/r/main/README.md",
    "https://gist.githubusercontent.com/u/id/raw/x",
    "https://media.githubusercontent.com/media/o/r/main/x",
    "https://evil.githubusercontent.com/a.zip",
    "https://avatars.githubusercontent.com/u/1",
  ];
  for (const u of mustReject) {
    assert.equal(hosts.isAllowedDownloadUrl(u), false, `${u} 不得被 download 白名单接受（BB-4：已收掉后缀通配）`);
    assert.throws(() => httpMod.assertAllowedGithubUrl(u), /未白名单主机/, `${u} 必须被 http 侧拒绝`);
  }
  // ② 精确集合仍可用（正对照，防「一律拒」式假绿）
  for (const u of [
    "https://api.github.com/repos/x/y/releases",
    "https://github.com/o/r/releases/download/v1/a.zip",
    "https://objects.githubusercontent.com/a",
    "https://release-assets.githubusercontent.com/b",
  ]) {
    assert.equal(hosts.isAllowedDownloadUrl(u), true, `${u} 属精确集合，必须仍被接受`);
    assert.doesNotThrow(() => httpMod.assertAllowedGithubUrl(u));
  }
  // ③ 单源：download 侧必须就是 hosts 的同名函数（不是各写一份）
  assert.equal(dl.isAllowedDownloadUrl, hosts.isAllowedDownloadUrl, "download 的谓词必须与 hosts 单源同函数");
  // ④ 协议门仍在 host 门之前（`http://` 必须因协议被拒，而不是因 host）
  assert.equal(hosts.isAllowedDownloadUrl("http://github.com/a.zip"), false);
  assert.throws(() => httpMod.assertAllowedGithubUrl("http://github.com/a.zip"), /非 HTTPS/, "http 侧协议门必须先于 host 门");
}

async function main() {
  testSemver();
  testZipLayout();
  testStagingContentRoot();
  await testRateLimit429();
  await testStableSkipsPrerelease();
  await testStablePaginatesPastFirstPage();
  await testGithubListRejectsMalformedElements(); // C-7 ①
  await testDataHalfSwapSelfHealsOnlyPostLock(); // C-7 ②
  await testUpdateApplyFailureIsNotOk(); // G-1
  await testResolveDataDirKeepsDeclaredRootWhenMissing(); // G-2
  await testHostAllowlistIsExactAndSingleSource(); // BB-4
  await testDownload404NoRetry();
  await testDownload429RetriesThenOk();
  await testDownloadRedirectOffAllowlistFails();
  await testDownloadRedirectWithinAllowlistOk();
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
  await testUpdateStateSingleSource();
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
