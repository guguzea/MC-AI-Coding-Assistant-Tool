---
title: "MapGenStructure"
description: "Recursively called by generate()"
package: "net/minecraft/world/gen/structure"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/world/gen/structure/MapGenStructure.html"
sourceType: javadoc
---

# MapGenStructure

## Class signature

```java
public abstract class MapGenStructure extends MapGenBase
```

## Constructors

- `public MapGenStructure()`

## Methods

- `public abstract java.lang.String getStructureName()`
- `protected final void recursiveGenerate( World worldIn, int chunkX, int chunkZ, int p_180701_4_, int p_180701_5_, ChunkPrimer chunkPrimerIn)`
- `public boolean generateStructure( World worldIn, java.util.Random randomIn, ChunkCoordIntPair chunkCoord)`
- `public boolean func_175795_b( BlockPos pos)`
- `protected StructureStart func_175797_c( BlockPos pos)`
- `public boolean func_175796_a( World worldIn, BlockPos pos)`
- `public BlockPos getClosestStrongholdPos( World worldIn, BlockPos pos)`
- `protected java.util.List< BlockPos > getCoordList()`
- `protected abstract boolean canSpawnStructureAtCoords(int chunkX, int chunkZ)`
- `protected abstract StructureStart getStructureStart(int chunkX, int chunkZ)`

## Description

Recursively called by generate()
