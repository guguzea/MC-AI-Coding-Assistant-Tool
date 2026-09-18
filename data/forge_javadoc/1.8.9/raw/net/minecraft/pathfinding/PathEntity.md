---
title: "PathEntity"
description: "returns the last PathPoint of the Array"
package: "net/minecraft/pathfinding"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/pathfinding/PathEntity.html"
sourceType: javadoc
---

# PathEntity

## Class signature

```java
public class PathEntity extends java.lang.Object
```

## Constructors

- `public PathEntity( PathPoint [] pathpoints)`

## Methods

- `public void incrementPathIndex()`
- `public boolean isFinished()`
- `public PathPoint getFinalPathPoint()`
- `public PathPoint getPathPointFromIndex(int index)`
- `public int getCurrentPathLength()`
- `public void setCurrentPathLength(int length)`
- `public int getCurrentPathIndex()`
- `public void setCurrentPathIndex(int currentPathIndexIn)`
- `public Vec3 getVectorFromIndex( Entity entityIn, int index)`
- `public Vec3 getPosition( Entity entityIn)`
- `public boolean isSamePath( PathEntity pathentityIn)`
- `public boolean isDestinationSame( Vec3 vec)`

## Description

returns the last PathPoint of the Array
