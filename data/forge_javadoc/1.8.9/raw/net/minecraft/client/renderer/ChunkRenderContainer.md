---
title: "ChunkRenderContainer"
description: "public abstract class ChunkRenderContainer extends java.lang.Object"
package: "net/minecraft/client/renderer"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/client/renderer/ChunkRenderContainer.html"
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

- `void addRenderChunk(RenderChunk renderChunkIn, EnumWorldBlockLayer layer)`
- `void initialize(double viewEntityXIn, double viewEntityYIn, double viewEntityZIn)`
- `void preRenderChunk(RenderChunk renderChunkIn)`
- `abstract void renderChunkLayer(EnumWorldBlockLayer layer)`

## Fields

- `protected boolean initialized`
- `protected java.util.List<RenderChunk> renderChunks`
