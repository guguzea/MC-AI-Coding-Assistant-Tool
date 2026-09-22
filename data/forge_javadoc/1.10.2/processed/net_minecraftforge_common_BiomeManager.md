# BiomeManager

**Inheritance:** java.lang.Object → net.minecraftforge.common.BiomeManager

## Class signature

```java
public class BiomeManager extends java.lang.Object
```

## Constructors

- `BiomeManager()`

## Methods

- `static void addBiome(BiomeManager.BiomeType type, BiomeManager.BiomeEntry entry)`
- `static void addSpawnBiome(Biome biome)`
- `static void addStrongholdBiome(Biome biome)`
- `static void addVillageBiome(Biome biome, boolean canSpawn)`
- `static com.google.common.collect.ImmutableList<BiomeManager.BiomeEntry> getBiomes(BiomeManager.BiomeType type)`
- `static boolean isTypeListModded(BiomeManager.BiomeType type)`
- `static void removeBiome(BiomeManager.BiomeType type, BiomeManager.BiomeEntry entry)`
- `static void removeSpawnBiome(Biome biome)`
- `static void removeStrongholdBiome(Biome biome)`
- `static void removeVillageBiome(Biome biome)`

## Fields

- `static java.util.List<Biome> oceanBiomes`
- `static java.util.ArrayList<Biome> strongHoldBiomes`
- `static java.util.ArrayList<Biome> strongHoldBiomesBlackList`