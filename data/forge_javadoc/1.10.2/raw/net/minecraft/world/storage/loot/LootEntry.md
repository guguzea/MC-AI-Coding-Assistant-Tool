---
title: "LootEntry"
description: "public abstract class LootEntry extends java.lang.Object"
package: "net/minecraft/world/storage/loot"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/world/storage/loot/LootEntry.html"
sourceType: javadoc
---

# LootEntry

## Class signature

```java
public abstract class LootEntry extends java.lang.Object
```

## Constructors

- `protected LootEntry(int weightIn, int qualityIn, LootCondition [] conditionsIn, java.lang.String entryName)`

## Methods

- `public int getEffectiveWeight(float luck)`
- `public java.lang.String getEntryName()`
- `public abstract void addLoot(java.util.Collection< ItemStack > stacks, java.util.Random rand, LootContext context)`
- `protected abstract void serialize(com.google.gson.JsonObject json, com.google.gson.JsonSerializationContext context)`
