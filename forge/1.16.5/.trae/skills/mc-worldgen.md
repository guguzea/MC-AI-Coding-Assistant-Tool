---
name: mc-worldgen
description: configured/placed feature、biome modifier。触发词：worldgen、placed_feature
platform: forge
version: "1.16.5"
dependencies: []
mappings: mcp
---

# mc-worldgen（1.16.5）

> 一手来源：本档 docs 语料 `data/forge_1.16.5/forge-docs/1.16.5/processed/primer_1_16_5.md`（1.16 世界生成改版专页：Biome JSON、BiomeLoadingEvent、BiomeManager 等）+ 类名 `Biome` 经 `query_api` 核实。

## Decision Flow

```
→ 新增生物群系 → 数据包 JSON：data/<modid>/worldgen/biome/<name>.json（primer:162 原文）——Biome 注册表是 data-driven，不再走 Forge Registry（primer:160）
→ 向已有群系加 feature/structure → BiomeLoadingEvent（datapack 解析期、服务端启动前触发；primer:170-186）
→ 群系加入主世界 → BiomeManager#addAdditionalOverworldBiomes，在 FMLCommonSetupEvent 里 enqueueWork 调用保证线程安全（primer:211）
→ 引用群系 → 一律 RegistryKey<Biome>（RegistryKey.get(Registry.BIOME_REGISTRY, ...)，primer:188；ForgeRegistry 的 Biome 注册表不含数据包群系，getRegistryName 可能为 null——primer:248-255）
→ 注册与生命周期 → mc-registry、01-registry.mdc
```

## 本档口径（已核实，全部出自 primer_1_16_5）

- Biome 创建用 JSON（data-driven；代码造 Biome 仍可能但不推荐，primer:145-150）。
- BiomeLoadingEvent 期间加的代码侧对象**优先于**外部数据包（事件在数据包解析期触发，primer:198-204）。
- 1.15.2 的若干 Forge Biome hook（Edge/Hills/Nether/End/River）在 1.16 已移除（primer:269-278）。

## 反模式

- 用 ForgeRegistry 注册/查询 Biome（primer 明令；用 RegistryKey + DynamicRegistries）。
- 在 BiomeLoadingEvent 里读 SERVER 配置（事件早于配置初始化，primer:204）。

## 下一步

- 语料全文：`get_doc_full`（primer_1_16_5）；数据面目录：mc-datapack（worldgen/dimension/）；反模式库：`forge/1.16.5/knowledge/antipatterns/`。
