---
title: "ChunkProviderDebug"
description: "public class ChunkProviderDebug extends java.lang.Object implements IChunkGenerator"
package: "net/minecraft/world/gen"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/world/gen/ChunkProviderDebug.html"
sourceType: javadoc
---

# ChunkProviderDebug

## Class signature

```java
public class ChunkProviderDebug extends java.lang.Object implements IChunkGenerator
```

## Constructors

- `public ChunkProviderDebug( World worldIn)`

## Methods

- `public Chunk provideChunk(int x, int z)`
- `public static IBlockState getBlockStateFor(int p_177461_0_, int p_177461_1_)`
- `public void populate(int x, int z)`
- `public boolean generateStructures( Chunk chunkIn, int x, int z)`
- `public java.util.List< Biome.SpawnListEntry > getPossibleCreatures( EnumCreatureType creatureType, BlockPos pos)`
- `@Nullable public BlockPos getStrongholdGen( World worldIn, java.lang.String structureName, BlockPos position)`
- `public void recreateStructures( Chunk chunkIn, int x, int z)`
