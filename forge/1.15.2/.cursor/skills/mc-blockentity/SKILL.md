---
name: mc-blockentity
description: Minecraft Forge 方块实体开发。TileEntity 注册、tick、数据同步。触发词：TileEntity、BlockEntityType、ITileEntityProvider、markDirty
platform: forge
version: "1.15.2"
dependencies: []
mappings: mcp
---

# 方块实体开发（Forge 1.15.2）

## 快速开始

```java
// 注册 BlockEntityType（用 DeferredRegister）
public static final DeferredRegister<BlockEntityType<?>> BLOCK_ENTITIES =
    DeferredRegister.create(ForgeRegistries.BLOCK_ENTITY_TYPES, MOD_ID);

public static final RegistryObject<BlockEntityType<MyBE>> MY_BE =
    BLOCK_ENTITIES.register("mybe",
        () -> BlockEntityType.Builder.create(MyBE::new, validBlocks).build(null)
    );

// 在 mod 构造函数中
BLOCK_ENTITIES.register(modEventBus);
```

`validBlocks` 是持有此 TileEntity 的 Block 实例集合。

## TileEntity 类结构

```java
public class MyBE extends TileEntity {
    public MyBE() {
        super(MyBEs.MY_BE.get());
    }

    // tick 逻辑
    @Override
    public void tick() {
        if (world.isRemote) return;
        // 服务端每 tick 执行一次
    }
}
```

## 关联到 Block（ITileEntityProvider）

```java
public class MyBlock extends Block implements ITileEntityProvider {
    @Override
    public TileEntity createTileEntity(BlockState state, IBlockReader world) {
        return new MyBE();
    }

    @Override
    public boolean hasTileEntity(BlockState state) {
        return true;
    }
}
```

## 数据持久化

```java
public class MyBE extends TileEntity {
    private int counter;

    @Override
    public NBTTagCompound write(NBTTagCompound compound) {
        super.write(compound);  // 必须调用 super
        compound.putInt("counter", counter);
        return compound;
    }

    @Override
    public void read(NBTTagCompound compound) {
        super.read(compound);
        counter = compound.getInt("counter");
    }
}
```

## 数据同步

```java
// BE 端
@Override
public NBTTagCompound getUpdatePacket() {
    NBTTagCompound nbt = new NBTTagCompound();
    write(nbt);
    return nbt;
}

@Override
public void onDataPacket(NetworkManager net, SPacketUpdateTileEntity pkt) {
    read(pkt.getNbtCompound());
}

// 服务端通知更新
level.notifyBlockUpdate(pos, state, state, 3);
```

## 常见错误

- ❌ `write()`/`read()` 重写后忘记调用 `super`
- ❌ 在 `read()` 中访问 world
- ❌ 忘记 `markDirty()` 标记数据已修改

## 参考资料

- 官方文档：https://docs.minecraftforge.net/en/1.15.2/

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-gui` | Container 与 TileEntity 联动 |
| `mc-networking` | 高频同步使用自定义网络包方案 |
| `mc-registry` | BlockEntityType 通过 DeferredRegister 注册 |
