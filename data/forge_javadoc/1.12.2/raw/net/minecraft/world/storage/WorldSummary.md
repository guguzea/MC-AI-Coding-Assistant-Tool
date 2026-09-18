---
title: "WorldSummary"
description: "public class WorldSummary extends java.lang.Object implements java.lang.Comparable< WorldSummary >"
package: "net/minecraft/world/storage"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/world/storage/WorldSummary.html"
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
- `public GameType getEnumGameType()`
- `public boolean isHardcoreModeEnabled()`
- `public boolean getCheatsEnabled()`
- `public java.lang.String getVersionName()`
- `public boolean markVersionInList()`
- `public boolean askToOpenWorld()`
