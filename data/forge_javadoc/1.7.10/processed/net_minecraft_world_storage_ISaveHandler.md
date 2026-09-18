# ISaveHandler

## Class signature

```java
public interface ISaveHandler
```

## Methods

- `WorldInfo loadWorldInfo()`
- `void checkSessionLock() throws MinecraftException`
- `IChunkLoader getChunkLoader( WorldProvider p_75763_1_)`
- `void saveWorldInfoWithPlayer( WorldInfo p_75755_1_, NBTTagCompound p_75755_2_)`
- `void saveWorldInfo( WorldInfo p_75761_1_)`
- `IPlayerFileData getSaveHandler()`
- `void flush()`
- `java.io.File getWorldDirectory()`
- `java.io.File getMapFileFromName(java.lang.String p_75758_1_)`
- `java.lang.String getWorldDirectoryName()`