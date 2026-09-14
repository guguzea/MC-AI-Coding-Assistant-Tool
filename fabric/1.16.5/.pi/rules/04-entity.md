---
description: 04 — 实体开发
---

# 04 — 实体开发

> 适用版本：Fabric 1.16.5

---

## 约束

### 核心原则

- 实体必须在 `Registry.register(Registry.ENTITY_TYPE, id, type)` 中注册
- 实体渲染器在客户端单独注册（`EntityRendererRegistry`）
- 实体类继承 `Entity` 或其子类
- `fabric.mod.json` 的 `client` entrypoint 写入口类名（不是实体 ID）

---

## Decision Flow

### Decision: 选择实体类型

```
IF 静态实体（不移动、不交互）
  → EntityType.Builder.create(SpawnGroup.MISC, Entity::new)

IF 有行为实体（动物、怪物）
  → EntityType.Builder.create(SpawnGroup.CREATURE, MyEntity::new)

IF 需要在服务端和客户端分别初始化
  → 拆分 ModInitializer 为 client entrypoints

IF 仅客户端渲染（如护甲、held item）
  → 不需要注册实体，使用 LayerRenderer 或 FeatureRenderer
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
    .setDimensions(0.9f, 1.4f)
    .build("my_pig")
);
```

Yarn 1.16.5 的生成分类枚举是 `SpawnGroup`。属性用 `FabricDefaultAttributeRegistry.register`。
Vanilla `EntityType.Builder` 尺寸方法是 `setDimensions(float,float)`，`build` 需要 String id（官方 Yarn javadoc）；不要写 `.size()` 或无参 `build()`。

## 实体渲染器（客户端）

```java
// 单独的客户端入口点（推荐）
// 包：net.fabricmc.fabric.api.client.rendereregistry.v1
// 1.16.5：register 是**实例方法**（摘要 modifiers=["public"]，非 static），第二参是 EntityRendererRegistry.Factory；
// 该类构造器 modifiers=["private"] ⇒ 只能经静态入口字段取，但字段名本仓未取证
//   （loader-api 摘要不记字段，实测 821 类 fields 计数 0），下面的 INSTANCE 是按 1.14.4 同形推断的写法。
//   落地前用该档 fabric-api jar 跑 ingest_loader_api + query_loader_api 核字段名（TODO(未核实)）。
// 1.17+ 才是静态 EntityRendererRegistry.register(...) + 原版 EntityRendererFactory（不要跨档套用）
public class ExampleModClient implements ClientModInitializer {
    @Override
    public void onInitializeClient() {
        EntityRendererRegistry.INSTANCE.register(MY_PIG, (dispatcher, context) ->
            new PigEntityRenderer(dispatcher)
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

- ❌ 忘记在 `fabric.mod.json` 中添加客户端 entrypoint — 实体无渲染
- ❌ 实体渲染器在服务端执行 — `EntityRendererRegistry` 仅在客户端有效
- ❌ 把 Mojmap 的 `MobCategory` 抄进 Yarn 1.16.5（本档是 `SpawnGroup`）
- ❌ 在 `onInitialize()` 外注册 — 注册不会生效

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | 实体通过 Registry.register() 注册 |
| `mc-item` | 实体可以掉落物品 |
| `mc-gui` | 实体可以打开 GUI |
