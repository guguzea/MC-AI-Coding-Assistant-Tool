# AnvilSaveConverter

## Class signature

```java
public class AnvilSaveConverter extends SaveFormatOld
```

## Constructors

- `public AnvilSaveConverter(java.io.File dir, DataFixer dataFixerIn)`

## Methods

- `public java.lang.String getName()`
- `public java.util.List< WorldSummary > getSaveList() throws AnvilConverterException`
- `protected int getSaveVersion()`
- `public void flushCache()`
- `public ISaveHandler getSaveLoader(java.lang.String saveName, boolean storePlayerdata)`
- `public boolean isConvertible(java.lang.String saveName)`
- `public boolean isOldMapFormat(java.lang.String saveName)`
- `public boolean convertMapFormat(java.lang.String filename, IProgressUpdate progressCallback)`