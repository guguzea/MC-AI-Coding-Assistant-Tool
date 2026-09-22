# WorldChunkManager

**Inheritance:** java.lang.Object → net.minecraft.world.biome.WorldChunkManager

## Class signature

```java
public class WorldChunkManager extends java.lang.Object
```

## Constructors

- `WorldChunkManager()`
- `WorldChunkManager(long seed, WorldType p_i45744_3_, java.lang.String p_i45744_4_)`
- `WorldChunkManager(World worldIn)`

## Methods

- `boolean areBiomesViable(int p_76940_1_, int p_76940_2_, int p_76940_3_, java.util.List<BiomeGenBase> p_76940_4_)` — checks given Chunk's Biomes against List of allowed ones
- `void cleanupCache()` — Calls the WorldChunkManager's biomeCache.cleanupCache()
- `BlockPos findBiomePosition(int x, int z, int range, java.util.List<BiomeGenBase> biomes, java.util.Random random)`
- `BiomeGenBase [] getBiomeGenAt(BiomeGenBase [] listToReuse, int x, int z, int width, int length, boolean cacheFlag)` — Return a list of biomes for the specified blocks.
- `BiomeGenBase getBiomeGenerator(BlockPos pos)` — Returns the biome generator
- `BiomeGenBase getBiomeGenerator(BlockPos pos, BiomeGenBase biomeGenBaseIn)`
- `BiomeGenBase [] getBiomesForGeneration(BiomeGenBase [] biomes, int x, int z, int width, int height)` — Returns an array of biomes for the location input.
- `java.util.List<BiomeGenBase> getBiomesToSpawnIn()`
- `GenLayer [] getModdedBiomeGenerators(WorldType worldType, long seed, GenLayer [] original)`
- `float[] getRainfall(float[] listToReuse, int x, int z, int width, int length)` — Returns a list of rainfall values for the specified blocks.
- `float getTemperatureAtHeight(float p_76939_1_, int p_76939_2_)` — Return an adjusted version of a given temperature based on the y height
- `BiomeGenBase [] loadBlockGeneratorData(BiomeGenBase [] oldBiomeList, int x, int z, int width, int depth)` — Returns biomes to use for the blocks and loads the other data like temperature and humidity onto the WorldChunkManager Args: oldBiomeList, x, z, width, depth

## Fields

- `static java.util.List<BiomeGenBase> allowedBiomes`