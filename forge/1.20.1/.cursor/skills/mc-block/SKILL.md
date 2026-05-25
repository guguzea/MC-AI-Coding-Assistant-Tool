---
name: mc-block
description: Minecraft Forge 方块开发。创建方块、方块实体、方块状态属性、实体方块接口。触发词：方块、Block、BlockEntity、EntityBlock、BlockBehaviour.Properties、方块实体
platform: forge
version: "1.20.1"
dependencies: []
mappings: mcp
---

# 方块开发（Forge 1.20.1）

## 快速开始

```java
// 注册（参见 mc-registry Skill）
public static final RegistryObject<Block> MY_BLOCK = BLOCKS.register("my_block",
    () -> new Block(BlockBehaviour.Properties.of()
        .mapColor(MapColor.STONE)
        .strength(1.5f, 6.0f)
        .requiresCorrectToolForDrops()
    )
);
```

## Decision: 选择方块类型

```
IF 需要持久的 extra data（如机器存储、村民记忆）
  → 方块实体（BlockEntity）→ 实现 EntityBlock 接口

IF 只是静态显示（无状态）
  → 普通方块

IF 需要流体
  → 流体（Fluid）→ 参考 `02-block.mdc`
```

## BlockBehaviour.Properties 常用配置

```java
BlockBehaviour.Properties.of(Material.WOOD)
    .strength(1.5f, 6.0f)              // 硬度和抗爆性
    .requiresCorrectToolForDrops()       // 需要正确工具才能掉落
    .noOcclusion()                      // 不阻挡光影
    .isRedstoneConductor(...)          // 红石导体
    .isSuffocating(...)                // 窒息方块
    .isViewBlocking(...)                // 阻挡视角
    .hasPostProcess(...)               // 后处理效果
    .emissiveRendering(...)            // 自发光
    .noLootTablePoolsBuilder()         // 无掉落表
```

## Decision: 物品形态（ItemBlock）

```
IF 方块在创意模式标签中有对应物品
  → 注册同名 ItemBlock（Forge 自动关联显示）

IF 方块不应出现在物品栏（如空气、光源方块）
  → 不注册 ItemBlock
```

## EntityBlock 方块

```java
public class MyMachineBlock extends Block implements EntityBlock {
    // 返回新的方块实体实例
    @Override
    public BlockEntity newBlockEntity(BlockPos pos, BlockState state) {
        return new MyMachineBlockEntity(pos, state);
    }

    // 返回方块刻处理器（如果需要定时逻辑）
    @Nullable
    @Override
    public <T extends BlockEntity> BlockEntityTicker<T> getTicker(
            Level level, BlockState state, BlockEntityType<T> type) {
        // 仅在服务端执行
        return level.isClientSide ? null :
            (type == MyMachineBlockEntity.TYPE.get() ? MyMachineBlockEntity::tick : null);
    }
}
```

## BlockEntity 基础结构

```java
public class MyMachineBlockEntity extends BlockEntity {
    private int progress = 0;

    public MyMachineBlockEntity(BlockPos pos, BlockState state) {
        super(MyMachineBlockEntity.TYPE.get(), pos, state);
    }

    // 刻处理逻辑（服务端）
    public static <T extends BlockEntity> void tick(Level level, BlockPos pos,
            BlockState state, T blockEntity) {
        if (level.isClientSide) return;
        // 定时逻辑...
    }

    // 同步（服务端 → 客户端）
    // 1.20.1 推荐直接实现 getUpdateTag() / handleUpdateTag()
    // Forge 会自动处理数据包同步，无需手动 override getUpdatePacket()
    @Override
    public CompoundTag getUpdateTag() {
        CompoundTag nbt = super.getUpdateTag();
        nbt.putInt("progress", progress);
        return nbt;
    }

    @Override
    public void handleUpdateTag(CompoundTag nbt) {
        super.handleUpdateTag(nbt);
        this.progress = nbt.getInt("progress");
    }
}
```

## BlockState JSON 格式

文件位置：`assets/{modid}/blockstates/my_block.json`

```json
{
  "variants": {
    "": { "model": "modid:block/my_block" }
  }
}
```

```json
{
  "multipart": [
    { "when": { "facing": "north" }, "apply": { "model": "modid:block/my_block" } },
    { "when": { "facing": "east" },  "apply": { "model": "modid:block/my_block", "y": 90 } }
  ]
}
```

## 常见错误

- ❌ `BlockEntity.newBlockEntity()` 返回 null（必须返回新实例）
- ❌ 在 BlockEntity 构造函数中访问 world（world 可能为 null）
- ❌ `getTicker()` 在客户端返回非 null（tick 只应在服务端执行）
- ❌忘记 `requiresCorrectToolForDrops()` 导致任何物品都能掉落

## 参考资料

- 详细决策流和示例：参见 `02-block.mdc`

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | 方块注册后方块实体类型需要引用方块类型 |
| `mc-datagen` | 方块注册后可生成方块状态和模型 JSON |
| `mc-capability` | 方块实体可附加 Capability 存储数据 |
