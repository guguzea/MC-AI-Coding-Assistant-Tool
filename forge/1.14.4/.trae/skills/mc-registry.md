---
name: mc-registry
description: Minecraft Forge 注册系统。注册方块、物品、实体、TileEntity 等。触发词：注册、register、RegistryEvent、ForgeRegistries、@Mod
platform: forge
version: "1.14.4"
dependencies: []
mappings: mcp
---

# Registry 注册系统（Forge 1.14.4）

## 快速开始

**使用 RegistryEvent**，这是 Forge 1.14.4 的标准注册方式：

```java
// 1. 在事件类中注册
@Mod.EventBusSubscriber(modid = MOD_ID)
public static class RegistryEvents {
    // 2. 使用 @SubscribeEvent 监听 RegistryEvent
    @SubscribeEvent
    public static void onBlocksRegistry(final RegistryEvent.Register<Block> event) {
        IForgeRegistry<Block> registry = event.getRegistry();
        // 3. 必须使用 .setRegistryName()
        registry.register(
            new Block(Block.Properties.create(Material.STONE))
                .setRegistryName(new ResourceLocation(MOD_ID, "my_block"))
        );
    }

    @SubscribeEvent
    public static void onItemsRegistry(final RegistryEvent.Register<Item> event) {
        event.getRegistry().register(
            new Item(new Item.Properties().maxStackSize(64))
                .setRegistryName(new ResourceLocation(MOD_ID, "my_item"))
        );
    }
}
```

## Decision: 选择注册方式

```
IF 注册方块/物品/实体/声音等
  → 使用 RegistryEvent.Register<T>（标准方式）

IF 使用 DeferredRegister（可选，但功能有限）
  → 注意：Forge 1.14.4 的 DeferredRegister 功能有限

IF 注册自定义 Registry（全新注册表）
  → 使用 RegistryEvent.NewRegistry + RegistryBuilder

IF 需要在 mod constructor 执行前引用已注册对象
  → ❌ 禁止：在静态字段初始化中引用另一个静态字段
  → ✅ 正确：在 RegistryEvent 回调中使用
```

## Decision: 常用注册表

| 注册内容 | 事件类型 | 备注 |
|----------|----------|------|
| 方块 | `RegistryEvent.Register<Block>` | |
| 物品 | `RegistryEvent.Register<Item>` | |
| TileEntity | `RegistryEvent.Register<TileEntityType>` | |
| 实体类型 | `RegistryEvent.Register<EntityType>` | |
| 声音事件 | `RegistryEvent.Register<SoundEvent>` | |
| 附魔 | `RegistryEvent.Register<Enchantment>` | |
| 容器类型 | `RegistryEvent.Register<ContainerType>` | |

## 注册 ItemBlock

ItemBlock 需要与方块**相同的注册名**：

```java
@SubscribeEvent
public static void onItemsRegistry(final RegistryEvent.Register<Item> event) {
    // BlockItem - registry name 必须匹配方块
    event.getRegistry().register(
        new BlockItem(ModBlocks.MY_BLOCK, new Item.Properties())
            .setRegistryName(new ResourceLocation(MOD_ID, "my_block"))  // 与方块相同！
    );
}
```

## 注册 TileEntity（TileEntityType）

```java
// 方块实现 hasTileEntity() + createTileEntity()
public class MyBlock extends Block {
    @Override
    public boolean hasTileEntity(BlockState state) { return true; }
    @Override
    public TileEntity createTileEntity(World world, BlockState state) {
        return new MyTileEntity();
    }
}

// TileEntityType 注册
public static final TileEntityType<MyTileEntity> MY_TILE_ENTITY =
    TileEntityType.Builder.create(MyTileEntity::new, Blocks.STONE)
        .build(null);

@SubscribeEvent
public static void onTileEntityRegistry(final RegistryEvent.Register<TileEntityType> event) {
    event.getRegistry().register(
        MY_TILE_ENTITY.setRegistryName(new ResourceLocation(MOD_ID, "my_tile_entity"))
    );
}
```

## 注册实体属性

```java
// 在实体的 registerAttributes() 方法中
@Override
protected void registerAttributes() {
    super.registerAttributes();
    this.getAttribute(SharedMonsterAttributes.MAX_HEALTH).setBaseValue(20.0);
    this.getAttribute(SharedMonsterAttributes.MOVEMENT_SPEED).setBaseValue(0.3);
    this.getAttribute(SharedMonsterAttributes.ATTACK_DAMAGE).setBaseValue(3.0);
}
```

## 常见错误

- ❌ 忘记 `.setRegistryName()`：注册名称必须设置
- ❌ Registry name 使用大写或横杠：必须全小写、下划线分隔
- ❌ mod ID 与 mods.toml 不一致
- ❌ ItemBlock 与方块 registry name 不匹配
- ❌ 在构造函数中引用其他 RegistryObject（此时尚未注册）

## 参考资料

- Forge 官方文档：https://docs.minecraftforge.net/en/1.14.4/concepts/registries/
- 详细示例：参见 `01-registry.mdc`

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-block` | 方块注册后方块实体注册需要先有方块 |
| `mc-item` | 物品注册后方块物品（BlockItem）需要先有方块 |
| `mc-entity` | 实体注册后方块实体类型引用实体类型 |
| `mc-datagen` | 注册完成后可通过手动 JSON 生成标签和配方 |
| `mc-networking` | 自定义数据包可传输注册表数据 |
