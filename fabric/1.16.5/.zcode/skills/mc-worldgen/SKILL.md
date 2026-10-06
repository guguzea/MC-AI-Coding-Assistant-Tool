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
// MY_CONFIGURED_FEATURE：示例名（本件自造，非 Fabric API 符号）= 指向数据包 configured_feature JSON 的 RegistryKey<ConfiguredFeature<?, ?>>
// TODO(未核实)：本版该 RegistryKey 的取法在本仓无出处——RegistryKey.of(Identifier,Identifier)/(RegistryKey,Identifier) 两个重载在本档映射确有，
// 但数据包注册表 id 串（worldgen/configured_feature）未在本档语料逐字出现，不默写构造行；用前先 query_loader_api / 自备 fabric-api jar 核实
BiomeModifications.addFeature(
    BiomeSelectors.foundInOverworld(),
    GenerationStep.Feature.VEGETAL_DECORATION,
    MY_CONFIGURED_FEATURE  // 示例名，本件自造，没有任何 MC 符号叫 MY_CONFIGURED_FEATURE
);
```

已核：`addFeature(Predicate, GenerationStep.Feature, RegistryKey<ConfiguredFeature<?, ?>>)`；`addStructure`；`addCarver(Predicate, GenerationStep.Carver, RegistryKey<ConfiguredCarver<?>>)`；`addSpawn(..., SpawnGroup, EntityType, weight, min, max)`；`create(Identifier)`。

## Decision Flow

```
IF 往群系加 configured feature
→ addFeature（本档没有 PlacedFeature，那是 1.18+ 别的版本的名字）
IF 结构
  → addStructure
IF 生物
  → addSpawn + SpawnGroup
```

## 常见错误

- ❌ 抄 1.18+ `RegistryKey<PlacedFeature>`
- ❌ Mojmap `GenerationStep.Decoration` / `MobCategory`
- ❌ Forge `BiomeLoadingEvent`
