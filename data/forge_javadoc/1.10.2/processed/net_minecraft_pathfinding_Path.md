# Path

## Class signature

```java
public class Path extends java.lang.Object
```

## Constructors

- `public Path( PathPoint [] pathpoints)`

## Methods

- `public void incrementPathIndex()`
- `public boolean isFinished()`
- `public PathPoint getFinalPathPoint()`
- `public PathPoint getPathPointFromIndex(int index)`
- `public void setPoint(int index, PathPoint point)`
- `public int getCurrentPathLength()`
- `public void setCurrentPathLength(int length)`
- `public int getCurrentPathIndex()`
- `public void setCurrentPathIndex(int currentPathIndexIn)`
- `public Vec3d getVectorFromIndex( Entity entityIn, int index)`
- `public Vec3d getPosition( Entity entityIn)`
- `public Vec3d getCurrentPos()`
- `public boolean isSamePath( Path pathentityIn)`
- `public PathPoint [] getOpenSet()`
- `public PathPoint [] getClosedSet()`
- `public PathPoint getTarget()`
- `public static Path read( PacketBuffer buf)`