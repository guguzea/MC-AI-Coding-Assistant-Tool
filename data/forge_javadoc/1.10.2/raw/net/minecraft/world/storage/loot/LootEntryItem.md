---
title: "LootEntryItem"
description: "public class LootEntryItem extends LootEntry"
package: "net/minecraft/world/storage/loot"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/world/storage/loot/LootEntryItem.html"
sourceType: javadoc
---

# LootEntryItem

## Class signature

```java
public class LootEntryItem extends LootEntry
```

## Constructors

- `public LootEntryItem( Item itemIn, int weightIn, int qualityIn, LootFunction [] functionsIn, LootCondition [] conditionsIn, java.lang.String entryName)`

## Methods

- `public void addLoot(java.util.Collection< ItemStack > stacks, java.util.Random rand, LootContext context)`
- `protected void serialize(com.google.gson.JsonObject json, com.google.gson.JsonSerializationContext context)`
- `public static LootEntryItem deserialize(com.google.gson.JsonObject object, com.google.gson.JsonDeserializationContext deserializationContext, int weightIn, int qualityIn, LootCondition [] conditionsIn)`
