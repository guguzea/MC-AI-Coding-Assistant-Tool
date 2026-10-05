---
description: 04 — 实体（NeoForge 1.21.11）
---

# 04 — 实体（NeoForge 1.21.11）

来源：https://docs.neoforged.net/docs/1.21.11/entities/

用 `DeferredRegister.Entities` / `DeferredRegister.createEntities`。`EntityType.Builder.build` 用 `ResourceKey.create(Registries.ENTITY_TYPE, Identifier.fromNamespaceAndPath(...))`。可走 `registerEntityType` 捷径。

渲染只放客户端：`@EventBusSubscriber(value = Dist.CLIENT, modid = "yourmodid")` 或 `@Mod(..., dist = Dist.CLIENT)`（1.21.8 起注解上的 `bus` 属性与 `Bus` 类型已移除，不要再写 `bus = Bus.MOD`——写了编译报「找不到符号: 方法 bus()／变量 Bus」）。不要在服务端加载 Renderer。

生成、属性、生成蛋：查该版 entities 页，不要抄 Forge 1.12 `EntityRegistry`。
