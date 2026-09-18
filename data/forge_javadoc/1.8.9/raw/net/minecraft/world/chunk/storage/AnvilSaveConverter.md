---
title: "AnvilSaveConverter"
description: "converts the map to mcRegion"
package: "net/minecraft/world/chunk/storage"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/world/chunk/storage/AnvilSaveConverter.html"
sourceType: javadoc
---

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
