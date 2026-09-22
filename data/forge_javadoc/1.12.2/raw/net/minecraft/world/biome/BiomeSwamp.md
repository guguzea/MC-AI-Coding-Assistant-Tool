---
title: "BiomeSwamp"
description: "public class BiomeSwamp extends Biome"
package: "net/minecraft/world/biome"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/world/biome/BiomeSwamp.html"
sourceType: javadoc
---

# BiomeSwamp

**Inheritance:** java.lang.Object → net.minecraftforge.registries.IForgeRegistryEntry.Impl<Biome> → net.minecraft.world.biome.Biome → net.minecraft.world.biome.BiomeSwamp

## Class signature

```java
public class BiomeSwamp extends Biome
```

## Constructors

- `BiomeSwamp(Biome.BiomeProperties properties)`

## Methods

- `void addDefaultFlowers()` — Adds the default flowers, as of 1.7, it is 2 yellow, and 1 red.
- `void decorate(World worldIn, java.util.Random rand, BlockPos pos)`
- `void genTerrainBlocks(World worldIn, java.util.Random rand, ChunkPrimer chunkPrimerIn, int x, int z, double noiseVal)`
- `int getFoliageColorAtPos(BlockPos pos)`
- `int getGrassColorAtPos(BlockPos pos)`
- `WorldGenAbstractTree getRandomTreeFeature(java.util.Random rand)`
- `BlockFlower.EnumFlowerType pickRandomFlower(java.util.Random rand, BlockPos pos)`

## Fields

- `protected static IBlockState WATER_LILY`
