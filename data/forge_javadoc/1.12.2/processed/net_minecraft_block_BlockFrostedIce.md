# BlockFrostedIce

## Class signature

```java
public class BlockFrostedIce extends BlockIce
```

## Constructors

- `public BlockFrostedIce()`

## Methods

- `public int getMetaFromState( IBlockState state)`
- `public IBlockState getStateFromMeta(int meta)`
- `public void updateTick( World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `public void neighborChanged( IBlockState state, World worldIn, BlockPos pos, Block blockIn, BlockPos fromPos)`
- `protected void slightlyMelt( World worldIn, BlockPos pos, IBlockState state, java.util.Random rand, boolean meltNeighbors)`
- `protected BlockStateContainer createBlockState()`
- `public ItemStack getItem( World worldIn, BlockPos pos, IBlockState state)`