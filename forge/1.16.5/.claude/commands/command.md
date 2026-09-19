---
name: mc-command
description: Commands.literal、权限、客户端命令。触发词：command、Brigadier、argument
platform: forge
version: "1.16.5"
dependencies: []
mappings: mcp
---

# mc-command（1.16.5）

> 一手来源：本档 docs 语料 `data/forge_1.16.5/forge-docs/1.16.5/processed/primer_1_16_5.md:454`（原文「## Command Registration — Register your commands in Forge's **RegisterCommandsEvent**」）；类名 `CommandSource` 经 `query_api`（version=1.16.5）核实存在。

## Decision Flow

```
→ 命令注册 → RegisterCommandsEvent（Forge 事件，primer 原文）
→ 命令实现 → Brigadier 声明式（1.14 起，见 mc-command 1.14.4 档引 primer_1_14）
→ 命令上下文类 → 1.16.5 是 CommandSource（query_api 已钉；不是 CommandSourceStack）
→ 注册与生命周期 → mc-registry、01-registry.mdc
```

## 本档口径（已核实）

- 注册：**RegisterCommandsEvent**（primer_1_16_5「Command Registration」节原文）。
- 上下文/反馈类：`CommandSource`（query_api found；`CommandSourceStack` 在 1.16.5 索引 **found=false**——别提前用后名）。
- 权限节点、参数类型等 Brigadier 细节以原版源码为准（1.14.4 primer：库非混淆可直接看源）。

## 反模式

- 在 1.16.5 写 `CommandSourceStack`（该名 query_api 不命中；本档用 `CommandSource`）。
- 命令注册走 FMLServerStartingEvent（那是 1.12–1.14 语料口径；本档 primer 明写 RegisterCommandsEvent）。

## 下一步

- 语料全文：`get_doc_full`（primer_1_16_5）；反模式库：`forge/1.16.5/knowledge/antipatterns/`。
