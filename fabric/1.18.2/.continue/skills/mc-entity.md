---
name: mc-entity
description: Fabric 实体开发。EntityType、EntityCategory、DefaultAttributeRegistry。触发词：实体、Entity、EntityType、SpawnRestriction
platform: fabric
version: "1.18.2"
dependencies: []
mappings: yarn
---

# 实体开发（Fabric 1.18.2）

## 快速开始

```java
// 1. 创建实体类
public class MyPigEntity extends PigEntity {
    public MyPigEntity(EntityType<? extends MyPigEntity> type, World world) {
        super(type, world);
    }
}

// 2. 注册实体类型
private static final RegistrySupplier<EntityType<MyPigEntity>> MY_PIG =
    Registry.register(
        Registries.ENTITY_TYPE,
        new Identifier(MOD_ID, "my_pig"),
        EntityType.Builder.create(MyPigEntity::new, EntityCategory.CREATURE)
            .dimensions(EntityDimensions.changing(0.9f, 1.4f))
            .maxTrackOffset(10)
            .trackRangeBlocks(10)
            .build()
    );

// 3. 在 onInitialize() 中设置属性
@Override
public void onInitialize() {
    DefaultAttributeRegistry.register(MY_PIG,
        DefaultAttributeBuilder.create()
            .maxHealth(20.0)
            .movementSpeed(0.25)
    );
}
```

## Decision: 选择实体类型

```
IF 有行为实体（动物、怪物）
  → 继承对应实体类（如 AnimalEntity、MonsterEntity）

IF 静态实体（不移动）
  → EntityType.Builder.of(Entity::new, EntityCategory.MISC)

IF 需要在世界中自然生成
  → 设置 SpawnRestriction
```

## 实体渲染器（客户端）

```java
public class ExampleModClient implements ClientModInitializer {
    @Override
    public void onInitializeClient() {
        EntityRendererRegistry.register(MY_PIG, (context) ->
            new AnimalEntityRenderer<>(context.getModelLoader()
                .getModelPart(EntityModelLayers.COW), new CowEntityModel(), 0.5f)
        );
    }
}
```

## Spawn Restriction（生成限制）

```java
@Override
public void onInitialize() {
    SpawnRestrictionRegistration.mobSpawn().register(
        MY_PIG,
        SpawnRestriction.Location.ON_GROUND,
        Heightmap.Type.MOTION_BLOCKING_NO_LEAVES,
        MyPigEntity::canSpawn
    );
}
```

## 常见错误

- ❌忘记在客户端 entrypoint 注册渲染器 — 实体显示为紫色
- ❌忘记设置 SpawnRestriction — 实体无法自然生成
- ❌ EntityDimensions 使用 `changing` vs `fixed` 错误 — 碰撞异常
- ❌在 `onInitialize()` 外注册 — 注册不生效

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | 实体通过 Registry.register() 注册 |
| `mc-mixin` | Mixin 用于修改实体行为 |
| `mc-datagen` | DataGen 生成实体语言和 loot table |
