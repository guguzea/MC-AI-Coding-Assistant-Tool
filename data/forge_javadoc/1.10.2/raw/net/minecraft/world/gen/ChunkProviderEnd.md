---
title: "ChunkProviderEnd"
description: "public class ChunkProviderEnd extends java.lang.Object implements IChunkGenerator"
package: "net/minecraft/world/gen"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/world/gen/ChunkProviderEnd.html"
sourceType: javadoc
---

# ChunkProviderEnd

## Class signature

```java
public class ChunkProviderEnd extends java.lang.Object implements IChunkGenerator
```

## Constructors

- `public ChunkProviderEnd( World worldObjIn, boolean mapFeaturesEnabledIn, long seed)`

## Methods

- `public void setBlocksInChunk(int x, int z, ChunkPrimer primer)`
- `public void buildSurfaces( ChunkPrimer primer)`
- `public Chunk provideChunk(int x, int z)`
- `public boolean isIslandChunk(int p_185961_1_, int p_185961_2_)`
- `public void populate(int x, int z)`
- `public boolean generateStructures( Chunk chunkIn, int x, int z)`
- `public java.util.List< Biome.SpawnListEntry > getPossibleCreatures( EnumCreatureType creatureType, BlockPos pos)`
- `@Nullable public BlockPos getStrongholdGen( World worldIn, java.lang.String structureName, BlockPos position)`
- `public void recreateStructures( Chunk chunkIn, int x, int z)`
