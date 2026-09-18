# AxisAlignedBB

## Class signature

```java
public class AxisAlignedBB extends java.lang.Object
```

## Constructors

- `public AxisAlignedBB(double x1, double y1, double z1, double x2, double y2, double z2)`
- `public AxisAlignedBB( BlockPos pos1, BlockPos pos2)`

## Methods

- `public AxisAlignedBB addCoord(double x, double y, double z)`
- `public AxisAlignedBB expand(double x, double y, double z)`
- `public AxisAlignedBB union( AxisAlignedBB other)`
- `public static AxisAlignedBB fromBounds(double x1, double y1, double z1, double x2, double y2, double z2)`
- `public AxisAlignedBB offset(double x, double y, double z)`
- `public double calculateXOffset( AxisAlignedBB other, double offsetX)`
- `public double calculateYOffset( AxisAlignedBB other, double offsetY)`
- `public double calculateZOffset( AxisAlignedBB other, double offsetZ)`
- `public boolean intersectsWith( AxisAlignedBB other)`
- `public boolean isVecInside( Vec3 vec)`
- `public double getAverageEdgeLength()`
- `public AxisAlignedBB contract(double x, double y, double z)`
- `public MovingObjectPosition calculateIntercept( Vec3 vecA, Vec3 vecB)`
- `public java.lang.String toString()`
- `public boolean func_181656_b()`

## Description

Adds the coordinates to the bounding box extending it if the point lies outside the current ranges.