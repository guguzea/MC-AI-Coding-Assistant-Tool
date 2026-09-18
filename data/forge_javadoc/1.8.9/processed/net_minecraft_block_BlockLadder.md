# BlockLadder

## Class signature

```java
public class BlockLadder extends Block
```

## Constructors

- `protected BlockLadder()`

## Methods

- `public AxisAlignedBB getCollisionBoundingBox( World worldIn, BlockPos pos, IBlockState state)`
- `public void setBlockBoundsBasedOnState( IBlockAccess worldIn, BlockPos pos)`
- `public AxisAlignedBB getSelectedBoundingBox( World worldIn, BlockPos pos)`
- `public boolean isOpaqueCube()`
- `public boolean isFullCube()`
- `public boolean canPlaceBlockAt( World worldIn, BlockPos pos)`
- `public IBlockState onBlockPlaced( World worldIn, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ, int meta, EntityLivingBase placer)`
- `public void onNeighborBlockChange( World worldIn, BlockPos pos, IBlockState state, Block neighborBlock)`
- `protected boolean canBlockStay( World worldIn, BlockPos pos, EnumFacing facing)`
- `public IBlockState getStateFromMeta(int meta)`
- `public EnumWorldBlockLayer getBlockLayer()`
- `public int getMetaFromState( IBlockState state)`
- `protected BlockState createBlockState()`
- `public boolean isLadder( IBlockAccess world, BlockPos pos, EntityLivingBase entity)`

## Description

Convert the BlockState into the correct metadata value