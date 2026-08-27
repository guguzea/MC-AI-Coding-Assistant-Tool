---
name: mc-renderer
description: Fabric 1.21.8 mc-renderer。类名只来自本档核实表与 search_fabric_docs。
platform: fabric
version: "1.21.8"
docsTool: search_fabric_docs
---

# mc-renderer（Fabric 1.21.8）

> 本档为**薄档**（Fabric 1.21.8）。
> 文档树核实：`data/fabric_1.21.8/fabric-docs/1.21.8/processed/` 含 `develop_rendering_basic-concepts`、`develop_blocks_block-entity-renderer`、`develop_rendering_gui-graphics`、`develop_rendering_hud`、`develop_rendering_world`（**新增**）、`develop_rendering_particles_creating-particles`。
> **基础渲染 API 以 `fabric/1.21.1` 主档 mc-renderer 为准**；本档只写入口、边界与本版差异。落笔前应 `search_fabric_docs query=rendering version=1.21.8` 复核。
> 官方 URL：https://docs.fabricmc.net/develop/rendering/basic-concepts 、https://docs.fabricmc.net/develop/blocks/block-entity-renderer 、https://docs.fabricmc.net/develop/rendering/world 。

## 入口（1.21.8 页核实）

- 基础概念与 1.21.1 相同：Tessellator（页内 `Tesselator`）/ BufferBuilder（addVertex 顺序）/ VertexFormat / VertexFormat.Mode / PoseStack（push/pop/peek/translate/scale）。
- **本版变化（1.21.8 页白纸黑字）**：HUD 渲染的矩阵栈从 `PoseStack` 改为 **`Matrix3x2fStack`**——多数方法略不同、**不再接受 z 参数**，概念一致；HUD 例子改用 **`HudElementRegistry`**（替代 1.21.1/1.21.4 的 `HudRenderCallback`）。
- 变换矩阵获取：页内 `GuiGraphics` 对象调用 `pose()`（1.21.8 页写法）。
- BER：`BlockEntityRendererProvider.Context` 构造；`render()` 每帧调用；`BlockEntityRenderers` 注册表；注册在 **`ClientModInitializer`**；类放 `src/client/`。
- 文本：`Font`（width / drawInBatch）；`translate` / `mulPose(Axis.XP.rotationDegrees(90))` / `scale(1/18f)`。

## 行为边界

- 渲染类客户端专用；服务端加载渲染类会崩；push/pop 配对；顶点顺序与 culling。
- 1.21.8 页正文**没有** 1.21.6+ 的 RenderState/GuiGraphicsExtractor 叙述（该叙述在 26.1.2 页）——不要替本版补写。

## 本版差异（已核实）

- HUD 层：1.21.8 = HudElementRegistry + Matrix3x2fStack；1.21.4 及更早 = HudRenderCallback + PoseStack。
- 本版新增 `develop_rendering_world` 页（世界渲染），与本技能「薄档」定位互补。
- 页内部分名称为 Mojang 风格；确切类名以本版 search_fabric_docs / 官方页为准，禁止默写。

## 核不到时

- `search_fabric_docs` 无结果或本档缺页 → 停止输出；改口官方 URL（上方），禁止 1.21.11 wiki 顶上。

## 配合 Skill

- `mc-model`、`mc-gui`、`09-anti-patterns.mdc`
