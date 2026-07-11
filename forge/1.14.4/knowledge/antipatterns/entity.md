# 实体反模式

## 错误：EntityType.Factory 引用实体实例

**症状：** 空指针或异常

```java
// ❌ 错误
EntityType.Builder.create(new MyEntity(world), MobCategory.CREATURE)...

// ✅ 正确：传入构造函数引用
EntityType.Builder.create(MyEntity::new, MobCategory.CREATURE)...
```

---

## 错误：EntityType.Factory 类型不匹配

**症状：** 编译错误或 ClassCastException

```java
// ❌ 错误
EntityType.Builder.create(MyEntity::new, MobCategory.CREATURE)
    .build("my_entity");
// build(String) 签名不匹配
```

**说明：** `EntityType.Builder.create()` 的第一个参数是 `EntityType.IFactory<Entity>`，即 `BiFunction<EntityType<?>, World, Entity>`。

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
    this.getAttribute(SharedMonsterAttributes.MAX_HEALTH).setBaseValue(20.0);
    this.getAttribute(SharedMonsterAttributes.MOVEMENT_SPEED).setBaseValue(0.3);
    this.getAttribute(SharedMonsterAttributes.ATTACK_DAMAGE).setBaseValue(3.0);
}
```

---

## 错误：LivingEntityRenderer（不存在）

**症状：** 编译错误

```java
// ❌ 错误
public class MyEntityRenderer extends LivingEntityRenderer { ... }

// ✅ 正确
public class MyEntityRenderer extends LivingRenderer<MyEntity, MyEntityModel<MyEntity>> { ... }
```

---

## 错误：getTicker 在客户端返回非 null

**症状：** 服务端逻辑在客户端执行，表现为奇怪的行为或崩溃

```java
// ❌ 错误
@Override
public <T extends TileEntity> void tick(Level level, BlockPos pos, BlockState state, T blockEntity) {
    // 这段代码会在客户端执行！
}

// ✅ 正确：仅在服务端执行
@Override
public <T extends TileEntity> void tick(Level level, BlockPos pos, BlockState state, T blockEntity) {
    if (level.isRemote) return;
    // 服务端逻辑
}
```

---

## 错误：TileEntity 中在构造函数访问 world

**症状：** NPE 或 world 相关数据错误

```java
// ❌ 错误
public MyTileEntity() {
    super();
    this.world = this.getWorld(); // world 可能为 null
}

// ✅ 正确：在 onLoad() 或 markDirty() 中访问 world
@Override
public void onLoad() {
    super.onLoad();
    if (!this.world.isRemote) {
        // 安全访问
    }
}
```
