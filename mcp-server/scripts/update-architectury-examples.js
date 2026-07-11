#!/usr/bin/env node
/**
 * update-architectury-examples.js
 * 从 GitHub 仓库提取最新的 @ExpectPlatform 用例，更新 architectury-patterns.json。
 *
 * 用法: node scripts/update-architectury-examples.js [--dry-run]
 *
 * 工作方式：
 * 1. 通过 GitHub REST API 查询真实项目的最新代码
 * 2. 提取 @ExpectPlatform 注解的常见模式
 * 3. 输出草稿 JSON 片段供人工 review
 * 4. --dry-run 模式仅输出，不写入文件
 *
 * 注意：
 * - 此脚本不会自动覆写 architectury-patterns.json
 * - 人工 review 是必要环节
 * - 需要 GITHUB_TOKEN 环境变量（可选，无则受速率限制）
 */

import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, "..", "data", "porting");
const PATTERNS_FILE = join(DATA_DIR, "architectury-patterns.json");
const OUTPUT_FILE = join(DATA_DIR, "architectury-patterns-draft.json");

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const DRY_RUN = process.argv.includes("--dry-run");

// ── GitHub API ──────────────────────────────────────────────────────────────

const headers = {
  Accept: "application/vnd.github.v3+json",
  "User-Agent": "MC_skill-update-script",
  ...(GITHUB_TOKEN ? { Authorization: `token ${GITHUB_TOKEN}` } : {}),
};

async function githubFetch(url) {
  const res = await fetch(url, { headers });
  if (!res.ok) {
    throw new Error(`GitHub API ${res.status}: ${await res.text()}`);
  }
  return res.json();
}

async function fetchRepoContents(owner, repo, path = "") {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
  return githubFetch(url);
}

async function fetchFileContent(owner, repo, path) {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
  const data = await githubFetch(url);
  // content is base64 encoded
  const content = Buffer.from(data.content, "base64").toString("utf-8");
  return content;
}

async function fetchFileContentRaw(owner, repo, path) {
  // Use raw.githubusercontent.com for direct access
  const url = `https://raw.githubusercontent.com/${owner}/${repo}/main/${path}`;
  const res = await fetch(url);
  if (!res.ok) {
    // Try master branch
    const masterUrl = `https://raw.githubusercontent.com/${owner}/${repo}/master/${path}`;
    const masterRes = await fetch(masterUrl);
    if (!masterRes.ok) return null;
    return masterRes.text();
  }
  return res.text();
}

// ── 模式提取 ────────────────────────────────────────────────────────────────

function extractExpectPlatformPatterns(code) {
  const patterns = [];

  // 匹配 @ExpectPlatform 注解
  const annotationRe = /@ExpectPlatform\s*\n(public\s+static\s+[\w<>,\s]+\s+(\w+)\s*\([^)]*\))/g;
  let match;
  while ((match = annotationRe.exec(code)) !== null) {
    patterns.push({
      type: "expectPlatform",
      methodSignature: match[1].trim(),
      methodName: match[2],
      lines: code.substring(Math.max(0, match.index - 3), match.index + match[0].length + 100),
    });
  }

  return patterns;
}

function extractMixinPatterns(code) {
  const patterns = [];

  // 匹配 mixin 配置
  const mixinGroupRe = /"mixins"\s*:\s*\[([\s\S]*?)\]/g;
  let match;
  while ((match = mixinGroupRe.exec(code)) !== null) {
    const inner = match[1];
    const fileMatches = inner.match(/"([^"]+\.json)"/g) || [];
    if (fileMatches.length > 0) {
      patterns.push({
        type: "mixinConfig",
        files: fileMatches.map(f => f.replace(/"/g, "")),
      });
    }
  }

  return patterns;
}

// ── 生成草稿 ────────────────────────────────────────────────────────────────

function buildPatternsDraft(patterns, sourceRepo) {
  const draft = {
    meta: {
      source: sourceRepo,
      extractedAt: new Date().toISOString(),
      note: "自动提取草稿，需人工 review 后合并到 architectury-patterns.json",
    },
    newPatterns: patterns.map(p => ({
      type: p.type,
      source: sourceRepo,
      pattern: p,
    })),
  };

  return draft;
}

// ── 主逻辑 ─────────────────────────────────────────────────────────────────

async function main() {
  console.log("=== Architectury Patterns Update Script ===\n");
  console.log(`模式: ${DRY_RUN ? "DRY RUN（仅输出，不写入）" : "LIVE（将写入草稿文件）"}\n`);

  // 需要查询的仓库列表（按星数/相关性排序）
  const repos = [
    { owner: "jaredlll08", repo: "MultiLoader-Template", desc: "最流行的 MultiLoader 模板" },
    { owner: "Fabricators-of-Create", repo: "create-multiloader-addon-template", desc: "@ExpectPlatform 大量使用示例" },
    { owner: "architectury", repo: "architectury-example-mod", desc: "官方 Architectury 示例" },
  ];

  // 先加载现有数据
  let existingPatterns = {};
  try {
    const raw = readFileSync(PATTERNS_FILE, "utf-8");
    existingPatterns = JSON.parse(raw);
    console.log(`[OK] 加载现有 patterns: ${PATTERNS_FILE}\n`);
  } catch {
    console.log("[WARN] 未找到现有 patterns 文件，将创建全新草稿\n");
  }

  const allPatterns = [];
  const errors = [];

  for (const { owner, repo, desc } of repos) {
    console.log(`[FETCH] ${owner}/${repo} — ${desc}`);
    try {
      // 尝试获取 common 模块中的 ExpectPlatform 示例
      const candidates = [
        "common/src/main/java/dev/architectury/docs/PlatformInit.java",
        "src/common/java/dev/architectury/docs/PlatformInit.java",
        "Fabricators-of-Create/src/common/java/com/createc/multiloader/PlatformInit.java",
      ];

      let found = false;
      for (const candidate of candidates) {
        try {
          const content = await fetchFileContentRaw(owner, repo, candidate);
          if (content) {
            const patterns = extractExpectPlatformPatterns(content);
            if (patterns.length > 0) {
              allPatterns.push(...patterns.map(p => ({ ...p, source: `${owner}/${repo}` })));
              console.log(`  ✓ 提取 ${patterns.length} 个 ExpectPlatform 模式 (${candidate})`);
              found = true;
            }
          }
        } catch {
          // try next
        }
      }

      // 尝试获取 mixin 配置
      const mixinCandidates = [
        "common/src/main/resources/mixins.common.json",
        "src/common/resources/mixins.common.json",
      ];

      for (const candidate of mixinCandidates) {
        try {
          const content = await fetchFileContentRaw(owner, repo, candidate);
          if (content) {
            try {
              const mixinData = JSON.parse(content);
              allPatterns.push({
                type: "mixinConfig",
                source: `${owner}/${repo}`,
                pattern: mixinData,
                path: candidate,
              });
              console.log(`  ✓ 提取 mixin 配置 (${candidate})`);
            } catch {
              // not valid JSON
            }
          }
        } catch {
          // try next
        }
      }

      if (!found) {
        // 列出仓库根目录中的 build.gradle 看是否有 architectury 配置
        try {
          const buildGradle = await fetchFileContentRaw(owner, repo, "build.gradle.kts") ||
                              await fetchFileContentRaw(owner, repo, "build.gradle");
          if (buildGradle && buildGradle.includes("architectury")) {
            console.log(`  ✓ 确认 Architectury 项目（build.gradle 中包含 architectury 配置）`);
          }
        } catch {
          // ignore
        }
      }
    } catch (e) {
      console.log(`  ✗ 错误: ${e.message}`);
      errors.push({ repo: `${owner}/${repo}`, error: e.message });
    }
  }

  console.log(`\n共提取 ${allPatterns.length} 个模式\n`);

  // 生成草稿
  const draft = {
    meta: {
      generatedAt: new Date().toISOString(),
      totalPatternsExtracted: allPatterns.length,
      sources: repos.map(r => `${r.owner}/${r.repo}`),
      errors: errors.length > 0 ? errors : undefined,
      note: "此文件为自动生成的草稿，请 review 后手动合并到 architectury-patterns.json",
    },
    summary: {
      expectPlatformCount: allPatterns.filter(p => p.type === "expectPlatform").length,
      mixinConfigCount: allPatterns.filter(p => p.type === "mixinConfig").length,
    },
    patterns: allPatterns,
  };

  if (DRY_RUN) {
    console.log("=== DRY RUN — 草稿预览 ===\n");
    console.log(JSON.stringify(draft, null, 2));
  } else {
    writeFileSync(OUTPUT_FILE, JSON.stringify(draft, null, 2), "utf-8");
    console.log(`[WROTE] 草稿已写入: ${OUTPUT_FILE}`);
  }

  console.log("\n=== 下一步 ===");
  console.log("1. 打开草稿文件 review 提取的模式");
  console.log("2. 确认 @ExpectPlatform 示例与现有 architectury-patterns.json 不重复");
  console.log("3. 手动合并到 architectury-patterns.json 的对应章节");
  console.log("4. 更新 meta.lastUpdated 为今天日期");
  console.log("\n如需重新生成，运行: node scripts/update-architectury-examples.js --dry-run");
}

main().catch((e) => {
  console.error("[FATAL]", e);
  process.exit(1);
});
