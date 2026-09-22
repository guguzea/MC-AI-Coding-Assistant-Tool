---
title: "WorldEntitySpawner"
description: "public final class WorldEntitySpawner extends java.lang.Object"
package: "net/minecraft/world"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/world/WorldEntitySpawner.html"
sourceType: javadoc
---

# WorldEntitySpawner

**Inheritance:** java.lang.Object → net.minecraft.world.WorldEntitySpawner

## Class signature

```java
public final class WorldEntitySpawner extends java.lang.Object
```

## Constructors

- `WorldEntitySpawner()`

## Methods

- `static boolean canCreatureTypeSpawnAtLocation(EntityLiving.SpawnPlacementType spawnPlacementTypeIn, World worldIn, BlockPos pos)`
- `static boolean canCreatureTypeSpawnBody(EntityLiving.SpawnPlacementType spawnPlacementTypeIn, World worldIn, BlockPos pos)`
- `int findChunksForSpawning(WorldServer worldServerIn, boolean spawnHostileMobs, boolean spawnPeacefulMobs, boolean spawnOnSetTickRate)`
- `static boolean isValidEmptySpawnBlock(IBlockState state)`
- `static void performWorldGenSpawning(World worldIn, Biome biomeIn, int centerX, int centerZ, int diameterX, int diameterZ, java.util.Random randomIn)`
