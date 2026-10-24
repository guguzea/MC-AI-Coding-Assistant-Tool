# MCP 工具不可用排查（clone 后必读）

> 本文件是根 [`AGENTS.md`](../AGENTS.md)「工具不可用排查」的**详细内容落点**。
> 根纲保留「编译 → 重载 → 验收」三步指针；这里存逐项排查清单与各类失败读数。

### 工具不可用排查（clone 后必读）

- **MCP 工具全部调用失败（服务未启动）**：说明 `mcp-server/dist/` 未编译（dist 不入库）。执行：
  ```bash
  cd mcp-server && npm ci && npm run build
  ```
  （Node 需 >= 22.5；Yarn 映射可再 `npm run build:yarn-sqlite`。配置宿主见 `AUTO_SETUP.md`：先识别 IDE/CLI，再按该宿主的文件与顶层键合并草稿，不要默认写 Cursor 的 `mcp.json`。）
- **无 MCP 客户端时**：可用独立 CLI 调用任意工具——`node mcp-server/dist/cli.js <工具名> --参数=值`（通用 dispatch，89 工具全可用；如 `search_docs` / `check_dependencies` / `analyze_mod_jar` / `resolve_lib_skills`）。工程类工具可加 `--project <dir>`（映射到 `projectPath`）。工具输出始终为 JSON；`--json` 不改变工具输出，仅为兼容保留；它只在交互式终端下影响 `--help` 的呈现（人读摘要 → 机器可读 schema），表达格式意图用 `--output-format json`（当前唯一合法值）。
- **CLI 双入口（2026-09-17 提级）**：**工具线** = 上面的 `dist/cli.js`（与 MCP 同一份 `toolHandlers`）；**仓库线** = `node mcp-server/bin/mc-skill-scripts.mjs <lib|corpus|cloth|gate> <命令>`（薄壳转发 `scripts/` 与 `mcp-server/scripts/` 的既有脚本）。仓库线属**维护侧**作业（批量反编译、摘要重建、G1 门、注入标记回填），MCP 工具面不暴露；两者互不分叉；冒烟门 `assert-cli-smoke`（test-core §S16）。安装/链接 mcp-server 包后，两入口的 bin 名分别为 mc-skill 与 mc-skill-scripts。
- **`get_server_status` 返回 `buildStatus.buildRequired=true`**：src 有比 dist 更新的修改，需重新 `npm run build`，然后**重载宿主 MCP**（只编 dist 不够， AI IDE 进程仍跑旧代码）。
- **反编译工具报 `TOOLCHAIN_MISSING`**：需要 Java 17+（VineFlower/tiny-remapper）；安装 Temurin 17+ 后重启 MCP，或按返回指引操作。
- **`search_mod_code` 报 `NOT_DECOMPILED`**：反编译源码尚未生成（按设计不入库），按返回指引先调 `decompile_mod_jar` / `get_minecraft_source` 按需生成。（此前本行误写 `NOT_FOUND`；`src/decompile/index.ts` 发的是 `NOT_DECOMPILED`。）
- **`PLATFORM_DATA_MISSING`**：对应平台文档数据缺失，先调 `diagnose_data_paths` 确认 `MC_SKILL_DATA` 指向本仓库 `data/`。
