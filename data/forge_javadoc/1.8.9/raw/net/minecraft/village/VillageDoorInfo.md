---
title: "VillageDoorInfo"
description: "Returns the squared distance between this door and the given coordinate."
package: "net/minecraft/village"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/village/VillageDoorInfo.html"
sourceType: javadoc
---

# VillageDoorInfo

## Class signature

```java
public class VillageDoorInfo extends java.lang.Object
```

## Constructors

- `public VillageDoorInfo( BlockPos p_i45871_1_, int p_i45871_2_, int p_i45871_3_, int p_i45871_4_)`
- `public VillageDoorInfo( BlockPos p_i45872_1_, EnumFacing p_i45872_2_, int p_i45872_3_)`

## Methods

- `public int getDistanceSquared(int p_75474_1_, int p_75474_2_, int p_75474_3_)`
- `public int getDistanceToDoorBlockSq( BlockPos p_179848_1_)`
- `public int getDistanceToInsideBlockSq( BlockPos p_179846_1_)`
- `public boolean func_179850_c( BlockPos p_179850_1_)`
- `public void resetDoorOpeningRestrictionCounter()`
- `public void incrementDoorOpeningRestrictionCounter()`
- `public int getDoorOpeningRestrictionCounter()`
- `public BlockPos getDoorBlockPos()`
- `public BlockPos getInsideBlockPos()`
- `public int getInsideOffsetX()`
- `public int getInsideOffsetZ()`
- `public int getInsidePosY()`
- `public void func_179849_a(int p_179849_1_)`
- `public boolean getIsDetachedFromVillageFlag()`
- `public void setIsDetachedFromVillageFlag(boolean p_179853_1_)`

## Description

Returns the squared distance between this door and the given coordinate.
