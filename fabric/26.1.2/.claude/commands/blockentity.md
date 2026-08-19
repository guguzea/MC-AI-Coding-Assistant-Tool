---
name: mc-blockentity
description: Fabric 26.1.2 方块实体。BlockEntity、EntityBlock、FabricBlockEntityTypeBuilder。触发词：BlockEntity、getTicker、saveAdditional
platform: fabric
version: "26.1.2"
dependencies: []
mappings: official
---

# 方块实体（Fabric 26.1.2）

文档：`26.1.2/develop_blocks_block-entities`。Mojmap。示例页用 `CounterBlock` / `CounterBlockEntity` / `ModBlockEntities`。

## 快速开始

1. 子类 `BlockEntity`
2. 方块实现 `EntityBlock`（文档：两种写法）
3. `FabricBlockEntityTypeBuilder.create(factory, block).build()` 后 `Registry.register`（loader-api 已核 `create` / `addBlock` / `build`）
4. 存档：`saveAdditional`（文档 Saving and Loading）
5. 观察者同步：文档 Syncing Data 节，不要只改服务端字段
6. 每 tick：`EntityBlock.getTicker`

```java
BlockEntityType<CounterBlockEntity> TYPE = Registry.register(
    BuiltInRegistries.BLOCK_ENTITY_TYPE,
    Identifier.fromNamespaceAndPath("examplemod", "counter"),
    FabricBlockEntityTypeBuilder.create(CounterBlockEntity::new, COUNTER_BLOCK).build()
);
```

`Identifier.fromNamespaceAndPath` 与本档 `mc-registry` 一致。factory 签名以 `FabricBlockEntityTypeBuilder.Factory` 为准。

## Decision Flow

```
IF 方块要存独立数据
  → BlockEntity + EntityBlock + FabricBlockEntityTypeBuilder
IF 要跨重启保留
  → saveAdditional / 对应 load
IF 要其它玩家看见变化
  → 文档 Syncing Data，不要只 setChanged
IF 每 tick 逻辑
  → getTicker；不要在方块 randomTick 里假装 BE tick
```

## 常见错误

- ❌ Yarn `BlockEntityType.Builder.create`
- ❌ 1.16 `hasTileEntity` / `createTileEntity`
- ❌ 忘记注册 BlockEntityType

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-block` | 方块实现 EntityBlock |
| `mc-gui` | 打开菜单 |
| `mc-networking` | 复杂同步走 CustomPacketPayload |
