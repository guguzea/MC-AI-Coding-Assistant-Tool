---
title: "WorldSpecificSaveHandler"
description: "public class WorldSpecificSaveHandler extends java.lang.Object implements ISaveHandler"
package: "net/minecraftforge/common"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/common/WorldSpecificSaveHandler.html"
sourceType: javadoc
---

# WorldSpecificSaveHandler

## Class signature

```java
public class WorldSpecificSaveHandler extends java.lang.Object implements ISaveHandler
```

## Constructors

- `public WorldSpecificSaveHandler( WorldServer world, ISaveHandler parent)`

## Methods

- `public WorldInfo loadWorldInfo()`
- `public void checkSessionLock() throws MinecraftException`
- `public IChunkLoader getChunkLoader( WorldProvider var1)`
- `public void saveWorldInfoWithPlayer( WorldInfo var1, NBTTagCompound var2)`
- `public void saveWorldInfo( WorldInfo var1)`
- `public IPlayerFileData getPlayerNBTManager()`
- `public void flush()`
- `public java.io.File getWorldDirectory()`
- `public java.io.File getMapFileFromName(java.lang.String name)`
- `public TemplateManager getStructureTemplateManager()`
