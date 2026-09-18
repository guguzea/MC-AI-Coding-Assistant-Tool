# NodeProcessor

## Class signature

```java
public abstract class NodeProcessor extends java.lang.Object
```

## Constructors

- `public NodeProcessor()`

## Methods

- `public void initProcessor( IBlockAccess sourceIn, EntityLiving mob)`
- `public void postProcess()`
- `protected PathPoint openPoint(int x, int y, int z)`
- `public abstract PathPoint getStart()`
- `public abstract PathPoint getPathPointToCoords(double x, double y, double z)`
- `public abstract int findPathOptions( PathPoint [] pathOptions, PathPoint currentPoint, PathPoint targetPoint, float maxDistance)`
- `public abstract PathNodeType getPathNodeType( IBlockAccess blockaccessIn, int x, int y, int z, EntityLiving entitylivingIn, int xSize, int ySize, int zSize, boolean canBreakDoorsIn, boolean canEnterDoorsIn)`
- `public abstract PathNodeType getPathNodeType( IBlockAccess blockaccessIn, int x, int y, int z)`
- `public void setCanEnterDoors(boolean canEnterDoorsIn)`
- `public void setCanBreakDoors(boolean canBreakDoorsIn)`
- `public void setCanSwim(boolean canSwimIn)`
- `public boolean getCanEnterDoors()`
- `public boolean getCanBreakDoors()`
- `public boolean getCanSwim()`