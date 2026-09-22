---
title: "BiomeProvider"
description: "public class BiomeProvider extends java.lang.Object"
package: "net/minecraft/world/biome"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/world/biome/BiomeProvider.html"
sourceType: javadoc
---

# BiomeProvider

**Inheritance:** java.lang.Object → net.minecraft.world.biome.BiomeProvider

## Class signature

```java
public class BiomeProvider extends java.lang.Object
```

## Constructors

- `BiomeProvider()`
- `BiomeProvider(WorldInfo info)`

## Methods

- `boolean areBiomesViable(int x, int z, int radius, java.util.List<Biome> allowed)`
- `void cleanupCache()`
- `BlockPos findBiomePosition(int x, int z, int range, java.util.List<Biome> biomes, java.util.Random random)`
- `Biome getBiome(BlockPos pos)`
- `Biome getBiome(BlockPos pos, Biome defaultBiome)`
- `Biome [] getBiomes(Biome [] oldBiomeList, int x, int z, int width, int depth)`
- `Biome [] getBiomes(Biome [] listToReuse, int x, int z, int width, int length, boolean cacheFlag)`
- `Biome [] getBiomesForGeneration(Biome [] biomes, int x, int z, int width, int height)`
- `java.util.List<Biome> getBiomesToSpawnIn()`
- `GenLayer [] getModdedBiomeGenerators(WorldType worldType, long seed, GenLayer [] original)`
- `float getTemperatureAtHeight(float p_76939_1_, int p_76939_2_)`

## Fields

- `static java.util.List<Biome> allowedBiomes`
