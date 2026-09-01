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
 */
import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative, sep } from "node:path";
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

if (failures.length) {
  console.error(`assert-scripts-parse: ${failures.length} 个脚本无法解析`);
  for (const f of failures.slice(0, 30)) console.error(`  ${f}`);
  if (failures.length > 30) console.error(`  … +${failures.length - 30} more`);
  console.error("\n`node --check` 只解析不执行：写盘脚本也可以被安全覆盖，不要再靠「跑跑看」。");
  process.exit(1);
}
console.log(`assert-scripts-parse: ok (${files.length} 个跟踪脚本可解析)`);
