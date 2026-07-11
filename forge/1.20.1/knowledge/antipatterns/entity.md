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

## 错误：EntityType.Factory 类型不匹配

**症状：** 编译错误或 ClassCastException

```java
// ❌ 错误
EntityType.Builder.of(MyEntity::new, MobCategory.CREATURE)
    .build("my_entity");
// build(String) 签名不匹配
```

**说明：** `EntityType.Builder.of()` 的第一个参数是 `EntityType.IFactory<Entity>`，即 `BiFunction<EntityType<?>, Level, Entity>`。

---

## 错误：属性未在 registerAttributes 中设置默认值

**症状：** 实体的最大生命值、移动速度为 0 或异常

```java
// ❌ 忘记设置基础值
@Override
protected void registerAttributes() {
    super.registerAttributes();
    // 没有设置 max health → 默认 0
}
```

**正确方案：**
```java
@Override
protected void registerAttributes() {
    super.registerAttributes();
    this.getAttribute(Attributes.MAX_HEALTH).setBaseValue(20.0);
    this.getAttribute(Attributes.MOVEMENT_SPEED).setBaseValue(0.3);
    this.getAttribute(Attributes.ATTACK_DAMAGE).setBaseValue(3.0);
    this.getAttribute(Attributes.ATTACK_KNOCKBACK).setBaseValue(0.5);
}
```

---

## 错误：在 EntityType 中使用 fireImmune() 但未正确处理

**症状：** 实体在火焰中不受伤害但无法正常生成

```java
// ✅ 配合正确的 EntityType 设置
EntityType.Builder.of(MyEntity::new, MobCategory.MONSTER)
    .fireImmune()
    .sized(0.6f, 1.8f)
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
