#!/usr/bin/env node
/**
 * assert-link-forge-1.20.4.mjs
 *
 * 回归断言：forge_1.20.4 的 forge-docs 数据里不得残留 1.20.1 的版本痕迹。
 *
 * link-forge-1.20.4-from-1.20.1.js 早期版本只做纯拷贝，会把 SRC 的
 * `1.20.1/...` id、`version: "1.20.1"`、`/en/1.20.1/` url 原样带进 DEST 目录，
 * 造成「目录名是 1.20.4、内容却是 1.20.1」的版本归属污染。
 *
 * 本模块被两处使用，**缺一不可**：
 *   1. `link-forge-1.20.4-from-1.20.1.js` 落盘后自检
 *   2. `test-scripts.mjs` 末尾 `await import()` 挂载（该文件已在 npm test 链内）
 *      —— 独立脚本不会被 package.json 的逐文件枚举测试链执行，必须挂载。
 */

import { existsSync, readFileSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DEST_VERSION = "1.20.4";
const SRC_VERSION = "1.20.1";
const INDEX_FILES = ["index-l0.json", "index-l1.json", "index-l2.json"];

export const DEFAULT_DEST_DIR = join(
  __dirname,
  "..",
  "..",
  "data",
  `forge_${DEST_VERSION}`,
  "forge-docs",
  DEST_VERSION,
);

/**
 * @param {string} [destDir] 待校验目录，默认指向仓库真实数据目录。
 * @throws {Error} 发现版本污染时抛出。
 */
export function assertLinkForge1204(destDir = DEFAULT_DEST_DIR) {
  if (!existsSync(destDir)) {
    throw new Error(`目录不存在（未生成 1.20.4 数据属正常，跳过）：${destDir}`);
  }

  const problems = [];

  for (const name of INDEX_FILES) {
    const p = join(destDir, name);
    if (!existsSync(p)) continue;
    let entries;
    try {
      entries = JSON.parse(readFileSync(p, "utf8"));
    } catch (e) {
      problems.push(`${name} JSON 解析失败: ${e.message}`);
      continue;
    }
    if (!Array.isArray(entries)) {
      problems.push(`${name} 顶层不是数组`);
      continue;
    }
    for (const [i, e] of entries.entries()) {
      if (typeof e?.id === "string" && e.id.startsWith(`${SRC_VERSION}/`)) {
        problems.push(`${name}[${i}].id 仍带 ${SRC_VERSION} 前缀: ${e.id}`);
      }
      if (e?.version === SRC_VERSION) {
        problems.push(`${name}[${i}].version 仍为 ${SRC_VERSION}`);
      }
      if (typeof e?.url === "string" && e.url.includes(`/en/${SRC_VERSION}/`)) {
        problems.push(`${name}[${i}].url 仍指向 ${SRC_VERSION}: ${e.url}`);
      }
    }
  }

  // processed/*.md 若有 frontmatter，其 version 也必须为 DEST_VERSION
  const pd = join(destDir, "processed");
  if (existsSync(pd)) {
    for (const name of readdirSync(pd)) {
      if (!name.endsWith(".md")) continue;
      const txt = readFileSync(join(pd, name), "utf8");
      const m = txt.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
      if (!m) continue;
      const vline = m[1].split("\n").find((l) => /^\s*version\s*:/.test(l));
      if (vline && vline.includes(SRC_VERSION)) {
        problems.push(`processed/${name} frontmatter.version 仍为 ${SRC_VERSION}`);
      }
    }
  }

  if (problems.length > 0) {
    throw new Error(
      `forge_${DEST_VERSION} 数据残留 ${SRC_VERSION} 版本痕迹（${problems.length} 处）：\n` +
        problems.slice(0, 10).map((p) => `  - ${p}`).join("\n") +
        (problems.length > 10 ? `\n  ... 另有 ${problems.length - 10} 处` : ""),
    );
  }
  return true;
}

// 允许 `node scripts/assert-link-forge-1.20.4.mjs` 直接运行
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  try {
    assertLinkForge1204();
    console.log(`✅ forge_${DEST_VERSION} 数据无 ${SRC_VERSION} 版本残留`);
  } catch (e) {
    console.error(`❌ ${e.message}`);
    process.exit(1);
  }
}
