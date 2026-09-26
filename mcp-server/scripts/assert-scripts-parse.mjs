/**
 * 语法闸门：对**被 Git 跟踪的**每个 .mjs / .js / .cjs 跑 `node --check`（只解析，不执行）。
 *
 * 为什么必须有：`scripts/` 与 `mcp-server/scripts/` 里的一次性脚本、数据生成器不在
 * `npm test` 的执行路径上。一个重复的 `function` 声明（与顶部 `import` 同名 = SyntaxError，
 * 模块连解析都做不到）可以静静躺在仓库里几个月，直到有人真去跑它才发现。
 *
 * 只查 tracked 文件，不做全盘遍历：本地被 .gitignore 掉的草稿（`_debug_*`、`_test_*`）
 * 不该让别人的机器变红，也无法证明它们存在于发布物里。git 不可用时退回目录遍历，
 * 并按同样的忽略规则跳过这些草稿名。
 *
 * ⚠️ 边界：**可见 ≠ 被测**（2026-09-22 第 8 轮 S13-T1 复核后写死，只补注释、不改判据）。
 *   - 扫描面由 `trackedFiles()` 决定（见下：`git ls-files -z -- "*.mjs" "*.js" "*.cjs"`），
 *     所以「进了 git」就等于「进了本门」——`_lib/bedrock-corpus.mjs`、`_lib/upstream-inventory.mjs`、
 *     `fetch-bedrock-script-api.mjs`、`assert-script-write-guard.mjs`、`assert-javadoc-build-provenance.mjs`
 *     五者 `git ls-files --error-unmatch` 逐个实测为 TRACKED，故它们的**语法**一直在门里。
 *   - 但本门对每个文件只跑一次 `node --check <abs>`（见 worker() 里的 spawnSync），**只解析、不执行**。
 *     ⇒ 它能拦住重复声明 / SyntaxError 这类「模块连 import 都做不到」的错，**拦不住**逻辑死代码：
 *     `bedrock-corpus.mjs` 的 `tableToMd` 被通用剥标签先打散、永不触发（S14-T1 修的那条），
 *     以及 `fetch-bedrock-script-api.mjs` 里 `sectionCount: 1` 硬编码 + 从不自增的 `skipped`
 *     （S14-T3）在本门下**全都是绿的**。
 *   - 结论：要让这些脚本的**行为**有回归保护，只有两条路，本门都不替代——
 *     ① 给纯函数补 `scripts/_lib/*.test.mjs` 并显式追加进 `package.json` 的 `--test` 链
 *     （那条链不自动发现文件，漏追加 = 测了但没人跑）；② 由 `test-scripts.mjs` 的门串链代跑该脚本。
 */
import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { basename, dirname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, "..", "..");
const EXT = /\.(mjs|cjs|js)$/;
/** .gitignore 掉的草稿前缀（_test_、_debug_、_temp）；无 git 时靠这个名字集合兜底。 */
const SCRATCH = /(^|[\\/])(_debug_|_test_|_temp)/;

function trackedFiles() {
  const r = spawnSync("git", ["ls-files", "-z", "--", "*.mjs", "*.js", "*.cjs"], {
    cwd: repoRoot,
    encoding: "utf8",
    maxBuffer: 32 * 1024 * 1024,
  });
  if (r.status !== 0) return null;
  return r.stdout.split("\0").filter(Boolean);
}

function walk(dir, out) {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (SCRATCH.test(name)) continue;
    const st = statSync(p);
    if (st.isDirectory()) {
      if (name === "node_modules" || name === "dist" || name === ".git") continue;
      walk(p, out);
    } else if (EXT.test(name)) {
      out.push(relative(repoRoot, p).split(sep).join("/"));
    }
  }
  return out;
}

function fallbackFiles() {
  const out = [];
  for (const d of ["scripts", "mcp-server/scripts", "mcp-server"]) {
    const abs = join(repoRoot, d);
    if (!existsSync(abs) || !statSync(abs).isDirectory()) continue;
    if (d === "mcp-server") {
      // 只补 mcp-server 顶层的 test-*.mjs，脚本子目录已单独遍历，避免整棵 node_modules 递归。
      for (const name of readdirSync(abs)) {
        if (!/^test-.*\.mjs$/.test(name)) continue;
        if (SCRATCH.test(name)) continue;
        out.push(`mcp-server/${name}`);
      }
      continue;
    }
    walk(abs, out);
  }
  return [...new Set(out)];
}

const files = trackedFiles() ?? fallbackFiles();
if (files.length === 0) {
  console.error("assert-scripts-parse: 未找到任何可检查文件（git 与目录遍历都失败？）");
  process.exit(1);
}

const failures = [];
const CONCURRENCY = 8;
let cursor = 0;

async function worker() {
  while (cursor < files.length) {
    const f = files[cursor++];
    const abs = join(repoRoot, f);
    if (!existsSync(abs)) {
      failures.push(`${f} :: 已被 Git 跟踪但磁盘上不存在`);
      continue;
    }
    const r = spawnSync(process.execPath, ["--check", abs], { encoding: "utf8", maxBuffer: 8 * 1024 * 1024 });
    if (r.status !== 0) {
      const first = String(r.stderr || "")
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean)
        .slice(0, 3)
        .join(" / ");
      failures.push(`${f} :: ${first || "node --check 失败"}`);
    }
  }
}

await Promise.all(Array.from({ length: CONCURRENCY }, worker));

// ── S16-tail（第 11 轮）：盘上每个 *.test.mjs 必须已接进 package.json 的 node --test 链 ──
// 头注早就写着「那条链不自动发现文件，漏追加 = 测了但没人跑」，但此前没有任何门守这件事
// （R87⑦ 实测当时 10/10 按 basename 无孤儿 —— 无孤儿 ≠ 有守门）。按 basename 比，下界判据：
// 只报「盘上有链里没有」，链多引不判红（等式棘轮禁止）。读 package.json，绝不写。
//
// ⚠️ 2026-09-24 分工（A8 回修②，与 assert-test-chain-coverage.mjs 的关系）：
//   · 本腿 = **单向下界**（盘上有 / 链上无 ⇒ 红），按 basename 比，挂在 `npm test` 第一道；
//     刻意不看反方向（链多引不判红）—— 那会变成等式棘轮。
//   · `assert-test-chain-coverage.mjs` = **双向权威**（另判「链上点名了盘上没有的文件」⇒ 红），
//     按仓库相对路径比，挂 `test-scripts.mjs` 的真跑 + 自证两条数组。
//   · 两者方向不同、判据不重复；若将来冲突，**以覆盖门的双向判据为准**，不要在这里再抄一份
//     双向实现（两个真值源必然漂）。
function collectTestMjs(dir, out) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === "dist" || entry.name === ".git") continue;
      collectTestMjs(join(dir, entry.name), out);
    } else if (entry.name.endsWith(".test.mjs")) {
      out.push(join(dir, entry.name));
    }
  }
  return out;
}
const diskTests = collectTestMjs(here, []);
const pkgText = readFileSync(join(here, "..", "package.json"), "utf8");
const pkg = JSON.parse(pkgText);
const chainText = Object.entries(pkg.scripts || {})
  .filter(([k]) => k === "test" || k.startsWith("test:"))
  .map(([, v]) => String(v))
  .join("\n");
const orphanTests = diskTests.filter((f) => !chainText.includes(basename(f)));
for (const f of orphanTests) {
  failures.push(`${relative(repoRoot, f).split(sep).join("/")} :: 未接进 package.json 的 node --test 链（测了但没人跑 = 装饰，S16-tail）`);
}
console.log(`  test-wiring: 盘上 .test.mjs=${diskTests.length} 链内可寻址=${diskTests.length - orphanTests.length} 孤儿=${orphanTests.length}`);

if (failures.length) {
  console.error(`assert-scripts-parse: ${failures.length} 个问题（脚本解析 / test-wiring 接线）`);
  for (const f of failures.slice(0, 30)) console.error(`  ${f}`);
  if (failures.length > 30) console.error(`  … +${failures.length - 30} more`);
  console.error("\n`node --check` 只解析不执行：写盘脚本也可以被安全覆盖，不要再靠「跑跑看」。");
  process.exit(1);
}
console.log(`assert-scripts-parse: ok (${files.length} 个跟踪脚本可解析)`);
