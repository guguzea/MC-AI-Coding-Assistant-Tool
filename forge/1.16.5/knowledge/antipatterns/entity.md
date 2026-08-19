# 实体反模式

## 错误：EntityType.Factory 引用实体实例

**症状：** 空指针或异常

```java
// ❌ 错误
EntityType.Builder.of(new MyEntity(world), EntityClassification.CREATURE)...

// ✅ 正确：传入构造函数引用
EntityType.Builder.of(MyEntity::new, EntityClassification.CREATURE)...
```

---

## 错误：EntityType.Factory 类型不匹配

**症状：** 编译错误或 ClassCastException

```java
// ❌ 错误
EntityType.Builder.of(MyEntity::new, EntityClassification.CREATURE)
    .build("my_entity");
// build(String) 签名不匹配
```

**说明：** `EntityType.Builder.of()` 的第一个参数是 `EntityType.IFactory<Entity>`，即 `BiFunction<EntityType<?>, World, Entity>`。

---

## 错误：用 LivingEntity.registerAttributes() 设原版属性

**症状：** 1.16.5 没有实例方法 `registerAttributes()`；属性未挂到 EntityType，生命/速度为 0。

**正确方案：** 静态工厂 + `EntityAttributeCreationEvent.put`（第二参是 `AttributeModifierMap`）：

```java
public static AttributeModifierMap.MutableAttribute createAttributes() {
    return MobEntity.createMobAttributes()
        .add(Attributes.MAX_HEALTH, 20.0D)
        .add(Attributes.MOVEMENT_SPEED, 0.3D)
        .add(Attributes.ATTACK_DAMAGE, 3.0D);
}

@SubscribeEvent
public static void onAttributes(EntityAttributeCreationEvent event) {
    event.put(MY_ENTITY.get(), MyEntity.createAttributes().create());
}
```

---

## 错误：LivingEntityRenderer（不存在）

**症状：** 编译错误

```java
// ❌ 错误
public class MyEntityRenderer extends LivingEntityRenderer { ... }

// ✅ 正确
public class MyEntityRenderer extends LivingEntityRenderer<MyEntity, MyEntityModel<MyEntity>> { ... }
```

---

## 错误：TileEntity 中在构造函数访问 world

**症状：** NPE 或 world 相关数据错误

```java
// ❌ 错误
public MyTileEntity() {
    super(ModTileEntities.MY_TILE_ENTITY.get());
    this.world = this.getWorld(); // world 可能为 null
}

// ✅ 正确：在 validate() 或其他回调中访问 world
@Override
public void validate() {
    super.validate();
    if (!this.world.isRemote) {
        // 安全访问
    }
}
```
