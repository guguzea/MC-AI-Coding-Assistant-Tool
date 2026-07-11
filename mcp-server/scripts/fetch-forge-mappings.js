#!/usr/bin/env node
/**
 * fetch-forge-mappings.js
 * 下载 Forge 多版本 mappings。
 *
 * 支持三套来源：
 *   MCP         — Forge 官方存档（1.7-1.12）
 *   MCP-stable  — Forge 稳定版 MCP（1.14.4 / 1.15.2）
 *   Parchment   — ParchmentMC（Mojang+参数名，1.16.5+）
 *
 * 使用：
 *   node scripts/fetch-forge-mappings.js --version=1.12.2
 *   node scripts/fetch-forge-mappings.js --version=1.16.5
 *   node scripts/fetch-forge-mappings.js --all
 */

import { mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { downloadFileAtomic, safeFileSize } from "./_lib/pipeline-helpers.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_ROOT = join(__dirname, "..", "..", "data");

// ── URL 模板 ───────────────────────────────────────────────────────────

const MCP_MAVEN_BASE = "https://maven.neoforged.net/releases/de/oceanlabs/mcp";
const PARCHMENT_BASE  = "https://maven.parchmentmc.org/org/parchmentmc/data";

// ── 版本配置 ───────────────────────────────────────────────────────────

const VERSION_CONFIG = {
  // MCP — 1.7.10 ~ 1.12.2（Forge 官方存档）
  "1.7.10":  { mcp: { mavenVersion: "1.7.10",   suffix: "srg" } },
  "1.8.9":   { mcp: { mavenVersion: "1.8.9",    suffix: "srg" } },
  "1.9.4":   { mcp: { mavenVersion: "1.9.4",    suffix: "srg" } },
  "1.10.2":  { mcp: { mavenVersion: "1.10.2",   suffix: "srg" } },
  "1.11.2":  { mcp: { mavenVersion: "1.11.2",   suffix: "srg" } },
  "1.12.2":  { mcp: { mavenVersion: "1.12.2",   suffix: "srg" } },

  // MCP-stable — 1.14.4 / 1.15.2（Forge 稳定版 MCP）
  "1.14.4":  { mcpStable: { id: "58-1.14.4" } },
  "1.15.2":  { mcpStable: { id: "60-1.15"   } },

  // Parchment — 1.16.5 起（MCP 已停止，Parchment 提供 Mojang+参数名）
  // 时间戳从 fabric/ 目录中验证过的实际文件确认
  "1.16.5":  { parchment: "1.16.5-2022.03.06" },
  "1.17.1":  { parchment: "1.17.1-2021.12.12" },
  "1.18.2":  { parchment: "1.18.2-2022.09.04" },
  "1.19.4":  { parchment: "1.19.4-2023.06.26" },
  "1.20.1":  { parchment: "1.20.1-2023.09.03" },
  "1.20.4":  { parchment: "1.20.4-2024.04.14" },
};

// ── HTTP 下载 ──────────────────────────────────────────────────────────
//
// `downloadFileAtomic` 在共享 helper 中实现：
//   - 写入 <dest>.tmp，再 rename 到 <dest>（崩溃时不会留下半截文件）
//   - 处理流错误、超时、重定向上限（默认 5 次）
//   - 下载成功后清理 .tmp

// ── 主流程 ─────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const versionArg = args.find(a => a.startsWith("--version="))?.split("=")[1];
  const allFlag    = args.includes("--all");

  const versions = allFlag
    ? Object.keys(VERSION_CONFIG)
    : (versionArg ? [versionArg] : []);

  if (versions.length === 0) {
    console.error("用法: node fetch-forge-mappings.js --version=1.12.2 | --all");
    process.exit(1);
  }

  for (const version of versions) {
    const cfg = VERSION_CONFIG[version];
    if (!cfg) { console.error(`Unknown version: ${version}`); continue; }

    const versionDir = join(OUT_ROOT, `forge_${version}`, "mappings");
    if (!existsSync(versionDir)) mkdirSync(versionDir, { recursive: true });

    console.log(`[${version}]`);

    // ── MCP（Forge 官方存档，1.7-1.12）─────────────────────────────
    if (cfg.mcp) {
      const { mavenVersion, suffix } = cfg.mcp;
      const filename = `mcp-${mavenVersion}-${suffix}.zip`;
      const url      = `${MCP_MAVEN_BASE}/mcp/${mavenVersion}/${filename}`;
      const destPath = join(versionDir, `mcp-${version}.zip`);

      if (existsSync(destPath) && safeFileSize(destPath) > 0) {
        console.log("  MCP  SKIP (exists)");
      } else {
        process.stdout.write("  MCP... ");
        const res = await downloadFileAtomic(url, destPath, {
          timeoutMs: 60_000,
          maxRedirects: 5,
          minBytes: 1024,
        });
        console.log(res.ok ? `OK (${res.bytes} bytes)` : `FAIL ${res.error ?? `HTTP ${res.status}`}`);
      }
    }

    // ── MCP-stable（Forge 稳定版，1.14.4 / 1.15.2）────────────────
    if (cfg.mcpStable) {
      const { id } = cfg.mcpStable;
      const filename = `mcp_stable_nodoc-${id}.zip`;
      const url      = `${MCP_MAVEN_BASE}/mcp_stable_nodoc/${id}/${filename}`;
      const destPath = join(versionDir, filename);

      if (existsSync(destPath) && safeFileSize(destPath) > 0) {
        console.log("  MCP-stable  SKIP (exists)");
      } else {
        process.stdout.write("  MCP-stable... ");
        const res = await downloadFileAtomic(url, destPath, {
          timeoutMs: 60_000,
          maxRedirects: 5,
          minBytes: 1024,
        });
        console.log(res.ok ? `OK (${res.bytes} bytes)` : `FAIL ${res.error ?? `HTTP ${res.status}`}`);
      }
    }

    // ── Parchment（ParchmentMC，1.16.5+）──────────────────────────
    if (cfg.parchment) {
      const filename = `parchment-${cfg.parchment}.zip`;
      const url      = `${PARCHMENT_BASE}/parchment-${version}/${cfg.parchment}/${filename}`;
      const destPath = join(versionDir, `parchment-${version}.zip`);

      if (existsSync(destPath) && safeFileSize(destPath) > 0) {
        console.log("  Parchment  SKIP (exists)");
      } else {
        process.stdout.write("  Parchment... ");
        const res = await downloadFileAtomic(url, destPath, {
          timeoutMs: 60_000,
          maxRedirects: 5,
          minBytes: 1024,
        });
        console.log(res.ok ? `OK (${res.bytes} bytes)` : `FAIL ${res.error ?? `HTTP ${res.status}`}`);
      }
    }
  }

  console.log("DONE!");
}

main().catch(console.error);
