# Path

**Inheritance:** java.lang.Object → net.minecraft.pathfinding.Path

## Class signature

```java
public class Path extends java.lang.Object
```

## Constructors

- `Path()`

## Methods

- `PathPoint addPoint(PathPoint point)` — Adds a point to the path
- `void changeDistance(PathPoint p_75850_1_, float p_75850_2_)` — Changes the provided point's distance to target
- `void clearPath()` — Clears the path
- `PathPoint dequeue()` — Returns and removes the first point in the path
- `boolean isPathEmpty()` — Returns true if this path contains no points