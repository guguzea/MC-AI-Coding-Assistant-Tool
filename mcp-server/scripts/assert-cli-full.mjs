/**
 * assert-cli-full：CLI 全量档（审计补齐，2026-09-17）——81 个 MCP 工具逐个经 dist/cli.js 入口真跑。
 *
 * 口径（用户 review B4 写死）：
 *  - 「入口契约探针」= `<工具> --help`（全量 81，断言 exit 0）+ 无参探针（断言 exit ∈ {0,1,2}
 *    且 stdout 为 JSON 信封、stderr 无异常栈）——**单列计数，不算"真跑"**；
 *  - 「真实调用」= A 类（离线安全，逐条建议参数）全量 + B 类抽样（data/ 本机具备）；
 *  - 「豁免」= C 类（网络/下载/缓存/自备 jar）+ B 类缺口版本档 —— **逐条打印原因，不静默跳过**；
 *  - 汇总表分「探针 / 真实调用 / 豁免 / 失败」四列；**exit = 失败 > 0 ? 1 : 0（豁免绝不混进通过）**。
 *
 * 依赖清单依据：code-explorer 子代理 2026-09-17 静态核实（工具注册表 + handler 实现 + data/ 目录实读）。
 * 本档**不默认跑**（不进 test-core / npm test 链），按需执行：npm run test:cli:full。
 * 离线前提：不依赖网络；B 类缺口与 C 类一律豁免并打印原因。单工具超时 60s；`MC_SKILL_SKIP_DOWNLOAD=1` 时下载类诚实失败（已列 C）。
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const PKG = path.resolve(HERE, "..");
const CLI = path.join(PKG, "dist", "cli.js");
const PER_TOOL_TIMEOUT_MS = 60_000;

// NP-11（2026-09-17）：夹具路径按脚本自身位置解析（此前写死 M:/…，fresh clone 下夹具全落空、
// 本档会退化成纯契约检查）。统一正斜杠，便于直接拼进 CLI 参数。
const PKG_DIR = PKG.replace(/\\/g, "/");
const REPO_DIR = path.resolve(PKG, "..").replace(/\\/g, "/");

/** A 类：离线可真跑（35 项；每项 = [工具名, 建议参数]）。 */
const OFFLINE = [
  ["get_server_status", ["--version", "1.20.1"]],
  ["diagnose_data_paths", []],
  ["list_knowledge_resources", []],
  ["read_knowledge_resource", ["--uri", "mcskill://workflow/mc-new-block"]],
  ["get_version_info", ["--version", "1.20.1", "--action", "注册方块", "--platform", "forge"]],
  ["diagnose_gradle", ["--buildGradle", "plugins { id 'net.minecraftforge.gradle' version '[6.0,6.2)' }", "--gradleProperties", "minecraft_version=1.20.1"]],
  ["generate_datagen", ["--providerType", "recipe", "--modId", "mymod", "--targetName", "my_block", "--version", "1.20.1", "--platform", "forge"]],
  ["crash_analyze", ["--crashReport", "java.lang.NullPointerException\n\tat com.example.Foo.bar(Foo.java:1)"]],
  ["validate_project", ["--modsToml", 'modLoader="javafml"']],
  ["mixin_analyze", ["--version", "1.20.1"]],
  ["audit_resources", ["--resourceRoot", `${PKG_DIR}/src`]],
  ["validate_datapack_json", ["--kind", "recipe", "--jsonContent", '{"type":"minecraft:crafting_shaped","pattern":["#"],"key":{"#":{"item":"minecraft:stone"}},"result":{"item":"minecraft:stone"}}']],
  ["get_workflow_template", ["--name", "mc-new-block"]],
  ["localize_mod", ["--mode", "own", "--action", "diff", "--enUsJson", '{"item.x":"X"}']],
  ["analyze_build_log", ["--logText", "error: cannot find symbol Foo"]],
  ["analyze_log", ["--logText", "java.lang.NullPointerException", "--version", "1.20.1"]],
  ["check_dependencies", []],
  ["validate_addon_manifest", ["--manifestJson", '{"format_version":2,"header":{"name":"t","uuid":"00000000-0000-0000-0000-000000000000","version":[1,0,0]},"modules":[]}']],
  ["validate_bp_json", ["--kind", "entity", "--json", '{"minecraft:entity":{"format_version":"1.10.0","components":{}}}']],
  ["generate_addon_manifest", ["--packName", "Test", "--packType", "data"]],
  ["generate_bp_entity", ["--identifier", "demo:widget"]],
  ["activate_platform_pack", ["--action", "list"]],
  ["detect_mod_project", ["--projectPath", `${REPO_DIR}/forge/1.20.1/scaffold`]],
  ["check_publish_ready", ["--projectPath", `${REPO_DIR}/forge/1.20.1/scaffold`]],
  ["generate_model", ["--modId", "mymod", "--blockName", "my_block", "--version", "1.20.1"]],
  ["generate_lang", ["--modId", "mymod", "--entries", '{"block.mymod.x":"X"}', "--version", "1.20.1"]],
  ["generate_network_packet", ["--modId", "mymod", "--packetName", "MyPacket", "--platform", "forge_1.20.1"]],
  ["generate_capability", ["--modId", "mymod", "--name", "MyCap", "--platform", "forge", "--version", "1.20.1"]],
  ["generate_config", ["--modId", "mymod", "--loader", "forge", "--version", "1.20.1"]],
  ["generate_entity_renderer", ["--modId", "mymod", "--entityName", "Widget", "--platform", "forge", "--version", "1.20.1"]],
  ["generate_worldgen", ["--modId", "mymod", "--featureName", "my_feature", "--platform", "forge", "--version", "1.20.1"]],
  ["resolve_lib_skills", ["--platform", "fabric", "--mcVersion", "1.21.1"]],
  ["port_project", ["--projectPath", `${REPO_DIR}/forge/1.20.1/scaffold`, "--action", "extract_common"]],
  ["search_mod_code", ["--decompiledDir", `${PKG_DIR}/src`, "--query", "handler"]],
  ["get_migration_guide", ["--route", "1.21.11->26.1"]],
];

/** B 类抽样：需要 data/ 语料且本机具备（真实调用）。 */
const DATA_BACKED = [
  ["query_api", ["--className", "Block", "--version", "1.20.1"]],
  ["convert_mapping", ["--from", "mcp", "--to", "mojang", "--name", "getHealth", "--version", "1.20.1"]],
  ["query_registry", ["--query", "stone", "--version", "1.20.1"]],
  ["search_forge_docs", ["--query", "block", "--version", "1.20.1"]],
  ["list_forge_versions", []],
  ["search_docs", ["--platform", "fabric", "--version", "1.21.1", "--query", "registry"]],
  ["list_community_sources", []],
  ["search_community_docs", ["--query", "config"]],
  ["query_loader_api", ["--platform", "neoforge", "--minecraftVersion", "1.21.1", "--className", "IEventBus"]],
  ["analyze_porting_path", ["--projectPath", `${REPO_DIR}/forge/1.20.1/scaffold`]],
  ["get_method_params", ["--className", "Block", "--methodName", "getCodec", "--version", "1.20.1"]],
  ["analyze_mod_jar", ["--jarPath", `${PKG_DIR}/temp/s25a_pristine/gradle/wrapper/gradle-wrapper.jar`]],
];

/** C 类：需网络/下载/缓存预热/自备 jar（逐条豁免原因）。 */
const EXEMPT_NETWORK = [
  ["download_official_mdk", "真实 fetch GitHub pin commit（dryRun 分支不联网，但真跑需网络）"],
  ["mc_skill_update", "update/github GitHub API 网络（连 action=check 都要网络）"],
  ["get_minecraft_source", "下载版本清单/客户端 jar/映射 + remap 反编译（需 Java 17+ 与数分钟）"],
  ["decompile_mod_jar", "需 Java + 下载 VineFlower + 用户自备 mod jar"],
  ["ingest_loader_api", "需用户自备 LiteLoader/Rift/ModLoader jar（forbidden_redistribute 清单）"],
  ["validate_at", "jar 定位依赖 $MC_SKILL_CACHE 预热的 remapped 客户端 jar（未预热 CACHE_MISS）"],
  ["validate_aw", "同 validate_at（同一 jar 缓存门）"],
  ["inspect_runtime", "需真实 logsDir/crashReportsDir（本机无游戏运行日志，探针覆盖）"],
];

/** B 类缺口豁免（本机 data/ 缺该版本档，真实调用不可用）。 */
const EXEMPT_DATA_GAP = [
  ["query_api/get_method_params @forge_1.21+", "本机无 data/forge_1.21+（walk：1.7.10–1.20.4）"],
  ["query_registry @非 1.20.1/1.21.1", "本机仅 vanilla_1.20.1 / vanilla_1.21.1"],
  ["search_fabric_docs @fabric_1.20.1 正文", "该档 fabric-docs L0/L1/L2 为空树（2 B），需 --source fabric-wiki 或换 1.21.1"],
  ["search_neoforge_docs @1.20.1", "设计走 forge_1.20.1 兼容路径（非独立语料）"],
  ["analyze_bedrock_log", "需真实 content_log.txt（logPath/logsDir/projectPath 三选一必填），本机无基岩内容日志"],
];

const budgetStart = Date.now();
let failures = 0;
const stats = { probeHelp: 0, probeNoArgs: 0, realCall: 0, exempt: 0, failed: 0 };
const realResults = [];
const exemptLines = [];

const run = (args, timeoutMs = PER_TOOL_TIMEOUT_MS) =>
  spawnSync(process.execPath, [CLI, ...args], { encoding: "utf8", windowsHide: true, timeout: timeoutMs });

/** stdout 是 JSON 信封（或 at least 可解析 JSON）+ stderr 无异常栈特征。 */
function envelopeOk(r) {
  const out = (r.stdout ?? "").trim();
  let isJson = false;
  try {
    JSON.parse(out);
    isJson = true;
  } catch {
    isJson = /"success"\s*:/.test(out);
  }
  const stacky = /at [\w$.]+ \(.+:\d+:\d+\)/.test(r.stderr ?? "") || /\bError:/.test((r.stderr ?? "").trim().split("\n")[0] ?? "");
  return { isJson, stacky };
}

if (!fs.existsSync(CLI)) {
  console.error(`assert-cli-full: 入口不存在（先 npm run build）：${CLI}`);
  process.exit(1);
}

// 权威名单
const names = (() => {
  const r = run(["list-tools", "--names-only"]);
  if (r.status !== 0) {
    console.error(`assert-cli-full: list-tools 失败，无法取权威名单（rc=${r.status}）`);
    process.exit(1);
  }
  return JSON.parse(r.stdout).result.names;
})();
console.log(`[全量档] 权威工具数 = ${names.length}`);

// ① 入口契约探针：--help（全量）
for (const n of names) {
  const r = run([n, "--help"]);
  if (r.status !== 0) {
    failures++;
    console.error(`  ✗ ${n} --help rc=${r.status}`);
  } else stats.probeHelp++;
}
// ② 入口契约探针：无参（全量；断言 exit ∈ {0,1,2} + 信封 + 无栈）
for (const n of names) {
  const r = run([n]);
  const code = r.status ?? 1;
  const { isJson, stacky } = envelopeOk(r);
  if (![0, 1, 2].includes(code) || !isJson || stacky) {
    failures++;
    console.error(`  ✗ ${n}（无参探针）rc=${code} isJson=${isJson} stacky=${stacky}\n${(r.stdout ?? "").slice(0, 200)}`);
  } else stats.probeNoArgs++;
}

// ③ 真实调用：A 类全量 + B 类抽样（断言 exit ∈ {0,1} + 信封 + 无栈；失败仅记录，不中断）
const REAL = [...OFFLINE, ...DATA_BACKED];
for (const [tool, args] of REAL) {
  const t0 = Date.now();
  const r = run([tool, ...args]);
  const ms = Date.now() - t0;
  const code = r.status ?? 1;
  const { isJson, stacky } = envelopeOk(r);
  const bad = ![0, 1].includes(code) || !isJson || stacky;
  if (bad) failures++;
  else stats.realCall++;
  realResults.push({ tool, code, ms, bad });
}
// ④ 豁免（逐条打印原因；不静默）
for (const [tool, why] of EXEMPT_NETWORK) exemptLines.push(`${tool} —— ${why}`);
for (const [what, why] of EXEMPT_DATA_GAP) exemptLines.push(`${what} —— ${why}`);
stats.exempt = exemptLines.length;
// NP-9（2026-09-17）：汇总列此前恒 0（判定用的是 failures，门不空转，只是显示失真）——按实算回填。
stats.failed = failures;

// 汇总表
const budgetSec = Math.round((Date.now() - budgetStart) / 1000);
console.log(`[全量档] 预算耗时 ${budgetSec}s（单工具超时 ${PER_TOOL_TIMEOUT_MS / 1000}s）`);
console.log("=== 汇总（探针 / 真实调用 / 豁免 / 失败）===");
console.log(`  契约探针：--help ${stats.probeHelp}/${names.length}；无参 ${stats.probeNoArgs}/${names.length}`);
console.log(`  真实调用：${stats.realCall}/${REAL.length} 通过（≤1s 视为快：${realResults.filter((x) => !x.bad && x.ms <= 1000).length} 个）`);
console.log(`  豁免：${stats.exempt} 条（逐条原因如下）`);
for (const l of exemptLines) console.log(`    - ${l}`);
console.log(`  失败：${stats.failed}`);
if (realResults.some((x) => x.bad)) {
  console.log("  真实调用异常明细：");
  for (const x of realResults.filter((y) => y.bad)) console.log(`    - ${x.tool} rc=${x.code}（${x.ms}ms）`);
}
if (failures > 0) {
  console.error(`assert-cli-full: ${failures} 项失败（豁免不计入通过）`);
  process.exit(1);
}
console.log(`assert-cli-full: ok（探针 ${stats.probeHelp + stats.probeNoArgs} 项 + 真实调用 ${stats.realCall} 项 + 豁免 ${stats.exempt} 条，${budgetSec}s）`);
