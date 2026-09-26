---
name: mc-command
description: Commands.literal、权限、客户端命令。触发词：command、Brigadier、argument
platform: forge
version: "1.18.2"
dependencies: []
mappings: parchment
---

# mc-command（1.18.2）

> 一手来源：类名 `CommandSourceStack` / `CommandSource` 经 `query_api`（version=1.18.2）核实存在；`RegisterCommandsEvent` 事件名的一手语料证据在 1.16.5 primer（`data/forge_1.16.5/.../primer_1_16_5.md:454`），本档语料（33 页）无命令专页。

## Decision Flow

```
→ 命令注册 → RegisterCommandsEvent（事件名一手证据见 1.16.5 primer；本档用法细节先核实再写）
→ 命令实现 → Brigadier 声明式（1.14 起）
→ 命令上下文类 → CommandSourceStack / CommandSource 都在（query_api 已钉）
→ 注册与生命周期 → mc-registry、01-registry.mdc
```

## 本档口径（已核实）

- `CommandSourceStack` 与 `CommandSource` 在本档都存在（query_api found）。
- 本档语料无命令专页；命令反馈的国际化走 `concepts_internationalization` 页（`createComponentTranslation(CommandSource, ...)` 一手条目在该页）。

## 反模式

- 凭记忆写完整 Brigadier 调用链（本档无一手语料）。
- 命令反馈文本硬编码不走翻译键（本档 internationalization 页有 CommandSource 系翻译条目）。

## 下一步

- 注册/用法核实：`get_doc_full` / 官方 javadoc；反模式库：`forge/1.18.2/knowledge/antipatterns/`。
