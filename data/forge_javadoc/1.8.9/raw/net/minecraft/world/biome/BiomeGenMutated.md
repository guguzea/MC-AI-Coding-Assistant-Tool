---
title: "BiomeGenMutated"
description: "returns the chance a creature has to spawn."
package: "net/minecraft/world/biome"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/world/biome/BiomeGenMutated.html"
sourceType: javadoc
---

# BiomeGenMutated

## Class signature

```java
public class BiomeGenMutated extends BiomeGenBase
```

## Constructors

- `public BiomeGenMutated(int id, BiomeGenBase biome)`

## Methods

- `public void decorate( World worldIn, java.util.Random rand, BlockPos pos)`
- `public void genTerrainBlocks( World worldIn, java.util.Random rand, ChunkPrimer chunkPrimerIn, int p_180622_4_, int p_180622_5_, double p_180622_6_)`
- `public float getSpawningChance()`
- `public WorldGenAbstractTree genBigTreeChance(java.util.Random rand)`
- `public int getFoliageColorAtPos( BlockPos pos)`
- `public int getGrassColorAtPos( BlockPos pos)`
- `public java.lang.Class<? extends BiomeGenBase > getBiomeClass()`
- `public boolean isEqualTo( BiomeGenBase biome)`
- `public BiomeGenBase.TempCategory getTempCategory()`

## Description

returns the chance a creature has to spawn.
