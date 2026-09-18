---
title: "ChunkProviderServer"
description: "public class ChunkProviderServer extends java.lang.Object implements IChunkProvider"
package: "net/minecraft/world/gen"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/world/gen/ChunkProviderServer.html"
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
- `public boolean tick()`
- `public boolean canSave()`
- `public java.lang.String makeString()`
- `public java.util.List< Biome.SpawnListEntry > getPossibleCreatures( EnumCreatureType creatureType, BlockPos pos)`
- `@Nullable public BlockPos getStrongholdGen( World worldIn, java.lang.String structureName, BlockPos position, boolean p_180513_4_)`
- `public int getLoadedChunkCount()`
- `public boolean chunkExists(int x, int z)`
- `public boolean isChunkGeneratedAt(int p_191062_1_, int p_191062_2_)`
