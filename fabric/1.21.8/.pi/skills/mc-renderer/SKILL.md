---
name: mc-renderer
description: Fabric 1.21.8 mc-renderer。类名只来自本档核实表与 search_fabric_docs。
platform: fabric
version: "1.21.8"
docsTool: search_fabric_docs
mappings: yarn
mappings_alt: mojmap
---

# mc-renderer（Fabric 1.21.8）

### ⚠️ 映射口径：本档语料是 mojmap

本件正文出现的下列名字是 **mojmap（Mojang 官方映射）/ 上游文档页写法**，本档 frontmatter 已声明 `mappings: yarn`，落笔须用右列。两套名不能混用。

| mojmap 名 | Yarn 名 | 适用版本（13 档逐档 join 实测） | 依据 |
| --- | --- | --- | --- |
| `Axis` | `RotationAxis` | 1.19.4–1.21.11 | join（`net.minecraft.util.math.RotationAxis`） |
| `BlockEntityRendererProvider` | `BlockEntityRendererFactory` | 1.17.1–1.21.11 | join（`net.minecraft.client.render.block.entity.BlockEntityRendererFactory`） |
| `BlockEntityRenderers` | `BlockEntityRendererFactories` | 1.17.1–1.21.11 | join（`net.minecraft.client.render.block.entity.BlockEntityRendererFactories`） |
| `GuiGraphics` | `DrawContext` | 1.20.1–1.21.11 | join（`net.minecraft.client.gui.DrawContext`） |
| `PoseStack` | `MatrixStack` | 1.16.5–1.21.11 | join（`net.minecraft.client.util.math.MatrixStack`） |
| `Tesselator` | `Tessellator` | 1.14.4–1.21.11 | join（`net.minecraft.client.render.Tessellator`） |

- 上表只证**类名存在与包路径**，**不证**方法名/参数/返回值。逐签名以本档语料为准：`search_fabric_docs version=1.21.8`，或 `get_minecraft_source`（需 JDK 17+）/ IDE `./gradlew genSources`。
- 两套同名的类（`ItemStack` / `BlockPos` 等）不在表内，直接写。`net.fabricmc.fabric.api.*`（Fabric API 自身不混淆）与示例工程自造类名也不在表内。

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
