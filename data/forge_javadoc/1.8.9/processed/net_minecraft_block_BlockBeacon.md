# BlockBeacon

## Class signature

```java
public class BlockBeacon extends BlockContainer
```

## Constructors

- `public BlockBeacon()`

## Methods

- `public TileEntity createNewTileEntity( World worldIn, int meta)`
- `public boolean onBlockActivated( World worldIn, BlockPos pos, IBlockState state, EntityPlayer playerIn, EnumFacing side, float hitX, float hitY, float hitZ)`
- `public boolean isOpaqueCube()`
- `public boolean isFullCube()`
- `public int getRenderType()`
- `public void onBlockPlacedBy( World worldIn, BlockPos pos, IBlockState state, EntityLivingBase placer, ItemStack stack)`
- `public void onNeighborBlockChange( World worldIn, BlockPos pos, IBlockState state, Block neighborBlock)`
- `public EnumWorldBlockLayer getBlockLayer()`
- `public static void updateColorAsync( World worldIn, BlockPos glassPos)`

## Description

Returns a new instance of a block's tile entity class.