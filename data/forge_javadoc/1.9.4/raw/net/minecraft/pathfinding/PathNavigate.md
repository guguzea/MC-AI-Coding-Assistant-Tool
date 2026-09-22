---
title: "PathNavigate"
description: "public abstract class PathNavigate extends java.lang.Object"
package: "net/minecraft/pathfinding"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/pathfinding/PathNavigate.html"
sourceType: javadoc
---

# PathNavigate

**Inheritance:** java.lang.Object → net.minecraft.pathfinding.PathNavigate

## Class signature

```java
public abstract class PathNavigate extends java.lang.Object
```

## Constructors

- `PathNavigate(EntityLiving entitylivingIn, World worldIn)`

## Methods

- `boolean canEntityStandOnPos(BlockPos pos)`
- `protected abstract boolean canNavigate()`
- `boolean canUpdatePathOnTimeout()`
- `protected void checkForStuck(Vec3d positionVec3)`
- `void clearPathEntity()`
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
- `protected NodeProcessor nodeProcessor`
- `protected double speed`
- `protected EntityLiving theEntity`
- `protected World worldObj`
