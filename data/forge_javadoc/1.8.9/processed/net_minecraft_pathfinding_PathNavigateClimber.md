# PathNavigateClimber

**Inheritance:** java.lang.Object → net.minecraft.pathfinding.PathNavigate → net.minecraft.pathfinding.PathNavigateGround → net.minecraft.pathfinding.PathNavigateClimber

## Class signature

```java
public class PathNavigateClimber extends PathNavigateGround
```

## Methods

- `PathEntity getPathToEntityLiving(Entity entityIn)` — Returns the path to the given EntityLiving.
- `PathEntity getPathToPos(BlockPos pos)` — Returns path to given BlockPos
- `void onUpdateNavigation()`
- `boolean tryMoveToEntityLiving(Entity entityIn, double speedIn)` — Try to find and set a path to EntityLiving.

## Fields

- `PathNavigateClimber`