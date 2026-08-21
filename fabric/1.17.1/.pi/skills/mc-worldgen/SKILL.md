---
name: mc-worldgen
description: configured/placed feature、biome modifier。触发词：worldgen、placed_feature
platform: fabric
version: "1.17.1"
dependencies: []
mappings: yarn
---

# 世界生成（Fabric 1.17.1）

loader-api：`addFeature` 仍是 **ConfiguredFeature** 的 `RegistryKey`（与 1.16.5 同形）。Yarn。

```java
BiomeModifications.addFeature(
    BiomeSelectors.foundInOverworld(),
    GenerationStep.Feature.VEGETAL_DECORATION,
    MY_CONFIGURED_FEATURE
);
```

已核：`addFeature` / `addStructure` / `addCarver(3 参含 GenerationStep.Carver)` / `addSpawn(..., SpawnGroup, ...)` / `create(Identifier)`。

## Decision Flow

```
IF 1.18+ 写法
  → 不要：本档还不是 PlacedFeature
IF 生物
  → addSpawn
```

## 常见错误

- ❌ `PlacedFeature` 当 addFeature 第三参
- ❌ 26.1.2 Mojmap 名
