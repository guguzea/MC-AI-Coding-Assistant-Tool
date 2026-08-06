---
name: mc-entity
description: Minecraft Forge 实体开发。创建生物、实体属性、AI 目标、实体渲染器。触发词：实体、Entity、LivingEntity、EntityType、MobCategory、RenderingRegistry
platform: forge
version: "1.13.2"
dependencies: []
mappings: mcp
---

# 实体开发（Forge 1.13.2）

## 快速开始

```java
// 定义实体类
public class MyEntity extends LivingEntity {
    protected MyEntity(EntityType<?> type, World world) {
        super(type, world);
    }

    @Override
    protected void registerAttributes() {
        super.registerAttributes();
        this.getAttribute(SharedMonsterAttributes.MAX_HEALTH).setBaseValue(20.0);
        this.getAttribute(SharedMonsterAttributes.MOVEMENT_SPEED).setBaseValue(0.3);
    }

    @Override
    protected void registerGoals() {
        super.registerGoals();
        this.goalSelector.addGoal(0, new SwimGoal(this));
        this.goalSelector.addGoal(1, new MeleeAttackGoal(this, 1.0, true));
    }
}

// 注册 EntityType
public static final EntityType<MyEntity> MY_ENTITY =
    EntityType.Builder.create(MyEntity::new, MobCategory.CREATURE)
        .size(0.6f, 1.8f)
        .trackingRange(8)
        .updateInterval(3)
        .fireImmune()
        .build("my_entity");

@SubscribeEvent
public void onEntitiesRegistry(RegistryEvent.Register<EntityType<?>> event) {
    event.getRegistry().register(MY_ENTITY.setRegistryName(
        new ResourceLocation(MOD_ID, "my_entity")
    ));
}
```

## Decision: 选择实体基类

| 场景 | 基类 |
|------|------|
| 基础生物（动物/怪物） | `AnimalEntity`（支持繁殖） |
| 站立型实体 | `LivingEntity` |
| 投掷物（雪球、末影珍珠） | `ThrowableEntity` |
| 物品实体 | `ItemEntity` |
| 矿车/船只 | `AbstractMinecartEntity` / `BoatEntity` |

## EntityRenderer 注册（客户端）

```java
// 在客户端初始化中注册
public class ClientSetup {
    public static void register() {
        RenderingRegistry.registerEntityRenderingHandler(
            MY_ENTITY,
            MyEntityRenderer::new
        );
    }
}

// 渲染器
public class MyEntityRenderer extends RenderLiving<MyEntity> {
    public MyEntityRenderer(EntityRendererManager manager) {
        super(manager, new MyEntityModel(), 0.5f);
    }

    @Override
    protected ResourceLocation getEntityTexture(MyEntity entity) {
        return new ResourceLocation(MOD_ID, "textures/entity/my_entity.png");
    }
}
```

## 常见错误

- ❌ EntityType.Builder.create() 第一个参数是构造函数引用，不是 Entity 实例
- ❌ 忘记 `setRegistryName()`（实体不注册）
- ❌ `RenderingRegistry.registerEntityRenderingHandler()`（旧 API）→ 正确：`RenderingRegistry.registerEntityRenderingHandler()`

## 参考资料

- 详细示例：参见 `04-entity.mdc`

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | 实体类型通过 RegistryEvent.Register<EntityType> 注册 |
| `mc-capability` | 实体可附加 Capability |
