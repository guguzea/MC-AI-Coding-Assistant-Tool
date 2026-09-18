# SaveFormatOld

## Class signature

```java
public class SaveFormatOld extends java.lang.Object implements ISaveFormat
```

## Constructors

- `public SaveFormatOld(java.io.File p_i2147_1_)`

## Methods

- `public java.lang.String getName()`
- `public java.util.List< SaveFormatComparator > getSaveList() throws AnvilConverterException`
- `public void flushCache()`
- `public WorldInfo getWorldInfo(java.lang.String saveName)`
- `public void renameWorld(java.lang.String dirName, java.lang.String newName)`
- `public boolean func_154335_d(java.lang.String p_154335_1_)`
- `public boolean deleteWorldDirectory(java.lang.String p_75802_1_)`
- `protected static boolean deleteFiles(java.io.File[] files)`
- `public ISaveHandler getSaveLoader(java.lang.String saveName, boolean storePlayerdata)`
- `public boolean func_154334_a(java.lang.String saveName)`
- `public boolean isOldMapFormat(java.lang.String saveName)`
- `public boolean convertMapFormat(java.lang.String filename, IProgressUpdate progressCallback)`
- `public boolean canLoadWorld(java.lang.String p_90033_1_)`

## Description

Reference to the File object representing the directory for the world saves