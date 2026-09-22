---
title: "LootFunctionManager"
description: "public class LootFunctionManager extends java.lang.Object"
package: "net/minecraft/world/storage/loot/functions"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/world/storage/loot/functions/LootFunctionManager.html"
sourceType: javadoc
---

# LootFunctionManager

**Inheritance:** java.lang.Object → net.minecraft.world.storage.loot.functions.LootFunctionManager

## Class signature

```java
public class LootFunctionManager extends java.lang.Object
```

## Constructors

- `LootFunctionManager()`

## Methods

- `static<T extends LootFunction> LootFunction.Serializer<T> getSerializerFor(T functionClass)`
- `static LootFunction.Serializer<?> getSerializerForName(ResourceLocation location)`
- `static<T extends LootFunction> void registerFunction(LootFunction.Serializer<? extends T> serializer)`
