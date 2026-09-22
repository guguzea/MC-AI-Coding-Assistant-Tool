---
title: "ChunkProviderEnd"
description: "public class ChunkProviderEnd extends java.lang.Object implements IChunkGenerator"
package: "net/minecraft/world/gen"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/world/gen/ChunkProviderEnd.html"
sourceType: javadoc
---

# ChunkProviderEnd

**Inheritance:** java.lang.Object → net.minecraft.world.gen.ChunkProviderEnd

## Class signature

```java
public class ChunkProviderEnd extends java.lang.Object implements IChunkGenerator
```

## Constructors

- `ChunkProviderEnd(World worldObjIn, boolean mapFeaturesEnabledIn, long seed)`

## Methods

- `void buildSurfaces(ChunkPrimer primer)`
- `boolean generateStructures(Chunk chunkIn, int x, int z)`
- `java.util.List<Biome.SpawnListEntry> getPossibleCreatures(EnumCreatureType creatureType, BlockPos pos)`
- `BlockPos getStrongholdGen(World worldIn, java.lang.String structureName, BlockPos position)`
- `boolean isIslandChunk(int p_185961_1_, int p_185961_2_)`
- `void populate(int x, int z)`
- `Chunk provideChunk(int x, int z)`
- `void recreateStructures(Chunk chunkIn, int x, int z)`
- `void setBlocksInChunk(int x, int z, ChunkPrimer primer)`

## Fields

- `protected static IBlockState AIR`
- `protected static IBlockState END_STONE`
- `NoiseGeneratorOctaves noiseGen5`
- `NoiseGeneratorOctaves noiseGen6`
