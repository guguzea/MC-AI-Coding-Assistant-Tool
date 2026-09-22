---
title: "AxisAlignedBB"
description: "public class AxisAlignedBB extends java.lang.Object"
package: "net/minecraft/util/math"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/util/math/AxisAlignedBB.html"
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

- `AxisAlignedBB addCoord(double x, double y, double z)`
- `RayTraceResult calculateIntercept(Vec3d vecA, Vec3d vecB)`
- `double calculateXOffset(AxisAlignedBB other, double offsetX)`
- `double calculateYOffset(AxisAlignedBB other, double offsetY)`
- `double calculateZOffset(AxisAlignedBB other, double offsetZ)`
- `AxisAlignedBB contract(double value)`
- `boolean equals(java.lang.Object p_equals_1_)`
- `AxisAlignedBB expand(double x, double y, double z)`
- `AxisAlignedBB expandXyz(double value)`
- `double getAverageEdgeLength()`
- `Vec3d getCenter()`
- `int hashCode()`
- `boolean hasNaN()`
- `boolean intersects(double x1, double y1, double z1, double x2, double y2, double z2)`
- `boolean intersects(Vec3d min, Vec3d max)`
- `boolean intersectsWith(AxisAlignedBB other)`
- `boolean intersectsWithXY(Vec3d vec)`
- `boolean intersectsWithXZ(Vec3d vec)`
- `boolean intersectsWithYZ(Vec3d vec)`
- `boolean isVecInside(Vec3d vec)`
- `AxisAlignedBB offset(BlockPos pos)`
- `AxisAlignedBB offset(double x, double y, double z)`
- `AxisAlignedBB setMaxY(double y2)`
- `java.lang.String toString()`
- `AxisAlignedBB union(AxisAlignedBB other)`

## Fields

- `double maxX`
- `double maxY`
- `double maxZ`
- `double minX`
- `double minY`
- `double minZ`
