---
description: 04 — 实体开发
---

# 04 — 实体开发

> 适用版本：Fabric 1.18.2

---

## 约束

### 核心原则

- 实体必须在 `Registry.register(Registry.ENTITY_TYPE, id, type)` 中注册
- 实体渲染器在客户端单独注册（`EntityRendererRegistry`）
- 实体类继承 `Entity` 或其子类
- 实体必须有 `EntityType.Builder`
- `fabric.mod.json` 的 `client` entrypoint 写入口类名（不是实体 ID）

---

## Decision Flow

### Decision: 选择实体类型

```
IF 静态实体（不移动、不交互）
  → EntityType.Builder.create(Entity::new, SpawnGroup.MISC)

IF 有行为实体（动物、怪物）
  → EntityType.Builder.create(MyEntity::new, SpawnGroup.CREATURE)
  → FabricDefaultAttributeRegistry.register + MobEntity.createMobAttributes()

IF 需要在服务端和客户端分别初始化
  → 拆分 ModInitializer 为 client/server entrypoints

IF 仅客户端渲染（如护甲、held item）
  → 不需要注册实体，使用 LayerRenderer 或FeatureRenderer
```

---

## 基本实体注册

```java
// 1. 创建实体类
public class MyPigEntity extends CowEntity {
    public MyPigEntity(EntityType<? extends MyPigEntity> type, World world) {
        super(type, world);
    }
}

// 2. 在 onInitialize() 中注册
public static final EntityType<MyPigEntity> MY_PIG = Registry.register(
    Registry.ENTITY_TYPE,
    new Identifier(MOD_ID, "my_pig"),
    EntityType.Builder.create(
        MyPigEntity::new,
        SpawnGroup.CREATURE
    )
    .setDimensions(0.9f, 1.4f)  // Yarn 1.18.2 Builder 是 setDimensions(float,float)
    .maxTrackingRange(8)
            .trackingTickInterval(3)
    .build("my_pig")
);
```

## Entity Attributes（属性）

```java
// 在 onInitialize() 中设置属性
@Override
public void onInitialize() {
    // 注册属性
    FabricDefaultAttributeRegistry.register(MY_PIG,
        MobEntity.createMobAttributes()
            .add(EntityAttributes.GENERIC_MOVEMENT_SPEED, 0.25)
            .add(EntityAttributes.GENERIC_MAX_HEALTH, 20.0)
            .add(EntityAttributes.GENERIC_ATTACK_DAMAGE, 3.0)
    );

}
```

## Spawn Restriction（生成限制）

```java
SpawnRestriction.register(
    MY_PIG,
    SpawnRestriction.Location.ON_GROUND,
    Heightmap.Type.MOTION_BLOCKING_NO_LEAVES,
    MyPigEntity::canSpawn
);
```

## 实体渲染器（客户端）

```java
// 单独的客户端入口点（推荐）
public class ExampleModClient implements ClientModInitializer {
    @Override
    public void onInitializeClient() {
        EntityRendererRegistry.register(MY_PIG, PigEntityRenderer::new);
    }
}
```

## fabric.mod.json 配置

```json
{
  "entrypoints": {
    "main": ["com.example.examplemod.ExampleMod"],
    "client": ["com.example.examplemod.ExampleModClient"]
  }
}
```

## 常见错误

- ❌忘记在 `fabric.mod.json` 中添加客户端 entrypoint — 实体无渲染
- ❌实体渲染器在服务端执行 — `EntityRendererRegistry` 仅在客户端有效
- ❌ `EntityDimensions` 使用错误的 `changing` vs `fixed` — 导致实体碰撞异常
- ❌忘记设置 `SpawnRestriction` — 实体无法在世界中自然生成
- ❌在 `onInitialize()` 外注册 — 注册不会生效

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | 实体通过 Registry.register() 注册 |
| `mc-item` | 实体可以掉落物品（EntityDrops 事件） |
| `mc-gui` | 实体可以打开 GUI（使用 Holder<ScreenHandlerType>，Yarn；非 Mojmap MenuType） |
| `mc-datagen` | 实体可以生成 loot table JSON |
