# BlockTrapDoor

## Class signature

```java
public class BlockTrapDoor extends Block
```

## Constructors

- `protected BlockTrapDoor( Material materialIn)`

## Methods

- `public AxisAlignedBB getBoundingBox( IBlockState state, IBlockAccess source, BlockPos pos)`
- `public boolean isOpaqueCube( IBlockState state)`
- `public boolean isFullCube( IBlockState state)`
- `public boolean isPassable( IBlockAccess worldIn, BlockPos pos)`
- `public boolean onBlockActivated( World worldIn, BlockPos pos, IBlockState state, EntityPlayer playerIn, EnumHand hand, @Nullable ItemStack heldItem, EnumFacing side, float hitX, float hitY, float hitZ)`
- `protected void playSound(@Nullable EntityPlayer player, World worldIn, BlockPos pos, boolean p_185731_4_)`
- `public void neighborChanged( IBlockState state, World worldIn, BlockPos pos, Block blockIn)`
- `public IBlockState onBlockPlaced( World worldIn, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ, int meta, EntityLivingBase placer)`
- `public boolean canPlaceBlockOnSide( World worldIn, BlockPos pos, EnumFacing side)`
- `protected static EnumFacing getFacing(int meta)`
- `protected static int getMetaForFacing( EnumFacing facing)`
- `public IBlockState getStateFromMeta(int meta)`
- `public BlockRenderLayer getBlockLayer()`
- `public int getMetaFromState( IBlockState state)`
- `public IBlockState withRotation( IBlockState state, Rotation rot)`
- `public IBlockState withMirror( IBlockState state, Mirror mirrorIn)`
- `protected BlockStateContainer createBlockState()`
- `public boolean isLadder( IBlockState state, IBlockAccess world, BlockPos pos, EntityLivingBase entity)`

## Description

Checks if a player or entity can use this block to 'climb' like a ladder.