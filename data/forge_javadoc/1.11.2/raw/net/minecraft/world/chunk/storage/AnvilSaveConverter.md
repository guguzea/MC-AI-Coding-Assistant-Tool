---
title: "AnvilSaveConverter"
description: "public class AnvilSaveConverter extends SaveFormatOld"
package: "net/minecraft/world/chunk/storage"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/world/chunk/storage/AnvilSaveConverter.html"
sourceType: javadoc
---

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
