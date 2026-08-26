/**
 * buildStatus 检测：dist 是否缺失/过期（src 最新 .ts 修改时间 > dist 编译时间）。
 * MCP 能运行说明 dist 存在；此函数用于提示「代码已改但未重新 build」的过期状态。
 */
import { existsSync, readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export interface BuildStatus {
  buildRequired: boolean;
  reason?: string;
  distMtime?: string;
  srcNewestMtime?: string;
}

export function getBuildStatus(): BuildStatus {
  try {
    const here = dirname(fileURLToPath(import.meta.url));
    const mcpRoot = join(here, "..", "..");
    const distEntry = join(mcpRoot, "dist", "index.js");
    const srcRoot = join(mcpRoot, "src");
    if (!existsSync(distEntry)) {
      return { buildRequired: true, reason: "dist/index.js 不存在，请执行 cd mcp-server && npm ci && npm run build" };
    }
    if (!existsSync(srcRoot)) return { buildRequired: false };
    let newest = 0;
    const walk = (dir: string) => {
      for (const e of readdirSync(dir, { withFileTypes: true })) {
        const p = join(dir, e.name);
        if (e.isDirectory()) walk(p);
        else if (e.name.endsWith(".ts")) {
          const t = statSync(p).mtimeMs;
          if (t > newest) newest = t;
        }
      }
    };
    walk(srcRoot);
    const distMtime = statSync(distEntry).mtimeMs;
    if (newest > distMtime + 1000) {
      return {
        buildRequired: true,
        reason: "src 有比 dist 更新的修改，请重新执行 cd mcp-server && npm run build",
        distMtime: new Date(distMtime).toISOString(),
        srcNewestMtime: new Date(newest).toISOString(),
      };
    }
    return { buildRequired: false };
  } catch (e) {
    return {
      buildRequired: true,
      reason: `无法检测 build 状态：${e instanceof Error ? e.message : String(e)}`,
    };
  }
}
