---
name: mc-blockentity
description: Minecraft Forge TileEntity 开发。TileEntity 注册、ITickable、NBT 序列化、Container 联动。触发词：TileEntity、ITickable、hasTileEntity、createTileEntity、write、read、NBTTagCompound
platform: forge
version: "1.13.2"
dependencies: []
mappings: mcp
---

# TileEntity 开发（Forge 1.13.2）

## 快速开始

构造必须传入 `TileEntityType`。每 tick 实现 `net.minecraft.util.ITickable#tick`（不是 1.12 的 `update()`）。

```java
public class MyTileEntity extends TileEntity implements ITickable {
    private int counter = 0;

    public MyTileEntity() {
        super(MY_TILE_ENTITY_TYPE);
    }

    @Override
    public void tick() {
        if (world == null || world.isRemote) return;
        counter++;
    }

    @Override
    public NBTTagCompound write(NBTTagCompound compound) {
        compound = super.write(compound);
        compound.setInt("counter", counter);
        return compound;
    }

    @Override
    public void read(NBTTagCompound compound) {
        super.read(compound);
        counter = compound.getInt("counter");
    }
}
```

## 关联到 Block

`ITileEntityProvider` 已 `@Deprecated`。优先：

```java
public class MyBlock extends Block {
    @Override
    public boolean hasTileEntity(IBlockState state) {
        return true;
    }

    @Override
    public TileEntity createTileEntity(IBlockState state, IBlockReader world) {
        return new MyTileEntity();
    }
}
```

若仍实现已弃用接口，签名是 `createNewTileEntity(IBlockReader)`，不是 `(World, int meta)`。这些方法在创建 TE 时调用，不是每 tick。

## 数据持久化

`write` 必须返回 `NBTTagCompound`。读写用 `setInt` / `getInt`（不是 `setInteger` / `putInt`）。

> **保留字段名**：`id`、`x`、`y`、`z`、`ForgeData` 不能用作自己的 key。

数据变化后 `markDirty()`。

## 常见错误

- ❌ `write`/`read` 重写后忘记调用 `super`，或 `write` 写成 void
- ❌ 在 `read` 中访问 world（world 可能为 null）
- ❌ TileEntity 构造函数中访问 world
- ❌ `writeToNBT` / `CompoundNBT` / `ITickableTileEntity`

## 参考资料

- 详细示例：参见 `02-block.mdc`

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-gui` | TileEntity 可与 Container 联动 |
| `mc-registry` | TileEntityType 通过 RegistryEvent 注册 |
