---
name: mc-renderer
description: 客户端实体/方块渲染、BER、层与纹理。触发词：Renderer、RenderType、BER
platform: forge
version: "1.19.4"
dependencies: []
mappings: mcp
---

# mc-renderer

> **本档核实范围**：`blockentities_ber`（BER）与 `items_bewlr`（BEWLR）两页已在档内核实（内容与 1.20.1 核实稿一致）。
> **本档无 render_type JSON 专题页**：1.19.4 的 `index-l0.json` 无 `rendering_modelextensions_rendertypes`，全库 grep 无 render_type / setRenderLayer 命中——相关机制路线见下，签名一律以 `search_forge_docs`（version=1.19.4）为准。
> EntityRenderer 与自定义 shader：本档无核实页，按「机制路线 + 以 `search_forge_docs` 为准」处理，不给签名。

## 快速开始

### 路线 1：静态烘焙模型（大多数方块/物品）

vanilla JSON 模型可表达大部分方块/物品；Forge 在模型 JSON 顶层提供 `loader` 字段注册自定义模型加载器（`rendering_modelloaders` 页核实：模型最终以 `BakedModel` 呈现；指定自定义 `loader` 时 JSON 的 `elements` 条目会被忽略，除非自定义加载器消费它；OBJ 材质用 `"loader": "forge:obj"` + `model`/`mtl` 引用）。

### 路线 2：BER（方块动态渲染）

1. 方块已有 BlockEntity（BER 前提）。
2. 类继承 `BlockEntityRenderer`，泛型 = 方块实体类；覆写每帧调用的 `render`（入参：blockEntity、partialTicks、poseStack、bufferSource、combinedLight、combinedOverlay）。
3. 在 **mod event bus** 的 `EntityRenderersEvent$RegisterRenderers` 里订阅并调用 `registerBlockEntityRenderer`。

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

### BER（页 id：`blockentities_ber`）

https://docs.minecraftforge.net/en/1.19.4/blockentities/ber/

- 用于无法用静态烘焙模型（JSON/OBJ/B3D 等）表示的方块；**方块必须有对应 BlockEntity**。
- 一个 `BlockEntityType` 只对应一个 BER ⇒ 单实例状态（如每帧自增 int）应存方块实体，不能存 BER（否则该类型所有方块每帧一起变）。
- 注册：`EntityRenderersEvent$RegisterRenderers`（**mod event bus**）→ `registerBlockEntityRenderer`（具体重载与签名以 `search_forge_docs` 为准）。

### BEWLR（页 id：`items_bewlr`）

https://docs.minecraftforge.net/en/1.19.4/items/bewlr/

- 渲染入口：`public void renderByItem(ItemStack itemStack, ItemDisplayContext ctx, PoseStack poseStack, MultiBufferSource bufferSource, int combinedLight, int combinedOverlay)`。
- 前提：模型 `BakedModel#isCustomRenderer` 返回 true；初始化入口 `Item#initializeClient(Consumer<IClientItemExtensions>)`（客户端入口），覆写 `IClientItemExtensions#getCustomRenderer`。
- 每个 mod 只应有一个 BEWLR 实例（官方要求）。
- 方块也可走 BEWLR：`Block#getRenderShape` 设为 `RenderShape#ENTITYBLOCK_ANIMATED`。

### render_type JSON（本档未核实 → 机制路线）

- 机制：模型 JSON 顶层 `render_type` 条目向加载器建议渲染类型；未指定时回退（官方 1.20.4 档注：1.19 起优先于已废弃的 `ItemBlockRenderTypes#setRenderLayer`（方块），同一机制体系贯穿 1.19.x/1.20.x）。
- 本档无对应页，JSON 取值集合、`RegisterNamedRenderTypesEvent` 等的**精确名称与签名以 `search_forge_docs` 为准**，禁止直接抄 1.20.4 页当作本版核实。

## Decision: 选择渲染方案

```
IF 只是混合/裁剪/半透明 → JSON render_type（本档未核实；先 search_forge_docs 核对）
IF 方块有动态内容且已有 BlockEntity → BER
IF 物品要动态渲染 → BEWLR（先让 BakedModel#isCustomRenderer = true）
IF Entity 本体渲染 / 自定义 shader / 核心管线 → 机制路线，签名以 search_forge_docs 为准
```

## 常见错误

- ❌ BER 里存每实例状态（如每帧自增 int）→ 该类型所有方块一起动画；状态放方块实体
- ❌ 方块没有 BlockEntity 却想用 BER → 先建方块实体（`mc-blockentity`）
- ❌ BEWLR 忘记把模型 `isCustomRenderer` 置 true → 走默认渲染，BEWLR 不生效
- ❌ 一个 mod 多个 BEWLR 实例 → 每 mod 只应有一份
- ❌ `initializeClient` 写在服务端可达路径 → 客户端入口必须经 `IClientItemExtensions`（物理端分离见 08-client-server.mdc）
- ❌ 本档直接照搬 1.20.4 的 render_type JSON 表 → 本档未核实，先 `search_forge_docs`

## 参考资料

- 页 id：`blockentities_ber` / `items_bewlr` / `rendering_modelloaders`（URL 见 API 锚点）
- 规则文件：`forge/1.19.4/.cursor/rules/`（02-block / 03-item / 08-client-server / 09-anti-patterns）

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-model` | JSON 模型与 `loader` 字段 |
| `mc-blockentity` | BER 配套方块实体（tick、数据同步） |
| `mc-block` / `mc-item` | 方块/物品注册与属性 |
| `mc-datagen` | 模型/方块状态数据生成 |
| `mc-registry` | 注册表条目（01-registry.mdc） |

## 下一步

按 Decision 选路线；写 render_type / EntityRenderer / 自定义 shader 前先 `search_forge_docs` 核对（本档未核实部分），完成后对照 `09-anti-patterns.mdc` 走一遍检查。
