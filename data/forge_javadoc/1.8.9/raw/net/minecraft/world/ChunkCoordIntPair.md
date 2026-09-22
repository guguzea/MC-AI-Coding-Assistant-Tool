---
title: "ChunkCoordIntPair"
description: "public class ChunkCoordIntPair extends java.lang.Object"
package: "net/minecraft/world"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/world/ChunkCoordIntPair.html"
sourceType: javadoc
---

# ChunkCoordIntPair

**Inheritance:** java.lang.Object → net.minecraft.world.ChunkCoordIntPair

## Class signature

```java
public class ChunkCoordIntPair extends java.lang.Object
```

## Constructors

- `ChunkCoordIntPair(int x, int z)`

## Methods

- `static long chunkXZ2Int(int x, int z)` — converts a chunk coordinate pair to an integer (suitable for hashing)
- `boolean equals(java.lang.Object p_equals_1_)`
- `BlockPos getBlock(int x, int y, int z)` — Get the World coordinates of the Block with the given Chunk coordinates relative to this chunk
- `BlockPos getCenterBlock(int y)` — Get the coordinates of the Block in the center of this chunk with the given Y coordinate
- `int getCenterXPos()`
- `int getCenterZPosition()`
- `int getXEnd()` — Get the last world X coordinate that belongs to this Chunk
- `int getXStart()` — Get the first world X coordinate that belongs to this Chunk
- `int getZEnd()` — Get the last world Z coordinate that belongs to this Chunk
- `int getZStart()` — Get the first world Z coordinate that belongs to this Chunk
- `int hashCode()`
- `java.lang.String toString()`

## Fields

- `int chunkXPos` — The X position of this Chunk Coordinate Pair
- `int chunkZPos` — The Z position of this Chunk Coordinate Pair
