# PathPoint

## Class signature

```java
public class PathPoint extends java.lang.Object
```

## Constructors

- `public PathPoint(int x, int y, int z)`

## Methods

- `public PathPoint cloneMove(int x, int y, int z)`
- `public static int makeHash(int x, int y, int z)`
- `public float distanceTo( PathPoint pathpointIn)`
- `public float distanceToSquared( PathPoint pathpointIn)`
- `public float distanceManhattan( PathPoint p_186281_1_)`
- `public boolean equals(java.lang.Object p_equals_1_)`
- `public int hashCode()`
- `public boolean isAssigned()`
- `public java.lang.String toString()`
- `public static PathPoint createFromBuffer( PacketBuffer buf)`