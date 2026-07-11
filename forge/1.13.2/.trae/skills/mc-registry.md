---
name: mc-registry
description: Minecraft Forge 注册系统（Forge 1.13.2）。注册方块、物品、实体、TileEntity 等。
---

# Registry 注册系统（Forge 1.13.2）

## 快速开始

**始终使用 `@EventBusSubscriber` + `RegistryEvent.Register<T>`**，这是 Forge 1.13.2 的标准注册方式：

```java
public static final Block MY_BLOCK = new Block(...);

@SubscribeEvent
public void onBlocksRegistry(RegistryEvent.Register<Block> event) {
    event.getRegistry().register(
        MY_BLOCK.setRegistryName(new ResourceLocation(MOD_ID, "my_block"))
    );
}
```

## 常见错误

- ❌ 不调用 `setRegistryName()`
- ❌ mod ID 与 mods.toml 不一致

## 参考资料

- 详细示例：参见 `01-registry.mdc`
