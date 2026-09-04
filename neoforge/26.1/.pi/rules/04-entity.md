---
description: 04 — 实体（NeoForge 26.1）
---

# 04 — 实体（NeoForge 26.1）

来源：https://docs.neoforged.net/docs/entities/

用 `DeferredRegister.Entities` / `DeferredRegister.createEntities`。`EntityType.Builder.build` 用 `ResourceKey.create(Registries.ENTITY_TYPE, Identifier.fromNamespaceAndPath(...))`（本档是 Identifier，不是 ResourceLocation）。可走 `registerEntityType` 捷径。

渲染只放客户端：`@EventBusSubscriber(value = Dist.CLIENT, bus = Bus.MOD, modid = "yourmodid")` 或 `@Mod(..., dist = Dist.CLIENT)`（`bus` 必须带 `Bus.` 限定；1.20.6+ 默认总线是 `Bus.GAME`，mod bus 事件必须显式 `bus = Bus.MOD`）。不要在服务端加载 Renderer。

生成、属性、生成蛋：查该版 entities 页，不要抄 Forge 1.12 `EntityRegistry`。
