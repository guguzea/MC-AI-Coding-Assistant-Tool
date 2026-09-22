---
title: "ViewFrustum"
description: "public class ViewFrustum extends java.lang.Object"
package: "net/minecraft/client/renderer"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/client/renderer/ViewFrustum.html"
sourceType: javadoc
---

# ViewFrustum

**Inheritance:** java.lang.Object → net.minecraft.client.renderer.ViewFrustum

## Class signature

```java
public class ViewFrustum extends java.lang.Object
```

## Constructors

- `ViewFrustum(World worldIn, int renderDistanceChunks, RenderGlobal renderGlobalIn, IRenderChunkFactory renderChunkFactory)`

## Methods

- `protected void createRenderChunks(IRenderChunkFactory renderChunkFactory)`
- `void deleteGlResources()`
- `protected RenderChunk getRenderChunk(BlockPos pos)`
- `void markBlocksForUpdate(int minX, int minY, int minZ, int maxX, int maxY, int maxZ, boolean updateImmediately)`
- `protected void setCountChunksXYZ(int renderDistanceChunks)`
- `void updateChunkPositions(double viewEntityX, double viewEntityZ)`

## Fields

- `protected int countChunksX`
- `protected int countChunksY`
- `protected int countChunksZ`
- `RenderChunk [] renderChunks`
- `protected RenderGlobal renderGlobal`
- `protected World world`
