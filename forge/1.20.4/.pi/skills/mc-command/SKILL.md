---
name: mc-command
description: Commands.literal、权限、客户端命令。触发词：command、Brigadier、argument
platform: forge
version: "1.20.4"
dependencies: []
mappings: mcp
---

# mc-command（1.20.4）

> 一手来源：类名 `CommandSourceStack` / `CommandSource` / `Commands` 经 `query_api`（version=1.20.4）核实存在；`RegisterCommandsEvent` 事件名一手证据在 1.16.5 primer（`data/forge_1.16.5/.../primer_1_16_5.md:454`）；1.20 系对 `CommandSourceStack` 的签名改动见 1.20.1 档 primer_1_20 原文。

## Decision Flow

```
→ 命令注册 → RegisterCommandsEvent（事件名一手证据见 1.16.5 primer；本档用法细节先核实再写）
→ 命令实现 → Brigadier 声明式（1.14 起）
→ 命令上下文类 → CommandSourceStack（1.17 起；1.20 系构造签名有改动记载）
→ 注册与生命周期 → mc-registry、01-registry.mdc
```

## 本档口径（已核实）

- `CommandSourceStack` / `CommandSource` / `Commands` 在本档都存在（query_api found）。
- 本档语料（70 页）无命令专页；命令相关翻译走 `concepts_internationalization` 页（`createComponentTranslation(CommandSource, ...)` 条目）。

## 反模式

- 凭记忆写完整 Brigadier 调用链（本档无一手语料）。
- 上下文类写错时代（1.16.5 无 `CommandSourceStack`）。

## 下一步

- 注册/用法核实：`get_doc_full` / 官方 javadoc；反模式库：`forge/1.20.4/knowledge/antipatterns/`。
