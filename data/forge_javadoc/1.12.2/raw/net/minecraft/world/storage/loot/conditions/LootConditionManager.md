---
title: "LootConditionManager"
description: "public class LootConditionManager extends java.lang.Object"
package: "net/minecraft/world/storage/loot/conditions"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/world/storage/loot/conditions/LootConditionManager.html"
sourceType: javadoc
---

# LootConditionManager

## Class signature

```java
public class LootConditionManager extends java.lang.Object
```

## Constructors

- `public LootConditionManager()`

## Methods

- `public static <T extends LootCondition > void registerCondition( LootCondition.Serializer <? extends T> condition)`
- `public static boolean testAllConditions(java.lang.Iterable< LootCondition > conditions, java.util.Random rand, LootContext context)`
- `public static boolean testAllConditions( LootCondition [] conditions, java.util.Random rand, LootContext context)`
- `public static LootCondition.Serializer <?> getSerializerForName( ResourceLocation location)`
- `public static <T extends LootCondition > LootCondition.Serializer <T> getSerializerFor(T conditionClass)`
