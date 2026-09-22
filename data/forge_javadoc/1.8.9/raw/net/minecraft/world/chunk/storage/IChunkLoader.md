---
title: "IChunkLoader"
description: "public interface IChunkLoader"
package: "net/minecraft/world/chunk/storage"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/world/chunk/storage/IChunkLoader.html"
sourceType: javadoc
---

# IChunkLoader

## Class signature

```java
public interface IChunkLoader
```

## Methods

- `void chunkTick()` — Called every World.tick()
- `Chunk loadChunk(World worldIn, int x, int z)` — Loads the specified(XZ) chunk into the specified world.
- `void saveChunk(World worldIn, Chunk chunkIn)`
- `void saveExtraChunkData(World worldIn, Chunk chunkIn)` — Save extra data associated with this Chunk not normally saved during autosave, only during chunk unload.
- `void saveExtraData()` — Save extra data not associated with any Chunk.
