# EnumFacing

**Inheritance:** java.lang.Object → java.lang.Enum<EnumFacing> → net.minecraft.util.EnumFacing

## Class signature

```java
public enum EnumFacing extends java.lang.Enum<EnumFacing> implements IStringSerializable
```

## Methods

- `static EnumFacing byName(java.lang.String name)`
- `static EnumFacing fromAngle(double angle)`
- `EnumFacing.Axis getAxis()`
- `EnumFacing.AxisDirection getAxisDirection()`
- `static EnumFacing getDirectionFromEntityLiving(BlockPos pos, EntityLivingBase placer)`
- `Vec3i getDirectionVec()`
- `static EnumFacing getFacingFromAxis(EnumFacing.AxisDirection axisDirectionIn, EnumFacing.Axis axisIn)`
- `static EnumFacing getFacingFromVector(float x, float y, float z)`
- `static EnumFacing getFront(int index)`
- `int getFrontOffsetX()`
- `int getFrontOffsetY()`
- `int getFrontOffsetZ()`
- `static EnumFacing getHorizontal(int horizontalIndexIn)`
- `float getHorizontalAngle()`
- `int getHorizontalIndex()`
- `int getIndex()`
- `java.lang.String getName()`
- `java.lang.String getName2()`
- `EnumFacing getOpposite()`
- `static EnumFacing random(java.util.Random rand)`
- `EnumFacing rotateAround(EnumFacing.Axis axis)`
- `EnumFacing rotateY()`
- `EnumFacing rotateYCCW()`
- `java.lang.String toString()`
- `static EnumFacing valueOf(java.lang.String name)` — Returns the enum constant of this type with the specified name.
- `static EnumFacing [] values()` — Returns an array containing the constants of this enum type, in the order they are declared.

## Fields

- `static EnumFacing [] HORIZONTALS`
- `static EnumFacing [] VALUES`