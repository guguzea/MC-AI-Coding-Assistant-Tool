---
title: "LootTable"
description: "public class LootTable extends java.lang.Object"
package: "net/minecraft/world/storage/loot"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/world/storage/loot/LootTable.html"
sourceType: javadoc
---

# LootTable

**Inheritance:** java.lang.Object → net.minecraft.world.storage.loot.LootTable

## Class signature

```java
public class LootTable extends java.lang.Object
```

## Constructors

- `LootTable(LootPool [] poolsIn)`

## Methods

- `void addPool(LootPool pool)`
- `void fillInventory(IInventory inventory, java.util.Random rand, LootContext context)`
- `void freeze()`
- `java.util.List<ItemStack> generateLootForPools(java.util.Random rand, LootContext context)`
- `LootPool getPool(java.lang.String name)`
- `boolean isFrozen()`
- `LootPool removePool(java.lang.String name)`

## Fields

- `static LootTable EMPTY_LOOT_TABLE`
