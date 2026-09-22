---
title: "NodeProcessor"
description: "public abstract class NodeProcessor extends java.lang.Object"
package: "net/minecraft/pathfinding"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/pathfinding/NodeProcessor.html"
sourceType: javadoc
---

# NodeProcessor

**Inheritance:** java.lang.Object → net.minecraft.pathfinding.NodeProcessor

## Class signature

```java
public abstract class NodeProcessor extends java.lang.Object
```

## Constructors

- `NodeProcessor()`

## Methods

- `abstract int findPathOptions(PathPoint [] pathOptions, PathPoint currentPoint, PathPoint targetPoint, float maxDistance)`
- `boolean getCanEnterDoors()`
- `boolean getCanOpenDoors()`
- `boolean getCanSwim()`
- `abstract PathNodeType getPathNodeType(IBlockAccess blockaccessIn, int x, int y, int z)`
- `abstract PathNodeType getPathNodeType(IBlockAccess blockaccessIn, int x, int y, int z, EntityLiving entitylivingIn, int xSize, int ySize, int zSize, boolean canBreakDoorsIn, boolean canEnterDoorsIn)`
- `abstract PathPoint getPathPointToCoords(double x, double y, double z)`
- `abstract PathPoint getStart()`
- `void init(IBlockAccess sourceIn, EntityLiving mob)`
- `protected PathPoint openPoint(int x, int y, int z)`
- `void postProcess()`
- `void setCanEnterDoors(boolean canEnterDoorsIn)`
- `void setCanOpenDoors(boolean canOpenDoorsIn)`
- `void setCanSwim(boolean canSwimIn)`

## Fields

- `protected IBlockAccess blockaccess`
- `protected boolean canEnterDoors`
- `protected boolean canOpenDoors`
- `protected boolean canSwim`
- `protected EntityLiving entity`
- `protected int entitySizeX`
- `protected int entitySizeY`
- `protected int entitySizeZ`
- `protected IntHashMap<PathPoint> pointMap`
