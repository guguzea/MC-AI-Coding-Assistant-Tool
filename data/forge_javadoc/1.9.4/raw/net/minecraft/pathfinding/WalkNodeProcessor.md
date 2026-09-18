---
title: "WalkNodeProcessor"
description: "public class WalkNodeProcessor extends NodeProcessor"
package: "net/minecraft/pathfinding"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/pathfinding/WalkNodeProcessor.html"
sourceType: javadoc
---

# WalkNodeProcessor

## Class signature

```java
public class WalkNodeProcessor extends NodeProcessor
```

## Constructors

- `public WalkNodeProcessor()`

## Methods

- `public void initProcessor( IBlockAccess sourceIn, EntityLiving mob)`
- `public void postProcess()`
- `public PathPoint getStart()`
- `public PathPoint getPathPointToCoords(double x, double y, double z)`
- `public int findPathOptions( PathPoint [] pathOptions, PathPoint currentPoint, PathPoint targetPoint, float maxDistance)`
- `public PathNodeType getPathNodeType( IBlockAccess blockaccessIn, int x, int y, int z, EntityLiving entitylivingIn, int xSize, int ySize, int zSize, boolean canBreakDoorsIn, boolean canEnterDoorsIn)`
- `public PathNodeType getPathNodeType( IBlockAccess x, int y, int z, int p_186330_4_)`
