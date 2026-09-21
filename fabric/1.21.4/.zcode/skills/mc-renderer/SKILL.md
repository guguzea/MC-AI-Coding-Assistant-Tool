---
name: mc-renderer
description: Fabric 1.21.4 mc-renderer。类名只来自本档核实表与 search_fabric_docs。
platform: fabric
version: "1.21.4"
docsTool: search_fabric_docs
mappings: yarn
mappings_alt: mojmap
---

# mc-renderer（Fabric 1.21.4）

### ⚠️ 映射口径：本档语料是 mojmap

本件正文出现的下列名字是 **mojmap（Mojang 官方映射）/ 上游文档页写法**，本档 frontmatter 已声明 `mappings: yarn`，落笔须用右列。两套名不能混用。

| mojmap 名 | Yarn 名 | 适用版本（13 档逐档 join 实测） | 依据 |
| --- | --- | --- | --- |
| `Axis` | `RotationAxis` | 1.19.4–1.21.11 | join（`net.minecraft.util.math.RotationAxis`） |
| `BlockEntityRendererProvider` | `BlockEntityRendererFactory` | 1.17.1–1.21.11 | join（`net.minecraft.client.render.block.entity.BlockEntityRendererFactory`） |
| `BlockEntityRenderers` | `BlockEntityRendererFactories` | 1.17.1–1.21.11 | join（`net.minecraft.client.render.block.entity.BlockEntityRendererFactories`） |
| `GuiGraphics` | `DrawContext` | 1.20.1–1.21.11 | join（`net.minecraft.client.gui.DrawContext`） |
| `PoseStack` | `MatrixStack` | 1.16.5–1.21.11 | join（`net.minecraft.client.util.math.MatrixStack`） |
| `ResourceLocation` | `Identifier` | 1.14.4–1.21.10 | join（`net.minecraft.util.Identifier`） |
| `ServerPlayer` | `ServerPlayerEntity` | 1.14.4–1.21.11 | join（`net.minecraft.server.network.ServerPlayerEntity`） |
| `Tesselator` | `Tessellator` | 1.14.4–1.21.11 | join（`net.minecraft.client.render.Tessellator`） |

- 上表只证**类名存在与包路径**，**不证**方法名/参数/返回值。逐签名以本档语料为准：`search_fabric_docs version=1.21.4`，或 `get_minecraft_source`（需 JDK 17+）/ IDE `./gradlew genSources`。
- 两套同名的类（`ItemStack` / `BlockPos` 等）不在表内，直接写。`net.fabricmc.fabric.api.*`（Fabric API 自身不混淆）与示例工程自造类名也不在表内。

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
