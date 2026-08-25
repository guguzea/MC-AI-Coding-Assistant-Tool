[DONOR_SKILL 禁止直接抄写]
本 Skill 正文来自 fabric/1.21.3，仅作结构/流程提示，不是 1.21.8 官方 API。不得直接使用 donor 正文里的类名/方法。先 search_fabric_docs(version=1.21.8) 核对类名/方法签名（不要用 version=1.21.3），对不上就改口官方文档、禁止照抄。Yarn 档互捐，禁止把 26.1.2 mojmap 当本档。

---

---
name: mc-entity
description: Fabric 实体开发。EntityType、FabricEntityTypeBuilder、SpawnGroup。触发词：实体、Entity、EntityType、SpawnRestriction
platform: fabric
version: "1.21.8"
dependencies: []
mappings: yarn
---

# 实体开发（Fabric 1.21.3）

> 入库 `develop_entities_first-entity` 常指向 **latest Mojmap**（`PathfinderMob` / `EntityRenderState` / `addAdditionalSaveData`）。本档 Yarn，不要抄那页类名。属性用 `FabricDefaultAttributeRegistry.register`（loader-api 已核）。
> Yarn 1.21.3：`EntityAttributes.MAX_HEALTH`（无 GENERIC_）、`SpawnLocationTypes.ON_GROUND`、`FabricEntityTypeBuilder.build(RegistryKey)`。

## 快速开始

```java
// 1. 创建实体类
public class MyPigEntity extends PigEntity {
    public MyPigEntity(EntityType<? extends MyPigEntity> type, World world) {
        super(type, world);
    }
}

// 2. 注册实体类型
private static final EntityType<MyPigEntity> MY_PIG =
    Registry.register(
        Registries.ENTITY_TYPE,
        Identifier.of(MOD_ID, "my_pig"),
        FabricEntityTypeBuilder.create(SpawnGroup.CREATURE, MyPigEntity::new)
            .dimensions(EntityDimensions.changing(0.9f, 1.4f))
            .trackable(8, 3)
            .build(RegistryKey.of(RegistryKeys.ENTITY_TYPE, Identifier.of(MOD_ID, "my_pig")))
    );

// 3. 在 onInitialize() 中设置属性
@Override
public void onInitialize() {
    FabricDefaultAttributeRegistry.register(MY_PIG,
        MobEntity.createMobAttributes()
            .add(EntityAttributes.MAX_HEALTH, 20.0)
            .add(EntityAttributes.MOVEMENT_SPEED, 0.25)
    );
}
```

## Decision: 选择实体类型

```
IF 有行为实体（动物、怪物）
  → 继承对应实体类（如 AnimalEntity、MonsterEntity）

IF 静态实体（不移动）
  → EntityType.Builder.create(Entity::new, SpawnGroup.MISC)

IF 需要在世界中自然生成
  → 设置 SpawnRestriction
```

## 实体渲染器（客户端）

```java
public class ExampleModClient implements ClientModInitializer {
    @Override
    public void onInitializeClient() {
        // 包：net.fabricmc.fabric.api.client.rendering.v1（静态 register）
        EntityRendererRegistry.register(MY_PIG, PigEntityRenderer::new);
    }
}
```

## Spawn Restriction（生成限制）

```java
@Override
public void onInitialize() {
    SpawnRestriction.register(
        MY_PIG,
        SpawnLocationTypes.ON_GROUND,
        Heightmap.Type.MOTION_BLOCKING_NO_LEAVES,
        MyPigEntity::canSpawn
    );
}
```

## 常见错误

- ❌忘记在客户端 entrypoint 注册渲染器 — 实体显示为紫色
- ❌忘记设置 SpawnRestriction — 实体无法自然生成
- ❌ EntityDimensions 使用 `changing` vs `fixed` 错误 — 碰撞异常
- ❌抄 `SpawnRestriction.Location` 或 `GENERIC_MAX_HEALTH` — 本档是 `SpawnLocationTypes` / `MAX_HEALTH`
- ❌ `FabricEntityTypeBuilder.build()` 无参 — 本档要 `build(RegistryKey)`
- ❌在 `onInitialize()` 外注册 — 注册不生效

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | 实体通过 Registry.register() 注册 |
| `mc-mixin` | Mixin 用于修改实体行为 |
| `mc-datagen` | DataGen 生成实体语言和 loot table |
