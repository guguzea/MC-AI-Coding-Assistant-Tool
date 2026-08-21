---
name: mc-worldgen
description: Fabric 26.1.2 生物群系修改。BiomeModifications、BiomeSelectors、PlacedFeature。触发词：worldgen、BiomeModifications、placed feature
platform: fabric
version: "26.1.2"
dependencies: []
mappings: official
---

# 世界生成（Fabric 26.1.2）

官方 develop 树**没有**单独 worldgen 教程页。下列签名来自本版 **loader-api** `net.fabricmc.fabric.api.biome.v1`。配置/放置特征 JSON 仍走数据包。

## 快速开始

```java
BiomeModifications.addFeature(
    BiomeSelectors.foundInOverworld(),
    GenerationStep.Decoration.VEGETAL_DECORATION,
    MY_PLACED_FEATURE
);
```

已核方法：

| API | 作用 |
|-----|------|
| `BiomeModifications.addFeature(Predicate, GenerationStep.Decoration, ResourceKey<PlacedFeature>)` | 往群系加 placed feature |
| `BiomeModifications.addCarver(Predicate, ResourceKey<ConfiguredWorldCarver<?>>)` | 加洞穴雕刻器 |
| `BiomeModifications.addSpawn(Predicate, MobCategory, EntityType<?>, weight, min, max)` | 加生成 |
| `BiomeModifications.create(Identifier)` | 返回 `BiomeModification` 做更复杂修改 |
| `BiomeSelectors.foundInOverworld()` / `foundInTheNether()` / `foundInTheEnd()` / `vanilla()` / `all()` / `tag(TagKey<Biome>)` | 选择器 |

`MY_PLACED_FEATURE` 是数据包里注册的 `ResourceKey<PlacedFeature>`，不要在 Java 里 `ConfiguredFeatures.register`（那是旧写法）。

## Decision Flow

```
IF 只把已有 placed feature 塞进原版群系
  → BiomeModifications.addFeature + BiomeSelectors
IF 自定义树/矿脉结构
  → 数据包 configured_feature / placed_feature JSON，再 addFeature
IF 生物生成
  → addSpawn + MobCategory（Mojmap，不要 Yarn SpawnGroup）
IF 文档页要逐步教程
  → search_fabric_docs version=26.1.2；核不到就停，不要抄 1.16 wiki
```

## 常见错误

- ❌ Yarn `GenerationStep.Feature` / `RegistryKey` / `SpawnGroup` 抄进本档
- ❌ Forge `BiomeLoadingEvent`
- ❌ 在 addFeature 里传入 ConfiguredFeature 而不是 `ResourceKey<PlacedFeature>`

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-datapack` | placed_feature JSON |
| `mc-entity` | addSpawn |
| `mc-registry` | ResourceKey 的命名空间 |
