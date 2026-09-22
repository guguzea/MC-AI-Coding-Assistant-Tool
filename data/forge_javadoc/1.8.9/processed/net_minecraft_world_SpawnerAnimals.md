# SpawnerAnimals

**Inheritance:** java.lang.Object → net.minecraft.world.SpawnerAnimals

## Class signature

```java
public final class SpawnerAnimals extends java.lang.Object
```

## Constructors

- `SpawnerAnimals()`

## Methods

- `static boolean canCreatureTypeSpawnAtLocation(EntityLiving.SpawnPlacementType spawnPlacementTypeIn, World worldIn, BlockPos pos)`
- `int findChunksForSpawning(WorldServer worldServerIn, boolean spawnHostileMobs, boolean spawnPeacefulMobs, boolean p_77192_4_)` — adds all chunks within the spawn radius of the players to eligibleChunksForSpawning. pars: the world, hostileCreatures, passiveCreatures. returns number of eligible chunks.
- `protected static BlockPos getRandomChunkPosition(World worldIn, int x, int z)`
- `static void performWorldGenSpawning(World worldIn, BiomeGenBase biomeIn, int p_77191_2_, int p_77191_3_, int p_77191_4_, int p_77191_5_, java.util.Random randomIn)` — Called during chunk generation to spawn initial creatures.