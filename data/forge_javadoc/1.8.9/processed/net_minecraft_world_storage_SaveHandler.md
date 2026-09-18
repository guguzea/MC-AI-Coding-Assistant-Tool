# SaveHandler

## Class signature

```java
public class SaveHandler extends java.lang.Object implements ISaveHandler , IPlayerFileData
```

## Constructors

- `public SaveHandler(java.io.File savesDirectory, java.lang.String directoryName, boolean playersDirectoryIn)`

## Methods

- `public java.io.File getWorldDirectory()`
- `public void checkSessionLock() throws MinecraftException`
- `public IChunkLoader getChunkLoader( WorldProvider provider)`
- `public WorldInfo loadWorldInfo()`
- `public void saveWorldInfoWithPlayer( WorldInfo worldInformation, NBTTagCompound tagCompound)`
- `public void saveWorldInfo( WorldInfo worldInformation)`
- `public void writePlayerData( EntityPlayer player)`
- `public NBTTagCompound readPlayerData( EntityPlayer player)`
- `public IPlayerFileData getPlayerNBTManager()`
- `public java.lang.String[] getAvailablePlayerDat()`
- `public void flush()`
- `public java.io.File getMapFileFromName(java.lang.String mapName)`
- `public java.lang.String getWorldDirectoryName()`
- `public NBTTagCompound getPlayerNBT( EntityPlayerMP player)`

## Description

Checks the session lock to prevent save collisions