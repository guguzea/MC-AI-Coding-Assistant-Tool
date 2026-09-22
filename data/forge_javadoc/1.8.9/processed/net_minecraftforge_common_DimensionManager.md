# DimensionManager

**Inheritance:** java.lang.Object → net.minecraftforge.common.DimensionManager

## Class signature

```java
public class DimensionManager extends java.lang.Object
```

## Constructors

- `DimensionManager()`

## Methods

- `static WorldProvider createProviderFor(int dim)`
- `static java.io.File getCurrentSaveRootDirectory()` — Return the current root directory for the world save.
- `static java.lang.Integer[] getIDs()`
- `static java.lang.Integer[] getIDs(boolean check)`
- `static int getNextFreeDimId()` — Return the next free dimension ID.
- `static WorldProvider getProvider(int dim)`
- `static int getProviderType(int dim)`
- `static java.lang.Integer[] getStaticDimensionIDs()` — Not public API: used internally to get dimensions that should load at server startup
- `static WorldServer getWorld(int id)`
- `static WorldServer [] getWorlds()`
- `static void init()`
- `static void initDimension(int dim)`
- `static boolean isDimensionRegistered(int dim)`
- `static void loadDimensionDataMap(NBTTagCompound compoundTag)`
- `static void registerDimension(int id, int providerType)`
- `static boolean registerProviderType(int id, java.lang.Class<? extends WorldProvider> provider, boolean keepLoaded)`
- `static NBTTagCompound saveDimensionDataMap()`
- `static void setWorld(int id, WorldServer world)`
- `static boolean shouldLoadSpawn(int dim)`
- `static void unloadWorld(int id)`
- `static void unloadWorlds(java.util.Hashtable<java.lang.Integer, long[]> worldTickTimes)`
- `static void unregisterDimension(int id)` — For unregistering a dimension when the save is changed (disconnected from a server or loaded a new save
- `static int[] unregisterProviderType(int id)` — Unregisters a Provider type, and returns a array of all dimensions that are registered to this provider type.