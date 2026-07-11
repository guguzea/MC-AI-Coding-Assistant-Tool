---
name: mc-blockentity
description: Minecraft Forge TileEntity 开发（Forge 1.13.2）。TileEntity 注册、Ticker、NBT 序列化。
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
}
```

## 参考资料

- 详细示例：参见 `02-block.mdc`
