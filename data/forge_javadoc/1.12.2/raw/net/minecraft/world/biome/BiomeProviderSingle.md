---
title: "BiomeProviderSingle"
description: "public class BiomeProviderSingle extends BiomeProvider"
package: "net/minecraft/world/biome"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/world/biome/BiomeProviderSingle.html"
sourceType: javadoc
---

# BiomeProviderSingle

## Class signature

```java
public class BiomeProviderSingle extends BiomeProvider
```

## Constructors

- `public BiomeProviderSingle( Biome biomeIn)`

## Methods

- `public Biome getBiome( BlockPos pos)`
- `public Biome [] getBiomesForGeneration( Biome [] biomes, int x, int z, int width, int height)`
- `public Biome [] getBiomes( Biome [] oldBiomeList, int x, int z, int width, int depth)`
- `public Biome [] getBiomes( Biome [] listToReuse, int x, int z, int width, int length, boolean cacheFlag)`
- `public BlockPos findBiomePosition(int x, int z, int range, java.util.List< Biome > biomes, java.util.Random random)`
- `public boolean areBiomesViable(int x, int z, int radius, java.util.List< Biome > allowed)`
- `public boolean isFixedBiome()`
- `public Biome getFixedBiome()`
