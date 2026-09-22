# EnumFacing.Axis

**Inheritance:** java.lang.Object → java.lang.Enum<EnumFacing.Axis> → net.minecraft.util.EnumFacing.Axis

## Class signature

```java
public static enum EnumFacing.Axis extends java.lang.Enum<EnumFacing.Axis> implements IStringSerializable
```

## Methods

- `boolean apply(EnumFacing p_apply_1_)`
- `static EnumFacing.Axis byName(java.lang.String name)` — Get the axis specified by the given name
- `java.lang.String getName()`
- `java.lang.String getName2()` — Like getName but doesn't override the method from Enum.
- `EnumFacing.Plane getPlane()` — Get this Axis' Plane (VERTICAL for Y, HORIZONTAL for X and Z)
- `boolean isHorizontal()` — If this Axis is on the horizontal plane (true for X and Z)
- `boolean isVertical()` — If this Axis is on the vertical plane (Only true for Y)
- `java.lang.String toString()`
- `static EnumFacing.Axis valueOf(java.lang.String name)` — Returns the enum constant of this type with the specified name.
- `static EnumFacing.Axis [] values()` — Returns an array containing the constants of this enum type, in the order they are declared.