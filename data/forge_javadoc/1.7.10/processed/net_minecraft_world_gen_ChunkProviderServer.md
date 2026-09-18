# ChunkProviderServer

## Class signature

```java
public class ChunkProviderServer extends java.lang.Object implements IChunkProvider
```

## Constructors

- `public ChunkProviderServer( WorldServer p_i1520_1_, IChunkLoader p_i1520_2_, IChunkProvider p_i1520_3_)`

## Methods

- `public boolean chunkExists(int p_73149_1_, int p_73149_2_)`
- `public java.util.List func_152380_a()`
- `public void unloadChunksIfNotNearSpawn(int p_73241_1_, int p_73241_2_)`
- `public void unloadAllChunks()`
- `public Chunk loadChunk(int p_73158_1_, int p_73158_2_)`
- `public Chunk provideChunk(int p_73154_1_, int p_73154_2_)`
- `public void populate( IChunkProvider p_73153_1_, int p_73153_2_, int p_73153_3_)`
- `public boolean saveChunks(boolean p_73151_1_, IProgressUpdate p_73151_2_)`
- `public void saveExtraData()`
- `public boolean unloadQueuedChunks()`
- `public boolean canSave()`
- `public java.lang.String makeString()`
- `public java.util.List getPossibleCreatures( EnumCreatureType p_73155_1_, int p_73155_2_, int p_73155_3_, int p_73155_4_)`
- `public ChunkPosition func_147416_a( World p_147416_1_, java.lang.String p_147416_2_, int p_147416_3_, int p_147416_4_, int p_147416_5_)`
- `public int getLoadedChunkCount()`
- `public void recreateStructures(int p_82695_1_, int p_82695_2_)`