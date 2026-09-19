---
name: mc-command
description: Commands.literal、权限、客户端命令。触发词：command、Brigadier、argument
platform: forge
version: "1.14.4"
dependencies: []
mappings: mcp
---

# mc-command（1.14.4）

> 一手来源：本档 docs 语料 `data/forge_1.14.4/forge-docs/1.14.4/processed/primer_1_14.md:154`（原文「Commands have been overhauled, and now use a separate Mojang library called **Brigadier** (it's not obfuscated, so you can just look at the source)」）+ `conventions_loadstages.md`（「FMLServerStartingEvent: Register Commands」）。

## Decision Flow

```
→ 命令体系 → 1.14 起用 Mojang 独立库 Brigadier（primer 原文，非混淆可直接看源码）
→ 注册时机 → 本档语料仍列 FMLServerStartingEvent（loadstages 页）
→ 声明式语法 → 命令语法同步到客户端、Tab 补全按参数声明询问服务端（primer 原文）
→ 注册与生命周期 → mc-registry、01-registry.mdc
```

## 本档口径（已核实）

- **Brigadier 是 Mojang 的独立库**（primer_1_14:154 原文点名），命令语法声明式化：语法由服务端同步到客户端、Tab 补全按参数声明进行、静态选项客户端本地补全（primer 列表原文）。
- 注册时机本档语料仍载 `FMLServerStartingEvent`（loadstages）；Forge 专用的 `RegisterCommandsEvent` 在本仓语料中最早见于 1.16.5 primer——1.14.4 工程以本档语料/实际源码为准，别倒装 1.16+ 事件。

## 反模式

- 把 1.12 时代的字符串解析式命令写法搬进 1.14+（primer 明写已废除）。
- 在本档写 `RegisterCommandsEvent` 并当已核实（本仓 1.14.4 语料无此事件记载）。

## 下一步

- 语料全文：`get_doc_full`（primer_1_14 / conventions_loadstages）；反模式库：`forge/1.14.4/knowledge/antipatterns/`。
