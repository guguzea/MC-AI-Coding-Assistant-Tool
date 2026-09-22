---
title: "ISaveFormat"
description: "public interface ISaveFormat"
package: "net/minecraft/world/storage"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/world/storage/ISaveFormat.html"
sourceType: javadoc
---

# ISaveFormat

## Class signature

```java
public interface ISaveFormat
```

## Methods

- `boolean canLoadWorld(java.lang.String saveName)`
- `boolean convertMapFormat(java.lang.String filename, IProgressUpdate progressCallback)`
- `boolean deleteWorldDirectory(java.lang.String saveName)`
- `void flushCache()`
- `java.io.File getFile(java.lang.String p_186352_1_, java.lang.String p_186352_2_)`
- `java.lang.String getName()`
- `java.util.List<WorldSummary> getSaveList()`
- `ISaveHandler getSaveLoader(java.lang.String saveName, boolean storePlayerdata)`
- `WorldInfo getWorldInfo(java.lang.String saveName)`
- `boolean isConvertible(java.lang.String saveName)`
- `boolean isNewLevelIdAcceptable(java.lang.String saveName)`
- `boolean isOldMapFormat(java.lang.String saveName)`
- `void renameWorld(java.lang.String dirName, java.lang.String newName)`
