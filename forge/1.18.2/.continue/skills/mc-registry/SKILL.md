---
name: mc-registry
description: Minecraft Forge 注册系统。注册方块、物品、实体、方块实体等。
platform: forge
version: "1.18.2"
---

# Registry 注册系统（Forge 1.18.2）

## 快速开始

```java
public static final DeferredRegister<Block> BLOCKS =
    DeferredRegister.create(ForgeRegistries.BLOCKS, MOD_ID);

public static final RegistryObject<Block> MY_BLOCK = BLOCKS.register("my_block",
    () -> new Block(Properties.of(Material.STONE)));

BLOCKS.register(modEventBus);
```

## 常用注册表

| 注册内容 | ForgeRegistries 字段 |
|----------|---------------------|
| 方块 | `ForgeRegistries.BLOCKS` |
| 物品 | `ForgeRegistries.ITEMS` |
| 方块实体 | `ForgeRegistries.BLOCKENTITIES` |
| 实体类型 | `ForgeRegistries.ENTITYTYPES` |

## 常见错误

- ❌ 在 lambda 外引用 RegistryObject
- ❌ Registry 名称含大写或横杠

## 参考资料

参见 `01-registry.mdc`
