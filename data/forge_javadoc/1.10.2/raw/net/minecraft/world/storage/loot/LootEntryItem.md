---
title: "LootEntryItem"
description: "public class LootEntryItem extends LootEntry"
package: "net/minecraft/world/storage/loot"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/world/storage/loot/LootEntryItem.html"
sourceType: javadoc
---

# LootEntryItem

**Inheritance:** java.lang.Object → net.minecraft.world.storage.loot.LootEntry → net.minecraft.world.storage.loot.LootEntryItem

## Class signature

```java
public class LootEntryItem extends LootEntry
```

## Constructors

- `LootEntryItem(Item itemIn, int weightIn, int qualityIn, LootFunction [] functionsIn, LootCondition [] conditionsIn, java.lang.String entryName)`

## Methods

- `void addLoot(java.util.Collection<ItemStack> stacks, java.util.Random rand, LootContext context)`
- `static LootEntryItem deserialize(com.google.gson.JsonObject object, com.google.gson.JsonDeserializationContext deserializationContext, int weightIn, int qualityIn, LootCondition [] conditionsIn)`
- `protected void serialize(com.google.gson.JsonObject json, com.google.gson.JsonSerializationContext context)`

## Fields

- `protected LootFunction [] functions`
- `protected Item item`
