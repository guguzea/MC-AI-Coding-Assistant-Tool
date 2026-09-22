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
- `static boolean isValidEmptySpawnBlock(IBlockState state)`
- `static void performWorldGenSpawning(World worldIn, Biome biomeIn, int p_77191_2_, int p_77191_3_, int p_77191_4_, int p_77191_5_, java.util.Random randomIn)`