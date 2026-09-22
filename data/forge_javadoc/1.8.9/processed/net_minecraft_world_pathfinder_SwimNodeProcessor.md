# SwimNodeProcessor

**Inheritance:** java.lang.Object → net.minecraft.world.pathfinder.NodeProcessor → net.minecraft.world.pathfinder.SwimNodeProcessor

## Class signature

```java
public class SwimNodeProcessor extends NodeProcessor
```

## Methods

- `int findPathOptions(PathPoint [] pathOptions, Entity entityIn, PathPoint currentPoint, PathPoint targetPoint, float maxDistance)`
- `PathPoint getPathPointTo(Entity entityIn)` — Returns given entity's position as PathPoint
- `PathPoint getPathPointToCoords(Entity entityIn, double x, double y, double target)` — Returns PathPoint for given coordinates
- `void initProcessor(IBlockAccess iblockaccessIn, Entity entityIn)`
- `void postProcess()` — This method is called when all nodes have been processed and PathEntity is created.

## Fields

- `SwimNodeProcessor`