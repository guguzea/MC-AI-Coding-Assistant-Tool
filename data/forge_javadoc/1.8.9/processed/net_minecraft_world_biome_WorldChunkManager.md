# WorldChunkManager

## Class signature

```java
public class WorldChunkManager extends java.lang.Object
```

## Constructors

- `protected WorldChunkManager()`
- `public WorldChunkManager(long seed, WorldType p_i45744_3_, java.lang.String p_i45744_4_)`
- `public WorldChunkManager( World worldIn)`

## Methods

- `public java.util.List< BiomeGenBase > getBiomesToSpawnIn()`
- `public BiomeGenBase getBiomeGenerator( BlockPos pos)`
- `public BiomeGenBase getBiomeGenerator( BlockPos pos, BiomeGenBase biomeGenBaseIn)`
- `public float[] getRainfall(float[] listToReuse, int x, int z, int width, int length)`
- `public float getTemperatureAtHeight(float p_76939_1_, int p_76939_2_)`
- `public BiomeGenBase [] getBiomesForGeneration( BiomeGenBase [] biomes, int x, int z, int width, int height)`
- `public BiomeGenBase [] loadBlockGeneratorData( BiomeGenBase [] oldBiomeList, int x, int z, int width, int depth)`
- `public BiomeGenBase [] getBiomeGenAt( BiomeGenBase [] listToReuse, int x, int z, int width, int length, boolean cacheFlag)`
- `public boolean areBiomesViable(int p_76940_1_, int p_76940_2_, int p_76940_3_, java.util.List< BiomeGenBase > p_76940_4_)`
- `public BlockPos findBiomePosition(int x, int z, int range, java.util.List< BiomeGenBase > biomes, java.util.Random random)`
- `public void cleanupCache()`
- `public GenLayer [] getModdedBiomeGenerators( WorldType worldType, long seed, GenLayer [] original)`

## Description

checks given Chunk's Biomes against List of allowed ones