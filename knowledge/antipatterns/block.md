# 方块开发反模式

## 注册相关

### ❌ `new Block()` 直接使用（未注册）

```java
// 错误
public static final Block MY_BLOCK = new Block(Properties.of(Material.STONE));
```

**症状**：方块在世界显示为缺失方块（紫色黑色格子）。

**正确方案**：通过 `DeferredRegister<Block>` 注册。

```java
public static final DeferredRegister<Block> BLOCKS =
    DeferredRegister.create(ForgeRegistries.BLOCKS, MOD_ID);

public static final RegistryObject<Block> MY_BLOCK =
    BLOCKS.register("my_block", () -> new Block(Properties.of(Material.STONE)));
```

---

### ❌ `setRegistryName()` 方式注册（已过时）

```java
// 错误
event.getRegistry().register(
    new Block(...).setRegistryName(new ResourceLocation(MOD_ID, "my_block"))
);
```

**症状**：代码可编译但 `setRegistryName()` 是遗留 API，不推荐。

**正确方案**：使用 `DeferredRegister`。

---

### ❌ `newBlockEntity()` 返回 null

```java
// 错误
@Override
public BlockEntity newBlockEntity(BlockPos pos, BlockState state) {
    return null; // ❌ 必须返回新实例
}
```

**症状**：`NullPointerException` 或方块无法交互。

**正确方案**：

```java
@Override
public BlockEntity newBlockEntity(BlockPos pos, BlockState state) {
    return new MyBlockEntity(pos, state);
}
```

---

## BlockEntity 相关

### ❌ 在构造函数中访问 world

```java
// 错误
public MyBlockEntity(BlockPos pos, BlockState state) {
    super(ModBlockEntities.MY_BLOCK_ENTITY.get(), pos, state);
    Level level = this.getLevel(); // ❌ world 可能为 null
    if (level.getBlockState(pos).isAir()) { ... }
}
```

**症状**：`NullPointerException`，方块实体数据异常。

**正确方案**：在 `setLevel()` 回调中处理需要 world 的逻辑。

```java
@Override
public void setLevel(Level level) {
    super.setLevel(level);
    if (level != null && !level.isClientSide) {
        // 基于世界的初始化逻辑
    }
}
```

---

### ❌ `getTicker()` 在客户端返回非 null

```java
// 错误
@Override
public <T extends BlockEntity> BlockEntityTicker<T> getTicker(
        Level level, BlockState state, BlockEntityType<T> type) {
    return MyBlockEntity::tick; // ❌ 客户端也会执行 tick
}
```

**症状**：客户端执行服务端逻辑，可能导致数据不同步或崩溃。

**正确方案**：tick 只在服务端执行。

```java
@Override
public <T extends BlockEntity> BlockEntityTicker<T> getTicker(
        Level level, BlockState state, BlockEntityType<T> type) {
    return level.isClientSide ? null : MyBlockEntity::tick;
}
```

---

### ❌ 在 `load()` 中读取世界数据

```java
// 错误
@Override
public void load(CompoundTag nbt) {
    super.load(nbt);
    BlockState state = level.getBlockState(pos); // ❌ level 可能为 null
}
```

**症状**：`NullPointerException`。

**正确方案**：在 `setLevel()` 中处理。

---

## 资源文件相关

### ❌ 资源路径大小写错误

```json
// 错误
"textures/block/MyBlock.png"  // ❌ 大写

// 正确
"textures/block/my_block.png"  // 全部小写
```

**症状**：材质不加载，显示紫色黑色格子。
