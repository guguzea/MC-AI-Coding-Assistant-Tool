---
title: "LootEntry"
description: "public abstract class LootEntry extends java.lang.Object"
package: "net/minecraft/world/storage/loot"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/world/storage/loot/LootEntry.html"
sourceType: javadoc
---

# LootEntry

**Inheritance:** java.lang.Object → net.minecraft.world.storage.loot.LootEntry

## Class signature

```java
public abstract class LootEntry extends java.lang.Object
```

## Constructors

- `LootEntry(int weightIn, int qualityIn, LootCondition [] conditionsIn, java.lang.String entryName)`

## Methods

- `abstract void addLoot(java.util.Collection<ItemStack> stacks, java.util.Random rand, LootContext context)`
- `int getEffectiveWeight(float luck)`
- `java.lang.String getEntryName()`
- `protected abstract void serialize(JsonObject json, JsonSerializationContext context)`

## Fields

- `protected LootCondition [] conditions`
- `protected java.lang.String entryName`
- `protected int quality`
- `protected int weight`
