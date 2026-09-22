# SaveFormatOld

**Inheritance:** java.lang.Object → net.minecraft.world.storage.SaveFormatOld

## Class signature

```java
public class SaveFormatOld extends java.lang.Object implements ISaveFormat
```

## Constructors

- `SaveFormatOld(java.io.File p_i2147_1_)`

## Methods

- `boolean canLoadWorld(java.lang.String p_90033_1_)` — Return whether the given world can be loaded.
- `boolean convertMapFormat(java.lang.String filename, IProgressUpdate progressCallback)` — converts the map to mcRegion
- `protected static boolean deleteFiles(java.io.File[] files)`
- `boolean deleteWorldDirectory(java.lang.String p_75802_1_)`
- `void flushCache()`
- `boolean func_154334_a(java.lang.String saveName)`
- `boolean func_154335_d(java.lang.String p_154335_1_)`
- `java.lang.String getName()` — Returns the name of the save format.
- `java.util.List<SaveFormatComparator> getSaveList()`
- `ISaveHandler getSaveLoader(java.lang.String saveName, boolean storePlayerdata)` — Returns back a loader for the specified save directory
- `WorldInfo getWorldInfo(java.lang.String saveName)` — Returns the world's WorldInfo object
- `boolean isOldMapFormat(java.lang.String saveName)` — gets if the map is old chunk saving (true) or McRegion (false)
- `void renameWorld(java.lang.String dirName, java.lang.String newName)` — Renames the world by storing the new name in level.dat.

## Fields

- `java.io.File savesDirectory` — Reference to the File object representing the directory for the world saves