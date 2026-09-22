---
title: "IChunkLoader"
description: "public interface IChunkLoader"
package: "net/minecraft/world/chunk/storage"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/world/chunk/storage/IChunkLoader.html"
sourceType: javadoc
---

# IChunkLoader

## Class signature

```java
public interface IChunkLoader
```

## Methods

- `void chunkTick()`
- `void flush()`
- `boolean isChunkGeneratedAt(int x, int z)`
- `Chunk loadChunk(World worldIn, int x, int z)`
- `void saveChunk(World worldIn, Chunk chunkIn)`
- `void saveExtraChunkData(World worldIn, Chunk chunkIn)`
