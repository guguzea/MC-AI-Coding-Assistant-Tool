#!/usr/bin/env node
/**
 * assert-playtest-mod-sync.mjs —— `mcp-server/playtest-mod/` 可读 `.java` 单一真值源 ↔
 * 派生文件 `mcp-server/src/generators/playtest-mod-{core,adapters}.ts` 防漂移门禁。
 *
 * 为什么必须有：
 *   `playtest-mod/` 是给人与工具直接读改的可读 Java 树，而 `src/generators/playtest-mod-*.ts`
 *   是打包进 `dist/` 与 npm 发布物的派生字面量模块。没有门禁守着，只要有人单边改了 `.java`
 *   忘了跑 `npm run sync:playtest-mod -- --write`，或者直接手改了 `.ts`，两者立刻漂移。
 *
 * 只读零写盘；自带纯内存 `--selftest`（正控 + 投毒）。
 *
 * 用法：
 *   node scripts/assert-playtest-mod-sync.mjs            # 真跑
 *   node scripts/assert-playtest-mod-sync.mjs --selftest # 判据活性自证
 */
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  ADAPTERS_TS_PATH,
  CORE_TS_PATH,
  PLAYTEST_MOD_ROOT,
  loadPlaytestModTree,
  renderAdaptersTs,
  renderCoreTs,
} from "./sync-playtest-mod.mjs";

/**
 * 纯函数判据：校验可读源树完整性，以及派生 `.ts` 与渲染结果是否逐字节一致。
 * @param {ReturnType<typeof loadPlaytestModTree>} tree
 * @param {string | null} coreTsText
 * @param {string | null} adaptersTsText
 * @returns {string[]} 问题清单（空数组 = 通过）
 */
export function evaluatePlaytestModSync(tree, coreTsText, adaptersTsText) {
  const problems = [];

  if (!tree.coreFiles || tree.coreFiles.length === 0) {
    problems.push("[EMPTY_CORE_TREE] playtest-mod/core/ 下未发现任何 .java 文件");
  }
  const coreDeclared = new Set((tree.coreFiles ?? []).map((f) => `com/bandd/playtest/core/${f.className}`));
  for (const rel of tree.allCoreJavaOnDisk ?? []) {
    if (!coreDeclared.has(rel)) {
      problems.push(`[ORPHAN_CORE_FILE] core/ 下存在包外孤儿 .java：${rel}`);
    }
  }

  if (!tree.manifestPresent || !tree.adapters || tree.adapters.length === 0) {
    problems.push("[EMPTY_ADAPTERS_MANIFEST] playtest-mod/adapters/manifest.json 缺失或为空");
  }
  for (const miss of tree.missingAdapterFiles ?? []) {
    problems.push(`[MISSING_ADAPTER_FILE] manifest.json 声明的适配层文件不存在：${miss}`);
  }
  for (const orphan of tree.orphanAdapterFiles ?? []) {
    problems.push(`[ORPHAN_ADAPTER_FILE] adapters/ 下存在未登记在 manifest.json 的孤儿 .java：${orphan}`);
  }
  if (!tree.testFiles || tree.testFiles.length === 0) {
    problems.push("[EMPTY_TESTS_TREE] playtest-mod/tests/ 下未发现任何纯 JDK 测试 .java 文件");
  }

  // 逐字节漂移比对（只有当源树完整时才做，避免缺文件时同时吐出冗余漂移噪音）
  if (tree.coreFiles && tree.coreFiles.length > 0) {
    const expectedCore = renderCoreTs(tree.coreFiles);
    if (coreTsText == null) {
      problems.push("[MISSING_CORE_TS] 派生文件 src/generators/playtest-mod-core.ts 不存在");
    } else if (coreTsText !== expectedCore) {
      problems.push(
        `[CORE_TS_DRIFT] src/generators/playtest-mod-core.ts 与 playtest-mod/core/ 不一致` +
          `（disk=${coreTsText.length} chars, expected=${expectedCore.length} chars）；` +
          `请执行 npm run sync:playtest-mod -- --write`,
      );
    }
  }

  if (tree.manifestPresent && tree.adapters && tree.adapters.length > 0 && (tree.missingAdapterFiles ?? []).length === 0) {
    const expectedAdapters = renderAdaptersTs(tree.adapters);
    if (adaptersTsText == null) {
      problems.push("[MISSING_ADAPTERS_TS] 派生文件 src/generators/playtest-mod-adapters.ts 不存在");
    } else if (adaptersTsText !== expectedAdapters) {
      problems.push(
        `[ADAPTERS_TS_DRIFT] src/generators/playtest-mod-adapters.ts 与 playtest-mod/adapters/ 不一致` +
          `（disk=${adaptersTsText.length} chars, expected=${expectedAdapters.length} chars）；` +
          `请执行 npm run sync:playtest-mod -- --write`,
      );
    }
  }

  return problems;
}

function runGate() {
  const tree = loadPlaytestModTree(PLAYTEST_MOD_ROOT);
  const coreTs = existsSync(CORE_TS_PATH) ? readFileSync(CORE_TS_PATH, "utf8") : null;
  const adaptersTs = existsSync(ADAPTERS_TS_PATH) ? readFileSync(ADAPTERS_TS_PATH, "utf8") : null;
  const problems = evaluatePlaytestModSync(tree, coreTs, adaptersTs);

  if (problems.length > 0) {
    console.error("assert-playtest-mod-sync: 检测到单源 ↔ 派生 TS 漂移或树结构异常：");
    for (const p of problems) console.error(`  - ${p}`);
    process.exit(1);
  }

  const totalAdapterFiles = tree.adapters.reduce((n, a) => n + Object.keys(a.files).length, 0);
  console.log(
    `assert-playtest-mod-sync: ok（core=${tree.coreFiles.length} 类 · adapters=${tree.adapters.length} 档/${totalAdapterFiles} 件 · tests=${tree.testFiles.length} 件 · 逐字节一致）`,
  );
}

function runSelftest() {
  const baseTree = {
    coreFiles: [
      {
        className: "DummyCore.java",
        key: "playtest/core/com/bandd/playtest/core/DummyCore.java",
        content: "package com.bandd.playtest.core;\npublic final class DummyCore {}\n",
      },
    ],
    allCoreJavaOnDisk: ["com/bandd/playtest/core/DummyCore.java"],
    manifestPresent: true,
    adapters: [
      {
        platform: "neoforge",
        version: "1.20.1",
        note: "fixture",
        files: {
          "com/bandd/playtest/PlaytestMod.java": "package com.bandd.playtest;\npublic final class PlaytestMod {}\n",
        },
      },
    ],
    missingAdapterFiles: [],
    orphanAdapterFiles: [],
    testFiles: ["CoreTest.java"],
  };
  const cleanCoreTs = renderCoreTs(baseTree.coreFiles);
  const cleanAdaptersTs = renderAdaptersTs(baseTree.adapters);

  let posCount = 0;
  let poisonCount = 0;

  // 正控：完全一致的树 + 派生文件 ⇒ 0 问题
  const ok = evaluatePlaytestModSync(baseTree, cleanCoreTs, cleanAdaptersTs);
  assert.deepEqual(ok, [], `正控应为 0 问题，实得：${ok.join("; ")}`);
  posCount++;

  // 投毒表
  const poisons = [
    [
      "core .java 修改未重同步 ⇒ CORE_TS_DRIFT",
      evaluatePlaytestModSync(
        {
          ...baseTree,
          coreFiles: [{ ...baseTree.coreFiles[0], content: baseTree.coreFiles[0].content + "// drifted\n" }],
        },
        cleanCoreTs,
        cleanAdaptersTs,
      ),
      /\[CORE_TS_DRIFT\]/,
    ],
    [
      "adapter .java 修改未重同步 ⇒ ADAPTERS_TS_DRIFT",
      evaluatePlaytestModSync(
        {
          ...baseTree,
          adapters: [
            {
              ...baseTree.adapters[0],
              files: { "com/bandd/playtest/PlaytestMod.java": "// mutated adapter\n" },
            },
          ],
        },
        cleanCoreTs,
        cleanAdaptersTs,
      ),
      /\[ADAPTERS_TS_DRIFT\]/,
    ],
    [
      "adapters/ 下出现未登记孤儿 .java ⇒ ORPHAN_ADAPTER_FILE",
      evaluatePlaytestModSync(
        { ...baseTree, orphanAdapterFiles: ["neoforge-1.20.1/com/bandd/playtest/Ghost.java"] },
        cleanCoreTs,
        cleanAdaptersTs,
      ),
      /\[ORPHAN_ADAPTER_FILE\]/,
    ],
    [
      "manifest.json 声明文件在盘上缺失 ⇒ MISSING_ADAPTER_FILE",
      evaluatePlaytestModSync(
        { ...baseTree, missingAdapterFiles: ["neoforge-1.20.1/com/bandd/playtest/Missing.java"] },
        cleanCoreTs,
        cleanAdaptersTs,
      ),
      /\[MISSING_ADAPTER_FILE\]/,
    ],
    [
      "core 目录被清空 ⇒ EMPTY_CORE_TREE",
      evaluatePlaytestModSync(
        { ...baseTree, coreFiles: [], allCoreJavaOnDisk: [] },
        cleanCoreTs,
        cleanAdaptersTs,
      ),
      /\[EMPTY_CORE_TREE\]/,
    ],
    [
      "tests 目录被清空 ⇒ EMPTY_TESTS_TREE",
      evaluatePlaytestModSync(
        { ...baseTree, testFiles: [] },
        cleanCoreTs,
        cleanAdaptersTs,
      ),
      /\[EMPTY_TESTS_TREE\]/,
    ],
    [
      "派生 adapters.ts 被误删 ⇒ MISSING_ADAPTERS_TS",
      evaluatePlaytestModSync(baseTree, cleanCoreTs, null),
      /\[MISSING_ADAPTERS_TS\]/,
    ],
  ];

  for (const [label, got, anchor] of poisons) {
    assert.ok(got.length > 0, `投毒「${label}」应判红，实际 0 条`);
    assert.ok(
      got.some((m) => anchor.test(m)),
      `投毒「${label}」未命中锚点 ${anchor}，实得：\n  ${got.join("\n  ")}`,
    );
    poisonCount++;
  }

  const total = posCount + poisonCount;
  console.log(`assert-playtest-mod-sync: 自检 ${total}/${total} 通过（${posCount} 正控 + ${poisonCount} 投毒）`);
}

const isCli = process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url));
if (isCli) {
  if (process.argv.includes("--selftest")) runSelftest();
  else runGate();
}
