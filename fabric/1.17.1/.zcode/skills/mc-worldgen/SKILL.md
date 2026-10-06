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
// MY_CONFIGURED_FEATURE：示例名（本件自造，非 Fabric API 符号）= 指向数据包 configured_feature JSON 的 RegistryKey<ConfiguredFeature<?, ?>>
public static final RegistryKey<ConfiguredFeature<?, ?>> MY_CONFIGURED_FEATURE = // 示例名，本件自造，没有任何 MC 符号叫 MY_CONFIGURED_FEATURE
    RegistryKey.of(Registry.CONFIGURED_FEATURE_KEY, new Identifier(MOD_ID, "my_feature"));

BiomeModifications.addFeature(
    BiomeSelectors.foundInOverworld(),
    GenerationStep.Feature.VEGETAL_DECORATION,
    MY_CONFIGURED_FEATURE  // 示例名，本件自造，没有任何 MC 符号叫 MY_CONFIGURED_FEATURE
);
```

已核：`addFeature` / `addStructure` / `addCarver(3 参含 GenerationStep.Carver)` / `addSpawn(..., SpawnGroup, ...)` / `create(Identifier)`。

## Decision Flow

```
IF 1.18+ 写法
→ 不得用 PlacedFeature：本档还没有（那是 1.18+ 别的版本的名字）
IF 生物
  → addSpawn
```

## 常见错误

- ❌ `PlacedFeature` 当 addFeature 第三参
- ❌ 26.1.2 Mojmap 名
