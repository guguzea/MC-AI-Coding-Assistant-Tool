---
title: "SaveFormatComparator"
description: "public class SaveFormatComparator extends java.lang.Object implements java.lang.Comparable<SaveFormatComparator>"
package: "net/minecraft/world/storage"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/world/storage/SaveFormatComparator.html"
sourceType: javadoc
---

# SaveFormatComparator

**Inheritance:** java.lang.Object → net.minecraft.world.storage.SaveFormatComparator

## Class signature

```java
public class SaveFormatComparator extends java.lang.Object implements java.lang.Comparable<SaveFormatComparator>
```

## Constructors

- `SaveFormatComparator(java.lang.String fileNameIn, java.lang.String displayNameIn, long lastTimePlayedIn, long sizeOnDiskIn, WorldSettings.GameType theEnumGameTypeIn, boolean requiresConversionIn, boolean hardcoreIn, boolean cheatsEnabledIn)`

## Methods

- `int compareTo(SaveFormatComparator p_compareTo_1_)`
- `boolean getCheatsEnabled()`
- `java.lang.String getDisplayName()` — return the display name of the save
- `WorldSettings.GameType getEnumGameType()` — Gets the EnumGameType.
- `java.lang.String getFileName()` — return the file name
- `long getLastTimePlayed()`
- `long getSizeOnDisk()`
- `boolean isHardcoreModeEnabled()`
- `boolean requiresConversion()`
