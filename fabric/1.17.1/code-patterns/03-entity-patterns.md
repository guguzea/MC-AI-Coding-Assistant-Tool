# 实体模式（Fabric 1.17.1）

## ⚠️ 1.17.x 关键差异

- **没有 `Registries` 类！** 使用 `Registry.ENTITY_TYPE` 静态字段
- **没有 `RegistrySupplier`！** 直接用静态字段持有注册后的对象
- **属性注册**：使用 `MobEntity.create(null)` 而不是 `FabricDefaultAttributeRegistry`
- **生成限制**：使用 `SpawnRestriction.register()` 而不是 `SpawnRestriction.register()`

## 模式 1：基础生物实体

```yaml
模式: Basic Mob Entity
平台: Fabric 1.17.1
分类: entity
依赖: []
扩展点: [EntityRenderer, SpawnRestriction]
---
public class MyCowEntity extends CowEntity {
    public MyCowEntity(EntityType<? extends MyCowEntity> type, World world) {
        super(type, world);
    }
}

// 注册
private static final EntityType<MyCowEntity> MY_COW = Registry.register(
    Registry.ENTITY_TYPE,
    new Identifier(MOD_ID, "my_cow"),
    EntityType.Builder.create(MyCowEntity::new, SpawnGroup.CREATURE)
        .setDimensions(0.9f, 1.4f)
        .maxTrackingRange(8)
        .trackingTickInterval(3)
        .build("my_cow")
);

// 在 onInitialize() 中注册属性
EntityAttributeModification.Builder.create()
    .add(EntityAttributes.GENERIC_MAX_HEALTH, 20.0)
    .add(EntityAttributes.GENERIC_MOVEMENT_SPEED, 0.25)
    .add(EntityAttributes.GENERIC_FOLLOW_RANGE)
    .apply(MobEntity.create(null));

// 生成限制
SpawnRestriction.register(
    MY_COW,
    SpawnRestriction.Location.ON_GROUND,
    Heightmap.Type.MOTION_BLOCKING_NO_LEAVES,
    MyCowEntity::canSpawn
);
```

## 模式 2：客户端渲染器

```yaml
模式: Entity Renderer
平台: Fabric 1.17.1
分类: entity
依赖: [EntityType]
扩展点: [ClientModInitializer]
---
// 客户端入口
public class ExampleModClient implements ClientModInitializer {
    @Override
    public void onInitializeClient() {
        EntityRendererRegistry.register(ExampleMod.MY_ENTITY, PigEntityRenderer::new);
    }
}
```

## 模式 3：自定义实体行为

```yaml
模式: Custom Entity Behavior
平台: Fabric 1.17.1
分类: entity
依赖: []
扩展点: [EntityType, GoalSelector]
---
public class MySlimeEntity extends SlimeEntity {
    public MySlimeEntity(EntityType<? extends MySlimeEntity> type, World world) {
        super(type, world);
    }

    @Override
    protected void initGoals() {
        super.initGoals();
        // 添加自定义行为目标
    }
}
```
