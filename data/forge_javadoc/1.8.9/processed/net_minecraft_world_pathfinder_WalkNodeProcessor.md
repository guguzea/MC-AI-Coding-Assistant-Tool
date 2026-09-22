# WalkNodeProcessor

**Inheritance:** java.lang.Object → net.minecraft.world.pathfinder.NodeProcessor → net.minecraft.world.pathfinder.WalkNodeProcessor

## Class signature

```java
public class WalkNodeProcessor extends NodeProcessor
```

## Methods

- `int findPathOptions(PathPoint [] pathOptions, Entity entityIn, PathPoint currentPoint, PathPoint targetPoint, float maxDistance)`
- `static int func_176170_a(IBlockAccess blockaccessIn, Entity entityIn, int x, int y, int z, int sizeX, int sizeY, int sizeZ, boolean avoidWater, boolean breakDoors, boolean enterDoors)`
- `boolean getAvoidsWater()`
- `boolean getCanSwim()`
- `boolean getEnterDoors()`
- `PathPoint getPathPointTo(Entity entityIn)` — Returns given entity's position as PathPoint
- `PathPoint getPathPointToCoords(Entity entityIn, double x, double y, double target)` — Returns PathPoint for given coordinates
- `void initProcessor(IBlockAccess iblockaccessIn, Entity entityIn)`
- `void postProcess()` — This method is called when all nodes have been processed and PathEntity is created.
- `void setAvoidsWater(boolean avoidsWaterIn)`
- `void setBreakDoors(boolean canBreakDoorsIn)`
- `void setCanSwim(boolean canSwimIn)`
- `void setEnterDoors(boolean canEnterDoorsIn)`

## Fields

- `WalkNodeProcessor`