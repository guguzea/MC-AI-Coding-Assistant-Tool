# SwimNodeProcessor

## Class signature

```java
public class SwimNodeProcessor extends NodeProcessor
```

## Constructors

- `public SwimNodeProcessor()`

## Methods

- `public void initProcessor( IBlockAccess iblockaccessIn, Entity entityIn)`
- `public void postProcess()`
- `public PathPoint getPathPointTo( Entity entityIn)`
- `public PathPoint getPathPointToCoords( Entity entityIn, double x, double y, double target)`
- `public int findPathOptions( PathPoint [] pathOptions, Entity entityIn, PathPoint currentPoint, PathPoint targetPoint, float maxDistance)`

## Description

Returns given entity's position as PathPoint