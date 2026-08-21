---
name: mc-blockentity
description: Minecraft Forge 方块实体开发。TileEntity 注册、ITickableTileEntity、Container 联动、TileEntityRenderer。触发词：TileEntity、TileEntityType、hasTileEntity、createTileEntity、markDirty、getUpdateTag
platform: forge
version: "1.15.2"
dependencies: []
mappings: mcp
---

# 方块实体开发（Forge 1.15.2）

## 快速开始

```java
public static final DeferredRegister<TileEntityType<?>> TILE_ENTITIES =
    DeferredRegister.create(ForgeRegistries.TILE_ENTITIES, MOD_ID);

public static final RegistryObject<TileEntityType<MyTE>> MY_TE =
    TILE_ENTITIES.register("myte",
        () -> TileEntityType.Builder.create(MyTE::new, validBlocks).build(null)
    );

TILE_ENTITIES.register(modEventBus);
```

不要 `BlockEntityType`（1.17+ Mojmap）。`Builder.create` 不是 `of`。

## TileEntity 类结构

```java
public class MyTE extends TileEntity implements ITickableTileEntity {
    public MyTE() {
        super(MY_TE.get());
    }

    @Override
    public void tick() {
        if (world == null || world.isRemote) return;
    }
}
```

不要在无 `ITickableTileEntity` 的类上写 `tick()`——普通 `TileEntity` 没有这个方法。

## 关联到 Block

本档没有 `EntityBlock`。也不要 `ITileEntityProvider`（1.12 接口）。

```java
public class MyBlock extends Block {
    @Override
    public boolean hasTileEntity(BlockState state) {
        return true;
    }

    @Override
    public TileEntity createTileEntity(BlockState state, IBlockReader world) {
        return MY_TE.get().create();
    }
}
```

## 数据持久化（write / read）

1.13+ MCP 用 `CompoundNBT`，不是 1.12 的 `NBTTagCompound`。

```java
@Override
public CompoundNBT write(CompoundNBT nbt) {
    nbt = super.write(nbt);
    nbt.putInt("counter", counter);
    return nbt;
}

@Override
public void read(CompoundNBT nbt) {
    super.read(nbt);
    counter = nbt.getInt("counter");
}
```

数据变化后 `markDirty()`。

## 数据同步

`getUpdatePacket()` 返回的是数据包，不是 NBT。

```java
@Override
public CompoundNBT getUpdateTag() {
    return this.write(new CompoundNBT());
}

@Override
public SUpdateTileEntityPacket getUpdatePacket() {
    return new SUpdateTileEntityPacket(this.pos, -1, this.getUpdateTag());
}

@Override
public void onDataPacket(NetworkManager net, SUpdateTileEntityPacket pkt) {
    this.read(pkt.getNbtCompound());
}

world.notifyBlockUpdate(pos, state, state, 3);
```

## 常见错误

- ❌ `write` / `read` 忘记 `super`
- ❌ 在 `read` 里访问尚未就绪的 `world`
- ❌ 忘记 `markDirty()`
- ❌ `getUpdatePacket` 返回 `CompoundNBT`
- ❌ `EntityBlock` / `getTicker` / `BlockEntityType`

## 参考资料

- Forge 1.15.x TileEntities 文档（`search_forge_docs`）

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-gui` | Container 与 TileEntity 联动 |
| `mc-networking` | 高频同步使用自定义网络包 |
| `mc-registry` | `TileEntityType` 注册到 `ForgeRegistries.TILE_ENTITIES` |
