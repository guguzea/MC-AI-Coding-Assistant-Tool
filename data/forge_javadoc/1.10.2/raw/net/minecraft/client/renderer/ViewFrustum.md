---
title: "ViewFrustum"
description: "public class ViewFrustum extends java.lang.Object"
package: "net/minecraft/client/renderer"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/client/renderer/ViewFrustum.html"
sourceType: javadoc
---

# ViewFrustum

## Class signature

```java
public class ViewFrustum extends java.lang.Object
```

## Constructors

- `public ViewFrustum( World worldIn, int renderDistanceChunks, RenderGlobal renderGlobalIn, IRenderChunkFactory renderChunkFactory)`

## Methods

- `protected void createRenderChunks( IRenderChunkFactory renderChunkFactory)`
- `public void deleteGlResources()`
- `protected void setCountChunksXYZ(int renderDistanceChunks)`
- `public void updateChunkPositions(double viewEntityX, double viewEntityZ)`
- `public void markBlocksForUpdate(int p_187474_1_, int p_187474_2_, int p_187474_3_, int p_187474_4_, int p_187474_5_, int p_187474_6_, boolean p_187474_7_)`
- `@Nullable protected RenderChunk getRenderChunk( BlockPos pos)`
