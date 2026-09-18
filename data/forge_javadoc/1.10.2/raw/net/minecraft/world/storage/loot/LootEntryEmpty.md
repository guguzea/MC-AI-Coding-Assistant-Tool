---
title: "LootEntryEmpty"
description: "public class LootEntryEmpty extends LootEntry"
package: "net/minecraft/world/storage/loot"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/world/storage/loot/LootEntryEmpty.html"
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
- `protected void serialize(com.google.gson.JsonObject json, com.google.gson.JsonSerializationContext context)`
- `public static LootEntryEmpty deserialize(com.google.gson.JsonObject object, com.google.gson.JsonDeserializationContext deserializationContext, int weightIn, int qualityIn, LootCondition [] conditionsIn)`
