---
name: mc-command
description: Commands.literal、权限、客户端命令。触发词：command、Brigadier、argument
platform: forge
version: "1.15.2"
dependencies: []
mappings: mcp
---

# mc-command（1.15.2）

> 一手来源：本档 docs 语料 `data/forge_1.15.2/forge-docs/1.15.2/processed/concepts_internationalization.md`（含 `createComponentTranslation(ICommandSource, ...)` 一手条目——1.15.2 上下文类名带 I 前缀）；`conventions_loadstages.md`（「FMLServerStartingEvent: Register Commands」）；`RegisterCommandsEvent` 一手证据在 1.16.5 primer（`data/forge_1.16.5/.../primer_1_16_5.md:454`），本档语料无命令专页。

## Decision Flow

```
→ 命令注册 → 本档语料口径仍载 FMLServerStartingEvent（loadstages 页）；RegisterCommandsEvent 的一手证据始于 1.16.5 primer，本档先核实再用
→ 命令实现 → Brigadier 声明式（1.14.4 primer 原文：Mojang 独立库、非混淆可直接看源）
→ 命令上下文类 → 1.15.2 语料写 ICommandSource（internationalization 页原文）；1.16 起才改 CommandSource 系
→ 注册与生命周期 → mc-registry、01-registry.mdc
```

## 本档口径（已核实）

- 本档 internationalization 页的翻译组件条目用 **ICommandSource**（1.15.2 时代类名；1.16.5 同页已改 `CommandSource`——两档一手语料互证了改名时点）。
- 本档 docs 语料（40 页）无命令专页；Brigadier 成员链写前先核实。

## 反模式

- 在 1.15.2 用 1.16 的 `CommandSource`（本档一手语料是 ICommandSource）。
- 命令反馈文本硬编码不走翻译键。

## 下一步

- 语料全文：`get_doc_full`（concepts_internationalization / conventions_loadstages）；反模式库：`forge/1.15.2/knowledge/antipatterns/`。
