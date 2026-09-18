# ChunkIOExecutor

## Class signature

```java
public class ChunkIOExecutor extends java.lang.Object
```

## Constructors

- `public ChunkIOExecutor()`

## Methods

- `public static Chunk syncChunkLoad( World world, AnvilChunkLoader loader, ChunkProviderServer provider, int x, int z)`
- `public static void queueChunkLoad( World world, AnvilChunkLoader loader, ChunkProviderServer provider, int x, int z, java.lang.Runnable runnable)`
- `public static void dropQueuedChunkLoad( World world, int x, int z, java.lang.Runnable runnable)`
- `public static void adjustPoolSize(int players)`
- `public static void tick()`