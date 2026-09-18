# SpawnerAnimals

## Class signature

```java
public final class SpawnerAnimals extends java.lang.Object
```

## Constructors

- `public SpawnerAnimals()`

## Methods

- `public int findChunksForSpawning( WorldServer worldServerIn, boolean spawnHostileMobs, boolean spawnPeacefulMobs, boolean p_77192_4_)`
- `protected static BlockPos getRandomChunkPosition( World worldIn, int x, int z)`
- `public static boolean canCreatureTypeSpawnAtLocation( EntityLiving.SpawnPlacementType spawnPlacementTypeIn, World worldIn, BlockPos pos)`
- `public static void performWorldGenSpawning( World worldIn, BiomeGenBase biomeIn, int p_77191_2_, int p_77191_3_, int p_77191_4_, int p_77191_5_, java.util.Random randomIn)`

## Description

adds all chunks within the spawn radius of the players to eligibleChunksForSpawning. pars: the world, hostileCreatures, passiveCreatures. returns number of eligible chunks.