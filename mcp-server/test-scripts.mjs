import assert from "node:assert/strict";

import { parseCliArgs, compareVersions } from "./scripts/_lib/args.js";
import { parseCSV } from "./scripts/_lib/csv.js";
import { resolveLatestKey } from "./scripts/check-porting-updates.js";
import { extractChapterPaths } from "./scripts/probe-forge-versions.js";

assert.equal(parseCliArgs(["--version=1.20.1"]).flags.version, "1.20.1");
assert.equal(parseCliArgs(["--version", "1.20.1"]).flags.version, "1.20.1");
assert.equal(parseCliArgs(["--version="]).flags.versionError, "empty-value");
assert.equal(parseCliArgs(["--version"]).flags.versionError, "missing-value");
assert.ok(compareVersions("1.10.2", "1.9.4") > 0);
assert.ok(compareVersions("20.4.237", "20.2.88") > 0);
assert.equal(resolveLatestKey("neoforge", "1.20.4"), "1.20.4");
assert.equal(resolveLatestKey("neoforge", "1.20.1"), "1.20.1");

const forgeChapters = extractChapterPaths(
  '<a href="../resources/server/recipes/custom/">Custom</a><a href="/en/1.20.1/images/logo.png">Image</a>',
  "https://docs.readthedocs.net/en/1.20.1/gettingstarted/",
);
assert.ok(forgeChapters.includes("resources/server/recipes/custom"));
assert.ok(!forgeChapters.some((chapter) => chapter.includes("images")));

const parsed = parseCSV('searge,name,side,desc\nfunc_1,foo,2,"(I,Ljava/lang/String;)V"\n');
assert.deepEqual(parsed.errors, []);
assert.equal(parsed.rows[0].desc, "(I,Ljava/lang/String;)V");

const escaped = parseCSV('name,desc\nfoo,"contains ""quoted"", comma"\n');
assert.deepEqual(escaped.errors, []);
assert.equal(escaped.rows[0].desc, 'contains "quoted", comma');

const malformed = parseCSV('name,desc\nfoo,"unterminated');
assert.ok(malformed.errors.some((error) => error.includes("unterminated")));

const { hashRevision, extractScriptApiStable } = await import("./scripts/fetch-bedrock-docs.js");
assert.notEqual(hashRevision(["page-one-raw", "page-two-raw"]), hashRevision(["page-one-raw"]));
assert.equal(hashRevision(["a", "b"]), hashRevision(["a", "b"]));
assert.equal(
  extractScriptApiStable("See @minecraft/server module version 1.14.0 in the table"),
  "1.14.0",
);
assert.equal(extractScriptApiStable("<p>no versions here</p>"), null);

// ── #11 网络超时：挂起连接必须在超时后降级/报错，而不是永久挂起 ──────────
// 用本地 server 模拟 writeHead 后永不 end 的对端。**禁止访问真实外网。**
const { createServer } = await import("node:http");
const hanging = createServer((_req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  // 刻意不调用 res.end()，连接保持挂起
});
await new Promise((r) => hanging.listen(0, "127.0.0.1", r));
const hangingUrl = `http://127.0.0.1:${hanging.address().port}/hang`;

const { defaultFetch } = await import("./scripts/probe-forge-versions.js");
const { fetchPageHtml } = await import("./scripts/_lib/pipeline-helpers.mjs");

const startedAt = Date.now();
let timedOut = false;
try {
  await defaultFetch(hangingUrl, { timeoutMs: 200 });
} catch {
  timedOut = true;
}
const elapsed = Date.now() - startedAt;
assert.ok(timedOut, "defaultFetch 在挂起连接上未超时");
assert.ok(elapsed < 5_000, `defaultFetch 超时耗时异常: ${elapsed}ms`);

let htmlTimedOut = false;
try {
  const res = await fetchPageHtml(hangingUrl, { timeoutMs: 200 });
  // fetchPageHtml 也可能以非 2xx / error 形式降级返回，两者都算没挂死
  htmlTimedOut = res.status !== 200 || Boolean(res.error);
} catch {
  htmlTimedOut = true;
}
assert.ok(htmlTimedOut, "fetchPageHtml 在挂起连接上未超时/降级");

await new Promise((r) => hanging.close(r));

// ── #12 forge 1.20.4 数据版本归属断言（必须挂载，独立脚本不会被测试链执行）──
const { assertLinkForge1204, DEFAULT_DEST_DIR } = await import(
  "./scripts/assert-link-forge-1.20.4.mjs"
);
const { existsSync } = await import("node:fs");
if (existsSync(DEFAULT_DEST_DIR)) {
  assertLinkForge1204(DEFAULT_DEST_DIR);
} else {
  // 数据未生成不算失败（该目录是抓取产物），但需显式记录
  console.log("skip: forge_1.20.4 data not present");
}

// ── #13 NeoForge 生成源 ↔ 产物 manifest 一致性 ─────────────────────────────
// 背景：fix_p0_p1 计划只手工修正了「产物」data/neoforge-versions-manifest.json
// （1.21.11→21.11.x、1.20.6→20.6.x、26.1→26.1.0.x + mojmap-only），没改「生成源」
// probe-neoforge-versions.js 的 VERSION_CONFIG。任何人再跑一次全量 probe，错值就会
// 复活并覆盖修正——所以「产物对了」不等于「修好了」。
const {
  VERSION_CONFIG: NEO_CFG,
  PRIMER_CONFIG: NEO_PRIMERS,
  readPreviousVersions,
  carryUnprobedVersions,
  classifyNeoLoaderVersion,
  withNeoLoaderFields,
} = await import("./scripts/probe-neoforge-versions.js");
const { readFileSync } = await import("node:fs");
const NEO_MANIFEST = JSON.parse(
  readFileSync(new URL("../data/neoforge-versions-manifest.json", import.meta.url), "utf-8"),
);

/** NeoForge 加载器版本前两段 = MC 版本去掉前导 "1."（1.21.11 → 21.11，26.1 → 26.1）。 */
function loaderSeries(mcVersion) {
  return mcVersion.startsWith("1.") ? mcVersion.slice(2) : mcVersion;
}

function checkLoaderVersion(mcVersion, neoforgeVersion) {
  const bad = [];
  if (neoforgeVersion.includes("+")) {
    bad.push(`含 '+' 开区间：${neoforgeVersion}（probe 只验文档可用性，验不了加载器版本，禁止猜）`);
  }
  if (!/^\d+\.\d+(\.\d+)?(\.x)?$/.test(neoforgeVersion)) bad.push(`不是具体版本号或 .x 掩码：${neoforgeVersion}`);
  const series = loaderSeries(mcVersion);
  if (neoforgeVersion !== series && !neoforgeVersion.startsWith(`${series}.`)) {
    bad.push(`${neoforgeVersion} 与 MC ${mcVersion} 不同号（应以前缀 ${series}. 开头）`);
  }
  return bad;
}

// 校验规则本身必须仍然判得掉历史上真出现过的错值，不能跟着数据一起被「改对」。
assert.ok(checkLoaderVersion("1.21.11", "21.1.113+").length, "规则失效：21.1.113+ 曾是 1.21.11 的配置值");
assert.ok(checkLoaderVersion("1.20.6", "20.4.100+").length, "规则失效：20.4.100+ 曾是 1.20.6 的配置值");
assert.equal(checkLoaderVersion("1.21.1", "21.1.113").length, 0, "规则误杀：21.1.113 对 MC 1.21.1 合法");
assert.equal(checkLoaderVersion("26.1", "26.1.0.x").length, 0, "规则误杀：26.1.0.x 对 MC 26.1 合法");

/**
 * N-5：`neoforgeVersion` 一个字段历史上既写精确号又写 `.x` 掩码，消费方判不出语义。
 * 产物必须额外带**恰好一个**显式字段（`exactVersion` = 可直接落 gradle.properties 的精确钉值 /
 * `versionRange` = 版本段），且与 `neoforgeVersion` 后向兼容别名逐字相等、语义与版本串一致。
 * 别名暂不删除：`data/porting/knowledge-base/versions.json` 的 9 条 `sources.neoforge`
 * 证据指针逐字指向 `.neoforgeVersion`（test-core G5 按逐字相等判定），改指显式字段是另一波次。
 */
function checkNeoSplit(entry) {
  const bad = [];
  const hasExact = Object.prototype.hasOwnProperty.call(entry, "exactVersion");
  const hasRange = Object.prototype.hasOwnProperty.call(entry, "versionRange");
  if (hasExact === hasRange) {
    bad.push(`显式字段必须恰好一个（exactVersion=${hasExact} versionRange=${hasRange}）`);
    return bad;
  }
  const explicit = hasExact ? entry.exactVersion : entry.versionRange;
  if (String(explicit) !== String(entry.neoforgeVersion)) {
    bad.push(`别名 neoforgeVersion=${entry.neoforgeVersion} ≠ 显式字段 ${explicit}`);
  }
  const wantKind = hasExact ? "exact" : "range";
  const gotKind = classifyNeoLoaderVersion(entry.neoforgeVersion);
  if (gotKind !== wantKind) bad.push(`${entry.neoforgeVersion} 语义是 ${gotKind}，产物却标成 ${wantKind}`);
  return bad;
}

// 同 checkLoaderVersion：拆分规则本身必须先证明自己判得掉历史形态。
assert.ok(checkNeoSplit({ neoforgeVersion: "21.11.x" }).length, "规则失效：裸两义字段（11 条的历史形态）必须判红");
assert.ok(checkNeoSplit({ neoforgeVersion: "21.1.113", versionRange: "21.1.113" }).length, "规则失效：精确号被标成版本段必须判红");
assert.ok(checkNeoSplit({ neoforgeVersion: "21.1.113", exactVersion: "21.1.113", versionRange: "21.1.113" }).length, "规则失效：两个显式字段并存必须判红");
assert.ok(checkNeoSplit({ neoforgeVersion: "21.1.113", exactVersion: "21.1.114" }).length, "规则失效：别名与显式字段不同值必须判红");
assert.equal(checkNeoSplit({ neoforgeVersion: "21.1.113", exactVersion: "21.1.113" }).length, 0, "规则误杀：精确号 + exactVersion 合法");
assert.equal(checkNeoSplit({ neoforgeVersion: "26.1.0.x", versionRange: "26.1.0.x" }).length, 0, "规则误杀：.x 掩码 + versionRange 合法");

const NEO_CURATED = ["mcVersion", "neoforgeVersion", "javaVersion", "mappings", "type", "priority", "fallbackVersion", "forgeVersion"];
const neoDrift = [];
for (const cfg of NEO_CFG) {
  for (const msg of checkLoaderVersion(cfg.mcVersion, cfg.neoforgeVersion)) {
    neoDrift.push(`${cfg.version}.neoforgeVersion: ${msg}`);
  }
  const docPath = new URL(cfg.docBase).pathname;
  const wantPath = cfg.route ? `/docs/${cfg.route}/` : "/docs/";
  if (docPath !== wantPath) neoDrift.push(`${cfg.version}: docBase 路径 ${docPath} ≠ ${wantPath}（版本令牌未锚定）`);
  if (!cfg.testUrl.startsWith(cfg.docBase)) neoDrift.push(`${cfg.version}: testUrl 不在 docBase 之下`);

  const entry = NEO_MANIFEST.versions[cfg.version];
  if (!entry) {
    neoDrift.push(`manifest 缺 ${cfg.version}：生成源新增后未重跑，产物与源不同步`);
    continue;
  }
  for (const msg of checkNeoSplit(entry)) neoDrift.push(`${cfg.version}: ${msg}`);
  if (JSON.stringify(withNeoLoaderFields(entry)) !== JSON.stringify(entry)) {
    neoDrift.push(`${cfg.version}: 产物显式字段与生成源派生结果不一致（缺字段 / 多余字段 / 键序漂移，重跑 probe 会改写）`);
  }
  // 26.1 走「pinned /docs/26.1/ 404 → 未版本化 /docs/」回退：route/docBase/testUrl 由探测期改写，不参与比对。
  const probeRewritten = entry.unversionedCurrent ? ["route", "docBase", "testUrl"] : [];
  for (const key of [...NEO_CURATED, "route", "docBase", "testUrl"]) {
    if (probeRewritten.includes(key)) continue;
    if (String(cfg[key] ?? "") !== String(entry[key] ?? "")) {
      neoDrift.push(`${cfg.version}.${key}: 生成源 ${JSON.stringify(cfg[key])} ≠ 产物 ${JSON.stringify(entry[key])}`);
    }
  }
}
const seenLoader = new Map();
for (const cfg of NEO_CFG) {
  const prev = seenLoader.get(cfg.neoforgeVersion);
  if (prev) neoDrift.push(`${prev} 与 ${cfg.version} 加载器同号 ${cfg.neoforgeVersion}（不同 MC 版本不得共用）`);
  seenLoader.set(cfg.neoforgeVersion, cfg.version);
  if (cfg.fallbackVersion && !NEO_CFG.some((c) => c.version === cfg.fallbackVersion)) {
    neoDrift.push(`${cfg.version}.fallbackVersion=${cfg.fallbackVersion} 不在 VERSION_CONFIG 内`);
  }
}
for (const v of Object.keys(NEO_MANIFEST.versions)) {
  if (!NEO_CFG.some((c) => c.version === v)) {
    neoDrift.push(`manifest 有 ${v} 而生成源没有 → 全量重跑会静默丢掉该条目`);
  }
}
for (const [v, p] of Object.entries(NEO_MANIFEST.primers ?? {})) {
  const cfg = NEO_PRIMERS.find((x) => x.version === v);
  if (!cfg) {
    neoDrift.push(`manifest primer ${v} 不在 PRIMER_CONFIG → 全量重跑会丢掉`);
    continue;
  }
  for (const key of ["url", "from", "to"]) {
    if (String(cfg[key]) !== String(p[key])) neoDrift.push(`primer ${v}.${key}: 生成源 ${cfg[key]} ≠ 产物 ${p[key]}`);
  }
}
assert.deepEqual(neoDrift, [], `probe-neoforge-versions 生成源与 manifest 漂移：\n  ${neoDrift.join("\n  ")}`);

// 单版本重跑必须保留它没探测过的条目；全量重跑以生成源为准，不继承 stale 条目。
const oneProbe = NEO_CFG.filter((c) => c.version === "26.1");
const merged = carryUnprobedVersions(NEO_MANIFEST.versions, oneProbe, { "26.1": { available: true } });
assert.equal(Object.keys(merged).length, Object.keys(NEO_MANIFEST.versions).length, "--version=<v> 重跑不得减少 manifest 条目");
assert.deepEqual(merged["1.20.4"], NEO_MANIFEST.versions["1.20.4"], "未探测条目必须原样带过去");
assert.equal(merged["26.1"].available, true, "被探测的条目必须换成新结果");
assert.deepEqual(Object.keys(carryUnprobedVersions(null, NEO_CFG, { "26.1": {} })), ["26.1"], "全量重跑不得继承 stale 条目");
assert.equal(readPreviousVersions(new URL("../data/__no_such_manifest__.json", import.meta.url)), null, "缺失 manifest → null（不继承）");

// ── #14 PowerShell gate 自检：证明它真的会失败（不投毒仓库文件）─────────────
// 背景：本轮我自己引入过一次同类缺陷——给 scripts/sync-skills.ps1 加中文注释后，
// Windows PowerShell 5.1 按 GBK 解码无 BOM 文件，多字节尾字节和紧跟的 ASCII 引号配成
// 一对被吞掉 → 14 个 AST 解析错误，而所有按 UTF-8 读文本的检查照常通过。会不会出错取决
// 于「引号之前累计字节数的奇偶」（"同" 炸、"同步" 不炸），文本层检查原理上看不见它。
// 同理，neoforge 根档守卫只有实际执行 sync 才验得出来。所以本块跑真 gate、投真毒。
const { spawnSync } = await import("node:child_process");
const { mkdirSync, rmSync, rmdirSync, writeFileSync } = await import("node:fs");
const { dirname, join: jpath } = await import("node:path");
const { fileURLToPath } = await import("node:url");
const GATE_SCRATCH = jpath(import.meta.dirname, "_debug_gate_selftest");
/** 收掉空的伞目录：rmdir 对非空目录会失败，所以兄弟自检块还在时什么都不删。 */
function dropIfEmpty(dir) {
  try {
    rmdirSync(dir);
  } catch {
    /* 非空或不存在：不碰 */
  }
}
const PS_GATE = fileURLToPath(new URL("./scripts/assert-powershell.mjs", import.meta.url));
const SYNC_PS = fileURLToPath(new URL("../scripts/sync-skills.ps1", import.meta.url));
const GUARD = '$meta.Platform -eq "neoforge" -and -not $meta.Version';

const psProbe = spawnSync("powershell.exe", ["-NoProfile", "-Command", "1"], {
  encoding: "utf8",
  windowsHide: true,
});
if (psProbe.status !== 0) {
  console.log("skip: powershell.exe 不可用（assert-powershell 自检依赖 Windows PowerShell）");
} else {
  const syncSrc = readFileSync(SYNC_PS, "utf8");
  assert.ok(syncSrc.includes(GUARD), "sync-skills.ps1 里的 neoforge 根档守卫不见了（R9 回归）");

  // 假仓库根建在 mcp-server/_debug_gate_selftest/powershell/：`.gitignore` 已有的 `**/_debug*`
  // 覆盖它，不需要为自检新增忽略规则。gate 从假根起算相对路径，所以 `_debug_` 那段不在
  // 它遍历到的相对路径里，不会被 gate 自己的 SCRATCH 跳过规则误伤。
  const FAKE_ROOT = jpath(GATE_SCRATCH, "powershell");
  const buildFakeRoot = ({ poison, guarded, resurrect }) => {
    rmSync(FAKE_ROOT, { recursive: true, force: true });
    const wf = (rel, text) => {
      const abs = jpath(FAKE_ROOT, ...rel.split("/"));
      mkdirSync(dirname(abs), { recursive: true });
      writeFileSync(abs, text, "utf8");
    };
    if (resurrect) {
      wf("neoforge/.cursor/rules/00-test.mdc", "# rule\n");
    }
    wf("evil.ps1", poison ? 'Write-Host "同"\n' : 'Write-Host "sync"\n');
    wf("scripts/sync-skills.ps1", guarded ? syncSrc : syncSrc.replace(GUARD, "$null"));
    return FAKE_ROOT;
  };
  const runPsGate = (root) =>
    spawnSync(process.execPath, [PS_GATE], {
      env: { ...process.env, MC_SKILL_PS_TEST_ROOT: root },
      encoding: "utf8",
      windowsHide: true,
    });

  const cases = [
    { poison: false, guarded: true },
    { poison: true, guarded: true },
    { poison: false, guarded: false },
    { poison: false, guarded: true, resurrect: true },
  ];
  const results = [];
  try {
    for (const c of cases) {
      const root = buildFakeRoot(c);
      try {
        results.push({ ...c, run: runPsGate(root) });
      } finally {
        rmSync(root, { recursive: true, force: true });
      }
    }
  } finally {
    // 只收自己的摊位（_debug_gate_selftest/powershell）；兄弟目录与仓库文件一律不碰。
    rmSync(FAKE_ROOT, { recursive: true, force: true });
    dropIfEmpty(GATE_SCRATCH);
  }
  const [clean, poisoned, unguarded, resurrected] = results;
  assert.equal(
    clean.run.status,
    0,
    `gate 在干净根目录上也失败 = 自检无效（投毒永远「通过」）：\n${clean.run.stdout}${clean.run.stderr}`,
  );
  assert.notEqual(poisoned.run.status, 0, "gate 漏掉了无 BOM + 奇数字节 CJK 的 .ps1（PowerShell 5.1 解析错误类）");
  assert.match(poisoned.run.stderr, /evil\.ps1.*解析错误/, `投毒未被点名：\n${poisoned.run.stderr}`);
  assert.notEqual(unguarded.run.status, 0, "gate 漏掉了 sync-skills.ps1 根档守卫失效（一次 sync 复活 325 个已删投影）");
  assert.match(unguarded.run.stderr, /REFUSE/, `未报「没有 REFUSE」：\n${unguarded.run.stderr}`);
  assert.match(unguarded.run.stderr, /投影树/, `未报投影树泄漏：\n${unguarded.run.stderr}`);
  assert.notEqual(resurrected.run.status, 0, "gate 漏掉了 neoforge/.cursor 源稿复活（§3.4-9 的删除没有守卫）");
  assert.match(resurrected.run.stderr, /复活/, `复活未被点名：\n${resurrected.run.stderr}`);
  console.log(
    `  assert-powershell 自检: 干净=0 / 投毒=${poisoned.run.status} / 去守卫=${unguarded.run.status} / 源稿复活=${resurrected.run.status}`,
  );
}

// ── #15 java-spawn-cwd gate 自检：证明它真的会失败（假包根，不碰 src/）───────
// 背景（R10）：runJava 的 opts.cwd 是可选的，缺省继承 MCP 进程 cwd = 用户仓库。
// VineFlower / tiny-remapper 一旦把某个参数当相对输出路径，垃圾就落在人家仓库里——
// 实测仓库根被写出整个 `--only=net/fabricmc/tinyremapper/Main/…`（85 个文件，同一
// 时间戳）。修法是不改签名（调用点已经全部传对），改用静态 gate 钉住这个不变式。
// 和 #14 同理：gate 只有被投毒过一次才算数。
{
  const GATE = fileURLToPath(new URL("./scripts/assert-java-spawn-cwd.mjs", import.meta.url));
  const FAKE_PKG = jpath(GATE_SCRATCH, "java-spawn");
  const DECL = [
    "export interface JavaRunResult { code: number | null; stdout: string; stderr: string; }",
    "export async function runJava(",
    "  args: string[],",
    "  opts: { javaPath?: string | null; timeoutMs?: number; cwd?: string; env?: NodeJS.ProcessEnv } = {},",
    "): Promise<JavaRunResult> {",
    "  return { code: 0, stdout: \"\", stderr: \"\" };",
    "}",
    "",
  ].join("\n");
  const serviceSrc = (callTail, mapArg) => {
    const lines = [
      'import { ensureCachePaths } from "../cache.js";',
      'import { runJava } from "../java/java-process.js";',
      'import { remapperCli } from "./java-pipeline.js";',
      "export async function step(gate: { cacheRoot: string; mappings: string }, cli: (a: string, b: string) => string[]) {",
      "  const cache = ensureCachePaths(gate.cacheRoot);",
      "  const tiny = ensureMojmapTiny(gate.mappings);",
      `  const r = await runJava(cli("x", "y")${callTail});`,
    ];
    if (mapArg === null) {
      lines.push("  return r.code;");
    } else {
      lines.push(`  const extra = remapperCli(["tr.jar"], "in.jar", "out.jar", ${mapArg}, "official", "named");`);
      lines.push("  return r.code === null ? extra.length : r.code;");
    }
    lines.push("}", "");
    return lines.join("\n");
  };
  const build = (callTail, mapArg = "tiny") => {
    rmSync(FAKE_PKG, { recursive: true, force: true, maxRetries: 6, retryDelay: 120 });
    const wf = (rel, text) => {
      const abs = jpath(FAKE_PKG, ...rel.split("/"));
      mkdirSync(dirname(abs), { recursive: true });
      writeFileSync(abs, text, "utf8");
    };
    wf("src/decompile/java/java-process.ts", DECL);
    wf("src/decompile/services/pipeline.ts", serviceSrc(callTail, mapArg));
  };
  const runGate = (env) =>
    spawnSync(process.execPath, [GATE], { env: { ...process.env, ...env }, encoding: "utf8", windowsHide: true });

  try {
    build(", { cwd: cache.root }");
    const ok = runGate({ MC_SKILL_JAVA_GATE_TEST_PKG: FAKE_PKG });
    assert.equal(ok.status, 0, `gate 在干净调用点上也失败 = 自检无效：\n${ok.stdout}${ok.stderr}`);
    // 声明本身（export async function runJava）不是调用点：写 gate 时先错过一次。
    assert.match(ok.stdout, /runJava 调用点 1 个/, `调用点计数把函数声明算进去了：\n${ok.stdout}`);
    assert.match(ok.stdout, /remapperCli 调用点 1 个/, `映射检查没扫到调用点（已退化成空检查）：\n${ok.stdout}`);

    // <mappings> 内联调用形态同样是合法来源，不能被「必须是已证明变量名」误伤。
    build(", { cwd: cache.root }", 'ensureYarnTiny("yarn-1.20.1+build.10-mergedv2.jar")');
    const inline = runGate({ MC_SKILL_JAVA_GATE_TEST_PKG: FAKE_PKG });
    assert.equal(inline.status, 0, `内联 ensureYarnTiny(...) 被误判：\n${inline.stdout}${inline.stderr}`);

    const cases = [
      { tail: ", { timeoutMs: 1000 }", why: /没有 cwd/, name: "opts 缺 cwd" },
      { tail: "", why: /未传 opts 对象/, name: "完全没有 opts" },
      { tail: ", { cwd: process.cwd() }", why: /process\.cwd/, name: "cwd=用户仓库" },
      { tail: ", { cwd: someOtherDir }", why: /不源自缓存根/, name: "cwd 非缓存根" },
      // 真实血案：yarn 分支把下载目录里的 jar 路径直接当 <mappings> 喂 tiny-remapper。
      {
        tail: ", { cwd: cache.root }",
        mapArg: "gate.mappings",
        why: /<mappings>=gate\.mappings 不是 ensureYarnTiny/,
        name: "映射参数不是 .tiny 产物",
      },
      // 规则本身也不能退化成空扫描：函数改名/正则失效时必须自己叫。
      {
        tail: ", { cwd: cache.root }",
        mapArg: null,
        why: /一个 remapperCli 调用点都没扫到/,
        name: "remapperCli 扫描失效",
      },
    ];
    for (const c of cases) {
      build(c.tail, c.mapArg);
      const r = runGate({ MC_SKILL_JAVA_GATE_TEST_PKG: FAKE_PKG });
      assert.notEqual(r.status, 0, `gate 漏掉了「${c.name}」——用户仓库会重新变成 Java 工具的落盘目录`);
      assert.match(r.stderr, c.why, `「${c.name}」未被点名：\n${r.stderr}`);
    }

    // 真树上必须通过，且真的扫到调用点：防 gate 路径写错退化成空检查。
    const real = runGate({});
    assert.equal(real.status, 0, `真树 gate 失败：\n${real.stdout}${real.stderr}`);
    const realCount = Number((real.stdout.match(/runJava 调用点 (\d+) 个/) || [])[1] ?? 0);
    assert.ok(realCount >= 5, `gate 只扫到 ${realCount} 个 runJava 调用点，多半是路径失效（它已退化成空检查）：\n${real.stdout}`);
    const realRemap = Number((real.stdout.match(/remapperCli 调用点 (\d+) 个/) || [])[1] ?? 0);
    assert.ok(realRemap >= 4, `gate 只扫到 ${realRemap} 个 remapperCli 调用点，映射检查多半已失效：\n${real.stdout}`);
    console.log(
      `  assert-java-spawn-cwd 自检: 干净=0 / ${cases.length} 种投毒全部失败 / 真树 ${realCount} 个 runJava + ${realRemap} 个 remapperCli 调用点通过`,
    );
  } finally {
    rmSync(FAKE_PKG, { recursive: true, force: true, maxRetries: 6, retryDelay: 120 });
    dropIfEmpty(GATE_SCRATCH);
  }
}

// ── #16 yarn-json-slurp gate 自检：证明收窄后的读文件规则仍然咬得住 ───────────
// 该 gate 第 2 条原本写作 readFileSync(...yarn...)，会把「读 yarn jar」也算命中；
// 反编译链路里 ensureYarnTiny 必须 readFileSync 一个 1.3MB 的 yarn mergedv2 jar，
// 于是规则被收窄成 readFileSync(...yarn...json)。收窄是有代价的：一旦被证明的那条
// 腿其实不再咬人，gate 就退化成装饰。所以这里跑真 gate + 投真毒。
{
  const GATE = fileURLToPath(new URL("./scripts/assert-no-yarn-json-slurp.mjs", import.meta.url));
  const FAKE_SRC = jpath(GATE_SCRATCH, "yarn-slurp");
  const build = (body) => {
    rmSync(FAKE_SRC, { recursive: true, force: true });
    mkdirSync(FAKE_SRC, { recursive: true });
    writeFileSync(jpath(FAKE_SRC, "convert.ts"), body, "utf8");
  };
  const runGate = () =>
    spawnSync(process.execPath, [GATE], {
      env: { ...process.env, MC_SKILL_YARN_SLURP_GATE_SRC: FAKE_SRC },
      encoding: "utf8",
      windowsHide: true,
    });

  try {
    build('import { readFileSync } from "node:fs";\nconst e = readZip(readFileSync(yarnJarPath));\nexport default e;\n');
    const clean = runGate();
    assert.equal(clean.status, 0, `gate 把「读 yarn jar」误判成 slurp JSON，反编译链路会被自己的规则挡死：\n${clean.stdout}${clean.stderr}`);

    const cases = [
      {
        name: "字面量 yarn-mappings.json",
        body: 'const o = JSON.parse(readFileSync(join(dataDir, "yarn-mappings.json"), "utf8"));\nexport default o;\n',
        why: /yarn-mappings\\.json/,
      },
      {
        name: "变量名暗示 yarn JSON",
        body: 'const o = JSON.parse(readFileSync(yarnMappingsJson, "utf8"));\nexport default o;\n',
        // 关键：必须仍被 readFileSync 那条（已收窄的）规则点名，不能只靠 JSON.parse 兜。
        why: /readFileSync.*yarn.*json/i,
      },
    ];
    for (const c of cases) {
      build(c.body);
      const r = runGate();
      assert.notEqual(r.status, 0, `gate 漏掉了「${c.name}」——25.8MB 映射表会重新被读进运行时`);
      assert.match(r.stderr, c.why, `「${c.name}」的 readFileSync 规则没咬住（说明收窄过头）：\n${r.stderr}`);
    }
    console.log(`  assert-no-yarn-json-slurp 自检: 读 yarn jar=0 / ${cases.length} 种 slurp 全部失败`);
  } finally {
    rmSync(FAKE_SRC, { recursive: true, force: true });
    dropIfEmpty(GATE_SCRATCH);
  }
}

/**
 * §6.2-6：Java 方法签名提取正则。两个脚本各持一份同形字面量，而两者都是顶层执行的脚本
 * （import 即跑 + 会落笔），所以只能按源码文本取回**真正生效的那一份**来测。
 */
{
  const { readFileSync } = await import("node:fs");
  const SOURCES = [
    { rel: "../scripts/fetch-loader-api-sources.mjs", name: "METHOD_SIG_RE" },
    { rel: "../scripts/validate-rules-against-cache.mjs", name: "methodRe" },
  ];
  const shipped = SOURCES.map(({ rel, name }) => {
    const src = readFileSync(new URL(rel, import.meta.url), "utf8");
    const m = new RegExp(`${name} =\\s*/([\\s\\S]*?)/([a-z]*);`).exec(src);
    assert.ok(
      m,
      `未能从 ${rel} 取出 ${name} 字面量 —— 脚本改了写法，本测试与「只认声明行」的契约都要同步`,
    );
    return { rel, re: new RegExp(m[1], m[2]), literal: m[1] };
  });
  assert.equal(
    shipped[0].literal,
    shipped[1].literal,
    "两份方法签名正则已分叉：一处收紧、另一处照旧 = 同一个缺陷只在半个链路上修掉",
  );

  // 正例 = 声明行必须命中；负例两类 = 语句关键字调用点、表达式里的普通调用与局部变量声明。
  const POSITIVE = [
    ["public void tick()", "tick"],
    ["@Override public static void register() {", "register"],
    ["public List<String> names(int i) {", "names"],
    ["protected abstract <T> T cast(T in) {", "cast"],
    ["public String[] splitLines(String s) {", "splitLines"],
    ["public @Deprecated Map<String, Integer> counts() {", "counts"],
    ["default ItemStack copy() {", "copy"],
  ];
  const NEGATIVE = [
    "return foo(bar);",
    "else bar(x);",
    "assert matches(t);",
    "throw illegalState(msg);",
    "new FooBuilder().build(1);",
    "if (cond.equals(other)) {",
    "while (queue.poll() != null) {",
    "var x = compute(y);",
    "this.setValue(v);",
    'LOGGER.info("msg {}", x);',
    "int y = compute(x);",
    "foo(bar);",
  ];
  for (const { rel, re } of shipped) {
    for (const [line, want] of POSITIVE) {
      re.lastIndex = 0;
      const hit = re.exec(line);
      assert.ok(hit, `${rel}: 声明行未命中 → ${line}`);
      assert.equal(hit[1], want, `${rel}: ${line} 提取到 ${hit[1]}，应为 ${want}`);
    }
    for (const line of NEGATIVE) {
      re.lastIndex = 0;
      const hit = re.exec(line);
      assert.ok(!hit, `${rel}: 负例被当成方法声明 → ${line}${hit ? `（抓到 ${hit[1]}）` : ""}`);
    }
  }
  console.log(
    `  Java 方法签名正则: 两份字面量一致 + 正例 ${POSITIVE.length} / 负例 ${NEGATIVE.length}（关键字调用点 + 表达式调用）全部分类正确`,
  );
}

/**
 * §6.3-13：计数信号量的 `active` 必须收敛。旧实现（`batch-decompile.mjs`）在被 waiter
 * 唤醒后再 `active++`，而 `release()` 交接时已经加过一次 → 每交接一格算两格，`active`
 * 单调上漂，最终所有 `acquire()` 永久挂住。语义正确性只有跑并发才测得出来，
 * 所以信号量已抽成 `scripts/_lib/semaphore.mjs`（纯模块，可 import）。
 */
{
  const { makeSemaphore, withSlot } = await import(
    new URL("../scripts/_lib/semaphore.mjs", import.meta.url).href
  );
  const SLOT = 6;
  const TASKS = 40;
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  /** 跑一轮 workload，返回 { peak, done, activeAfter, hung }。 */
  async function drive(makeSem) {
    const sem = makeSem(SLOT);
    let running = 0;
    let peak = 0;
    let done = 0;
    const all = Promise.all(
      Array.from({ length: TASKS }, () =>
        withSlot(sem, async () => {
          running++;
          peak = Math.max(peak, running);
          await sleep(1);
          running--;
          done++;
        }),
      ),
    );
    const hung = await Promise.race([all.then(() => false), sleep(1500).then(() => true)]);
    return { peak, done, activeAfter: sem.activeCount(), hung };
  }

  const good = await drive(makeSemaphore);
  assert.ok(!good.hung, `正确实现不得挂起（active 上漂会让 acquire 永久排队）：完成 ${good.done}/${TASKS}`);
  assert.equal(good.done, TASKS, "40 个任务必须全部执行完");
  assert.ok(good.peak <= SLOT, `并发峰值 ${good.peak} 不得超过槽位数 ${SLOT}`);
  assert.ok(good.peak >= 2, `峰值只有 ${good.peak}，这批任务根本没并发，测不出信号量`);
  assert.equal(good.activeAfter, 0, `全部完成后 active 必须收敛到 0，实际 ${good.activeAfter}`);

  // 反向自证：旧写法（唤醒后再 active++）必须在同一负载下暴露，否则这条断言是摆设。
  const drift = await drive((n) => {
    let active = 0;
    const waiters = [];
    return {
      async acquire() {
        if (active < n) {
          active++;
          return;
        }
        await new Promise((res) => waiters.push(res));
        active++; // ← 旧 bug：交接已加过一次，这里再加一格
      },
      release() {
        active--;
        const w = waiters.shift();
        if (w) {
          active++;
          w();
        }
      },
      activeCount: () => active,
    };
  });
  assert.ok(
    drift.hung || drift.activeAfter !== 0 || drift.done !== TASKS,
    `旧写法必须被同一条负载暴露（挂起 / active 不收敛 / 任务没跑完），实际 ${JSON.stringify(drift)}`,
  );
  console.log(
    `  计数信号量: ${TASKS} 任务 / ${SLOT} 槽 峰值=${good.peak} active 收敛=0 全完成=${good.done}` +
      `；投毒（唤醒后再 active++）→ ${drift.hung ? "挂起" : `active=${drift.activeAfter}`}，断言可失败`,
  );
}

console.log("script helper regression tests passed");
