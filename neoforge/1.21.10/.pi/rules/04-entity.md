---
description: 04 — 实体（NeoForge 1.21.10）
---

# 04 — 实体（NeoForge 1.21.10）

来源：https://docs.neoforged.net/docs/1.21.10/entities/

注册与 1.21.5 同类：`DeferredRegister.createEntities`、`EntityType.Builder.of` + `.build(ResourceKey.create(Registries.ENTITY_TYPE, ResourceLocation.fromNamespaceAndPath(...)))`，或 `registerEntityType`。

本档存盘方法是 **`readAdditionalSaveData(ValueInput)` / `addAdditionalSaveData(ValueOutput)`**，不是 `CompoundTag`。其余：`defineSynchedData(SynchedEntityData.Builder)`、`hurtServer`。

自定义构造不要恰好两参数。渲染只放客户端。禁止 `EntityRegistry`。
