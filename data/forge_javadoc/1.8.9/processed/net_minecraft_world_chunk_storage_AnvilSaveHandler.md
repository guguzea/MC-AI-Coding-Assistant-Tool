# AnvilSaveHandler

## Class signature

```java
public class AnvilSaveHandler extends SaveHandler
```

## Constructors

- `public AnvilSaveHandler(java.io.File savesDirectory, java.lang.String p_i2142_2_, boolean storePlayerdata)`

## Methods

- `public IChunkLoader getChunkLoader( WorldProvider provider)`
- `public void saveWorldInfoWithPlayer( WorldInfo worldInformation, NBTTagCompound tagCompound)`
- `public void flush()`

## Description

Called to flush all changes to disk, waiting for them to complete.