/**
 * PS ⇄ JS 归一化差分 gate（Wave 5 §5.2）
 *
 * 「规则文本里写 platform/ver/.cursor/rules/XX.mdc」这一件事有两个独立实现：
 *   - scripts/sync-skills.ps1 的 Normalize-Content（写投影时用）
 *   - mcp-server/scripts/assert-skill-mirrors.mjs 的 normalizePathRefs（校验时用）
 * 两边条款集不一致 = 源稿改完当场「写完就 drift」，而且 mirror gate 会跟着一起骗人。
 *
 * 本 gate 不复制任何一侧的实现（复制就等于第三个实现）：
 *   ① 按符号从两个真文件里抽出函数体；
 *   ② 数两边的改写条款条数（结构性早期信号：只在一侧加规则立刻红）；
 *   ③ 同一批 fixture 分别喂给 JS（临时模块）与 PowerShell（临时 .ps1，
 *      按源文件的 BOM 状态原样落字节，所以探针看到的解码条件和生产一致），逐字节比结果；
 *   ④ 钉住编码前提：无 BOM 的 .ps1 里不许有非 ASCII 字符串字面量 —— PS 5.1 在中文机器上
 *      按 GBK 解码无 BOM 文件，这类字面量要么静默匹配不到 UTF-8 正文，要么直接吞掉引号把
 *      脚本解析打断（2026-09-04 探针实证：同一份脚本，无 BOM 时 rc=1 解析错误，加 BOM 才生效）。
 *
 * 没有 powershell.exe 时打印说明后跳过（与 assert-powershell.mjs 同一口径，不在别的机器上假装通过）。
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, "..", "..");
const PS_FILE = join(repoRoot, "scripts", "sync-skills.ps1");
const JS_FILE = join(here, "assert-skill-mirrors.mjs");
const REL = "fabric/1.14.4";

const psProbe = spawnSync(
  "powershell.exe",
  ["-NoProfile", "-Command", "$PSVersionTable.PSVersion.ToString()"],
  { encoding: "utf8", windowsHide: true },
);
if (psProbe.status !== 0 || !/\d+\.\d+/.test(psProbe.stdout || "")) {
  console.log("assert-sync-normalizers: skip（未找到 powershell.exe —— 本 gate 依赖 Windows PowerShell）");
  process.exit(0);
}
const psVersion = (psProbe.stdout.match(/\d+\.\d+/) || ["?"])[0];

const failures = [];

/** 抽 `function NAME` 到首个顶格 `}` 的函数体（含签名行）。找不到就是红，不静默跳过。 */
function extractFn(file, name) {
  if (!existsSync(file)) {
    failures.push(`找不到 ${relative(repoRoot, file)}`);
    return null;
  }
  const lines = readFileSync(file, "utf8").split(/\r?\n/);
  const start = lines.findIndex((l) => new RegExp("^function\\s+" + name + "\\b").test(l));
  if (start < 0) {
    failures.push(`${relative(repoRoot, file)} 里找不到 function ${name}（改名/搬走会让本 gate 失明）`);
    return null;
  }
  let end = start;
  while (end < lines.length && lines[end] !== "}") end++;
  if (end >= lines.length) {
    failures.push(`${relative(repoRoot, file)} 里 function ${name} 的顶格收尾大括号未找到`);
    return null;
  }
  return { text: lines.slice(start, end + 1).join("\n"), from: start + 1, to: end + 1 };
}

const ps = extractFn(PS_FILE, "Normalize-Content");
const js = extractFn(JS_FILE, "normalizePathRefs");

// ② 结构性条数：两边的「改写条款」个数必须相等。
const psRules = ps ? (ps.text.match(/\[regex\]::Replace\(/g) || []).length : -1;
const jsRules = js ? (js.text.match(/t = t\.replace\(/g) || []).length : -1;
if (ps && js && psRules !== jsRules) {
  failures.push(
    `归一化条款条数不一致：sync-skills.ps1 Normalize-Content=${psRules} 条，` +
      `assert-skill-mirrors.mjs normalizePathRefs=${jsRules} 条 —— 两边必须同增同减`,
  );
}

// fixture 集：反引号式 / 裸式 / 被删掉的三条前置词式 / 多条同行 / 不该动的形态。
const RULE_PATH = REL + "/.cursor/rules/01-block.mdc";
const FIXTURES = [
  ["backtick", "`" + RULE_PATH + "`"],
  ["bare", "see " + RULE_PATH + " ok"],
  ["cankao-bare", "参考 " + RULE_PATH],
  ["cankao-backtick", "参见 `" + RULE_PATH + "`"],
  ["arrow-cankao", "→ 参考 " + RULE_PATH],
  ["two-in-line", "`" + RULE_PATH + "` 与 " + REL + "/.cursor/rules/02-item.mdc"],
  ["other-ext", REL + "/.cursor/rules/readme.md"],
  ["other-pack", "forge/1.14.4/.cursor/rules/01-block.mdc"],
  ["empty", ""],
  ["unrelated", "nothing to normalize here"],
];

const q = (s) => String(s).replace(/'/g, "''");

/**
 * 找出「含非 ASCII 文本的 PowerShell 字符串字面量」。PS 5.1 没有 StringLiteralAst，
 * 所以在 Node 侧做逐字符扫描：单引号串里 '' 是转义、双引号串里反引号是转义、
 * 顶格状态遇到 # 即该行其余为注释。不识别 @' '@ here-string（本仓 .ps1 里没有）。
 */
function scanNonAsciiLiterals(text) {
  const hits = [];
  const lines = String(text).split(/\r?\n/);
  for (let li = 0; li < lines.length; li++) {
    const line = lines[li];
    let quote = null;
    let recordedForThisLiteral = false;
    for (let ci = 0; ci < line.length; ci++) {
      const ch = line[ci];
      if (quote) {
        if (quote === "'" && ch === "'" && line[ci + 1] === "'") {
          ci++;
          continue;
        }
        if (quote === '"' && ch === "`") {
          ci++;
          continue;
        }
        if (ch === quote) {
          quote = null;
          recordedForThisLiteral = false;
          continue;
        }
        if (ch.charCodeAt(0) > 127 && !recordedForThisLiteral) {
          hits.push({ line: li + 1, text: line.trim() });
          recordedForThisLiteral = true;
        }
        continue;
      }
      if (ch === "#") break;
      if (ch === "'" || ch === '"') {
        quote = ch;
        recordedForThisLiteral = false;
      }
    }
  }
  return hits;
}

let workDir = null;
try {
  workDir = mkdtempSync(join(tmpdir(), "mcskill-norm-"));
  const jsPath = join(workDir, "js-normalizer.mjs");
  writeFileSync(jsPath, js.text + "\nexport { normalizePathRefs };\n", "utf8");
  const { normalizePathRefs } = await import(pathToFileURL(jsPath).href);

  const psPath = join(workDir, "ps-normalizer.ps1");
  const fxPath = join(workDir, "fixtures.json");
  const srcBuf = readFileSync(PS_FILE);
  const hasBom = srcBuf[0] === 0xef && srcBuf[1] === 0xbb && srcBuf[2] === 0xbf;
  writeFileSync(fxPath, JSON.stringify(FIXTURES.map(([, t]) => t)), "utf8");

  const tailLines = [
    "$ErrorActionPreference = 'Stop'",
    "$fx = ConvertFrom-Json ([IO.File]::ReadAllText('" + q(fxPath) + "', [Text.Encoding]::UTF8))",
    "$i = 0",
    "foreach ($t in $fx) {",
    "  $n = Normalize-Content $t '" + q(REL) + "'",
    "  $e = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes([string]$n))",
    "  Write-Output ('IDX=' + $i + ' B64=' + $e)",
    "  $i++",
    "}",
    "$tok = $null; $err = $null",
    "[void][System.Management.Automation.Language.Parser]::ParseFile('" + q(PS_FILE) + "', [ref]$tok, [ref]$err)",
    "Write-Output ('PARSE-ERRORS=' + $err.Count)",
    "",
  ];
  // 与生产同 BOM 状态：抽出来的函数体按原字节落盘，钩子代码本身纯 ASCII。
  writeFileSync(
    psPath,
    Buffer.concat([
      hasBom ? Buffer.from([0xef, 0xbb, 0xbf]) : Buffer.alloc(0),
      Buffer.from(ps.text.replace(/\r?\n/g, "\r\n") + "\r\n" + tailLines.join("\r\n"), "utf8"),
    ]),
  );

  const r = spawnSync(
    "powershell.exe",
    ["-NoProfile", "-ExecutionPolicy", "Bypass", "-File", psPath],
    { encoding: "utf8", windowsHide: true, maxBuffer: 16 * 1024 * 1024 },
  );
  const stdout = (r.stdout || "").replace(/^\uFEFF/, "");
  if (r.status !== 0) {
    failures.push(`powershell harness rc=${r.status}: ${(r.stderr || stdout || "").trim().slice(0, 300)}`);
  } else {
    const meta = {};
    const rows = [];
    for (const line of stdout.split(/\r?\n/)) {
      const t = line.trim();
      if (!t) continue;
      const m = t.match(/^(?:NONASCII-LITERALS|PARSE-ERRORS)=(\d+)$/);
      if (m) {
        meta[t.split("=")[0]] = Number(m[1]);
        continue;
      }
      const row = t.match(/^IDX=(\d+) B64=([A-Za-z0-9+/=]*)$/);
      if (row) rows[Number(row[1])] = row[2];
      else failures.push(`PS harness 输出了无法解析的行: ${JSON.stringify(t.slice(0, 80))}`);
    }
    const missing = FIXTURES.map((_, i) => i).filter((i) => rows[i] === undefined);
    if (missing.length) {
      failures.push(`PS harness 少了 ${missing.length}/${FIXTURES.length} 条结果（缺 IDX ${missing.slice(0, 5).join(", ")}）`);
    } else {
      let diffs = 0;
      for (let i = 0; i < FIXTURES.length; i++) {
        const [name, src] = FIXTURES[i];
        const psOut = Buffer.from(rows[i], "base64").toString("utf8");
        const jsOut = normalizePathRefs(src, REL);
        if (psOut !== jsOut) {
          diffs++;
          failures.push(
            `fixture ${name} 两侧结果不同：PS=${JSON.stringify(psOut)} JS=${JSON.stringify(jsOut)}` +
              `（源=${JSON.stringify(src)}）`,
          );
        }
      }
      if (!diffs) console.log(`  differential: ${FIXTURES.length}/${FIXTURES.length} fixture 两侧逐字节相同`);
    }
    if (meta["PARSE-ERRORS"] === undefined) {
      failures.push("PS harness 没回 PARSE-ERRORS，编码前提未证");
    } else if (meta["PARSE-ERRORS"] > 0) {
      failures.push(
        `scripts/sync-skills.ps1 有 ${meta["PARSE-ERRORS"]} 个 PowerShell ${psVersion} 解析错误（详单跑 assert-powershell）`,
      );
    }
    const nonAscii = scanNonAsciiLiterals(ps.text);
    if (!hasBom && nonAscii.length) {
      failures.push(
        `无 BOM 的 sync-skills.ps1 里，Normalize-Content 含 ${nonAscii.length} 个非 ASCII 字符串字面量（函数内第 ${nonAscii
          .slice(0, 3)
          .map((h) => h.line)
          .join(", ")} 行，文件第 ${nonAscii
          .slice(0, 3)
          .map((h) => ps.from + h.line - 1)
          .join(", ")} 行）—— ` +
          `PowerShell ${psVersion} 按 ANSI(GBK) 解码，这类条款永远匹配不到 UTF-8 正文` +
          "（要么删掉该条款，要么给脚本加 BOM 并同步 JS 侧，再补一条同款 fixture）",
      );
    } else {
      console.log(
        `  encoding: ${hasBom ? "带 BOM" : "无 BOM"}，Normalize-Content 内非 ASCII 字面量 ${nonAscii.length} 个（扫描器不含注释）`,
      );
    }
  }
  console.log(
    `  clauses: PS Normalize-Content(${ps ? ps.from + "-" + ps.to : "?"}) = ${psRules} 条 / ` +
      `JS normalizePathRefs(${js ? js.from + "-" + js.to : "?"}) = ${jsRules} 条`,
  );
} finally {
  if (workDir) rmSync(workDir, { recursive: true, force: true });
}

if (failures.length) {
  console.error(`assert-sync-normalizers: ${failures.length} 项不一致`);
  for (const f of failures) console.error(`  ${f}`);
  process.exit(1);
}
console.log(
  `assert-sync-normalizers: ok（PS⇄JS 归一化逐 fixture 差分通过，条款集 ${psRules} 条一致，编码前提成立）`,
);
