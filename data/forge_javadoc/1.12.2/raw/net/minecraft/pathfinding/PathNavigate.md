---
title: "PathNavigate"
description: "public abstract class PathNavigate extends java.lang.Object"
package: "net/minecraft/pathfinding"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/pathfinding/PathNavigate.html"
sourceType: javadoc
---

# PathNavigate

**Inheritance:** java.lang.Object → net.minecraft.pathfinding.PathNavigate

## Class signature

```java
public abstract class PathNavigate extends java.lang.Object
```

## Constructors

- `PathNavigate(EntityLiving entityIn, World worldIn)`

## Methods

- `boolean canEntityStandOnPos(BlockPos pos)`
- `protected abstract boolean canNavigate()`
- `boolean canUpdatePathOnTimeout()`
- `protected void checkForStuck(Vec3d positionVec3)`
- `void clearPath()`
- `protected void debugPathFinding()`
- `protected abstract Vec3d getEntityPosition()`
- `NodeProcessor getNodeProcessor()`
- `Path getPath()`
- `protected abstract PathFinder getPathFinder()`
- `float getPathSearchRange()`
- `Path getPathToEntityLiving(Entity entityIn)`
- `Path getPathToPos(BlockPos pos)`
- `Path getPathToXYZ(double x, double y, double z)`
- `protected abstract boolean isDirectPathBetweenPoints(Vec3d posVec31, Vec3d posVec32, int sizeX, int sizeY, int sizeZ)`
- `protected boolean isInLiquid()`
- `boolean noPath()`
- `void onUpdateNavigation()`
- `protected void pathFollow()`
- `protected void removeSunnyPath()`
- `boolean setPath(Path pathentityIn, double speedIn)`
- `void setSpeed(double speedIn)`
- `boolean tryMoveToEntityLiving(Entity entityIn, double speedIn)`
- `boolean tryMoveToXYZ(double x, double y, double z, double speedIn)`
- `void updatePath()`

## Fields

- `protected Path currentPath`
- `protected EntityLiving entity`
- `protected float maxDistanceToWaypoint`
- `protected NodeProcessor nodeProcessor`
- `protected double speed`
- `protected int totalTicks`
- `protected boolean tryUpdatePath`
- `protected World world`
