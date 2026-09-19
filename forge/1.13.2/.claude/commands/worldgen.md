---
name: mc-worldgen
description: configured/placed feature、biome modifier。触发词：worldgen、placed_feature
platform: forge
version: "1.13.2"
dependencies: []
mappings: mcp
---

# mc-worldgen（1.13.2）

> 一手来源：类名 `Biome` 经 `query_api`（version=1.13.2）核实存在。worldgen 数据包目录（`data/<ns>/worldgen/`）是 1.16 起形态，本档 datapack 速查的目录树里没有它。

## Decision Flow

```
→ 修改生物群系/生成物 → 1.13.2 仍以代码面为主（worldgen JSON 目录 1.16 起才有）
→ Biome 相关类 → Biome（query_api 已钉）
→ 数据包 worldgen JSON → 本版不存在（见 mc-datapack 的目录树佐证）
→ 注册与生命周期 → mc-registry、01-registry.mdc
```

## 本档口径（已核实）

- `Biome` 在本档存在（query_api found）。
- 本档 `knowledge/common/datapack-format.md` 目录树只有 recipes/loot_tables——**没有** worldgen 目录，这是「worldgen 数据包化始于 1.16」的档内佐证。

## 反模式

- 把 `data/<modid>/worldgen/biome/` JSON 写进 1.13.2 工程（本版不支持）。
- 凭记忆写生成器类链。

## 下一步

- 类/方法核实：`query_api`（version=1.13.2）；反模式库：`forge/1.13.2/knowledge/antipatterns/`。
