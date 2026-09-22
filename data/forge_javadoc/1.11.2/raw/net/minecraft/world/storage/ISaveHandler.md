---
title: "ISaveHandler"
description: "public interface ISaveHandler"
package: "net/minecraft/world/storage"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/world/storage/ISaveHandler.html"
sourceType: javadoc
---

# ISaveHandler

## Class signature

```java
public interface ISaveHandler
```

## Methods

- `void checkSessionLock()`
- `void flush()`
- `IChunkLoader getChunkLoader(WorldProvider provider)`
- `java.io.File getMapFileFromName(java.lang.String mapName)`
- `IPlayerFileData getPlayerNBTManager()`
- `TemplateManager getStructureTemplateManager()`
- `java.io.File getWorldDirectory()`
- `WorldInfo loadWorldInfo()`
- `void saveWorldInfo(WorldInfo worldInformation)`
- `void saveWorldInfoWithPlayer(WorldInfo worldInformation, NBTTagCompound tagCompound)`
