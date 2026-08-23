---
id: authored/ore-generation-worldgen
title: 矿物生成三层链路（ConfiguredFeature → PlacedFeature → BiomeModifier）
tags: [worldgen, oregen, configured-feature, placed-feature, biome-modifier, datagen, neoforge, forge]
summary: ConfiguredFeature 定义矿脉与替换目标；PlacedFeature 摆放修饰器（count/in_square/height_range/biome）；datagen BootstrapContext 写法；BiomeModifier JSON 挂到群系；三角分布与高度选择；1.18+ 高度语义。
mcHint: 1.19+/1.20+/1.21（NeoForge 示例核实于 1.21.x）
sourceKind: authored
---

# 矿物生成三层链路

自写短文。链路与代码依据 Kaupenjoe NeoForge 1.21.X 教程 worldgen 章（分支 `34-oreGen`，MIT），JSON 产物已对照生成目录。

## 三层结构

| 层 | 注册键 | 职责 |
|----|--------|------|
| `ConfiguredFeature` | `Registries.CONFIGURED_FEATURE` | 「什么 feature + 什么配置」：矿脉大小、替换哪些方块 |
| `PlacedFeature` | `Registries.PLACED_FEATURE` | 「怎么摆」：每 chunk 尝试次数、高度范围、过滤 |
| `BiomeModifier`（NeoForge） | `NeoForgeRegistries.Keys.BIOME_MODIFIERS` | 把 placed feature 以某 `GenerationStep.Decoration` 挂进哪些群系 |

数据本体是 JSON（`data/<modid>/worldgen/configured_feature/*.json`、`placed_feature/*.json`、`neoforge/biome_modifier/*.json`），**推荐用 datagen** 从 `BootstrapContext` bootstrap 方法生成，避免手写 JSON 打错枚举名。

## ConfiguredFeature（矿脉定义）

```java
public static void bootstrap(BootstrapContext<ConfiguredFeature<?, ?>> context) {
    RuleTest stoneOre = new TagMatchTest(BlockTags.STONE_ORE_REPLACEABLES);      // 用标签，别硬编码 STONE
    RuleTest deepslateOre = new TagMatchTest(BlockTags.DEEPSLATE_ORE_REPLACEABLES);

    List<OreConfiguration.TargetBlockState> targets = List.of(
        OreConfiguration.target(stoneOre, ModBlocks.EXAMPLE_ORE.get().defaultBlockState()),
        OreConfiguration.target(deepslateOre, ModBlocks.EXAMPLE_DEEPSLATE_ORE.get().defaultBlockState()));

    context.register(KEY, new ConfiguredFeature<>(Feature.ORE,
        new OreConfiguration(targets, 9))); // 9 = 矿脉平均方块数
}
```

- 主世界矿石应给**石/深板岩两个目标态**（`TargetBlockState` 列表）；下界用 `BlockMatchTest(Blocks.NETHERRACK)`、末地 `END_STONE`。
- 替换判定优先 `TagMatchTest` + 原版标签 `STONE_ORE_REPLACEABLES` / `DEEPSLATE_ORE_REPLACEABLES`；`BlockMatchTest` 只匹配单一方块。

## PlacedFeature（摆放）

```java
register(context, PLACED_KEY,
    context.lookup(Registries.CONFIGURED_FEATURE).getOrThrow(CF_KEY),
    ModOrePlacement.commonOrePlacement(12,                       // 每 chunk 尝试次数
        HeightRangePlacement.triangle(                            // 三角分布：中部更密
            VerticalAnchor.absolute(-64), VerticalAnchor.absolute(80))));
```

教程的 helper（等价原版 `OrePlacement`）：

```java
static List<PlacementModifier> orePlacement(PlacementModifier count, PlacementModifier height) {
    return List.of(count, InSquarePlacement.spread(), height, BiomeFilter.biome());
}
// commonOrePlacement(n, h) = CountPlacement.of(n) …; rareOrePlacement(chance, h) = RarityFilter.onAverageOnceEvery(chance)
```

生成的 JSON 形如：

```json
{ "feature": "tutorialmod:example_ore",
  "placement": [
    { "type": "minecraft:count", "count": 12 },
    { "type": "minecraft:in_square" },
    { "type": "minecraft:height_range",
      "height": { "type": "minecraft:trapezoid",
                  "min_inclusive": { "absolute": -64 }, "max_inclusive": { "absolute": 80 } } },
    { "type": "minecraft:biome" } ] }
```

- 四件套缺一不可：count/rarity、`in_square`、height_range、`biome` 过滤。漏 `BiomeFilter` 会把矿生成进不该出现的群系。
- **高度语义是 1.18+ 的**：`absolute(-64)` 是 Y=-64 世界底部；写负数高度不是错误。参考原版铜矿用 triangle(-16,112)、铁矿 triangle(-80,384)、钻石 uniform(-64,16) 类似地按「想让它主要挖哪层」选区间。
- triangle（梯形）= 中间层最密；uniform = 区间内均匀。稀有矿可用 `rareOrePlacement`（RarityFilter）。

## BiomeModifier（挂群系，NeoForge 特有）

```java
context.register(ADD_ORE_KEY, new BiomeModifiers.AddFeaturesBiomeModifier(
    biomes.getOrThrow(BiomeTags.IS_OVERWORLD),                 // HolderSet<Biome>：标签或 direct(单群系)
    HolderSet.direct(placedFeatures.getOrThrow(PLACED_KEY)),
    GenerationStep.Decoration.UNDERGROUND_ORES));
```

对应 JSON：

```json
{ "type": "neoforge:add_features",
  "biomes": "#minecraft:is_overworld",
  "features": "tutorialmod:example_ore_placed",
  "step": "underground_ores" }
```

- step 选对：矿石 `UNDERGROUND_ORES`；树 `VEGETAL_DECORATION`；花同 VEGETAL。
- Forge 1.20.x 同构：包名 `net.minecraftforge.common.world.BiomeModifiers`，JSON 目录 `forge/biome_modifier/`，type 前缀 `forge:add_features`。
- Fabric 无 BiomeModifier：走 DataPack 入口 `data/fabric/tags/worldgen/biome/has_structure/...` 或 `BiomeModifications.addFeature`（FAPI）——别把 NeoForge JSON 抄给 Fabric。

## 排查清单

- 改完 datagen 先跑 `runData`，确认三个 JSON 都在 generated resources 里且 namespace 正确。
- 新 chunk 才会生成新矿（旧区块不会回填）；测试用新世界或 `/locate biome` + 大范围探索。
- 矿完全不出现：先查 BiomeModifier 是否命中群系（标签拼写），再查 placed JSON 的 step 与 filter，最后才怀疑 CF 配置。
- 矿浮空/嵌在流体里：正常现象由后续 step 处理不了；检查是否漏了替换目标（如只写了石头没写深板岩）。

## 不清楚时

- 教程源码（分支 `34-oreGen`，MIT）：https://github.com/Tutorials-By-Kaupenjoe/NeoForge-Tutorial-1.21.X/tree/34-oreGen
- NeoForge 文档 worldgen / biome modifiers：https://docs.neoforged.net/ （Data & Resources 章节）
- API 细节：`search_neoforge_docs` / `search_forge_docs`（关键词 worldgen, ore, feature）、本仓库规则 `07-datagen`
