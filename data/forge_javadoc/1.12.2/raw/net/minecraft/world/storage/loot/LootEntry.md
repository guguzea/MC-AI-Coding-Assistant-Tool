---
title: "LootEntry"
description: "public abstract class LootEntry extends java.lang.Object"
package: "net/minecraft/world/storage/loot"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/world/storage/loot/LootEntry.html"
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
- `protected abstract void serialize(JsonObject json, JsonSerializationContext context)`
