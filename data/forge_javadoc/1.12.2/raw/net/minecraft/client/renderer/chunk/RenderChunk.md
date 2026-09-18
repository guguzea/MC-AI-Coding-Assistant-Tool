---
title: "RenderChunk"
description: "Creates a new RegionRenderCache instance."
package: "net/minecraft/client/renderer/chunk"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/client/renderer/chunk/RenderChunk.html"
sourceType: javadoc
---

# RenderChunk

## Class signature

```java
public class RenderChunk extends java.lang.Object
```

## Constructors

- `public RenderChunk( World worldIn, RenderGlobal renderGlobalIn, int indexIn)`

## Methods

- `public boolean setFrameIndex(int frameIndexIn)`
- `public VertexBuffer getVertexBufferByLayer(int layer)`
- `public void setPosition(int x, int y, int z)`
- `public void resortTransparency(float x, float y, float z, ChunkCompileTaskGenerator generator)`
- `public void rebuildChunk(float x, float y, float z, ChunkCompileTaskGenerator generator)`
- `protected void finishCompileTask()`
- `public java.util.concurrent.locks.ReentrantLock getLockCompileTask()`
- `public ChunkCompileTaskGenerator makeCompileTaskChunk()`
- `public ChunkCompileTaskGenerator makeCompileTaskTransparency()`
- `protected double getDistanceSq()`
- `public void multModelviewMatrix()`
- `public CompiledChunk getCompiledChunk()`
- `public void setCompiledChunk( CompiledChunk compiledChunkIn)`
- `public void stopCompileTask()`
- `public void deleteGlResources()`
- `public BlockPos getPosition()`
- `public void setNeedsUpdate(boolean immediate)`
- `public void clearNeedsUpdate()`
- `public boolean needsUpdate()`
- `public boolean needsImmediateUpdate()`
- `protected ChunkCache createRegionRenderCache( World world, BlockPos from, BlockPos to, int subtract)`
- `public BlockPos getBlockPosOffset16( EnumFacing facing)`
- `public World getWorld()`

## Description

Creates a new RegionRenderCache instance.
