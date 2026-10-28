/**
 * MDK 分发形态回归（2026-10-28 按实况订正）。
 *
 * 实况（三条独立证据：registry `dist.unpackedSize` 156 MB ≠ dist 13.6 MB；
 * `npm pack --dry-run` 列出 `data/mdk-checksums.json`；`scripts/postinstall.mjs`
 * 自述「npm 包自带的 7 个顶层项」）：
 *   - npm 包：`files` 含 `data` ⇒ 自带 7 项小数据（含 pin 表），pin 链可用；
 *   - GitHub Release `mcp-server-*.zip`：只打 `dist/` + 元数据，**不含**这 7 项 ⇒ pin 表缺失；
 *   - 平台语料（`forge_*` 等）两种形态都不含，走 `mc-skill-data-full-*.zip`。
 *
 * 旧测试把两者说反了（前提写成「npm 包不含 data/」），并据此断言错误文案。
 * 这里改成**双形态**，并对文案做正反两臂：
 *   A 形态（包内无 data = Release zip）：仍 fail-closed，提示必须给「补 data / env 指表 /
 *     显式 allowUnpinned」三条出路，且**不得**再声称「npm 包只含代码」。
 *   B 形态（包内自带 data = npm 包）：pin 表可读、可回写。
 *
 * 运行：npm run test:mdk-npm-form
 *   （该 script 先用 tsc --outDir temp/_b06dist 编译，刻意不碰 dist/）
 */
import assert from "node:assert/strict";
import { existsSync, mkdtempSync, mkdirSync, writeFileSync, readdirSync, readFileSync, rmSync, copyFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
// 位于 mcp-server/ 下，编译产物 temp/_b06dist 需回退到仓库根再进 temp/
const distEntry = join(here, "..", "temp", "_b06dist", "mdk", "index.js");

let pass = 0;
const failures = [];

function test(name, fn) {
  let result;
  try {
    result = fn();
  } catch (e) {
    failures.push([name, e]);
    console.log(`[XX] ${name} :: ${e.message}`);
    return;
  }
  if (result && typeof result.then === "function") {
    const e = new Error("async 用例被交给同步 test()：断言永不按序执行。改成 await atest(...)");
    failures.push([name, e]);
    console.log(`[XX] ${name} :: ${e.message}`);
    result.catch(() => {});
    return;
  }
  pass++;
  console.log(`[OK] ${name}`);
}

async function atest(name, fn) {
  try {
    await fn();
    pass++;
    console.log(`[OK] ${name}`);
  } catch (e) {
    failures.push([name, e]);
    console.log(`[XX] ${name} :: ${e.message}`);
  }
}

if (!existsSync(distEntry)) {
  console.error(`需要先构建：找不到 ${distEntry}（请先 npm run build）`);
  process.exit(1);
}

function makeZip(mod) {
  return mod.createStoreZip([
    {
      name: "ExampleMod.java",
      data: 'package com.example;\n@Mod("examplemod")\npublic class ExampleMod {}\n',
    },
  ]);
}

/** 手工递归复制（本沙箱里 fs.cpSync recursive 会被拦，进程静默 exit 127）。 */
function copyTree(src, dst) {
  mkdirSync(dst, { recursive: true });
  for (const e of readdirSync(src, { withFileTypes: true })) {
    const s = join(src, e.name);
    const d = join(dst, e.name);
    if (e.isDirectory()) copyTree(s, d);
    else copyFileSync(s, d);
  }
}

const MIN_SUMS = JSON.stringify(
  { entries: [{ id: "e1", platform: "forge", minecraftVersion: "1.20.1", buildPlugin: "forgegradle", sha256: null }] },
  null,
  2,
);

/**
 * 造一个包目录。`withData` 决定是哪种形态：
 *  - false → 模拟 GitHub Release 的 `mcp-server-*.zip`（只有 dist + 元数据）
 *  - true  → 模拟 registry 上的 npm 包（另有 data/mdk-checksums.json）
 */
function makePackage({ withData }) {
  const root = mkdtempSync(join(tmpdir(), "mcp-mdkform-"));
  const pkg = join(root, "node_modules", "mc-ai-coding-assistant-tool");
  mkdirSync(pkg, { recursive: true });
  copyTree(join(here, "..", "temp", "_b06dist"), join(pkg, "dist"));
  writeFileSync(join(pkg, "package.json"), JSON.stringify({ name: "mc-ai-coding-assistant-tool", version: "2.0.0" }, null, 2));
  writeFileSync(join(pkg, "README.md"), "# package form\n");
  writeFileSync(join(pkg, "LICENSE"), "MIT\n");
  if (withData) {
    mkdirSync(join(pkg, "data"), { recursive: true });
    writeFileSync(join(pkg, "data", "mdk-checksums.json"), MIN_SUMS);
  }
  assert.equal(existsSync(join(pkg, "data", "mdk-checksums.json")), withData, "形态前提失败");
  return { root, pkg };
}

async function importPkg(pkg) {
  const mod = await import(pathToFileURL(join(pkg, "dist", "mdk", "index.js")).href);
  return { mod, cleanup: () => rmSync(join(pkg, "..", ".."), { recursive: true, force: true }) };
}

const tmpDirs = [];
function track(d) {
  tmpDirs.push(d);
  return d;
}

// ── A 形态：包内无 data（= Release `mcp-server-*.zip`）────────────────────────
await atest("A-1 无 data 形态：checksumsPath() 指向包内且文件不存在（复现缺表）", async () => {
  const { pkg } = makePackage({ withData: false });
  track(pkg);
  const { mod } = await importPkg(pkg);
  const p = mod.checksumsPath();
  assert.ok(!existsSync(p), `该形态下 pin 表本应不存在，却存在：${p}`);
  assert.ok(p.includes(join("data", "mdk-checksums.json")), `pin 表路径应指向 data/mdk-checksums.json，实际：${p}`);
  assert.ok(p.startsWith(pkg), `pin 表路径应位于包内，实际：${p}`);
});

await atest("A-2 无 data 形态：loadMdkChecksums() 降级为空表且不谎报损坏", async () => {
  const { pkg } = makePackage({ withData: false });
  track(pkg);
  const { mod } = await importPkg(pkg);
  const loaded = mod.loadMdkChecksums();
  assert.deepEqual(loaded.entries, []);
  assert.equal(loaded.invalid, undefined, "文件不存在不得报 invalid（那是损坏语义）");
});

await atest("A-3 无 data 形态：MDK_NOT_PINNED 文案给三条真出路，且不再谎称「npm 包不含 data」", async () => {
  const { pkg } = makePackage({ withData: false });
  track(pkg);
  const { mod } = await importPkg(pkg);
  const r = await mod.downloadOfficialMdk({ platform: "forge", minecraftVersion: "1.20.1" });
  assert.equal(r.ok, false);
  assert.equal(r.error.code, "MDK_NOT_PINNED", JSON.stringify(r.error));
  const msg = String(r.error.message);
  assert.match(msg, /pin 表/, "文案必须点名 pin 表");
  assert.match(msg, /data-full/, "必须指向 mc-skill-data-full 这条补数据出路");
  assert.match(msg, /--data/, "必须给出 npm install --data 这条出路");
  assert.match(msg, /MC_SKILL_MDK_CHECKSUMS/, "必须给出 env 覆盖这条出路");
  // 反臂：旧结论（把 npm 包说成不含 data）不得复活
  assert.doesNotMatch(msg, /npm 包只含代码/);
  assert.doesNotMatch(msg, /npm 安装形态下 MDK 校验链不可用/);
});

await atest("A-4 无 data 形态：nextSteps 同样带补数据与环境变量指向", async () => {
  const { pkg } = makePackage({ withData: false });
  track(pkg);
  const { mod } = await importPkg(pkg);
  const r = await mod.downloadOfficialMdk({ platform: "neoforge", minecraftVersion: "1.20.4" });
  const steps = (r.nextSteps ?? []).join("\n");
  assert.ok(steps.length > 0, "无 pin 时应给 nextSteps");
  assert.match(steps, /data-full/);
  assert.match(steps, /MC_SKILL_MDK_CHECKSUMS/);
});

await atest("A-5 fail-closed 未被放宽：无 allowUnpinned 仍然拒绝解压", async () => {
  const { pkg } = makePackage({ withData: false });
  track(pkg);
  const { mod } = await importPkg(pkg);
  const zipDir = mkdtempSync(join(tmpdir(), "mcp-zip-"));
  track(zipDir);
  const zipBuf = makeZip(mod);

  const r = mod.unpackMdkArchive({ zip: zipBuf, destCache: join(zipDir, "out") });
  assert.equal(r.ok, false);
  assert.equal(r.error.code, "MDK_NOT_PINNED", `fail-closed 必须保持，实际 ${JSON.stringify(r.error)}`);
  const msg = String(r.error.message);
  assert.match(msg, /allowUnpinned/, "不得改动 allowUnpinned 的原有语义");
  assert.match(msg, /data-full/, "缺表时必须给出补数据出路");
});

await atest("A-6 表损坏（Z-1）：仍是独立错误码，且修复 pin 表的指引不被形态提示冲掉", async () => {
  const { pkg } = makePackage({ withData: false });
  track(pkg);
  const { mod } = await importPkg(pkg);
  const bad = mkdtempSync(join(tmpdir(), "mcp-badsums-"));
  track(bad);
  const sums = join(bad, "mdk-checksums.json");
  writeFileSync(sums, "{ not valid json !!!");
  const prev = process.env.MC_SKILL_MDK_CHECKSUMS;
  try {
    process.env.MC_SKILL_MDK_CHECKSUMS = sums;
    const r = await mod.downloadOfficialMdk({ platform: "neoforge", minecraftVersion: "26.1.2", dryRun: true });
    assert.equal(r.ok, false);
    assert.equal(r.error.code, "MDK_CHECKSUMS_INVALID", "损坏必须仍是独立错误码（Z-1 不得回归）");
    const steps = r.nextSteps ?? [];
    assert.ok(steps.some((s) => /mdk-checksums\.json/.test(s)), `修复 pin 表的指引必须保留，实得 ${JSON.stringify(steps)}`);
  } finally {
    if (prev === undefined) delete process.env.MC_SKILL_MDK_CHECKSUMS;
    else process.env.MC_SKILL_MDK_CHECKSUMS = prev;
  }
});

await atest("A-7 无 data 形态：writebackSha256IfNull 必然 false（回写无处可写）", async () => {
  const { pkg } = makePackage({ withData: false });
  track(pkg);
  const { mod } = await importPkg(pkg);
  assert.equal(mod.writebackSha256IfNull("any-entry-id", "0".repeat(64)), false, "缺表时回写必须失败");
});

// ── B 形态：包内自带 data（= registry 上的 npm 包）───────────────────────────
await atest("B-1 自带 data 形态：pin 表可读（entries 非空）", async () => {
  const { pkg } = makePackage({ withData: true });
  track(pkg);
  const { mod } = await importPkg(pkg);
  const p = mod.checksumsPath();
  assert.ok(existsSync(p), `npm 形态应自带 pin 表，实际不存在：${p}`);
  const loaded = mod.loadMdkChecksums();
  assert.equal(loaded.invalid, undefined);
  assert.equal(loaded.entries.length, 1, "自带表必须解析出条目");
  assert.equal(loaded.entries[0].id, "e1");
});

await atest("B-2 自带 data 形态：writebackSha256IfNull 能写回包内 pin 表", async () => {
  const { pkg } = makePackage({ withData: true });
  track(pkg);
  const { mod } = await importPkg(pkg);
  assert.equal(mod.writebackSha256IfNull("e1", "a".repeat(64)), true, "包内 pin 表可写时必须能回写");
  assert.match(readFileSync(join(pkg, "data", "mdk-checksums.json"), "utf8"), /a{64}/, "回写内容必须真的落盘");
});

await atest("B-3 自带 data 但条目 sha256 为空：仍 fail-closed（只改文案，不放宽门）", async () => {
  const { pkg } = makePackage({ withData: true });
  track(pkg);
  const { mod } = await importPkg(pkg);
  const zipDir = mkdtempSync(join(tmpdir(), "mcp-zip2-"));
  track(zipDir);
  const zipBuf = makeZip(mod);
  // dryRun 不碰网络：直接走解压门的 pin 判据（expectedSha256 缺失）
  const r = mod.unpackMdkArchive({ zip: zipBuf, destCache: join(zipDir, "out") });
  assert.equal(r.ok, false);
  assert.equal(r.error.code, "MDK_NOT_PINNED", "条目未回写时仍须拒绝解压");
  const msg = String(r.error.message);
  assert.match(msg, /未回写/, "必须说明是条目未回写，而不是表不存在");
});

await atest("B-4 自带 data 且已 pin：校验通过时解压成功、不新增 warning", async () => {
  const { pkg } = makePackage({ withData: true });
  track(pkg);
  const { mod } = await importPkg(pkg);
  const zipDir = mkdtempSync(join(tmpdir(), "mcp-zip3-"));
  track(zipDir);
  const zipBuf = makeZip(mod);
  const good = mod.sha256Buf(zipBuf);
  const r = mod.unpackMdkArchive({ zip: zipBuf, destCache: join(zipDir, "out"), expectedSha256: good });
  assert.equal(r.ok, true, JSON.stringify(r.error ?? {}));
  assert.equal(r.warnings, undefined, `已 pin 成功时不得新增 warning，实得 ${JSON.stringify(r.warnings)}`);
});

test("B-5 回写告警不得被静默吞掉（源码结构）", () => {
  const src = readFileSync(join(here, "..", "mcp-server", "src", "mdk", "index.ts"), "utf8");
  assert.match(src, /const writebackAttempted = !entry\.sha256 && args\.allowUnpinned === true;/);
  assert.match(src, /writebackAttempted\s*\n?\s*\?\s*\[/, "warnings 必须按 writebackAttempted 分支产出");
  assert.match(src, /未落盘/, "必须有「回写未落盘」的显式告警文案");
  assert.match(src, /唯一绕过写门禁的点/, "原有的成功回写告警必须保留");
});

for (const d of tmpDirs) {
  try {
    rmSync(d, { recursive: true, force: true });
  } catch {
    /* best effort */
  }
}

console.log(`\nMDK 形态回归：pass=${pass} fail=${failures.length}`);
if (failures.length) {
  for (const [n, e] of failures) console.error(`\n--- ${n} ---\n${e.stack}`);
  process.exit(1);
}
