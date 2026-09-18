# Vec3d

## Class signature

```java
public class Vec3d extends java.lang.Object
```

## Constructors

- `public Vec3d(double x, double y, double z)`
- `public Vec3d( Vec3i vector)`

## Methods

- `public Vec3d subtractReverse( Vec3d vec)`
- `public Vec3d normalize()`
- `public double dotProduct( Vec3d vec)`
- `public Vec3d crossProduct( Vec3d vec)`
- `public Vec3d subtract( Vec3d vec)`
- `public Vec3d subtract(double x, double y, double z)`
- `public Vec3d add( Vec3d vec)`
- `public Vec3d addVector(double x, double y, double z)`
- `public double distanceTo( Vec3d vec)`
- `public double squareDistanceTo( Vec3d vec)`
- `public double squareDistanceTo(double p_186679_1_, double p_186679_3_, double p_186679_5_)`
- `public Vec3d scale(double p_186678_1_)`
- `public double lengthVector()`
- `@Nullable public Vec3d getIntermediateWithXValue( Vec3d vec, double x)`
- `@Nullable public Vec3d getIntermediateWithYValue( Vec3d vec, double y)`
- `@Nullable public Vec3d getIntermediateWithZValue( Vec3d vec, double z)`
- `public boolean equals(java.lang.Object p_equals_1_)`
- `public int hashCode()`
- `public java.lang.String toString()`
- `public Vec3d rotatePitch(float pitch)`
- `public Vec3d rotateYaw(float yaw)`