---
name: mc-renderer
description: 客户端实体/方块渲染、BER、层与纹理。触发词：Renderer、RenderType、BER
platform: forge
version: "1.16.5"
dependencies: []
mappings: mcp
---

# mc-renderer

> 本档正文的类名 / 方法签名 / 注册入口只来自 `data/forge_1.16.5` 本档语料，实读页面（均在 `forge-docs/1.16.5/processed/`）：`tileentities_tesr.md`（TER）、`rendering_ister.md`（`ItemStackTileEntityRenderer`）、`models_color.md`（`IBlockColor` / `IItemColor` + `ColorHandlerEvent`）、`models_overrides.md`（`ItemModelsProperties`）、`models_introduction.md`（`ResourceLocation` 与路径规则）、`effects_particles.md`（`IParticleRenderType`）。
> 页内没有的签名一律留 `TODO(未核实)`，禁止用邻版（1.14.4 / 1.17.1 / 1.18.2）或 NeoForge 档补全。
> ⚠️ mappings：本档 frontmatter 记 `mappings: mcp`，而本档 scaffold 默认通道是 **official**（见 `00-project-setup.mdc`）。语料页面本身也两形混用——`ItemModelsProperties` / `IBlockColor` / `MatrixStack` / `IRenderTypeBuffer` / `ResourceLocation` 是 MCP 形，`BlockState` / `BlockItem` / `Block#asItem` / `ClientWorld` / `LivingEntity` / `TileEntityType` 是 official 形。**按用户工程实际声明的那一套改名，禁止混用**；抄本页名字前先在工程里核一遍。
> ⚠️ 本档语料里 `BlockEntityRenderer`、`BER`、`EntityRenderersEvent`、`RenderSystem`、`PoseStack` 零命中（这些是 1.17+ 名）；`RenderType` 全档只出现在 `effects_particles.md` 的一句类比里（「`IParticleRenderType` is a variation on `RenderType`」），**没有任何 `RenderType` 方法或用法** ⇒ 触发词里的 `RenderType` 在本档不足以支撑写法。

## Decision: 选择渲染方案

```
IF 静态形状能表达（JSON / OBJ / B3D）→ 只写模型，不写渲染器
IF 方块有动态内容且有 TileEntity → TER（本档页面已无 Fast TER，见下）
IF 物品要按 ItemStack 动态画 → ISTER（前提：模型 IBakedModel#isCustomRenderer 返回 true）
IF 方块/物品纹理要染色 → IBlockColor / IItemColor（在 ColorHandlerEvent 里注册）
IF 同一物品按 float 状态换模型 → ItemModelsProperties.register + overrides JSON（仅客户端）
IF 粒子要自定义外观 → Particle 的 render + getRenderType（选一个 IParticleRenderType）
IF 实体本体渲染 → 本档语料无对应章节，见「本档未覆盖」
```

## TER：方块实体渲染（`tileentities_tesr`）

`TileEntityRenderer`（TER，前身 `TileEntitySpecialRenderer` / `TESR`）用于无法用静态烘焙模型（JSON、OBJ、B3D 等）表达的方块；前提是方块有 `TileEntity`。

- 继承 `TileEntityRenderer`，泛型参数 = 该方块的 `TileEntity` 类；泛型用于 TER 的 `render` 方法。
- `render` 每帧调用。页内给出的参数与语义（**本页是本档唯一给出完整参数面的一页**）：
  - `tileentityIn`：被渲染的 tile entity 实例。
  - `partialTicks`：距上一个整 tick 过去的时间（以 tick 的小数计）。
  - `matrixStackIn`：持有「偏移到该 tile entity 当前位置」的四维矩阵条目的栈。
  - `bufferIn`：可取到 vertex builder 的渲染缓冲。
  - `combinedLightIn`：该方块实体当前的光照值（int）。
  - `combinedOverlayIn`：当前 overlay（int），通常是 `OverlayTexture#NO_OVERLAY` 或 655,360。
  方法名与参数顺序如上；返回类型与注解页内未写 ⇒ `// TODO(未核实)`。
- **一个 `TileEntityType` 只有一个 TER 实例**：单实例状态存进 tile entity，不要存进 TER（否则该类型所有方块每帧一起动）。
- 注册：`ClientRegistry#bindTileEntityRenderer`，传入要渲染的 `TileEntityType` + 用于渲染该类型全部 TE 的 TER 实例。
- ⚠️ 本档页面上**没有** `TileEntityRendererFast` / `renderTileEntityFast` / `VertexBuffer` / `hasFastRenderer` 这一套（1.13.2 与 1.14.4 页面还有，本档页面已删除）。不要从邻档抄 fast 分支。

## ISTER：物品上的动态渲染（`rendering_ister`）

`ItemStackTileEntityRenderer` 用于在物品上做动态渲染；比旧的「TESR + ItemStack」体系简单——旧体系要求一个 `TileEntity` 且拿不到 `ItemStack`。

- 渲染入口（页内完整签名，照抄即用）：

```java
public void renderByItem(ItemStack itemStackIn, TransformType transformTypeIn, MatrixStack matrixStackIn, IRenderTypeBuffer bufferIn, int combinedLightIn, int combinedOverlayIn)
```

- 前提：`Item` 的模型对 `IBakedModel#isCustomRenderer` 返回 true（**本档已从 `isBuiltInRenderer` 改名为 `isCustomRenderer`**）。返回 true 后才取该 Item 的 ISTER；没有则回退到默认的 `ItemStackTileEntityRenderer#instance`。
- 设置：`Item$Properties#setISTER`。每个 Item 只能有一个 ISTER，getter 是 final（防止每帧返回新实例）。除此之外无需额外设置。
- `transformTypeIn` 直接作为参数传入，不再需要像 1.14 那样从 `IBakedModel#handlePerspective` 里存——本档页面已不含该建议。

## 染色：IBlockColor / IItemColor（`models_color`）

模型面支持在面上标「tint indices」，由 `IBlockColor` / `IItemColor` 处理，两者都是单方法接口：

- `IBlockColor` 收 `BlockState`、（可空）`IBlockDisplayReader`、（可空）`BlockPos`；`IItemColor` 收 `ItemStack`；都另有 `int` 参数 `tintIndex`，都返回 `int` 颜色乘子。
- `int` 按 4 个无符号字节 ARGB（最高有效字节到最低）解释；每像素每通道 `(int)((float) base * multiplier / 255.0)`；**方块不使用 alpha 通道**。
- 继承 `builtin/generated` 的物品模型里每个层（`layer0`、`layer1`…）的 tint index 与层号对应。
- 注册改走事件（页内示例，照抄形态）：

```java
@SubscribeEvent
public void registerBlockColors(ColorHandlerEvent.Block event){
    event.getBlockColors().register(myIBlockColor, coloredBlock1, coloredBlock2, ...);
}

@SubscribeEvent
public void registerItemColors(ColorHandlerEvent.Item event){
    event.getItemColors().register(myIItemColor, coloredItem1, coloredItem2, ...);
}
```

- 页面措辞：`BlockColors` 经 `ColorHandlerEvent$Block` 取得，注册方法 `BlockColors#register`；`ItemColors` 经 `ColorHandlerEvent$Item` 取得，注册方法 `ItemColors#register`（有收 `Block` 的重载，等价于给 `Block#asItem` 那个物品注册）。
- 注册 `IBlockColor` **不会**染到 `BlockItem`；`BlockItem` 是物品，要另用 `IItemColor`。

## Item property 与 overrides（`models_overrides`）

- item property 给每个 `ItemStack` 赋一个 `float`，物品模型 JSON 用 `overrides` 按值连续选模型；弓的拉弓动画就是这么来的（值一般在 `0.0F`–`1.0F`，但不受限于 4 帧）。
- 注册：`ItemModelsProperties#register`。参数依次是 `Item`（要挂属性的物品，页内例 `ExampleItems#APPLE`）、`ResourceLocation`（属性名）、`IItemPropertyGetter`——后者收 `ItemStack`、所在的 `ClientWorld`（可 null）、持有的 `LivingEntity`（可 null），返回 `float`。
- 另有私有方法 `ItemModelsProperties#registerGeneric`（给**所有**物品挂属性，因此不收 `Item` 参数）。
- modded 属性名建议带 modid 命名空间（`examplemod:property`，裸名实际等于 `minecraft:property`）。
- **必须客户端**：与 1.16.x 之前的版本不同，本档页面明确「只能在客户端做，因为 `ItemModelsProperties` 在服务端不存在」。
- 时机与线程：写在 `FMLClientSetupEvent` 里，并且要放进 `FMLClientSetupEvent#enqueueWork`——页内 Note 说明 `ItemModelsProperties` 里的数据结构不是线程安全的。页内示例形态：

```java
private void setup(final FMLClientSetupEvent event)
{
  event.enqueueWork(() ->
  {
    ItemModelsProperties.register(ExampleItems.APPLE,
      new ResourceLocation(ExampleMod.MODID, "pulling"), (stack, world, living) -> {
        return living != null && living.isUsingItem() && living.getUseItem() == stack ? 1.0F : 0.0F;
      });
  });
}
```

- JSON 侧：`overrides` 条目形如 `{"predicate": {"examplemod:power": 0.75}, "model": "examplemod:item/example_powered"}`；一个 predicate 对所有 **大于等于** 给定值的值生效；无匹配用当前模型；多个匹配时**取列表中最后一个**。

## 粒子渲染（`effects_particles`）

- 任何 `Particle` 都要实现两个方法：`render`（把粒子画到屏幕上）与 `getRenderType`（取该粒子的渲染类型）。
- 渲染纹理的常用基类是 `SpriteTexturedParticle`：仍要实现 `#getRenderType`，之后设好的纹理 sprite 会画在粒子位置。
- `IParticleRenderType` 页面描述为「`RenderType` 的一个变体」：为同类型所有粒子构造 startup / teardown 阶段，再经 `Tessellator` 一次性渲染。页面称共六种；本页表格可读到的名字：`TERRAIN_SHEET`、`PARTICLE_SHEET_OPAQUE`、`PARTICLE_SHEET_TRANSLUCENT`、`PARTICLE_SHEET_LIT`（同 `PARTICLE_SHEET_OPAQUE`，但在全部 OPAQUE 之后渲染）、`CUSTOM`（只给 blending 与 depth mask 的 setup，渲染本体要在 `Particle#render` 里自己做）。
- 自定义 `Particle` 的数据对象经 `ParticleType` 构造器传入；需要联网时用 `fromNetwork` / `writeToNetwork` 一对方法解码/编码。
- 本档另有粒子注册与 sprite 相关章节，写粒子前先读同档 `effects_particles.md` 全文；`RenderType` 本身在本档语料里**没有任何方法或用法** ⇒ 不要写 `RenderType.getXxx()`，需要时先 `search_forge_docs version=1.16.5` 核实。

## 资源路径常识（`models_introduction`）

- `ResourceLocation` = `namespace:path`；不显式给 namespace 时默认 `minecraft`，但仍建议写上。namespace 是 `assets/` 下的一级目录（通常等于 modid）；path 是 context-sensitive：指模型时解析在 `models` 下，指纹理时在 `textures` 下——所以 `mod:file` 在一个上下文是 `assets/mod/models/file.json`，另一个是 `assets/mod/textures/file.png`。
- 模型系统相关的所有字符串（尤其 `ResourceLocation`）用 snake case（全小写 + 下划线分词）；自 Minecraft 1.11 起强制。

## 常见错误

- ❌ 写 `IBakedModel#isBuiltInRenderer` / `Item.Properties#setTEISR` / `renderByItem(ItemStack itemStackIn)` 单参形态 —— 本档页面上是 `isCustomRenderer` + `setISTER` + 六参签名。
- ❌ 从 1.13/1.14 档抄 `TileEntityRendererFast` / `renderTileEntityFast` / `VertexBuffer` —— 本档页面无此套。
- ❌ 仍从 `Minecraft.getMinecraft().getBlockColors()` 取实例并调 `registerBlockColorHandler` —— 本档页面已改走 `ColorHandlerEvent`。
- ❌ 把 `ItemModelsProperties.register` 放在公共 setup 或服务端 —— 本档明确 `ItemModelsProperties` 服务端不存在；且不入 `enqueueWork` 会踩非线程安全。
- ❌ 单例误解：一个 `TileEntityType` 只有一个 TER；一个 Item 只有一个 ISTER（getter 是 final）。
- ❌ overrides 里以为第一个匹配生效 —— 页面写的是「多个匹配取列表中最后一个」。
- ❌ 提前写 1.17+ 名：`BlockEntityRenderer`、`EntityRenderersEvent`、`PoseStack`、`MultiBufferSource`、`RenderSystem`。

## 本档未覆盖（禁止默写）

- **实体渲染器**：`RenderingRegistry`、`registerItemRenderer`、`IItemRenderer`、`RenderManager`、`EntityRenderersEvent` 在本档语料零命中；`EntityRenderer` 仅作为 `TileEntityRenderer` 的子串出现。⇒ 实体渲染保持 `// TODO(未核实)`，走 `search_forge_docs version=1.16.5`，或让用户自备 1.16.5 Forge jar 经 `ingest_loader_api` 后 `query_loader_api` 逐签名核对。
- `RenderType` 的方法集合、render layer 的 JSON 声明、`ItemBlockRenderTypes`：本档语料无（只有一句类比）。
- shader / `Effect` / `RenderSystem` / `RegisterShadersEvent`：属 1.17+，本档无。
- TER 的返回类型、`bindTileEntityRenderer` 的精确重载、`TER` 构造器是否收 `BlockEntityRendererProvider.Context` 一类上下文参数：本档语料未写 ⇒ 未核实。
- 自定义 `IModelLoader` / `IModelGeometry`：本档语料只有 `models_introduction` / `models_files` / `models_color` / `models_overrides` 四页，无模型加载器专题页 ⇒ 未核实。

## 相关

- 客户端/服务端分离：`08-client-server.mdc`；方块与方块实体：`02-block.mdc`；物品：`03-item.mdc`；实体：`04-entity.mdc`；事件与 `@SubscribeEvent` / 事件总线：`05-events.mdc`；注册：`01-registry.mdc`；反模式：`09-anti-patterns.mdc`
- 同档页面 id（`get_forge_doc_full`，`version=1.16.5`）：`tileentities_tesr` / `rendering_ister` / `models_color` / `models_overrides` / `models_introduction` / `models_files` / `effects_particles` / `tileentities_tileentity`
- 通道分歧（MCP vs official）先读同档 `knowledge/version-changes/1.16.x.md` 与 `00-project-setup.mdc`「Mappings 约束」，再决定本页里哪些名字要换成工程实际形态。
