---
title: "DimensionManager"
description: "Return the current root directory for the world save."
package: "net/minecraftforge/common"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/common/DimensionManager.html"
sourceType: javadoc
---

# DimensionManager

## Class signature

```java
public class DimensionManager extends java.lang.Object
```

## Constructors

- `public DimensionManager()`

## Methods

- `public static boolean registerProviderType(int id, java.lang.Class<? extends WorldProvider > provider, boolean keepLoaded)`
- `public static int[] unregisterProviderType(int id)`
- `public static void init()`
- `public static void registerDimension(int id, int providerType)`
- `public static void unregisterDimension(int id)`
- `public static boolean isDimensionRegistered(int dim)`
- `public static int getProviderType(int dim)`
- `public static WorldProvider getProvider(int dim)`
- `public static java.lang.Integer[] getIDs(boolean check)`
- `public static java.lang.Integer[] getIDs()`
- `public static void setWorld(int id, WorldServer world)`
- `public static void initDimension(int dim)`
- `public static WorldServer getWorld(int id)`
- `public static WorldServer [] getWorlds()`
- `public static boolean shouldLoadSpawn(int dim)`
- `public static java.lang.Integer[] getStaticDimensionIDs()`
- `public static WorldProvider createProviderFor(int dim)`
- `public static void unloadWorld(int id)`
- `public static void unloadWorlds(java.util.Hashtable<java.lang.Integer,long[]> worldTickTimes)`
- `public static int getNextFreeDimId()`
- `public static NBTTagCompound saveDimensionDataMap()`
- `public static void loadDimensionDataMap( NBTTagCompound compoundTag)`
- `public static java.io.File getCurrentSaveRootDirectory()`

## Description

Return the current root directory for the world save.
