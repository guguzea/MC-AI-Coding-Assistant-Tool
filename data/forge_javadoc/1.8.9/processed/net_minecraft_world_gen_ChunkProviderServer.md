# ChunkProviderServer

**Inheritance:** java.lang.Object → net.minecraft.world.gen.ChunkProviderServer

## Class signature

```java
public class ChunkProviderServer extends java.lang.Object implements IChunkProvider
```

## Constructors

- `ChunkProviderServer(WorldServer p_i1520_1_, IChunkLoader p_i1520_2_, IChunkProvider p_i1520_3_)`

## Methods

- `boolean canSave()` — Returns if the IChunkProvider supports saving.
- `boolean chunkExists(int x, int z)` — Checks to see if a chunk exists at x, z
- `void dropChunk(int x, int z)`
- `java.util.List<Chunk> func_152380_a()`
- `boolean func_177460_a(IChunkProvider p_177460_1_, Chunk p_177460_2_, int p_177460_3_, int p_177460_4_)`
- `int getLoadedChunkCount()`
- `java.util.List<BiomeGenBase.SpawnListEntry> getPossibleCreatures(EnumCreatureType creatureType, BlockPos pos)`
- `BlockPos getStrongholdGen(World worldIn, java.lang.String structureName, BlockPos position)`
- `Chunk loadChunk(int p_73158_1_, int p_73158_2_)` — loads or generates the chunk at the chunk location specified
- `Chunk loadChunk(int par1, int par2, java.lang.Runnable runnable)`
- `java.lang.String makeString()` — Converts the instance data to a readable string.
- `Chunk originalLoadChunk(int p_73158_1_, int p_73158_2_)`
- `void populate(IChunkProvider p_73153_1_, int p_73153_2_, int p_73153_3_)` — Populates chunk with ores etc etc
- `Chunk provideChunk(BlockPos blockPosIn)`
- `Chunk provideChunk(int x, int z)` — Will return back a chunk, if it doesn't exist and its not a MP client it will generates all the blocks for the specified chunk from the map seed and chunk seed
- `void recreateStructures(Chunk p_180514_1_, int p_180514_2_, int p_180514_3_)`
- `boolean saveChunks(boolean p_73151_1_, IProgressUpdate progressCallback)` — Two modes of operation: if passed true, save all Chunks in one go.
- `void saveExtraData()` — Save extra data not associated with any Chunk.
- `void unloadAllChunks()` — marks all chunks for unload, ignoring those near the spawn
- `boolean unloadQueuedChunks()` — Unloads chunks that are marked to be unloaded.

## Fields

- `IChunkLoader chunkLoader`
- `boolean chunkLoadOverride` — if set, this flag forces a request to load a chunk to load the chunk rather than defaulting to the dummy if possible
- `LongHashMap<Chunk> id2ChunkMap`
- `java.util.List<Chunk> loadedChunks`
- `IChunkProvider serverChunkGenerator` — chunk generator object.
- `WorldServer worldObj`