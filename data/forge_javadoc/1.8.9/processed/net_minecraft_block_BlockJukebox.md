# BlockJukebox

## Class signature

```java
public class BlockJukebox extends BlockContainer
```

## Constructors

- `protected BlockJukebox()`

## Methods

- `public boolean onBlockActivated( World worldIn, BlockPos pos, IBlockState state, EntityPlayer playerIn, EnumFacing side, float hitX, float hitY, float hitZ)`
- `public void insertRecord( World worldIn, BlockPos pos, IBlockState state, ItemStack recordStack)`
- `public void breakBlock( World worldIn, BlockPos pos, IBlockState state)`
- `public void dropBlockAsItemWithChance( World worldIn, BlockPos pos, IBlockState state, float chance, int fortune)`
- `public TileEntity createNewTileEntity( World worldIn, int meta)`
- `public boolean hasComparatorInputOverride()`
- `public int getComparatorInputOverride( World worldIn, BlockPos pos)`
- `public int getRenderType()`
- `public IBlockState getStateFromMeta(int meta)`
- `public int getMetaFromState( IBlockState state)`
- `protected BlockState createBlockState()`

## Description

Returns a new instance of a block's tile entity class.