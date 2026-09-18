# BlockStainedGlass

## Class signature

```java
public class BlockStainedGlass extends BlockBreakable
```

## Constructors

- `public BlockStainedGlass( Material materialIn)`

## Methods

- `public int damageDropped( IBlockState state)`
- `public void getSubBlocks( Item itemIn, CreativeTabs tab, NonNullList < ItemStack > list)`
- `public MapColor getMapColor( IBlockState state)`
- `public BlockRenderLayer getBlockLayer()`
- `public int quantityDropped(java.util.Random random)`
- `protected boolean canSilkHarvest()`
- `public boolean isFullCube( IBlockState state)`
- `public IBlockState getStateFromMeta(int meta)`
- `public void onBlockAdded( World worldIn, BlockPos pos, IBlockState state)`
- `public void breakBlock( World worldIn, BlockPos pos, IBlockState state)`
- `public int getMetaFromState( IBlockState state)`
- `protected BlockStateContainer createBlockState()`