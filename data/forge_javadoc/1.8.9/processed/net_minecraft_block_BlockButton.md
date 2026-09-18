# BlockButton

## Class signature

```java
public abstract class BlockButton extends Block
```

## Constructors

- `protected BlockButton(boolean wooden)`

## Methods

- `public AxisAlignedBB getCollisionBoundingBox( World worldIn, BlockPos pos, IBlockState state)`
- `public int tickRate( World worldIn)`
- `public boolean isOpaqueCube()`
- `public boolean isFullCube()`
- `public boolean canPlaceBlockOnSide( World worldIn, BlockPos pos, EnumFacing side)`
- `public boolean canPlaceBlockAt( World worldIn, BlockPos pos)`
- `protected static boolean func_181088_a( World p_181088_0_, BlockPos p_181088_1_, EnumFacing p_181088_2_)`
- `public IBlockState onBlockPlaced( World worldIn, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ, int meta, EntityLivingBase placer)`
- `public void onNeighborBlockChange( World worldIn, BlockPos pos, IBlockState state, Block neighborBlock)`
- `public void setBlockBoundsBasedOnState( IBlockAccess worldIn, BlockPos pos)`
- `public boolean onBlockActivated( World worldIn, BlockPos pos, IBlockState state, EntityPlayer playerIn, EnumFacing side, float hitX, float hitY, float hitZ)`
- `public void breakBlock( World worldIn, BlockPos pos, IBlockState state)`
- `public int getWeakPower( IBlockAccess worldIn, BlockPos pos, IBlockState state, EnumFacing side)`
- `public int getStrongPower( IBlockAccess worldIn, BlockPos pos, IBlockState state, EnumFacing side)`
- `public boolean canProvidePower()`
- `public void randomTick( World worldIn, BlockPos pos, IBlockState state, java.util.Random random)`
- `public void updateTick( World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `public void setBlockBoundsForItemRender()`
- `public void onEntityCollidedWithBlock( World worldIn, BlockPos pos, IBlockState state, Entity entityIn)`
- `public IBlockState getStateFromMeta(int meta)`
- `public int getMetaFromState( IBlockState state)`
- `protected BlockState createBlockState()`

## Description

Check whether this Block can be placed on the given side