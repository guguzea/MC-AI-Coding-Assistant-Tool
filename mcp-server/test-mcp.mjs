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

import assert from "node:assert/strict";
import { spawn } from "child_process";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const serverPath = join(__dirname, "dist", "index.js");

// ── 配置 ──────────────────────────────────────────────────────────────────────

const TIMEOUT_MS = parseInt(process.env.MCP_TIMEOUT_MS ?? "30000", 10);
const REPO_ROOT = join(__dirname, "..");
const DATA_DIR = process.env.MC_SKILL_DATA ?? join(REPO_ROOT, "data");
const COMMUNITY_DIR = process.env.MC_SKILL_COMMUNITY ?? join(REPO_ROOT, "community_knowledge");

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
let serverReadyError = null;
let serverReadyWaiters = [];
const pendingRequests = new Map(); // id -> { resolve, reject }
let serverStartTime = 0;

function startServer() {
  if (serverProc) return;

  serverStartTime = Date.now();
  serverProc = spawn("node", [serverPath], {
    cwd: REPO_ROOT,
    stdio: ["pipe", "pipe", "pipe"],
    env: {
      ...process.env,
      MC_SKILL_DATA: DATA_DIR,
      MC_SKILL_COMMUNITY: COMMUNITY_DIR,
    },
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
        for (const waiter of serverReadyWaiters) waiter.resolve();
        serverReadyWaiters = [];
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
    const error = new Error(`Server spawn failed: ${err.message}`);
    serverReadyError = error;
    for (const waiter of serverReadyWaiters) waiter.reject(error);
    serverReadyWaiters = [];
    for (const request of pendingRequests.values()) request.reject(error);
    pendingRequests.clear();
  });

  serverProc.on("close", code => {
    const error = new Error(`Server exited before completing tests (code=${code ?? "unknown"})`);
    if (!serverReady) {
      serverReadyError = error;
      for (const waiter of serverReadyWaiters) waiter.reject(error);
      serverReadyWaiters = [];
    }
    for (const request of pendingRequests.values()) request.reject(error);
    pendingRequests.clear();
    if (code !== 0 && code !== null) {
      console.error(`[server] exited with code ${code}`);
    }
  });
}

async function waitForServerReady() {
  if (serverReady) return;
  if (serverReadyError) throw serverReadyError;

  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      const error = new Error(`Server did not become ready within ${TIMEOUT_MS}ms`);
      serverReadyError = error;
      reject(error);
    }, TIMEOUT_MS);
    serverReadyWaiters.push({
      resolve: () => {
        clearTimeout(timeout);
        resolve();
      },
      reject: (error) => {
        clearTimeout(timeout);
        reject(error);
      },
    });
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
  console.log(`Config: TIMEOUT_MS=${TIMEOUT_MS}, DATA_DIR=${DATA_DIR}, COMMUNITY_DIR=${COMMUNITY_DIR}\n`);

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

  console.log("[Test D1] search_docs: registry (1.20.1)");
  const rd1 = await callTool("search_docs", {
    query: "registry",
    version: "1.20.1",
    platform: "forge",
  });
  assert.ok(rd1.result?.content?.[0]?.text, "search_docs must return text content");
  const cd1 = JSON.parse(rd1.result.content[0].text);
  assert.equal(cd1.error, undefined, `search_docs failed: ${JSON.stringify(cd1.error)}`);
  assert.ok(cd1.total > 0, "Forge registry search should return results");
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
  assert.equal(content1.found, true, `LivingEntity API lookup failed: ${JSON.stringify(content1.suggestions)}`);
  assert.ok(content1.methods?.length > 0, "LivingEntity should expose methods");
  console.log(`  found=${content1.found}  methods=${content1.methods?.length ?? 0}`);
  console.log(`  javadoc: ${(content1.classJavadoc ?? "").slice(0, 120)}...`);
  console.log();

  console.log("[Test A2] Query method: getMaxHealth on LivingEntity");
  const r2 = await callTool("query_api", {
    className: "net.minecraft.world.entity.LivingEntity",
    methodName: "getMaxHealth",
  });
  const content2 = JSON.parse(r2.result.content[0].text);
  assert.equal(content2.found, true, `getMaxHealth lookup failed: ${JSON.stringify(content2.suggestions)}`);
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

  console.log("[Test D6] search_docs: platform=neoforge");
  const rd6 = await callTool("search_docs", {
    query: "registry",
    version: "1.20.4",
    platform: "neoforge",
  });
  assert.ok(rd6.result?.content?.[0]?.text, "NeoForge search must return text content");
  const cd6 = JSON.parse(rd6.result.content[0].text);
  assert.equal(cd6.error, undefined, `NeoForge search failed: ${JSON.stringify(cd6.error)}`);
  assert.equal(cd6.platform, "neoforge");
  assert.ok(Array.isArray(cd6.results), "NeoForge search must return a results array");
  console.log(`  total=${cd6.total}  first_id=${cd6.results[0]?.id ?? "n/a"}`);
  console.log();

  // ── Fabric docs + Yarn SQLite ───────────────────────────────────────────────

  console.log("[Test D7] search_fabric_docs: item (1.20.1)");
  const rd7 = await callTool("search_fabric_docs", {
    query: "item",
    version: "1.20.1",
  });
  assert.ok(rd7.result?.content?.[0]?.text, "Fabric search must return text");
  const cd7 = JSON.parse(rd7.result.content[0].text);
  assert.equal(cd7.error, undefined, `Fabric search failed: ${JSON.stringify(cd7.error)}`);
  assert.ok((cd7.total ?? 0) > 0 || (cd7.results?.length ?? 0) > 0, "Fabric item search should return results");
  console.log(`  total=${cd7.total ?? cd7.results?.length ?? 0}`);
  console.log();

  console.log("[Test M1] convert_mapping yarn→mojang class (SQLite)");
  const rm1 = await callTool("convert_mapping", {
    from: "yarn",
    to: "mojang",
    memberName: "net/minecraft/block/Block",
    version: "1.20.1",
  });
  const cm1 = JSON.parse(rm1.result.content[0].text);
  assert.equal(cm1.found, true, `yarn convert failed: ${JSON.stringify(cm1)}`);
  console.log(`  found=${cm1.found} converted=${cm1.converted}`);
  console.log();

  console.log("[Test P1] port_project write gated without allow env (safe behavior)");
  const rp1 = await callTool("port_project", {
    projectPath: join(REPO_ROOT, "tmp-should-not-write"),
    action: "init_architectury",
    dryRun: false,
    confirmed: true,
    modId: "sandboxmod",
  });
  const cp1 = JSON.parse(rp1.result.content[0].text);
  // 保留安全行为：不得真正写入。允许沙箱错误，或强制降级为 dryRun 预览。
  const safeBlocked =
    (cp1.ok === false &&
      (cp1.error?.code === "WRITE_DISABLED" ||
        cp1.error?.code === "PROJECT_ROOT_REQUIRED" ||
        cp1.error?.code === "CONFLICTING_FILES")) ||
    (cp1.ok === true && cp1.dryRun === true);
  assert.ok(safeBlocked, `expected safe no-write outcome, got ${JSON.stringify(cp1).slice(0, 400)}`);
  console.log(
    `  safe as expected: ${cp1.ok === false ? cp1.error?.code : "dryRun-preview"}`,
  );
  console.log();

  console.log("[Test L1] tools/list includes core tools");
  const { id: listId, message: listMsg } = jsonrpc("tools/list", {});
  const listPromise = new Promise((resolve, reject) => {
    pendingRequests.set(listId, { resolve, reject });
    serverProc.stdin.write(listMsg + "\n");
  });
  const listTimeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("tools/list timeout")), TIMEOUT_MS),
  );
  const listResp = await Promise.race([listPromise, listTimeout]);
  const toolNames = (listResp.result?.tools ?? []).map((t) => t.name);
  for (const required of [
    "search_fabric_docs",
    "convert_mapping",
    "port_project",
    "search_docs",
    "query_api",
    "list_community_sources",
    "search_community_docs",
    "get_community_doc_summary",
    "get_community_doc_full",
    "diagnose_data_paths",
    "crash_analyze",
  ]) {
    assert.ok(toolNames.includes(required), `tools/list missing ${required}`);
  }
  assert.equal(toolNames.length, 54, `expected 54 tools, got ${toolNames.length}`);
  console.log(`  tools=${toolNames.length}`);
  console.log();

  // ── Community + diagnose + crash ────────────────────────────────────────────

  console.log("[Test C1] diagnose_data_paths (community found)");
  const rc1 = await callTool("diagnose_data_paths", {});
  const cc1 = JSON.parse(rc1.result.content[0].text);
  assert.ok(cc1.platforms?.forge?.status === "found", "forge data must be found");
  assert.ok(cc1.community?.status === "found", `community must be found: ${JSON.stringify(cc1.community)}`);
  console.log(`  community=${cc1.community?.path}`);
  console.log();

  console.log("[Test C2] list_community_sources");
  const rc2 = await callTool("list_community_sources", {});
  const cc2 = JSON.parse(rc2.result.content[0].text);
  assert.ok(cc2.total >= 14, `expected community entries, got ${cc2.total}`);
  assert.equal(cc2.byKind?.unknown ?? 0, 0, `no unknown kind entries: ${JSON.stringify(cc2.byKind)}`);
  console.log(`  total=${cc2.total} byKind=${JSON.stringify(cc2.byKind)}`);
  console.log();

  console.log("[Test C3] search_community_docs: Capability");
  const rc3 = await callTool("search_community_docs", { query: "Capability 漏斗" });
  const cc3 = JSON.parse(rc3.result.content[0].text);
  assert.ok((cc3.total ?? 0) >= 1, "Capability search should hit itemhandler");
  const capHit = (cc3.results ?? []).some((r) => String(r.id).includes("itemhandler") || /Capability/i.test(r.label + r.summary));
  assert.ok(capHit, `expected capability/itemhandler hit: ${JSON.stringify(cc3.results?.slice(0, 3))}`);
  console.log(`  total=${cc3.total} first=${cc3.results?.[0]?.id}`);
  console.log();

  console.log("[Test C4] get_community_doc_full links are linkOnly");
  const rc4s = await callTool("search_community_docs", { query: "工程化", sourceKind: "links" });
  const cc4s = JSON.parse(rc4s.result.content[0].text);
  assert.ok(cc4s.total >= 1, "links search should find 6071 stub");
  const linkId = cc4s.results[0].id;
  const rc4 = await callTool("get_community_doc_full", { id: linkId });
  const cc4 = JSON.parse(rc4.result.content[0].text);
  assert.equal(cc4.linkOnly, true);
  assert.ok(cc4.url, "link full must include url");
  assert.equal(cc4.content ?? "", "");
  console.log(`  id=${linkId} url=${cc4.url}`);
  console.log();

  console.log("[Test C5] get_community_doc_summary authored machine");
  const rc5 = await callTool("get_community_doc_summary", { id: "authored/machine-be-gui-working" });
  const cc5 = JSON.parse(rc5.result.content[0].text);
  assert.ok(!cc5.error, `summary error: ${JSON.stringify(cc5)}`);
  assert.ok((cc5.summary ?? "").length > 10);
  console.log(`  label=${cc5.label}`);
  console.log();

  console.log("[Test C6] crash_analyze missing dependency");
  const rc6 = await callTool("crash_analyze", {
    crashReport:
      "---- Minecraft Crash Report ----\nFile: crash-2024-01-01_12.00.00-fml.txt\nMissing or unsupported mandatory dependencies: examplelib\n",
  });
  const cc6 = JSON.parse(rc6.result.content[0].text);
  assert.equal(cc6.crashKind, "fml");
  assert.ok(Array.isArray(cc6.logHints) && cc6.logHints.length > 0);
  console.log(`  crashKind=${cc6.crashKind} cause=${cc6.probableCause}`);
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
  process.exit(0);
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
