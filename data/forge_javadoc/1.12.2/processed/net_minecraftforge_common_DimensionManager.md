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
- `static int[] getDimensions(DimensionType type)` — Returns a list of dimensions associated with this DimensionType.
- `static java.lang.Integer[] getIDs()`
- `static java.lang.Integer[] getIDs(boolean check)`
- `static int getNextFreeDimId()` — Return the next free dimension ID.
- `static WorldProvider getProvider(int dim)`
- `static DimensionType getProviderType(int dim)`
- `static java.util.Map<DimensionType, IntSortedSet> getRegisteredDimensions()`
- `static java.lang.Integer[] getStaticDimensionIDs()` — Not public API: used internally to get dimensions that should load at server startup
- `static WorldServer getWorld(int id)`
- `static WorldServer getWorld(int id, boolean resetUnloadDelay)`
- `static WorldServer [] getWorlds()`
- `static void init()`
- `static void initDimension(int dim)`
- `static boolean isDimensionRegistered(int dim)`
- `static boolean isWorldQueuedToUnload(int id)`
- `static boolean keepDimensionLoaded(int dim, boolean keep)` — Sets if a dimension should stay loaded.
- `static void loadDimensionDataMap(NBTTagCompound compoundTag)`
- `static void registerDimension(int id, DimensionType type)`
- `static NBTTagCompound saveDimensionDataMap()`
- `static void setWorld(int id, WorldServer world, MinecraftServer server)`
- `static void unloadWorld(int id)` — Queues a dimension to unload, if it can be unloaded.
- `static void unloadWorlds(java.util.Hashtable<java.lang.Integer, long[]> worldTickTimes)`
- `static void unregisterDimension(int id)` — For unregistering a dimension when the save is changed (disconnected from a server or loaded a new save