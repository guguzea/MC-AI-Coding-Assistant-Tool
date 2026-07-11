# 实体相关反模式

## ❌ Entity 构造函数中注册属性

```java
// 错误
public MyEntity(EntityType<?> type, World world) {
    super(type, world);
    this.getAttribute(SharedMonsterAttributes.MAX_HEALTH).setBaseValue(100.0); // ❌ 太早
}
```

**错误症状**：`NullPointerException` 或属性不生效

**正确方案**：在 `registerAttributes()` 方法中注册属性

```java
@Override
protected void registerAttributes() {
    super.registerAttributes();
    this.getAttribute(SharedMonsterAttributes.MAX_HEALTH).setBaseValue(100.0);
}
```

---

## ❌ EntityType.Builder.create() 第一个参数是实例

```java
// 错误
EntityType.Builder.create(new MyEntity(...), MobCategory.CREATURE) // ❌ 应该是构造函数引用
```

**正确方案**：传入构造函数引用

```java
EntityType.Builder.create(MyEntity::new, MobCategory.CREATURE)
```
