---
title: "BiomeGenBase"
description: "public abstract class BiomeGenBase extends java.lang.Object"
package: "net/minecraft/world/biome"
version: "1.7.10"
forgeBuild: "10.13.4.1614"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/net/minecraft/world/biome/BiomeGenBase.html"
sourceType: javadoc
---

# BiomeGenBase

**Inheritance:** java.lang.Object → net.minecraft.world.biome.BiomeGenBase

## Class signature

```java
public abstract class BiomeGenBase extends java.lang.Object
```

## Constructors

- `BiomeGenBase(int p_i1971_1_)`

## Methods

- `boolean canSpawnLightningBolt()`
- `BiomeDecorator createBiomeDecorator()`
- `BiomeGenBase createMutation()`
- `void decorate(World p_76728_1_, java.util.Random p_76728_2_, int p_76728_3_, int p_76728_4_)`
- `BiomeGenBase func_150557_a(int p_150557_1_, boolean p_150557_2_)`
- `boolean func_150559_j()`
- `BiomeGenBase func_150563_c(int p_150563_1_)`
- `WorldGenAbstractTree func_150567_a(java.util.Random p_150567_1_)`
- `java.lang.String func_150572_a(java.util.Random p_150572_1_, int p_150572_2_, int p_150572_3_, int p_150572_4_)`
- `BiomeGenBase func_76733_a(int p_76733_1_)`
- `void genBiomeTerrain(World p_150560_1_, java.util.Random p_150560_2_, Block [] p_150560_3_, byte[] p_150560_4_, int p_150560_5_, int p_150560_6_, double p_150560_7_)`
- `void genTerrainBlocks(World p_150573_1_, java.util.Random p_150573_2_, Block [] p_150573_3_, byte[] p_150573_4_, int p_150573_5_, int p_150573_6_, double p_150573_7_)`
- `static BiomeGenBase getBiome(int p_150568_0_)`
- `java.lang.Class getBiomeClass()`
- `int getBiomeFoliageColor(int p_150571_1_, int p_150571_2_, int p_150571_3_)`
- `static BiomeGenBase [] getBiomeGenArray()`
- `int getBiomeGrassColor(int p_150558_1_, int p_150558_2_, int p_150558_3_)`
- `boolean getEnableSnow()`
- `float getFloatRainfall()`
- `float getFloatTemperature(int p_150564_1_, int p_150564_2_, int p_150564_3_)`
- `int getIntRainfall()`
- `WorldGenerator getRandomWorldGenForGrass(java.util.Random p_76730_1_)`
- `int getSkyColorByTemp(float p_76731_1_)`
- `java.util.List getSpawnableList(EnumCreatureType p_76747_1_)`
- `float getSpawningChance()`
- `BiomeGenBase.TempCategory getTempCategory()`
- `boolean isEqualTo(BiomeGenBase p_150569_1_)`
- `boolean isHighHumidity()`
- `BiomeGenBase setBiomeName(java.lang.String p_76735_1_)`
- `BiomeGenBase setColor(int p_76739_1_)`
- `BiomeGenBase setDisableRain()`
- `BiomeGenBase setEnableSnow()`
- `BiomeGenBase setHeight(BiomeGenBase.Height p_150570_1_)`
- `BiomeGenBase setTemperatureRainfall(float p_76732_1_, float p_76732_2_)`

## Fields

- `static BiomeGenBase beach`
- `int biomeID`
- `java.lang.String biomeName`
- `static BiomeGenBase birchForest`
- `static BiomeGenBase birchForestHills`
- `static BiomeGenBase coldBeach`
- `static BiomeGenBase coldTaiga`
- `static BiomeGenBase coldTaigaHills`
- `int color`
- `static BiomeGenBase deepOcean`
- `static BiomeGenBase desert`
- `static BiomeGenBase desertHills`
- `protected boolean enableRain`
- `protected boolean enableSnow`
- `static java.util.Set explorationBiomesList`
- `static BiomeGenBase extremeHills`
- `static BiomeGenBase extremeHillsEdge`
- `static BiomeGenBase extremeHillsPlus`
- `int field_150604_aj`
- `int field_150609_ah`
- `int field_76754_C`
- `Block fillerBlock`
- `static BiomeGenBase forest`
- `static BiomeGenBase forestHills`
- `static BiomeGenBase frozenOcean`
- `static BiomeGenBase frozenRiver`
- `protected static WorldGenDoublePlant genTallFlowers`
- `protected static BiomeGenBase.Height height_DeepOceans`
- `protected static BiomeGenBase.Height height_Default`
- `protected static BiomeGenBase.Height height_HighPlateaus`
- `protected static BiomeGenBase.Height height_LowHills`
- `protected static BiomeGenBase.Height height_LowIslands`
- `protected static BiomeGenBase.Height height_LowPlains`
- `protected static BiomeGenBase.Height height_MidHills`
- `protected static BiomeGenBase.Height height_MidPlains`
- `protected static BiomeGenBase.Height height_Oceans`
- `protected static BiomeGenBase.Height height_PartiallySubmerged`
- `protected static BiomeGenBase.Height height_RockyWaters`
- `protected static BiomeGenBase.Height height_ShallowWaters`
- `protected static BiomeGenBase.Height height_Shores`
- `float heightVariation`
- `static BiomeGenBase hell`
- `static BiomeGenBase iceMountains`
- `static BiomeGenBase icePlains`
- `static BiomeGenBase jungle`
- `static BiomeGenBase jungleEdge`
- `static BiomeGenBase jungleHills`
- `static BiomeGenBase megaTaiga`
- `static BiomeGenBase megaTaigaHills`
- `static BiomeGenBase mesa`
- `static BiomeGenBase mesaPlateau`
- `static BiomeGenBase mesaPlateau_F`
- `static BiomeGenBase mushroomIsland`
- `static BiomeGenBase mushroomIslandShore`
- `static BiomeGenBase ocean`
- `static BiomeGenBase plains`
- `protected static NoiseGeneratorPerlin plantNoise`
- `float rainfall`
- `static BiomeGenBase river`
- `static BiomeGenBase roofedForest`
- `float rootHeight`
- `static BiomeGenBase savanna`
- `static BiomeGenBase savannaPlateau`
- `static BiomeGenBase sky`
- `protected java.util.List spawnableCaveCreatureList`
- `protected java.util.List spawnableCreatureList`
- `protected java.util.List spawnableMonsterList`
- `protected java.util.List spawnableWaterCreatureList`
- `static BiomeGenBase stoneBeach`
- `static BiomeGenBase swampland`
- `static BiomeGenBase taiga`
- `static BiomeGenBase taigaHills`
- `float temperature`
- `protected static NoiseGeneratorPerlin temperatureNoise`
- `BiomeDecorator theBiomeDecorator`
- `Block topBlock`
- `int waterColorMultiplier`
- `protected WorldGenBigTree worldGeneratorBigTree`
- `protected WorldGenSwamp worldGeneratorSwamp`
- `protected WorldGenTrees worldGeneratorTrees`
