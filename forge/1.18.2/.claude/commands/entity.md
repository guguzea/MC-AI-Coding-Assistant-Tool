# 实体相关命令（Forge 1.18.2）

## 注册 EntityType

```java
public static final DeferredRegister<EntityType<?>> ENTITYTYPES =
    DeferredRegister.create(ForgeRegistries.ENTITYTYPES, MOD_ID);

public static final RegistryObject<EntityType<MyEntity>> MY_ENTITY = ENTITYTYPES.register("my_entity",
    () -> EntityType.Builder.of(MyEntity::new, MobCategory.CREATURE)
        .sized(0.6f, 1.8f)
        .build("my_entity")
);
```

## 实体属性

```java
@Override
protected void registerAttributes() {
    super.registerAttributes();
    this.getAttribute(Attributes.MAX_HEALTH).setBaseValue(20.0);
    this.getAttribute(Attributes.MOVEMENT_SPEED).setBaseValue(0.3);
}
```

## 常见错误

- ❌ `EntityType.Builder.of()` 第一个参数是构造函数引用
- ❌ 忘记 `ENTITYTYPES.register(modEventBus)`

## 参考资料

参见 `04-entity.mdc`
