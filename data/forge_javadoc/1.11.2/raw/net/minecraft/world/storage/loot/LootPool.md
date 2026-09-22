---
title: "LootPool"
description: "public class LootPool extends java.lang.Object"
package: "net/minecraft/world/storage/loot"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/world/storage/loot/LootPool.html"
sourceType: javadoc
---

# LootPool

**Inheritance:** java.lang.Object → net.minecraft.world.storage.loot.LootPool

## Class signature

```java
public class LootPool extends java.lang.Object
```

## Constructors

- `LootPool(LootEntry [] lootEntriesIn, LootCondition [] poolConditionsIn, RandomValueRange rollsIn, RandomValueRange bonusRollsIn, java.lang.String name)`

## Methods

- `void addEntry(LootEntry entry)`
- `protected void createLootRoll(java.util.Collection<ItemStack> stacks, java.util.Random rand, LootContext context)`
- `void freeze()`
- `void generateLoot(java.util.Collection<ItemStack> stacks, java.util.Random rand, LootContext context)`
- `RandomValueRange getBonusRolls()`
- `LootEntry getEntry(java.lang.String name)`
- `java.lang.String getName()`
- `RandomValueRange getRolls()`
- `boolean isFrozen()`
- `LootEntry removeEntry(java.lang.String name)`
- `void setBonusRolls(RandomValueRange v)`
- `void setRolls(RandomValueRange v)`
