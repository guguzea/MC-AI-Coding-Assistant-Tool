---
title: "AnvilChunkLoader"
description: "public class AnvilChunkLoader extends java.lang.Object implements IChunkLoader, IThreadedFileIO"
package: "net/minecraft/world/chunk/storage"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/world/chunk/storage/AnvilChunkLoader.html"
sourceType: javadoc
---

# AnvilChunkLoader

**Inheritance:** java.lang.Object → net.minecraft.world.chunk.storage.AnvilChunkLoader

## Class signature

```java
public class AnvilChunkLoader extends java.lang.Object implements IChunkLoader, IThreadedFileIO
```

## Constructors

- `AnvilChunkLoader(java.io.File chunkSaveLocationIn, DataFixer dataFixerIn)`

## Methods

- `protected void addChunkToPending(ChunkPos pos, NBTTagCompound compound)`
- `protected java.lang.Object[] checkedReadChunkFromNBT__Async(World worldIn, int x, int z, NBTTagCompound compound)`
- `protected Chunk checkedReadChunkFromNBT(World worldIn, int x, int z, NBTTagCompound compound)`
- `boolean chunkExists(World world, int x, int z)`
- `void chunkTick()`
- `protected static Entity createEntityFromNBT(NBTTagCompound compound, World worldIn)`
- `java.lang.Object[] loadChunk__Async(World worldIn, int x, int z)`
- `Chunk loadChunk(World worldIn, int x, int z)`
- `void loadEntities(World worldIn, NBTTagCompound compound, Chunk chunk)`
- `static Entity readChunkEntity(NBTTagCompound compound, World worldIn, Chunk chunkIn)`
- `static Entity readWorldEntity(NBTTagCompound compound, World worldIn, boolean p_186051_2_)`
- `static Entity readWorldEntityPos(NBTTagCompound compound, World worldIn, double x, double y, double z, boolean attemptSpawn)`
- `void saveChunk(World worldIn, Chunk chunkIn)`
- `void saveExtraChunkData(World worldIn, Chunk chunkIn)`
- `void saveExtraData()`
- `static void spawnEntity(Entity entityIn, World worldIn)`
- `boolean writeNextIO()`

## Fields

- `java.io.File chunkSaveLocation`
