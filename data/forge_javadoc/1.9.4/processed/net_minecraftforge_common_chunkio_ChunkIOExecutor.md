# ChunkIOExecutor

**Inheritance:** java.lang.Object → net.minecraftforge.common.chunkio.ChunkIOExecutor

## Class signature

```java
public class ChunkIOExecutor extends java.lang.Object
```

## Constructors

- `ChunkIOExecutor()`

## Methods

- `static void adjustPoolSize(int players)`
- `static void dropQueuedChunkLoad(World world, int x, int z, java.lang.Runnable runnable)`
- `static void queueChunkLoad(World world, AnvilChunkLoader loader, ChunkProviderServer provider, int x, int z, java.lang.Runnable runnable)`
- `static Chunk syncChunkLoad(World world, AnvilChunkLoader loader, ChunkProviderServer provider, int x, int z)`
- `static void tick()`