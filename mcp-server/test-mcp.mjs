/**
 * MCP Server 测试脚本
 *
 * 特性：
 * - 进程复用：server 启动后保持运行，所有测试共用同一个进程
 * - 精确 id 匹配：每个请求携带唯一 id，精确等待对应响应
 * - 可配置超时：从环境变量 MCP_TIMEOUT_MS 读取，默认 30 秒
 * - 性能埋点：打印冷启动耗时 + 各工具平均耗时
 *
 * 用法：
 *   node test-mcp.mjs                          # 默认测试
 *   MCP_TIMEOUT_MS=60000 node test-mcp.mjs    # 60 秒超时
 *   MC_SKILL_DATA=/path/to/data node test-mcp.mjs  # 指定数据目录
 */

import { spawn } from "child_process";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const serverPath = join(__dirname, "dist", "index.js");

// ── 配置 ──────────────────────────────────────────────────────────────────────

const TIMEOUT_MS = parseInt(process.env.MCP_TIMEOUT_MS ?? "30000", 10);
const DATA_DIR = process.env.MC_SKILL_DATA ?? "h:/MC_skill/data";

// ── JSON-RPC helpers ───────────────────────────────────────────────────────────

let nextId = 1;
function jsonrpc(method, params) {
  const id = nextId++;
  return { id, message: JSON.stringify({ jsonrpc: "2.0", id, method, params }) };
}

let buffer = "";
function parseResponse(raw) {
  buffer += raw;
  const lines = buffer.split("\n");
  buffer = lines.pop() ?? "";
  return lines.map(l => l.trim()).filter(Boolean).map(l => {
    try { return JSON.parse(l); }
    catch { return null; }
  }).filter(Boolean);
}

// ── 性能埋点 ──────────────────────────────────────────────────────────────────

const perfMetrics = [];
function recordPerf(name, startMs) {
  const elapsed = Date.now() - startMs;
  perfMetrics.push({ name, elapsed });
  return elapsed;
}

// ── 服务器进程管理 ────────────────────────────────────────────────────────────

let serverProc = null;
let serverReady = false;
const pendingRequests = new Map(); // id -> { resolve, reject }
let serverStartTime = 0;

function startServer() {
  if (serverProc) return;

  serverStartTime = Date.now();
  serverProc = spawn("node", [serverPath], {
    cwd: "h:/MC_skill",
    stdio: ["pipe", "pipe", "pipe"],
    env: { ...process.env, MC_SKILL_DATA: DATA_DIR },
  });

  serverProc.stderr.on("data", d => {
    const line = d.toString().trim();
    if (line) process.stderr.write(`[server] ${line}\n`);
  });

  serverProc.stdout.on("data", d => {
    const raw = d.toString();
    const responses = parseResponse(raw);
    for (const r of responses) {
      // 检查是否是 initialize 响应
      if (r.result?.protocolVersion && !serverReady) {
        serverReady = true;
        recordPerf("server_init", serverStartTime);
        console.log(`[perf] server cold start: ${Date.now() - serverStartTime}ms`);
      }
      // 精确匹配响应（只匹配有 id 的响应）
      if (r.id !== undefined && pendingRequests.has(r.id)) {
        pendingRequests.get(r.id).resolve(r);
        pendingRequests.delete(r.id);
      }
    }
  });

  serverProc.on("error", err => {
    console.error("[server] spawn error:", err.message);
    process.exit(1);
  });

  serverProc.on("close", code => {
    if (code !== 0 && code !== null) {
      console.error(`[server] exited with code ${code}`);
    }
  });
}

async function waitForServerReady() {
  if (serverReady) return Promise.resolve();
  return new Promise(resolve => {
    const check = setInterval(() => {
      if (serverReady) {
        clearInterval(check);
        resolve();
      }
    }, 50);
  });
}

function stopServer() {
  if (serverProc) {
    serverProc.kill();
    serverProc = null;
    serverReady = false;
  }
}

// ── 工具调用 ──────────────────────────────────────────────────────────────────

async function callTool(name, args) {
  if (!serverReady) await waitForServerReady();
  const { id, message } = jsonrpc("tools/call", { name, arguments: args });
  const start = Date.now();

  const promise = new Promise((resolve, reject) => {
    pendingRequests.set(id, { resolve, reject });
    serverProc.stdin.write(message + "\n");
  });

  const timeout = new Promise((_, reject) =>
    setTimeout(() => {
      if (pendingRequests.has(id)) {
        pendingRequests.delete(id);
        reject(new Error(`Tool ${name} timed out after ${TIMEOUT_MS}ms (id=${id})`));
      }
    }, TIMEOUT_MS)
  );

  const result = await Promise.race([promise, timeout]);
  recordPerf(`tool:${name}`, start);
  return result;
}

// ── 测试用例 ──────────────────────────────────────────────────────────────────

async function runTests() {
  console.log("=== MCP Server Full Tool Test ===\n");
  console.log(`Config: TIMEOUT_MS=${TIMEOUT_MS}, DATA_DIR=${DATA_DIR}\n`);

  // 启动服务器
  startServer();

  // 发送 initialize
  const { id: initId, message: initMsg } = jsonrpc("initialize", {
    protocolVersion: "2024-11-05",
    capabilities: {},
    clientInfo: { name: "stress-test", version: "1.0.0" },
  });
  serverProc.stdin.write(initMsg + "\n");

  await waitForServerReady();

  // ── Doc Tools ──────────────────────────────────────────────────────────────

  console.log("[Test D1] search_docs: DeferredRegister (1.20.1)");
  const rd1 = await callTool("search_docs", {
    query: "DeferredRegister",
    version: "1.20.1",
    platform: "forge",
  });
  const cd1 = JSON.parse(rd1.result.content[0].text);
  console.log(`  total=${cd1.total ?? 0}  first_id=${cd1.results?.[0]?.id ?? "n/a"}`);
  if (cd1.results?.[0]) {
    console.log(`  label=${cd1.results[0].label}  tags=${cd1.results[0].tags?.join(", ")}`);
  }
  if (cd1.error) console.log(`  ERROR: ${cd1.error}`);
  console.log();

  const firstId = cd1.results?.[0]?.id ?? "1.20.1/concepts_registries";
  console.log(`  -> using id="${firstId}" for subsequent doc tests`);
  console.log();

  console.log("[Test D2] get_forge_doc_summary (L1): concepts_registries");
  const rd2 = await callTool("get_forge_doc_summary", {
    id: firstId,
    version: "1.20.1",
  });
  const cd2 = JSON.parse(rd2.result.content[0].text);
  console.log(`  label=${cd2.label ?? "n/a"}  tags=${cd2.tags?.join(", ") ?? "n/a"}`);
  if (cd2.firstParagraph) {
    console.log(`  firstParagraph: ${cd2.firstParagraph.slice(0, 80)}...`);
  }
  if (cd2.sections) {
    console.log(`  sections (${cd2.sections.length}): ${cd2.sections.slice(0, 3).map(s => s.title).join(" | ")}`);
  }
  if (cd2.error) console.log(`  ERROR: ${cd2.error}  hint=${cd2.hint}`);
  console.log();

  console.log("[Test D3] get_forge_doc_full (L2+): concepts_registries");
  const rd3 = await callTool("get_forge_doc_full", {
    id: firstId,
    version: "1.20.1",
    highlight_key: false,
  });
  const cd3 = JSON.parse(rd3.result.content[0].text);
  console.log(`  content_length=${cd3.content?.length ?? 0}  codeBlocks=${cd3.meta?.codeBlockCount ?? 0}`);
  if (cd3.keyBlocks) {
    console.log(`  keyBlocks: ${cd3.keyBlocks.map(b => `${b.type}/${b.role}`).join(", ")}`);
  }
  if (cd3.error) console.log(`  ERROR: ${cd3.error}`);
  console.log();

  console.log("[Test D4] search_docs: tag=datagen");
  const rd4 = await callTool("search_docs", {
    query: "datagen",
    version: "1.20.1",
    platform: "forge",
    tags: ["datagen"],
  });
  const cd4 = JSON.parse(rd4.result.content[0].text);
  console.log(`  total=${cd4.total ?? 0}`);
  if (cd4.error) console.log(`  ERROR: ${cd4.error}`);
  console.log();

  console.log("[Test D5] list_forge_versions");
  const rd5 = await callTool("list_forge_versions", {});
  const cd5 = JSON.parse(rd5.result.content[0].text);
  console.log(`  versions=${JSON.stringify(cd5.versions ?? cd5)}`);
  console.log();

  // ── API Tools ───────────────────────────────────────────────────────────────

  console.log("[Test A1] Query class: net.minecraft.world.entity.LivingEntity");
  const r1 = await callTool("query_api", {
    className: "net.minecraft.world.entity.LivingEntity",
  });
  const content1 = JSON.parse(r1.result.content[0].text);
  console.log(`  found=${content1.found}  methods=${content1.methods?.length ?? 0}`);
  console.log(`  javadoc: ${(content1.classJavadoc ?? "").slice(0, 120)}...`);
  console.log();

  console.log("[Test A2] Query method: getMaxHealth on LivingEntity");
  const r2 = await callTool("query_api", {
    className: "net.minecraft.world.entity.LivingEntity",
    methodName: "getMaxHealth",
  });
  const content2 = JSON.parse(r2.result.content[0].text);
  console.log(`  found=${content2.found}`);
  if (content2.methods) {
    for (const m of content2.methods) {
      console.log(`  method: ${m.name}(${m.parameters.join(", ")}) -> ${m.returnType}`);
      if (m.javadoc) console.log(`  javadoc: ${m.javadoc.slice(0, 100)}...`);
    }
  }
  console.log();

  console.log("[Test A3] Fuzzy: Blck (expect suggestions)");
  const r3 = await callTool("query_api", {
    className: "net.minecraft.world.level.block.entity.Blck",
  });
  const content3 = JSON.parse(r3.result.content[0].text);
  console.log(`  found=${content3.found}  suggestions: ${content3.suggestions?.join(" | ") ?? "n/a"}`);
  console.log();

  // ── 通用 doc 工具（非 forge 平台测试）──────────────────────────────────────

  console.log("[Test D6] search_docs: platform=neoforge (should return UNSUPPORTED_PLATFORM error)");
  const rd6 = await callTool("search_docs", {
    query: "registry",
    version: "1.20.4",
    platform: "neoforge",
  });
  const cd6 = JSON.parse(rd6.result.content[0].text);
  if (cd6.ok === false && cd6.error?.code === "UNSUPPORTED_PLATFORM") {
    console.log(`  ✓ Got expected UNSUPPORTED_PLATFORM error`);
    console.log(`  message: ${cd6.error.message}`);
    console.log(`  hint: ${cd6.error.hint}`);
  } else if (cd6.error) {
    console.log(`  ERROR (unexpected format): ${JSON.stringify(cd6)}`);
  } else {
    console.log(`  WARNING: Expected error but got success: ${JSON.stringify(cd6).slice(0, 200)}`);
  }
  console.log();

  // ── 性能报告 ────────────────────────────────────────────────────────────────

  console.log("=== Performance Summary ===");
  const toolMetrics = perfMetrics.filter(m => m.name.startsWith("tool:"));
  const totalToolTime = toolMetrics.reduce((sum, m) => sum + m.elapsed, 0);
  const avgToolTime = toolMetrics.length > 0 ? Math.round(totalToolTime / toolMetrics.length) : 0;

  for (const m of perfMetrics) {
    if (m.name === "server_init") continue;
    console.log(`  ${m.name}: ${m.elapsed}ms`);
  }
  console.log(`  avg per tool: ${avgToolTime}ms`);
  console.log();

  stopServer();
  console.log("✓ All MCP calls completed successfully");
}

// ── 主入口 ────────────────────────────────────────────────────────────────────

process.on("SIGINT", () => {
  stopServer();
  process.exit(0);
});

runTests().catch(e => {
  console.error("FAILED:", e.message);
  stopServer();
  process.exit(1);
});
