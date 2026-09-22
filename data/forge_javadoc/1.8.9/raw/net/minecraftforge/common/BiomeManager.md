---
title: "BiomeManager"
description: "public class BiomeManager extends java.lang.Object"
package: "net/minecraftforge/common"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/common/BiomeManager.html"
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
- `static void addSpawnBiome(BiomeGenBase biome)`
- `static void addStrongholdBiome(BiomeGenBase biome)`
- `static void addVillageBiome(BiomeGenBase biome, boolean canSpawn)`
- `static<any> getBiomes(BiomeManager.BiomeType type)`
- `static boolean isTypeListModded(BiomeManager.BiomeType type)`
- `static void removeBiome(BiomeManager.BiomeType type, BiomeManager.BiomeEntry entry)`
- `static void removeSpawnBiome(BiomeGenBase biome)`
- `static void removeStrongholdBiome(BiomeGenBase biome)`
- `static void removeVillageBiome(BiomeGenBase biome)`

## Fields

- `static java.util.List<BiomeGenBase> oceanBiomes`
- `static java.util.ArrayList<BiomeGenBase> strongHoldBiomes`
- `static java.util.ArrayList<BiomeGenBase> strongHoldBiomesBlackList`
