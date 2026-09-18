---
title: "ChunkProviderFlat"
description: "Returns if the IChunkProvider supports saving."
package: "net/minecraft/world/gen"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/world/gen/ChunkProviderFlat.html"
sourceType: javadoc
---

# ChunkProviderFlat

## Class signature

```java
public class ChunkProviderFlat extends java.lang.Object implements IChunkProvider
```

## Constructors

- `public ChunkProviderFlat( World worldIn, long seed, boolean generateStructures, java.lang.String flatGeneratorSettings)`

## Methods

- `public Chunk provideChunk(int x, int z)`
- `public boolean chunkExists(int x, int z)`
- `public void populate( IChunkProvider p_73153_1_, int p_73153_2_, int p_73153_3_)`
- `public boolean func_177460_a( IChunkProvider p_177460_1_, Chunk p_177460_2_, int p_177460_3_, int p_177460_4_)`
- `public boolean saveChunks(boolean p_73151_1_, IProgressUpdate progressCallback)`
- `public void saveExtraData()`
- `public boolean unloadQueuedChunks()`
- `public boolean canSave()`
- `public java.lang.String makeString()`
- `public java.util.List< BiomeGenBase.SpawnListEntry > getPossibleCreatures( EnumCreatureType creatureType, BlockPos pos)`
- `public BlockPos getStrongholdGen( World worldIn, java.lang.String structureName, BlockPos position)`
- `public int getLoadedChunkCount()`
- `public void recreateStructures( Chunk p_180514_1_, int p_180514_2_, int p_180514_3_)`
- `public Chunk provideChunk( BlockPos blockPosIn)`

## Description

Returns if the IChunkProvider supports saving.
