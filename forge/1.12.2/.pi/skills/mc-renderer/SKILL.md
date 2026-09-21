---
name: mc-renderer
description: 客户端实体/方块渲染、BER、层与纹理。触发词：Renderer、RenderType、BER
platform: forge
version: "1.12.2"
dependencies: []
mappings: mcp
---

# mc-renderer

> 本档正文的类名 / 方法名 / 注册入口只来自 `data/forge_1.12.2` 本档语料，实读页面（均在 `forge-docs/1.12.2/processed/`）：`tileentities_tesr.md`（TESR / FastTESR）、`rendering_teisr.md`（TEISR）、`models_color.md`（`IBlockColor` / `IItemColor`）、`models_overrides.md`（Item property 覆写）、`models_advanced_ibakedmodel.md` 与 `models_advanced_perspective.md`（`IBakedModel` / `TransformType`）、`animation_implementing.md`（`AnimationTESR` / `AnimationModelBase`）。
> 页内没有的签名一律留 `TODO(未核实)`，禁止用邻版（1.13.2 / 1.14.4）或 NeoForge 档补全。
> ⚠️ **本档是 MCP 映射老档，渲染体系与 1.13+ 完全不同名**：本档语料里 `RenderType`、`BlockEntityRenderer`、`BER`、`EntityRenderer`、`RenderingRegistry`、`IItemRenderer` 全部零命中（已逐档 grep 复核）。触发词里的 `RenderType` / `BER` 属 1.17+ 档，**不要**按它们写本档代码；本档对应概念是「render layer」与 `TileEntitySpecialRenderer`。

## Decision: 选择渲染方案

```
IF 静态形状能表达（JSON / OBJ / B3D）→ 只写模型，不写渲染器
IF 方块有动态内容且该方块有 TileEntity → TESR（能 FastTESR 就 FastTESR）
IF 物品要按 ItemStack 动态画 → TEISR（前提：模型 IBakedModel#isBuiltInRenderer 返回 true）
IF 方块/物品纹理要染色 → IBlockColor / IItemColor（tint index）
IF 同一物品要按 float 状态换模型（弓/指南针一类）→ Item property + overrides JSON
IF 实体本体渲染 / 动画 → 本档只有 animation_implementing 页的片段，其余签名未核实
```

## TESR：方块实体渲染（`tileentities_tesr`）

`TileEntitySpecialRenderer`（TESR）用于「无法用静态烘焙模型（JSON、OBJ、B3D 等）表达」的方块；**前提是方块有 TileEntity**。

- 继承 `TileEntitySpecialRenderer`，泛型参数 = 该方块的 TileEntity 类；泛型用于 TESR 的 `renderTileEntityAt` 方法。
- `renderTileEntityAt` 每帧调用。页内列出的参数：`tileentity`（被渲染的 TileEntity 实例）、`x` / `y` / `z`（渲染位置）、`partialTicks`（距上一个整 tick 过去的小数部分）、`destroyStage`（方块被破坏时的阶段）。完整方法签名该页未给 ⇒ `// TODO(未核实)`（用 `search_forge_docs version=1.12.2` 或 `get_forge_doc_full` 核实参数顺序与注解）。
- **一个 tile entity 类型只有一个 TESR 实例**。因此与单个世界内实例相关的数据必须存在传进来的 tile entity 里，不能存在 TESR 里（否则「每帧自增的 int」会让该类型所有方块一起动）。
- 注册：调用 `ClientRegistry#bindTileEntitySpecialRenderer`，传入要渲染的 tile entity 类 + 用于渲染该类全部 TE 的 TESR 实例。
- 默认用 OpenGL（经 `GlStateManager`）绘制。

### FastTESR（性能优先）

继承 `FastTESR` 而不是 `TileEntitySpecialRenderer`，并从 `TileEntity#hasFastRenderer` 返回 true 即可改为 fast 版；此时实现的是 `renderTileEntityFast`，不是 `renderTileEntityAt`。

- 好处：所有 FastTESR 被批处理，每帧只向 GPU 发**一次**合并 draw call。
- 代价：`GlStateManager` / `GLXX` 一类直接 OpenGL 访问**不可用**；只能往传入的 `VertexBuffer`（代表全部 FastTESR 的合并顶点数据）里加顶点。这样做的同时可以渲染 `IBakedModel`。
- Forge 自身的例子见 `AnimationTESR`。

## TEISR：物品上的动态渲染（`rendering_teisr`）

`TileEntityItemStackRenderer`（TEISR）用于在物品上做 OpenGL 渲染；比旧的 TESRItemStack 体系简单——旧体系要求一个 TileEntity，且拿不到 ItemStack。

> 页内 Note：本节特性只在 forge 版本 >= 14.23.2.2638 存在。

- 渲染入口：`public void renderByItem(ItemStack itemStackIn)`。另有一个带 `partialTicks` 的重载，但 vanilla 从不调用它。
- 前提：该 Item 的模型对 `IBakedModel#isBuiltInRenderer` 返回 true。返回 true 后才会去取该 Item 的 TEISR；没有则回退到默认的 `TileEntityItemStackRenderer.instance`。
- 设置方式：`Item#setTileEntityItemStackRenderer`。每个 Item 只能提供一个 TEISR，且 getter 是 final 的（防止每帧返回新实例）。除此之外不需要额外设置。
- 需要 `TransformType` 时：把 `IBakedModel#handlePerspective` 收到的那个存下来，渲染时用。`handlePerspective` 一定先于 `TileEntityItemStackRenderer#renderByItem` 被调用。

## 染色：IBlockColor / IItemColor（`models_color`）

模型面支持在面上标「tint indices」，这些整数由 `IBlockColor` / `IItemColor` 处理。两个接口都是单方法接口：

- `IBlockColor` 收 `IBlockState`、（可空）`IBlockAccess`、（可空）`BlockPos`；`IItemColor` 收 `ItemStack`。两者都另有参数 `tintindex`（被染的那个面的 tint index），都返回一个 `int` 颜色乘子。
- 该 `int` 按 4 个无符号字节 ARGB（从最高有效字节到最低）解释；每个像素每通道 `(int)((float)base * multiplier / 255)`；**方块不使用 alpha 通道**。
- 继承 `builtin/generated` 的物品模型里，每个层（`layer0`、`layer1`…）的 tint index 与层号对应。
- 注册（**必须在客户端、初始化阶段**）：`BlockColors` 经 `Minecraft.getMinecraft().getBlockColors()` 取，注册方法 `BlockColors::registerBlockColorHandler`；`ItemColors` 经 `Minecraft.getMinecraft().getItemColors()` 取，注册方法 `ItemColors::registerItemColorHandler`（该方法有收 `Block` 的重载，等价于给 `Item.getItemFromBlock(block)` 注册）。
- 注意：注册 `IBlockColor` **不会**染到对应的 `ItemBlock`——`ItemBlock` 是物品，要另用 `IItemColor`。

## Item property 与 overrides（`models_overrides`）

- 与直接用 `ModelLoader.setCustomModelResourceLocation` / `ModelLoader.setCustomMeshDefinition` 绑死模型集合不同（那会把弓的拉弓帧数固定成 4），item property 给每个 `ItemStack` 赋一个 `float`，由物品模型 JSON 的 `overrides` 连续选模型。
- 注册：`Item::addPropertyOverride`。`ResourceLocation` 是属性名（如 `new ResourceLocation("pull")`）；`IItemPropertyGetter` 收 `ItemStack`、所在 `World`、持有时 `EntityLivingBase`，返回 `float`。modded 属性名建议带 modid 命名空间（`examplemod:property`，裸名实际等于 `minecraft:property`）。
- 页内示例的接口方法形态：`public float apply(ItemStack stack, @Nullable World world, @Nullable EntityLivingBase entity)`，并带 `@SideOnly(Side.CLIENT)`。
- 该页明确：这里**不必**是 client-only，服务端也能跑；vanilla 里属性就在物品构造函数内注册。
- predicate 语义：「一个 predicate 对所有 **大于等于** 给定值的值生效」；无匹配时用当前模型作默认。

## IBakedModel 侧要点（`models_advanced_ibakedmodel` / `models_advanced_perspective`）

- `getQuads` 是 `IBakedModel` 的主方法，返回 `BakedQuad`（渲染用的底层顶点数据）。作为方块渲染时传入的 `IBlockState` 非 null，且由 `Block::getExtendedState` 生成（可把任意数据从方块传到模型）；作为物品渲染时 `getOverrides` 返回的 `ItemOverrideList` 负责物品状态，此时 `IBlockState` 参数为 `null`。
- 传入的 `EnumFacing` 用于面剔除；传 `null` 时返回所有不与面关联（永不被剔除）的面。
- **性能**：该方法调用极频繁——「世界内每个方块」×「每个未剔除面与非剔除面组合 × 每个受支持的 block render layer」，介于 0 到 28 次之间；应尽可能快并重度缓存。
- `getOverrides` 返回本模型作为物品渲染时使用的 `ItemOverrideList`。
- 视角（perspective）由枚举 `ItemCameraTransforms.TransformType` 表示（页内出现的取值含 `GUI`、`GROUND`、`NONE`）。vanilla 体系（`IBakedModel::getItemCameraTransforms`、`ItemCameraTransforms`、`ItemTransformVec3f`）已被 Forge 废弃，实现里 `getItemCameraTransforms` 直接 `return ItemCameraTransforms.DEFAULT` 即可，改写 `handlePerspective`。`PerspectiveMapWrapper` 是包一层其他 `IBakedModel` 并用 `Map<TransformType, TRSRTransformation>` 处理视角的现成实现；`TransformType` 也被打了补丁以实现 `IModelPart`，让 `IModelState` 能改变模型的视角处理。

## 动画 API 的渲染侧（`animation_implementing`）

- 方块动画用 `AnimationTESR`，它是一个 `FastTESR` ⇒ 必须有 `TileEntity`；TileEntity 要通过 `.cast` 方法提供 `ANIMATION_CAPABILITY`。若方块 blockstate 里没有 `StaticProperty`，方块还必须渲染在 `ENTITYBLOCK_ANIMATED` render layer 上。
- `StaticProperty`：在 `createBlockState()` 内把 `Properties.StaticProperty` 加进方块属性列表。渲染时 `AnimationTESR` 检查其值，true 则按正常方块渲染，false 则动画化 blockstate json 里 `static=false` 变体所指的模型。能静态化的部分应留在静态态。
- 注册形态（页内原样）：`ClientRegistry.bindTileEntitySpecialRenderer(Chest.class, new AnimationTESR<Chest>())`。
- 实体动画：实体的渲染器必须以 `AnimationModelBase` 作为 model；其构造器收模型位置与一个 `VertexLighter`，`VertexLighter` 可用 `new VertexLighterSmoothAo(Minecraft.getMinecraft().getBlockColors())` 创建。页内示例：`return new RenderLiving<EntityChest>(manager, new net.minecraftforge.client.model.animation.AnimationModelBase<EntityChest>(location, new VertexLighterSmoothAo(Minecraft.getMinecraft().getBlockColors())))`。实体同样要提供 `ANIMATION_CAPABILITY`。

## 常见错误

- ❌ 把「每帧自增」一类实例状态存进 TESR → 该类型所有方块一起动；存进 TileEntity。
- ❌ 方块没有 TileEntity 却想用 TESR。
- ❌ 能 FastTESR 却写普通 TESR；或反过来在 FastTESR 里直接调 `GlStateManager` / `GLXX`（fast 版只能往 `VertexBuffer` 加顶点）。
- ❌ 物品模型没让 `IBakedModel#isBuiltInRenderer` 返回 true 就写 TEISR → 走不到 TEISR。
- ❌ 给每个 Item 每帧 `new` 一个 TEISR → 每个 Item 只能有一个，getter 是 final。
- ❌ 染色注册放在服务端或运行期 → 「must be done client-side, in the initialization phase」。
- ❌ 以为注册了 `IBlockColor` 就染好了物品 → `ItemBlock` 要另注册 `IItemColor`。
- ❌ 用 `ModelLoader.setCustom*` 做连续动画 → 模型集合被固定；连续量要走 property + overrides。
- ❌ 把 1.13+ / 1.17+ 的名字（`TileEntityRenderer`、`TER`、`BlockEntityRenderer`、`RenderType`、`EntityRenderersEvent`、`ItemStackTileEntityRenderer`）写进本档工程。

## 本档未覆盖（禁止默写）

- **实体渲染器注册**：本档语料里 `RenderingRegistry`、`registerItemRenderer`、`EntityRenderer`、`RenderManager`、`IItemRenderer` 全部零命中，只有 `animation_implementing` 页给出的 `RenderLiving<...>` + `AnimationModelBase` 片段可抄。其余实体渲染写法 ⇒ `// TODO(未核实)`。
- `RenderType` / `render_type` JSON / 图层（layer）注册 API：本档语料无此名，禁止按 1.17+ / 1.20.1 的形态写。
- shader / `RenderSystem` / `Effect`：本档语料无（那是 1.17+ 的体系）。
- `ICustomModelLoader`、`IModel`、`IModelState`+`IModelPart`、`extended-blockstates`、`itemoverridelist` 的细节：属模型侧专题页，本档另有对应页面，写之前直接读那几页，不在本篇背书。
- 粒子渲染：本档语料无粒子页。

## 相关

- 客户端/服务端分离：`08-client-server.mdc`；方块实体：`02-block.mdc`；物品：`03-item.mdc`；实体：`04-entity.mdc`；事件与 `@EventBusSubscriber`：`05-events.mdc`；反模式：`09-anti-patterns.mdc`
- 同档页面 id（`get_forge_doc_full`，`version=1.12.2`）：`tileentities_tesr` / `rendering_teisr` / `models_color` / `models_overrides` / `models_advanced_ibakedmodel` / `models_advanced_perspective` / `animation_implementing`
- 不确定的签名先 `search_forge_docs`（`version=1.12.2`）；本档 `query_api` 是空壳（`found:true` + `methods:[]`），不要当签名用。
