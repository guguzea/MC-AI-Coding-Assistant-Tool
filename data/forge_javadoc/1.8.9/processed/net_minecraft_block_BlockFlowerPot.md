# BlockFlowerPot

## Class signature

```java
public class BlockFlowerPot extends BlockContainer
```

## Constructors

- `public BlockFlowerPot()`

## Methods

- `public java.lang.String getLocalizedName()`
- `public void setBlockBoundsForItemRender()`
- `public boolean isOpaqueCube()`
- `public int getRenderType()`
- `public boolean isFullCube()`
- `public int colorMultiplier( IBlockAccess worldIn, BlockPos pos, int renderPass)`
- `public boolean onBlockActivated( World worldIn, BlockPos pos, IBlockState state, EntityPlayer playerIn, EnumFacing side, float hitX, float hitY, float hitZ)`
- `public Item getItem( World worldIn, BlockPos pos)`
- `public int getDamageValue( World worldIn, BlockPos pos)`
- `public boolean isFlowerPot()`
- `public boolean canPlaceBlockAt( World worldIn, BlockPos pos)`
- `public void onNeighborBlockChange( World worldIn, BlockPos pos, IBlockState state, Block neighborBlock)`
- `public void breakBlock( World worldIn, BlockPos pos, IBlockState state)`
- `public void onBlockHarvested( World worldIn, BlockPos pos, IBlockState state, EntityPlayer player)`
- `public Item getItemDropped( IBlockState state, java.util.Random rand, int fortune)`
- `public TileEntity createNewTileEntity( World worldIn, int meta)`
- `protected BlockState createBlockState()`
- `public int getMetaFromState( IBlockState state)`
- `public IBlockState getActualState( IBlockState state, IBlockAccess worldIn, BlockPos pos)`
- `public EnumWorldBlockLayer getBlockLayer()`
- `public java.util.List< ItemStack > getDrops( IBlockAccess world, BlockPos pos, IBlockState state, int fortune)`
- `public boolean removedByPlayer( World world, BlockPos pos, EntityPlayer player, boolean willHarvest)`
- `public void harvestBlock( World world, EntityPlayer player, BlockPos pos, IBlockState state, TileEntity te)`

## Description

Returns a new instance of a block's tile entity class.