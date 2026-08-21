---
name: mc-worldgen
description: configured/placed feature、biome modifier。触发词：worldgen、placed_feature
platform: fabric
version: "1.16.5"
dependencies: []
mappings: yarn
---

# 世界生成（Fabric 1.16.5）

官方 wiki 常无独立教程。签名来自本版 **loader-api** `BiomeModifications`。Yarn。1.16.5 的 `addFeature` 吃的是 **ConfiguredFeature** 的 `RegistryKey`，不是 1.18+ 的 PlacedFeature。

```java
BiomeModifications.addFeature(
    BiomeSelectors.foundInOverworld(),
    GenerationStep.Feature.VEGETAL_DECORATION,
    MY_CONFIGURED_FEATURE
);
```

已核：`addFeature(Predicate, GenerationStep.Feature, RegistryKey<ConfiguredFeature<?, ?>>)`；`addStructure`；`addCarver(Predicate, GenerationStep.Carver, RegistryKey<ConfiguredCarver<?>>)`；`addSpawn(..., SpawnGroup, EntityType, weight, min, max)`；`create(Identifier)`。

## Decision Flow

```
IF 往群系加 configured feature
  → addFeature（不是 PlacedFeature）
IF 结构
  → addStructure
IF 生物
  → addSpawn + SpawnGroup
```

## 常见错误

- ❌ 抄 1.18+ `RegistryKey<PlacedFeature>`
- ❌ Mojmap `GenerationStep.Decoration` / `MobCategory`
- ❌ Forge `BiomeLoadingEvent`
