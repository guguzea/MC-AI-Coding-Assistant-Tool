---
name: mc-events
description: Forge 1.12.2 事件系统。@SubscribeEvent、@EventHandler、EVENT_BUS。触发词：事件、Event、@SubscribeEvent、@EventHandler
platform: forge
version: "1.12.2"
dependencies: []
mappings: mcp
docsTool: search_forge_docs
---

# mc-events（Forge 1.12.2）

> 正文以本档 `.cursor/rules/05-events.mdc` 为准；本 Skill 不引入规则之外的 API 名。

## 订阅要点（源自本档 05）

- 游戏事件：`@Mod.EventBusSubscriber(modid = ...)` 挂到 Forge `EVENT_BUS`，或 `MinecraftForge.EVENT_BUS.register(...)`
- 生命周期：`@Mod` 类上的 `@EventHandler`（`FMLPreInitializationEvent` 等）
- 本档**没有** `EventBusSubscriber.Bus.MOD` / `Bus.FORGE`——禁止生成该写法
