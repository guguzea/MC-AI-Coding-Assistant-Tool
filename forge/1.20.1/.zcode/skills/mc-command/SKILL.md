---
name: mc-command
description: Commands.literal、权限、客户端命令。触发词：command、Brigadier、argument
platform: forge
version: "1.20.1"
dependencies: []
mappings: mcp
---

# mc-command（1.20.1）

> 一手来源：本档 docs 语料 `data/forge_1.20.1/forge-docs/1.20.1/processed/primer_1_20.md`（原文点名 `net.minecraft.commands.CommandSourceStack`）；类名 `CommandSourceStack` / `CommandSource` / `Commands` 经 `query_api`（version=1.20.1）核实存在；`RegisterCommandsEvent` 事件名一手证据在 1.16.5 primer（`primer_1_16_5.md:454`）。

## Decision Flow

```
→ 命令注册 → RegisterCommandsEvent（事件名一手证据见 1.16.5 primer；本档用法细节先核实再写）
→ 命令实现 → Brigadier 声明式（1.14 起）
→ 命令上下文类 → net.minecraft.commands.CommandSourceStack（primer_1_20 点名全路径）
→ 注册与生命周期 → mc-registry、01-registry.mdc
```

## 本档口径（已核实）

- `net.minecraft.commands.CommandSourceStack` 在本档存在且 primer_1_20 有改动记载（如构造新增 `IntConsumer` 参数——细节以该页原文为准）。
- `Commands` / `CommandSource` 同样在档（query_api found）。
- 方块点击类命令有 `SignBlockEntity#canExecuteClickCommands` 相关改动（primer_1_20 原文提及）。

## 反模式

- 凭记忆写完整 Brigadier 调用链（argument 类型等先核实）。
- 上下文类写错时代（1.16.5 无 `CommandSourceStack`）。
- 忽略 primer_1_20 对 `CommandSourceStack` 构造签名的改动记载。

## 下一步

- 语料全文：`get_doc_full`（primer_1_20 / concepts_internationalization）；反模式库：`forge/1.20.1/knowledge/antipatterns/`。
