# PathEntity

**Inheritance:** java.lang.Object → net.minecraft.pathfinding.PathEntity

## Class signature

```java
public class PathEntity extends java.lang.Object
```

## Constructors

- `PathEntity(PathPoint [] pathpoints)`

## Methods

- `int getCurrentPathIndex()`
- `int getCurrentPathLength()`
- `PathPoint getFinalPathPoint()` — returns the last PathPoint of the Array
- `PathPoint getPathPointFromIndex(int index)` — return the PathPoint located at the specified PathIndex, usually the current one
- `Vec3 getPosition(Entity entityIn)` — returns the current PathEntity target node as Vec3D
- `Vec3 getVectorFromIndex(Entity entityIn, int index)` — Gets the vector of the PathPoint associated with the given index.
- `void incrementPathIndex()` — Directs this path to the next point in its array
- `boolean isDestinationSame(Vec3 vec)` — Returns true if the final PathPoint in the PathEntity is equal to Vec3D coords.
- `boolean isFinished()` — Returns true if this path has reached the end
- `boolean isSamePath(PathEntity pathentityIn)` — Returns true if the EntityPath are the same.
- `void setCurrentPathIndex(int currentPathIndexIn)`
- `void setCurrentPathLength(int length)`