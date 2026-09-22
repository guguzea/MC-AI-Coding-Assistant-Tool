---
title: "BiomeForest"
description: "public class BiomeForest extends Biome"
package: "net/minecraft/world/biome"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/world/biome/BiomeForest.html"
sourceType: javadoc
---

# BiomeForest

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.IForgeRegistryEntry.Impl<Biome> → net.minecraft.world.biome.Biome → net.minecraft.world.biome.BiomeForest

## Class signature

```java
public class BiomeForest extends Biome
```

## Constructors

- `BiomeForest(BiomeForest.Type typeIn, Biome.BiomeProperties properties)`

## Methods

- `void addDefaultFlowers()` — Adds the default flowers, as of 1.7, it is 2 yellow, and 1 red.
- `void addDoublePlants(World p_185378_1_, java.util.Random p_185378_2_, BlockPos p_185378_3_, int p_185378_4_)`
- `void addMushrooms(World p_185379_1_, java.util.Random p_185379_2_, BlockPos p_185379_3_)`
- `void decorate(World worldIn, java.util.Random rand, BlockPos pos)`
- `WorldGenAbstractTree genBigTreeChance(java.util.Random rand)`
- `java.lang.Class<? extends Biome> getBiomeClass()`
- `int getGrassColorAtPos(BlockPos pos)`
- `BlockFlower.EnumFlowerType pickRandomFlower(java.util.Random rand, BlockPos pos)`

## Fields

- `protected static WorldGenBirchTree BIRCH_TREE`
- `protected static WorldGenCanopyTree ROOF_TREE`
- `protected static WorldGenBirchTree SUPER_BIRCH_TREE`
