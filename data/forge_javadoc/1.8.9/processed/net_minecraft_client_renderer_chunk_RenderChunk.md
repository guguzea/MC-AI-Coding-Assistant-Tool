# RenderChunk

**Inheritance:** java.lang.Object → net.minecraft.client.renderer.chunk.RenderChunk

## Class signature

```java
public class RenderChunk extends java.lang.Object
```

## Constructors

- `RenderChunk(World worldIn, RenderGlobal renderGlobalIn, BlockPos blockPosIn, int indexIn)`

## Methods

- `protected RegionRenderCache createRegionRenderCache(World world, BlockPos from, BlockPos to, int subtract)` — Creates a new RegionRenderCache instance.
- `void deleteGlResources()`
- `protected void finishCompileTask()`
- `BlockPos getBlockPosOffset16(EnumFacing p_181701_1_)`
- `CompiledChunk getCompiledChunk()`
- `java.util.concurrent.locks.ReentrantLock getLockCompileTask()`
- `BlockPos getPosition()`
- `VertexBuffer getVertexBufferByLayer(int layer)`
- `boolean isNeedsUpdate()`
- `ChunkCompileTaskGenerator makeCompileTaskChunk()`
- `ChunkCompileTaskGenerator makeCompileTaskTransparency()`
- `void multModelviewMatrix()`
- `void rebuildChunk(float x, float y, float z, ChunkCompileTaskGenerator generator)`
- `void resortTransparency(float x, float y, float z, ChunkCompileTaskGenerator generator)`
- `void setCompiledChunk(CompiledChunk compiledChunkIn)`
- `boolean setFrameIndex(int frameIndexIn)`
- `void setNeedsUpdate(boolean needsUpdateIn)`
- `void setPosition(BlockPos pos)`
- `void stopCompileTask()`

## Fields

- `AxisAlignedBB boundingBox`
- `CompiledChunk compiledChunk`
- `static int renderChunksUpdated`