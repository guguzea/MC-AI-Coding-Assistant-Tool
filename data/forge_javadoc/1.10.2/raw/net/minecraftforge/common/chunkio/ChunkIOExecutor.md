---
title: "ChunkIOExecutor"
description: "public class ChunkIOExecutor extends java.lang.Object"
package: "net/minecraftforge/common/chunkio"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/common/chunkio/ChunkIOExecutor.html"
sourceType: javadoc
---

# ChunkIOExecutor

**Inheritance:** java.lang.Object → net.minecraftforge.common.chunkio.ChunkIOExecutor

## Class signature

```java
public class ChunkIOExecutor extends java.lang.Object
```

## Constructors

- `ChunkIOExecutor()`

## Methods

- `static void adjustPoolSize(int players)`
- `static void dropQueuedChunkLoad(World world, int x, int z, java.lang.Runnable runnable)`
- `static void queueChunkLoad(World world, AnvilChunkLoader loader, ChunkProviderServer provider, int x, int z, java.lang.Runnable runnable)`
- `static Chunk syncChunkLoad(World world, AnvilChunkLoader loader, ChunkProviderServer provider, int x, int z)`
- `static void tick()`
