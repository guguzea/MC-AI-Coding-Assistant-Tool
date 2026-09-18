# BlockStainedGlass

## Class signature

```java
public class BlockStainedGlass extends BlockBreakable
```

## Constructors

- `public BlockStainedGlass( Material materialIn)`

## Methods

- `public int damageDropped( IBlockState state)`
- `public void getSubBlocks( Item itemIn, CreativeTabs tab, java.util.List< ItemStack > list)`
- `public MapColor getMapColor( IBlockState state)`
- `public EnumWorldBlockLayer getBlockLayer()`
- `public int quantityDropped(java.util.Random random)`
- `protected boolean canSilkHarvest()`
- `public boolean isFullCube()`
- `public IBlockState getStateFromMeta(int meta)`
- `public void onBlockAdded( World worldIn, BlockPos pos, IBlockState state)`
- `public void breakBlock( World worldIn, BlockPos pos, IBlockState state)`
- `public int getMetaFromState( IBlockState state)`
- `protected BlockState createBlockState()`

## Description

Gets the metadata of the item this Block can drop.