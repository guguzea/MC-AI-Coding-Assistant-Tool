---
title: "SaveFormatComparator"
description: "return the display name of the save"
package: "net/minecraft/world/storage"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/world/storage/SaveFormatComparator.html"
sourceType: javadoc
---

# SaveFormatComparator

## Class signature

```java
public class SaveFormatComparator extends java.lang.Object implements java.lang.Comparable< SaveFormatComparator >
```

## Constructors

- `public SaveFormatComparator(java.lang.String fileNameIn, java.lang.String displayNameIn, long lastTimePlayedIn, long sizeOnDiskIn, WorldSettings.GameType theEnumGameTypeIn, boolean requiresConversionIn, boolean hardcoreIn, boolean cheatsEnabledIn)`

## Methods

- `public java.lang.String getFileName()`
- `public java.lang.String getDisplayName()`
- `public long getSizeOnDisk()`
- `public boolean requiresConversion()`
- `public long getLastTimePlayed()`
- `public int compareTo( SaveFormatComparator p_compareTo_1_)`
- `public WorldSettings.GameType getEnumGameType()`
- `public boolean isHardcoreModeEnabled()`
- `public boolean getCheatsEnabled()`

## Description

return the display name of the save
