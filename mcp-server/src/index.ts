import "./utils/node-sqlite-guard.js"; // 必须保持第一个 import：22.5–22.12 未带 --experimental-sqlite 时先给出指引再退出
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { realpathSync } from "fs";
import { fileURLToPath } from "url";
import { warmupApi, DEFAULT_VERSION } from "./api/index.js";
import { diagnoseDataPaths, hasAnyPlatformData, assertDataUsable } from "./utils/path.js";
import { server } from "./tool-registry.js";

export * from "./tool-registry.js";

// ── stdio 入口（仅直接执行时安装 process handler 并 connect）────────────────

function isMainModule(): boolean {
  const entry = process.argv[1];
  if (!entry) return false;
  const here = fileURLToPath(import.meta.url);
  if (entry === here) return true;
  try {
    return realpathSync(entry) === here;
  } catch {
    return false;
  }
}

if (isMainModule()) {
  process.on("unhandledRejection", (reason) => {
    console.error("[mc-mcp-server] unhandledRejection:", reason);
  });
  process.on("uncaughtException", (err) => {
    console.error("[mc-mcp-server] uncaughtException:", err);
    process.exit(1);
  });

  if (process.env.MC_SKILL_DEBUG_PATHS === "1") {
    console.error("[mc-mcp-server] Data paths:", JSON.stringify(diagnoseDataPaths(), null, 2));
  }

  if (process.env.MC_SKILL_STRICT === "1") {
    const usable = assertDataUsable();
    if (!usable.ok) {
      console.error(`[mc-mcp-server] MC_SKILL_STRICT=1：数据不可用（${usable.reason}），退出。`);
      process.exit(1);
    }
  } else if (!hasAnyPlatformData()) {
    const msg =
      "[mc-mcp-server] WARN: 未在数据目录中找到 forge_*/fabric_*/neoforge_*。" +
      "请设置 MC_SKILL_DATA 为 data 目录绝对路径并确认已解压数据。";
    console.error(msg);
  }

  try {
    void warmupApi([DEFAULT_VERSION]).catch((err) => {
      console.error("[mc-mcp-server] warmup failed:", err);
    });
    const transport = new StdioServerTransport();
    await server.connect(transport);
  } catch (err) {
    console.error("[mc-mcp-server] failed to start:", err);
    process.exit(1);
  }
}
