# AxisAlignedBB

**Inheritance:** java.lang.Object → net.minecraft.util.AxisAlignedBB

## Class signature

```java
public class AxisAlignedBB extends java.lang.Object
```

## Constructors

- `AxisAlignedBB(BlockPos pos1, BlockPos pos2)`
- `AxisAlignedBB(double x1, double y1, double z1, double x2, double y2, double z2)`

## Methods

- `AxisAlignedBB addCoord(double x, double y, double z)` — Adds the coordinates to the bounding box extending it if the point lies outside the current ranges.
- `MovingObjectPosition calculateIntercept(Vec3 vecA, Vec3 vecB)`
- `double calculateXOffset(AxisAlignedBB other, double offsetX)` — if instance and the argument bounding boxes overlap in the Y and Z dimensions, calculate the offset between them in the X dimension.
- `double calculateYOffset(AxisAlignedBB other, double offsetY)` — if instance and the argument bounding boxes overlap in the X and Z dimensions, calculate the offset between them in the Y dimension.
- `double calculateZOffset(AxisAlignedBB other, double offsetZ)` — if instance and the argument bounding boxes overlap in the Y and X dimensions, calculate the offset between them in the Z dimension.
- `AxisAlignedBB contract(double x, double y, double z)` — Returns a bounding box that is inset by the specified amounts
- `AxisAlignedBB expand(double x, double y, double z)` — Returns a bounding box expanded by the specified vector (if negative numbers are given it will shrink).
- `static AxisAlignedBB fromBounds(double x1, double y1, double z1, double x2, double y2, double z2)` — returns an AABB with corners x1, y1, z1 and x2, y2, z2
- `boolean func_181656_b()`
- `double getAverageEdgeLength()` — Returns the average length of the edges of the bounding box.
- `boolean intersectsWith(AxisAlignedBB other)` — Returns whether the given bounding box intersects with this one.
- `boolean isVecInside(Vec3 vec)` — Returns if the supplied Vec3D is completely inside the bounding box
- `AxisAlignedBB offset(double x, double y, double z)` — Offsets the current bounding box by the specified coordinates.
- `java.lang.String toString()`
- `AxisAlignedBB union(AxisAlignedBB other)`

## Fields

- `double maxX`
- `double maxY`
- `double maxZ`
- `double minX`
- `double minY`
- `double minZ`