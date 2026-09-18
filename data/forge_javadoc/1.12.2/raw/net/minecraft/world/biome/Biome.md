---
title: "Biome"
description: "Weighted random holder class used to hold possible flowers that can spawn in this biome when bonemeal is used on grass."
package: "net/minecraft/world/biome"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/world/biome/Biome.html"
sourceType: javadoc
---

# Biome

## Class signature

```java
public abstract class Biome extends IForgeRegistryEntry.Impl < Biome >
```

## Constructors

- `public Biome( Biome.BiomeProperties properties)`

## Methods

- `public static int getIdForBiome( Biome biome)`
- `public static Biome getBiomeForId(int id)`
- `public static Biome getMutationForBiome( Biome biome)`
- `public BiomeDecorator createBiomeDecorator()`
- `public boolean isMutation()`
- `public WorldGenAbstractTree getRandomTreeFeature(java.util.Random rand)`
- `public WorldGenerator getRandomWorldGenForGrass(java.util.Random rand)`
- `public BlockFlower.EnumFlowerType pickRandomFlower(java.util.Random rand, BlockPos pos)`
- `public int getSkyColorByTemp(float currentTemperature)`
- `public java.util.List< Biome.SpawnListEntry > getSpawnableList( EnumCreatureType creatureType)`
- `public boolean getEnableSnow()`
- `public boolean canRain()`
- `public boolean isHighHumidity()`
- `public float getSpawningChance()`
- `public final float getTemperature( BlockPos pos)`
- `public void decorate( World worldIn, java.util.Random rand, BlockPos pos)`
- `public void genTerrainBlocks( World worldIn, java.util.Random rand, ChunkPrimer chunkPrimerIn, int x, int z, double noiseVal)`
- `public int getGrassColorAtPos( BlockPos pos)`
- `public final void generateBiomeTerrain( World worldIn, java.util.Random rand, ChunkPrimer chunkPrimerIn, int x, int z, double noiseVal)`
- `public int getFoliageColorAtPos( BlockPos pos)`
- `public java.lang.Class<? extends Biome > getBiomeClass()`
- `public Biome.TempCategory getTempCategory()`
- `public static Biome getBiome(int id)`
- `public static Biome getBiome(int biomeId, Biome fallback)`
- `public boolean ignorePlayerSpawnSuitability()`
- `public final float getBaseHeight()`
- `public final float getRainfall()`
- `public final java.lang.String getBiomeName()`
- `public final float getHeightVariation()`
- `public final float getDefaultTemperature()`
- `public final int getWaterColor()`
- `public final boolean isSnowyBiome()`
- `public BiomeDecorator getModdedBiomeDecorator( BiomeDecorator original)`
- `public int getWaterColorMultiplier()`
- `public int getModdedBiomeGrassColor(int original)`
- `public int getModdedBiomeFoliageColor(int original)`
- `public void addDefaultFlowers()`
- `public void addFlower( IBlockState state, int weight)`
- `public void plantFlower( World world, java.util.Random rand, BlockPos pos)`
- `public static void registerBiomes()`
- `public static void registerBiome(int id, java.lang.String name, Biome biome)`

## Description

Weighted random holder class used to hold possible flowers that can spawn in this biome when bonemeal is used on grass.
