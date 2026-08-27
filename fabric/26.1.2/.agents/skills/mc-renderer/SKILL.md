---
name: mc-renderer
description: Fabric 26.1.2 mc-renderer。核不到则 search_fabric_docs version=26.1.2，禁止输出。
platform: fabric
version: "26.1.2"
dependencies: []
mappings: official
---

# mc-renderer（Fabric 26.1.2）

> 核实源（`data/fabric_26.1.2/fabric-docs/26.1.2/processed/`）：
> - `develop_rendering_basic-concepts.md`（id `develop-rendering-basic-concepts`；官方 https://docs.fabricmc.net/develop/rendering/basic-concepts ）
> - `develop_blocks_block-entity-renderer.md`（id `develop-blocks-block-entity-renderer`；https://docs.fabricmc.net/develop/blocks/block-entity-renderer ）
> - 相关页：`develop_rendering_gui-graphics`、`develop_rendering_hud`、`develop_rendering_world`、`develop_rendering_particles_creating-particles`。
> 本版为**去混淆官方名**（`mappings: official`），类名一律以本版文档为准；`query_api` 无 26.1+ 索引。

## 重要：渲染管线近年变化（basic-concepts 页两条警告，全文核实）

- **1.21.6 起**渲染管线大改：向 `RenderType`/`RenderPipeline`/**`RenderState`** 演进，目标是「准备下一帧的同时绘制当前帧」；准备阶段把全部渲染数据提取到 RenderState，另一线程绘制。
- **1.21.8 起 GUI 采用该模型**：`GuiGraphicsExtractor` 方法只向渲染状态**追加**；真正上传到 `BufferBuilder` 发生在准备阶段末尾（页面指向 `GuiRenderer#prepare`）。
- **1.21.8 起** HUD 渲染矩阵栈从 `PoseStack` 改为 **`Matrix3x2fStack`**：多数方法略不同、**不再接受 z 参数**，概念相同。
- 26.2 将推出 Vulkan 后端：继续使用 raw OpenGL 会进一步失效（页面引用官方公告）。

## 术语（basic-concepts 页核实）

- `Tesselator`（页面拼写；实际类名 Tessellator）：主渲染类、单例、`getInstance()`。
- `BufferBuilder`：格式化并上传渲染数据；`Tesselator#begin(VertexFormat, drawMode)` 初始化。
- 写顶点：`buffer.addVertex(Matrix4f, float, float, float)`；必须按 VertexFormat 顺序补数据；注意 culling。
- 顶点格式在 **`DefaultVertexFormat`**（页面列举：EMPTY/BLOCK/NEW_ENTITY/PARTICLE/POSITION/POSITION_COLOR/POSITION_COLOR_NORMAL/POSITION_COLOR_LIGHTMAP/POSITION_TEX/POSITION_TEX_COLOR/POSITION_COLOR_TEX_LIGHTMAP/POSITION_TEX_LIGHTMAP_COLOR/POSITION_TEX_COLOR_NORMAL）。
- 绘制模式在 **`VertexFormat.Mode`**：LINES / LINE_STRIP / DEBUG_LINES / DEBUG_LINE_STRIP / TRIANGLES / TRIANGLE_STRIP / TRIANGLE_FAN / QUADS。
- `PoseStack` 方法：`pushPose` / `popPose` / `last` / `translate(x,y,z)` / `translate(vec3)` / `scale`；旋转 `rotateAround(quaternionfc, x, y, z)`；预置四元数在 `Axis` 工具类。
- 变换矩阵经 `Matrix3x2fStack`（`GuiGraphicsExtractor#pose()`）获取；HUD 例子用 **`HudElementRegistry`**（不再是 1.21.1/1.21.4 的 `HudRenderCallback`）。
- 页面内注意：基本概念页文字与代码示例自述「讨论不同内容」（text 讲 PoseStack/世界空间，code 显示 Matrix3x2fStack/HUD）——引用时以页面对应标注为准。

## BER（block-entity-renderer 页核实，26.1.2 = submit/render 体系）

- 用途：模型格式不够时的动态渲染。
- **submit/render 机制**：先在 `BlockEntityRenderState` 中提交渲染所需数据，游戏再按提交的状态渲染。
- 类放客户端源集（`src/client/`；`src/main/` 不安全）；构造参数 `BlockEntityRendererProvider.Context`（`ItemRenderer`、`Font`）。
- 覆写：`createRenderState`（初始化渲染状态）、`extractRenderState`（用方块实体数据更新状态）、`submit`（每帧渲染逻辑，页面要点：开头 push 结尾 pop）。
- 文本：经 `submit` 传入的 `SubmitNodeCollector` 调用 **`submitText`**（FormattedCharSequence、x、y、RGB 颜色、PoseStack）。
- 变换示例同 1.21.x：`translate` / `mulPose(Axis.XP.rotationDegrees(90))`（页内措辞）/ `scale(1/18f)`——注意与基本概念页的 `rotateAround` 措辞差异是页面自身不一致，以 search_fabric_docs 为准。
- 注册：`ClientModInitializer` + `BlockEntityRenderers`（BlockEntityType → BlockEntityRenderer）。

## 与 1.21.x 差异（本版要点）

- HUD：26.1.2 = HudElementRegistry + Matrix3x2fStack（同 1.21.8 起）；1.21.1/1.21.4 为 HudRenderCallback + PoseStack。
- BER：26.1.2 与 1.21.10 同为 submit/render（BlockEntityRenderState/submitText）；1.21.8 及更早为 `render()` 模型。
- 方法名变化：`mulPose` → `rotateAround`、`peek` → `last`、`push`/`pop` → `pushPose`/`popPose`（以页表为准）。
- 高级 shader 路线：Satin 见 `knowledge/libs/fabric-only/mc-satin/SKILL.md`。

## 核不到时

- `search_fabric_docs`（version=26.1.2）无结果 → 停止输出；禁止 1.21.11 wiki 或 26.1 克隆页顶上。
