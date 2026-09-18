# BlockCarpet

## Class signature

```java
public class BlockCarpet extends Block
```

## Constructors

- `protected BlockCarpet()`

## Methods

- `public MapColor getMapColor( IBlockState state)`
- `public boolean isOpaqueCube()`
- `public boolean isFullCube()`
- `public void setBlockBoundsForItemRender()`
- `public void setBlockBoundsBasedOnState( IBlockAccess worldIn, BlockPos pos)`
- `protected void setBlockBoundsFromMeta(int meta)`
- `public boolean canPlaceBlockAt( World worldIn, BlockPos pos)`
- `public void onNeighborBlockChange( World worldIn, BlockPos pos, IBlockState state, Block neighborBlock)`
- `public boolean shouldSideBeRendered( IBlockAccess worldIn, BlockPos pos, EnumFacing side)`
- `public int damageDropped( IBlockState state)`
- `public void getSubBlocks( Item itemIn, CreativeTabs tab, java.util.List< ItemStack > list)`
- `public IBlockState getStateFromMeta(int meta)`
- `public int getMetaFromState( IBlockState state)`
- `protected BlockState createBlockState()`

## Description

Gets the metadata of the item this Block can drop.