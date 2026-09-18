---
title: "GameData"
description: "Deprecated. use getBlockRegistry() instead."
package: "cpw/mods/fml/common/registry"
version: "1.7.10"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/cpw/mods/fml/common/registry/GameData.html"
sourceType: javadoc
---

# GameData

## Class signature

```java
public class GameData extends java.lang.Object
```

## Methods

- `public static FMLControlledNamespacedRegistry < Block > getBlockRegistry()`
- `public static FMLControlledNamespacedRegistry < Item > getItemRegistry()`
- `@Deprecated public static ModContainer findModOwner(java.lang.String string)`
- `public static GameData.GameDataSnapshot buildItemDataList()`
- `public static int[] getBlockedIds()`
- `public static void dumpRegistry(java.io.File minecraftDir)`
- `public static void fixBrokenIds(java.util.Map<java.lang.String,java.lang.Integer> dataList, java.util.Set<java.lang.Integer> blockedIds)`
- `public static java.util.List<java.lang.String> injectWorldIDMap(java.util.Map<java.lang.String,java.lang.Integer> dataList, java.util.Set<java.lang.String> blockSubstitutions, java.util.Set<java.lang.String> itemSubstitutions, boolean injectFrozenData, boolean isLocalWorld)`
- `public static java.util.List<java.lang.String> injectWorldIDMap(java.util.Map<java.lang.String,java.lang.Integer> dataList, java.util.Set<java.lang.Integer> blockedIds, java.util.Map<java.lang.String,java.lang.String> blockAliases, java.util.Map<java.lang.String,java.lang.String> itemAliases, java.util.Set<java.lang.String> blockSubstitutions, java.util.Set<java.lang.String> itemSubstitutions, boolean injectFrozenData, boolean isLocalWorld)`
- `public static java.util.List<java.lang.String> processIdRematches(java.lang.Iterable< FMLMissingMappingsEvent.MissingMapping > missedMappings, boolean isLocalWorld, GameData gameData, java.util.Map<java.lang.String,java.lang.Integer[]> remaps)`
- `public static void freezeData()`
- `public static void revertToFrozen()`
- `protected static boolean isFrozen( FMLControlledNamespacedRegistry <?> registry)`
- `protected static GameData getMain()`

## Description

Deprecated. use getBlockRegistry() instead.
