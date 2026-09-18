# BlockConcretePowder

## Class signature

```java
public class BlockConcretePowder extends BlockFalling
```

## Constructors

- `public BlockConcretePowder()`

## Methods

- `public void onEndFalling( World worldIn, BlockPos pos, IBlockState p_176502_3_, IBlockState p_176502_4_)`
- `protected boolean tryTouchWater( World worldIn, BlockPos pos, IBlockState state)`
- `public void neighborChanged( IBlockState state, World worldIn, BlockPos pos, Block blockIn, BlockPos fromPos)`
- `public void onBlockAdded( World worldIn, BlockPos pos, IBlockState state)`
- `public int damageDropped( IBlockState state)`
- `public void getSubBlocks( CreativeTabs itemIn, NonNullList < ItemStack > items)`
- `public MapColor getMapColor( IBlockState state, IBlockAccess worldIn, BlockPos pos)`
- `public IBlockState getStateFromMeta(int meta)`
- `public int getMetaFromState( IBlockState state)`
- `protected BlockStateContainer createBlockState()`