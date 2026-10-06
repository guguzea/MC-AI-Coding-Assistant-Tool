/**
 * B-06 回归测试：npm 形态（无 data/）下，MDK 校验链不得把用户「诱导」到关校验的死路上。
 *
 * 缺陷链（六环，行号为 2026-10-07 修前）：
 *   checksumsPath() → <包根>/data/mdk-checksums.json；npm 包不含 data/ ⇒ 路径不存在
 *   无 sha256 且无 allowUnpinned ⇒ MDK_NOT_PINNED（fail-closed，本就不改）
 *   nextSteps 只给「① 补 pin ② 开 allowUnpinned」两条路
 *   allowUnpinned === true ⇒ 触发回写
 *   回写目标是包外路径，npm 形态写不进去；且旧代码在回写失败时把 warnings 整个省略
 *   ⇒ 用户只看到 ok:true + sha256Pinned:false，误以为校验已闭环（静默失效）
 *
 * 本测试用「真实的临时 npm 形态目录」跑，而不是断言字符串存在。
 * 运行：npm run test:mdk-npm-form
 *   （该 script 会先用 tsc --outDir temp/_b06dist 编译，刻意不碰 dist/）
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
/**
 * 同步用例。**async 用例一律用下面的 `atest`**：`assert-test-harness` 的 R-2 判据是纯语法的 ——
 * 只要本文件里既有 `function test(` 定义、又有「把 async 回调交给 test」的调用点，就判红
 * （它分辨不出本地的 test 是否识别 thenable；注释里写出那个字形同样会被打中）。
 * 故按项目约定 `test()/atest()`（同 `test-decompile.mjs`）把两族拆开。
 */
function test(name, fn) {
  try {
    fn();
    pass++;
    console.log(`[OK] ${name}`);
  } catch (e) {
    failures.push([name, e]);
    console.log(`[XX] ${name} :: ${e.message}`);
  }
}

/** async 用例：调用点必须 `await atest(...)`，否则断言在 Promise 里被吞掉（harness 假绿）。 */
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

/**
 * 造一个最小合法 zip，返回其**Buffer**。
 * 用模块自带的 createStoreZip（而非手搓 zip 头）——手搓的stored zip 过不了
 * bsdtar 的格式校验（实测报 "Unrecognized archive format"），且会连带让
 * expectedSha256 与落盘重写后的字节对不上。
 */
function makeZip(mod) {
  return mod.createStoreZip([
    {
      name: "ExampleMod.java",
      data: 'package com.example;\n@Mod("examplemod")\npublic class ExampleMod {}\n',
    },
  ]);
}

/**
 * 手工递归复制：本沙箱环境里 fs.cpSync(..., {recursive:true}) 会被拦（进程静默 exit 127），
 * 故自己走 readdirSync + copyFileSync。仅测试用。
 */
function copyTree(src, dst) {
  mkdirSync(dst, { recursive: true });
  for (const e of readdirSync(src, { withFileTypes: true })) {
    const s = join(src, e.name);
    const d = join(dst, e.name);
    if (e.isDirectory()) copyTree(s, d);
    else copyFileSync(s, d);
  }
}

/**
 * 构造一个「npm 安装形态」的包目录：只有 dist/ + package.json + README.md + LICENSE，
 * **没有 data/**。把真dist 复制进去，然后 import 该副本的 mdk/index.js。
 * 这样 checksumsPath() 解析到的就是 <tmp>/data/mdk-checksums.json —— 必然不存在。
 */
function makeNpmFormPackage() {
  const root = mkdtempSync(join(tmpdir(), "mcp-npmform-"));
  const pkg = join(root, "node_modules", "mc-ai-coding-assistant-tool");
  mkdirSync(pkg, { recursive: true });
  copyTree(join(here, "..", "temp", "_b06dist"), join(pkg, "dist"));
  // npm 会自动带上这三个文件；显式写出来以贴合真实安装形态
  writeFileSync(join(pkg, "package.json"), JSON.stringify({ name: "mc-ai-coding-assistant-tool", version: "1.0.4" }, null, 2));
  writeFileSync(join(pkg, "README.md"), "# npm form\n");
  writeFileSync(join(pkg, "LICENSE"), "MIT\n");
  // 断言形态前提：这个包里绝不能有 data/
  assert.ok(!existsSync(join(pkg, "data")), "测试前提失败：npm 形态包里不该有 data/");
  return { root, pkg };
}

async function importNpmForm(pkg) {
  const mod = await import(pathToFileURL(join(pkg, "dist", "mdk", "index.js")).href);
  return { mod, cleanup: () => rmSync(join(pkg, "..", ".."), { recursive: true, force: true }) };
}

const tmpDirs = [];
function track(d) {
  tmpDirs.push(d);
  return d;
}

// ─────────────────────────────────────────────────────────────────────────────
await atest("B-06-1 npm 形态：checksumsPath() 指向的 pin 表确实不存在（复现环①）", async () => {
  const { pkg } = makeNpmFormPackage();
  track(pkg);
  const { mod } = await importNpmForm(pkg);
  const p = mod.checksumsPath();
  assert.ok(!existsSync(p), `npm 形态下 pin 表本应不存在，却存在：${p}`);
  assert.ok(p.includes("data"), `pin 表路径应仍指向 data/ 目录，实际：${p}`);
  // 路径必须落在包目录内（而不是意外指回仓库）
  assert.ok(p.startsWith(pkg), `pin 表路径应位于包内，实际：${p}`);
});

await atest("B-06-2 npm 形态：loadMdkChecksums() 降级为空表且不谎报损坏", async () => {
  const { pkg } = makeNpmFormPackage();
  track(pkg);
  const { mod } = await importNpmForm(pkg);
  const loaded = mod.loadMdkChecksums();
  assert.deepEqual(loaded.entries, []);
  assert.equal(loaded.invalid, undefined, "文件不存在不得报 invalid（那是损坏语义）");
});

await atest("B-06-3 环②③：MDK_NOT_PINNED 错误必须显式声明 npm 形态不可用 + 指向 Release", async () => {
  const { pkg } = makeNpmFormPackage();
  track(pkg);
  const { mod } = await importNpmForm(pkg);
  const r = await mod.downloadOfficialMdk({ platform: "forge", minecraftVersion: "1.20.1" });
  assert.equal(r.ok, false);
  assert.equal(r.error.code, "MDK_NOT_PINNED", JSON.stringify(r.error));
  const msg = String(r.error.message);
  assert.match(msg, /npm/, "错误文案必须点名 npm 形态");
  assert.match(msg, /Release/, "错误文案必须指向 GitHub Release 形态");
  assert.match(msg, /不含 data\//, "错误文案必须说明 npm 包不含 data/");
  // 关键：不得只留「关校验」这一条出路
  assert.match(msg, /MC_SKILL_MDK_CHECKSUMS/, "必须给出 env 覆盖这条真实可行的出路");
});

await atest("B-06-4 nextSteps 也必须带形态声明（不得只在 message 里说）", async () => {
  const { pkg } = makeNpmFormPackage();
  track(pkg);
  const { mod } = await importNpmForm(pkg);
  const r = await mod.downloadOfficialMdk({ platform: "neoforge", minecraftVersion: "1.20.4" });
  const steps = (r.nextSteps ?? []).join("\n");
  assert.ok(steps.length > 0, "无 pin 时应给 nextSteps");
  assert.match(steps, /Release/, "nextSteps 必须指向 Release 形态");
});

await atest("B-06-5 fail-closed 未被放宽：无 allowUnpinned 仍然拒绝解压", async () => {
  const { pkg } = makeNpmFormPackage();
  track(pkg);
  const { mod } = await importNpmForm(pkg);
  // 造一个真 zip，让 unpack 走到 pin 门
  const zipDir = mkdtempSync(join(tmpdir(), "mcp-zip-"));
  track(zipDir);
  const zipBuf = makeZip(mod);

  const r = mod.unpackMdkArchive({ zip: zipBuf, destCache: join(zipDir, "out") });
  assert.equal(r.ok, false);
  assert.equal(r.error.code, "MDK_NOT_PINNED", `fail-closed 必须保持，实际 ${JSON.stringify(r.error)}`);
  assert.match(String(r.error.message), /Release/, "MDK_NOT_PINNED 文案必须指向 Release 形态");
  assert.match(String(r.error.message), /不含 data\//);
  // 反证：文案里必须还留着「显式 allowUnpinned」这条（语义未改），但必须同时声明形态限制
  assert.match(String(r.error.message), /allowUnpinned/, "不得改动 allowUnpinned 的原有语义");
});

await atest("B-06-6 表损坏（Z-1）路径：形态声明不得被 checksumsInvalid 分支冲掉", async () => {
  const { pkg } = makeNpmFormPackage();
  track(pkg);
  const { mod } = await importNpmForm(pkg);
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
    assert.ok(
      steps.some((s) => /Release/.test(s)),
      `表损坏时 nextSteps 仍须带形态声明，实得 ${JSON.stringify(steps)}`,
    );
    assert.ok(
      steps.some((s) => /mdk-checksums\.json/.test(s)),
      `原有「修复 pin 表」指引必须保留（test-core:4335 钉住），实得 ${JSON.stringify(steps)}`,
    );
    assert.match(String(r.error.message), /Release/, "message 也要带形态声明");
  } finally {
    if (prev === undefined) delete process.env.MC_SKILL_MDK_CHECKSUMS;
    else process.env.MC_SKILL_MDK_CHECKSUMS = prev;
  }
});

await atest("B-06-7 环⑤根因：npm 形态下 writebackSha256IfNull 必然返回 false（出路是断的）", async () => {
  const { pkg } = makeNpmFormPackage();
  track(pkg);
  const { mod } = await importNpmForm(pkg);
  // 这正是「诱导用户关校验，而出路本身是断的」的机制层证据：
  // 回写目标 <包>/data/mdk-checksums.json 在 npm 形态不存在 ⇒ 早退 false。
  assert.equal(
    mod.writebackSha256IfNull("any-entry-id", "0".repeat(64)),
    false,
    "npm 形态下回写必须失败（写不进去）",
  );
  // 反证：Release 形态（用 env 把 pin 表指到一个真实存在的文件）就能写成
  const good = mkdtempSync(join(tmpdir(), "mcp-goodsums-"));
  track(good);
  const p = join(good, "mdk-checksums.json");
  writeFileSync(p, JSON.stringify({ entries: [{ id: "e1", sha256: null }] }, null, 2));
  const prev = process.env.MC_SKILL_MDK_CHECKSUMS;
  try {
    process.env.MC_SKILL_MDK_CHECKSUMS = p;
    assert.equal(
      mod.writebackSha256IfNull("e1", "a".repeat(64)),
      true,
      "指针表可写时必须能回写（反证：上面的 false 是形态导致，不是逻辑坏了）",
    );
    assert.match(readFileSync(p, "utf8"), /a{64}/, "回写内容必须真的落盘");
  } finally {
    if (prev === undefined) delete process.env.MC_SKILL_MDK_CHECKSUMS;
    else process.env.MC_SKILL_MDK_CHECKSUMS = prev;
  }
});

test("B-06-9 环⑤告警：downloadOfficialMdk 的 warnings 分支已接上 writebackAttempted", () => {
  // 该分支位于 downloadOfficialMdk 内、需真实网络下载才能走到，无法在离线测试里跑通。
  // 故此处只做**源码结构**断言：确认「回写未落盘 ⇒ 必须有 warning」这条不再被静默吞掉。
  // 反证：若把 writebackAttempted 改回旧的 (!entry.sha256 && allowUnpinned) 内联写法，
  // 本断言仍会命中——所以额外钉住「失败告警文案存在」与「成功文案仍保留」。
  const src = readFileSync(join(here, "..", "mcp-server", "src", "mdk", "index.ts"), "utf8");
  assert.match(src, /const writebackAttempted = !entry\.sha256 && args\.allowUnpinned === true;/);
  assert.match(src, /writebackAttempted\s*\n?\s*\?\s*\[/, "warnings 必须按 writebackAttempted 分支产出");
  assert.match(src, /未落盘/, "必须有「回写未落盘」的显式告警文案");
  assert.match(src, /唯一绕过写门禁的点/, "原有的成功回写告警必须保留");
});

await atest("B-06-8 有 pin 且校验通过时不得新增任何 warning（无回归）", async () => {
  const { pkg } = makeNpmFormPackage();
  track(pkg);
  const { mod } = await importNpmForm(pkg);
  const zipDir = mkdtempSync(join(tmpdir(), "mcp-zip3-"));
  track(zipDir);
  const zipBuf = makeZip(mod);
  const good = mod.sha256Buf(zipBuf);
  const r = mod.unpackMdkArchive({ zip: zipBuf, destCache: join(zipDir, "out"), expectedSha256: good });
  assert.equal(r.ok, true, JSON.stringify(r.error ?? {}));
  assert.equal(r.warnings, undefined, `已 pin 成功时不得新增 warning，实得 ${JSON.stringify(r.warnings)}`);
});

// ─────────────────────────────────────────────────────────────────────────────
for (const d of tmpDirs) {
  try {
    rmSync(d, { recursive: true, force: true });
  } catch {
    /* best effort */
  }
}

console.log(`\nB-06 回归：pass=${pass} fail=${failures.length}`);
if (failures.length) {
  for (const [n, e] of failures) console.error(`\n--- ${n} ---\n${e.stack}`);
  process.exit(1);
}
