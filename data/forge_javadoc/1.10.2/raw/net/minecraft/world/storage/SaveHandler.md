---
title: "SaveHandler"
description: "public class SaveHandler extends java.lang.Object implements ISaveHandler, IPlayerFileData"
package: "net/minecraft/world/storage"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/world/storage/SaveHandler.html"
sourceType: javadoc
---

# SaveHandler

**Inheritance:** java.lang.Object → net.minecraft.world.storage.SaveHandler

## Class signature

```java
public class SaveHandler extends java.lang.Object implements ISaveHandler, IPlayerFileData
```

## Constructors

- `SaveHandler(java.io.File p_i46648_1_, java.lang.String saveDirectoryNameIn, boolean p_i46648_3_, DataFixer dataFixerIn)`

## Methods

- `void checkSessionLock()`
- `void flush()`
- `java.lang.String[] getAvailablePlayerDat()`
- `IChunkLoader getChunkLoader(WorldProvider provider)`
- `java.io.File getMapFileFromName(java.lang.String mapName)`
- `NBTTagCompound getPlayerNBT(EntityPlayerMP player)`
- `IPlayerFileData getPlayerNBTManager()`
- `TemplateManager getStructureTemplateManager()`
- `java.io.File getWorldDirectory()`
- `WorldInfo loadWorldInfo()`
- `NBTTagCompound readPlayerData(EntityPlayer player)`
- `void saveWorldInfo(WorldInfo worldInformation)`
- `void saveWorldInfoWithPlayer(WorldInfo worldInformation, NBTTagCompound tagCompound)`
- `void writePlayerData(EntityPlayer player)`

## Fields

- `protected DataFixer dataFixer`
