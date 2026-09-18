# RenderChunk

## Class signature

```java
public class RenderChunk extends java.lang.Object
```

## Constructors

- `public RenderChunk( World worldIn, RenderGlobal renderGlobalIn, BlockPos blockPosIn, int indexIn)`

## Methods

- `public boolean setFrameIndex(int frameIndexIn)`
- `public VertexBuffer getVertexBufferByLayer(int layer)`
- `public void setPosition( BlockPos pos)`
- `public void resortTransparency(float x, float y, float z, ChunkCompileTaskGenerator generator)`
- `public void rebuildChunk(float x, float y, float z, ChunkCompileTaskGenerator generator)`
- `protected void finishCompileTask()`
- `public java.util.concurrent.locks.ReentrantLock getLockCompileTask()`
- `public ChunkCompileTaskGenerator makeCompileTaskChunk()`
- `public ChunkCompileTaskGenerator makeCompileTaskTransparency()`
- `public void multModelviewMatrix()`
- `public CompiledChunk getCompiledChunk()`
- `public void setCompiledChunk( CompiledChunk compiledChunkIn)`
- `public void stopCompileTask()`
- `public void deleteGlResources()`
- `public BlockPos getPosition()`
- `public void setNeedsUpdate(boolean needsUpdateIn)`
- `public boolean isNeedsUpdate()`
- `protected RegionRenderCache createRegionRenderCache( World world, BlockPos from, BlockPos to, int subtract)`
- `public BlockPos getBlockPosOffset16( EnumFacing p_181701_1_)`

## Description

Creates a new RegionRenderCache instance.