/**
 * 失败信道端到端矩阵（2026-10-30）：`isToolFailure` 判据 + 真实 CLI 出口。
 *
 * 合同（三档，互不混读）：
 *  - 传输层失败：`isError:true`（本仓只有 1 处）⇒ exit 1。
 *  - 工具失败：`ok:false` / `passed:false` / `valid:false`（无 ok）/ `found:false` + 致命码
 *    （action.code / 顶层 code / error.code / 字符串 error）⇒ exit 1。
 *  - 正常答复：`found:false` 且无码，或命中 NON_FATAL 码（PLATFORM_SKIPPED / LOADER_API_NOT_INDEXED /
 *    FALLBACK_IDENTITY / AMBIGUOUS / CSV_NO_OWNER / PICK_PLATFORM），或 `ok:true + action=versionRequiredAction()`
 *    （partial success，读 `analysisComplete`），或 `status:"skipped"` ⇒ exit 0。
 *
 * 每个 fixture 都先在真 CLI 上取过证（见 DELIVERY_LOG 本轮节）；命中不了目标分支的写法不进本表。
 * 禁止为了让某条变绿去调参数：断言的是上面三档合同，不是某个工具的临时输出。
 */
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const REPO = join(dirname(fileURLToPath(import.meta.url)), "..");
const CLI = join(REPO, "mcp-server", "dist", "cli.js");
const ENV = {
  ...process.env,
  MC_SKILL_DATA: join(REPO, "data"),
  MC_SKILL_SKIP_DOWNLOAD: "1",
};

function run(args) {
  const r = spawnSync(process.execPath, [CLI, ...args], { encoding: "utf8", env: ENV, timeout: 120000 });
  const body = (r.stdout || "")
    .split("\n")
    .filter((l) => l.trim() !== "" && !/^running /.test(l))
    .join("\n");
  let json = null;
  try {
    json = JSON.parse(body);
  } catch {
    /* 非 JSON：断言消息里会带 stderr */
  }
  return { rc: r.status, json, payload: json?.result ?? json ?? {}, stderr: (r.stderr || "").trim() };
}

function expectResult(label, args, check) {
  const r = run(args);
  assert.ok(r.json, `${label}: stdout 不是 JSON（stderr=${r.stderr.slice(-300)}）`);
  check(r, `${label}: rc=${r.rc} payload=${JSON.stringify(r.payload).slice(0, 400)}`);
}

const tmp = mkdtempSync(join(tmpdir(), "mc-skill-failure-channel-"));
try {
  const emptyLogs = join(tmp, "logs");
  mkdirSync(emptyLogs, { recursive: true });
  const bedrock = join(tmp, "bedrock");
  mkdirSync(bedrock, { recursive: true });
  writeFileSync(
    join(bedrock, "manifest.json"),
    JSON.stringify({
      format_version: 2,
      header: {
        name: "fixture",
        uuid: "00000000-0000-0000-0000-000000000001",
        version: [1, 0, 0],
        min_engine_version: [1, 21, 0],
      },
      modules: [{ type: "data", uuid: "00000000-0000-0000-0000-000000000002", version: [1, 0, 0] }],
    }),
  );
  const rift = join(tmp, "rift");
  mkdirSync(rift, { recursive: true });
  // diagnose_gradle 只在 rift / liteloader / modloader / bedrock 形态走 skipped 分支
  writeFileSync(join(rift, "build.gradle"), "tweaker-client { }\n");
  const multi = join(tmp, "multi");
  mkdirSync(join(multi, "META-INF"), { recursive: true });
  writeFileSync(join(multi, "META-INF", "mods.toml"), 'modLoader="javafml"\nloaderVersion="[47,)"\n[[mods]]\nmodId="fixture"\n');
  writeFileSync(join(multi, "fabric.mod.json"), JSON.stringify({ schemaVersion: 1, id: "fixture", version: "1.0.0" }));
  // 多加载器分支要求「双元数据 + build.gradle 无任何 loader 插件」；带 forge 插件会走 primary=forge
  writeFileSync(join(multi, "build.gradle"), "// no loader plugin\n");

  const missingJar = join(tmp, "no-such-mod.jar");

  // ── 红：工具失败必须 exit 1 ───────────────────────────────────────────────
  expectResult("decompile_mod_jar 缺 jar", ["decompile_mod_jar", `--jarPath=${missingJar}`, "--version=1.20.1"], (r, msg) => {
    assert.equal(r.rc, 1, msg);
    assert.equal(r.json.success, false, msg);
    assert.equal(r.payload.found, false, msg);
    assert.equal(r.payload.error?.code, "NOT_FOUND", `${msg}（error 必须是带 code 的对象）`);
    assert.equal(r.payload.action?.code, "NOT_FOUND", msg);
  });
  expectResult("analyze_mod_jar 缺 jar", ["analyze_mod_jar", `--jarPath=${missingJar}`], (r, msg) => {
    assert.equal(r.rc, 1, msg);
    assert.equal(r.payload.found, false, msg);
    assert.equal(r.payload.action?.code, "NOT_FOUND", msg);
  });
  expectResult("get_minecraft_source 禁下载", ["get_minecraft_source", "--className=net.minecraft.world.item.Item", "--version=1.20.1"], (r, msg) => {
    assert.equal(r.rc, 1, msg);
    assert.equal(r.payload.found, false, msg);
    assert.equal(r.payload.action?.code, "DOWNLOAD_DISABLED", msg);
  });
  expectResult(
    "convert_mapping 超上限",
    ["convert_mapping", "--from=mojang", "--to=yarn", "--version=1.20.1", "--memberName=" + Array.from({ length: 51 }, (_, i) => `n${i}`).join(",")],
    (r, msg) => {
      assert.equal(r.rc, 1, msg);
      assert.equal(r.payload.found, false, msg);
      assert.equal(r.payload.action?.code, "INVALID_INPUT", msg);
    },
  );
  expectResult("search_mod_code 未反编译", ["search_mod_code", `--jarPath=${missingJar}`, "--query=Item"], (r, msg) => {
    assert.equal(r.rc, 1, msg);
    assert.equal(r.payload.action?.code, "NOT_FOUND", msg);
  });
  expectResult(
    "query_loader_api 未知平台",
    ["query_loader_api", "--platform=bogus", "--minecraftVersion=1.20.1", "--className=Item"],
    (r, msg) => {
      // 未知平台拼出 `1.20.1-bogus` 无命中 ⇒ 旧行为是 LOADER_API_NOT_INDEXED + exit 0（fail-open）
      assert.equal(r.rc, 1, msg);
      assert.equal(r.payload.found, false, msg);
      assert.equal(r.payload.action?.code, "INVALID_INPUT", msg);
      assert.equal(r.payload.code, "INVALID_INPUT", msg);
    },
  );
  expectResult(
    "validate_bp_json 非法配方",
    ["validate_bp_json", "--kind=recipe", '--json={"minecraft:recipe_shaped":{}}'],
    (r, msg) => {
      assert.equal(r.rc, 1, msg);
      assert.equal(r.payload.ok, false, msg);
      assert.ok(r.payload.errors.length >= 1, `${msg}（缺 format_version）`);
    },
  );
  expectResult("get_forge_doc_summary 伪 id", ["get_forge_doc_summary", "--id=no/such/page", "--version=1.20.1"], (r, msg) => {
    assert.equal(r.rc, 1, msg);
    assert.equal(r.payload.ok, false, msg);
    assert.equal(r.payload.error?.code, "DOC_NOT_FOUND", msg);
  });
  expectResult("query_registry 无命中", ["query_registry", "--query=zzzzzz", "--version=1.20.1"], (r, msg) => {
    // 「没找到」是失败：CLI 自动化靠退出码分流；该工具用 found:false + NOT_FOUND 表达
    assert.equal(r.rc, 1, msg);
    assert.equal(r.payload.found, false, msg);
    assert.equal(r.payload.action?.code, "NOT_FOUND", msg);
  });

  // ── 绿：正常答复 / 部分成功 / 跳过必须 exit 0 ─────────────────────────────
  expectResult("query_api 未命中", ["query_api", "--className=NoSuchClassXyz", "--version=1.20.1"], (r, msg) => {
    assert.equal(r.rc, 0, msg);
    assert.equal(r.payload.found, false, msg);
    assert.equal(r.payload.action, undefined, `${msg}（未命中不带 action 码）`);
  });
  expectResult(
    "search_loader_api 空命中",
    ["search_loader_api", "--platform=forge", "--minecraftVersion=1.20.1", "--query=zzzzzzNoSuchThing"],
    (r, msg) => {
      assert.equal(r.rc, 0, msg);
      assert.equal(r.payload.found, false, msg);
    },
  );
  expectResult("search_forge_docs 版本降级", ["search_forge_docs", "--query=networking", "--version=1.16.8"], (r, msg) => {
    assert.equal(r.rc, 0, msg);
    assert.equal(r.payload.ok, true, msg);
    assert.equal(r.payload.action?.code, "VERSION_FALLBACK", msg);
    assert.equal(r.payload.versionFallback, true, msg);
  });
  expectResult("validate_at 内容不合法", ["validate_at", "--version=1.20.1", "--atContent=public net.minecraft.world.item.Item"], (r, msg) => {
    // ok:true + valid:false = 工具跑成功、AT 内容不合法；不得抬成传输层故障
    assert.equal(r.rc, 0, msg);
    assert.equal(r.payload.ok, true, msg);
    assert.equal(r.payload.valid, false, msg);
  });
  expectResult(
    "validate_bp_json 合法配方",
    [
      "validate_bp_json",
      "--kind=recipe",
      '--json={"format_version":2,"minecraft:recipe_shaped":{"description":{"identifier":"demo:x"},"tags":["crafting_table"],"pattern":["#"],"key":{"#":{"item":"minecraft:stone"}},"result":{"item":"demo:x"}}}',
    ],
    (r, msg) => {
      assert.equal(r.rc, 0, msg);
      assert.equal(r.payload.ok, true, msg);
    },
  );
  expectResult(
    "convert_mapping allow_fallback",
    [
      "convert_mapping",
      "--from=mojang",
      "--to=yarn",
      "--version=1.20.1",
      "--memberName=zzzNotAMethod",
      "--ownerClass=net.minecraft.world.item.Item",
      "--allow_fallback=true",
    ],
    (r, msg) => {
      assert.equal(r.rc, 0, msg);
      assert.equal(r.payload.found, false, msg);
      assert.equal(r.payload.fallbackUsed, true, msg);
      assert.equal(r.payload.action?.code, "FALLBACK_IDENTITY", msg);
    },
  );
  expectResult(
    "query_loader_api 平台跳过",
    ["query_loader_api", "--platform=liteloader", "--minecraftVersion=1.10.2", "--className=Item"],
    (r, msg) => {
      assert.equal(r.rc, 0, msg);
      assert.equal(r.payload.found, false, msg);
      assert.equal(r.payload.action?.code, "PLATFORM_SKIPPED", msg);
    },
  );
  expectResult("inspect_runtime 缺版本", ["inspect_runtime", `--logsDir=${emptyLogs}`], (r, msg) => {
    assert.equal(r.rc, 0, msg);
    assert.equal(r.payload.ok, true, msg);
    assert.equal(r.payload.analysisComplete, false, msg);
    assert.equal(r.payload.action?.code, "VERSION_REQUIRED", msg);
  });
  expectResult(
    "crash_analyze 缺版本",
    ["crash_analyze", "--crashReport=---- Minecraft Crash Report ----\njava.lang.IllegalStateException\n"],
    (r, msg) => {
      assert.equal(r.rc, 0, msg);
      assert.equal(r.payload.ok, true, msg);
      assert.equal(r.payload.analysisComplete, false, msg);
      assert.equal(r.payload.action?.code, "VERSION_REQUIRED", msg);
    },
  );
  expectResult("validate_project 基岩跳过", ["validate_project", `--projectPath=${bedrock}`], (r, msg) => {
    assert.equal(r.rc, 0, msg);
    assert.equal(r.payload.ok, true, msg);
    assert.equal(r.payload.status, "skipped", msg);
    assert.equal(r.payload.passed, null, msg);
    assert.equal(r.payload.action?.code, "WRONG_TOOL", msg);
  });
  expectResult("diagnose_gradle Rift 跳过", ["diagnose_gradle", `--projectPath=${rift}`], (r, msg) => {
    assert.equal(r.rc, 0, msg);
    assert.equal(r.payload.ok, true, msg);
    assert.equal(r.payload.status, "skipped", msg);
    assert.equal(r.payload.passed, null, msg);
    assert.equal(r.payload.action?.code, "WRONG_TOOL", msg);
  });
  expectResult("detect_mod_project 多加载器", ["detect_mod_project", `--projectPath=${multi}`], (r, msg) => {
    assert.equal(r.rc, 0, msg);
    assert.equal(r.payload.ok, true, msg);
    assert.equal(r.payload.multiLoader, true, msg);
    assert.equal(r.payload.platform, "unknown", msg);
    assert.equal(r.payload.action?.code, "PICK_PLATFORM", msg);
  });
} finally {
  rmSync(tmp, { recursive: true, force: true });
}

console.log("test-cli-failure-channel: ok (红 9 / 绿 12)");
