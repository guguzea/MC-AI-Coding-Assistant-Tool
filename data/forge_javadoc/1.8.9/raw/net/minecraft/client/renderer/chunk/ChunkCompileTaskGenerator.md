---
title: "ChunkCompileTaskGenerator"
description: "public class ChunkCompileTaskGenerator extends java.lang.Object"
package: "net/minecraft/client/renderer/chunk"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/client/renderer/chunk/ChunkCompileTaskGenerator.html"
sourceType: javadoc
---

# ChunkCompileTaskGenerator

## Class signature

```java
public class ChunkCompileTaskGenerator extends java.lang.Object
```

## Constructors

- `public ChunkCompileTaskGenerator( RenderChunk renderChunkIn, ChunkCompileTaskGenerator.Type typeIn)`

## Methods

- `public ChunkCompileTaskGenerator.Status getStatus()`
- `public RenderChunk getRenderChunk()`
- `public CompiledChunk getCompiledChunk()`
- `public void setCompiledChunk( CompiledChunk compiledChunkIn)`
- `public RegionRenderCacheBuilder getRegionRenderCacheBuilder()`
- `public void setRegionRenderCacheBuilder( RegionRenderCacheBuilder regionRenderCacheBuilderIn)`
- `public void setStatus( ChunkCompileTaskGenerator.Status statusIn)`
- `public void finish()`
- `public void addFinishRunnable(java.lang.Runnable p_178539_1_)`
- `public java.util.concurrent.locks.ReentrantLock getLock()`
- `public ChunkCompileTaskGenerator.Type getType()`
- `public boolean isFinished()`
