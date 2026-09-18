# FlyingNodeProcessor

## Class signature

```java
public class FlyingNodeProcessor extends WalkNodeProcessor
```

## Constructors

- `public FlyingNodeProcessor()`

## Methods

- `public void init( IBlockAccess sourceIn, EntityLiving mob)`
- `public void postProcess()`
- `public PathPoint getStart()`
- `public PathPoint getPathPointToCoords(double x, double y, double z)`
- `public int findPathOptions( PathPoint [] pathOptions, PathPoint currentPoint, PathPoint targetPoint, float maxDistance)`
- `protected PathPoint openPoint(int x, int y, int z)`
- `public PathNodeType getPathNodeType( IBlockAccess blockaccessIn, int x, int y, int z, EntityLiving entitylivingIn, int xSize, int ySize, int zSize, boolean canBreakDoorsIn, boolean canEnterDoorsIn)`
- `public PathNodeType getPathNodeType( IBlockAccess blockaccessIn, int x, int y, int z)`