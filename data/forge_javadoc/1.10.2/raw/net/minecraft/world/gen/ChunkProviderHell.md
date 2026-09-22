---
title: "ChunkProviderHell"
description: "public class ChunkProviderHell extends java.lang.Object implements IChunkGenerator"
package: "net/minecraft/world/gen"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/world/gen/ChunkProviderHell.html"
sourceType: javadoc
---

# ChunkProviderHell

**Inheritance:** java.lang.Object → net.minecraft.world.gen.ChunkProviderHell

## Class signature

```java
public class ChunkProviderHell extends java.lang.Object implements IChunkGenerator
```

## Constructors

- `ChunkProviderHell(World worldIn, boolean p_i45637_2_, long seed)`

## Methods

- `void buildSurfaces(int p_185937_1_, int p_185937_2_, ChunkPrimer primer)`
- `boolean generateStructures(Chunk chunkIn, int x, int z)`
- `java.util.List<Biome.SpawnListEntry> getPossibleCreatures(EnumCreatureType creatureType, BlockPos pos)`
- `BlockPos getStrongholdGen(World worldIn, java.lang.String structureName, BlockPos position)`
- `void populate(int x, int z)`
- `void prepareHeights(int p_185936_1_, int p_185936_2_, ChunkPrimer primer)`
- `Chunk provideChunk(int x, int z)`
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
