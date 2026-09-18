---
title: "ChunkCompileTaskGenerator"
description: "public class ChunkCompileTaskGenerator extends java.lang.Object implements java.lang.Comparable< ChunkCompileTaskGenerator >"
package: "net/minecraft/client/renderer/chunk"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/client/renderer/chunk/ChunkCompileTaskGenerator.html"
sourceType: javadoc
---

# ChunkCompileTaskGenerator

## Class signature

```java
public class ChunkCompileTaskGenerator extends java.lang.Object implements java.lang.Comparable< ChunkCompileTaskGenerator >
```

## Constructors

- `public ChunkCompileTaskGenerator( RenderChunk renderChunkIn, ChunkCompileTaskGenerator.Type typeIn, double distanceSqIn)`

## Methods

- `public ChunkCompileTaskGenerator.Status getStatus()`
- `public RenderChunk getRenderChunk()`
- `public CompiledChunk getCompiledChunk()`
- `public void setCompiledChunk( CompiledChunk compiledChunkIn)`
- `public RegionRenderCacheBuilder getRegionRenderCacheBuilder()`
- `public void setRegionRenderCacheBuilder( RegionRenderCacheBuilder regionRenderCacheBuilderIn)`
- `public void setStatus( ChunkCompileTaskGenerator.Status statusIn)`
- `public void finish()`
- `public void addFinishRunnable(java.lang.Runnable runnable)`
- `public java.util.concurrent.locks.ReentrantLock getLock()`
- `public ChunkCompileTaskGenerator.Type getType()`
- `public boolean isFinished()`
- `public int compareTo( ChunkCompileTaskGenerator p_compareTo_1_)`
- `public double getDistanceSq()`
