---
title: "ViewFrustum"
description: "public class ViewFrustum extends java.lang.Object"
package: "net/minecraft/client/renderer"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/client/renderer/ViewFrustum.html"
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
- `void markBlocksForUpdate(int p_187474_1_, int p_187474_2_, int p_187474_3_, int p_187474_4_, int p_187474_5_, int p_187474_6_, boolean p_187474_7_)`
- `protected void setCountChunksXYZ(int renderDistanceChunks)`
- `void updateChunkPositions(double viewEntityX, double viewEntityZ)`

## Fields

- `protected int countChunksX`
- `protected int countChunksY`
- `protected int countChunksZ`
- `RenderChunk [] renderChunks`
- `protected RenderGlobal renderGlobal`
- `protected World world`
