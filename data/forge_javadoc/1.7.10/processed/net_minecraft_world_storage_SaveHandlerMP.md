# SaveHandlerMP

**Inheritance:** java.lang.Object → net.minecraft.world.storage.SaveHandlerMP

## Class signature

```java
public class SaveHandlerMP extends java.lang.Object implements ISaveHandler
```

## Constructors

- `SaveHandlerMP()`

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