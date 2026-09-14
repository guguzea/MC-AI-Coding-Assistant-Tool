---
name: mc-renderer
description: 客户端实体/方块渲染、BER、层与纹理。触发词：Renderer、RenderType、BER
platform: forge
version: "1.20.1"
dependencies: []
mappings: mcp
---

# mc-renderer

客户端渲染按表现层次分三块：**Render Types**（JSON `render_type`：裁剪、半透明等渲染类型选择）、**BER**（BlockEntityRenderer：静态模型表达不了的方块动态渲染）、**BEWLR**（BlockEntityWithoutLevelRenderer：物品动态渲染）。实体渲染器（EntityRenderer）与自定义 shader 不在本档核实素材内：按「机制路线 + 以 `search_forge_docs` 为准」处理，不给签名。

## 快速开始

### 路线 1：静态模型 + render_type（大多数方块）

模型 JSON 顶层加 `render_type` 条目即可，无需注册：

```json
{
  "render_type": "minecraft:cutout",
  "parent": "block/cube_all",
  "textures": { "all": "block/glass" }
}
```

### 路线 2：BER（方块动态渲染）

1. 方块已有 BlockEntity（BER 前提）。
2. 类继承 `BlockEntityRenderer`，泛型 = 方块实体类；覆写每帧调用的 `render`。
3. 在 mod event bus 的 `EntityRenderersEvent$RegisterRenderers` 里调用 `registerBlockEntityRenderer`。

### 路线 3：BEWLR（物品动态渲染）

1. 物品模型 `BakedModel#isCustomRenderer` 返回 true（否则走默认 `ItemRenderer#getBlockEntityRenderer`）。
2. 覆写 `Item#initializeClient(Consumer<IClientItemExtensions>)`，在匿名实例中覆写 `IClientItemExtensions#getCustomRenderer` 返回 BEWLR 实例。

```java
@Override
public void initializeClient(Consumer<IClientItemExtensions> consumer) {
    consumer.accept(new IClientItemExtensions() {
        @Override
        public BlockEntityWithoutLevelRenderer getCustomRenderer() {
            return myBEWLRInstance; // 每个 mod 只应有一个 BEWLR 实例
        }
    });
}
```

## API 锚点

### Render Types（页 id：`rendering_modelextensions_rendertypes`）

https://docs.minecraftforge.net/en/1.20.1/rendering/modelextensions/rendertypes

- JSON 顶层 `render_type` 条目；1.19 起优于已废弃的 `ItemBlockRenderTypes#setRenderLayer()`（方块）。未指定时加载器回退到 `ItemBlockRenderTypes#getRenderLayers()`；自定义模型加载器可忽略该字段。
- Forge 预注册选项（`NamedRenderTypeManager#preRegisterVanillaRenderTypes`）与对应 chunk/物品渲染类型：

| JSON 值 | Chunk 渲染类型 | 物品渲染类型 | 用途 |
|---------|---------------|-------------|------|
| `minecraft:solid` | `RenderType#solid()` | `ForgeRenderTypes#ITEM_LAYERED_SOLID` | 全不透明（石头） |
| `minecraft:cutout` | `RenderType#cutout()` | `ForgeRenderTypes#ITEM_LAYERED_CUTOUT` | 像素全透/全不透（玻璃块） |
| `minecraft:cutout_mipped` | `RenderType#cutoutMipped()` | `ForgeRenderTypes#ITEM_LAYERED_CUTOUT`（物品不做 mipmap） | 远景缩小（树叶） |
| `minecraft:cutout_mipped_all` | `RenderType#cutoutMipped()` | `ForgeRenderTypes#ITEM_LAYERED_CUTOUT_MIPPED` | 物品也要 mipmap |
| `minecraft:translucent` | `RenderType#translucent()` | `ForgeRenderTypes#ITEM_LAYERED_TRANSLUCENT` | 部分半透明（染色玻璃） |
| `minecraft:tripwire` | `RenderType#tripwire()` | `ForgeRenderTypes#ITEM_LAYERED_TRANSLUCENT` | 需渲染到天气目标（绊线） |

- 自定义命名渲染类型：`RegisterNamedRenderTypesEvent`（**mod event bus**）注册 `<your_mod_id>:name`，JSON 里引用同名值：

```java
public static void onRegisterNamedRenderTypes(RegisterNamedRenderTypesEvent event) {
    event.register("special_cutout", RenderType.cutout(), Sheets.cutoutBlockSheet());
    event.register("special_translucent", RenderType.translucent(),
        Sheets.translucentCullBlockSheet(), Sheets.translucentItemSheet());
}
```

组件：chunk 渲染类型（必须取 `RenderType.chunkBufferLayers()` 列表成员）+ 物品实体渲染类型（`DefaultVertexFormat.NEW_ENTITY`，Fast/Fancy 各需一份，可选份供特殊图形模式用）。

### BER（页 id：`blockentities_ber`）

https://docs.minecraftforge.net/en/1.20.1/blockentities/ber/

- 用于无法用静态烘焙模型（JSON/OBJ/B3D 等）表示的方块；**方块必须有对应 BlockEntity**。
- 类继承 `BlockEntityRenderer`，泛型是方块实体类；`render` 每帧调用（入参含方块实体、partialTick、poseStack、bufferSource、combinedLight/combinedOverlay）。
- 一个 `BlockEntityType` 只对应一个 BER ⇒ 单实例状态（如每帧自增 int）应存方块实体，不能存 BER（否则该类型所有方块每帧一起变）。
- 注册：`EntityRenderersEvent$RegisterRenderers`（**mod event bus**）→ `registerBlockEntityRenderer`（具体重载与签名以 `search_forge_docs` 为准）。

### BEWLR（页 id：`items_bewlr`）

https://docs.minecraftforge.net/en/1.20.1/items/bewlr/

- 渲染入口：`public void renderByItem(ItemStack itemStack, ItemDisplayContext ctx, PoseStack poseStack, MultiBufferSource bufferSource, int combinedLight, int combinedOverlay)`。
- 前提：模型 `BakedModel#isCustomRenderer` 返回 true；初始化入口 `Item#initializeClient(Consumer<IClientItemExtensions>)`（客户端入口），覆写 `IClientItemExtensions#getCustomRenderer`。
- 每个 mod 只应有一个 BEWLR 实例（官方要求）。
- 方块也可走 BEWLR：`Block#getRenderShape` 设为 `RenderShape#ENTITYBLOCK_ANIMATED`。

## Decision: 选择渲染方案

```
IF 只是混合/裁剪/半透明 → JSON render_type（优先于 setRenderLayer）
IF 方块有动态内容且已有 BlockEntity → BER
IF 物品要动态渲染 → BEWLR（先让 BakedModel#isCustomRenderer = true）
IF Entity 本体渲染 / 自定义 shader / 核心管线 → 机制路线，签名以 search_forge_docs 为准
```

## 常见错误

- ❌ 用已废弃的 `ItemBlockRenderTypes#setRenderLayer()` 设方块 → 1.19 起 JSON `render_type` 优先
- ❌ BER 里存每实例状态（如每帧自增 int）→ 该类型所有方块一起动画；状态放方块实体
- ❌ 方块没有 BlockEntity 却想用 BER → 先建方块实体（`mc-blockentity`）
- ❌ 自定义命名渲染类型的 chunk 部分不在 `RenderType.chunkBufferLayers()` 内 → 只允许表内类型
- ❌ `render_type` 值漏命名空间前缀 → 写成 `minecraft:cutout` / `<modid>:special_cutout` 形式
- ❌ BEWLR 忘记把模型 `isCustomRenderer` 置 true → 走默认渲染，BEWLR 不生效
- ❌ 一个 mod 多个 BEWLR 实例 → 每 mod 只应有一份
- ❌ `initializeClient` 写在服务端可达路径 → 客户端入口必须经 `IClientItemExtensions`（物理端分离见 08-client-server.mdc）

## 参考资料

- 官方页 id：`rendering_modelextensions_rendertypes` / `blockentities_ber` / `items_bewlr`（URL 见 API 锚点）
- Minecraft Wiki：https://minecraft.wiki/w/Model（模型规范）
- 规则文件：`forge/1.20.1/.cursor/rules/`（02-block / 03-item / 08-client-server / 09-anti-patterns）

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-model` | JSON 模型与 render_type 条目生成 |
| `mc-blockentity` | BER 配套方块实体（tick、数据同步） |
| `mc-block` / `mc-item` | 方块/物品注册与属性 |
| `mc-datagen` | 模型/方块状态数据生成 |
| `mc-registry` | 注册表条目（01-registry.mdc） |

## 下一步

按 Decision 选路线；写实体渲染器或自定义 shader 前先 `search_forge_docs` 核对（本档未核实部分），完成后再对照 `09-anti-patterns.mdc` 走一遍检查。
