---
title: "WorldSpecificSaveHandler"
description: "public class WorldSpecificSaveHandler extends java.lang.Object implements ISaveHandler"
package: "net/minecraftforge/common"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/common/WorldSpecificSaveHandler.html"
sourceType: javadoc
---

# WorldSpecificSaveHandler

**Inheritance:** java.lang.Object → net.minecraftforge.common.WorldSpecificSaveHandler

## Class signature

```java
public class WorldSpecificSaveHandler extends java.lang.Object implements ISaveHandler
```

## Constructors

- `WorldSpecificSaveHandler(WorldServer world, ISaveHandler parent)`

## Methods

- `void checkSessionLock()`
- `void flush()`
- `IChunkLoader getChunkLoader(WorldProvider var1)`
- `java.io.File getMapFileFromName(java.lang.String name)`
- `IPlayerFileData getPlayerNBTManager()`
- `TemplateManager getStructureTemplateManager()`
- `java.io.File getWorldDirectory()`
- `WorldInfo loadWorldInfo()`
- `void saveWorldInfo(WorldInfo var1)`
- `void saveWorldInfoWithPlayer(WorldInfo var1, NBTTagCompound var2)`
