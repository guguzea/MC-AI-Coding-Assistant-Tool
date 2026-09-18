---
title: "ISaveFormat"
description: "public interface ISaveFormat"
package: "net/minecraft/world/storage"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/world/storage/ISaveFormat.html"
sourceType: javadoc
---

# ISaveFormat

## Class signature

```java
public interface ISaveFormat
```

## Methods

- `java.lang.String getName()`
- `ISaveHandler getSaveLoader(java.lang.String saveName, boolean storePlayerdata)`
- `java.util.List< WorldSummary > getSaveList() throws AnvilConverterException`
- `boolean isOldMapFormat(java.lang.String saveName)`
- `void flushCache()`
- `WorldInfo getWorldInfo(java.lang.String saveName)`
- `boolean isNewLevelIdAcceptable(java.lang.String saveName)`
- `boolean deleteWorldDirectory(java.lang.String saveName)`
- `void renameWorld(java.lang.String dirName, java.lang.String newName)`
- `boolean isConvertible(java.lang.String saveName)`
- `boolean convertMapFormat(java.lang.String filename, IProgressUpdate progressCallback)`
- `java.io.File getFile(java.lang.String p_186352_1_, java.lang.String p_186352_2_)`
- `boolean canLoadWorld(java.lang.String saveName)`
