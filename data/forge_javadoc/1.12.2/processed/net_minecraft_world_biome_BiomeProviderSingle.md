# BiomeProviderSingle

## Class signature

```java
public class BiomeProviderSingle extends BiomeProvider
```

## Constructors

- `public BiomeProviderSingle( Biome biomeIn)`

## Methods

- `public Biome getBiome( BlockPos pos)`
- `public Biome [] getBiomesForGeneration( Biome [] biomes, int x, int z, int width, int height)`
- `public Biome [] getBiomes( Biome [] oldBiomeList, int x, int z, int width, int depth)`
- `public Biome [] getBiomes( Biome [] listToReuse, int x, int z, int width, int length, boolean cacheFlag)`
- `public BlockPos findBiomePosition(int x, int z, int range, java.util.List< Biome > biomes, java.util.Random random)`
- `public boolean areBiomesViable(int x, int z, int radius, java.util.List< Biome > allowed)`
- `public boolean isFixedBiome()`
- `public Biome getFixedBiome()`