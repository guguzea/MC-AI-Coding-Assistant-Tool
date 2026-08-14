---
name: mc-registry
description: NeoForge 1.21.3 mc-registry。类名只来自本档核实表与 search_neoforge_docs。
platform: neoforge
version: "1.21.3"
dependencies: []
mappings: mojmap
---

# mc-registry（NeoForge 1.21.3）

禁止从 Forge 或邻档复制。1.21.3 规则树独立存在是为了禁止 Agent 拿 1.20.4 或 1.21.8 顶上。Data Components 已是物品数据主路径。

# 01 — 注册（NeoForge 1.21.3）

来源：https://docs.neoforged.net/docs/1.21.3/concepts/registries/ 、blocks/ 、items/ 。MDK 使用 `DeferredRegister.createBlocks/createItems`、`DeferredBlock`、`DeferredItem`、`DeferredHolder`。

## 推荐

```java
public static final DeferredRegister.Blocks BLOCKS = DeferredRegister.createBlocks(ExampleMod.MODID);
public static final DeferredBlock<Block> PALEMOSS_BLOCK =
    BLOCKS.registerSimpleBlock("palemoss_block", BlockBehaviour.Properties.of().mapColor(MapColor.STONE));
public static final DeferredRegister.Items ITEMS = DeferredRegister.createItems(ExampleMod.MODID);
public static final DeferredItem<BlockItem> PALEMOSS_BLOCK_ITEM =
    ITEMS.registerSimpleBlockItem("palemoss_block", PALEMOSS_BLOCK);
```

在 `ExampleMod` 里 `BLOCKS.register(modEventBus)`。

备选：`RegisterEvent`（mod bus，构造之后）。查询用 vanilla `Registry`，不要拿 `DeferredRegister` 当运行时 map。

## 1.21.3 口径

- 1.21.3 文档仍用 ResourceLocation.fromNamespaceAndPath。
- 文档同时出现 `Supplier` 与 `DeferredHolder`；需要 `Holder`/`DeferredHolder` 的 API 不要只留裸 `Supplier`。
- **不要**把 Forge `RegistryObject` 当本档教程类型。本档 MDK 示例是 DeferredBlock/DeferredItem/DeferredHolder。
- 禁止 `NeoForgeAddonPlugin`。

自定义 datapack registry：`ResourceKey.createRegistryKey(ResourceLocation.fromNamespaceAndPath("yourmodid", "spells"))` 一类写法，以该版 registries 页为准。


触发词：DeferredRegister、DeferredHolder、@Mod、RegisterEvent。不要匹配 RegistryObject 当本档正解。
