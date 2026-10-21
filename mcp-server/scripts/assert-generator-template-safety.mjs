#!/usr/bin/env node
/**
 * assert-generator-template-safety —— **吐 Java 的生成器**必须能通过 TypeScript 语法检查，
 * 且**受守护模块必须真的落在编译器的扫描面内**。
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
 * **现判据（对的）**：**用编译器本身**。主流程跑 `tsc -p tsconfig.json --noEmit`：
 *   - 语法错（`TS1xxx`）⇒ 判红，并把**编译器原文**给出来；
 *   - 其中命中 `TS1005` 时额外提示"很可能是模板体里写了反引号"（这只是**提示**，判红依据始终是编译器）。
 *
 * ⚠ **为什么必须"不依赖 dist"**：这类缺陷的表现就是"dist 是坏的/旧的"。
 * 若本门要先构建再检查，它就**恰好在需要它的时刻跑不了**。`tsc --noEmit` 只读 `src`。
 *
 * ## 2026-10-20 修的三个真实缺陷（审查 §四 #15/#16/#17 长期漏检的根因在此）
 *
 * **缺陷 1（最要命）：`GUARDED` 被当成"覆盖清单"读，而它从来不是。**
 * 主流程跑的是**整个项目 tsconfig**，而 `tsconfig.json` 的 `include` 写的是 `src/` 下全量（两星号 + 斜杠 + 星号，此处不照抄，免得提前闭合本注释）
 * ⇒ `src/datagen/*.ts` **一直**在被编译。所以"datagen 不在 GUARDED 里"**不等于**"没被查"
 * （实测：往 `fabric.ts` 注入语法错，本门当场判红 277 条）。
 * 但反过来，这就没人**钉住**"include 必须继续覆盖它们"：把 include 改成某个子集，
 * 本门会**静默变窄**而且照样打绿勾。现在补了 `assertGuardedInScope()`：
 * `GUARDED` 里每个模块都必须落在 tsconfig `include` 的根下，否则判红。
 *
 * **缺陷 2：ok 文案谎报范围。** 原文写「对 N 个生成器模块零错」，
 * 而实际被编译的是 `src/` 下全量 —— 读起来像"只查了这 N 个"。
 * 现改为同时打印**真实扫描面**（tsconfig include）与受守护清单。
 *
 * **缺陷 3：缺件静默通过 + 自证只有 1 臂。**
 * `--require` 下缺 tsc 走 rc=2，但**受守护模块全不在**时无条件 rc=0（未验证当通过）。
 * 现 `--require` 下同样 fail-closed。自证从「1 投毒 + 1 对照」扩到 5 臂，
 * 其中两臂专钉**扫描面**（include 内必红 / include 外必绿 —— 后者证明前者不是恒红装饰）。
 *
 * ## ⚠ 本门的能力天花板（别指望它抓下面这类）
 * 它只证明**模板在 TS 层语法合法**。模板**内容**对不对（包名写错版本、方法名在该版不存在、
 * 生成的 Java 编不过）**它看不见** —— §四 #16（1.21.4+ provider 包名）、
 * #17（26.1 `registerModels`）正是这类。抓它们要靠：
 * ① 生成器单测跑真产物 + javac；② `assert-playtest-*-compiles` 那样的真构件编译腿。
 *
 * 退出码：0 = 通过（或缺件降级）；1 = 编译器报错 / 受守护模块脱离扫描面；2 = `--require` 且缺件。
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const MCP = resolve(HERE, "..");
const REQUIRE = process.argv.includes("--require");
const SELFTEST = process.argv.includes("--selftest");

/**
 * 受守护的模块：**模板体会吐出 Java 源码**的生成器。
 *
 * ⚠ **这不是覆盖清单**（覆盖面 = `tsconfig.json` 的 `include`，见文件头「缺陷 1」）。
 * 它的用处是两张：
 *   ① `assertGuardedInScope()` 拿它钉住「这些模块必须仍在编译扫描面内」；
 *   ② 缺件时的降级话术要能点名。
 * 所以加模块仍然要往这里加 —— 但理由不是"不加就查不到"，而是"不加就没人钉它还在面内"。
 */
export const GUARDED = [
  "src/generators/playtest-server-driver.ts",
  "src/generators/paper-plugin.ts",
  // 2026-10-20 补：datagen 同样吐 Java 模板体，且 §四 #15/#16/#17 三条缺陷都出在这里。
  // 它们本来就在 tsconfig 扫描面内（实测注入语法错会被抓），登记进来是为了让「面被收窄」有信号。
  "src/datagen/fabric.ts",
  "src/datagen/neoforge-26.1.ts",
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
 *  - **没给文件**（主流程 / 扫描面自证）：走 **项目 tsconfig**（`-p tsconfig.json --noEmit`）——
 *    与 `npm run build` 同一套编译设定，**不产生假错**。
 */
export function runTsc(tsc, files, cwd = MCP) {
  const args = files && files.length
    ? [...tsc.args, "--noEmit", "--skipLibCheck", ...files]
    : [...tsc.args, "-p", join(cwd, "tsconfig.json"), "--noEmit"];
  const r = spawnSync(tsc.cmd, args, { cwd, encoding: "utf8", maxBuffer: 256 * 1024 * 1024 });
  return { code: r.status, out: (r.stdout || "") + (r.stderr || "") };
}

/** 读 tsconfig 的 include 根（`src/` 下全量 ⇒ 根 = `src`）。读不到/没有 include ⇒ null。 */
function includeRoots() {
  try {
    const raw = readFileSync(join(MCP, "tsconfig.json"), "utf8")
      .split("\n")
      .filter((l) => !/^\s*\/\//.test(l))
      .join("\n");
    const cfg = JSON.parse(raw);
    const inc = Array.isArray(cfg.include) ? cfg.include : null;
    if (!inc) return null;
    return inc.map((g) => g.replace(/\/\*\*.*$/, "").replace(/\/\*$/, "")).filter(Boolean);
  } catch {
    return null;
  }
}

/**
 * 受守护模块必须仍在 tsconfig `include` 的根下。
 * 返回 {checked, stray:[{file, roots}]}。roots=null 表示 tsconfig 读不到（调用方按"未验证"处理）。
 */
export function assertGuardedInScope() {
  const roots = includeRoots();
  if (!roots) return { checked: 0, stray: [], roots: null };
  const stray = [];
  let checked = 0;
  for (const rel of GUARDED) {
    if (!existsSync(join(MCP, rel))) continue;
    checked += 1;
    const under = roots.some((root) => {
      const r = root.replace(/\\/g, "/").replace(/\/$/, "");
      return rel.replace(/\\/g, "/").startsWith(r + "/");
    });
    if (!under) stray.push({ file: rel, roots });
  }
  return { checked, stray, roots };
}

// ── 投毒自证：5 臂（2 语法投毒 + 1 语法对照 + 2 扫描面臂）────────────────────
if (SELFTEST) {
  const tsc = findTsc();
  if (!tsc) {
    console.log("⚠ 找不到 tsc ⇒ 本次**未验证**（不是通过）");
    process.exit(REQUIRE ? 2 : 0);
  }
  const tmp = mkdtempSync(join(tmpdir(), "gen-tsc-"));
  const BT = String.fromCharCode(96); // 反引号：源码里不直接写，免得本文件自身被误读
  const results = [];
  const arm = (name, kind, ok, detail) => {
    results.push({ name, kind, ok, detail });
    console.log(`  ${ok ? "✅" : "❌"} ${kind} ${name}${detail ? "（" + detail + "）" : ""}`);
  };
  try {
    // ①② 语法投毒（用项目 tsconfig 跑，所以不会假错）
    const p1 = join(tmp, "src", "poison1.ts");
    mkdirSync(dirname(p1), { recursive: true });
    writeFileSync(
      p1,
      [
        "export function f(): string {",
        "  const verb = 'stop';",
        "  return `package x;",
        "    // 反面例子：" + BT + "stop" + BT + " 会终止模板字面量",
        "  `;",
        "}",
        "",
      ].join("\n"),
      "utf8",
    );
    writeFileSync(
      join(tmp, "src", "poison2.ts"),
      ["export function g(): string {", "  return `package x;", "  // 没有闭合定界符", ""].join("\n"),
      "utf8",
    );
    // ③ 语法对照（合法插值 + 合法注释里的转义反引号）
    writeFileSync(
      join(tmp, "src", "control.ts"),
      [
        "export function h(name: string): string {",
        "  return `package x;",
        "  // ${name} 是合法插值",
        "  `;",
        "}",
        "",
      ].join("\n"),
      "utf8",
    );
    writeFileSync(
      join(tmp, "tsconfig.json"),
      JSON.stringify(
        {
          compilerOptions: { target: "ES2022", module: "NodeNext", moduleResolution: "NodeNext", strict: true, skipLibCheck: true, noEmit: true },
          include: ["src/**/*"],
        },
        null,
        2,
      ),
      "utf8",
    );

    const rBad = runTsc(tsc, null, tmp);
    const hasSyntax = /error TS1\d{3}/.test(rBad.out);
    arm("模板体里的反引号 / 未闭合模板", "投毒①", rBad.code !== 0 && hasSyntax, `rc=${rBad.code}`);

    // ③ 对照：先删掉两个毒件，只留 control
    rmSync(join(tmp, "src", "poison1.ts"), { force: true });
    rmSync(join(tmp, "src", "poison2.ts"), { force: true });
    const rGood = runTsc(tsc, null, tmp);
    arm("合法插值 + 合法注释", "对照②", rGood.code === 0, `rc=${rGood.code}`);

    // ④ 扫描面臂：include **内**放语法错 ⇒ 必红（证明 datagen 这类模块确实在被查）
    const p3 = join(tmp, "src", "datagen", "fake-gen.ts");
    mkdirSync(dirname(p3), { recursive: true });
    writeFileSync(p3, ["export const x: string = `oops;", ""].join("\n"), "utf8");
    const rIn = runTsc(tsc, null, tmp);
    arm("include 内的语法错必须被查出来", "扫描面④", rIn.code !== 0 && /error TS1\d{3}/.test(rIn.out), `rc=${rIn.code}`);

    // ⑤ 反向臂：把错挪到 include **外** ⇒ 必绿（证明 ④ 不是恒红装饰，include 真的在起作用）
    mkdirSync(join(tmp, "outside"), { recursive: true });
    writeFileSync(join(tmp, "outside", "bad.ts"), ["export const y: string = `oops;", ""].join("\n"), "utf8");
    rmSync(p3, { force: true });
    const rOut = runTsc(tsc, null, tmp);
    arm("include 外的语法错不被查（证明④非恒红）", "对照⑤", rOut.code === 0, `rc=${rOut.code}`);

    // ⑥ 真实面正对照：真项目的受守护模块必须仍在扫描面内
    const scope = assertGuardedInScope();
    const scopeOk = scope.roots !== null && scope.stray.length === 0 && scope.checked > 0;
    arm(
      "受守护模块仍在 tsconfig include 内",
      "真实面⑥",
      scopeOk,
      scope.roots === null
        ? "tsconfig 读不到"
        : scope.stray.length
          ? "脱离：" + scope.stray.map((s) => s.file).join(", ")
          : `${scope.checked} 个 / include=${scope.roots.join(",")}`,
    );

    const poison = results.filter((r) => r.kind.startsWith("投毒")).length;
    const assertArms = results.filter((r) => r.kind.startsWith("扫描面")).length;
    const control = results.filter((r) => r.kind.startsWith("对照") || r.kind.startsWith("真实面")).length;
    const bad = results.filter((r) => !r.ok);
    const allOk = bad.length === 0;
    console.log(
      `assert-generator-template-safety(selftest): ${results.length} 例（${poison} 投毒必红 + ${assertArms} 扫描面断言 + ${control} 正对照）`,
    );
    if (!allOk) {
      console.error(`assert-generator-template-safety(selftest): ${bad.length} 例失效`);
      for (const b of bad) console.error(`  RED ${b.kind} ${b.name}`);
    } else {
      console.log("assert-generator-template-safety(selftest): OK（编译器 + 扫描面 双判据都活着）");
    }
    process.exit(allOk ? 0 : 1);
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
  // 缺陷 3：原文无条件 exit 0（未验证当通过）。--require 下必须 fail-closed。
  if (REQUIRE) {
    console.log("❌ --require：受守护的生成器模块一个都不在（未验证不能当通过）");
    process.exit(2);
  }
  console.log("⚠ 受守护的生成器模块一个都不在 ⇒ 本次**未验证**，不是通过");
  process.exit(0);
}

// 扫描面先行：受守护模块脱离 tsconfig include ⇒ 编译器根本查不到它，必须先判红。
const scope = assertGuardedInScope();
if (scope.roots !== null && scope.stray.length > 0) {
  console.log("assert-generator-template-safety: 受守护模块脱离编译扫描面（本门查不到它们）");
  for (const s of scope.stray) console.log(`  ✗ ${s.file} —— 不在 tsconfig include 根（${s.roots.join(", ")}）下`);
  console.log("\n处方：把该模块移回 src/，或把它的根加进 tsconfig.json 的 include。");
  process.exit(1);
}

// 主流程走**项目 tsconfig**：不产生假错，且与 npm run build 同一套设定。
const { code, out } = runTsc(tsc);
const scopeTxt = scope.roots === null ? "tsconfig include 读不到" : `扫描面 include=[${scope.roots.join(", ")}]`;
if (code === 0) {
  // 缺陷 2：原文只报「N 个生成器模块零错」，读起来像"只查了这 N 个"。现在两边都报。
  console.log(
    `assert-generator-template-safety: ok（tsc --noEmit 零错 · ${scopeTxt} · 受守护登记 ${present.length} 个，全部在面内）`,
  );
  process.exit(0);
}

const errs = out.split(/\r?\n/).filter((l) => /error TS\d+/.test(l));
console.log(`assert-generator-template-safety: 编译器报 ${errs.length || "若干"} 条（${scopeTxt}）`);
for (const l of errs.slice(0, 12)) console.log("  ✗ " + l.trim().slice(0, 180));
if (errs.some((l) => /TS1005/.test(l))) {
  console.log("\n⚠ 出现 TS1005 —— **很可能**是 Java 模板体里写了反引号（会把模板字面量提前终止）。");
  console.log("  处方：Java 正文里一律不出现反引号；要点名某个 verb 就用「」或直接写名字。");
}
if (out.trim() && errs.length === 0) console.log(out.split(/\r?\n/).slice(0, 12).join("\n"));
process.exit(1);
