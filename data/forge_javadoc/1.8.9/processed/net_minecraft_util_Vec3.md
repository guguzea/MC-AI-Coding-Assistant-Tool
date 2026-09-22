# Vec3

**Inheritance:** java.lang.Object → net.minecraft.util.Vec3

## Class signature

```java
public class Vec3 extends java.lang.Object
```

## Constructors

- `Vec3(double x, double y, double z)`
- `Vec3(Vec3i p_i46377_1_)`

## Methods

- `Vec3 add(Vec3 vec)`
- `Vec3 addVector(double x, double y, double z)` — Adds the specified x,y,z vector components to this vector and returns the resulting vector.
- `Vec3 crossProduct(Vec3 vec)` — Returns a new vector with the result of this vector x the specified vector.
- `double distanceTo(Vec3 vec)` — Euclidean distance between this and the specified vector, returned as double.
- `double dotProduct(Vec3 vec)`
- `Vec3 getIntermediateWithXValue(Vec3 vec, double x)` — Returns a new vector with x value equal to the second parameter, along the line between this vector and the passed in vector, or null if not possible.
- `Vec3 getIntermediateWithYValue(Vec3 vec, double y)` — Returns a new vector with y value equal to the second parameter, along the line between this vector and the passed in vector, or null if not possible.
- `Vec3 getIntermediateWithZValue(Vec3 vec, double z)` — Returns a new vector with z value equal to the second parameter, along the line between this vector and the passed in vector, or null if not possible.
- `double lengthVector()` — Returns the length of the vector.
- `Vec3 normalize()` — Normalizes the vector to a length of 1 (except if it is the zero vector)
- `Vec3 rotatePitch(float pitch)`
- `Vec3 rotateYaw(float yaw)`
- `double squareDistanceTo(Vec3 vec)` — The square of the Euclidean distance between this and the specified vector.
- `Vec3 subtract(double x, double y, double z)`
- `Vec3 subtract(Vec3 vec)`
- `Vec3 subtractReverse(Vec3 vec)` — Returns a new vector with the result of the specified vector minus this.
- `java.lang.String toString()`

## Fields

- `double xCoord` — X coordinate of Vec3D
- `double yCoord` — Y coordinate of Vec3D
- `double zCoord` — Z coordinate of Vec3D