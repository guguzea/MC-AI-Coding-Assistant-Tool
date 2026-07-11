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

**始终使用 DeferredRegister**，这是 Forge 1.17.1 官方推荐的注册方式：

```java
// 1. 创建 DeferredRegister
public static final DeferredRegister<Block> BLOCKS =
    DeferredRegister.create(ForgeRegistries.BLOCKS, MOD_ID);

// 2. 创建 RegistryObject 持有引用
public static final RegistryObject<Block> MY_BLOCK = BLOCKS.register("my_block",
    () -> new Block(Block.Properties.of(Material))
);

// 3. 在 mod 构造函数中注册到 modEventBus
BLOCKS.register(modEventBus);
```

## Decision: 选择注册方式

```
IF 注册方块/物品/实体/Biomes/SoundEvents 等
  → 使用 DeferredRegister<T> + RegistryObject<T>

IF 注册自定义 Registry
  → 使用 RegistryEvent.NewRegistry + DeferredRegister.create(ResourceKey)

IF 需要在 mod constructor 执行前引用已注册对象
  → ❌ 禁止
  → ✅ 正确：在 RegistryObject 的 lambda 内部使用 .get() 获取
```

## Decision: 常用注册表

| 注册内容 | ForgeRegistries 字段 | 备注 |
|----------|---------------------|------|
| 方块 | `ForgeRegistries.BLOCKS` | |
| 物品 | `ForgeRegistries.ITEMS` | |
| 方块实体 | `ForgeRegistries.BLOCKENTITIES` | |
| 实体类型 | `ForgeRegistries.ENTITYTYPES` | |
| 声音事件 | `ForgeRegistries.SOUND_EVENTS` | |
| 附魔 | `ForgeRegistries.ENCHANTMENTS` | |

## 注册 ItemBlock

```java
public static final RegistryObject<Item> MY_BLOCK_ITEM = ITEMS.register("my_block",
    () -> new BlockItem(MY_BLOCK.get(), new Item.Properties())
);
```

## 注册方块实体（BlockEntity）

```java
public class MyBlock extends Block implements EntityBlock {
    @Override
    public BlockEntity newBlockEntity(BlockPos pos, BlockState state) {
        return new MyBlockEntity(pos, state);
    }
}

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
- ❌ Registry 名称含大写或横杠

## 参考资料

- Forge 官方文档
- 详细示例：参见 `01-registry.mdc`
