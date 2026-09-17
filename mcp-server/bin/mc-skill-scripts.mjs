#!/usr/bin/env node
// mc-skill-scripts —— 仓库脚本线 CLI 入口（2026-09-17 提级批次）。
//
// 与 `mc-skill`（dist/cli.js，dispatch 全部 MCP 工具）同一个包、同一权重：
//   mc-skill          工具线：AI/人调 MCP 工具（搜索 / 生成 / 校验 / 反编译单件…）
//   mc-skill-scripts  仓库线：把 scripts/ 与 mcp-server/scripts/ 的散装脚本收成子命令
//                     （lib resolve|summary|ownership / corpus decompile|emit|merge /
//                      cloth project / gate list|run）
//
// 纪律：薄壳转发（不复制业务逻辑）；门链与 MCP Schema 均不动；子命令清单见 src/cli/index.ts。
import { main } from "../dist/cli/index.js";

process.exitCode = await main(process.argv.slice(2));
