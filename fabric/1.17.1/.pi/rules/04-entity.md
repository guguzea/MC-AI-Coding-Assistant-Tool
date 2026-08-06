---
description: 04 — 实体开发
---

# 04 — 实体开发

> 适用版本：Fabric 1.17.1

---

## 约束

### 核心原则

- 实体必须在 `Registry.register(Registry.ENTITY_TYPE, id, type)` 中注册
- 实体渲染器在客户端单独注册（`EntityRendererRegistry`）
- 实体类继承 `Entity` 或其子类
- 实体必须有 `FabricEntityTypeBuilder` 或 `EntityType.Builder`
- 实体 ID 必须在 `fabric.mod.json` 的 `entrypoints` 中正确配置

---

## Decision Flow

### Decision: 选择实体类型

```
IF 静态实体（不移动、不交互）
  → EntityType.Builder.of(Entity::new, MobCategory.MISC)

IF 有行为实体（动物、怪物）
  → FabricEntityTypeBuilder.create(SpawnGroup.CREATURE, Entity::new)
  → 重写 registerAttributes() 和 init() 方法

IF 需要在服务端和客户端分别初始化
  → 拆分 FabricMod 为 client/server entrypoints

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
public static final EntityType<MyPigEntity> MY_PIG =
    Registry.register(Registry.ENTITY_TYPE, new Identifier(MOD_ID, "my_pig"),
        FabricEntityTypeBuilder.create(SpawnGroup.CREATURE, MyPigEntity::new)
            .dimensions(0.9f, 1.4f)    // width, height
            .maxTrackingRange(10)
            .trackingTickInterval(10)
            .build()
    );

// 3. 在 onInitialize() 中设置属性
@Override
public void onInitialize() {
    MobEntity example = (MobEntity) MY_PIG.create(null);
    example.getAttributeContainer().register(Attributes.MAX_HEALTH, 20.0);
    example.getAttributeContainer().register(Attributes.MOVEMENT_SPEED, 0.25);
}
```

> ⚠️ **1.17.x 属性注册**：在 `onInitialize()` 中，通过 `MobEntity.create(null)` 创建临时实例来注册属性（传 null 因为不需要完整初始化世界）。`EntityAttributeRegistry` 和 `MobEntity.createMobAttributes()` 是 1.18+ 的 API。

## Spawn Restriction（生成限制）

```java
@Override
public void onInitialize() {
    SpawnRestriction.register(
        MY_PIG,
        SpawnRestriction.Location.ON_GROUND,
        Heightmap.Type.MOTION_BLOCKING_NO_LEAVES,
        AnimalEntity::canSpawn
    );
}
```

## 实体渲染器（客户端）

```java
// 单独的客户端入口点（推荐）
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
- ❌忘记设置 `SpawnRestriction` — 实体无法在世界中自然生成
- ❌在 `onInitialize()` 外注册 — 注册不会生效
- ❌ `Registries.ENTITY_TYPE` — 1.17.x 应使用 `Registry.ENTITY_TYPE`

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | 实体通过 Registry.register() 注册 |
| `mc-item` | 实体可以掉落物品（EntityDrops 事件） |
| `mc-gui` | 实体可以打开 GUI（使用 Holder<MenuType>） |
| `mc-datagen` | 实体可以生成 loot table JSON |
