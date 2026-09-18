---
title: "PathNavigateGround"
description: "public class PathNavigateGround extends PathNavigate"
package: "net/minecraft/pathfinding"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/pathfinding/PathNavigateGround.html"
sourceType: javadoc
---

# PathNavigateGround

## Class signature

```java
public class PathNavigateGround extends PathNavigate
```

## Constructors

- `public PathNavigateGround( EntityLiving entitylivingIn, World worldIn)`

## Methods

- `protected PathFinder getPathFinder()`
- `protected boolean canNavigate()`
- `protected Vec3d getEntityPosition()`
- `public Path getPathToPos( BlockPos pos)`
- `public Path getPathToEntityLiving( Entity entityIn)`
- `protected void removeSunnyPath()`
- `protected boolean isDirectPathBetweenPoints( Vec3d posVec31, Vec3d posVec32, int sizeX, int sizeY, int sizeZ)`
- `public void setBreakDoors(boolean canBreakDoors)`
- `public void setEnterDoors(boolean enterDoors)`
- `public boolean getEnterDoors()`
- `public void setCanSwim(boolean canSwim)`
- `public boolean getCanSwim()`
- `public void setAvoidSun(boolean avoidSun)`
