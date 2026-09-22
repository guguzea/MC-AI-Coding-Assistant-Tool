---
title: "WalkNodeProcessor"
description: "public class WalkNodeProcessor extends NodeProcessor"
package: "net/minecraft/pathfinding"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/pathfinding/WalkNodeProcessor.html"
sourceType: javadoc
---

# WalkNodeProcessor

**Inheritance:** java.lang.Object → net.minecraft.pathfinding.NodeProcessor → net.minecraft.pathfinding.WalkNodeProcessor

## Class signature

```java
public class WalkNodeProcessor extends NodeProcessor
```

## Methods

- `int findPathOptions(PathPoint [] pathOptions, PathPoint currentPoint, PathPoint targetPoint, float maxDistance)`
- `PathNodeType getPathNodeType(IBlockAccess blockaccessIn, int x, int y, int z)`
- `PathNodeType getPathNodeType(IBlockAccess blockaccessIn, int x, int y, int z, EntityLiving entitylivingIn, int xSize, int ySize, int zSize, boolean canBreakDoorsIn, boolean canEnterDoorsIn)`
- `PathPoint getPathPointToCoords(double x, double y, double z)`
- `PathPoint getStart()`
- `void initProcessor(IBlockAccess sourceIn, EntityLiving mob)`
- `void postProcess()`

## Fields

- `WalkNodeProcessor`
