# WorldEntitySpawner

## Class signature

```java
public final class WorldEntitySpawner extends java.lang.Object
```

## Constructors

- `public WorldEntitySpawner()`

## Methods

- `public int findChunksForSpawning( WorldServer worldServerIn, boolean spawnHostileMobs, boolean spawnPeacefulMobs, boolean spawnOnSetTickRate)`
- `protected static BlockPos getRandomChunkPosition( World worldIn, int x, int z)`
- `public static boolean isValidEmptySpawnBlock( IBlockState state)`
- `public static boolean canCreatureTypeSpawnAtLocation( EntityLiving.SpawnPlacementType spawnPlacementTypeIn, World worldIn, BlockPos pos)`
- `public static void performWorldGenSpawning( World worldIn, Biome biomeIn, int p_77191_2_, int p_77191_3_, int p_77191_4_, int p_77191_5_, java.util.Random randomIn)`