---
name: mc-worldgen
description: configured/placed feature、biome modifier。触发词：worldgen、placed_feature
platform: forge
version: "1.14.4"
dependencies: []
mappings: mcp
---

# mc-worldgen（1.14.4）

> 一手来源：本档 docs 语料 `data/forge_1.14.4/forge-docs/1.14.4/processed/primer_1_14.md:295/302`（原文「Biome ids are internally ints now instead of bytes…」「More things are stored in registries now: Entities, BiomeProviders, ChunkGenerators, ParticleTypes, Stats, Paintings」）+ `concepts_registries.md:84`（代码例逐字 `public static final Biome ice_flat = null;`）。

## Decision Flow

```
→ Biome 相关类 → Biome（本档语料代码例逐字在档）
→ 生成体系 → 1.14 起 BiomeProviders / ChunkGenerators 也进注册表体系（primer:302 原文）
→ 数据包 worldgen JSON → 本版不存在（data/<ns>/worldgen/ 是 1.16 起形态，见 mc-datapack）
→ 注册与生命周期 → mc-registry、01-registry.mdc
```

## 本档口径（已核实，均出自本档语料）

- `Biome` 类名在 concepts_registries:84 逐字在档。
- Biome id 内部从 byte 改 int，群系数量上限 255 → 20 亿（primer:295 原文）。
- BiomeProviders / ChunkGenerators 在 1.14 进入注册表存储（primer:302 原文）——写生成器前先按注册表规则核实。

## 反模式

- 假设 Biome id 还是 byte 上限（primer 明载已改 int）。
- 把 1.16+ 的 `data/<modid>/worldgen/` JSON 写进 1.14.4。

## 下一步

- 语料全文：`get_doc_full`（primer_1_14 / concepts_registries，version=1.14.4）；反模式库：`forge/1.14.4/knowledge/antipatterns/`。
