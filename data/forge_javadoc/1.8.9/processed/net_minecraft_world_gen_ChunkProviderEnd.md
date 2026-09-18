# ChunkProviderEnd

## Class signature

```java
public class ChunkProviderEnd extends java.lang.Object implements IChunkProvider
```

## Constructors

- `public ChunkProviderEnd( World worldIn, long p_i2007_2_)`

## Methods

- `public void func_180520_a(int p_180520_1_, int p_180520_2_, ChunkPrimer p_180520_3_)`
- `public void func_180519_a( ChunkPrimer p_180519_1_)`
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