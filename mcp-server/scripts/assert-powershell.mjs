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
 * 没有 powershell.exe（非 Windows）时打印说明后跳过——不在别的机器上假装通过。
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

const psVer = spawnSync(
  "powershell.exe",
  ["-NoProfile", "-Command", "$PSVersionTable.PSVersion.ToString()"],
  { encoding: "utf8", windowsHide: true },
);
if (psVer.status !== 0 || !/\d+\.\d+/.test(psVer.stdout || "")) {
  console.log("assert-powershell: skip（未找到 powershell.exe —— 本 gate 依赖 Windows PowerShell）");
  process.exit(0);
}
const psVersion = (psVer.stdout.match(/\d+\.\d+/) || ["?"])[0];

const failures = [];
const { files: ps1Files, fromGit } = listTrackedPs1();
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
  if (parsed.status !== 0) {
    failures.push(
      `powershell 解析器调用失败 (exit ${parsed.status}): ${(parsed.stderr || parsed.stdout || "").trim().slice(0, 300)}`,
    );
  } else {
    const lines = (parsed.stdout || "").replace(/^\uFEFF/, "").split(/\r?\n/).filter((l) => l.trim());
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
    } else {
      console.log(`  parsed: ${okCount}/${ps1Files.length} .ps1 (Windows PowerShell ${psVersion})`);
    }
  }

  // ── 2) sync-skills.ps1 的 legacy neoforge 根档守卫（真跑，用副本） ─────────
  const syncScript = join(repoRoot, "scripts", "sync-skills.ps1");
  if (!existsSync(syncScript)) {
    failures.push(`找不到 ${toPosix(relative(repoRoot, syncScript))}`);
  } else {
    const scriptText = readFileSync(syncScript, "utf8");
    const allBlock = scriptText.slice(scriptText.indexOf("if ($All)"));
    const targetLines = allBlock.split(/\r?\n/).filter((l) => !/^\s*#/.test(l) && /targets\s*\+=/.test(l));
    if (targetLines.some((l) => /["']neoforge["']/i.test(l))) {
      failures.push('sync-skills.ps1 -All 又把 neoforge 根目录列进 targets（legacy trap 不能同步）');
    }

    // 根档源稿本身也必须保持不存在。其余 gate 都按 /^\d+\.\d+/ 或 pack 形态枚举版本目录，
    // 看不见 neoforge/.cursor —— 它一旦复活只有本 gate 会撞见，故在此钉死。
    if (existsSync(join(repoRoot, "neoforge", ".cursor"))) {
      failures.push("legacy neoforge/.cursor 源稿复活（§3.4-9 已删；REFUSE 只挡投影，挡不住源稿回潮）");
    }

    const copy = join(workDir, "neoforge");
    mkdirSync(join(copy, ".cursor", "rules"), { recursive: true });
    writeFileSync(join(copy, ".cursor", "rules", "00-project-setup.mdc"), "# legacy 根档 fixture\n", "utf8");
    const run = spawnSync(
      "powershell.exe",
      ["-NoProfile", "-ExecutionPolicy", "Bypass", "-File", syncScript, "-TargetDir", copy],
      { encoding: "utf8", windowsHide: true, maxBuffer: 32 * 1024 * 1024 },
    );
    const stdout = run.stdout || "";
    if (!/REFUSE/.test(stdout)) {
      failures.push(
        `sync-skills.ps1 未拒绝 neoforge 根档（期望 REFUSE；exit=${run.status}）: ${stdout.trim().slice(-240)}`,
      );
    }
    for (const host of PROJECTION_DIRS) {
      if (existsSync(join(copy, host))) {
        failures.push(`sync-skills.ps1 在 legacy neoforge 根档生成了投影树 ${host}`);
      }
    }
    if (!existsSync(join(copy, ".cursor", "rules")) || !statSync(join(copy, ".cursor", "rules")).isDirectory()) {
      failures.push("根档源稿被 sync 改动（副本 .cursor/rules 丢失）");
    }
    if (/REFUSE/.test(stdout)) console.log("  root guard: sync-skills.ps1 REFUSE neoforge 根档，零副作用");
  }
} finally {
  rmSync(workDir, { recursive: true, force: true });
}

if (failures.length) {
  console.error(`assert-powershell: ${failures.length} 个问题`);
  for (const f of failures.slice(0, 30)) console.error(`  ${f}`);
  if (failures.length > 30) console.error(`  … +${failures.length - 30} more`);
  console.error("  修法：.ps1 内的注释与 Write-Host 一律只用 ASCII —— 无 BOM 文件在 PS 5.1 下按 GBK 解码。");
  process.exit(1);
}
console.log(
  `assert-powershell: ok (${ps1Files.length} 个 .ps1 可解析 + neoforge 根档守卫有效)`,
);
