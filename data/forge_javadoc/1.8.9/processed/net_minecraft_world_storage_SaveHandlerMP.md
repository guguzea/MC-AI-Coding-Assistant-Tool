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