# ChunkProviderClient

**Inheritance:** java.lang.Object → net.minecraft.client.multiplayer.ChunkProviderClient

## Class signature

```java
public class ChunkProviderClient extends java.lang.Object implements IChunkProvider
```

## Constructors

- `ChunkProviderClient(World worldIn)`

## Methods

- `Chunk getLoadedChunk(int x, int z)`
- `boolean isChunkGeneratedAt(int x, int z)`
- `Chunk loadChunk(int chunkX, int chunkZ)`
- `java.lang.String makeString()`
- `Chunk provideChunk(int x, int z)`
- `boolean tick()`
- `void unloadChunk(int x, int z)`