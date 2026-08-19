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
EntityType.Builder.create(new MyEntity(...), ...) // ❌ 第一参是 Class，第二参是 Function<World, T>

```

**正确方案**：传入实体 Class 与 `World -> Entity` 工厂（Forge 1.13.2 javadoc）

```java
EntityType.Builder.create(MyEntity.class, MyEntity::new)
```
