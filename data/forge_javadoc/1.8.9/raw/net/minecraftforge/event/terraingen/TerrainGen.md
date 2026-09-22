---
title: "TerrainGen"
description: "public abstract class TerrainGen extends java.lang.Object"
package: "net/minecraftforge/event/terraingen"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/event/terraingen/TerrainGen.html"
sourceType: javadoc
---

# TerrainGen

**Inheritance:** java.lang.Object → net.minecraftforge.event.terraingen.TerrainGen

## Class signature

```java
public abstract class TerrainGen extends java.lang.Object
```

## Constructors

- `TerrainGen()`

## Methods

- `static boolean decorate(World world, java.util.Random rand, BlockPos pos, DecorateBiomeEvent.Decorate.EventType type)`
- `static boolean generateOre(World world, java.util.Random rand, WorldGenerator generator, BlockPos pos, OreGenEvent.GenerateMinable.EventType type)`
- `static MapGenBase getModdedMapGen(MapGenBase original, InitMapGenEvent.EventType type)`
- `static NoiseGenerator [] getModdedNoiseGenerators(World world, java.util.Random rand, NoiseGenerator [] original)`
- `static boolean populate(IChunkProvider chunkProvider, World world, java.util.Random rand, int chunkX, int chunkZ, boolean hasVillageGenerated, PopulateChunkEvent.Populate.EventType type)`
- `static boolean saplingGrowTree(World world, java.util.Random rand, BlockPos pos)`
