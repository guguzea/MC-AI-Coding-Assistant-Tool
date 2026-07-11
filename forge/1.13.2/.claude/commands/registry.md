---
name: registry
description: Minecraft Forge 注册系统（Forge 1.13.2）。注册方块、物品、实体、TileEntity 等。触发词：注册、register、RegistryEvent、@SubscribeEvent、setRegistryName、ForgeRegistries、@Mod
---

# Registry 注册系统（Forge 1.13.2）

## 快速开始

**始终使用 `@EventBusSubscriber` + `RegistryEvent.Register<T>`**，这是 Forge 1.13.2 的标准注册方式：

```java
// 1. 在 mod 主类中定义静态字段
public static final Block MY_BLOCK = new Block(
    Block.Properties.create(Material.STONE)
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

IF 注册自定义 Registry
  → 使用 RegistryEvent.NewRegistry
```

## 常用注册表

| 注册内容 | 事件类型 |
|----------|----------|
| 方块 | `RegistryEvent.Register<Block>` |
| 物品 | `RegistryEvent.Register<Item>` |
| TileEntity | 无需单独注册 |
| 实体类型 | `RegistryEvent.Register<EntityType>` |
| 声音事件 | `RegistryEvent.Register<SoundEvent>` |

## 常见错误

- ❌ 不调用 `setRegistryName()`
- ❌ mod ID 与 mods.toml 不一致
- ❌ Registry 名称含大写或横杠

## 参考资料

- 详细示例：参见 `01-registry.mdc`
