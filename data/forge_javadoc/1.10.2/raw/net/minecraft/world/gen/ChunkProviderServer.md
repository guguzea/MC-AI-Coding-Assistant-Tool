---
title: "ChunkProviderServer"
description: "public class ChunkProviderServer extends java.lang.Object implements IChunkProvider"
package: "net/minecraft/world/gen"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/world/gen/ChunkProviderServer.html"
sourceType: javadoc
---

# ChunkProviderServer

## Class signature

```java
public class ChunkProviderServer extends java.lang.Object implements IChunkProvider
```

## Constructors

- `public ChunkProviderServer( WorldServer worldObjIn, IChunkLoader chunkLoaderIn, IChunkGenerator chunkGeneratorIn)`

## Methods

- `public java.util.Collection< Chunk > getLoadedChunks()`
- `public void unload( Chunk chunkIn)`
- `public void unloadAllChunks()`
- `@Nullable public Chunk getLoadedChunk(int x, int z)`
- `@Nullable public Chunk loadChunk(int x, int z)`
- `@Nullable public Chunk loadChunk(int x, int z, java.lang.Runnable runnable)`
- `public Chunk provideChunk(int x, int z)`
- `public boolean saveChunks(boolean p_186027_1_)`
- `public void saveExtraData()`
- `public boolean unloadQueuedChunks()`
- `public boolean canSave()`
- `public java.lang.String makeString()`
- `public java.util.List< Biome.SpawnListEntry > getPossibleCreatures( EnumCreatureType creatureType, BlockPos pos)`
- `@Nullable public BlockPos getStrongholdGen( World worldIn, java.lang.String structureName, BlockPos position)`
- `public int getLoadedChunkCount()`
- `public boolean chunkExists(int x, int z)`
