---
title: "ChunkProviderHell"
description: "Returns if the IChunkProvider supports saving."
package: "net/minecraft/world/gen"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/world/gen/ChunkProviderHell.html"
sourceType: javadoc
---

# ChunkProviderHell

## Class signature

```java
public class ChunkProviderHell extends java.lang.Object implements IChunkProvider
```

## Constructors

- `public ChunkProviderHell( World worldIn, boolean p_i45637_2_, long p_i45637_3_)`

## Methods

- `public void func_180515_a(int p_180515_1_, int p_180515_2_, ChunkPrimer p_180515_3_)`
- `public void func_180516_b(int p_180516_1_, int p_180516_2_, ChunkPrimer p_180516_3_)`
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
