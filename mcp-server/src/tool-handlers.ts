/**
 * 统一工具注册收集器：monkey-patch McpServer.registerTool，
 * 收集 {name, description, inputSchema, handler} 到模块级表。
 * CLI 通用 dispatch 通过 import tool-registry.js 的副作用填充此表后直接调用任意工具。
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

  // SDK 升级/迁移保险：若未来改用 addTool / server.tool 注册，同样收集（F-C17）
  const holder = server as unknown as Record<string, unknown>;
  for (const key of ["addTool", "tool"]) {
    const fn = holder[key];
    if (typeof fn !== "function") continue;
    const origAlt = fn.bind(server) as (...a: unknown[]) => unknown;
    holder[key] = (...args: unknown[]) => {
      try {
        // tool(name, opts, handler) 形态
        if (typeof args[0] === "string" && args[1] && typeof args[1] === "object" && typeof args[2] === "function") {
          const opts = args[1] as { description?: string; inputSchema?: unknown };
          toolHandlers.set(args[0], {
            name: args[0],
            description: opts.description ?? "",
            inputSchema: opts.inputSchema,
            handler: args[2] as ToolHandlerEntry["handler"],
          });
        } else if (args[0] && typeof args[0] === "object" && typeof (args[0] as { name?: unknown }).name === "string") {
          // addTool({ name, description, inputSchema, callback }) 形态
          const spec = args[0] as {
            name: string;
            description?: string;
            inputSchema?: unknown;
            callback?: unknown;
          };
          if (typeof spec.callback === "function") {
            toolHandlers.set(spec.name, {
              name: spec.name,
              description: spec.description ?? "",
              inputSchema: spec.inputSchema,
              handler: spec.callback as ToolHandlerEntry["handler"],
            });
          }
        }
      } catch {
        /* best-effort 收集，不影响注册本身 */
      }
      return origAlt(...args);
    };
  }
  return server;
}

/**
 * 注册完成断言（F-C17）：handler 收集表必须与静态 schema 合并清单（index + wave）一致。
 * 不一致立即抛错（fail-fast），防止重构后 CLI 全部报「未知命令」而 MCP 正常的静默劣化。
 */
export function assertToolRegistrationComplete(expectedNames: string[]): void {
  const expected = [...expectedNames].sort();
  const got = [...toolHandlers.keys()].sort();
  const missing = expected.filter((n) => !got.includes(n));
  const extra = got.filter((n) => !expected.includes(n));
  if (expected.length !== got.length || missing.length > 0 || extra.length > 0) {
    throw new Error(
      `工具注册不一致：schema=${expected.length} handlers=${got.length}` +
        (missing.length ? `；缺失 handler: ${missing.join(", ")}` : "") +
        (extra.length ? `；多余 handler: ${extra.join(", ")}` : "") +
        "。检查 patchToolCollection 是否先于全部注册调用、或是否有注册绕过收集器。",
    );
  }
}
