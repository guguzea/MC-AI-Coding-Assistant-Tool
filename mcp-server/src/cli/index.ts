/**
 * mc-skill CLI —— 与 MCP 同权重的命令行入口（S1 骨架，2026-09-17）。
 *
 * 纪律（用户裁定"提到与 MCP 同权重，不引新问题"）：
 *  1) 薄壳转发：子命令只做「解析 → spawn 现有脚本 → 透传退出码」，不复制任何业务逻辑；
 *  2) 门链不动：mcp-server/scripts 与 scripts/ 的既有脚本原址保留（test-core/test-scripts 照跑）；
 *  3) MCP Schema 不动：本文件只读仓库文件与既有脚本，不改 MCP 工具面；
 *  4) 依赖边界：CLI 需在仓库内运行（脚本位于仓库根 scripts/ 与 mcp-server/scripts/）。
 *
 * 入口：mcp-server/bin/mc-skill-scripts.mjs（package.json 的 bin.mc-skill-scripts）
 *   → 转发到本文件编译产物 dist/cli/index.js。
 *
 * 与既有的 `dist/cli.js`（src/cli.ts，dispatch 全部 MCP 工具）的关系：
 *   mc-skill（工具线）与 mc-skill-scripts（仓库线）同包并列、同权重，互不分叉——
 *   前者管"调工具"，后者管"跑仓库脚本"；两者都不复制对方逻辑。
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const PKG_ROOT = path.resolve(HERE, "..", ".."); // mcp-server/
const REPO_ROOT = path.resolve(PKG_ROOT, ".."); // 仓库根
const MCP_SCRIPTS = path.join(PKG_ROOT, "scripts");

interface Cmd {
  group: string;
  name: string;
  summary: string;
  /** 相对仓库根的脚本路径；null = CLI 内建（gate list / gate run） */
  script: string | null;
}

const COMMANDS: Cmd[] = [
  { group: "lib", name: "resolve", summary: "按 (platform, mcVersion) 解析库 skill 源稿（组映射 + frontmatter platforms/mcVersions 过滤）；--validate 跑三组合校验", script: "scripts/resolve-lib-skills.mjs" },
  { group: "lib", name: "summary", summary: "从反编译树提取库 API 摘要：--only <slug|modId> --write [--max-* 上限]", script: "scripts/build-api-summaries.mjs" },
  { group: "lib", name: "ownership", summary: "G1 库归属门（摘要↔catalog↔取件记录一致性 + 台账签字）", script: "mcp-server/scripts/assert-lib-ownership.mjs" },
  { group: "corpus", name: "decompile", summary: "批量反编译库 jar：--filter <key=value,...> [--resume]（读写 $MC_SKILL_CACHE）", script: "scripts/batch-decompile.mjs" },
  { group: "corpus", name: "emit", summary: "摘要 → verified-api JSONL：--slug <a,b> [--out <file>]", script: "scripts/emit-verified-api-from-summaries.mjs" },
  { group: "corpus", name: "merge", summary: "verified-api JSONL → catalog verifiedApi：--input <file> [--dry-run|--write]", script: "scripts/merge-verified-api.mjs" },
  { group: "cloth", name: "project", summary: "cloth 档内注入标记 ↔ versions.json 校验/回填（默认 --check，--write 才写）", script: "scripts/project-cloth-skill.mjs" },
  { group: "gate", name: "list", summary: "列出 mcp-server/scripts 下的门（assert-*/verify-*/check-*）", script: null },
  { group: "gate", name: "run", summary: "跑一道门：mc-skill gate run <name>（名字可省略 assert- 前缀）", script: null },
];

function pkgVersion(): string {
  try {
    const pj = JSON.parse(fs.readFileSync(path.join(PKG_ROOT, "package.json"), "utf8"));
    return String(pj.version ?? "0.0.0");
  } catch {
    return "0.0.0";
  }
}

function printHelp(): void {
  console.log(`mc-skill ${pkgVersion()} —— MC_skill 仓库 CLI（与 MCP 同权重；库/语料/门 三条线）

用法：mc-skill <group> <command> [args...]
      mc-skill <group> --help            组内命令
      mc-skill <group> <command> --help  命令帮助（含透传参数）
      mc-skill --help | --version

组与命令：`);
  for (const c of COMMANDS) console.log(`  ${(c.group + " " + c.name).padEnd(20)} ${c.summary}`);
  console.log(`
示例：
  mc-skill lib resolve --platform fabric --version 1.21.1
  mc-skill lib resolve --validate
  mc-skill lib summary --only libgui --write
  mc-skill corpus merge --input D:/gap3-verified.jsonl --dry-run
  mc-skill gate list
  mc-skill gate run lib-ownership

边界：CLI 需在仓库内运行（脚本位于仓库根 scripts/ 与 mcp-server/scripts/）；
透传命令的参数与退出码与直接跑脚本完全一致（薄壳，不复制逻辑）。`);
}

function printGroupHelp(group: string): number {
  const inG = COMMANDS.filter((c) => c.group === group);
  if (!inG.length) return -1;
  console.log(`mc-skill ${group} —— ${inG.length} 个命令：`);
  for (const c of inG) console.log(`  ${c.name.padEnd(12)} ${c.summary}`);
  return 0;
}

function printCmdHelp(c: Cmd): void {
  console.log(`mc-skill ${c.group} ${c.name} —— ${c.summary}`);
  if (c.script) console.log(`转发脚本：${c.script}（参数与退出码原样透传；脚本 --help 见直接运行）`);
  else console.log("CLI 内建命令（无转发脚本）");
}

function listGates(): string[] {
  try {
    return fs
      .readdirSync(MCP_SCRIPTS)
      .filter((f) => /^(assert|verify|check)-.*\.mjs$/.test(f))
      .sort();
  } catch {
    return [];
  }
}

export async function main(argv: string[]): Promise<number> {
  const a = argv[0];
  const b = argv[1];
  if (!a || a === "--help" || a === "-h" || a === "help") {
    printHelp();
    return 0;
  }
  if (a === "--version" || a === "-v") {
    console.log(pkgVersion());
    return 0;
  }
  if (!b || b === "--help" || b === "-h") {
    const rc = printGroupHelp(a);
    if (rc < 0) {
      console.error(`未知组或缺少子命令：${a}`);
      printHelp();
      return 2;
    }
    return 0;
  }
  const cmd = COMMANDS.find((c) => c.group === a && c.name === b);
  if (!cmd) {
    const rc = printGroupHelp(a);
    if (rc < 0) {
      console.error(`未知命令：${argv.join(" ")}`);
      printHelp();
      return 2;
    }
    console.error(`组 ${a} 下没有命令 ${b}`);
    return 2;
  }
  const rest = argv.slice(2);
  if (rest.includes("--help") || rest.includes("-h")) {
    printCmdHelp(cmd);
    return 0;
  }
  // ── 内建：gate list / gate run ──
  if (cmd.group === "gate" && cmd.name === "list") {
    const gates = listGates();
    console.log(`mcp-server/scripts 下 ${gates.length} 道门：`);
    for (const g of gates) console.log("  " + g.replace(/\.mjs$/, ""));
    return 0;
  }
  if (cmd.group === "gate" && cmd.name === "run") {
    const want = (rest[0] ?? "").replace(/\.mjs$/, "");
    if (!want) {
      console.error("用法：mc-skill gate run <name>（mc-skill gate list 看清单）");
      return 2;
    }
    const hits = listGates().filter((f) => f === want + ".mjs" || f === "assert-" + want + ".mjs");
    if (hits.length !== 1) {
      console.error(hits.length ? `匹配到多道门：${hits.join(", ")}` : `没有匹配的门：${want}`);
      return 2;
    }
    const r = spawnSync(process.execPath, [path.join(MCP_SCRIPTS, hits[0]), ...rest.slice(1)], { stdio: "inherit", windowsHide: true });
    return r.status ?? 1;
  }
  // ── 通用：薄壳转发 ──
  if (!cmd.script) {
    console.error(`${cmd.group} ${cmd.name} 未配置转发脚本`);
    return 2;
  }
  const scriptPath = path.join(REPO_ROOT, cmd.script);
  if (!fs.existsSync(scriptPath)) {
    console.error(`脚本不存在：${scriptPath}（CLI 需在仓库内运行）`);
    return 1;
  }
  const r = spawnSync(process.execPath, [scriptPath, ...rest], { stdio: "inherit", windowsHide: true });
  return r.status ?? 1;
}
