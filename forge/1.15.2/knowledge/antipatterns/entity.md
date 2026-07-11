# 实体反模式

## 错误：EntityType.Factory 引用实体实例

**症状：** 空指针或异常

```java
// ❌ 错误
EntityType.Builder.create(() -> new MyEntity(world), EntityClassification.CREATURE)...

// ✅ 正确：传入构造函数引用
EntityType.Builder.create(MyEntity::new, EntityClassification.CREATURE)...
```

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
    this.getAttribute(SharedMonsterAttributes.ATTACK_KNOCKBACK).setBaseValue(0.5);
}
```

---

## 错误：TileEntity 中在构造函数访问 world

**症状：** NPE 或 world 相关数据错误

```java
// ❌ 错误
public MyTileEntity() {
    super(ModTileEntities.MY_TILE_ENTITY.get());
    World world = this.getWorld(); // world 可能为 null
}

// ✅ 正确：在 readFromNBT 或 onLoad 中访问 world
@Override
public void readFromNBT(NBTTagCompound nbt) {
    super.readFromNBT(nbt);
    // 安全访问 world
}
```
