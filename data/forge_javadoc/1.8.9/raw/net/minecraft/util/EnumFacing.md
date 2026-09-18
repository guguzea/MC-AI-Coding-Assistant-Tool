---
title: "EnumFacing"
description: "All Facings with horizontal axis in order S-W-N-E"
package: "net/minecraft/util"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/util/EnumFacing.html"
sourceType: javadoc
---

# EnumFacing

## Class signature

```java
public enum EnumFacing extends java.lang.Enum< EnumFacing > implements IStringSerializable
```

## Methods

- `public static EnumFacing [] values()`
- `public static EnumFacing valueOf(java.lang.String name)`
- `public int getIndex()`
- `public int getHorizontalIndex()`
- `public EnumFacing.AxisDirection getAxisDirection()`
- `public EnumFacing getOpposite()`
- `public EnumFacing rotateAround( EnumFacing.Axis axis)`
- `public EnumFacing rotateY()`
- `public EnumFacing rotateYCCW()`
- `public int getFrontOffsetX()`
- `public int getFrontOffsetY()`
- `public int getFrontOffsetZ()`
- `public java.lang.String getName2()`
- `public EnumFacing.Axis getAxis()`
- `public static EnumFacing byName(java.lang.String name)`
- `public static EnumFacing getFront(int index)`
- `public static EnumFacing getHorizontal(int p_176731_0_)`
- `public static EnumFacing fromAngle(double angle)`
- `public static EnumFacing random(java.util.Random rand)`
- `public static EnumFacing getFacingFromVector(float p_176737_0_, float p_176737_1_, float p_176737_2_)`
- `public java.lang.String toString()`
- `public java.lang.String getName()`
- `public static EnumFacing func_181076_a( EnumFacing.AxisDirection p_181076_0_, EnumFacing.Axis p_181076_1_)`
- `public Vec3i getDirectionVec()`

## Description

All Facings with horizontal axis in order S-W-N-E
