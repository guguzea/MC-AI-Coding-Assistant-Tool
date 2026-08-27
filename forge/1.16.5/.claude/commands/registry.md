---
name: mc-registry
description: Minecraft Forge 注册系统。注册方块、物品、实体、方块实体等。触发词：注册、register、RegistryObject、DeferredRegister、ForgeRegistries、@Mod
platform: forge
version: "1.16.5"
dependencies: []
mappings: parchment
---

# Registry 注册系统（Forge 1.16.5）

## 快速开始

**始终使用 DeferredRegister**，这是 Forge 1.16.5 官方推荐的注册方式：

```java
// 1. 创建 DeferredRegister（通常在 mod 主类或单独的注册类中）
public static final DeferredRegister<Block> BLOCKS =
    DeferredRegister.create(ForgeRegistries.BLOCKS, MOD_ID);

// 2. 创建 RegistryObject 持有引用
public static final RegistryObject<Block> MY_BLOCK = BLOCKS.register("my_block",
    () -> new Block(Block.Properties.of(Material.STONE))
);

// 3. 在 mod 构造函数中注册到 modEventBus
BLOCKS.register(modEventBus);
```

## Decision: 选择注册方式

```
IF 注册方块/物品/实体/SoundEvents 等
  → 使用 DeferredRegister<T> + RegistryObject<T>

IF 需要在 mod constructor 执行前引用已注册对象
  → ❌ 禁止：在静态字段初始化中引用另一个 DeferredRegister 的 RegistryObject
  → ✅ 正确：在 RegistryObject 的 lambda 内部使用 .get() 获取
```

## Decision: 常用注册表

| 注册内容 | ForgeRegistries 字段 | 备注 |
|----------|---------------------|------|
| 方块 | `ForgeRegistries.BLOCKS` | |
| 物品 | `ForgeRegistries.ITEMS` | |
| 方块实体 | `ForgeRegistries.TILE_ENTITIES` | 字段名仍是 TILE_ENTITIES |
| 实体类型 | `ForgeRegistries.ENTITIES` | 注意是 ENTITIES |
| 声音事件 | `ForgeRegistries.SOUND_EVENTS` | |
| 附魔 | `ForgeRegistries.ENCHANTMENTS` | |
| 药水 | `ForgeRegistries.POTIONS` | |
| 创造模式标签 | `ItemGroup` | |

## 注册 ItemBlock

方块的 ItemBlock 与方块同名注册，Forge 自动关联：

```java
public static final RegistryObject<Item> MY_BLOCK_ITEM = ITEMS.register("my_block",
    () -> new BlockItem(MY_BLOCK.get(), new Item.Properties())
);
```

## 注册方块实体（BlockEntity）

本档没有 `EntityBlock` / `ServerTicker`。详见 `mc-blockentity`。

```java
public class MyBlock extends Block {
    @Override
    public boolean hasTileEntity(BlockState state) { return true; }

    @Override
    public BlockEntity createTileEntity(BlockState state, BlockGetter world) {
        return MY_BE.get().create();
    }
}

public static final DeferredRegister<BlockEntityType<?>> TILE_ENTITIES =
    DeferredRegister.create(ForgeRegistries.TILE_ENTITIES, MOD_ID);

public static final RegistryObject<BlockEntityType<MyBE>> MY_BE =
    TILE_ENTITIES.register("my_be",
        () -> BlockEntityType.Builder.of(MyBE::new, EXAMPLE_BLOCK.get()).build(null)
    );
```

## 注册实体属性

自定义 `Attribute` 可用 `DeferredRegister.create(ForgeRegistries.ATTRIBUTES, MOD_ID)`（1.16 已有该字段）。
**原版实体属性映射**用 `EntityAttributeCreationEvent.put`（第二参是 `AttributeModifierMap`）。不要 `LivingEntity.registerAttributes()`。

```java
public static final DeferredRegister<Attribute> ATTRIBUTES =
    DeferredRegister.create(ForgeRegistries.ATTRIBUTES, MOD_ID);

// mod 总线：EntityAttributeCreationEvent（不要 LivingEntity.registerAttributes）
@SubscribeEvent
public static void onAttributes(EntityAttributeCreationEvent event) {
    event.put(MY_ENTITY.get(), MyEntity.createAttributes().create());
}
```

## 常见错误

- ❌ 在 lambda 外引用 RegistryObject：`new BlockItem(MY_BLOCK, ...)`（此时 MY_BLOCK 为 null）
- ❌ 硬编码 registry name：`registry.register(new Block(...).setRegistryName(...))`（禁止）
- ❌ mod ID 与 mods.toml 不一致
- ❌ Registry 名称含大写或横杠：必须全小写、下划线分隔

## 参考资料

- Forge 官方文档：https://docs.minecraftforge.net/en/1.16.5/gettingstarted/
- 详细示例：参见 `01-registry.mdc`
