/**
 * Release smoke: black-box start from a temp install using only dist/ + data/.
 * Does not read the developer tree beyond copying required artefacts.
 */
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdtempSync,
  rmSync,
  writeFileSync,
  mkdirSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = join(__dirname, "..");
const DATA = process.env.MC_SKILL_DATA ?? join(REPO, "..", "data");
const TIMEOUT_MS = Number(process.env.MCP_TIMEOUT_MS ?? 60000);

assert.ok(existsSync(join(REPO, "dist", "index.js")), "build first: npm run build");
assert.ok(existsSync(DATA), `data missing: ${DATA}`);

const staging = mkdtempSync(join(tmpdir(), "mc-skill-release-smoke-"));
const serverDir = join(staging, "mcp-server");
const dataDir = join(staging, "data");

mkdirSync(serverDir, { recursive: true });
cpSync(join(REPO, "dist"), join(serverDir, "dist"), { recursive: true });
cpSync(join(REPO, "package.json"), join(serverDir, "package.json"));
cpSync(join(REPO, "package-lock.json"), join(serverDir, "package-lock.json"));
cpSync(join(REPO, "node_modules"), join(serverDir, "node_modules"), { recursive: true });
// Copy data (may take a while on full tree). Prefer MC_SKILL_SMOKE_DATA_LINK=1 to junction.
if (process.env.MC_SKILL_SMOKE_DATA_LINK === "1") {
  // Windows junction / posix symlink for speed
  const { execSync } = await import("node:child_process");
  if (process.platform === "win32") {
    execSync(`cmd /c mklink /J "${dataDir}" "${DATA}"`);
  } else {
    execSync(`ln -s "${DATA}" "${dataDir}"`);
  }
} else {
  console.log("Copying data/ into staging (set MC_SKILL_SMOKE_DATA_LINK=1 to junction)...");
  cpSync(DATA, dataDir, { recursive: true });
}

let nextId = 1;
let buffer = "";
const pending = new Map();
const proc = spawn("node", [join(serverDir, "dist", "index.js")], {
  cwd: staging,
  stdio: ["pipe", "pipe", "pipe"],
  env: { ...process.env, MC_SKILL_DATA: dataDir },
});

proc.stderr.on("data", (d) => process.stderr.write(`[smoke-server] ${d}`));
proc.stdout.on("data", (d) => {
  buffer += d.toString();
  const lines = buffer.split("\n");
  buffer = lines.pop() ?? "";
  for (const line of lines) {
    if (!line.trim()) continue;
    let msg;
    try {
      msg = JSON.parse(line);
    } catch {
      continue;
    }
    if (msg.id !== undefined && pending.has(msg.id)) {
      pending.get(msg.id).resolve(msg);
      pending.delete(msg.id);
    }
  }
});

function rpc(method, params) {
  const id = nextId++;
  const message = JSON.stringify({ jsonrpc: "2.0", id, method, params });
  const p = new Promise((resolve, reject) => {
    const t = setTimeout(() => {
      pending.delete(id);
      reject(new Error(`timeout ${method}`));
    }, TIMEOUT_MS);
    pending.set(id, {
      resolve: (v) => {
        clearTimeout(t);
        resolve(v);
      },
      reject,
    });
  });
  proc.stdin.write(message + "\n");
  return p;
}

try {
  await rpc("initialize", {
    protocolVersion: "2024-11-05",
    capabilities: {},
    clientInfo: { name: "release-smoke", version: "1.0.0" },
  });

  const list = await rpc("tools/list", {});
  const names = (list.result?.tools ?? []).map((t) => t.name);
  assert.ok(names.includes("search_fabric_docs"));
  assert.ok(names.includes("convert_mapping"));
  assert.equal(names.length, 31);

  const fabric = await rpc("tools/call", {
    name: "search_fabric_docs",
    arguments: { query: "item", version: "1.20.1" },
  });
  const fabricBody = JSON.parse(fabric.result.content[0].text);
  assert.ok((fabricBody.total ?? fabricBody.results?.length ?? 0) > 0);

  const yarn = await rpc("tools/call", {
    name: "convert_mapping",
    arguments: {
      from: "yarn",
      to: "mojang",
      memberName: "net/minecraft/block/Block",
      version: "1.20.1",
    },
  });
  const yarnBody = JSON.parse(yarn.result.content[0].text);
  assert.equal(yarnBody.found, true);
  assert.ok(!(yarnBody.notes ?? []).join(" ").includes("JSON.parse"));

  const rss = process.memoryUsage().rss;
  console.log(JSON.stringify({ ok: true, tools: names.length, rssMb: Math.round(rss / 1024 / 1024), staging }, null, 2));
} finally {
  try {
    proc.kill("SIGKILL");
  } catch {
    /* ignore */
  }
  await new Promise((r) => setTimeout(r, 500));
  if (process.env.MC_SKILL_SMOKE_KEEP !== "1") {
    try {
      rmSync(staging, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
    } catch (err) {
      console.error("cleanup warning:", err.message);
    }
  }
}

