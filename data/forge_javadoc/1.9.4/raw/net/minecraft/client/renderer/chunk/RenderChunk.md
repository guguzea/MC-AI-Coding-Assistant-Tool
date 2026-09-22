---
title: "RenderChunk"
description: "public class RenderChunk extends java.lang.Object"
package: "net/minecraft/client/renderer/chunk"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/client/renderer/chunk/RenderChunk.html"
sourceType: javadoc
---

# RenderChunk

**Inheritance:** java.lang.Object → net.minecraft.client.renderer.chunk.RenderChunk

## Class signature

```java
public class RenderChunk extends java.lang.Object
```

## Constructors

- `RenderChunk(World p_i47120_1_, RenderGlobal p_i47120_2_, int p_i47120_3_)`

## Methods

- `void clearNeedsUpdate()`
- `protected ChunkCache createRegionRenderCache(World world, BlockPos from, BlockPos to, int subtract)` — Creates a new RegionRenderCache instance.
- `void deleteGlResources()`
- `protected void finishCompileTask()`
- `BlockPos getBlockPosOffset16(EnumFacing p_181701_1_)`
- `CompiledChunk getCompiledChunk()`
- `protected double getDistanceSq()`
- `java.util.concurrent.locks.ReentrantLock getLockCompileTask()`
- `BlockPos getPosition()`
- `VertexBuffer getVertexBufferByLayer(int layer)`
- `World getWorld()`
- `boolean isNeedsUpdate()`
- `boolean isNeedsUpdateCustom()`
- `ChunkCompileTaskGenerator makeCompileTaskChunk()`
- `ChunkCompileTaskGenerator makeCompileTaskTransparency()`
- `void multModelviewMatrix()`
- `void rebuildChunk(float x, float y, float z, ChunkCompileTaskGenerator generator)`
- `void resortTransparency(float x, float y, float z, ChunkCompileTaskGenerator generator)`
- `void setCompiledChunk(CompiledChunk compiledChunkIn)`
- `boolean setFrameIndex(int frameIndexIn)`
- `void setNeedsUpdate(boolean needsUpdateIn)`
- `void setOrigin(int p_189562_1_, int p_189562_2_, int p_189562_3_)`
- `void stopCompileTask()`

## Fields

- `AxisAlignedBB boundingBox`
- `CompiledChunk compiledChunk`
- `static int renderChunksUpdated`
