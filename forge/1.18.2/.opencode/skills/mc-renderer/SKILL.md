---
name: mc-renderer
description: 客户端实体/方块渲染、BER、层与纹理。触发词：Renderer、RenderType、BER
platform: forge
version: "1.18.2"
dependencies: []
mappings: mcp
---

# mc-renderer

> 本档正文的类名 / 方法签名 / 事件名只来自 `data/forge_1.18.2` 本档语料，实读页面（均在 `forge-docs/1.18.2/processed/`）：`blockentities_ber.md`（BER）、`items_bewlr.md`（BEWLR）、`rendering_modelloaders.md`（自定义模型加载器 / OBJ）、`concepts_events.md`（mod event bus 上的 `ColorHandlerEvent` / `ModelBakeEvent` / `TextureStitchEvent`）、`gameeffects_particles.md`（`ParticleRenderType`）、`blockentities.md`（方块实体承担动态渲染）、`concepts_sides.md`（`Render Thread`）。
> 页内没有的签名一律留 `TODO(未核实)`，禁止用邻版（1.17.1 / 1.19.4 / 1.20.1）或 NeoForge 档补全。
> ⚠️ mappings：本档 frontmatter 记 `mappings: mcp`，但本档 `AGENTS.md` 基本信息表钉的通道是 **parchment `2022.08.21-1.18.2`**（官方 1.18.2-40.3.0 MDK 默认 `official`）。语料页面一律是 mojmap 形名（`BlockEntityRenderer` / `PoseStack` / `MultiBufferSource` / `BakedModel`）⇒ **禁止**在本档工程写 `func_XXXXX` / `field_XXXXX` 或任何 MCP 形名。
> ⚠️ 与 1.17.1 相比本档语料**少了** `models_color` 与 `models_itemproperties` 两页：染色接口与 item property 的具体签名在本档不可核（只有 `ColorHandlerEvent` 这个事件名出现在 `concepts_events.md` 的清单里）⇒ 见文末「本档未覆盖」。

## Decision: 选择渲染方案

```
IF 静态形状能表达（vanilla JSON）→ 只写模型，不写渲染器
IF 模型格式不是 vanilla JSON（OBJ 等）→ JSON 顶层 loader 字段 + IModelLoader / IModelGeometry
IF 方块有动态内容且有 BlockEntity → BER（EntityRenderersEvent$RegisterRenderers 注册）
IF 物品要按 ItemStack 动态画 → BEWLR（前提：BakedModel#isCustomRenderer 返回 true）
IF 同一方块/物品按 float 状态换模型 → overrides JSON（本档无签名页，注册 API 未核实）
IF 纹理要染色 → ColorHandlerEvent（本档只有事件名，接口签名未核实）
IF 粒子要自定义外观 → Particle 的 render + getRenderType（选一个 ParticleRenderType）
IF 实体本体渲染 → 本档语料无对应页面，见「本档未覆盖」
```

## BER：方块实体渲染（`blockentities_ber`）

`BlockEntityRenderer`（BER）用于无法用静态烘焙模型（JSON、OBJ、B3D 等）表达的方块；前提是方块有 `BlockEntity`。`blockentities.md` 也把「dynamic rendering」列为 BlockEntity 的三大用途之一（另两个是存动态数据与 tick 任务）。

- 继承 `BlockEntityRenderer`，泛型参数 = 该方块的 `BlockEntity` 类；泛型用于 BER 的 `render` 方法。
- `render` 每帧调用。页内列出的参数：`blockEntity`（被渲染的方块实体实例）、`partialTicks`（距上一个整 tick 的小数）、`poseStack`（持有「偏移到该方块实体当前位置」的四维矩阵条目的栈）、`bufferSource`（可取到 vertex consumer 的渲染缓冲）、`combinedLight`（当前光照值 int）、`combinedOverlay`（当前 overlay int，通常 `OverlayTexture#NO_OVERLAY` 或 655,360）。返回类型与精确形参类型页内未写 ⇒ `// TODO(未核实)`。
- **一个 `BlockEntityType` 只有一个 BER 实例**：单实例状态存进方块实体，不要存进 BER（否则该类型所有方块每帧一起动）。
- 注册：**在 mod event bus 上订阅 `EntityRenderersEvent$RegisterRenderers`，调用 `#registerBlockEntityRenderer`**。构造器是否需要 `BlockEntityRendererProvider$Context`：本档页面未提 ⇒ 未核实（1.17.1 的 primer 有该说法，但不要跨档抄，先 `search_forge_docs version=1.18.2` 核）。

## BEWLR：物品上的动态渲染（`items_bewlr`）

`BlockEntityWithoutLevelRenderer` 用于在物品上做动态渲染；比旧体系简单——旧体系要求一个 `BlockEntity` 且拿不到 `ItemStack`。

- 渲染入口（页内完整签名，照抄即用）：

```java
public void renderByItem(ItemStack itemStack, TransformType transformType, PoseStack poseStack, MultiBufferSource bufferSource, int combinedLight, int combinedOverlay)
```

- 前提：`Item` 的模型对 `BakedModel#isCustomRenderer` 返回 true；否则不会取该 Item 的 BEWLR，走默认的 `ItemRenderer#getBlockEntityRenderer`。
- 挂法：在 `Item#initializeClient` 里消费一个 `IItemRenderProperties` 匿名实例，覆写 `IItemRenderProperties#getItemStackRenderer` 返回你的 BEWLR（页内原样示例）：

```java
// In your item class
@Override
public void initializeClient(Consumer<IItemRenderProperties> consumer) {
  consumer.accept(new IItemRenderProperties() {

    @Override
    public BlockEntityWithoutLevelRenderer getItemStackRenderer() {
      return myBEWLRInstance;
    }
  });
}
```

- 页内 Important：**每个 mod 只应有一个自定义 BEWLR 实例**。除此之外无需额外设置。
- ⚠️ 名字与后档不同，禁止后档前置：本档页面写的是 `IItemRenderProperties#getItemStackRenderer` 与参数类型 `TransformType`；1.19.4 / 1.20.1 档页面已改成 `IClientItemExtensions#getCustomRenderer` + `ItemDisplayContext`。全库 grep 确认 `IClientItemExtensions` 在本档 **零命中**。

## 自定义模型加载器（`rendering_modelloaders`）

- 「model 就是形状」。多数模型是 vanilla JSON 格式；**其他格式的模型在运行时由 `IModelLoader` 装成 `IModelGeometry`**。Forge 提供的默认实现覆盖：WaveFront OBJ 文件、桶（buckets）、composite models、处于不同 render layer 的模型、以及 vanilla `builtin/generated` 物品模型的重实现。多数代码不关心是谁加载的、原格式是什么，因为它们最终都以 `BakedModel` 表示。
- OBJ：JSON 必须引用 `forge:obj` 加载器。该加载器接受任何**已注册 namespace** 下、path 以 `.obj` 结尾的模型位置；`.mtl` 要与 `.obj` 同名同目录才会被自动使用；`.mtl` 里指向纹理的路径多半要手改；纹理 V 轴可能因建模软件而翻转（V = 0 可能在下边）。页内给出的 JSON 形态：

```json
{
  // Add the following line on the same level as a 'model' declaration
  "loader": "forge:obj",
  "flip-v": true,
  "model": "examplemod:models/block/model.obj",
  "textures": {
    // Can refer to in .mtl using #texture0
    "texture0": "minecraft:block/dirt",
    "particle": "minecraft:block/dirt"
  }
}
```

- 自定义 `IModelLoader` 的注册入口与 `IModelGeometry` 要实现的方法：本档页面未给 ⇒ `// TODO(未核实)`。

## 渲染相关的事件在哪条总线（`concepts_events`）

- `concepts_events.md` 把 `ColorHandlerEvent`、`ModelBakeEvent`、`TextureStitchEvent`、`RegistryEvent` 列为**在 mod event bus 上触发**的杂项注册事件（该页同时说明：这类事件大多不并行，与并行的 lifecycle 事件不同）。
- lifecycle 事件（`FMLCommonSetupEvent`、`FMLClientSetupEvent`、`FMLDedicatedServerSetupEvent`、`InterModEnqueueEvent`、`InterModProcessEvent`）都是 `ParallelDispatchEvent` 的子类、**并行执行**；要在主线程跑就调 `#enqueueWork`。
- `FMLClientSetupEvent` 与 `FMLDedicatedServerSetupEvent` 只在各自 distribution 上触发。
- 本页**没有**给出 `ColorHandlerEvent$Block` / `#getBlockColors()` / `BlockColors#register` 这一串的具体签名——本档也没有染色页 ⇒ 写染色前先 `search_forge_docs version=1.18.2`。

## 粒子渲染（`gameeffects_particles`）

- 任何 `Particle` 都要实现两个方法：`render`（把粒子画到屏幕上）与 `getRenderType`（取该粒子的渲染类型）。
- 渲染纹理的常用基类是 `TextureSheetParticle`（**1.16.5 那侧叫 `SpriteTexturedParticle`，本档页面已是新名**）：仍要实现 `#getRenderType`，之后设好的纹理 sprite 会画在粒子位置。
- `ParticleRenderType`（本档已去掉 `I` 前缀）页面描述为「`RenderType` 的一个变体」：为同类型所有粒子构造 startup / teardown 阶段，再经 `Tesselator`（页面原样拼写）一次性渲染。页面称共六种；本页表格可读到的名字：`TERRAIN_SHEET`、`PARTICLE_SHEET_OPAQUE`、`PARTICLE_SHEET_TRANSLUCENT`、`PARTICLE_SHEET_LIT`（同 `PARTICLE_SHEET_OPAQUE`，但**不使用 particle shader**）、`CUSTOM`（只给 blending 与 depth mask 的 setup，渲染本体要在 `Particle#render` 里自己做）。
- 除类比那一句外，`RenderType` 本身在本档语料里没有任何方法或用法 ⇒ 不要凭记忆写 `RenderType.getXxx()`。

## 常见错误

- ❌ 把单实例状态存进 BER → 该类型所有方块每帧一起动；存进方块实体。
- ❌ 方块没有 `BlockEntity` 却想用 BER。
- ❌ 还按 1.16.5 写 `TileEntityRenderer` / `ClientRegistry#bindTileEntityRenderer` / `ItemStackTileEntityRenderer` / `setISTER` / `MatrixStack` / `IRenderTypeBuffer` —— 本档页面全是 mojmap + 事件注册形。
- ❌ 提前按 1.19.4 / 1.20.1 写 `IClientItemExtensions#getCustomRenderer` 或 `ItemDisplayContext` —— 本档页面上没有。
- ❌ BEWLR 没让 `BakedModel#isCustomRenderer` 返回 true；或一个 mod 建多个 BEWLR 实例。
- ❌ OBJ 模型 JSON 没写 `"loader": "forge:obj"`，或 `.mtl` 没与 `.obj` 同名同目录。
- ❌ 把染色 / ModelBake / TextureStitch 一类注册事件订阅到游戏总线：本档页面把它们列在 mod event bus 一侧。
- ❌ 在并行的 lifecycle 事件里直接碰主线程数据而不走 `#enqueueWork`。
- ❌ 拿 1.17.1 的 `models_color` / `models_itemproperties` 页签名当本档已核实内容（本档语料没有这两页）。

## 本档未覆盖（禁止默写）

- **实体渲染器**：本档语料没有实体渲染页，`EntityRenderersEvent$AddLayers`、`RegisterLayerDefinitions`、`LayerDefinition`、`ModelPart`、`RenderManager`、`EntityRenderersEvent$RegisterRenderers` 的实体侧用法均未在本档出现（1.17.1 的 `primer_1_17` 有，但那是别档）⇒ 一律 `// TODO(未核实)`，改口 `search_forge_docs version=1.18.2`，或让用户自备 1.18.2 Forge jar 经 `ingest_loader_api` 后 `query_loader_api` 逐签名核对。
- **染色与 item property**：本档语料**没有** `models_color` / `models_itemproperties` 页；只有 `ColorHandlerEvent` 这个事件名。`BlockColor` / `ItemColor` / `tintIndex` / `ItemProperties#register` / `ClampedItemPropertyFunction` 一律未核实，禁止从 1.17.1 抄进本档。
- `RenderType` 方法集合、render layer 的 JSON 声明、`ItemBlockRenderTypes`：本档语料无。
- shader / `RenderSystem` / `Effect` / `RegisterShadersEvent`：本档语料无（1.17.1 的 primer 才写这些）。
- `IModelLoader` 的注册入口与 `IModelGeometry` 方法面：页内只给了概念与 OBJ 用法 ⇒ 未核实。

## 相关

- 客户端/服务端分离与 `Render Thread`：`08-client-server.mdc`；方块与方块实体：`02-block.mdc`；物品：`03-item.mdc`；实体：`04-entity.mdc`；事件与 mod event bus：`05-events.mdc`；注册：`01-registry.mdc`；反模式：`09-anti-patterns.mdc`
- 同档页面 id（`get_forge_doc_full`，`version=1.18.2`）：`blockentities_ber` / `items_bewlr` / `rendering_modelloaders` / `blockentities` / `items` / `blocks` / `concepts_events` / `concepts_sides` / `gameeffects_particles`
- 1.17.1 → 1.18.2 的移植对照先读同档 `legacy_porting.md`（本档语料里该页无任何 render 条目，读它只是为了确认「本档没有登记渲染改动」，不要指望它给签名）。
