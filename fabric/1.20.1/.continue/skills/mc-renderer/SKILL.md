---
name: mc-renderer
description: 客户端实体/方块渲染、BER、层与纹理。触发词：Renderer、RenderType、BER
platform: fabric
version: "1.20.1"
dependencies: []
mappings: yarn
---

# mc-renderer（Fabric 1.20.1）

> **核实结论**：本版（1.20.1）**没有 fabric-docs 版本树**。
> - `data/fabric_1.20.1/meta.json`：`pages: []`；`fabric-docs/1.20.1/failures.json` 原文——「无 versions/1.20.1 与可用归档；不要把 main/VitePress 当本档官方树。search 走 wiki 或 DOC_NOT_FOUND」。
> - 本档 wiki 只有 start / tutorial_blocks / tutorial_commands / tutorial_items / tutorial_kotlin 等——**无渲染页**。
> **策略：机制路线 + 查证路径；禁止把 main 分支文档当 1.20.1 签名。**

## 机制路线（1.21.1 页同世代体系，仅作机制对照）

下列术语全部来自 1.21.1 档两页（`develop-rendering-basic-concepts`、`develop-blocks-block-entity-renderer`），**名称以 1.20.1 Yarn 为准，禁止直接套用**：

- 1.17+ 禁用 legacy OpenGL：必须走 MC 渲染系统（BufferBuilder），或自建并以 `GL.glDrawElements()` 绘制。
- Tessellator（页内拼 `Tesselator`）单例；`begin(VertexFormat, drawMode)` 初始化 BufferBuilder；`addVertex(matrix, x, y, z)` 逐顶点写入，**按 VertexFormat 顺序**补数据；注意 culling。
- VertexFormat 元素 + Draw Modes（LINES / TRIANGLES / QUADS 等）决定数据形状。
- PoseStack：push / pop / peek · translate / scale，旋转经四元数（`Axis`/`RotationAxis` 预制）；**push/pop 必须配对**。
- HUD/界面绘制被 `GuiGraphics` 类抽象（fill / drawBorder / 线 / scissor / drawTexture）。
- BER：动态方块渲染用 `BlockEntityRenderer`；**类放客户端源集**（split sources 下 `src/client/`）；构造参数 `BlockEntityRendererProvider.Context`；每帧 `render`；示例变换 translate(0.5,1,0.5) + mulPose(Axis.XP.rotationDegrees(90)) + scale(1/18f)。
- 页名多为 Mojang 风格——1.20.1 Yarn 对应名（如 GUI 绘图类、`MatrixStack`）**勿默写**。

## 查证路径（按顺序）

1. `query_api`（1.20.1 在约 1.16.5–1.20.4 覆盖范围）：按类名核 Tessellator / BufferBuilder / VertexFormat / 矩阵栈类 / GUI 绘图类 / BER 相关类；`found:false` ≠ 不存在。
2. `get_method_params`（可选）：查方法参数名。
3. `search_docs` / `search_fabric_docs`（1.20.1）→ 预期 DOC_NOT_FOUND；命中其它版本即视同不可用。
4. `search_community_docs`（社区实务；`community_knowledge/AGENT_USAGE.md`：短文不替代官方 API 规范）。
5. Satin 高级 shader：`knowledge/libs/fabric-only/mc-satin/SKILL.md`——**版本范围以其 frontmatter 为准**（本文档不代替库文判断）。

## 行为边界（机制对照）

- 渲染代码客户端专用；服务端加载渲染类可崩；分源集工程勿放 `src/main`。
- 顶点顺序（VertexFormat）+ culling；push/pop 配对。
- 本技能不输出任何 1.20.1 未核实签名：核不到就按「停」处理，禁止用 1.21.x 代码改版本号冒充。

## 快速入口

- 注册与生命周期：`mc-registry`、`01-registry.mdc`
- 模型/纹理：`mc-model`、`mc-resourcepack`
- 反模式：`fabric/1.20.1/knowledge/antipatterns/`

## 下一步

根据任务打开社区短文（遵守 `community_knowledge/AGENT_USAGE.md`）或改口 `query_api` / `search_community_docs`。
