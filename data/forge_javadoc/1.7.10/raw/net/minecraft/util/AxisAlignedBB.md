---
title: "AxisAlignedBB"
description: "public class AxisAlignedBB extends java.lang.Object"
package: "net/minecraft/util"
version: "1.7.10"
forgeBuild: "10.13.4.1614"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/net/minecraft/util/AxisAlignedBB.html"
sourceType: javadoc
---

# AxisAlignedBB

**Inheritance:** java.lang.Object → net.minecraft.util.AxisAlignedBB

## Class signature

```java
public class AxisAlignedBB extends java.lang.Object
```

## Constructors

- `AxisAlignedBB(double p_i2300_1_, double p_i2300_3_, double p_i2300_5_, double p_i2300_7_, double p_i2300_9_, double p_i2300_11_)`

## Methods

- `AxisAlignedBB addCoord(double p_72321_1_, double p_72321_3_, double p_72321_5_)`
- `MovingObjectPosition calculateIntercept(Vec3 p_72327_1_, Vec3 p_72327_2_)`
- `double calculateXOffset(AxisAlignedBB p_72316_1_, double p_72316_2_)`
- `double calculateYOffset(AxisAlignedBB p_72323_1_, double p_72323_2_)`
- `double calculateZOffset(AxisAlignedBB p_72322_1_, double p_72322_2_)`
- `AxisAlignedBB contract(double p_72331_1_, double p_72331_3_, double p_72331_5_)`
- `AxisAlignedBB copy()`
- `AxisAlignedBB expand(double p_72314_1_, double p_72314_3_, double p_72314_5_)`
- `AxisAlignedBB func_111270_a(AxisAlignedBB p_111270_1_)`
- `double getAverageEdgeLength()`
- `static AxisAlignedBB getBoundingBox(double p_72330_0_, double p_72330_2_, double p_72330_4_, double p_72330_6_, double p_72330_8_, double p_72330_10_)`
- `AxisAlignedBB getOffsetBoundingBox(double p_72325_1_, double p_72325_3_, double p_72325_5_)`
- `boolean intersectsWith(AxisAlignedBB p_72326_1_)`
- `boolean isVecInside(Vec3 p_72318_1_)`
- `AxisAlignedBB offset(double p_72317_1_, double p_72317_3_, double p_72317_5_)`
- `void setBB(AxisAlignedBB p_72328_1_)`
- `AxisAlignedBB setBounds(double p_72324_1_, double p_72324_3_, double p_72324_5_, double p_72324_7_, double p_72324_9_, double p_72324_11_)`
- `java.lang.String toString()`

## Fields

- `double maxX`
- `double maxY`
- `double maxZ`
- `double minX`
- `double minY`
- `double minZ`
