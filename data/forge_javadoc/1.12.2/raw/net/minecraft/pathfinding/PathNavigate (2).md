---
title: "PathNavigate"
description: "public abstract class PathNavigate extends java.lang.Object"
package: "net/minecraft/pathfinding"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/pathfinding/PathNavigate.html"
sourceType: javadoc
---

# PathNavigate

## Class signature

```java
public abstract class PathNavigate extends java.lang.Object
```

## Constructors

- `public PathNavigate( EntityLiving entityIn, World worldIn)`

## Methods

- `protected abstract PathFinder getPathFinder()`
- `public void setSpeed(double speedIn)`
- `public float getPathSearchRange()`
- `public boolean canUpdatePathOnTimeout()`
- `public void updatePath()`
- `public final Path getPathToXYZ(double x, double y, double z)`
- `public Path getPathToPos( BlockPos pos)`
- `public Path getPathToEntityLiving( Entity entityIn)`
- `public boolean tryMoveToXYZ(double x, double y, double z, double speedIn)`
- `public boolean tryMoveToEntityLiving( Entity entityIn, double speedIn)`
- `public boolean setPath( Path pathentityIn, double speedIn)`
- `public Path getPath()`
- `public void onUpdateNavigation()`
- `protected void debugPathFinding()`
- `protected void pathFollow()`
- `protected void checkForStuck( Vec3d positionVec3)`
- `public boolean noPath()`
- `public void clearPath()`
- `protected abstract Vec3d getEntityPosition()`
- `protected abstract boolean canNavigate()`
- `protected boolean isInLiquid()`
- `protected void removeSunnyPath()`
- `protected abstract boolean isDirectPathBetweenPoints( Vec3d posVec31, Vec3d posVec32, int sizeX, int sizeY, int sizeZ)`
- `public boolean canEntityStandOnPos( BlockPos pos)`
- `public NodeProcessor getNodeProcessor()`
