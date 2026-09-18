# SwimNodeProcessor

## Class signature

```java
public class SwimNodeProcessor extends NodeProcessor
```

## Constructors

- `public SwimNodeProcessor()`

## Methods

- `public PathPoint getStart()`
- `public PathPoint getPathPointToCoords(double x, double y, double z)`
- `public int findPathOptions( PathPoint [] pathOptions, PathPoint currentPoint, PathPoint targetPoint, float maxDistance)`
- `public PathNodeType getPathNodeType( IBlockAccess blockaccessIn, int x, int y, int z, EntityLiving entitylivingIn, int xSize, int ySize, int zSize, boolean canBreakDoorsIn, boolean canEnterDoorsIn)`
- `public PathNodeType getPathNodeType( IBlockAccess blockaccessIn, int x, int y, int z)`