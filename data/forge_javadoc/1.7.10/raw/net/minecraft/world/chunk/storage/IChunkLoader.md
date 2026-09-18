---
title: "IChunkLoader"
description: "public interface IChunkLoader"
package: "net/minecraft/world/chunk/storage"
version: "1.7.10"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/net/minecraft/world/chunk/storage/IChunkLoader.html"
sourceType: javadoc
---

# IChunkLoader

## Class signature

```java
public interface IChunkLoader
```

## Methods

- `Chunk loadChunk( World p_75815_1_, int p_75815_2_, int p_75815_3_) throws java.io.IOException`
- `void saveChunk( World p_75816_1_, Chunk p_75816_2_) throws MinecraftException , java.io.IOException`
- `void saveExtraChunkData( World p_75819_1_, Chunk p_75819_2_)`
- `void chunkTick()`
- `void saveExtraData()`
