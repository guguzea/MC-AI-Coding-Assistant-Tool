---
name: mc-registry
description: Minecraft Forge 注册系统。注册方块、物品、实体、TileEntity 等。触发词：注册、register、RegistryEvent、@SubscribeEvent、setRegistryName、ForgeRegistries、@Mod
platform: forge
version: "1.13.2"
dependencies: []
mappings: mcp
---

# Registry 注册系统（Forge 1.13.2）

## 快速开始

**始终使用 `@EventBusSubscriber` + `RegistryEvent.Register<T>`**，这是 Forge 1.13.2 的标准注册方式：

```java
// 1. 在 mod 主类或单独的注册类中定义静态字段
public static final Block MY_BLOCK = new Block(
    Block.Properties.create(Material.ROCK)
        .hardnessAndResistance(1.5f, 6.0f)
);

// 2. 在构造函数中注册到事件总线
public ExampleMod() {
    MinecraftForge.EVENT_BUS.register(this);
}

// 3. 使用 @SubscribeEvent 处理注册事件
@SubscribeEvent
public void onBlocksRegistry(RegistryEvent.Register<Block> event) {
    event.getRegistry().register(
        MY_BLOCK.setRegistryName(new ResourceLocation(MOD_ID, "my_block"))
    );
}
```

## Decision: 选择注册方式

```
IF 注册方块/物品/实体/TileEntity/SoundEvents 等
  → 使用 @EventBusSubscriber + RegistryEvent.Register<T>

IF 注册自定义 Registry（全新注册表）
  → 使用 RegistryEvent.NewRegistry

IF 需要在 mod constructor 执行前引用已注册对象
  → ❌ 禁止：在静态字段初始化中引用未注册的对象
  → ✅ 正确：确保注册顺序正确
```

## Decision: 常用注册表

| 注册内容 | 事件类型 | 备注 |
|----------|----------|------|
| 方块 | `RegistryEvent.Register<Block>` | |
| 物品 | `RegistryEvent.Register<Item>` | |
| TileEntity | 无需单独注册 | 通过 ITileEntityProvider 关联 |
| 实体类型 | `RegistryEvent.Register<EntityType>` | |
| 声音事件 | `RegistryEvent.Register<SoundEvent>` | |
| 附魔 | `RegistryEvent.Register<Enchantment>` | |
| 容器 | `RegistryEvent.Register<Container>` | |

## 注册 ItemBlock

方块的 ItemBlock 与方块同名注册：

```java
public static final Item MY_BLOCK_ITEM = new ItemBlock(MY_BLOCK,
    new Item.Properties().group(ItemGroup.TAB_BUILDING_BLOCKS));

@SubscribeEvent
public void onItemsRegistry(RegistryEvent.Register<Item> event) {
    event.getRegistry().register(MY_BLOCK_ITEM.setRegistryName(
        new ResourceLocation(MOD_ID, "my_block")
    ));
}
```

## 常见错误

- ❌ 不调用 `setRegistryName()`：`event.getRegistry().register(new Block(...))`（无法引用）
- ❌ mod ID 与 mods.toml 不一致
- ❌ Registry 名称含大写或横杠：必须全小写、下划线分隔

## 参考资料

- Forge 官方文档：https://docs.minecraftforge.net/en/1.13.2/
- 详细示例：参见 `01-registry.mdc`

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-block` | 方块注册后方块实体通过 ITileEntityProvider 关联 |
| `mc-item` | 物品注册后方块物品（ItemBlock）需要先有方块 |
| `mc-entity` | 实体类型通过 RegistryEvent.Register<EntityType> 注册 |
