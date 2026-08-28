---
name: mc-events
description: Forge 1.13.2 事件系统。@SubscribeEvent、MinecraftForge.EVENT_BUS、过渡期 Bus 写法。触发词：事件、Event、@SubscribeEvent
platform: forge
version: "1.13.2"
dependencies: []
mappings: mcp
docsTool: search_forge_docs
---

# mc-events（Forge 1.13.2）

> 正文以本档 `.cursor/rules/05-events.mdc` 为准；本 Skill 不引入规则之外的 API 名。

## 订阅要点（源自本档 05）

- 游戏事件：`MinecraftForge.EVENT_BUS.register(this)`（见 05 的订阅时机表）
- 客户端 Mod 总线可用过渡期写法：`@Mod.EventBusSubscriber(modid = MOD_ID, bus = Mod.EventBusSubscriber.Bus.MOD, value = Dist.CLIENT)`
- 具体事件类以本档 05 的 Decision 表为准，禁止从邻档复制类名
