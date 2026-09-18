---
title: "SaveHandler"
description: "public class SaveHandler extends java.lang.Object implements ISaveHandler , IPlayerFileData"
package: "net/minecraft/world/storage"
version: "1.7.10"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/net/minecraft/world/storage/SaveHandler.html"
sourceType: javadoc
---

# SaveHandler

## Class signature

```java
public class SaveHandler extends java.lang.Object implements ISaveHandler , IPlayerFileData
```

## Constructors

- `public SaveHandler(java.io.File p_i2146_1_, java.lang.String p_i2146_2_, boolean p_i2146_3_)`

## Methods

- `public java.io.File getWorldDirectory()`
- `public void checkSessionLock() throws MinecraftException`
- `public IChunkLoader getChunkLoader( WorldProvider p_75763_1_)`
- `public WorldInfo loadWorldInfo()`
- `public void saveWorldInfoWithPlayer( WorldInfo p_75755_1_, NBTTagCompound p_75755_2_)`
- `public void saveWorldInfo( WorldInfo p_75761_1_)`
- `public void writePlayerData( EntityPlayer p_75753_1_)`
- `public NBTTagCompound readPlayerData( EntityPlayer p_75752_1_)`
- `public IPlayerFileData getSaveHandler()`
- `public java.lang.String[] getAvailablePlayerDat()`
- `public void flush()`
- `public java.io.File getMapFileFromName(java.lang.String p_75758_1_)`
- `public java.lang.String getWorldDirectoryName()`
- `public NBTTagCompound getPlayerNBT( EntityPlayerMP player)`
