---
title: "ChunkCompileTaskGenerator"
description: "public class ChunkCompileTaskGenerator extends java.lang.Object implements java.lang.Comparable< ChunkCompileTaskGenerator >"
package: "net/minecraft/client/renderer/chunk"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/client/renderer/chunk/ChunkCompileTaskGenerator.html"
sourceType: javadoc
---

# ChunkCompileTaskGenerator

## Class signature

```java
public class ChunkCompileTaskGenerator extends java.lang.Object implements java.lang.Comparable< ChunkCompileTaskGenerator >
```

## Constructors

- `public ChunkCompileTaskGenerator( RenderChunk p_i46560_1_, ChunkCompileTaskGenerator.Type p_i46560_2_, double p_i46560_3_)`

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
