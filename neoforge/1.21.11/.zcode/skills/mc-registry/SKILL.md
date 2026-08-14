---
name: mc-registry
description: NeoForge 1.21.11 mc-registry。类名只来自本档核实表与 search_neoforge_docs。
platform: neoforge
version: "1.21.11"
dependencies: []
mappings: mojmap
---

# mc-registry（NeoForge 1.21.11）

禁止从 Forge 或邻档复制。1.21.11 文档把 ResourceLocation 换成 Identifier。Primer 26.1 才是下一跳。

# 01 — 注册（NeoForge 1.21.11）

来源：https://docs.neoforged.net/docs/1.21.11/concepts/registries/ 、blocks/ 、items/ 。MDK 使用 `DeferredRegister.createBlocks/createItems`、`DeferredBlock`、`DeferredItem`、`DeferredHolder`。

## 推荐

```java
public static final DeferredRegister.Blocks BLOCKS = DeferredRegister.createBlocks(ExampleMod.MODID);
public static final DeferredBlock<Block> COPPERGOLEM_BLOCK =
    BLOCKS.registerSimpleBlock("coppergolem_block", BlockBehaviour.Properties.of().mapColor(MapColor.STONE));
public static final DeferredRegister.Items ITEMS = DeferredRegister.createItems(ExampleMod.MODID);
public static final DeferredItem<BlockItem> COPPERGOLEM_BLOCK_ITEM =
    ITEMS.registerSimpleBlockItem("coppergolem_block", COPPERGOLEM_BLOCK);
```

在 `IEventBus + 可选 ModContainer（以 MDK 为准）` 里 `BLOCKS.register(modEventBus)`。

备选：`RegisterEvent`（mod bus，构造之后）。查询用 vanilla `Registry`，不要拿 `DeferredRegister` 当运行时 map。

## 1.21.11 口径

- 1.21.11 文档已用 Identifier.fromNamespaceAndPath，不要再写 ResourceLocation.fromNamespaceAndPath。
- 文档同时出现 `Supplier` 与 `DeferredHolder`；需要 `Holder`/`DeferredHolder` 的 API 不要只留裸 `Supplier`。
- **不要**把 Forge `RegistryObject` 当本档教程类型。本档 MDK 示例是 DeferredBlock/DeferredItem/DeferredHolder。
- 禁止 `NeoForgeAddonPlugin`。

自定义 datapack registry：`ResourceKey.createRegistryKey(Identifier.fromNamespaceAndPath("yourmodid", "spells"))` 一类写法，以该版 registries 页为准。


触发词：DeferredRegister、DeferredHolder、@Mod、RegisterEvent。不要匹配 RegistryObject 当本档正解。
