# BlockFlowerPot

## Class signature

```java
public class BlockFlowerPot extends BlockContainer
```

## Constructors

- `public BlockFlowerPot()`

## Methods

- `public java.lang.String getLocalizedName()`
- `public AxisAlignedBB getBoundingBox( IBlockState state, IBlockAccess source, BlockPos pos)`
- `public boolean isOpaqueCube( IBlockState state)`
- `public EnumBlockRenderType getRenderType( IBlockState state)`
- `public boolean isFullCube( IBlockState state)`
- `public boolean onBlockActivated( World worldIn, BlockPos pos, IBlockState state, EntityPlayer playerIn, EnumHand hand, EnumFacing facing, float hitX, float hitY, float hitZ)`
- `public ItemStack getItem( World worldIn, BlockPos pos, IBlockState state)`
- `public boolean canPlaceBlockAt( World worldIn, BlockPos pos)`
- `public void neighborChanged( IBlockState state, World worldIn, BlockPos pos, Block blockIn, BlockPos fromPos)`
- `public void breakBlock( World worldIn, BlockPos pos, IBlockState state)`
- `public void onBlockHarvested( World worldIn, BlockPos pos, IBlockState state, EntityPlayer player)`
- `public Item getItemDropped( IBlockState state, java.util.Random rand, int fortune)`
- `public TileEntity createNewTileEntity( World worldIn, int meta)`
- `protected BlockStateContainer createBlockState()`
- `public int getMetaFromState( IBlockState state)`
- `public IBlockState getActualState( IBlockState state, IBlockAccess worldIn, BlockPos pos)`
- `public BlockRenderLayer getBlockLayer()`
- `public java.util.List< ItemStack > getDrops( IBlockAccess world, BlockPos pos, IBlockState state, int fortune)`
- `public boolean removedByPlayer( IBlockState state, World world, BlockPos pos, EntityPlayer player, boolean willHarvest)`
- `public void harvestBlock( World world, EntityPlayer player, BlockPos pos, IBlockState state, @Nullable TileEntity te, ItemStack tool)`

## Description

This returns a complete list of items dropped from this block.