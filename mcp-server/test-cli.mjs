/**
 * CLI test for mc-skill（flags-only + list-tools + JSON 包装 + 通用 dispatch）
 */
import assert from "node:assert/strict";
import { spawn, spawnSync } from "child_process";
import { mkdtempSync, rmSync, writeFileSync, readFileSync } from "fs";
import { tmpdir } from "os";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)));
const cli = join(root, "dist", "cli.js");
const fixture = join(root, "test-fixtures", "forge-mini");
const crashFile = join(root, "test-fixtures", "crash-sample.txt");

function run(args, opts = {}) {
  if (args[0] === "crash_analyze" && !args.some((a) => /^--version(=|$)/.test(String(a)))) {
    args = [args[0], "--version=1.20.1", ...args.slice(1)];
  }
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
    ...(opts.cwd ? { cwd: opts.cwd } : {}),
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

/**
 * 文档里写死的工具总数声明必须等于 registry 实际数。
 * 只认总数：紧跟「本组 / 该组 / 组内 …」限定语的是分组计数，不是总数声明。
 */
const GROUP_SCOPED = /(?:本组|该组|这组|组内|每组)\s*\**\s*$/;
function staleTotalClaims(docs, total) {
  const bad = [];
  for (const m of docs.matchAll(/(\d+)\s*个工具/g)) {
    if (GROUP_SCOPED.test(docs.slice(Math.max(0, m.index - 16), m.index))) continue;
    if (Number(m[1]) !== total) bad.push(m[1]);
  }
  return bad;
}

{
  assert.deepEqual(staleTotalClaims("服务共 79 个工具", 80), ["79"], "stale total must be caught");
  assert.deepEqual(staleTotalClaims("计数口径：本组 **9 个工具 / 8 行**", 80), [], "group count must be ignored");
  assert.deepEqual(staleTotalClaims("全部 80 个工具的 schema", 80), [], "matching total must pass");
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
  // F-C19：registerTool 侧（toolHandlers）描述与静态表（listAllToolSchemas）描述逐工具一致，
  // 防止 CLI --help 与 MCP tools/list 再次漂移（描述应引用共享常量）。
  {
    const norm = (s) => String(s ?? "").replace(/\s+/g, " ").trim();
    const drifted = [];
    for (const t of listAllToolSchemas()) {
      const h = toolHandlers.get(t.name);
      if (!h) continue; // 名字集一致性已由上一断言覆盖
      if (norm(h.description) !== norm(t.description)) {
        drifted.push(
          `${t.name}:\n  [registerTool] ${norm(h.description).slice(0, 120)}\n  [静态表]    ${norm(t.description).slice(0, 120)}`,
        );
      }
    }
    if (drifted.length > 0) {
      throw new Error(`description drift (registerTool vs 静态表):\n${drifted.join("\n")}`);
    }
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
  const stale = staleTotalClaims(docs, j.result.total);
  if (stale.length > 0) {
    throw new Error(`文档写死「${stale.join(" / ")} 个工具」但 list-tools 为 ${j.result.total}`);
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

// ── 3b. S1/D1：单连字符 -className → exit 2 + 建议 --className，且不再吐查询结果 ──
{
  const r = run(["query", "-className", "Item", "--version", "1.20.1"]);
  if (r.status !== 2) throw new Error(`expected exit 2 for -className, got ${r.status}:\n${r.stdout}\n${r.stderr}`);
  const j = parseJson(r, "suspect-flag");
  if (j.success !== false || !j.error) throw new Error(`suspect flag envelope bad: ${JSON.stringify(j)}`);
  if (!String(j.error).includes("未知")) throw new Error(`suspect flag missing 未知: ${j.error}`);
  if (!String(j.error).includes("--className")) throw new Error(`suspect flag missing suggestion: ${j.error}`);
  if ("result" in j) throw new Error(`suspect flag must not carry result: ${JSON.stringify(j.result)}`);
  if (r.stdout.includes("matched") || r.stdout.includes("getName")) {
    throw new Error(`suspect flag leaked query results:\n${r.stdout.slice(0, 300)}`);
  }

  const ok = run(["query", "--className", "net.minecraft.world.item.Item", "--version", "1.20.1"]);
  if (ok.status !== 0) throw new Error(`--className form regressed (exit ${ok.status}):\n${ok.stderr}\n${ok.stdout}`);

  const esc = run(["query", "--version=1.20.1", "--", "-className", "Item"]);
  if (esc.status === 2 && String(esc.stdout).includes("未知参数")) {
    throw new Error(`-- escape rejected: ${esc.stdout}\n${esc.stderr}`);
  }

  const help = parseJson(run(["--help"]), "help-legacy-notice");
  const usage = Array.isArray(help.usage) ? help.usage.join("\n") : "";
  if (!usage.includes("遗留用法")) throw new Error(`--help missing 遗留用法 notice:\n${usage}`);
  console.log("query -className → exit 2 + --className 建议；-- 逃生口与正确写法不受影响");
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
  const loose = run(["query_api", "--className", "net.minecraft.DoesNotExist12345", "--version", "1.20.1", "--fail-on-error=false"]);
  if (loose.status !== 0) throw new Error(`expected exit 0 with --fail-on-error=false, got ${loose.status}:\n${loose.stdout}`);
  console.log("query_api found:false → 0；--fail-on-error → 1；--fail-on-error=false → 0");
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
  if (j.result?.ok === false && (j.result?.action?.code === "PACK_NOT_FOUND" || j.result?.code === "PACK_NOT_FOUND")) {
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

// ── S2: 归一化 flag 回退 + 失败信封 errorKind 分类 ───────────────────────────
{
  const base = [
    "convert", "--from", "mcp", "--to", "mojang", "--name", "getHealth",
    "--owner", "net.minecraft.world.entity.LivingEntity", "--descriptor", "()F", "--version", "1.20.1",
  ];
  for (const spelling of ["--allow-fallback=true", "--allowFallback=true", "--allow_fallback=true"]) {
    const r = run([...base, spelling]);
    if (r.status !== 0) throw new Error(`${spelling} exit ${r.status}, canonical fallback broken?\n${r.stdout}\n${r.stderr}`);
    const j = parseJson(r, `convert-${spelling}`);
    if (j.success !== true || j.result?.found !== true) throw new Error(`${spelling} not applied: ${JSON.stringify(j)}`);
    if ("errorKind" in j) throw new Error(`success envelope must not carry errorKind: ${JSON.stringify(j)}`);
  }
  console.log("convert allow_fallback 三种写法（kebab/camel/snake）: ok");
}

{
  const r = run(["query_api", "--classNam", "Item", "--version", "1.20.1"]);
  if (r.status !== 2) throw new Error(`expected exit 2 for near-miss flag, got ${r.status}:\n${r.stdout}`);
  const j = parseJson(r, "near-miss-flag");
  if (j.errorKind !== "usage") throw new Error(`near-miss errorKind: ${JSON.stringify(j)}`);
  if (!Array.isArray(j.nearFlags) || !j.nearFlags.includes("className")) {
    throw new Error(`near-miss nearFlags missing className: ${JSON.stringify(j)}`);
  }
  if (!String(j.error).includes("近似")) throw new Error(`near-miss message lacks 近似: ${j.error}`);
  if (!String(j.error).includes("node mcp-server/dist/cli.js query_api --help")) {
    throw new Error(`near-miss message lacks repo-root help pointer: ${j.error}`);
  }
  if ("result" in j) throw new Error(`usage error must not carry result: ${JSON.stringify(j)}`);
  console.log("近似 flag 名 → exit 2 + nearFlags + help 指针");
}

{
  const r = run(["search_docs", "--xyzzz", "anything"]);
  if (r.status !== 2) throw new Error(`expected exit 2 for unknown flag, got ${r.status}:\n${r.stdout}`);
  const j = parseJson(r, "unknown-flag-envelope");
  if (j.errorKind !== "usage") throw new Error(`unknown flag errorKind: ${JSON.stringify(j)}`);
  if (!Array.isArray(j.knownFlags) || !j.knownFlags.includes("query")) {
    throw new Error(`unknown flag knownFlags missing query: ${JSON.stringify(j.knownFlags)}`);
  }
  console.log("未知 flag → exit 2 + knownFlags");
}

{
  const r = run(["get_forge_doc_full"]);
  if (r.status !== 2) throw new Error(`expected exit 2 for missing required, got ${r.status}:\n${r.stdout}`);
  const j = parseJson(r, "missing-required");
  if (j.errorKind !== "validation") throw new Error(`missing required errorKind: ${JSON.stringify(j)}`);
  if (!String(j.error).includes("参数校验失败")) throw new Error(`missing required message: ${j.error}`);
  console.log("缺必填参数 → exit 2 + errorKind validation");
}

{
  const r = run(["get_forge_doc_full", "--id", "no-such-page-zz", "--version", "1.20.1"]);
  if (r.status !== 1) throw new Error(`expected exit 1 for tool failure, got ${r.status}:\n${r.stdout}`);
  const j = parseJson(r, "tool-failure");
  if (j.errorKind !== "tool_failure") throw new Error(`tool failure errorKind: ${JSON.stringify(j)}`);
  if (j.success !== false || !j.result) throw new Error(`tool failure envelope: ${JSON.stringify(j)}`);
  console.log("工具内失败 → exit 1 + errorKind tool_failure");
}

{
  const r = run(["definitely_not_a_tool_xyz"]);
  const j = parseJson(r, "unknown-cmd-kind");
  if (r.status !== 2 || j.errorKind !== "usage") throw new Error(`unknown command classification: ${r.status} ${JSON.stringify(j)}`);
  const b = run(["--compact=maybe", "get_server_status"]);
  const bj = parseJson(b, "bad-boolean-global");
  if (b.status !== 2 || bj.errorKind !== "usage") throw new Error(`bad boolean global classification: ${b.status} ${JSON.stringify(bj)}`);
  console.log("未知命令 / 坏布尔全局 flag → exit 2 + errorKind usage");
}

// ── S3: @ 展开按 schema 类型收窄 + --raw 逃生 + stdin 有界多块读 ──────────────
{
  const r = run(["search_community_docs", "--limit=@nope-s3.txt"]);
  const j = parseJson(r, "s3-number-gate");
  if (r.status !== 2 || j.errorKind !== "validation") {
    throw new Error(`number 字段应判校验类 exit 2: ${r.status} ${JSON.stringify(j)}`);
  }
  if (String(j.error).includes("无法读取文件")) throw new Error("number 字段不得触碰文件系统");
  console.log("number 字段 @ 不展开 → 校验错误而非文件错误");
}

{
  const r = run(["convert_mapping", "--from=@nope-s3.txt", "--to=mojang", "--name=x", "--version=1.20.1"]);
  const j = parseJson(r, "s3-enum-gate");
  if (r.status !== 2 || j.errorKind !== "validation") {
    throw new Error(`enum 字段应判校验类 exit 2: ${r.status} ${JSON.stringify(j)}`);
  }
  if (String(j.error).includes("无法读取文件")) throw new Error("enum 字段不得触碰文件系统");
  if (!String(j.error).includes("@nope-s3.txt")) throw new Error(`enum 字段值必须原样保留: ${j.error}`);
  console.log("enum 字段 @ 不展开（值域是闭集）");
}

{
  const r = run(["query_api", "--className=@Override", "--version=1.20.1"]);
  const j = parseJson(r, "s3-string-hint");
  if (r.status !== 2 || j.errorKind !== "usage") {
    throw new Error(`string 字段 @ 缺失文件应 exit 2: ${r.status} ${JSON.stringify(j)}`);
  }
  const e = String(j.error);
  if (!e.includes("className") || !e.includes("@Override")) {
    throw new Error(`错误必须点名字段与值: ${e}`);
  }
  if (!e.includes("--raw className") || !e.includes("@@")) {
    throw new Error(`错误必须给出 @@ / --raw 逃生指引: ${e}`);
  }
  const esc = run(["query_api", "--className=@@Override", "--version=1.20.1"]);
  const escj = parseJson(esc, "s3-at-escape-literal");
  if (esc.status !== 0 || escj.result?.className !== "@Override") {
    throw new Error(`@@ 应还原成字面 @Override: ${esc.status} ${JSON.stringify(escj).slice(0, 200)}`);
  }
  console.log("string 字段 @缺失文件 → 字段名 + @@/--raw 提示；@@ 还原字面量");
}

{
  const r = run(["query_api", "--className=@Override", "--version=1.20.1", "--raw", "className"]);
  const j = parseJson(r, "s3-raw-field");
  if (r.status !== 0 || j.result?.className !== "@Override") {
    throw new Error(`--raw className 应按字面传: ${r.status} ${JSON.stringify(j).slice(0, 200)}`);
  }
  const b = run(["crash_analyze", "--crashReport=@nope-s3.txt", "--raw"]);
  const bj = parseJson(b, "s3-raw-bare");
  if (b.status !== 0 || bj.success !== true) {
    throw new Error(`裸 --raw 应关闭全部 @ 展开: ${b.status} ${JSON.stringify(bj).slice(0, 200)}`);
  }
  const bad = run(["query_api", "--className=Item", "--version=1.20.1", "--raw", "notAField"]);
  const badj = parseJson(bad, "s3-raw-unknown-field");
  if (bad.status !== 2 || !String(badj.error).includes("未知参数")) {
    throw new Error(`--raw 未知字段必须报错而不是吞掉: ${bad.status} ${JSON.stringify(badj).slice(0, 200)}`);
  }
  const on = run(["query_api", "--className=@Override", "--version=1.20.1", "--raw=true"]);
  const onj = parseJson(on, "s3-raw-eq-true");
  if (on.status !== 0 || onj.result?.className !== "@Override") {
    throw new Error(`--raw=true 应等同裸 --raw: ${on.status} ${JSON.stringify(onj).slice(0, 200)}`);
  }
  const off = run(["query_api", "--className=@Override", "--version=1.20.1", "--raw=false"]);
  const offj = parseJson(off, "s3-raw-eq-false");
  if (off.status !== 2 || !String(offj.error).includes("无法读取文件")) {
    throw new Error(`--raw=false 应恢复 @ 展开语义: ${off.status} ${JSON.stringify(offj).slice(0, 200)}`);
  }
  console.log("--raw <field> / 裸 --raw / --raw=true → 字面量；--raw=false 恢复展开；未知字段 → exit 2");
}

{
  const r = run(["search_community_docs", "--file", "limit=./nope-s3.txt"]);
  const j = parseJson(r, "s3-file-on-number");
  if (r.status !== 2 || j.errorKind !== "usage") {
    throw new Error(`--file 打到 number 字段应 exit 2: ${r.status} ${JSON.stringify(j)}`);
  }
  if (!String(j.error).includes("--file limit")) throw new Error(`--file 拒绝信息需点名: ${j.error}`);
  const c = run(["crash_analyze", "--raw", "crashReport", "--file", "crashReport=./nope-s3.txt"]);
  const cj = parseJson(c, "s3-raw-file-conflict");
  if (c.status !== 2 || !String(cj.error).includes("冲突")) {
    throw new Error(`--raw 与 --file 同名必须报冲突: ${c.status} ${JSON.stringify(cj)}`);
  }
  const u = run(["query_api", "--bogus=@nope-s3.txt", "--version=1.20.1"]);
  const uj = parseJson(u, "s3-unknown-at");
  if (u.status !== 2 || !String(uj.error).includes("未知参数")) {
    throw new Error(`未知 flag 应报未知参数: ${u.status} ${JSON.stringify(uj)}`);
  }
  if (String(uj.error).includes("无法读取文件")) throw new Error("未知 flag 的值不得进文件系统");
  console.log("--file 打非文本字段 / --raw 与 --file 冲突 / 未知 flag 带 @ → exit 2 且不碰文件");
}

{
  const dir = mkdtempSync(join(tmpdir(), "mc-skill-s3-"));
  try {
    const entries = { "demo.item.TAIL": "TAILKEY_ok" };
    for (let i = 0; i < 4000; i++) entries[`demo.item.${i}`] = `Name ${i} padded padded padded`;
    const payload = JSON.stringify(entries);
    if (payload.length < 96 * 1024) throw new Error(`fixture 太小（${payload.length}），不足一次多块读`);
    const entriesFile = join(dir, "entries.json");
    writeFileSync(entriesFile, payload);

    // object 字段仍参与展开（撤掉类型判定不会让这条转红，所以它是「无回归」断言）
    const miss = run(["generate_lang", "--modId=demo", "--version=1.20.1", "--entries=@nope-s3.json"]);
    const missj = parseJson(miss, "s3-object-expandable");
    if (miss.status !== 2 || !String(missj.error).includes("无法读取文件")) {
      throw new Error(`object 字段必须仍支持 @文件（JSON 载荷流程不能退化）: ${miss.status} ${JSON.stringify(missj).slice(0, 200)}`);
    }

    const viaFile = run(["generate_lang", "--modId=demo", "--version=1.20.1", `--entries=@${entriesFile}`]);
    const viaSpec = run(["generate_lang", "--modId=demo", "--version=1.20.1", "--file", `entries=${entriesFile}`]);
    const viaStdin = run(["generate_lang", "--modId=demo", "--version=1.20.1", "--entries=-"], { input: payload });
    for (const [label, r] of [["@file", viaFile], ["--file", viaSpec], ["stdin", viaStdin]]) {
      if (r.status !== 0) throw new Error(`${label} entries 失败: ${r.status}\n${r.stdout}\n${r.stderr}`);
      if (!r.stdout.includes("TAILKEY_ok")) throw new Error(`${label} 结果缺尾部键（读断了？）`);
    }
    if (viaStdin.stdout !== viaFile.stdout) throw new Error("大载荷 stdin 与 @file 结果不一致（分块读丢失）");
    if (viaSpec.stdout !== viaFile.stdout) throw new Error("--file 与 @file 结果不一致");
    console.log(`object 字段 @file / --file / ${Math.round(payload.length / 1024)}KB stdin 三者同构`);

    const tooBig = run(["generate_lang", "--modId=demo", "--version=1.20.1", "--entries=-"], {
      input: "x".repeat(8 * 1024 * 1024 + 1),
    });
    const tbj = parseJson(tooBig, "s3-stdin-8mb");
    if (tooBig.status !== 2 || !String(tbj.error).includes("8MB") || !String(tbj.error).includes("stdin")) {
      throw new Error(`stdin 超过 8MB 必须 exit 2: ${tooBig.status} ${JSON.stringify(tbj).slice(0, 200)}`);
    }
    console.log("stdin 超过 8MB → exit 2");
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

// ── S4: 与全局 flag 同名的字段归工具；--output-format 是唯一格式开关 ─────────
{
  const dir = mkdtempSync(join(tmpdir(), "mc-skill-s4-"));
  try {
    const payload = JSON.stringify({
      format_version: "1.16.0",
      "minecraft:block": { description: { identifier: "demo:block/torch", register_to_creative_menu: true } },
    });
    const file = join(dir, "block.json");
    writeFileSync(file, payload);
    const brief = (r) => `${r.status} ${String(r.stdout).replace(/\s+/g, " ").slice(0, 160)}`;

    for (const [how, args] of [
      ["--json <全文>", ["validate_bp_json", "--kind=block", "--json", payload]],
      ["--json=<全文>", ["validate_bp_json", "--kind=block", "--json=" + payload]],
      ["--json=@file", ["validate_bp_json", "--kind=block", `--json=@${file}`]],
      ["--file json=path", ["validate_bp_json", "--kind=block", "--file", `json=${file}`]],
    ]) {
      const r = run(args);
      const j = parseJson(r, `s4-${how}`);
      if (r.status !== 0 || j.success !== true || j.result?.ok !== true) {
        throw new Error(`${how} 应由工具判定成功：${brief(r)}`);
      }
      if (j.errorKind !== undefined) throw new Error(`${how} 成功信封不该有 errorKind：${brief(r)}`);
      if (!Array.isArray(j.result.errors)) throw new Error(`${how} 没跑到工具本体：${brief(r)}`);
    }
    console.log("validate_bp_json 的 --json 四种写法都归字段，rc 由工具结论决定");

    const bad = run(["validate_bp_json", "--kind=block", "--json", "{not json"]);
    const badj = parseJson(bad, "s4-bad-payload");
    if (bad.status !== 1 || badj.errorKind !== "tool_failure" || badj.result?.ok !== false) {
      throw new Error(`坏载荷必须由工具判 exit 1 tool_failure：${brief(bad)}`);
    }
    const bare = run(["validate_bp_json", "--kind=block", "--json"]);
    const barej = parseJson(bare, "s4-bare-json");
    if (bare.status !== 2 || barej.errorKind !== "validation" || !String(barej.error).includes("json")) {
      throw new Error(`裸 --json 在该工具上应按字段校验失败：${brief(bare)}`);
    }
    console.log("坏载荷 → exit 1 tool_failure；裸 --json → 字段校验 exit 2");

    for (const flag of ["--json", "--json=false"]) {
      const r = run(["query_api", "--className=Item", "--version=1.20.1", flag]);
      if (r.status !== 0) throw new Error(`${flag} 在无同名字段的工具上必须仍是兼容 no-op：${brief(r)}`);
    }
    const badBool = run(["query_api", "--className=Item", "--version=1.20.1", "--json=maybe"]);
    const badBoolj = parseJson(badBool, "s4-bad-json-bool");
    if (badBool.status !== 2 || badBoolj.errorKind !== "usage") {
      throw new Error(`非冲突工具上坏布尔 --json=maybe 仍是 usage：${brief(badBool)}`);
    }
    console.log("--json 在其余工具上保持 no-op 兼容；坏布尔值仍 exit 2 usage");

    for (const args of [["--output-format=json"], ["--output-format", "json"], ["--output-format=JSON"], ["--outputFormat=json"]]) {
      const r = run(["get_server_status", ...args]);
      if (r.status !== 0) throw new Error(`${args.join(" ")} 必须被接受：${brief(r)}`);
    }
    for (const [args, want] of [
      [["--output-format=text"], "尚未实现"],
      [["--outputFormat=text"], "尚未实现"],
      [["--output-format"], "需要显式取值"],
    ]) {
      const r = run(["get_server_status", ...args]);
      const j = parseJson(r, `s4-of-${args.join("")}`);
      if (r.status !== 2 || j.errorKind !== "usage" || !String(j.error).includes(want)) {
        throw new Error(`--output-format ${args.join(" ")} 应 exit 2 含「${want}」：${brief(r)}`);
      }
    }
    const both = run(["query_api", "--className=Item", "--version=1.20.1", "--json", "--output-format=json"]);
    if (both.status !== 0) throw new Error(`--json 与 --output-format 并存应可用：${brief(both)}`);
    const help = run(["--help", "--output-format=json", "--compact"]);
    const helpj = parseJson(help, "s4-help-machine");
    if (help.status !== 0 || !String(helpj.usage).includes("--output-format")) {
      throw new Error(`--output-format=json 的机器读 help 必须列出该开关：${brief(help)}`);
    }
    const helpBad = run(["--help", "--output-format=text"]);
    const helpBadj = parseJson(helpBad, "s4-help-bad-format");
    if (helpBad.status !== 2 || helpBadj.errorKind !== "usage") {
      throw new Error(`help 路径上坏格式取值也必须 exit 2：${brief(helpBad)}`);
    }
    console.log("--output-format 只认 json（含 camel / 隔空写法），其它值与裸写法 exit 2");
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

// ── S5: list-tools 裁剪视图（--names-only / --filter / --tool）+ 人读 help ────
function runTty(args) {
  const boot = [
    'import { pathToFileURL } from "url";',
    'import { join } from "path";',
    `const cli = join(${JSON.stringify(root)}, "dist", "cli.js");`,
    `const ARGS = ${JSON.stringify(args)};`,
    "process.stdout.isTTY = true;",
    "process.argv = [process.execPath, cli, ...ARGS];",
    "await import(pathToFileURL(cli).href);",
  ].join("\n");
  const env = {
    ...process.env,
    MC_SKILL_DATA: process.env.MC_SKILL_DATA || join(root, "..", "data"),
  };
  const r = spawnSync(process.execPath, ["--input-type=module", "-e", boot], { encoding: "utf8", env });
  return { status: r.status, stdout: r.stdout ?? "", stderr: r.stderr ?? "" };
}

{
  const bytes = (s) => Buffer.byteLength(s, "utf8");
  const full = run(["list-tools"]);
  const fj = parseJson(full, "s5-full");
  const total = fj.result.total;
  const byName = new Map(fj.result.tools.map((t) => [t.name, t]));
  const orderedNames = fj.result.tools.map((t) => t.name);

  const names = run(["list-tools", "--names-only"]);
  const nj = parseJson(names, "s5-names");
  const nameBytes = bytes(names.stdout);
  if (nameBytes >= bytes(full.stdout) * 0.1) {
    throw new Error(`--names-only 体积 ${nameBytes} 未低于全量 ${bytes(full.stdout)} 的 10%`);
  }
  if (nameBytes > total * 60) throw new Error(`--names-only 单个名字摊到 ${Math.round(nameBytes / total)} B，超过 60 B 预算`);
  if (nj.result.total !== total) throw new Error(`names total=${nj.result.total} != ${total}`);
  if (JSON.stringify(nj.result.names) !== JSON.stringify(orderedNames)) {
    throw new Error("names-only 的名字集合或顺序与全量不一致");
  }
  if (names.stdout.includes("parameters")) throw new Error("--names-only 仍在吐 schema");
  const camel = run(["list-tools", "--namesOnly", "--compact"]);
  if (camel.status !== 0 || camel.stdout.trim().includes("\n")) {
    throw new Error(`--namesOnly（camel 写法）+ --compact 应单行输出：${camel.status}`);
  }
  console.log(`--names-only ${nameBytes} B（全量 ${bytes(full.stdout)} B 的 ${(nameBytes / bytes(full.stdout) * 100).toFixed(1)}%，${total} 个名字）`);

  const hit = run(["list-tools", "--filter=doc"]);
  const hj = parseJson(hit, "s5-filter");
  if (hj.result.tools.length === 0 || hj.result.total >= total) {
    throw new Error(`--filter doc 命中应为非空真子集，实得 ${hj.result.total}/${total}`);
  }
  for (const t of hj.result.tools) {
    if (!`${t.name} ${t.description}`.toLowerCase().includes("doc")) {
      throw new Error(`--filter 命中项与关键词无关：${t.name}`);
    }
    assert.deepEqual(t, byName.get(t.name), `--filter 命中项与全量该项不一致：${t.name}`);
  }
  if (hj.result.query !== "doc" || hj.result.of !== total) throw new Error(`filter 信封缺 query/of：${JSON.stringify(hj.result).slice(0, 120)}`);
  const miss = run(["list-tools", "--filter=zzzz-nope"]);
  const mj = parseJson(miss, "s5-filter-miss");
  if (miss.status !== 1 || mj.success !== false || mj.errorKind !== "tool_failure") {
    throw new Error(`无匹配必须 exit 1 + tool_failure：${miss.status} ${JSON.stringify(mj).slice(0, 160)}`);
  }
  if (!String(mj.error).includes("无匹配") || !String(mj.error).includes("--names-only")) {
    throw new Error(`无匹配必须点名并建议 --names-only：${mj.error}`);
  }
  console.log(`--filter 命中 ${hj.result.total} 项且与全量逐字段相等；无匹配 → exit 1 tool_failure`);

  const one = run(["list-tools", "--tool=get_minecraft_source"]);
  const oj = parseJson(one, "s5-describe");
  assert.deepEqual(oj.result, byName.get("get_minecraft_source"), "--tool 单查与全量该项不一致");
  if (bytes(one.stdout) >= bytes(full.stdout) * 0.1) {
    throw new Error(`--tool 单查体积 ${bytes(one.stdout)} 未低于全量 10%`);
  }
  const alias = run(["list-tools", "--tool=query"]);
  const aj = parseJson(alias, "s5-describe-alias");
  assert.deepEqual(aj.result, byName.get("query_api"), "--tool 短名应解析到 query_api");
  const badTool = run(["list-tools", "--tool=nope_zz"]);
  const btj = parseJson(badTool, "s5-describe-unknown");
  if (badTool.status !== 2 || btj.errorKind !== "usage" || !String(btj.error).includes("未知工具")) {
    throw new Error(`未知工具名应 exit 2 usage：${badTool.status} ${JSON.stringify(btj).slice(0, 160)}`);
  }
  console.log(`--tool 与全量该项逐字段相等（${bytes(one.stdout)} B），短名同源`);

  for (const [label, args, want] of [
    ["互斥", ["list-tools", "--names-only", "--tool=query"], "互斥"],
    ["未知 flag", ["list-tools", "--bogus=1"], "未知参数"],
    ["多余位置参数", ["list-tools", "query"], "不收位置参数"],
    ["空关键词", ["list-tools", "--filter="], "不能为空"],
    ["漏取值", ["list-tools", "--filter"], "需要关键词"],
    ["开关给了值", ["list-tools", "--names-only=junk"], "是开关"],
  ]) {
    const r = run(args);
    const j = parseJson(r, `s5-${label}`);
    if (r.status !== 2 || j.errorKind !== "usage" || !String(j.error).includes(want)) {
      throw new Error(`list-tools ${label} 应 exit 2 usage 含「${want}」：${r.status} ${JSON.stringify(j).slice(0, 180)}`);
    }
    if (j.error.includes("疑似漏写") && label === "未知 flag") {
      throw new Error(`正确双连字符写法不该报「疑似漏写」：${j.error}`);
    }
  }

  for (const [label, j] of [["全量", fj], ["names", nj], ["filter", hj], ["tool", oj]]) {
    assert.deepEqual(Object.keys(j), ["success", "tool", "result"], `${label} 模式信封形状变了`);
    assert.equal(j.tool, "list-tools", `${label} 模式 tool 字段变了`);
  }
  console.log("三种裁剪模式共用 success/tool/result 信封；六类误用一律 exit 2 usage");
}

{
  const human = runTty(["help", "get_forge_doc_full"]);
  if (human.status !== 0) throw new Error(`TTY help 失败：${human.status}\n${human.stderr}`);
  const out = human.stdout;
  if (!out.includes("参数 (3):")) throw new Error(`TTY help 没有逐参数清单：\n${out}`);
  for (const want of ["  id (string) —", "  version (string) —", "  highlight_key (boolean)"]) {
    if (!out.includes(want)) throw new Error(`TTY help 缺参数行「${want}」：\n${out}`);
  }
  if (!out.includes("参数 schema 见：node mcp-server/dist/cli.js get_forge_doc_full --help --json")) {
    throw new Error(`TTY help 的 --help --json 指针不能动（且必须是仓库根可运行形式）：\n${out}`);
  }
  if (out.includes("schema 见：mc-skill ") || out.includes("npx mc-skill")) {
    throw new Error(`指针不能再指向 clone 上不可解析的 mc-skill：\n${out}`);
  }
  if (out.includes('"properties"') || out.includes('"type": "object"')) {
    throw new Error("TTY 人读路径不许直接吐完整 schema");
  }
  const types = runTty(["help", "search_forge_docs"]);
  if (!types.stdout.includes("tags (string[])")) throw new Error(`数组类型标签不对：\n${types.stdout}`);
  const enums = runTty(["help", "convert_mapping"]);
  if (!enums.stdout.includes("from (enum)")) throw new Error(`枚举应标 enum 而不铺值：\n${enums.stdout}`);
  if (enums.stdout.includes('"mojang"')) throw new Error("TTY help 不得列出 enum 全文");
  const unions = runTty(["help", "validate_datapack_json"]);
  if (!unions.stdout.includes("packFormat (number|tuple)")) throw new Error(`union/tuple 类型标签不对：\n${unions.stdout}`);
  const tuple = runTty(["help", "get_minecraft_source"]);
  if (!tuple.stdout.includes("lines (tuple)")) throw new Error(`tuple 字段应标 tuple 而不铺嵌套全文：\n${tuple.stdout}`);
  const asJson = run(["help", "get_forge_doc_full", "--json"]);
  const aj = parseJson(asJson, "s5-help-json");
  if (asJson.status !== 0 || aj.tool !== "get_forge_doc_full" || !aj.parameters?.properties?.id) {
    throw new Error(`同一条命令加 --json 必须仍给可解析 schema：${asJson.status} ${String(asJson.stdout).slice(0, 120)}`);
  }
  console.log("TTY help 逐参数「名字 (类型) — 描述」，enum/array/union 标签正确，--json 路径不变");
}

// ── S6: --quiet / --timeout / 退出滞后（lag）门 ─────────────────────────────
const LAG_LIMIT_MS = 500;
// 超时走「放弃等待」：信封吐完后被放弃的 handler 还有已排队的异步要落地（实测 236–256ms，
// 共享句柄在抖动下可能更慢），所以这一档只用来抓真正的常驻句柄泄漏，放宽到 1500ms。
const ABANDON_LAG_LIMIT_MS = 1500;
const KILL_AFTER_MS = 4000;

/** 末行 stdout → 进程真正的 end 之间的耗时；常驻句柄未清会拖长这段，超过上限即红 */
function runTimed(args, opts = {}) {
  return new Promise((resolve, reject) => {
    const env = {
      ...process.env,
      MC_SKILL_DATA: process.env.MC_SKILL_DATA || join(root, "..", "data"),
      ...(opts.env || {}),
    };
    const clock = () => Number(process.hrtime.bigint() / 1_000_000n);
    const child = spawn(process.execPath, [cli, ...args], { env });
    let out = "";
    let errb = "";
    let lastByte = 0;
    let endAt = 0;
    let status = null;
    let killed = false;
    child.stdout.setEncoding("utf8");
    child.stderr.setEncoding("utf8");
    child.stdout.on("data", (c) => {
      out += c;
      lastByte = clock();
    });
    child.stderr.on("data", (c) => {
      errb += c;
    });
    child.on("exit", (code) => {
      status = code;
      endAt = clock();
    });
    const timer = setTimeout(() => {
      killed = true;
      child.kill("SIGKILL");
    }, opts.killAfterMs ?? KILL_AFTER_MS);
    child.on("close", (code) => {
      clearTimeout(timer);
      if (status === null) status = code;
      if (!endAt) endAt = clock();
      resolve({ status, stdout: out, stderr: errb, lagMs: endAt - lastByte, lastByte, killed });
    });
    child.on("error", reject);
  });
}

const SLOW_ARGS = [
  "query_api",
  "--className",
  "net.minecraft.world.entity.LivingEntity",
  "--version",
  "1.20.1",
];

{
  /** [标签, argv, 该档上限 ms?] —— 省略即用 LAG_LIMIT_MS */
  const matrix = [
    ["query_api", SLOW_ARGS],
    ["search_docs", ["search_docs", "--platform=fabric", "--version=1.21.1", "--query=block"]],
    ["convert_mapping", ["convert_mapping", "--from", "obfuscated", "--to", "yarn", "--name", "er", "--version", "1.20.1"]],
    ["list-tools", ["list-tools", "--names-only"]],
    ["get_server_status", ["get_server_status"]],
    ["--timeout 富余（定时器建了又用完）", ["get_server_status", "--timeout=30000"]],
    ["--timeout 心跳（定时器在跑就被 clear）", ["get_server_status", "--timeout=250"]],
    // 超时是「放弃等待」不是「掐死 handler」：被放弃的异步工作仍要落地，
    // 实测 ~250ms，故这一档单独放宽到 ABANDON_LAG_LIMIT_MS，只用来抓常驻句柄泄漏。
    ["--timeout 超时（放弃等待后仍要退出）", [...SLOW_ARGS, "--timeout=60"], ABANDON_LAG_LIMIT_MS],
  ];
  const lags = [];
  for (const [label, args, limit = LAG_LIMIT_MS] of matrix) {
    const r = await runTimed(args);
    if (r.killed) throw new Error(`lag 门 ${label}：进程 ${KILL_AFTER_MS}ms 内没退出（有常驻句柄没清）`);
    if (!r.lastByte) throw new Error(`lag 门 ${label}：没有 stdout 可定位末行`);
    if (![0, 1, 2].includes(r.status)) throw new Error(`lag 门 ${label}：退出码 ${r.status} 越出 0/1/2 契约`);
    if (r.lagMs > limit) {
      throw new Error(`lag 门 ${label}：末行 stdout → 进程退出 ${r.lagMs}ms > ${limit}ms`);
    }
    lags.push(`${label}=${r.lagMs}ms/${limit}`);
  }
  console.log(`退出滞后门 8 条路径全部达标：${lags.join(" ")}`);
}

{
  const plain = await runTimed(SLOW_ARGS);
  const quiet = await runTimed([...SLOW_ARGS, "--quiet"]);
  if (!plain.stderr.includes("running query_api")) throw new Error(`默认必须仍有进度行：${plain.stderr}`);
  if (quiet.stderr.includes("running ")) throw new Error(`--quiet 没静音进度行：${quiet.stderr}`);
  if (plain.status !== 0 || quiet.status !== 0) throw new Error(`--quiet 不该改变结果：${plain.status}/${quiet.status}`);
  assert.deepEqual(JSON.parse(quiet.stdout), JSON.parse(plain.stdout), "--quiet 只许动 stderr，stdout 必须逐字段相同");
  const legacy = run(["query", "net.minecraft.world.entity.LivingEntity", "--version", "1.20.1", "--quiet"]);
  if (!legacy.stderr.includes("位置参数")) {
    throw new Error(`--quiet 不得吞掉迁移提示/告警这类诊断：${legacy.stderr}`);
  }
  console.log("--quiet 静音进度行，stdout 与诊断（迁移提示/信封）一概不变");
}

{
  const slow = run([...SLOW_ARGS, "--timeout=60"]);
  const sj = parseJson(slow, "s6-timeout");
  if (slow.status !== 1) throw new Error(`超时必须是 exit 1（0/1/2 契约内细分），实得 ${slow.status}`);
  if (sj.errorKind !== "timeout") throw new Error(`超时信封 errorKind 必须是 timeout：${JSON.stringify(sj).slice(0, 200)}`);
  assert.deepEqual(Object.keys(sj), ["success", "tool", "error", "errorKind"], "超时信封形状变了");
  if (!/超时/.test(String(sj.error)) || !/--timeout/.test(String(sj.error))) {
    throw new Error(`超时说明必须写明是超时并给出 --timeout：${sj.error}`);
  }
  if (!String(sj.error).includes("不是工具失败")) {
    throw new Error(`超时文案必须明确否认这是工具失败（计划要求「写明是超时而非工具失败」）：${sj.error}`);
  }
  if (!slow.stderr.includes("running query_api")) throw new Error(`超时路径仍应有常规进度行：${slow.stderr}`);
  const beats = slow.stderr.split("\n").filter((l) => l.includes("仍在运行"));
  if (beats.length === 0) throw new Error(`--timeout 生效却没心跳（超时前至少该有一行）：${slow.stderr}`);
  const slowQuiet = run([...SLOW_ARGS, "--timeout=60", "--quiet"]);
  if (slowQuiet.stderr.includes("仍在运行") || slowQuiet.stderr.includes("running ")) {
    throw new Error(`--quiet 必须连心跳一起静音：${slowQuiet.stderr}`);
  }
  if (slowQuiet.status !== 1 || parseJson(slowQuiet, "s6-timeout-quiet").errorKind !== "timeout") {
    throw new Error(`--quiet 不该改变超时结论：${slowQuiet.status}`);
  }
  const roomy = run([...SLOW_ARGS, "--timeout=30000"]);
  const rj = parseJson(roomy, "s6-timeout-roomy");
  if (roomy.status !== 0 || rj.success !== true) throw new Error(`宽裕预算下不该误报超时：${roomy.status} ${roomy.stdout.slice(0, 160)}`);
  if (roomy.stderr.includes("仍在运行")) throw new Error(`5s 内跑完的工具不得吐心跳：${roomy.stderr}`);
  const zero = run([...SLOW_ARGS, "--timeout=0"]);
  if (zero.status !== 0) throw new Error(`--timeout=0 表示不限：${zero.status} ${zero.stdout}`);
  const spaced = run([...SLOW_ARGS, "--timeout", "30000"]);
  if (spaced.status !== 0) throw new Error(`--timeout 30000（隔空写法）必须同样生效：${spaced.status} ${spaced.stdout}`);
  console.log(`--timeout：60ms 超时 → exit 1 errorKind timeout（心跳 ${beats.length} 行）；30000/0/隔空均正常完成`);

  for (const bad of ["--timeout", "--timeout=junk", "--timeout=-5", "--timeout=1.5", "--timeout=false"]) {
    const r = run([...SLOW_ARGS, bad]);
    const j = parseJson(r, `s6-bad-${bad}`);
    if (r.status !== 2 || j.errorKind !== "usage") {
      throw new Error(`非法 ${bad} 必须 exit 2 usage：${r.status} ${JSON.stringify(j).slice(0, 160)}`);
    }
    if (!String(j.error).includes("--timeout")) throw new Error(`报错必须点名 --timeout：${j.error}`);
  }
  const help = parseJson(run(["--help"]), "s6-help");
  const usage = Array.isArray(help.usage) ? help.usage.join("\n") : "";
  if (!usage.includes("--quiet") || !usage.includes("--timeout")) {
    throw new Error(`--help 必须声明 --quiet / --timeout：\n${usage}`);
  }
  console.log("非法 --timeout 五写法一律 exit 2 usage；--help 已声明两 flag");
}

// ── S7: 声明与实现对齐（措辞限定 / 示例可解析 / 提示去盘符 / 覆盖面）──────────
const repoRoot = join(root, "..");
const DOC_SCAN = [
  ["README.md", join(repoRoot, "README.md")],
  ["mcp-server/README.md", join(repoRoot, "mcp-server", "README.md")],
  ["AGENTS.md", join(repoRoot, "AGENTS.md")],
  ["AUTO_SETUP.md", join(repoRoot, "AUTO_SETUP.md")],
  ["CONTRIBUTING.md", join(repoRoot, "CONTRIBUTING.md")],
];
const docs = new Map(DOC_SCAN.map(([label, p]) => [label, readFileSync(p, "utf8")]));
const CLI_DOCS = ["mcp-server/README.md", "AGENTS.md"];

/**
 * 不可解析调用形式：行首或行内 code span 里以 `mc-skill …` / `npx mc-skill …` 起头的命令。
 * 只认「mc-skill 后面还跟着命令内容」，所以 `mc-skill`（名字）、mc-skill-cache、
 * mc-skill-data-full-*.zip、docs/mc-skill-update.md 这类合法用词不会被误计。
 */
function badInvokeForms(text) {
  const hits = [];
  const isBad = (s) => /^\s*(?:npx\s+)?mc-skill\s+\S/.test(s);
  for (const line of text.split("\n")) {
    if (isBad(line)) hits.push(line.trim().slice(0, 70));
    for (const m of line.matchAll(/`([^`\n]+)`/g)) {
      if (isBad(m[1])) hits.push("`" + m[1].slice(0, 70) + "`");
    }
  }
  return hits;
}

/** 在指定 cwd 里原样执行一条示例命令行（去掉 bash 行尾注释） */
function runExample(cmdline, cwd) {
  const argv = cmdline.replace(/\s+#.*$/, "").trim().split(/\s+/);
  argv[0] = process.execPath;
  const r = spawnSync(argv[0], argv.slice(1), {
    cwd,
    encoding: "utf8",
    env: { ...process.env, MC_SKILL_DATA: process.env.MC_SKILL_DATA || join(root, "..", "data") },
  });
  return { status: r.status, stdout: r.stdout ?? "", stderr: r.stderr ?? "" };
}

{
  const machineHelp = parseJson(run(["--help"]), "s7-machine-help");
  const usage = Array.isArray(machineHelp.usage) ? machineHelp.usage : [];
  const offenders = [
    ...badInvokeForms(usage.join("\n")).map((h) => `--help(机器): ${h}`),
    ...badInvokeForms(runTty(["--help"]).stdout).map((h) => `--help(TTY): ${h}`),
    ...[...docs].flatMap(([label, text]) => badInvokeForms(text).map((h) => `${label}: ${h}`)),
  ];
  if (offenders.length) {
    throw new Error(`可运行示例仍指向 clone 上不可解析的命令：\n  ${offenders.join("\n  ")}`);
  }
  console.log(`形式门：--help（机器+TTY）与 ${docs.size} 份文档 0 处 mc-skill / npx mc-skill 起头示例`);
}

{
  const rootLines = docs.get("README.md").split("\n");
  const stale = rootLines.filter((l) => /^\s*node dist\/cli\.js\b/.test(l));
  if (stale.length) {
    throw new Error(`根 README.md 行首短形式 node dist/cli.js 必须 0 行（仓库根 MODULE_NOT_FOUND），实得 ${stale.length}：\n  ${stale.join("\n  ")}`);
  }
  const frozen = docs.get("mcp-server/README.md").split("\n").filter((l) => l.includes("node dist/cli.js"));
  if (frozen.length !== 15) {
    throw new Error(`mcp-server/README.md 含 node dist/cli.js 的行数必须等于 S7 开工前快照 15（口径＝含字面量的行，不是行首），实得 ${frozen.length}`);
  }
  const lineStart = frozen.filter((l) => /^\s*node dist\/cli\.js\b/.test(l)).length;
  console.log(`文本地面门：根 README 短形式 0 行；mcp-server/README 含字面量 15 行（其中行首 ${lineStart} 行，口径不混用）`);
}

{
  const usage = parseJson(run(["--help"]), "s7-json-wording").usage.join("\n");
  const texts = new Map([["--help", usage], ...CLI_DOCS.map((k) => [k, docs.get(k)])]);
  const KEY = ["工具输出始终为 JSON", "不改变工具输出，仅为兼容保留", "只在交互式终端下影响"];
  const FORBIDDEN = [/--json[^。\n]{0,12}(切换|决定|选择)[^。\n]{0,10}格式/, /--json[^\n]{0,10}(输出|改成)[^\n]{0,6}文本/];
  for (const [label, text] of texts) {
    for (const phrase of KEY) {
      if (!text.includes(phrase)) throw new Error(`${label} 缺 --json 限定措辞关键句「${phrase}」`);
    }
    for (const bad of FORBIDDEN) {
      const hit = text.match(bad);
      if (hit) throw new Error(`${label} 仍写着被实测否证的措辞「${hit[0]}」`);
    }
  }
  console.log(`--json 措辞门：--help 与 ${CLI_DOCS.join("、")} 三处关键句齐备，且无「切换输出格式」类反向声明`);
}

{
  const cases = [
    ["query_api", ["query_api", "--className", "net.minecraft.world.entity.LivingEntity", "--version", "1.20.1"], 0],
    ["get_server_status", ["get_server_status"], 0],
    ["list-tools", ["list-tools", "--names-only"], 0],
    ["失败工具", ["query_api", "--className", "NoSuchClassAnywhere", "--version", "1.20.1", "--fail-on-error"], 1],
  ];
  for (const [label, args, wantStatus] of cases) {
    const plain = run(args);
    const withJson = run([...args, "--json"]);
    if (plain.status !== wantStatus) {
      throw new Error(`${label} 样本本身不对（期望 exit ${wantStatus}，实得 ${plain.status}）：逐字节比较会空转`);
    }
    if (plain.stdout !== withJson.stdout) {
      throw new Error(`${label}：--json 改变了工具 stdout（声明说不改变工具输出）\n不带：${plain.stdout.slice(0, 120)}\n带：  ${withJson.stdout.slice(0, 120)}`);
    }
    if (withJson.stdout.length < 40) throw new Error(`${label}：stdout 过短，逐字节比较无意义`);
  }
  console.log("--json 逐字节门：4 条路径（含 exit 1 失败样本）带与不带 --json 的 stdout 与退出码全同");
}

{
  const probe = runTty(["--version"]);
  const pkgVersion = JSON.parse(readFileSync(join(root, "package.json"), "utf8")).version;
  if (probe.status !== 0 || probe.stdout.trim() !== pkgVersion) {
    throw new Error(`runTty 探针失效（没有真正进到 CLI）：--version exit ${probe.status} stdout=${JSON.stringify(probe.stdout.slice(0, 80))}`);
  }
  const human = runTty(["--help"]);
  const machine = runTty(["--help", "--json"]);
  if (human.status !== 0 || machine.status !== 0) throw new Error(`TTY --help 失败：${human.status}/${machine.status}`);
  if (human.stdout.trimStart().startsWith("{")) {
    throw new Error("TTY 未加 --json 的 --help 应是人读摘要；若这条变绿说明 --json 真的没作用，措辞该改写");
  }
  if (!human.stdout.includes("用法:")) throw new Error(`TTY --help 没有人读摘要结构：\n${human.stdout.slice(0, 200)}`);
  const mj = JSON.parse(machine.stdout);
  if (!Array.isArray(mj.usage) || mj.usage.length === 0) {
    throw new Error(`TTY + --json 的 --help 必须是可 JSON.parse 的 usage：\n${machine.stdout.slice(0, 200)}`);
  }
  console.log(`TTY 判别门：同一 --help 在强制 TTY 下不带 --json 出 ${Buffer.byteLength(human.stdout)} B 人读摘要、带 --json 出 ${Buffer.byteLength(machine.stdout)} B 机器 schema 入口`);
}

{
  const usage = parseJson(run(["--help"]), "s7-parse").usage;
  const bare = usage.filter(
    (l) => /^node mcp-server\/dist\/cli\.js --version$/.test(l) && !/[[<]/.test(l),
  );
  if (bare.length === 0) {
    throw new Error("--help 必须至少给一条能原样执行的 --version 示例（不含 <占位符> 与 [可选]）");
  }
  const sample = bare.sort((a, b) => a.length - b.length)[0];
  const r = runExample(sample, repoRoot);
  const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
  if (r.status !== 0) throw new Error(`--help 自吐示例「${sample}」在仓库根 exit ${r.status}\n${r.stderr}`);
  if (r.stdout.trim() !== pkg.version) {
    throw new Error(`示例「${sample}」的 stdout 必须是版本号 ${pkg.version}，实得 ${JSON.stringify(r.stdout.trim())}`);
  }
  const docLine = (docs.get("README.md").match(/^node mcp-server\/dist\/cli\.js status\b.*$/m) || [null])[0];
  if (!docLine) throw new Error("根 README.md 里找不到本次改写过的 status 示例行");
  const dr = runExample(docLine, repoRoot);
  const dj = parseJson(dr, "s7-readme-sample");
  if (dr.status !== 0 || dj.success !== true) {
    throw new Error(`根 README 具名示例在仓库根必须 exit 0：${dr.status} ${dr.stdout.slice(0, 160)}${dr.stderr.slice(0, 160)}`);
  }
  console.log(`可解析门：--help 最短 --version 示例「${sample}」→ ${r.stdout.trim()}；根 README 示例行 exit 0 tool=${dj.tool}`);
}

{
  const src = readFileSync(join(root, "src", "cli.ts"), "utf8");
  if (/[A-Za-z]:[\\/]{1,2}(MC_skill|mc_skill)/.test(src) || src.includes("MC_SKILL_DATA=H")) {
    throw new Error("cli.ts 里不能再有写死的盘符数据目录示例");
  }
  const probeDir = mkdtempSync(join(tmpdir(), "mc-skill-s7-nodata-"));
  try {
    const r = run(["get_server_status"], { env: { MC_SKILL_DATA: probeDir } });
    const hint = (r.stderr.split("\n").find((l) => l.includes("提示:")) || "").trim();
    if (!hint) throw new Error(`MC_SKILL_DATA 指向空目录时必须有数据目录提示：\n${r.stderr}`);
    const norm = (s) => s.replace(/[\\/]/g, "");
    if (!norm(hint).includes(norm(probeDir))) {
      throw new Error(`提示必须写出本进程实际查阅的目录 ${probeDir}，实得：${hint}`);
    }
    for (const p of hint.match(/[A-Za-z]:[^\s，。；、)）]+/g) || []) {
      if (!norm(p).includes(norm(probeDir))) {
        throw new Error(`提示里出现与本次推导无关的绝对路径「${p}」（疑似写死示例）：${hint}`);
      }
    }
    if (!hint.includes("MC_SKILL_DATA")) throw new Error(`提示必须点名 MC_SKILL_DATA：${hint}`);
    for (const ghost of ["MC_SKILL_KB", "MC_SKILL_PACK"]) {
      if (hint.includes(ghost)) throw new Error(`提示不能再提到不存在的开关 ${ghost}：${hint}`);
    }
    const ok = run(["get_server_status"]);
    if (ok.stderr.includes("提示:")) throw new Error(`MC_SKILL_DATA 正确时不该再有提示：\n${ok.stderr}`);
    console.log("数据目录提示门：提示写出运行时推导目录且只点名真实环境变量；数据目录正常时不出现");
  } finally {
    rmSync(probeDir, { recursive: true, force: true });
  }
}

{
  const { DATA_DIR_TOOLS } = await import("./dist/cli-parse.js");
  const { listAllToolSchemas } = await import("./dist/tool-registry.js");
  const names = listAllToolSchemas().map((t) => t.name);
  const dead = [...DATA_DIR_TOOLS].filter((n) => !names.includes(n));
  if (dead.length) throw new Error(`DATA_DIR_TOOLS 有注册表里不存在的名字（改名后提示永久失效）：${dead.join(", ")}`);
  const FAMILIES = [
    /^search_.*docs?$/,
    /^list_.*_versions$/,
    /^get_.*_doc_(summary|full|related)$/,
    /_loader_api$/,
    /^query_api$/,
    /^get_method_params$/,
    /^convert_mapping$/,
    /^lookup_obfuscated$/,
    /^query_registry$/,
    /^get_workflow_template$/,
    /^list_knowledge_resources$/,
    /^read_knowledge_resource$/,
    /^get_server_status$/,
    /^diagnose_data_paths$/,
    /^list_community_sources$/,
    /^get_community_doc_(summary|full)$/,
    /^get_minecraft_source$/,
    /^search_mod_code$/,
    /^decompile_mod_jar$/,
    /^download_official_mdk$/,
    /^get_version_info$/,
    /^mc_skill_update$/,
    /^get_migration_guide$/,
  ];
  // 只读用户自备 jar + 写 $MC_SKILL_CACHE，不查 data/（见 src/loader-api/ingest.ts 只用 resolveCacheRoot）
  const NOT_DATA_BACKED = new Set(["ingest_loader_api"]);
  const missing = names.filter((n) => !NOT_DATA_BACKED.has(n) && FAMILIES.some((re) => re.test(n)) && !DATA_DIR_TOOLS.has(n));
  if (missing.length) {
    throw new Error(`数据目录类工具没登记进 DATA_DIR_TOOLS，未配置 MC_SKILL_DATA 时不会给提示：${missing.join(", ")}`);
  }
  for (const local of ["descriptor", "help", "list-tools"]) {
    if (DATA_DIR_TOOLS.has(local)) throw new Error(`本地命令 ${local} 不读 data/，不该进 DATA_DIR_TOOLS`);
  }
  for (const packTool of ["activate_platform_pack", "detect_mod_project"]) {
    if (DATA_DIR_TOOLS.has(packTool)) {
      throw new Error(
        `${packTool} 读的是仓库根 <platform>/<ver> 规则树（resolveRepoRoot 推导，MC_SKILL_DATA 改不动），` +
          `缺树时已各自返回 PACK_NOT_FOUND / packFound:false；要加提示请先改成能说清这一点文案`,
      );
    }
  }
  console.log(`DATA_DIR_TOOLS 枚举门：${DATA_DIR_TOOLS.size} 项全部在册、${FAMILIES.length} 组数据类工具无漏登记、本地命令与规则树工具各自排除`);
}

// ── 反过度门：修示例不许顺手消灭 mc-skill 这个词 ─────────────────────────────
{
  const cacheSrc = readFileSync(join(root, "src", "utils", "path.ts"), "utf8");
  if (!cacheSrc.includes("mc-skill-cache")) throw new Error("resolveCacheRoot 的 mc-skill-cache 目录名不能被改掉");
  const gh = readFileSync(join(root, "src", "update", "github.ts"), "utf8");
  if (!gh.includes("mc-skill-data-full-")) throw new Error("Release 产物名 mc-skill-data-full-*.zip 不能被改掉");
  const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
  if (!pkg.bin || !("mc-skill" in pkg.bin)) throw new Error("package.json 的 bin.mc-skill 键必须原样保留（本故事不许改配置面）");
  readFileSync(join(root, "docs", "mc-skill-update.md"), "utf8");
  console.log("反过度门：mc-skill-cache / mc-skill-data-full-* / docs/mc-skill-update.md / bin 键均未受影响");
}
