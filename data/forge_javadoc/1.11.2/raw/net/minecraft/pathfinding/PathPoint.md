---
title: "PathPoint"
description: "public class PathPoint extends java.lang.Object"
package: "net/minecraft/pathfinding"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/pathfinding/PathPoint.html"
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

- `PathPoint cloneMove(int x, int y, int z)`
- `static PathPoint createFromBuffer(PacketBuffer buf)`
- `float distanceManhattan(PathPoint p_186281_1_)`
- `float distanceTo(PathPoint pathpointIn)`
- `float distanceToSquared(PathPoint pathpointIn)`
- `boolean equals(java.lang.Object p_equals_1_)`
- `int hashCode()`
- `boolean isAssigned()`
- `static int makeHash(int x, int y, int z)`
- `java.lang.String toString()`

## Fields

- `float cost`
- `float costMalus`
- `float distanceFromOrigin`
- `float distanceToNext`
- `float distanceToTarget`
- `int index`
- `PathNodeType nodeType`
- `PathPoint previous`
- `float totalPathDistance`
- `boolean visited`
- `int xCoord`
- `int yCoord`
- `int zCoord`
