# PathEntity

## Class signature

```java
public class PathEntity extends java.lang.Object
```

## Constructors

- `public PathEntity( PathPoint [] pathpoints)`

## Methods

- `public void incrementPathIndex()`
- `public boolean isFinished()`
- `public PathPoint getFinalPathPoint()`
- `public PathPoint getPathPointFromIndex(int index)`
- `public int getCurrentPathLength()`
- `public void setCurrentPathLength(int length)`
- `public int getCurrentPathIndex()`
- `public void setCurrentPathIndex(int currentPathIndexIn)`
- `public Vec3 getVectorFromIndex( Entity entityIn, int index)`
- `public Vec3 getPosition( Entity entityIn)`
- `public boolean isSamePath( PathEntity pathentityIn)`
- `public boolean isDestinationSame( Vec3 vec)`

## Description

returns the last PathPoint of the Array