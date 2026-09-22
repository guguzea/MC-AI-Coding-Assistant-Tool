---
title: "ChunkProviderFlat"
description: "public class ChunkProviderFlat extends java.lang.Object implements IChunkProvider"
package: "net/minecraft/world/gen"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/world/gen/ChunkProviderFlat.html"
sourceType: javadoc
---

# ChunkProviderFlat

**Inheritance:** java.lang.Object → net.minecraft.world.gen.ChunkProviderFlat

## Class signature

```java
public class ChunkProviderFlat extends java.lang.Object implements IChunkProvider
```

## Constructors

- `ChunkProviderFlat(World worldIn, long seed, boolean generateStructures, java.lang.String flatGeneratorSettings)`

## Methods

- `boolean canSave()` — Returns if the IChunkProvider supports saving.
- `boolean chunkExists(int x, int z)` — Checks to see if a chunk exists at x, z
- `boolean func_177460_a(IChunkProvider p_177460_1_, Chunk p_177460_2_, int p_177460_3_, int p_177460_4_)`
- `int getLoadedChunkCount()`
- `java.util.List<BiomeGenBase.SpawnListEntry> getPossibleCreatures(EnumCreatureType creatureType, BlockPos pos)`
- `BlockPos getStrongholdGen(World worldIn, java.lang.String structureName, BlockPos position)`
- `java.lang.String makeString()` — Converts the instance data to a readable string.
- `void populate(IChunkProvider p_73153_1_, int p_73153_2_, int p_73153_3_)` — Populates chunk with ores etc etc
- `Chunk provideChunk(BlockPos blockPosIn)`
- `Chunk provideChunk(int x, int z)` — Will return back a chunk, if it doesn't exist and its not a MP client it will generates all the blocks for the specified chunk from the map seed and chunk seed
- `void recreateStructures(Chunk p_180514_1_, int p_180514_2_, int p_180514_3_)`
- `boolean saveChunks(boolean p_73151_1_, IProgressUpdate progressCallback)` — Two modes of operation: if passed true, save all Chunks in one go.
- `void saveExtraData()` — Save extra data not associated with any Chunk.
- `boolean unloadQueuedChunks()` — Unloads chunks that are marked to be unloaded.
