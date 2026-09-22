---
title: "AnvilSaveConverter"
description: "public class AnvilSaveConverter extends SaveFormatOld"
package: "net/minecraft/world/chunk/storage"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/world/chunk/storage/AnvilSaveConverter.html"
sourceType: javadoc
---

# AnvilSaveConverter

**Inheritance:** java.lang.Object → net.minecraft.world.storage.SaveFormatOld → net.minecraft.world.chunk.storage.AnvilSaveConverter

## Class signature

```java
public class AnvilSaveConverter extends SaveFormatOld
```

## Methods

- `boolean convertMapFormat(java.lang.String filename, IProgressUpdate progressCallback)` — converts the map to mcRegion
- `void flushCache()`
- `boolean func_154334_a(java.lang.String saveName)`
- `java.lang.String getName()` — Returns the name of the save format.
- `java.util.List<SaveFormatComparator> getSaveList()`
- `ISaveHandler getSaveLoader(java.lang.String saveName, boolean storePlayerdata)` — Returns back a loader for the specified save directory
- `protected int getSaveVersion()`
- `boolean isOldMapFormat(java.lang.String saveName)` — gets if the map is old chunk saving (true) or McRegion (false)

## Fields

- `AnvilSaveConverter`
