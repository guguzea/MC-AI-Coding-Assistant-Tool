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
- `static void addSpawnBiome(BiomeGenBase biome)`
- `static void addStrongholdBiome(BiomeGenBase biome)`
- `static void addVillageBiome(BiomeGenBase biome, boolean canSpawn)`
- `static<any> getBiomes(BiomeManager.BiomeType type)`
- `static boolean isTypeListModded(BiomeManager.BiomeType type)`
- `static void removeBiome(BiomeManager.BiomeType type, BiomeManager.BiomeEntry entry)`
- `static void removeSpawnBiome(BiomeGenBase biome)`
- `static void removeStrongholdBiome(BiomeGenBase biome)`
- `static void removeVillageBiome(BiomeGenBase biome)`

## Fields

- `static java.util.List<BiomeGenBase> oceanBiomes`
- `static java.util.ArrayList<BiomeGenBase> strongHoldBiomes`
- `static java.util.ArrayList<BiomeGenBase> strongHoldBiomesBlackList`