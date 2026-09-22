# ChunkCompileTaskGenerator

**Inheritance:** java.lang.Object → net.minecraft.client.renderer.chunk.ChunkCompileTaskGenerator

## Class signature

```java
public class ChunkCompileTaskGenerator extends java.lang.Object
```

## Constructors

- `ChunkCompileTaskGenerator(RenderChunk renderChunkIn, ChunkCompileTaskGenerator.Type typeIn)`

## Methods

- `void addFinishRunnable(java.lang.Runnable p_178539_1_)`
- `void finish()`
- `CompiledChunk getCompiledChunk()`
- `java.util.concurrent.locks.ReentrantLock getLock()`
- `RegionRenderCacheBuilder getRegionRenderCacheBuilder()`
- `RenderChunk getRenderChunk()`
- `ChunkCompileTaskGenerator.Status getStatus()`
- `ChunkCompileTaskGenerator.Type getType()`
- `boolean isFinished()`
- `void setCompiledChunk(CompiledChunk compiledChunkIn)`
- `void setRegionRenderCacheBuilder(RegionRenderCacheBuilder regionRenderCacheBuilderIn)`
- `void setStatus(ChunkCompileTaskGenerator.Status statusIn)`