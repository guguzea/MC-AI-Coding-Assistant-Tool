---
title: "LootConditionManager"
description: "public class LootConditionManager extends java.lang.Object"
package: "net/minecraft/world/storage/loot/conditions"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/world/storage/loot/conditions/LootConditionManager.html"
sourceType: javadoc
---

# LootConditionManager

**Inheritance:** java.lang.Object → net.minecraft.world.storage.loot.conditions.LootConditionManager

## Class signature

```java
public class LootConditionManager extends java.lang.Object
```

## Constructors

- `LootConditionManager()`

## Methods

- `static<T extends LootCondition> LootCondition.Serializer<T> getSerializerFor(T conditionClass)`
- `static LootCondition.Serializer<?> getSerializerForName(ResourceLocation location)`
- `static<T extends LootCondition> void registerCondition(LootCondition.Serializer<? extends T> condition)`
- `static boolean testAllConditions(java.lang.Iterable<LootCondition> conditions, java.util.Random rand, LootContext context)`
- `static boolean testAllConditions(LootCondition [] conditions, java.util.Random rand, LootContext context)`
