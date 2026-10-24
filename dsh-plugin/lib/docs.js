/**
 * 文档检索桥：`/mc-skill doc <关键词>` 用。
 *
 * 为什么在**进程内**复用 `mcp-server/dist/docs-platform`，而不是走 MCP 往返：
 *   · 同一条实现（MCP 的 search_docs 与这里的 searchDocs 是同一个函数）；
 *   · DSH 里 MCP 未挂载/被关掉时，这条命令仍然可用；
 *   · 少一次 JSON-RPC 往返，且不需要用户先配 MCP。
 *
 * ⚠️ 三个实测约束：
 *   1. `searchDocs` 返回的是 **MCP content 包装**（`[{type:"text", text:"<JSON 字符串>"}]`），
 *      不是裸结果 —— 要自己拆一层。
 *   2. 它依赖 `MC_SKILL_DATA`，**必须在动态 import 之前设好**（模块顶层会读）。
 *   3. 语义检索需要嵌入模型；缺模型时它自己降级成 L0/FTS，不报错，读 `semantic` 字段即可。
 */
import { existsSync } from "node:fs";
import { pathToFileURL } from "node:url";

/** 支持的平台（与 docs-platform 的 Platform 联合类型一致；基岩走另一套，不在此列）。 */
export const DOC_PLATFORMS = ["forge", "fabric", "neoforge", "quilt", "liteloader", "rift", "modloader"];

let loaded = null;

function distEntry(repoRoot) {
  return repoRoot.replace(/\\/g, "/") + "/mcp-server/dist/docs-platform/index.js";
}

/**
 * 预加载 docs-platform（apply 时调一次）。
 * @param {{repoRoot: string, dataDir?: string, communityDir?: string}} options
 * @returns {Promise<{ok: true} | {ok: false, reason: string}>}
 */
export async function prepareDocs(options) {
  loaded = null;
  const entry = distEntry(options.repoRoot);
  if (!existsSync(entry)) return { ok: false, reason: "mcp-server/dist 未构建（docs-platform 缺失）" };
  // 关键：docs-platform 在模块顶层读 MC_SKILL_DATA，所以必须在 import 之前设好。
  if (options.dataDir && process.env.MC_SKILL_DATA === undefined) {
    process.env.MC_SKILL_DATA = options.dataDir;
  }
  if (options.communityDir && process.env.MC_SKILL_COMMUNITY === undefined) {
    process.env.MC_SKILL_COMMUNITY = options.communityDir;
  }
  try {
    const mod = await import(pathToFileURL(entry).href);
    if (typeof mod.searchDocs !== "function") {
      return { ok: false, reason: "docs-platform 缺少 searchDocs 导出（dist 陈旧？）" };
    }
    loaded = mod;
    return { ok: true };
  } catch (error) {
    return { ok: false, reason: "docs-platform 加载失败：" + (error && error.message ? error.message : String(error)) };
  }
}

export function docsReady() {
  return loaded !== null;
}

/** 从 MCP content 包装里取出 JSON 结果。 */
function unwrapContent(result) {
  const blocks = result && Array.isArray(result.content) ? result.content : [];
  const first = blocks.find((b) => b && b.type === "text" && typeof b.text === "string");
  if (!first) return null;
  try {
    return JSON.parse(first.text);
  } catch {
    return { raw: first.text };
  }
}

/**
 * 检索某平台某版本的文档。
 * @param {{platform: string, version: string, query: string, limit?: number}} args
 * @returns {Promise<{ok: true, data: any} | {ok: false, reason: string}>}
 */
export async function searchDocs(args) {
  if (loaded === null) return { ok: false, reason: "docs-platform 未加载" };
  const platform = String(args.platform || "").toLowerCase();
  if (!DOC_PLATFORMS.includes(platform)) {
    return { ok: false, reason: "不支持检索该平台的文档：" + platform + "（可用：" + DOC_PLATFORMS.join(" / ") + "；基岩版不走这条）" };
  }
  const limit = Math.max(1, Math.min(30, Number(args.limit) || 8));
  try {
    const raw = await loaded.searchDocs({ platform, version: args.version, query: args.query, limit });
    const data = unwrapContent(raw);
    if (data === null) return { ok: false, reason: "检索返回里没有文本块" };
    return { ok: true, data };
  } catch (error) {
    return { ok: false, reason: "检索失败：" + (error && error.message ? error.message : String(error)) };
  }
}
