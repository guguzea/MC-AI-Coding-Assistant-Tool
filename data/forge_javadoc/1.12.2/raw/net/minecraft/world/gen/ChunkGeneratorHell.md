---
title: "ChunkGeneratorHell"
description: "public class ChunkGeneratorHell extends java.lang.Object implements IChunkGenerator"
package: "net/minecraft/world/gen"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/world/gen/ChunkGeneratorHell.html"
sourceType: javadoc
---

# ChunkGeneratorHell

**Inheritance:** java.lang.Object → net.minecraft.world.gen.ChunkGeneratorHell

## Class signature

```java
public class ChunkGeneratorHell extends java.lang.Object implements IChunkGenerator
```

## Constructors

- `ChunkGeneratorHell(World worldIn, boolean p_i45637_2_, long seed)`

## Methods

- `void buildSurfaces(int p_185937_1_, int p_185937_2_, ChunkPrimer primer)`
- `Chunk generateChunk(int x, int z)`
- `boolean generateStructures(Chunk chunkIn, int x, int z)`
- `BlockPos getNearestStructurePos(World worldIn, java.lang.String structureName, BlockPos position, boolean findUnexplored)`
- `java.util.List<Biome.SpawnListEntry> getPossibleCreatures(EnumCreatureType creatureType, BlockPos pos)`
- `boolean isInsideStructure(World worldIn, java.lang.String structureName, BlockPos pos)`
- `void populate(int x, int z)`
- `void prepareHeights(int p_185936_1_, int p_185936_2_, ChunkPrimer primer)`
- `void recreateStructures(Chunk chunkIn, int x, int z)`

## Fields

- `protected static IBlockState AIR`
- `protected static IBlockState BEDROCK`
- `NoiseGeneratorOctaves depthNoise`
- `protected static IBlockState GRAVEL`
- `protected static IBlockState LAVA`
- `protected static IBlockState NETHERRACK`
- `NoiseGeneratorOctaves scaleNoise`
- `protected static IBlockState SOUL_SAND`
