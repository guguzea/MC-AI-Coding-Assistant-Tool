---
title: "ChunkProviderOverworld"
description: "public class ChunkProviderOverworld extends java.lang.Object implements IChunkGenerator"
package: "net/minecraft/world/gen"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/world/gen/ChunkProviderOverworld.html"
sourceType: javadoc
---

# ChunkProviderOverworld

**Inheritance:** java.lang.Object → net.minecraft.world.gen.ChunkProviderOverworld

## Class signature

```java
public class ChunkProviderOverworld extends java.lang.Object implements IChunkGenerator
```

## Constructors

- `ChunkProviderOverworld(World worldIn, long seed, boolean mapFeaturesEnabledIn, java.lang.String p_i46668_5_)`

## Methods

- `boolean generateStructures(Chunk chunkIn, int x, int z)`
- `java.util.List<Biome.SpawnListEntry> getPossibleCreatures(EnumCreatureType creatureType, BlockPos pos)`
- `BlockPos getStrongholdGen(World worldIn, java.lang.String structureName, BlockPos position)`
- `void populate(int x, int z)`
- `Chunk provideChunk(int x, int z)`
- `void recreateStructures(Chunk chunkIn, int x, int z)`
- `void replaceBiomeBlocks(int x, int z, ChunkPrimer primer, Biome [] biomesIn)`
- `void setBlocksInChunk(int x, int z, ChunkPrimer primer)`

## Fields

- `NoiseGeneratorOctaves depthNoise`
- `NoiseGeneratorOctaves forestNoise`
- `NoiseGeneratorOctaves scaleNoise`
- `protected static IBlockState STONE`
