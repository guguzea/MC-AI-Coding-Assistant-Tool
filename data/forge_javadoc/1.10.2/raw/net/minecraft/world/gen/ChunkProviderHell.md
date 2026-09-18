---
title: "ChunkProviderHell"
description: "public class ChunkProviderHell extends java.lang.Object implements IChunkGenerator"
package: "net/minecraft/world/gen"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/world/gen/ChunkProviderHell.html"
sourceType: javadoc
---

# ChunkProviderHell

## Class signature

```java
public class ChunkProviderHell extends java.lang.Object implements IChunkGenerator
```

## Constructors

- `public ChunkProviderHell( World worldIn, boolean p_i45637_2_, long seed)`

## Methods

- `public void prepareHeights(int p_185936_1_, int p_185936_2_, ChunkPrimer primer)`
- `public void buildSurfaces(int p_185937_1_, int p_185937_2_, ChunkPrimer primer)`
- `public Chunk provideChunk(int x, int z)`
- `public void populate(int x, int z)`
- `public boolean generateStructures( Chunk chunkIn, int x, int z)`
- `public java.util.List< Biome.SpawnListEntry > getPossibleCreatures( EnumCreatureType creatureType, BlockPos pos)`
- `@Nullable public BlockPos getStrongholdGen( World worldIn, java.lang.String structureName, BlockPos position)`
- `public void recreateStructures( Chunk chunkIn, int x, int z)`
