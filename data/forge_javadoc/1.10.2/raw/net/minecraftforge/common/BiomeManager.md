---
title: "BiomeManager"
description: "public class BiomeManager extends java.lang.Object"
package: "net/minecraftforge/common"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/common/BiomeManager.html"
sourceType: javadoc
---

# BiomeManager

## Class signature

```java
public class BiomeManager extends java.lang.Object
```

## Constructors

- `public BiomeManager()`

## Methods

- `public static void addVillageBiome( Biome biome, boolean canSpawn)`
- `public static void removeVillageBiome( Biome biome)`
- `public static void addStrongholdBiome( Biome biome)`
- `public static void removeStrongholdBiome( Biome biome)`
- `public static void addSpawnBiome( Biome biome)`
- `public static void removeSpawnBiome( Biome biome)`
- `public static void addBiome( BiomeManager.BiomeType type, BiomeManager.BiomeEntry entry)`
- `public static void removeBiome( BiomeManager.BiomeType type, BiomeManager.BiomeEntry entry)`
- `public static com.google.common.collect.ImmutableList< BiomeManager.BiomeEntry > getBiomes( BiomeManager.BiomeType type)`
- `public static boolean isTypeListModded( BiomeManager.BiomeType type)`
