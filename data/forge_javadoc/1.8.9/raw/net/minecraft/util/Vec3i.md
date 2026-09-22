---
title: "Vec3i"
description: "public class Vec3i extends java.lang.Object implements java.lang.Comparable<Vec3i>"
package: "net/minecraft/util"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/util/Vec3i.html"
sourceType: javadoc
---

# Vec3i

**Inheritance:** java.lang.Object → net.minecraft.util.Vec3i

## Class signature

```java
public class Vec3i extends java.lang.Object implements java.lang.Comparable<Vec3i>
```

## Constructors

- `Vec3i(double xIn, double yIn, double zIn)`
- `Vec3i(int xIn, int yIn, int zIn)`

## Methods

- `int compareTo(Vec3i p_compareTo_1_)`
- `Vec3i crossProduct(Vec3i vec)` — Calculate the cross product of this and the given Vector
- `double distanceSq(double toX, double toY, double toZ)` — Calculate squared distance to the given coordinates
- `double distanceSq(Vec3i to)` — Calculate squared distance to the given Vector
- `double distanceSqToCenter(double xIn, double yIn, double zIn)` — Compute square of distance from point x, y, z to center of this Block
- `boolean equals(java.lang.Object p_equals_1_)`
- `int getX()` — Get the X coordinate
- `int getY()` — Get the Y coordinate
- `int getZ()` — Get the Z coordinate
- `int hashCode()`
- `java.lang.String toString()`

## Fields

- `static Vec3i NULL_VECTOR` — The Null vector constant (0, 0, 0)
