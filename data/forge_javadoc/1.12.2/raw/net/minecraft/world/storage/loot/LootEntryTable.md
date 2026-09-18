---
title: "LootEntryTable"
description: "public class LootEntryTable extends LootEntry"
package: "net/minecraft/world/storage/loot"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/world/storage/loot/LootEntryTable.html"
sourceType: javadoc
---

# LootEntryTable

## Class signature

```java
public class LootEntryTable extends LootEntry
```

## Constructors

- `public LootEntryTable( ResourceLocation tableIn, int weightIn, int qualityIn, LootCondition [] conditionsIn, java.lang.String entryName)`

## Methods

- `public void addLoot(java.util.Collection< ItemStack > stacks, java.util.Random rand, LootContext context)`
- `protected void serialize(JsonObject json, JsonSerializationContext context)`
- `public static LootEntryTable deserialize(JsonObject object, JsonDeserializationContext deserializationContext, int weightIn, int qualityIn, LootCondition [] conditionsIn)`
