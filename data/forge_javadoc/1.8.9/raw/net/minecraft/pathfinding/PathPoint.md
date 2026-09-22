---
title: "PathPoint"
description: "public class PathPoint extends java.lang.Object"
package: "net/minecraft/pathfinding"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/pathfinding/PathPoint.html"
sourceType: javadoc
---

# PathPoint

**Inheritance:** java.lang.Object → net.minecraft.pathfinding.PathPoint

## Class signature

```java
public class PathPoint extends java.lang.Object
```

## Constructors

- `PathPoint(int x, int y, int z)`

## Methods

- `float distanceTo(PathPoint pathpointIn)` — Returns the linear distance to another path point
- `float distanceToSquared(PathPoint pathpointIn)` — Returns the squared distance to another path point
- `boolean equals(java.lang.Object p_equals_1_)`
- `int hashCode()`
- `boolean isAssigned()` — Returns true if this point has already been assigned to a path
- `static int makeHash(int x, int y, int z)`
- `java.lang.String toString()`

## Fields

- `boolean visited` — True if the pathfinder has already visited this point
- `int xCoord` — The x coordinate of this point
- `int yCoord` — The y coordinate of this point
- `int zCoord` — The z coordinate of this point
