---
name: mc-blockentity
description: Minecraft Forge 方块实体开发。TileEntity 注册、Tick、Container/Inventory 联动、TileEntityRenderer。触发词：TileEntity、TileEntityType、hasTileEntity、createTileEntity、markDirty
platform: forge
version: "1.14.4"
dependencies: []
mappings: mcp
---

# 方块实体开发（Forge 1.14.4）

## 快速开始

```java
// 注册 TileEntityType（用 RegistryEvent）
public static final TileEntityType<MyBE> MY_BE =
    TileEntityType.Builder.create(MyBE::new, Blocks.STONE)
        .build(null);

@SubscribeEvent
public static void onTileEntityRegistry(final RegistryEvent.Register<TileEntityType> event) {
    event.getRegistry().register(
        MY_BE.setRegistryName(new ResourceLocation(MOD_ID, "mybe"))
    );
}
```

`blocks` 是持有此 TileEntity 的 Block 实例集合。

## TileEntity 类结构

```java
public class MyBE extends TileEntity {
    public MyBE() {
        super(TileEntityType.byId(0)); // 实际使用注册的 TileEntityType
    }

    // tick 逻辑（服务端）
    @Override
    public void tick() {
        if (world.isRemote) return;
        // 服务端每 tick 执行一次
    }
}
```

## 关联到 Block（hasTileEntity + createTileEntity）

```java
public class MyBlock extends Block {
    @Override
    public boolean hasTileEntity(BlockState state) {
        return true;
    }

    @Override
    public TileEntity createTileEntity(World world, BlockState state) {
        return new MyBE();
    }
}
```

**注意**：`tick()` 每 tick 调用，避免复杂计算；必要时用计数器隔 tick 执行。

## 数据持久化（writeToNBT / readFromNBT）

```java
public class MyBE extends TileEntity {
    private int counter = 0;

    @Override
    public NBTTagCompound writeToNBT(NBTTagCompound compound) {
        super.writeToNBT(compound);  // 必须调用 super！
        compound.putInt("counter", counter);
        return compound;
    }

    @Override
    public void readFromNBT(NBTTagCompound compound) {
        super.readFromNBT(compound);  // 必须调用 super！
        counter = compound.getInt("counter");
    }
}
```

> **保留字段名**：`id`、`x`、`y`、`z`、`ForgeData`、`ForgeCaps` 不能用作自己的 key。

**当数据变化时必须调用 `markDirty()`**，否则该 TileEntity 所在的 Chunk 保存时可能被跳过：

```java
counter++;
this.markDirty();
```

## 数据同步方式

### 方式 1：Chunk 加载时同步（getUpdatePacket / onDataPacket）

适用于少量静态数据：

```java
@Override
public NBTTagCompound getUpdatePacket() {
    NBTTagCompound nbt = new NBTTagCompound();
    nbt.putInt("counter", counter);
    return nbt;
}

@Override
public void onDataPacket(NetworkManager net, SPacketCustomPayload pkt) {
    readFromNBT(pkt.getNbtCompound());
}
```

### 方式 2：手动标记同步

在服务端通知更新：

```java
world.notifyBlockUpdate(pos, state, state, 3);
```

## TileEntity 与 Container 联动

TileEntity 实现 `IInventory` 接口：

```java
public class MyBE extends TileEntity implements IInventory {
    private ItemStack[] inventory = new ItemStack[9];

    @Override
    public int getSizeInventory() { return 9; }

    @Override
    public ItemStack getStackInSlot(int index) {
        return inventory[index];
    }

    @Override
    public ItemStack decrStackSize(int index, int count) {
        ItemStack stack = getStackInSlot(index);
        if (!stack.isEmpty()) {
            if (stack.getCount() <= count) {
                setInventorySlotContents(index, ItemStack.EMPTY);
            } else {
                stack.shrink(count);
            }
        }
        return stack;
    }

    @Override
    public void setInventorySlotContents(int index, ItemStack stack) {
        inventory[index] = stack;
        markDirty();
    }
}
```

## 常见错误

- ❌ `writeToNBT` / `readFromNBT` 重写后忘记调用 `super`（保留字段被覆盖）
- ❌ 数据变化后忘记调用 `markDirty()`
- ❌ `TileEntityType.Builder.of()` 第二个参数传 null → 至少传空集
- ❌ 方块忘记重写 `hasTileEntity()` 返回 true
- ❌ 在 `readFromNBT` 中访问 world（world 可能为 null）

## 参考资料

- 官方文档：https://docs.minecraftforge.net/en/1.14.4/

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-gui` | Container/IInventory 与 TileEntity 联动 |
| `mc-networking` | 高频同步使用自定义网络包方案 |
| `mc-registry` | TileEntityType 通过 RegistryEvent 注册 |
