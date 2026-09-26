/**
 * Windows PowerShell 5.1 gate —— 两类「文本层检查看不见」的缺陷。
 *
 * 1) 无 BOM 的 .ps1 里放非 ASCII 文本。
 *    PS 5.1 按 ANSI（中文机器 = GBK）解码无 BOM 文件：一个多字节尾字节会和紧跟的
 *    ASCII 引号配成一对被吞掉，字符串界定符就此错位 → AST 解析错误。
 *    node --check / 正则 / 任何按 UTF-8 读文本的自检全部照常通过。
 *    实证（2026-08-31）：scripts/sync-skills.ps1 加中文注释后 HEAD=0 errors、改后=14。
 *    → 用 PowerShell 自己的 Parser::ParseFile 解析每个已跟踪 .ps1。
 *
 * 2) sync-skills.ps1 必须拒绝 neoforge/ 根档（neoforge/LEGACY-NOTICE.md）。
 *    根档是 legacy trap。若 -All 再把根目录列进 targets，一次 sync 就按旧源稿重写
 *    整套已删投影。素材是自建 fixture（仓库根的 neoforge/.cursor 源稿已按 §3.4-9
 *    删除，gate 不再依赖它在盘上存在）→ 拿该 fixture 真跑 -TargetDir，
 *    断言 REFUSE 且不生成任何投影树。
 *
 * 没有 powershell.exe（非 Windows）时打印**可辨识的 SKIP 行**后退出——不在别的机器上假装通过，
 * 也不把 skip 记成 pass（S16/t9 腿 1，见 `gateVerdict`）。纯文本腿（sync-skills.ps1 的 -All
 * targets / 源稿复活）不需要 powershell，在该机器上照常执行。
 *
 * S16/t9（第 46 轮）新增 `--selftest`：本 gate 此前**没有** in-gate 自检，覆盖只在
 * `mcp-server/test-scripts.mjs` 的 #14 外部块。那个块证的是「真 gate 在投毒仓库上会红」，
 * 证不了「判据核本身会红」——而本文件恰好有两处「能悄悄绿」的形状（skip 即 exit 0 /
 * 采集器吐空数组时 0===0 恒绿），都得由自检钉住。自检走同一批判定函数、全内存夹具、
 * 不 spawn 子进程、不落盘。
 */
import { spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
/**
 * MC_SKILL_PS_TEST_ROOT：只给「证明本 gate 会失败」的自检用——把整个仓库根换成一个
 * 临时目录（里面放被投毒的 .ps1、剥掉守卫的 sync-skills.ps1 副本）。真实跑不设它。
 */
const repoRoot = process.env.MC_SKILL_PS_TEST_ROOT
  ? join(process.env.MC_SKILL_PS_TEST_ROOT)
  : join(here, "..", "..");
const PROJECTION_DIRS = [".claude", ".continue", ".trae", ".opencode", ".agents", ".zcode", ".pi"];
/** 依赖/构建产物/约定俗成的本地草稿目录名，不是仓库资产，不参与遍历检查。 */
const SKIP_DIRS = new Set(["node_modules", "dist", ".git", ".scratch"]);
const SCRATCH = /(^|[\\/])(_debug_|_test_|_temp)/;

function toPosix(p) {
  return p.split(sep).join("/");
}

function walkPs1(dir, out) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const abs = join(dir, entry.name);
    const rel = toPosix(relative(repoRoot, abs));
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name) || SCRATCH.test(rel)) continue;
      walkPs1(abs, out);
    } else if (entry.name.endsWith(".ps1") && !SCRATCH.test(rel)) {
      out.push(rel);
    }
  }
  return out;
}

function listTrackedPs1() {
  // 自检模式下根目录不在版本控制里，git 列出的路径相对的是别的仓库 → 只走遍历。
  if (!process.env.MC_SKILL_PS_TEST_ROOT) {
    const r = spawnSync("git", ["ls-files", "-z", "--", "*.ps1"], {
      cwd: repoRoot,
      encoding: "utf8",
    });
    if (r.status === 0 && r.stdout.trim()) return { files: r.stdout.split("\0").filter(Boolean), fromGit: true };
  }
  return { files: walkPs1(repoRoot, []).sort(), fromGit: false };
}

// ── 判定核：live run 与 --selftest 共用同一批函数（S16/t9）───────────────────
/** 本 gate 的三条腿。缺腿 = 红（除非整体 skip，见 gateVerdict）。 */
const LEGS = ["ps-parse", "root-guard-text", "root-guard-run"];
/** skip 行必须与判绿行可区分：外部消费者按这个标记认「没判」。 */
const SKIP_MARKER = "SKIP-NOT-VERIFIED";

/** powershell.exe 探测结果 → { usable, version, skip }。status!=0 或无版本号 ⇒ skip，不是通过。 */
function classifyPsProbe(r) {
  const out = String((r && r.stdout) || "");
  const m = out.match(/\d+\.\d+/);
  if (r && r.status === 0 && m) return { usable: true, version: m[0], skip: false };
  return { usable: false, version: null, skip: true };
}

function skipLine() {
  return (
    `assert-powershell: ${SKIP_MARKER}（未找到 powershell.exe —— 本 gate 依赖 Windows PowerShell；` +
    `${LEGS.filter((l) => l !== "root-guard-text").join(" / ")} 未执行，本行不是判绿）`
  );
}

/**
 * 腿 2（collector-zero）：`okCount !== ps1Files.length` 在清单为空时是 0===0 ⇒ 恒绿。
 * `listTrackedPs1()` 两条分支都可能吐空数组（git ls-files 无 *.ps1 / 遍历根下没有 .ps1），
 * 所以「采集器返回 0」本身必须是缺陷，不能是绿灯。
 */
function collectorFloorFailures(ps1Files, source) {
  if (!Array.isArray(ps1Files) || ps1Files.length === 0) {
    return [
      `COLLECTOR_RETURNED_ZERO: .ps1 采集器返回 0 个文件（来源 ${source}）—— ` +
        `空清单下 okCount(0) === ps1Files.length(0) 会假绿（S16/t9 腿 2）`,
    ];
  }
  return [];
}

/** 解析 powershell 的逐文件输出。lines = powershell stdout 拆行（已去 BOM、去空行）。 */
function parseOutcomeFailures(lines, ps1Files, psVersion, source) {
  const failures = collectorFloorFailures(ps1Files, source);
  let okCount = 0;
  let current = null;
  for (const line of lines) {
    if (line.startsWith("OK\t")) {
      okCount++;
      current = null;
    } else if (line.startsWith("ERR\t") || line.startsWith("MISSING\t")) {
      const [, rel, count] = line.split("\t");
      current = `${rel}: ${count ? `${count} 个 PowerShell ${psVersion} 解析错误` : "文件不存在"}`;
      failures.push(current);
    } else if (current && /^\s+line \d+/.test(line)) {
      current += `｜${line.trim()}`;
      failures[failures.length - 1] = current;
    } else {
      failures.push(`powershell 输出异常: ${line.trim()}`);
    }
  }
  if (okCount !== ps1Files.length) {
    failures.push(`.ps1 清单 ${ps1Files.length} 个，只有 ${okCount} 个通过解析`);
  }
  return { failures, okCount };
}

/** sync-skills.ps1 的 -All targets 采集腿 + 根档源稿存在性：纯文本，不需要 powershell。 */
function rootGuardTextFailures({ scriptText, legacySourceExists }) {
  const failures = [];
  if (scriptText === null) {
    failures.push("找不到 scripts/sync-skills.ps1");
    if (legacySourceExists) failures.push("legacy neoforge/.cursor 源稿复活（§3.4-9 已删）");
    return failures;
  }
  // S16-tail（第 11 轮）：旧写法 `scriptText.slice(scriptText.indexOf("if ($All)"))` 在锚点
  // 不存在时 indexOf=-1 ⇒ slice(-1) 只截最后一个字符 ⇒ targetLines 恒空 ⇒ 这条守卫恒绿。
  // 现在锚点缺失本身即判红。
  const allAnchor = scriptText.indexOf("if ($All)");
  if (allAnchor === -1) {
    failures.push("sync-skills.ps1 找不到 `if ($All)` 锚点 —— -All targets 扫描腿无法落点（S16-tail：曾恒绿）");
  } else {
    const allBlock = scriptText.slice(allAnchor);
    const targetLines = allBlock.split(/\r?\n/).filter((l) => !/^\s*#/.test(l) && /targets\s*\+=/.test(l));
    if (targetLines.some((l) => /["']neoforge["']/i.test(l))) {
      failures.push('sync-skills.ps1 -All 又把 neoforge 根目录列进 targets（legacy trap 不能同步）');
    }
  }
  // 根档源稿本身也必须保持不存在。其余 gate 都按 /^\d+\.\d+/ 或 pack 形态枚举版本目录，
  // 看不见 neoforge/.cursor —— 它一旦复活只有本 gate 会撞见，故在此钉死。
  if (legacySourceExists) {
    failures.push("legacy neoforge/.cursor 源稿复活（§3.4-9 已删；REFUSE 只挡投影，挡不住源稿回潮）");
  }
  return failures;
}

/** 真跑 sync-skills.ps1 -TargetDir 的结果判定。existingProjections = 副本里已存在的投影目录名。 */
function rootGuardRunFailures({ stdout, exitStatus, existingProjections, rulesDirMissing }) {
  const failures = [];
  if (!/REFUSE/.test(stdout)) {
    failures.push(
      `sync-skills.ps1 未拒绝 neoforge 根档（期望 REFUSE；exit=${exitStatus}）: ${String(stdout).trim().slice(-240)}`,
    );
  }
  for (const host of existingProjections) {
    failures.push(`sync-skills.ps1 在 legacy neoforge 根档生成了投影树 ${host}`);
  }
  if (rulesDirMissing) failures.push("根档源稿被 sync 改动（副本 .cursor/rules 丢失）");
  return failures;
}

/**
 * 判决：failures 优先 → 红；否则 skip ⇒ exit 0 但 label 必须是 "skip"（不是 pass）；
 * 非 skip 时任一腿没执行 ⇒ 红（此前「腿没跑」与「腿跑绿」不可区分，是 pseudo-guard 的形状）。
 */
function gateVerdict({ skipped, legsDone, failures }) {
  const missing = LEGS.filter((l) => !legsDone.has(l));
  if (failures.length) return { code: 1, label: "fail", missing };
  if (skipped) return { code: 0, label: "skip", missing };
  if (missing.length) return { code: 1, label: "fail", missing };
  return { code: 0, label: "pass", missing };
}

function reportFailures(failures) {
  console.error(`assert-powershell: ${failures.length} 个问题`);
  for (const f of failures.slice(0, 30)) console.error(`  ${f}`);
  if (failures.length > 30) console.error(`  … +${failures.length - 30} more`);
  console.error("  修法：.ps1 内的注释与 Write-Host 一律只用 ASCII —— 无 BOM 文件在 PS 5.1 下按 GBK 解码。");
}

// ── --selftest：全内存夹具，不 spawn、不落盘 ────────────────────────────────
// 每例只喂字符串给上面的判定核。expect:"red" ⇒ 必须产出失败项（可选 match 校验措辞）；
// expect:"green" ⇒ 必须一条失败都不产出（不判定的对照，证明本 gate 没被做成恒红）。
function selftestCases() {
  const CLEAN_SCRIPT = [
    "param([string]$TargetDir)",
    "if ($All) {",
    '  $targets += "forge/1.20.1/.cursor/rules"',
    '  $targets += "fabric/1.21.1/.cursor/skills"',
    "}",
    '$meta.Platform -eq "neoforge" -and $meta.Version',
  ].join("\n");
  const NO_ANCHOR = "param([string]$TargetDir)\n$targets += \"neoforge\"\n";
  const NEOROOT_SCRIPT = CLEAN_SCRIPT.replace(
    '  $targets += "forge/1.20.1/.cursor/rules"',
    '  $targets += "neoforge"',
  );
  const REFUSE_OUT = "REFUSE: neoforge 根档是 legacy trap，跳过同步";
  const cases = [
    // 腿 2：采集器地板
    {
      name: "毒·采集器返回 0 个 .ps1 ⇒ COLLECTOR_RETURNED_ZERO",
      expect: "red",
      match: /COLLECTOR_RETURNED_ZERO/,
      failures: () => collectorFloorFailures([], "git"),
    },
    {
      name: "毒·powershell 全量输出为空 + 清单为空 ⇒ 旧代码 0===0 恒绿",
      expect: "red",
      match: /COLLECTOR_RETURNED_ZERO/,
      failures: () => parseOutcomeFailures([], [], "5.1", "walk").failures,
    },
    {
      name: "毒·单个 .ps1 解析报错必须点名文件与错误数",
      expect: "red",
      match: /evil\.ps1: 14 个 PowerShell 5\.1 解析错误/,
      failures: () => parseOutcomeFailures(["ERR\tevil.ps1\t14"], ["evil.ps1"], "5.1", "git").failures,
    },
    {
      name: "毒·清单里的文件在盘上不存在 ⇒ MISSING",
      expect: "red",
      match: /a\.ps1: 文件不存在/,
      failures: () => parseOutcomeFailures(["MISSING\ta.ps1"], ["a.ps1"], "5.1", "git").failures,
    },
    {
      name: "毒·解析计数与清单不符（1 个文件只有 0 个 OK）",
      expect: "red",
      match: /只有 0 个通过解析/,
      failures: () => parseOutcomeFailures(["OK"], ["a.ps1"], "5.1", "git").failures,
    },
    {
      name: "毒·powershell 吐了未知行（输出协议漂了不能当绿）",
      expect: "red",
      match: /输出异常/,
      failures: () => parseOutcomeFailures(["garbage-no-prefix"], ["a.ps1"], "5.1", "git").failures,
    },
    {
      name: "毒·sync-skills.ps1 找不到 `if ($All)` 锚点（S16-tail 恒绿回归）",
      expect: "red",
      match: /锚点/,
      failures: () => rootGuardTextFailures({ scriptText: NO_ANCHOR, legacySourceExists: false }),
    },
    {
      name: "毒·-All 把 neoforge 根目录列进 targets",
      expect: "red",
      match: /legacy trap 不能同步/,
      failures: () => rootGuardTextFailures({ scriptText: NEOROOT_SCRIPT, legacySourceExists: false }),
    },
    {
      name: "毒·legacy neoforge/.cursor 源稿复活",
      expect: "red",
      match: /复活/,
      failures: () => rootGuardTextFailures({ scriptText: CLEAN_SCRIPT, legacySourceExists: true }),
    },
    {
      name: "毒·脚本被删 ⇒ 找不到 sync-skills.ps1 不得静默",
      expect: "red",
      match: /找不到 scripts\/sync-skills\.ps1/,
      failures: () => rootGuardTextFailures({ scriptText: null, legacySourceExists: false }),
    },
    {
      name: "毒·真跑没报 REFUSE",
      expect: "red",
      match: /未拒绝 neoforge 根档/,
      failures: () => rootGuardRunFailures({ stdout: "done", exitStatus: 0, existingProjections: [], rulesDirMissing: false }),
    },
    {
      name: "毒·legacy 根档仍生成投影树",
      expect: "red",
      match: /投影树 \.claude/,
      failures: () => rootGuardRunFailures({ stdout: REFUSE_OUT, exitStatus: 0, existingProjections: [".claude"], rulesDirMissing: false }),
    },
    {
      name: "毒·副本 .cursor/rules 被 sync 改动",
      expect: "red",
      match: /源稿被 sync 改动/,
      failures: () => rootGuardRunFailures({ stdout: REFUSE_OUT, exitStatus: 0, existingProjections: [], rulesDirMissing: true }),
    },
    // 腿 1：skip ≠ pass
    {
      name: "断·powershell 探不到 ⇒ classifyPsProbe 判 skip 而非可用",
      expect: "assert",
      match: /classifyPsProbe/,
      failures: () => (classifyPsProbe({ status: 1, stdout: "" }).usable ? ["classifyPsProbe 把探测失败当成可用"] : []),
    },
    {
      name: "断·powershell 吐了没有版本号的 stdout ⇒ 不得判可用",
      expect: "assert",
      match: /classifyPsProbe/,
      failures: () => (classifyPsProbe({ status: 0, stdout: "no version here" }).usable ? ["classifyPsProbe 无版本号仍判可用"] : []),
    },
    {
      name: "断·skip 不得被记成 pass（gateVerdict 的 skip 分支）",
      expect: "assert",
      match: /label 必须是 skip/,
      failures: () => {
        const v = gateVerdict({ skipped: true, legsDone: new Set(["root-guard-text"]), failures: [] });
        return v.label === "skip" ? [] : [`gateVerdict: skip 路径的 label 必须是 skip，实为 ${v.label}`];
      },
    },
    {
      name: "断·skip 行的措辞必须与判绿行可区分",
      expect: "assert",
      match: /SKIP 行/,
      failures: () => {
        const line = skipLine();
        const bad = !line.includes(SKIP_MARKER) || /^assert-powershell: ok/.test(line);
        return bad ? [`SKIP 行缺少 ${SKIP_MARKER} 或与判绿行同形：${line}`] : [];
      },
    },
    {
      name: "断·非 skip 时任一腿未执行 ⇒ 不得算绿",
      expect: "assert",
      match: /code 1/,
      failures: () => {
        const v = gateVerdict({ skipped: false, legsDone: new Set(["root-guard-text", "root-guard-run"]), failures: [] });
        return v.code === 1 ? [] : [`缺 ps-parse 腿时 gateVerdict 应 code 1，实为 ${v.code}/${v.label}`];
      },
    },
    {
      name: "断·有失败项时 skip 不得把退出码洗成 0",
      expect: "assert",
      match: /退出码/,
      failures: () => {
        const v = gateVerdict({ skipped: true, legsDone: new Set(), failures: ["x"] });
        return v.code === 1 ? [] : [`带失败项 + skip 时退出码必须是 1，实为 ${v.code}`];
      },
    },
    // 不判定的正对照（必须继续绿，否则本 gate 被做成了恒红）
    {
      name: "对照·非空清单不触发采集器地板",
      expect: "green",
      failures: () => collectorFloorFailures(["a.ps1", "b.ps1"], "git"),
    },
    {
      name: "对照·全部 OK ⇒ 零失败",
      expect: "green",
      failures: () => parseOutcomeFailures(["OK\ta.ps1", "OK\tb.ps1"], ["a.ps1", "b.ps1"], "5.1", "git").failures,
    },
    {
      name: "对照·干净 sync-skills.ps1 ⇒ 零失败",
      expect: "green",
      failures: () => rootGuardTextFailures({ scriptText: CLEAN_SCRIPT, legacySourceExists: false }),
    },
    {
      name: "对照·REFUSE 且零副作用 ⇒ 零失败",
      expect: "green",
      failures: () => rootGuardRunFailures({ stdout: REFUSE_OUT, exitStatus: 0, existingProjections: [], rulesDirMissing: false }),
    },
    {
      name: "对照·三腿齐备无失败 ⇒ pass",
      expect: "green",
      failures: () => {
        const v = gateVerdict({ skipped: false, legsDone: new Set(LEGS), failures: [] });
        return v.code === 0 && v.label === "pass" ? [] : [`pass 判定失效：${v.code}/${v.label}`];
      },
    },
    {
      name: "对照·powershell 5.1 版本号被认出 ⇒ 可用",
      expect: "green",
      failures: () => {
        const p = classifyPsProbe({ status: 0, stdout: "5.1.22621.5624" });
        return p.usable && p.version === "5.1" ? [] : [`classifyPsProbe 未认出 5.1：${JSON.stringify(p)}`];
      },
    },
  ];
  return cases;
}

function runSelftest() {
  const cases = selftestCases();
  let red = 0;
  let green = 0;
  let guard = 0;
  const bad = [];
  for (const c of cases) {
    let failures;
    try {
      failures = c.failures();
    } catch (err) {
      bad.push(`${c.name} :: 抛错 ${err && err.message}`);
      continue;
    }
    if (c.expect === "assert") {
      guard++;
      if (failures.length) bad.push(`${c.name} :: 判据核退化：${failures.join(" ｜ ")}`);
    } else if (c.expect === "red") {
      red++;
      if (!failures.length) {
        bad.push(`${c.name} :: 投毒未判红（本 gate 是装饰）`);
        continue;
      }
      if (c.match && !c.match.test(failures.join("\n"))) {
        bad.push(`${c.name} :: 判红了但没点名（期望 ${c.match}，实为 ${failures.join(" ｜ ")}`);
      }
    } else {
      green++;
      if (failures.length) bad.push(`${c.name} :: 正对照被判红（gate 恒红了）：${failures.join(" ｜ ")}`);
    }
  }
  console.log(
    `assert-powershell --selftest: ${cases.length} 例（${red} 投毒必红 + ${guard} 反退化断言 + ${green} 正对照），腿 = ${LEGS.join(" / ")}`,
  );
  for (const c of cases) console.log(`  [${c.expect === "red" ? "毒" : c.expect === "assert" ? "断" : "照"}] ${c.name}`);
  if (bad.length) {
    console.error(`assert-powershell --selftest: ${bad.length} 例失效`);
    for (const b of bad) console.error(`  RED ${b}`);
    return 1;
  }
  console.log(`assert-powershell --selftest: ok（${red} 投毒全部判红 · ${guard} 反退化断言全部成立 · ${green} 对照全部判绿）`);
  return 0;
}

if (process.argv.includes("--selftest")) process.exit(runSelftest());

// ── live run ────────────────────────────────────────────────────────────────
const failures = [];
const legsDone = new Set();

// 纯文本腿先跑：换到没有 powershell 的机器上它仍然有效（S16/t9：skip 不该带走全部覆盖）。
const syncScript = join(repoRoot, "scripts", "sync-skills.ps1");
const syncText = existsSync(syncScript) ? readFileSync(syncScript, "utf8") : null;
legsDone.add("root-guard-text");
failures.push(...rootGuardTextFailures({
  scriptText: syncText,
  legacySourceExists: existsSync(join(repoRoot, "neoforge", ".cursor")),
}));

const psVer = spawnSync(
  "powershell.exe",
  ["-NoProfile", "-Command", "$PSVersionTable.PSVersion.ToString()"],
  { encoding: "utf8", windowsHide: true },
);
const probe = classifyPsProbe(psVer);
if (!probe.usable) {
  console.log(skipLine());
  const v = gateVerdict({ skipped: true, legsDone, failures });
  if (v.missing.length) console.error(`  未执行的腿：${v.missing.join(", ")}`);
  if (failures.length) reportFailures(failures);
  process.exit(v.code);
}
const psVersion = probe.version;

const { files: ps1Files, fromGit } = listTrackedPs1();
const listSource = fromGit ? "git ls-files" : "文件系统遍历";
if (!fromGit) console.log("  warn: git ls-files 不可用，改用文件系统遍历");

// ── 1) 每个 .ps1 必须能被 PowerShell 5.1 的解析器接受 ───────────────────────
const workDir = mkdtempSync(join(tmpdir(), "mcskill-ps-"));
try {
  const listFile = join(workDir, "ps1-list.txt");
  writeFileSync(listFile, ps1Files.join("\n"), "utf8");
  const q = (s) => String(s).replace(/'/g, "''");
  const parseScript = [
    "$ErrorActionPreference = 'Stop'",
    `$list = [IO.File]::ReadAllLines('${q(listFile)}', [Text.Encoding]::UTF8)`,
    `$root = '${q(repoRoot)}'`,
    "foreach ($rel in $list) {",
    "  if (-not $rel) { continue }",
    "  $abs = Join-Path $root $rel",
    "  if (-not (Test-Path -LiteralPath $abs)) { Write-Output ('MISSING' + [char]9 + $rel); continue }",
    "  $tok = $null; $err = $null",
    "  [void][System.Management.Automation.Language.Parser]::ParseFile($abs, [ref]$tok, [ref]$err)",
    "  if ($err.Count -gt 0) {",
    "    Write-Output ('ERR' + [char]9 + $rel + [char]9 + $err.Count)",
    "    foreach ($e in @($err | Select-Object -First 3)) {",
    "      Write-Output ('  line ' + $e.Extent.StartLineNumber + ' col ' + $e.Extent.StartColumnNumber + ' ' + $e.Message)",
    "    }",
    "  } else {",
    "    Write-Output ('OK' + [char]9 + $rel)",
    "  }",
    "}",
  ].join("\n");

  const parsed = spawnSync(
    "powershell.exe",
    ["-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", parseScript],
    { encoding: "utf8", windowsHide: true, maxBuffer: 32 * 1024 * 1024 },
  );
  legsDone.add("ps-parse");
  if (parsed.status !== 0) {
    failures.push(
      `powershell 解析器调用失败 (exit ${parsed.status}): ${(parsed.stderr || parsed.stdout || "").trim().slice(0, 300)}`,
    );
  } else {
    const rawStdout = parsed.stdout || "";
    const stripped = rawStdout.charCodeAt(0) === 0xfeff ? rawStdout.slice(1) : rawStdout;
    const lines = stripped.split(/\r?\n/).filter((l) => l.trim());
    const outcome = parseOutcomeFailures(lines, ps1Files, psVersion, listSource);
    failures.push(...outcome.failures);
    if (outcome.okCount === ps1Files.length && ps1Files.length > 0) {
      console.log(`  parsed: ${outcome.okCount}/${ps1Files.length} .ps1 (Windows PowerShell ${psVersion})`);
    }
  }

  // ── 2) sync-skills.ps1 的 legacy neoforge 根档守卫（真跑，用副本） ─────────
  if (syncText === null) {
    // 文本腿已记「找不到 scripts/sync-skills.ps1」；真跑腿无从执行，记进 legsDone 前先补齐前提。
    failures.push("sync-skills.ps1 缺失 ⇒ 根档守卫真跑腿无法执行");
  } else {
    const copy = join(workDir, "neoforge");
    mkdirSync(join(copy, ".cursor", "rules"), { recursive: true });
    writeFileSync(join(copy, ".cursor", "rules", "00-project-setup.mdc"), "# legacy 根档 fixture\n", "utf8");
    const run = spawnSync(
      "powershell.exe",
      ["-NoProfile", "-ExecutionPolicy", "Bypass", "-File", syncScript, "-TargetDir", copy],
      { encoding: "utf8", windowsHide: true, maxBuffer: 32 * 1024 * 1024 },
    );
    legsDone.add("root-guard-run");
    const stdout = run.stdout || "";
    const existingProjections = PROJECTION_DIRS.filter((host) => existsSync(join(copy, host)));
    const rulesMissing = !existsSync(join(copy, ".cursor", "rules")) || !statSync(join(copy, ".cursor", "rules")).isDirectory();
    failures.push(...rootGuardRunFailures({ stdout, exitStatus: run.status, existingProjections, rulesDirMissing: rulesMissing }));
    if (/REFUSE/.test(stdout) && !existingProjections.length && !rulesMissing) {
      console.log("  root guard: sync-skills.ps1 REFUSE neoforge 根档，零副作用");
    }
  }
} finally {
  rmSync(workDir, { recursive: true, force: true });
}

const verdict = gateVerdict({ skipped: false, legsDone, failures });
if (verdict.code === 1 && !failures.length) {
  failures.push(`gate 腿未执行：${verdict.missing.join(", ")}`);
}
if (failures.length) {
  reportFailures(failures);
  process.exit(1);
}
console.log(
  `assert-powershell: ok (${ps1Files.length} 个 .ps1 可解析 + neoforge 根档守卫有效)`,
);
