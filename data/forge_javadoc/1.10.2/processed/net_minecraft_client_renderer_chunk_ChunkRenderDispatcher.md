# ChunkRenderDispatcher

**Inheritance:** java.lang.Object → net.minecraft.client.renderer.chunk.ChunkRenderDispatcher

## Class signature

```java
public class ChunkRenderDispatcher extends java.lang.Object
```

## Constructors

- `ChunkRenderDispatcher()`
- `ChunkRenderDispatcher(int countRenderBuilders)`

## Methods

- `RegionRenderCacheBuilder allocateRenderBuilder()`
- `void clearChunkUpdates()`
- `void freeRenderBuilder(RegionRenderCacheBuilder p_178512_1_)`
- `java.lang.String getDebugInfo()`
- `ChunkCompileTaskGenerator getNextChunkUpdate()`
- `boolean hasChunkUpdates()`
- `boolean hasNoFreeRenderBuilders()`
- `boolean runChunkUploads(long p_178516_1_)`
- `void stopChunkUpdates()`
- `void stopWorkerThreads()`
- `boolean updateChunkLater(RenderChunk chunkRenderer)`
- `boolean updateChunkNow(RenderChunk chunkRenderer)`
- `boolean updateTransparencyLater(RenderChunk chunkRenderer)`
- `com.google.common.util.concurrent.ListenableFuture<java.lang.Object> uploadChunk(BlockRenderLayer p_188245_1_, VertexBuffer p_188245_2_, RenderChunk p_188245_3_, CompiledChunk p_188245_4_, double p_188245_5_)`