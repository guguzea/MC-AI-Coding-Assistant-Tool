# 实体模式（Fabric 1.21.3）

## 模式 1：基础生物实体

```yaml
模式: Basic Mob Entity
平台: Fabric
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
private static final EntityType<MyCowEntity> MY_COW =
    Registry.register(
        Registries.ENTITY_TYPE,
        Identifier.of(MOD_ID, "my_cow"),
        EntityType.Builder.create(MyCowEntity::new, SpawnGroup.CREATURE)
            .dimensions(0.9f, 1.4f)
    .maxTrackingRange(8)
            .trackingTickInterval(3)
    .build("my_entity")
    );

// 在 onInitialize() 中注册属性
FabricDefaultAttributeRegistry.register(MY_COW,
    MobEntity.createMobAttributes()
        .add(EntityAttributes.GENERIC_MAX_HEALTH, 20.0)
        .add(EntityAttributes.GENERIC_MOVEMENT_SPEED, 0.25));

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
平台: Fabric
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
平台: Fabric
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

    @Override
    protected void mobTick() {
        super.mobTick();
        // 自定义每 tick 逻辑
    }
}
```
