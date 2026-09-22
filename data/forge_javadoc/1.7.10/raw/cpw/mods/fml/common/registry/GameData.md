---
title: "GameData"
description: "public class GameData extends java.lang.Object"
package: "cpw/mods/fml/common/registry"
version: "1.7.10"
forgeBuild: "10.13.4.1614"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/cpw/mods/fml/common/registry/GameData.html"
sourceType: javadoc
---

# GameData

**Inheritance:** java.lang.Object → cpw.mods.fml.common.registry.GameData

## Class signature

```java
public class GameData extends java.lang.Object
```

## Methods

- `static GameData.GameDataSnapshot buildItemDataList()`
- `static void dumpRegistry(java.io.File minecraftDir)`
- `@Deprecated static ModContainer findModOwner(java.lang.String string)` — Deprecated. no replacement planned
- `static void fixBrokenIds(java.util.Map<java.lang.String, java.lang.Integer> dataList, java.util.Set<java.lang.Integer> blockedIds)` — Fix IDs improperly allocated by early versions of the registry, best-effort.
- `static void freezeData()`
- `static int[] getBlockedIds()`
- `static FMLControlledNamespacedRegistry<Block> getBlockRegistry()` — Get the currently active block registry.
- `static FMLControlledNamespacedRegistry<Item> getItemRegistry()` — Get the currently active item registry.
- `protected static GameData getMain()`
- `static java.util.List<java.lang.String> injectWorldIDMap(java.util.Map<java.lang.String, java.lang.Integer> dataList, java.util.Set<java.lang.Integer> blockedIds, java.util.Map<java.lang.String, java.lang.String> blockAliases, java.util.Map<java.lang.String, java.lang.String> itemAliases, java.util.Set<java.lang.String> blockSubstitutions, java.util.Set<java.lang.String> itemSubstitutions, boolean injectFrozenData, boolean isLocalWorld)`
- `static java.util.List<java.lang.String> injectWorldIDMap(java.util.Map<java.lang.String, java.lang.Integer> dataList, java.util.Set<java.lang.String> blockSubstitutions, java.util.Set<java.lang.String> itemSubstitutions, boolean injectFrozenData, boolean isLocalWorld)`
- `protected static boolean isFrozen(FMLControlledNamespacedRegistry<?> registry)`
- `static java.util.List<java.lang.String> processIdRematches(java.lang.Iterable<FMLMissingMappingsEvent.MissingMapping> missedMappings, boolean isLocalWorld, GameData gameData, java.util.Map<java.lang.String, java.lang.Integer[]> remaps)`
- `static void revertToFrozen()`

## Fields

- `static FMLControlledNamespacedRegistry<Block> blockRegistry` — Deprecated. use getBlockRegistry() instead.
- `static FMLControlledNamespacedRegistry<Item> itemRegistry` — Deprecated. use getItemRegistry() instead.
