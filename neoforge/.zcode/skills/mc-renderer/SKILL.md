---
name: mc-renderer
description: 客户端实体/方块渲染、BER、层与纹理。触发词：Renderer、RenderType、BER
platform: neoforge
version: "1.20.4"
dependencies: []
mappings: mcp
---

# mc-renderer（NeoForge）

客户端渲染按表现层次分三块：**Render Types**（JSON `render_type`：裁剪/半透明等渲染类型选择）、**BER**（BlockEntityRenderer：方块动态渲染）、**BEWLR**（物品动态渲染）。实体渲染器（EntityRenderer）与自定义 shader 属未核实内容：按机制路线处理，不给签名。

> **核实状态声明**：NeoForge 1.21.1+ 与 Forge 语义同源，以 **Forge 1.20.1 已核实条目**（页 id：`rendering_modelextensions_rendertypes` / `blockentities_ber` / `items_bewlr`）为语义基线；本档 1.21.1 树**无独立 rendering 页**，**26.1 树仅有 `rendering/feature` 页可核**（见下节）。NeoForge 侧类名/事件名一律以 `search_neoforge_docs` 复核，禁止照抄 Forge 命名、凭记忆补签名。

## 三块表现层次（语义基线）

### 1. Render Types——静态模型 + render_type（大多数方块）

模型 JSON 顶层加 `render_type` 条目即可，无需注册（未指定时加载器回退旧式查询；自定义模型加载器可忽略该字段）：

```json
{
  "render_type": "minecraft:cutout",
  "parent": "block/cube_all",
  "textures": { "all": "block/glass" }
}
```

| JSON 值 | 用途（Forge 1.20.1 已核实） |
|---------|------|
| `minecraft:solid` | 全不透明（石头） |
| `minecraft:cutout` | 像素全透/全不透（玻璃块） |
| `minecraft:cutout_mipped` | 远景缩小（树叶；物品侧不做 mipmap） |
| `minecraft:cutout_mipped_all` | 物品也要 mipmap |
| `minecraft:translucent` | 部分半透明（染色玻璃） |
| `minecraft:tripwire` | 需渲染到天气目标（绊线） |

自定义命名渲染类型：在命名渲染类型注册事件（Forge 名 `RegisterNamedRenderTypesEvent`，**NeoForge 事件名以 `search_neoforge_docs` 复核**）注册 `<modid>:name`，JSON 引用同名值；chunk 渲染类型必须取 `RenderType.chunkBufferLayers()` 列表成员。

### 2. BER（方块动态渲染）

- 用于无法用静态烘焙模型（JSON/OBJ/B3D 等）表示的方块；**方块必须有对应 BlockEntity**。
- 类继承 `BlockEntityRenderer`，泛型 = 方块实体类；覆写每帧调用的 `render`（入参含方块实体、partialTick、poseStack、bufferSource、combinedLight/combinedOverlay——具体以复核为准）。
- 一个 `BlockEntityType` 只对应一个 BER ⇒ **单实例状态（如每帧自增 int）应存方块实体，不能存 BER**（否则该类型所有方块每帧一起变）。
- 注册：实体渲染器注册事件（Forge 名 `EntityRenderersEvent$RegisterRenderers` 的 `registerBlockEntityRenderer`；NeoForge 侧以 `search_neoforge_docs` 复核）。

### 3. BEWLR（物品动态渲染）

- 前提：物品模型 `BakedModel#isCustomRenderer` 返回 true（否则走默认渲染）。
- 初始化入口：`Item#initializeClient(Consumer<IClientItemExtensions>)`（客户端物理端入口），在匿名实例中覆写 `IClientItemExtensions#getCustomRenderer` 返回 BEWLR 实例；**每个 mod 只应有一个 BEWLR 实例**。
- 方块也可走 BEWLR：`Block#getRenderShape` 设为 `RenderShape#ENTITYBLOCK_ANIMATED`（Forge 已核实；NeoForge 复核）。
- NeoForge 1.20.4+ 上述入口是否同名同包，一律 `search_neoforge_docs` 复核。

## 26.1 `rendering/feature` 页可核部分（页 id：`rendering_feature`）

URL：https://docs.neoforged.net/docs/rendering/feature/ 。该页描述 26.1+ 渲染管线：rendering feature 定义一组**未烘焙进 level 几何**的对象（实体、文字、粒子、手持/下落方块等动态位置对象），拆成**提交阶段 + 渲染阶段**，以更好批处理与排序：

- **提交**：各子系统（EntityRenderer / BlockEntityRenderer / 粒子组）提供 `submit` 方法，经 **`SubmitNodeCollector`** 提交进 **`SubmitNodeCollection`** 树映射。可用方法（按最终渲染顺序）：`submitShadow` / `submitNameTag` / `submitText` / `submitFlame` / `submitLeash` / `submitModel` / `submitModelPart` / `submitMovingBlock` / `submitBlockModel` / `submitBreakingBlockModel` / `submitItem` / `submitCustomGeometry`（任意方法定义上传到给定 `RenderType` 缓冲的顶点）/ `submitParticleGroup`（粒子 quad 批渲染器）；NeoForge 另加 **`submitMultiLayerBlockModel`**（一组 `BlockStateModelPart`，支持 per-quad 渲染类型，而非全部塞进单类型层）。
- **分组**：这些方法是超接口 **`OrderedSubmitNodeCollector`** 的一部分；`collector.order(int)` 指定绘制顺序——数值小先渲染，默认 order 0（`collector.order(-1)` 先于默认、`order(1)` 后于默认）。
- **渲染**：**`FeatureRenderDispatcher#renderAllFeatures`** 渲染 `SubmitNodeStorage` 中的 `SubmitNodeCollection`；solid 与透明各有一份固定渲染次序（模型/模型部件/火焰/牵绳/物品/移动方块/方块模型/multi-layer/自定义几何……，完整次序以页内列表为准）；透明粒子单独 pass；渲染后 `SubmitNodeStorage` 被清空，每帧可能多次调用（level、手持物品、画中画 GUI——画中画场合 `renderAllFeatures` 后跟 `MultiBufferSource.BufferSource#endBatch` 构建网格并画到缓冲区）。
- **不可变性**：提交后的元素视为不可变（`PoseStack` 等在该时刻做快照）。

> **注意**：这是 26.1+ 的新 feature 管线；**1.21.1 及更早仍是上节三块（render_type / BER / BEWLR）语义**。两者不要混用；26.1 侧完整签名以 `search_neoforge_docs` 复核。

## Decision: 选择渲染方案

```
IF 混合/裁剪/半透明 → JSON render_type
IF 方块有动态内容且已有 BlockEntity → BER
IF 物品要动态渲染 → BEWLR（先让 BakedModel#isCustomRenderer = true）
IF 26.1+ 深度自定义批处理/排序 → rendering/feature 管线（签名以 search_neoforge_docs 为准）
IF Entity 本体渲染 / 自定义 shader / 核心管线 → 机制路线，签名以 search_neoforge_docs 为准
```

## 常见错误

- ❌ 用已废弃的 `ItemBlockRenderTypes#setRenderLayer()` 设方块 → 1.19 起 JSON `render_type` 优先
- ❌ BER 里存每实例状态（如每帧自增 int）→ 状态放方块实体
- ❌ 方块没有 BlockEntity 却想用 BER → 先建方块实体（`mc-blockentity`）
- ❌ 自定义命名渲染类型的 chunk 部分不在 `RenderType.chunkBufferLayers()` 内
- ❌ `render_type` 值漏命名空间前缀 → `minecraft:cutout` / `<modid>:special` 形式
- ❌ BEWLR 忘记把模型 `isCustomRenderer` 置 true → 走默认渲染，BEWLR 不生效；一个 mod 多个 BEWLR 实例
- ❌ 把 26.1 的 feature 管线概念混入 1.21.1 开发（或反之）
- ❌ 物理端：`initializeClient` 等客户端入口出现在服务端可达路径（08-client-server.mdc 约束）

## 参考资料

- Forge 语义基线页 id：`rendering_modelextensions_rendertypes` / `blockentities_ber` / `items_bewlr`（URL 见上）
- 26.1 页 id `rendering_feature`：https://docs.neoforged.net/docs/rendering/feature/
- NeoForge 判定：`search_neoforge_docs`（platform=neoforge + 对应版本）；本档未核实项保持机制路线，不补签名。

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-model` | JSON 模型与 render_type 条目生成 |
| `mc-blockentity` | BER 配套方块实体（tick、数据同步） |
| `mc-block` / `mc-item` | 方块/物品注册与属性 |
| `mc-datagen` | 模型/方块状态数据生成 |
| `mc-registry` | 注册表条目（01-registry.mdc） |
