# ChunkProviderServer

## Class signature

```java
public class ChunkProviderServer extends java.lang.Object implements IChunkProvider
```

## Constructors

- `public ChunkProviderServer( WorldServer worldObjIn, IChunkLoader chunkLoaderIn, IChunkGenerator chunkGeneratorIn)`

## Methods

- `public java.util.Collection< Chunk > getLoadedChunks()`
- `public void queueUnload( Chunk chunkIn)`
- `public void queueUnloadAll()`
- `public Chunk getLoadedChunk(int x, int z)`
- `public Chunk loadChunk(int x, int z)`
- `public Chunk loadChunk(int x, int z, java.lang.Runnable runnable)`
- `public Chunk provideChunk(int x, int z)`
- `public boolean saveChunks(boolean all)`
- `public void flushToDisk()`
- `public boolean tick()`
- `public boolean canSave()`
- `public java.lang.String makeString()`
- `public java.util.List< Biome.SpawnListEntry > getPossibleCreatures( EnumCreatureType creatureType, BlockPos pos)`
- `public BlockPos getNearestStructurePos( World worldIn, java.lang.String structureName, BlockPos position, boolean findUnexplored)`
- `public boolean isInsideStructure( World worldIn, java.lang.String structureName, BlockPos pos)`
- `public int getLoadedChunkCount()`
- `public boolean chunkExists(int x, int z)`
- `public boolean isChunkGeneratedAt(int x, int z)`