---
title: "IChunkLoader"
description: "Called every World.tick()"
package: "net/minecraft/world/chunk/storage"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/world/chunk/storage/IChunkLoader.html"
sourceType: javadoc
---

# IChunkLoader

## Class signature

```java
public interface IChunkLoader
```

## Methods

- `Chunk loadChunk( World worldIn, int x, int z) throws java.io.IOException`
- `void saveChunk( World worldIn, Chunk chunkIn) throws MinecraftException , java.io.IOException`
- `void saveExtraChunkData( World worldIn, Chunk chunkIn) throws java.io.IOException`
- `void chunkTick()`
- `void saveExtraData()`

## Description

Called every World.tick()
