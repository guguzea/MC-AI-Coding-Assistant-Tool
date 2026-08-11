/**
 * CLI test for mc-skill（T3：flags-only + list-tools + JSON 包装 + 旧位置参数兼容）
 */
import { spawnSync } from "child_process";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)));
const cli = join(root, "dist", "cli.js");

function run(args) {
  const r = spawnSync(process.execPath, [cli, ...args], {
    encoding: "utf8",
    env: { ...process.env, MC_SKILL_DATA: process.env.MC_SKILL_DATA || join(root, "..", "data") },
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

// ── 2. list-tools：62 工具 + lookup_obfuscated / convert_mapping ─────────────
{
  const r = run(["list-tools"]);
  if (r.status !== 0) throw new Error(`list-tools failed (exit ${r.status}):\n${r.stderr}\n${r.stdout}`);
  const j = parseJson(r, "list-tools");
  if (j.success !== true || j.tool !== "list-tools") throw new Error(`list-tools wrapper bad: ${JSON.stringify(j).slice(0, 200)}`);
  if (j.result?.total !== 62) throw new Error(`list-tools total=${j.result?.total}, expected 62`);
  const names = (j.result.tools ?? []).map((t) => t.name);
  for (const required of ["lookup_obfuscated", "convert_mapping", "validate_at", "validate_aw"]) {
    if (!names.includes(required)) throw new Error(`list-tools missing ${required}`);
  }
  if (!j.result.tools.every((t) => t.parameters && typeof t.parameters === "object")) {
    throw new Error("list-tools: every tool must carry parameters (inputSchema)");
  }
  console.log(`list-tools: ${j.result.total} tools`);
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

// ── 4. convert 缺 name → exit 1 + {success:false, error} ─────────────────────
{
  const r = run(["convert", "--from", "mcp", "--to", "mojang"]);
  if (r.status !== 1) throw new Error(`expected exit 1, got ${r.status}:\n${r.stdout}\n${r.stderr}`);
  const j = parseJson(r, "convert-missing-name");
  if (j.success !== false || !j.error) throw new Error(`missing-name error shape bad: ${JSON.stringify(j)}`);
  console.log("convert 缺 --name → exit 1 {success:false, error}");
}

// ── 5. 裸 mc-skill → usage + exit 2 ──────────────────────────────────────────
{
  const r = run([]);
  if (r.status !== 2) throw new Error(`expected exit 2 for bare mc-skill, got ${r.status}`);
  console.log("裸 mc-skill → exit 2");
}

// ── 6. help → exit 0 ─────────────────────────────────────────────────────────
{
  for (const arg of ["--help", "-h", "help"]) {
    const r = run([arg]);
    if (r.status !== 0) throw new Error(`expected exit 0 for ${arg}, got ${r.status}`);
  }
  console.log("--help / -h / help → exit 0");
}

// ── 7. 原有用例保持：descriptor + status（descriptor 走兼容路径）───────────────
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
  console.log("status: ok");
}

console.log("test-cli: ok");
