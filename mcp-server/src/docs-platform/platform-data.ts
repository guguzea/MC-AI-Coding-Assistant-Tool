/**
 * 平台文档数据包缺失检测与统一错误响应。
 * 用户可只下载部分平台 data（如仅 forge_*），缺失平台应返回明确提示而非空列表/结构错误。
 */

import { existsSync, readdirSync } from "fs";
import { join } from "path";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { resolveDataDir } from "../utils/path.js";
import { ownGet } from "../utils/own-record.js";
import { ALL_DOC_PLATFORMS, PLATFORM_DOC_SUBDIR, type Platform } from "./platforms.js";

export type DocPlatform = Platform;

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
  quilt:
    "Quilt 官方树位于 data/quilt_<version>/quilt-docs/<version>/。无树时 search_docs(platform=quilt) 对非 QSL 查询可回退 Fabric（过滤 FAPI 专属类）；QSL 专用查询不会回退。可用 diagnose_data_paths 检查。",
  liteloader:
    "LiteLoader 文档树位于 data/liteloader_<version>/liteloader-docs/<version>/。页少时可仅 L0/社区短文 + loader-api-summaries。不要复制 forge_1.12.2 教程树。",
  rift:
    "Rift 文档树位于 data/rift_1.13.2/rift-docs/1.13.2/。无库时用仓库 rift/1.13.2/knowledge/common/ 已抓 wiki。不要回退 Fabric 文档。",
  modloader:
    "ModLoader 以仓库内安全 API 表为准（modloader/1.6.4/knowledge/common/safe-api.md），不把 found:false 当成类不存在。",
  bedrock:
    "基岩文档请用 search_bedrock_docs。数据位于 data/bedrock_*/bedrock-docs/；并查看 data/bedrock-docs-status.json 的滞后标记。",
};

export function platformDataMissingPayload(platform: DocPlatform) {
  return {
    ok: false as const,
    error: {
      code: "PLATFORM_DATA_MISSING" as const,
      platform,
      message: `${platform} 文档数据未下载或不在当前 MC_SKILL_DATA 目录中`,
      hint: ownGet(HINTS, platform) ?? "",
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

function hasPrefixedIndex(
  dataDir: string,
  prefix: string,
  sources: string[],
): boolean {
  for (const e of readdirSync(dataDir, { withFileTypes: true })) {
    if (!e.isDirectory() || !e.name.startsWith(`${prefix}_`)) continue;
    const ver = e.name.slice(`${prefix}_`.length);
    const base = join(dataDir, e.name);
    for (const src of sources) {
      if (existsSync(join(base, src, ver, "index-l0.json"))) return true;
    }
  }
  return false;
}

/**
 * 扫描 data 根下是否存在该平台的可用文档索引。
 * NeoForge 额外认可 forge_1.20.1（兼容回退）。
 * Quilt **不**把 Fabric 树算作「已有 Quilt 数据」（回退在 search_docs 里显式处理）。
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
      return hasPrefixedIndex(dataDir, "fabric", ["fabric-docs", "fabric-wiki"]);
    }
    if (platform === "neoforge") {
      if (hasPrefixedIndex(dataDir, "neoforge", ["neoforge-docs"])) return true;
      return existsSync(
        join(dataDir, "forge_1.20.1", "forge-docs", "1.20.1", "index-l0.json"),
      );
    }
    const extraSources: Record<string, string[]> = {
      quilt: ["quilt-docs"],
      liteloader: ["liteloader-docs"],
      rift: ["rift-docs"],
      modloader: ["modloader-docs"],
      bedrock: ["bedrock-docs"],
    };
    const sources = ownGet(extraSources, platform) ?? [ownGet(PLATFORM_DOC_SUBDIR, platform) ?? `${platform}-docs`];
    return hasPrefixedIndex(dataDir, platform, sources);
  } catch {
    return false;
  }
}

export function listKnownDocPlatforms(): readonly string[] {
  return ALL_DOC_PLATFORMS;
}
