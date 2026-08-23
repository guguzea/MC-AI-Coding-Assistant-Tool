---
name: mc-renderer
description: 客户端实体/方块渲染、BER、层与纹理。触发词：Renderer、RenderType、BER
platform: fabric
version: "1.21.11"
dependencies: []
mappings: yarn
---

# mc-renderer（Fabric 1.21.11）

> 核实源（`data/fabric_1.21.11/fabric-docs/1.21.11/processed/`）：
> - `develop_rendering_basic-concepts.md`（id `develop-rendering-basic-concepts`；官方 https://docs.fabricmc.net/develop/rendering/basic-concepts ）
> - `develop_blocks_block-entity-renderer.md`（id `develop-blocks-block-entity-renderer`；https://docs.fabricmc.net/develop/blocks/block-entity-renderer ）
> - 相关页：`develop_rendering_gui-graphics`、`develop_rendering_hud`、`develop_rendering_world`、`develop_rendering_particles_creating-particles`、`develop_blocks_transparency-and-tinting`。
> 本包 `mappings: yarn`；页面名 `PoseStack`/`GuiGraphics`/`Matrix3x2fStack`/`BlockEntityRenderState` 等为 Mojang/官方风格，Yarn 换算以 `search_fabric_docs version=1.21.11` 为准，禁止默写。

## 重要：渲染管线近年变化（basic-concepts 页警告，全文核实）

- **1.21.6 起**渲染管线大改：向 `RenderType`/`RenderPipeline`/**`RenderState`** 演进——「准备下一帧的同时绘制当前帧」；准备阶段把渲染数据提取到 RenderState，他线程绘制。
- **1.21.8 起 GUI 采用该模型**：页内为 **`GuiGraphics`** 方法向渲染状态追加（26.1.2 页此处写作 `GuiGraphicsExtractor`，本档页无 Extractor 一词）→ 真正上传到 `BufferBuilder` 在准备阶段末尾（页面指向 `GuiRenderer#prepare`）。
- **1.21.8 起** HUD 矩阵栈从 `PoseStack` 改 **`Matrix3x2fStack`**：方法略不同、**不再接受 z 参数**，概念相同。

## 术语（basic-concepts 页核实）

- `Tesselator`（页面拼写；实际类名 Tessellator）：单例、`getInstance()`；`begin(VertexFormat, drawMode)` 初始化 `BufferBuilder`。
- 写顶点：`buffer.addVertex(Matrix4f, float, float, float)`；**必须按 VertexFormat 顺序**补数据；注意 culling。
- 顶点格式在 **`DefaultVertexFormat`**（页表：EMPTY/BLOCK/NEW_ENTITY/PARTICLE/POSITION/POSITION_COLOR/POSITION_COLOR_NORMAL/POSITION_COLOR_LIGHTMAP/POSITION_TEX/POSITION_TEX_COLOR/POSITION_COLOR_TEX_LIGHTMAP/POSITION_TEX_LIGHTMAP_COLOR/POSITION_TEX_COLOR_NORMAL）。
- 绘制模式在 **`VertexFormat.Mode`**：LINES / LINE_STRIP / DEBUG_LINES / DEBUG_LINE_STRIP / TRIANGLES / TRIANGLE_STRIP / TRIANGLE_FAN / QUADS。
- `PoseStack` 方法：`pushPose()` / `popPose()` / `last()` / `translate(x,y,z)` / `translate(vec3)` / `scale`；旋转 `rotateAround(quaternionfc, x, y, z)`；预置四元数在 `Axis`。
- 变换矩阵经 `Matrix3x2fStack`（`GuiGraphics#pose()`）；HUD 例子用 **`HudElementRegistry`**（1.21.1/1.21.4 为 `HudRenderCallback`）。
- 页内自述：text 讲 PoseStack/世界空间而 code 显示 Matrix3x2fStack/HUD——引用时以页面对应标注为准。

## BER（block-entity-renderer 页核实 = submit/render 体系）

- 用途：模型格式不够时的动态渲染。
- **submit/render**：先建 `BlockEntityRenderState` 提交渲染数据，游戏按提交状态渲染。
- 类放客户端源集（`src/client/`；`src/main/` 不安全）；构造参数 `BlockEntityRendererProvider.Context`（`ItemRenderer`、`Font`）。
- 覆写：`createRenderState`（初始化）、`extractRenderState`（用方块实体数据更新）、`submit`（每帧渲染逻辑；页面要点：开头 push 结尾 pop）。
- 文本：经 `submit` 传入的 `SubmitNodeCollector` 调 **`submitText`**（FormattedCharSequence、x、y、RGB 颜色、PoseStack）。
- 变换示例：`translate` / `mulPose(Axis.XP.rotationDegrees(90))`（页内措辞）/ `scale(1/18f)`——与 basic-concepts 页 `rotateAround` 措辞差异是页面自身不一致，以 search_fabric_docs 为准。
- 注册：`ClientModInitializer` + `BlockEntityRenderers`（BlockEntityType → BlockEntityRenderer）。

## 与 26.1.2 / 1.21.x 差异（已核实）

- 与 26.1.2 页唯一措辞差异：本档写 `GuiGraphics`（26.1.2 写 `GuiGraphicsExtractor`）；其余（RenderState 叙述、DefaultVertexFormat、Matrix3x2fStack/HudElementRegistry、submit BER、`rotateAround`/`pushPose`/`last`）一致。
- BER：本档与 1.21.10/26.1.2 同（submit/render）；1.21.8 及更早为 `render()` 模型。
- 1.21.1/1.21.4 为 HudRenderCallback + PoseStack（本档已换代）。

## 核不到时

- `search_fabric_docs`（version=1.21.11）无结果 → 停止输出；禁止 1.21.11 wiki 或 26.1 克隆页顶上。

## 高级 shader

- Satin：`knowledge/libs/fabric-only/mc-satin/SKILL.md`——版本范围以其 frontmatter 为准。
