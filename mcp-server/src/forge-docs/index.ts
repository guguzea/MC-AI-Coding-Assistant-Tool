/**
 * Forge 官方文档 MCP 工具
 *
 * 提供三个递进式查询工具：
 *   search_forge_docs      — L0 索引搜索
 *   get_forge_doc_summary — L1 摘要
 *   get_forge_doc_full    — L2/L2+ 全文
 *
 * 数据来源：Forge 官方文档（docs.minecraftforge.net）1.20.1
 * 预处理产出：data/forge_1.20.1/forge-docs/
 */

import { join } from "path";
import { fileURLToPath } from "url";
import * as z from "zod";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { ForgeDocStore, DocNotFoundError, VersionNotFoundError } from "./store.js";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
// dist/forge-docs/ → mcp-server/ → mc_skill/  (data 在 mc_skill/data/forge_1.20.1/forge-docs/)
const DATA_DIR = join(__dirname, "..", "..", "..", "data", "forge_1.20.1", "forge-docs");

const store = new ForgeDocStore(DATA_DIR);

// ── 工具 1：search_forge_docs（L0 搜索）────────────────────────────────

export const searchForgeDocsSchema = {
  name: "search_forge_docs",
  description: `Forge 官方文档搜索（L0 索引）。

使用方法：
  1. 先调用 search_forge_docs(query) 找出相关页面。
  2. 对于可能相关的页面，调用 get_forge_doc_summary 获取摘要。
  3. 仅当摘要显示该页肯定包含所需细节时，才调用 get_forge_doc_full。
  4. 对于注册/事件/能力/网络等核心课题，建议直接调用 get_forge_doc_full 并启用 highlight_key=true。
  5. 永远不要一次性加载超过 2 个 full page，避免上下文溢出。
  6. ⚠️ 搜索失败时，使用精确术语（如类名、方法名、事件名）重新尝试，不要用长自然语言描述。

参数说明：
  - query: 搜索关键词，可以是类名、概念或功能描述。
  - version: Minecraft/Forge 版本，默认 1.20.1。
  - tags: 可选标签过滤（小写无连字符，如 registry, event, capability, networking, datagen, sides, client, server）。`,
  inputSchema: z.object({
    query: z.string().describe("搜索关键词（类名、概念或功能描述）"),
    version: z.string().optional().default("1.20.1").describe("版本，默认 1.20.1"),
    tags: z
      .array(z.string())
      .optional()
      .describe("标签过滤（小写无连字符，如 registry, event, capability）"),
  }),
} as const;

export async function searchForgeDocs(
  args: z.infer<typeof searchForgeDocsSchema.inputSchema>,
): Promise<CallToolResult> {
  try {
    const result = store.searchIndex(
      args.query,
      args.version ?? "1.20.1",
      args.tags,
    );
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              query: args.query,
              version: args.version ?? "1.20.1",
              tags: args.tags,
              total: result.length,
              results: result,
            },
            null,
            2,
          ),
        },
      ],
    };
  } catch (e) {
    if (e instanceof VersionNotFoundError) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                error: e.message,
                hint: `请使用支持的版本：${e.availableVersions.join(", ") || "未知"}`,
              },
              null,
              2,
            ),
          },
        ],
      };
    }
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({ error: (e as Error).message }, null, 2),
        },
      ],
    };
  }
}

// ── 工具 2：get_forge_doc_summary（L1 摘要）──────────────────────────────

export const getForgeDocSummarySchema = {
  name: "get_forge_doc_summary",
  description: `获取 Forge 文档页面的章节骨架与摘要，用于判断是否需要深入。

适用场景：
  - 用户需要了解某个概念的大致内容
  - AI 需要判断该页与当前代码问题的相关性

返回内容：每个 <h2> 章节的标题 + 150-200 字摘要 + 首段概述。`,
  inputSchema: z.object({
    id: z.string().describe("页面 ID，来自 search_forge_docs 返回的 results[].id"),
    version: z.string().optional().default("1.20.1").describe("版本，默认 1.20.1"),
  }),
} as const;

export async function getForgeDocSummary(
  args: z.infer<typeof getForgeDocSummarySchema.inputSchema>,
): Promise<CallToolResult> {
  try {
    const result = store.loadSummary(
      args.id,
      args.version ?? "1.20.1",
    );
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (e) {
    if (e instanceof VersionNotFoundError) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                error: e.message,
                hint: `请使用支持的版本：${e.availableVersions.join(", ") || "未知"}`,
              },
              null,
              2,
            ),
          },
        ],
      };
    }
    if (e instanceof DocNotFoundError) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                error: e.message,
                hint: `请使用 search_forge_docs 查询正确的页面 ID，格式为 "1.20.1/文件名"`,
              },
              null,
              2,
            ),
          },
        ],
      };
    }
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({ error: (e as Error).message }, null, 2),
        },
      ],
    };
  }
}

// ── 工具 3：get_forge_doc_full（L2/L2+ 全文）───────────────────────────

export const getForgeDocFullSchema = {
  name: "get_forge_doc_full",
  description: `获取 Forge 文档页面全文。

适用场景：
  - 用户明确需要某个 API 的详细工作原理
  - 需要查看完整事件列表、注册完整步骤等

highlight_key=true 时，关键要点（🔴新手必读、🟠常见错误、🟢示例代码）会突出显示在开头，
  若关键摘要已够用则不必细读全文。`,
  inputSchema: z.object({
    id: z.string().describe("页面 ID，来自 search_forge_docs 返回的 results[].id"),
    version: z.string().optional().default("1.20.1").describe("版本，默认 1.20.1"),
    highlight_key: z
      .boolean()
      .optional()
      .default(true)
      .describe("true 时提取并突出关键段落（🔴🟠🟢⭐），默认 true"),
  }),
} as const;

export async function getForgeDocFull(
  args: z.infer<typeof getForgeDocFullSchema.inputSchema>,
): Promise<CallToolResult> {
  try {
    const result = store.loadFullDoc(
      args.id,
      args.version ?? "1.20.1",
      args.highlight_key ?? true,
    );
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (e) {
    if (e instanceof VersionNotFoundError) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                error: e.message,
                hint: `请使用支持的版本：${e.availableVersions.join(", ") || "未知"}`,
              },
              null,
              2,
            ),
          },
        ],
      };
    }
    if (e instanceof DocNotFoundError) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                error: e.message,
                hint: `请使用 search_forge_docs 查询正确的页面 ID，格式为 "1.20.1/文件名"`,
              },
              null,
              2,
            ),
          },
        ],
      };
    }
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({ error: (e as Error).message }, null, 2),
        },
      ],
    };
  }
}
