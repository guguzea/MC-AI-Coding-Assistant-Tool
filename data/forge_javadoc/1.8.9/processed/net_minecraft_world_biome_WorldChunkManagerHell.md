# WorldChunkManagerHell

**Inheritance:** java.lang.Object → net.minecraft.world.biome.WorldChunkManager → net.minecraft.world.biome.WorldChunkManagerHell

## Class signature

```java
public class WorldChunkManagerHell extends WorldChunkManager
```

## Methods

- `boolean areBiomesViable(int p_76940_1_, int p_76940_2_, int p_76940_3_, java.util.List<BiomeGenBase> p_76940_4_)` — checks given Chunk's Biomes against List of allowed ones
- `BlockPos findBiomePosition(int x, int z, int range, java.util.List<BiomeGenBase> biomes, java.util.Random random)`
- `BiomeGenBase [] getBiomeGenAt(BiomeGenBase [] listToReuse, int x, int z, int width, int length, boolean cacheFlag)` — Return a list of biomes for the specified blocks.
- `BiomeGenBase getBiomeGenerator(BlockPos pos)` — Returns the biome generator
- `BiomeGenBase [] getBiomesForGeneration(BiomeGenBase [] biomes, int x, int z, int width, int height)` — Returns an array of biomes for the location input.
- `float[] getRainfall(float[] listToReuse, int x, int z, int width, int length)` — Returns a list of rainfall values for the specified blocks.
- `BiomeGenBase [] loadBlockGeneratorData(BiomeGenBase [] oldBiomeList, int x, int z, int width, int depth)` — Returns biomes to use for the blocks and loads the other data like temperature and humidity onto the WorldChunkManager Args: oldBiomeList, x, z, width, depth

## Fields

- `WorldChunkManagerHell`