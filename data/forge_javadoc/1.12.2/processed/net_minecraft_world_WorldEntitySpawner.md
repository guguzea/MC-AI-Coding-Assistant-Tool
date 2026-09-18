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