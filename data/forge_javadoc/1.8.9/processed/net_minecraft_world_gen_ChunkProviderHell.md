# ChunkProviderHell

**Inheritance:** java.lang.Object → net.minecraft.world.gen.ChunkProviderHell

## Class signature

```java
public class ChunkProviderHell extends java.lang.Object implements IChunkProvider
```

## Constructors

- `ChunkProviderHell(World worldIn, boolean p_i45637_2_, long p_i45637_3_)`

## Methods

- `boolean canSave()` — Returns if the IChunkProvider supports saving.
- `boolean chunkExists(int x, int z)` — Checks to see if a chunk exists at x, z
- `boolean func_177460_a(IChunkProvider p_177460_1_, Chunk p_177460_2_, int p_177460_3_, int p_177460_4_)`
- `void func_180515_a(int p_180515_1_, int p_180515_2_, ChunkPrimer p_180515_3_)`
- `void func_180516_b(int p_180516_1_, int p_180516_2_, ChunkPrimer p_180516_3_)`
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

## Fields

- `NoiseGeneratorOctaves netherNoiseGen6`
- `NoiseGeneratorOctaves netherNoiseGen7`