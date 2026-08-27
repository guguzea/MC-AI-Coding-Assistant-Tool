---
name: mc-loottable
description: 战利品表 JSON 与 LootTableProvider。触发词：loot_table、pools
platform: fabric
version: "1.18.2"
dependencies: []
mappings: yarn
---

# 战利品表（Fabric 1.18.2）

- JSON：`data/<modid>/loot_tables/...`
- 改原版表：`net.fabricmc.fabric.api.loot.v2.LootTableEvents`（loader-api 已核）

```java
LootTableEvents.MODIFY.register((resourceManager, lootManager, id, tableBuilder, source) -> {
    // Identifier id；LootTable.Builder tableBuilder
});
```

## Decision Flow

```
IF 自定义掉落
  → 数据包 JSON 或本档 DataGen loot provider
IF 改原版表
  → LootTableEvents.MODIFY（v2 五参）
```

## 常见错误

- ❌ `LootTableLoadingCallback`（v1）
- ❌ v3 的 `RegistryKey<LootTable>` 四参 lambda
