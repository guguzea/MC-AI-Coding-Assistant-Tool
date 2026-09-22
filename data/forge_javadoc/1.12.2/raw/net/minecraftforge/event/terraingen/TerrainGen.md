---
title: "TerrainGen"
description: "public abstract class TerrainGen extends java.lang.Object"
package: "net/minecraftforge/event/terraingen"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/event/terraingen/TerrainGen.html"
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

- `@Deprecated static boolean decorate(World world, java.util.Random rand, BlockPos pos, DecorateBiomeEvent.Decorate.EventType type)`
- `static boolean decorate(World world, java.util.Random rand, ChunkPos chunkPos, BlockPos placementPos, DecorateBiomeEvent.Decorate.EventType type)` — Use this method when there is a specific BlockPos location given for decoration.
- `static boolean decorate(World world, java.util.Random rand, ChunkPos chunkPos, DecorateBiomeEvent.Decorate.EventType type)` — Use this method when generation doesn't have a specific BlockPos location for generation in the chunk.
- `static boolean generateOre(World world, java.util.Random rand, WorldGenerator generator, BlockPos pos, OreGenEvent.GenerateMinable.EventType type)`
- `static MapGenBase getModdedMapGen(MapGenBase original, InitMapGenEvent.EventType type)`
- `static<T extends InitNoiseGensEvent.Context> T getModdedNoiseGenerators(World world, java.util.Random rand, T original)`
- `static boolean populate(IChunkGenerator chunkProvider, World world, java.util.Random rand, int chunkX, int chunkZ, boolean hasVillageGenerated, PopulateChunkEvent.Populate.EventType type)`
- `static boolean saplingGrowTree(World world, java.util.Random rand, BlockPos pos)`
