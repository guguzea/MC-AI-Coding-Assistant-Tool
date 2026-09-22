---
title: "SaveHandler"
description: "public class SaveHandler extends java.lang.Object implements ISaveHandler, IPlayerFileData"
package: "net/minecraft/world/storage"
version: "1.7.10"
forgeBuild: "10.13.4.1614"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/net/minecraft/world/storage/SaveHandler.html"
sourceType: javadoc
---

# SaveHandler

**Inheritance:** java.lang.Object → net.minecraft.world.storage.SaveHandler

## Class signature

```java
public class SaveHandler extends java.lang.Object implements ISaveHandler, IPlayerFileData
```

## Constructors

- `SaveHandler(java.io.File p_i2146_1_, java.lang.String p_i2146_2_, boolean p_i2146_3_)`

## Methods

- `void checkSessionLock()`
- `void flush()`
- `java.lang.String[] getAvailablePlayerDat()`
- `IChunkLoader getChunkLoader(WorldProvider p_75763_1_)`
- `java.io.File getMapFileFromName(java.lang.String p_75758_1_)`
- `NBTTagCompound getPlayerNBT(EntityPlayerMP player)`
- `IPlayerFileData getSaveHandler()`
- `java.io.File getWorldDirectory()`
- `java.lang.String getWorldDirectoryName()`
- `WorldInfo loadWorldInfo()`
- `NBTTagCompound readPlayerData(EntityPlayer p_75752_1_)`
- `void saveWorldInfo(WorldInfo p_75761_1_)`
- `void saveWorldInfoWithPlayer(WorldInfo p_75755_1_, NBTTagCompound p_75755_2_)`
- `void writePlayerData(EntityPlayer p_75753_1_)`
