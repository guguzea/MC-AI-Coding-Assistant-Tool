---
name: mc-worldgen
description: configured/placed feature、biome modifier。触发词：worldgen、placed_feature
platform: forge
version: "1.19.4"
dependencies: []
mappings: mcp
---

# mc-worldgen（1.19.4）

> 一手来源：类名 `Biome` / `Level` 经 `query_api`（version=1.19.4）核实存在；本档 `knowledge/common/datapack-format.md` 目录树含 `dimension/` 数据目录。

## Decision Flow

```
→ 新增群系/结构 → worldgen 数据包路线（1.16 起形态；1.16.5 primer 是一手改版记载）
→ Biome 相关类 → Biome（query_api 已钉）
→ 数据包 worldgen 目录 → 见本档 mc-datapack（dimension/ 等）
→ 注册与生命周期 → mc-registry、01-registry.mdc
```

## 本档口径（已核实）

- `Biome` / `Level` 在本档存在（query_api found）。
- 本档语料（39 页）无 worldgen 专页——feature/biome modifier 机制写前先 `get_doc_full` 核实。

## 反模式

- 凭记忆写 feature/placed feature 注册链。
- 把 1.12 代码面 worldgen 写法搬来。

## 下一步

- 类/方法核实：`query_api`（version=1.19.4）；数据面：mc-datapack；反模式库：`forge/1.19.4/knowledge/antipatterns/`。
