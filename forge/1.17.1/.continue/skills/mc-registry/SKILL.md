---
name: mc-registry
description: Minecraft Forge 注册系统。注册方块、物品、实体、方块实体等。触发词：注册、register、RegistryObject、DeferredRegister、ForgeRegistries、@Mod
platform: forge
version: "1.17.1"
dependencies: []
mappings: parchment
---

# Registry 注册系统（Forge 1.17.1）

## 快速开始

**始终使用 DeferredRegister**：

```java
public static final DeferredRegister<Block> BLOCKS =
    DeferredRegister.create(ForgeRegistries.BLOCKS, MOD_ID);

public static final RegistryObject<Block> MY_BLOCK = BLOCKS.register("my_block",
    () -> new Block(Block.Properties.of(Material.STONE))
);

BLOCKS.register(modEventBus);
```

## Decision: 常用注册表

| 注册内容 | ForgeRegistries 字段 | 备注 |
|----------|---------------------|------|
| 方块 | `ForgeRegistries.BLOCKS` | |
| 物品 | `ForgeRegistries.ITEMS` | |
| 方块实体 | `ForgeRegistries.BLOCKENTITIES` | |
| 实体类型 | `ForgeRegistries.ENTITYTYPES` | |
| 声音事件 | `ForgeRegistries.SOUND_EVENTS` | |

## 注册 ItemBlock

```java
public static final RegistryObject<Item> MY_BLOCK_ITEM = ITEMS.register("my_block",
    () -> new BlockItem(MY_BLOCK.get(), new Item.Properties())
);
```

## 注册方块实体（BlockEntity）

```java
public static final DeferredRegister<BlockEntityType<?>> BLOCKENTITIES =
    DeferredRegister.create(ForgeRegistries.BLOCKENTITIES, MOD_ID);

public static final RegistryObject<BlockEntityType<MyBlockEntity>> MY_BLOCK_ENTITY =
    BLOCKENTITIES.register("my_block",
        () -> BlockEntityType.Builder.of(MyBlockEntity::new, EXAMPLE_BLOCK.get())
            .build(null)
    );
```

## 常见错误

- ❌ 在 lambda 外引用 RegistryObject
- ❌ 硬编码 registry name
- ❌ mod ID 与 mods.toml 不一致

## 参考资料

- Forge 官方文档
- 详细示例：参见 `01-registry.mdc`
