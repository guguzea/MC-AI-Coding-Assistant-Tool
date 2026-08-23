---
name: mc-renderer
description: NeoForge 1.21.1 mc-renderer。类名只来自本档核实表与 search_neoforge_docs。
platform: neoforge
version: "1.21.1"
dependencies: []
mappings: mojmap
---

# mc-renderer（NeoForge 1.21.1）

> 本档为**主档 neoforge 根下的子档**；差异以本档 `search_neoforge_docs`（platform=neoforge, version=1.21.1）为准。**1.21.1 树（data/neoforge_1.21.1）没有 rendering 独立文档页**：以下为机制路线 + Forge 1.20.1 语义基线（页 id `rendering_modelextensions_rendertypes` / `blockentities_ber` / `items_bewlr`），NeoForge 侧类名/事件名一律**先复核**，核不到不输出签名。禁止从扁平 neoforge/.agents/skills 或邻档复制旧 API。

## 语义基线（Forge 1.20.1；NeoForge 1.21.1 同源，入口名以复核为准）

1. **Render Types**：模型 JSON 顶层 `render_type`（`minecraft:solid` / `cutout` / `cutout_mipped` / `cutout_mipped_all` / `translucent` / `tripwire`），无需注册；自定义命名渲染类型走命名渲染类型注册事件（Forge 名 `RegisterNamedRenderTypesEvent`，chunk 部分须在 `RenderType.chunkBufferLayers()` 内）。
2. **BER**：`BlockEntityRenderer`，方块必须有 BlockEntity；一个 `BlockEntityType` 只对应一个 BER——每帧变化的状态存方块实体；注册走实体渲染器注册事件（Forge 名 `EntityRenderersEvent$RegisterRenderers`）。
3. **BEWLR**：物品动态渲染；`BakedModel#isCustomRenderer = true` + `Item#initializeClient` / `IClientItemExtensions#getCustomRenderer`（客户端物理端入口；每 mod 一个实例）；方块走 `RenderShape#ENTITYBLOCK_ANIMATED`。

> NeoForge 1.20.4+ 上述入口是否同名同包（如 `initializeClient`、命名渲染类型事件名），一律以 `search_neoforge_docs` 复核；禁止把 Forge 1.20.1 签名当 1.21.1 全文。

## 26.1（非本档）提示

- `data/neoforge_26.1` 树有 `rendering/feature` 页（页 id `rendering_feature`；https://docs.neoforged.net/docs/rendering/feature/），那是 **26.1+ 的 feature 提交/渲染管线**（`SubmitNodeCollector` / `FeatureRenderDispatcher#renderAllFeatures` 等），**不适用于 1.21.1**；1.21.1 仍是 render_type / BER / BEWLR 语义。

## 本档差异与边界

- Java 21、`ResourceLocation`、mojmap；`RenderType` / `MultiBufferSource` 等 vanilla 类所在包随 mojmap 归档，写代码前以 `search_neoforge_docs` 复核。
- 实体渲染器、自定义 shader、核心管线属机制路线：不写未核实签名。
- 主档同题 skill 为语义基线的展开版（含 26.1 feature 页可核部分）。

## 官网链接

- 文档根：https://docs.neoforged.net/docs/1.21.1/ ；检索：`search_neoforge_docs`（platform=neoforge, version=1.21.1）。
