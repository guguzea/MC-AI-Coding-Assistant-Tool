# Vec3d

**Inheritance:** java.lang.Object → net.minecraft.util.math.Vec3d

## Class signature

```java
public class Vec3d extends java.lang.Object
```

## Constructors

- `Vec3d(double x, double y, double z)`
- `Vec3d(Vec3i vector)`

## Methods

- `Vec3d add(Vec3d vec)`
- `Vec3d addVector(double x, double y, double z)`
- `Vec3d crossProduct(Vec3d vec)`
- `double distanceTo(Vec3d vec)`
- `double dotProduct(Vec3d vec)`
- `boolean equals(java.lang.Object p_equals_1_)`
- `Vec3d getIntermediateWithXValue(Vec3d vec, double x)`
- `Vec3d getIntermediateWithYValue(Vec3d vec, double y)`
- `Vec3d getIntermediateWithZValue(Vec3d vec, double z)`
- `int hashCode()`
- `double lengthVector()`
- `Vec3d normalize()`
- `Vec3d rotatePitch(float pitch)`
- `Vec3d rotateYaw(float yaw)`
- `Vec3d scale(double p_186678_1_)`
- `double squareDistanceTo(double p_186679_1_, double p_186679_3_, double p_186679_5_)`
- `double squareDistanceTo(Vec3d vec)`
- `Vec3d subtract(double x, double y, double z)`
- `Vec3d subtract(Vec3d vec)`
- `Vec3d subtractReverse(Vec3d vec)`
- `java.lang.String toString()`

## Fields

- `double xCoord`
- `double yCoord`
- `double zCoord`
- `static Vec3d ZERO`