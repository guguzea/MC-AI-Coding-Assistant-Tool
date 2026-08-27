---
description: 04 — 实体（NeoForge 1.20.6）
---

# 04 — 实体（NeoForge 1.20.6）

来源：本档 `search_neoforge_docs` **没有**独立 `entities` 页（`get_neoforge_doc_full id=entities` 返回 `DOC_NOT_FOUND`；线上 `/docs/1.20.6/entities/` 404）。

注册走 `DeferredRegister`（见 https://docs.neoforged.net/docs/1.20.6/concepts/registries/）。方块实体见 https://docs.neoforged.net/docs/1.20.6/blockentities/：`BlockEntityType.Builder.of(...).build(null)`。

渲染只放客户端：`@EventBusSubscriber(value = Dist.CLIENT, bus = Bus.MOD)`。不要在服务端加载 Renderer。

禁止：Forge 1.12 `EntityRegistry`；把 1.21.5+ 的 `EntityType.Builder.build(ResourceKey...)` / `registerEntityType` / `ValueInput` 当本档已核 API。缺签名则停，再 `search_neoforge_docs`。
