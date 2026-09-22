# BlockBeetroot

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockBush → net.minecraft.block.BlockCrops → net.minecraft.block.BlockBeetroot

## Class signature

```java
public class BlockBeetroot extends BlockCrops
```

## Constructors

- `BlockBeetroot()`

## Methods

- `protected BlockStateContainer createBlockState()`
- `protected PropertyInteger getAgeProperty()`
- `protected int getBonemealAgeIncrease(World worldIn)`
- `AxisAlignedBB getBoundingBox(IBlockState state, IBlockAccess source, BlockPos pos)`
- `protected Item getCrop()`
- `int getMaxAge()`
- `protected Item getSeed()`
- `void updateTick(World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`

## Fields

- `static PropertyInteger BEETROOT_AGE`