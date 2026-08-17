/**
 * CLI test for mc-skill（flags-only + list-tools + JSON 包装 + 通用 dispatch）
 */
import { spawnSync } from "child_process";
import { mkdtempSync, rmSync, writeFileSync, readFileSync } from "fs";
import { tmpdir } from "os";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)));
const cli = join(root, "dist", "cli.js");
const fixture = join(root, "test-fixtures", "forge-mini");
const crashFile = join(root, "test-fixtures", "crash-sample.txt");

function run(args, opts = {}) {
  const env = {
    ...process.env,
    MC_SKILL_DATA: process.env.MC_SKILL_DATA || join(root, "..", "data"),
    ...(opts.env || {}),
  };
  if (opts.unsetData) delete env.MC_SKILL_DATA;
  const r = spawnSync(process.execPath, [cli, ...args], {
    encoding: "utf8",
    env,
    input: opts.input,
  });
  return { status: r.status, stdout: r.stdout ?? "", stderr: r.stderr ?? "" };
}

function parseJson(r, label) {
  try {
    return JSON.parse(r.stdout);
  } catch {
    throw new Error(`${label}: stdout is not JSON\n${r.stdout}\n${r.stderr}`);
  }
}

// ── 1. flags-only convert（--key value / --key=value 混用）────────────────────
{
  const r = run([
    "convert",
    "--from", "mcp",
    "--to", "mojang",
    "--name", "getHealth",
    "--owner", "net.minecraft.world.entity.LivingEntity",
    "--descriptor=()F",
    "--version", "1.20.1",
  ]);
  if (r.status !== 0) throw new Error(`convert failed (exit ${r.status}):\n${r.stderr}\n${r.stdout}`);
  const j = parseJson(r, "convert");
  if (j.success !== true) throw new Error(`convert success !== true: ${JSON.stringify(j)}`);
  if (j.tool !== "convert") throw new Error(`convert tool !== "convert": ${j.tool}`);
  if (!j.result?.converted) throw new Error(`convert result.converted falsy: ${JSON.stringify(j.result)}`);
  console.log(`convert mcp→mojang getHealth → ${j.result.converted}`);
}

// ── 2. list-tools：handler 与 schema 同名同数 + lookup_obfuscated / convert_mapping + default/tuple ─
{
  const r = run(["list-tools"]);
  if (r.status !== 0) throw new Error(`list-tools failed (exit ${r.status}):\n${r.stderr}\n${r.stdout}`);
  const j = parseJson(r, "list-tools");
  if (j.success !== true || j.tool !== "list-tools") throw new Error(`list-tools wrapper bad: ${JSON.stringify(j).slice(0, 200)}`);
  const { listAllToolSchemas } = await import("./dist/tool-registry.js");
  const { toolHandlers } = await import("./dist/tool-handlers.js");
  const schemaNames = listAllToolSchemas().map((t) => t.name).sort();
  const handlerNames = [...toolHandlers.keys()].sort();
  if (schemaNames.join("\0") !== handlerNames.join("\0")) {
    throw new Error(`schema vs handler name mismatch:\nschema=${schemaNames.join(",")}\nhandler=${handlerNames.join(",")}`);
  }
  if (new Set(schemaNames).size !== schemaNames.length) {
    throw new Error("duplicate tool schema names");
  }
  if (j.result?.total !== schemaNames.length) {
    throw new Error(`list-tools total=${j.result?.total}, expected ${schemaNames.length}`);
  }
  const names = (j.result.tools ?? []).map((t) => t.name);
  if ([...names].sort().join("\0") !== schemaNames.join("\0")) {
    throw new Error("list-tools names !== listAllToolSchemas()");
  }
  for (const required of ["lookup_obfuscated", "convert_mapping", "validate_at", "validate_aw", "download_official_mdk"]) {
    if (!names.includes(required)) throw new Error(`list-tools missing ${required}`);
  }
  if (!j.result.tools.every((t) => t.parameters && typeof t.parameters === "object")) {
    throw new Error("list-tools: every tool must carry parameters (inputSchema)");
  }
  const mdk = j.result.tools.find((t) => t.name === "download_official_mdk");
  if (mdk?.parameters?.properties?.dryRun?.default !== true) {
    throw new Error(`download_official_mdk dryRun default missing: ${JSON.stringify(mdk?.parameters?.properties?.dryRun)}`);
  }
  const src = j.result.tools.find((t) => t.name === "get_minecraft_source");
  if (src?.parameters?.properties?.lines?.minItems !== 2) {
    throw new Error(`get_minecraft_source lines tuple missing: ${JSON.stringify(src?.parameters?.properties?.lines)}`);
  }
  console.log(`list-tools: ${j.result.total} tools`);
  const repoRoot = join(root, "..");
  const docs = [
    readFileSync(join(repoRoot, "README.md"), "utf8"),
    readFileSync(join(repoRoot, "CONTRIBUTING.md"), "utf8"),
  ].join("\n");
  for (const m of docs.matchAll(/(\d+)\s*个工具/g)) {
    if (Number(m[1]) !== j.result.total) {
      throw new Error(`文档写死「${m[1]} 个工具」但 list-tools 为 ${j.result.total}`);
    }
  }
}

// ── 3. 旧位置参数兼容：query <className> [methodName] + stderr 迁移提示 ───────
{
  const r = run(["query", "net.minecraft.world.item.Item", "getName", "--version", "1.20.1"]);
  if (r.status !== 0) throw new Error(`query compat failed (exit ${r.status}):\n${r.stderr}\n${r.stdout}`);
  const j = parseJson(r, "query");
  if (j.success !== true) throw new Error(`query compat success !== true: ${JSON.stringify(j).slice(0, 300)}`);
  if (!r.stderr.includes("位置参数")) throw new Error(`query compat missing stderr migration notice: ${r.stderr}`);
  console.log("query 位置参数兼容: ok（stderr 含迁移提示）");
}

// ── 4. convert 缺 name → exit 2 + {success:false, error} ─────────────────────
{
  const r = run(["convert", "--from", "mcp", "--to", "mojang"]);
  if (r.status !== 2) throw new Error(`expected exit 2, got ${r.status}:\n${r.stdout}\n${r.stderr}`);
  const j = parseJson(r, "convert-missing-name");
  if (j.success !== false || !j.error) throw new Error(`missing-name error shape bad: ${JSON.stringify(j)}`);
  console.log("convert 缺 --name → exit 2 {success:false, error}");
}

// ── 5. 裸 mc-skill → usage + exit 2 ──────────────────────────────────────────
{
  const r = run([]);
  if (r.status !== 2) throw new Error(`expected exit 2 for bare mc-skill, got ${r.status}`);
  console.log("裸 mc-skill → exit 2");
}

// ── 6. help / version 不要求 MC_SKILL_DATA ───────────────────────────────────
{
  for (const arg of ["--help", "-h", "help"]) {
    const r = run([arg], { unsetData: true });
    if (r.status !== 0) throw new Error(`expected exit 0 for ${arg} without data, got ${r.status}\n${r.stderr}`);
  }
  const ver = run(["--version"], { unsetData: true });
  if (ver.status !== 0 || !String(ver.stdout).trim()) {
    throw new Error(`--version failed: ${ver.status} ${ver.stdout} ${ver.stderr}`);
  }
  console.log("--help / -h / help / --version → exit 0（无需 MC_SKILL_DATA）");
}

// ── 7. descriptor + status ───────────────────────────────────────────────────
{
  const r = run(["descriptor", "()F", "--name=getHealth"]);
  if (r.status !== 0) throw new Error(`descriptor failed (exit ${r.status}):\n${r.stderr}\n${r.stdout}`);
  const j = parseJson(r, "descriptor");
  if (j.success !== true || j.tool !== "descriptor") throw new Error(`descriptor wrapper bad: ${JSON.stringify(j)}`);
  if (j.result?.returnType !== "float" || !String(j.result?.readableSignature).includes("getHealth")) {
    throw new Error(`descriptor result bad: ${JSON.stringify(j.result)}`);
  }
  if (!r.stderr.includes("位置参数")) throw new Error(`descriptor positional missing notice: ${r.stderr}`);
  console.log("descriptor (兼容路径): ok");
}

{
  const r = run(["status", "--version=1.20.1"]);
  if (r.status !== 0) throw new Error(`status failed (exit ${r.status}):\n${r.stderr}\n${r.stdout}`);
  const j = parseJson(r, "status");
  if (j.success !== true || j.tool !== "status") throw new Error(`status wrapper bad: ${JSON.stringify(j)}`);
  if (!j.result?.ok || !j.result?.focus) throw new Error(`status result bad: ${JSON.stringify(j.result)}`);
  if (!r.stderr.includes("running get_server_status")) {
    throw new Error(`status missing running hint: ${r.stderr}`);
  }
  console.log("status: ok");
}

// ── 8. kebab：mc_skill_update --dry-run=false --confirm ──────────────────────
{
  const r = run(["mc_skill_update", "--action", "check", "--dry-run=false", "--confirm"]);
  if (r.status === 2) throw new Error(`mc_skill_update kebab treated as usage error (flags dropped?):\n${r.stderr}\n${r.stdout}`);
  const j = parseJson(r, "update-kebab");
  if (String(j.error ?? "").includes("未知") || String(j.error ?? "").includes("参数校验失败")) {
    throw new Error(`update kebab schema/flag error: ${JSON.stringify(j)}`);
  }
  if (!r.stderr.includes("running mc_skill_update")) {
    throw new Error(`update kebab did not dispatch: ${r.stderr}`);
  }
  console.log("mc_skill_update kebab dry-run/confirm: ok");
}

// ── 9. 未知 --class-name → exit 2 ────────────────────────────────────────────
{
  const r = run(["convert", "--from", "mcp", "--to", "mojang", "--name", "getHealth", "--class-name", "Foo"]);
  if (r.status !== 2) throw new Error(`expected exit 2 for unknown flag, got ${r.status}:\n${r.stdout}\n${r.stderr}`);
  const j = parseJson(r, "unknown-flag");
  if (!String(j.error).includes("未知") && !String(j.error).includes("class-name")) {
    throw new Error(`unknown flag message bad: ${JSON.stringify(j)}`);
  }
  console.log("未知 --class-name → exit 2");
}

// ── 10. query 与 query_api 结果同构 ──────────────────────────────────────────
{
  const a = run(["query", "--className", "net.minecraft.world.item.Item", "--version", "1.20.1"]);
  const b = run(["query_api", "--className", "net.minecraft.world.item.Item", "--version", "1.20.1"]);
  if (a.status !== 0 || b.status !== 0) throw new Error(`query/query_api failed: ${a.status}/${b.status}\n${a.stderr}\n${b.stderr}`);
  const ja = parseJson(a, "query");
  const jb = parseJson(b, "query_api");
  if (JSON.stringify(ja.result) !== JSON.stringify(jb.result)) {
    throw new Error(`query vs query_api result mismatch`);
  }
  console.log("query 与 query_api 结果同构");
}

// ── 11. warmup → get_server_status 且 warmup=true（stderr running）───────────
{
  const r = run(["warmup", "--version=1.20.1"]);
  if (r.status !== 0) throw new Error(`warmup failed: ${r.status}\n${r.stderr}\n${r.stdout}`);
  const j = parseJson(r, "warmup");
  if (j.success !== true || !j.result?.ok) throw new Error(`warmup result bad: ${JSON.stringify(j.result).slice(0, 300)}`);
  if (!r.stderr.includes("running get_server_status")) {
    throw new Error(`warmup did not dispatch get_server_status: ${r.stderr}`);
  }
  console.log("warmup → get_server_status: ok");
}

// ── 12. convert --from obfuscated ────────────────────────────────────────────
{
  const r = run(["convert", "--from", "obfuscated", "--to", "yarn", "--name", "er", "--version", "1.20.1"]);
  if (r.status !== 0) throw new Error(`obfuscated convert failed: ${r.status}\n${r.stderr}\n${r.stdout}`);
  const j = parseJson(r, "convert-obf");
  if (j.success !== true) throw new Error(`obfuscated convert success false: ${JSON.stringify(j).slice(0, 400)}`);
  console.log("convert --from obfuscated: ok");
}

// ── 13. query_api 不存在的类 → found:false exit 0；--fail-on-error → 1 ────────
{
  const r = run(["query_api", "--className", "net.minecraft.DoesNotExist12345", "--version", "1.20.1"]);
  if (r.status !== 0) throw new Error(`expected exit 0 for found:false, got ${r.status}:\n${r.stdout}`);
  const j = parseJson(r, "query-miss");
  if (j.result?.found !== false) throw new Error(`expected found:false: ${JSON.stringify(j.result).slice(0, 300)}`);
  const f = run(["query_api", "--className", "net.minecraft.DoesNotExist12345", "--version", "1.20.1", "--fail-on-error"]);
  if (f.status !== 1) throw new Error(`expected exit 1 with --fail-on-error, got ${f.status}`);
  console.log("query_api found:false → 0；--fail-on-error → 1");
}

// ── 14. {ok:false}/{passed:false} → exit 1 ───────────────────────────────────
{
  const r = run(["validate_project", "--project", join(root, "test-fixtures", "no-such-dir")]);
  if (r.status !== 1) throw new Error(`expected exit 1 for invalid projectPath, got ${r.status}:\n${r.stdout}\n${r.stderr}`);
  const j = parseJson(r, "bad-project");
  if (j.success !== false || j.result?.ok !== false) {
    throw new Error(`invalid project shape: ${JSON.stringify(j).slice(0, 400)}`);
  }
  console.log("validate_project 非法目录 → exit 1");
}

// ── 15. query --help 打印 schema，不进 handler ────────────────────────────────
{
  const r = run(["query", "--help"], { unsetData: true });
  if (r.status !== 0) throw new Error(`query --help failed: ${r.status}\n${r.stderr}\n${r.stdout}`);
  const j = parseJson(r, "query-help");
  if (!j.parameters && !j.tool) throw new Error(`query --help missing schema: ${r.stdout.slice(0, 400)}`);
  if (String(r.stdout).includes("running ")) {
    throw new Error("query --help should not dispatch handler");
  }
  console.log("query --help → schema exit 0");
}

// ── 16. @file / stdin / 两次 stdin ───────────────────────────────────────────
{
  const r = run(["crash_analyze", `--crashReport=@${crashFile}`]);
  if (r.status !== 0) throw new Error(`@file crash_analyze failed: ${r.status}\n${r.stderr}\n${r.stdout}`);
  const j = parseJson(r, "crash-file");
  if (!j.result?.probableCause && !j.result?.crashKind) {
    throw new Error(`crash @file result bad: ${JSON.stringify(j.result).slice(0, 400)}`);
  }
  console.log("crash_analyze @file: ok");
}

{
  const r = run(["crash_analyze", "--crashReport=-"], { input: "---- Minecraft Crash Report ----\njava.lang.IllegalStateException: stdin\n" });
  if (r.status !== 0) throw new Error(`stdin crash_analyze failed: ${r.status}\n${r.stderr}\n${r.stdout}`);
  console.log("crash_analyze stdin: ok");
}

{
  const r = run(["crash_analyze", "--crashReport=-", "--crashReportPath=-"], { input: "x" });
  if (r.status !== 2) throw new Error(`expected exit 2 for double stdin, got ${r.status}:\n${r.stdout}\n${r.stderr}`);
  const j = parseJson(r, "double-stdin");
  if (!String(j.error).includes("stdin")) throw new Error(`double stdin message: ${JSON.stringify(j)}`);
  console.log("两次 @- / =- → exit 2");
}

// ── 17. validate_project --project fixture 端到端 ────────────────────────────
{
  const r = run(["validate_project", "--project", fixture]);
  if (r.status !== 0) throw new Error(`validate_project --project failed: ${r.status}\n${r.stderr}\n${r.stdout}`);
  const j = parseJson(r, "validate-project");
  if (j.success !== true) throw new Error(`validate_project success false: ${JSON.stringify(j).slice(0, 500)}`);
  const blob = JSON.stringify(j.result);
  if (!blob.includes("examplemod") && !blob.includes("mods.toml") && !(j.result?.checks?.length > 0)) {
    throw new Error(`validate_project fixture result missing checks: ${blob.slice(0, 500)}`);
  }
  if (!Array.isArray(j.result?.checks) || j.result.checks.length === 0) {
    throw new Error(`validate_project checks empty: ${blob.slice(0, 500)}`);
  }
  console.log("validate_project --project fixture: ok");
}

// ── 18. --project 打到无 projectPath 的工具 → stderr 警告 ─────────────────────
{
  const r = run(["query_api", "--className", "net.minecraft.world.item.Item", "--version", "1.20.1", "--project", "."]);
  if (r.status !== 0) throw new Error(`query_api --project should still run: ${r.status}\n${r.stderr}\n${r.stdout}`);
  if (!r.stderr.includes("不支持 --project")) {
    throw new Error(`missing --project warning: ${r.stderr}`);
  }
  const j = parseJson(r, "query-project-warn");
  if (JSON.stringify(j).includes("不支持 --project")) {
    throw new Error("--project warning leaked into stdout JSON");
  }
  console.log("query_api --project → stderr 警告");
}

// ── 19. --compact 无 pretty ──────────────────────────────────────────────────
{
  const r = run(["descriptor", "--descriptor", "()F", "--compact"]);
  if (r.status !== 0) throw new Error(`compact failed: ${r.status}`);
  if (r.stdout.includes("\n  ")) throw new Error(`--compact still pretty: ${r.stdout}`);
  console.log("--compact: ok");
}

// ── 20. --file kebab / 未知字段 / 缺 = / 未知命令 / @@ / 8MB / isError ────────
{
  const r = run(["crash_analyze", `--file`, `crash-report=${crashFile}`]);
  if (r.status !== 0) throw new Error(`--file crash-report= failed: ${r.status}\n${r.stderr}\n${r.stdout}`);
  const j = parseJson(r, "file-kebab");
  if (!j.result?.probableCause && !j.result?.crashKind) {
    throw new Error(`--file kebab result bad: ${JSON.stringify(j.result).slice(0, 400)}`);
  }
  console.log("--file crash-report= kebab: ok");
}

{
  const r = run(["crash_analyze", "--file", "notAField=./nope.txt"]);
  if (r.status !== 2) throw new Error(`expected exit 2 for unknown --file field, got ${r.status}:\n${r.stdout}\n${r.stderr}`);
  const j = parseJson(r, "file-unknown-field");
  if (!String(j.error).includes("未知") && !String(j.error).includes("notAField")) {
    throw new Error(`unknown --file field message: ${JSON.stringify(j)}`);
  }
  console.log("--file 未知字段 → exit 2");
}

{
  const r = run(["crash_analyze", "--file", "crashReport"]);
  if (r.status !== 2) throw new Error(`expected exit 2 for --file without =, got ${r.status}`);
  console.log("--file 缺 = → exit 2");
}

{
  const r = run(["definitely_not_a_tool_xyz"]);
  if (r.status !== 2) throw new Error(`expected exit 2 for unknown command, got ${r.status}:\n${r.stdout}`);
  const j = parseJson(r, "unknown-cmd");
  if (j.success !== false || !String(j.error).includes("未知命令")) {
    throw new Error(`unknown command shape: ${JSON.stringify(j)}`);
  }
  console.log("未知命令 → exit 2");
}

{
  const r = run(["crash_analyze", "--crashReport=@@not-a-real-file"]);
  if (r.status !== 0) throw new Error(`@@ escape failed: ${r.status}\n${r.stderr}\n${r.stdout}`);
  const j = parseJson(r, "at-escape");
  if (j.success !== true) throw new Error(`@@ escape success false: ${JSON.stringify(j).slice(0, 300)}`);
  console.log("@@ 转义成字面 @: ok");
}

{
  const dir = mkdtempSync(join(tmpdir(), "mc-skill-cli-"));
  try {
    const big = join(dir, "big.txt");
    writeFileSync(big, Buffer.alloc(8 * 1024 * 1024 + 1));
    const r = run(["crash_analyze", `--crashReport=@${big}`]);
    if (r.status !== 2) throw new Error(`expected exit 2 for 8MB+ file, got ${r.status}:\n${r.stdout}\n${r.stderr}`);
    const j = parseJson(r, "file-8mb");
    if (!String(j.error).includes("8MB")) throw new Error(`8MB message: ${JSON.stringify(j)}`);
    console.log("文件超过 8MB → exit 2");
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

{
  const r = run(["get_community_doc_full", "--id", "__no_such_community_doc_xyz__"]);
  if (r.status !== 1) throw new Error(`expected exit 1 for isError community miss, got ${r.status}:\n${r.stdout}\n${r.stderr}`);
  const j = parseJson(r, "isError");
  if (j.success !== false || j.result?.ok !== false) {
    throw new Error(`isError success/ok not false: ${JSON.stringify(j).slice(0, 400)}`);
  }
  if (!j.result?.code && !j.result?.error) {
    throw new Error(`isError missing code/error: ${JSON.stringify(j).slice(0, 400)}`);
  }
  console.log("get_community_doc_full 缺 id → isError exit 1");
}

{
  const r = run(["--help", "--json", "--compact"], { unsetData: true });
  if (r.status !== 0) throw new Error(`--help --json --compact failed: ${r.status}`);
  if (r.stdout.includes("\n  ")) throw new Error(`help compact still pretty: ${r.stdout}`);
  const j = parseJson(r, "help-json-compact");
  if (!Array.isArray(j.usage) || j.usage.length === 0) throw new Error(`help json missing usage: ${r.stdout}`);
  console.log("--help --json --compact: ok");
}

{
  const r = run(["query", "--help", "--json", "--compact"], { unsetData: true });
  if (r.status !== 0) throw new Error(`query --help --json --compact failed: ${r.status}`);
  if (r.stdout.includes("\n  ")) throw new Error(`tool help compact still pretty: ${r.stdout}`);
  if (String(r.stdout + r.stderr).includes("running ")) {
    throw new Error("tool --help --json must not dispatch");
  }
  const j = parseJson(r, "query-help-compact");
  if (!j.parameters || !j.tool) throw new Error(`query help compact schema: ${r.stdout.slice(0, 300)}`);
  console.log("query --help --json --compact: ok");
}

{
  const r = run(["crash_analyze", "--file", `crashReport=${crashFile}`]);
  if (r.status !== 0) throw new Error(`--file crashReport= failed: ${r.status}\n${r.stderr}\n${r.stdout}`);
  console.log("--file crashReport=（计划字面形式）: ok");
}

{
  const r = run(["crash_analyze", "--crashReport=@./definitely-missing-crash.txt"]);
  if (r.status !== 2) throw new Error(`expected exit 2 for missing @file, got ${r.status}:\n${r.stdout}\n${r.stderr}`);
  console.log("缺失 @file → exit 2");
}

{
  const r = run(["diagnose_gradle", "--project", fixture]);
  if (r.status === 2) throw new Error(`diagnose_gradle --project usage error:\n${r.stderr}\n${r.stdout}`);
  const j = parseJson(r, "diagnose-project");
  if (!j.result || (!Array.isArray(j.result.errors) && !Array.isArray(j.result.warnings))) {
    throw new Error(`diagnose_gradle --project shape: ${JSON.stringify(j).slice(0, 400)}`);
  }
  console.log("diagnose_gradle --project fixture: ok");
}

{
  const r = run(["check_dependencies", "--project", fixture]);
  if (r.status === 2) throw new Error(`check_dependencies --project usage error:\n${r.stderr}\n${r.stdout}`);
  const j = parseJson(r, "checkdeps-project");
  if (j.result?.detectedLoader !== "forge") {
    throw new Error(`check_dependencies loader: ${JSON.stringify(j.result).slice(0, 400)}`);
  }
  console.log("check_dependencies --project fixture: ok");
}

{
  const r = run(["detect_mod_project", "--project", fixture]);
  if (r.status === 2) throw new Error(`detect_mod_project usage error:\n${r.stderr}\n${r.stdout}`);
  const j = parseJson(r, "detect-mod");
  if (j.success !== true && j.result?.ok === false && j.result?.code === "PACK_NOT_FOUND") {
    console.log("detect_mod_project --project fixture: PACK_NOT_FOUND（fixture 无完整规则树，可接受）");
  } else if (j.success !== true && j.result?.ok === false) {
    throw new Error(`detect_mod_project unexpected fail: ${JSON.stringify(j).slice(0, 400)}`);
  } else {
    console.log("detect_mod_project --project fixture: ok");
  }
}

{
  const r = run(["validate_project", "--project", fixture, "--includeCrashAnalysis"]);
  if (r.status !== 0) throw new Error(`includeCrashAnalysis failed: ${r.status}\n${r.stderr}\n${r.stdout}`);
  const j = parseJson(r, "crash-analysis");
  if (!Array.isArray(j.result?.crashAnalyses) || j.result.crashAnalyses.length === 0) {
    throw new Error(`includeCrashAnalysis missing crashAnalyses: ${JSON.stringify(j.result).slice(0, 400)}`);
  }
  console.log("validate_project --includeCrashAnalysis: ok");
}

{
  const r = run(["diagnose_gradle", "--buildGradle", "plugins { id 'net.minecraftforge.gradle' }\n", "--fail-on-error"]);
  const j = parseJson(r, "gradle-fail-on-error");
  if (Array.isArray(j.result?.errors) && j.result.errors.length > 0 && r.status !== 1) {
    throw new Error(`--fail-on-error should lift errors[] to exit 1, got ${r.status}: ${JSON.stringify(j.result.errors)}`);
  }
  console.log("diagnose_gradle --fail-on-error: ok");
}

console.log("test-cli: ok");
