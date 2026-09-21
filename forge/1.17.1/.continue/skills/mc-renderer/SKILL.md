---
name: mc-renderer
description: 客户端实体/方块渲染、BER、层与纹理。触发词：Renderer、RenderType、BER
platform: forge
version: "1.17.1"
dependencies: []
mappings: official
---

# mc-renderer

> 本档正文的类名 / 方法签名 / 事件名只来自 `data/forge_1.17.1` 本档语料，实读页面（均在 `forge-docs/1.17.1/processed/`）：`blockentities_ber.md`（BER）、`rendering_bewlr.md`（BEWLR）、`models_color.md`（`BlockColor` / `ItemColor`）、`models_itemproperties.md`（`ItemProperties`）、`primer_1_17.md`（§TileEntityRenderer、§Rendering / Shader-based Rendering、§ClampedItemPropertyFunction、§Entity Models、§Open GL）。
> 页内没有的签名一律留 `TODO(未核实)`，禁止用邻版（1.16.5 / 1.18.2）或 NeoForge 档补全。
> 本档 mappings = **official**（`AGENTS.md` / `scaffold/gradle.properties` / `00-project-setup.mdc` 三处一致），所以页面用的是 mojmap 名（`BlockEntityRenderer`、`PoseStack`、`MultiBufferSource`、`ClientLevel`）。**不要**按 1.16.5 那侧的 MCP 名（`TileEntityRenderer`、`MatrixStack`、`IRenderTypeBuffer`、`ItemModelsProperties`、`IBlockColor`）写本档工程。
> ⚠️ 1.17.1 是渲染体系的大改档：`RenderType` 在本档语料里只以一句「`RenderSystem#setShader` which includes vertex consumer data and old RenderType things」出现，**没有任何 `RenderType` 方法签名**；shader / 图层一律走下面 `primer_1_17` 的 `RenderSystem` + `EntityRenderersEvent` 路线。

## Decision: 选择渲染方案

```
IF 静态形状能表达（JSON / OBJ）→ 只写模型，不写渲染器
IF 方块有动态内容且有 BlockEntity → BER（注册走 EntityRenderersEvent$RegisterRenderers）
IF 物品要按 ItemStack 动态画 → BEWLR（前提：BakedModel#isCustomRenderer 返回 true）
IF 方块/物品纹理要染色 → BlockColor / ItemColor（在 ColorHandlerEvent 里注册）
IF 同一物品按 float 状态换模型 → ItemProperties.register + overrides JSON（仅客户端，入 enqueueWork）
IF 实体渲染 / 加渲染层 / 模型层定义 → EntityRenderersEvent 三个子事件 + LayerDefinition
IF 要自定义 GL 状态或 shader → RenderSystem + RegisterShadersEvent（签名多为未核实）
```

## BER：方块实体渲染（`blockentities_ber`）

`BlockEntityRenderer`（BER）用于无法用静态烘焙模型（JSON、OBJ、B3D 等）表达的方块；前提是方块有 `BlockEntity`。

- 继承 `BlockEntityRenderer`，泛型参数 = 该方块的 `BlockEntity` 类；泛型用于 BER 的 `render` 方法。
- `render` 每帧调用。页内列出的参数：`blockEntity`（被渲染的方块实体实例）、`partialTicks`（距上一个整 tick 的小数）、`poseStack`（持有「偏移到该方块实体当前位置」的四维矩阵条目的栈）、`bufferSource`（可取到 vertex consumer 的渲染缓冲）、`combinedLight`（当前光照值 int）、`combinedOverlay`（当前 overlay int，通常 `OverlayTexture#NO_OVERLAY` 或 655,360）。返回类型与精确形参类型页内未写 ⇒ `// TODO(未核实)`。
- **一个 `BlockEntityType` 只有一个 BER 实例**：单实例状态存进方块实体，不要存进 BER（否则该类型所有方块每帧一起动）。
- 注册：**在 mod event bus 上订阅 `EntityRenderersEvent$RegisterRenderers`，调用 `#registerBlockEntityRenderer`**。
- `primer_1_17` 补充的构造约束：BER 类的构造器现在需要一个 `BlockEntityRendererProvider$Context` 参数；传给 `registerBlockEntityRenderer` 的是一个 `BlockEntityRendererProvider` 实例，它接收你 BER 类里那个 `BlockEntityRendererProvider$Context`。
- ⚠️ 本档页面已**没有** fast 渲染器分支（1.13.2 / 1.14.4 的 `TileEntityRendererFast` / `renderTileEntityFast` / `VertexBuffer` / `hasFastRenderer` 在本档全部消失），不要再写 fast 分支。

## BEWLR：物品上的动态渲染（`rendering_bewlr`）

`BlockEntityWithoutLevelRenderer` 用于在物品上做动态渲染；比旧体系简单——旧体系要求一个 `BlockEntity` 且拿不到 `ItemStack`。

- 渲染入口（页内完整签名，照抄即用）：

```java
public void renderByItem(ItemStack itemStack, TransformType transformType, PoseStack poseStack, MultiBufferSource bufferSource, int combinedLight, int combinedOverlay)
```

- 前提：`Item` 的模型对 `BakedModel#isCustomRenderer` 返回 true；否则不会取该 Item 的 BEWLR，走默认的 `ItemRenderer#getBlockEntityRenderer`。
- 设置方式：在 `Item#initializeClient` 里消费一个 `IItemRenderProperties` 匿名实例，并覆写 `IItemRenderProperties#getItemStackRenderer` 返回你的 BEWLR 实例（页内原样示例）：

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
- ⚠️ 本档物品侧的名字是 `IItemRenderProperties#getItemStackRenderer`；后档页面出现的 `IClientItemExtensions#getCustomRenderer` 形态在本档语料里不存在，禁止前置。

## 染色：BlockColor / ItemColor（`models_color`）

- 模型面支持标「tint indices」，由 `BlockColor` / `ItemColor` 处理（**本档已去掉 `I` 前缀**，`IBlockColor` / `IItemColor` 是前档名）。两者都是单方法接口：
  - `BlockColor` 收 `BlockState`、（可空）`BlockAndTintGetter`、（可空）`BlockPos`；`ItemColor` 收 `ItemStack`；都另有 `int` 参数 `tintIndex`，都返回 `int` 颜色乘子。
  - `int` 按 4 个无符号字节 ARGB（最高有效字节到最低）解释；每像素每通道 `(int)((float) base * multiplier / 255.0)`；**方块不使用 alpha 通道**。
  - 继承 `builtin/generated` 的物品模型里每个层（`layer0`、`layer1`…）的 tint index 与层号对应。
- 注册（页内示例，照抄形态）：`BlockColors` 经 `ColorHandlerEvent$Block` 取得、`BlockColors#register` 注册；`ItemColors` 经 `ColorHandlerEvent$Item` 取得、`ItemColors#register` 注册（有收 `Block` 的重载，等价于给 `Block#asItem` 那个物品注册）。

```java
@SubscribeEvent
public void registerBlockColors(ColorHandlerEvent.Block event){
    event.getBlockColors().register(myBlockColor, coloredBlock1, coloredBlock2, ...);
}

@SubscribeEvent
public void registerItemColors(ColorHandlerEvent.Item event){
    event.getItemColors().register(myItemColor, coloredItem1, coloredItem2, ...);
}
```

- 注册 `BlockColor` **不会**染到 `BlockItem`；`BlockItem` 是物品，要另用 `ItemColor`。

## Item property 与 overrides（`models_itemproperties`）

- item property 给每个 `ItemStack` 赋一个 `float`，物品模型 JSON 用 `overrides` 连续选模型（弓、指南针、钟同理）。值不强制，但一般在 `0.0F`–`1.0F`。
- 注册：`ItemProperties#register`，参数依次 `Item`（页内例 `ExampleItems#APPLE`）、`ResourceLocation`（属性名）、`ItemPropertyFunction`——后者收 `ItemStack`、所在的 `ClientLevel`（可 null）、持有的 `LivingEntity`（可 null）、以及持有实体 id 的 `int`（可为 `0`），返回 `float`。
- 另有私有方法 `ItemProperties#registerGeneric`（给所有物品挂属性，不收 `Item` 参数）。
- 时机：写在 `FMLClientSetupEvent` 里，且必须 `FMLClientSetupEvent#enqueueWork`——页内 Important 说明 `ItemProperties` 里的数据结构不是线程安全的。
- **仅客户端**：页内明确「与 1.16.x 以前的版本不同，这里只能客户端，因为 `ItemProperties` 在服务端不存在」。
- 接口更替：页内 Note 写 `ItemPropertyFunction` 已被 Mojang 废弃，改用子接口 `ClampedItemPropertyFunction`（把结果 clamp 到 0–1）。`primer_1_17` 同调并补两点：vanilla 强制 clamp 到 0–1，**Forge 把这个限制打了出去**所以可设未 clamp 的值（自己 extends 接口覆写 `call` 也能去掉）；`ItemPropertyFunction` 现在多收第四个参数 = 持物实体的 id。
- JSON 侧：`overrides` 条目形如 `{"predicate": {"examplemod:power": 0.75}, "model": "examplemod:item/example_powered"}`；一个 predicate 对所有 **大于等于** 给定值的值生效；无匹配用当前模型；多个匹配取列表中最后一个。
- 页内示例（含四参 lambda）：

```java
private void setup(final FMLClientSetupEvent event)
{
  event.enqueueWork(() ->
  {
    ItemProperties.register(ExampleItems.APPLE,
      new ResourceLocation(ExampleMod.MODID, "pulling"), (stack, level, living, id) -> {
        return living != null && living.isUsingItem() && living.getUseItem() == stack ? 1.0F : 0.0F;
      });
  });
}
```

## 实体渲染与图层（`primer_1_17` §Entity Models）

37.0.8 加入 `EntityRenderersEvent` 一组事件来注册这些数据：

- `EntityRenderersEvent$RegisterRenderers`：注册实体渲染器（也是本档 BER 的注册入口）。
- `EntityRenderersEvent$AddLayers`：给某个具体实体渲染器加渲染层。
- `EntityRenderersEvent$RegisterLayerDefinitions`：注册模型层定义本身；`LayerDefinition` 必须在它里面注册。

实体模型数据的几个定义对象（页内措辞）：`MeshDefinition`（模型定义，持有其全部数据）、`LayerDefinition`（模型 + 纹理的定义）、`MaterialDefinition`（纹理数据定义，具体是纹理尺寸）、`PartDefinition`（模型部件定义，bake 后产出 `ModelPart`）、`CubeDeformation`（分别表示 x/y/z 方向的立方膨胀，只增大 max 值再重对齐，不会两侧同时增大；盔甲模型是例子）。`ModelRenderer` 或 group/bone 也在该页出现。

页内给出的参考实现名：Forge 的 `EntityRendererEventTest`（`net.minecraftforge.debug.client.rendering.EntityRendererEventsTest`）。三个子事件的方法签名页内未写 ⇒ `// TODO(未核实)`。

## Shader / GL 状态（`primer_1_17` §Rendering、§Open GL）

Minecraft 移到 OpenGL 3.2 Core，随之而来的是基于 shader 的渲染；「一切 shader 相关都走 `RenderSystem`」。页内列出的改动：

- `RenderSystem` 里任何 `bind` 调用改为 `RenderSystem#setShaderTexture(0, resourceLocation)`。
- 设色值从 `RenderSystem#color` 改为 `RenderSystem#setShaderColor`。
- 用 shader：调 `RenderSystem#setShader` 并传方法引用，通常来自 `GameRenderer`；该调用「includes vertex consumer data and old RenderType things」。
- shader 从 json 加载，vanilla 与 Forge 1.17 都广泛使用。
- 注册新 shader：37.0.15 加入 `RegisterShadersEvent`。页内描述三个要点：第一参数是构造好的 event param 实例、shader 的唯一名字、以及 vertex format；第二参数可用于加载时缓存实例；用法示例见 Forge 的 `ForgeHooksClient`。
- ⚠️ 该页另注明：Java 17 **不能**用于 Forge 开发环境（有补丁不崩，但 Forge 不官方支持）；本档 Java 版本是 16（`gettingstarted.md:14`）。

## 常见错误

- ❌ 仍用 1.16.5 的名：`TileEntityRenderer`、`MatrixStack`、`IRenderTypeBuffer`、`ItemStackTileEntityRenderer`、`Item$Properties#setISTER`、`ItemModelsProperties`、`IBlockColor`、`IItemColor`、`IBlockDisplayReader`、`ClientWorld` —— 本档页面全是 mojmap 形。
- ❌ 从 `ClientRegistry#bindTileEntityRenderer` 注册 BER —— 本档已改走 `EntityRenderersEvent$RegisterRenderers#registerBlockEntityRenderer`（mod event bus）。
- ❌ BER 构造器不收 `BlockEntityRendererProvider$Context`，或注册时不传 `BlockEntityRendererProvider`。
- ❌ 把单实例状态存进 BER → 该类型所有方块一起动。
- ❌ BEWLR 没让 `BakedModel#isCustomRenderer` 返回 true；或一个 mod 建了多个 BEWLR 实例。
- ❌ `ItemProperties.register` 不入 `enqueueWork`、或放到服务端 / 公共 setup。
- ❌ 需要 0–1 之外的值时忘了 `ClampedItemPropertyFunction` 的 clamp 语义（Forge 已把 vanilla 的强制 clamp 打出去，但仍要按接口选型写）。
- ❌ 还在写 fast TER 分支（`TileEntityRendererFast` / `renderTileEntityFast`）——本档页面无此套。
- ❌ 用 `RenderSystem#bind` / `RenderSystem#color` 老写法。

## 本档未覆盖（禁止默写）

- `RenderType` 的方法集合与 render layer 的 JSON 声明：本档语料只有一句「old RenderType things」，**无任何签名** ⇒ 需要时先 `search_forge_docs version=1.17.1`，或让用户自备 1.17.1 Forge jar 走 `ingest_loader_api` + `query_loader_api` 逐签名核对。
- 自定义 `IModelLoader` / `IModelGeometry` / OBJ 加载器：本档语料无模型加载器专题页（1.18.2 起才有 `rendering_modelloaders`）⇒ 未核实。
- 自定义实体渲染器本体（`EntityRenderer` 子类要实现哪些方法）：`primer_1_17` 只给注册事件与模型数据结构，未给渲染器方法 ⇒ 未核实。
- `RegisterShadersEvent` 的精确构造参数类型、`.json` shader 文件的字段格式：页内只给了描述与外部链接 ⇒ 未核实。
- 粒子：本篇不背书粒子写法。本档另有 `effects_particles.md` 一页，写粒子前先读它，不要拿 1.16.5 的粒子页（含 `SpriteTexturedParticle` / `IParticleRenderType` 一类前档名）当本档依据。

## 相关

- 客户端/服务端分离：`08-client-server.mdc`；方块与方块实体：`02-block.mdc`；物品：`03-item.mdc`；实体与实体渲染：`04-entity.mdc`；事件与 mod event bus：`05-events.mdc`；注册：`01-registry.mdc`；反模式：`09-anti-patterns.mdc`
- 同档页面 id（`get_forge_doc_full`，`version=1.17.1`）：`blockentities_ber` / `rendering_bewlr` / `models_color` / `models_itemproperties` / `primer_1_17` / `blockentities_blockentity` / `items_items` / `effects_particles`
