---
name: mc-renderer
description: 客户端实体/方块渲染、BER、层与纹理。触发词：Renderer、RenderType、BER
platform: fabric
version: "1.21.1"
dependencies: []
mappings: yarn
---

# mc-renderer（Fabric 1.21.1）

> 核实源（均在 `data/fabric_1.21.1/fabric-docs/1.21.1/processed/`，页面 id 与 gitPath 见 meta.json）：
> - `develop_rendering_basic-concepts.md`（id `develop-rendering-basic-concepts`）
> - `develop_blocks_block-entity-renderer.md`（id `develop-blocks-block-entity-renderer`）
> - 补充：`develop_rendering_gui-graphics.md`（id `develop-rendering-gui-graphics`）
> 官方 URL：https://docs.fabricmc.net/develop/rendering/basic-concepts 、https://docs.fabricmc.net/develop/blocks/block-entity-renderer 、https://docs.fabricmc.net/develop/rendering/gui-graphics 。
> 术语原文多为 Mojang 风格（`PoseStack`/`BufferBuilder`/`GuiGraphics`）；本包 `mappings: yarn`，照抄前用本档 `search_fabric_docs version=1.21.1` 复核，**禁止默写 Yarn 对应名**。

## 总原则（页面核实）

- 1.17+ 不能用 legacy OpenGL 渲染自己的东西：要么用 MC 的 **BufferBuilder 系统**（格式化渲染数据并上传到 OpenGL），要么自建并以 `GL.glDrawElements()` 绘制。
- 多数渲染被 `GuiGraphics` 方法抽象掉（形状/文本/贴图），日常未必碰 BufferBuilder，但概念必须懂。

## 核心管线（basic-concepts 页）

- **Tessellator**（页面拼写 `Tesselator`，注意实际类名）：主渲染类，单例，`Tessellator.getInstance()`。
- **BufferBuilder**：格式化并上传渲染数据；由 `Tessellator#begin(VertexFormat, drawMode)` 初始化并返回。
- **顶点写入**：`buffer.addVertex(matrix, x, y, z)`（matrix 为变换矩阵，三个 float 为坐标）；返回顶点构建器，**必须按 VertexFormat 顺序**补附加数据，否则 OpenGL 可能误读；注意 **culling**（顶点顺序错 → 面不渲染）。
- **VertexFormat 元素**（1.21.1 页表格）：`BLIT_SCREEN`、`POSITION_COLOR_TEXTURE_LIGHT_NORMAL`、`POSITION_COLOR_TEXTURE_OVERLAY_LIGHT_NORMAL`、`POSITION_TEXTURE_COLOR_LIGHT`、`POSITION`、`POSITION_COLOR`、`LINES`、`POSITION_COLOR_LIGHT`、`POSITION_TEXTURE`、`POSITION_COLOR_TEXTURE`、`POSITION_TEXTURE_COLOR`、`POSITION_COLOR_TEXTURE_LIGHT`、`POSITION_TEXTURE_LIGHT_COLOR`、`POSITION_TEXTURE_COLOR_NORMAL`（含义以页表为准）。
- **Draw Modes**（页表）：`Mode.LINES` / `LINE_STRIP` / `DEBUG_LINES` / `DEBUG_LINE_STRIP` / `TRIANGLES` / `TRIANGLE_STRIP` / `TRIANGLE_FAN` / `QUADS`。
- **变换矩阵**：4x4，缩放/平移/旋转坐标，也称 position/model matrix；来自 **PoseStack**，页面示例 `drawContext.getMatrices().peek().getPositionMatrix()`。
- **PoseStack 方法**：`push()` / `pop()` / `peek()` / `translate(x, y, z)` / `scale(x, y, z)`；旋转用 `mulPose(Quaternion, x, y, z)`（预置四元数在 `RotationAxis` 工具类）。
- **铁律**：先 push 再取矩阵，用完 pop；不配对会导致矩阵栈损坏、渲染出问题。
- 页内 HUD 示例用 **`HudRenderCallback`** 事件（客户端）；`tickDelta`（距上一帧经过的时间）做缩放动画。

## GuiGraphics（gui-graphics 页）

- 填充 `fill(...)`；边框 `drawBorder(...)`；横/竖线 `drawHorizontalLine(...)` / `drawVerticalLine(...)`；非方形（三角形等）走 BufferBuilder。
- 剪裁：`enableScissor(...)` / `disableScissor()`；可嵌套，但启用/禁用次数必须相等。
- 贴图 `drawTexture(...)` 多 overload：推荐显式传 `textureWidth`/`textureHeight`（不传时 GuiGraphics 会猜测，可能出错）；局部绘制用 `u`/`v` + `regionWidth`/`regionHeight`。

## 方块实体渲染 BER（block-entity-renderer 页）

- 模型格式不够（需要动态渲染）时用 **`BlockEntityRenderer`**。
- 类必须放客户端源集（如 `src/client/`，若分 client/server 源集）；直接在 `src/main/` 访问渲染类不安全（可能被服务端加载）。
- 构造函数参数：`BlockEntityRendererProvider.Context`（内含 `ItemRenderer`、`Font` 等工具）；可按此把构造函数本身当 `BlockEntityRendererProvider` 函数式接口使用。
- 注册：`BlockEntityRenderers` 注册表把 `BlockEntityType` 映射到 `BlockEntityRenderer`；在 `fabric.mod.json` 的客户端 entrypoint 中注册（页面措辞）。
- `render` 方法每帧调用；开头 push、结尾 pop。
- 页面示例变换：`matrices.translate(0.5, 1, 0.5)`（X/Z 半格 + Y 置顶）；`matrices.mulPose(Axis.XP.rotationDegrees(90))`（PoseStack 无 rotate；方方块默认文字画在 XY 平面）；`matrices.scale(1/18f, ...)`（BER 把方块映射到 `[-0.5, 0.5]`，Font 的 Y 是 `[0, 9]`）。
- 文本：`Font` 的 `width`（量宽/居中）、`drawInBatch(...)`（要点：Component/String、x、y、RGB 颜色、`Matrix4f`——用 `last().pose()` 取栈顶矩阵）。

## 高级 shader 路线

- Satin 库（Fabric 高级 shader）：见 `knowledge/libs/fabric-only/mc-satin/SKILL.md`。**本技能只写 vanilla/Fabric API 术语与路线**；shader 具体能力以该库文为准。

## 决策

```
IF GUI 上画形状/文本/贴图 → GuiGraphics 方法
IF 非方形/自定义几何 → BufferBuilder（VertexFormat + Mode 顺序写顶点）
IF 方块动态渲染 → BlockEntityRenderer（客户端源集 + Client 侧注册）
IF 高级 shader → mc-satin 库文
```

## 常见错误

- ❌ 用 legacy OpenGL（1.17+ 不可）
- ❌ 不按 VertexFormat 顺序写顶点数据 / 顶点顺序导致 culling 消失面
- ❌ push/pop 不配对
- ❌ 渲染类放 `src/main`（分源集工程）
- ❌ 服务端线程调用客户端渲染代码

## 快速入口

- 注册与生命周期：`mc-registry`、`01-registry.mdc`
- 模型/纹理：`mc-model`、`mc-resourcepack`
- 反模式：`fabric/1.21.1/knowledge/antipatterns/`

## 下一步

根据任务打开官方文档全文（`get_doc_full`）或社区短文（遵守 `community_knowledge/AGENT_USAGE.md`）。
