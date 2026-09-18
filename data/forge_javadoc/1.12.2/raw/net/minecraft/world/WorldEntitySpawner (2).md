---
title: "WorldEntitySpawner"
description: "public final class WorldEntitySpawner extends java.lang.Object"
package: "net/minecraft/world"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/world/WorldEntitySpawner.html"
sourceType: javadoc
---

# WorldEntitySpawner

## Class signature

```java
public final class WorldEntitySpawner extends java.lang.Object
```

## Constructors

- `public WorldEntitySpawner()`

## Methods

- `public int findChunksForSpawning( WorldServer worldServerIn, boolean spawnHostileMobs, boolean spawnPeacefulMobs, boolean spawnOnSetTickRate)`
- `public static boolean isValidEmptySpawnBlock( IBlockState state)`
- `public static boolean canCreatureTypeSpawnAtLocation( EntityLiving.SpawnPlacementType spawnPlacementTypeIn, World worldIn, BlockPos pos)`
- `public static boolean canCreatureTypeSpawnBody( EntityLiving.SpawnPlacementType spawnPlacementTypeIn, World worldIn, BlockPos pos)`
- `public static void performWorldGenSpawning( World worldIn, Biome biomeIn, int centerX, int centerZ, int diameterX, int diameterZ, java.util.Random randomIn)`
