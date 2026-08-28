[DONOR_SKILL 禁止直接抄写]
本 Skill 正文来自 fabric/1.21.4，仅作结构/流程提示，不是 1.21.10 官方 API。不得直接使用 donor 正文里的类名/方法。先 search_fabric_docs(version=1.21.10) 核对类名/方法签名（不要用 version=1.21.3），对不上就改口官方文档、禁止照抄。Yarn 档互捐，禁止把 26.1.2 mojmap 当本档。

---

---
name: mc-worldgen
description: configured/placed feature、biome modifier。触发词：worldgen、placed_feature
platform: fabric
version: "1.21.10"
dependencies: []
mappings: yarn
---

# 世界生成（Fabric 1.21.10）

官方 develop 树多数没有独立 worldgen 页。签名来自本版 **loader-api**。Yarn：`GenerationStep.Feature`、`RegistryKey`、`SpawnGroup`。不要抄 26.1.2 Mojmap。

```java
BiomeModifications.addFeature(
    BiomeSelectors.foundInOverworld(),
    GenerationStep.Feature.VEGETAL_DECORATION,
    MY_PLACED_FEATURE
);
BiomeModifications.addCarver(BiomeSelectors.foundInOverworld(), MY_CARVER);
```

已核：`addFeature(Predicate, GenerationStep.Feature, RegistryKey<PlacedFeature>)`；`addCarver(Predicate, RegistryKey<ConfiguredCarver<?>>)`（本档已去掉 Carver step 参）；`addSpawn(..., SpawnGroup, EntityType, weight, min, max)`；`create(Identifier)`。

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
