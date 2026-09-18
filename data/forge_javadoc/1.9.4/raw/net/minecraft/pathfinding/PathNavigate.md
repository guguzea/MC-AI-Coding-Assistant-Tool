---
title: "PathNavigate"
description: "public abstract class PathNavigate extends java.lang.Object"
package: "net/minecraft/pathfinding"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/pathfinding/PathNavigate.html"
sourceType: javadoc
---

# PathNavigate

## Class signature

```java
public abstract class PathNavigate extends java.lang.Object
```

## Constructors

- `public PathNavigate( EntityLiving entitylivingIn, World worldIn)`

## Methods

- `protected abstract PathFinder getPathFinder()`
- `public void setSpeed(double speedIn)`
- `public float getPathSearchRange()`
- `public boolean canUpdatePathOnTimeout()`
- `public void updatePath()`
- `@Nullable public final Path getPathToXYZ(double x, double y, double z)`
- `@Nullable public Path getPathToPos( BlockPos pos)`
- `@Nullable public Path getPathToEntityLiving( Entity entityIn)`
- `public boolean tryMoveToXYZ(double x, double y, double z, double speedIn)`
- `public boolean tryMoveToEntityLiving( Entity entityIn, double speedIn)`
- `public boolean setPath(@Nullable Path pathentityIn, double speedIn)`
- `@Nullable public Path getPath()`
- `public void onUpdateNavigation()`
- `protected void pathFollow()`
- `protected void checkForStuck( Vec3d positionVec3)`
- `public boolean noPath()`
- `public void clearPathEntity()`
- `protected abstract Vec3d getEntityPosition()`
- `protected abstract boolean canNavigate()`
- `protected boolean isInLiquid()`
- `protected void removeSunnyPath()`
- `protected abstract boolean isDirectPathBetweenPoints( Vec3d posVec31, Vec3d posVec32, int sizeX, int sizeY, int sizeZ)`
- `public boolean canEntityStandOnPos( BlockPos pos)`
- `public NodeProcessor getNodeProcessor()`
