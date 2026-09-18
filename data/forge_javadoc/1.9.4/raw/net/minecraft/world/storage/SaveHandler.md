---
title: "SaveHandler"
description: "public class SaveHandler extends java.lang.Object implements ISaveHandler , IPlayerFileData"
package: "net/minecraft/world/storage"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/world/storage/SaveHandler.html"
sourceType: javadoc
---

# SaveHandler

## Class signature

```java
public class SaveHandler extends java.lang.Object implements ISaveHandler , IPlayerFileData
```

## Constructors

- `public SaveHandler(java.io.File p_i46648_1_, java.lang.String saveDirectoryNameIn, boolean p_i46648_3_, DataFixer dataFixerIn)`

## Methods

- `public java.io.File getWorldDirectory()`
- `public void checkSessionLock() throws MinecraftException`
- `public IChunkLoader getChunkLoader( WorldProvider provider)`
- `public WorldInfo loadWorldInfo()`
- `public void saveWorldInfoWithPlayer( WorldInfo worldInformation, @Nullable NBTTagCompound tagCompound)`
- `public void saveWorldInfo( WorldInfo worldInformation)`
- `public void writePlayerData( EntityPlayer player)`
- `public NBTTagCompound readPlayerData( EntityPlayer player)`
- `public IPlayerFileData getPlayerNBTManager()`
- `public java.lang.String[] getAvailablePlayerDat()`
- `public void flush()`
- `public java.io.File getMapFileFromName(java.lang.String mapName)`
- `public TemplateManager getStructureTemplateManager()`
- `public NBTTagCompound getPlayerNBT( EntityPlayerMP player)`
