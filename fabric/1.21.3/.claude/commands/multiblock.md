---
name: mc-multiblock
description: 多方块结构模式。触发词：multiblock、master、slave
platform: fabric
version: "1.21.3"
dependencies: []
mappings: yarn
---

# mc-multiblock（Fabric 1.21.3）

多方块结构**没有平台 API** —— Fabric API、vanilla 都没有「多方块注册表 / 成型状态 / 自动结构校验」这种东西。这是一件**模式技能**：下面只写「用本档已核实的 vanilla 名把这个模式落下来」，不替你发明 API。

## 本档出处口径

类名有两条合法证据：本档 `data/fabric_1.21.3/**` 语料逐字命中，或 `data/fabric_1.21.3/mappings/yarn-mappings.sqlite` 命中。映射库只证**存在**，不证签名与用法。

自查结果（`assert-skill-yarn-attest --pack=fabric_1.21.3`）：

- 可用：`BlockPos`、`BlockEntity`、`BlockEntityType`、`VoxelShape`、`VoxelShapes`、`World`、`ServerWorld`、`Direction`、`BlockState`、`BlockView`、`ShapeContext`、`ChunkPos`、`Identifier`、`Registry`、`Registries`；成员名 `getBlockEntity`、`getType`、`createBlockEntity`、`markDirty`、`isClient`、`getOutlineShape`、`cuboid` 亦可用。
- 无出处（禁止默写）：`MultiblockRegistry`。
- 弱出处（`语料✓ 映射·`）：`MutableBlockPos` —— 只有页面字符串命中、Yarn 映射未命中，要用先核实。
- 本档没有 `reference/**` 源码树，也没有 block-entity 专题 docs 页，可引的只有 wiki 页面正文（`fabric-wiki/1.21.3/processed/`）。

本档唯一带页面逐字出处的签名（`data/fabric_1.21.3/fabric-wiki/1.21.3/processed/tutorial_blocks.md:373-375`）就是「整体外形」这一段：

```java
@Override
public VoxelShape getOutlineShape(BlockState state, BlockView view, BlockPos pos, ShapeContext context) {
    return VoxelShapes.cuboid(0f, 0f, 0f, 1f, 1.0f, 0.5f);
}
```

其余环节本档**没有**页面出处，只能按下面 Decision Flow 的 TODO 逐条核实；不许从记忆或邻档补。

## Decision Flow

```
→ 多方块 = 控制器 BlockEntity + 结构校验 + formed 状态；三件全是你自己写的代码，不是 API
→ 控制器宿主 → BlockEntity 经 BlockEntityType 注册，注册入口走 Registries
   // TODO(未核实)：BlockEntityType 的 Builder 方法名与参数形态，本档页面无 Yarn 逐字出处
   // TODO(未核实)：1.21.2 起形状 / 构造侧 API 有改动，禁止拿 1.20.x 的链顶替本档
   // TODO(未核实)：须 search_fabric_docs(version=1.21.3) 或 get_minecraft_source 逐个核实
→ 结构探测 → 以控制器 BlockPos 为原点，按 Direction 逐格比 BlockState
   // TODO(未核实)：getBlockEntity / getBlockState 的返回类型与可空性（名字本档自查可用）
   // TODO(未核实)：BlockPos 的逐格遍历入口（区间 / 流式）本档无出处，禁止臆造
→ 整体外形 → VoxelShape，用上方 cuboid 片段那种写法；多格合并成一个整体所需的合集方法本档无出处
   // TODO(未核实)：禁止凭记忆写 VoxelShapes 的静态合集方法名
→ 客户端 / 服务端分离 → 08-client-server.mdc；formed 状态下发 → 06-networking.mdc
```

## 本档没有的东西（禁止默写 / 禁止臆造）

- **没有多方块注册表**：`MultiblockRegistry` 本档自查语料· 映射· ⇒ 无出处。成员与控制器的关系只能自己存进 `BlockEntity`。
- **没有 formed-state API**：「是否成型」只是控制器自己的一份字段加你自己写的序列化。本档 `writeNbt` / `readNbt` 自查可用（序列化链的确切签名仍无页面出处）；本档是 1.21 线，别按 1.14.4 / 1.16.5 一代的 `toTag` / `fromTag` 写法套。
- **没有自动结构校验**：不存在「给个 pattern 就替你扫世界」的东西。vanilla 的结构面（`StructureTemplate` / `BlockPointer` / `StructureBlockEntity` / `TemplateManager` 本档自查可用）只能当「原版怎么存一个结构」的思路参考，不是多方块机制。
- **没有跨档通用名**：`Level` / `ServerLevel` / `BlockGetter` / `ResourceLocation` 是 mojmap 名，本档自查全部 `映射·`（语料命中只来自官方名正文与 `mappings/**`，不是 Yarn 名）⇒ 本档写法对应 `World` / `ServerWorld` / `BlockView` / `Identifier`。本档 `Identifier` 走 `Identifier.of(...)`（构造器 private；见本档 `AGENTS.md` 命名规范与 `.cursor/rules/01-registry.mdc`），不要写 `new Identifier(...)`。

## 反模式

- 每 tick 全量扫描结构：只在成员块被放置 / 破坏 / 使用等结构可能变化的时刻重扫。
- 在客户端扫世界当 formed 真值：真值只认服务端 `ServerWorld`，客户端只做表现（见 `08-client-server.mdc`）。
- 把结构状态写进方块实例字段：方块无状态，状态落 `BlockEntity`。
- 拿 Forge / NeoForge 教程的类名当本档名字，或凭记忆补注册链与合集方法名。

## 相关

- 控制器 BE：本档 `mc-blockentity.md`（同目录；它的注册片段不在语料出处链内，照抄前照样要核实）
- 方块与形状：本档 `mc-block.md`、`.cursor/rules/02-block.mdc`
- 注册落点：本档 `mc-registry.md`、`.cursor/rules/01-registry.mdc`
- 分端与下发：`.cursor/rules/08-client-server.mdc`、`.cursor/rules/06-networking.mdc`、本档 `mc-networking.md`
- 原版结构面：本档 `mc-structure.md`
- 踩坑：`.cursor/rules/09-anti-patterns.mdc`、`knowledge/antipatterns/`
- 核实路径：`search_fabric_docs(version=1.21.3)` → `get_fabric_doc_full`；vanilla 签名 `get_minecraft_source`（需 JDK 17+）或工程 `genSources`
