---
name: entity
description: Minecraft Forge 实体开发（Forge 1.13.2）。创建生物、实体属性、AI 目标。触发词：实体、Entity、LivingEntity、EntityType、MobCategory
---

# 实体开发（Forge 1.13.2）

## 快速开始

```java
public class MyEntity extends LivingEntity {
    protected MyEntity(EntityType<?> type, World world) {
        super(type, world);
    }

    @Override
    protected void registerAttributes() {
        super.registerAttributes();
        this.getAttribute(SharedMonsterAttributes.MAX_HEALTH).setBaseValue(20.0);
    }
}

public static final EntityType<MyEntity> MY_ENTITY =
    EntityType.Builder.create(MyEntity::new, MobCategory.CREATURE)
        .size(0.6f, 1.8f)
        .trackingRange(8)
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
| 基础生物 | `LivingEntity` |
| 动物 | `AnimalEntity` |
| 投掷物 | `ThrowableEntity` |

## 常见错误

- ❌ EntityType.Builder.create() 第一个参数是构造函数引用
- ❌ 忘记 `setRegistryName()`

## 参考资料

- 详细示例：参见 `04-entity.mdc`
