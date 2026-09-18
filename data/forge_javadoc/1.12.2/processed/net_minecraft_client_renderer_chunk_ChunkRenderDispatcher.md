# ChunkRenderDispatcher

## Class signature

```java
public class ChunkRenderDispatcher extends java.lang.Object
```

## Constructors

- `public ChunkRenderDispatcher()`
- `public ChunkRenderDispatcher(int countRenderBuilders)`

## Methods

- `public java.lang.String getDebugInfo()`
- `public boolean runChunkUploads(long finishTimeNano)`
- `public boolean updateChunkLater( RenderChunk chunkRenderer)`
- `public boolean updateChunkNow( RenderChunk chunkRenderer)`
- `public void stopChunkUpdates()`
- `public void freeRenderBuilder( RegionRenderCacheBuilder p_178512_1_)`
- `public RegionRenderCacheBuilder allocateRenderBuilder() throws java.lang.InterruptedException`
- `public ChunkCompileTaskGenerator getNextChunkUpdate() throws java.lang.InterruptedException`
- `public boolean updateTransparencyLater( RenderChunk chunkRenderer)`
- `public <any> uploadChunk( BlockRenderLayer p_188245_1_, BufferBuilder p_188245_2_, RenderChunk p_188245_3_, CompiledChunk p_188245_4_, double p_188245_5_)`
- `public void clearChunkUpdates()`
- `public boolean hasChunkUpdates()`
- `public void stopWorkerThreads()`
- `public boolean hasNoFreeRenderBuilders()`