# SaveFormatOld

## Class signature

```java
public class SaveFormatOld extends java.lang.Object implements ISaveFormat
```

## Constructors

- `public SaveFormatOld(java.io.File savesDirectoryIn, DataFixer dataFixerIn)`

## Methods

- `public java.lang.String getName()`
- `public java.util.List< WorldSummary > getSaveList() throws AnvilConverterException`
- `public void flushCache()`
- `public WorldInfo getWorldInfo(java.lang.String saveName)`
- `@Nullable public static WorldInfo getWorldData(java.io.File p_186353_0_, DataFixer dataFixerIn)`
- `public static WorldInfo loadAndFix(java.io.File file, DataFixer fixer, SaveHandler save)`
- `public void renameWorld(java.lang.String dirName, java.lang.String newName)`
- `public ISaveHandler getSaveLoader(java.lang.String saveName, boolean storePlayerdata)`
- `public boolean isNewLevelIdAcceptable(java.lang.String saveName)`
- `public boolean deleteWorldDirectory(java.lang.String saveName)`
- `protected static boolean deleteFiles(java.io.File[] files)`
- `public boolean isConvertible(java.lang.String saveName)`
- `public boolean isOldMapFormat(java.lang.String saveName)`
- `public boolean convertMapFormat(java.lang.String filename, IProgressUpdate progressCallback)`
- `public boolean canLoadWorld(java.lang.String saveName)`
- `public java.io.File getFile(java.lang.String p_186352_1_, java.lang.String p_186352_2_)`