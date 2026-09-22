# EnumFacing

**Inheritance:** java.lang.Object → java.lang.Enum<EnumFacing> → net.minecraft.util.EnumFacing

## Class signature

```java
public enum EnumFacing extends java.lang.Enum<EnumFacing> implements IStringSerializable
```

## Methods

- `static EnumFacing byName(java.lang.String name)` — Get the facing specified by the given name
- `static EnumFacing fromAngle(double angle)` — Get the Facing corresponding to the given angle (0-360).
- `static EnumFacing func_181076_a(EnumFacing.AxisDirection p_181076_0_, EnumFacing.Axis p_181076_1_)`
- `EnumFacing.Axis getAxis()`
- `EnumFacing.AxisDirection getAxisDirection()` — Get the AxisDirection of this Facing.
- `Vec3i getDirectionVec()` — Get a normalized Vector that points in the direction of this Facing.
- `static EnumFacing getFacingFromVector(float p_176737_0_, float p_176737_1_, float p_176737_2_)`
- `static EnumFacing getFront(int index)` — Get a Facing by it's index (0-5).
- `int getFrontOffsetX()` — Returns a offset that addresses the block in front of this facing.
- `int getFrontOffsetY()`
- `int getFrontOffsetZ()` — Returns a offset that addresses the block in front of this facing.
- `static EnumFacing getHorizontal(int p_176731_0_)` — Get a Facing by it's horizontal index (0-3).
- `int getHorizontalIndex()` — Get the index of this horizontal facing (0-3).
- `int getIndex()` — Get the Index of this Facing (0-5).
- `java.lang.String getName()`
- `java.lang.String getName2()` — Same as getName, but does not override the method from Enum.
- `EnumFacing getOpposite()` — Get the opposite Facing (e.g.
- `static EnumFacing random(java.util.Random rand)` — Choose a random Facing using the given Random
- `EnumFacing rotateAround(EnumFacing.Axis axis)` — Rotate this Facing around the given axis clockwise.
- `EnumFacing rotateY()` — Rotate this Facing around the Y axis clockwise (NORTH => EAST => SOUTH => WEST => NORTH)
- `EnumFacing rotateYCCW()` — Rotate this Facing around the Y axis counter-clockwise (NORTH => WEST => SOUTH => EAST => NORTH)
- `java.lang.String toString()`
- `static EnumFacing valueOf(java.lang.String name)` — Returns the enum constant of this type with the specified name.
- `static EnumFacing [] values()` — Returns an array containing the constants of this enum type, in the order they are declared.

## Fields

- `static EnumFacing [] HORIZONTALS` — All Facings with horizontal axis in order S-W-N-E
- `static EnumFacing [] VALUES` — All facings in D-U-N-S-W-E order