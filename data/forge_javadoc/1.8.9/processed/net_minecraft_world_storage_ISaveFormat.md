# ISaveFormat

## Class signature

```java
public interface ISaveFormat
```

## Methods

- `java.lang.String getName()`
- `ISaveHandler getSaveLoader(java.lang.String saveName, boolean storePlayerdata)`
- `java.util.List< SaveFormatComparator > getSaveList() throws AnvilConverterException`
- `void flushCache()`
- `WorldInfo getWorldInfo(java.lang.String saveName)`
- `boolean func_154335_d(java.lang.String p_154335_1_)`
- `boolean deleteWorldDirectory(java.lang.String p_75802_1_)`
- `void renameWorld(java.lang.String dirName, java.lang.String newName)`
- `boolean func_154334_a(java.lang.String saveName)`
- `boolean isOldMapFormat(java.lang.String saveName)`
- `boolean convertMapFormat(java.lang.String filename, IProgressUpdate progressCallback)`
- `boolean canLoadWorld(java.lang.String p_90033_1_)`

## Description

Return whether the given world can be loaded.