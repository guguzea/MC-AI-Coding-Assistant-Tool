---
name: mc-entity
description: Fabric 26.1.2 实体。PathfinderMob、FabricDefaultAttributeRegistry、EntityRendererRegistry。触发词：实体、EntityType、AttributeSupplier
platform: fabric
version: "26.1.2"
dependencies: []
mappings: official
---

# 实体（Fabric 26.1.2）

文档：`26.1.2/develop_entities_first-entity`。Mojmap。示例实体类名文档写成 `MiniGolemEntity`，基类用 `PathfinderMob`。

## 快速开始

1. 实体类 + `registerGoals()`（优先级数字越小越先）
2. `ModEntityTypes` 里 `Registry.register` 实体类型并设碰撞箱
3. 属性：`FabricDefaultAttributeRegistry.register(type, AttributeSupplier.Builder)`（loader-api 已核）
4. 客户端：`EntityRendererRegistry.register` + 模型层；渲染在 client 入口
5. 持久化：`addAdditionalSaveData` / `readAdditionalSaveData`
6. 需要同步的字段：`EntityDataAccessor`（文档 synched data）

```java
FabricDefaultAttributeRegistry.register(
    MY_ENTITY,
    Mob.createMobAttributes()
        .add(Attributes.MAX_HEALTH, 20.0D)
        .add(Attributes.MOVEMENT_SPEED, 0.25D)
);

// ClientModInitializer
EntityRendererRegistry.register(MY_ENTITY, MiniGolemEntityRenderer::new);
```

文档还要求 `EntityRenderState`、在 renderer 里 `extractRenderState`。不要把 Yarn `PlayerEntity` / `World` 抄进来。

## Decision Flow

```
IF 有 AI 的生物
  → PathfinderMob + registerGoals
IF 属性
  → FabricDefaultAttributeRegistry.register（不要 DeferredRegister）
IF 模型/贴图/动画
  → 客户端 EntityRendererRegistry + LayerDefinition；贴图尺寸必须对上 LayerDefinition.create
IF 要存档
  → addAdditionalSaveData / readAdditionalSaveData
IF 要客户端看见同一状态
  → EntityDataAccessor，不要只靠字段
```

## 常见错误

- ❌ 在服务端入口注册 renderer
- ❌ 贴图宽高和 `LayerDefinition.create(modelData, w, h)` 不一致
- ❌ Yarn 映射的 Blockbench 导出贴进本档 Mojmap 工程
- ❌ `registerAttributes()` 实例方法（本档走 FabricDefaultAttributeRegistry）

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | EntityType 用 Registry.register |
| `mc-worldgen` | BiomeModifications.addSpawn |
| `mc-networking` | 复杂同步走 CustomPacketPayload |
