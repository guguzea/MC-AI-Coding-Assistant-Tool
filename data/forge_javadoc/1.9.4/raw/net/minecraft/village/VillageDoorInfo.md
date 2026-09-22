---
title: "VillageDoorInfo"
description: "public class VillageDoorInfo extends java.lang.Object"
package: "net/minecraft/village"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/village/VillageDoorInfo.html"
sourceType: javadoc
---

# VillageDoorInfo

**Inheritance:** java.lang.Object → net.minecraft.village.VillageDoorInfo

## Class signature

```java
public class VillageDoorInfo extends java.lang.Object
```

## Constructors

- `VillageDoorInfo(BlockPos pos, EnumFacing facing, int timestamp)`
- `VillageDoorInfo(BlockPos pos, int deltaX, int deltaZ, int timestamp)`

## Methods

- `int getDistanceSquared(int x, int y, int z)`
- `int getDistanceToDoorBlockSq(BlockPos pos)`
- `int getDistanceToInsideBlockSq(BlockPos pos)`
- `BlockPos getDoorBlockPos()`
- `int getDoorOpeningRestrictionCounter()`
- `BlockPos getInsideBlockPos()`
- `EnumFacing getInsideDirection()`
- `int getInsideOffsetX()`
- `int getInsideOffsetZ()`
- `int getInsidePosY()`
- `boolean getIsDetachedFromVillageFlag()`
- `void incrementDoorOpeningRestrictionCounter()`
- `boolean isInsideSide(BlockPos pos)`
- `void resetDoorOpeningRestrictionCounter()`
- `void setIsDetachedFromVillageFlag(boolean detached)`
- `void setLastActivityTimestamp(int timestamp)`
