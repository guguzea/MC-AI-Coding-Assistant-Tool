---
description: 04 — 实体开发
---

# 04 — 实体开发

> 适用版本：Fabric 1.21.3

---

## 约束

### 核心原则

- 实体必须在 `Registry.register(Registries.ENTITY_TYPE, id, type)` 中注册
- 属性用 Fabric API `FabricDefaultAttributeRegistry.register`（官方 first-entity 教程）
- Yarn 枚举是 `SpawnGroup`，不是 Mojmap/26.1 文档里的 `MobCategory`
- `EntityType.Builder.create`（Yarn），不要抄 26.1 的 `EntityType.Builder.of` / `BuiltInRegistries`
- 渲染器只在客户端 `EntityRendererRegistry` / `ClientModInitializer` 注册
- `fabric.mod.json` 的 `entrypoints` 写的是入口类名，不是实体 ID

---

## Decision Flow

### Decision: 选择实体类型

```
IF 静态实体（不移动、不交互）
  → EntityType.Builder.create(Entity::new, SpawnGroup.MISC)

IF 有行为实体（动物、怪物）
  → EntityType.Builder.create(MyEntity::new, SpawnGroup.CREATURE)
  → onInitialize 里 FabricDefaultAttributeRegistry.register

IF 需要在服务端和客户端分别初始化
  → 拆分 ModInitializer / ClientModInitializer entrypoints

IF 仅客户端渲染（如护甲、held item）
  → 不需要注册实体，使用 FeatureRenderer
```

---

## 基本实体注册

```java
import net.fabricmc.fabric.api.object.builder.v1.entity.FabricDefaultAttributeRegistry;
import net.minecraft.entity.EntityType;
import net.minecraft.entity.SpawnGroup;
import net.minecraft.entity.attribute.EntityAttributes;
import net.minecraft.entity.mob.MobEntity;
import net.minecraft.registry.Registries;
import net.minecraft.registry.Registry;
import net.minecraft.registry.RegistryKey;
import net.minecraft.registry.RegistryKeys;
import net.minecraft.util.Identifier;
import net.minecraft.entity.SpawnRestriction;
import net.minecraft.entity.SpawnLocationTypes;
import net.minecraft.world.Heightmap;

public class MyPigEntity extends PigEntity {
    public MyPigEntity(EntityType<? extends MyPigEntity> type, World world) {
        super(type, world);
    }
}

public static final EntityType<MyPigEntity> MY_PIG = Registry.register(
    Registries.ENTITY_TYPE,
    Identifier.of(MOD_ID, "my_pig"),
    EntityType.Builder.create(MyPigEntity::new, SpawnGroup.CREATURE)
        .dimensions(0.9f, 1.4f)
        .maxTrackingRange(8)
        .trackingTickInterval(3)
        .build(RegistryKey.of(RegistryKeys.ENTITY_TYPE, Identifier.of(MOD_ID, "my_pig")))
);

@Override
public void onInitialize() {
    FabricDefaultAttributeRegistry.register(MY_PIG,
        MobEntity.createMobAttributes()
            .add(EntityAttributes.MAX_HEALTH, 20.0)
            .add(EntityAttributes.MOVEMENT_SPEED, 0.25)
    );
    SpawnRestriction.register(
        MY_PIG,
        SpawnLocationTypes.ON_GROUND,
        Heightmap.Type.MOTION_BLOCKING_NO_LEAVES,
        MyPigEntity::canSpawn
    );
}
```

不要 `EntityAttributeRegistry`、`EntityAttributeSupplementRegistry`、`DefaultAttributeRegistry.register`（模组侧）、`SpawnRestrictionRegistration`。
Yarn 1.21.3 属性是 `MAX_HEALTH` / `MOVEMENT_SPEED`（[yarn 1.21.3+build.2 javadoc](https://maven.fabricmc.net/docs/yarn-1.21.3%2Bbuild.2/net/minecraft/entity/attribute/EntityAttributes.html)），不要抄 1.21.1 的 `GENERIC_*`。
生成位置：`SpawnLocationTypes.ON_GROUND`（与 1.21.1 mapping 同结构），不要 `SpawnRestriction.Location`。
Yarn 1.21.3 `EntityType.Builder.build` 要 **RegistryKey**（[yarn 1.21.3 EntityType.mapping](https://github.com/FabricMC/yarn/blob/1.21.3/mappings/net/minecraft/entity/EntityType.mapping) / [javadoc](https://maven.fabricmc.net/docs/yarn-1.21.3%2Bbuild.2/net/minecraft/entity/EntityType.Builder.html)），不要抄 1.21.1 的 `build(String)`。`FabricEntityTypeBuilder.build()` 无参也不再存在，要 `build(RegistryKey)`。`dimensions` 是 `(float, float)`，不是 `EntityDimensions.changing`（那是 FabricEntityTypeBuilder 的 `dimensions(EntityDimensions)`）。

## 实体渲染器（客户端）

```java
public class ExampleModClient implements ClientModInitializer {
    @Override
    public void onInitializeClient() {
        EntityRendererRegistry.register(MY_PIG, MyPigEntityRenderer::new);
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

- 忘记 `client` entrypoint — 实体无渲染
- 在服务端调用 `EntityRendererRegistry`
- 把 26.1 文档的 `MobCategory` / `Identifier.fromNamespaceAndPath` / `BuiltInRegistries` 抄进 Yarn 1.21.3
- 忘记 `FabricDefaultAttributeRegistry` — 实体属性异常或崩溃

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | 实体通过 Registry.register() 注册 |
| `mc-datagen` | 实体 loot table JSON |
