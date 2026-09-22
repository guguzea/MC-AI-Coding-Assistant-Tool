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
- `boolean getIsDetachedFromVillageFlag()`
- `int getLastActivityTimestamp()`
- `void incrementDoorOpeningRestrictionCounter()`
- `boolean isInsideSide(BlockPos pos)`
- `void resetDoorOpeningRestrictionCounter()`
- `void setIsDetachedFromVillageFlag(boolean detached)`
- `void setLastActivityTimestamp(int timestamp)`