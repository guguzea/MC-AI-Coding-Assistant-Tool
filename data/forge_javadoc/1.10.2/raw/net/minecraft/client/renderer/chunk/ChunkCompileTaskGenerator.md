---
title: "ChunkCompileTaskGenerator"
description: "public class ChunkCompileTaskGenerator extends java.lang.Object implements java.lang.Comparable<ChunkCompileTaskGenerator>"
package: "net/minecraft/client/renderer/chunk"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/client/renderer/chunk/ChunkCompileTaskGenerator.html"
sourceType: javadoc
---

# ChunkCompileTaskGenerator

**Inheritance:** java.lang.Object → net.minecraft.client.renderer.chunk.ChunkCompileTaskGenerator

## Class signature

```java
public class ChunkCompileTaskGenerator extends java.lang.Object implements java.lang.Comparable<ChunkCompileTaskGenerator>
```

## Constructors

- `ChunkCompileTaskGenerator(RenderChunk p_i46560_1_, ChunkCompileTaskGenerator.Type p_i46560_2_, double p_i46560_3_)`

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
