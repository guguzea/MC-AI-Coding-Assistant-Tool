---
name: mc-registry
description: Minecraft Forge 注册系统。注册方块、物品、实体、方块实体等。触发词：注册、register、RegistryObject、DeferredRegister、ForgeRegistries、@Mod
platform: forge
version: "1.20.1"
dependencies: []
mappings: mcp
---

# Registry 注册系统（Forge 1.20.1）

## 快速开始

**始终使用 DeferredRegister**，这是 Forge 1.20.1 官方推荐的注册方式：

```java
// 1. 创建 DeferredRegister（通常在 mod 主类或单独的注册类中）
public static final DeferredRegister<Block> BLOCKS =
    DeferredRegister.create(ForgeRegistries.BLOCKS, MOD_ID);

// 2. 创建 RegistryObject 持有引用
public static final RegistryObject<Block> MY_BLOCK = BLOCKS.register("my_block",
    () -> new Block(BlockBehaviour.Properties.of().mapColor(MapColor.STONE))
);

// 3. 在 mod 构造函数中注册到 modEventBus
BLOCKS.register(modEventBus);
```

## Decision: 选择注册方式

```
IF 注册方块/物品/实体/Biomes/SoundEvents 等
  → 使用 DeferredRegister<T> + RegistryObject<T>

IF 注册自定义 Registry（全新注册表）
  → 使用 RegistryEvent.NewRegistry + DeferredRegister.create(ResourceKey)

IF 需要在 mod constructor 执行前引用已注册对象
  → ❌ 禁止：在静态字段初始化中引用另一个 DeferredRegister 的 RegistryObject
  → ✅ 正确：在 RegistryObject 的 lambda 内部使用 .get() 获取
```

## Decision: 常用注册表

| 注册内容 | ForgeRegistries 字段 | 备注 |
|----------|---------------------|------|
| 方块 | `ForgeRegistries.BLOCKS` | |
| 物品 | `ForgeRegistries.ITEMS` | |
| 方块实体 | `ForgeRegistries.BLOCK_ENTITY_TYPES` | |
| 实体类型 | `ForgeRegistries.ENTITY_TYPES` | |
| 生物群系 | `Registries.BIOME`（Vanilla） | 用 `ResourceKey` |
| 声音事件 | `ForgeRegistries.SOUND_EVENTS` | |
| 附魔 | `ForgeRegistries.ENCHANTMENTS` | |
| 药水 | `ForgeRegistries.POTIONS` | |
| 创造模式标签 | `Registries.CREATIVE_MODE_TAB` | Vanilla |

## 注册 ItemBlock

方块的 ItemBlock 与方块同名注册，Forge 自动关联：

```java
public static final RegistryObject<Item> MY_BLOCK_ITEM = ITEMS.register("my_block",
    () -> new BlockItem(MY_BLOCK.get(), new Item.Properties())
);
```

## 注册方块实体（BlockEntity）

```java
// 方块实现 EntityBlock
public class MyBlock extends Block implements EntityBlock {
    @Override
    public BlockEntity newBlockEntity(BlockPos pos, BlockState state) {
        return new MyBlockEntity(pos, state);
    }

    @Nullable
    @Override
    public <T extends BlockEntity> BlockEntityTicker<T> getTicker(
            Level level, BlockState state, BlockEntityType<T> type) {
        return type == MY_BLOCK_ENTITY.get() ? MyBlockEntity::tick : null;
    }
}

// 注册 BlockEntityType
public static final DeferredRegister<BlockEntityType<?>> BLOCK_ENTITIES =
    DeferredRegister.create(ForgeRegistries.BLOCK_ENTITY_TYPES, MOD_ID);

public static final RegistryObject<BlockEntityType<MyBlockEntity>> MY_BLOCK_ENTITY =
    BLOCK_ENTITIES.register("my_block",
        () -> BlockEntityType.Builder.of(MyBlockEntity::new, EXAMPLE_BLOCK.get())
            .build(null)
    );
```

## 注册实体属性

```java
// 在 mod 构造函数中注册（非 FMLCommonSetupEvent）
public static final DeferredRegister<Attribute> ATTRIBUTES =
    DeferredRegister.create(ForgeRegistries.Keys.ATTRIBUTES, MOD_ID);

public static final RegistryObject<Attribute> MY_ATTRIBUTE =
    ATTRIBUTES.register("my_attribute",
        () -> new RangedAttribute("attribute.modid.my_attribute", 100.0, 1.0, 1024.0)
    );

// 在 mod 构造函数中
ATTRIBUTES.register(modEventBus);

// 实体上使用属性
@Override
protected void registerAttributes() {
    super.registerAttributes();
    this.getAttribute(ATTRIBUTES.get("my_attribute")).ifPresent(attr ->
        this.getAttributeMap().registerAttribute(attr)
    );
}
```

## 常见错误

- ❌ 在 lambda 外引用 RegistryObject：`new BlockItem(MY_BLOCK, ...)`（此时 MY_BLOCK 为 null）
- ❌ 硬编码 registry name：`registry.register(new Block(...).setRegistryName("my_mod:my_block"))`（禁止）
- ❌ mod ID 与 mods.toml 不一致
- ❌ Registry 名称含大写或横杠：必须全小写、下划线分隔

## 参考资料

- Forge 官方文档：https://docs.minecraftforge.net/en/1.20.1/concepts/registries/
- 详细示例：参见 `forge/1.20.1/.cursor/rules/01-registry.mdc`

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-block` | 方块注册后方块实体注册需要先有方块类型 |
| `mc-item` | 物品注册后方块物品（BlockItem）需要先有方块 |
| `mc-entity` | 实体注册后方块实体类型引用实体类型 |
| `mc-datagen` | 注册完成后可通过 DataGen 生成标签和配方 |
| `mc-networking` | 自定义数据包可传输注册表数据 |
