---
title: "ChunkGeneratorDebug"
description: "public class ChunkGeneratorDebug extends java.lang.Object implements IChunkGenerator"
package: "net/minecraft/world/gen"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/world/gen/ChunkGeneratorDebug.html"
sourceType: javadoc
---

# ChunkGeneratorDebug

**Inheritance:** java.lang.Object → net.minecraft.world.gen.ChunkGeneratorDebug

## Class signature

```java
public class ChunkGeneratorDebug extends java.lang.Object implements IChunkGenerator
```

## Constructors

- `ChunkGeneratorDebug(World worldIn)`

## Methods

- `Chunk generateChunk(int x, int z)`
- `boolean generateStructures(Chunk chunkIn, int x, int z)`
- `static IBlockState getBlockStateFor(int p_177461_0_, int p_177461_1_)`
- `BlockPos getNearestStructurePos(World worldIn, java.lang.String structureName, BlockPos position, boolean findUnexplored)`
- `java.util.List<Biome.SpawnListEntry> getPossibleCreatures(EnumCreatureType creatureType, BlockPos pos)`
- `boolean isInsideStructure(World worldIn, java.lang.String structureName, BlockPos pos)`
- `void populate(int x, int z)`
- `void recreateStructures(Chunk chunkIn, int x, int z)`

## Fields

- `protected static IBlockState AIR`
- `protected static IBlockState BARRIER`
