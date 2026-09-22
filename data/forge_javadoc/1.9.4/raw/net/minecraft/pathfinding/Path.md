---
title: "Path"
description: "public class Path extends java.lang.Object"
package: "net/minecraft/pathfinding"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/pathfinding/Path.html"
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

- `int getCurrentPathIndex()`
- `int getCurrentPathLength()`
- `Vec3d getCurrentPos()`
- `PathPoint getFinalPathPoint()`
- `PathPoint getPathPointFromIndex(int index)`
- `Vec3d getPosition(Entity entityIn)`
- `Vec3d getVectorFromIndex(Entity entityIn, int index)`
- `void incrementPathIndex()`
- `boolean isDestinationSame(Vec3d vec)`
- `boolean isFinished()`
- `boolean isSamePath(Path pathentityIn)`
- `static Path read(PacketBuffer buf)`
- `void setCurrentPathIndex(int currentPathIndexIn)`
- `void setCurrentPathLength(int length)`
- `void setPoint(int index, PathPoint point)`
