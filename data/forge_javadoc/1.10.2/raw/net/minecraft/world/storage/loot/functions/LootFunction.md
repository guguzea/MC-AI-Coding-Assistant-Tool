---
title: "LootFunction"
description: "public abstract class LootFunction extends java.lang.Object"
package: "net/minecraft/world/storage/loot/functions"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/world/storage/loot/functions/LootFunction.html"
sourceType: javadoc
---

# LootFunction

**Inheritance:** java.lang.Object → net.minecraft.world.storage.loot.functions.LootFunction

## Class signature

```java
public abstract class LootFunction extends java.lang.Object
```

## Constructors

- `LootFunction(LootCondition [] conditionsIn)`

## Methods

- `abstract ItemStack apply(ItemStack stack, java.util.Random rand, LootContext context)`
- `LootCondition [] getConditions()`
