# WorldChunkManagerHell

## Class signature

```java
public class WorldChunkManagerHell extends WorldChunkManager
```

## Constructors

- `public WorldChunkManagerHell( BiomeGenBase p_i45374_1_, float p_i45374_2_)`

## Methods

- `public BiomeGenBase getBiomeGenerator( BlockPos pos)`
- `public BiomeGenBase [] getBiomesForGeneration( BiomeGenBase [] biomes, int x, int z, int width, int height)`
- `public float[] getRainfall(float[] listToReuse, int x, int z, int width, int length)`
- `public BiomeGenBase [] loadBlockGeneratorData( BiomeGenBase [] oldBiomeList, int x, int z, int width, int depth)`
- `public BiomeGenBase [] getBiomeGenAt( BiomeGenBase [] listToReuse, int x, int z, int width, int length, boolean cacheFlag)`
- `public BlockPos findBiomePosition(int x, int z, int range, java.util.List< BiomeGenBase > biomes, java.util.Random random)`
- `public boolean areBiomesViable(int p_76940_1_, int p_76940_2_, int p_76940_3_, java.util.List< BiomeGenBase > p_76940_4_)`

## Description

checks given Chunk's Biomes against List of allowed ones