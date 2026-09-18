---
title: "WorldSummary"
description: "public class WorldSummary extends java.lang.Object implements java.lang.Comparable< WorldSummary >"
package: "net/minecraft/world/storage"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/world/storage/WorldSummary.html"
sourceType: javadoc
---

# WorldSummary

## Class signature

```java
public class WorldSummary extends java.lang.Object implements java.lang.Comparable< WorldSummary >
```

## Constructors

- `public WorldSummary( WorldInfo info, java.lang.String fileNameIn, java.lang.String displayNameIn, long sizeOnDiskIn, boolean requiresConversionIn)`

## Methods

- `public java.lang.String getFileName()`
- `public java.lang.String getDisplayName()`
- `public long getSizeOnDisk()`
- `public boolean requiresConversion()`
- `public long getLastTimePlayed()`
- `public int compareTo( WorldSummary p_compareTo_1_)`
- `public WorldSettings.GameType getEnumGameType()`
- `public boolean isHardcoreModeEnabled()`
- `public boolean getCheatsEnabled()`
- `public java.lang.String getVersionName()`
- `public boolean markVersionInList()`
- `public boolean askToOpenWorld()`
