---
title: "BiomeDecorator"
description: "public class BiomeDecorator extends java.lang.Object"
package: "net/minecraft/world/biome"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/world/biome/BiomeDecorator.html"
sourceType: javadoc
---

# BiomeDecorator

**Inheritance:** java.lang.Object → net.minecraft.world.biome.BiomeDecorator

## Class signature

```java
public class BiomeDecorator extends java.lang.Object
```

## Constructors

- `BiomeDecorator()`

## Methods

- `void decorate(World worldIn, java.util.Random random, BiomeGenBase p_180292_3_, BlockPos p_180292_4_)`
- `protected void genDecorations(BiomeGenBase biomeGenBaseIn)`
- `protected void generateOres()` — Generates ores in the current chunk
- `protected void genStandardOre1(int blockCount, WorldGenerator generator, int minHeight, int maxHeight)` — Standard ore generation helper.
- `protected void genStandardOre2(int blockCount, WorldGenerator generator, int centerHeight, int spread)` — Standard ore generation helper.

## Fields

- `WorldGenerator andesiteGen`
- `WorldGenerator bigMushroomGen` — Field that holds big mushroom generator
- `int bigMushroomsPerChunk` — Amount of big mushrooms per chunk
- `int cactiPerChunk` — The number of cactus plants to generate per chunk.
- `WorldGenerator cactusGen` — Field that holds WorldGenCactus
- `ChunkProviderSettings chunkProviderSettings`
- `WorldGenerator clayGen` — The clay generator.
- `int clayPerChunk` — The number of clay patches to generate per chunk.
- `WorldGenerator coalGen`
- `World currentWorld` — The world the BiomeDecorator is currently decorating
- `int deadBushPerChunk` — The number of dead bushes to generate per chunk.
- `WorldGenerator diamondGen`
- `WorldGenerator dioriteGen`
- `WorldGenerator dirtGen` — The dirt generator.
- `BlockPos field_180294_c`
- `int flowersPerChunk` — The number of yellow flower patches to generate per chunk.
- `boolean generateLakes` — True if decorator should generate surface lava & water
- `WorldGenerator goldGen` — Field that holds gold WorldGenMinable
- `WorldGenerator graniteGen`
- `int grassPerChunk` — The amount of tall grass to generate per chunk.
- `WorldGenerator gravelAsSandGen` — The gravel generator.
- `WorldGenerator gravelGen`
- `WorldGenerator ironGen`
- `WorldGenerator lapisGen` — Field that holds Lapis WorldGenMinable
- `WorldGenerator mushroomBrownGen` — Field that holds mushroomBrown WorldGenFlowers
- `WorldGenerator mushroomRedGen` — Field that holds mushroomRed WorldGenFlowers
- `int mushroomsPerChunk` — The number of extra mushroom patches per chunk.
- `java.util.Random randomGenerator` — The Biome Decorator's random number generator.
- `WorldGenerator redstoneGen`
- `WorldGenerator reedGen` — Field that holds WorldGenReed
- `int reedsPerChunk` — The number of reeds to generate per chunk.
- `WorldGenerator sandGen` — The sand generator.
- `int sandPerChunk` — The number of sand patches to generate per chunk.
- `int sandPerChunk2` — The number of sand patches to generate per chunk.
- `int treesPerChunk` — The number of trees to attempt to generate per chunk.
- `WorldGenerator waterlilyGen` — The water lily generation!
- `int waterlilyPerChunk` — Amount of waterlilys per chunk.
- `WorldGenFlowers yellowFlowerGen`
