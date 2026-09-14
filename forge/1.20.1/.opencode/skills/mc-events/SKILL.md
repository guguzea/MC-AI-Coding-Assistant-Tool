---
name: mc-events
description: Forge 1.20.1 事件系统。@SubscribeEvent、事件总线、物理端判断。触发词：事件、Event、@SubscribeEvent、EventBusSubscriber
platform: forge
version: "1.20.1"
dependencies: []
mappings: mcp
docsTool: search_forge_docs
---

# mc-events（Forge 1.20.1）

> 正文以本档 `.cursor/rules/05-events.mdc` 为准；本 Skill 不引入规则之外的 API 名。

## 订阅要点（源自本档 05）

- 所有事件处理方法标注 `@SubscribeEvent`
- `bus` 属性决定事件总线：`Bus.FORGE`（默认，游戏事件，如 `AttachCapabilitiesEvent`）/ `Bus.MOD`（Mod 生命周期与注册事件，如 `RegisterEvent`、`NewRegistryEvent`）
- 订阅方式：`@Mod.EventBusSubscriber(modid = MOD_ID, bus = Bus.FORGE)` 或手动注册到事件总线
- 物理端：优先 `DistExecutor`；`@OnlyIn(Dist.CLIENT)` 在 `@Mod.EventBusSubscriber(value = Dist.CLIENT)` 上是标准用法，不要加在普通方法上

## Decision

```
IF 游戏事件（PlayerInteract、LivingDrops、AttachCapabilitiesEvent 等） → Bus.FORGE
IF Mod 生命周期 / RegisterEvent / NewRegistryEvent → Bus.MOD（挂 Bus.FORGE 则永不触发）
```

详细事件选择表见本档 `05-events.mdc`。
