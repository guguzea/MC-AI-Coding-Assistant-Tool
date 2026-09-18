---
title: "MapGenStructure"
description: "public abstract class MapGenStructure extends MapGenBase"
package: "net/minecraft/world/gen/structure"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/world/gen/structure/MapGenStructure.html"
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
- `public boolean generateStructure( World worldIn, java.util.Random randomIn, ChunkPos chunkCoord)`
- `public boolean isInsideStructure( BlockPos pos)`
- `protected StructureStart getStructureAt( BlockPos pos)`
- `public boolean isPositionInStructure( World worldIn, BlockPos pos)`
- `public BlockPos getClosestStrongholdPos( World worldIn, BlockPos pos)`
- `protected java.util.List< BlockPos > getCoordList()`
- `protected void initializeStructureData( World worldIn)`
- `protected abstract boolean canSpawnStructureAtCoords(int chunkX, int chunkZ)`
- `protected abstract StructureStart getStructureStart(int chunkX, int chunkZ)`
