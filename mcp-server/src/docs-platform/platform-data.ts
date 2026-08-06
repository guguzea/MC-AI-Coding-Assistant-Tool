/**
 * 平台文档数据包缺失检测与统一错误响应。
 * 用户可只下载部分平台 data（如仅 forge_*），缺失平台应返回明确提示而非空列表/结构错误。
 */

import { existsSync, readdirSync } from "fs";
import { join } from "path";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { resolveDataDir } from "../utils/path.js";

export type DocPlatform = "forge" | "fabric" | "neoforge";

export class PlatformDataMissingError extends Error {
  readonly code = "PLATFORM_DATA_MISSING" as const;
  constructor(public readonly platform: DocPlatform) {
    super(`${platform} 文档数据未下载或不在当前 MC_SKILL_DATA 目录中`);
    this.name = "PlatformDataMissingError";
  }
}

const HINTS: Record<DocPlatform, string> = {
  forge:
    "请下载并解压 Forge 文档数据包到 data/forge_<version>/forge-docs/<version>/（含 index-l0.json），并确认 MC_SKILL_DATA 指向 data 根目录。可用 diagnose_data_paths 检查。",
  fabric:
    "请下载并解压 Fabric 文档数据包到 data/fabric_<version>/fabric-docs/<version>/（或 fabric-wiki），并确认 MC_SKILL_DATA 指向 data 根目录。可用 diagnose_data_paths 检查。",
  neoforge:
    "请下载并解压 NeoForge 文档数据包到 data/neoforge_<version>/neoforge-docs/<version>/；若只需 1.20.1，也可提供 forge_1.20.1。确认 MC_SKILL_DATA 指向 data 根目录。可用 diagnose_data_paths 检查。",
};

export function platformDataMissingPayload(platform: DocPlatform) {
  return {
    ok: false as const,
    error: {
      code: "PLATFORM_DATA_MISSING" as const,
      platform,
      message: `${platform} 文档数据未下载或不在当前 MC_SKILL_DATA 目录中`,
      hint: HINTS[platform],
    },
  };
}

export function platformDataMissingResult(platform: DocPlatform): CallToolResult {
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(platformDataMissingPayload(platform), null, 2),
      },
    ],
  };
}

/** 若为 PlatformDataMissingError 则转成工具结果，否则 null */
export function asPlatformDataMissingResult(e: unknown): CallToolResult | null {
  if (e instanceof PlatformDataMissingError) {
    return platformDataMissingResult(e.platform);
  }
  return null;
}

/**
 * 扫描 data 根下是否存在该平台的可用文档索引。
 * NeoForge 额外认可 forge_1.20.1（兼容回退）。
 */
export function hasPlatformDocData(
  platform: DocPlatform,
  dataDir = resolveDataDir(),
): boolean {
  if (!existsSync(dataDir)) return false;
  try {
    if (platform === "forge") {
      for (const e of readdirSync(dataDir, { withFileTypes: true })) {
        if (!e.isDirectory()) continue;
        if (e.name.startsWith("forge_") && e.name !== "forge_javadoc") {
          const ver = e.name.slice("forge_".length);
          if (existsSync(join(dataDir, e.name, "forge-docs", ver, "index-l0.json"))) {
            return true;
          }
        }
        if (e.name === "forge_javadoc") {
          const jd = join(dataDir, "forge_javadoc");
          if (!existsSync(jd)) continue;
          for (const v of readdirSync(jd, { withFileTypes: true })) {
            if (v.isDirectory() && existsSync(join(jd, v.name, "index-l0.json"))) {
              return true;
            }
          }
        }
      }
      return false;
    }
    if (platform === "fabric") {
      for (const e of readdirSync(dataDir, { withFileTypes: true })) {
        if (!e.isDirectory() || !e.name.startsWith("fabric_")) continue;
        const ver = e.name.slice("fabric_".length);
        const base = join(dataDir, e.name);
        if (
          existsSync(join(base, "fabric-docs", ver, "index-l0.json")) ||
          existsSync(join(base, "fabric-wiki", ver, "index-l0.json"))
        ) {
          return true;
        }
      }
      return false;
    }
    // neoforge
    for (const e of readdirSync(dataDir, { withFileTypes: true })) {
      if (!e.isDirectory()) continue;
      if (e.name.startsWith("neoforge_") && e.name !== "neoforge_javadoc") {
        const ver = e.name.slice("neoforge_".length);
        if (existsSync(join(dataDir, e.name, "neoforge-docs", ver, "index-l0.json"))) {
          return true;
        }
      }
    }
    // 1.20.1 Forge 兼容
    return existsSync(
      join(dataDir, "forge_1.20.1", "forge-docs", "1.20.1", "index-l0.json"),
    );
  } catch {
    return false;
  }
}
