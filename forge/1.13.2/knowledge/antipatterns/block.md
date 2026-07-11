# 方块相关反模式

## ❌ 在 TileEntity 构造函数中访问 world

```java
// 错误
public MyTileEntity() {
    super();
    BlockState state = world.getBlockState(pos); // ❌ world 尚未设置
}
```

**错误症状**：`NullPointerException`

**正确方案**：在 `update()` 或 `onLoad()` 等生命周期方法中访问 world

---

## ❌ TileEntity `readFromNBT`/`writeToNBT` 中访问世界数据

```java
// 错误
@Override
public void readFromNBT(NBTTagCompound compound) {
    super.readFromNBT(compound);
    BlockState state = world.getBlockState(pos); // ❌ world 可能为 null
}
```

**正确方案**：NBT 方法只处理数据序列化，不访问世界

---

## ❌ `createNewTileEntity()` 返回 null

```java
// 错误
@Override
public TileEntity createNewTileEntity(World world, int meta) {
    return null; // ❌ 必须返回新实例
}
```

**错误症状**：游戏崩溃

**正确方案**：始终返回有效的 TileEntity 实例
