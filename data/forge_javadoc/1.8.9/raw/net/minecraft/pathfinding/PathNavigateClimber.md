---
title: "PathNavigateClimber"
description: "Returns the path to the given EntityLiving."
package: "net/minecraft/pathfinding"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/pathfinding/PathNavigateClimber.html"
sourceType: javadoc
---

# PathNavigateClimber

## Class signature

```java
public class PathNavigateClimber extends PathNavigateGround
```

## Constructors

- `public PathNavigateClimber( EntityLiving entityLivingIn, World worldIn)`

## Methods

- `public PathEntity getPathToPos( BlockPos pos)`
- `public PathEntity getPathToEntityLiving( Entity entityIn)`
- `public boolean tryMoveToEntityLiving( Entity entityIn, double speedIn)`
- `public void onUpdateNavigation()`

## Description

Returns the path to the given EntityLiving.
