# BlockFurnace

## Class signature

```java
public class BlockFurnace extends BlockContainer
```

## Constructors

- `protected BlockFurnace(boolean isBurning)`

## Methods

- `public Item getItemDropped( IBlockState state, java.util.Random rand, int fortune)`
- `public void onBlockAdded( World worldIn, BlockPos pos, IBlockState state)`
- `public void randomDisplayTick( World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `public boolean onBlockActivated( World worldIn, BlockPos pos, IBlockState state, EntityPlayer playerIn, EnumFacing side, float hitX, float hitY, float hitZ)`
- `public static void setState(boolean active, World worldIn, BlockPos pos)`
- `public TileEntity createNewTileEntity( World worldIn, int meta)`
- `public IBlockState onBlockPlaced( World worldIn, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ, int meta, EntityLivingBase placer)`
- `public void onBlockPlacedBy( World worldIn, BlockPos pos, IBlockState state, EntityLivingBase placer, ItemStack stack)`
- `public void breakBlock( World worldIn, BlockPos pos, IBlockState state)`
- `public boolean hasComparatorInputOverride()`
- `public int getComparatorInputOverride( World worldIn, BlockPos pos)`
- `public Item getItem( World worldIn, BlockPos pos)`
- `public int getRenderType()`
- `public IBlockState getStateForEntityRender( IBlockState state)`
- `public IBlockState getStateFromMeta(int meta)`
- `public int getMetaFromState( IBlockState state)`
- `protected BlockState createBlockState()`

## Description

Returns a new instance of a block's tile entity class.