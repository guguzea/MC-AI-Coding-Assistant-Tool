---
title: "AxisAlignedBB"
description: "public class AxisAlignedBB extends java.lang.Object"
package: "net/minecraft/util/math"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/util/math/AxisAlignedBB.html"
sourceType: javadoc
---

# AxisAlignedBB

**Inheritance:** java.lang.Object → net.minecraft.util.math.AxisAlignedBB

## Class signature

```java
public class AxisAlignedBB extends java.lang.Object
```

## Constructors

- `AxisAlignedBB(BlockPos pos)`
- `AxisAlignedBB(BlockPos pos1, BlockPos pos2)`
- `AxisAlignedBB(double x1, double y1, double z1, double x2, double y2, double z2)`
- `AxisAlignedBB(Vec3d min, Vec3d max)`

## Methods

- `RayTraceResult calculateIntercept(Vec3d vecA, Vec3d vecB)`
- `double calculateXOffset(AxisAlignedBB other, double offsetX)`
- `double calculateYOffset(AxisAlignedBB other, double offsetY)`
- `double calculateZOffset(AxisAlignedBB other, double offsetZ)`
- `boolean contains(Vec3d vec)`
- `AxisAlignedBB contract(double x, double y, double z)`
- `boolean equals(java.lang.Object p_equals_1_)`
- `AxisAlignedBB expand(double x, double y, double z)`
- `double getAverageEdgeLength()`
- `Vec3d getCenter()`
- `AxisAlignedBB grow(double value)`
- `AxisAlignedBB grow(double x, double y, double z)`
- `int hashCode()`
- `boolean hasNaN()`
- `AxisAlignedBB intersect(AxisAlignedBB other)`
- `boolean intersects(AxisAlignedBB other)`
- `boolean intersects(double x1, double y1, double z1, double x2, double y2, double z2)`
- `boolean intersects(Vec3d min, Vec3d max)`
- `boolean intersectsWithXY(Vec3d vec)`
- `boolean intersectsWithXZ(Vec3d vec)`
- `boolean intersectsWithYZ(Vec3d vec)`
- `AxisAlignedBB offset(BlockPos pos)`
- `AxisAlignedBB offset(double x, double y, double z)`
- `AxisAlignedBB offset(Vec3d vec)`
- `AxisAlignedBB setMaxY(double y2)`
- `AxisAlignedBB shrink(double value)`
- `java.lang.String toString()`
- `AxisAlignedBB union(AxisAlignedBB other)`

## Fields

- `double maxX`
- `double maxY`
- `double maxZ`
- `double minX`
- `double minY`
- `double minZ`
