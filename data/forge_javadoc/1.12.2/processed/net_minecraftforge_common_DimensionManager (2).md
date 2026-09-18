# DimensionManager

## Class signature

```java
public class DimensionManager extends java.lang.Object
```

## Constructors

- `public DimensionManager()`

## Methods

- `public static int[] getDimensions( DimensionType type)`
- `public static java.util.Map< DimensionType ,IntSortedSet> getRegisteredDimensions()`
- `public static void init()`
- `public static void registerDimension(int id, DimensionType type)`
- `public static void unregisterDimension(int id)`
- `public static boolean isDimensionRegistered(int dim)`
- `public static DimensionType getProviderType(int dim)`
- `public static WorldProvider getProvider(int dim)`
- `public static java.lang.Integer[] getIDs(boolean check)`
- `public static java.lang.Integer[] getIDs()`
- `public static void setWorld(int id, WorldServer world, MinecraftServer server)`
- `public static void initDimension(int dim)`
- `public static WorldServer getWorld(int id)`
- `public static WorldServer getWorld(int id, boolean resetUnloadDelay)`
- `public static WorldServer [] getWorlds()`
- `public static java.lang.Integer[] getStaticDimensionIDs()`
- `public static WorldProvider createProviderFor(int dim)`
- `public static boolean keepDimensionLoaded(int dim, boolean keep)`
- `public static void unloadWorld(int id)`
- `public static boolean isWorldQueuedToUnload(int id)`
- `public static void unloadWorlds(java.util.Hashtable<java.lang.Integer,long[]> worldTickTimes)`
- `public static int getNextFreeDimId()`
- `public static NBTTagCompound saveDimensionDataMap()`
- `public static void loadDimensionDataMap( NBTTagCompound compoundTag)`
- `public static java.io.File getCurrentSaveRootDirectory()`

## Description

Return the current root directory for the world save.