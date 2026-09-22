# PathNavigate

**Inheritance:** java.lang.Object → net.minecraft.pathfinding.PathNavigate

## Class signature

```java
public abstract class PathNavigate extends java.lang.Object
```

## Constructors

- `PathNavigate(EntityLiving entitylivingIn, World worldIn)`

## Methods

- `protected abstract boolean canNavigate()` — If on ground or swimming and can swim
- `protected void checkForStuck(Vec3 positionVec3)` — Checks if entity haven't been moved when last checked and if so, clears current PathEntity
- `void clearPathEntity()` — sets active PathEntity to null
- `protected abstract Vec3 getEntityPosition()`
- `PathEntity getPath()` — gets the actively used PathEntity
- `protected abstract PathFinder getPathFinder()`
- `float getPathSearchRange()` — Gets the maximum distance that the path finding will search in.
- `PathEntity getPathToEntityLiving(Entity entityIn)` — Returns the path to the given EntityLiving.
- `PathEntity getPathToPos(BlockPos pos)` — Returns path to given BlockPos
- `PathEntity getPathToXYZ(double x, double y, double z)` — Returns the path to the given coordinates.
- `protected abstract boolean isDirectPathBetweenPoints(Vec3 posVec31, Vec3 posVec32, int sizeX, int sizeY, int sizeZ)` — Returns true when an entity of specified size could safely walk in a straight line between the two points.
- `protected boolean isInLiquid()` — Returns true if the entity is in water or lava, false otherwise
- `boolean noPath()` — If null path or reached the end
- `void onUpdateNavigation()`
- `protected void pathFollow()`
- `protected void removeSunnyPath()` — Trims path data from the end to the first sun covered block
- `void setHeightRequirement(float jumpHeight)` — Sets vertical space requirement for path
- `boolean setPath(PathEntity pathentityIn, double speedIn)` — Sets a new path.
- `void setSpeed(double speedIn)` — Sets the speed
- `boolean tryMoveToEntityLiving(Entity entityIn, double speedIn)` — Try to find and set a path to EntityLiving.
- `boolean tryMoveToXYZ(double x, double y, double z, double speedIn)` — Try to find and set a path to XYZ.

## Fields

- `protected PathEntity currentPath` — The PathEntity being followed.
- `protected double speed`
- `protected EntityLiving theEntity`
- `protected World worldObj`