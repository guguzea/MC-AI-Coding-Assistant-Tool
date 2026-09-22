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