#!/usr/bin/env node
/**
 * sync-playtest-mod.mjs —— 从可读 `.java` 单一真值源（`mcp-server/playtest-mod/`）
 * 确定性派生 `mcp-server/src/generators/playtest-mod-core.ts` 与
 * `mcp-server/src/generators/playtest-mod-adapters.ts`。
 *
 * 默认 dry-run（走 `scripts/_lib/write-guard.mjs` 的 `emit`）；显式 `--write` 才落盘。
 * 纯函数 `loadPlaytestModTree` / `renderCoreTs` / `renderAdaptersTs` 同源导出给防漂移门
 * `assert-playtest-mod-sync.mjs`，保证「生成」与「验漂移」绝不分叉。
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { emit, logDryRunBanner, wantWrite } from "../../scripts/_lib/write-guard.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
export const MCP_ROOT = resolve(HERE, "..");
export const PLAYTEST_MOD_ROOT = join(MCP_ROOT, "playtest-mod");
export const CORE_TS_PATH = join(MCP_ROOT, "src", "generators", "playtest-mod-core.ts");
export const ADAPTERS_TS_PATH = join(MCP_ROOT, "src", "generators", "playtest-mod-adapters.ts");

function walkJavaFiles(dir, baseDir = dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir).sort()) {
    const abs = join(dir, name);
    const st = statSync(abs);
    if (st.isDirectory()) {
      walkJavaFiles(abs, baseDir, out);
    } else if (name.endsWith(".java")) {
      out.push(relative(baseDir, abs).split(sep).join("/"));
    }
  }
  return out;
}

/**
 * 读取可读 `.java` 单一真值源树。
 * @param {string} root 指向 `playtest-mod` 根目录
 */
export function loadPlaytestModTree(root = PLAYTEST_MOD_ROOT) {
  const coreBase = join(root, "core");
  const corePkgDir = join(coreBase, "com", "bandd", "playtest", "core");
  const coreFiles = [];
  if (existsSync(corePkgDir)) {
    for (const name of readdirSync(corePkgDir).filter((n) => n.endsWith(".java")).sort()) {
      const abs = join(corePkgDir, name);
      coreFiles.push({
        className: name,
        key: `playtest/core/com/bandd/playtest/core/${name}`,
        content: readFileSync(abs, "utf8"),
      });
    }
  }
  const allCoreJavaOnDisk = walkJavaFiles(coreBase);

  const adaptersBase = join(root, "adapters");
  const manifestPath = join(adaptersBase, "manifest.json");
  const manifestRaw = existsSync(manifestPath)
    ? JSON.parse(readFileSync(manifestPath, "utf8"))
    : null;

  const adapters = [];
  const declaredAdapterPaths = new Set();
  const missingAdapterFiles = [];

  if (Array.isArray(manifestRaw)) {
    for (const entry of manifestRaw) {
      const dirKey = `${entry.platform}-${entry.version}`;
      const files = {};
      for (const rel of entry.files ?? []) {
        const diskRel = `${dirKey}/${rel}`;
        declaredAdapterPaths.add(diskRel);
        const abs = join(adaptersBase, dirKey, ...rel.split("/"));
        if (!existsSync(abs)) {
          missingAdapterFiles.push(diskRel);
          continue;
        }
        files[rel] = readFileSync(abs, "utf8");
      }
      adapters.push({
        platform: entry.platform,
        version: entry.version,
        note: entry.note ?? "",
        files,
      });
    }
  }

  const allAdapterJavaOnDisk = walkJavaFiles(adaptersBase);
  const orphanAdapterFiles = allAdapterJavaOnDisk.filter((p) => !declaredAdapterPaths.has(p));

  const testsDir = join(root, "tests", "src", "com", "bandd", "playtest", "test");
  const testFiles = walkJavaFiles(testsDir);

  return {
    coreFiles,
    allCoreJavaOnDisk,
    manifestPresent: manifestRaw !== null,
    adapters,
    missingAdapterFiles,
    orphanAdapterFiles,
    testFiles,
  };
}

/** 确定性渲染 `src/generators/playtest-mod-core.ts`。 */
export function renderCoreTs(coreFiles) {
  const sorted = [...coreFiles].sort((a, b) => (a.key < b.key ? -1 : a.key > b.key ? 1 : 0));
  const lines = [
    "/**",
    " * bandd_playtest 二合一模组的**版本无关 core**。",
    " *",
    " * @generated 由 `mcp-server/scripts/sync-playtest-mod.mjs` 从可读单源 `mcp-server/playtest-mod/core/` 自动派生。",
    " * **请勿直接手改本文件**：改 `.java` 源码后执行 `cd mcp-server && npm run sync:playtest-mod -- --write`。",
    " * 防漂移门禁：`mcp-server/scripts/assert-playtest-mod-sync.mjs`。",
    " *",
    " * 架构：`HttpApi`（HTTP 线程**只入队**，绝不碰 MC）→ `ActionQueue` → `PlaytestCore.onTick()`（客户端 tick 线程）",
    " * → `GameBridge`（**唯一**与平台相关的接口）→ 各档适配层。外加 `EvidenceWriter`（state.json/exit-code.txt/qa.log/rounds.jsonl）",
    " * 与 `Arbitration`（AUTO/HOTKEY/DUAL）。",
    " *",
    " * ⚠ **真机教训（勿重踩）**：",
    " *   - `GameBridge.unavailableActions()` 的 default 返回**空**会让 `/status` 谎报能力 ⇒ 各档必须**按实际做得到的列白名单**；",
    " *   - **reobf 不改反射字符串** ⇒ core/适配层**禁止**反射访问 MC（生成器已有 `assertNoReflectiveMcAccess` 守）；",
    " *   - HTTP 端口是**动态**的（`HttpApi.start()` 从首选端口往后试 20 个）⇒ 消费方必须实时解析（读 qa.log 的",
    " *     `[QA] http listening on 127.0.0.1:<port>` 或探活）。",
    " */",
    "export const PLAYTEST_MOD_CORE_SOURCES: Readonly<Record<string, string>> = {",
  ];
  for (const f of sorted) {
    lines.push(`  ${JSON.stringify(f.key)}: ${JSON.stringify(f.content)},`);
  }
  lines.push("};");
  lines.push("");
  const classes = sorted.map((f) => f.className);
  lines.push(`export const PLAYTEST_MOD_CORE_CLASSES: readonly string[] = ${JSON.stringify(classes)};`);
  lines.push("");
  return lines.join("\n");
}

/** 确定性渲染 `src/generators/playtest-mod-adapters.ts`。 */
export function renderAdaptersTs(adapters) {
  const lines = [
    "/**",
    " * bandd_playtest 二合一模组的**逐档适配层**。",
    " *",
    " * @generated 由 `mcp-server/scripts/sync-playtest-mod.mjs` 从可读单源 `mcp-server/playtest-mod/adapters/` 自动派生。",
    " * **请勿直接手改本文件**：改 `.java` 源码或 `adapters/manifest.json` 后执行 `cd mcp-server && npm run sync:playtest-mod -- --write`。",
    " * 防漂移门禁：`mcp-server/scripts/assert-playtest-mod-sync.mjs`。",
    " *",
    " * ⚠ **真机验证分级以 `playtest-driver.ts` 的 `PLAYTEST_MOD_VERIFIED_TIER` 与 `PLAYTEST_MOD_GENERATOR_READY` 为准**：",
    " * 仅文本对齐的档位不代表经过编译或真机验证。",
    " * ⚠ **禁止反射**：reobf **不改反射字符串** ⇒ 反射找 MC 字段在生产环境必然失败。",
    " */",
    "export interface PlaytestModAdapterSources {",
    "  /** 平台 id */",
    "  readonly platform: string;",
    "  /** 精确 MC 版本 */",
    "  readonly version: string;",
    "  /** 相对输出根的路径 → 源码 */",
    "  readonly files: Readonly<Record<string, string>>;",
    "  /** 一句话：这一档的路线或真值目录说明（写进生成物的头注释）*/",
    "  readonly note: string;",
    "}",
    "",
    "export const PLAYTEST_MOD_ADAPTERS: readonly PlaytestModAdapterSources[] = [",
  ];
  for (const a of adapters) {
    lines.push("  {");
    lines.push(`    platform: ${JSON.stringify(a.platform)},`);
    lines.push(`    version: ${JSON.stringify(a.version)},`);
    lines.push(`    note: ${JSON.stringify(a.note ?? "")},`);
    lines.push("    files: {");
    for (const [rel, content] of Object.entries(a.files)) {
      lines.push(`      ${JSON.stringify(rel)}: ${JSON.stringify(content)},`);
    }
    lines.push("    },");
    lines.push("  },");
  }
  lines.push("];");
  lines.push("");
  return lines.join("\n");
}

function main() {
  if (!wantWrite()) logDryRunBanner("sync-playtest-mod");
  const tree = loadPlaytestModTree(PLAYTEST_MOD_ROOT);
  if (tree.coreFiles.length === 0) {
    console.error("sync-playtest-mod: core 目录下未找到任何 .java 文件");
    process.exit(1);
  }
  if (!tree.manifestPresent || tree.adapters.length === 0) {
    console.error("sync-playtest-mod: adapters/manifest.json 缺失或为空");
    process.exit(1);
  }
  if (tree.missingAdapterFiles.length > 0) {
    console.error(`sync-playtest-mod: manifest 声明的文件在盘上缺失（${tree.missingAdapterFiles.length} 件）：\n  ` + tree.missingAdapterFiles.join("\n  "));
    process.exit(1);
  }
  if (tree.orphanAdapterFiles.length > 0) {
    console.error(`sync-playtest-mod: adapters/ 下存在未登记在 manifest.json 的孤儿 .java（${tree.orphanAdapterFiles.length} 件）：\n  ` + tree.orphanAdapterFiles.join("\n  "));
    process.exit(1);
  }

  const coreTs = renderCoreTs(tree.coreFiles);
  const adaptersTs = renderAdaptersTs(tree.adapters);

  emit(CORE_TS_PATH, coreTs);
  emit(ADAPTERS_TS_PATH, adaptersTs);

  const totalAdapterFiles = tree.adapters.reduce((n, a) => n + Object.keys(a.files).length, 0);
  console.log(
    `[sync-playtest-mod] core=${tree.coreFiles.length} 类 · adapters=${tree.adapters.length} 档/${totalAdapterFiles} 件 · tests=${tree.testFiles.length} 件` +
      ` · core.ts=${Buffer.byteLength(coreTs, "utf8")}B · adapters.ts=${Buffer.byteLength(adaptersTs, "utf8")}B`,
  );
}

const isCli = process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url));
if (isCli) main();
