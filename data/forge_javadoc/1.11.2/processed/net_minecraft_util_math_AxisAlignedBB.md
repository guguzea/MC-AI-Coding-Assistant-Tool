# AxisAlignedBB

## Class signature

```java
public class AxisAlignedBB extends java.lang.Object
```

## Constructors

- `public AxisAlignedBB(double x1, double y1, double z1, double x2, double y2, double z2)`
- `public AxisAlignedBB( BlockPos pos)`
- `public AxisAlignedBB( BlockPos pos1, BlockPos pos2)`
- `public AxisAlignedBB( Vec3d min, Vec3d max)`

## Methods

- `public AxisAlignedBB setMaxY(double y2)`
- `public boolean equals(java.lang.Object p_equals_1_)`
- `public int hashCode()`
- `public AxisAlignedBB contract(double p_191195_1_, double p_191195_3_, double p_191195_5_)`
- `public AxisAlignedBB addCoord(double x, double y, double z)`
- `public AxisAlignedBB expand(double x, double y, double z)`
- `public AxisAlignedBB expandXyz(double value)`
- `public AxisAlignedBB intersect( AxisAlignedBB p_191500_1_)`
- `public AxisAlignedBB union( AxisAlignedBB other)`
- `public AxisAlignedBB offset(double x, double y, double z)`
- `public AxisAlignedBB offset( BlockPos pos)`
- `public AxisAlignedBB move( Vec3d p_191194_1_)`
- `public double calculateXOffset( AxisAlignedBB other, double offsetX)`
- `public double calculateYOffset( AxisAlignedBB other, double offsetY)`
- `public double calculateZOffset( AxisAlignedBB other, double offsetZ)`
- `public boolean intersectsWith( AxisAlignedBB other)`
- `public boolean intersects(double x1, double y1, double z1, double x2, double y2, double z2)`
- `public boolean intersects( Vec3d min, Vec3d max)`
- `public boolean isVecInside( Vec3d vec)`
- `public double getAverageEdgeLength()`
- `public AxisAlignedBB contract(double value)`
- `@Nullable public RayTraceResult calculateIntercept( Vec3d vecA, Vec3d vecB)`
- `public boolean intersectsWithYZ( Vec3d vec)`
- `public boolean intersectsWithXZ( Vec3d vec)`
- `public boolean intersectsWithXY( Vec3d vec)`
- `public java.lang.String toString()`
- `public boolean hasNaN()`
- `public Vec3d getCenter()`