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
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

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
}

if (bad) {
  console.error(`assert-cli-quick: ${bad} 项不通过`);
  process.exit(1);
}
console.log("assert-cli-quick: ok（双入口基础 + 仓库线 9 组子命令 + 3 零覆盖分支 + 健壮性×2 + 代表面）");
