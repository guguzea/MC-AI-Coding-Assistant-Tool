# 版本迁移笔记摘要（Forge 1.13.2 档）

> 以 **1.13.2 为轴心**的分段迁移要点：向下 1.12.2 → 1.13.2（扁平化），向上 1.13.2 → 1.14.4 / 1.15.2。
> 只写本仓能核实的条目；每条出处见 `temp/` 证据日志。DOCS = `data/forge_1.13.2/forge-docs/1.13.2/processed/`。
> 主要来源：`get_migration_guide --route=1.12->1.14`（NeoForge Primer，`https://docs.neoforged.net/primer/docs/1.14/`，MIT / williewillus）+ 1.13.2 官方文档语料 + 本包 `scaffold/`（官方 MDK）。

---

## 1.12.2 → 1.13.2（重大断裂：扁平化）

**关键变化**
- 方块状态：metadata int → `IProperty` / `IBlockState`；`createBlockState`、`setDefaultState`、`withProperty`、`getMetaFromState` / `getStateFromMeta`、`getActualState`（DOCS/blocks_states.md:28-96）。
- Block 与 Item 拆分：注册 `Block` **不会**自动得到物品形态，需 `new ItemBlock(block).setRegistryName(block.getRegistryName())`（DOCS/blocks_blocks.md:32）。
- 资源目录重划：advancements / functions / loot tables / recipes / structures 从 `assets/` → `data/`；`data/<domain>/recipes`、`data/<domain>/structures` 为原版保留（Primer §Data packs）。
- 语言文件：`.lang` → JSON；`tile.` → `block.`；不再追加 `.name`（Primer §Lang changes；DOCS/concepts_internationalization.md:11,25）。
- OreDictionary → Tags：`BlockTags.getCollection()` / `ItemTags.getCollection()`（DOCS/utilities_tags.md:15,28）。
- 网络：`SimpleNetworkWrapper` / `IMessage` → `SimpleChannel` + `registerMessage`（5 参数）+ `PacketDistributor`（DOCS/networking_simpleimpl.md:3-85）。
- 注册：`GameRegistry.register` 被降级为旧法，推荐 `RegistryEvent.Register<T>` + `@ObjectHolder`（DOCS/concepts_registries.md:9,21,25）。
- 加载阶段事件挪到 mod 总线（`@EventBusSubscriber(bus = Bus.MOD)`，DOCS/conventions_loadstages.md:3,12）。
- 其他：多空气类型 → `IBlockState.isAir`；int ID 仅用于网络；biome id byte→int；1.12 结构 NBT 需在 1.13 世界重存（Primer §Misc Things）。

**需要修改的文件类型**
- 资源树整体搬迁：`src/main/resources/assets/**` 中玩法部分 → `data/<modid>/**`；`lang/*.lang` → `lang/*.json`。
- `build.gradle` / `gradle.properties`：按官方 MDK 组合（见下表），映射 channel/version 同步。
- 所有方块类：新增属性声明 + 两个 meta 转换方法；新增 `ItemBlock` 注册处。
- 网络包类与通道注册类整体重写。
- 方块 `getActualState` 中读 TileEntity 处：加 `ChunkCache` 安全判断（DOCS/blocks_states.md:96，语料点名 `BlockFlowerPot.getActualState()` 为示例）。

---

## 1.13 → 1.13.2（同 minor 内补丁）

- 本仓语料没有 1.13 → 1.13.2 的破坏性变更记录，且 `get_migration_guide` 无该路线。
- 实践上按「同档」处理：升级 `minecraft_version` / `forge_version` 即可；**不要**在 1.13 与 1.13.2 之间推断 API 断裂。此结论为「无语料记载」，非「官方声明无变化」。

---

## 1.13.2 → 1.14.4

- 注册：1.14.4 语料已给出两种正规写法并推荐 `DeferredRegister`（`new DeferredRegister<>(ForgeRegistries.BLOCKS, MODID)` + `RegistryObject`，`data/forge_1.14.4/forge-docs/1.14.4/processed/concepts_registries.md:11,18,23,66`）；本档 1.13.2 语料检索不到 `DeferredRegister` → **该改动属向上迁移项，不是 1.13.2 可用项**。
- 能力：1.14.4 语料的签名仍是 `getCapability(Capability<T> capability, EnumFacing facing)`（同目录 `datastorage_capabilities.md:73`）→ 1.13.2 → 1.14.4 之间无需改 `EnumFacing`。
- 其余（流体/waterlogged、命令、Data Fixers、渲染）Primer 有专章，但本任务未取该章正文 → 迁移到 1.14.4 前请 `get_migration_guide --route=1.12->1.14 --section="Fluids and waterlogged blocks"`（等）或 `search_forge_docs --version=1.14.4` 逐条核。

## 1.13.2 → 1.15.2 及更高

- `TileEntity` → `BlockEntity`、`NBTTagCompound` → `CompoundTag` 等重命名发生在 **1.17+**（本包 `knowledge/version-changes/1.13.x.md:52-70`）；1.13.2 → 1.15.2 之间仍是 `TileEntity` / `NBTTagCompound`。
- `Block.Properties.create()` → `Properties.of()`、`IItemTier` → `Tier` 属 1.17/1.18+ 断裂（邻档 `forge/1.15.2/knowledge/porting/00-porting-guide.md:29-36`）→ 与 1.13.2 无关，别在跨这两档时误记为本档问题。
- Java 工具链跃迁（1.16→16、1.17→17）同上，不在本档声明范围。

---

## 版本对照表（本仓实证；空 = 本档不声明）

| MC | 资源包 pack_format | 数据包包目录起点 | Java（source/target） | MDK / Forge | 构建 |
|----|--------------------|------------------|------------------------|-------------|------|
| 1.12.2 | 3（`forge/1.12.2/knowledge/common/resourcepack-format.md:9`） | 1.12.x 无 1.13 式数据包（`forge/1.12.2/knowledge/porting/00-porting-guide.md:56`） | | | |
| **1.13.2** | **4**（`scaffold/src/main/resources/pack.mcmeta:4`；同包 `knowledge/common/datapack-format.md:39` 亦记 4） | `data/<modid>/`（Primer §Data packs） | **1.8**（`scaffold/build.gradle:22`） | **25.0.223**（`mcp-server/data/mdk-checksums.json:545-552`） | ForgeGradle `3.+` + Gradle `4.9`（`scaffold/build.gradle:10`、wrapper `:6`） |
| 1.14.4 | 5（`forge/1.14.4/knowledge/common/resourcepack-format.md:8`） | | | | |
| 1.15.2 | 6（`forge/1.15.2/knowledge/common/resourcepack-format.md:8`） | | | | |

> 1.13.2 的**数据包** pack_format 与资源包是否同号：**未核实**（本仓两处都写 4，但没有区分资源包/数据包编号的官方证据）。写 `pack.mcmeta` 时以本包 scaffold 的 4 为准，改数据包装载行为前请另核。

---

## 工具与线索

| 需求 | 工具调用 |
|------|----------|
| 1.13 扁平化叙述（权威长文） | `get_migration_guide --route=1.12->1.14 --section="Dealing with Item metadata"` / `"Dealing with Block metadata"` / `"Data packs"` / `"Lang changes"` / `"Misc Things"` / `"Tags (OreDictionary for ctrl+f)"` |
| 1.13.2 类名/方法名复核 | `search_forge_docs --query=<kw> --version=1.13.2` → `get_forge_doc_full --id=1.13.2/<page>` |
| 结构化差异线索 | `data/forge-porting/breaking-changes/1.12.2-1.14.4.json`（其 `structuralChanges` 自述为自动检测，**不代表完整 API 变更**） |
| 工程扫描 | `analyze_porting_path`；写盘类 `port_project` 默认 dryRun，需用户确认 |
| 1.13.2 平台 API | 用 `search_forge_docs`，**不要**用 `query_api`（其索引约 1.16.5–1.20.4） |

**不可用**：`get_migration_guide --route=1.12.2->1.13.2` → `found:false`；`search_forge_docs --query=multipart --version=1.13.2` → `total:0`（故 1.13 blockstate 的 multipart 格式在本档属未核实）；第三方移植器 `mc-mod-porter` 的知识库覆盖仅 1.19.4→26.1（`forge/1.16.5/knowledge/porting/02-version-migration.md:5`），不含 1.13.2。

---

## 迁移优先级建议（目标版本不在知识库时）

1. 先定「同 major 还是跨 major」：跨 1.13 边界必须按本文件 §1.12.2 → 1.13.2 处理，别按补丁升级做。
2. `search_forge_docs` 在**源版本**与**目标版本**两侧分别检索同一个类，逐签名对比；禁止用记忆补齐。
3. `data/<loader>_<ver>/forge-docs/` 有语料的相邻档才可当参照；无档 → 保留 `未核实` 骨架并停下问用户。
4. 最后才看社区经验贴（遵守 `community_knowledge/AGENT_USAGE.md`：不清 / 不会时必须打开原文或官方文档）。
