---
title: "ChunkGeneratorOverworld"
description: "public class ChunkGeneratorOverworld extends java.lang.Object implements IChunkGenerator"
package: "net/minecraft/world/gen"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/world/gen/ChunkGeneratorOverworld.html"
sourceType: javadoc
---

# ChunkGeneratorOverworld

## Class signature

```java
public class ChunkGeneratorOverworld extends java.lang.Object implements IChunkGenerator
```

## Constructors

- `public ChunkGeneratorOverworld( World worldIn, long seed, boolean mapFeaturesEnabledIn, java.lang.String generatorOptions)`

## Methods

- `public void setBlocksInChunk(int x, int z, ChunkPrimer primer)`
- `public void replaceBiomeBlocks(int x, int z, ChunkPrimer primer, Biome [] biomesIn)`
- `public Chunk generateChunk(int x, int z)`
- `public void populate(int x, int z)`
- `public boolean generateStructures( Chunk chunkIn, int x, int z)`
- `public java.util.List< Biome.SpawnListEntry > getPossibleCreatures( EnumCreatureType creatureType, BlockPos pos)`
- `public boolean isInsideStructure( World worldIn, java.lang.String structureName, BlockPos pos)`
- `public BlockPos getNearestStructurePos( World worldIn, java.lang.String structureName, BlockPos position, boolean findUnexplored)`
- `public void recreateStructures( Chunk chunkIn, int x, int z)`
