---
title: "ChunkProviderDebug"
description: "public class ChunkProviderDebug extends java.lang.Object implements IChunkGenerator"
package: "net/minecraft/world/gen"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/world/gen/ChunkProviderDebug.html"
sourceType: javadoc
---

# ChunkProviderDebug

**Inheritance:** java.lang.Object → net.minecraft.world.gen.ChunkProviderDebug

## Class signature

```java
public class ChunkProviderDebug extends java.lang.Object implements IChunkGenerator
```

## Constructors

- `ChunkProviderDebug(World worldIn)`

## Methods

- `boolean generateStructures(Chunk chunkIn, int x, int z)`
- `static IBlockState getBlockStateFor(int p_177461_0_, int p_177461_1_)`
- `java.util.List<Biome.SpawnListEntry> getPossibleCreatures(EnumCreatureType creatureType, BlockPos pos)`
- `BlockPos getStrongholdGen(World worldIn, java.lang.String structureName, BlockPos position, boolean p_180513_4_)`
- `void populate(int x, int z)`
- `Chunk provideChunk(int x, int z)`
- `void recreateStructures(Chunk chunkIn, int x, int z)`

## Fields

- `protected static IBlockState AIR`
- `protected static IBlockState BARRIER`
