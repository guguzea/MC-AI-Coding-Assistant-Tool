---
title: "NodeProcessor"
description: "Returns given entity's position as PathPoint"
package: "net/minecraft/world/pathfinder"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/world/pathfinder/NodeProcessor.html"
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

- `public void initProcessor( IBlockAccess iblockaccessIn, Entity entityIn)`
- `public void postProcess()`
- `protected PathPoint openPoint(int x, int y, int z)`
- `public abstract PathPoint getPathPointTo( Entity entityIn)`
- `public abstract PathPoint getPathPointToCoords( Entity entityIn, double x, double y, double target)`
- `public abstract int findPathOptions( PathPoint [] pathOptions, Entity entityIn, PathPoint currentPoint, PathPoint targetPoint, float maxDistance)`

## Description

Returns given entity's position as PathPoint
