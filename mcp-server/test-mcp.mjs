/**
 * Direct MCP stdio client — sends real JSON-RPC requests to the server
 */

import { spawn } from "child_process";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const serverPath = join(__dirname, "dist", "index.js");

// JSON-RPC request helper
let id = 1;
function jsonrpc(method, params) {
  return JSON.stringify({ jsonrpc: "2.0", id: id++, method, params });
}

// Parse line-buffered JSON-RPC responses
let buffer = "";
function parseResponse(raw) {
  buffer += raw;
  const lines = buffer.split("\n");
  buffer = lines.pop() ?? "";
  return lines.map(l => l.trim()).filter(Boolean).map(l => JSON.parse(l));
}

async function callTool(name, args) {
  return new Promise((resolve, reject) => {
    const proc = spawn("node", [serverPath], {
      cwd: "c:/Users/zzrCN/mc_skill",
      stdio: ["pipe", "pipe", "pipe"],
    });

    const responses = [];
    proc.stderr.on("data", d => process.stderr.write(d));
    proc.stdout.on("data", d => {
      parseResponse(d.toString()).forEach(r => responses.push(r));
    });

    // Send initialize
    proc.stdin.write(jsonrpc("initialize", {
      protocolVersion: "2024-11-05",
      capabilities: {},
      clientInfo: { name: "stress-test", version: "1.0.0" },
    }) + "\n");

    // Send tool call
    proc.stdin.write(jsonrpc("tools/call", {
      name,
      arguments: args,
    }) + "\n");

    setTimeout(() => {
      proc.kill();
      // Find the tool call result (id > 1, has content)
      const result = responses.find(r => r.result?.content && r.result.content.length > 0);
      if (result) {
        resolve(result);
      } else {
        reject(new Error(`No result. responses=${JSON.stringify(responses.map(r => ({ id: r.id, hasResult: !!r.result, keys: Object.keys(r.result || {}) })))}`));
      }
    }, 8000);
  });
}

async function main() {
  console.log("=== MCP Server query_api Test ===\n");

  // Test 1: Class query
  console.log("[Test 1] Query class: net.minecraft.world.entity.LivingEntity");
  const r1 = await callTool("query_api", {
    className: "net.minecraft.world.entity.LivingEntity",
  });
  const content1 = JSON.parse(r1.result.content[0].text);
  console.log(`  found=${content1.found}  methods=${content1.methods?.length ?? 0}`);
  console.log(`  javadoc: ${(content1.classJavadoc ?? "").slice(0, 120)}...`);
  console.log();

  // Test 2: Method query (SRG name: getMaxHealth, not Mojang getHealth)
  console.log("[Test 2] Query method: getMaxHealth on LivingEntity");
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

  // Test 3: Fuzzy search (typo in BlockEntity)
  console.log("[Test 3] Fuzzy: Blck");
  const r3 = await callTool("query_api", {
    className: "net.minecraft.world.level.block.entity.Blck",
  });
  const content3 = JSON.parse(r3.result.content[0].text);
  console.log(`  found=${content3.found}  suggestions: ${content3.suggestions?.join(" | ")}`);
  console.log();

  console.log("✓ All MCP calls completed successfully");
}

main().catch(e => { console.error("FAILED:", e.message); process.exit(1); });
