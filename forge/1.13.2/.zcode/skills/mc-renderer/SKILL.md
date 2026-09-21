---
name: mc-renderer
description: 客户端实体/方块渲染、BER、层与纹理。触发词：Renderer、RenderType、BER
platform: forge
version: "1.13.2"
dependencies: []
mappings: mcp
---

# mc-renderer

> 本档正文的类名 / 方法名 / 注册入口只来自 `data/forge_1.13.2` 本档语料，实读页面（均在 `forge-docs/1.13.2/processed/`）：`tileentities_tesr.md`（TER / `TileEntityRendererFast`）、`rendering_teisr.md`（TEISR）、`models_color.md`（`IBlockColor` / `IItemColor`）、`models_overrides.md`（Item property 覆写）、`animation_implementing.md`（本页仍是 1.12 措辞，见文末警示）。
> 页内没有的签名一律留 `TODO(未核实)`，禁止用邻版（1.12.2 / 1.14.4）或 NeoForge 档补全。
> ⚠️ 本档语料里 `RenderType`、`BlockEntityRenderer`、`BER`、`RenderingRegistry`、`IItemRenderer`、`RenderManager` 零命中；`EntityRenderer` 只作为 `TileEntityRenderer` 的子串出现，**没有任何独立实体渲染章节**（已 grep 复核）。**1.13.2 正处在改名的中间档**：方块侧已叫 `TileEntityRenderer` / `TER`，物品侧却还叫 `TileEntityItemStackRenderer`（`ItemStackTileEntityRenderer` 是 1.14 才出现的名字），染色侧仍与 1.12.2 同名——**不要**把任何一头往前后版本对齐。

## Decision: 选择渲染方案

```
IF 静态形状能表达（JSON / OBJ / B3D）→ 只写模型，不写渲染器
IF 方块有动态内容且该方块有 TileEntity → TER（能 fast 就 TileEntityRendererFast）
IF 物品要按 ItemStack 动态画 → TEISR（前提：模型 IBakedModel#isBuiltInRenderer 返回 true）
IF 方块/物品纹理要染色 → IBlockColor / IItemColor（tint index）
IF 同一物品要按 float 状态换模型 → Item::addPropertyOverride + overrides JSON
IF 实体本体渲染 → 本档语料无对应章节，见「本档未覆盖」
```

## TER：方块实体渲染（`tileentities_tesr`）

`TileEntityRenderer` 或 `TER`（**前身是** `TileEntitySpecialRenderer` / `TESR`）用于「无法用静态烘焙模型（JSON、OBJ、B3D 等）表达」的方块；前提是方块有 TileEntity。

- 继承 `TileEntityRenderer`，泛型参数 = 该方块的 TileEntity 类；泛型用于 TER 的 `render` 方法。
- `render` 每帧调用。页内列出的参数：`tileentity`（被渲染的 TileEntity 实例）、`x` / `y` / `z`（渲染位置）、`partialTicks`（距上一个整 tick 过去的小数部分）、`destroyStage`（方块被破坏时的阶段）。**完整方法签名该页未给** ⇒ `// TODO(未核实)`：用 `search_forge_docs version=1.13.2` 核实参数顺序与注解后再写。
- **一个 tile entity 类型只有一个 TER 实例**。与单个世界内实例相关的数据要存在传进来的 tile entity 里，不能存在 TER 里（否则「每帧自增的 int」会让该类型所有方块一起动）。
- 注册：调用 `ClientRegistry#bindTileEntitySpecialRenderer`，传入要渲染的 tile entity 类 + 该 TER 实例。**注意**：类名已改叫 `TileEntityRenderer`，但本档注册方法名仍写作 `bindTileEntitySpecialRenderer`（页内原话，未随类名改口）；`bindTileEntityRenderer` 在本仓库语料里要到 1.16.5 档页面才出现，别提前写。方法签名的精确形态 ⇒ `// TODO(未核实)`。
- 默认用 OpenGL（经 `GlStateManager`）绘制。

### TileEntityRendererFast（性能优先）

继承 `TileEntityRendererFast` 而不是 `TileEntityRenderer`，并从 `IForgeTileEntity#hasFastRenderer` 返回 true；此时实现的是 `renderTileEntityFast`，不是 `render`。

- 好处：所有 fast TER 被批处理，每帧只向 GPU 发**一次**合并 draw call。
- 代价：`GlStateManager` / `GLXX` 一类直接 OpenGL 访问**不可用**；只能往传入的 `VertexBuffer`（代表全部 fast TER 的合并顶点数据）加顶点；这样仍可渲染 `IBakedModel`。
- Forge 自身的例子见 `TileEntityRendererAnimation`（1.12.2 那侧叫 `AnimationTESR`，本档页面用的是新名）。

## TEISR：物品上的动态渲染（`rendering_teisr`）

`TileEntityItemStackRenderer` 是「在物品上用 OpenGL 渲染」的手段，比旧的 TESRItemStack 体系简单——旧体系要求一个 TileEntity 且拿不到 ItemStack。

> 页内 Note：本节特性只在 forge 版本 >= 14.23.2.2638 存在。

- 渲染入口：`public void renderByItem(ItemStack itemStackIn)`。另有一个带 `partialTicks` 的重载，但 vanilla 从不调用它。
- 前提：该 Item 的模型对 `IBakedModel#isBuiltInRenderer` 返回 true；返回 true 后才去取该 Item 的 TEISR，没有则回退到默认的 `TileEntityItemStackRenderer.instance`。
- 设置：`Item#setTileEntityItemStackRenderer`。每个 Item 只能提供一个 TEISR，getter 是 final（防止每帧返回新实例）。除此之外无需额外设置。
- 需要 `TransformType` 时把 `IBakedModel#handlePerspective` 收到的那个存下来渲染时用；`handlePerspective` 一定先于 `TileEntityItemStackRenderer#renderByItem` 被调用。
- **本档物品侧仍是 `TileEntityItemStackRenderer` 全名**，`ItemStackTileEntityRenderer` / `setISTER` / `isCustomRenderer` 属 1.14+，禁止前置。

## 染色：IBlockColor / IItemColor（`models_color`）

模型面支持在面上标「tint indices」，由 `IBlockColor` / `IItemColor` 处理。两个都是单方法接口：

- `IBlockColor` 收 `IBlockState`、（可空）`IBlockAccess`、（可空）`BlockPos`；`IItemColor` 收 `ItemStack`。两者都另有参数 `tintindex`，都返回一个 `int` 颜色乘子。
- 该 `int` 按 4 个无符号字节 ARGB（最高有效字节到最低）解释；每像素每通道 `(int)((float)base * multiplier / 255)`；**方块不使用 alpha 通道**。
- 继承 `builtin/generated` 的物品模型里每个层（`layer0`、`layer1`…）的 tint index 与层号对应。
- 注册（**必须客户端、初始化阶段**）：`BlockColors` 经 `Minecraft.getMinecraft().getBlockColors()` 取，注册方法 `BlockColors::registerBlockColorHandler`；`ItemColors` 经 `Minecraft.getMinecraft().getItemColors()` 取，注册方法 `ItemColors::registerItemColorHandler`（有收 `Block` 的重载，等价于给 `Item.getItemFromBlock(block)` 注册）。
- 注意：注册 `IBlockColor` **不会**染到 `ItemBlock`——`ItemBlock` 是物品，要另用 `IItemColor`。本档仍是 `ItemBlock` / `Item.getItemFromBlock`；`BlockItem` / `Block#asItem` 是 1.14+ 的名。

## Item property 与 overrides（`models_overrides`）

- 与直接用 `ModelLoader.setCustomModelResourceLocation` / `ModelLoader.setCustomMeshDefinition` 绑死模型集合不同（那会把弓的拉弓帧数固定成 4），item property 给每个 `ItemStack` 赋一个 `float`，物品模型 JSON 用 `overrides` 按值连续选模型。
- 注册：`Item::addPropertyOverride`。`ResourceLocation` 是属性名（如 `new ResourceLocation("pull")`）；`IItemPropertyGetter` 收 `ItemStack`、所在 `World`、持有时 `EntityLivingBase`，返回 `float`。modded 属性名建议带 modid 命名空间（`examplemod:property`，裸名实际等于 `minecraft:property`）。
- 页内示例的接口方法形态：`public float apply(ItemStack stack, @Nullable World world, @Nullable EntityLivingBase entity)`，带 `@SideOnly(Side.CLIENT)`。
- 该页明确：这里**不必**是 client-only，服务端也能跑；vanilla 里属性就在物品构造函数内注册。
- predicate 语义：「一个 predicate 对所有 **大于等于** 给定值的值生效」；无匹配时用当前模型作默认。

## 常见错误

- ❌ 把「每帧自增」一类实例状态存进 TER → 该类型所有方块一起动；存进 TileEntity。
- ❌ 方块没有 TileEntity 却想用 TER。
- ❌ 按 1.12.2 写 `TileEntitySpecialRenderer` / `renderTileEntityAt` / `FastTESR`——本档页面上的名是 `TileEntityRenderer` / `render` / `TileEntityRendererFast`。
- ❌ 按后续档的名写本档工程：`ClientRegistry#bindTileEntityRenderer`、`ItemStackTileEntityRenderer`、`Item.Properties#setTEISR`、`ColorHandlerEvent` —— 这些名字本档页面全都没有。
- ❌ 能 fast 却写普通 TER；或反过来在 `TileEntityRendererFast` 里直接调 `GlStateManager` / `GLXX`。
- ❌ 物品模型没让 `IBakedModel#isBuiltInRenderer` 返回 true 就写 TEISR → 走不到 TEISR。
- ❌ 染色注册放在服务端或运行期；或以为注册了 `IBlockColor` 就染好了 `ItemBlock`。
- ❌ 用 `ModelLoader.setCustom*` 做连续动画 → 模型集合被固定；连续量走 property + overrides。

## 本档未覆盖（禁止默写）

- **实体渲染器**：本档语料没有任何实体渲染章节，`RenderingRegistry`、`registerItemRenderer`、`IItemRenderer`、`RenderManager` 零命中，`EntityRenderer` 仅作为 `TileEntityRenderer` 的子串出现。⇒ 涉及实体渲染时保持 `// TODO(未核实)`，改口 `search_forge_docs version=1.13.2`，或 `query_loader_api` / 用户自备 1.13.2 Forge jar 逐签名核对，禁止用 1.12.2 的 `RenderLiving` 或后续档的实体渲染体系顶上。
- `RenderType` / 渲染层 JSON / `EntityRenderersEvent`：本档语料无此名。
- shader、`RenderSystem`、`PoseStack`、`MultiBufferSource`：属 1.17+ 体系，本档无。
- ⚠️ `animation_implementing.md` 一类页面在本档语料里仍带 1.12 时代措辞（`FastTESR`、`AnimationTESR`、`ENTITYBLOCK_ANIMATED` render layer），与同档 `tileentities_tesr.md` 的 TER 体系自相矛盾——那是**语料残留，不是 1.13.2 的现行名**。要引用动画 API 须先核实，禁止当本档渲染规范抄。
- `IBakedModel` / `IModel` / `ICustomModelLoader` / perspective 细节：本档语料只有 `models_color` / `models_files` / `models_introduction` / `models_overrides` / `models_using` 五页，没有 1.12.2 那套 `models_advanced_*` 专题页；自定义模型加载器与 `handlePerspective` 之外的模型侧细节 ⇒ 未核实。
- 粒子渲染：本档语料无粒子页。

## 相关

- 客户端/服务端分离：`08-client-server.mdc`；方块与方块实体：`02-block.mdc`；物品：`03-item.mdc`；实体：`04-entity.mdc`；事件：`05-events.mdc`；反模式：`09-anti-patterns.mdc`
- 同档页面 id（`get_forge_doc_full`，`version=1.13.2`）：`tileentities_tesr` / `rendering_teisr` / `models_color` / `models_overrides` / `models_files` / `models_introduction` / `models_using`
- 移植上下文（同档）：`knowledge/porting/00-porting-guide.md`、`knowledge/porting/01-api-cross-loader.md`——1.12.2 → 1.13.2 的改名对照先读那两篇，再回到本档页面取名。
