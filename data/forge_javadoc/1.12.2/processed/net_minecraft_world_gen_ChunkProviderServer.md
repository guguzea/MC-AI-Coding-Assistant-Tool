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
- `void flushToDisk()`
- `Chunk getLoadedChunk(int x, int z)`
- `int getLoadedChunkCount()`
- `java.util.Collection<Chunk> getLoadedChunks()`
- `BlockPos getNearestStructurePos(World worldIn, java.lang.String structureName, BlockPos position, boolean findUnexplored)`
- `java.util.List<Biome.SpawnListEntry> getPossibleCreatures(EnumCreatureType creatureType, BlockPos pos)`
- `boolean isChunkGeneratedAt(int x, int z)`
- `boolean isInsideStructure(World worldIn, java.lang.String structureName, BlockPos pos)`
- `Chunk loadChunk(int x, int z)`
- `Chunk loadChunk(int x, int z, java.lang.Runnable runnable)`
- `java.lang.String makeString()`
- `Chunk provideChunk(int x, int z)`
- `void queueUnload(Chunk chunkIn)`
- `void queueUnloadAll()`
- `boolean saveChunks(boolean all)`
- `boolean tick()`

## Fields

- `IChunkGenerator chunkGenerator`
- `IChunkLoader chunkLoader`
- `<any> id2ChunkMap`
- `WorldServer world`