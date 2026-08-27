---
name: mc-blockentity
description: 分发到 neoforge/<ver>。同步用 Payload，不是 SimpleChannel；禁止 RegistryObject。
platform: neoforge
version: "unversioned"
---

# 方块实体（NeoForge 扁平入口）

本文件不是教程，禁止当 1.20.4 示例用。禁止从 Forge 或邻档复制。自定义包走 Payload，禁止 SimpleChannel / IMessage / RegistryObject / NeoForgeAddonPlugin。

锁定精确版本后只读对应档 `neoforge/<ver>/.cursor/skills/mc-blockentity/SKILL.md` 与该档 `02-block.mdc`：

| 档 | 网络（自定义包） |
|---|---|
| `neoforge/1.20.4` | `RegisterPayloadHandlerEvent`（单数）+ `IPayloadRegistrar` |
| `neoforge/1.21.1` / `1.21.3` / `1.21.8` / `1.21.11` | `RegisterPayloadHandlersEvent` + `PayloadRegistrar` |
| `neoforge/26.1` | 同上复数事件；去混淆，文档路径无版本前缀 |

方块实体同步优先 `getUpdateTag` / `ClientboundBlockEntityDataPacket`。未列入 `list_neoforge_versions` 的版本禁止读邻档 00–10，改口 `search_neoforge_docs`。
