# FlyingNodeProcessor

**Inheritance:** java.lang.Object → net.minecraft.pathfinding.NodeProcessor → net.minecraft.pathfinding.WalkNodeProcessor → net.minecraft.pathfinding.FlyingNodeProcessor

## Class signature

```java
public class FlyingNodeProcessor extends WalkNodeProcessor
```

## Methods

- `int findPathOptions(PathPoint [] pathOptions, PathPoint currentPoint, PathPoint targetPoint, float maxDistance)`
- `PathNodeType getPathNodeType(IBlockAccess blockaccessIn, int x, int y, int z)`
- `PathNodeType getPathNodeType(IBlockAccess blockaccessIn, int x, int y, int z, EntityLiving entitylivingIn, int xSize, int ySize, int zSize, boolean canBreakDoorsIn, boolean canEnterDoorsIn)`
- `PathPoint getPathPointToCoords(double x, double y, double z)`
- `PathPoint getStart()`
- `void init(IBlockAccess sourceIn, EntityLiving mob)`
- `protected PathPoint openPoint(int x, int y, int z)`
- `void postProcess()`

## Fields

- `FlyingNodeProcessor`