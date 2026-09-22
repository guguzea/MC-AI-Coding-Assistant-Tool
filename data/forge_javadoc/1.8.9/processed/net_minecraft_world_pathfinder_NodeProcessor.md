# NodeProcessor

**Inheritance:** java.lang.Object → net.minecraft.world.pathfinder.NodeProcessor

## Class signature

```java
public abstract class NodeProcessor extends java.lang.Object
```

## Constructors

- `NodeProcessor()`

## Methods

- `abstract int findPathOptions(PathPoint [] pathOptions, Entity entityIn, PathPoint currentPoint, PathPoint targetPoint, float maxDistance)`
- `abstract PathPoint getPathPointTo(Entity entityIn)` — Returns given entity's position as PathPoint
- `abstract PathPoint getPathPointToCoords(Entity entityIn, double x, double y, double target)` — Returns PathPoint for given coordinates
- `void initProcessor(IBlockAccess iblockaccessIn, Entity entityIn)`
- `protected PathPoint openPoint(int x, int y, int z)` — Returns a mapped point or creates and adds one
- `void postProcess()` — This method is called when all nodes have been processed and PathEntity is created.

## Fields

- `protected IBlockAccess blockaccess`
- `protected int entitySizeX`
- `protected int entitySizeY`
- `protected int entitySizeZ`
- `protected IntHashMap<PathPoint> pointMap`