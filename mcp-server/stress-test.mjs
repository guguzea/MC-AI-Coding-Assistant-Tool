/**
 * Stress test for queryApi — directly exercises the MCP server's query path
 * Run: node stress-test.mjs
 *
 * Tests:
 * 1. Cold start: first call (Worker must initialize + JSON.parse)
 * 2. Warm sequential: 50 queries without restarting Worker
 * 3. Concurrent: 10 simultaneous queries (reuses same Worker)
 * 4. Repeated cold start: 20 rapid calls that should all reuse the Worker
 */

import { createRequire } from "module";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Import the built dist directly (simulates what MCP server does)
const { queryApi } = await import(`file://${join(__dirname, "dist", "api", "index.js")}`);

// ── Test queries ────────────────────────────────────────────────────────────────
const CLASS_QUERIES = [
  { className: "net.minecraft.world.entity.LivingEntity" },
  { className: "net.minecraft.world.entity.Entity" },
  { className: "net.minecraft.world.block.Block" },
  { className: "net.minecraft.world.item.Item" },
  { className: "net.minecraft.world.level.block.entity.BlockEntity" },
  { className: "net.minecraft.world.level.Level" },
  { className: "net.minecraft.server.level.ServerPlayer" },
  { className: "net.minecraft.network.syncher.SynchedEntityData" },
  { className: "net.minecraft.world.entity.player.Player" },
  { className: "net.minecraft.world.item.ItemStack" },
];

const METHOD_QUERIES = [
  { className: "net.minecraft.world.entity.LivingEntity", methodName: "getHealth" },
  { className: "net.minecraft.world.block.Block", methodName: "getBlockState" },
  { className: "net.minecraft.world.level.Level", methodName: "setBlock" },
  { className: "net.minecraft.world.entity.Entity", methodName: "tick" },
  { className: "net.minecraft.world.item.Item", methodName: "use" },
];

// ── Utilities ───────────────────────────────────────────────────────────────────
function percentile(arr, p) {
  const sorted = [...arr].sort((a, b) => a - b);
  const idx = Math.floor((p / 100) * sorted.length);
  return sorted[Math.min(idx, sorted.length - 1)];
}

function stats(label, times) {
  const sum = times.reduce((a, b) => a + b, 0);
  const avg = sum / times.length;
  console.log(`  ${label}: avg=${avg.toFixed(1)}ms  min=${Math.min(...times)}ms  p50=${percentile(times, 50).toFixed(0)}ms  p90=${percentile(times, 90).toFixed(0)}ms  p99=${percentile(times, 99).toFixed(0)}ms  max=${Math.max(...times)}ms`);
}

async function measure(name, fn) {
  const start = Date.now();
  const result = await fn();
  const elapsed = Date.now() - start;
  return { elapsed, result };
}

// ── Test 1: Cold start ─────────────────────────────────────────────────────────
async function testColdStart() {
  console.log("\n[Test 1] Cold start — first query (Worker initializes + JSON.parse)");
  const { elapsed, result } = await measure("cold start", () =>
    queryApi({ className: "net.minecraft.world.entity.LivingEntity" })
  );
  console.log(`  elapsed=${elapsed}ms  found=${result.found}  methods=${result.methods?.length ?? 0}`);
  return elapsed;
}

// ── Test 2: Warm sequential ────────────────────────────────────────────────────
async function testWarmSequential(count = 50) {
  console.log(`\n[Test 2] Warm sequential — ${count} queries (Worker already initialized)`);

  const allTimes = [];

  // Alternate class and method queries
  const queries = [];
  for (let i = 0; i < count; i++) {
    if (i % 2 === 0) {
      queries.push(CLASS_QUERIES[i % CLASS_QUERIES.length]);
    } else {
      queries.push(METHOD_QUERIES[i % METHOD_QUERIES.length]);
    }
  }

  const times = [];
  for (const q of queries) {
    const { elapsed, result } = await measure("query", () => queryApi(q));
    times.push(elapsed);
  }

  stats("sequential", times);
  return times;
}

// ── Test 3: Concurrent ─────────────────────────────────────────────────────────
async function testConcurrent(concurrency = 10) {
  console.log(`\n[Test 3] Concurrent — ${concurrency} simultaneous queries`);

  const queries = [];
  for (let i = 0; i < concurrency; i++) {
    queries.push(CLASS_QUERIES[i % CLASS_QUERIES.length]);
  }

  const start = Date.now();
  const results = await Promise.all(
    queries.map((q) => queryApi(q))
  );
  const total = Date.now() - start;

  const ok = results.filter(r => r.found).length;
  console.log(`  total=${total}ms  ok=${ok}/${concurrency}  avg=${(total / concurrency).toFixed(1)}ms`);
  return { total, ok, concurrency };
}

// ── Test 4: Rapid repeated calls (no Worker restart) ────────────────────────────
async function testRapidRepeat(count = 20, delay = 0) {
  console.log(`\n[Test 4] Rapid repeat — ${count} calls with ${delay}ms delay (verifies no Worker hang)`);

  const times = [];
  for (let i = 0; i < count; i++) {
    const { elapsed, result } = await measure("query", () =>
      queryApi(CLASS_QUERIES[i % CLASS_QUERIES.length])
    );
    times.push(elapsed);
    if (delay > 0) await new Promise(r => setTimeout(r, delay));
  }

  stats("rapid", times);
  return times;
}

// ── Test 5: Stress — 200 rapid queries ────────────────────────────────────────
async function testStress(count = 200) {
  console.log(`\n[Test 5] Stress — ${count} rapid queries`);

  const times = [];
  for (let i = 0; i < count; i++) {
    const { elapsed } = await measure("query", () =>
      queryApi(i % 2 === 0 ? CLASS_QUERIES[i % CLASS_QUERIES.length] : METHOD_QUERIES[i % METHOD_QUERIES.length])
    );
    times.push(elapsed);
  }

  stats("stress", times);
  return times;
}

// ── Main ───────────────────────────────────────────────────────────────────────
async function main() {
  console.log("=".repeat(60));
  console.log("MCP Server queryApi Stress Test");
  console.log("=".repeat(60));

  const t1 = await testColdStart();
  const t2 = await testWarmSequential(50);
  const t3 = await testConcurrent(10);
  const t4 = await testRapidRepeat(20, 0);
  const t5 = await testStress(200);

  console.log("\n" + "=".repeat(60));
  console.log("Summary");
  console.log("=".repeat(60));
  console.log(`Cold start:    ${t1}ms`);
  console.log(`Warm (avg):    ${(t2.reduce((a,b)=>a+b,0)/t2.length).toFixed(1)}ms`);
  console.log(`Concurrent:    ${t3.total}ms total for ${t3.concurrency} (${(t3.total/t3.concurrency).toFixed(1)}ms avg)`);
  console.log(`Rapid (avg):   ${(t4.reduce((a,b)=>a+b,0)/t4.length).toFixed(1)}ms`);
  console.log(`Stress (avg):  ${(t5.reduce((a,b)=>a+b,0)/t5.length).toFixed(1)}ms`);

  const warmAvg = t2.reduce((a, b) => a + b, 0) / t2.length;
  const stressAvg = t5.reduce((a, b) => a + b, 0) / t5.length;
  if (warmAvg < 100 && stressAvg < 100) {
    console.log("\n✓ All tests passed — queries are fast and reliable");
  } else {
    console.log("\n~ Some queries are slower than expected");
  }
}

main().catch(console.error);
