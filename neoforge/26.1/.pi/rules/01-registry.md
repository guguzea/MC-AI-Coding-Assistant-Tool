---
description: 01 — 注册（NeoForge 26.1）
---

# 01 — 注册（NeoForge 26.1）

来源：https://docs.neoforged.net/docs/concepts/registries/ 、blocks/ 、items/ 。MDK 使用 `DeferredRegister.createBlocks/createItems`、`DeferredBlock`、`DeferredItem`、`DeferredHolder`。

## 推荐

```java
public static final DeferredRegister.Blocks BLOCKS = DeferredRegister.createBlocks(ExampleMod.MODID);
public static final DeferredBlock<Block> DRIEDGHAST_BLOCK =
    BLOCKS.registerSimpleBlock("driedghast_block", () -> BlockBehaviour.Properties.of().mapColor(MapColor.STONE));
    // 或 UnaryOperator：BLOCKS.registerSimpleBlock("id", props -> props.mapColor(MapColor.STONE));
    // 禁止裸 Properties（那是 1.21.1 重载）。也可 registerSimpleBlock("id") 用默认属性。
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

## DataAttachment

26.1 用 NeoForge `AttachmentType` + `DeferredRegister`（`NeoForgeRegistries.ATTACHMENT_TYPES`），**不是** Forge Capability。骨架走 `generate_capability`（`platform=neoforge` + `version=26.1`）；先定义 Data 类再注册，本工具不生成 Data 类。查询用 `search_neoforge_docs` / `query_loader_api`；本档无独立 attachments 页时标注 fallback，禁止把 Forge `CapabilityManager` 抄进来。
