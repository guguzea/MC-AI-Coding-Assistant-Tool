---
name: mc-blockentity
description: Minecraft Forge 方块实体开发。BlockEntity 注册、Ticker、ContainerData/Menu 联动、BlockEntityRenderer。触发词：BlockEntity、BlockEntityType、EntityBlock、getTicker、saveAdditional、load、getUpdateTag、getUpdatePacket
platform: forge
version: "1.20.1"
dependencies: []
mappings: mcp
---

# 方块实体开发（Forge 1.20.1）

## 快速开始

```java
// 注册 BlockEntityType（用 DeferredRegister）
public static final DeferredRegister<BlockEntityType<?>> BLOCK_ENTITY_TYPES =
    DeferredRegister.create(ForgeRegistries.BLOCK_ENTITY_TYPES, MOD_ID);

public static final RegistryObject<BlockEntityType<MyBE>> MY_BE =
    BLOCK_ENTITY_TYPES.register("mybe",
        () -> BlockEntityType.Builder.of(MyBE::new, validBlocks).build(null)
    );

// 在 mod 构造函数中
BLOCK_ENTITY_TYPES.register(modEventBus);
```

`validBlocks` 是持有此 BlockEntity 的 Block 实例集合：`Set.of(MyBlock.INSTANCE)` 或 `ImmutableSet.of(...)`。

## BlockEntity 类结构

```java
public class MyBE extends BlockEntity {
    public MyBE(BlockPos pos, BlockState state) {
        super(MY_BE.get(), pos, state);
    }

    // 可选：ticker 逻辑
    public static void tick(Level level, BlockPos pos, BlockState state, MyBE be) {
        if (level.isClientSide) return;
        // 服务端每 tick 执行一次
    }
}
```

## 关联到 Block（EntityBlock 接口）

```java
public class MyBlock extends Block implements EntityBlock {
    @Override
    public BlockEntity newBlockEntity(BlockPos pos, BlockState state) {
        return new MyBE(pos, state);
    }

    // 可选：ticker（服务端每 tick 驱动 BE）
    @Nullable
    @Override
    public <T extends BlockEntity> BlockEntityTicker<T> getTicker(
            Level level, BlockState state, BlockEntityType<T> type) {
        return type == MyBlockEntities.MY_BE.get() ? MyBE::tick : null;
    }
}
```

**注意**：`getTicker` 每 tick 调用，避免复杂计算；必要时用计数器隔 tick 执行。

## 数据持久化（saveAdditional / load）

```java
public class MyBE extends BlockEntity {
    private int counter;

    @Override
    protected void saveAdditional(CompoundTag tag) {
        super.saveAdditional(tag);  // 必须调用 super！
        tag.putInt("counter", counter);
    }

    @Override
    public void load(CompoundTag tag) {
        super.load(tag);  // 必须调用 super！
        counter = tag.getInt("counter");
    }
}
```

> **保留字段名**：`id`、`x`、`y`、`z`、`ForgeData`、`ForgeCaps` 不能用作自己的 key。

**当数据变化时必须调用 `setChanged()`**，否则该 BE 所在的 Chunk 保存时可能被跳过：

```java
counter++;
this.setChanged();
```

## 三种数据同步方式

### 方式 1：Chunk 加载时同步（getUpdateTag）

适用于少量静态数据（与 Menu 无关）：

```java
// BE 端
@Override
public CompoundTag getUpdateTag() {
    CompoundTag tag = super.getUpdateTag();  // 必须先调 super
    tag.putInt("counter", counter);
    return tag;
}

// 客户端收到时（可选重写）
@Override
public void handleUpdateTag(CompoundTag tag) {
    super.handleUpdateTag(tag);
    counter = tag.getInt("counter");
}
```

### 方式 2：方块更新时同步（getUpdatePacket）

适用于需要即时同步的动态数据：

```java
// BE 端
@Override
public CompoundTag getUpdateTag() {
    return saveWithoutMetadata();
}

@Override
public Packet<ClientGamePacketListener> getUpdatePacket() {
    return ClientboundBlockEntityDataPacket.create(this);
}

// 服务端通知更新（任何地方调用）
level.sendBlockUpdated(pos, state, state, Block.UPDATE_CLIENTS);
```

### 方式 3：自定义网络包（最优方案）

适用于大数据量或高频同步。参见 `mc-networking` Skill，使用 `SimpleChannel` + `PacketDistributor`。

## BlockEntity 与 Container/Menu 联动

BlockEntity 持有 `SimpleContainerData`，通过 Menu 的 MenuProvider 注入：

```java
// BlockEntity
public class MyBE extends BlockEntity {
    private final SimpleContainerData data = new SimpleContainerData(3);

    public SimpleContainerData getData() { return data; }
}

// Menu
public class MyMenu extends AbstractContainerMenu {
    public MyMenu(int windowId, Inventory inv, FriendlyByteBuf extraData) {
        super(MY_MENU.get(), windowId);
        BlockEntity be = extraData.readBlockPos()...;  // 读取位置
        this.addDataSlots(be.getData());              // 共享同一个 data 实例
    }
}

// MenuProvider
public class MyMenuProvider implements MenuProvider {
    private final BlockEntity be;
    // ...
    @Override
    public AbstractContainerMenu createMenu(int windowId, Inventory inv, Player player) {
        return new MyMenu(windowId, inv, player, be);
    }
}
```

> `be.getData()` 与 Menu 的 `addDataSlots(data)` 共享同一实例，数据变化自动同步到客户端。无需手动同步。

## BlockEntityRenderer（BER，客户端）

在 `EntityRenderersEvent.RegisterRenderers` 中注册：

```java
@Mod.EventBusSubscriber(modid = MOD_ID, bus = Mod.EventBusSubscriber.Bus.MOD, value = Dist.CLIENT)
public class ClientSetup {
    @SubscribeEvent
    public static void registerRenderers(EntityRenderersEvent.RegisterRenderers event) {
        event.registerBlockEntityRenderer(
            MyBlockEntities.MY_BE.get(),
            MyBER::new
        );
    }
}
```

```java
public class MyBER extends BlockEntityRenderer<MyBE> {
    public MyBER(EntityRendererProvider.Context context) {
        super(context);
    }

    @Override
    public void render(MyBE be, float partialTick, PoseStack poseStack,
                       MultiBufferSource buffer, int combinedLight, int combinedOverlay) {
        // poseStack.translate/rotate 定位
        // VertexConsumer 绘制
    }
}
```

> 不需要在 BER 类上加 `@OnlyIn(Dist.CLIENT)` —— `RegisterRenderers` 事件只在客户端触发。

## Decision: 选择同步方式

```
IF 数据量小、静态（每次打开 GUI 不变）
  → getUpdateTag / handleUpdateTag（Chunk 加载时同步）

IF 需要实时动态同步
  → getUpdatePacket / ClientboundBlockEntityDataPacket（方块更新时同步）

IF 高频或大数据量
  → 自定义网络包（见 mc-networking Skill）

IF 数据属于 Container/Menu 展示用
  → 使用 SimpleContainerData + Menu 共享实例（自动同步，无需手动写）
```

## 常见错误

- ❌ `saveAdditional` / `load` 重写后忘记调用 `super`（保留字段被覆盖）
- ❌ 数据变化后忘记调用 `setChanged()`
- ❌ `getTicker` 中写复杂计算（每 tick 执行，会导致卡顿）
- ❌ 用 `BlockEntityType.Builder.of(MyBE::new, blocks)` 时 `blocks` 传 null（至少传空集）
- ❌ `EntityRenderers.register()`（旧 API）→ 正确：`EntityRenderersEvent.RegisterRenderers`

## 参考资料

- 官方文档：https://docs.minecraftforge.net/en/1.20.1/blockentities
- BER 文档：https://docs.minecraftforge.net/en/1.20.1/blockentities/ber

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-gui` | Container/Menu 与 BlockEntity 通过 SimpleContainerData 联动 |
| `mc-networking` | 高频同步使用自定义网络包方案 |
| `mc-registry` | BlockEntityType 通过 DeferredRegister 注册 |
