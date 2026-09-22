# ChunkProviderClient

**Inheritance:** java.lang.Object → net.minecraft.client.multiplayer.ChunkProviderClient

## Class signature

```java
public class ChunkProviderClient extends java.lang.Object implements IChunkProvider
```

## Constructors

- `ChunkProviderClient(World worldIn)`

## Methods

- `boolean canSave()` — Returns if the IChunkProvider supports saving.
- `boolean chunkExists(int x, int z)` — Checks to see if a chunk exists at x, z
- `boolean func_177460_a(IChunkProvider p_177460_1_, Chunk p_177460_2_, int p_177460_3_, int p_177460_4_)`
- `int getLoadedChunkCount()`
- `java.util.List<BiomeGenBase.SpawnListEntry> getPossibleCreatures(EnumCreatureType creatureType, BlockPos pos)`
- `BlockPos getStrongholdGen(World worldIn, java.lang.String structureName, BlockPos position)`
- `Chunk loadChunk(int p_73158_1_, int p_73158_2_)` — loads or generates the chunk at the chunk location specified
- `java.lang.String makeString()` — Converts the instance data to a readable string.
- `void populate(IChunkProvider p_73153_1_, int p_73153_2_, int p_73153_3_)` — Populates chunk with ores etc etc
- `Chunk provideChunk(BlockPos blockPosIn)`
- `Chunk provideChunk(int x, int z)` — Will return back a chunk, if it doesn't exist and its not a MP client it will generates all the blocks for the specified chunk from the map seed and chunk seed
- `void recreateStructures(Chunk p_180514_1_, int p_180514_2_, int p_180514_3_)`
- `boolean saveChunks(boolean p_73151_1_, IProgressUpdate progressCallback)` — Two modes of operation: if passed true, save all Chunks in one go.
- `void saveExtraData()` — Save extra data not associated with any Chunk.
- `void unloadChunk(int p_73234_1_, int p_73234_2_)` — Unload chunk from ChunkProviderClient's hashmap.
- `boolean unloadQueuedChunks()` — Unloads chunks that are marked to be unloaded.