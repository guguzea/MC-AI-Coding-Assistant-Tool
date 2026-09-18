# VillageDoorInfo

## Class signature

```java
public class VillageDoorInfo extends java.lang.Object
```

## Constructors

- `public VillageDoorInfo( BlockPos pos, int deltaX, int deltaZ, int timestamp)`
- `public VillageDoorInfo( BlockPos pos, EnumFacing facing, int timestamp)`

## Methods

- `public int getDistanceSquared(int x, int y, int z)`
- `public int getDistanceToDoorBlockSq( BlockPos pos)`
- `public int getDistanceToInsideBlockSq( BlockPos pos)`
- `public boolean isInsideSide( BlockPos pos)`
- `public void resetDoorOpeningRestrictionCounter()`
- `public void incrementDoorOpeningRestrictionCounter()`
- `public int getDoorOpeningRestrictionCounter()`
- `public BlockPos getDoorBlockPos()`
- `public BlockPos getInsideBlockPos()`
- `public int getInsideOffsetX()`
- `public int getInsideOffsetZ()`
- `public int getLastActivityTimestamp()`
- `public void setLastActivityTimestamp(int timestamp)`
- `public boolean getIsDetachedFromVillageFlag()`
- `public void setIsDetachedFromVillageFlag(boolean detached)`
- `public EnumFacing getInsideDirection()`