# 方块开发反模式

## 注册相关

### ❌ `new Block()` 直接使用（未注册）

```java
// 错误
public static final Block MY_BLOCK = new Block(Block.Properties.create(Material.STONE));
```

**症状**：方块在世界显示为缺失方块（紫色黑色格子）。

**正确方案**：通过 `DeferredRegister<Block>` 注册。

```java
public static final DeferredRegister<Block> BLOCKS =
    new DeferredRegister<>(ForgeRegistries.BLOCKS, MOD_ID);

public static final RegistryObject<Block> MY_BLOCK =
    BLOCKS.register("my_block", () -> new Block(Block.Properties.create(Material.STONE)));
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

### ❌ `createTileEntity()` 返回 null

```java
// 错误
@Override
public TileEntity createTileEntity(World world, BlockState state) {
    return null; // ❌ 必须返回新实例
}
```

**症状**：`NullPointerException` 或方块无法交互。

**正确方案**：

```java
@Override
public TileEntity createTileEntity(World world, BlockState state) {
    return new MyTileEntity();
}
```

---

## TileEntity 相关

### ❌ 在构造函数中访问 world

```java
// 错误
public MyTileEntity() {
    super();
    World world = this.getWorld(); // ❌ world 可能为 null
}
```

**症状**：`NullPointerException`，方块实体数据异常。

**正确方案**：在 `onLoad()` 中处理需要 world 的逻辑。

```java
@Override
public void onLoad() {
    super.onLoad();
    if (this.world != null && !this.world.isRemote) {
        // 基于世界的初始化逻辑
    }
}
```

---

### ❌ 在 `read()` 中读取世界数据

```java
// 错误
@Override
public void read(NBTTagCompound compound) {
    super.read(compound);
    BlockState state = world.getBlockState(pos); // ❌ world 可能为 null
}
```

**症状**：`NullPointerException`。

**正确方案**：在 `onLoad()` 中处理。

---

## 错误：未设置 harvestLevel

**症状：** 方块被破坏时总是掉落（无论工具类型），工具不消耗耐久。

**正确方案：**

```java
Block.Properties.create(Material.STONE)
    .hardnessAndResistance(3.0f, 3.0f)
    .harvestLevel(2)  // 需要铁镐
    .harvestTool(ToolType.PICKAXE)  // 需要镐子
```

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
