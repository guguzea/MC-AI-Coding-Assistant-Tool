---
title: "VillageCollection"
description: "public class VillageCollection extends WorldSavedData"
package: "net/minecraft/village"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/village/VillageCollection.html"
sourceType: javadoc
---

# VillageCollection

## Class signature

```java
public class VillageCollection extends WorldSavedData
```

## Constructors

- `public VillageCollection(java.lang.String name)`
- `public VillageCollection( World worldIn)`

## Methods

- `public void setWorldsForAll( World worldIn)`
- `public void addToVillagerPositionList( BlockPos pos)`
- `public void tick()`
- `public java.util.List< Village > getVillageList()`
- `public Village getNearestVillage( BlockPos doorBlock, int radius)`
- `public void readFromNBT( NBTTagCompound nbt)`
- `public NBTTagCompound writeToNBT( NBTTagCompound compound)`
- `public static java.lang.String fileNameForProvider( WorldProvider provider)`
