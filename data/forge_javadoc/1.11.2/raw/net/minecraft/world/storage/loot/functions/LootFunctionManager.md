---
title: "LootFunctionManager"
description: "public class LootFunctionManager extends java.lang.Object"
package: "net/minecraft/world/storage/loot/functions"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/world/storage/loot/functions/LootFunctionManager.html"
sourceType: javadoc
---

# LootFunctionManager

## Class signature

```java
public class LootFunctionManager extends java.lang.Object
```

## Constructors

- `public LootFunctionManager()`

## Methods

- `public static <T extends LootFunction > void registerFunction( LootFunction.Serializer <? extends T> serializer)`
- `public static LootFunction.Serializer <?> getSerializerForName( ResourceLocation location)`
- `public static <T extends LootFunction > LootFunction.Serializer <T> getSerializerFor(T functionClass)`
