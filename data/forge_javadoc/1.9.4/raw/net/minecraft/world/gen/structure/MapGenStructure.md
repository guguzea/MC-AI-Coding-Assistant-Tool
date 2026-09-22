---
title: "MapGenStructure"
description: "public abstract class MapGenStructure extends MapGenBase"
package: "net/minecraft/world/gen/structure"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/world/gen/structure/MapGenStructure.html"
sourceType: javadoc
---

# MapGenStructure

**Inheritance:** java.lang.Object → net.minecraft.world.gen.MapGenBase → net.minecraft.world.gen.structure.MapGenStructure

## Class signature

```java
public abstract class MapGenStructure extends MapGenBase
```

## Constructors

- `MapGenStructure()`

## Methods

- `protected abstract boolean canSpawnStructureAtCoords(int chunkX, int chunkZ)`
- `boolean generateStructure(World worldIn, java.util.Random randomIn, ChunkPos chunkCoord)`
- `BlockPos getClosestStrongholdPos(World worldIn, BlockPos pos)`
- `protected java.util.List<BlockPos> getCoordList()`
- `protected StructureStart getStructureAt(BlockPos pos)`
- `abstract java.lang.String getStructureName()`
- `protected abstract StructureStart getStructureStart(int chunkX, int chunkZ)`
- `protected void initializeStructureData(World worldIn)`
- `boolean isInsideStructure(BlockPos pos)`
- `boolean isPositionInStructure(World worldIn, BlockPos pos)`
- `protected void recursiveGenerate(World worldIn, int chunkX, int chunkZ, int p_180701_4_, int p_180701_5_, ChunkPrimer chunkPrimerIn)`

## Fields

- `protected it.unimi.dsi.fastutil.longs.Long2ObjectMap<StructureStart> structureMap`
