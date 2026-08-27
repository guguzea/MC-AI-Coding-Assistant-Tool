---
description: 01 — 注册（NeoForge 1.20.4）
---

# 01 — 注册（NeoForge 1.20.4）

来源：https://docs.neoforged.net/docs/1.20.4/concepts/registries/ 、blocks/ 、items/ 。MDK 使用 `DeferredRegister.createBlocks/createItems`、`DeferredBlock`、`DeferredItem`、`DeferredHolder`。

## 推荐

```java
public static final DeferredRegister.Blocks BLOCKS = DeferredRegister.createBlocks(ExampleMod.MODID);
public static final DeferredBlock<Block> COPPERCOIL_BLOCK =
    BLOCKS.registerSimpleBlock("coppercoil_block", BlockBehaviour.Properties.of().mapColor(MapColor.STONE));
public static final DeferredRegister.Items ITEMS = DeferredRegister.createItems(ExampleMod.MODID);
public static final DeferredItem<BlockItem> COPPERCOIL_BLOCK_ITEM =
    ITEMS.registerSimpleBlockItem("coppercoil_block", COPPERCOIL_BLOCK);
```

在 `ExampleMod` 里 `BLOCKS.register(modEventBus)`。

备选：`RegisterEvent`（mod bus，构造之后）。查询用 vanilla `Registry`，不要拿 `DeferredRegister` 当运行时 map。

## 1.20.4 口径

- 本档仍用 ResourceLocation 构造函数，不是 fromNamespaceAndPath，也不是 Identifier。
- 文档同时出现 `Supplier` 与 `DeferredHolder`；需要 `Holder`/`DeferredHolder` 的 API 不要只留裸 `Supplier`。
- **不要**把 Forge `RegistryObject` 当本档教程类型。本档 MDK 示例是 DeferredBlock/DeferredItem/DeferredHolder。
- 禁止 `NeoForgeAddonPlugin`。

自定义 datapack registry：`ResourceKey.createRegistryKey(new ResourceLocation("yourmodid", "spells"))` 一类写法，以该版 registries 页为准。
