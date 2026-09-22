# BiomeSwamp

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.IForgeRegistryEntry.Impl<Biome> → net.minecraft.world.biome.Biome → net.minecraft.world.biome.BiomeSwamp

## Class signature

```java
public class BiomeSwamp extends Biome
```

## Constructors

- `BiomeSwamp(Biome.BiomeProperties properties)`

## Methods

- `void addDefaultFlowers()` — Adds the default flowers, as of 1.7, it is 2 yellow, and 1 red.
- `void decorate(World worldIn, java.util.Random rand, BlockPos pos)`
- `WorldGenAbstractTree genBigTreeChance(java.util.Random rand)`
- `void genTerrainBlocks(World worldIn, java.util.Random rand, ChunkPrimer chunkPrimerIn, int x, int z, double noiseVal)`
- `int getFoliageColorAtPos(BlockPos pos)`
- `int getGrassColorAtPos(BlockPos pos)`
- `BlockFlower.EnumFlowerType pickRandomFlower(java.util.Random rand, BlockPos pos)`

## Fields

- `protected static IBlockState WATER_LILY`