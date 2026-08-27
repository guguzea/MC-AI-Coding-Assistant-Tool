---
name: mc-entity
description: Minecraft Forge 实体开发。创建生物、实体属性、AI 任务、实体渲染器。触发词：实体、Entity、EntityLiving、EntityType、RenderingRegistry
platform: forge
version: "1.13.2"
dependencies: []
mappings: mcp
---

# 实体开发（Forge 1.13.2）

本档 MCP：**`EntityLiving` / `EntityCreature`**。没有 `LivingEntity` / `Goal` / `SwimGoal`（javadoc 1.13.2-25.0.220）。

## 快速开始

```java
public class MyEntity extends EntityCreature {
    protected MyEntity(EntityType<?> type, World world) {
        super(type, world);
    }

    @Override
    protected void registerAttributes() {
        super.registerAttributes();
        this.getAttribute(SharedMonsterAttributes.MAX_HEALTH).setBaseValue(20.0D);
    }

    @Override
    protected void initEntityAI() {
        this.tasks.addTask(0, new EntityAISwimming(this));
        this.tasks.addTask(1, new EntityAIAttackMelee(this, 1.0D, true));
    }
}

public static EntityType<MyEntity> MY_ENTITY;

@SubscribeEvent
public void onEntitiesRegistry(RegistryEvent.Register<EntityType<?>> event) {
    MY_ENTITY = EntityType.Builder.create(MyEntity.class, MyEntity::new)
            .tracker(8, 3, true)
            .build("my_entity");
    MY_ENTITY.setRegistryName(new ResourceLocation(MOD_ID, "my_entity"));
    event.getRegistry().register(MY_ENTITY);
}
```

`Builder.create` 是 `(Class, Function<World, T>)`，没有 `EntityClassification` 参数。

## Decision: 选择实体基类

| 场景 | 基类 |
|------|------|
| 近战/目标 AI | `EntityCreature` / `EntityMob`（`EntityAIAttackMelee` 要 Creature） |
| 有生命但不挂 Creature AI | `EntityLiving` |
| 投掷物 | 原版投掷物基类（打开 javadoc，不要抄 1.14 `ThrowableEntity`） |
| 物品 | `EntityItem` |

## 渲染（客户端，FMLClientSetupEvent）

```java
RenderingRegistry.registerEntityRenderingHandler(MyEntity.class, MyEntityRenderer::new);
```

参数是 **Class**，不是 `EntityType`。`RenderLiving` + `RenderManager` + `getEntityTexture`。

## 常见错误

- ❌ `LivingEntity` / `registerGoals` / `SwimGoal`
- ❌ `registerEntityRenderingHandler(MY_ENTITY, factory)` 传 EntityType
- ❌ 忘记 `setRegistryName`

详见 `04-entity.mdc`。
