# ISaveHandler

## Class signature

```java
public interface ISaveHandler
```

## Methods

- `@Nullable WorldInfo loadWorldInfo()`
- `void checkSessionLock() throws MinecraftException`
- `IChunkLoader getChunkLoader( WorldProvider provider)`
- `void saveWorldInfoWithPlayer( WorldInfo worldInformation, NBTTagCompound tagCompound)`
- `void saveWorldInfo( WorldInfo worldInformation)`
- `IPlayerFileData getPlayerNBTManager()`
- `void flush()`
- `java.io.File getWorldDirectory()`
- `java.io.File getMapFileFromName(java.lang.String mapName)`
- `TemplateManager getStructureTemplateManager()`