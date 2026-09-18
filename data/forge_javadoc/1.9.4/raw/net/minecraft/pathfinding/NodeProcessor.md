---
title: "NodeProcessor"
description: "public abstract class NodeProcessor extends java.lang.Object"
package: "net/minecraft/pathfinding"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/pathfinding/NodeProcessor.html"
sourceType: javadoc
---

# NodeProcessor

## Class signature

```java
public abstract class NodeProcessor extends java.lang.Object
```

## Constructors

- `public NodeProcessor()`

## Methods

- `public void initProcessor( IBlockAccess sourceIn, EntityLiving mob)`
- `public void postProcess()`
- `protected PathPoint openPoint(int x, int y, int z)`
- `public abstract PathPoint getStart()`
- `public abstract PathPoint getPathPointToCoords(double x, double y, double z)`
- `public abstract int findPathOptions( PathPoint [] pathOptions, PathPoint currentPoint, PathPoint targetPoint, float maxDistance)`
- `public abstract PathNodeType getPathNodeType( IBlockAccess blockaccessIn, int x, int y, int z, EntityLiving entitylivingIn, int xSize, int ySize, int zSize, boolean canBreakDoorsIn, boolean canEnterDoorsIn)`
- `public abstract PathNodeType getPathNodeType( IBlockAccess x, int y, int z, int p_186330_4_)`
- `public void setCanEnterDoors(boolean canEnterDoorsIn)`
- `public void setCanBreakDoors(boolean canBreakDoorsIn)`
- `public void setCanSwim(boolean canSwimIn)`
- `public boolean getCanEnterDoors()`
- `public boolean getCanBreakDoors()`
- `public boolean getCanSwim()`
