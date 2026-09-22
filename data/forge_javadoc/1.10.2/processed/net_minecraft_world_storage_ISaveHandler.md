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