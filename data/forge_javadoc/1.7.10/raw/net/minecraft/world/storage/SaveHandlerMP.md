---
title: "SaveHandlerMP"
description: "public class SaveHandlerMP extends java.lang.Object implements ISaveHandler"
package: "net/minecraft/world/storage"
version: "1.7.10"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/net/minecraft/world/storage/SaveHandlerMP.html"
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
- `public IChunkLoader getChunkLoader( WorldProvider p_75763_1_)`
- `public void saveWorldInfoWithPlayer( WorldInfo p_75755_1_, NBTTagCompound p_75755_2_)`
- `public void saveWorldInfo( WorldInfo p_75761_1_)`
- `public IPlayerFileData getSaveHandler()`
- `public void flush()`
- `public java.io.File getMapFileFromName(java.lang.String p_75758_1_)`
- `public java.lang.String getWorldDirectoryName()`
- `public java.io.File getWorldDirectory()`
