---
description: 04 — 实体（NeoForge 1.21.1）
---

# 04 — 实体（NeoForge 1.21.1）

来源：https://docs.neoforged.net/docs/1.21.1/entities/

用 `DeferredRegister.Entities` / `DeferredRegister.create(Registries.ENTITY_TYPE, MODID)`。`EntityType.Builder` 最后 `.build(...)` 的 ResourceKey 参数以该版文档为准。

渲染只放客户端：`@EventBusSubscriber(value = Dist.CLIENT, bus = MOD)`。不要在服务端加载 Renderer。

生成、属性、生成蛋：查该版 entities 页，不要抄 Forge 1.12 `EntityRegistry`。
