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
  compareMcVersions,
} = await import("./scripts/probe-neoforge-versions.js");
const { readFileSync, readdirSync } = await import("node:fs");
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
// 2026-09-21（F1 修复配套）：probePrimers 不再只走 PRIMER_CONFIG，而是「上游 primer 索引页枚举 ∪ 表」。
// 所以表外 primer 从「一律算漂移」变成「合法，但必须逐字段证明确实由枚举规则生成」——
// 比旧断言更严：旧断言只挡"表里没有"，新断言还挡"有人手改了 manifest 里的 url/from/to"。
const primerUrlFor = (v) => `https://docs.neoforged.net/primer/docs/${v}/`;
const primerKeysSorted = Object.keys(NEO_MANIFEST.primers ?? {}).sort(compareMcVersions);
for (const [v, p] of Object.entries(NEO_MANIFEST.primers ?? {})) {
  const cfg = NEO_PRIMERS.find((x) => x.version === v);
  if (!cfg) {
    if (String(p.url) !== primerUrlFor(v)) {
      neoDrift.push(`primer ${v} 不在 PRIMER_CONFIG，且 url=${p.url} 不符合上游枚举规则 ${primerUrlFor(v)}`);
    }
    const i = primerKeysSorted.indexOf(v);
    const wantFrom = i > 0 ? primerKeysSorted[i - 1] : null;
    if (String(p.from) !== String(wantFrom)) {
      neoDrift.push(`primer ${v}.from=${p.from} ≠ 枚举数值序前一篇 ${wantFrom}`);
    }
    if (String(p.to) !== String(v)) neoDrift.push(`primer ${v}.to=${p.to} ≠ 版本名 ${v}`);
    continue;
  }
  for (const key of ["url", "from", "to"]) {
    if (String(cfg[key]) !== String(p[key])) neoDrift.push(`primer ${v}.${key}: 生成源 ${cfg[key]} ≠ 产物 ${p[key]}`);
  }
}
// 盘上 primer 文件必须在 manifest 里有登记，否则抓取链一次都刷不到（2026-09-21 实测曾漏 12 篇）。
for (const f of readdirSync(new URL("../data/neoforge_primers/", import.meta.url)).filter((x) => x.endsWith(".md"))) {
  const v = f.replace(/\.md$/, "");
  if (!NEO_MANIFEST.primers?.[v]) neoDrift.push(`盘上 primer ${v} 不在 manifest.primers → 当前链刷新不到，只会静默变陈`);
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

// ── #14a（S16/t9，第 46 轮）：gate 自带 --selftest —— 判据核本身会红吗？──────
// 下面那个外部块证的是「把真 gate 放到投毒仓库上会红」；它证不了两处「能悄悄绿」的判定核
// （skip 即 exit 0 / 采集器吐空数组时 0===0）有没有被做没。自检全内存、不 spawn powershell、
// 不落盘，所以非 Windows 机器同样能跑 —— 放在 psProbe 分支之前。
{
  const st = spawnSync(process.execPath, [PS_GATE, "--selftest"], {
    encoding: "utf8",
    windowsHide: true,
  });
  assert.equal(st.status, 0, `assert-powershell --selftest 未通过：\n${st.stdout}${st.stderr}`);
  const m = /(\d+) 例（(\d+) 投毒必红 \+ (\d+) 反退化断言 \+ (\d+) 正对照）/.exec(st.stdout || "");
  assert.ok(m, `--selftest 没打印三桶计数（例数塌陷 = 自检被掏空）：\n${st.stdout}`);
  const [total, poisonN, assertN, controlN] = m.slice(1).map(Number);
  assert.ok(poisonN >= 12, `--selftest 投毒例只剩 ${poisonN}（下界 12）—— 腿 2 的 collector-zero 覆盖不许缩`);
  assert.ok(assertN >= 5, `--selftest 反退化断言只剩 ${assertN}（下界 5）—— 腿 1 的 skip≠pass 覆盖不许缩`);
  assert.ok(controlN >= 5, `--selftest 正对照只剩 ${controlN}（下界 5）—— 没有对照就无法排除恒红装饰`);
  console.log(
    `  assert-powershell --selftest: ${total} 例（投毒 ${poisonN} / 反退化 ${assertN} / 对照 ${controlN}）rc=0`,
  );
}

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
    // R50 腿一（`L59`-C 具名豁免表的默认腿）：`<<<` 的 blob 不在盘上、又没点名进
    // MISSING_BLOB_ALLOWLIST ⇒ 必红并点名。旧行为是静默 `continue`，于是「取件链整体退化」
    // 和「上游真没有这个件」在门里长得一模一样，读者只拿到 Not Found/空围栏。
    missingBlob: (r) => {
      tree(r, "page.md", PAGE + "\n<<< @/reference/Ghost.java#seg\n");
    },
    // R50 腿二：采集面塌 0 —— 假根建了却一棵树都没有 ⇒ 必须红。假根模式下台账层整层跳过，
    // 没有这道地板时「夹具没写页」会空跑成绿（同 `L58` 欠账二「跑绿 ≠ 验过」）。
    collectorZero: (r) => {
      mkdirSync(r, { recursive: true });
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
  expect(
    "missingBlob",
    /镜像 blob 不在盘上/,
    "取件缺口被静默放过 ⇒ 读者只拿到 Not Found/空围栏而门全绿（R50 起默认必红，点名进 MISSING_BLOB_ALLOWLIST 才免）",
  );
  expect(
    "collectorZero",
    /COLLECTOR_RETURNED_ZERO/,
    "采集面塌 0 还绿 = 判据根本没吃到输入，投毒夹具会从此永久假绿",
  );
  assert.equal(runs.realRoot.status, 0, `G3 真数据根必须绿（存量台账已钉死）：\n${runs.realRoot.stdout}${runs.realRoot.stderr}`);
  assert.match(
    runs.realRoot.stdout,
    /49 棵 raw\/processed 树[\s\S]*处字节已在盘上[\s\S]*泛型丢失 \d+ · 重名 0[\s\S]*目录层 \d+ 个目录（0 条目 0 \/ 非法名 0）/,
    `真根少跑了层或台账口径变了：\n${runs.realRoot.stdout}`,
  );
  console.log(
    "  §S4 G3 语料保真门: 干净假根=0（含围栏内混淆名不报、区段标记齐全不报）/ 真根=0（49 树 · 633 处 <<< · 取件缺口 0 · 已取件处数逐档钉在台账 · 11 处正文中介名台账 · 目录层 1185 个目录全合法）；" +
      "投毒 12 记全红并点名：区段标记缺失·目标形态·重名页·造页·吞页（生产者未重跑）·正文中介名·吃泛型·台账层未登记树·目录空壳·目录名错解码·blob 缺失未具名·采集面塌 0",
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
  // 生产侧台账条目数**从 G4 源码里读**（G4 无 main guard，import 即执行门本体 ⇒ 禁止 import，只能按文本取）。
  // 这里原先写死 `台账 60`：⑤ 拆树把 entries 重签成 61，本锚点立刻以「匹配不上」的形式红，
  // 且红得像是门坏了。硬钉的分母一浮动，锚点就得跟着浮动 —— 否则每次重签都要顺手改 harness，
  // 而"顺手改 harness"正是本仓禁止的那种变绿路径。
  const G4_SRC = readFileSync(fileURLToPath(new URL("./scripts/assert-index-consistency.mjs", import.meta.url)), "utf8");
  const G4_ENTRIES = Number(/entries:\s*(\d+),\s*chunks:/.exec(G4_SRC)?.[1]);
  assert.ok(
    Number.isInteger(G4_ENTRIES) && G4_ENTRIES > 0,
    `从 G4 源码读不到 LEDGER_SUM.entries（实得 ${G4_SRC.match(/entries:[^\n]*/)?.[0] ?? "无"}）⇒ 锚点不许退化成恒匹配`,
  );
  expect("ledgerDrift", new RegExp(`manifest 条目数: 台账 ${G4_ENTRIES} ≠ 实扫 1`), "台账层没咬住假根 ⇒ 数字对账形同虚设");
  assert.equal(runs.realRoot.status, 0, `G4 真数据根必须绿（存量台账已钉死）：\n${runs.realRoot.stdout}${runs.realRoot.stderr}`);
  assert.match(
    runs.realRoot.stdout,
    new RegExp(`${G4_ENTRIES} 库 · Σchunks \\d+ · Σembedded \\d+ · sha256 全对账 · 孤儿 chunk 0[\\s\\S]*台账层已跑`),
    `真根少跑了层：\n${runs.realRoot.stdout}`,
  );
  // 本行**不再重述**库数/chunks/embedded（那些数每重签一次就烂一次，且烂成"看起来像门说的"）：
  // 直接把门自己那一行原样念出来，口径唯一。
  console.log(
    `  §S4 G4 索引自洽门: 干净假根=0 / 真根=0 —— 门自报「${runs.realRoot.stdout.trim().split("\n")[0]}」；` +
      `判据层从门源码取台账 entries=${G4_ENTRIES}；投毒 16 记全红并点名：库缺失·未登记·计数漂移·sha 过期·fts 不同源·向量层缺口·向量层不可证明·孤儿 chunk·空库·残留·路径错档·yarn 计数·缺索引·二进制钉本机路径·来源哈希缺失·台账层`,
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

// ↓↓ 两条数组的真身提到模块作用域，唯一读者是**下方 §S18/S19 与 W1-2 两个 `for`** 与 §S4 四数普查。
// 为什么不能留在 `for (const gate of [ … ])` 里：四数普查的 N/M 必须「从数组本身取长度」，
// 在别处重抄一遍名单 = 第二个真值源，必然随加门漂掉（CONTRIBUTING.md §未排期清单 `L13`/`L18`）。
const REAL_RUN_GATES = [
    "./scripts/assert-forge-1204-material.mjs",
    // sweep81 C-6：Properties 形态**族 × 版本区间**门（正反两面；补 1.18.2/1.19.4 反向面）。
    "./scripts/assert-forge-blockshape-family.mjs",
    // sweep81 C-2 v2：审计结论机读清单 + 逐条销账（closed 必带 gates/closedAt/evidenceRefs；open 必带 whyOpen/nextRound）。
    "./scripts/assert-rule-ledger.mjs",
    // sweep81：data/** 全树语义读门（逐树标题桩 ratchet + median 地板 + 树必须登记；补 M 类机械对账的盲区）。
    "./scripts/assert-corpus-semantics.mjs",
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
    // 2026-09-19 N5：配置口径平台面 —— 根 AGENTS.md 条目 ↔ 59 档 AGENTS.md ↔ generateConfig loader 枚举三方一致。
    "./scripts/assert-config-platform-face.mjs",
    // 2026-09-19 N9(c)：bedrock 脚本 API 钉值真值源（scaffold 钉值 ↔ 声明文件 ↔ 文档快照语义分层）。
    "./scripts/assert-bedrock-script-api-pin.mjs",
    // 2026-09-19 W0-1：库 SKILL「N 条实测」计数必须能由 lib-manifests/all.json 机械复算。
    "./scripts/assert-lib-census-counts.mjs",
    // 2026-09-19 W3-4 路线 A：qsl-verified 语料派生件必须与其声明复制源归一化一致（F115 + 路线 A）。
    "./scripts/assert-qsl-verified-sync.mjs",
    // 2026-09-19 W3-3：glossary 的 mojang 行不得再写成混淆名（否定感知判别，21 份 glossary）。
    "./scripts/assert-glossary-mojmap-face.mjs",
    // 2026-09-19 W5-1：规则内「见本文件「X」」引文的 X 必须存在（621 份 survey，围栏感知 + KNOWN 豁免）。
    "./scripts/assert-rule-internal-refs.mjs",
    // 2026-09-19 W5-2 裁定 5-B：骨架技能口径 2 普查棘轮（补正使计数只降不升）。
    "./scripts/assert-skill-skeleton-census.mjs",
    // 2026-09-20 W5-3：工作流模板必须引 WORKFLOW_HITL 常量或含确认语义（5 个必备模板必须引常量）。
    "./scripts/assert-workflow-hitl.mjs",
    // 2026-09-20 W1-4：forge_javadoc 族盘上 ↔ index-l0 双向差（audit 的 docSubDirs 覆盖不到这一族）。
    "./scripts/assert-javadoc-index-parity.mjs",
    // 2026-09-20 W5-5 裁定：sm-120x.xml 保留跟踪 + 规则保留；scripts/_oneoff 保留不删。
    "./scripts/assert-w55-hygiene-rulings.mjs",
    // 2026-09-21 W3-2：规则树 ```java 示例的「形状」门（MY_*.get() 近似名不一致 / super(null) /
    // new 与同文件构造重载实参不符）—— 5 档 × 7 宿主曾共 35 个位点照抄编译不过，此前无门可判。
    "./scripts/assert-rule-java-shapes.mjs",
    // 2026-09-20 裁定③：含围栏代码的 Skill 源稿必须声明非空 mappings 键（F-I6 的长期闸）。
    "./scripts/assert-skill-mappings-key.mjs",
    // 2026-09-20 裁定（F-K1）：检索结果必须带 verbatim 逐字支撑位 —— 投毒名 judged>0/hits=0、
    // 真实名 hits>0、散文不判、每个 true 行可独立直扫复现、且标注不得改变命中集合与顺序。
    "./scripts/assert-verbatim-support.mjs",
    // 2026-09-21 缺页普查（F1）：forge 语料的期望页面清单必须来自上游 search_index，缺页即红；
    // 空清单 / 残表 / 导航来源 / 白名单外孤儿页都不得空转放行。
    "./scripts/assert-upstream-chapters.mjs",
    // 2026-09-21 链位收口：S20（scripts 写盘必须走 write-guard）终于挂上第 8 步链 ——
    // 此前只内联在 test-core.mjs 的 npm test 链上，改 scripts 的人按 AGENTS.md:387 跑本链也碰不到它，
    // 于是 assert-skill-yarn-attest / assert-skill-mappings-key 等门静默带着裸写盘进了库。
    "./scripts/assert-script-write-guard.mjs",
    // 2026-09-21 链位收口：恒真形状闸（R-4，防「测试自退化」）同病同修 —— 它此前也只在 npm test 链上。
    "./scripts/assert-test-harness.mjs",
    // 2026-09-22 ②：forge_javadoc 出处可核 + 单档 build 唯一 + 落盘形状 == URL 包 + 文件名 == URL 类名。
    // 真跑腿按门内 DEFAULT_CEILING 的「存量脏页只许减不许增」口径放行（错档/锚点垃圾页待用户确认删除）；
    // 判据腿在下方 selftest 数组里，两条都挂默认链 ⇒ 既核数据也核判据死活。
    "./scripts/assert-javadoc-build-provenance.mjs",
    // 2026-09-22 裁定④：基岩「版本更新说明」体裁 —— 真跑核在盘 index-l0 与生产者判据逐条相等，
    // 并核 dist 里确实带着降权（改了 src 不 build ⇒ 运行时没降权，这条会红）。
    "./scripts/assert-bedrock-genre-demote.mjs",
    // 2026-09-22 裁定④（members 接线）：scriptapi 的成员条数必须挂在独立计数源上 ——
    // typed.decls ⇄ index-l0 ⇄ 页面三方计数、逐页四口径、每页 sha 对账、来源留痕。
    "./scripts/assert-bedrock-scriptapi-members.mjs",
    // 2026-09-22 裁定③「提交 + 做个门看住它」：forge_javadoc 的孤儿对账/删除留痕记录必须自洽、
    // 未过期、点名的页双边确实不在盘上（报告会被下次抓取覆盖 ⇒ 删除本身另存 _orphan-pruned.json）。
    "./scripts/assert-javadoc-orphan-record.mjs",
    // S22 步1（2026-09-24）：库 Skill 的 resolve ↔ session 双链路同答。判据源是**真跑两条链路**
    // （resolve 走 scripts/resolve-lib-skills.mjs，session 走 dist/platform-pack/catalog.js），
    // 立门前真实红证 = (fabric,1.20.1) session 多吐 mc-caelus（见门头注）。
    "./scripts/assert-lib-session-resolve-parity.mjs",
    // A8（2026-09-24）：盘上 `*.test.mjs` ↔ `node --test` 链双向覆盖（新加测试文件忘接线即红；
    // 此前无这道门面，HEAD 版曾漏 `_lib/bedrock-corpus.test.mjs`）。
    "./scripts/assert-test-chain-coverage.mjs",
    // 第 36 轮：`CONTRIBUTING.md` §未排期清单**表形**门（该表自称「状态的唯一现行读法」，此前全仓无门判其形状
    // ⇒ 第 33/34 两轮连续写坏（第三列整列缺失 + L43 插错位置）无人报警）。只判形状，prose 口径仅打印。
    "./scripts/assert-backlog-table-shape.mjs",
    // A11 清尾①（2026-09-25）：quilt「未版本化现行页」的拷贝事实（14 topic×6 档除时间戳逐字同）
    // + 页内警告在册 + 双向登记（新 wiki 页未三分类即红）。出处 = knowledge-coverage-sweep §3.1 的建议门。
    "./scripts/assert-quilt-unversioned-wiki.mjs",
    // §6.8 缺口②（2026-09-25）：跨层类名门 —— 覆盖 leg2 判据面**之外**（knowledge / code-patterns /
    // .cursor/rules / AGENTS / scaffold）。判据 = 「档位类名层」× 四条腿（A yarn 档用 mojmap 名、
    // B mojmap 档用 yarn 名、C mojmap 档用本档不存在的 MCP 名、D MCP 档用同代 mojmap 名）；
    // 基线 A/B=130 / C=33 / D=109（首测存量，棘轮只许降；--strict 忽略基线看全量）。
    "./scripts/assert-cross-layer-names.mjs",
    // S1′ 残差收口（2026-09-25）：generate_* 拒绝出口的机读码棘轮 —— 59 位点 / 判定 55 /
    // 兜底 GENERATION_FAILED 地板 4（新加生成器文案不匹配 REJECT_RULES 时兜底计数上升即红）。
    "./scripts/assert-generator-rejection-codes.mjs",
    // S5′（2026-09-25）：库坐标 × maven-metadata 的**离线**对账 —— 真值源是本仓快照
    // `mcp-server/data/lib-coords/maven-metadata-snapshot.json`（抓取要显式跑
    // `node scripts/check-lib-coords.mjs --write`，本门零联网）。实测：SKILL.md 36 份 /
    // 坐标主张 23 条（doc 9 + versions.json 槽位 14）/ 唯一坐标 3（Central 候选 0、全 non-central）。
    // 快照缺失 ⇒ 响红 `SNAPSHOT_MISSING`（不是 skipped：它的三条判据里有两条根本读不到快照，
    // 静默跳过会把真错洗成绿）。地板现算不写死。
    "./scripts/assert-lib-coord-snapshot.mjs",
    // 未做③（2026-09-26）：Forge 1.17+ SRG 成员层入库件的**离线**自洽门。真跑腿 = 夹具全链路
    // （reducer → importer → build-yarn-sqlite 的 srg-to-official 分支 → convertMappingEx 出 AT 行）
    // + 在盘三方对账（派生件 sha256 ↔ provenance ↔ 库 meta）。实测 ~120 ms，不联网、只写 OS tmpdir。
    "./scripts/assert-forge-srg-ingest.mjs",
  ];

const SELFTEST_GATES = [
    // S16/T8（第 27 轮）：这两道此前只有「从外面投毒」（yarn-slurp 靠 test-scripts §#16 写盘夹具；
    // skill-mirrors 连外面投毒都没有）。现在各自带内存 `--selftest`，接进默认链，条数照例不写死。
    "./scripts/assert-no-yarn-json-slurp.mjs",
    "./scripts/assert-skill-mirrors.mjs",
    "./scripts/assert-corpus-semantics.mjs",
    "./scripts/assert-forge-blockshape-family.mjs",
    "./scripts/assert-forge-1182-registry-consts.mjs",
    "./scripts/assert-rule-ledger.mjs",
    // 2026-09-20 W5-3：人在环判据的自证（畸形模板文本必须当场红）。
    "./scripts/assert-workflow-hitl.mjs",
    // 2026-09-20 W1-4：javadoc 双向差判据的自证（畸形快照必须当场红）。
    "./scripts/assert-javadoc-index-parity.mjs",
    // 2026-09-20 W5-5：裁定钉的自证（规则被删必须当场红）。
    "./scripts/assert-w55-hygiene-rulings.mjs",
    // 2026-09-21 W3-2：Java 形状判据的自证（未声明标识符 / super(null) / 构造实参不符必须当场红）。
    "./scripts/assert-rule-java-shapes.mjs",
    // 2026-09-20 裁定③：mappings 键判据的自证（含围栏不声明 / alt 无披露块必须红）。
    "./scripts/assert-skill-mappings-key.mjs",
    // 2026-09-20 F-K1：verbatim 判据的自证（极性反转 / 子串放过 / 散文也判必须红）。
    "./scripts/assert-verbatim-support.mjs",
    // 2026-09-21 F1：上游清单判据的自证（缺页 / 缺首页 / 空清单 / 残表 / 导航来源必须红）。
    "./scripts/assert-upstream-chapters.mjs",
    // 2026-09-21 链位收口：S20 判据的自证（裸写盘 / 未 import guard / 异步写盘 / 豁免依据失效必须当场红）。
    "./scripts/assert-script-write-guard.mjs",
    // 2026-09-22 ②：出处/形状判据的自证（缺 source / 锚点垃圾 / 错档 / 混 build / raw 下非 .md 残留 /
    // 整版无正文率超阈 / 天花板参数失效 / 碰撞后缀被误判 ⇒ 各例都必须当场红，且红在该当的原因上）。
    "./scripts/assert-javadoc-build-provenance.mjs",
    // 2026-09-22 裁定④：基岩「版本更新说明」= 打标签 + 检索降权（不删页、不拉黑）。真跑腿核
    // 三方 tag 拼写一致（生产者 / src / dist）+ 在盘索引与生产者判据逐条相等 + 降权只重排不过滤。
    "./scripts/assert-bedrock-genre-demote.mjs",
    // 2026-09-22 裁定④（members 接线）：判据⑦的稳定计数源对账 —— 计数掉一条 / label 连不上 /
    // 成员小节被截断或降级 / 源文件留痕缺失，各必须当场红（17 例夹具 + 干净正对照）。
    "./scripts/assert-bedrock-scriptapi-members.mjs",
    // 2026-09-22 裁定③：孤儿记录判据的自证（版本错档 / 记录过期 / 点名的页还在盘上 /
    // 单边删只剩镜像 / 留痕缺时间戳 / 既没对账也没失败记账，各必须当场红）。
    "./scripts/assert-javadoc-orphan-record.mjs",
    // S22 步1：双链路同答判据的自证（session 多吐 / resolve 多吐 / 同数不同名 / 采集 0 份 /
    // mcVersionsByPlatform 零声明 / COMBOS 被砍 / COMBOS 无 quilt，各必须当场红 + 一条正对照须绿）。
    "./scripts/assert-lib-session-resolve-parity.mjs",
    "./scripts/assert-community-attribution.mjs",
    // A8（2026-09-24）：覆盖门的判据自证（①红 / ②红 / 缺 test 脚本红线，共 5 态）。
    "./scripts/assert-test-chain-coverage.mjs",
    // 第 36 轮：表形门的判据自证（第三列缺失 / 第三列为空 / 号序乱（现盘真发生过）/ 重号 / 跳号 / 首号≠1 /
    // 正则采 0 行 ⇒ COLLECTOR_RETURNED_ZERO / 锚改名 ⇒ ANCHOR_MISSING / 截断到地板下，各必须红；
    // 另三记**不判对照**须绿：合法改词（去掉 as-of）不红、合法加一行不红（地板只 `<`）、现盘逐字副本绿）。
    "./scripts/assert-backlog-table-shape.mjs",
    // 清尾①（2026-09-25）：未版本化现行页判据的自证（跨档改写 / 时间戳缺或重 / 警告删 / 未登记页 / 整页缺失 ⇒ 必红）。
    "./scripts/assert-quilt-unversioned-wiki.mjs",
    // 清尾③（2026-09-25）：qsl-verified 索引侧 sha256 对账判据的自证（缺失 / 过期 / l1 缺条目 / 解析失败 ⇒ 必红）。
    "./scripts/assert-qsl-verified-sync.mjs",
    // §6.8 缺口②（2026-09-25）：跨层名门的自证（15 例：四腿判据 / 层推导 / 代码位抽取 / 端到端先红后绿）。
    "./scripts/assert-cross-layer-names.mjs",
    // S16/t9（第 46 轮）：assert-powershell 的 in-gate 自检（25 例：13 投毒必红 + 6 反退化断言 + 6 正对照，
    // 全内存、不 spawn powershell）。本数组是 selftest 面的唯一真值源 ⇒ 必须登记在此；
    // 上面 #14a 块另跑一次并**加了三桶计数地板**（本数组的循环只判 rc，掏空例数它看不见），两处不重复。
    "./scripts/assert-powershell.mjs",
    // S1′ 残差收口（2026-09-25）：rejection-codes 门的自证（12 例夹具：5 档锚点各归其码 +
    // 兜底通道活着 + 空 errors 落兜底 + 扫描器位数/未判定；计数现算不写死）。
    "./scripts/assert-generator-rejection-codes.mjs",
    // 未做③（2026-09-26）：Forge 1.17+ SRG 成员层的解析器自洽门（夹具 4 类/3 方法行/4 字段行，
    // 上游件↔入库件逐行同答 + era/形状/消费面/在盘三方对账；11 记投毒含 1 记真输入投毒）。
    "./scripts/assert-forge-srg-ingest.mjs",
    // S5′（2026-09-25）：库坐标门的自证（23 例 = 16 投毒必红 + 7 不判红对照 + 真实输入正对照；
    // 全内存 + 一次性临时根，不联网、不改仓内快照）。实测 rc=0 / 114–195 ms。
    "./scripts/assert-lib-coord-snapshot.mjs",
    // S16/t9 最后一条腿（第 47 轮，2026-09-25）：F145 方块 Material 门的 in-gate 自检
    // （27 例 = 13 投毒必红 + 6 反退化断言 + 8 正对照；全内存、不读档面、不落盘）。
    // 补它之前该门全文 `--selftest` 命中 0，其五个 MC_SKILL_MAT_* 钩子全仓只有文件自己读
    // ⇒ 装饰性投毒口。三桶计数地板长在门内（本数组的循环只看 rc，掏空例数它看不见）。
    "./scripts/assert-forge-1204-material.mjs",
  ];

/**
 * §S4 · 门链**四数普查**：把「盘上 K / 可达 P / 真跑 N / selftest M」四把分母算在一起、打印在一起、断言在一起。
 *
 * 一道没人跑的门比没有门更糟：它本地手跑绿、CI 也「绿」，但坏数据照样入库。
 * 四门（G1–G4）都是这个形状，所以把「可达性」本身钉成断言。
 *
 * ⚠️ 口径（第 23、25 轮两次把本块旧打印「N 道 assert-* 全部可达」读成「这些门都跑过了」，
 * 本轮把「靠人读措辞」换成机制）：
 *  - `K` 盘上 = `readdirSync(scripts)` 全量（沿用原有口径，不另起一摊）。
 *  - `P` 可达 = 该名字出现在任一 `test-*.mjs` 或 `package.json` 里 ⇒ **被引用**，不是被执行。
 *  - `N` / `M` = §S18/S19 与 W1-2 两个块**逐道 spawn** 的那两条数组的**去重长度**（数组本身是唯一真值源，
 *    本块只读它的 `length`，绝不重抄名单——重抄 = 造第二个真值源，必然漂，见 CONTRIBUTING.md `L13`/`L18`）。
 *  - `Z` = 名字出现在**本文件源码**里、却**不在**那两条数组中的门 ⇒ 它们由本文件的**其它编号块/散块**
 *    现 spawn（`#16` 的 yarn-slurp、`#20/#21/#22` 的 mixin-shape / ban-vs-example / doc-absence-claims 等），
 *    所以 **`K − N` 不是「只由 npm test 覆盖」的道数**。第 26 轮的打印就是拿 `K − N` 算这道差，
 *    把 `Z` 那批说成「本块不跑 ⇒ 只有 npm test 跑」——一个制造过度解读的口径错（本轮改成扫描现算）。
 *  - `Y` = 盘上 `assert-*.mjs` 里**本文件源码任何位置都没出现其文件名**的道数（子串 presence，天然覆盖
 *    数组项 / `new URL("./scripts/…")` / 任何 spawn 形 / 注释点名）。`Y` 才是「本文件完全没碰过」那批。
 *  等式只留真该等的那条：`P === K`。`N` / `M` / `Y` 一律下界（`<` 才红）：等式棘轮（反面教材 =
 *  `assert-forge-1182-registry-consts.mjs` 的 `now === pinned`）会让下一次**合法**加门/挪门必红。
 *  `Y` 的下界另配一记**差分对照**（投毒④）证明扫描是活的：往 `selfBlob` 夹具里追加一条 spawn 形引用，
 *  `Y` 必须 −1 且仍绿；只按下界的话，「扫描恒不命中 ⇒ Y=K」与「扫描恒命中 ⇒ Y=0」都不会自己现形。
 */
const FLOOR_REAL_RUN = 30; // 口径 = REAL_RUN_GATES 去重长度；as-of 2026-09-25 实测 37（+assert-quilt-unversioned-wiki / +assert-cross-layer-names / +assert-generator-rejection-codes）；下界（< 才红），非等式
const FLOOR_SELFTEST = 15; // 口径 = SELFTEST_GATES 去重长度；as-of 2026-09-25 实测 26（+quilt-unversioned-wiki / +qsl-verified-sync / +cross-layer-names / +generator-rejection-codes 四条自证）；下界，非等式
const FLOOR_UNREF = 8; // 口径 = 盘上 assert-*.mjs 中「本文件源码零出现」的道数；as-of 2026-09-24 实测 10；下界，非等式（合法把某道门挪进本文件 spawn 块会让 Y 降，不该红）

/**
 * 纯函数：输入（盘上清单 / 全 test-*.mjs+package.json 的引用 blob / **本文件自身源码** / 两条数组）
 * 与三个地板全部可注入 ⇒ 四记投毒只在内存夹具上做，不碰任何生产文件
 * （形状同 `assert-community-attribution.mjs` 的 `evaluate(accessor)`）。
 * @returns {{K:number,P:number,N:number,M:number,Z:number,Y:number,yNames:string[],orphans:string[],errors:string[]}}
 */
function censusChain({ diskGates, blob, pkg, selfBlob, realRun, selftest, floorReal, floorSelf, floorUnref }) {
  const K = diskGates.length;
  const orphans = diskGates.filter((g) => !blob.includes(g) && !pkg.includes(g));
  const P = K - orphans.length;
  const N = new Set(realRun).size;
  const M = new Set(selftest).size;
  const yNames = diskGates.filter((g) => !selfBlob.includes(g));
  const Y = yNames.length;
  const inArrays = new Set([...realRun, ...selftest].map((p) => String(p).split("/").pop()));
  const Z = diskGates.filter((g) => selfBlob.includes(g) && !inArrays.has(g)).length;
  const errors = [];
  if (orphans.length > 0)
    errors.push(`可达性: 以下门禁没有任何调用方 ⇒ 手跑绿也不会进 npm test：\n${orphans.join("\n")}`);
  if (P !== K) errors.push(`可达性: 可达 P=${P} ≠ 盘上 K=${K}`);
  if (N < floorReal)
    errors.push(`真跑: §S18/S19 数组 N=${N} < 地板 ${floorReal} ⇒ 有人从默认链上摘门（数组=唯一真值源）`);
  if (M < floorSelf)
    errors.push(`selftest: W1-2 数组 M=${M} < 地板 ${floorSelf} ⇒ 判据死活的自证不再被默认链跑到`);
  if (Y < floorUnref)
    errors.push(`本文件未引用: Y=${Y} < 地板 ${floorUnref} ⇒ 引用扫描多半失效（selfBlob 读到空数组会退化成「盘上门全被本文件跑」的假话）`);
  return { K, P, N, M, Z, Y, yNames, orphans, errors };
}
{
  const { readdirSync } = await import("node:fs");
  const SCRIPTS = jpath(import.meta.dirname, "scripts");
  const gates = readdirSync(SCRIPTS).filter((f) => /^assert-.*\.mjs$/.test(f)).sort();
  const tests = readdirSync(import.meta.dirname).filter((f) => /^test-.*\.mjs$/.test(f));
  const blob = tests.map((t) => readFileSync(jpath(import.meta.dirname, t), "utf8")).join("\n");
  const pkg = readFileSync(jpath(import.meta.dirname, "package.json"), "utf8");
  // 本文件**自身**源码：Y/Z 的判据面（第 26 轮没有这一路，只能拿 K−N 猜差额 ⇒ 猜错了）。
  const selfBlob = readFileSync(import.meta.filename, "utf8");
  assert.ok(
    selfBlob.length > 100_000,
    `selfBlob 只有 ${selfBlob.length} 字符 ⇒ 本文件源码没读到，Y/Z 全是垃圾数（宁可红，不可假绿）`,
  );
  const prod = censusChain({
    diskGates: gates,
    blob,
    pkg,
    selfBlob,
    realRun: REAL_RUN_GATES,
    selftest: SELFTEST_GATES,
    floorReal: FLOOR_REAL_RUN,
    floorSelf: FLOOR_SELFTEST,
    floorUnref: FLOOR_UNREF,
  });
  assert.equal(prod.errors.length, 0, `§S4 门链四数普查不通过：\n${prod.errors.join("\n")}`);

  // 反身自证（新腿必须能红）。2026-09-19（N3/N5/N9c 批次）留下的口径：去掉某门在 blob/pkg 里的
  // **全部**出现（原用 String.replace 只去首个，一门在同一宿主被调两处时自证会静默失效）。
  const probe = gates[0];
  const strip = (text) => text.split(probe).join("");
  const base = {
    diskGates: gates,
    blob,
    pkg,
    selfBlob,
    realRun: REAL_RUN_GATES,
    selftest: SELFTEST_GATES,
    floorReal: FLOOR_REAL_RUN,
    floorSelf: FLOOR_SELFTEST,
    floorUnref: FLOOR_UNREF,
  };
  // 「红在哪句话」必须印出来：否则「投毒能红」又是一句只有作者自己看得见的自述。
  const firstRed = (label, c, pred, notRedMsg) => {
    const m = c.errors.find(pred);
    assert.ok(m, `${label} 打不红 ⇒ ${notRedMsg}`);
    return m.replace(/\n/g, " ⏎ ");
  };
  // 投毒①（可达腿）：摘掉一道的引用 ⇒ 必须红，且红在该门的名字上。
  const redReach = firstRed(
    "投毒① 可达腿",
    censusChain({ ...base, blob: strip(blob), pkg: strip(pkg) }),
    (e) => e.includes(probe),
    `删掉 ${probe} 的引用后仍然全绿`,
  );
  // 投毒②（N 地板腿）：把真跑地板抬到数组不可能达到的高度 ⇒ 必须红。
  const redFloorN = firstRed(
    "投毒② N 地板腿",
    censusChain({ ...base, floorReal: prod.K + 1 }),
    (e) => e.startsWith("真跑:"),
    `地板抬到 ${prod.K + 1} 仍不报`,
  );
  // 投毒③（M 地板腿）：selftest 数组删一项 + 地板取真实 M ⇒ 必须红。
  // 真实地板留 15（实测值减一点）是**故意的**：单掉一道不会红（下界不脆）；这里把地板抬到实测 M
  // 只为证明那条 `<` 判据本身活着，不是恒真。
  const redFloorM = firstRed(
    "投毒③ M 地板腿",
    censusChain({ ...base, selftest: SELFTEST_GATES.slice(0, -1), floorSelf: prod.M }),
    (e) => e.startsWith("selftest:"),
    "selftest 数组删一项后仍不报",
  );
  // 投毒④（L22 新增·N 地板的**数组侧**）：把真跑数组整段截到地板以下 ⇒ 红在同一条 `真跑:` 上。
  // ⚠️ 口径：写单要的是「摘一项必红」，但 `N ≥ 地板` 是**下界**、地板按实测 32 减了 2 ⇒ 单摘一道
  // 按设计不该红（等式棘轮反面教材见上）。所以这一记截到 `FLOOR_REAL_RUN - 1` 道，证明的是
  // 「数组缩水这条路真能红」，与投毒②（抬地板那条路）互补。
  const redShrink = firstRed(
    "投毒④ N 数组截断",
    censusChain({ ...base, realRun: REAL_RUN_GATES.slice(0, FLOOR_REAL_RUN - 1) }),
    (e) => e.startsWith("真跑:"),
    `真跑数组截到 ${FLOOR_REAL_RUN - 1} 道仍不报 ⇒ N 根本没在数数组`,
  );
  // 投毒⑤（L22 新增·可达**等式**侧）：盘上凭空多一道没人引用的门 ⇒ 必须红在 `P === K`。
  // 名字运行时拼出来：写成字面量的话它就真出现在本文件源码里 ⇒ 被 blob 认成"有引用"，夹具当场失效。
  // 只看等式那一行（孤儿清单那一行由投毒① 证），否则 find 会先命中① 同款文案、白证一次。
  const ghost = "assert-" + "zz-ghost-gate" + "-r27.mjs";
  const redGhost = firstRed(
    "投毒⑤ 凭空假门",
    censusChain({ ...base, diskGates: gates.concat([ghost]) }),
    (e) => e.startsWith("可达性: 可达 P="),
    `${ghost} 无人引用却不报 P≠K ⇒ 那条等式是摆设`,
  );
  assert.match(redGhost, /P=\d+ ≠ 盘上 K=\d+/, `投毒⑤ 没落在等式上：${redGhost}`);
  assert.ok(!blob.includes(ghost) && !pkg.includes(ghost), `幽灵门夹具失效：${ghost} 竟被 blob/pkg 引用`);
  // 不判对照 A（防等式棘轮）：只增不减 —— 模拟合法加一门进真跑数组，必须仍绿。
  const extra = gates.find((g) => !REAL_RUN_GATES.some((p) => p.endsWith(g)));
  assert.ok(extra, "找不到「盘上有、真跑数组里没有」的门 ⇒ 对照例失效，本块须重设计");
  const control = censusChain({ ...base, realRun: REAL_RUN_GATES.concat([`./scripts/${extra}`]) });
  assert.equal(
    control.errors.length,
    0,
    `合法加一门（${extra}）被判成红 ⇒ 地板退化成了等式：\n${control.errors.join("\n")}`,
  );
  // 不判对照 B（L22 新增·证明 Y 是**扫描**来的、不是拿两条数组算的）：把 Y 里的一道门改成
  // 「本文件某编号块现 spawn」的形状（只动 selfBlob 夹具，两条数组一字未动）⇒
  // Y 必须 −1、Z 必须 +1、N/M 不变、errors 仍 0（合法挪门不该红）。
  const y0 = prod.yNames[0];
  assert.ok(y0, `Y=${prod.Y} 为空 ⇒ 本文件声称 spawn 了全部 ${prod.K} 道门，与 §S18/S19 数组长度矛盾`);
  const spawnedNow = selfBlob + `\nspawnSync(node, [fileURLToPath(new URL("./scripts/${y0}", import.meta.url))]);\n`;
  const ctrlY = censusChain({ ...base, selfBlob: spawnedNow });
  assert.equal(ctrlY.errors.length, 0, `把 ${y0} 挪进本文件 spawn 块被判红 ⇒ Y 退化成了等式：\n${ctrlY.errors.join("\n")}`);
  assert.equal(ctrlY.Y, prod.Y - 1, `Y 不随引用面变化（${prod.Y}→${ctrlY.Y}）⇒ Y 不是扫本文件源码算的`);
  assert.equal(ctrlY.Z, prod.Z + 1, `Z 不随引用面变化（${prod.Z}→${ctrlY.Z}）⇒ Z 不是扫本文件源码算的`);
  assert.equal(ctrlY.N, prod.N, "对照 B 不该动 N");
  assert.equal(ctrlY.M, prod.M, "对照 B 不该动 M");

  console.log(
    `  §S4 门链四数: 盘上 ${prod.K} 道 assert-* · 可达 ${prod.P} 道（= 被 ${tests.length} 个 test-*.mjs + package.json 引用，不是被执行）· ` +
      `两条数组逐道 spawn：§S18/S19 真跑 ${prod.N} 道 · W1-2 selftest ${prod.M} 道`,
  );
  console.log(
    `    口径: N/M = **这两条数组**的去重长度；另有 Z=${prod.Z} 道在本文件其它编号块/散块里现 spawn（不被两条数组计入）；` +
      `本文件完全未引用 Y=${prod.Y} 道（列名：${prod.yNames.join(", ") || "无"}）`,
  );
  console.log(
    `    断言: P===K（唯一等式）· N≥${FLOOR_REAL_RUN} · M≥${FLOOR_SELFTEST} · Y≥${FLOOR_UNREF}（三条下界，as-of 2026-09-24 实测 N/M/Y=${prod.N}/${prod.M}/${prod.Y}）`,
  );
  console.log(`    投毒① 可达腿（摘掉 ${probe} 的全部引用）红在: ${redReach}`);
  console.log(`    投毒② N 地板腿（地板抬到 K+1=${prod.K + 1}）红在: ${redFloorN}`);
  console.log(`    投毒③ M 地板腿（selftest 数组删一项、地板取实测 M=${prod.M}）红在: ${redFloorM}`);
  console.log(
    `    投毒④ N 数组截断（真跑数组砍到 ${FLOOR_REAL_RUN - 1} 道，证明数组侧能红）红在: ${redShrink}`,
  );
  console.log(`    投毒⑤ 凭空假门（盘上加一道 ${ghost}，名字运行时拼出）红在: ${redGhost}`);
  console.log(
    `    对照·不判A 只增不减（真跑数组再加 ${extra} ⇒ N=${prod.N + 1}）errors=${control.errors.length} ⇒ 仍绿`,
  );
  console.log(
    `    对照·不判B 引用面挪门（${y0} 追加一条 spawn 形引用）Y=${prod.Y}→${ctrlY.Y} · Z=${prod.Z}→${ctrlY.Z} · N/M 不变 · errors=${ctrlY.errors.length} ⇒ 仍绿`,
  );
}

/**
 * §S18/S19 · 两道新门的**真跑**（不只是被字符串引用骗过门串链）。
 * 串链断言只保证「有人提到这门」，这里保证「npm test 真的跑过它一次」。
 */
{
  const { spawnSync } = await import("node:child_process");
  const { fileURLToPath } = await import("node:url");
  for (const gate of REAL_RUN_GATES) {
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
  // W1-2（2026-09-19）：以下这些门自带 --selftest 投毒自证，把自证也接进默认链 ——
  // 条数**不写死**（2026-09-19 接线时是 4 道，此后按轮递增；写死必然过期，见 CONTRIBUTING.md §未排期清单 L18）。
  // 本块跑几道**不在这里自述**：上面 §S4 的「门链四数」行现算现印（盘上 K / 可达 P / 真跑 N / selftest M），
  // 那两条数组（`REAL_RUN_GATES` / `SELFTEST_GATES`）是唯一真值源，地板断言也在那一块里。
  // 上面的「真跑」只证明**数据**绿；「selftest」才证明**判据**活着（改瞎 banned 形态必须当场红）。
  // 原缺陷：selftest 只能手跑，默认链永远看不见判据死活。
  for (const gate of SELFTEST_GATES) {
    const GATE = fileURLToPath(new URL(gate, import.meta.url));
    const r = spawnSync(process.execPath, [GATE, "--selftest"], {
      encoding: "utf8",
      windowsHide: true,
      env: { ...process.env },
    });
    assert.equal(
      r.status,
      0,
      `${gate} --selftest 失败（rc=${r.status}）：\n${String(r.stdout || "").slice(0, 800)}${String(r.stderr || "").slice(0, 400)}`,
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
  // try/finally 而不是末尾裸 rmSync：六记 expect 任何一记抛错，摊位也得收（下面 finally 里还自证收干净）。
  try {
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
  } finally {
    // 本块夹具 = 3 份 6.5MB api-index 投毒副本 + 3 份台账副本；此前从不清理 ⇒ 2026-09-25 实测盘上
    // 积累 226 个 %TEMP%\mcp-gate-poison-* / 4.13GB，每跑一轮 test:scripts 多一个。
    // maxRetries 是 Windows EBUSY 兜底（与 §S4-G4 收摊同一模式）；后面那记 assert 防「finally 写了但没删掉」悄悄绿。
    rmSync(tmp, { recursive: true, force: true, maxRetries: 10, retryDelay: 250 });
    assert.ok(!existsSync(tmp), `§A5/§idx 摊位未收干净，残留：${tmp}`);
  }
}

/**
 * S9 · javadoc 落盘冲突计划（F123 根因侧）的负例测。
 *
 * 抓取器已用 planClassWrites 在写盘前摊开两类重复来源，但仓库里没有任何测试引用它：
 * 没有测试的修复等于没修，下次改抓取器时没人知道这条约束存在。
 * 历史包袱是盘上 1,490 个带空格括号后缀的 .md（旧自动改名产物，删除归数据拥有者）。
 */
{
  const jd = await import("./scripts/fetch-forge-javadoc.js");
  const { planClassWrites } = jd;
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
  push('抓取器被 import 时不启动联网爬取 / 索引器被 import 时不重建索引', () => {
    // 这些脚本都在顶层读 argv 且带副作用（爬网 / mkdir / 写 index-l0-2 / process.exit）。
    // 本文件就 import 其中一个 ⇒ 没有直跑守卫时，npm test 等于真爬外网并写 data/。
    // 清单口径（不是"随便挑四个"）：`scripts/**` 下**顶层带副作用的生产者脚本**逐个登记。
    // 前三个是本文件直接 import 的（没守卫 ⇒ npm test 真爬外网）；forge-javadoc-indexer.js 目前没人 import，
    // 但它一被 import 就会在测试进程里重写六档 index-l0/1/2.json（覆盖刚落盘、尚未过一致性判据的产物），
    // 2026-09-22 补抓那轮顺着流水线核到时它正是"裸顶层跑完"的形态 ⇒ 补了守卫并要求在此挂住。
    for (const f of ["fetch-forge-javadoc.js", "fetch-fabric-wiki.js", "fetch-liteloader-wiki.js", "forge-javadoc-indexer.js"]) {
      const src = readFileSync(jpath(dirname(fileURLToPath(import.meta.url)), "scripts", f), "utf8");
      assert.match(src, /const invokedDirectly =/, `${f} 直跑守卫被摘掉 ⇒ import 它就等于 npm test 真爬外网/写真 data/`);
      assert.ok(!/^main\(\)/m.test(src), `${f} 又出现裸的顶层 main() 调用 ⇒ 守卫形同虚设`);
      assert.ok(!/^runAll\(\)/m.test(src), `${f} 又出现裸的顶层 runAll() 调用 ⇒ 守卫形同虚设`);
    }
  });
  push("孤儿真删必须留下可核对的凭据（_orphan-pruned.json 的形状）", () => {
    const { orphanPrunedRecord, PRODUCER_REV: rev } = jd;
    const rec = orphanPrunedRecord("1.12.2", ["net/A.md", "net/B.md"]);
    assert.equal(rec.version, "1.12.2", `留痕的档位字段错：${rec.version}`);
    assert.equal(rec.producerRev, rev, "留痕没带当前生产者修订 ⇒ 判据门「记录过期」那条腿会空转");
    assert.equal(rec.count, rec.files.length, `count 与 files 自相矛盾：${rec.count} vs ${rec.files.length}`);
    assert.ok(!Number.isNaN(Date.parse(rec.prunedAt)), `prunedAt 不是可解析时间：${JSON.stringify(rec.prunedAt)}`);
    assert.deepEqual(rec.files, ["net/A.md", "net/B.md"], "点名内容被改动 ⇒ 删除记录不再等于执行计划");
    assert.equal(orphanPrunedRecord("1.7.10", []).count, 0, "空清单的 count 必须是 0（缺字段 = 门的自洽判据判不出）");
  });
  push("旧式 javadoc 表格必须解析得出成员（2026-09-22 事故回归）", () => {
    const { parseClassPage, htmlToMarkdown } = jd;
    // 形状取自实抓：skmedix ForgeJavaDocs（jdk8 javadoc）—— 成员在 `table.memberSummary` 的
    // colFirst（修饰符与类型）+ colLast（`<code><span class="memberNameLink">名</span>(参数)</code>`），
    // 类声明在 `<hr><br><pre>public class …`。旧实现只匹配新式 `<pre class="memberSignatures">`，
    // 对这份 HTML 解析出 0 成员，于是整批 `--force` 把 1.8 万页正文刷成空壳（已回滚）。
    const old = [
      '<div class="description"><ul class="blockList"><li class="blockList">',
      '<dl><dt>All Implemented Interfaces:</dt><dd><a href="../Foo.html">Bar</a>&lt;<a href="../X.html">X</a>&gt;</dd></dl>',
      '<hr><br><pre>public class <span class="typeNameLabel">Block</span> extends <a href="../I.html">Impl</a>&lt;<a href="../X.html">X</a>&gt;</pre>',
      '<div class="block">Some prose.</div></li></ul></div>',
      '<ul class="inheritance"><li>java.lang.Object</li><li><ul class="inheritance"><li><a href="../I.html">Impl</a></li><li><ul class="inheritance"><li>net.minecraft.Block</li></ul></li></ul></li></ul>',
      '<h3>Constructor Summary</h3><table class="memberSummary"><tr><th class="colOne">Constructor</th></tr>',
      '<tr><td class="colOne"><code><span class="memberNameLink"><a href="#">Block</a></span>(<a href="#">Material</a>&nbsp;m)</code>&nbsp;</td></tr></table>',
      '<h3>Field Summary</h3><table class="memberSummary"><tr><th class="colFirst">Type</th><th>Field</th></tr>',
      '<tr><td class="colFirst"><code>static <a href="#">Map</a>&lt;<a href="#">String</a>&gt;</code></td><td class="colLast"><code><span class="memberNameLink">LOOKUP</span></code></td></tr></table>',
      '<h3>Method Summary</h3><table class="memberSummary"><tr><th class="colFirst">Modifier and Type</th><th>Method</th></tr>',
      '<tr><td class="colFirst"><code>protected static void</code></td><td class="colLast"><code><span class="memberNameLink"><a href="#">add</a></span>(<a href="#">List</a>&lt;<a href="#">BB</a>&gt;&nbsp;boxes)</code><br><div class="block">Adds.</div></td></tr>',
      '<tr><td class="colFirst"><code>void</code></td><td class="colLast"><code><span class="memberNameLink"><a href="#">gone</a></span>()</code><br><div class="block"><span class="deprecatedLabel">Deprecated.</span></div></td></tr>',
      '</table>',
    ].join("\n");
    const p = parseClassPage(old);
    assert.equal(p.classSig, "public class Block extends Impl<X>", `类声明解析不符：${p.classSig}`);
    assert.equal(p.constructors.length, 1, `构造子没解析出来：${JSON.stringify(p.constructors)}`);
    assert.equal(p.fields.length, 1, `字段没解析出来：${JSON.stringify(p.fields)}`);
    assert.equal(p.fields[0].type, "static Map<String>", `字段类型折叠不符：${p.fields[0].type}`);
    assert.equal(p.methods.length, 2, `方法数不符：${JSON.stringify(p.methods.map((m) => m.sig))}`);
    assert.equal(p.methods[0].sig, "protected static void add(List<BB> boxes)", `签名形状不符：${p.methods[0].sig}`);
    assert.equal(p.methods[1].sig, "@Deprecated void gone()", `废弃标记没落进签名：${p.methods[1].sig}`);
    assert.equal(p.methods[1].desc, "", "「Deprecated.」不该再复读进描述位");
    assert.equal(p.inheritance, "java.lang.Object → Impl → net.minecraft.Block", `继承链不符：${p.inheritance}`);
    // 反证（2026-09-22 全量比对抓到的真实回归）：继承链的 `</ul>` 后面紧挨着 `<li class="blockList">`
    // （类注释 / 类声明 / Summary 表）。旧实现"从外层切 6000 字收不含嵌套 ul 的 li"会把这些
    // 兄弟 li 一并并进 Inheritance —— 实测 14704/16423 页中招，个别页连类声明都被吞掉（丢 ```java 块）。
    const noisyChain = '<ul class="inheritance"><li>java.lang.Object</li><li><ul class="inheritance">'
      + '<li><a href="../I.html">Impl</a></li><li><ul class="inheritance"><li>net.minecraft.Block</li></ul></li></ul></li></ul>'
      + '<li class="blockList"><dl><dt>All Implemented Interfaces:</dt><dd>IFoo, IBar</dd></dl></li>'
      + '<li class="blockList"><h3>Constructor Summary</h3></li>'
      + '<hr><br><pre>@Deprecated\npublic class <span class="typeNameLabel">Block</span> extends <a href="../I.html">Impl</a></pre>';
    const pn = parseClassPage(noisyChain);
    assert.equal(pn.inheritance, "java.lang.Object → Impl → net.minecraft.Block",
      `继承链越界：把 Summary / All Implemented Interfaces 并进来了 ⇒ ${pn.inheritance.slice(0, 120)}`);
    assert.equal(pn.classSig, "public class Block extends Impl",
      `类声明被吞 ⇒ classSig=${JSON.stringify(pn.classSig)}（@Deprecated 前导行必须被跳过，不是被吃掉）`);
    const md = htmlToMarkdown("Block", "net/minecraft", p, "1.12.2", "https://x/Block.html", "14.23.5.2859");
    for (const h of ["## Class signature", "## Constructors", "## Methods", "## Fields"]) {
      assert.ok(md.includes(h), `渲染缺分节 ${h}`);
    }
    // 反证 A：新式（jdk 9+）页面在这份解析器下抽出 0 成员 —— 页面级判据**抓不到**它
    // （classSig 抽得出、memberNameLink 不存在），所以批量级判据必须是独立的一条腿。
    const modern = '<pre class="classSignatures">public class Foo extends Bar</pre><pre class="methodSignature">void a()</pre>';
    const pm = parseClassPage(modern);
    assert.equal(pm.constructors.length + pm.methods.length + pm.fields.length + pm.nested.length, 0,
      "新式页面竟然解析出成员 ⇒ 两条判据的前提都没了");
    assert.equal(pm.memberNameLinks, 0, "新式页面里不该有旧式 memberNameLink");
    assert.ok(!jd.isUnreadableParse(pm), "页面级判据按「0 成员 && 0 类声明」写 ⇒ 新式页正好两腿都不成立，事故会静默写盘");
    assert.ok(jd.ZERO_MEMBER_RATIO_MAX > 0 && jd.ZERO_MEMBER_RATIO_MAX < 0.1,
      `批量级红线 ${jd.ZERO_MEMBER_RATIO_MAX} 离真·空类率（盘上实测 ≈1.5%）没余量，或松到抓不住 98% 那次的事故`);
    // 反证 B：类声明抽得出、HTML 却声称有成员（memberNameLink）而抽出 0 个 ⇒ 页面级判据必须成立。
    // 夹具特意带上 classSig，否则抓它的会是「连类声明都没有」那条腿，memberNameLink 这条腿等于没测。
    const poisoned = '<hr><br><pre>public class <span class="typeNameLabel">Foo</span></pre>'
      + '<h3>Method Summary</h3><table class="memberSummary"><tr><th class="colFirst">Type</th></tr>'
      + '<tr><td class="colFirst"><code>void</code></td><td class="colLast"><code><span class="memberNameLink"></span></code></td></tr></table>';
    const pp = parseClassPage(poisoned);
    assert.ok(pp.classSig, "夹具失效：这页应该能抽出类声明，不然测的是另一条腿");
    assert.equal(pp.methods.length, 0, "夹具失效：这行本该抽不出方法名");
    assert.equal(pp.memberNameLinks, 1, "memberNameLink 计数没跟上 ⇒ 「HTML 声称有成员」这条腿是空的");
    assert.ok(jd.isUnreadableParse(pp), "表格声称有成员却抽出 0 个 ⇒ 正是 2026-09-22 的形状，必须判为读不懂");
    // 真·空类（marker interface）两腿都不成立 ⇒ 放行，否则整批重抓会把 ~1.5% 合法空页记成拒绝覆盖。
    assert.ok(!jd.isUnreadableParse(parseClassPage('<hr><br><pre>public interface <span class="typeNameLabel">IMarker</span> extends <a href="#">IForgeEventType</a></pre>')),
      "无成员、无 memberNameLink 的接口被误判为读不懂 ⇒ --force 会把合法空页全挡掉");
    // 注解页（@interface）：成员在「Required/Optional Element Summary」表里，且类声明**前面还有注解行**
    // （`@Retention(…) @Target(…) public @interface API`）。两个形状都真踩过：Element 表不认 ⇒ 六档共 30 篇
    // 注解页被自己的守卫挡下；压空格把 `PACKAGE) public` 的边界吃掉 ⇒ 类声明也丢。
    const anno = '<pre>@Retention(value=RUNTIME)\n @Target(value=PACKAGE)\npublic @interface <span class="memberNameLabel">API</span></pre>'
      + '<h3>Required Element Summary</h3><table class="memberSummary"><tr><th class="colFirst">Modifier and Type</th></tr>'
      + '<tr><td class="colFirst"><code>java.lang.String</code></td><td class="colLast"><code><span class="memberNameLink"><a href="#">owner</a></span></code></td></tr></table>';
    const pa = parseClassPage(anno);
    assert.equal(pa.classSig, "public @interface API", `注解页类声明不符：${pa.classSig}`);
    assert.equal((pa.elements ?? []).length, 1, `注解元素没解析出来：${JSON.stringify(pa.elements)}`);
    assert.ok(!jd.isUnreadableParse(pa), "注解页被判成「读不懂」⇒ 守卫会把好正文挡住，整批重抓漏 30 篇");
    assert.ok(htmlToMarkdown("API", "cpw/mods/fml/common", pa, "1.7.10", "https://x/API.html", "10.13.4.1614").includes("## Elements"),
      "渲染缺 ## Elements 分节 ⇒ 与 HEAD 语料的注解页体裁不一致");
    assert.equal(parseClassPage("<pre>@Override\npublic void interfaceMethod()</pre>").classSig, "",
      "成员详情的 <pre>（带 @Override / 方法名含 interface）被当成类声明");
  });
  assert.equal(fails.length, 0, "planClassWrites 回归：\n" + fails.join("\n"));
  console.log("  S9 javadoc 冲突计划 + 解析器: 5 组负例全过（同 URL 去重 / 异 URL 确定后缀 / 大小写共存 / import 不触发爬取 / 旧式表格 + 注解元素 + 判据⑥两条腿）");
}
// ── #17 yarn 名存在性门（assert-skill-yarn-attest）：挂载 + 证明它真会红 ──────
// 2026-09-20 用户裁定把 yarn-mappings.sqlite 升格为「类名存在性」合法来源并配门。
// 独立脚本不会被测试链执行，所以这里挂四件事：门自带沙盒自检（投毒必红）、真清单
// 必须绿（否则等于给仓库挂了个常红门）、清单指向不存在的文件要红、空清单要红。
// 后两条证明挂载不是装饰：坏输入 / 零输入都不许静默放行。
{
  const GATE = fileURLToPath(new URL("./scripts/assert-skill-yarn-attest.mjs", import.meta.url));
  const run = (args, env = {}) =>
    spawnSync(process.execPath, [GATE, ...args], {
      env: { ...process.env, ...env },
      encoding: "utf8",
      windowsHide: true,
    });

  mkdirSync(GATE_SCRATCH, { recursive: true });

  const self = run(["--selftest"]);
  assert.equal(self.status, 0, `yarn 名存在性门自检失败（含"投毒必红"用例）：\n${self.stdout}${self.stderr}`);

  const real = run([]);
  assert.equal(real.status, 0, `真清单上有标识符既无本档语料也无本档 yarn 映射：\n${real.stdout}${real.stderr}`);

  const badList = jpath(GATE_SCRATCH, "yarn-attest-bad-list.txt");
  writeFileSync(badList, "fabric/1.21.11/.cursor/skills/__no_such_skill__.md\n", "utf8");
  const missing = run([], { MC_SKILL_YARN_ATTEST_LIST: badList });
  assert.notEqual(missing.status, 0, "清单指向不存在的技能正文却仍然放行 ⇒ 门对坏输入无防御");

  const emptyList = jpath(GATE_SCRATCH, "yarn-attest-empty.txt");
  writeFileSync(emptyList, "# 只有注释\n", "utf8");
  const empty = run([], { MC_SKILL_YARN_ATTEST_LIST: emptyList });
  assert.notEqual(empty.status, 0, "零输入被当通过 ⇒ 清空清单就能让门静默失效");

  console.log("  #17 yarn 名存在性门: 自检 / 真清单绿 / 坏清单红 / 空清单红 四项挂载生效");
}
// ── #18 query_upstream_releases（A2 · P0-1 上游可用性 + P0-2 分层输出）──────────
// 判据分三条腿：① 纯函数（白名单 / slug 形状 / 版本归属规则 / 降序）离线可投毒；
// ② CLI 拒绝路径不联网也必须拒绝（MISSING_VERSION / MISSING_SLUG，rc=1 + 信封 success:false）；
// ③ 「上游没有」与「没查到」不得塌成同一个值 —— 那是本工具存在的理由，也是最容易被改回去的地方。
{
  const up = await import("./dist/upstream/releases.js");
  const {
    assertAllowedUpstreamUrl, isSafeSlug, parseMavenVersions, parseMetaJson,
    mcMatchRule, compareVersionDesc, UPSTREAM_ENDPOINTS, UPSTREAM_SOURCES, queryUpstreamReleases,
    MAVEN_HOST_ALIASES, parseMavenSlug, parseMojangManifest, mavenNotFoundHint, notFoundPayload,
  } = up;
  const fails = [];
  const t = async (name, fn) => { try { await fn(); } catch (e) { fails.push(`${name}: ${e.message}`); } };

  await t("主机白名单：只收 https 与自家 host（含 A4c 的 maven 别名表）", () => {
    for (const s of UPSTREAM_SOURCES) {
      if (s === "modrinth") continue;
      // maven 的 URL 由 slug 的别名解析（其余源直接 build）。
      const u = s === "maven"
        ? UPSTREAM_ENDPOINTS[s].build(undefined, "fabric:net/fabricmc/yarn")
        : UPSTREAM_ENDPOINTS[s].build("1.20.1", undefined);
      assertAllowedUpstreamUrl(u);
    }
    // A4c：别名表里每个主机都必须在白名单内（否则坐标一合法就撞 URL_REJECTED）
    for (const [alias, e] of Object.entries(MAVEN_HOST_ALIASES)) {
      assertAllowedUpstreamUrl(`https://${e.host}/${e.prefix ? e.prefix + "/" : ""}x/y/maven-metadata.xml`);
      assert.ok(e.host.length > 0, `别名 ${alias} 的主机为空`);
    }
    assert.throws(() => assertAllowedUpstreamUrl("http://maven.minecraftforge.net/x"), /https/);
    assert.throws(() => assertAllowedUpstreamUrl("https://evil.example.com/x"), /白名单/);
    assert.throws(() => assertAllowedUpstreamUrl("https://maven.minecraftforge.net.evil.com/x"), /白名单/);
    // 重定向落点：parchment 的托管后端已登记；其余主机（含内网回环）一律拒绝，且不因「入口在白名单」而放行
    assertAllowedUpstreamUrl("https://ldtteam.jfrog.io/artifactory/parchmentmc-public/x", true);
    assert.throws(() => assertAllowedUpstreamUrl("https://ldtteam.jfrog.io/x"), /白名单/, "落点白名单不得反向放宽入口白名单");
    // A4c：legacyfabric 的入口 302 到自家新域名（实测），已显式登记落点；同样不得反向放宽入口。
    assertAllowedUpstreamUrl("https://repo.legacyfabric.net/legacyfabric/net/legacyfabric/yarn/maven-metadata.xml", true);
    assert.throws(() => assertAllowedUpstreamUrl("https://repo.legacyfabric.net/legacyfabric/x"), /白名单/, "落点登记不得反向放宽入口白名单");
    assert.throws(() => assertAllowedUpstreamUrl("https://169.254.169.254/latest/meta-data/", true), /白名单/);
    assert.throws(() => assertAllowedUpstreamUrl("https://127.0.0.1:8787/x", true), /白名单/);
  });

  await t("slug 形状校验挡在拼 URL 之前（SSRF / 路径穿越）", () => {
    assert.equal(isSafeSlug("fabric-api"), true);
    for (const bad of ["../etc", "a/b", "A-Api", "", "-lead", "x?".concat("y"), "z#frag", "a".repeat(65)]) {
      assert.equal(isSafeSlug(bad), false, `应拒绝 ${JSON.stringify(bad)}`);
    }
  });

  await t("maven-metadata 解析不吃嵌套标签", () => {
    const xml = `<metadata><groupId>n</groupId><artifactId>forge</artifactId>
<versioning><latest>1.20.1-47.4.23</latest><release>1.20.1-47.4.23</release>
<versions><version>1.20.1-47.4.22</version><version>1.20.1-47.4.23</version></versions>
<lastUpdated>20260919195254</lastUpdated></versioning></metadata>`;
    const rows = parseMavenVersions(xml);
    assert.deepEqual(rows.map((r) => r.version), ["1.20.1-47.4.22", "1.20.1-47.4.23"]);
    assert.equal(rows[0].lastUpdated, "20260919195254");
    assert.deepEqual(parseMavenVersions("<html>502 Bad Gateway</html>").length, 0, "HTML 壳必须解析成 0 条，交给上层报 UPSTREAM_PARSE");
  });

  await t("meta/modrinth 三种形状各自归一", () => {
    const loader = parseMetaJson("fabric-loader", [{ loader: { version: "0.15.11", maven: "net.fabricmc:fabric-loader:0.15.11", stable: true }, intermappings: {} }, { junk: 1 }]);
    assert.deepEqual(loader, [{ version: "0.15.11", maven: "net.fabricmc:fabric-loader:0.15.11", stable: true }]);
    // A9：非 modrinth 源上游不提供版本类型 ⇒ 字段必须缺席（缺席 ≠ release，禁止猜）
    assert.equal(loader[0].versionType, undefined, "fabric-loader 不得凭空产出 versionType");
    const yarn = parseMetaJson("fabric-yarn", [{ version: "1.21.4+build.8", maven: "net.fabricmc:yarn:1.21.4+build.8", stable: false }]);
    assert.equal(yarn[0].stable, false);
    assert.equal(yarn[0].versionType, undefined, "fabric-yarn 不得凭空产出 versionType");
    const mr = parseMetaJson("modrinth", [{ id: "v1", version_number: "0.98.0", version_type: "beta", game_versions: ["1.20", "1.20.1"], loaders: ["fabric"], filename: "x.jar" }]);
    assert.deepEqual(mr[0].gameVersions, ["1.20", "1.20.1"]);
    // A9（R111④）：modrinth 的 version_type 逐字回显 ⇒ 工具面能判 release/beta
    assert.equal(mr[0].versionType, "beta", "modrinth version_type 必须逐字回显");
    const mrNoType = parseMetaJson("modrinth", [{ id: "v2", version_number: "1.0.0" }]);
    assert.equal(mrNoType[0].versionType, undefined, "上游没给 version_type 就不给字段（不得默认 release）");
    assert.equal(parseMetaJson("modrinth", []).length, 0);
  });

  // ── A4c（2026-09-24 用户裁定「全补 8+3」）：maven 坐标 / Mojang 清单 / legacyfabric ──
  await t("A4c：maven 坐标形状与别名表挡在拼 URL 之前", () => {
    const ok = parseMavenSlug("fabric:net/fabricmc/yarn");
    assert.ok(ok, "合法坐标被拒");
    assert.equal(ok.host, "maven.fabricmc.net");
    assert.equal(parseMavenSlug("quilt:org/quiltmc/quilt-mappings").prefix, "repository/release", "带前缀的主机必须从别名表取前缀");
    // 坐标段允许驼峰（实测 maven 上真有 ClothConfig / RoughlyEnoughItems 这类 artifact）
    assert.ok(parseMavenSlug("shedaniel:me/shedaniel/ClothConfig"), "驼峰 artifact 不该被挡");
    const bad = [
      "net/fabricmc/yarn", // 无别名
      "unknown:net/fabricmc/yarn", // 别名不在表里
      "fabric:", // 无坐标
      "fabric:net", // 坐标层级不足
      "fabric:net/../yarn", // 路径穿越
      "fabric:net//yarn", // 空段
      "fabric:net/fabricmc/yarn/", // 尾斜杠 = 空段
      "FABRIC:net/fabricmc/yarn", // 别名大写
      "fabric:net/fabricmc/yarn?x=1", // 查询串
    ];
    for (const s of bad) assert.equal(parseMavenSlug(s), null, `应拒绝 ${JSON.stringify(s)}`);
    assert.throws(() => UPSTREAM_ENDPOINTS.maven.build(undefined, "evil.example.com/x/y"), /slug|别名/);
  });

  await t("A4c：Mojang 清单归一（type → versionType 逐字）", () => {
    const rows = parseMojangManifest({
      latest: { release: "1.21.1", snapshot: "24w33a" },
      versions: [
        { id: "1.21.1", type: "release", releaseTime: "2024-08-08T14:00:00+00:00" },
        { id: "24w33a", type: "snapshot" },
        { junk: 1 },
      ],
    });
    assert.deepEqual(rows.map((r) => r.version), ["1.21.1", "24w33a"]);
    assert.equal(rows[0].versionType, "release");
    assert.equal(rows[1].versionType, "snapshot");
    assert.equal(parseMojangManifest({}).length, 0, "没有 versions[] 必须归一成 0 条（交给上层报 UPSTREAM_PARSE）");
    assert.equal(parseMojangManifest("<html>502</html>").length, 0);
    assert.equal(mcMatchRule("mojang-manifest", "1.21.1").test({ version: "1.21.1" }), true);
    assert.equal(mcMatchRule("mojang-manifest", "1.21.1").test({ version: "1.21.2" }), false);
  });

  await t("A4c：legacyfabric loader 是扁平形状（不是 fabric-loader 的嵌套 loader）", () => {
    const rows = parseMetaJson("legacyfabric-loader", [
      { separator: ".", build: 3, maven: "net.fabricmc:fabric-loader:0.19.3", version: "0.19.3", stable: true },
    ]);
    assert.equal(rows[0].version, "0.19.3");
    assert.equal(rows[0].stable, true);
    assert.equal(
      parseMetaJson("legacyfabric-loader", [{ loader: { version: "9.9.9" } }]).length,
      0,
      "嵌套形状必须解析不出 —— 实测该端点是扁平的，抄 fabric-loader 的解析会全空",
    );
  });

  await t("A4c：maven 缺 slug / 坏 slug 不联网也当场拒", async () => {
    const miss = await queryUpstreamReleases({ source: "maven" });
    assert.equal(miss.ok, false);
    assert.equal(miss.error.code, "MISSING_SLUG");
    const bad = await queryUpstreamReleases({ source: "maven", slug: "unknown:net/x" });
    assert.equal(bad.ok, false);
    assert.equal(bad.error.code, "MISSING_SLUG", "别名不在表里必须在拼 URL 之前拒（防 SSRF）");
  });

  // A4c 口径洞（2026-09-24 用户回报）：`source=maven` 的 404 被三态承诺说过头了 ——
  // 它真实含义只是「该路径没有 maven-metadata.xml」，分不清「构件不存在」与「坐标写法不对」。
  await t("A4c 口径洞：maven 的 404 不得替「上游确实没有」背书", () => {
    const p = notFoundPayload({ source: "maven", url: "https://maven.example/x", slug: "progwml6:mezz/jei", via: "fetch", fetchedAt: "t" });
    assert.equal(p.ok, true);
    assert.equal(p.available, false, "404 仍落 available:false（三态形状不变）");
    assert.match(String(p.hint), /只证明|坐标/, "maven 404 必须带语义边界 hint");
    assert.ok(!/上游没有该模组|上游确实没有该/.test(String(p.hint)), "hint 不得把「写法不对」说成「上游没有」");
    assert.match(String(p.hint), /modrinth/, "hint 要给可证的替代出口（按 slug 查的源）");
    assert.match(mavenNotFoundHint("fabric:net/fabricmc/nope"), /fabric:net\/fabricmc\/nope/, "hint 要点回被查的坐标");
    // 其余源查的是写死的 artifact，不含此歧义 ⇒ 不加 hint（形状不动）
    const f = notFoundPayload({ source: "forge", url: "https://x/y", minecraftVersion: "1.20.1", via: "fetch", fetchedAt: "t" });
    assert.equal(f.hint, undefined, "非 maven 源不得凭空多出 hint");
    assert.match(String(f.matchRule), /1\.20\.1/, "matchRule 仍要回显");
  });

  // 反证腿：MC 1.21.1 的 NeoForge 编号是 21.1.x（实测 maven 上 244 条，scaffold 钉 21.1.248）。
  // 旧实现按 `${mc}-` 前缀过滤 ⇒ 244 条全被滤掉 ⇒ available:false，把「上游有 244 个 build」报成
  // 「上游没有 1.21.1」。下面第一句就是在钉「朴素规则确实错」，第二句钉新规则对。
  await t("版本归属规则：neoforge 去掉前导 1.，且不得反向放宽", () => {
    const naive = (v, mc) => v.startsWith(`${mc}-`) || v === mc;
    assert.equal(naive("21.1.248", "1.21.1"), false, "对照失效：朴素规则若不再误判，本反证就该换成别的缺陷锚点");
    assert.equal(mcMatchRule("neoforge", "1.21.1").test({ version: "21.1.248" }), true);
    assert.equal(mcMatchRule("neoforge", "1.21.1").test({ version: "21.4.100" }), false, "跨 minor 不得放行");
    assert.equal(mcMatchRule("neoforge", "26.1").test({ version: "26.1.0" }), true, "MC 26.x 无前导 1. 也要能推前缀");
    assert.equal(mcMatchRule("neoforge", "26.1").test({ version: "26.3.0-beta" }), false);
    assert.equal(mcMatchRule("forge", "1.20.1").test({ version: "1.20.1-47.4.23" }), true);
    // parchment 与 forge 不是一套编号：版本串是日期（2023.09.03 / …-nightly-SNAPSHOT），
    // MC 版本在 artifact 名里 ⇒ 与 forge 共用 "${mc}-" 前缀会把整表滤空（实测 parchment-data 路径还是 404）。
    assert.equal(mcMatchRule("parchment", "1.20.1").test({ version: "2023.09.03" }), true);
    assert.equal(UPSTREAM_ENDPOINTS.parchment.needsMc, true, "parchment 不带 MC 就拼不出 artifact 名");
    assert.match(UPSTREAM_ENDPOINTS.parchment.build("1.20.1", undefined), /\/parchment-1\.20\.1\/maven-metadata\.xml$/);
    assert.equal(mcMatchRule("modrinth", "1.20.1").test({ version: "0.98.0", gameVersions: ["1.20.1"] }), true);
    assert.equal(mcMatchRule("modrinth", "1.20.1").test({ version: "0.98.0", gameVersions: ["1.21"] }), false);
    assert.equal(mcMatchRule("fabric-yarn", "1.21.4").test({ version: "1.14.4+build.3" }), true, "meta 端点已按 MC 分列 ⇒ 整表都属于它");
  });

  await t("降序按数值段比，不是字典序也不是上游原地顺序", () => {
    const vs = ["21.1.9", "21.1.249", "21.1.251", "21.1.100"].sort(compareVersionDesc);
    assert.deepEqual(vs, ["21.1.251", "21.1.249", "21.1.100", "21.1.9"]);
    assert.ok(compareVersionDesc("1.21.4+build.8", "1.21.4+build.10") > 0, "build.10 应大于 build.8");
    // 正式版要压过同号的 nightly / beta，否则 latest 会报成一个预发布（parchment 每条都有 nightly 兄弟）。
    // 比较器是 Array.sort 语义：**负数 = 前者排前面**（与上一行 build.8/build.10 同口径）。
    assert.ok(compareVersionDesc("2023.09.03", "2023.09.03-nightly-SNAPSHOT") < 0, "正式版应排在 nightly 前");
    assert.deepEqual(["2023.09.03-nightly-SNAPSHOT", "2023.09.03"].sort(compareVersionDesc), ["2023.09.03", "2023.09.03-nightly-SNAPSHOT"]);
    assert.equal(compareVersionDesc("1.20.1", "1.20.1"), 0);
  });

  // ② 拒绝路径离线可验：这三条都不该碰网络。
  await t("入参不合法时不发请求，且三态不塌", async () => {
    const noVer = await queryUpstreamReleases({ source: "fabric-loader" });
    assert.equal(noVer.ok, false);
    assert.equal(noVer.error?.code, "MISSING_VERSION");
    const badSlug = await queryUpstreamReleases({ source: "modrinth", slug: "../etc" });
    assert.equal(badSlug.error?.code, "MISSING_SLUG");
    const unknown = await queryUpstreamReleases({ source: "sponge" });
    assert.equal(unknown.error?.code, "UNKNOWN_SOURCE");
    // parchment 的 artifact 名里就带 MC 版本 ⇒ 少版本是「拼不出 URL」，不是「上游没有」
    const noVerParchment = await queryUpstreamReleases({ source: "parchment" });
    assert.equal(noVerParchment.error?.code, "MISSING_VERSION");
    for (const r of [noVer, badSlug, unknown, noVerParchment]) {
      assert.equal(r.ok, false, "拒绝路径必须 ok:false（否则 CLI 退出码会说没问题）");
      assert.equal(r.releases.length, 0);
    }
  });

  const CLI = jpath(import.meta.dirname, "dist", "cli.js");
  const cli = (args) => spawnSync(process.execPath, [CLI, ...args], { encoding: "utf8", windowsHide: true, timeout: 60_000 });
  await t("CLI 拒绝路径：rc=1 + 信封 success:false + 错误码原样", () => {
    const r = cli(["query_upstream_releases", "--source=fabric-loader"]);
    assert.notEqual(r.status, 0, "缺 minecraftVersion 却 rc=0 ⇒ 退出码在撒谎");
    const env = JSON.parse(r.stdout);
    assert.equal(env.success, false);
    assert.equal(env.result.error.code, "MISSING_VERSION");
  });

  await t("注册面：outputSchema 与 structuredContent 同层，indexToolSchemas 有镜像", async () => {
    const reg = await import("./dist/tool-registry.js");
    const entry = reg.indexToolSchemas.find((e) => e.name === "query_upstream_releases");
    assert.ok(entry, "indexToolSchemas 缺镜像 ⇒ CLI list-tools 少一个工具");
    assert.ok(reg.queryUpstreamReleasesOutputSchema, "outputSchema 常量被摘掉 ⇒ structuredContent 不再被校验");
    // S4′（2026-09-25）加了 `refresh`（跳缓存回源）⇒ 名单跟着走；`project` 仍必须在名单外
    assert.deepEqual(Object.keys(reg.queryUpstreamReleasesSchema.shape).sort(), ["limit", "minecraftVersion", "refresh", "slug", "source"]);
    assert.equal("project" in reg.queryUpstreamReleasesSchema.shape, false, "--project 是 CLI 保留别名，参数名不得回退成 project");
  });

  await t("A4b 棘轮：outputSchema 保持 1/82（铺开须先撤本判据）", async () => {
    const { readFileSync } = await import("node:fs");
    const src = readFileSync(jpath(import.meta.dirname, "src", "tool-registry.ts"), "utf8");
    const n = (src.match(/^\s*outputSchema:/gm) || []).length;
    assert.equal(n, 1, `outputSchema 注册出现 ${n} 次 ⇒ A4b「暂不铺」（2026-09-24 用户裁定）被突破（基准 1/82）`);
  });

  await t("A4a 探针落点：clientCapabilities 回显随 build 在场（只许一处）", async () => {
    const { readFileSync } = await import("node:fs");
    const dist = readFileSync(jpath(import.meta.dirname, "dist", "tool-registry.js"), "utf8");
    assert.ok(
      dist.includes("getClientCapabilities?.() ?? null"),
      "dist/tool-registry.js 丢了 A4a 探针（clientCapabilities 回显）⇒ 先 npm run build 再测",
    );
    const src = readFileSync(jpath(import.meta.dirname, "src", "tool-registry.ts"), "utf8");
    assert.equal(
      (src.match(/\bclientCapabilities\s*:/g) || []).length,
      1,
      "A4a 探针被复制铺开（基准恰 1 处；要铺开先改本判据与 docs/mcmap-linkie-absorption.md §4）",
    );
  });

  if (fails.length) assert.fail(`#18 上游可用性判据：\n  - ${fails.join("\n  - ")}`);
  console.log("  #18 query_upstream_releases: 白名单（含 A4c maven 别名表）/slug/解析/版本归属/降序/拒绝路径/注册面 + A4c 五组（maven 坐标 / Mojang 清单 / legacyfabric 扁平 / 缺 slug 拒绝 / **maven-404 语义边界**）+ neoforge 前缀反证钉住");
}
// ── #19 基岩 scriptapi 的「大小写碰撞 → 静默覆盖」防腿（A3 收口）───────────────
// 实测缺陷：@minecraft/server 的 d.ts 里 `System`(class) 与 `system`(const) 成对存在，
// 按 name+".md" 直写在 NTFS 上后者覆盖前者 ⇒ 盘上 622 个正文、索引 624 条，且丢的是两页 class。
// 这里把「防覆盖计划」和「索引剪枝」两件事各钉一组，全部离线（临时目录），不联网、不动 data/。
{
  const fails = [];
  const t = async (name, fn) => { try { await fn(); } catch (e) { fails.push(`${name}: ${e.message}`); } };
  const api = await import("./scripts/fetch-bedrock-script-api.mjs");
  const corpus = await import("./scripts/_lib/bedrock-corpus.mjs");

  await t("planScriptApiWrites：碰撞者拿后缀，两条都保住", () => {
    const { writes, conflicts } = api.planScriptApiWrites([
      { name: "System", kind: "class" }, { name: "system", kind: "const" },
      { name: "World", kind: "class" }, { name: "world", kind: "const" },
      { name: "Block", kind: "class" },
    ]);
    assert.equal(writes.length, 5, "一条都不许丢");
    assert.equal(conflicts.length, 2, JSON.stringify(conflicts));
    const lower = writes.map((w) => w.fileName.toLowerCase());
    assert.equal(new Set(lower).size, 5, "大小写不敏感卷上仍会互相覆盖：" + lower.join(","));
    assert.equal(writes[0].fileName, "System.md", "首条不得被改名（否则每次跑批都在换 id）");
    assert.match(writes[1].fileName, /^system~[0-9a-f]{6}\.md$/);
  });

  // 反证腿：碰撞处理若被改回「后来者直接覆盖」，这里必须红 —— 所以判据写成性质（一条都不丢 +
  // 大小写不敏感互不相同），而不是「某种输入会抛」（抛是函数自身的不变量自证，正常输入到不了）。
  await t("planScriptApiWrites：任意大小写变体与重复声明都不得丢页", () => {
    const adversarial = [
      { name: "Foo", kind: "const" }, { name: "foo", kind: "const" }, { name: "FOO", kind: "const" },
      { name: "Foo", kind: "const" }, { name: "Bar", kind: "class" }, { name: "bar", kind: "interface" },
      { name: "bar", kind: "interface" }, { name: "baz", kind: "enum" },
    ];
    const { writes } = api.planScriptApiWrites(adversarial);
    assert.equal(writes.length, adversarial.length, "一条都不许被静默折叠");
    assert.equal(new Set(writes.map((w) => w.fileName.toLowerCase())).size, adversarial.length,
      "大小写不敏感地仍互相覆盖：" + writes.map((w) => w.fileName).join(","));
  });

  await t("planScriptApiWrites 对真实语料可跑（后缀确定性）", () => {
    // 2026-09-21 拆树：scriptapi 语料（含 typed JSON）从 bedrock-docs 挪到独立树 bedrock-scriptapi。
    // 判据本身不变（真实 624 声明可跑 + 碰撞对恰 2 组 + 后缀确定性），只跟着数据改读取路径。
    const typed = JSON.parse(readFileSync(jpath(import.meta.dirname, "..", "data", "bedrock_stable", "bedrock-scriptapi", "stable", "scriptapi-typed.json"), "utf8"));
    const { writes, conflicts } = api.planScriptApiWrites(typed.decls);
    assert.equal(writes.length, typed.decls.length);
    assert.equal(conflicts.length, 2, `真实 d.ts 的碰撞对实测 2 组，实得 ${conflicts.length}`);
    assert.equal(new Set(writes.map((w) => w.fileName.toLowerCase())).size, writes.length);
  });

  await t("pruneIndexToDisk：只剪本命名空间里正文真不存在的条目", () => {
    const dir = jpath(GATE_SCRATCH, "prune-case");
    rmSync(dir, { recursive: true, force: true });
    mkdirSync(dir, { recursive: true });
    writeFileSync(jpath(dir, "System.md"), "class page", "utf8");
    const entries = [
      { id: "stable/scriptapi/System" },   // 正文在（大小写一致）⇒ 留
      { id: "stable/scriptapi/system" },   // 盘上真名是 System.md ⇒ NTFS 会误指到 class 页 ⇒ 剪
      { id: "stable/molang-syntax" },      // 别的命名空间 ⇒ 原样透传，本函数无权剪
    ];
    const { kept, pruned } = corpus.pruneIndexToDisk(entries, "stable/scriptapi/", dir);
    assert.deepEqual(pruned.map((p) => p.id), ["stable/scriptapi/system"], JSON.stringify(pruned));
    assert.deepEqual(kept.map((e) => e.id), ["stable/scriptapi/System", "stable/molang-syntax"]);
  });

  await t("pruneIndexToDisk：目录空/不存在时不得清空索引", () => {
    const r = corpus.pruneIndexToDisk([{ id: "stable/scriptapi/A" }], "stable/scriptapi/", jpath(GATE_SCRATCH, "no-such-dir"));
    assert.equal(r.pruned.length, 0, "目录取不到就剪 ⇒ 一次读盘失败能清空整片索引");
    assert.equal(r.kept.length, 1);
  });

  if (fails.length) assert.fail(`#19 基岩 scriptapi 防覆盖判据：\n  - ${fails.join("\n  - ")}`);
  console.log("  #19 scriptapi 大小写碰撞 / 索引剪枝: 5 组判据（含真实 624 声明的可跑性与后缀确定性）");
}
// ── #20 scaffold mixin 注入形状门（assert-scaffold-mixin-shape）：挂载 + 证明它真会红 ──
// story S1 / 审计 P0-1：三处 scaffold mixin 注入 `)V` 方法却声明 CallbackInfoReturnable —— 编译期合法、
// 只在 Mixin apply 期抛 InvalidInjectionException，而三档 pack.meta.json 都是 buildVerified:true，
// 现有构建检查抓不到。判据是**被注入方法的返回类型**（签名取自该档自己的
// data/fabric_<ver>/mappings/yarn-mappings.sqlite），不是方法名字符串。
// 挂四件事：门自带夹具自检（投毒必红 + NO_MAPPING_LAYER 独立态）、真树必须绿、自检必须报 N/N、
// 以及「映射层坏了不许静默放行」由自检的 BAD_MAPPING_LAYER 用例守住。
{
  const GATE = fileURLToPath(new URL("./scripts/assert-scaffold-mixin-shape.mjs", import.meta.url));
  const run = (args) =>
    spawnSync(process.execPath, [GATE, ...args], {
      env: { ...process.env },
      encoding: "utf8",
      windowsHide: true,
    });

  const self = run(["--selftest"]);
  assert.equal(self.status, 0, `scaffold mixin 形状门自检失败（含"投毒必红"用例）：\n${self.stdout}${self.stderr}`);
  const tally = /selftest: (\d+)\/(\d+)/.exec(self.stdout || "");
  assert.ok(tally, `自检未打印 selftest: N/M 计数：\n${self.stdout}`);
  assert.equal(Number(tally[1]), Number(tally[2]), `自检用例未全过（${tally[1]}/${tally[2]}）：\n${self.stdout}`);

  const real = run([]);
  assert.equal(real.status, 0, `scaffold 里存在注入形状与目标方法返回类型不符的 mixin：\n${real.stdout}${real.stderr}`);
  const shape = /（scaffold java (\d+) · 含注入 (\d+) · 注入点 (\d+)/.exec(real.stdout || "");
  assert.ok(shape, `真树扫描未打印分母：\n${real.stdout}`);
  console.log(
    `  #20 scaffold mixin 形状门: 自检 ${tally[1]}/${tally[2]} 通过 · 真树 ${shape[1]} 个 scaffold java / ${shape[2]} 个含注入 / ${shape[3]} 个注入点全绿`,
  );
}
// ── #21 同档「禁令 ↔ 活围栏示范」一致性门（assert-rule-ban-vs-example）──
// story S4 task 4 / 类一：neoforge/26.1 的 01-registry:12 明令禁止裸 `BlockBehaviour.Properties.of()`，
// 同档 02-block.mdc 与 skills/mc-registry/SKILL.md 的活围栏却正在示范它 —— 现有 assert-rule-java-shapes
// 的四条判据全是**同文件自洽**、采集面又不含 skills/，抓不到这种跨文件互斥 ⇒ 单开一道表驱动门。
// 挂四件事（计数全部现取，不硬编码）：自带夹具自检（投毒必红 + 下界地板不误伤）、真树必须绿、
// 覆盖面三数必须同屏（表内对 / 判档 / 被扫文件）、汇总五数必须同屏（扫文件 / 判行 / 拒 / 采集面 / 地板）且拒=0。
{
  const GATE = fileURLToPath(new URL("./scripts/assert-rule-ban-vs-example.mjs", import.meta.url));
  const run = (args) =>
    spawnSync(process.execPath, [GATE, ...args], {
      env: { ...process.env },
      encoding: "utf8",
      windowsHide: true,
    });

  const self = run(["--selftest"]);
  assert.equal(self.status, 0, `禁令↔示范一致性门自检失败（含"投毒必红"用例）：\n${self.stdout}${self.stderr}`);
  const tally = /selftest\): (\d+)\/(\d+)/.exec(self.stdout || "");
  assert.ok(tally, `自检未打印 selftest: N/M 计数：\n${self.stdout}`);
  assert.equal(Number(tally[1]), Number(tally[2]), `自检用例未全过（${tally[1]}/${tally[2]}）：\n${self.stdout}`);

  const real = run([]);
  assert.equal(real.status, 0, `存在「同档既列为禁令、又在活围栏代码里示范」的互斥：\n${real.stdout}${real.stderr}`);
  const face = /覆盖面：表内 (\d+) 对 \/ 判 (\d+) 档 \/ 被扫文件 (\d+)/.exec(real.stdout || "");
  assert.ok(face, `真跑未打印覆盖面分母（表内对 / 判档 / 被扫文件）：\n${real.stdout}`);
  const sum = /汇总 扫文件=(\d+) 判行=(\d+) 拒=(\d+) 采集面=活禁令 (\d+)\/登记对 (\d+) 地板=文件≥(\d+) 且 活禁令≥(\d+)/.exec(real.stdout || "");
  assert.ok(sum, `真跑未打印汇总五数（扫文件 / 判行 / 拒 / 采集面 / 地板）：\n${real.stdout}`);
  assert.equal(Number(sum[3]), 0, `汇总行拒=${sum[3]} 而 rc 仍为 0（判据与退出码不一致）`);
  assert.ok(Number(sum[1]) >= Number(sum[6]), `扫文件 ${sum[1]} 低于自报地板 ${sum[6]} 却没红（地板腿失效）`);
  assert.ok(Number(sum[4]) >= Number(sum[7]), `活禁令 ${sum[4]} 低于自报地板 ${sum[7]} 却没红（地板腿失效）`);
  console.log(
    `  #21 禁令↔示范一致性门: 自检 ${tally[1]}/${tally[2]} 通过 · 表内 ${face[1]} 对 / 判 ${face[2]} 档 / 被扫 ${face[3]} 件 · 判行 ${sum[2]} · 拒 ${sum[3]} · 活禁令 ${sum[4]}/${sum[5]}（地板 文件≥${sum[6]} / 禁令≥${sum[7]}，均为下界）`,
  );
}
// ── #22 「文档缺页断言 ↔ 检索实况」一致性门（assert-doc-absence-claims）──
// story S5 / 第 5c 轮：neoforge/1.20.6 的 AGENTS.md:16/:23 与 1.20.4 的 mc-networking/SKILL.md:16
// 声称「本档无已核实 payload 页 / 该页 DOC_NOT_FOUND / 本档事件名是抄来的」，而同一份已入库语料
// 实测能取到该页（ok:true / total:10 / 首选 id networking/payload / versionFallback:false），
// 且两档 06-networking 早在 09-13 / 09-19 已改对 ⇒ 同树内规则与总纲/skill 互斥。
// 现有门全部只看代码形状，没有一道钉「文档存在性声称」⇒ 单开一道表驱动门（它同时钉住反证陷阱：
// 更正行里引用的 DOC_NOT_FOUND 落 citation 桶、不判红，所以验收判据不能是 grep DOC_NOT_FOUND 归零）。
// 挂四件事（计数全部现取，不硬编码）：夹具自检（投毒必红 + 下界地板不误伤 + 未判定不判红）、
// 真树必须绿、覆盖面三数同屏、汇总七数同屏且拒=0；另钉本门单次墙钟 < 2000 ms（禁止 spawn CLI 拖慢门链）。
{
  const GATE = fileURLToPath(new URL("./scripts/assert-doc-absence-claims.mjs", import.meta.url));
  const run = (args) =>
    spawnSync(process.execPath, [GATE, ...args], {
      env: { ...process.env },
      encoding: "utf8",
      windowsHide: true,
    });

  const self = run(["--selftest"]);
  assert.equal(self.status, 0, `文档缺页断言门自检失败（含"投毒必红"用例）：\n${self.stdout}${self.stderr}`);
  const tally = /selftest\): (\d+)\/(\d+)/.exec(self.stdout || "");
  assert.ok(tally, `自检未打印 selftest: N/M 计数：\n${self.stdout}`);
  assert.equal(Number(tally[1]), Number(tally[2]), `自检用例未全过（${tally[1]}/${tally[2]}）：\n${self.stdout}`);
  const poisoned = Number((/（(\d+) 记含红/.exec(self.stdout || "") || [])[1]);
  assert.ok(poisoned >= 5, `自检投毒例仅 ${poisoned} 记含红（要求 ≥5：声称↔可取互斥必红 + 采集塌 0 + 判据改瞎 + 引用桶 + 未判定桶）：\n${self.stdout}`);

  const t0 = Date.now();
  const real = run([]);
  const ms = Date.now() - t0;
  assert.equal(real.status, 0, `存在「声称本仓没有该文档页 / 该事件名非本档」而检索侧实测可取的互斥：\n${real.stdout}${real.stderr}`);
  assert.ok(ms < 2000, `本门单次 ${ms}ms ≥ 2000ms —— 拖慢门链，须退回「只跑静态表核对」或去掉子进程`);
  const face = /覆盖面：表内 (\d+) 条 \/ 判 (\d+) 档 \/ 被扫文件 (\d+)/.exec(real.stdout || "");
  assert.ok(face, `真跑未打印覆盖面分母（表内条 / 判档 / 被扫文件）：\n${real.stdout}`);
  const sum = /汇总 扫文件=(\d+) 判条目=(\d+) 未判定=(\d+) 引用=(\d+) 拒=(\d+) 采集面=活声称 (\d+)\/登记 (\d+) 地板=文件≥(\d+) 且 判定条目≥(\d+) 且 活声称≥(\d+)/.exec(real.stdout || "");
  assert.ok(sum, `真跑未打印汇总七数（扫文件 / 判条目 / 未判定 / 引用 / 拒 / 采集面 / 地板）：\n${real.stdout}`);
  assert.equal(Number(sum[5]), 0, `汇总行拒=${sum[5]} 而 rc 仍为 0（判据与退出码不一致）`);
  assert.ok(Number(sum[1]) >= Number(sum[8]), `扫文件 ${sum[1]} 低于自报地板 ${sum[8]} 却没红（地板腿失效）`);
  assert.ok(Number(sum[2]) >= Number(sum[9]), `判条目 ${sum[2]} 低于自报地板 ${sum[9]} 却没红（地板腿失效）`);
  assert.ok(Number(sum[6]) >= Number(sum[10]), `活声称 ${sum[6]} 低于自报地板 ${sum[10]} 却没红（地板腿失效）`);
  console.log(
    `  #22 文档缺页断言↔检索实况门: 自检 ${tally[1]}/${tally[2]} 通过（含红投毒 ${poisoned} 记）· 真树 ${ms}ms · 表内 ${face[1]} 条 / 判 ${face[2]} 档 / 被扫 ${face[3]} 件 · 判条目 ${sum[2]} · 未判定 ${sum[3]} · 引用 ${sum[4]} · 拒 ${sum[5]} · 活声称 ${sum[6]}/${sum[7]}（地板 文件≥${sum[8]} / 条目≥${sum[9]} / 声称≥${sum[10]}，均为下界）`,
  );
}
console.log("script helper regression tests passed");
