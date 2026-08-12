/**
 * 统一工具注册收集器：monkey-patch McpServer.registerTool，
 * 收集 {name, description, inputSchema, handler} 到模块级表。
 * CLI 通用 dispatch 通过 import index.js 的副作用填充此表后直接调用任意工具。
 */
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export interface ToolHandlerEntry {
  name: string;
  description: string;
  /** 宽松持有 SDK 的 inputSchema；CLI 侧按 z.ZodTypeAny 使用（coerceFlags） */
  inputSchema: unknown;
  /** MCP handler：返回 CallToolResult 或直接对象 */
  handler: (args: Record<string, unknown>) => Promise<unknown> | unknown;
}

export const toolHandlers = new Map<string, ToolHandlerEntry>();

/** 收集并透传注册（必须在 server 创建后、首个 registerTool 前调用一次） */
export function patchToolCollection(server: McpServer): McpServer {
  // SDK registerTool 为重载签名，桥接层用宽松函数类型（避免 as any）
  type LooseReg = (
    name: string,
    opts: { title?: string; description?: string; inputSchema?: unknown },
    handler: (args: Record<string, unknown>) => unknown,
  ) => unknown;
  const loose = server as unknown as { registerTool: LooseReg };
  const orig = loose.registerTool.bind(server);
  loose.registerTool = (name, opts, handler) => {
    toolHandlers.set(name, {
      name,
      description: opts.description ?? "",
      inputSchema: opts.inputSchema,
      handler,
    });
    return orig(name, opts, handler);
  };
  return server;
}
