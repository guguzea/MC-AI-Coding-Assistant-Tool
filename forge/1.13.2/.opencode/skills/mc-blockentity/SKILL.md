---
name: mc-blockentity
description: Minecraft Forge TileEntity 开发。TileEntity 注册、Ticker、NBT 序列化、Container 联动。触发词：TileEntity、ITickable、ITileEntityProvider、writeToNBT、readFromNBT、NBTTagCompound
platform: forge
version: "1.13.2"
dependencies: []
mappings: mcp
---

# TileEntity 开发（Forge 1.13.2）

## 快速开始

```java
// TileEntity 类
public class MyTileEntity extends TileEntity implements ITickable {
    private int counter = 0;

    public MyTileEntity() {
        super(TileEntityTypeRegistry.MY_TILE_ENTITY.get());
    }

    @Override
    public void update() {
        if (world.isRemote) return;
        counter++;
    }

    @Override
    public void writeToNBT(NBTTagCompound compound) {
        super.writeToNBT(compound);
        compound.setInteger("counter", counter);
    }

    @Override
    public void readFromNBT(NBTTagCompound compound) {
        super.readFromNBT(compound);
        counter = compound.getInteger("counter");
    }
}
```

## 关联到 Block

```java
public class MyBlock extends Block implements ITileEntityProvider {
    @Override
    public TileEntity createNewTileEntity(World world, int meta) {
        return new MyTileEntity();
    }
}
```

> **注意**：`createNewTileEntity()` 每 tick 调用，避免复杂计算；必要时用计数器隔 tick 执行。

## 数据持久化

```java
@Override
public void writeToNBT(NBTTagCompound compound) {
    super.writeToNBT(compound);  // 必须调用 super！
    compound.setInteger("counter", counter);
}

@Override
public void readFromNBT(NBTTagCompound compound) {
    super.readFromNBT(compound);  // 必须调用 super！
    counter = compound.getInteger("counter");
}
```

> **保留字段名**：`id`、`x`、`y`、`z`、`ForgeData` 不能用作自己的 key。

## 常见错误

- ❌ `writeToNBT`/`readFromNBT` 重写后忘记调用 `super`
- ❌ 在 `readFromNBT` 中访问 world（world 可能为 null）
- ❌ TileEntity 构造函数中访问 world（world 尚未设置）

## 参考资料

- 详细示例：参见 `02-block.mdc`

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-gui` | TileEntity 可与 Container 联动 |
| `mc-registry` | TileEntityType 通过 Registry 注册 |
