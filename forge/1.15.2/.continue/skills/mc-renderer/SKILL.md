---
name: mc-renderer
description: 客户端实体/方块渲染、BER、层与纹理。触发词：Renderer、RenderType、BER
platform: forge
version: "1.15.2"
dependencies: []
mappings: mcp
---

# mc-renderer

> **版本差异先说明**（与 1.19+/1.20.x 根本不同）：
> - 本档（1.15.2）**没有** JSON `render_type`（1.19+ 特性，仓库内该页在 1.20.4 档 `rendering_modelextensions_rendertypes`）。1.15.2 时代声明方块渲染层（solid / translucent / cutout 等）用 `RenderTypeLookup#setRenderLayer`，在 `FMLClientSetupEvent` 中调用（`primer_1_15` 页核实）。
> - 动态方块渲染叫 **TER / TileEntityRenderer**（页 id：`tileentities_tesr`）；动态物品渲染叫 **ISTER / ItemStackTileEntityRenderer**（页 id：`rendering_ister`）；BEWLR（BlockEntityWithoutLevelRenderer）是后续版本体系，本档没有。
> - 实体渲染器（EntityRenderer）与自定义 shader：本档文档无核实页，按「机制路线 + 以 `search_forge_docs` 为准」处理，不给签名。

## 快速开始

### 路线 1：静态烘焙模型（大多数方块/物品）

走 vanilla JSON 模型即可；Forge 在模型 JSON 顶层提供 `loader` 字段注册自定义模型加载器（`primer_1_15` 页核实）。渲染层声明见「API 锚点 · RenderType/Render Layers」。

### 路线 2：TER（方块动态渲染）

1. 方块必须已有 TileEntity（TER 前提，`tileentities_tesr` 页）。
2. 类继承 `TileEntityRenderer`，泛型 = 该方块的 TileEntity 类；每帧调用 `render`。
3. 注册：`ClientRegistry#bindTileEntityRenderer`，传入 `TileEntityType` 与该 TER 实例（页内原文）。

### 路线 3：ISTER（物品动态渲染）

1. 前提：物品模型 `IBakedModel#isBuiltInRenderer` 返回 true（否则走默认 `ItemStackTileEntityRenderer#instance`）。
2. 设置：通过 `Item$Properties#setISTER` 传入 ISTER；每个物品至多一个 ISTER（getter 为 final，避免每帧新建）。签名细节以 `search_forge_docs` 为准。

## API 锚点

### RenderType / Render Layers（页 id：`primer_1_15`）

- 1.15 新渲染系统核心是 `RenderType` + `BufferBuilder`；`IRenderTypeBuffer` 可视为 `Map<RenderType, BufferBuilder>`（每层一个 buffer），帧末统一按层绘制，GL 状态切换次数为渲染层数。
- 选现成的 RenderType：看 `RenderType`、`RenderTypeLookup`、`Atlases`；例：`RenderType.getEntityTranslucent(<RL>)`（同 `Atlases.getEntityTranslucent()` 但用传入纹理）。
- 非批处理环境（如 GUI）调批处理代码：`IRenderTypeBuffer.immediate` 传临时 BufferBuilder（通常 `Tessellator.getInstance().getBuffer()`），结束调 `IRenderTypeBuffer.Impl.draw()`。
- 方块渲染层声明：`RenderTypeLookup#setRenderLayer`（在 `FMLClientSetupEvent` 中调用）。

### TER（页 id：`tileentities_tesr`）

- 用途：静态烘焙模型（JSON/OBJ/B3D 等）表达不了的方块；前提是方块有 TileEntity。
- 一个 `TileEntityType` 只对应一个 TER ⇒ 每实例状态（如每帧自增的 int）必须存 TileEntity，不能存 TER（否则该类型所有方块每帧一起变）。
- `render` 每帧调用，参数：tileentityIn、partialTicks、matrixStackIn、bufferIn、combinedLightIn、combinedOverlayIn（overlay 常为 `OverlayTexture#NO_OVERLAY` 即 655360）。
- 注册：`ClientRegistry#bindTileEntityRenderer`。

### ISTER（页 id：`rendering_ister`）

- 渲染入口：`public void render(ItemStack itemStackIn, MatrixStack matrixStackIn, IRenderTypeBuffer bufferIn, int combinedLightIn, int combinedOverlayIn)`。
- 前提：`IBakedModel#isBuiltInRenderer` 为 true；未设置时用默认 `ItemStackTileEntityRenderer#instance`。
- 设置：`Item$Properties#setISTER`；每个物品只有一个 ISTER。

## Decision: 选择渲染方案

```
IF 方块静态 → JSON 模型 +（如需）RenderTypeLookup#setRenderLayer 声明渲染层
IF 方块有动态内容且已有 TileEntity → TER（ClientRegistry#bindTileEntityRenderer）
IF 物品要动态渲染 → ISTER（模型 isBuiltInRenderer = true + Item.Properties#setISTER）
IF Entity 本体渲染 / 自定义 shader / 核心管线 → 机制路线，签名以 search_forge_docs 为准
```

## 常见错误

- ❌ 批处理环境（已拿到 `MatrixStack` / `IRenderTypeBuffer`）还直接 GlStateManager/GL11 → 颜色应进顶点数据；旋转/平移用 `MatrixStack`（例：`ms.multiply(Vector3f.POSITIVE_Y.getDegreesQuaternion(90))`，顶点传 `ms.peek().getModel()`）（`primer_1_15` 页）
- ❌ 以为有 JSON `render_type` → 1.15.2 无此特性；用 `RenderTypeLookup#setRenderLayer`（`FMLClientSetupEvent`）
- ❌ TER 里存每实例状态 → 该类型所有 TileEntity 一起动画；状态放 TileEntity
- ❌ 方块没有 TileEntity 却想用 TER → 先建方块实体（`mc-blockentity`）
- ❌ 一个物品多个 ISTER / 每次调用 new 一个 → getter 为 final，每个物品只应有一个

## 参考资料

- 页 id：`tileentities_tesr`（https://docs.minecraftforge.net/en/1.15.2/tileentities/tesr/）、`rendering_ister`（https://docs.minecraftforge.net/en/1.15.2/rendering/ister/）、`primer_1_15`（https://docs.neoforged.net/primer/docs/1.15/，index 内原样 URL）
- 规则文件：`forge/1.15.2/.cursor/rules/`（02-block / 03-item / 08-client-server / 09-anti-patterns）

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-model` | JSON 模型与 `loader` 字段 |
| `mc-blockentity` | TER 配套 TileEntity（tick、数据同步） |
| `mc-block` / `mc-item` | 方块/物品注册与属性 |
| `mc-registry` | 注册表条目（01-registry.mdc） |

## 下一步

按 Decision 选路线；写实体渲染器或自定义 shader 前先 `search_forge_docs`（version=1.15.2）核对（本档未核实部分），完成后对照 `09-anti-patterns.mdc` 走一遍检查。
