---
title: "SaveHandlerMP"
description: "public class SaveHandlerMP extends java.lang.Object implements ISaveHandler"
package: "net/minecraft/world/storage"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/world/storage/SaveHandlerMP.html"
sourceType: javadoc
---

# SaveHandlerMP

## Class signature

```java
public class SaveHandlerMP extends java.lang.Object implements ISaveHandler
```

## Constructors

- `public SaveHandlerMP()`

## Methods

- `public WorldInfo loadWorldInfo()`
- `public void checkSessionLock() throws MinecraftException`
- `public IChunkLoader getChunkLoader( WorldProvider provider)`
- `public void saveWorldInfoWithPlayer( WorldInfo worldInformation, NBTTagCompound tagCompound)`
- `public void saveWorldInfo( WorldInfo worldInformation)`
- `public IPlayerFileData getPlayerNBTManager()`
- `public void flush()`
- `public java.io.File getMapFileFromName(java.lang.String mapName)`
- `public java.io.File getWorldDirectory()`
- `public TemplateManager getStructureTemplateManager()`
