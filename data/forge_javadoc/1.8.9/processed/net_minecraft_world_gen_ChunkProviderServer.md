# ChunkProviderServer

## Class signature

```java
public class ChunkProviderServer extends java.lang.Object implements IChunkProvider
```

## Constructors

- `public ChunkProviderServer( WorldServer p_i1520_1_, IChunkLoader p_i1520_2_, IChunkProvider p_i1520_3_)`

## Methods

- `public boolean chunkExists(int x, int z)`
- `public java.util.List< Chunk > func_152380_a()`
- `public void dropChunk(int x, int z)`
- `public void unloadAllChunks()`
- `public Chunk loadChunk(int p_73158_1_, int p_73158_2_)`
- `public Chunk loadChunk(int par1, int par2, java.lang.Runnable runnable)`
- `public Chunk originalLoadChunk(int p_73158_1_, int p_73158_2_)`
- `public Chunk provideChunk(int x, int z)`
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

if set, this flag forces a request to load a chunk to load the chunk rather than defaulting to the dummy if possible