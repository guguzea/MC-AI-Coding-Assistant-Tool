# 方块开发反模式

## 注册相关

### ❌ 在静态字段中直接创建方块（未注册）

```java
// 错误
public static final Block MY_BLOCK = new Block(Material.STONE);
```

**症状**：方块在世界显示为缺失方块（紫色黑色格子）。

**正确方案**：通过 `RegistryEvent.Register<Block>` 注册。

```java
@Mod.EventBusSubscriber(modid = MOD_ID)
public class ModBlocks {
    @SubscribeEvent
    public static void register(RegistryEvent.Register<Block> event) {
        event.getRegistry().register(
            new Block(Material.STONE)
                .setRegistryName(MOD_ID, "my_block")
        );
    }
}
```

---

### ❌ `createTileEntity()` 返回 null

```java
// 错误
@Override
public TileEntity createTileEntity(World world, IBlockState state) {
    return null; // ❌ 必须返回新实例
}
```

**症状**：`NullPointerException` 或方块无法交互。

**正确方案**：

```java
@Override
public TileEntity createTileEntity(World world, IBlockState state) {
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

**症状**：`NullPointerException`，TileEntity 数据异常。

**正确方案**：在 `update()` 中处理需要 world 的逻辑。

```java
@Override
public void update() {
    if (!this.world.isRemote) {  // ✅ 安全
        // 基于世界的逻辑
    }
}
```

---

### ❌ TileEntity 忘记注册

**症状**：`TileEntity for my_block does not exist`

```java
// 方块实现了 createTileEntity() 但没有注册
```

**正确方案**：

```java
GameRegistry.registerTileEntity(MyTileEntity.class, new ResourceLocation(MOD_ID, "my_tile"));
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
