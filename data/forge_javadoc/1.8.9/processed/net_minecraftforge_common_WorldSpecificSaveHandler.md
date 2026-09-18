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
- `public java.lang.String getWorldDirectoryName()`
- `public java.io.File getWorldDirectory()`
- `public java.io.File getMapFileFromName(java.lang.String name)`

## Description

Checks the session lock to prevent save collisions