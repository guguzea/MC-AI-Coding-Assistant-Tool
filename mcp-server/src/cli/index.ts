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
import { installStdioErrorGuard, installCrashGuards } from "../utils/stdio-guard.js";
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

/**
 * C18：薄壳转发命令的下游脚本实际接受的 flag 白名单。
 * 逐条取自各脚本的参数解析段（不猜）：
 *   lib resolve      → scripts/resolve-lib-skills.mjs:261-274
 *   lib summary      → scripts/build-api-summaries.mjs:39-75
 *   lib ownership    → mcp-server/scripts/assert-lib-ownership.mjs（不解析 argv）
 *   corpus decompile → scripts/batch-decompile.mjs:36-40 KNOWN_FLAGS
 *   corpus emit      → scripts/emit-verified-api-from-summaries.mjs:41-51
 *   corpus merge     → scripts/merge-verified-api.mjs:40-86
 *   cloth project    → scripts/project-cloth-skill.mjs:24 + scripts/_lib/write-guard.mjs:21-23
 */
const SCRIPT_FLAGS: Record<string, { long: ReadonlySet<string>; short: ReadonlySet<string> }> = {
  "lib resolve": {
    long: new Set(["platform", "version", "validate", "mcVersion"]),
    short: new Set(["h"]),
  },
  "lib summary": {
    long: new Set([
      "only", "out", "cache", "max-files", "max-classes", "max-methods", "max-methods-per-class",
      "max-depth", "max-versions", "max-file-kb", "write",
    ]),
    short: new Set(["h"]),
  },
  "lib ownership": { long: new Set<string>([]), short: new Set<string>([]) },
  "corpus decompile": {
    long: new Set([
      "filter", "limit", "resume", "concurrency-download", "concurrency-decompile", "java-xmx",
      "jar-dir", "output", "progress", "timeout-ms", "help", "shard", "cache-dir", "reset",
    ]),
    short: new Set(["h"]),
  },
  "corpus emit": { long: new Set(["slug", "out", "dry-run"]), short: new Set(["h"]) },
  "corpus merge": { long: new Set(["input", "catalog", "write", "dry-run", "force"]), short: new Set<string>([]) },
  "cloth project": { long: new Set(["write", "dry-run"]), short: new Set<string>([]) },
};

function editDistance(a: string, b: string): number {
  const dp: number[][] = Array.from({ length: a.length + 1 }, () => new Array<number>(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
    }
  }
  return dp[a.length][b.length];
}

function nearestFlag(name: string, longs: ReadonlySet<string>): string | null {
  let best: string | null = null;
  let bestD = Infinity;
  for (const f of longs) {
    const d = editDistance(name, f);
    if (d < bestD) {
      bestD = d;
      best = f;
    }
  }
  return best !== null && bestD <= 2 ? best : null;
}

/** C18：转发前校验 flag；未知/拼错 ⇒ rc=2 + 自带纠正路径（本仓 S3 判据）。 */
function validateForwardFlags(cmd: Cmd, rest: string[]): number | null {
  const spec = SCRIPT_FLAGS[`${cmd.group} ${cmd.name}`];
  if (!spec) return null;
  const allowed = [...spec.long].map((f) => `--${f}`).join(" ");
  const reject = (msg: string): number => {
    console.error(`${cmd.group} ${cmd.name}: ${msg}`);
    console.error(
      `可用参数：${allowed || "（本命令无可用参数）"}（帮助：${ENTRY} ${cmd.group} ${cmd.name} --help）`,
    );
    return 2;
  };
  for (const t of rest) {
    if (!t.startsWith("-") || t === "-" || /^-\d/.test(t)) continue; // 单独的 "-" 与负数是值
    if (t.startsWith("--")) {
      const name = t.slice(2).split("=")[0];
      if (name === "" || spec.long.has(name)) continue;
      const near = nearestFlag(name, spec.long);
      return reject(`未知参数 --${name}${near ? `（是否想写 --${near}？）` : ""}`);
    }
    const name = t.slice(1).split("=")[0];
    if (spec.short.has(name)) continue;
    if (spec.long.has(name)) return reject(`疑似漏写一个连字符：-${name} → --${name}`);
    const near = nearestFlag(name, spec.long);
    return reject(`未知参数 -${name}${near ? `（是否想写 --${near}？）` : ""}`);
  }
  return null;
}

/** C19：仓库线 `lib resolve` 接受工具线的 `--mcVersion`，就地改写为脚本认的 `--version`。 */
function translateForwardAliases(cmd: Cmd, rest: string[]): string[] {
  if (cmd.group === "lib" && cmd.name === "resolve") {
    return rest.map((t) =>
      t === "--mcVersion"
        ? "--version"
        : t.startsWith("--mcVersion=")
          ? `--version=${t.slice("--mcVersion=".length)}`
          : t,
    );
  }
  return rest;
}

/** 版本：读失败返回 null（调用方显式提示，不静默伪装成功 —— 审计 L3）。 */
function pkgVersion(): string | null {
  try {
    const pj = JSON.parse(fs.readFileSync(path.join(PKG_ROOT, "package.json"), "utf8"));
    return String(pj.version ?? "") || null;
  } catch {
    return null;
  }
}

/**
 * 入口名：从 package.json 的 bin 反射（按目标 dist/cli/index.js 反查键名），失败回退常量。
 * 防再次漂移（审计 L2：帮助文本曾自称 mc-skill 而实际 bin 是 mc-skill-scripts）。
 */
function entryName(): string {
  try {
    const pj = JSON.parse(fs.readFileSync(path.join(PKG_ROOT, "package.json"), "utf8")) as { bin?: Record<string, string> };
    const hit = Object.entries(pj.bin ?? {}).find(([, rel]) => rel.replace(/\\/g, "/").endsWith("dist/cli/index.js"));
    if (hit) return hit[0];
  } catch {
    /* fallthrough */
  }
  return "mc-skill-scripts";
}
const ENTRY = entryName();

// 入口守卫（审计 M3/M4）：EPIPE 静默退出；崩溃/未处理拒绝 → JSON 信封 + exit 1（信封经 flush 屏障后退出）。
installStdioErrorGuard();
installCrashGuards({
  emitEnvelope: (err) => {
    const message = err instanceof Error ? err.message : String(err);
    if (err instanceof Error && err.stack) process.stderr.write(`${err.stack}\n`);
    process.stdout.write(JSON.stringify({ success: false, tool: ENTRY, error: message, errorKind: "tool_failure" }) + "\n");
  },
});

function printHelp(): void {
  console.log(`${ENTRY} ${pkgVersion() ?? "(version unknown)"} —— MC_skill 仓库 CLI（与 MCP 同权重；库/语料/门 三条线）

用法：${ENTRY} <group> <command> [args...]
      ${ENTRY} <group> --help            组内命令
      ${ENTRY} <group> <command> --help  命令帮助（含透传参数）
      ${ENTRY} --help | --version（-h / -V / -v 同义）

组与命令：`);
  for (const c of COMMANDS) console.log(`  ${(c.group + " " + c.name).padEnd(20)} ${c.summary}`);
  console.log(`
示例：
  ${ENTRY} lib resolve --platform fabric --version 1.21.1
  ${ENTRY} lib resolve --validate
  ${ENTRY} lib summary --only libgui --write
  ${ENTRY} corpus merge --input D:/gap3-verified.jsonl --dry-run
  ${ENTRY} gate list
  ${ENTRY} gate run lib-ownership

边界：CLI 需在仓库内运行（脚本位于仓库根 scripts/ 与 mcp-server/scripts/）；
透传命令的参数与退出码与直接跑脚本完全一致（薄壳，不复制逻辑）。`);
}

function printGroupHelp(group: string): number {
  const inG = COMMANDS.filter((c) => c.group === group);
  if (!inG.length) return -1;
  console.log(`${ENTRY} ${group} —— ${inG.length} 个命令：`);
  for (const c of inG) console.log(`  ${c.name.padEnd(12)} ${c.summary}`);
  return 0;
}

function printCmdHelp(c: Cmd): void {
  console.log(`${ENTRY} ${c.group} ${c.name} —— ${c.summary}`);
  if (c.script) console.log(`转发脚本：${c.script}（参数与退出码原样透传；脚本 --help 见直接运行）`);
  else console.log("CLI 内建命令（无转发脚本）");
}

/** 门清单：读目录失败时返回 error（调用方非 0 退出），不再静默「0 道门」（审计 L1）。 */
function listGates(): { gates: string[]; error?: string } {
  try {
    return {
      gates: fs
        .readdirSync(MCP_SCRIPTS)
        .filter((f) => /^(assert|verify|check)-.*\.mjs$/.test(f))
        .sort(),
    };
  } catch (e) {
    return { gates: [], error: e instanceof Error ? e.message : String(e) };
  }
}

/**
 * 转发子进程（本文件唯一 spawnSync 调用点）：失败时打印诊断，退出码 0/1 语义不变（审计 M2）。
 * opts.nodeBin 可注入（测试用，默认真实 node）—— 不引入产品侧后门/环境变量。
 */
export function spawnNodeScript(
  scriptPath: string,
  args: string[],
  opts: { nodeBin?: string } = {},
): { status: number; signal?: NodeJS.Signals | null; error?: NodeJS.ErrnoException } {
  const r = spawnSync(opts.nodeBin ?? process.execPath, [scriptPath, ...args], { stdio: "inherit", windowsHide: true });
  if (r.error) {
    process.stderr.write(`启动失败: ${r.error.message}（${scriptPath}）\n`);
    return { status: 1, error: r.error };
  }
  if (r.signal) {
    process.stderr.write(`被信号终止: ${r.signal}（${scriptPath}）\n`);
    return { status: 1, signal: r.signal };
  }
  return { status: r.status ?? 1 };
}

export async function main(argv: string[]): Promise<number> {
  const a = argv[0];
  const b = argv[1];
  if (!a || a === "--help" || a === "-h" || a === "help") {
    printHelp();
    return 0;
  }
  if (a === "--version" || a === "-V" || a === "-v") {
    const v = pkgVersion();
    if (v === null) {
      process.stderr.write("无法读取 package.json 的 version（--version 不可用）\n");
      return 1;
    }
    console.log(v);
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
    const { gates, error } = listGates();
    if (error) {
      process.stderr.write(`无法读取门目录 ${MCP_SCRIPTS}：${error}\n`);
      return 1;
    }
    console.log(`mcp-server/scripts 下 ${gates.length} 道门：`);
    for (const g of gates) console.log("  " + g.replace(/\.mjs$/, ""));
    return 0;
  }
  if (cmd.group === "gate" && cmd.name === "run") {
    const want = (rest[0] ?? "").replace(/\.mjs$/, "");
    if (!want) {
      console.error(`用法：${ENTRY} gate run <name>（${ENTRY} gate list 看清单）`);
      return 2;
    }
    const { gates, error } = listGates();
    if (error) {
      process.stderr.write(`无法读取门目录 ${MCP_SCRIPTS}：${error}\n`);
      return 1;
    }
    const hits = gates.filter((f) => f === want + ".mjs" || f === "assert-" + want + ".mjs");
    if (hits.length !== 1) {
      console.error(hits.length ? `匹配到多道门：${hits.join(", ")}` : `没有匹配的门：${want}`);
      return 2;
    }
    const r = spawnNodeScript(path.join(MCP_SCRIPTS, hits[0]), rest.slice(1));
    return r.status;
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
  // C18：本层此前对 flag 零校验（--bogus / -version 都被静默转给下游并 rc=0）。
  const flagError = validateForwardFlags(cmd, rest);
  if (flagError !== null) return flagError;
  const r = spawnNodeScript(scriptPath, translateForwardAliases(cmd, rest));
  return r.status;
}
