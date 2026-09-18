---
title: "BiomeProviderSingle"
description: "public class BiomeProviderSingle extends BiomeProvider"
package: "net/minecraft/world/biome"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/world/biome/BiomeProviderSingle.html"
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

- `public Biome getBiomeGenerator( BlockPos pos)`
- `public Biome [] getBiomesForGeneration( Biome [] biomes, int x, int z, int width, int height)`
- `public Biome [] loadBlockGeneratorData(@Nullable Biome [] oldBiomeList, int x, int z, int width, int depth)`
- `public Biome [] getBiomeGenAt(@Nullable Biome [] listToReuse, int x, int z, int width, int length, boolean cacheFlag)`
- `@Nullable public BlockPos findBiomePosition(int x, int z, int range, java.util.List< Biome > biomes, java.util.Random random)`
- `public boolean areBiomesViable(int x, int z, int radius, java.util.List< Biome > allowed)`
