---
name: mc-dimension
description: 自定义维度、DimensionType、传送与跨维度逻辑。触发词：dimension、DimensionType、teleport
platform: forge
version: "1.16.5"
dependencies: []
mappings: mcp
---

# mc-dimension

> 本档正文的类名 / 注册表名 / 路径只来自 `data/forge_1.16.5` 本档语料。实读页面：`forge-docs/1.16.5/processed/primer_1_16_5.md` 的 **§Dynamic Registries** 与 **§Dimensions/Worlds**（含 §Registration / §Referencing a Dimension / §Getting the Dimension Registry）以及 §Chunk Generators 里关于维度 JSON 的那一句。
> 反查结果：本档 processed 全量命中 `dimension` 的只有 5 个文件——`primer_1_16_5.md`（唯一讲维度的页）、`advanced_accesstransformers.md`（AT 里 `[` 表示「数组的一维」，无关）、`datastorage_worldsaveddata.md`（`DimensionSavedDataManager`、按维度存盘，另一主题）、`datastorage_capabilities.md`（`null` 朝向举例提到「另一个维度」）、`tileentities_tesr.md`（「四维矩阵」措辞，无关）。
> 页内没有的签名一律留 `TODO(未核实)`，禁止用邻版（1.14.4 / 1.15.2 / 1.17+ / NeoForge）补全。
>
> ⚠️ **来源性质**：`primer_1_16_5.md` 是 1.15.2 → 1.16.5 的迁移说明，本篇正是那场地改的设计要点。页面自己在正文里混用两套映射（例：「World = `Level` and Dimension = `LevelStem` in Mojang mappings」、「`WorldGenSettings`（MCP class name）」）。本档 frontmatter 记 `mcp`，正文照抄页面写法；工程实际通道以 `00-project-setup.mdc` 与 `gradle.properties` 为准，两套名**不得混写**。

## 一句话总则：维度已经数据驱动，不要再在代码里建

页面口径：

- 「**Dimensions are now data-driven** and have significantly changed in its design.」
- **自定义维度 / 世界今后不应再用代码创建**，例外是「运行期动态创建维度」这类特殊情况。
- 注册方式：在 `data/modid/dimension/` 下建一个 JSON 文件来注册并定义你的维度。原版会在 **datapack 加载时**自动拾取并注册这个维度 / 世界，并在**建世界时**为该数据驱动维度创建世界。
- 用自定义 `ChunkGenerator` 时，页面建议**在维度 JSON 里引用**它，而不是去构造一个 code-based Dimension。
- 给自定义维度加生物群系：把生物群系的注册名写进维度 JSON，页面给的样例值就是 `"modid:my_biome"`。

Forge 侧的连带变化：**Forge 的 `DimensionManager` 类已被移除**，因为在新环境下它已过时。⇒ 任何按 1.12 / 1.14 记忆写 `DimensionManager` 的做法在本档版本上都不成立。

## 三个概念的关系（页内逐字）

- `Dimension` 如今更像「一个 World 的一组扩展设置」：它把一个 `ChunkGenerator` 和一个 `DimensionType` 配成对。（页面括注：Mojang 映射里 World = `Level`、Dimension = `LevelStem`。）
- `Dimension` 对 `DimensionType` 是 **一对多**：多个 `Dimension` 可以共用同一个 `DimensionType`。
- `Dimension` 对 World 是 **一对一**：世界本身就是该 Dimension 的实例。

## 维度相关对象都在 Dynamic Registries 里

§Dynamic Registries：1.16+ 大量注册表对象改为数据驱动，`DynamicRegistries` 负责同步这些数据驱动注册表。页面列出的例子包含 **`Dimension`、`DimensionType`**、`Biome`、`ConfiguredFeature`、`ConfiguredStructureFeature`。

- 属于 Dynamic Registry 的对象**只有在要被一个已存在的注册表对象引用时**才需要在代码里注册；否则页面建议用 JSON 文件。
- 运行期取动态注册表对象：按逻辑侧从 `MinecraftServer` 或 `ClientPlayNetHandler` 拿（页面给的示例是 Biome 侧，维度面未展开 ⇒ `TODO(未核实)`）。

## 引用一个维度：用 `RegistryKey<World>`，不要用 `DimensionType`

页面 §Referencing a Dimension 逐字给出的四条：

- 维度 / 世界现在通过 `RegistryKey<World>` 实例来引用，**不再**是 `DimensionType`。
- 取一个 `RegistryKey<World>`：`RegistryKey.get(Registry.DIMENSION_REGISTRY, new ResourceLocation(MODID, "registry_name_here"))`
- 从世界里取该 key：`World#dimension`
- 在服务端取某个 `World`：`MinecraftServer#getWorld`，参数是一个 `RegistryKey<World>`。

⚠️ 页面特意点名：`RegistryKey<Dimension>` 看着也像对的，但它**仅供内部使用**；绝大多数实现请用 `RegistryKey<World>`。

关于 `RegistryKey` 本身，页面另有三条通用事实可依赖：它是 1.16 新引入的对象，组合了「注册表的 ID + 对象的注册名」；可以用 `==` 比较；可用于任何 modded 或原版注册表。

## 取维度注册表（页面标注：Vanilla Internal Use Only）

- 维度注册表虽同其它地编对象一样数据驱动，但它**不在** `DynamicRegistries` 里；它存在 `MinecraftServer` 的 `level.dat` 中，代码上是 `WorldGenSettings`（页面注明这是 MCP 类名）里的一个字段。
- 取法（页面逐字）：`MinecraftServer#worldData#worldGenSettings#dimensions`。
- ⚠️ 页面带**常见错误**标记：**不要**去取维度注册表，除非你在为「运行期动态创建维度」这类特殊情况用代码注册维度。

## 本档未覆盖（禁止默写）

- **传送与跨维度逻辑**：本档 processed 全量对 `teleport` / `IPortal` / `DimensionTeleport` **零命中**。触发词里的 teleport 本篇给不出任何 API ⇒ 需要传送先 `search_forge_docs(version=1.16.5, query="teleport")`；查不到就保持未核实，禁止用邻版记忆写 `changeDimension` / `ITeleporter`。
- **维度 JSON 的字段面**（`type` / `generator` / `forge:dimension_data` 等）：页面只说「在 `data/modid/dimension/` 建 JSON」「把生物群系注册名写进维度 JSON」，**没有给出任何一个 JSON 键** ⇒ 一律 `TODO(未核实)`，禁止按 1.18+ / NeoForge 的 schema 默写。
- **`DimensionType` 的构造参数**（logical height、bed works、piglins、effects 等）与 **`ChunkGenerator` 的构造面**：本档页面对维度侧未给出任何构造代码。
- **`RegistryKey.get` 的确切重载与包名**：页面出现的就是上面那两行调用，没有 import、没有签名展开 ⇒ 需要逐签名核对时走用户自备 1.16.5 jar（`query_loader_api` / `get_minecraft_source`）。
- **原版 `DIMENSION_REGISTRY` 常量是否即本档版本的确切键名**：只在页面这一行调用里出现过，未在任何注册表总表里核对 ⇒ 保守当未核实。
- **`mc-worldgen` / `mc-structure` 的内容**：本档无对应正文页，别拿它们当维度证据。

## 相关

- 注册与 `ResourceLocation` / `RegistryKey` 写法：`01-registry.mdc` / `mc-registry`
- 事件与 `FMLCommonSetupEvent`（本档地编内容多在 setup 阶段接线）：`05-events.mdc` / `mc-events`
- 按维度存数据：本档 `datastorage_worldsaveddata.md`（`DimensionSavedDataManager`、`ServerChunkProvider#getDataStorage`、`MinecraftServer#overworld`，均在盘，属另一主题，需现读现抄）
- 版本迁移全貌：本档 `knowledge/version-changes/`、`knowledge/porting/`（在盘）
- 反模式：`forge/1.16.5/knowledge/antipatterns/`
- 全文核对：`get_forge_doc_full(version="1.16.5", id="primer_1_16_5")`
