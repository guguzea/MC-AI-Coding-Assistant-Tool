/**
 * assert-cli-quick：CLI 快速档（审计补齐，2026-09-17）——覆盖主要模块与三个零覆盖分支。
 * 目标：进默认门链（test-core §S18）、零网络、单机 < ~60s。
 * 全量档见 assert-cli-full.mjs（81 工具逐个，按需跑，不默认执行）。
 *
 * 覆盖：
 *  ① 双入口基础：mc-skill / mc-skill-scripts 的 --version / --help；
 *  ② 仓库线 9 组子命令 --help + lib resolve --validate / gate list 真跑；
 *  ③ 工具线三个零覆盖分支（--version 置尾 / help 不存在工具 / 多余位置参数）；
 *  ④ 健壮性：转发启动失败有诊断（spawnNodeScript 注入假解释器）、--timeout 到点必退出（不挂）；
 *  ⑤ 代表面：list-tools 名单含 resolve_lib_skills（新工具接线回归）。
 */
import { spawn, spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const PKG = path.resolve(HERE, ".."); // mcp-server/
const TOOL_BIN = path.join(PKG, "dist", "cli.js");
const SCRIPT_BIN = path.join(PKG, "bin", "mc-skill-scripts.mjs");

let bad = 0;
const fail = (msg) => {
  console.error("  ✗ " + msg);
  bad++;
};
const run = (bin, args, opts = {}) => spawnSync(process.execPath, [bin, ...args], { encoding: "utf8", windowsHide: true, ...opts });

if (!fs.existsSync(TOOL_BIN)) fail(`工具线入口不存在（先 npm run build）：${TOOL_BIN}`);
if (!fs.existsSync(SCRIPT_BIN)) fail(`仓库线入口不存在：${SCRIPT_BIN}`);

if (!bad) {
  // ① 双入口基础
  for (const [label, bin] of [["mc-skill", TOOL_BIN], ["mc-skill-scripts", SCRIPT_BIN]]) {
    const v = run(bin, ["--version"]);
    if (v.status !== 0) fail(`${label} --version rc=${v.status}\n${v.stdout}${v.stderr}`);
    const h = run(bin, ["--help"]);
    if (h.status !== 0) fail(`${label} --help rc=${h.status}\n${h.stdout}${h.stderr}`);
  }
  // 仓库线帮助须用真实入口名（L2 回归：曾自称 mc-skill）
  const sh = run(SCRIPT_BIN, ["--help"]).stdout ?? "";
  if (!sh.includes("mc-skill-scripts")) fail("mc-skill-scripts --help 未出现真实入口名（L2 回归）");
  if (/^\s*mc-skill lib/m.test(sh)) fail("mc-skill-scripts --help 仍自称 mc-skill（L2 回归）");

  // ② 仓库线 9 组子命令 --help + 两条真跑
  for (const c of [
    ["lib"], ["corpus"], ["cloth"], ["gate"],
    ["lib", "resolve"], ["lib", "summary"], ["lib", "ownership"],
    ["corpus", "decompile"], ["corpus", "emit"], ["corpus", "merge"],
    ["cloth", "project"], ["gate", "list"], ["gate", "run"],
  ]) {
    const r = run(SCRIPT_BIN, [...c, "--help"]);
    if (r.status !== 0) fail(`${c.join(" ")} --help rc=${r.status}\n${r.stdout}${r.stderr}`);
  }
  const gl = run(SCRIPT_BIN, ["gate", "list"]);
  if (gl.status !== 0 || !/assert-/.test(gl.stdout ?? "")) fail(`gate list 未列出任何门\n${gl.stdout}${gl.stderr}`);
  const lv = run(SCRIPT_BIN, ["lib", "resolve", "--validate"]);
  if (lv.status !== 0 || !/"ok"\s*:\s*true/.test(lv.stdout ?? "")) fail(`lib resolve --validate 真跑失败\n${lv.stdout}${lv.stderr}`);

  // ③ 工具线三个零覆盖分支
  const tailVersion = run(TOOL_BIN, ["query_api", "--className", "Block", "--version"]);
  if (tailVersion.status === 0) fail("query_api --version（置尾）应失败（非 0）——零覆盖分支回归");
  const helpMissing = run(TOOL_BIN, ["no_such_tool_xyz", "--help"]);
  if (helpMissing.status !== 2) fail(`不存在工具的 --help 应 exit 2（实得 ${helpMissing.status}）\n${helpMissing.stdout}${helpMissing.stderr}`);
  const extraPos = run(TOOL_BIN, ["descriptor", "--descriptor=()V", "extra1", "extra2"]);
  if (extraPos.status !== 0) fail(`descriptor 多余位置参数应告警但成功（实得 ${extraPos.status}）\n${extraPos.stdout}${extraPos.stderr}`);

  // ④ 健壮性：转发启动失败诊断（注入假解释器；不引产品后门）
  const mod = await import("../dist/cli/index.js");
  const r = mod.spawnNodeScript(path.join(PKG, "no_such_script.mjs"), [], { nodeBin: path.join(PKG, "no_such_node_bin.exe") });
  if (r.status !== 1 || !r.error) fail(`spawnNodeScript 启动失败应返回 status=1 + error（实得 ${JSON.stringify({ status: r.status, hasError: !!r.error })}）`);
  // ④b 超时必退出（--timeout 1 对需加载 data 的查询必然超时；断言 exit 1 + errorKind timeout + 未挂死）
  const t0 = Date.now();
  const to = run(TOOL_BIN, ["search_docs", "--platform", "fabric", "--version", "1.21.1", "--query", "registry", "--timeout", "1"], { timeout: 30000 });
  const elapsed = Date.now() - t0;
  if (to.status !== 1) fail(`--timeout 1 应 exit 1（实得 ${to.status}）\n${(to.stdout ?? "").slice(0, 300)}`);
  if (!/"errorKind"\s*:\s*"timeout"/.test(to.stdout ?? "")) fail(`--timeout 1 信封应带 errorKind=timeout\n${(to.stdout ?? "").slice(0, 300)}`);
  if (elapsed > 25000) fail(`--timeout 1 耗时 ${elapsed}ms，疑似挂死（M1 回归）`);

  // ⑤ 代表面：list-tools 含新工具
  const lt = run(TOOL_BIN, ["list-tools", "--names-only"]);
  if (lt.status !== 0 || !/"resolve_lib_skills"/.test(lt.stdout ?? "")) fail("list-tools 名单缺 resolve_lib_skills");

  // ⑥ 零覆盖分支补齐（NP-10，审计第二轮）：EPIPE 退出码 / pkgVersion 读失败 / gate list 目录错
  {
    // ⑥a NP-2：EPIPE 不得把已置的 exitCode=2 洗白成 0（夹具写向已关闭的管道）
    const fixture = path.join(HERE, "fixtures", "cli-epipe-exitcode.mjs");
    const epipeCase = (mode) =>
      new Promise((resolve) => {
        const c = spawn(process.execPath, [fixture], {
          windowsHide: true,
          stdio: ["ignore", "pipe", "pipe"],
          env: { ...process.env, CLI_EPIPE_MODE: mode },
        });
        c.stdout.destroy(); // 立刻关读端 → 子进程写 1MB 时 EPIPE
        c.stderr.resume();
        c.on("close", (code) => resolve(code));
      });
    const failCode = await epipeCase("fail");
    if (failCode !== 2) fail(`EPIPE 不得洗白 exitCode=2（实得 ${failCode}）—— NP-2 回归`);
    const okCode = await epipeCase("ok");
    if (okCode !== 0) fail(`成功路径被早关管道仍应 exit 0（实得 ${okCode}）`);

    // ⑥b L3 + L1：把仓库线薄壳拷到临时目录（**不带 package.json、不建 scripts/**），
    //     版本读失败与门目录缺失都必须显式非 0，而不是静默成功。
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "cli-quick-"));
    fs.mkdirSync(path.join(tmp, "bin"), { recursive: true });
    // 仓库线薄壳的最小依赖面：dist/cli/*（入口）+ dist/utils/*（stdio-guard 等）
    for (const sub of ["cli", "utils"]) {
      fs.mkdirSync(path.join(tmp, "dist", sub), { recursive: true });
      for (const f of fs.readdirSync(path.join(PKG, "dist", sub))) {
        const src = path.join(PKG, "dist", sub, f);
        if (fs.statSync(src).isFile()) fs.copyFileSync(src, path.join(tmp, "dist", sub, f));
      }
    }
    fs.copyFileSync(SCRIPT_BIN, path.join(tmp, "bin", "mc-skill-scripts.mjs"));
    const vFail = spawnSync(process.execPath, [path.join(tmp, "bin", "mc-skill-scripts.mjs"), "--version"], {
      encoding: "utf8",
      windowsHide: true,
    });
    if (vFail.status !== 1 || !/无法读取 package.json/.test(vFail.stderr ?? "")) {
      fail(`pkgVersion 读失败应 exit 1 + 明示（实得 rc=${vFail.status}）—— L3 回归\n${(vFail.stderr ?? "").slice(0, 200)}`);
    }
    const gFail = spawnSync(process.execPath, [path.join(tmp, "bin", "mc-skill-scripts.mjs"), "gate", "list"], {
      encoding: "utf8",
      windowsHide: true,
    });
    if (gFail.status !== 1 || !/无法读取门目录/.test(gFail.stderr ?? "")) {
      fail(`gate list 目录错应 exit 1（实得 rc=${gFail.status}）—— L1 回归\n${(gFail.stderr ?? "").slice(0, 200)}`);
    }
    fs.rmSync(tmp, { recursive: true, force: true });
  }

  // ⑦ 审计第二轮（NP-1~NP-13）防回归：逐条钉住本轮修掉的点
  {
    // NP-1：npm 封装在 Windows 上不再 EINVAL（真跑 npm --version），白名单外一律拒
    const tooling = await import("../dist/update/tooling.js");
    const npmVer = await tooling.runNpm(["--version"], PKG, 60_000);
    if (!/^\d+\.\d+\.\d+/.test(npmVer.trim())) fail(`runNpm --version 输出异常：${npmVer.slice(0, 80)}（NP-1 回归）`);
    let blocked = false;
    try {
      await tooling.runNpm(["install"], PKG, 5_000);
    } catch {
      blocked = true;
    }
    if (!blocked) fail("runNpm 白名单未拦住 npm install（NP-1 回归）");

    // NP-3：mdk 完整解压强判据三态（半截 false / 骨架标志物 true / 哨兵 true）
    const mdk = await import("../dist/mdk/index.js");
    const mdkTmp = fs.mkdtempSync(path.join(os.tmpdir(), "cli-quick-mdk-"));
    const mdkRoot = path.join(mdkTmp, "unpacked", "tree");
    fs.mkdirSync(mdkRoot, { recursive: true });
    if (mdk.unpackLooksComplete(path.join(mdkTmp, "unpacked"), mdkRoot) !== false) fail("半截解压树必须判 false（NP-3 回归）");
    fs.writeFileSync(path.join(mdkRoot, "build.gradle"), "// scaffold\n");
    if (mdk.unpackLooksComplete(path.join(mdkTmp, "unpacked"), mdkRoot) !== true) fail("带骨架标志物的树应判 true（NP-3 回归）");
    fs.writeFileSync(path.join(mdkTmp, "unpacked", ".mdk-unpack-ok"), "sentinel\n");
    if (mdk.unpackLooksComplete(path.join(mdkTmp, "unpacked"), mdkRoot) !== true) fail("哨兵树应判 true（NP-3 回归）");
    fs.rmSync(mdkTmp, { recursive: true, force: true });

    // NP-4：dir-lock 跨进程互斥 + update-apply 同进程重入
    const dirLock = await import("../dist/utils/dir-lock.js");
    const lockRoot = fs.mkdtempSync(path.join(os.tmpdir(), "cli-quick-lock-"));
    const release = await dirLock.acquireDirLock(lockRoot, "quick-probe", 3000);
    const lockModHref = pathToFileURL(path.join(PKG, "dist", "utils", "dir-lock.js")).href;
    // 子进程用 30s 超时（不能用 150ms 那种小值：父进程的 owner.at 在子进程启动后已超过该窗口，
    // 会被判「陈旧锁」而被合法抢占 —— 那测的就不是互斥语义了）
    const childCode = `const m = await import(${JSON.stringify(lockModHref)}); try { const r = await m.acquireDirLock(${JSON.stringify(
      lockRoot,
    )}, "quick-probe", 30000); console.log("ACQ"); r(); } catch (e) { console.log("BUSY:" + e.code); }`;
    const childOut = await new Promise((resolve) => {
      const c = spawn(process.execPath, ["--input-type=module", "-e", childCode], { windowsHide: true, stdio: ["ignore", "pipe", "pipe"] });
      let out = "";
      let err = "";
      c.stdout.on("data", (d) => (out += d));
      c.stderr.on("data", (d) => (err += d));
      c.on("close", () => resolve((out.trim() || "stderr:" + err.trim().split("\n")[0]) ?? ""));
    });
    if (childOut !== "BUSY:DIR_LOCK_BUSY") fail(`持锁期间子进程应 busy（实得 ${childOut}）—— NP-4 回归`);
    release();
    process.env.MC_SKILL_CACHE = lockRoot;
    const applyLock = await import("../dist/update/apply-lock.js");
    const r1 = await applyLock.acquireUpdateApplyLock(3000);
    const r2 = await applyLock.acquireUpdateApplyLock(3000);
    r2();
    const stillHeld = dirLock.listDirLocks(lockRoot).filter((n) => n.startsWith("update-apply")).length;
    r1();
    const afterRelease = dirLock.listDirLocks(lockRoot).filter((n) => n.startsWith("update-apply")).length;
    delete process.env.MC_SKILL_CACHE;
    if (stillHeld !== 1 || afterRelease !== 0) fail(`update-apply 重入语义错（嵌套释放后=${stillHeld}，真释放后=${afterRelease}）—— NP-4 回归`);
    fs.rmSync(lockRoot, { recursive: true, force: true });

    // NP-5：dist 不得再有静态 node:sqlite 取值导入（link 期抢占守卫），运行期加载器必须在
    const distJs = [];
    const walkDist = (d) => {
      for (const e of fs.readdirSync(d, { withFileTypes: true })) {
        const q = path.join(d, e.name);
        if (e.isDirectory()) walkDist(q);
        else if (e.name.endsWith(".js")) distJs.push(q);
      }
    };
    walkDist(path.join(PKG, "dist"));
    // 只看真的 import 语句（注释里提到 `from "node:sqlite"` 不算）
    const staticSqlite = distJs.filter((f) => /^\s*import\s[^\n]*?from\s+["']node:sqlite["']/m.test(fs.readFileSync(f, "utf8")));
    if (staticSqlite.length) fail(`dist 仍有静态 node:sqlite 导入（NP-5 回归）：${staticSqlite.map((f) => path.relative(PKG, f)).join(", ")}`);
    if (!fs.existsSync(path.join(PKG, "dist", "utils", "sqlite-runtime.js"))) fail("缺 dist/utils/sqlite-runtime.js（NP-5 回归）");

    // NP-6：数据根优先级（arg > env > 默认）
    const dr = await import("../scripts/_lib/data-root.js");
    const drTmp = fs.mkdtempSync(path.join(os.tmpdir(), "cli-quick-dr-"));
    if (dr.resolveDataRoot([`--data-root=${drTmp}`]) !== drTmp) fail("data-root：--data-root 未生效（NP-6 回归）");
    process.env.MC_SKILL_DATA = drTmp;
    if (dr.resolveDataRoot([]) !== drTmp) fail("data-root：env 未生效（NP-6 回归）");
    delete process.env.MC_SKILL_DATA;
    fs.rmSync(drTmp, { recursive: true, force: true });

    // NP-7：强退清理入口可调用（真 JVM 的那次实机验证是一次性作业，不进门链）
    const jp = await import("../dist/decompile/java/java-process.js");
    if (typeof jp.killLiveJavaChildren !== "function" || typeof jp.killJavaTreeSync !== "function") {
      fail("java 子进程清理入口缺失（NP-7 回归）");
    }
    if (jp.killLiveJavaChildren() !== 0) fail("无活动子进程时 killLiveJavaChildren 应返回 0（NP-7 回归）");

    // NP-8 / S2：文档面一致性（根 README 工具数、update 文档入口名）
    const rootReadme = fs.readFileSync(path.join(PKG, "..", "README.md"), "utf8");
    if (/（\*\*80\*\* 个工具）/.test(rootReadme)) fail("根 README 仍写 80 个工具（NP-8 回归）");
    const updDoc = fs.readFileSync(path.join(PKG, "docs", "mc-skill-update.md"), "utf8");
    if (/^CLI：`mc-skill /m.test(updDoc)) fail("update 文档仍是裸 mc-skill 调用式（S2 回归）");
  }
}

if (bad) {
  console.error(`assert-cli-quick: ${bad} 项不通过`);
  process.exit(1);
}
console.log(
  "assert-cli-quick: ok（双入口基础 + 仓库线 9 组子命令 + 3 零覆盖分支 + 健壮性×2 + 代表面 + 零覆盖补齐×3 + NP-1~NP-13 防回归）",
);
