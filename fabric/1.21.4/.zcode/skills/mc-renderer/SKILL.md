---
name: mc-renderer
description: Fabric 1.21.4 mc-renderer。类名只来自本档核实表与 search_fabric_docs。
platform: fabric
version: "1.21.4"
docsTool: search_fabric_docs
---

# mc-renderer（Fabric 1.21.4）

> 本档为**薄档**（Fabric 1.21.4）。
> 文档树核实：`data/fabric_1.21.4/fabric-docs/1.21.4/processed/` 含有 `develop_rendering_basic-concepts`、`develop_blocks_block-entity-renderer`、`develop_rendering_gui-graphics`、`develop_rendering_hud`、`develop_rendering_particles_creating-particles`、`develop_rendering_gui_custom-screens`、`develop_rendering_gui_custom-widgets`。
> **渲染 API 正文以 `fabric/1.21.1` 主档 mc-renderer 为准**；本档只写入口、边界与本版差异。落笔前应 `search_fabric_docs query=rendering version=1.21.4` 复核。
> 官方 URL：https://docs.fabricmc.net/develop/rendering/basic-concepts 、https://docs.fabricmc.net/develop/blocks/block-entity-renderer 。

## 入口（与 1.21.1 主档同一套概念）

- 术语：Tessellator（页内拼写 `Tesselator`）/ BufferBuilder / VertexFormat（元素 + Mode）/ PoseStack（push/pop/peek/translate/scale）/ GuiGraphics / `HudRenderCallback` 事件 / tickDelta。
- 1.21.4 页正文示例与 1.21.1 页一致：`drawContext.getMatrices().peek().getPositionMatrix()`。
- BER：`BlockEntityRendererProvider.Context` 构造参数；`render()` 每帧调用；`BlockEntityRenderers` 注册表；**注册在 `ClientModInitializer`**（1.21.4 页措辞；1.21.1 页为「fabric.mod.json entrypoint」——官方不同版措辞，以本版为准）。
- 文本：`Font`（width / drawInBatch）；变换 `translate` / `mulPose(Axis.XP.rotationDegrees(90))` / `scale(1/18f)`。

## 行为边界

- 渲染类客户端专用：分源集工程放 `src/client/`；放 `src/main/` 不保证安全（服务端可能加载）。
- 禁止服务端加载 Renderer、禁止服务端线程调用客户端渲染代码。
- 顶点必须按 VertexFormat 顺序写；注意 culling 与顶点顺序；push/pop 必须配对。

## 本版差异（已核实）

- 1.21.4 与 1.21.1 渲染体系一致：HudRenderCallback + PoseStack HUD 栈；**还没有** 1.21.8 起的 `HudElementRegistry` / `Matrix3x2fStack`。
- 1.21.4 文档树**无** `develop_rendering_world`（1.21.8 起才有）——世界渲染不在本档；需要时以本版 search_fabric_docs 为准，禁止用 1.21.8 页当本版全文。
- 部分页内名称是 Mojang 风格（如其它页的 `ResourceLocation`、`ServerPlayer`）——确切类名以本版 search_fabric_docs / 官方页为准，禁止默写。

## 核不到时

- `search_fabric_docs` 无结果或本档缺页 → 停止输出；改口官方页面（上方 URL），禁止用邻版/1.21.11 wiki 顶上。

## 配合 Skill

- `mc-model`（模型/纹理）、`mc-gui`（Screen/Widget）、`09-anti-patterns.mdc`
