# ChunkProviderServer

**Inheritance:** java.lang.Object → net.minecraft.world.gen.ChunkProviderServer

## Class signature

```java
public class ChunkProviderServer extends java.lang.Object implements IChunkProvider
```

## Constructors

- `ChunkProviderServer(WorldServer worldObjIn, IChunkLoader chunkLoaderIn, IChunkGenerator chunkGeneratorIn)`

## Methods

- `boolean canSave()`
- `boolean chunkExists(int x, int z)`
- `Chunk getLoadedChunk(int x, int z)`
- `int getLoadedChunkCount()`
- `java.util.Collection<Chunk> getLoadedChunks()`
- `java.util.List<Biome.SpawnListEntry> getPossibleCreatures(EnumCreatureType creatureType, BlockPos pos)`
- `BlockPos getStrongholdGen(World worldIn, java.lang.String structureName, BlockPos position, boolean p_180513_4_)`
- `boolean isChunkGeneratedAt(int p_191062_1_, int p_191062_2_)`
- `Chunk loadChunk(int x, int z)`
- `Chunk loadChunk(int x, int z, java.lang.Runnable runnable)`
- `java.lang.String makeString()`
- `Chunk provideChunk(int x, int z)`
- `boolean saveChunks(boolean p_186027_1_)`
- `void saveExtraData()`
- `boolean tick()`
- `void unload(Chunk chunkIn)`
- `void unloadAllChunks()`

## Fields

- `IChunkGenerator chunkGenerator`
- `IChunkLoader chunkLoader`
- `it.unimi.dsi.fastutil.longs.Long2ObjectMap<Chunk> id2ChunkMap`
- `WorldServer world`