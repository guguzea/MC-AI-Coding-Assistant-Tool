---
name: mc-worldgen
description: configured/placed feature、biome modifier。触发词：worldgen、placed_feature
platform: forge
version: "1.20.1"
dependencies: []
mappings: parchment
---

# mc-worldgen（1.20.1）

> 一手来源：本档 docs 语料 `data/forge_1.20.1/forge-docs/1.20.1/processed/datagen_server_datapackregistries.md`（Datapack Registry Object Generation 全页）；类名 `Biome` 经 `query_api`（version=1.20.1）核实存在。

## Decision Flow

```
→ 数据包注册表对象（biome 等）的代码生成 → DatapackBuiltinEntriesProvider + RegistrySetBuilder（语料专页）
→ 挂进 data gen → GatherDataEvent 里 addProvider(..., event.includeServer(), ...)（语料页示例原文，MOD 事件总线）
→ 数据包 JSON 直写路线 → data/<ns>/worldgen/（见 mc-datapack）
→ 引用群系 → Biome（query_api 已钉）
```

## 本档口径（已核实，出自语料专页）

- `DatapackBuiltinEntriesProvider` 是 Forge 对 `RegistriesDatapackGenerator` 的扩展，正确处理对既有数据包注册表对象的引用（语料原文）。
- 构造参数含 `event.getLookupProvider()` 与 `RegistrySetBuilder().add(...)`（语料示例代码）。
- provider 要加到 `DataGenerator` 且只在 **server data** 生成期跑（`event.includeServer()`，语料原文）。

## 反模式

- 在 client datagen 侧跑 datapack 注册表生成（includeServer 门槛）。
- 凭记忆写 RegistrySetBuilder 链（以语料页示例为准）。

## 下一步

- 语料全文：`get_doc_full`（datagen_server_datapackregistries）；数据面：mc-datapack；反模式库：`forge/1.20.1/knowledge/antipatterns/`。
