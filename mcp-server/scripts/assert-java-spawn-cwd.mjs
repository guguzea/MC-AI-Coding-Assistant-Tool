/**
 * Java 子进程沙箱 gate —— 防「代码看起来对，跑起来在用户仓库里拉垃圾」。
 *
 * 1) src/** 里每个 runJava(...) 必须显式传 opts.cwd，且值必须源自缓存根
 *    （ensureCachePaths(...).root）。缺省 cwd 会继承 MCP 进程的工作目录 —— 那就是
 *    **用户的仓库**。外部工具（VineFlower / tiny-remapper）只要把一个参数当成相对
 *    输出路径，垃圾就落在人家仓库里：实测仓库根曾出现整个
 *    `--only=net/fabricmc/tinyremapper/Main/…` 目录树（85 个反编译文件 + META-INF）。
 *    注意本 gate 只查调用点，不改 runJava 的签名。
 * 2) 工作树里不得存在名字以 `--` 开头的未跟踪路径 —— 那是「命令行参数被当成输出
 *    路径」的指纹，只可能来自落盘缺陷，不可能是人写的。
 * 3) 每个 remapperCli(...) 的第 4 个实参（<mappings>）必须是 ensureYarnTiny /
 *    ensureMojmapTiny 的产物：tiny-remapper 只吃 Tiny 文本，喂 yarn jar 会得到一句
 *    "invalid/unsupported mapping format"，而模组 remap 失败会被降级成反编译混淆 jar。
 *
 * argv 顺序本身（选项必须排在 source/destination 之前、--only 值用 internal name）
 * 由 test-decompile.mjs 的 vineflowerCli / remapperCli 断言覆盖，这里不重复。
 */
import { spawnSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
/**
 * MC_SKILL_JAVA_GATE_TEST_PKG：只给「证明本 gate 真的会失败」的自检用——把包根换成一个
 * 假目录（里面是被改坏的 src 副本）。真实跑不设它。
 */
const testPkg = process.env.MC_SKILL_JAVA_GATE_TEST_PKG;
const pkgRoot = testPkg ? join(testPkg) : join(here, "..");
const repoRoot = join(pkgRoot, "..");

function listTsFiles(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === "dist") continue;
    const abs = join(dir, entry.name);
    if (entry.isDirectory()) listTsFiles(abs, out);
    else if (entry.name.endsWith(".ts")) out.push(abs);
  }
  return out;
}

/** 取出 `name(` 之后完整调用表达式（含嵌套括号/字符串/模板串），返回 null = 找不到闭合。 */
function extractCall(src, openIdx) {
  let depth = 0;
  let quote = null;
  for (let i = openIdx; i < src.length; i++) {
    const c = src[i];
    if (quote) {
      if (c === "\\") i++;
      else if (c === quote) quote = null;
      continue;
    }
    if (c === '"' || c === "'" || c === "`") {
      quote = c;
      continue;
    }
    if (c === "(" || c === "[" || c === "{") depth++;
    else if (c === ")" || c === "]" || c === "}") {
      depth--;
      if (depth === 0) return src.slice(openIdx + 1, i);
    }
  }
  return null;
}

/** 按顶层逗号切分实参（忽略括号内与字符串内的逗号）。 */
function splitArgs(callText) {
  const parts = [];
  let depth = 0;
  let quote = null;
  let cur = "";
  for (let i = 0; i < callText.length; i++) {
    const c = callText[i];
    if (quote) {
      cur += c;
      if (c === "\\") cur += callText[++i] ?? "";
      else if (c === quote) quote = null;
      continue;
    }
    if (c === '"' || c === "'" || c === "`") {
      quote = c;
      cur += c;
      continue;
    }
    if (c === "(" || c === "[" || c === "{") depth++;
    else if (c === ")" || c === "]" || c === "}") depth--;
    if (c === "," && depth === 0) {
      parts.push(cur);
      cur = "";
      continue;
    }
    cur += c;
  }
  if (cur.trim()) parts.push(cur);
  return parts.map((p) => p.trim());
}

function lineOf(src, idx) {
  return src.slice(0, idx).split(/\r?\n/).length;
}

const failures = [];
let callSites = 0;

for (const file of listTsFiles(join(pkgRoot, "src")).sort()) {
  const src = readFileSync(file, "utf8");
  // `const cache = ensureCachePaths(...)` / `= resolveCacheRoot()` —— 可信缓存根句柄。
  const cacheIds = new Set();
  for (const m of src.matchAll(/(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*[^;\n]*(?:ensureCachePaths|resolveCacheRoot)\s*\(/g)) {
    cacheIds.add(m[1]);
    cacheIds.add(`${m[1]}.root`);
  }
  const rel = relative(pkgRoot, file).split(sep).join("/");

  const re = /\brunJava\s*\(/g;
  let m;
  while ((m = re.exec(src))) {
    if (/\bfunction\s*\*?\s*$/.test(src.slice(Math.max(0, m.index - 40), m.index))) continue;
    const openIdx = src.indexOf("(", m.index);
    const callText = extractCall(src, openIdx);
    callSites++;
    const where = `${rel}:${lineOf(src, m.index)}`;
    if (callText === null) {
      failures.push(`${where} runJava 调用解析失败（括号/引号不平衡？）`);
      continue;
    }
    const args = splitArgs(callText);
    const optsArg = args.length >= 2 ? args[args.length - 1] : "";
    if (!/^\{.*\}$/s.test(optsArg)) {
      failures.push(`${where} runJava 未传 opts 对象：缺省 cwd = 用户仓库会成为 Java 工具的落盘目录`);
      continue;
    }
    const cwdMatch = optsArg.match(/(^|[,{\s])cwd\s*:\s*([^,}]+)/);
    if (!cwdMatch) {
      failures.push(`${where} runJava 的 opts 里没有 cwd：见本文件头注释（实测仓库根被写出 --only=net/ 目录树）`);
      continue;
    }
    const cwdExpr = cwdMatch[2].trim();
    const rooted =
      /ensureCachePaths\s*\(/.test(cwdExpr) ||
      [...cacheIds].some((id) => new RegExp(`(^|[^\\w$.])${id.replace(/\./g, "\\.")}(?![\\w$])`).test(cwdExpr));
    if (!rooted) {
      failures.push(`${where} runJava 的 cwd=${cwdExpr} 不源自缓存根（ensureCachePaths/resolveCacheRoot）→ 可能落在用户仓库`);
    }
    if (/process\.cwd\s*\(/.test(cwdExpr)) {
      failures.push(`${where} runJava 的 cwd 直接用 process.cwd() = 用户仓库`);
    }
  }
}

// ── 3) remapperCli 的映射参数必须来自 ensureYarnTiny / ensureMojmapTiny ──────
// 血案：yarn 分支曾把 mappings/yarn-<ver>.jar 直接当 <mappings> 交给 tiny-remapper，
// mapping-io 只回一句 "invalid/unsupported mapping format"；模组 remap 还会把失败吞成
// 「降级反编译混淆 jar」这种看着成功的错结果。解包/转换函数是唯一的正确来源。
const TINY_SOURCE_FNS = /(?:^|[^\w$.])(?:ensureYarnTiny|ensureMojmapTiny)\s*\(/;
let remapSites = 0;

for (const file of listTsFiles(join(pkgRoot, "src")).sort()) {
  const src = readFileSync(file, "utf8");
  const rel = relative(pkgRoot, file).split(sep).join("/");
  // 本文件里「被证明产出 .tiny」的变量名（含 `x = await ensureYarnTiny(...)` 这种先声明后赋值）
  const tinyNames = new Set();
  for (const m of src.matchAll(/(?:const|let|var)\s+([A-Za-z_$][\w$]*)[^=]*=[^;\n]*(?:await\s+)?(ensureYarnTiny|ensureMojmapTiny)\s*\(/g)) {
    tinyNames.add(m[1]);
  }
  for (const m of src.matchAll(/([A-Za-z_$][\w$]*)\s*=\s*(?:await\s+)?(ensureYarnTiny|ensureMojmapTiny)\s*\(/g)) {
    tinyNames.add(m[1]);
  }
  for (const m of src.matchAll(/\bremapperCli\s*\(/g)) {
    if (/\bfunction\s*\*?\s*$/.test(src.slice(Math.max(0, m.index - 40), m.index))) continue;
    const openIdx = src.indexOf("(", m.index);
    const callText = extractCall(src, openIdx);
    remapSites++;
    const where = `${rel}:${lineOf(src, m.index)}`;
    if (callText === null) {
      failures.push(`${where} remapperCli 调用解析失败（括号/引号不平衡？）`);
      continue;
    }
    const args = splitArgs(callText);
    if (args.length < 6) {
      failures.push(`${where} remapperCli 参数不足 6 个（<mappings> 在第 4 位）：${args.length}`);
      continue;
    }
    const mapArg = args[3];
    if (TINY_SOURCE_FNS.test(mapArg)) continue; // 直接内联调用
    const name = mapArg.match(/([A-Za-z_$][\w$]*)$/)?.[1] ?? "";
    if (!tinyNames.has(name)) {
      failures.push(
        `${where} remapperCli 的 <mappings>=${mapArg} 不是 ensureYarnTiny/ensureMojmapTiny 的产物` +
          `（本文件已证明的只有：${[...tinyNames].join(", ") || "无"}）→ tiny-remapper 会当成非法映射格式`,
      );
    }
  }
}
if (remapSites === 0) {
  failures.push("一个 remapperCli 调用点都没扫到 —— 正则或函数名变了，本项检查已失效");
}

// ── 工作树指纹：argv token 被当成输出路径 ────────────────────────────────────
const st = testPkg ? null : spawnSync("git", ["status", "--porcelain"], { cwd: repoRoot, encoding: "utf8" });
if (st && st.status === 0) {
  const stray = [];
  for (const line of (st.stdout || "").split(/\r?\n/)) {
    if (!/^\?\?/.test(line)) continue;
    const p = line.slice(2).trim().replace(/^"|"$/g, "");
    if (!p) continue;
    const base = p.replace(/[\\/]+$/, "").split(/[\\/]/).pop() ?? "";
    if (base.startsWith("--")) stray.push(p);
  }
  for (const p of stray) {
    failures.push(
      `仓库里有未跟踪的 \`--\` 开头路径 ${p}：命令行参数被外部工具当成输出路径 = 子进程 cwd 没关进缓存目录。确认是工具垃圾后删除（不要往 .gitignore 里加 --* 之类的兜底规则）。`,
    );
  }
} else if (st) {
  console.log("  warn: git status 不可用，跳过工作树 -- 指纹检查");
}

if (failures.length) {
  console.error(
    `assert-java-spawn-cwd: ${failures.length} 个问题（runJava 调用点 ${callSites} 个 / remapperCli 调用点 ${remapSites} 个）`,
  );
  for (const f of failures) console.error(`  ${f}`);
  process.exit(1);
}
console.log(
  `assert-java-spawn-cwd: ok (runJava 调用点 ${callSites} 个，全部显式 cwd 到缓存根 / remapperCli 调用点 ${remapSites} 个，映射参数全部来自 ensureYarnTiny+ensureMojmapTiny + 工作树无 \`--\` 垃圾)`,
);
