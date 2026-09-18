---
title: "ISaveHandler"
description: "Checks the session lock to prevent save collisions"
package: "net/minecraft/world/storage"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/world/storage/ISaveHandler.html"
sourceType: javadoc
---

# ISaveHandler

## Class signature

```java
public interface ISaveHandler
```

## Methods

- `WorldInfo loadWorldInfo()`
- `void checkSessionLock() throws MinecraftException`
- `IChunkLoader getChunkLoader( WorldProvider provider)`
- `void saveWorldInfoWithPlayer( WorldInfo worldInformation, NBTTagCompound tagCompound)`
- `void saveWorldInfo( WorldInfo worldInformation)`
- `IPlayerFileData getPlayerNBTManager()`
- `void flush()`
- `java.io.File getWorldDirectory()`
- `java.io.File getMapFileFromName(java.lang.String mapName)`
- `java.lang.String getWorldDirectoryName()`

## Description

Checks the session lock to prevent save collisions
