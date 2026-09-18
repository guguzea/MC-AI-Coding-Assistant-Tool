---
title: "LootEntryEmpty"
description: "public class LootEntryEmpty extends LootEntry"
package: "net/minecraft/world/storage/loot"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/world/storage/loot/LootEntryEmpty.html"
sourceType: javadoc
---

# LootEntryEmpty

## Class signature

```java
public class LootEntryEmpty extends LootEntry
```

## Constructors

- `public LootEntryEmpty(int weightIn, int qualityIn, LootCondition [] conditionsIn, java.lang.String entryName)`

## Methods

- `public void addLoot(java.util.Collection< ItemStack > stacks, java.util.Random rand, LootContext context)`
- `protected void serialize(JsonObject json, JsonSerializationContext context)`
- `public static LootEntryEmpty deserialize(JsonObject object, JsonDeserializationContext deserializationContext, int weightIn, int qualityIn, LootCondition [] conditionsIn)`
