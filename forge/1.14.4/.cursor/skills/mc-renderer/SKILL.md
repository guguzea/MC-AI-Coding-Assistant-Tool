---
name: mc-renderer
description: 客户端实体/方块渲染、BER、层与纹理。触发词：Renderer、RenderType、BER
platform: forge
version: "1.14.4"
dependencies: []
mappings: mcp
---

# mc-renderer

> 本档正文的类名 / 方法名 / 注册入口只来自 `data/forge_1.14.4` 本档语料，实读页面（均在 `forge-docs/1.14.4/processed/`）：`tileentities_tesr.md`（TER / `TileEntityRendererFast`）、`rendering_ister.md`（`ItemStackTileEntityRenderer`）、`models_color.md`（`IBlockColor` / `IItemColor`）、`models_overrides.md`（Item property 覆写）、`events_intro.md`（mod event bus 上的 `ColorHandlerEvent` / `ModelBakeEvent` / `TextureStitchEvent`）、`primer_1_14.md`（§Rendering Changes、§Rendering Particles）、`animation_implementing.md`（本页仍是 1.12 措辞，见文末警示）。
> 页内没有的签名一律留 `TODO(未核实)`，禁止用邻版（1.13.2 / 1.15.2 / 1.16.5）或 NeoForge 档补全。
> ⚠️ 本档语料里 `BlockEntityRenderer`、`BER`、`RenderType`（作为独立类名）、`IItemRenderer`、`RenderingRegistry` 零命中；`EntityRenderer` 只作为 `TileEntityRenderer` 的子串出现 ⇒ **没有独立实体渲染章节**。
> ⚠️ 本档 mappings 是 **MCP**（`00-project-setup.mdc`），页面用的是 MCP 名（`IBlockState`、`ItemStackTileEntityRenderer`、`GlStateManager`）；不要往本档工程里写 mojmap/官方名（`BlockState`、`BlockColors#register` 一类是 1.16.5 起页面的写法）。

## Decision: 选择渲染方案

```
IF 静态形状能表达（JSON / OBJ / B3D）→ 只写模型，不写渲染器
IF 方块有动态内容且有 TileEntity → TER（能 fast 就 TileEntityRendererFast）
IF 物品要按 ItemStack 动态画 → ISTER（前提：模型 IBakedModel#isBuiltInRenderer 返回 true）
IF 方块/物品纹理要染色 → IBlockColor / IItemColor（tint index）
IF 同一物品按 float 状态换模型 → Item::addPropertyOverride + overrides JSON
IF 要换掉/接管 vanilla 方块的模型 → 自定义 baked model（在 ModelBakeEvent 里处理）
IF 实体本体渲染 → 本档语料无对应章节，见「本档未覆盖」
```

## TER：方块实体渲染（`tileentities_tesr`）

`TileEntityRenderer` 或 `TER`（前身 `TileEntitySpecialRenderer` / `TESR`）用于「无法用静态烘焙模型（JSON、OBJ、B3D 等）表达」的方块；前提是方块有 TileEntity。

- 继承 `TileEntityRenderer`，泛型参数 = 该方块的 TileEntity 类；泛型用于 TER 的 `render` 方法。
- `render` 每帧调用。页内列出的参数：`tileentity`、`x` / `y` / `z`（渲染位置）、`partialTicks`（距上一个整 tick 的小数）、`destroyStage`（被破坏阶段）。**完整签名该页未给** ⇒ `// TODO(未核实)`（`search_forge_docs version=1.14.4` 核实）。
- **一个 tile entity 类型只有一个 TER 实例**：单实例状态要存在传进来的 tile entity 里，不能存在 TER 里（否则该类型所有方块每帧一起动）。
- 注册：`ClientRegistry#bindTileEntitySpecialRenderer`，传 tile entity 类 + TER 实例。本档页面的注册方法名仍带 `Special`，别按后档的 `bindTileEntityRenderer` 写。
- 默认用 OpenGL（经 `GlStateManager`）绘制。

### TileEntityRendererFast

继承 `TileEntityRendererFast` 而不是 `TileEntityRenderer`，并从 `IForgeTileEntity#hasFastRenderer` 返回 true；此时实现 `renderTileEntityFast` 而不是 `render`。

- 所有 fast TER 批处理，每帧只向 GPU 发一次合并 draw call。
- 代价：`GlStateManager` / `GLXX` 直接访问不可用，只能往传入的 `VertexBuffer`（全部 fast TER 的合并顶点数据）加顶点；仍可渲染 `IBakedModel`。
- Forge 的例子见 `TileEntityRendererAnimation`。

## ISTER：物品上的动态渲染（`rendering_ister`）

`ItemStackTileEntityRenderer`（ISTER）是「在物品上用 OpenGL 渲染」的手段，比旧的 TESRItemStack 体系简单——旧体系要求一个 TileEntity 且拿不到 ItemStack。

- 渲染入口：`public void renderByItem(ItemStack itemStackIn)`。带 `partialTicks` 的重载存在但 vanilla 从不调用。
- 前提：Item 的模型对 `IBakedModel#isBuiltInRenderer` 返回 true；否则不会去取 ISTER。没有 ISTER 时回退到默认的 `ItemStackTileEntityRenderer.instance`。
- 设置：`Item.Properties#setTEISR`（**本档已改到 `Item.Properties` 上**，1.13.2 页面上还是 `Item#setTileEntityItemStackRenderer`）。每个 Item 只能提供一个 ISTER，getter 是 final。除此之外无需额外设置。
- 需要 `TransformType` 时把 `IBakedModel#handlePerspective` 收到的那个存下来；`handlePerspective` 一定先于 `ItemStackTileEntityRenderer#renderByItem` 调用。

## 染色：IBlockColor / IItemColor（`models_color`）

模型面支持标「tint indices」，由 `IBlockColor` / `IItemColor` 处理，两者都是单方法接口：

- `IBlockColor` 收 `IBlockState`、（可空）`IBlockAccess`、（可空）`BlockPos`；`IItemColor` 收 `ItemStack`；都另有参数 `tintindex`，都返回 `int` 颜色乘子。
- `int` 按 4 个无符号字节 ARGB（最高有效字节到最低）解释；每像素每通道 `(int)((float)base * multiplier / 255)`；**方块不使用 alpha 通道**。
- 继承 `builtin/generated` 的物品模型里每个层（`layer0`、`layer1`…）的 tint index 与层号对应。
- 注册（**必须客户端、初始化阶段**）：`BlockColors` 经 `Minecraft.getMinecraft().getBlockColors()` 取，方法 `BlockColors::registerBlockColorHandler`；`ItemColors` 经 `Minecraft.getMinecraft().getItemColors()` 取，方法 `ItemColors::registerItemColorHandler`（有收 `Block` 的重载，等价于给 `Item.getItemFromBlock(block)` 注册）。
- 注册 `IBlockColor` **不会**染到 `ItemBlock`，`ItemBlock` 要另用 `IItemColor`。
- ⚠️ 语料内部不一致：同档 `events_intro.md` 把 `ColorHandlerEvent` 列为 mod event bus 上的注册事件，而本页仍教你从 `Minecraft.getMinecraft()` 取实例并调 `registerBlockColorHandler`。**两种写法都出现在本档语料里**，选哪种要先核实（`search_forge_docs version=1.14.4`），不要凭印象二选一；本档页面上没有 `ColorHandlerEvent$Block` / `event.getBlockColors().register(...)` 这种形态。

## Item property 与 overrides（`models_overrides`）

- 与直接用 `ModelLoader.setCustomModelResourceLocation` / `ModelLoader.setCustomMeshDefinition` 绑死模型集合不同（那会把弓的拉弓帧数固定成 4），item property 给每个 `ItemStack` 赋一个 `float`，物品模型 JSON 用 `overrides` 连续选模型。
- 注册：`Item::addPropertyOverride`；`ResourceLocation` 是属性名（如 `new ResourceLocation("pull")`）；`IItemPropertyGetter` 收 `ItemStack`、所在 `World`、持有时 `EntityLivingBase`，返回 `float`。modded 属性名建议带 modid 命名空间。
- 页内示例形态：`public float apply(ItemStack stack, @Nullable World world, @Nullable EntityLivingBase entity)`，带 `@SideOnly(Side.CLIENT)`。
- predicate 语义：一个 predicate 对所有 **大于等于** 给定值的值生效；无匹配时用当前模型作默认。

## 1.14 渲染侧的破坏性改动（`primer_1_14` §Rendering Changes）

- `ModelLoader.setCustomModelResourceLocation` **已移除**——扁平化后不再需要；物品按自身注册名查模型，`foomod:fooitem` 默认查 `assets/foomod/models/item/fooitem.json`。需要别的就走 `ModelBakeEvent` 里的自定义 baked model。
- Statemapper 全部移除，改由 `BlockModelShapes` 里一个硬编码旧默认逻辑的函数承担。
- vanilla blockstate json 更聪明：variant 字符串按 `,` 切分后动态构造成 `Predicate<IBlockState>`；不再需要 statemapper ignoring；`"normal"` 变体现在写作 `""`（匹配一切传入的 `IBlockState`）。重叠 predicate 的处理方式该页标注为 unknown，初步看是 error。
- vanilla model json：`{}` 现在合法（空模型）；只写 `textures` 不写 `elements` 也合法（例如给 TESR 设破坏粒子）。
- 目录改名：`textures/blocks` → `textures/block`，`textures/items` → `textures/item`。
- blockstate json 里 `block` 子目录不再被推断：`foo:bar` 指向 `foo:models/bar`，要写 `foo:block/bar`。
- 自定义 `ItemMeshDefinition` 移除，功能可用「带自定义 `ItemOverrideList` 的自定义 baked model」完全替代。
- LWJGL 升到 3.x（`Keyboard.KEY_FOO` ⇒ `GLFW.GLFW_KEY_FOO`）。
- 该页另提示：世界渲染（`RenderWorldLastEvent`）表现异常时另有排查帖——本档语料未给出用法与签名 ⇒ `// TODO(未核实)`。

## 粒子渲染提示（`primer_1_14`，非完整章节）

- 每个 `IParticleType` 都要有对应的 particles json，例如 `assets/botania/particles/wisp.json`，**即使不用 vanilla 的动画 sprite 系统也必须给**。
- 自绘：覆写 `renderParticle`，把顶点数据喂给传入的 `BufferBuidler`（页面原样拼写），或对 `IParticleRenderType.CUSTOM` 自己做 GL。必须挑一个 `IParticleRenderType`（它决定粒子渲染时所处的 GL 状态），或自己实现一个。
- 本段来自移植指南页；粒子完整做法见同档 `effects_particles.md` 页。

## 常见错误

- ❌ 把实例状态存进 TER → 该类型所有方块一起动；存进 TileEntity。
- ❌ 沿用 1.13.2 的物品侧名 `TileEntityItemStackRenderer` / `Item#setTileEntityItemStackRenderer` —— 本档页面上是 `ItemStackTileEntityRenderer` + `Item.Properties#setTEISR`。
- ❌ 沿用 1.12.2 的 `TileEntitySpecialRenderer` / `renderTileEntityAt` / `FastTESR`。
- ❌ 提前写后档名：`bindTileEntityRenderer`、`isCustomRenderer`、`setISTER`、`ColorHandlerEvent$Block`、`BlockColors#register`、`BlockItem`、`Block#asItem` —— 本档页面全无。
- ❌ 在 `TileEntityRendererFast` 里直接调 `GlStateManager` / `GLXX`。
- ❌ ISTER 没让 `IBakedModel#isBuiltInRenderer` 返回 true；或每帧 `new` 一个 ISTER 返回。
- ❌ 还去写 `ModelLoader.setCustomModelResourceLocation`（本档已移除）或 statemapper。
- ❌ 资源路径仍写 `textures/blocks`、`textures/items`，或 blockstate 里省掉 `block/` 段。
- ❌ 染色注册放在服务端或运行期。

## 本档未覆盖（禁止默写）

- **实体渲染器**：`EntityRenderersEvent`、`RenderingRegistry`、`registerItemRenderer`、`IItemRenderer`、`RenderManager` 在本档语料零命中，`EntityRenderer` 仅是 `TileEntityRenderer` 的子串 ⇒ 实体渲染一律 `// TODO(未核实)`，改口 `search_forge_docs version=1.14.4` 或让用户自备 1.14.4 Forge jar 走 `ingest_loader_api` + `query_loader_api` 核签名。
- `RenderType`（vanilla 渲染类型对象）、render layer JSON 声明、`ItemBlockRenderTypes`：本档语料无此名（只有 `IParticleRenderType`）。
- shader / `RenderSystem` / `Effect` / `PoseStack` / `MultiBufferSource`：属 1.17+ 体系，本档无。
- ⚠️ `animation_implementing.md` 在本档语料里仍是 1.12 时代的 `FastTESR` / `AnimationTESR` / `ENTITYBLOCK_ANIMATED` 措辞，与同档 `tileentities_tesr.md` 的 TER 体系自相矛盾 ⇒ 语料残留，禁止当 1.14.4 现行名抄。
- 自定义 `IModelLoader` / `IModel` / `ICustomModelLoader`：本档语料只有 `models_introduction` / `models_files` / `models_color` / `models_overrides` 四页，无模型加载器专题页 ⇒ 未核实。

## 相关

- 客户端/服务端分离：`08-client-server.mdc`；方块与方块实体：`02-block.mdc`；物品：`03-item.mdc`；实体：`04-entity.mdc`；事件与 mod event bus：`05-events.mdc`；注册：`01-registry.mdc`；反模式：`09-anti-patterns.mdc`
- 同档页面 id（`get_forge_doc_full`，`version=1.14.4`）：`tileentities_tesr` / `rendering_ister` / `models_color` / `models_overrides` / `primer_1_14` / `events_intro` / `effects_particles`
- 1.12.2 → 1.14.4 的渲染改名与扁平化对照，先读同档 `legacy_porting1214.md` 与 `primer_1_14.md` 再动手。
