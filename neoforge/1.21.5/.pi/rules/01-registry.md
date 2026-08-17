---
description: 01 — 注册（NeoForge 1.21.5）
globs:
alwaysApply: true
status: ready
---

# 01 — 注册（NeoForge 1.21.5）

来源：search_neoforge_docs `concepts/registries` / `items` / `blocks`（version=1.21.5）。

已核：`DeferredRegister.Items` / `DeferredRegister.createItems`、`DeferredRegister.createBlocks`、`@Mod`。

## Decision Flow

```
→ 方块/物品 → DeferredRegister.createBlocks/createItems + register(modEventBus)
→ 不要把 Forge RegistryObject 当本档推荐
→ 查询用 vanilla Registry，不要拿 DeferredRegister 当运行时 map
→ 核不到 → search_neoforge_docs version=1.21.5
```
