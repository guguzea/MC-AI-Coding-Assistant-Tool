# BlockFrostedIce

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockBreakable → net.minecraft.block.BlockIce → net.minecraft.block.BlockFrostedIce

## Class signature

```java
public class BlockFrostedIce extends BlockIce
```

## Constructors

- `BlockFrostedIce()`

## Methods

- `protected BlockStateContainer createBlockState()`
- `ItemStack getItem(World worldIn, BlockPos pos, IBlockState state)`
- `int getMetaFromState(IBlockState state)`
- `IBlockState getStateFromMeta(int meta)`
- `void neighborChanged(IBlockState state, World worldIn, BlockPos pos, Block blockIn)`
- `protected void slightlyMelt(World p_185681_1_, BlockPos p_185681_2_, IBlockState p_185681_3_, java.util.Random p_185681_4_, boolean p_185681_5_)`
- `void updateTick(World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`

## Fields

- `static PropertyInteger AGE`