# BiomeProvider

## Class signature

```java
public class BiomeProvider extends java.lang.Object
```

## Constructors

- `protected BiomeProvider()`
- `public BiomeProvider( WorldInfo info)`

## Methods

- `public java.util.List< Biome > getBiomesToSpawnIn()`
- `public Biome getBiomeGenerator( BlockPos pos)`
- `public Biome getBiomeGenerator( BlockPos pos, Biome biomeGenBaseIn)`
- `public float getTemperatureAtHeight(float p_76939_1_, int p_76939_2_)`
- `public Biome [] getBiomesForGeneration( Biome [] biomes, int x, int z, int width, int height)`
- `public Biome [] loadBlockGeneratorData(@Nullable Biome [] oldBiomeList, int x, int z, int width, int depth)`
- `public Biome [] getBiomeGenAt(@Nullable Biome [] listToReuse, int x, int z, int width, int length, boolean cacheFlag)`
- `public boolean areBiomesViable(int x, int z, int radius, java.util.List< Biome > allowed)`
- `@Nullable public BlockPos findBiomePosition(int x, int z, int range, java.util.List< Biome > biomes, java.util.Random random)`
- `public void cleanupCache()`
- `public GenLayer [] getModdedBiomeerators( WorldType worldType, long seed, GenLayer [] original)`