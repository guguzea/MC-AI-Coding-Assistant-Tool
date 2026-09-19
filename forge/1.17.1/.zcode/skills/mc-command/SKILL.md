---
name: mc-command
description: Commands.literal、权限、客户端命令。触发词：command、Brigadier、argument
platform: forge
version: "1.17.1"
dependencies: []
mappings: official
---

# mc-command（1.17.1）

> 一手来源：类名 `CommandSourceStack` / `CommandSource` 经 `query_api`（version=1.17.1）核实存在；`RegisterCommandsEvent` 事件名的一手语料证据在 1.16.5 primer（`data/forge_1.16.5/.../primer_1_16_5.md:454`），本档语料无命令专页。

## Decision Flow

```
→ 命令注册 → RegisterCommandsEvent（事件名一手证据见 1.16.5 primer；本档语料无专页，用法细节先 get_doc_full 核实再写）
→ 命令实现 → Brigadier 声明式（1.14 起的 Mojang 独立库）
→ 命令上下文类 → 1.17.1 起 CommandSourceStack 与 CommandSource 都在（query_api 已钉）
→ 注册与生命周期 → mc-registry、01-registry.mdc
```

## 本档口径（已核实）

- `CommandSourceStack` 在本档存在（query_api found；该名 1.16.5 索引不命中，1.17 起才可用）。
- `CommandSource` 同样存在（query_api found）。
- 本档 docs 语料（41 页）无命令专页——Brigadier 链路细节（argument 类型、权限判定）写前先核实，不凭记忆。

## 反模式

- 凭记忆写完整 Brigadier 调用链（本档无一手语料；空写不如核实后写）。
- 把 1.16.5 的 `CommandSource` 当本档唯一上下文类（`CommandSourceStack` 已存在，按实际签名用）。

## 下一步

- 注册/用法核实：`get_doc_full` / 官方 javadoc；反模式库：`forge/1.17.1/knowledge/antipatterns/`。
