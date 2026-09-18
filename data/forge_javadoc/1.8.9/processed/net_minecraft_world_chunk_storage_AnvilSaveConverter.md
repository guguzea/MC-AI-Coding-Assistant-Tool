# AnvilSaveConverter

## Class signature

```java
public class AnvilSaveConverter extends SaveFormatOld
```

## Constructors

- `public AnvilSaveConverter(java.io.File p_i2144_1_)`

## Methods

- `public java.lang.String getName()`
- `public java.util.List< SaveFormatComparator > getSaveList() throws AnvilConverterException`
- `protected int getSaveVersion()`
- `public void flushCache()`
- `public ISaveHandler getSaveLoader(java.lang.String saveName, boolean storePlayerdata)`
- `public boolean func_154334_a(java.lang.String saveName)`
- `public boolean isOldMapFormat(java.lang.String saveName)`
- `public boolean convertMapFormat(java.lang.String filename, IProgressUpdate progressCallback)`

## Description

converts the map to mcRegion