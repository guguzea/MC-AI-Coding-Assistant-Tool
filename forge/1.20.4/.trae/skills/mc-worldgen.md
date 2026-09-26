---
name: mc-worldgen
description: configured/placed feature、biome modifier。触发词：worldgen、placed_feature
platform: forge
version: "1.20.4"
dependencies: []
mappings: parchment
---

# mc-worldgen（1.20.4）

> 一手来源：本档 docs 语料 `datagen_server_datapackregistries.md`（与 1.20.1 同版线专页：DatapackBuiltinEntriesProvider + RegistrySetBuilder）；类名 `Biome` 经 `query_api`（version=1.20.4）核实存在。

## Decision Flow

```
→ 数据包注册表对象（biome 等）的代码生成 → DatapackBuiltinEntriesProvider + RegistrySetBuilder（语料专页）
→ 挂进 data gen → GatherDataEvent 里 addProvider(..., event.includeServer(), ...)（语料示例，MOD 事件总线）
→ 数据包 JSON 直写路线 → data/<ns>/worldgen/（见 mc-datapack）
→ 引用群系 → Biome（query_api 已钉）
```

## 本档口径（已核实）

- DatapackBuiltinEntriesProvider / RegistrySetBuilder 生成路线在本档语料专页有示例（1.20.1 全页引文同线适用，本档同页在档）。
- `Biome` 在本档存在（query_api found）。

## 反模式

- 在 client datagen 侧跑 datapack 注册表生成。
- 凭记忆写 RegistrySetBuilder 链。

## 下一步

- 语料全文：`get_doc_full`（datagen_server_datapackregistries）；数据面：mc-datapack；反模式库：`forge/1.20.4/knowledge/antipatterns/`。
