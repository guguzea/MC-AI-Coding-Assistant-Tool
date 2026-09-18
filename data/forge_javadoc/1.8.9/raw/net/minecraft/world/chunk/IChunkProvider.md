---
title: "IChunkProvider"
description: "Returns if the IChunkProvider supports saving."
package: "net/minecraft/world/chunk"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/world/chunk/IChunkProvider.html"
sourceType: javadoc
---

# IChunkProvider

## Class signature

```java
public interface IChunkProvider
```

## Methods

- `boolean chunkExists(int x, int z)`
- `Chunk provideChunk(int x, int z)`
- `Chunk provideChunk( BlockPos blockPosIn)`
- `void populate( IChunkProvider p_73153_1_, int p_73153_2_, int p_73153_3_)`
- `boolean func_177460_a( IChunkProvider p_177460_1_, Chunk p_177460_2_, int p_177460_3_, int p_177460_4_)`
- `boolean saveChunks(boolean p_73151_1_, IProgressUpdate progressCallback)`
- `boolean unloadQueuedChunks()`
- `boolean canSave()`
- `java.lang.String makeString()`
- `java.util.List< BiomeGenBase.SpawnListEntry > getPossibleCreatures( EnumCreatureType creatureType, BlockPos pos)`
- `BlockPos getStrongholdGen( World worldIn, java.lang.String structureName, BlockPos position)`
- `int getLoadedChunkCount()`
- `void recreateStructures( Chunk p_180514_1_, int p_180514_2_, int p_180514_3_)`
- `void saveExtraData()`

## Description

Returns if the IChunkProvider supports saving.
