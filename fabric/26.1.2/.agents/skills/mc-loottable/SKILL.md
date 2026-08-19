---
name: mc-loottable
description: Fabric 26.1.2 战利品。LootTableEvents（loot-api-v3）、数据包 loot_table JSON。触发词：loot、LootTableEvents
platform: fabric
version: "26.1.2"
dependencies: []
mappings: official
---

# 战利品表（Fabric 26.1.2）

- 数据包 JSON：`data/<modid>/loot_table/...`
- 改原版表：`LootTableEvents`（`net.fabricmc.fabric.api.loot.v3`，与 `05-events.mdc` 一致）
- DataGen：`26.1.2/develop_data-generation_setup` 下一页 Loot Tables；掉落代码见 `mc-datagen` 的 `FabricBlockLootSubProvider`

```java
LootTableEvents.MODIFY.register((key, tableBuilder, source, registries) -> {
    // ResourceKey<LootTable> key
    // LootTable.Builder tableBuilder
    // LootTableSource source
    // HolderLookup.Provider registries
});
```

签名来自 loader-api `LootTableEvents$Modify.modifyLootTable`。不要 `LootTableLoadingCallback`（loot.v1）。

## Decision Flow

```
IF 自定义方块掉落
  → 数据包 JSON 或 FabricBlockLootSubProvider.generate + dropSelf
IF 往原版表加物品
  → LootTableEvents.MODIFY（events 页）
IF 整表替换
  → LootTableEvents.REPLACE（先核 loader-api，不要猜参数）
```

## 常见错误

- ❌ `LootTableLoadingCallback`（邻版 v1）
- ❌ Yarn 战利品 API 包名

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-datagen` | FabricBlockLootSubProvider |
| `mc-block` | 方块 loot_table 路径 |
