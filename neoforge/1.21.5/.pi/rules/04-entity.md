---
description: 04 — 实体（NeoForge 1.21.5）
---

# 04 — 实体（NeoForge 1.21.5）

来源：https://docs.neoforged.net/docs/1.21.5/entities/

`DeferredRegister.createEntities(modid)`。`EntityType.Builder.of(MyEntity::new, MobCategory.MISC)` 后必须 `.build(ResourceKey.create(Registries.ENTITY_TYPE, ResourceLocation.fromNamespaceAndPath(modid, id)))`。短写法 `registerEntityType("id", MyEntity::new, MobCategory.MISC)`（可再传 `UnaryOperator<EntityType.Builder>`）。

实体类构造 `(EntityType<? extends MyEntity>, Level)`。本档存盘方法是 `readAdditionalSaveData(CompoundTag)` / `addAdditionalSaveData(CompoundTag)`，另有 `defineSynchedData(SynchedEntityData.Builder)`、`hurtServer(ServerLevel, DamageSource, float)`。不要抄 1.21.10 的 `ValueInput` / `ValueOutput`。

自定义构造不要做成恰好两参数（会和工厂构造冲突）。渲染只放客户端。禁止 Forge 1.12 `EntityRegistry`。
