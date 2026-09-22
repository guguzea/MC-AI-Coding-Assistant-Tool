---
title: "WorldSpecificSaveHandler"
description: "public class WorldSpecificSaveHandler extends java.lang.Object implements ISaveHandler"
package: "net/minecraftforge/common"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/common/WorldSpecificSaveHandler.html"
sourceType: javadoc
---

# WorldSpecificSaveHandler

**Inheritance:** java.lang.Object → net.minecraftforge.common.WorldSpecificSaveHandler

## Class signature

```java
public class WorldSpecificSaveHandler extends java.lang.Object implements ISaveHandler
```

## Constructors

- `WorldSpecificSaveHandler(WorldServer world, ISaveHandler parent)`

## Methods

- `void checkSessionLock()` — Checks the session lock to prevent save collisions
- `void flush()` — Called to flush all changes to disk, waiting for them to complete.
- `IChunkLoader getChunkLoader(WorldProvider var1)` — initializes and returns the chunk loader for the specified world provider
- `java.io.File getMapFileFromName(java.lang.String name)` — Gets the file location of the given map
- `IPlayerFileData getPlayerNBTManager()`
- `java.io.File getWorldDirectory()` — Gets the File object corresponding to the base directory of this world.
- `java.lang.String getWorldDirectoryName()` — Returns the name of the directory where world information is saved.
- `WorldInfo loadWorldInfo()` — Loads and returns the world info
- `void saveWorldInfo(WorldInfo var1)` — used to update level.dat from old format to MCRegion format
- `void saveWorldInfoWithPlayer(WorldInfo var1, NBTTagCompound var2)` — Saves the given World Info with the given NBTTagCompound as the Player.
