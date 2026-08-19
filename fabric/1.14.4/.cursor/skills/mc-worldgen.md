---
name: mc-worldgen
description: configured/placed feature、biome modifier。触发词：worldgen、placed_feature
platform: fabric
version: "1.14.4"
dependencies: []
mappings: yarn
---

# 世界生成（Fabric 1.14.4）

本档 **loader-api 未收录** `BiomeModifications`。不要抄 1.16+ `addFeature`。

自定义特征用数据包 JSON。核不到 Java API 就停，改口 `search_loader_api` / `search_fabric_docs version=1.14.4`。

## Decision Flow

```
IF 只改 JSON 世界生成
  → 数据包
IF 要往原版群系塞 feature
  → 本档没有 BiomeModifications；禁止编造
```
