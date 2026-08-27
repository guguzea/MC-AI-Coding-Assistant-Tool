---
name: mc-loottable
description: 战利品表 JSON 与 LootTableProvider。触发词：loot_table、pools
platform: fabric
version: "1.14.4"
dependencies: []
mappings: yarn
---

# 战利品表（Fabric 1.14.4）

- JSON：`data/<modid>/loot_tables/...`
- 改原版表：`net.fabricmc.fabric.api.loot.v1.event.LootTableLoadingCallback`（loader-api 已核）

```java
LootTableLoadingCallback.EVENT.register((resourceManager, manager, id, supplier, setter) -> {
    // Identifier id；FabricLootSupplierBuilder supplier
});
```

不要用 1.18+ 的 `LootTableEvents`（loot.v2/v3）。

## Decision Flow

```
IF 自定义方块掉落
  → 数据包 JSON
IF 改原版表
  → LootTableLoadingCallback
```

## 常见错误

- ❌ `LootTableEvents.MODIFY`（邻版 v2/v3）
