---
name: blockentity
description: Minecraft Forge TileEntity 开发（Forge 1.13.2）。TileEntity 注册、Ticker、NBT 序列化。触发词：TileEntity、ITickable、ITileEntityProvider
---

# TileEntity 开发（Forge 1.13.2）

## 快速开始

```java
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

## 常见错误

- ❌ `writeToNBT`/`readFromNBT` 重写后忘记调用 `super`
- ❌ 在构造函数中访问 world

## 参考资料

- 详细示例：参见 `02-block.mdc`
