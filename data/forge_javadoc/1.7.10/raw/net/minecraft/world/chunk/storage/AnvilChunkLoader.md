---
title: "AnvilChunkLoader"
description: "public class AnvilChunkLoader extends java.lang.Object implements IChunkLoader, IThreadedFileIO"
package: "net/minecraft/world/chunk/storage"
version: "1.7.10"
forgeBuild: "10.13.4.1614"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/net/minecraft/world/chunk/storage/AnvilChunkLoader.html"
sourceType: javadoc
---

# AnvilChunkLoader

**Inheritance:** java.lang.Object → net.minecraft.world.chunk.storage.AnvilChunkLoader

## Class signature

```java
public class AnvilChunkLoader extends java.lang.Object implements IChunkLoader, IThreadedFileIO
```

## Constructors

- `AnvilChunkLoader(java.io.File p_i2003_1_)`

## Methods

- `protected void addChunkToPending(ChunkCoordIntPair p_75824_1_, NBTTagCompound p_75824_2_)`
- `protected Chunk checkedReadChunkFromNBT(World p_75822_1_, int p_75822_2_, int p_75822_3_, NBTTagCompound p_75822_4_)`
- `void chunkTick()`
- `Chunk loadChunk(World p_75815_1_, int p_75815_2_, int p_75815_3_)`
- `void saveChunk(World p_75816_1_, Chunk p_75816_2_)`
- `void saveExtraChunkData(World p_75819_1_, Chunk p_75819_2_)`
- `void saveExtraData()`
- `boolean writeNextIO()`

## Fields

- `java.io.File chunkSaveLocation`
