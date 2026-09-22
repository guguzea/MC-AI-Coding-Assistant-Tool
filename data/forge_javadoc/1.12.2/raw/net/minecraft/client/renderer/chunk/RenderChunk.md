---
title: "RenderChunk"
description: "public class RenderChunk extends java.lang.Object"
package: "net/minecraft/client/renderer/chunk"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/client/renderer/chunk/RenderChunk.html"
sourceType: javadoc
---

# RenderChunk

**Inheritance:** java.lang.Object → net.minecraft.client.renderer.chunk.RenderChunk

## Class signature

```java
public class RenderChunk extends java.lang.Object
```

## Constructors

- `RenderChunk(World worldIn, RenderGlobal renderGlobalIn, int indexIn)`

## Methods

- `void clearNeedsUpdate()`
- `protected ChunkCache createRegionRenderCache(World world, BlockPos from, BlockPos to, int subtract)` — Creates a new RegionRenderCache instance.
- `void deleteGlResources()`
- `protected void finishCompileTask()`
- `BlockPos getBlockPosOffset16(EnumFacing facing)`
- `CompiledChunk getCompiledChunk()`
- `protected double getDistanceSq()`
- `java.util.concurrent.locks.ReentrantLock getLockCompileTask()`
- `BlockPos getPosition()`
- `VertexBuffer getVertexBufferByLayer(int layer)`
- `World getWorld()`
- `ChunkCompileTaskGenerator makeCompileTaskChunk()`
- `ChunkCompileTaskGenerator makeCompileTaskTransparency()`
- `void multModelviewMatrix()`
- `boolean needsImmediateUpdate()`
- `boolean needsUpdate()`
- `void rebuildChunk(float x, float y, float z, ChunkCompileTaskGenerator generator)`
- `void resortTransparency(float x, float y, float z, ChunkCompileTaskGenerator generator)`
- `void setCompiledChunk(CompiledChunk compiledChunkIn)`
- `boolean setFrameIndex(int frameIndexIn)`
- `void setNeedsUpdate(boolean immediate)`
- `void setPosition(int x, int y, int z)`
- `void stopCompileTask()`

## Fields

- `AxisAlignedBB boundingBox`
- `CompiledChunk compiledChunk`
- `static int renderChunksUpdated`
