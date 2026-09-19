---
name: mc-worldgen
description: configured/placed feature、biome modifier。触发词：worldgen、placed_feature
platform: forge
version: "1.17.1"
dependencies: []
mappings: official
---

# mc-worldgen（1.17.1）

> 一手来源：类名 `Biome` 经 `query_api`（version=1.17.1）核实存在；本档 `knowledge/common/datapack-format.md` 目录树含 `dimension/` 数据目录。

## Decision Flow

```
→ 新增群系/结构 → 1.16 起 worldgen 数据包化（1.16.5 primer 的一手改版记载同样适用本代；本档语料无专页）
→ Biome 相关类 → Biome（query_api 已钉）
→ 数据包 worldgen 目录 → 见本档 mc-datapack（dimension/ 等）
→ 注册与生命周期 → mc-registry、01-registry.mdc
```

## 本档口径（已核实）

- `Biome` 在本档存在（query_api found）。
- worldgen 数据包目录形态在本档 datapack 速查目录树中有 `dimension/`——数据包化路线延续 1.16。
- 1.16.5 的 `BiomeLoadingEvent` 一手记载对本代的适用性本档语料未逐字核实——用前先查本档语料/源码。

## 反模式

- 凭记忆写 feature/placed feature 注册链（本档无一手语料）。
- 把 1.12 代码面 worldgen 写法搬来。

## 下一步

- 类/方法核实：`query_api`（version=1.17.1）；数据面：mc-datapack；反模式库：`forge/1.17.1/knowledge/antipatterns/`。
