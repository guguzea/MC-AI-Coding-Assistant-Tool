# MovingObjectPosition

**Inheritance:** java.lang.Object → net.minecraft.util.MovingObjectPosition

## Class signature

```java
public class MovingObjectPosition extends java.lang.Object
```

## Constructors

- `MovingObjectPosition(Entity p_i2304_1_)`
- `MovingObjectPosition(Entity entityHitIn, Vec3 hitVecIn)`
- `MovingObjectPosition(MovingObjectPosition.MovingObjectType typeOfHitIn, Vec3 hitVecIn, EnumFacing sideHitIn, BlockPos blockPosIn)`
- `MovingObjectPosition(Vec3 p_i45552_1_, EnumFacing facing)`
- `MovingObjectPosition(Vec3 hitVecIn, EnumFacing facing, BlockPos blockPosIn)`

## Methods

- `BlockPos getBlockPos()`
- `java.lang.String toString()`

## Fields

- `Entity entityHit` — The hit entity
- `java.lang.Object hitInfo` — Used to add extra hit info
- `Vec3 hitVec` — The vector position of the hit
- `EnumFacing sideHit`
- `int subHit` — Used to determine what sub-segment is hit
- `MovingObjectPosition.MovingObjectType typeOfHit` — What type of ray trace hit was this?