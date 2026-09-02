---
name: mc-registry
description: NeoForge 26.1 mc-registry。类名只来自本档核实表与 search_neoforge_docs。
platform: neoforge
version: "26.1"
dependencies: []
mappings: mojmap
---

# mc-registry（NeoForge 26.1）

禁止从 Forge 或邻档复制。26.1 是独立档：Java 25、去混淆、ModContainer 构造参数、GatherDataEvent 拆分。26.2 不是「未发布」：maven 26.2 线已构建到 26.2.0.75（2026-09-02 实读 maven.neoforged.net），官方 Primer 也有 26.2 迁移页（/primer/docs/26.2/ 返回 200，本仓已入库 data/neoforge_primers/26.2.md）。但官方主文档站不按版本分线——/docs/26.2/ 与 /docs/26.1/ 同样 404，现行主文档是未版本化的 /docs/；本仓也没有 26.2 规则树与主文档语料，禁止把本档克隆成 26.2。

# 01 — 注册（NeoForge 26.1）

来源：https://docs.neoforged.net/docs/concepts/registries/ 、blocks/ 、items/ 。MDK 使用 `DeferredRegister.createBlocks/createItems`、`DeferredBlock`、`DeferredItem`、`DeferredHolder`。

## 推荐

```java
public static final DeferredRegister.Blocks BLOCKS = DeferredRegister.createBlocks(ExampleMod.MODID);
public static final DeferredBlock<Block> DRIEDGHAST_BLOCK =
    BLOCKS.registerSimpleBlock("driedghast_block", BlockBehaviour.Properties.of().mapColor(MapColor.STONE));
public static final DeferredRegister.Items ITEMS = DeferredRegister.createItems(ExampleMod.MODID);
public static final DeferredItem<BlockItem> DRIEDGHAST_BLOCK_ITEM =
    ITEMS.registerSimpleBlockItem("driedghast_block", DRIEDGHAST_BLOCK);
```

在 `ExampleMod` 里 `BLOCKS.register(modEventBus)`。

备选：`RegisterEvent`（mod bus，构造之后）。查询用 vanilla `Registry`，不要拿 `DeferredRegister` 当运行时 map。

## 26.1 口径

- 26.1 去混淆 + Identifier。禁止 Yarn。query_api 无本版索引。
- 文档同时出现 `Supplier` 与 `DeferredHolder`；需要 `Holder`/`DeferredHolder` 的 API 不要只留裸 `Supplier`。
- **不要**把 Forge `RegistryObject` 当本档教程类型。本档 MDK 示例是 DeferredBlock/DeferredItem/DeferredHolder。
- 禁止 `NeoForgeAddonPlugin`。

自定义 datapack registry：`ResourceKey.createRegistryKey(Identifier.fromNamespaceAndPath("yourmodid", "spells"))` 一类写法，以该版 registries 页为准。


触发词：DeferredRegister、DeferredHolder、@Mod、RegisterEvent。不要匹配 RegistryObject 当本档正解。
