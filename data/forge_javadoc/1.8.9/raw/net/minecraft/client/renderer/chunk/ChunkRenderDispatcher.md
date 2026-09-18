---
title: "ChunkRenderDispatcher"
description: "public class ChunkRenderDispatcher extends java.lang.Object"
package: "net/minecraft/client/renderer/chunk"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/client/renderer/chunk/ChunkRenderDispatcher.html"
sourceType: javadoc
---

# ChunkRenderDispatcher

## Class signature

```java
public class ChunkRenderDispatcher extends java.lang.Object
```

## Constructors

- `public ChunkRenderDispatcher()`

## Methods

- `public java.lang.String getDebugInfo()`
- `public boolean runChunkUploads(long p_178516_1_)`
- `public boolean updateChunkLater( RenderChunk chunkRenderer)`
- `public boolean updateChunkNow( RenderChunk chunkRenderer)`
- `public void stopChunkUpdates()`
- `public void freeRenderBuilder( RegionRenderCacheBuilder p_178512_1_)`
- `public RegionRenderCacheBuilder allocateRenderBuilder() throws java.lang.InterruptedException`
- `public ChunkCompileTaskGenerator getNextChunkUpdate() throws java.lang.InterruptedException`
- `public boolean updateTransparencyLater( RenderChunk chunkRenderer)`
- `public <any> uploadChunk( EnumWorldBlockLayer player, WorldRenderer p_178503_2_, RenderChunk chunkRenderer, CompiledChunk compiledChunkIn)`
- `public void clearChunkUpdates()`
