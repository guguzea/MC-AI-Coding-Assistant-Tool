# ChunkProviderClient

## Class signature

```java
public class ChunkProviderClient extends java.lang.Object implements IChunkProvider
```

## Constructors

- `public ChunkProviderClient( World worldIn)`

## Methods

- `public void unloadChunk(int x, int z)`
- `@Nullable public Chunk getLoadedChunk(int x, int z)`
- `public Chunk loadChunk(int chunkX, int chunkZ)`
- `public Chunk provideChunk(int x, int z)`
- `public boolean unloadQueuedChunks()`
- `public java.lang.String makeString()`