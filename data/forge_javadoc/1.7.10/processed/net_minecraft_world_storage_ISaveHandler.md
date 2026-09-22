# ISaveHandler

## Class signature

```java
public interface ISaveHandler
```

## Methods

- `void checkSessionLock()`
- `void flush()`
- `IChunkLoader getChunkLoader(WorldProvider p_75763_1_)`
- `java.io.File getMapFileFromName(java.lang.String p_75758_1_)`
- `IPlayerFileData getSaveHandler()`
- `java.io.File getWorldDirectory()`
- `java.lang.String getWorldDirectoryName()`
- `WorldInfo loadWorldInfo()`
- `void saveWorldInfo(WorldInfo p_75761_1_)`
- `void saveWorldInfoWithPlayer(WorldInfo p_75755_1_, NBTTagCompound p_75755_2_)`