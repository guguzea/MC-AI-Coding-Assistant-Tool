---
title: "LootFunctionManager"
description: "public class LootFunctionManager extends java.lang.Object"
package: "net/minecraft/world/storage/loot/functions"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/world/storage/loot/functions/LootFunctionManager.html"
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

- `public static <T extends LootFunction > void registerFunction( LootFunction.Serializer <? extends T> p_186582_0_)`
- `public static LootFunction.Serializer <?> getSerializerForName( ResourceLocation location)`
- `public static <T extends LootFunction > LootFunction.Serializer <T> getSerializerFor(T functionClass)`
