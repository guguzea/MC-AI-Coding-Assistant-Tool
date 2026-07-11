# 方块开发反模式

## 注册相关

### ❌ `new Block()` 直接使用（未注册）

```java
// 错误
public static final Block MY_BLOCK = new Block(Properties.create(Material.STONE));
```

**症状**：方块在世界显示为缺失方块（紫色黑色格子）。

**正确方案**：通过 `DeferredRegister<Block>` 注册。

```java
public static final DeferredRegister<Block> BLOCKS =
    DeferredRegister.create(ForgeRegistries.BLOCKS, MOD_ID);

public static final RegistryObject<Block> MY_BLOCK =
    BLOCKS.register("my_block", () -> new Block(Properties.create(Material.STONE)));
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

## TileEntity 相关

### ❌ 在构造函数中访问 world

```java
// 错误
public MyTileEntity() {
    super(ModTileEntities.MY_TILE_ENTITY.get());
    World level = this.getWorld(); // ❌ world 可能为 null
}
```

**症状**：`NullPointerException`，方块实体数据异常。

**正确方案**：在 `readFromNBT`/`writeToNBT` 中处理，或在 `onLoad` 中处理。

---

### ❌ 在 `readFromNBT()` 中读取世界数据

```java
// 错误
@Override
public void readFromNBT(NBTTagCompound nbt) {
    super.readFromNBT(nbt);
    BlockState state = world.getBlockState(pos); // ❌ world 可能为 null
}
```

**症状**：`NullPointerException`。

**正确方案**：在 `markDirty()` 或单独的同步方法中处理需要世界数据的逻辑。

---

## 资源文件相关

### 资源路径大小写错误

```json
// 错误
"textures/block/MyBlock.png"  // ❌ 大写

// 正确
"textures/block/my_block.png"  // 全部小写
```

**症状**：材质不加载，显示紫色黑色格子。
