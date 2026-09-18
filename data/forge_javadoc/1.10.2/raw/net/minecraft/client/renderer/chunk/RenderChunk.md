---
title: "RenderChunk"
description: "Creates a new RegionRenderCache instance."
package: "net/minecraft/client/renderer/chunk"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/client/renderer/chunk/RenderChunk.html"
sourceType: javadoc
---

# RenderChunk

## Class signature

```java
public class RenderChunk extends java.lang.Object
```

## Constructors

- `public RenderChunk( World p_i47120_1_, RenderGlobal p_i47120_2_, int p_i47120_3_)`

## Methods

- `public boolean setFrameIndex(int frameIndexIn)`
- `public VertexBuffer getVertexBufferByLayer(int layer)`
- `public void setPosition(int p_189562_1_, int p_189562_2_, int p_189562_3_)`
- `public void resortTransparency(float x, float y, float z, ChunkCompileTaskGenerator generator)`
- `public void rebuildChunk(float x, float y, float z, ChunkCompileTaskGenerator generator)`
- `protected void finishCompileTask()`
- `public java.util.concurrent.locks.ReentrantLock getLockCompileTask()`
- `public ChunkCompileTaskGenerator makeCompileTaskChunk()`
- `@Nullable public ChunkCompileTaskGenerator makeCompileTaskTransparency()`
- `protected double getDistanceSq()`
- `public void multModelviewMatrix()`
- `public CompiledChunk getCompiledChunk()`
- `public void setCompiledChunk( CompiledChunk compiledChunkIn)`
- `public void stopCompileTask()`
- `public void deleteGlResources()`
- `public BlockPos getPosition()`
- `public void setNeedsUpdate(boolean needsUpdateIn)`
- `public void clearNeedsUpdate()`
- `public boolean isNeedsUpdate()`
- `public boolean isNeedsUpdateCustom()`
- `protected ChunkCache createRegionRenderCache( World world, BlockPos from, BlockPos to, int subtract)`
- `public BlockPos getBlockPosOffset16( EnumFacing p_181701_1_)`
- `public World getWorld()`

## Description

Creates a new RegionRenderCache instance.
