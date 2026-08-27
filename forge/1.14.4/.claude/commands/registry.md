---
name: mc-registry
description: Minecraft Forge 注册系统。注册方块、物品、实体、方块实体等。触发词：注册、register、RegistryObject、DeferredRegister、ForgeRegistries、@Mod
platform: forge
version: "1.14.4"
dependencies: []
mappings: mcp
---

# Registry 注册系统（Forge 1.14.4）

## 快速开始

**始终使用 DeferredRegister**，这是 Forge 1.14.4 官方文档推荐的注册方式：

```java
// 1. 创建 DeferredRegister（通常在 mod 主类或单独的注册类中）
public static final DeferredRegister<Block> BLOCKS =
    new DeferredRegister<>(ForgeRegistries.BLOCKS, MOD_ID);

// 2. 创建 RegistryObject 持有引用
public static final RegistryObject<Block> MY_BLOCK = BLOCKS.register("my_block",
    () -> new Block(Block.Properties.create(Material.ROCK).hardnessAndResistance(1.5f, 6.0f))
);

// 3. 在 mod 构造函数中注册到 modEventBus
BLOCKS.register(modEventBus);
```

## Decision: 选择注册方式

```
IF 注册方块/物品/实体/Biomes/SoundEvents 等
  → 使用 DeferredRegister<T> + RegistryObject<T>

IF 注册自定义 Registry（全新注册表）
  → 使用 RegistryEvent.NewRegistry + RegistryBuilder（本档没有 ForgeRegistries.Keys）

IF 需要在 mod constructor 执行前引用已注册对象
  → ❌ 禁止：在静态字段初始化中引用另一个 DeferredRegister 的 RegistryObject
  → ✅ 正确：在 RegistryObject 的 lambda 内部使用 .get() 获取
```

## Decision: 常用注册表

| 注册内容 | ForgeRegistries 字段 | 备注 |
|----------|---------------------|------|
| 方块 | `ForgeRegistries.BLOCKS` | |
| 物品 | `ForgeRegistries.ITEMS` | |
| 方块实体 | `ForgeRegistries.TILE_ENTITIES` | |
| 实体类型 | `ForgeRegistries.ENTITIES` | |
| 生物群系 | `ForgeRegistries.BIOMES` | 1.14 字段直接在 ForgeRegistries 上 |
| 声音事件 | `ForgeRegistries.SOUND_EVENTS` | |
| 附魔 | `ForgeRegistries.ENCHANTMENTS` | |
| 药水 | `ForgeRegistries.POTIONS` | |
| 创造模式标签 | `ItemGroup` | Vanilla |

## 注册 BlockItem

方块的 BlockItem 与方块同名注册：

```java
public static final RegistryObject<Item> MY_BLOCK_ITEM = ITEMS.register("my_block",
    () -> new BlockItem(MY_BLOCK.get(), new Item.Properties())
);
```

## 注册方块实体（TileEntity）

本档没有 `EntityBlock` / `getTicker`。详见 `mc-blockentity`。

```java
public class MyBlock extends Block {
    @Override
    public boolean hasTileEntity(BlockState state) { return true; }

    @Override
    public TileEntity createTileEntity(BlockState state, IBlockReader world) {
        return MY_TE.get().create();
    }
}

public static final DeferredRegister<TileEntityType<?>> TILE_ENTITIES =
    new DeferredRegister<>(ForgeRegistries.TILE_ENTITIES, MOD_ID);

public static final RegistryObject<TileEntityType<MyTE>> MY_TE =
    TILE_ENTITIES.register("my_te",
        () -> TileEntityType.Builder.create(MyTE::new, EXAMPLE_BLOCK.get()).build(null)
    );
```

## 注册实体属性

本档**没有** `ForgeRegistries.ATTRIBUTES`。在实体里重写 `registerAttributes()`，用 `SharedMonsterAttributes`：

```java
@Override
protected void registerAttributes() {
    super.registerAttributes();
    this.getAttribute(SharedMonsterAttributes.MAX_HEALTH).setBaseValue(20.0D);
    this.getAttribute(SharedMonsterAttributes.MOVEMENT_SPEED).setBaseValue(0.25D);
}
```

## 常见错误

- ❌ 在 lambda 外引用 RegistryObject：`new BlockItem(MY_BLOCK, ...)`（此时 MY_BLOCK 为 null）
- ❌ 硬编码 registry name：`registry.register(new Block(...).setRegistryName("my_mod:my_block"))`（禁止）
- ❌ mod ID 与 mods.toml 不一致
- ❌ Registry 名称含大写或横杠：必须全小写、下划线分隔

## 参考资料

- Forge 官方文档：https://docs.minecraftforge.net/en/1.14.x/concepts/registries/
- 详细示例：参见 `01-registry.mdc`

## 扩展点

| 配合 Skill | 协作说明 |
|-------------|-----------|
| `mc-block` | 方块注册后方块实体注册需要先有方块类型 |
| `mc-item` | 物品注册后方块物品（BlockItem）需要先有方块 |
| `mc-entity` | 实体注册后方块实体类型引用实体类型 |
| `mc-datagen` | 注册完成后可通过 DataGen 生成标签和配方 |
| `mc-networking` | 自定义数据包可传输注册表数据 |
