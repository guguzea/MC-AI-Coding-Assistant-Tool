#!/usr/bin/env node
/**
 * assert-script-write-guard.mjs —— S20 的**第 8 步链**入口（2026-09-21 链位收口）。
 *
 * 为什么需要这个文件：
 *   根 `AGENTS.md:387` 规定「改了 `mcp-server/scripts/**` 或 `scripts/**` 后，收口**必须**跑第 8 步
 *   （`cd mcp-server && node test-scripts.mjs`）—— `npm test` 里抽跑几道门**不能**代替它」。
 *   但 S20（管 scripts 写盘的形状门）原先只内联在 `test-core.mjs` 里，即挂在 `npm test` 那条链上：
 *   于是「改 scripts 的人按规矩跑 test-scripts」**永远碰不到 S20** ——
 *   两个已提交的门（assert-skill-yarn-attest.mjs / assert-skill-mappings-key.mjs）就是这样
 *   静默红着进的库（它们真跑后 test-core 报出 19 条裸写盘）。
 *
 *   判据本身仍是**同一份**（`_lib/script-write-guard-check.mjs`，test-core 与本门共用），
 *   本门只是把它搬上正确的链，没有新增/放宽任何判据。
 *
 * 用法：
 *   node scripts/assert-script-write-guard.mjs            # 真跑（扫全仓脚本，0 违规才 rc=0）
 *   node scripts/assert-script-write-guard.mjs --selftest # 判据活性自证（畸形输入必须当场红）
 */
import assert from "node:assert/strict";
import {
  SCRIPT_WRITE_GUARD_REL,
  SCRIPT_WRITE_GUARD_SCAN_DIRS,
  SCRIPT_WRITE_GUARD_SCAN_ERRORS,
  SCRIPT_WRITE_GUARD_FILES,
  SCRIPT_WRITE_GUARD_NON_WRITERS,
  SCRIPT_WRITE_GUARD_DEBT,
  SCRIPT_WRITE_GUARD_IGNORED,
  checkGuardScopeCoverage,
  diffScriptWriteGuard,
  dropGitIgnored,
  listWriteGuardScope,
  scriptRequiresGuard,
  scriptWritesFiles,
} from "./_lib/script-write-guard-check.mjs";

/**
 * 投毒用的原语名刻意**拆开拼**：本文件自身在 S20 扫描面内（`mcp-server/scripts/**`），
 * 若源码里直接出现 `writeFileSync(` 字面，本门会被自己判成「直接调用写盘原语」。
 * 拆开后源码文本不含该形，而运行时拼出的字符串照样能喂给判据 —— 自证有效且不自伤。
 */
const W = "writeFile" + "Sync";
const M = "mkdir" + "Sync";
const RM = "rm" + "Sync";
/** 异步族同理拆开：豁免只覆盖旧表 `*Sync` 原语，异步原语字面在豁免文件里也照样算问题。 */
const AWRITE = "write" + "File";

function runGate() {
  const files = listWriteGuardScope();
  assert.deepEqual(
    SCRIPT_WRITE_GUARD_SCAN_ERRORS,
    [],
    `扫描根缺失即清单全体失效：\n${SCRIPT_WRITE_GUARD_SCAN_ERRORS.join("\n")}`,
  );
  // 扫描面 / 清单覆盖自证（纯函数，与 test-core 的 S20 漏斗共用同一份）：扫描根被回退、
  // 点名脚本消失、或**豁免条目变成僵尸**（指向盘上已不存在的文件）都必须当场红，
  // 否则本门静默变成空转 —— 扫描面走盘，条目一删锚就静默失效。
  // ignored 的处置在 lib 内部（`checkGuardScopeCoverage` 认盘上存在的 ignored 条目），
  // 两个消费方因此不必各自记得同一件事。
  assert.deepEqual(checkGuardScopeCoverage(files), [], "扫描面 / 清单覆盖自证失败");
  const { problems, stats } = diffScriptWriteGuard(files);
  if (problems.length) {
    console.error("assert-script-write-guard: 脚本未收口（写盘必须走 write-guard 的 emit / emitCopy）：");
    for (const p of problems) console.error(`  ${p}`);
    console.error(
      "\n两种正当出路：① 改道 `scripts/_lib/write-guard.mjs` 的 emit / emitCopy（默认 dry-run，--write 才落盘）；" +
        "② 若确为只写 cache / OS tmpdir / gitignore 产物，登记进 NON_WRITERS 并附**依据正则**（依据一断即再红）。",
    );
    process.exit(1);
  }
  const required = files.filter((f) => scriptRequiresGuard(f.rel, f.text)).length;
  console.log(
    `assert-script-write-guard: ok（扫描 ${SCRIPT_WRITE_GUARD_SCAN_DIRS.join(" + ")} 共 ${stats.scanned} 个文件` +
      // 跳过数必须念出来：「过滤逻辑根本没跑」与「确实没有 ignored 文件」都显示 0 的话，
      // 这条链就再也分不清范围缩小是正常还是失能。
      `；git 判为 ignored 已跳过 ${SCRIPT_WRITE_GUARD_IGNORED.count}` +
      `；` +
      `要求 guard ${required}；guard 引用 ${stats.guardAdopted}；emit 调用点 ${stats.emitCallSites}；` +
      `写盘原语 ${stats.primitiveHits}（在册豁免 ${stats.exemptPrimitiveHits}、范围外违规 ${stats.outsideGuardHits}）；` +
      `清单：非写盘 ${SCRIPT_WRITE_GUARD_NON_WRITERS.size} + 待收口债务 ${SCRIPT_WRITE_GUARD_DEBT.size} + 点名已改道 ${SCRIPT_WRITE_GUARD_FILES.length}）`,
  );
}

function runSelftest() {
  const clean = { rel: "scripts/_oneoff/probe-readonly.mjs", text: 'import { emit, wantWrite } from "../_lib/write-guard.mjs";\nconst t = readFileSync(p, "utf8");\nif (wantWrite()) emit(p, t);\n' };
  const cases = [
    ["裸写盘原语", { rel: "scripts/_oneoff/poison.mjs", text: `import { ${W} } from "node:fs";\n${W}("a.json", "{}");\n` }, /直接调用 writeFileSync\(\)/],
    ["无 import 的写盘脚本", { rel: "scripts/poison-nobody.mjs", text: `import { ${W} } from "node:fs";\n${W}("x", "y");\n` }, /未 import write-guard/],
    ["裸目录原语", { rel: "scripts/_oneoff/poison-mkdir.mjs", text: `import fs from "node:fs";\nfs.${M}("d", { recursive: true });\n` }, /直接调用 mkdirSync\(\)/],
    ["裸删除原语", { rel: "scripts/_oneoff/poison-rm.mjs", text: `import { ${RM} } from "node:fs";\n${RM}(dir, { recursive: true, force: true });\n` }, /直接调用 rmSync\(\)/],
    ["异步 promise 写盘（C-3 形态）", { rel: "scripts/_oneoff/poison-async.mjs", text: `import fs from "node:fs";\nawait fs.promises.${AWRITE}(p, t);\n` }, /异步\/回调式写盘原语 writeFile\(/],
    ["豁免依据失效（摘掉闸门）", { rel: "scripts/scaffold-version.mjs", text: "const dry = true;\n" }, /在册豁免依据/],
    ["guard 自身失去 --write 判定", { rel: SCRIPT_WRITE_GUARD_REL, text: "const x = 1;\n" }, /缺 "--write" 判定/],
    ["guard 自身失去 DRYRUN 输出", { rel: SCRIPT_WRITE_GUARD_REL, text: 'const w = "--write";\nfunction assertScratch() { throw new Error("不许落在仓库内"); }\n' }, /缺 DRYRUN 输出/],
  ];
  for (const [label, file, anchor] of cases) {
    const got = diffScriptWriteGuard([file]);
    assert.ok(got.problems.length > 0, `投毒「${label}」应至少报一条问题，实际 0 条`);
    assert.ok(
      got.problems.some((p) => anchor.test(p)),
      `投毒「${label}」应命中锚点 ${anchor}，实际：\n${got.problems.join("\n")}`,
    );
  }
  // 正对照：只读脚本（读盘 + 走 emit）不得误报 —— 否则门会逼人把读盘也改道。
  const ok = diffScriptWriteGuard([clean]);
  assert.deepEqual(ok.problems, [], `只读脚本被误报：\n${ok.problems.join("\n")}`);
  assert.equal(scriptWritesFiles(clean.text), false, "只读脚本不应被判定为「能写文件」");
  assert.equal(scriptRequiresGuard(clean.rel, clean.text), true, "已在用 emit 的脚本必须仍被要求 import guard");
  // 反向腿自证（辅助 agent 2026-09-21 指出「DEBT 只能进不能出」）：豁免条目若指向盘上已不存在的
  // 文件（僵尸豁免），覆盖自证必须当场报 —— 这条腿不投毒就没人知道它还活着。
  const zombie = checkGuardScopeCoverage([{ rel: "scripts/_oneoff/probe.mjs", text: "" }]);
  assert.ok(
    zombie.some((p) => /清单条目 .* 已不在扫描范围内/.test(p)),
    `僵尸豁免必须被报，实得：${zombie.join("；")}`,
  );
  assert.ok(
    zombie.some((p) => /必须含 scripts\/_lib\/write-guard\.mjs/.test(p)),
    `扫描面缺 write-guard 本身必须被报，实得：${zombie.join("；")}`,
  );
  // ignored 过滤自己也是范围腿 ⇒ 三个失效方向都要能被打红：
  // ① 把该跳的留下（门继续为仓库外产物假红）；② 把不该跳的跳掉（真违规静默消失）；
  // ③ git 不可用时报错而不是退回全量。
  const all = ["mcp-server/scripts/x.mjs", "mcp-server/scripts/_temp/tsdist/y.js"];
  assert.deepEqual(
    dropGitIgnored(all, () => ({ status: 0, stdout: "mcp-server/scripts/_temp/tsdist/y.js\n" })),
    ["mcp-server/scripts/x.mjs"],
    "ignored 过滤没跳成 ⇒ 本地暂存产物仍会把门判红",
  );
  assert.deepEqual(
    dropGitIgnored(all, () => ({ status: 0, stdout: "mcp-server/scripts/x.mjs\n" })),
    ["mcp-server/scripts/_temp/tsdist/y.js"],
    "反证：把在册脚本判成 ignored 也必须照跳（证明这条腿真的在按输出删，而不是恒等）",
  );
  assert.deepEqual(
    dropGitIgnored(all, () => ({ status: 0, stdout: "scripts/not-in-input.mjs\n" })),
    all,
    "输出里没列过的路径不得被删 ⇒ 过滤必须只认输入全集",
  );
  assert.deepEqual(
    dropGitIgnored(all, () => ({ status: 128, stdout: "mcp-server/scripts/x.mjs\n" })),
    all,
    "git 报错时必须**不跳**（fail closed）：宁可假红，不能把真违规静默放行",
  );
  assert.deepEqual(
    dropGitIgnored(all, () => ({ status: null, stdout: "" })),
    all,
    "git 缺失（status=null）时同样不得跳",
  );
  assert.deepEqual(
    dropGitIgnored(all, () => ({ status: 1, stdout: "" })),
    all,
    "rc=1 = 全不命中，是正常答复 ⇒ 一条都不跳",
  );
  // ignored 与僵尸判据的交界：登记条目指向的文件**在盘上但被 gitignore** ⇒ 不算僵尸
  // （`mcp-server/scripts/_debug_*.mjs` 三条就是这种形状；加 ignored 过滤后它们曾被误报）。
  {
    const rel = "mcp-server/scripts/fetch-forge-javadoc.js";
    const saved = SCRIPT_WRITE_GUARD_IGNORED.rels;
    try {
      SCRIPT_WRITE_GUARD_IGNORED.rels = [rel];
      assert.ok(
        !checkGuardScopeCoverage([]).some((p) => p.includes(rel)),
        "被 gitignore 的登记条目被误判成僵尸 ⇒ 覆盖腿把「归谁判」和「在不在盘上」混成了一件事",
      );
      SCRIPT_WRITE_GUARD_IGNORED.rels = [];
      assert.ok(
        checkGuardScopeCoverage([]).some((p) => p.includes(rel)),
        "同一条目在 ignored 清空后必须重新报僵尸（证明上一条是被 ignored 放行的，不是恒绿）",
      );
    } finally {
      SCRIPT_WRITE_GUARD_IGNORED.rels = saved;
    }
  }
  console.log(
    `assert-script-write-guard: selftest OK（${cases.length} 例投毒 + 1 例正对照 + 1 例扫描面自证 + 1 例 ignored×僵尸交界 + 6 例 ignored 过滤（含 fail-closed 与反证））`,
  );
}

if (process.argv.includes("--selftest")) runSelftest();
else runGate();
