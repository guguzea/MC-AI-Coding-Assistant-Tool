---
title: "ChunkProviderClient"
description: "Returns if the IChunkProvider supports saving."
package: "net/minecraft/client/multiplayer"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/client/multiplayer/ChunkProviderClient.html"
sourceType: javadoc
---

# ChunkProviderClient

## Class signature

```java
public class ChunkProviderClient extends java.lang.Object implements IChunkProvider
```

## Constructors

- `public ChunkProviderClient( World worldIn)`

## Methods

- `public boolean chunkExists(int x, int z)`
- `public void unloadChunk(int p_73234_1_, int p_73234_2_)`
- `public Chunk loadChunk(int p_73158_1_, int p_73158_2_)`
- `public Chunk provideChunk(int x, int z)`
- `public boolean saveChunks(boolean p_73151_1_, IProgressUpdate progressCallback)`
- `public void saveExtraData()`
- `public boolean unloadQueuedChunks()`
- `public boolean canSave()`
- `public void populate( IChunkProvider p_73153_1_, int p_73153_2_, int p_73153_3_)`
- `public boolean func_177460_a( IChunkProvider p_177460_1_, Chunk p_177460_2_, int p_177460_3_, int p_177460_4_)`
- `public java.lang.String makeString()`
- `public java.util.List< BiomeGenBase.SpawnListEntry > getPossibleCreatures( EnumCreatureType creatureType, BlockPos pos)`
- `public BlockPos getStrongholdGen( World worldIn, java.lang.String structureName, BlockPos position)`
- `public int getLoadedChunkCount()`
- `public void recreateStructures( Chunk p_180514_1_, int p_180514_2_, int p_180514_3_)`
- `public Chunk provideChunk( BlockPos blockPosIn)`

## Description

Returns if the IChunkProvider supports saving.
