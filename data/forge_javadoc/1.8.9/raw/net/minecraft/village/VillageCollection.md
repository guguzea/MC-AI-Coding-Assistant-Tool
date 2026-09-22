---
title: "VillageCollection"
description: "public class VillageCollection extends WorldSavedData"
package: "net/minecraft/village"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/village/VillageCollection.html"
sourceType: javadoc
---

# VillageCollection

**Inheritance:** java.lang.Object → net.minecraft.world.WorldSavedData → net.minecraft.village.VillageCollection

## Class signature

```java
public class VillageCollection extends WorldSavedData
```

## Methods

- `void addToVillagerPositionList(BlockPos pos)`
- `static java.lang.String fileNameForProvider(WorldProvider provider)`
- `Village getNearestVillage(BlockPos doorBlock, int radius)`
- `java.util.List<Village> getVillageList()`
- `void readFromNBT(NBTTagCompound nbt)` — reads in data from the NBTTagCompound into this MapDataBase
- `void setWorldsForAll(World worldIn)`
- `void tick()` — Runs a single tick for the village collection
- `void writeToNBT(NBTTagCompound nbt)` — write data to NBTTagCompound from this MapDataBase, similar to Entities and TileEntities

## Fields

- `VillageCollection`
- `VillageCollection`
