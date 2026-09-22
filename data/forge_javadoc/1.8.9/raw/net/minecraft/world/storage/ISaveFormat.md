---
title: "ISaveFormat"
description: "public interface ISaveFormat"
package: "net/minecraft/world/storage"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/world/storage/ISaveFormat.html"
sourceType: javadoc
---

# ISaveFormat

## Class signature

```java
public interface ISaveFormat
```

## Methods

- `boolean canLoadWorld(java.lang.String p_90033_1_)` — Return whether the given world can be loaded.
- `boolean convertMapFormat(java.lang.String filename, IProgressUpdate progressCallback)` — converts the map to mcRegion
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
