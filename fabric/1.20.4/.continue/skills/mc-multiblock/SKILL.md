---
name: mc-multiblock
description: 多方块结构模式。触发词：multiblock、master、slave
platform: fabric
version: "1.20.4"
dependencies: []
mappings: yarn
mappings_alt: mojmap
---

# mc-multiblock（Fabric 1.20.4）

多方块结构**没有平台 API** —— Fabric API、vanilla 都没有「多方块注册表 / 成型状态 / 自动结构校验」这种东西。这是一件**模式技能**：下面只写「用本档已核实的 vanilla 名把这个模式落下来」，不替你发明 API。

## 本档出处口径

类名有两条合法证据：本档 `data/fabric_1.20.4/**` 语料逐字命中，或 `data/fabric_1.20.4/mappings/yarn-mappings.sqlite` 命中。映射库只证**存在**，不证签名与用法。

自查结果（`assert-skill-yarn-attest --pack=fabric_1.20.4`）：

- 可用：`BlockPos`、`BlockEntity`、`BlockEntityType`、`VoxelShape`、`VoxelShapes`、`World`、`ServerWorld`、`Direction`、`BlockState`、`BlockView`、`ShapeContext`、`ChunkPos`、`Identifier`、`Registry`、`Registries`；成员名 `getBlockEntity`、`getType`、`createBlockEntity`、`markDirty`、`isClient`、`getOutlineShape`、`cuboid` 亦可用。
- 无出处（禁止默写）：`MultiblockRegistry`、`toTag`。
- 弱出处（`语料✓ 映射·`）：`MutableBlockPos` —— 只有页面字符串命中、Yarn 映射未命中，要用先核实。
- ⚠️ 本档 `data/fabric_1.20.4/reference/**` 与部分 fabric-docs 正文写的是 **Mojang 官方名**（`ResourceLocation`、`BuiltInRegistries`）——那里的调用链**不得**当本档 Yarn 出处抄。Yarn 侧可引的逐字签名只有 wiki 页面。

本档唯一带页面逐字出处的 Yarn 签名（`data/fabric_1.20.4/fabric-wiki/1.20.4/processed/tutorial_blocks.md:373-375`）就是「整体外形」这一段：

```java
@Override
public VoxelShape getOutlineShape(BlockState state, BlockView view, BlockPos pos, ShapeContext context) {
    return VoxelShapes.cuboid(0f, 0f, 0f, 1f, 1.0f, 0.5f);
}
```

其余环节本档**没有** Yarn 页面出处，只能按下面 Decision Flow 的 TODO 逐条核实；不许从记忆或邻档补。

## Decision Flow

```
→ 多方块 = 控制器 BlockEntity + 结构校验 + formed 状态；三件全是你自己写的代码，不是 API
→ 控制器宿主 → BlockEntity 经 BlockEntityType 注册，注册入口走 Registries
   // TODO(未核实)：BlockEntityType 的 Builder 方法名与参数形态，本档页面无 Yarn 逐字出处
   // TODO(未核实)：reference 树里的 of(...) / BuiltInRegistries 是官方名，禁止当 Yarn 签名照抄
   // TODO(未核实)：须 search_fabric_docs(version=1.20.4) 或 get_minecraft_source 逐个核实
→ 结构探测 → 以控制器 BlockPos 为原点，按 Direction 逐格比 BlockState
   // TODO(未核实)：getBlockEntity / getBlockState 的返回类型与可空性（名字本档自查可用）
   // TODO(未核实)：BlockPos 的逐格遍历入口（区间 / 流式）本档无出处，禁止臆造
→ 整体外形 → VoxelShape，用上方 cuboid 片段那种写法；多格合并成一个整体所需的合集方法本档无出处
   // TODO(未核实)：禁止凭记忆写 VoxelShapes 的静态合集方法名
→ 客户端 / 服务端分离 → 08-client-server.mdc；formed 状态下发 → 06-networking.mdc
```

## 本档没有的东西（禁止默写 / 禁止臆造）

- **没有多方块注册表**：`MultiblockRegistry` 本档自查语料· 映射· ⇒ 无出处。成员与控制器的关系只能自己存进 `BlockEntity`。
- **没有 formed-state API**：「是否成型」只是控制器自己的一份字段加你自己写的序列化。本档 `writeNbt` / `readNbt` 可用，`toTag` 自查**无出处**（那是 1.14.4 / 1.16.5 一代的名字）⇒ 别按邻档写；确切签名仍须核实。
- **没有自动结构校验**：不存在「给个 pattern 就替你扫世界」的东西。vanilla 的结构面（`StructureTemplate` / `BlockPointer` / `StructureBlockEntity` / `TemplateManager` 本档自查可用）只能当「原版怎么存一个结构」的思路参考，不是多方块机制。
- **没有跨档通用名**：`Level` / `ServerLevel` / `BlockGetter` / `ResourceLocation` 是 mojmap 名，本档自查全部 `映射·`（语料命中只来自官方名 reference 树与 json，不是 Yarn 名）⇒ 本档写法对应 `World` / `ServerWorld` / `BlockView` / `Identifier`。`Identifier` 的构造形态各档不同，写前另核。

## 反模式

- 每 tick 全量扫描结构：只在成员块被放置 / 破坏 / 使用等结构可能变化的时刻重扫。
- 在客户端扫世界当 formed 真值：真值只认服务端 `ServerWorld`，客户端只做表现（见 `08-client-server.mdc`）。
- 把结构状态写进方块实例字段：方块无状态，状态落 `BlockEntity`。
- 拿 Forge / NeoForge 教程或本档官方名 reference 树的类名当本档 Yarn 名字。

## 相关

- 控制器 BE：本档 `mc-blockentity.md`（同目录；它的注册片段不在语料出处链内，照抄前照样要核实）
- 方块与形状：本档 `mc-block.md`、`.cursor/rules/02-block.mdc`
- 注册落点：本档 `mc-registry.md`、`.cursor/rules/01-registry.mdc`
- 分端与下发：`.cursor/rules/08-client-server.mdc`、`.cursor/rules/06-networking.mdc`、本档 `mc-networking.md`
- 原版结构面：本档 `mc-structure.md`
- 踩坑：`.cursor/rules/09-anti-patterns.mdc`、`knowledge/antipatterns/`
- 核实路径：`search_fabric_docs(version=1.20.4)` → `get_fabric_doc_full`；vanilla 签名 `get_minecraft_source`（需 JDK 17+）或工程 `genSources`

### ⚠️ 映射口径：本档语料是 mojmap

本文件下面引 `search_fabric_docs` / `get_fabric_doc_full` 抄来的类名是 **mojmap 原名** —— 因为本档语料本身是 mojmap：本档语料页（reference/1.20.4/src/main/java/com/example/docs/ExampleMod.java）就是 mojmap 写法。
但本档 `scaffold/gradle.properties` 钉的是 Yarn（工程默认映射按本档 `.cursor/rules/00-project-setup.mdc` 与 frontmatter 为准），**两套名不能混用**。

| mojmap 名 | Yarn 名 | 适用版本（13 档逐档 join 实测） | 依据 |
| --- | --- | --- | --- |
| `BuiltInRegistries` | `Registries` | 1.19.4–1.21.11 | join（`net.minecraft.registry.Registries`） |

- 上表「Yarn 对应名」只由本档 `mappings/yarn-mappings.sqlite` 证实**类名存在与其包路径**，**不证实**方法名、参数与返回值。逐签名以 Yarn 源码为准：`get_minecraft_source`（需 JDK 17+）或 IDE `./gradlew genSources`。
- 反过来，mojmap 侧这些名在本档 Yarn 映射里 **0 命中** ⇒ 抄进 Yarn 工程必编译失败。
- 未列入上表的 `Fabric API` / `Mixin` / 示例工程自造类名不在 vanilla 映射内，按语料原样用。
