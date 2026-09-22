# BiomeProviderSingle

**Inheritance:** java.lang.Object → net.minecraft.world.biome.BiomeProvider → net.minecraft.world.biome.BiomeProviderSingle

## Class signature

```java
public class BiomeProviderSingle extends BiomeProvider
```

## Methods

- `boolean areBiomesViable(int x, int z, int radius, java.util.List<Biome> allowed)`
- `BlockPos findBiomePosition(int x, int z, int range, java.util.List<Biome> biomes, java.util.Random random)`
- `Biome getBiome(BlockPos pos)`
- `Biome [] getBiomes(Biome [] oldBiomeList, int x, int z, int width, int depth)`
- `Biome [] getBiomes(Biome [] listToReuse, int x, int z, int width, int length, boolean cacheFlag)`
- `Biome [] getBiomesForGeneration(Biome [] biomes, int x, int z, int width, int height)`

## Fields

- `BiomeProviderSingle`