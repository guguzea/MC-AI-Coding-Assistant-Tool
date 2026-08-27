---
name: mc-worldgen
description: configured/placed feature、biome modifier。触发词：worldgen、placed_feature
platform: fabric
version: "1.18.2"
dependencies: []
mappings: yarn
---

# 世界生成（Fabric 1.18.2）

官方 develop 树多数没有独立 worldgen 页。签名来自本版 **loader-api**。Yarn：`GenerationStep.Feature`、`RegistryKey`、`SpawnGroup`。不要抄 26.1.2 Mojmap。

```java
BiomeModifications.addFeature(
    BiomeSelectors.foundInOverworld(),
    GenerationStep.Feature.VEGETAL_DECORATION,
    MY_PLACED_FEATURE
);
BiomeModifications.addCarver(BiomeSelectors.foundInOverworld(), GenerationStep.Carver.AIR, MY_CARVER);
```

已核：`addFeature(Predicate, GenerationStep.Feature, RegistryKey<PlacedFeature>)`；`addCarver(Predicate, GenerationStep.Carver, RegistryKey<ConfiguredCarver<?>>)`；`addSpawn(..., SpawnGroup, EntityType, weight, min, max)`；`create(Identifier)`。

`MY_PLACED_FEATURE` 来自数据包 placed_feature，不要 `ConfiguredFeatures.register`。

## Decision Flow

```
IF 往原版群系加 placed feature
  → BiomeModifications.addFeature + BiomeSelectors
IF 自定义矿脉/树
  → 数据包 JSON，再 addFeature
IF 生物生成
  → addSpawn + SpawnGroup
```

## 常见错误

- ❌ 1.16 的 ConfiguredFeature 第三参
- ❌ Mojmap `MobCategory` / `GenerationStep.Decoration` / `ResourceKey`
- ❌ Forge `BiomeLoadingEvent`
