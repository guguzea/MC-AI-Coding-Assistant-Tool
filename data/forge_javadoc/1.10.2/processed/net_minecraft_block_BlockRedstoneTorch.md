# BlockRedstoneTorch

## Class signature

```java
public class BlockRedstoneTorch extends BlockTorch
```

## Constructors

- `protected BlockRedstoneTorch(boolean isOn)`

## Methods

- `public int tickRate( World worldIn)`
- `public void onBlockAdded( World worldIn, BlockPos pos, IBlockState state)`
- `public void breakBlock( World worldIn, BlockPos pos, IBlockState state)`
- `public int getWeakPower( IBlockState blockState, IBlockAccess blockAccess, BlockPos pos, EnumFacing side)`
- `public void randomTick( World worldIn, BlockPos pos, IBlockState state, java.util.Random random)`
- `public void updateTick( World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `public void neighborChanged( IBlockState state, World worldIn, BlockPos pos, Block blockIn)`
- `public int getStrongPower( IBlockState blockState, IBlockAccess blockAccess, BlockPos pos, EnumFacing side)`
- `@Nullable public Item getItemDropped( IBlockState state, java.util.Random rand, int fortune)`
- `public boolean canProvidePower( IBlockState state)`
- `public void randomDisplayTick( IBlockState stateIn, World worldIn, BlockPos pos, java.util.Random rand)`
- `public ItemStack getItem( World worldIn, BlockPos pos, IBlockState state)`
- `public boolean isAssociatedBlock( Block other)`