# BiomeGenMutated

**Inheritance:** java.lang.Object → net.minecraft.world.biome.BiomeGenBase → net.minecraft.world.biome.BiomeGenMutated

## Class signature

```java
public class BiomeGenMutated extends BiomeGenBase
```

## Constructors

- `BiomeGenMutated(int id, BiomeGenBase biome)`

## Methods

- `void decorate(World worldIn, java.util.Random rand, BlockPos pos)`
- `WorldGenAbstractTree genBigTreeChance(java.util.Random rand)`
- `void genTerrainBlocks(World worldIn, java.util.Random rand, ChunkPrimer chunkPrimerIn, int p_180622_4_, int p_180622_5_, double p_180622_6_)`
- `java.lang.Class<? extends BiomeGenBase> getBiomeClass()`
- `int getFoliageColorAtPos(BlockPos pos)`
- `int getGrassColorAtPos(BlockPos pos)`
- `float getSpawningChance()` — returns the chance a creature has to spawn.
- `BiomeGenBase.TempCategory getTempCategory()`
- `boolean isEqualTo(BiomeGenBase biome)` — returns true if the biome specified is equal to this biome

## Fields

- `protected BiomeGenBase baseBiome`