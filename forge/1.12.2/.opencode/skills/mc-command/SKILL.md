---
name: mc-command
description: ICommand、CommandBase、权限。触发词：command、ICommand、CommandBase
platform: forge
version: "1.12.2"
dependencies: []
mappings: mcp
---

# mc-command（1.12.2）

> 一手来源：本档 docs 语料 `data/forge_1.12.2/forge-docs/1.12.2/processed/conventions_loadstages.md`（加载阶段清单明列「FMLServerStartingEvent: Register Commands」）；类名 `CommandBase` / `World` 经 `query_api`（version=1.12.2）核实存在。

## Decision Flow

```
→ 服务端命令 → 1.12.2 经 FMLServerStartingEvent 注册（语料 loadstages 页）
→ 命令类本体 → CommandBase 系（MCP 名，query_api 已钉）
→ 权限/执行反馈 → 命令类内自查（1.12.2 无 Brigadier）
→ 注册与生命周期 → mc-registry、01-registry.mdc
```

## 本档口径（已核实）

- 注册时机：**FMLServerStartingEvent**（服务端启动期注册命令，语料 loadstages 页原文「FMLServerStartingEvent: Register Commands」）。
- 命令实现：`CommandBase` 系（MCP 命名，`query_api --class=CommandBase --version=1.12.2` found）；与 1.14+ 的 Brigadier 体系完全不同——**本版没有 Brigadier**，不要把 1.13+ 的声明式写法搬来。
- 反馈文本走 `.lang`（资源面见 mc-resourcepack）。

## 反模式

- 把 Brigadier / `RegisterCommandsEvent` 写进 1.12.2 工程（都是 1.13/1.16 时代的东西）。
- 在客户端注册服务端命令（1.12.2 命令是服务端启动期注册）。
- 混用映射名（本档 mappings: mcp；类名经 query_api 核实后再用）。

## 下一步

- 语料全文：`get_doc_full`（id 见本档语料 processed 目录）；反模式库：`forge/1.12.2/knowledge/antipatterns/`。
