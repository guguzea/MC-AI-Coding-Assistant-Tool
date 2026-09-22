---
title: "RayTraceResult"
description: "public class RayTraceResult extends java.lang.Object"
package: "net/minecraft/util/math"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/util/math/RayTraceResult.html"
sourceType: javadoc
---

# RayTraceResult

**Inheritance:** java.lang.Object → net.minecraft.util.math.RayTraceResult

## Class signature

```java
public class RayTraceResult extends java.lang.Object
```

## Constructors

- `RayTraceResult(Entity entityIn)`
- `RayTraceResult(Entity entityHitIn, Vec3d hitVecIn)`
- `RayTraceResult(RayTraceResult.Type typeIn, Vec3d hitVecIn, EnumFacing sideHitIn, BlockPos blockPosIn)`
- `RayTraceResult(Vec3d hitVecIn, EnumFacing sideHitIn)`
- `RayTraceResult(Vec3d hitVecIn, EnumFacing sideHitIn, BlockPos blockPosIn)`

## Methods

- `BlockPos getBlockPos()`
- `java.lang.String toString()`

## Fields

- `Entity entityHit`
- `java.lang.Object hitInfo` — Used to add extra hit info
- `Vec3d hitVec`
- `EnumFacing sideHit`
- `int subHit` — Used to determine what sub-segment is hit
- `RayTraceResult.Type typeOfHit`
