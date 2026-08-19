# 实体反模式

## 错误：EntityType.Factory 引用实体实例

**症状：** 空指针或异常

```java
// ❌ 错误
EntityType.Builder.of(new MyEntity(level), MobCategory.CREATURE)...

// ✅ 正确：传入构造函数引用
EntityType.Builder.of(MyEntity::new, MobCategory.CREATURE)...
```

---

## 错误：用 LivingEntity.registerAttributes() 设原版属性

**症状：** 1.17+ 没有实例方法 `registerAttributes()`；属性未挂到 EntityType，生命/速度为 0。

**正确方案：** 静态 `createAttributes()` + `EntityAttributeCreationEvent.put`：

```java
public static AttributeSupplier.Builder createAttributes() {
    return Mob.createMobAttributes()
        .add(Attributes.MAX_HEALTH, 20.0D)
        .add(Attributes.MOVEMENT_SPEED, 0.3D)
        .add(Attributes.ATTACK_DAMAGE, 3.0D);
}

@SubscribeEvent
public static void onAttributes(EntityAttributeCreationEvent event) {
    event.put(MY_ENTITY.get(), MyEntity.createAttributes().build());
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

## 错误：getTicker 在客户端返回非 null

**症状：** 服务端逻辑在客户端执行，表现为奇怪的行为或崩溃

```java
// ❌ 错误
@Override
public <T extends BlockEntity> BlockEntityTicker<T> getTicker(...) {
    return (level, pos, state, blockEntity) -> {
        // 这段代码会在客户端执行！
        blockEntity.doServerLogic(); // 崩溃
    };
}

// ✅ 正确：仅在服务端执行
@Override
public <T extends BlockEntity> BlockEntityTicker<T> getTicker(Level level, BlockState state, BlockEntityType<T> type) {
    return level.isClientSide ? null : MyBlockEntity::tick;
}
```

---

## 错误：BlockEntity 中在构造函数访问 world

**症状：** NPE 或 world 相关数据错误

```java
// ❌ 错误
public MyBlockEntity(BlockPos pos, BlockState state) {
    super(pos, state);
    this.world = this.getLevel(); // world 可能为 null
}

// ✅ 正确：在 load() 或 onLoad() 中访问 world
@Override
public void onLoad() {
    super.onLoad();
    if (!this.level.isClientSide) {
        // 安全访问
    }
}
```

---

## ForgeRegistries 字段名（1.18.2）

```java
// ✅ 1.18.2 字段名
ForgeRegistries.ENTITYTYPES
ForgeRegistries.ATTRIBUTES
ForgeRegistries.BLOCKENTITIES
```
