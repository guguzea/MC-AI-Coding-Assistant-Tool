---
title: "ChunkRenderContainer"
description: "public abstract class ChunkRenderContainer extends java.lang.Object"
package: "net/minecraft/client/renderer"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/client/renderer/ChunkRenderContainer.html"
sourceType: javadoc
---

# ChunkRenderContainer

**Inheritance:** java.lang.Object → net.minecraft.client.renderer.ChunkRenderContainer

## Class signature

```java
public abstract class ChunkRenderContainer extends java.lang.Object
```

## Constructors

- `ChunkRenderContainer()`

## Methods

- `void addRenderChunk(RenderChunk renderChunkIn, BlockRenderLayer layer)`
- `void initialize(double viewEntityXIn, double viewEntityYIn, double viewEntityZIn)`
- `void preRenderChunk(RenderChunk renderChunkIn)`
- `abstract void renderChunkLayer(BlockRenderLayer layer)`

## Fields

- `protected boolean initialized`
- `protected java.util.List<RenderChunk> renderChunks`
