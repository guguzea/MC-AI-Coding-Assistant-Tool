---
name: mc-worldgen
description: configured/placed feature、biome modifier。触发词：worldgen、placed_feature
platform: forge
version: "1.15.2"
dependencies: []
mappings: mcp
---

# mc-worldgen（1.15.2）

> 一手来源：本档 docs 语料 `data/forge_1.15.2/forge-docs/1.15.2/processed/concepts_registries.md:115`（长行代码例逐字含 `public static final Biome ice_flat = null;`）。类名 `Biome` 另经 1.14.4 同版线 primer 佐证体系（1.15.2 语料无 primer 页）。

## Decision Flow

```
→ Biome 相关类 → Biome（本档语料代码例逐字在档）
→ 生成体系 → 代码面为主；数据包 worldgen JSON（data/<ns>/worldgen/）1.16 起才有，本版不存在
→ 注册与生命周期 → mc-registry、01-registry.mdc
```

## 本档口径（已核实）

- `Biome` 类名在 concepts_registries:115 逐字在档。
- 本档 docs 语料（40 页）无 worldgen 专页、无 primer——feature/生成器机制写前先 `get_doc_full` 核实。

## 反模式

- 把 1.16+ 的 worldgen 数据包 JSON 写进 1.15.2。
- 凭记忆写 BiomeProvider/Feature 类链（本档无一手来源）。

## 下一步

- 语料全文：`get_doc_full`（concepts_registries，version=1.15.2）；反模式库：`forge/1.15.2/knowledge/antipatterns/`。
