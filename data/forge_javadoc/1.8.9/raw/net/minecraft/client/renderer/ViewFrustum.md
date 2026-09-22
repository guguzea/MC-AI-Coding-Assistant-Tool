---
title: "ViewFrustum"
description: "public class ViewFrustum extends java.lang.Object"
package: "net/minecraft/client/renderer"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/client/renderer/ViewFrustum.html"
sourceType: javadoc
---

# ViewFrustum

**Inheritance:** java.lang.Object → net.minecraft.client.renderer.ViewFrustum

## Class signature

```java
public class ViewFrustum extends java.lang.Object
```

## Constructors

- `ViewFrustum(World worldIn, int renderDistanceChunks, RenderGlobal p_i46246_3_, IRenderChunkFactory renderChunkFactory)`

## Methods

- `protected void createRenderChunks(IRenderChunkFactory renderChunkFactory)`
- `void deleteGlResources()`
- `protected RenderChunk getRenderChunk(BlockPos pos)`
- `void markBlocksForUpdate(int fromX, int fromY, int fromZ, int toX, int toY, int toZ)`
- `protected void setCountChunksXYZ(int renderDistanceChunks)`
- `void updateChunkPositions(double viewEntityX, double viewEntityZ)`

## Fields

- `protected int countChunksX`
- `protected int countChunksY`
- `protected int countChunksZ`
- `RenderChunk [] renderChunks`
- `protected RenderGlobal renderGlobal`
- `protected World world`
