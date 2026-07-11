---
name: mc-entity
description: Minecraft Forge 实体开发。创建生物、实体属性。
platform: forge
version: "1.18.2"
---

# 实体开发（Forge 1.18.2）

## 快速开始

```java
public static final RegistryObject<EntityType<MyEntity>> MY_ENTITY = ENTITYTYPES.register("my_entity",
    () -> EntityType.Builder.of(MyEntity::new, MobCategory.CREATURE)
        .sized(0.6 f, 1.8 f)
        .build("my_entity"));
```

## 实体属性

```java
@Override
protected void registerAttributes() {
    super.registerAttributes();
    this.getAttribute(Attributes.MAX_HEALTH).setBaseValue(20.0);
}
```

## 参考资料

参见 `04-entity.mdc`
