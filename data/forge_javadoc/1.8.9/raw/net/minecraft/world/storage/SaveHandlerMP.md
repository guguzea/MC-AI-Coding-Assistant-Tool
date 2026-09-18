---
title: "SaveHandlerMP"
description: "Checks the session lock to prevent save collisions"
package: "net/minecraft/world/storage"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/world/storage/SaveHandlerMP.html"
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
- `public java.lang.String getWorldDirectoryName()`
- `public java.io.File getWorldDirectory()`

## Description

Checks the session lock to prevent save collisions
