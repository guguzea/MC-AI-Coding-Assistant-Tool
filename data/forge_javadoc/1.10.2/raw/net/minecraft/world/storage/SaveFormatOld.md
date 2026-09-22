---
title: "SaveFormatOld"
description: "public class SaveFormatOld extends java.lang.Object implements ISaveFormat"
package: "net/minecraft/world/storage"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/world/storage/SaveFormatOld.html"
sourceType: javadoc
---

# SaveFormatOld

**Inheritance:** java.lang.Object → net.minecraft.world.storage.SaveFormatOld

## Class signature

```java
public class SaveFormatOld extends java.lang.Object implements ISaveFormat
```

## Constructors

- `SaveFormatOld(java.io.File savesDirectoryIn, DataFixer dataFixerIn)`

## Methods

- `boolean canLoadWorld(java.lang.String saveName)`
- `boolean convertMapFormat(java.lang.String filename, IProgressUpdate progressCallback)`
- `protected static boolean deleteFiles(java.io.File[] files)`
- `boolean deleteWorldDirectory(java.lang.String saveName)`
- `void flushCache()`
- `java.io.File getFile(java.lang.String p_186352_1_, java.lang.String p_186352_2_)`
- `java.lang.String getName()`
- `java.util.List<WorldSummary> getSaveList()`
- `ISaveHandler getSaveLoader(java.lang.String saveName, boolean storePlayerdata)`
- `static WorldInfo getWorldData(java.io.File p_186353_0_, DataFixer dataFixerIn)`
- `WorldInfo getWorldInfo(java.lang.String saveName)`
- `boolean isConvertible(java.lang.String saveName)`
- `boolean isNewLevelIdAcceptable(java.lang.String saveName)`
- `boolean isOldMapFormat(java.lang.String saveName)`
- `static WorldInfo loadAndFix(java.io.File file, DataFixer fixer, SaveHandler save)`
- `void renameWorld(java.lang.String dirName, java.lang.String newName)`

## Fields

- `protected DataFixer dataFixer`
- `java.io.File savesDirectory`
