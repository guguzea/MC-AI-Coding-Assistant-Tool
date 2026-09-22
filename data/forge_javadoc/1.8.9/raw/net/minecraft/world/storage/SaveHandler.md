---
title: "SaveHandler"
description: "public class SaveHandler extends java.lang.Object implements ISaveHandler, IPlayerFileData"
package: "net/minecraft/world/storage"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/world/storage/SaveHandler.html"
sourceType: javadoc
---

# SaveHandler

**Inheritance:** java.lang.Object → net.minecraft.world.storage.SaveHandler

## Class signature

```java
public class SaveHandler extends java.lang.Object implements ISaveHandler, IPlayerFileData
```

## Constructors

- `SaveHandler(java.io.File savesDirectory, java.lang.String directoryName, boolean playersDirectoryIn)`

## Methods

- `void checkSessionLock()` — Checks the session lock to prevent save collisions
- `void flush()` — Called to flush all changes to disk, waiting for them to complete.
- `java.lang.String[] getAvailablePlayerDat()` — Returns an array of usernames for which player.dat exists for.
- `IChunkLoader getChunkLoader(WorldProvider provider)` — initializes and returns the chunk loader for the specified world provider
- `java.io.File getMapFileFromName(java.lang.String mapName)` — Gets the file location of the given map
- `NBTTagCompound getPlayerNBT(EntityPlayerMP player)`
- `IPlayerFileData getPlayerNBTManager()`
- `java.io.File getWorldDirectory()` — Gets the File object corresponding to the base directory of this world.
- `java.lang.String getWorldDirectoryName()` — Returns the name of the directory where world information is saved.
- `WorldInfo loadWorldInfo()` — Loads and returns the world info
- `NBTTagCompound readPlayerData(EntityPlayer player)` — Reads the player data from disk into the specified PlayerEntityMP.
- `void saveWorldInfo(WorldInfo worldInformation)` — used to update level.dat from old format to MCRegion format
- `void saveWorldInfoWithPlayer(WorldInfo worldInformation, NBTTagCompound tagCompound)` — Saves the given World Info with the given NBTTagCompound as the Player.
- `void writePlayerData(EntityPlayer player)` — Writes the player data to disk from the specified PlayerEntityMP.
