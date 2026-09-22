---
title: "BiomeMesa"
description: "public class BiomeMesa extends Biome"
package: "net/minecraft/world/biome"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/world/biome/BiomeMesa.html"
sourceType: javadoc
---

# BiomeMesa

**Inheritance:** java.lang.Object → net.minecraftforge.registries.IForgeRegistryEntry.Impl<Biome> → net.minecraft.world.biome.Biome → net.minecraft.world.biome.BiomeMesa

## Class signature

```java
public class BiomeMesa extends Biome
```

## Constructors

- `BiomeMesa(boolean p_i46704_1_, boolean p_i46704_2_, Biome.BiomeProperties properties)`

## Methods

- `BiomeDecorator createBiomeDecorator()`
- `void generateBands(long p_150619_1_)`
- `void genTerrainBlocks(World worldIn, java.util.Random rand, ChunkPrimer chunkPrimerIn, int x, int z, double noiseVal)`
- `IBlockState getBand(int p_180629_1_, int p_180629_2_, int p_180629_3_)`
- `int getFoliageColorAtPos(BlockPos pos)`
- `int getGrassColorAtPos(BlockPos pos)`
- `WorldGenAbstractTree getRandomTreeFeature(java.util.Random rand)`

## Fields

- `protected static IBlockState COARSE_DIRT`
- `protected static IBlockState GRASS`
- `protected static IBlockState HARDENED_CLAY`
- `protected static IBlockState ORANGE_STAINED_HARDENED_CLAY`
- `protected static IBlockState RED_SAND`
- `protected static IBlockState STAINED_HARDENED_CLAY`
