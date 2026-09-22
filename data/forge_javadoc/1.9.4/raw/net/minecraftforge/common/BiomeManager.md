---
title: "BiomeManager"
description: "public class BiomeManager extends java.lang.Object"
package: "net/minecraftforge/common"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/common/BiomeManager.html"
sourceType: javadoc
---

# BiomeManager

**Inheritance:** java.lang.Object → net.minecraftforge.common.BiomeManager

## Class signature

```java
public class BiomeManager extends java.lang.Object
```

## Constructors

- `BiomeManager()`

## Methods

- `static void addBiome(BiomeManager.BiomeType type, BiomeManager.BiomeEntry entry)`
- `static void addSpawnBiome(Biome biome)`
- `static void addStrongholdBiome(Biome biome)`
- `static void addVillageBiome(Biome biome, boolean canSpawn)`
- `static com.google.common.collect.ImmutableList<BiomeManager.BiomeEntry> getBiomes(BiomeManager.BiomeType type)`
- `static boolean isTypeListModded(BiomeManager.BiomeType type)`
- `static void removeBiome(BiomeManager.BiomeType type, BiomeManager.BiomeEntry entry)`
- `static void removeSpawnBiome(Biome biome)`
- `static void removeStrongholdBiome(Biome biome)`
- `static void removeVillageBiome(Biome biome)`

## Fields

- `static java.util.List<Biome> oceanBiomes`
- `static java.util.ArrayList<Biome> strongHoldBiomes`
- `static java.util.ArrayList<Biome> strongHoldBiomesBlackList`
