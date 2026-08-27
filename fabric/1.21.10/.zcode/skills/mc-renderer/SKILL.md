---
name: mc-renderer
description: Fabric 1.21.10 mc-renderer。类名只来自本档核实表与 search_fabric_docs。
platform: fabric
version: "1.21.10"
docsTool: search_fabric_docs
---

# mc-renderer（Fabric 1.21.10）

> 本档为**薄档**（Fabric 1.21.10）。
> 文档树核实：`data/fabric_1.21.10/fabric-docs/1.21.10/processed/` 含 `develop_rendering_basic-concepts`、`develop_blocks_block-entity-renderer`、`develop_rendering_gui-graphics`、`develop_rendering_hud`、`develop_rendering_world`、`develop_blocks_transparency-and-tinting`（**本版新增**）、`develop_items_item-appearance`。
> **基础渲染 API 以 `fabric/1.21.1` 主档 mc-renderer 为准**；本档只写入口、边界与本版差异。落笔前应 `search_fabric_docs query=rendering version=1.21.10` 复核。
> 官方 URL：https://docs.fabricmc.net/develop/rendering/basic-concepts 、https://docs.fabricmc.net/develop/blocks/block-entity-renderer 、https://docs.fabricmc.net/develop/rendering/world 。

## 入口（1.21.10 页核实）

- 基础概念与 1.21.1 同：Tessellator（页内 `Tesselator`）/ BufferBuilder / VertexFormat（含 `DefaultVertexFormat` 列举）/ VertexFormat.Mode / PoseStack。
- **HUD（承 1.21.8）**：`HudElementRegistry` + `Matrix3x2fStack`（无 z 参数）；变换矩阵经 `GuiGraphics` 对象 `pose()` 获取（1.21.10 页写法）。
- **BER 已换代（本版重要差异）**：1.21.10 的 block-entity-renderer 页为 **submit/render 体系**——
  - 先建 `BlockEntityRenderState` 存放渲染所需数据；
  - `BlockEntityRenderer` 构造函数仍为 `BlockEntityRendererProvider.Context`（ItemRenderer / Font）；
  - 覆写 `createRenderState`（初始化）、`extractRenderState`（用方块实体数据更新）、`submit`（每帧渲染逻辑）；
  - 文本用 `submit` 传入的 `SubmitNodeCollector` 的 **`submitText`**（FormattedCharSequence、x、y、RGB 颜色、PoseStack）；
  - 注册：`BlockEntityRenderers` 注册表 + **`ClientModInitializer`**；
  - 类放 `src/client/`。

## 行为边界

- 渲染类客户端专用；服务端加载会崩；push/pop 配对；顶点顺序与 culling。
- 本版页正文没有 26.1.2 页的 RenderState/GuiGraphicsExtractor 叙述——不要替本版补写。

## 本版差异（已核实）

- BER：1.21.10 已是 submit/render（`BlockEntityRenderState`/`submit`）；1.21.8 及更早仍是 `render()` 模型。
- HUD：延续 1.21.8 的 HudElementRegistry + Matrix3x2fStack（**不同于** 1.21.4 的 HudRenderCallback）。
- 本版新增 transparency-and-tinting（透明/着色）页与 item-appearance 页。

## 核不到时

- `search_fabric_docs` 无结果或本档缺页 → 停止输出；改口官方 URL（上方），禁止 1.21.11 wiki 顶上。

## 配合 Skill

- `mc-model`、`mc-gui`、`09-anti-patterns.mdc`
