---
title: "WorldEntitySpawner"
description: "public final class WorldEntitySpawner extends java.lang.Object"
package: "net/minecraft/world"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/world/WorldEntitySpawner.html"
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
- `int findChunksForSpawning(WorldServer worldServerIn, boolean spawnHostileMobs, boolean spawnPeacefulMobs, boolean spawnOnSetTickRate)`
- `protected static BlockPos getRandomChunkPosition(World worldIn, int x, int z)`
- `static boolean isValidEmptySpawnBlock(IBlockState state)`
- `static void performWorldGenSpawning(World worldIn, Biome biomeIn, int p_77191_2_, int p_77191_3_, int p_77191_4_, int p_77191_5_, java.util.Random randomIn)`
