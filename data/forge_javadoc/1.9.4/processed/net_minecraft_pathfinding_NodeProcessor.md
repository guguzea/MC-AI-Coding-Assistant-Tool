# NodeProcessor

**Inheritance:** java.lang.Object → net.minecraft.pathfinding.NodeProcessor

## Class signature

```java
public abstract class NodeProcessor extends java.lang.Object
```

## Constructors

- `NodeProcessor()`

## Methods

- `abstract int findPathOptions(PathPoint [] pathOptions, PathPoint currentPoint, PathPoint targetPoint, float maxDistance)`
- `boolean getCanBreakDoors()`
- `boolean getCanEnterDoors()`
- `boolean getCanSwim()`
- `abstract PathNodeType getPathNodeType(IBlockAccess x, int y, int z, int p_186330_4_)`
- `abstract PathNodeType getPathNodeType(IBlockAccess blockaccessIn, int x, int y, int z, EntityLiving entitylivingIn, int xSize, int ySize, int zSize, boolean canBreakDoorsIn, boolean canEnterDoorsIn)`
- `abstract PathPoint getPathPointToCoords(double x, double y, double z)`
- `abstract PathPoint getStart()`
- `void initProcessor(IBlockAccess sourceIn, EntityLiving mob)`
- `protected PathPoint openPoint(int x, int y, int z)`
- `void postProcess()`
- `void setCanBreakDoors(boolean canBreakDoorsIn)`
- `void setCanEnterDoors(boolean canEnterDoorsIn)`
- `void setCanSwim(boolean canSwimIn)`

## Fields

- `protected IBlockAccess blockaccess`
- `protected boolean canBreakDoors`
- `protected boolean canEnterDoors`
- `protected boolean canSwim`
- `protected EntityLiving entity`
- `protected int entitySizeX`
- `protected int entitySizeY`
- `protected int entitySizeZ`
- `protected IntHashMap<PathPoint> pointMap`