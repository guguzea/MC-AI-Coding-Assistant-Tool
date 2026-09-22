# PathNavigateSwimmer

**Inheritance:** java.lang.Object → net.minecraft.pathfinding.PathNavigate → net.minecraft.pathfinding.PathNavigateSwimmer

## Class signature

```java
public class PathNavigateSwimmer extends PathNavigate
```

## Methods

- `protected boolean canNavigate()` — If on ground or swimming and can swim
- `protected Vec3 getEntityPosition()`
- `protected PathFinder getPathFinder()`
- `protected boolean isDirectPathBetweenPoints(Vec3 posVec31, Vec3 posVec32, int sizeX, int sizeY, int sizeZ)` — Returns true when an entity of specified size could safely walk in a straight line between the two points.
- `protected void pathFollow()`
- `protected void removeSunnyPath()` — Trims path data from the end to the first sun covered block

## Fields

- `PathNavigateSwimmer`