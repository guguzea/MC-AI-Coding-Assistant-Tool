---
title: "LootFunction"
description: "public abstract class LootFunction extends java.lang.Object"
package: "net/minecraft/world/storage/loot/functions"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/world/storage/loot/functions/LootFunction.html"
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
