---
title: "IChunkLoader"
description: "public interface IChunkLoader"
package: "net/minecraft/world/chunk/storage"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/world/chunk/storage/IChunkLoader.html"
sourceType: javadoc
---

# IChunkLoader

## Class signature

```java
public interface IChunkLoader
```

## Methods

- `@Nullable Chunk loadChunk( World worldIn, int x, int z) throws java.io.IOException`
- `void saveChunk( World worldIn, Chunk chunkIn) throws MinecraftException , java.io.IOException`
- `void saveExtraChunkData( World worldIn, Chunk chunkIn) throws java.io.IOException`
- `void chunkTick()`
- `void saveExtraData()`
- `boolean isChunkGeneratedAt(int p_191063_1_, int p_191063_2_)`
