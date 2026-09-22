---
title: "ChunkGeneratorEnd"
description: "public class ChunkGeneratorEnd extends java.lang.Object implements IChunkGenerator"
package: "net/minecraft/world/gen"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/world/gen/ChunkGeneratorEnd.html"
sourceType: javadoc
---

# ChunkGeneratorEnd

**Inheritance:** java.lang.Object → net.minecraft.world.gen.ChunkGeneratorEnd

## Class signature

```java
public class ChunkGeneratorEnd extends java.lang.Object implements IChunkGenerator
```

## Constructors

- `ChunkGeneratorEnd(World p_i47241_1_, boolean p_i47241_2_, long p_i47241_3_, BlockPos p_i47241_5_)`

## Methods

- `void buildSurfaces(ChunkPrimer primer)`
- `Chunk generateChunk(int x, int z)`
- `boolean generateStructures(Chunk chunkIn, int x, int z)`
- `BlockPos getNearestStructurePos(World worldIn, java.lang.String structureName, BlockPos position, boolean findUnexplored)`
- `java.util.List<Biome.SpawnListEntry> getPossibleCreatures(EnumCreatureType creatureType, BlockPos pos)`
- `boolean isInsideStructure(World worldIn, java.lang.String structureName, BlockPos pos)`
- `boolean isIslandChunk(int p_185961_1_, int p_185961_2_)`
- `void populate(int x, int z)`
- `void recreateStructures(Chunk chunkIn, int x, int z)`
- `void setBlocksInChunk(int x, int z, ChunkPrimer primer)`

## Fields

- `protected static IBlockState AIR`
- `protected static IBlockState END_STONE`
- `NoiseGeneratorOctaves noiseGen5`
- `NoiseGeneratorOctaves noiseGen6`
