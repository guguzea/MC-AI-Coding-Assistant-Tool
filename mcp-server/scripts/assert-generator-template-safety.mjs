#!/usr/bin/env node
/**
 * assert-generator-template-safety —— **吐 Java 的生成器**必须能通过 TypeScript 语法检查。
 *
 * ## 这道门是怎么长成现在这样的（首版是错的，值得记）
 * **背景自伤（2026-10-15，两次）**：`playtest-server-driver.ts` 的 **Java 模板体**里我写了反引号
 * （在注释里写 `` `stop` ``）⇒ 反引号**终止了 TS 模板字面量**，整个模块语法崩：
 * ```
 * error TS1005: ';' expected        （两处）
 * 连带：javac「reached end of file while parsing」
 * ```
 * 而且**我是在 `npm run build` 已经报错的情况下把带错的 dist 继续用下去**的。
 *
 * **首版判据（已废弃，错的）**：正则找「成对的 `\`word\`` 且前面不是 `$`」。
 * 实测扫出 **73 处**，逐条看**全是 TS 注释里的 markdown 反引号**（注释里写反引号**完全合法**）
 * ⇒ **假阳性机器**。根因是我当初的判断错了：**反引号在 TS 里是否危险，取决于它在不在模板字面量内，
 * 而这一点在词法上无法与"闭定界符"区分** —— 只有**解析器**知道。
 *
 * **现判据（对的）**：**用编译器本身**。对受守护的模块跑 `tsc --noEmit`：
 *   - 语法错（`TS1xxx`）⇒ 判红，并把**编译器原文**给出来；
 *   - 其中命中 `TS1005` 时额外提示"很可能是模板体里写了反引号"（这只是**提示**，判红依据始终是编译器）。
 *
 * ⚠ **为什么必须"不依赖 dist"**：这类缺陷的表现就是"dist 是坏的/旧的"。
 * 若本门要先构建再检查，它就**恰好在需要它的时刻跑不了**。`tsc --noEmit` 只读 `src`。
 *
 * 退出码：0 = 通过（或缺件降级）；1 = 编译器报错；2 = `--require` 且缺 tsc。
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const MCP = resolve(HERE, "..");
const REQUIRE = process.argv.includes("--require");
const SELFTEST = process.argv.includes("--selftest");

/** 被守护的模块：**吐 Java 源码**的生成器（它们的模板体最容易被写进反引号）。加模块就往这里加。 */
export const GUARDED = [
  "src/generators/playtest-server-driver.ts",
  "src/generators/paper-plugin.ts",
];

/** 找 tsc：优先 `node_modules/typescript/bin/tsc`，退回 `npx`。 */
function findTsc() {
  const local = join(MCP, "node_modules", "typescript", "bin", "tsc");
  if (existsSync(local)) return { cmd: process.execPath, args: [local] };
  return null;
}

/**
 * 跑一次 `tsc --noEmit`，返回 {code, out}。
 *
 * ⚠ **两种跑法必须分开**（首版混用了，踩到假错）：
 *  - **给了具体文件**（投毒自证用）：`tsc --noEmit <files>`。⚠ 这**绕过 `tsconfig.json`**
 *    ⇒ `target`/`lib`/`downlevelIteration` 都不是项目设定，会报**假错**
 *    （实测：对真模块这么跑报出 `src/utils/project-files.ts(496,14): error TS2802`，
 *     而 `npm run build` 是 0 错）。所以**只在投毒时**这么用，且那里只关心"有没有语法错"。
 *  - **没给文件**（主流程）：走 **项目 tsconfig**（`-p tsconfig.json --noEmit`）—— 与
 *    `npm run build` 同一套编译设定，**不产生假错**。
 */
export function runTsc(tsc, files, cwd = MCP) {
  const args = files && files.length
    ? [...tsc.args, "--noEmit", "--skipLibCheck", ...files]
    : [...tsc.args, "-p", join(cwd, "tsconfig.json"), "--noEmit"];
  const r = spawnSync(tsc.cmd, args, { cwd, encoding: "utf8", maxBuffer: 256 * 1024 * 1024 });
  return { code: r.status, out: (r.stdout || "") + (r.stderr || "") };
}

// ── 投毒自证：造一个"模板体里写反引号"的 TS，编译器必须报出来 ──────────────────
if (SELFTEST) {
  const tsc = findTsc();
  if (!tsc) {
    console.log("⚠ 找不到 tsc ⇒ 本次**未验证**（不是通过）");
    process.exit(REQUIRE ? 2 : 0);
  }
  const tmp = mkdtempSync(join(tmpdir(), "gen-tsc-"));
  try {
    const bad = join(tmp, "bad.ts");
    writeFileSync(
      bad,
      [
        "export function f(): string {",
        "  const verb = 'stop';",
        "  return `package x;",
        "    // 反面例子：" + String.fromCharCode(96) + "stop" + String.fromCharCode(96) + " 会终止模板字面量",
        "  `;",
        "}",
        "",
      ].join("\n"),
      "utf8",
    );
    const good = join(tmp, "good.ts");
    writeFileSync(good, ["export function g(name: string): string {", "  return `package x;", "  // " + "${name}" + " 是合法插值", "  `;", "}", ""].join("\n"), "utf8");

    const rBad = runTsc(tsc, [bad], tmp);
    const rGood = runTsc(tsc, [good], tmp);
    const ok1 = rBad.code !== 0 && /TS1\d{3}|error/i.test(rBad.out);
    const ok2 = rGood.code === 0;
    console.log(`  ${ok1 ? "✅" : "❌"} 投毒① 模板体里的反引号 → 编译器应报错（rc=${rBad.code}）`);
    console.log(`  ${ok2 ? "✅" : "❌"} 对照② 合法插值应通过（rc=${rGood.code}）`);
    const pass = ok1 && ok2;
    console.log(pass ? "投毒自证：1/1 必红 + 1 例对照必绿 —— 门是活的" : "投毒自证失败");
    process.exit(pass ? 0 : 1);
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

// ── 主流程：对受守护模块跑编译器 ───────────────────────────────────────────────
const tsc = findTsc();
if (!tsc) {
  if (REQUIRE) {
    console.log("❌ --require：找不到 `node_modules/typescript/bin/tsc`");
    process.exit(2);
  }
  console.log("⚠ 找不到 tsc ⇒ 本次**未验证**语法（不是通过）；强口径请加 --require");
  process.exit(0);
}

const present = GUARDED.map((f) => join(MCP, f)).filter((p) => existsSync(p));
if (present.length === 0) {
  console.log("⚠ 受守护的生成器模块一个都不在 ⇒ 本次**未验证**，不是通过");
  process.exit(0);
}

// 主流程走**项目 tsconfig**：不产生假错，且与 npm run build 同一套设定。
const { code, out } = runTsc(tsc);
if (code === 0) {
  console.log(`assert-generator-template-safety: ok（tsc --noEmit 对 ${present.length} 个生成器模块零错）`);
  process.exit(0);
}

const errs = out.split(/\r?\n/).filter((l) => /error TS\d+/.test(l));
console.log(`assert-generator-template-safety: 编译器报 ${errs.length || "若干"} 条`);
for (const l of errs.slice(0, 12)) console.log("  ✗ " + l.trim().slice(0, 180));
if (errs.some((l) => /TS1005/.test(l))) {
  console.log("\n⚠ 出现 TS1005 —— **很可能**是 Java 模板体里写了反引号（会把模板字面量提前终止）。");
  console.log("  处方：Java 正文里一律不出现反引号；要点名某个 verb 就用「」或直接写名字。");
}
if (out.trim() && errs.length === 0) console.log(out.split(/\r?\n/).slice(0, 12).join("\n"));
process.exit(1);
