---
name: mc-loottable
description: 战利品表 JSON 与 LootTableProvider。触发词：loot_table、pools
platform: fabric
version: "1.21.11"
dependencies: []
mappings: yarn
---

# 战利品表（Fabric 1.21.11）

- JSON：`data/<modid>/loot_table/...`（1.21 路径是 loot_table 单数）
- 改原版表：`net.fabricmc.fabric.api.loot.v3.LootTableEvents`（loader-api 已核）

```java
LootTableEvents.MODIFY.register((key, tableBuilder, source, registries) -> {
    // RegistryKey<LootTable> key；LootTable.Builder；RegistryWrapper.WrapperLookup
});
```

## Decision Flow

```
IF 自定义掉落
  → 数据包 JSON 或 FabricBlockLootTableProvider
IF 改原版表
  → LootTableEvents.MODIFY（v3 四参）
```

## 常见错误

- ❌ v2 五参 `(resourceManager, lootManager, id, ...)`
- ❌ 26.1.2 Mojmap `ResourceKey` / `HolderLookup.Provider` 当本档 Yarn 必写名（本档 Yarn 用 `RegistryKey` / `RegistryWrapper.WrapperLookup`）
