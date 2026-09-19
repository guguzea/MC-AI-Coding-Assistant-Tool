---
name: mc-worldgen
description: configured/placed feature、biome modifier。触发词：worldgen、placed_feature
platform: forge
version: "1.12.2"
dependencies: []
mappings: mcp
---

# mc-worldgen（1.12.2）

> 一手来源：类名 `Biome` / `World` 经 `query_api`（version=1.12.2）核实存在（MCP 命名）。1.12.2 世界生成是**代码面**（没有 1.16+ 的 worldgen 数据包目录）；BiomeProvider 等生成器类名本档语料无专页，写前核实。

## Decision Flow

```
→ 修改生物群系/生成物 → 1.12.2 是代码面（无 worldgen JSON 目录）
→ Biome 相关类 → Biome（query_api 已钉）；生成器类名先核实再写
→ 数据包 worldgen JSON → 本版不存在（那是 1.16+ 形态，见 mc-datapack）
→ 注册与生命周期 → mc-registry、01-registry.mdc
```

## 本档口径（已核实）

- `Biome` / `World` 在本档存在（query_api found）。
- 本档语料无世界生成专页——不要把 1.16+ 的 `data/<modid>/worldgen/` JSON 或 `BiomeLoadingEvent` 写进 1.12.2 工程（那些机制本版不存在）。

## 反模式

- 把 1.16+ 的 worldgen 数据包形态写进 1.12.2。
- 凭记忆写 BiomeProvider/生成器链（本档无一手来源）。

## 下一步

- 类/方法核实：`query_api`（version=1.12.2）+ 反编译；反模式库：`forge/1.12.2/knowledge/antipatterns/`。
