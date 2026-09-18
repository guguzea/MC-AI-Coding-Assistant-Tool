# EnumFacing

## Class signature

```java
public enum EnumFacing extends java.lang.Enum< EnumFacing > implements IStringSerializable
```

## Methods

- `public static EnumFacing [] values()`
- `public static EnumFacing valueOf(java.lang.String name)`
- `public int getIndex()`
- `public int getHorizontalIndex()`
- `public EnumFacing.AxisDirection getAxisDirection()`
- `public EnumFacing getOpposite()`
- `public EnumFacing rotateAround( EnumFacing.Axis axis)`
- `public EnumFacing rotateY()`
- `public EnumFacing rotateYCCW()`
- `public int getFrontOffsetX()`
- `public int getFrontOffsetY()`
- `public int getFrontOffsetZ()`
- `public java.lang.String getName2()`
- `public EnumFacing.Axis getAxis()`
- `@Nullable public static EnumFacing byName(java.lang.String name)`
- `public static EnumFacing getFront(int index)`
- `public static EnumFacing getHorizontal(int horizontalIndexIn)`
- `public static EnumFacing fromAngle(double angle)`
- `public float getHorizontalAngle()`
- `public static EnumFacing random(java.util.Random rand)`
- `public static EnumFacing getFacingFromVector(float x, float y, float z)`
- `public java.lang.String toString()`
- `public java.lang.String getName()`
- `public static EnumFacing getFacingFromAxis( EnumFacing.AxisDirection axisDirectionIn, EnumFacing.Axis axisIn)`
- `public Vec3i getDirectionVec()`

## Description

Returns the enum constant of this type with the specified name.