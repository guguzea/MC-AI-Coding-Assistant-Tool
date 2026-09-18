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

// ── #16 assert-fabric-transcludes 自检：假根 + 三种投毒（不碰 data/）─────────
// 背景（D-2=B）：上游 fabric-docs 的 `.md` 里代码是 `@[code …](@/reference/…)` 占位符，
// 渲染期才展开。我们把 reference 镜像进 data/fabric_<ver>/ 并在读取侧展开，于是有三条
// 可以悄悄坏掉的路：镜像文件被删、镜像字节漂移、processed 相对 raw 少了标记。
// 只跑真树的话，「gate 绿」和「gate 没在干活」看不出区别 —— 所以这里建假根投毒。
{
  const { createHash } = await import("node:crypto");
  const GATE = fileURLToPath(new URL("./scripts/assert-fabric-transcludes.mjs", import.meta.url));
  const FAKE_ROOT = jpath(GATE_SCRATCH, "fabric-transcludes");
  const JAVA_REL = "reference/1.20.4/src/main/java/com/example/docs/item/ModItems.java";
  const JSON_REL = "reference/1.20.4/src/main/generated/data/example-mod/damage_type/tater.json";
  const JAVA_TARGET = `@/${JAVA_REL}`;
  const JSON_TARGET = `@/${JSON_REL}`;
  const JAVA_TEXT = [
    "package com.example.docs.item;",
    "",
    "// :::1",
    "public class ModItems {",
    "    static final Item RUBY = register(\"ruby\");",
    "// :::1",
    "// :::2",
    "    private static Item register(String name) {",
    "        return null;",
    "    }",
    "// :::2",
    "",
  ].join("\n");
  // 故意不带尾换行：真实上游 generated JSON 就有这种，展开块必须逐字节等于文件本身。
  const JSON_TEXT = '{\n  "id": "example-mod:tater"\n}';
  const DOC = [
    "# Transclude fixture",
    "",
    `Whole file:`,
    "",
    `@[code](${JSON_TARGET})`,
    "",
    "Region:",
    "",
    `@[code lang=java transcludeWith=:::1](${JAVA_TARGET})`,
    "",
    "Range:",
    "",
    `@[code lang=java transclude={2-3}](${JAVA_TARGET})`,
    "",
  ].join("\n");

  const buildFakeRoot = ({ dropReference, tamperJson, dropProcessedMarker }) => {
    rmSync(FAKE_ROOT, { recursive: true, force: true });
    const packRoot = jpath(FAKE_ROOT, "fabric_1.20.4");
    const wf = (abs, text) => {
      mkdirSync(dirname(abs), { recursive: true });
      writeFileSync(abs, text, "utf8");
    };
    const docDir = jpath(packRoot, "fabric-docs", "1.20.4");
    const processedDoc = dropProcessedMarker
      ? DOC.split("\n")
          .filter((l) => !l.startsWith("@[code lang=java transclude={"))
          .join("\n")
      : DOC;
    wf(jpath(docDir, "raw", "develop_fixture.md"), DOC);
    wf(jpath(docDir, "processed", "develop_fixture.md"), processedDoc);
    if (!dropReference) wf(jpath(packRoot, JAVA_REL), JAVA_TEXT);
    wf(
      jpath(packRoot, JSON_REL),
      tamperJson ? JSON_TEXT.replace("tater", "tater ") : JSON_TEXT,
    );
    const sha = (s) => createHash("sha256").update(Buffer.from(s, "utf-8")).digest("hex");
    wf(
      jpath(packRoot, "reference.provenance.json"),
      JSON.stringify(
        {
          sourceRepo: "FabricMC/fabric-docs",
          commitSha: "0".repeat(40),
          version: "1.20.4",
          files: {
            [JAVA_REL]: { blobSha: "0".repeat(40), sha256: sha(JAVA_TEXT), bytes: Buffer.byteLength(JAVA_TEXT) },
            [JSON_REL]: { blobSha: "0".repeat(40), sha256: sha(JSON_TEXT), bytes: Buffer.byteLength(JSON_TEXT) },
          },
          aliases: {},
        },
        null,
        2,
      ),
    );
    return FAKE_ROOT;
  };
  const runGate = (root) => {
    const env = { ...process.env, MC_SKILL_TRANSCLUDE_TEST_ROOT: root };
    delete env.MC_SKILL_DATA;
    return spawnSync(process.execPath, [GATE], { env, encoding: "utf8", windowsHide: true });
  };

  const cases = [
    { name: "clean" },
    { name: "dropReference", dropReference: true },
    { name: "tamperJson", tamperJson: true },
    { name: "dropProcessedMarker", dropProcessedMarker: true },
  ];
  const runs = [];
  try {
    for (const c of cases) {
      const root = buildFakeRoot(c);
      try {
        runs.push({ ...c, run: runGate(root) });
      } finally {
        rmSync(root, { recursive: true, force: true });
      }
    }
  } finally {
    rmSync(FAKE_ROOT, { recursive: true, force: true });
    dropIfEmpty(GATE_SCRATCH);
  }

  const byName = Object.fromEntries(runs.map((r) => [r.name, r.run]));
  assert.equal(
    byName.clean.status,
    0,
    `gate 在干净假根上也失败 = 自检无效（投毒永远「通过」）：\n${byName.clean.stdout}${byName.clean.stderr}`,
  );
  assert.match(byName.clean.stdout, /占位符 3 处/, `干净假根没跑到 3 处标记：\n${byName.clean.stdout}`);
  assert.notEqual(byName.dropReference.status, 0, "gate 漏掉了 reference 镜像文件被删（get_fabric_doc_full 会退回 Not Found）");
  assert.match(byName.dropReference.stderr, /ModItems\.java/, `删镜像件未被点名：\n${byName.dropReference.stderr}`);
  assert.notEqual(byName.tamperJson.status, 0, "gate 漏掉了镜像文件字节漂移（provenance 形同虚设）");
  assert.match(byName.tamperJson.stderr, /tater\.json/, `字节漂移未被点名：\n${byName.tamperJson.stderr}`);
  assert.notEqual(byName.dropProcessedMarker.status, 0, "gate 漏掉了 processed 相对 raw 少一个占位符（加工吞了标记）");
  assert.match(byName.dropProcessedMarker.stderr, /占位符数不等/, `吞标记未被点名：\n${byName.dropProcessedMarker.stderr}`);
  console.log(
    `  assert-fabric-transcludes 自检: 干净=0 / 删镜像=${byName.dropReference.status} / 字节漂移=${byName.tamperJson.status}` +
      ` / 吞标记=${byName.dropProcessedMarker.status}`,
  );
}

/**
 * §S3 数据链上游：verifiedApi 包名归属 / catalog 白名单正则 / 缓存版本键 / 侧栏常量。
 *
 * 背景（审查 F94·F91·F58·F59·F97）：`library-catalog.ts` 的 verifiedApi 是「哪个库有哪些包」的
 * 唯一权威，但它由 `batch-decompile → merge-verified-api → build-api-summaries` 三跳生成，每一跳
 * 坏掉都不报错：
 *  - merge 把 JiJ 内嵌库的包根写进宿主条目（实测 14 条目 50 处 `net.darkhax.bookshelf`），下游
 *    `search_mod_code` / 库 Skill 会照着别人的包名生成 import；
 *  - 解不出 modId 的行坍缩进 `unknown-mod`，冒领别的库目录树；
 *  - build-api-summaries 取白名单的正则写成裸 `packages:` 而 catalog 实际是带引号的 `"packages":`
 *    → 命中 0 处，白名单恒空 = 完全不过滤，摘要 `packages` 恒空；
 *  - 缓存叶子目录名自 S2 起带 `-<sha512 前 12 hex>`，直接当版本键会把哈希泄漏成「版本号」。
 * 四类都是「静默变空 / 变脏」，所以这里跑真脚本、建假根、并逐条投毒证明断言能失败。
 *
 * 归属规则的口径偏离（已在销账册登记）：故事原文写「包名必须以本条目 modId 开头」，字面实现会否掉
 * 1829 处里的 1695 处（MC 包根是作者命名空间，`net.darkhax.bookshelf` 也不以 `bookshelf` 开头）。
 * 生效规则改为：段级自有（modId 作为路径的一段）+ 只拒「命中他方已证实包根」的包。
 */
{
  const SCRIPTS = fileURLToPath(new URL("../scripts", import.meta.url));
  const MERGE_SRC = jpath(SCRIPTS, "merge-verified-api.mjs");
  const BAS_SRC = jpath(SCRIPTS, "build-api-summaries.mjs");
  const S3 = jpath(GATE_SCRATCH, "s3-data-chain");
  const s3w = (p, s) => {
    mkdirSync(dirname(p), { recursive: true });
    writeFileSync(p, s, "utf8");
  };

  // verifiedApi 内层键必须带引号：产物由 JSON.stringify 生成，而「带引号」正是 F91 死正则的成因
  const MERGE_CATALOG = `export const LIBRARY_CATALOG = [
  {
    id: "authored/lib-bookshelf",
    modIds: ["bookshelf"],
    modrinthSlug: "bookshelf",
    verifiedApi: {
      "1.20.1/forge": {
        "verifiedAt": "2026-08",
        "packages": ["net.darkhax.bookshelf"],
        "entrypoints": ["net.darkhax.bookshelf.Bookshelf"],
        "notes": "自动反编译提取",
      },
    },
  },
  {
    id: "authored/lib-caelus",
    modIds: ["caelus"],
    modrinthSlug: "caelus",
    verifiedApi: {
      "1.20.1/forge": {
        "verifiedAt": "2026-08",
        "packages": ["top.theillusivec4.caelus"],
        "entrypoints": ["top.theillusivec4.caelus.PluginCaelus"],
        "notes": "自动反编译提取",
      },
      "1.19.2/forge": {
        "verifiedAt": "2026-08",
        "packages": ["net.darkhax.bookshelf"],
        "entrypoints": [],
        "notes": "自动反编译提取",
      },
    },
  },
  {
    id: "authored/lib-trinkets",
    modIds: ["trinkets"],
    modrinthSlug: "trinkets",
    verifiedApi: {
      "1.20.1/fabric": {
        "verifiedAt": "2026-08",
        "packages": ["dev.emi.trinkets"],
        "entrypoints": [],
        "notes": "自动反编译提取",
      },
    },
  },
];
`;
  const MERGE_ROWS = [
    // 自有包 + 键已存在且现值干净 → 不给 --force 就必须跳过（不得改写别人的历史核实值）
    { status: "success", modId: "caelus", slug: "caelus", gameVersion: "1.20.1", loader: "forge", packages: ["top.theillusivec4.caelus"] },
    // 自有包 + 键已存在但现值是外来包 → 无需 --force 也应自愈
    { status: "success", modId: "caelus", slug: "caelus", gameVersion: "1.19.2", loader: "forge", packages: ["com.illusivesoulworks.caelus"] },
    // 外来包（net.darkhax.bookshelf 已由 bookshelf 条目证实）→ 整行拒绝
    { status: "success", modId: "caelus", slug: "caelus", gameVersion: "1.20.4", loader: "neoforge", packages: ["net.darkhax.bookshelf"] },
    // 段级自有：dev.emi.trinkets 里含他方 modId `emi`，但本条目 modId `trinkets` 也是段 → 必须放行
    { status: "success", modId: "trinkets", slug: "trinkets", gameVersion: "1.20.4", loader: "fabric", packages: ["dev.emi.trinkets"] },
    // 凭证来源条目自身（冷启动时 catalog 已空，靠这行登记包根归属）
    { status: "success", modId: "bookshelf", slug: "bookshelf", gameVersion: "1.20.4", loader: "forge", packages: ["net.darkhax.bookshelf"] },
    // 身份不可解的两种形态：不得坍缩进 unknown-mod 去冒领 caelus 的树
    { status: "success", modId: null, slug: "caelus", gameVersion: "1.21.1", loader: "neoforge", packages: ["top.theillusivec4.caelus"] },
    { status: "success", modId: "unknown-mod", slug: "caelus", gameVersion: "1.21.1", loader: "fabric", packages: ["top.theillusivec4.caelus"] },
  ];
  const rowsJsonl = (rows) => rows.map((r) => JSON.stringify(r)).join("\n") + "\n";
  /** 写盘后按条目切片（verifiedApi 内不得有注释：merge 的 parseVa 不认注释，整块会判成无法解析） */
  const entryBlock = (text, id) => {
    const at = text.indexOf(`id: "${id}"`);
    if (at < 0) return "";
    const next = text.indexOf('id: "', at + 1);
    return text.slice(at, next < 0 ? text.length : next);
  };
  const runMerge = (script, input, catalog, extra = []) => {
    const r = spawnSync(process.execPath, [script, "--input", input, "--catalog", catalog, ...extra], {
      encoding: "utf8",
      cwd: SCRIPTS,
      windowsHide: true,
    });
    assert.equal(r.status, 0, `merge-verified-api 退出码 ${r.status}\n${r.stdout}\n${r.stderr}`);
    return r.stdout;
  };

  try {
    /* ── 1. 归属拒绝 + 身份拒绝 + 双跑幂等 ───────────────────────────── */
    const dir = jpath(S3, "merge");
    const catalog = jpath(dir, "catalog.ts");
    const input = jpath(dir, "rows.jsonl");
    s3w(catalog, MERGE_CATALOG);
    s3w(input, rowsJsonl(MERGE_ROWS));

    const dry = runMerge(MERGE_SRC, input, catalog);
    assert.equal(readFileSync(catalog, "utf8"), MERGE_CATALOG, "默认 dry-run 却改了 catalog（写面失控）");
    assert.match(dry, /包名归属拒绝：1 个条目/, `dry-run 未报出归属拒绝：\n${dry}`);
    assert.match(dry, /authored\/lib-caelus：外来包 net\.darkhax\.bookshelf/, `拒绝未点名外来包：\n${dry}`);
    assert.match(dry, /身份不可解 2/, `两条无身份行未计入：\n${dry}`);
    assert.doesNotMatch(dry, /已写入/, `dry-run 声称写盘：\n${dry}`);

    const first = runMerge(MERGE_SRC, input, catalog, ["--write"]);
    assert.match(first, /已写入/, `--write 未落盘：\n${first}`);
    const after = readFileSync(catalog, "utf8");
    const caelus = entryBlock(after, "authored/lib-caelus");
    assert.ok(caelus, "caelus 条目在写盘后消失");
    assert.doesNotMatch(caelus, /net\.darkhax\.bookshelf/, `caelus 仍持有 bookshelf 的包根：\n${caelus}`);
    assert.match(caelus, /"1\.19\.2\/forge"[\s\S]{0,200}com\.illusivesoulworks\.caelus/, "被污染的现值键未自愈");
    assert.match(caelus, /"1\.20\.1\/forge"[\s\S]{0,200}top\.theillusivec4\.caelus/, "干净现值键被改写");
    assert.doesNotMatch(caelus, /"1\.20\.4\/neoforge"/, "被拒绝的外来包行仍写成了新键");
    assert.match(entryBlock(after, "authored/lib-trinkets"), /dev\.emi\.trinkets/, "段级自有包被误拒（dev.emi.trinkets）");
    // 正向对照：bookshelf 自己的包根必须还在，否则「caelus 干净」可以靠清空全表蒙过去
    assert.match(entryBlock(after, "authored/lib-bookshelf"), /net\.darkhax\.bookshelf/, "bookshelf 自有包根被误删");

    const second = runMerge(MERGE_SRC, input, catalog, ["--write"]);
    assert.match(second, /无变更，未写盘/, `同一份 JSONL 重跑不幂等：\n${second}`);
    assert.equal(readFileSync(catalog, "utf8"), after, "重跑改动了 catalog 字节");

    /* ── 2. 冷启动：catalog 现值清空后，凭证只能来自本轮输入 ─────────── */
    const cold = jpath(S3, "merge-cold");
    const stripped = MERGE_CATALOG.replace(/"packages": \[[^\]]*\]/g, '"packages": []');
    assert.notEqual(stripped, MERGE_CATALOG, "冷启动假 catalog 没构造出来（packages 键写法已变）");
    const coldCatalog = jpath(cold, "catalog.ts");
    s3w(coldCatalog, stripped);
    s3w(jpath(cold, "rows.jsonl"), rowsJsonl(MERGE_ROWS));
    const coldOut = runMerge(MERGE_SRC, jpath(cold, "rows.jsonl"), coldCatalog, ["--write"]);
    assert.match(coldOut, /包名归属拒绝：1 个条目/, `catalog 清空后不再拒外来包（凭证表未随输入冷启动）：\n${coldOut}`);
    assert.doesNotMatch(
      entryBlock(readFileSync(coldCatalog, "utf8"), "authored/lib-caelus"),
      /net\.darkhax\.bookshelf/,
      "冷启动下 bookshelf 包根仍冒领进 caelus",
    );

    /* ── 3. 投毒：关掉归属检查，上面那组断言必须失败 ────────────────── */
    const poisonedDir = jpath(S3, "merge-poison");
    const shippedMerge = readFileSync(MERGE_SRC, "utf8");
    const poisoned = shippedMerge.replace(
      "  const foreign = foreignPackages(entry, pkgs, rootOwners);",
      "  const foreign = []; // 投毒：关掉包名归属检查",
    );
    assert.ok(poisoned !== shippedMerge, "merge 投毒锚点未命中，脚本写法已变 → 本自检需同步");
    const poisonScript = jpath(poisonedDir, "merge.poisoned.mjs");
    const poisonCatalog = jpath(poisonedDir, "catalog.ts");
    s3w(poisonScript, poisoned);
    s3w(poisonCatalog, MERGE_CATALOG);
    s3w(jpath(poisonedDir, "rows.jsonl"), rowsJsonl(MERGE_ROWS));
    const pr = runMerge(poisonScript, jpath(poisonedDir, "rows.jsonl"), poisonCatalog, ["--write"]);
    assert.doesNotMatch(pr, /包名归属拒绝/, "投毒后仍报拒绝 = 拒绝断言不是靠这段输出成立的");
    assert.match(
      entryBlock(readFileSync(poisonCatalog, "utf8"), "authored/lib-caelus"),
      /net\.darkhax\.bookshelf/,
      "投毒后外来包没写进 caelus → 「caelus 不含 bookshelf」那条断言是摆设",
    );

    /* ── 4. build-api-summaries：假仓库根 + 版本键 + catalog 白名单正则 ─ */
    const BAS_CATALOG = `export const LIBRARY_CATALOG = [
  {
    id: "authored/lib-caelus",
    modIds: ["caelus"],
    modrinthSlug: "caelus",
    role: "api",
    verifiedApi: {
      "1.20.1/forge": {
        "verifiedAt": "2026-08",
        "packages": ["top.theillusivec4.caelus"],
        "entrypoints": [],
        "notes": "自动反编译提取",
      },
    },
  },
];
`;
    const JAVA_OWN = `package top.theillusivec4.caelus;

public class PluginCaelus {
  public static final String MODID = "caelus";

  public void commonSetup(String s) {}
}
`;
    const JAVA_FOREIGN = `package com.other.lib;

public class ForeignHelper {
  public int compute(int a) {
    return a;
  }
}
`;
    /** 脚本副本放 <root>/scripts/ ⇒ 它的 ROOT 推导正好落在这棵假仓库根上 */
    const buildBasRoot = (name, mutate) => {
      const root = jpath(S3, name);
      rmSync(root, { recursive: true, force: true });
      const shipped = readFileSync(BAS_SRC, "utf8");
      const src = mutate ? mutate(shipped) : shipped;
      if (mutate) assert.notEqual(src, shipped, `${name}: 投毒锚点未命中，脚本写法已变 → 本自检需同步`);
      s3w(jpath(root, "scripts", "build-api-summaries.mjs"), src);
      s3w(jpath(root, "mcp-server", "src", "diagnostics", "library-catalog.ts"), BAS_CATALOG);
      const lib = jpath(root, "cache-s1", "decompiled-mods", "caelus");
      // 叶子 A：目录名带 sha 后缀段 + meta 里有权威版本号；内含一个白名单外的外来包
      s3w(
        jpath(lib, "1.20.1-aaaaaaaaaaaa", ".mc-skill-decompiled.json"),
        JSON.stringify({ version: "3.2.0", jarName: "caelus-1.20.1-3.2.0.jar" }),
      );
      s3w(jpath(lib, "1.20.1-aaaaaaaaaaaa", "top/theillusivec4/caelus/PluginCaelus.java"), JAVA_OWN);
      s3w(jpath(lib, "1.20.1-aaaaaaaaaaaa", "com/other/lib/ForeignHelper.java"), JAVA_FOREIGN);
      // 叶子 B：无 meta → 只能退回「剥掉尾部 12 hex」
      s3w(jpath(lib, "1.20.1-bbbbbbbbbbbb", "top/theillusivec4/caelus/PluginCaelus.java"), JAVA_OWN);
      return { root, script: jpath(root, "scripts", "build-api-summaries.mjs"), out: jpath(root, "out") };
    };
    const runBas = ({ root, script, out }) => {
      // MC_SKILL_CACHE 也指进假根：否则脚本会读真缓存里的 verified-api-all.jsonl，测的就不是这块摊位
      const env = { ...process.env, MC_SKILL_CACHE: jpath(root, "unused-cache") };
      const r = spawnSync(process.execPath, [script, "--only", "caelus", "--cache", jpath(root, "cache-s1"), "--out", out, "--write"], {
        encoding: "utf8",
        cwd: SCRIPTS,
        env,
        windowsHide: true,
      });
      assert.equal(r.status, 0, `build-api-summaries 退出码 ${r.status}\n${r.stdout}\n${r.stderr}`);
      const p = jpath(out, "caelus.json");
      assert.ok(existsSync(p), `摘要产物未生成：\n${r.stdout}`);
      return JSON.parse(readFileSync(p, "utf8"));
    };

    const clean = runBas(buildBasRoot("bas-clean", null));
    const keys = Object.keys(clean.versions);
    assert.deepEqual(keys, ["3.2.0", "1.20.1"], `版本键不对：${JSON.stringify(keys)}`);
    assert.ok(!keys.some((k) => /-[0-9a-f]{12}$/.test(k)), `版本键混进缓存叶子名（sha 后缀泄漏成版本号）：${JSON.stringify(keys)}`);
    assert.deepEqual(clean.versions["3.2.0"].packages, ["top.theillusivec4.caelus"], "自有包没记进 packages（摘要登记的是实测包）");
    assert.ok(
      clean.versions["3.2.0"].classes.includes("top.theillusivec4.caelus.PluginCaelus"),
      `自有包类未收进摘要：${JSON.stringify(clean.versions["3.2.0"].classes)}`,
    );
    assert.ok(
      !clean.versions["3.2.0"].classes.some((c) => c.startsWith("com.other.lib.")),
      "白名单没过滤外来包（prefixes 为空 = 全收）",
    );

    const poisonRegex = runBas(
      buildBasRoot("bas-poison-regex", (s) => s.replace('/["\']?packages["\']?\\s*:\\s*\\[([^\\]]*)\\]/g', "/packages:\\s*\\[([^\\]]*)\\]/g")),
    );
    // packages 自 S5 起记「树里实测到的包」，不再回写声明白名单 ⇒ 白名单变哑的表现由「外来包漏进来」证明
    assert.ok(
      poisonRegex.versions["3.2.0"].packages.some((p) => p === "com.other.lib" || p.startsWith("com.other.lib.")),
      `投毒（退回旧死正则）后白名单失效却没体现在 packages 上：${JSON.stringify(poisonRegex.versions["3.2.0"].packages)}`,
    );
    assert.ok(
      poisonRegex.versions["3.2.0"].classes.some((c) => c.startsWith("com.other.lib.")),
      "投毒后白名单仍在过滤 → classes 那条断言不靠它成立",
    );
    const poisonKey = runBas(
      buildBasRoot("bas-poison-key", (s) => {
        // 锚点随归属层改写同步（2026-09-15）：`versionKeyOf` → `versionKeysOf`（返回数组 + 多版本署名），
        // meta 权威版本号由「直接 return」改为「赋给 metaVersion」，兜底剥 12 hex 挪进三元表达式。
        // 锚点各带自己的存在性断言 ⇒ 脚本再改写法会在这里点名，不会再静默失效。
        const A_META = "if (typeof meta?.version === 'string' && meta.version) metaVersion = meta.version;";
        const A_FALLBACK = ": [dirName.replace(/-[0-9a-f]{12}$/, '')];";
        assert.ok(s.includes(A_META), "versionKeysOf 投毒锚点①（meta 里的权威版本号）未命中，脚本写法已变");
        assert.ok(s.includes(A_FALLBACK), "versionKeysOf 投毒锚点②（兜底剥 12 hex）未命中，脚本写法已变");
        const t = s
          .replace(A_META, "  // 投毒：忽略 meta 里的权威版本号")
          .replace(A_FALLBACK, ": [dirName];");
        assert.notEqual(t, s, "versionKeysOf 投毒未生效");
        return t;
      }),
    );
    assert.ok(
      Object.keys(poisonKey.versions).some((k) => /-[0-9a-f]{12}$/.test(k)),
      `投毒（版本键直接用叶子名）后仍无哈希后缀键 → 该断言是摆设：${JSON.stringify(Object.keys(poisonKey.versions))}`,
    );

    /* ── 5. 侧栏常量：反编译侧包名启发式 + manifest sha 字段 ─────────── */
    const bdSrc = readFileSync(jpath(SCRIPTS, "batch-decompile.mjs"), "utf8");
    const grabSet = (name) => {
      const m = new RegExp(`const ${name} = new Set\\((\\[[^)]*\\])\\)`).exec(bdSrc);
      assert.ok(m, `未能从 batch-decompile.mjs 取出 ${name}，写法已变`);
      return new Set(JSON.parse(m[1]));
    };
    const RESOURCE_DIRS = grabSet("RESOURCE_DIRS");
    const GENERIC_TLDS = grabSet("GENERIC_TLDS");
    for (const d of ["META-INF", "assets", "data", "licenses", "coremods", "asm", "profiles"]) {
      assert.ok(RESOURCE_DIRS.has(d), `RESOURCE_DIRS 缺 ${d}（catalog 实测 30 行把目录名当包名）`);
    }
    for (const tld of ["fi", "eu", "team", "me", "software"]) {
      assert.ok(GENERIC_TLDS.has(tld), `GENERIC_TLDS 缺 ${tld}（非通用 TLD 只取 2 段 = 包名被截断）`);
    }
    assert.ok(GENERIC_TLDS.has("top"), "top 域（top.theillusivec4.*）必须按 3 段取，否则只剩 `top.xxx`");

    const lmSrc = readFileSync(jpath(SCRIPTS, "build-lib-manifest.mjs"), "utf8");
    const shaLit = /const SHA512_RE = \/([\s\S]*?)\/([a-z]*);/.exec(lmSrc);
    assert.ok(shaLit, "未能从 build-lib-manifest.mjs 取出 SHA512_RE，写法已变");
    const shaRe = new RegExp(shaLit[1], shaLit[2]);
    assert.ok(shaRe.test("a".repeat(128)), "128 位十六进制必须算 sha512");
    assert.ok(!shaRe.test("a".repeat(64)), "sha256 长度不得混进 sha512 字段（F97 字段错位：下游按 sha512 校验必失败）");
    assert.ok(!shaRe.test("a".repeat(129)), "超长不得算 sha512");
    assert.ok(!shaRe.test("z".repeat(128)), "非十六进制不得算 sha512");

    /* ── 6. validate-rules-against-cache 判定子句（取源码真函数体）───── */
    const vracSrc = readFileSync(jpath(SCRIPTS, "validate-rules-against-cache.mjs"), "utf8");
    const fnStart = vracSrc.indexOf("function looksLikeGradlePluginId(fqcn) {");
    assert.ok(fnStart >= 0, "未能定位 looksLikeGradlePluginId，写法已变");
    let braceDepth = 0;
    let fnEnd = -1;
    for (let i = fnStart + "function looksLikeGradlePluginId(fqcn)".length; i < vracSrc.length; i++) {
      if (vracSrc[i] === "{") braceDepth++;
      else if (vracSrc[i] === "}") {
        braceDepth--;
        if (braceDepth === 0) {
          fnEnd = i + 1;
          break;
        }
      }
    }
    assert.ok(fnEnd > 0, "looksLikeGradlePluginId 大括号未配平，取不出函数体");
    const pluginLastLit = /const PLUGIN_ID_LAST = \/([\s\S]*?)\/([a-z]*);/.exec(vracSrc);
    assert.ok(pluginLastLit, "未能取出 PLUGIN_ID_LAST，写法已变");
    const looksLike = new Function(
      "PLUGIN_ID_LAST",
      `${vracSrc.slice(fnStart, fnEnd)}
       return looksLikeGradlePluginId;`,
    )(new RegExp(pluginLastLit[1], pluginLastLit[2]));
    // 必须跳过：Gradle 插件命名空间与小写尾段（包路径 / 方法引用）。前两条是旧子句实测漏判的假 issue 源
    for (const n of [
      "net.minecraftforge", // 末段 14 字符 >12 → 旧子句去核对它，forge/1.20.1 一条假 fqcn_not_in_cache
      "net.minecraftforge.gradle.liteloader",
      "net.fabricmc.fabric",
      "org.quiltmc.qsl",
      "net.fabricmc.fabric.api.client.keymapping.v1.KeyMappingHelper.registerKeyMapping",
      "net.neoforged.moddev",
    ]) {
      assert.ok(looksLike(n), `应跳过（不是类）却去核对：${n}`);
    }
    // 必须保留牙齿：真类名不得被顺手跳过
    for (const n of [
      "net.neoforged.neoforge.network.PayloadRegistrar",
      "net.minecraftforge.common.MinecraftForge",
      "net.fabricmc.fabric.api.itemgroup.v1.ItemGroupEvents",
    ]) {
      assert.ok(!looksLike(n), `真类名被当成插件 id 跳过 → 子句已失去牙齿：${n}`);
    }

    /* ── 7. extractPackages：不可读目录必须 throw（F97 第三处吞异常）────── */
    // processJar 只把 throw 折叠成 status:"failed"；返回 [] 会写成 status:"success" + packages:[] 的行，
    // 而 --resume 对 success/failed 一律跳过（batch-decompile.mjs:208）⇒ 一次 I/O 抖动永久固化成脏数据。
    const grabFn = (src, header) => {
      const start = src.indexOf(header);
      assert.ok(start >= 0, `未能定位 ${header}，脚本写法已变`);
      let depth = 0;
      for (let i = start + header.length; i < src.length; i++) {
        if (src[i] === "{") depth++;
        else if (src[i] === "}") {
          depth--;
          if (depth === 0) return src.slice(start, i + 1);
        }
      }
      assert.fail(`${header} 大括号未配平，取不出函数体`);
    };
    const pkgSegLit = /const PKG_SEG = \/([\s\S]*?)\/([a-z]*);/.exec(bdSrc);
    assert.ok(pkgSegLit, "未能取出 PKG_SEG，写法已变");
    const extractBody = [
      grabFn(bdSrc, "function collectPackage(outputDir, tld, depth)"),
      grabFn(bdSrc, "function extractPackages(outputDir)"),
    ].join("\n");
    assert.ok(
      extractBody.includes("throw new Error(`读取反编译产物目录失败"),
      "extractPackages 已不 throw，不可读目录会被写成 packages:[] 的 success 行（F97 回归）",
    );
    const mkExtract = (body) => {
      let tree = new Map();
      let broken = new Set();
      const fn = new Function(
        "existsSync", "readdirSync", "join", "RESOURCE_DIRS", "GENERIC_TLDS", "PKG_SEG",
        `${body}
         return extractPackages;`,
      )(
        (p) => tree.has(p),
        (p) => {
          if (broken.has(p)) throw Object.assign(new Error("EACCES: permission denied"), { code: "EACCES" });
          assert.ok(tree.has(p), `桩 FS 未登记该目录：${p}`);
          return tree.get(p).map((e) => ({ name: e.name, isDirectory: () => e.dir }));
        },
        (...segs) => segs.join("/").replace(/\/{2,}/g, "/"),
        RESOURCE_DIRS,
        GENERIC_TLDS,
        new RegExp(pkgSegLit[1], pkgSegLit[2]),
      );
      return { fn, set: (t, b) => { tree = t; broken = b; } };
    };
    const okTree = new Map([
      ["/out", [{ name: "net", dir: true }, { name: "top", dir: true }, { name: "gg", dir: true }, { name: "licenses", dir: true }, { name: "fabric.mod.json", dir: false }]],
      ["/out/net", [{ name: "darkhax", dir: true }]],
      ["/out/net/darkhax", [{ name: "bookshelf", dir: true }]],
      ["/out/top", [{ name: "theillusivec4", dir: true }]],
      ["/out/top/theillusivec4", [{ name: "caelus", dir: true }]],
      ["/out/gg", [{ name: "masters", dir: true }]],
      ["/out/gg/masters", [{ name: "gamemodes", dir: true }]],
      ["/out/licenses", []],
    ]);
    const harness = mkExtract(extractBody);
    harness.set(okTree, new Set());
    // 正常路径没被改坏：侧栏目录/文件照样跳过；GENERIC_TLDS 内的 tld 取 3 段，不在表内的只取 2 段
    // ——`gg.masters`（真包是 gg.masters.gamemodes）就是 README 那句「packages 是启发式截断」的实证。
    assert.deepEqual(
      harness.fn("/out"),
      ["gg.masters", "net.darkhax.bookshelf", "top.theillusivec4.caelus"],
      "extractPackages 正常路径结果变了（侧栏过滤或段数口径）",
    );
    harness.set(new Map(), new Set(["/out"]));
    assert.deepEqual(harness.fn("/out"), [], "目录不存在时应返回 []，不是 throw");
    harness.set(okTree, new Set(["/out"]));
    assert.throws(
      () => harness.fn("/out"),
      (err) => /读取反编译产物目录失败/.test(err.message) && err.message.includes("/out"),
      "不可读目录必须 throw 且消息点名目录（否则落进 failed 行的 error 无从定位）",
    );
    const poisonedExtract = extractBody.replace(
      /try \{ dirs = readdirSync\(outputDir, \{ withFileTypes: true \}\); \} catch \(err\) \{[\s\S]*?\n  \}/,
      "try { dirs = readdirSync(outputDir, { withFileTypes: true }); } catch { return []; }",
    );
    assert.ok(
      poisonedExtract !== extractBody && /catch \{ return \[\]; \}/.test(poisonedExtract),
      "投毒锚点未命中，脚本写法已变（该断言是摆设）",
    );
    const poisonedHarness = mkExtract(poisonedExtract);
    poisonedHarness.set(okTree, new Set(["/out"]));
    assert.deepEqual(
      poisonedHarness.fn("/out"),
      [],
      "投毒（改回吞成 []）后仍 throw → 上面那条不可读断言是摆设",
    );

    console.log(
      "  §S3 数据链: merge 拒绝 1 条目+身份 2 行+双跑幂等 / 冷启动仍拒 / 投毒(关归属检查)可失败；" +
        "bas 版本键 3.2.0+1.20.1 无哈希后缀 / 白名单正则两记投毒可失败；侧栏常量与判定子句实证；" +
        "extractPackages 不可读 throw（投毒回吞 [] 可失败）",
    );
  } finally {
    rmSync(S3, { recursive: true, force: true });
    assert.ok(!existsSync(S3), `§S3 摊位未收干净，残留：${S3}`);
    dropIfEmpty(GATE_SCRATCH);
  }
}

/**
 * §S4 · G1 库摘要身份与归属门：假根 + 八记投毒 + 真根台账复算。
 *
 * 这一门守的是「unknown-mod 坍缩 → 摘要冒领他方类 → catalog 冒领包名 → 模型照着别人的包名写 import」
 * 这条整链静默通道（F113 终裁：catalog 50 行外来包无一例外来自坍缩目录 —— 本门 A6 独立复算出同一批 50 行）。
 * S5 联网重建后端涨已归零：摘要侧冒领 385→0、unknown-mod 6→0，台账因此**留空但保留检查**，
 * 再冒领一个类即以「不在存量台账」红；catalog 侧剩 8 行（S5b 补取件后只剩 KfF 的无自身路径证据 jar，原 36 行（S5 未重建的库 + KfF 的 8 个 MOD_ID_UNKNOWN 键）
 * 逐行登记在 DEBT_CATALOG_FOREIGN，多一行少一行都红；36→8 由 S5b 完成，余 8 行待 prune 落地后清空。
 */
{
  const ANCHOR_S4 = "if (ownsPackage(e, p)) attestPackage(roots, e.id, p);";
  const GATE = fileURLToPath(new URL("./scripts/assert-lib-ownership.mjs", import.meta.url));
  const S4 = jpath(GATE_SCRATCH, "s4-lib-ownership");
  const w = (p, s) => {
    mkdirSync(dirname(p), { recursive: true });
    writeFileSync(p, s, "utf8");
  };
  const sum = (o) => JSON.stringify(o, null, 1);
  /** 自有类：root `net.darkhax.bookshelf` 含段 `bookshelf` ⇒ modIds:["bookshelf"] 段级自有 */
  const cleanSum = sum({
    slug: "bookshelf-lib",
    id: "authored/lib-bookshelf",
    modId: "bookshelf",
    source: { dirs: ["bookshelf/1.20.1"] },
    versions: { "1.20.1/forge": { classes: ["net.darkhax.bookshelf.Bookshelf", "net.darkhax.bookshelf.block.BlockBasicChest"] } },
  });
  /** 挂到 geckolib 条目（modIds:["geckolib"]）名下 ⇒ `net.darkhax.bookshelf` 非自有且被他条目凭证占有 = 冒领 */
  const foreignSum = (n) =>
    sum({
      slug: "geckolib",
      id: "authored/lib-geckolib",
      modId: "geckolib",
      source: { dirs: ["geckolib/1.19.1"] },
      versions: {
        "1.19.1/fabric": {
          classes: Array.from({ length: n }, (_, i) => `net.darkhax.bookshelf.cls.C${i}`),
        },
      },
    });
  const runGate = (env) =>
    spawnSync(process.execPath, [GATE], { env: { ...process.env, ...env }, encoding: "utf8", windowsHide: true });

  const cases = {
    clean: { "bookshelf-lib.json": cleanSum },
    foreignNewFile: { "poison-foreign.json": foreignSum(1) },
    foreignCountDrift: { "geckolib.json": foreignSum(1) },
    unjoined: { "no-such-lib.json": sum({ slug: "no-such", id: "authored/lib-nope", modId: "nope", source: { dirs: ["nope/1.20.1"] }, versions: { "1.20.1/forge": { classes: [] } } }) },
    unknownModDir: { "balm.json": sum({ slug: "balm", id: "authored/lib-balm", modId: "balm", source: { dirs: ["unknown-mod"] }, versions: { unknown: { classes: [] } } }) },
    sharedDir: {
      "balm.json": sum({ slug: "balm", id: "authored/lib-balm", modId: "balm", source: { dirs: ["caelus/1.20.1"] }, versions: { "1.20.1/forge": { classes: [] } } }),
      "bookshelf-lib.json": cleanSum.replace("bookshelf/1.20.1", "caelus/1.20.1"),
    },
  };
  const runs = {};
  try {
    for (const [name, fixtures] of Object.entries(cases)) {
      const root = jpath(S4, name);
      for (const [f, text] of Object.entries(fixtures)) w(jpath(root, "data", "lib-api-summaries", f), text);
      runs[name] = runGate({ MC_SKILL_LIB_OWN_TEST_ROOT: root });
      rmSync(root, { recursive: true, force: true });
    }
    // A5 锚点自证：把 writer 副本改名 / 抽掉凭证登记行，门必须报「writer 规则已变」而不是静默换规则
    const mergeSrc = readFileSync(jpath(import.meta.dirname, "..", "scripts", "merge-verified-api.mjs"), "utf8");
    const writerCases = {
      writerRenamed: mergeSrc.replace("function ownsPackage(entry, pkg)", "function ownsPackageX(entry, pkg)"),
      writerIndexLine: mergeSrc.replace(ANCHOR_S4, "attestPackage(roots, e.id, p);"),
    };
    assert.equal(writerCases.writerRenamed.includes("ownsPackageX"), true, "投毒锚点未命中：writer 写法已变");
    assert.equal(writerCases.writerIndexLine.includes(ANCHOR_S4), false, "投毒锚点未命中：凭证索引行写法已变");
    for (const [name, text] of Object.entries(writerCases)) {
      const p = jpath(S4, `${name}.mjs`);
      w(p, text);
      const root = jpath(S4, name);
      w(jpath(root, "data", "lib-api-summaries", "bookshelf-lib.json"), cleanSum);
      runs[name] = runGate({ MC_SKILL_LIB_OWN_TEST_ROOT: root, MC_SKILL_LIB_OWN_WRITER_SRC: p });
      rmSync(root, { recursive: true, force: true });
      rmSync(p, { force: true });
    }
    // A6 投毒：合成 catalog —— geckolib 条目冒领 bookshelf 已自有的包根（F113 的最后一跳）
    const catSrc = jpath(S4, "catalog-foreign.mjs");
    const fakeCatalog = [
      {
        id: "authored/lib-bookshelf",
        modIds: ["bookshelf"],
        modrinthSlug: "bookshelf-lib",
        verifiedApi: { "1.20.1/forge": { verifiedAt: "2026-09", packages: ["net.darkhax.bookshelf"], entrypoints: [] } },
      },
      {
        id: "authored/lib-geckolib",
        modIds: ["geckolib"],
        modrinthSlug: "geckolib",
        verifiedApi: { "1.20.1/forge": { verifiedAt: "2026-09", packages: ["net.darkhax.bookshelf"], entrypoints: [] } },
      },
    ];
    w(catSrc, `export const LIBRARY_CATALOG = ${JSON.stringify(fakeCatalog)};\n`);
    const cfRoot = jpath(S4, "catalogForeign");
    w(jpath(cfRoot, "data", "lib-api-summaries", "bookshelf-lib.json"), cleanSum);
    runs.catalogForeign = runGate({
      MC_SKILL_LIB_OWN_TEST_ROOT: cfRoot,
      MC_SKILL_LIB_OWN_CATALOG_SRC: catSrc,
    });
    rmSync(cfRoot, { recursive: true, force: true });
    rmSync(catSrc, { force: true });
    // 真数据根：台账层必须真的跑过（S5 清零后端涨即红）
    runs.realRoot = runGate({});
  } finally {
    rmSync(S4, { recursive: true, force: true });
    assert.ok(!existsSync(S4), `§S4-G1 摊位未收干净，残留：${S4}`);
    dropIfEmpty(GATE_SCRATCH);
  }

  assert.equal(runs.clean.status, 0, `G1 在干净假根上就红 = 投毒永远「通过」：\n${runs.clean.stdout}${runs.clean.stderr}`);
  assert.match(runs.clean.stdout, /冒领 0/, `干净假根没跑到零冒领：\n${runs.clean.stdout}`);
  const expect = (name, re, why) => {
    const r = runs[name];
    assert.notEqual(r.status, 0, `G1 漏掉「${name}」：${why}`);
    assert.match(r.stderr, re, `G1「${name}」红了但没点名（锚点 ${re}）：\n${r.stderr}`);
  };
  expect("foreignNewFile", /不在存量台账/, "新文件冒领他方类");
  expect("foreignCountDrift", /不在存量台账/, "S5 已把冒领台账排空 ⇒ 既有摘要文件再冒领一个类也必须红（零容忍）");
  expect("unjoined", /连不上 catalog 条目/, "摘要连不上条目 ⇒ 归属检查整体失效");
  expect("unknownModDir", /unknown-mod/, "非台账文件把产物落进 unknown-mod");
  expect("sharedDir", /被 2 个 slug 共用/, "同一棵反编译产物被两个 slug 冒领");
  expect("writerRenamed", /找不到 function ownsPackage/, "writer 归属规则改名后本门必须拒绝继续");
  expect("writerIndexLine", /凭证索引行/, "writer 凭证登记方式变了，索引构建失去同源保证");
  expect("catalogForeign", /catalog 冒领他方包根 1 行/, "catalog 条目冒领他方已证实包根 ⇒ 模型照它写 import（A6）");
  assert.equal(runs.realRoot.status, 0, `G1 真数据根必须绿（存量台账已钉死）：\n${runs.realRoot.stdout}${runs.realRoot.stderr}`);
  // 42 → 47 → 62 → 98 → 99（2026-09-16 第五/七次签字同步，非放松）：第二处机制独立钉仍保留硬值，
  // 与 `assert-lib-ownership.mjs` LEDGER.attestedRoots 同源。62→98 = 30 无树库重建批次的净 +362
  // verifiedApi 键；98→99 = 3 缺口库（libgui / server-translations / spruceui-obsidianui）补齐
  // 带出的 1 个新自有包根，全部 `ownsPackage` 自证（见该门 LEDGER 注释）。
  // 冒领 120 = pal.json 的**已登记存量**（DEBT_FOREIGN 点名 120 / DEBT_FOREIGN_ROOTS 点名真主
  // io.github.ladysnake → authored/lib-impersonate；纯 3 段根粒度问题，摘要本体归属无误）——
  // 本锚点钉两个事实：未登记冒领为 0（「台账已清空」）+ 登记存量恰为 120。
  assert.match(
    runs.realRoot.stdout,
    /冒领 120（台账已清空）[\s\S]*已证实包根 99[\s\S]*台账 checked/,
    `真根台账层没跑（G1 台账层必须真跑真根，且与 LEDGER 同源）：\n${runs.realRoot.stdout}`,
  );
  console.log(
    "  §S4 G1 归属门: 干净假根=0 / 真根=0（冒领 120 全部在册（pal 登记存量）· unknown-mod 0 · catalog 台账已清空 —— KfF 末 8 行由 merge-verified-api writer 侧剔除，非取件救回）；" +
      "投毒 新文件冒领·既有文件再冒领·连不上条目·unknown-mod·共用目录·writer 锚点×2 全红并点名",
  );
}

/**
 * §S4 · G2 解析器可用性门：假钉点根 + 八记投毒 + 真根复跑。
 *
 * 守的是「解析器解不出身份就兜个 unknown 写成 success 行」「不认识的语法整行丢掉不留痕迹」——
 * 两者都不报错，只有下游数据变脏（F113 的坍缩目录、依赖块蒸发后的假「无 MC 约束」）。
 * 本门的投毒面只能落在**源文笔钉**上（A 层行为取证打的是真 dist，改不动），
 * 所以每记投毒都拷一份源文件到 scratch 再改形；锚点未命中即当场断言失败，
 * 避免「源文件写法变了 → 投毒变成空操作 → 门假绿」。
 */
{
  const GATE = fileURLToPath(new URL("./scripts/assert-parser-availability.mjs", import.meta.url));
  const S4G2 = jpath(GATE_SCRATCH, "s4-parser-availability");
  const REPO = jpath(import.meta.dirname, "..");
  const PIN_RELS = [
    "scripts/batch-decompile.mjs",
    "mcp-server/src/decompile/services/toml-parse.ts",
    "mcp-server/src/decompile/services/mod-analyzer.ts",
    "mcp-server/src/decompile/services/mod-decompile.ts",
  ];
  const live = Object.fromEntries(
    PIN_RELS.map((relPath) => [relPath, readFileSync(jpath(REPO, ...relPath.split("/")), "utf8")]),
  );
  const MOD_ID_FALLBACK = 'modId: result.modId ?? meta.modId ?? "unknown",';
  const poison = (relPath, from, to, all = false) => {
    const src = live[relPath];
    const out = all ? src.split(from).join(to) : src.replace(from, to);
    assert.notEqual(out, src, `投毒锚点未命中（${relPath}）：${from} —— 写法已变，本记投毒是空操作`);
    return out;
  };
  const runGate = (env) =>
    spawnSync(process.execPath, [GATE], { env: { ...process.env, ...env }, encoding: "utf8", windowsHide: true });

  const cases = {
    clean: Object.fromEntries(PIN_RELS.map((p) => [p, live[p]])),
    unknownFallback: {
      ...Object.fromEntries(PIN_RELS.filter((p) => p !== PIN_RELS[0]).map((p) => [p, live[p]])),
      [PIN_RELS[0]]: (() => {
        const first = poison(PIN_RELS[0], "modId: idN.modId,", MOD_ID_FALLBACK);
        if (!first.includes("modId: idJ.modId,"))
          throw new Error("投毒锚点未命中（JiJ 行的 modId 赋值写法已变）");
        return first.replace("modId: idJ.modId,", MOD_ID_FALLBACK);
      })(),
    },
    requireModIdNeutered: {
      ...Object.fromEntries(PIN_RELS.filter((p) => p !== PIN_RELS[0]).map((p) => [p, live[p]])),
      [PIN_RELS[0]]: poison(PIN_RELS[0], "if (!identity.ok) {", "if (false) {"),
    },
    requireModIdLineDropped: {
      ...Object.fromEntries(PIN_RELS.filter((p) => p !== PIN_RELS[0]).map((p) => [p, live[p]])),
      [PIN_RELS[0]]: poison(
        PIN_RELS[0],
        ": requireModId(state, result.modId ?? meta.modId, jarPath,",
        ": result.modId, jarPath,",
      ),
    },
    evidenceRowDropped: {
      ...Object.fromEntries(PIN_RELS.filter((p) => p !== PIN_RELS[0]).map((p) => [p, live[p]])),
      [PIN_RELS[0]]: poison(PIN_RELS[0], "modIdEvidence: outcome.modIdEvidence,", "/* 证据链断开 */"),
    },
    externalEvidenceUnconfirmed: {
      ...Object.fromEntries(PIN_RELS.filter((p) => p !== PIN_RELS[3]).map((p) => [p, live[p]])),
      [PIN_RELS[3]]: poison(
        PIN_RELS[3],
        "if (ext.ok && packagesOwnModId(namesOf(), ext.modId)) externalId =",
        "if (ext.ok) externalId =",
      ),
    },
    inlineSilentDrop: {
      ...Object.fromEntries(PIN_RELS.filter((p) => p !== PIN_RELS[1]).map((p) => [p, live[p]])),
      [PIN_RELS[1]]: poison(PIN_RELS[1], "inlineSkipped.push(", "void ("),
    },
    inlineNotReturned: {
      ...Object.fromEntries(PIN_RELS.filter((p) => p !== PIN_RELS[1]).map((p) => [p, live[p]])),
      [PIN_RELS[1]]: poison(PIN_RELS[1], "return { sections, inlineSkipped };", "return { sections };"),
    },
    analyzerMutesWarning: {
      ...Object.fromEntries(PIN_RELS.filter((p) => p !== PIN_RELS[2]).map((p) => [p, live[p]])),
      [PIN_RELS[2]]: poison(PIN_RELS[2], "行内联表（本解析器不支持，已跳过）", "内联表"),
    },
    analyzerGuardGone: {
      ...Object.fromEntries(PIN_RELS.filter((p) => p !== PIN_RELS[2]).map((p) => [p, live[p]])),
      [PIN_RELS[2]]: poison(PIN_RELS[2], "if (toml.inlineSkipped.length) {", "if (0) {"),
    },
    argsGuardRegressed: {
      ...Object.fromEntries(PIN_RELS.filter((p) => p !== PIN_RELS[3]).map((p) => [p, live[p]])),
      [PIN_RELS[3]]: poison(PIN_RELS[3], "if (!args?.jarPath) {", "if (!args.jarPath) {"),
    },
    missingPin: Object.fromEntries(PIN_RELS.slice(1).map((p) => [p, live[p]])),
  };

  const runs = {};
  try {
    for (const [name, files] of Object.entries(cases)) {
      const root = jpath(S4G2, name);
      for (const [relPath, text] of Object.entries(files)) {
        const p = jpath(root, ...relPath.split("/"));
        mkdirSync(dirname(p), { recursive: true });
        writeFileSync(p, text, "utf8");
      }
      runs[name] = runGate({ MC_SKILL_PARSER_TEST_ROOT: root });
      rmSync(root, { recursive: true, force: true });
    }
    runs.realRoot = runGate({});
  } finally {
    rmSync(S4G2, { recursive: true, force: true });
    assert.ok(!existsSync(S4G2), `§S4-G2 摊位未收干净，残留：${S4G2}`);
    dropIfEmpty(GATE_SCRATCH);
  }

  assert.equal(
    runs.clean.status,
    0,
    `G2 在干净假钉点根上就红 = 投毒永远「通过」：\n${runs.clean.stdout}${runs.clean.stderr}`,
  );
  assert.match(runs.clean.stdout, /13 个 jar 夹具/, `假根上 A 层行为取证没跑（夹具层被跳过 ⇒ 绿是空的）：\n${runs.clean.stdout}`);
  const expect = (name, re, why) => {
    const r = runs[name];
    assert.notEqual(r.status, 0, `G2 漏掉「${name}」：${why}`);
    assert.match(r.stderr, re, `G2「${name}」红了但没点名（锚点 ${re}）：\n${r.stderr}`);
  };
  expect("unknownFallback", /仍用 `\?\? "unknown"` 兜底/, "解不出身份的 modId 又写成 success 行（merge 照收 → 坍缩目录）");
  expect("requireModIdNeutered", /解析不出必须抛错/, "requireModId 被掏空成 `if (false)`，兜底值照旧落盘");
  expect("requireModIdLineDropped", /两种写法都计入/, "一条成功行不再走 requireModId（三元分支写法）→ 兜底 modId 复活");
  expect("evidenceRowDropped", /每条产出行必须记身份来源/, "产出行少记一处身份来源 → 外部证据用过无从追查");
  expect("externalEvidenceUnconfirmed", /必须由 jar 自身条目证实/, "外部证据不再由 jar 条目自证 → 调用方可给任意 jar 命名");
  expect("inlineSilentDrop", /内联表跳过必须记账/, "不认识的语法退回整行静默丢弃");
  expect("inlineNotReturned", /必须把账目返回给上层/, "账记了但没交出去，上层永远看到空账");
  expect("analyzerMutesWarning", /必须转成 warning/, "记了账却不报警 = 等于没记");
  expect("analyzerGuardGone", /必须在有跳过时消费 inlineSkipped/, "消费点被摘成 `if (0)`，警告永不落地");
  expect("argsGuardRegressed", /缺参守卫必须是可选链/, "漏传整个 args 会裸抛 TypeError，宿主只看到无诊断的内部错误");
  expect("missingPin", /钉点文件不存在/, "钉点文件改名/搬迁后门必须拒绝继续，而不是扫不到就当通过");
  assert.equal(runs.realRoot.status, 0, `G2 真根必须绿：\n${runs.realRoot.stdout}${runs.realRoot.stderr}`);
  assert.match(runs.realRoot.stdout, /身份 13\/13 唯一[\s\S]*死码扫描 mcp-server\/src/, `真根少跑了层：\n${runs.realRoot.stdout}`);
  console.log(
    "  §S4 G2 解析器门: 干净假根=0 / 真根=0（13 夹具 · 身份唯一 · 死码扫描已跑）；投毒 11 记全红并点名：" +
      "unknown 兜底·掏空 requireModId·成功行少一处 requireModId·证据行少记·外部证据摘掉 jar 自证·静默丢行·账目未返回·哑警告·摘守卫·裸 args 访问·钉点缺失",
  );
}

/**
 * §S4 · G3 语料保真门：假根 + 七记投毒 + 台账层可红 + 真根复算。
 *
 * 这一门守的是「检索侧照样 ok:true，但正文本身已经坏了」这条静默通道：
 * `<<<` 占位符没展开（读者侧半截）、上游混淆名漏进正文、加工吃掉 `Foo<...>` 泛型签名、
 * processed 重名让按名取页取错类、加工吞页。假根只跑 A 层规则，数字台账只跑真根。
 */
{
  const GATE = fileURLToPath(new URL("./scripts/assert-corpus-faithfulness.mjs", import.meta.url));
  const S4G3 = jpath(GATE_SCRATCH, "s4-corpus-faithfulness");
  const w = (p, s) => {
    mkdirSync(dirname(p), { recursive: true });
    writeFileSync(p, s, "utf8");
  };
  const PAGE = "# Title\n\nProse.\n\n```java\nList<ItemStack> items = new ArrayList<>();\n```\n";
  const packOf = (root) => jpath(root, "fabric_9.9.9", "fabric-docs", "9.9.9");
  /** 干净树 = raw 与 processed 同字节（A 层对「加工改了什么」不设台账，只要求结构对得上）。 */
  const tree = (root, rel, processedBody, rawBody = processedBody) => {
    w(jpath(packOf(root), "raw", rel), rawBody);
    w(jpath(packOf(root), "processed", rel), processedBody);
  };
  const runGate = (env) =>
    spawnSync(process.execPath, [GATE], { env: { ...process.env, ...env }, encoding: "utf8", windowsHide: true });

  const cases = {
    clean: (r) => tree(r, "page.md", PAGE),
    // 围栏内的 class_1792 是代码语境，必须**不**报（防「门永远红」→ 又被放宽）
    cleanFenced: (r) => tree(r, "page.md", PAGE + "\n```\nclass_1792 method_1234\n```\n"),
    // 正例：blob 在镜像里且区段标记成对 ⇒ 读者能给出真代码，门必须绿
    cleanOnDiskRegion: (r) => {
      tree(r, "page.md", PAGE + "\n<<< @/reference/Example.java#seg\n");
      w(
        jpath(r, "fabric_9.9.9", "reference", "Example.java"),
        "public class Example {\n  // #region seg\n  int a = 1;\n  // #endregion seg\n}\n",
      );
    },
    // 反例：同一个区段名在 blob 里不存在 ⇒ 展开成 No lines matched.（空围栏），必须红并点名
    regionMissing: (r) => {
      tree(r, "page.md", PAGE + "\n<<< @/reference/Example.java#nope\n");
      w(jpath(r, "fabric_9.9.9", "reference", "Example.java"), "public class Example {\n  int a = 1;\n}\n");
    },
    directiveBadTarget: (r) => tree(r, "page.md", PAGE + "\n<<< reference/Example.java\n"),
    dupBasename: (r) => {
      tree(r, jpath("a", "page.md"), PAGE);
      tree(r, jpath("b", "page.md"), PAGE);
    },
    rawDrift: (r) => {
      tree(r, "page.md", PAGE);
      w(jpath(packOf(r), "processed", "page2.md"), PAGE);
    },
    // 反方向（2026-09-14 活例）：fetch 抓进 raw 的新页没人重跑生产者 ⇒ processed 少一页。
    procMissing: (r) => {
      tree(r, "page.md", PAGE);
      w(jpath(packOf(r), "raw", "page2.md"), PAGE);
    },
    intermediaryBare: (r) => tree(r, "page.md", PAGE + "\nReplace the old <yarn class_1792> object with yours.\n"),
    genericLoss: (r) => tree(r, "page.md", PAGE.replace("List<ItemStack> items", "List items"), PAGE),
    // A9 目录层（2026-09-15 新增）：树里出现目录空壳（写入者 mkdir 了却没写内容）。
    // 只加空目录、不加文件 ⇒ A1 计数不变，保证红的是 A9 而不是别的判据。
    emptyDir: (r) => {
      tree(r, "page.md", PAGE);
      mkdirSync(jpath(packOf(r), "processed", "emptyshell"), { recursive: true });
    },
    // A9 目录层：目录名是字节错解码产物（U+2594 方框绘制符 —— 实测那批的名字正是这种形状）。
    // raw/processed 两侧同名同文件 ⇒ A1/A2 都不动，红的只能是「名字」这一条。
    mojibakeDir: (r) => {
      w(jpath(packOf(r), "raw", "bad\u2594name", "page.md"), PAGE);
      w(jpath(packOf(r), "processed", "bad\u2594name", "page.md"), PAGE);
    },
  };
  const runs = {};
  try {
    for (const [name, build] of Object.entries(cases)) {
      const root = jpath(S4G3, name);
      build(root);
      runs[name] = runGate({ MC_SKILL_CORPUS_TEST_ROOT: root });
      rmSync(root, { recursive: true, force: true });
    }
    // 台账层（B）：只给 MC_SKILL_DATA、不给 TEST_ROOT ⇒ 门把假根当真根跑数字对账
    const ledgerRoot = jpath(S4G3, "ledger");
    tree(ledgerRoot, "page.md", PAGE);
    runs.ledgerDrift = runGate({ MC_SKILL_DATA: ledgerRoot });
    rmSync(ledgerRoot, { recursive: true, force: true });
    runs.realRoot = runGate({});
  } finally {
    rmSync(S4G3, { recursive: true, force: true });
    assert.ok(!existsSync(S4G3), `§S4-G3 摊位未收干净，残留：${S4G3}`);
    dropIfEmpty(GATE_SCRATCH);
  }

  for (const name of ["clean", "cleanFenced", "cleanOnDiskRegion"]) {
    assert.equal(runs[name].status, 0, `G3 在干净假根「${name}」上就红 = 投毒永远「通过」：\n${runs[name].stdout}${runs[name].stderr}`);
    assert.match(runs[name].stdout, /内容层（假根）/, `G3「${name}」没跑到 A 层：\n${runs[name].stdout}`);
  }
  const expect = (name, re, why) => {
    const r = runs[name];
    assert.notEqual(r.status, 0, `G3 漏掉「${name}」：${why}`);
    assert.match(r.stderr, re, `G3「${name}」红了但没点名（锚点 ${re}）：\n${r.stderr}`);
  };
  expect("regionMissing", /解析不出正文（区段名或行选对不上）/, "blob 在、区段名对不上 ⇒ 展开成空围栏而没有任何错误码");
  expect("directiveBadTarget", /目标形态异常/, "目标不是仓库绝对路径，展开与取件都无从下手");
  expect("dupBasename", /重名 basename/, "两个同名 processed 页 ⇒ 按名取页会取错文件");
  expect("rawDrift", /加工吞页或造页/, "processed 比 raw 多一页 ⇒ 加工造页/镜像错位");
  expect("procMissing", /raw 侧有新页未镜像/, "raw 比 processed 多一页 ⇒ 生产者没重跑，门必须给出重跑指引");
  expect("intermediaryBare", /正文外泄上游中介名/, "混淆名漏进正文 ⇒ 模型照抄 class_1792");
  expect("genericLoss", /个尖括号泛型在 processed 未原样存活/, "泛型签名被加工改掉 ⇒ 模型读到与上游不一致的签名");
  expect("ledgerDrift", /不在台账 ⇒ 新增\/改名树/, "台账层没咬住未登记树 ⇒ 数字对账形同虚设");
  expect(
    "emptyDir",
    /是 0 条目目录/,
    "树里出现目录空壳 ⇒ 新增的 A9 目录层判据必须咬住（2026-09-13 那批 5 个空壳在旧门下躺了 2 天，因为 A1–A5/A8 全是文件级）",
  );
  expect(
    "mojibakeDir",
    /目录名含非 ASCII \/ 控制字符/,
    "目录名是字节错解码产物 ⇒ 必须点名并给出码点，禁止只删不查",
  );
  assert.equal(runs.realRoot.status, 0, `G3 真数据根必须绿（存量台账已钉死）：\n${runs.realRoot.stdout}${runs.realRoot.stderr}`);
  assert.match(
    runs.realRoot.stdout,
    /49 棵 raw\/processed 树[\s\S]*处字节已在盘上[\s\S]*泛型丢失 0 · 重名 0[\s\S]*目录层 \d+ 个目录（0 条目 0 \/ 非法名 0）/,
    `真根少跑了层或台账口径变了：\n${runs.realRoot.stdout}`,
  );
  console.log(
    "  §S4 G3 语料保真门: 干净假根=0（含围栏内混淆名不报、区段标记齐全不报）/ 真根=0（49 树 · 633 处 <<< · 已取件处数逐档钉在台账 · 11 处正文中介名台账 · 目录层 1185 个目录全合法）；" +
      "投毒 10 记全红并点名：区段标记缺失·目标形态·重名页·造页·吞页（生产者未重跑）·正文中介名·吃泛型·台账层未登记树·目录空壳·目录名错解码",
  );
}

/**
 * §S4 · G4 索引与映射自洽门：造库夹具 + 十二记投毒 + 台账层可红 + 真根复算。
 *
 * 这一门守的是「台账与 sqlite 两份真相各说各话」：manifest 说 74 chunks 而库里 70（或反之）、
 * chunks_fts 与 chunks 不同源、命中的 doc_id 在 docs 里不存在、嵌入层整段为 0、
 * yarn 库 meta.methodCount 虚报。每一类在工具侧都只表现为「结果少一点 / 名字换一批」，
 * 全绿退出，所以逐类都要能被打红。
 */
{
  const GATE = fileURLToPath(new URL("./scripts/assert-index-consistency.mjs", import.meta.url));
  const S4G4 = jpath(GATE_SCRATCH, "s4-index-consistency");
  const { createHash } = await import("node:crypto");
  const { DatabaseSync } = await import("node:sqlite");
  const w = (p, s) => {
    mkdirSync(dirname(p), { recursive: true });
    writeFileSync(p, s, "utf8");
  };
  const relOf = (e) => `${e.platform}_${e.version}/${e.source}/${e.version}/semantic/db.sqlite`;
  const SEM_DDL = `
CREATE TABLE docs(doc_id TEXT PRIMARY KEY, title TEXT, url TEXT, tags_json TEXT, priority TEXT, section_count INTEGER);
CREATE TABLE chunks(chunk_id TEXT PRIMARY KEY, doc_id TEXT NOT NULL, chunk_type TEXT, chunk_order INTEGER, text TEXT);
CREATE VIRTUAL TABLE chunks_fts USING fts5(chunk_id UNINDEXED, text, tokenize = 'porter unicode61');
CREATE TABLE chunk_embeddings(chunk_id TEXT PRIMARY KEY, doc_id TEXT NOT NULL, embedding BLOB);
CREATE TABLE meta(key TEXT PRIMARY KEY, value TEXT);`;
  /** 造一个自洽的语义库，返回**与磁盘相符**的 manifest 条目（投毒时再由调用方改坏其中一项）。 */
  const makeIndex = (root, opt = {}) => {
    const e = { platform: "fabric", version: "1.20.4", source: "fabric-docs", ...opt };
    const abs = jpath(root, relOf(e));
    mkdirSync(dirname(abs), { recursive: true });
    const db = new DatabaseSync(abs);
    // 计数声明在 try 外（return 还要引用）；写库留在 try 内，关句柄兜在 finally。
    const docs = e.docs ?? 1;
    const chunks = e.chunks ?? 4;
    const embedded = e.embedded ?? chunks;
    const embeddable = e.embeddable ?? embedded;
    // 2026-09-17（用户终端实测 EBUSY 定案）：中途抛错（如残留摊位的「table already exists」）时
    // 不关句柄 ⇒ 本进程把随后的收摊 rmSync 锁成 EBUSY，且 finally 的新异常会顶掉原始错误。
    try {
      db.exec(SEM_DDL);
      for (let i = 0; i < docs; i++) {
        db.prepare("INSERT INTO docs(doc_id,title) VALUES(?,?)").run(`d${i}`, `t${i}`);
      }
      for (let i = 0; i < chunks; i++) {
        const doc = i < docs ? `d${i % docs}` : (e.orphan ? "ghost" : "d0");
        db.prepare("INSERT INTO chunks(chunk_id,doc_id,chunk_type,chunk_order,text) VALUES(?,?,?,?,?)").run(
          `c${i}`, doc, "prose", i, `body ${i}`,
        );
        if (i < chunks - (e.ftsMissing ?? 0)) db.prepare("INSERT INTO chunks_fts(chunk_id,text) VALUES(?,?)").run(`c${i}`, `body ${i}`);
        if (i < embedded) db.prepare("INSERT INTO chunk_embeddings(chunk_id,doc_id,embedding) VALUES(?,?,?)").run(`c${i}`, doc, Buffer.alloc(4));
      }
      db.prepare("INSERT INTO meta(key,value) VALUES('chunks',?)").run(String(chunks));
      db.prepare("INSERT INTO meta(key,value) VALUES('embedded',?)").run(String(embedded));
      if (!e.noEmbeddable) db.prepare("INSERT INTO meta(key,value) VALUES('embeddable',?)").run(String(embeddable));
    } finally {
      db.close();
    }
    return {
      platform: e.platform,
      version: e.version,
      source: e.source,
      path: relOf(e),
      chunks,
      embedded,
      sha256: createHash("sha256").update(readFileSync(abs)).digest("hex"),
    };
  };
  const makeYarn = (root, pack, opt = {}) => {
    const abs = jpath(root, pack, "mappings", "yarn-mappings.sqlite");
    mkdirSync(dirname(abs), { recursive: true });
    const db = new DatabaseSync(abs);
    // 同 makeIndex：关句柄必须兜在 finally（泄漏 = 自己锁死自己的收摊 rmSync）
    try {
      db.exec(`
CREATE TABLE classes(named TEXT PRIMARY KEY, intermediary TEXT, official TEXT);
CREATE TABLE methods(owner_named TEXT, name_named TEXT, descriptor_named TEXT, name_official TEXT, descriptor_official TEXT, name_intermediary TEXT);
CREATE TABLE fields(owner_named TEXT, name_named TEXT, descriptor_named TEXT, name_official TEXT, descriptor_official TEXT, name_intermediary TEXT);
CREATE TABLE meta(key TEXT PRIMARY KEY, value TEXT);`);
      const classes = opt.classes ?? 2;
      const methods = opt.methods ?? 3;
      const fields = opt.fields ?? 1;
      for (let i = 0; i < classes; i++) db.prepare("INSERT INTO classes VALUES(?,?,?)").run(`C${i}`, `ci${i}`, `co${i}`);
      for (let i = 0; i < methods; i++) db.prepare("INSERT INTO methods VALUES(?,?,?,?,?,?)").run("C0", `m${i}`, "()V", `mo${i}`, "()V", `mi${i}`);
      for (let i = 0; i < fields; i++) db.prepare("INSERT INTO fields VALUES(?,?,?,?,?,?)").run("C0", `f${i}`, "I", `fo${i}`, "I", `fi${i}`);
      for (const [k, v] of Object.entries({
        schemaVersion: String(opt.schema ?? 3),
        classCount: String(opt.metaClass ?? classes),
        methodCount: String(opt.metaMethod ?? methods),
        fieldCount: String(opt.metaField ?? fields),
        // A7-b 的合规默认：来源身份 = 仓库相对 POSIX + 内容哈希（投毒按 opt 改这两项）
        source: opt.absSource ? "H:\\MC_skill\\data\\fabric_1.20.4\\mappings\\yarn-tiny.gz" : `${pack}/mappings/yarn-tiny.gz`,
        ...(opt.dropSourceSha ? {} : { sourceSha256: "a".repeat(64) }),
      })) db.prepare("INSERT INTO meta VALUES(?,?)").run(k, v);
      if (!opt.dropMethodIdx) db.exec("CREATE INDEX idx_methods_official ON methods(name_official)");
      if (!opt.dropFieldIdx) db.exec("CREATE INDEX idx_fields_official ON fields(name_official)");
    } finally {
      db.close();
    }
  };
  const writeManifest = (root, entries) =>
    w(jpath(root, "semantic-index-manifest.json"), JSON.stringify({ built_at: "x", embedMode: "hybrid", entries }, null, 1));
  const runGate = (env) =>
    spawnSync(process.execPath, [GATE], { env: { ...process.env, ...env }, encoding: "utf8", windowsHide: true });

  const cases = {
    clean: (r) => writeManifest(r, [makeIndex(r)]),
    missingDb: (r) => {
      const e = makeIndex(r);
      rmSync(jpath(r, relOf(e)), { force: true });
      writeManifest(r, [e]);
    },
    unregisteredDb: (r) => {
      makeIndex(r);
      writeManifest(r, []);
    },
    vectorGap: (r) => {
      // 声明 4 块都该有向量，实际只落了 3 个 ⇒ 长块静默丢向量（F99 修法要咬住的就是这个）
      const e = makeIndex(r, { embedded: 3, embeddable: 4 });
      writeManifest(r, [e]);
    },
    vectorLayerUnprovable: (r) => {
      const e = makeIndex(r, { noEmbeddable: true });
      writeManifest(r, [e]);
    },
    countDrift: (r) => {
      const e = makeIndex(r);
      writeManifest(r, [{ ...e, chunks: e.chunks + 1 }]);
    },
    shaDrift: (r) => {
      const e = makeIndex(r);
      writeManifest(r, [{ ...e, sha256: "0".repeat(64) }]);
    },
    ftsDrift: (r) => writeManifest(r, [makeIndex(r, { ftsMissing: 1 })]),
    orphanChunk: (r) => writeManifest(r, [makeIndex(r, { orphan: true })]),
    emptyIndex: (r) => writeManifest(r, [makeIndex(r, { chunks: 0, embedded: 0 })]),
    residueFile: (r) => {
      writeManifest(r, [makeIndex(r)]);
      w(jpath(r, "fabric_1.20.4", "fabric-docs", "1.20.4", "semantic", "db.sqlite.tmp-999"), "half-written");
    },
    pathMismatch: (r) => {
      const e = makeIndex(r);
      writeManifest(r, [{ ...e, path: relOf({ ...e, version: "9.9.9" }) }]);
    },
    yarnCountDrift: (r) => {
      writeManifest(r, [makeIndex(r)]);
      makeYarn(r, "fabric_1.20.4", { metaMethod: 999 });
    },
    yarnMissingIndex: (r) => {
      writeManifest(r, [makeIndex(r)]);
      makeYarn(r, "fabric_1.20.4", { dropFieldIdx: true });
    },
    // A7-b（2026-09-14）：tracked 二进制里不许钉本机路径；来源字节必须可核对。
    yarnAbsSource: (r) => {
      writeManifest(r, [makeIndex(r)]);
      makeYarn(r, "fabric_1.20.4", { absSource: true });
    },
    yarnNoSourceSha: (r) => {
      writeManifest(r, [makeIndex(r)]);
      makeYarn(r, "fabric_1.20.4", { dropSourceSha: true });
    },
  };
  const runs = {};
  // 预清残留（2026-09-17）：上一轮失败（守卫拦截 / EBUSY）留下的摊位带**已建好的表**，而 SEM_DDL
  // 不带 IF NOT EXISTS ⇒ 不清就重建必抛「table already exists」，且泄漏的打开句柄会把下面 finally
  // 的收摊 rmSync 撞成 EBUSY（新异常顶掉原始错误）。先清，重建才幂等。
  rmSync(S4G4, { recursive: true, force: true, maxRetries: 10, retryDelay: 250 });
  try {
    for (const [name, build] of Object.entries(cases)) {
      const root = jpath(S4G4, name);
      build(root);
      runs[name] = runGate({ MC_SKILL_INDEX_TEST_ROOT: root });
      // 夹具含 semantic/yarn 的 db.sqlite：Windows 下（OneDrive/杀软/索引器）关闭后仍可能被
      // 短暂握住 ⇒ 收摊必须带重试（与 :430 java-spawn-cwd 收摊同一模式），否则 EBUSY 假红。
      rmSync(root, { recursive: true, force: true, maxRetries: 10, retryDelay: 250 });
    }
    // 台账层（B）：只给 MC_SKILL_DATA ⇒ 门把假根当真根，数字对账必须咬
    const ledgerRoot = jpath(S4G4, "ledger");
    writeManifest(ledgerRoot, [makeIndex(ledgerRoot)]);
    runs.ledgerDrift = runGate({ MC_SKILL_DATA: ledgerRoot });
    rmSync(ledgerRoot, { recursive: true, force: true, maxRetries: 10, retryDelay: 250 });
    runs.realRoot = runGate({});
  } finally {
    rmSync(S4G4, { recursive: true, force: true, maxRetries: 10, retryDelay: 250 });
    assert.ok(!existsSync(S4G4), `§S4-G4 摊位未收干净，残留：${S4G4}`);
    dropIfEmpty(GATE_SCRATCH);
  }

  assert.equal(runs.clean.status, 0, `G4 在干净假根上就红 = 投毒永远「通过」：\n${runs.clean.stdout}${runs.clean.stderr}`);
  assert.match(runs.clean.stdout, /内容层（假根）/, `G4 干净假根没跑到 A 层：\n${runs.clean.stdout}`);
  const expect = (name, re, why) => {
    const r = runs[name];
    assert.notEqual(r.status, 0, `G4 漏掉「${name}」：${why}`);
    assert.match(r.stderr, re, `G4「${name}」红了但没点名（锚点 ${re}）：\n${r.stderr}`);
  };
  expect("missingDb", /manifest 指向的库不存在/, "台账空指一个不存在的库 ⇒ 该档语义检索静默 0 命中");
  expect("unregisteredDb", /磁盘有库 .* 但 manifest 没有条目/, "建了库没登记 ⇒ 索引存在但没人查得到");
  expect("countDrift", /manifest\.chunks .*≠ 库内 COUNT/, "manifest 与库内行数各说各话");
  expect("vectorGap", /≠ 构建器声明的应嵌数/, "长块没拿到向量（或短块混进向量层）却没人报 ⇒ F99 的向量层缺口不再是可证明的");
  expect("vectorLayerUnprovable", /没有 meta\.embeddable/, "库不声明应嵌数 ⇒ 向量层缺口无法与「故意不嵌」区分");
  expect("shaDrift", /库文件 sha256 ≠ manifest\.sha256/, "库重建过而台账没跟着写");
  expect("ftsDrift", /chunks_fts .*≠ chunks/, "全文层与向量层不同源 ⇒ 关键词命中与向量命中不是同一批 chunk");
  expect("orphanChunk", /孤儿 chunk/, "命中能返回但 get_doc_full 取不到正文");
  expect("emptyIndex", /空索引且不在台账/, "整库空索引被当成有效索引");
  expect("residueFile", /索引目录残留/, "半截事务文件留在索引目录");
  expect("pathMismatch", /尾缀不等于规范路径/, "manifest.path 与自身的 platform/version/source 键不自洽");
  expect("yarnCountDrift", /meta\.methodCount .*≠ methods 实际/, "读侧直接信 meta ⇒ 映射覆盖数虚报");
  expect("yarnMissingIndex", /却缺索引 idx_fields_official/, "schema v3 缺 official 索引 ⇒ convert_mapping 反查只能吐 intermediary");
  expect("yarnAbsSource", /yarn meta 含本机绝对路径/, "tracked 二进制被钉上本机盘符 ⇒ 换机器/换卷就分裂，且 diff 噪声永久化");
  expect("yarnNoSourceSha", /缺 sourceSha256/, "来源折成相对路径后没哈希 ⇒ 「这个库出自哪一份字节」不可核对");
  expect("ledgerDrift", /manifest 条目数: 台账 60 ≠ 实扫 1/, "台账层没咬住假根 ⇒ 数字对账形同虚设");
  assert.equal(runs.realRoot.status, 0, `G4 真数据根必须绿（存量台账已钉死）：\n${runs.realRoot.stdout}${runs.realRoot.stderr}`);
  assert.match(
    runs.realRoot.stdout,
    /60 库 · Σchunks \d+ · Σembedded \d+ · sha256 全对账 · 孤儿 chunk 0[\s\S]*台账层已跑/,
    `真根少跑了层：\n${runs.realRoot.stdout}`,
  );
  console.log(
    "  §S4 G4 索引自洽门: 干净假根=0 / 真根=0（60 库 · Σchunks 34029 · Σembedded 25630 · sha256 全对 · 2 纯FTS + 7 空库 + 5 计数虚报全在台账）；" +
      "投毒 16 记全红并点名：库缺失·未登记·计数漂移·sha 过期·fts 不同源·向量层缺口·向量层不可证明·孤儿 chunk·空库·残留·路径错档·yarn 计数·缺索引·二进制钉本机路径·来源哈希缺失·台账层",
  );
}

// ── 中文路径 / 同步卷：目录级递归 cpSync 唯一出口门 ────────────────────────────
// 这不是风格门。`cpSync(dir, dir, {recursive:true})` 在本工作区（OneDrive + 非 ASCII 路径）
// 上会让 node 进程以 0xC0000409（STATUS_STACK_BUFFER_OVERRUN）静默消失：无异常、无栈、
// catch 不住，实测 0/5；带 filter 或手工 walk+copyFileSync 各 5/5 正常。
// 它曾让 test-core 在 testScaffoldWrappers → mirrorScaffolds 处整进程蒸发（退出码 127）。
{
  const fs = await import("node:fs");
  const CPSYNC_GATE = jpath(import.meta.dirname, "scripts", "assert-no-recursive-cpsync.mjs");
  const sandbox = `${GATE_SCRATCH}/cpsync`;
  fs.rmSync(sandbox, { recursive: true, force: true });
  try {
    const runOn = (files) => {
      const root = `${sandbox}/${Object.keys(files)[0].replace(/\W/g, "")}-${Math.random().toString(36).slice(2, 7)}`;
      for (const [name, body] of Object.entries(files)) {
        const abs = `${root}/${name}`;
        fs.mkdirSync(abs.slice(0, abs.lastIndexOf("/")), { recursive: true });
        fs.writeFileSync(abs, body);
      }
      return spawnSync(process.execPath, [CPSYNC_GATE], {
        env: { ...process.env, MC_SKILL_CPSYNC_TEST_ROOT: root },
        encoding: "utf8",
        windowsHide: true,
      });
    };
    const real = spawnSync(process.execPath, [CPSYNC_GATE], { encoding: "utf8", windowsHide: true });
    assert.equal(real.status, 0, `递归 cpSync 门在真仓库就红：\n${real.stdout}${real.stderr}`);
    const bare = runOn({ "a.js": 'import { cpSync } from "node:fs";\ncpSync("a", "b", { recursive: true });\n' });
    assert.notEqual(bare.status, 0, "裸递归 cpSync 放过去了 ⇒ 门没牙");
    assert.match(bare.stderr, /目录级递归 cpSync/, "裸递归红了但没点名");
    const byFilter = runOn({ "b.js": 'import { cpSync } from "node:fs";\ncpSync("a", "b", { recursive: true, filter: () => true });\n' });
    assert.notEqual(byFilter.status, 0, "靠 filter 绕开的写法放过去了");
    assert.match(byFilter.stderr, /filter/, "filter 绕法红了但没点名");
    const noImport = runOn({ "c.js": "const n = copyTree(\"a\", \"b\");\n" });
    assert.notEqual(noImport.status, 0, "用了 copyTree 却没 import 放过去了");
    assert.match(noImport.stderr, /没有 import/, "无 import 红了但没点名");
    const legal = runOn({
      "d.js":
        'import { copyTree } from "../../scripts/_lib/copy-tree.mjs";\nimport { cpSync } from "node:fs";\ncopyTree("a", "b");\ncpSync("a", "b");\nconst z = { recursive: true };\n',
    });
    assert.equal(legal.status, 0, `合法写法被误报：\n${legal.stdout}${legal.stderr}`);
    console.log(
      "  中文路径门 assert-no-recursive-cpsync: 真根=0 · 假根投毒 3 记全红并点名（裸递归 / filter 绕法 / copyTree 无 import）· 合法写法不误报",
    );
  } finally {
    fs.rmSync(sandbox, { recursive: true, force: true, maxRetries: 8 });
    assert.ok(!fs.existsSync(sandbox), `§cpsync 门摊位未收干净：${sandbox}`);
    dropIfEmpty(GATE_SCRATCH);
  }
}

/**
 * §S4 · 门串链：每个 `scripts/assert-*.mjs` 都必须被某个 `test-*.mjs` 或 `package.json` 的 test 链引用。
 *
 * 一道没人跑的门比没有门更糟：它本地手跑绿、CI 也「绿」，但坏数据照样入库。
 * 四门（G1–G4）都是这个形状，所以把「可达性」本身钉成断言。
 */
{
  const { readdirSync } = await import("node:fs");
  const SCRIPTS = jpath(import.meta.dirname, "scripts");
  const gates = readdirSync(SCRIPTS).filter((f) => /^assert-.*\.mjs$/.test(f)).sort();
  const tests = readdirSync(import.meta.dirname).filter((f) => /^test-.*\.mjs$/.test(f));
  const blob = tests.map((t) => readFileSync(jpath(import.meta.dirname, t), "utf8")).join("\n");
  const pkg = readFileSync(jpath(import.meta.dirname, "package.json"), "utf8");
  const findOrphans = (needleIn, pkgIn) =>
    gates.filter((g) => !needleIn.includes(g) && !pkgIn.includes(g));
  const orphans = findOrphans(blob, pkg);
  assert.equal(orphans.length, 0, `以下门禁没有任何调用方 ⇒ 手跑绿也不会进 npm test：\n${orphans.join("\n")}`);
  // 反身自证：抽掉一个门的引用，本条必须红（否则「串链」这句 itself 也是永远绿的）
  const probe = gates[0];
  assert.ok(
    findOrphans(blob.replace(probe, ""), pkg.replace(probe, "")).includes(probe),
    `门串链断言打不红（删掉 ${probe} 的引用后仍然全绿）`,
  );
  console.log(
    `  §S4 门串链: ${gates.length} 道 assert-* 全部可达（${tests.length} 个 test-*.mjs + package.json test 链）；` +
      `抽掉任一门的引用即红（自证已跑）`,
  );
}

/**
 * §S18/S19 · 两道新门的**真跑**（不只是被字符串引用骗过门串链）。
 * 串链断言只保证「有人提到这门」，这里保证「npm test 真的跑过它一次」。
 */
{
  const { spawnSync } = await import("node:child_process");
  const { fileURLToPath } = await import("node:url");
  for (const gate of [
    "./scripts/assert-forge-1204-material.mjs",
    // sweep81 C-6：Properties 形态**族 × 版本区间**门（正反两面；补 1.18.2/1.19.4 反向面）。
    "./scripts/assert-forge-blockshape-family.mjs",
    // sweep81 C-2：审计结论机读清单门骨架（登记的不变量必须点名一道存在且被本文件真跑的门）。
    "./scripts/assert-rule-ledger.mjs",
    "./scripts/assert-scaffold-rules-conflict.mjs",
    // S20 的一次性脚本 temp/f146-gate.mjs 已并入门族（2026-09-13 裁定）；这里真跑它。
    "./scripts/assert-forge-1182-registry-consts.mjs",
    // S32：NeoForge LEGACY 共享树的检索隔离门（归档路径出现在正常命中里即红）。
    "./scripts/assert-legacy-isolation.mjs",
    // S25a：Fabric scaffold 自洽门（expand 键 ⊇ 占位符 / 声明指向的档存在 / 入口类可解析 / wrapper 三件 / 注释依赖未被 import）。
    "./scripts/assert-scaffold-selfcheck.mjs",
    // S34：community_knowledge 豁免台账与解释文件双向对齐（豁免条目原文必须仍在盘上）。
    "./scripts/assert-community-attribution.mjs",
    // S30：quilt 规则正文与工具真实回载荷三态口径同源（含禁用形态 + 配对判据活性自证）。
    "./scripts/assert-rules-match-tool.mjs",
    // 2026-09-14：api-index 类名必须与本档实钉通道一致（1.16.5 的 official 不映射类名，FG #795）。
    "./scripts/assert-index-channel-layout.mjs",
  ]) {
    const GATE = fileURLToPath(new URL(gate, import.meta.url));
    const r = spawnSync(process.execPath, [GATE], {
      encoding: "utf8",
      windowsHide: true,
      env: { ...process.env },
    });
    assert.equal(
      r.status,
      0,
      `${gate} 真跑失败（rc=${r.status}）：\n${String(r.stdout || "").slice(0, 800)}${String(r.stderr || "").slice(0, 400)}`,
    );
  }
  // sweep81 C-6/C-2 附带的诚实性修正：此处原写死「共 7 道」（且逐名枚举），加入新门后立刻陈旧。
  // 按本仓规矩（CONTRIBUTING:212「文档不重述会腐烂的计数，只述口径」）去掉计数与逐名枚举：
  // 真跑面以**上面那个数组**为唯一权威，数组里每一道都在本块内被 assert.equal(rc,0) 咬住。
  console.log("  §S18/S19/S20/S25a/S30/S32/S34 新门真跑: 本块清单逐道 rc=0（含 sweep81 新增 blockshape-family 与 rule-ledger；权威=上方数组）");
}

/**
 * §A5/§idx · 两个 2026-09-14 新层的**投毒自检**：判死符号台账（A5）与 api-index 通道布局。
 * 每例先证明基线绿，再证明改一处必红 —— 门不投毒，就不知道它是否还活着。
 */
{
  const { spawnSync } = await import("node:child_process");
  const { mkdtempSync, writeFileSync, readFileSync } = await import("node:fs");
  const { tmpdir } = await import("node:os");
  const { fileURLToPath } = await import("node:url");
  const tmp = mkdtempSync(`${tmpdir()}\\mcp-gate-poison-`);
  const runGate = (rel, env) =>
    spawnSync(process.execPath, [fileURLToPath(new URL(rel, import.meta.url))], {
      encoding: "utf8",
      windowsHide: true,
      env: { ...process.env, ...env },
    });
  const expect = (label, rc, want) => assert.equal(rc, want, `${label}: rc=${rc} 期望 ${want}`);

  // A5 · 判死符号台账
  const LED = fileURLToPath(new URL("./scripts/data/scaffold-banned-symbols.json", import.meta.url));
  const led = JSON.parse(readFileSync(LED, "utf8"));
  const pk = Object.keys(led.packs)[0];
  const sym = Object.keys(led.packs[pk])[0];
  const p1 = `${tmp}\\led-missing.json`;
  const o1 = JSON.parse(JSON.stringify(led));
  delete o1.packs[pk][sym];
  writeFileSync(p1, JSON.stringify(o1));
  const p2 = `${tmp}\\led-ghost.json`;
  const o2 = JSON.parse(JSON.stringify(led));
  o2.packs[pk].GhostSymbolForPoison = "01-registry.mdc:1";
  writeFileSync(p2, JSON.stringify(o2));
  const p3 = `${tmp}\\led-anchor.json`;
  const o3 = JSON.parse(JSON.stringify(led));
  o3.packs[pk][sym] = "02-block.mdc:9999";
  writeFileSync(p3, JSON.stringify(o3));
  const G = "./scripts/assert-scaffold-rules-conflict.mjs";
  expect("A5 台账基线", runGate(G, { MC_SKILL_SCAFFOLD_SYMBOL_LEDGER: LED }).status, 0);
  for (const [tag, p] of [["少记", p1], ["多记", p2], ["锚点挪位", p3]]) {
    expect(`A5 判死符号台账投毒（${tag}）`, runGate(G, { MC_SKILL_SCAFFOLD_SYMBOL_LEDGER: p }).status, 1);
  }

  // api-index · 通道类名布局
  const IDX = fileURLToPath(new URL("../data/forge_1.16.5/extracted/api-index.json", import.meta.url));
  const idx = JSON.parse(readFileSync(IDX, "utf8"));
  const q1 = `${tmp}\\idx-mojangpath.json`;
  const i1 = { ...idx };
  i1["net/minecraft/world/level/Level"] = idx["net/minecraft/world/World"];
  writeFileSync(q1, JSON.stringify(i1));
  const q2 = `${tmp}\\idx-renamed.json`;
  const i2 = { ...idx };
  delete i2["net/minecraft/data/loot/BlockLootTables"];
  i2["net/minecraft/data/loot/BlockLoot"] = { methods: [], fields: [] };
  writeFileSync(q2, JSON.stringify(i2));
  const q3 = `${tmp}\\idx-anchor.json`;
  const i3 = { ...idx };
  delete i3["net/minecraft/loot/ItemLootEntry"];
  writeFileSync(q3, JSON.stringify(i3));
  const H = "./scripts/assert-index-channel-layout.mjs";
  expect("idx 布局基线", runGate(H, { MC_SKILL_INDEX_LAYOUT_TEST_INDEX: IDX }).status, 0);
  for (const [tag, p] of [["注入 Mojang 专属类", q1], ["改名 BlockLootTables", q2], ["删锚点", q3]]) {
    expect(`api-index 通道布局投毒（${tag}）`, runGate(H, { MC_SKILL_INDEX_LAYOUT_TEST_INDEX: p }).status, 1);
  }
  console.log(
    "  §A5/§idx 投毒自检: 判死符号台账（基线绿 + 少记/多记/锚点挪位 3 记必红）· api-index 通道布局（基线绿 + Mojang 类注入/改名/删锚点 3 记必红）",
  );
}

/**
 * S9 · javadoc 落盘冲突计划（F123 根因侧）的负例测。
 *
 * 抓取器已用 planClassWrites 在写盘前摊开两类重复来源，但仓库里没有任何测试引用它：
 * 没有测试的修复等于没修，下次改抓取器时没人知道这条约束存在。
 * 历史包袱是盘上 1,490 个带空格括号后缀的 .md（旧自动改名产物，删除归数据拥有者）。
 */
{
  const { planClassWrites } = await import("./scripts/fetch-forge-javadoc.js");
  const fails = [];
  const push = (name, fn) => {
    try {
      fn();
      console.log("  \u2714 S9 " + name);
    } catch (e) {
      fails.push(name + " :: " + e.message);
      console.log("  \u2718 S9 " + name + "\n      " + e.message);
    }
  };
  const dupUrl = [
    { name: "Foo", absUrl: "http://x/net/minecraft/Foo.html" },
    { name: "Foo", absUrl: "http://x/net/minecraft/Foo.html" },
  ];
  push('同 URL 出现两次只写一遍', () => {
    const r = planClassWrites(dupUrl);
    assert.equal(r.writes.length, 1, JSON.stringify(r.writes));
  });
  const diffUrlSameName = [
    { name: "Bar", absUrl: "http://x/p1/Bar.html" },
    { name: "Bar", absUrl: "http://x/p2/Bar.html" },
  ];
  push('异 URL 同名两份并存且后缀确定、无空格括号', () => {
    const a = planClassWrites(diffUrlSameName);
    const b = planClassWrites(diffUrlSameName);
    assert.equal(a.writes.length, 2, "冲突被吞掉，之后又会互相覆盖");
    const names = a.writes.map((w) => w.fileName);
    assert.equal(new Set(names).size, 2, "两个 writes 落在同一文件名：" + names.join(","));
    for (const n of names) {
      assert.ok(!/ \(\d+\)/.test(n), "复现了历史上的空格括号形态：" + n);
      assert.ok(/^[A-Za-z0-9_.~-]{1,120}\.md$/.test(n), "后缀不是纯 ASCII 定长片段：" + n);
    }
    assert.match(names[1], /~[0-9a-z]{1,6}\.md$/, "冲突后缀必须是 `~` + 短哈希（换成可读后缀即回到历史形态）");
    assert.deepEqual(names, b.writes.map((w) => w.fileName), "后缀不确定：同一输入两次结果不同");
    assert.ok(a.conflicts.length >= 1, "冲突没记进台账");
  });
  push('只差大小写的类名在大小写不敏感卷上也不互相覆盖', () => {
    const r = planClassWrites([
      { name: "Foo", absUrl: "http://x/p/Foo.html" },
      { name: "foo", absUrl: "http://x/p/foo.html" },
    ]);
    assert.equal(r.writes.length, 2, JSON.stringify(r.writes));
    const lower = r.writes.map((w) => w.fileName.toLowerCase());
    assert.equal(new Set(lower).size, 2, "仍会在不敏感卷上合并：" + r.writes.map((w) => w.fileName).join(","));
  });
  push('抓取器被 import 时不启动联网爬取', () => {
    // 三个抓取器都在顶层读 argv 并带副作用（爬网 / mkdir / process.exit）。
    // 本文件就 import 其中一个 ⇒ 没有直跑守卫时，npm test 等于真爬外网并写 data/。
    for (const f of ["fetch-forge-javadoc.js", "fetch-fabric-wiki.js", "fetch-liteloader-wiki.js"]) {
      const src = readFileSync(jpath(dirname(fileURLToPath(import.meta.url)), "scripts", f), "utf8");
      assert.match(src, /const invokedDirectly =/, `${f} 直跑守卫被摘掉 ⇒ import 它就等于 npm test 真爬外网/写 data/`);
      assert.ok(!/^main\(\)/m.test(src), `${f} 又出现裸的顶层 main() 调用 ⇒ 守卫形同虚设`);
    }
  });
  assert.equal(fails.length, 0, "planClassWrites 回归：\n" + fails.join("\n"));
  console.log("  S9 javadoc 冲突计划: 4 组负例全过（同 URL 去重 / 异 URL 确定后缀 / 大小写共存 / import 不触发爬取）");
}
console.log("script helper regression tests passed");
