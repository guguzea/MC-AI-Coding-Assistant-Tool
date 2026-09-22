---
title: "WalkNodeProcessor"
description: "public class WalkNodeProcessor extends NodeProcessor"
package: "net/minecraft/pathfinding"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/pathfinding/WalkNodeProcessor.html"
sourceType: javadoc
---

# WalkNodeProcessor

**Inheritance:** java.lang.Object → net.minecraft.pathfinding.NodeProcessor → net.minecraft.pathfinding.WalkNodeProcessor

## Class signature

```java
public class WalkNodeProcessor extends NodeProcessor
```

## Constructors

- `WalkNodeProcessor()`

## Methods

- `PathNodeType checkNeighborBlocks(IBlockAccess p_193578_1_, int p_193578_2_, int p_193578_3_, int p_193578_4_, PathNodeType p_193578_5_)`
- `int findPathOptions(PathPoint [] pathOptions, PathPoint currentPoint, PathPoint targetPoint, float maxDistance)`
- `PathNodeType getPathNodeType(IBlockAccess blockaccessIn, int x, int y, int z)`
- `PathNodeType getPathNodeType(IBlockAccess blockaccessIn, int x, int y, int z, EntityLiving entitylivingIn, int xSize, int ySize, int zSize, boolean canBreakDoorsIn, boolean canEnterDoorsIn)`
- `PathNodeType getPathNodeType(IBlockAccess p_193577_1_, int x, int y, int z, int xSize, int ySize, int zSize, boolean canOpenDoorsIn, boolean canEnterDoorsIn, java.util.EnumSet<PathNodeType> p_193577_10_, PathNodeType p_193577_11_, BlockPos p_193577_12_)`
- `protected PathNodeType getPathNodeTypeRaw(IBlockAccess p_189553_1_, int p_189553_2_, int p_189553_3_, int p_189553_4_)`
- `PathPoint getPathPointToCoords(double x, double y, double z)`
- `PathPoint getStart()`
- `void init(IBlockAccess sourceIn, EntityLiving mob)`
- `void postProcess()`

## Fields

- `protected float avoidsWater`
- `protected EntityLiving currentEntity`
