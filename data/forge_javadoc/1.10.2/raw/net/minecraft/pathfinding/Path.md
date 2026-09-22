---
title: "Path"
description: "public class Path extends java.lang.Object"
package: "net/minecraft/pathfinding"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/pathfinding/Path.html"
sourceType: javadoc
---

# Path

**Inheritance:** java.lang.Object → net.minecraft.pathfinding.Path

## Class signature

```java
public class Path extends java.lang.Object
```

## Constructors

- `Path(PathPoint [] pathpoints)`

## Methods

- `PathPoint [] getClosedSet()`
- `int getCurrentPathIndex()`
- `int getCurrentPathLength()`
- `Vec3d getCurrentPos()`
- `PathPoint getFinalPathPoint()`
- `PathPoint [] getOpenSet()`
- `PathPoint getPathPointFromIndex(int index)`
- `Vec3d getPosition(Entity entityIn)`
- `PathPoint getTarget()`
- `Vec3d getVectorFromIndex(Entity entityIn, int index)`
- `void incrementPathIndex()`
- `boolean isFinished()`
- `boolean isSamePath(Path pathentityIn)`
- `static Path read(PacketBuffer buf)`
- `void setCurrentPathIndex(int currentPathIndexIn)`
- `void setCurrentPathLength(int length)`
- `void setPoint(int index, PathPoint point)`
