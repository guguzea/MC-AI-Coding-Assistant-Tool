# BlockSkull

## Class signature

```java
public class BlockSkull extends BlockContainer
```

## Constructors

- `protected BlockSkull()`

## Methods

- `public java.lang.String getLocalizedName()`
- `public boolean isOpaqueCube( IBlockState state)`
- `public boolean isFullCube( IBlockState state)`
- `public boolean hasCustomBreakingProgress( IBlockState state)`
- `public AxisAlignedBB getBoundingBox( IBlockState state, IBlockAccess source, BlockPos pos)`
- `public IBlockState getStateForPlacement( World worldIn, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ, int meta, EntityLivingBase placer)`
- `public TileEntity createNewTileEntity( World worldIn, int meta)`
- `public ItemStack getItem( World worldIn, BlockPos pos, IBlockState state)`
- `public void onBlockHarvested( World worldIn, BlockPos pos, IBlockState state, EntityPlayer player)`
- `public void breakBlock( World worldIn, BlockPos pos, IBlockState state)`
- `public void getDrops( NonNullList < ItemStack > drops, IBlockAccess worldIn, BlockPos pos, IBlockState state, int fortune)`
- `public Item getItemDropped( IBlockState state, java.util.Random rand, int fortune)`
- `public boolean canDispenserPlace( World worldIn, BlockPos pos, ItemStack stack)`
- `public void checkWitherSpawn( World worldIn, BlockPos pos, TileEntitySkull te)`
- `public IBlockState getStateFromMeta(int meta)`
- `public int getMetaFromState( IBlockState state)`
- `public IBlockState withRotation( IBlockState state, Rotation rot)`
- `public IBlockState withMirror( IBlockState state, Mirror mirrorIn)`
- `protected BlockStateContainer createBlockState()`
- `protected BlockPattern getWitherBasePattern()`
- `protected BlockPattern getWitherPattern()`
- `public BlockFaceShape getBlockFaceShape( IBlockAccess worldIn, IBlockState state, BlockPos pos, EnumFacing face)`

## Description

This gets a complete list of items dropped from this block.