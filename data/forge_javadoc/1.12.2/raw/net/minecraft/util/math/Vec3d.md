---
title: "Vec3d"
description: "public class Vec3d extends java.lang.Object"
package: "net/minecraft/util/math"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/util/math/Vec3d.html"
sourceType: javadoc
---

# Vec3d

## Class signature

```java
public class Vec3d extends java.lang.Object
```

## Constructors

- `public Vec3d(double xIn, double yIn, double zIn)`
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
- `public double squareDistanceTo(double xIn, double yIn, double zIn)`
- `public Vec3d scale(double factor)`
- `public double lengthVector()`
- `public double lengthSquared()`
- `public Vec3d getIntermediateWithXValue( Vec3d vec, double x)`
- `public Vec3d getIntermediateWithYValue( Vec3d vec, double y)`
- `public Vec3d getIntermediateWithZValue( Vec3d vec, double z)`
- `public boolean equals(java.lang.Object p_equals_1_)`
- `public int hashCode()`
- `public java.lang.String toString()`
- `public Vec3d rotatePitch(float pitch)`
- `public Vec3d rotateYaw(float yaw)`
- `public static Vec3d fromPitchYawVector( Vec2f p_189984_0_)`
- `public static Vec3d fromPitchYaw(float p_189986_0_, float p_189986_1_)`
