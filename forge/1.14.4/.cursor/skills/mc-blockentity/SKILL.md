---
name: mc-blockentity
description: Minecraft Forge 方块实体开发。TileEntity 注册、ITickableTileEntity、Container 联动、TileEntityRenderer。触发词：TileEntity、TileEntityType、hasTileEntity、createTileEntity、markDirty、getUpdateTag
platform: forge
version: "1.14.4"
dependencies: []
mappings: mcp
---

# 方块实体开发（Forge 1.14.4）

## 快速开始

```java
public static final DeferredRegister<TileEntityType<?>> TILE_ENTITIES =
    new DeferredRegister<>(ForgeRegistries.TILE_ENTITIES, MOD_ID);

public static final RegistryObject<TileEntityType<MyTE>> MY_TE =
    TILE_ENTITIES.register("myte",
        () -> TileEntityType.Builder.create(MyTE::new, validBlocks).build(null)
    );

// 在 mod 构造函数中
TILE_ENTITIES.register(modEventBus);
```

`validBlocks` 是绑定此 TileEntity 的 Block（`TileEntityType.Builder#create` 为 varargs）。不要 `BlockEntityType.Builder.of`（邻版）。

## TileEntity 类结构

构造函数**没有** `BlockPos` / `BlockState`（那是 1.17+）。

```java
public class MyTE extends TileEntity implements ITickableTileEntity {
    public MyTE() {
        super(MY_TE.get());
    }

    @Override
    public void tick() {
        if (world == null || world.isRemote) return;
        // 服务端每 tick
    }
}
```

## 关联到 Block（hasTileEntity / createTileEntity）

本档**没有** `EntityBlock` / `getTicker` / `BlockEntityTicker`。

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

需要每 tick 逻辑时让 TileEntity 实现 `ITickableTileEntity`，不要在 Block 上写 `getTicker`。

## 数据持久化（write / read）

```java
public class MyTE extends TileEntity {
    private int counter;

    @Override
    public CompoundNBT write(CompoundNBT nbt) {
        nbt = super.write(nbt);  // 必须调用 super
        nbt.putInt("counter", counter);
        return nbt;
    }

    @Override
    public void read(CompoundNBT nbt) {
        super.read(nbt);  // 必须调用 super
        counter = nbt.getInt("counter");
    }
}
```

> **保留字段名**：`id`、`x`、`y`、`z`、`ForgeData`、`ForgeCaps` 不能用作自己的 key。

数据变化后必须 `markDirty()`，否则 Chunk 保存时可能跳过：

```java
counter++;
this.markDirty();
```

不要用 1.17+ 的 `saveAdditional` / `load(BlockState, tag)` / `setChanged()`（`setChanged` 是后续映射名）。

## 三种数据同步方式

### 方式 1：Chunk 加载时同步（getUpdateTag）

```java
@Override
public CompoundNBT getUpdateTag() {
    return this.write(new CompoundNBT());
}

@Override
public void handleUpdateTag(CompoundNBT tag) {
    this.read(tag);
}
```

### 方式 2：方块更新时同步（getUpdatePacket）

```java
@Override
public SUpdateTileEntityPacket getUpdatePacket() {
    return new SUpdateTileEntityPacket(this.pos, -1, this.getUpdateTag());
}

@Override
public void onDataPacket(NetworkManager net, SUpdateTileEntityPacket pkt) {
    this.handleUpdateTag(pkt.getNbtCompound());
}

// 服务端通知更新
world.notifyBlockUpdate(pos, state, state, 3);
```

### 方式 3：自定义网络包（最优方案）

大数据量或高频同步。参见 `mc-networking` Skill，使用 `SimpleChannel` + `PacketDistributor`。

## TileEntity 与 Container 联动

TileEntity 持有 `IIntArray`（或手写同步字段），通过 `NetworkHooks.openGui` 打开 GUI。详见 `mc-gui`。

> 容器同步字段与 Menu 共享同一实例时，变化会自动同步。无需为进度条再写自定义包。

## TileEntityRenderer（TER，客户端）

1.14 用 `ClientRegistry.bindTileEntityRenderer`，不要 `EntityRenderersEvent.RegisterRenderers`（1.17+）。

```java
@Mod.EventBusSubscriber(modid = MOD_ID, bus = Mod.EventBusSubscriber.Bus.MOD, value = Dist.CLIENT)
public class ClientSetup {
    @SubscribeEvent
    public static void onClientSetup(FMLClientSetupEvent event) {
        ClientRegistry.bindTileEntityRenderer(MY_TE.get(), MyTER::new);
    }
}
```

## Decision: 选择同步方式

```
IF 数据量小、静态（每次打开 GUI 不变）
  → getUpdateTag / handleUpdateTag（Chunk 加载时同步）

IF 需要实时动态同步
  → getUpdatePacket / SUpdateTileEntityPacket（方块更新时同步）

IF 高频或大数据量
  → 自定义网络包（见 mc-networking Skill）

IF 数据属于 Container 展示用
  → IIntArray + Container 共享实例（自动同步）
```

## 常见错误

- ❌ `write` / `read` 重写后忘记调用 `super`
- ❌ 数据变化后忘记 `markDirty()`
- ❌ `tick()` 里写复杂计算（每 tick 执行会卡顿）
- ❌ `Builder.create(MyTE::new, blocks)` 的 `blocks` 传 null
- ❌ `EntityBlock` / `newBlockEntity(BlockPos, BlockState)` / `getTicker`（1.17+）
- ❌ `EntityRenderersEvent.RegisterRenderers`（1.17+）

## 参考资料

- Forge 1.14.4 文档：TileEntities（`search_forge_docs` → `tileentities_tileentity`）

## 扩展点

| 配合 Skill | 协作说明 |
|-------------|-----------|
| `mc-gui` | Container 与 TileEntity 通过 IIntArray 联动 |
| `mc-networking` | 高频同步使用自定义网络包 |
| `mc-registry` | TileEntityType 通过 DeferredRegister 注册到 `TILE_ENTITIES` |
