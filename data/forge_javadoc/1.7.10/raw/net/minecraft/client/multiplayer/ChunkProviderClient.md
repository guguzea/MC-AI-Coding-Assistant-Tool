---
title: "ChunkProviderClient"
description: "public class ChunkProviderClient extends java.lang.Object implements IChunkProvider"
package: "net/minecraft/client/multiplayer"
version: "1.7.10"
forgeBuild: "10.13.4.1614"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/net/minecraft/client/multiplayer/ChunkProviderClient.html"
sourceType: javadoc
---

# ChunkProviderClient

**Inheritance:** java.lang.Object → net.minecraft.client.multiplayer.ChunkProviderClient

## Class signature

```java
public class ChunkProviderClient extends java.lang.Object implements IChunkProvider
```

## Constructors

- `ChunkProviderClient(World p_i1184_1_)`

## Methods

- `boolean canSave()`
- `boolean chunkExists(int p_73149_1_, int p_73149_2_)`
- `ChunkPosition func_147416_a(World p_147416_1_, java.lang.String p_147416_2_, int p_147416_3_, int p_147416_4_, int p_147416_5_)`
- `int getLoadedChunkCount()`
- `java.util.List getPossibleCreatures(EnumCreatureType p_73155_1_, int p_73155_2_, int p_73155_3_, int p_73155_4_)`
- `Chunk loadChunk(int p_73158_1_, int p_73158_2_)`
- `java.lang.String makeString()`
- `void populate(IChunkProvider p_73153_1_, int p_73153_2_, int p_73153_3_)`
- `Chunk provideChunk(int p_73154_1_, int p_73154_2_)`
- `void recreateStructures(int p_82695_1_, int p_82695_2_)`
- `boolean saveChunks(boolean p_73151_1_, IProgressUpdate p_73151_2_)`
- `void saveExtraData()`
- `void unloadChunk(int p_73234_1_, int p_73234_2_)`
- `boolean unloadQueuedChunks()`
