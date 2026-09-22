---
title: "ChunkCompileTaskGenerator"
description: "public class ChunkCompileTaskGenerator extends java.lang.Object implements java.lang.Comparable<ChunkCompileTaskGenerator>"
package: "net/minecraft/client/renderer/chunk"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/client/renderer/chunk/ChunkCompileTaskGenerator.html"
sourceType: javadoc
---

# ChunkCompileTaskGenerator

**Inheritance:** java.lang.Object → net.minecraft.client.renderer.chunk.ChunkCompileTaskGenerator

## Class signature

```java
public class ChunkCompileTaskGenerator extends java.lang.Object implements java.lang.Comparable<ChunkCompileTaskGenerator>
```

## Constructors

- `ChunkCompileTaskGenerator(RenderChunk renderChunkIn, ChunkCompileTaskGenerator.Type typeIn, double distanceSqIn)`

## Methods

- `void addFinishRunnable(java.lang.Runnable runnable)`
- `int compareTo(ChunkCompileTaskGenerator p_compareTo_1_)`
- `void finish()`
- `CompiledChunk getCompiledChunk()`
- `double getDistanceSq()`
- `java.util.concurrent.locks.ReentrantLock getLock()`
- `RegionRenderCacheBuilder getRegionRenderCacheBuilder()`
- `RenderChunk getRenderChunk()`
- `ChunkCompileTaskGenerator.Status getStatus()`
- `ChunkCompileTaskGenerator.Type getType()`
- `boolean isFinished()`
- `void setCompiledChunk(CompiledChunk compiledChunkIn)`
- `void setRegionRenderCacheBuilder(RegionRenderCacheBuilder regionRenderCacheBuilderIn)`
- `void setStatus(ChunkCompileTaskGenerator.Status statusIn)`
