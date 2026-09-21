---
name: mc-dimension
description: 自定义维度、DimensionType、传送与跨维度逻辑。触发词：dimension、DimensionType、teleport
platform: forge
version: "1.14.4"
dependencies: []
mappings: mcp
---

# mc-dimension

> 本档正文的类名 / 事件名只来自 `data/forge_1.14.4` 本档语料。实读页面：`forge-docs/1.14.4/processed/primer_1_14.md` 的 **§Dimensions** 一节（反查结果：本档 processed 全量里只有 4 个文件命中 `dimension` 字样——`primer_1_14.md`、`advanced_accesstransformers.md`（讲的是数组「一维」的 AT 语法，与本主题无关）、`datastorage_worldsaveddata.md`（按维度存盘的世界存档数据）、`datastorage_capabilities.md`（能力面拿 `null` 朝向时的一句举例）——**唯一**讲自定义维度的是 primer 那一节）。
> 页内没有的签名一律留 `TODO(未核实)`，禁止用邻版（1.12.2 / 1.15.2 / 1.16.5 / 1.20.x）补全。
>
> ⚠️ **来源性质必须先读**：`primer_1_14.md` 是 **1.12.2 → 1.14.4 的迁移说明**，§Dimensions 的作用是澄清这版把维度 API 改了名、改了注册流程。因此本篇只给「三个类各是什么 + 注册走哪两个事件 + 那个坑」，**没有**可直接抄的完整维度类与构造代码。
> ⚠️ 页面用的是 1.14 时期的 MCP 风格类名（`WorldServer`、`DimensionType`、`ModDimension`）。照抄即用；**不要**把它们换成邻档（1.16+ / 1.20+）的 `ServerWorld`、`Level` 等形态。

## 三个类分别是什么（页内逐字口径）

| 类 | 归属 | 页内定义 |
| --- | --- | --- |
| `DimensionType` | Vanilla | 一个世界的唯一句柄：`DimensionType` 与 `WorldServer` 是 1:1 对应（页面自己吐槽「所以它其实不是维度类型，这名字起得不好」）。它带一个**字符串名字**，取代旧版本里你用的 int——页面原话：「if you save stuff to disk, use the string name of this object」。 |
| `ModDimension` | **Forge** | 新维度的真正模板 / 类型。一个 `ModDimension` 可以产出**多个** `DimensionType`。 |
| `Dimension` | Vanilla | 由 `DimensionType` 创建并与之绑定；页面说它「单拎出来没什么用」，建议看原版的子类——「你大概可以直接复用其中一个」。 |

## 注册：两个事件，两段动作

页面给的流程是两步：

1. 在 `RegistryEvent.Register<ModDimension>` 里注册你的 `ModDimension`——「像注册方块和物品那样」。
2. 在 `RegisterDimensionsEvent` 里注册 `DimensionType`。

⚠️ **这一条是本篇最要记的坑（页内加粗强调）**：`RegisterDimensionsEvent` **不**像其它事件那样工作——它的注册是 **"sticky"（粘性的）**。一个 `DimensionType` 在某个存档里注册过一次之后，就会被自动带出来、不需要再注册一次。因此你**必须先做存在性检查**，只有确认不存在时才用你的 `ModDimension` 去注册一个或多个 `DimensionType`。

> 页面在这条后面给了一个外链示例（Tropicraft 的 `TropicraftWorldUtils.java`，1.14 分支）。那是**外链**，本仓未入库、正文未展开 ⇒ 按 `community_knowledge/AGENT_USAGE.md` 的口径，要照它写就必须先自行打开原文核对，不得凭链接标题臆造实现。

`ModDimension` / `DimensionType` 的构造签名（`DimensionType.Builder`？还是构造器参数？）、`RegisterDimensionsEvent` 的字段与方法、以及注册后如何拿到 `DimensionType` 实例：**本档页面一律未给出** ⇒ `// TODO(未核实)`，禁止默写代码。要核：`decompile_mod_jar` / `get_minecraft_source` 走用户自备的 1.14.4 jar，或 `query_loader_api`（`platform=forge`, `minecraftVersion=1.14.4`）。

## 页面另外列出但未展开的两个访问点

primer 在 §Dimensions 末尾只留了两行裸名，没有任何上下文或签名：

- `MinecraftServer.getWorld`
- `entity.dimension.getType()`

它们能读出「由 `DimensionType` 拿世界、由实体拿其所在维度的 `DimensionType`」这层意思，但**参数与返回类型本页未给** ⇒ `// TODO(未核实)`：不要写 `server.getWorld(dimType)` 这种看起来对、实际未核的调用。

## 本档未覆盖（禁止默写）

- **传送与跨维度逻辑**：本档 processed 全量对 `teleport` / `IPortal` / `DimensionTeleport` **零命中**。触发词里的 teleport 本篇给不出任何 API ⇒ 需要传送就停手，改口 `search_forge_docs(version=1.14.4, query="teleport dimension")`；本档无该页时保持未核实，**禁止**用 1.16+ 的 `changeDimension` / `Teleporter` 记忆顶上。
- **`DimensionType` 的构造参数**（阴影、床是否爆炸、自然、高度、`ChunkGenerator` 绑定等）：本页一个都没出现 ⇒ 不写。
- **维度效果 / 天空盒 / `DimensionEffect`**：本档无语料。
- **按维度存储数据**：那是另一个主题，本档另有 `datastorage_worldsaveddata.md`（页内说世界存档数据可以 per dimension 或 global 附着，且 global 在客户端 / 服务端各拿一份实例、需自行同步）。要做「跨维度存东西」请现读该页，不要在本篇里默写其 API。
- **JSON / 数据包定义维度**：本档页面完全没有这种说法（1.16+ 才数据驱动）——**不要**把邻档的 `data/<modid>/dimension/` 写法搬来。
- **`query_registry`（dimensions）**：工具面可查注册表 ID，但它不背书本档的构造签名，别拿它当本篇缺口的替代品。

## 相关

- 注册事件写法：`01-registry.mdc` / `mc-registry`；事件总线与阶段：`05-events.mdc` / `mc-events`
- 世界存档数据：本档 `datastorage_worldsaveddata.md`（在盘）
- 版本迁移全貌：本档 `knowledge/porting/`（在盘：`00-porting-guide.md` 等）与 `forge-docs/1.14.4/processed/primer_1_14.md`
- 反模式：`forge/1.14.4/knowledge/antipatterns/`
- 全文核对：`get_forge_doc_full(version="1.14.4", id="primer_1_14")`，只读 §Dimensions 一节
