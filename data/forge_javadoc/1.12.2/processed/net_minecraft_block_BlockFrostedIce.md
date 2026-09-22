# BlockFrostedIce

**Inheritance:** java.lang.Object → net.minecraftforge.registries.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockBreakable → net.minecraft.block.BlockIce → net.minecraft.block.BlockFrostedIce

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
- `void neighborChanged(IBlockState state, World worldIn, BlockPos pos, Block blockIn, BlockPos fromPos)`
- `protected void slightlyMelt(World worldIn, BlockPos pos, IBlockState state, java.util.Random rand, boolean meltNeighbors)`
- `void updateTick(World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`

## Fields

- `static PropertyInteger AGE`