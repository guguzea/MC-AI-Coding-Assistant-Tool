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
  readFileSync,
  mkdirSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { copyTree } from "../../scripts/_lib/copy-tree.mjs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = join(__dirname, "..");
const DATA = process.env.MC_SKILL_DATA ?? join(REPO, "..", "data");
const TIMEOUT_MS = Number(process.env.MCP_TIMEOUT_MS ?? 60000);

/* ------------------------------------------------------------------
 * 工具数「分解腿」（第 29 轮，2026-09-24）：文档印的分解 vs 代码实算。
 * 原来本脚本只把两半相加后与 tools/list 比（合计对得上就算过），于是
 * 「47 + 35」（实为 46 + 36）这种**两半都错但合计正确**的写法能长期在盘。
 * 本腿把 AUTO_SETUP.md / mcp-server/README.md 里印在括号中的那一对数
 * **现扫**出来，与代码侧实算逐一对齐 —— 不硬钉 46/36 成常量（硬钉会让
 * 「合法地往 tool-registry.ts 上方加一个工具」变假红）。
 * 采集器解出 0 个数 = 正则没命中 = 判红（COLLECTOR_RETURNED_ZERO），
 * 不许空跑变绿。
 * ------------------------------------------------------------------ */
const TOOL_PAIR_RE = /tool-registry\.ts[`\s]*\*{0,2}(\d+)\*{0,2}\s*\+\s*[^\n]{0,40}?register\.ts[`\s]*\*{0,2}(\d+)\*{0,2}/g;

function collectToolPairs(text) {
  return [...text.matchAll(TOOL_PAIR_RE)].map((m) => [Number(m[1]), Number(m[2])]);
}

function checkToolSplit({ registrySrc, waveSrc, docs }) {
  const code = {
    registry: [...registrySrc.matchAll(/\.registerTool\(/g)].length,
    wave: [...waveSrc.matchAll(/server\.registerTool\(/g)].length,
  };
  const problems = [];
  let collected = 0;
  if (code.registry === 0 || code.wave === 0) {
    problems.push(`COLLECTOR_RETURNED_ZERO: 代码侧某一腿解出 0（registry=${code.registry} wave=${code.wave}），采集面失效`);
  }
  for (const d of docs) {
    const pairs = collectToolPairs(d.text);
    if (pairs.length === 0) {
      problems.push(`COLLECTOR_RETURNED_ZERO: ${d.file} 未解出任何「(registry + wave)」分解数`);
      continue;
    }
    for (const [a, b] of pairs) {
      collected++;
      if (a !== code.registry || b !== code.wave) {
        problems.push(`${d.file}: 文档写 ${a} + ${b}，代码实算 ${code.registry} + ${code.wave}`);
      }
      if (a + b !== code.registry + code.wave) {
        problems.push(`${d.file}: 文档合计 ${a + b} ≠ 代码合计 ${code.registry + code.wave}`);
      }
    }
  }
  if (collected === 0) problems.push("COLLECTOR_RETURNED_ZERO: 全部文档腿解出 0 个数");
  return { code, collected, problems };
}

function toolSplitSelftest() {
  const reg = "\n".repeat(0) + Array.from({ length: 46 }, () => "server.registerTool(").join("\n");
  const wav = Array.from({ length: 36 }, () => "server.registerTool(").join("\n");
  const docs = (a, b) => [{ file: "AUTO_SETUP.md", text: `数量 **${a + b}**（\`tool-registry.ts\` ${a} + \`wave/register.ts\` ${b}）` }];
  const cases = [
    // [名称, got=「该腿是否判绿」, expectGreen]；got===expectGreen 才算 selftest 通过
    ["正对照：文档印 46 + 36", checkToolSplit({ registrySrc: reg, waveSrc: wav, docs: docs(46, 36) }).problems.length === 0, true],
    ["投毒：文档印 47 + 35（合计仍 82）", checkToolSplit({ registrySrc: reg, waveSrc: wav, docs: docs(47, 35) }).problems.length === 0, false],
    ["投毒：文档印 45 + 37（合计仍 82）", checkToolSplit({ registrySrc: reg, waveSrc: wav, docs: docs(45, 37) }).problems.length === 0, false],
    ["投毒：文档改写成散文 ⇒ 采集器 0 个数", (() => { const r = checkToolSplit({ registrySrc: reg, waveSrc: wav, docs: [{ file: "X.md", text: "共 82 个工具" }] }); return !(r.problems.length > 0 && r.problems.some((p) => p.startsWith("COLLECTOR_RETURNED_ZERO"))); })(), false],
    ["投毒：代码侧某一腿空 ⇒ COLLECTOR_RETURNED_ZERO", (() => { const r = checkToolSplit({ registrySrc: reg, waveSrc: "", docs: docs(46, 36) }); return !(r.problems.length > 0 && r.problems.some((p) => p.startsWith("COLLECTOR_RETURNED_ZERO"))); })(), false],
    ["正对照：仓库真文件 + 真文档（本轮实况）", (() => {
      const real = checkToolSplit({
        registrySrc: readFileSync(join(REPO, "src", "tool-registry.ts"), "utf8"),
        waveSrc: readFileSync(join(REPO, "src", "wave", "register.ts"), "utf8"),
        docs: [
          { file: "AUTO_SETUP.md", text: readFileSync(join(REPO, "..", "AUTO_SETUP.md"), "utf8") },
          { file: "mcp-server/README.md", text: readFileSync(join(REPO, "README.md"), "utf8") },
        ],
      });
      console.log(`  代码实算 ${real.code.registry} + ${real.code.wave} = ${real.code.registry + real.code.wave} / 文档腿 ${real.collected} 处 / problems=${real.problems.length}`);
      return real.problems.length === 0 && real.collected >= 2;
    })(), true],
  ];
  let bad = 0;
  for (const [name, got, expectGreen] of cases) {
    const ok = got === expectGreen;
    if (!ok) bad++;
    console.log(`[${ok ? "PASS" : "FAIL"}] selftest-tool-split · ${name} → ${expectGreen ? "应放行" : "应判红"}`);
  }
  console.log(bad === 0 ? "selftest-tool-split: 全部符合预期（投毒必红 + 正对照必绿）" : `selftest-tool-split: ${bad} 记不符预期`);
  return bad === 0 ? 0 : 1;
}

if (process.argv.includes("--selftest-tool-split")) {
  process.exit(toolSplitSelftest());
}


assert.ok(existsSync(join(REPO, "dist", "index.js")), "build first: npm run build");
assert.ok(existsSync(DATA), `data missing: ${DATA}`);

const staging = mkdtempSync(join(tmpdir(), "mc-skill-release-smoke-"));
const serverDir = join(staging, "mcp-server");
const dataDir = join(staging, "data");

mkdirSync(serverDir, { recursive: true });
copyTree(join(REPO, "dist"), join(serverDir, "dist"));
cpSync(join(REPO, "package.json"), join(serverDir, "package.json"));
cpSync(join(REPO, "package-lock.json"), join(serverDir, "package-lock.json"));
copyTree(join(REPO, "node_modules"), join(serverDir, "node_modules"));
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
  copyTree(DATA, dataDir);
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
  const tools = list.result?.tools ?? [];
  const names = tools.map((t) => t.name);
  assert.ok(names.includes("search_fabric_docs"));
  assert.ok(names.includes("convert_mapping"));
  assert.ok(names.includes("lookup_obfuscated"));
  assert.ok(names.includes("get_minecraft_source"));
  assert.ok(names.includes("validate_at"));
  assert.ok(names.includes("validate_aw"));
  assert.ok(names.includes("analyze_mod_jar"));
  const registrySrc = readFileSync(join(REPO, "src", "tool-registry.ts"), "utf8");
  const waveSrc = readFileSync(join(REPO, "src", "wave", "register.ts"), "utf8");
  const expectedToolCount =
    [...registrySrc.matchAll(/\.registerTool\(/g)].length +
    [...waveSrc.matchAll(/server\.registerTool\(/g)].length;
  assert.equal(names.length, expectedToolCount);

  // 分解腿：两半各自与文档印数对齐（合计相等但两半写反/写旧也要红）
  const splitCheck = checkToolSplit({
    registrySrc,
    waveSrc,
    docs: [
      { file: "AUTO_SETUP.md", text: readFileSync(join(REPO, "..", "AUTO_SETUP.md"), "utf8") },
      { file: "mcp-server/README.md", text: readFileSync(join(REPO, "README.md"), "utf8") },
    ],
  });
  assert.equal(
    splitCheck.problems.length,
    0,
    `tool split 文档↔代码不一致：\n${splitCheck.problems.join("\n")}`,
  );
  assert.ok(splitCheck.collected >= 2, `tool split 采集面 <2 处（实得 ${splitCheck.collected}）`);
  console.log(`[smoke] tool split: 代码 ${splitCheck.code.registry}+${splitCheck.code.wave}=${splitCheck.code.registry + splitCheck.code.wave} · 文档 ${splitCheck.collected} 处逐一对齐`);

  assert.ok(names.includes("download_official_mdk"));

  const convertSchema = tools.find((t) => t.name === "convert_mapping")?.inputSchema;
  const fromEnum = convertSchema?.properties?.from?.enum ?? convertSchema?.properties?.from?.anyOf;
  const enumVals = Array.isArray(fromEnum)
    ? fromEnum.flatMap((x) => (typeof x === "string" ? [x] : x?.enum ?? []))
    : convertSchema?.properties?.from?.enum;
  assert.ok(
    Array.isArray(enumVals) && enumVals.includes("obfuscated") && enumVals.includes("intermediary"),
    "convert_mapping schema must expose obfuscated/intermediary",
  );

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

  const obf = await rpc("tools/call", {
    name: "convert_mapping",
    arguments: {
      from: "intermediary",
      to: "obfuscated",
      memberName: "method_6032",
      version: "1.20.1",
    },
  });
  const obfBody = JSON.parse(obf.result.content[0].text);
  assert.equal(obfBody.found, true);
  assert.equal(obfBody.converted, "er");

  const lookup = await rpc("tools/call", {
    name: "lookup_obfuscated",
    arguments: { name: "method_6032", version: "1.20.1" },
  });
  const lookupBody = JSON.parse(lookup.result.content[0].text);
  assert.equal(lookupBody.found, true);

  const atMiss = await rpc("tools/call", {
    name: "validate_at",
    arguments: {
      atContent: "public net.minecraft.world.entity.LivingEntity getHealth()F",
      version: "1.20.1",
    },
  });
  const atBody = JSON.parse(atMiss.result.content[0].text);
  assert.ok(
    atBody.action?.code === "CACHE_MISS" || atBody.found === false || Array.isArray(atBody.errors),
    "validate_at should return CACHE_MISS or structured result",
  );

  const analyzeBad = await rpc("tools/call", {
    name: "analyze_mod_jar",
    arguments: { jarPath: "relative/not-absolute.jar" },
  });
  const analyzeBody = JSON.parse(analyzeBad.result.content[0].text);
  assert.equal(analyzeBody.found, false);

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

