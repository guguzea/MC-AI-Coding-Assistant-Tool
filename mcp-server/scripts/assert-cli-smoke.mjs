/**
 * assert-cli-smoke：CLI 双入口冒烟门（2026-09-17 与 CLI 提级同批落下）。
 *
 * 守两个入口：
 *  A. 工具线 `mc-skill`（dist/cli.js，既有）：--version / --help 退出码 0 —— 防编译产物缺失；
 *  B. 仓库线 `mc-skill-scripts`（bin/mc-skill-scripts.mjs，本次提级）：
 *     ① 每个子命令 `--help` 退出码 0（命令表漂移 / 转发脚本改名被接住）；
 *     ② gate list 有产出；③ lib resolve 真跑（--validate 与单组合）—— 防"只印帮助不接线"。
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const PKG = path.resolve(HERE, "..");
const TOOL_BIN = path.join(PKG, "dist", "cli.js");
const SCRIPT_BIN = path.join(PKG, "bin", "mc-skill-scripts.mjs");

let bad = 0;
const fail = (msg) => {
  console.error("  ✗ " + msg);
  bad++;
};
const run = (bin, args) => spawnSync(process.execPath, [bin, ...args], { encoding: "utf8", windowsHide: true });

if (!fs.existsSync(TOOL_BIN)) fail(`工具线入口不存在（先 npm run build）：${TOOL_BIN}`);
if (!fs.existsSync(SCRIPT_BIN)) fail(`仓库线入口不存在：${SCRIPT_BIN}`);

if (!bad) {
  const tv = run(TOOL_BIN, ["--version"]);
  if (tv.status !== 0) fail(`mc-skill --version rc=${tv.status}\n${tv.stdout}${tv.stderr}`);
  const th = run(TOOL_BIN, ["--help"]);
  if (th.status !== 0) fail(`mc-skill --help rc=${th.status}\n${th.stdout}${th.stderr}`);

  const sh = run(SCRIPT_BIN, ["--help"]);
  if (sh.status !== 0) fail(`mc-skill-scripts --help rc=${sh.status}\n${sh.stdout}${sh.stderr}`);
  if (!/lib resolve/.test(sh.stdout ?? "")) fail("mc-skill-scripts --help 未列出 lib resolve（命令表漂移）");
  const sv = run(SCRIPT_BIN, ["--version"]);
  if (sv.status !== 0) fail(`mc-skill-scripts --version rc=${sv.status}`);

  for (const c of [["lib"], ["corpus"], ["cloth"], ["gate"], ["lib", "resolve"], ["corpus", "merge"], ["cloth", "project"], ["gate", "run"]]) {
    const r = run(SCRIPT_BIN, [...c, "--help"]);
    if (r.status !== 0) fail(`${c.join(" ")} --help rc=${r.status}\n${r.stdout}${r.stderr}`);
  }

  const gl = run(SCRIPT_BIN, ["gate", "list"]);
  if (gl.status !== 0 || !/assert-/.test(gl.stdout ?? "")) fail(`mc-skill-scripts gate list 未列出任何门\n${gl.stdout}${gl.stderr}`);

  const lv = run(SCRIPT_BIN, ["lib", "resolve", "--validate"]);
  if (lv.status !== 0 || !/"ok"\s*:\s*true/.test(lv.stdout ?? "")) fail(`lib resolve --validate 真跑失败\n${lv.stdout}${lv.stderr}`);
  const lr = run(SCRIPT_BIN, ["lib", "resolve", "--platform", "fabric", "--version", "1.21.1"]);
  if (lr.status !== 0) fail(`lib resolve 单组合真跑失败\n${lr.stdout}${lr.stderr}`);
}

if (bad) {
  console.error(`assert-cli-smoke: ${bad} 项不通过`);
  process.exit(1);
}
console.log("assert-cli-smoke: ok（mc-skill --version/--help + mc-skill-scripts 8 组 --help + gate list + lib resolve 真跑×2）");
