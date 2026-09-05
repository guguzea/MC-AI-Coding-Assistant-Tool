# Forge 1.19.4 代码模式库

> 本目录为 AI 提供可直接引用的代码模式，按「功能」分类。
> 参见 `../.cursor/rules/` 中的决策流文档以了解何时使用哪种模式。

```
code-patterns/
├── 01-block-patterns.md   # 方块相关模式
├── 02-item-patterns.md    # 物品/工具模式
├── 03-entity-patterns.md  # 实体相关模式
├── 04-world-patterns.md   # 世界生成/地形
├── 05-datagen-patterns.md # DataGen 快速参考
└── README.md              # 本文件
```

## 模式元数据格式

```yaml
模式: Basic Stone Block
版本: Forge 1.19.4
平台: Forge
分类: block
依赖: []
扩展点: [方块实体, 特殊渲染]
---
# 代码模式内容...
```

所有模式文件均可直接引用，无需全部读入。

## 1.19.4 相对邻档（1.18.2 / 1.20.1）的边界

本档夹在 1.18.2 与 1.20.1 之间，**两边的写法不能互相套用**。已核实的分界：

| 项目 | 1.18.2 | **1.19.4（本档）** | 1.20.1 | 引入差异的版本 |
|------|--------|--------------------|--------|----------------|
| 方块颜色 | `.color(MaterialColor.STONE)` | `.color(MaterialColor.STONE)` | `.mapColor(MapColor.STONE)` | 改名在 1.20.x |
| 创造标签 | `Item.Properties.tab(CreativeModeTab.TAB_*)` | **无 `tab()`**；`CreativeModeTabEvent.BuildContents` + `CreativeModeTabs.*` | 同 1.19.4 | 1.19.3 |
| 盔甲槽位 | `ArmorItem(mat, EquipmentSlot.HEAD, props)` | `ArmorItem(mat, ArmorItem.Type.HELMET, props)` | 同 1.19.4 | **1.19.4** |
| 实体注册表 | `ForgeRegistries.ENTITYTYPES` | `ForgeRegistries.ENTITY_TYPES` | `ENTITY_TYPES` | 见本档 `01-registry.mdc:27` |
| 配方 DataGen | `buildCraftingRecipes` + `shaped(ItemLike)` | `buildRecipes` + `shaped(RecipeCategory, ItemLike, int)` | 同 1.19.4 | 1.18.2 与 1.19.3 之间（1.19.1–1.19.3 无索引，无法再收窄） |
| DataGen 入口 | `addProvider(provider)` + `ExistingFileHelper` | `addProvider(true, provider)` + `PackOutput` + `HolderLookup.Provider` | 同 1.19.4 | 同上 |
| 战利品表 | `LootTableProvider#getTables` | `LootTableProvider(PackOutput, Set, List<SubProviderEntry>)` | 同 1.19.4 | 同上 |
| 生物群系注册 | `ForgeRegistries.BIOMES` | `DeferredRegister.create(Registries.BIOME, MOD_ID)` | `Registries.BIOME` | 1.19.x datapack 注册表化 |
| Java | 17 | **17** | 17 | — |
| pack_format | 8 | **数据包 12 / 资源包 13** | 15 | — |

## 核实通道（本目录内容据此写成）

- 官方文档语料：`search_forge_docs --query=<单词> --version=1.19.4` → `get_forge_doc_full --id=<结果里的 id> --version=1.19.4`
  （重点页：`1.19.4/datagen`、`1.19.4/items`、`1.19.4/blockentities`、`1.19.4/concepts_registries`、**`1.19.4/primer_1_19_4`**＝1.19.3→1.19.4 移植 primer）
- Vanilla/Parchment 签名：`query_api --class=<类> --version=1.19.4`（注意方法列表有截断）与
  `get_method_params --class=<FQCN> --method=<名> --version=1.19.4`（短名会报「不在索引中」，必须给 FQCN）
- 逐条出处与所有 `TODO(未核实)` 登记在 `temp/w57-evidence-a4.md`。

## 已知未核实项

- `BlockBehaviour.Properties#insertXp`（1.20.1 档在用，1.19.4/1.20.1 索引均查不到）→ 见 `01-block-patterns.md` 矿物方块一节。
- `Item#shouldCauseReequipAnimation` → 见 `02-item-patterns.md` 耐久处理一节。
- `AmbientMoodSettings.LEGACY_CAVE` 常量、`ModelLayers.createHumanoidBody()` → 见 `03/04` 对应章节。
- configured / placed feature 与 biome modifier 的 **JSON 键**：本档无文档语料，未写入 → 改走 `generate_worldgen` 或按需反编译。
