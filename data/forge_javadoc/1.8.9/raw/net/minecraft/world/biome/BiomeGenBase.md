---
title: "BiomeGenBase"
description: "Weighted random holder class used to hold possible flowers that can spawn in this biome when bonemeal is used on grass."
package: "net/minecraft/world/biome"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/world/biome/BiomeGenBase.html"
sourceType: javadoc
---

# BiomeGenBase

## Class signature

```java
public abstract class BiomeGenBase extends java.lang.Object
```

## Constructors

- `public BiomeGenBase(int id)`
- `public BiomeGenBase(int id, boolean register)`

## Methods

- `public BiomeDecorator createBiomeDecorator()`
- `public BiomeGenBase setTemperatureRainfall(float temperatureIn, float rainfallIn)`
- `public final BiomeGenBase setHeight( BiomeGenBase.Height heights)`
- `public BiomeGenBase setDisableRain()`
- `public WorldGenAbstractTree genBigTreeChance(java.util.Random rand)`
- `public WorldGenerator getRandomWorldGenForGrass(java.util.Random rand)`
- `public BlockFlower.EnumFlowerType pickRandomFlower(java.util.Random rand, BlockPos pos)`
- `public BiomeGenBase setEnableSnow()`
- `public BiomeGenBase setBiomeName(java.lang.String name)`
- `public BiomeGenBase setFillerBlockMetadata(int meta)`
- `public BiomeGenBase setColor(int colorIn)`
- `public BiomeGenBase func_150563_c(int p_150563_1_)`
- `public BiomeGenBase func_150557_a(int p_150557_1_, boolean p_150557_2_)`
- `public int getSkyColorByTemp(float p_76731_1_)`
- `public java.util.List< BiomeGenBase.SpawnListEntry > getSpawnableList( EnumCreatureType creatureType)`
- `public boolean getEnableSnow()`
- `public boolean canSpawnLightningBolt()`
- `public boolean isHighHumidity()`
- `public float getSpawningChance()`
- `public final int getIntRainfall()`
- `public final float getFloatRainfall()`
- `public final float getFloatTemperature( BlockPos pos)`
- `public void decorate( World worldIn, java.util.Random rand, BlockPos pos)`
- `public int getGrassColorAtPos( BlockPos pos)`
- `public int getFoliageColorAtPos( BlockPos pos)`
- `public boolean isSnowyBiome()`
- `public void genTerrainBlocks( World worldIn, java.util.Random rand, ChunkPrimer chunkPrimerIn, int p_180622_4_, int p_180622_5_, double p_180622_6_)`
- `public final void generateBiomeTerrain( World worldIn, java.util.Random rand, ChunkPrimer chunkPrimerIn, int p_180628_4_, int p_180628_5_, double p_180628_6_)`
- `public BiomeGenBase createMutation()`
- `public BiomeGenBase createMutatedBiome(int p_180277_1_)`
- `public java.lang.Class<? extends BiomeGenBase > getBiomeClass()`
- `public boolean isEqualTo( BiomeGenBase biome)`
- `public BiomeGenBase.TempCategory getTempCategory()`
- `public static BiomeGenBase [] getBiomeGenArray()`
- `public static BiomeGenBase getBiome(int id)`
- `public static BiomeGenBase getBiomeFromBiomeList(int biomeId, BiomeGenBase biome)`
- `public BiomeDecorator getModdedBiomeDecorator( BiomeDecorator original)`
- `public int getWaterColorMultiplier()`
- `public int getModdedBiomeGrassColor(int original)`
- `public int getModdedBiomeFoliageColor(int original)`
- `public void addDefaultFlowers()`
- `public void addFlower( IBlockState state, int weight)`
- `public void plantFlower( World world, java.util.Random rand, BlockPos pos)`

## Description

Weighted random holder class used to hold possible flowers that can spawn in this biome when bonemeal is used on grass.
