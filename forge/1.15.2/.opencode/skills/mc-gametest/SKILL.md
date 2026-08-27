---
name: mc-gametest
description: GameTest 结构测试。触发词：GameTest、@GameTest
platform: forge
version: "1.15.2"
dependencies: []
mappings: mcp
---

# mc-gametest

## 本档无 GameTest 体系

Forge 1.15.2 档内没有 GameTest 框架。核实依据：`data/forge_1.15.2/forge-docs/1.15.2/index-l0.json`（40 个页 id）中不存在任何 gametest 页；同仓库 1.14.4 / 1.16.5 / 1.17.1 档同样没有，`misc_gametest` 页最早出现在 1.18.2 档。

因此本档没有任何 `@GameTest` / `GameTestHelper` / `@GameTestHolder` / `RegisterGameTestsEvent` / `/test` 命令的核实签名，**禁止**拿 1.18.2+ 邻档的 GameTest API 写给 1.15.2 用户。

- 官方文档：https://docs.minecraftforge.net/en/1.15.2/
- 本档相关内容如需进一步确认：一律以 `search_forge_docs`（platform=forge, version=1.15.2）为准；查不到就按「未核实」处理，不要凭记忆补签名。
- 目标版本若 ≥ 1.18.2：切到对应档的 `mc-gametest`（该档有 `misc_gametest` 页）。

## 快速入口

- 注册与生命周期：`mc-registry`、`01-registry.mdc`
- 数据与资源：`mc-datagen`、`mc-datapack`、`generate_*` MCP 工具
- 反模式：`forge/1.15.2/knowledge/antipatterns/`

## 下一步

用户想做结构测试时先确认目标版本：1.15.2 按上回答「无体系」；版本 ≥ 1.18.2 再走对应 `mc-gametest` 技能与 `misc_gametest` 页。
