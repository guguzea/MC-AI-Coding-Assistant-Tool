# BiomeForest

**Inheritance:** java.lang.Object → net.minecraftforge.registries.IForgeRegistryEntry.Impl<Biome> → net.minecraft.world.biome.Biome → net.minecraft.world.biome.BiomeForest

## Class signature

```java
public class BiomeForest extends Biome
```

## Constructors

- `BiomeForest(BiomeForest.Type typeIn, Biome.BiomeProperties properties)`

## Methods

- `void addDoublePlants(World p_185378_1_, java.util.Random p_185378_2_, BlockPos p_185378_3_, int p_185378_4_)`
- `void addMushrooms(World p_185379_1_, java.util.Random p_185379_2_, BlockPos p_185379_3_)`
- `void decorate(World worldIn, java.util.Random rand, BlockPos pos)`
- `java.lang.Class<? extends Biome> getBiomeClass()`
- `int getGrassColorAtPos(BlockPos pos)`
- `WorldGenAbstractTree getRandomTreeFeature(java.util.Random rand)`
- `BlockFlower.EnumFlowerType pickRandomFlower(java.util.Random rand, BlockPos pos)`

## Fields

- `protected static WorldGenBirchTree BIRCH_TREE`
- `protected static WorldGenCanopyTree ROOF_TREE`
- `protected static WorldGenBirchTree SUPER_BIRCH_TREE`