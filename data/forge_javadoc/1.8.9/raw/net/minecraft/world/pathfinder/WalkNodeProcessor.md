---
title: "WalkNodeProcessor"
description: "Returns given entity's position as PathPoint"
package: "net/minecraft/world/pathfinder"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/world/pathfinder/WalkNodeProcessor.html"
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

- `public void initProcessor( IBlockAccess iblockaccessIn, Entity entityIn)`
- `public void postProcess()`
- `public PathPoint getPathPointTo( Entity entityIn)`
- `public PathPoint getPathPointToCoords( Entity entityIn, double x, double y, double target)`
- `public int findPathOptions( PathPoint [] pathOptions, Entity entityIn, PathPoint currentPoint, PathPoint targetPoint, float maxDistance)`
- `public static int func_176170_a( IBlockAccess blockaccessIn, Entity entityIn, int x, int y, int z, int sizeX, int sizeY, int sizeZ, boolean avoidWater, boolean breakDoors, boolean enterDoors)`
- `public void setEnterDoors(boolean canEnterDoorsIn)`
- `public void setBreakDoors(boolean canBreakDoorsIn)`
- `public void setAvoidsWater(boolean avoidsWaterIn)`
- `public void setCanSwim(boolean canSwimIn)`
- `public boolean getEnterDoors()`
- `public boolean getCanSwim()`
- `public boolean getAvoidsWater()`

## Description

Returns given entity's position as PathPoint
