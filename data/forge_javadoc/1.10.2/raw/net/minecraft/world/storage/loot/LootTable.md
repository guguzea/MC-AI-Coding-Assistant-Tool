---
title: "LootTable"
description: "public class LootTable extends java.lang.Object"
package: "net/minecraft/world/storage/loot"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/world/storage/loot/LootTable.html"
sourceType: javadoc
---

# LootTable

## Class signature

```java
public class LootTable extends java.lang.Object
```

## Constructors

- `public LootTable( LootPool [] poolsIn)`

## Methods

- `public java.util.List< ItemStack > generateLootForPools(java.util.Random rand, LootContext context)`
- `public void fillInventory( IInventory inventory, java.util.Random rand, LootContext context)`
- `public void freeze()`
- `public boolean isFrozen()`
- `public LootPool getPool(java.lang.String name)`
- `public LootPool removePool(java.lang.String name)`
- `public void addPool( LootPool pool)`
