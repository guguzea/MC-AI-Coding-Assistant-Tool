# ChunkRenderDispatcher

**Inheritance:** java.lang.Object → net.minecraft.client.renderer.chunk.ChunkRenderDispatcher

## Class signature

```java
public class ChunkRenderDispatcher extends java.lang.Object
```

## Constructors

- `ChunkRenderDispatcher()`

## Methods

- `RegionRenderCacheBuilder allocateRenderBuilder()`
- `void clearChunkUpdates()`
- `void freeRenderBuilder(RegionRenderCacheBuilder p_178512_1_)`
- `java.lang.String getDebugInfo()`
- `ChunkCompileTaskGenerator getNextChunkUpdate()`
- `boolean runChunkUploads(long p_178516_1_)`
- `void stopChunkUpdates()`
- `boolean updateChunkLater(RenderChunk chunkRenderer)`
- `boolean updateChunkNow(RenderChunk chunkRenderer)`
- `boolean updateTransparencyLater(RenderChunk chunkRenderer)`
- `<any> uploadChunk(EnumWorldBlockLayer player, WorldRenderer p_178503_2_, RenderChunk chunkRenderer, CompiledChunk compiledChunkIn)`