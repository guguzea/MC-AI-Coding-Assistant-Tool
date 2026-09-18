# BiomeSwamp

## Class signature

```java
public class BiomeSwamp extends Biome
```

## Constructors

- `protected BiomeSwamp( Biome.BiomeProperties properties)`

## Methods

- `public WorldGenAbstractTree getRandomTreeFeature(java.util.Random rand)`
- `public BlockFlower.EnumFlowerType pickRandomFlower(java.util.Random rand, BlockPos pos)`
- `public void genTerrainBlocks( World worldIn, java.util.Random rand, ChunkPrimer chunkPrimerIn, int x, int z, double noiseVal)`
- `public void decorate( World worldIn, java.util.Random rand, BlockPos pos)`
- `public int getGrassColorAtPos( BlockPos pos)`
- `public int getFoliageColorAtPos( BlockPos pos)`
- `public void addDefaultFlowers()`

## Description

Adds the default flowers, as of 1.7, it is 2 yellow, and 1 red.