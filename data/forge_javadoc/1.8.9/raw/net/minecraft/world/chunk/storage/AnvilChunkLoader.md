---
title: "AnvilChunkLoader"
description: "Save directory for chunks using the Anvil format"
package: "net/minecraft/world/chunk/storage"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/world/chunk/storage/AnvilChunkLoader.html"
sourceType: javadoc
---

# AnvilChunkLoader

## Class signature

```java
public class AnvilChunkLoader extends java.lang.Object implements IChunkLoader , IThreadedFileIO
```

## Constructors

- `public AnvilChunkLoader(java.io.File chunkSaveLocationIn)`

## Methods

- `public boolean chunkExists( World world, int x, int z)`
- `public Chunk loadChunk( World worldIn, int x, int z) throws java.io.IOException`
- `public java.lang.Object[] loadChunk__Async( World worldIn, int x, int z) throws java.io.IOException`
- `protected Chunk checkedReadChunkFromNBT( World worldIn, int x, int z, NBTTagCompound p_75822_4_)`
- `protected java.lang.Object[] checkedReadChunkFromNBT__Async( World worldIn, int x, int z, NBTTagCompound p_75822_4_)`
- `public void saveChunk( World worldIn, Chunk chunkIn) throws MinecraftException , java.io.IOException`
- `protected void addChunkToPending( ChunkCoordIntPair p_75824_1_, NBTTagCompound p_75824_2_)`
- `public boolean writeNextIO()`
- `public void saveExtraChunkData( World worldIn, Chunk chunkIn) throws java.io.IOException`
- `public void chunkTick()`
- `public void saveExtraData()`
- `public void loadEntities( World worldIn, NBTTagCompound p_75823_2_, Chunk chunk)`

## Description

Save directory for chunks using the Anvil format
