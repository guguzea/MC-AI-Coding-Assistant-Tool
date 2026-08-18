---
name: mc-entity
description: Fabric 实体开发。EntityType、EntityCategory、initAttributes。触发词：实体、Entity、EntityType
platform: fabric
version: "1.14.4"
dependencies: []
mappings: yarn
---

# 实体开发（Fabric 1.14.4）

1.14.x 没有 `FabricDefaultAttributeRegistry`。属性在实体类里重写 `initAttributes()`。不要编造 `EntityAttributeRegistry`，也不要用 Forge `RegistryObject`。

```java
public class MyPigEntity extends PigEntity {
    public MyPigEntity(EntityType<? extends MyPigEntity> type, World world) {
        super(type, world);
    }

    @Override
    protected void initAttributes() {
        super.initAttributes();
        this.getAttributeInstance(EntityAttributes.MAX_HEALTH).setBaseValue(20.0);
    }
}

public static final EntityType<MyPigEntity> MY_PIG = Registry.register(
    Registry.ENTITY_TYPE,
    new Identifier(MOD_ID, "my_pig"),
    EntityType.Builder.<MyPigEntity>create(MyPigEntity::new, EntityCategory.CREATURE)
        .size(0.9f, 1.4f)
        .build(null)
);
```

渲染器在 `ClientModInitializer` 里 `EntityRendererRegistry.register`。
